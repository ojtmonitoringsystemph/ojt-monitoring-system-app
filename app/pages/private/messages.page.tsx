import React, { useEffect, useState } from "react";
import PageLayout from "@/components/templates/layout/page.layout";
import { messageService } from "@/services/message.service";
import { userService } from "@/services/user.service";
import { io } from "socket.io-client";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";
import { Search, Send, Trash2 } from "lucide-react";

const socket = io(import.meta.env.VITE_API_BASE_URL, { withCredentials: true });

// Updated interfaces to match your data structure
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  role: string;
  metadata?: {
    company?: string;
    coordinator?: string;
    deploymentDate?: string;
    status: string;
  };
}

interface Message {
  _id: string;
  sender: User;
  receiver: User | null;
  content: string;
  isRead: boolean;
  sentAt: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const Messages = ({ userRole, userName, onLogout }: any) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [receiverQuery, setReceiverQuery] = useState("");
  const [receiverResults, setReceiverResults] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(false);

  const currentUser = getUserFromLocalStorage().user;

  /** Fetch all messages (inbox + sent) */
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await messageService.search();
      setMessages(res ?? []);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  };

  /** Search receiver by name */
  const handleReceiverSearch = async () => {
    if (!receiverQuery.trim()) {
      setReceiverResults([]);
      return;
    }
    try {
      const res = await userService.search({ firstName: receiverQuery });
      const filteredUsers = (res ?? [])
        .filter((u: User) => u._id !== currentUser._id) // Exclude current user
        .map((u: User) => ({
          _id: u._id,
          name: `${u.firstName} ${u.lastName}`,
          email: u.email,
          role: u.role,
        }));
      setReceiverResults(filteredUsers);
    } catch (err) {
      console.error("User search failed:", err);
    }
  };

  /** Send message */
  const handleSend = async () => {
    if (!selectedUser || !newMessage.trim()) return;
    try {
      const newMsg = await messageService.create({
        receiver: selectedUser._id,
        content: newMessage,
        sentAt: new Date().toISOString(),
      });
      setChatMessages((prev) => [...prev, newMsg]);
      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");
      socket.emit("sendMessage", newMsg);
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  /** Delete message */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      await messageService.delete(id);
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
      setChatMessages((prev) => prev.filter((msg) => msg._id !== id));
      socket.emit("deleteMessage", id);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  /** Build conversation list by user */
  const conversationList = React.useMemo(() => {
    const convoMap = new Map<string, Message>();

    messages.forEach((msg) => {
      // Determine the conversation partner
      const partner =
        msg.sender._id === currentUser._id ? msg.receiver : msg.sender;

      if (partner) {
        // Use the most recent message for each conversation
        const existingMsg = convoMap.get(partner._id);
        if (
          !existingMsg ||
          new Date(msg.sentAt) > new Date(existingMsg.sentAt)
        ) {
          convoMap.set(partner._id, msg);
        }
      }
    });

    return Array.from(convoMap.values()).sort(
      (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
    );
  }, [messages, currentUser._id]);

  /** Filter messages for selected user */
  useEffect(() => {
    if (!selectedUser) {
      setChatMessages([]);
      return;
    }

    const chat = messages.filter(
      (m) =>
        (m.sender._id === selectedUser._id &&
          m.receiver?._id === currentUser._id) ||
        (m.sender._id === currentUser._id &&
          m.receiver?._id === selectedUser._id)
    );

    setChatMessages(
      chat.sort(
        (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
      )
    );
  }, [selectedUser, messages, currentUser._id]);

  /** Socket listeners */
  useEffect(() => {
    fetchMessages();

    socket.on("newMessage", (msg: Message) => {
      if (
        msg.sender._id === currentUser._id ||
        msg.receiver?._id === currentUser._id
      ) {
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }
    });

    socket.on("messageDeleted", (id: string) => {
      setMessages((prev) => prev.filter((m) => m._id !== id));
      setChatMessages((prev) => prev.filter((m) => m._id !== id));
    });

    return () => {
      socket.off("newMessage");
      socket.off("messageDeleted");
    };
  }, [currentUser._id]);

  // Auto-search when query changes (with debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (receiverQuery.trim()) {
        handleReceiverSearch();
      } else {
        setReceiverResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [receiverQuery]);

  return (
    <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
      <div className="p-4 flex flex-col h-[85vh]">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Messages</h2>

        <div className="flex flex-1 flex-col md:flex-row border rounded-lg overflow-hidden bg-white shadow">
          {/* Sidebar */}
          <div className="md:w-1/3 w-full border-b md:border-b-0 md:border-r p-3 flex flex-col">
            {/* Search */}
            <div className="flex space-x-2 mb-2">
              <Input
                placeholder="Search user..."
                value={receiverQuery}
                onChange={(e) => setReceiverQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleReceiverSearch()}
                className="border-green-300 focus:ring-green-500 focus:border-green-500"
              />
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleReceiverSearch}
              >
                <Search size={16} />
              </Button>
            </div>

            {/* Search Results */}
            {receiverResults.length > 0 && (
              <div className="mb-2">
                <p className="text-sm font-medium text-green-700 mb-1">
                  Search Results:
                </p>
                <ul className="border-green-300 rounded-md max-h-40 overflow-y-auto">
                  {receiverResults.map((user) => (
                    <li
                      key={user._id}
                      onClick={() => {
                        setSelectedUser(user);
                        setReceiverResults([]);
                        setReceiverQuery("");
                      }}
                      className="p-2 hover:bg-green-50 cursor-pointer border-b last:border-b-0"
                    >
                      <span className="font-medium block">{user.name}</span>
                      <span className="text-xs text-green-500 capitalize">
                        {user.role}
                      </span>
                      <p className="text-xs text-green-500 truncate">
                        {user.email}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              <p className="text-sm font-medium text-green-700 mb-2">
                Conversations
              </p>
              {loading ? (
                <p className="text-center text-green-500 mt-4">Loading...</p>
              ) : conversationList.length === 0 ? (
                <p className="text-center text-green-500 mt-4">
                  No messages yet
                </p>
              ) : (
                conversationList
                  .filter(
                    (msg) =>
                      msg.sender._id === currentUser._id ||
                      (msg.receiver && msg.receiver._id === currentUser._id)
                  )
                  .map((msg) => {
                    const partner =
                      msg.sender._id === currentUser._id
                        ? msg.receiver
                        : msg.sender;
                    if (!partner) return null;

                    return (
                      <div
                        key={msg._id}
                        onClick={() =>
                          setSelectedUser({
                            _id: partner._id,
                            name: `${partner.firstName} ${partner.lastName}`,
                            email: partner.email,
                            role: partner.role,
                          })
                        }
                        className={`p-3 border-b cursor-pointer hover:bg-green-50 ${
                          selectedUser?._id === partner._id
                            ? "bg-green-50 border-green-200"
                            : ""
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <p className="font-medium text-green-800">
                            {partner.firstName} {partner.lastName}
                          </p>
                          <span className="text-xs text-green-500 capitalize">
                            {partner.role}
                          </span>
                        </div>
                        <p className="text-sm text-green-600 truncate">
                          {msg.content}
                        </p>
                        <p className="text-xs text-green-400 mt-1">
                          {new Date(msg.sentAt).toLocaleDateString()}
                        </p>
                      </div>
                    );
                  })
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {!selectedUser ? (
              <div className="flex-1 flex items-center justify-center text-green-500 p-4 text-center">
                Select a conversation or search a user to start chatting.
              </div>
            ) : (
              <>
                <div className="border-b p-3 bg-green-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-green-800">
                        Chat with {selectedUser.name}
                      </h3>
                      <p className="text-sm text-green-600 capitalize">
                        {selectedUser.role}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-600 text-green-600 hover:bg-green-50"
                      onClick={() => setSelectedUser(null)}
                    >
                      Close
                    </Button>
                  </div>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-green-50">
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-green-500 mt-8">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    chatMessages.map((msg) => (
                      <div
                        key={msg._id}
                        className={`flex ${
                          msg.sender._id === currentUser._id
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div className="flex items-end max-w-xs">
                          {msg.sender._id === currentUser._id && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="ml-2 mb-1 text-green-600"
                              onClick={() => handleDelete(msg._id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          )}
                          <div
                            className={`p-3 rounded-lg ${
                              msg.sender._id === currentUser._id
                                ? "bg-green-600 text-white rounded-br-none"
                                : "bg-white text-green-800 rounded-bl-none border border-green-300"
                            }`}
                          >
                            <p>{msg.content}</p>
                            <p className="text-xs mt-1 opacity-70">
                              {new Date(msg.sentAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          {msg.sender._id !== currentUser._id && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="mr-2 mb-1 text-green-600"
                              onClick={() => handleDelete(msg._id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t p-3 bg-white">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      className="border-green-300 focus:ring-green-500 focus:border-green-500"
                    />
                    <Button
                      onClick={handleSend}
                      disabled={!newMessage.trim()}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Send size={18} />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Messages;

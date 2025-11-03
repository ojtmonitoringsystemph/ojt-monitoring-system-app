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

// Updated interfaces
interface Message {
  _id: string;
  sender: { _id: string; firstName: string; lastName: string; email: string };
  receiver: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  content: string;
  isRead: boolean;
  sentAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

const Messages = ({ userRole, userName, onLogout }: any) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [receiverQuery, setReceiverQuery] = useState("");
  const [receiverResults, setReceiverResults] = useState<User[]>([]);

  const currentUser = getUserFromLocalStorage().user;

  /** Fetch all messages (inbox + sent) */
  const fetchMessages = async () => {
    try {
      const res = await messageService.search();
      setMessages(res ?? []);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
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
      setReceiverResults(
        (res ?? []).map((u: any) => ({
          _id: u._id,
          name: `${u.firstName} ${u.lastName}`,
          email: u.email,
        }))
      );
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
    try {
      await messageService.delete(id);
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
      setChatMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  /** Build conversation list by user */
  const conversationList = React.useMemo(() => {
    const convoMap = new Map<string, Message>();
    messages.forEach((msg) => {
      const partner =
        msg.sender._id === currentUser._id ? msg.receiver : msg.sender;
      if (partner && !convoMap.has(partner._id)) convoMap.set(partner._id, msg);
    });
    return Array.from(convoMap.values());
  }, [messages]);

  /** Filter messages for selected user */
  useEffect(() => {
    if (!selectedUser) return;
    const chat = messages.filter(
      (m) =>
        (m.sender._id === selectedUser._id &&
          m.receiver?._id === currentUser._id) ||
        (m.sender._id === currentUser._id &&
          m.receiver?._id === selectedUser._id)
    );
    setChatMessages(
      chat.sort((a, b) => +new Date(a.sentAt) - +new Date(b.sentAt))
    );
  }, [selectedUser, messages]);

  /** Socket listeners */
  useEffect(() => {
    fetchMessages();
    socket.on("newMessage", (msg: Message) => {
      if (
        msg.sender._id === currentUser._id ||
        msg.receiver?._id === currentUser._id
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    socket.on("messageDeleted", (id: string) =>
      setMessages((prev) => prev.filter((m) => m._id !== id))
    );
    return () => {
      socket.off("newMessage");
      socket.off("messageDeleted");
    };
  }, []);

  return (
    <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
      <div className="p-6 flex flex-col h-[85vh]">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Messages</h2>
        <div className="flex flex-1 border rounded-lg overflow-hidden bg-white shadow">
          {/* Sidebar */}
          <div className="w-1/3 border-r p-3 flex flex-col">
            {/* Search */}
            <div className="flex space-x-2 mb-2">
              <Input
                placeholder="Search user..."
                value={receiverQuery}
                onChange={(e) => setReceiverQuery(e.target.value)}
              />
              <Button onClick={handleReceiverSearch}>
                <Search size={16} />
              </Button>
            </div>

            {receiverResults.length > 0 && (
              <ul className="border rounded-md mb-2 max-h-40 overflow-y-auto">
                {receiverResults.map((user) => (
                  <li
                    key={user._id}
                    onClick={() => {
                      setSelectedUser(user);
                      setReceiverResults([]);
                      setReceiverQuery("");
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <span className="font-medium">{user.name}</span>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </li>
                ))}
              </ul>
            )}

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {conversationList.length === 0 ? (
                <p className="text-center text-gray-500 mt-4">No messages</p>
              ) : (
                conversationList.map((msg) => {
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
                        })
                      }
                      className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                        selectedUser?._id === partner._id ? "bg-blue-50" : ""
                      }`}
                    >
                      <p className="font-medium text-gray-800">
                        {partner.firstName} {partner.lastName}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {msg.content}
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
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a conversation or search a user to start chatting.
              </div>
            ) : (
              <>
                <div className="border-b p-3 font-semibold text-gray-700">
                  Chat with {selectedUser.name}
                </div>
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`flex ${
                        msg.sender._id === currentUser._id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs p-2 rounded-lg ${
                          msg.sender._id === currentUser._id
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(msg.sentAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="ml-2"
                        onClick={() => handleDelete(msg._id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="border-t p-3 flex space-x-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  />
                  <Button onClick={handleSend}>
                    <Send size={18} />
                  </Button>
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

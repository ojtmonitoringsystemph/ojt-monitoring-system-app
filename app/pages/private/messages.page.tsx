import React, { useState } from "react";
import PageLayout from "@/components/templates/layout/page.layout";
import { type PageProps } from "@/types/page.type";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { Avatar, AvatarFallback } from "@/components/atoms/avatar";
import { Badge } from "@/components/atoms/badge";
import { Separator } from "@/components/atoms/separator";
import { ScrollArea } from "@/components/atoms/scroll-area";
import { Search, Send, MoreVertical, MessageSquare } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "admin" | "coordinator" | "student";
  content: string;
  timestamp: Date;
  read: boolean;
}

interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    name: string;
    role: "admin" | "coordinator" | "student";
  }>;
  lastMessage: Message;
  unreadCount: number;
}

const Messages: React.FC<PageProps> = ({ userRole, userName, onLogout }) => {
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for conversations
  const [conversations] = useState<Conversation[]>([
    {
      id: "1",
      participants: [
        { id: "1", name: "Dr. Sarah Johnson", role: "admin" },
        { id: "2", name: "Maria Garcia", role: "coordinator" },
      ],
      lastMessage: {
        id: "m1",
        senderId: "2",
        senderName: "Maria Garcia",
        senderRole: "coordinator",
        content:
          "I need to discuss the new student placements for next semester.",
        timestamp: new Date(2024, 0, 15, 14, 30),
        read: false,
      },
      unreadCount: 2,
    },
    {
      id: "2",
      participants: [
        { id: "1", name: "Dr. Sarah Johnson", role: "admin" },
        { id: "3", name: "John Smith", role: "student" },
      ],
      lastMessage: {
        id: "m2",
        senderId: "3",
        senderName: "John Smith",
        senderRole: "student",
        content: "Thank you for approving my internship documents!",
        timestamp: new Date(2024, 0, 15, 12, 15),
        read: true,
      },
      unreadCount: 0,
    },
    {
      id: "3",
      participants: [
        { id: "2", name: "Maria Garcia", role: "coordinator" },
        { id: "4", name: "Emma Wilson", role: "student" },
      ],
      lastMessage: {
        id: "m3",
        senderId: "2",
        senderName: "Maria Garcia",
        senderRole: "coordinator",
        content: "Please submit your weekly diary by Friday.",
        timestamp: new Date(2024, 0, 14, 16, 45),
        read: true,
      },
      unreadCount: 0,
    },
  ]);

  // Mock messages for selected conversation
  const [messages] = useState<Record<string, Message[]>>({
    "1": [
      {
        id: "m1-1",
        senderId: "2",
        senderName: "Maria Garcia",
        senderRole: "coordinator",
        content:
          "Good morning Dr. Johnson. I wanted to discuss the new student placements.",
        timestamp: new Date(2024, 0, 15, 14, 20),
        read: true,
      },
      {
        id: "m1-2",
        senderId: "1",
        senderName: "Dr. Sarah Johnson",
        senderRole: "admin",
        content:
          "Good morning Maria. Yes, I have the list ready. How many students are we expecting?",
        timestamp: new Date(2024, 0, 15, 14, 25),
        read: true,
      },
      {
        id: "m1-3",
        senderId: "2",
        senderName: "Maria Garcia",
        senderRole: "coordinator",
        content:
          "We have 15 students this semester. I need to discuss the company assignments.",
        timestamp: new Date(2024, 0, 15, 14, 30),
        read: false,
      },
    ],
    "2": [
      {
        id: "m2-1",
        senderId: "3",
        senderName: "John Smith",
        senderRole: "student",
        content:
          "Hello Dr. Johnson, I submitted my internship documents yesterday.",
        timestamp: new Date(2024, 0, 15, 12, 10),
        read: true,
      },
      {
        id: "m2-2",
        senderId: "1",
        senderName: "Dr. Sarah Johnson",
        senderRole: "admin",
        content:
          "Thank you John. I have reviewed and approved them. Good luck with your internship!",
        timestamp: new Date(2024, 0, 15, 12, 12),
        read: true,
      },
      {
        id: "m2-3",
        senderId: "3",
        senderName: "John Smith",
        senderRole: "student",
        content: "Thank you for approving my internship documents!",
        timestamp: new Date(2024, 0, 15, 12, 15),
        read: true,
      },
    ],
  });

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      // In a real app, this would send the message to a backend
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "coordinator":
        return "bg-blue-100 text-blue-800";
      case "student":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.participants.some((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const selectedConv = conversations.find((c) => c.id === selectedConversation);
  const conversationMessages = selectedConversation
    ? messages[selectedConversation] || []
    : [];

  return (
    <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
      <div className="p-6 h-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground">
            Communicate with students, coordinators, and administrators
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 focus-visible:ring-0 px-0"
                />
              </div>
            </CardHeader>
            <Separator />
            <ScrollArea className="h-[500px]">
              <div className="space-y-2 p-4">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation === conversation.id
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-accent"
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {getInitials(conversation.participants[0].name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">
                            {conversation.participants
                              .filter((p) => p.id !== "1") // Exclude current user
                              .map((p) => p.name)
                              .join(", ") || conversation.participants[0].name}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="default" className="text-xs">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge
                            variant="outline"
                            className={`text-xs ${getRoleColor(
                              conversation.lastMessage.senderRole
                            )}`}
                          >
                            {conversation.lastMessage.senderRole}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(conversation.lastMessage.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {conversation.lastMessage.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Message Area */}
          <Card className="lg:col-span-2">
            {selectedConv ? (
              <>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {getInitials(selectedConv.participants[0].name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {selectedConv.participants
                            .filter((p) => p.id !== "1")
                            .map((p) => p.name)
                            .join(", ") || selectedConv.participants[0].name}
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          {selectedConv.participants.map((p) => (
                            <Badge
                              key={p.id}
                              variant="outline"
                              className={`text-xs ${getRoleColor(p.role)}`}
                            >
                              {p.role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <Separator />
                <ScrollArea className="h-[400px] p-4">
                  <div className="space-y-4">
                    {conversationMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === "1"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                            message.senderId === "1"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          } rounded-lg px-4 py-2`}
                        >
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs font-medium">
                              {message.senderName}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getRoleColor(
                                message.senderRole
                              )}`}
                            >
                              {message.senderRole}
                            </Badge>
                          </div>
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <Separator />
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-muted-foreground">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Messages;

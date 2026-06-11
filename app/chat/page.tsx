"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { ConversationList } from "@/components/chat/conversation-list";
import { MessageBubble } from "@/components/chat/message-bubble";
import { MessageInput } from "@/components/chat/message-input";
import { ConversationMenu } from "@/components/chat/conversation-menu";
import { Avatar } from "@/components/avatar-component";
import { useToast } from "@/lib/toast-context";
import {
  conversations as initialConversations,
  messages as initialMessages,
} from "@/lib/mock-data";
import { Message, Conversation } from "@/types";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ChatPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConvId,
  );

  // Auto-select first conversation on mount
  useEffect(() => {
    if (!selectedConvId && conversations.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedConvId(conversations[0].id);
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (
    content: string,
    type: "text" | "audio",
    duration?: number,
  ) => {
    if (!selectedConvId) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConvId,
      senderId: "user-1",
      senderName: "You",
      type,
      content,
      audioDuration: duration,
      timestamp: new Date(),
      read: true,
    };

    setMessages([...messages, newMessage]);

    // Update conversation last message
    setConversations((prevConvs) =>
      prevConvs.map((conv) =>
        conv.id === selectedConvId
          ? {
              ...conv,
              lastMessage: newMessage,
              unreadCount: 0,
              updatedAt: new Date(),
            }
          : conv,
      ),
    );

    // Simulate response after 1 second
    setTimeout(() => {
      const responseMessage: Message = {
        id: `msg-${Date.now()}-response`,
        conversationId: selectedConvId,
        senderId: selectedConversation!.participantId,
        senderName: selectedConversation!.participantName,
        type: "text",
        content: "That's great! I'd love to chat more about that.",
        timestamp: new Date(),
        read: false,
      };
      setMessages((prev) => [...prev, responseMessage]);

      // Update conversation with unread message
      setConversations((prevConvs) =>
        prevConvs.map((conv) =>
          conv.id === selectedConvId
            ? {
                ...conv,
                lastMessage: responseMessage,
                unreadCount: conv.unreadCount + 1,
                updatedAt: new Date(),
              }
            : conv,
        ),
      );

      addToast("New message received", "info");
    }, 1000);
  };

  const currentMessages = selectedConvId
    ? messages.filter((m) => m.conversationId === selectedConvId)
    : [];

  return (
    <AppLayout>
      <div className="h-[calc(100vh-64px)] flex bg-background">
        {/* Conversation List - Desktop */}
        <div
          className={`hidden md:flex md:w-80 flex-col border-r border-border bg-card overflow-hidden ${
            isMobileOpen ? "w-full" : ""
          }`}
        >
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-bold">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ConversationList
              conversations={conversations}
              selectedConvId={selectedConvId || undefined}
              onSelectConversation={(convId) => {
                setSelectedConvId(convId);
                setIsMobileOpen(false);
              }}
            />
          </div>
        </div>

        {/* Conversation List - Mobile */}
        {isMobileOpen && (
          <div className="md:hidden w-full flex flex-col border-r border-border bg-card">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-bold">Messages</h2>
              <Button
                onClick={() => setIsMobileOpen(false)}
                variant="ghost"
                size="sm"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ConversationList
                conversations={conversations}
                selectedConvId={selectedConvId || undefined}
                onSelectConversation={(convId) => {
                  setSelectedConvId(convId);
                  setIsMobileOpen(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Chat Area */}
        {!isMobileOpen && selectedConversation ? (
          <div className="flex-1 flex flex-col bg-background">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-card">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Button
                  onClick={() => setIsMobileOpen(true)}
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Avatar
                  src={selectedConversation.participantAvatar}
                  alt={selectedConversation.participantName}
                  name={selectedConversation.participantName}
                  size="md"
                />
                <div className="min-w-0">
                  <h3 className="font-semibold">
                    {selectedConversation.participantName}
                  </h3>
                  <p className="text-xs text-muted-foreground">Active now</p>
                </div>
              </div>
              <ConversationMenu
                onReport={() => addToast("User reported", "success")}
                onMute={() =>
                  addToast("Notifications muted for this conversation", "info")
                }
                onDelete={() => {
                  setConversations(
                    conversations.filter((c) => c.id !== selectedConvId),
                  );
                  setSelectedConvId(null);
                  addToast("Conversation deleted", "success");
                }}
              />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                  <p>Start a conversation by sending a message</p>
                </div>
              ) : (
                currentMessages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwn={message.senderId === "user-1"}
                    senderAvatar={
                      message.senderId !== "user-1"
                        ? selectedConversation.participantAvatar
                        : undefined
                    }
                    senderName={
                      message.senderId !== "user-1"
                        ? selectedConversation.participantName
                        : undefined
                    }
                  />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <MessageInput
              onSendMessage={handleSendMessage}
              disabled={!selectedConversation}
            />
          </div>
        ) : !isMobileOpen ? (
          <div className="hidden md:flex flex-1 items-center justify-center text-center text-muted-foreground">
            <p>Select a conversation to start chatting</p>
          </div>
        ) : null}
      </div>
    </AppLayout>
  );
}

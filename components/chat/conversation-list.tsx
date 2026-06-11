"use client";

import { Conversation } from "@/types";
import { Avatar } from "@/components/avatar-component";
import { getRelativeTime } from "@/lib/utils-extra";
import { Badge } from "@/components/badge-component";
import { cn } from "@/lib/utils";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConvId?: string;
  onSelectConversation: (convId: string) => void;
}

export function ConversationList({
  conversations,
  selectedConvId,
  onSelectConversation,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-center text-muted-foreground p-4">
        <p>No conversations yet. Start chatting with a match!</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {conversations.map((conv) => (
        <button
          key={conv.id}
          onClick={() => onSelectConversation(conv.id)}
          className={cn(
            "w-full px-4 py-3 rounded-lg transition-colors text-left hover:bg-muted",
            selectedConvId === conv.id && "bg-primary/10 border border-primary",
          )}
        >
          <div className="flex items-start gap-3">
            <Avatar
              src={conv.participantAvatar}
              alt={conv.participantName}
              name={conv.participantName}
              size="md"
              className="flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold truncate">
                  {conv.participantName}
                </h3>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {getRelativeTime(conv.updatedAt)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {conv.lastMessage?.content || "No messages yet"}
              </p>
            </div>
            {conv.unreadCount > 0 && (
              <Badge variant="default" className="flex-shrink-0">
                {conv.unreadCount}
              </Badge>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

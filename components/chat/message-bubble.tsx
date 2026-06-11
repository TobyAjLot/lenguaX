"use client";

import { useState } from "react";
import { Message } from "@/types";
import { Avatar } from "@/components/avatar-component";
import { getRelativeTime, formatDuration } from "@/lib/utils-extra";
import { Play, Pause } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  senderAvatar?: string;
  senderName?: string;
}

export function MessageBubble({
  message,
  isOwn,
  senderAvatar,
  senderName,
}: MessageBubbleProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = () => {
    if (message.audioUrl) {
      const audio = new Audio(message.audioUrl);
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={`flex gap-2 ${isOwn ? "justify-end" : "justify-start"}`}>
      {!isOwn && senderAvatar && (
        <Avatar
          src={senderAvatar}
          alt={senderName || "Sender"}
          size="sm"
          className="flex-shrink-0"
        />
      )}

      <div
        className={`flex flex-col max-w-xs sm:max-w-sm ${isOwn ? "items-end" : "items-start"}`}
      >
        {!isOwn && (
          <span className="text-xs font-medium text-muted-foreground px-3 pt-1">
            {senderName}
          </span>
        )}

        <div
          className={`rounded-lg px-4 py-2 ${
            isOwn
              ? "bg-primary text-primary-foreground rounded-br-none"
              : "bg-secondary text-secondary-foreground rounded-bl-none"
          }`}
        >
          {message.type === "text" && (
            <p className="break-words text-sm">{message.content}</p>
          )}

          {message.type === "audio" && message.audioUrl && (
            <button
              onClick={playAudio}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {formatDuration(message.audioDuration || 0)}
              </span>
            </button>
          )}

          {message.type === "image" && (
            <img
              src={message.content}
              alt="Message image"
              className="rounded max-w-xs h-auto"
            />
          )}
        </div>

        <span className="text-xs text-muted-foreground mt-1 px-3">
          {getRelativeTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}

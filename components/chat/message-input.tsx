"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AudioRecorder } from "@/components/audio-recorder";

interface MessageInputProps {
  onSendMessage: (
    content: string,
    type: "text" | "audio",
    duration?: number,
  ) => void;
  disabled?: boolean;
}

export function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleSendText = () => {
    if (message.trim()) {
      onSendMessage(message, "text");
      setMessage("");
    }
  };

  const handleSendAudio = (audioUrl: string, duration: number) => {
    onSendMessage(audioUrl, "audio", duration);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSendText();
    }
  };

  return (
    <div className="border-t border-border bg-card p-4 space-y-3">
      {isRecording ? (
        <AudioRecorder
          onSend={(audioUrl, duration) => {
            handleSendAudio(audioUrl, duration);
            setIsRecording(false);
          }}
          onCancel={() => setIsRecording(false)}
        />
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={disabled}
            className="flex-1 px-4 py-2 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />
          <Button
            onClick={handleSendText}
            disabled={disabled || !message.trim()}
            size="sm"
            className="gap-2"
          >
            <Send className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => setIsRecording(true)}
            disabled={disabled}
            variant="outline"
            size="sm"
          >
            Record
          </Button>
        </div>
      )}
      <p className="text-xs text-muted-foreground">Press Ctrl+Enter to send</p>
    </div>
  );
}

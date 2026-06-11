"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Flag, Trash2, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConversationMenuProps {
  onReport?: () => void;
  onMute?: () => void;
  onDelete?: () => void;
}

export function ConversationMenu({
  onReport,
  onMute,
  onDelete,
}: ConversationMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleReport = () => {
    onReport?.();
    setIsOpen(false);
  };

  const handleMute = () => {
    onMute?.();
    setIsOpen(false);
  };

  const handleDelete = () => {
    onDelete?.();
    setIsOpen(false);
  };

  return (
    <div ref={menuRef} className="relative">
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
        <MoreVertical className="w-4 h-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
          <div className="p-2 space-y-1">
            <button
              onClick={handleMute}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              Mute Notifications
            </button>
            <button
              onClick={handleReport}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-orange-600"
            >
              <Flag className="w-4 h-4" />
              Report User
            </button>
            <button
              onClick={handleDelete}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-destructive/10 transition-colors text-destructive"
            >
              <Trash2 className="w-4 h-4" />
              Delete Conversation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { Heart, MessageCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/badge-component";
import { Avatar } from "@/components/avatar-component";
import { Match } from "@/types";
import { getRelativeTime, calculateCompatibility } from "@/lib/utils-extra";

interface MatchCardProps {
  match: Match;
  onConnect?: () => void;
  onMessage?: () => void;
  onViewProfile?: () => void;
  pendingConnections?: Set<string>;
}

export function MatchCard({
  match,
  onConnect,
  onMessage,
  onViewProfile,
  pendingConnections = new Set(),
}: MatchCardProps) {
  const { user, compatibility, commonInterests } = match;
  const isConnecting = pendingConnections.has(match.id);

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header with Avatar */}
      <div className="p-4 sm:p-6 border-b border-border">
        <div className="flex items-start gap-4">
          <Avatar
            src={user.avatar}
            alt={user.name}
            name={user.name}
            size="lg"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {user.age}, {user.location}
                </p>
              </div>
              {user.verified && (
                <Badge variant="success" className="text-xs">
                  Verified
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: `${compatibility * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-primary whitespace-nowrap">
                {calculateCompatibility(compatibility)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Languages and Bio */}
      <div className="px-4 sm:px-6 py-4 space-y-3 border-b border-border">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
            Languages
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              Native: {user.nativeLanguage}
            </Badge>
            {user.learningLanguages.map((lang) => (
              <Badge key={lang} variant="default" className="text-xs">
                Learning: {lang}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm text-foreground">{user.bio}</p>
        </div>
      </div>

      {/* Common Interests */}
      {commonInterests.length > 0 && (
        <div className="px-4 sm:px-6 py-4 border-b border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
            Common Interests
          </p>
          <div className="flex flex-wrap gap-2">
            {commonInterests.map((interest) => (
              <Badge key={interest} variant="default" className="text-xs">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Metadata and Actions */}
      <div className="px-4 sm:px-6 py-4 bg-muted/50 flex items-center justify-between text-xs text-muted-foreground">
        <span>Last seen {getRelativeTime(user.lastSeen)}</span>
        {user.responseRate && (
          <span className="font-medium">
            {Math.round(user.responseRate * 100)}% response rate
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-4 sm:px-6 py-4 flex gap-2">
        <Link href={`/user/${match.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="flex-1 gap-2">
            <Info className="w-4 h-4" />
            <span className="hidden sm:inline">View</span>
          </Button>
        </Link>
        {isConnecting ? (
          <Button disabled size="sm" className="flex-1 gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="hidden sm:inline">Request Pending</span>
          </Button>
        ) : match.status === "new" || match.status === "connected" ? (
          <Button onClick={onConnect} size="sm" className="flex-1 gap-2">
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">Connect</span>
          </Button>
        ) : (
          <Button onClick={onMessage} size="sm" className="flex-1 gap-2">
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Message</span>
          </Button>
        )}
      </div>
    </div>
  );
}

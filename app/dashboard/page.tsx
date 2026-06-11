"use client";

import { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { MatchCard } from "@/components/match-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/card-component";
import { Avatar } from "@/components/avatar-component";
import { suggestedMatches, currentUser, conversations } from "@/lib/mock-data";
import { useToast } from "@/lib/toast-context";
import { Filter, MessageSquare, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const { addToast } = useToast();
  const [matches, setMatches] = useState(suggestedMatches);
  const [filterType, setFilterType] = useState<
    "all" | "new" | "connected" | "chatting"
  >("all");
  const [pendingConnections, setPendingConnections] = useState<Set<string>>(
    new Set(),
  );

  const filteredMatches =
    filterType === "all"
      ? matches
      : matches.filter(
          (m) =>
            m.status === filterType ||
            (filterType === "chatting" && m.status === "chatting"),
        );

  const handleConnect = (matchId: string) => {
    setPendingConnections((prev) => new Set(prev).add(matchId));
    addToast("Connection request sent!", "success");

    // Simulate request completion after 1.5 seconds
    setTimeout(() => {
      setMatches(
        matches.map((m) =>
          m.id === matchId ? { ...m, status: "connected" as const } : m,
        ),
      );
      setPendingConnections((prev) => {
        const updated = new Set(prev);
        updated.delete(matchId);
        return updated;
      });
    }, 1500);
  };

  const handleMessage = (matchId: string) => {
    addToast("Opening chat...", "info");
  };

  const unreadMessages = conversations.reduce(
    (sum, c) => sum + c.unreadCount,
    0,
  );

  return (
    <AppLayout>
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Welcome back, {currentUser.name.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground">
            Find your perfect language exchange partner today
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-primary">
                {suggestedMatches.length}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Matches
              </p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-accent">
                {conversations.length}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Conversations
              </p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-emerald-600">
                {unreadMessages}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Unread</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-amber-600">
                {Math.round(currentUser.responseRate * 100)}%
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Response Rate
              </p>
            </div>
          </Card>
        </div>

        {/* Recent Conversations Preview */}
        {conversations.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Recent Conversations</h2>
              <Link href="/chat">
                <Button variant="outline" size="sm" className="gap-2">
                  <MessageSquare className="w-4 h-4" />
                  View All
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {conversations.slice(0, 2).map((conv) => (
                <Card key={conv.id} interactive={true}>
                  <Link
                    href={`/chat/${conv.id}`}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  >
                    <Avatar
                      src={conv.participantAvatar}
                      alt={conv.participantName}
                      name={conv.participantName}
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">
                        {conv.participantName}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {conv.lastMessage?.content || "No messages yet"}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                        {conv.unreadCount}
                      </div>
                    )}
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Match Discovery Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-accent" />
                Discover Matches
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {filteredMatches.length}{" "}
                {filterType === "all" ? "total" : filterType} match
                {filteredMatches.length !== 1 ? "es" : ""}
              </p>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {(["all", "new", "connected", "chatting"] as const).map((type) => (
              <Button
                key={type}
                onClick={() => setFilterType(type)}
                variant={filterType === type ? "default" : "outline"}
                size="sm"
                className="gap-2 whitespace-nowrap"
              >
                <Filter className="w-4 h-4" />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>

          {/* Matches Grid */}
          {filteredMatches.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onConnect={() => handleConnect(match.id)}
                  onMessage={() => handleMessage(match.id)}
                  onViewProfile={() => addToast("Opening profile...", "info")}
                  pendingConnections={pendingConnections}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No matches found with that filter
              </p>
              <Button onClick={() => setFilterType("all")} variant="outline">
                View all matches
              </Button>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

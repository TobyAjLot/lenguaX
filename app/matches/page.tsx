"use client";

import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { MatchCard } from "@/components/match-card";
import { suggestedMatches } from "@/lib/mock-data";
import { useToast } from "@/lib/toast-context";

export default function MatchesPage() {
  const { addToast } = useToast();

  return (
    <AppLayout>
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">All Matches</h1>
          <p className="text-muted-foreground">
            Explore {suggestedMatches.length} compatible language partners
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {suggestedMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onConnect={() => addToast("Connection request sent!", "success")}
              onMessage={() => addToast("Opening chat...", "info")}
              onViewProfile={() => addToast("Opening profile...", "info")}
            />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

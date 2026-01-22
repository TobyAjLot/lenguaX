import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

/**
 * Hook to get count of pending session requests for current user
 */
export function useSessionNotifications(userId: string | undefined) {
  const [pendingCount, setPendingCount] = useState(0);

  const fetchPendingCount = async () => {
    if (!userId) return;

    try {
      const { count, error } = await supabase
        .from("sessions")
        .select("*", { count: "exact", head: true })
        .eq("partner_id", userId)
        .eq("status", "PENDING");

      if (error) {
        console.error("Error fetching pending count:", error);
        return;
      }

      setPendingCount(count || 0);
    } catch (err) {
      console.error("Failed to fetch pending count:", err);
    }
  };

  useEffect(() => {
    if (!userId) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPendingCount();

    // Subscribe to real-time changes
    const channel = supabase
      .channel("session-notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sessions",
          filter: `partner_id=eq.${userId}`,
        },
        () => {
          fetchPendingCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return pendingCount;
}

import { supabase } from "../lib/supabase";
import type { Session } from "../../../shared/types";

/**
 * Create a new session request
 * The unique constraint on the DB will prevent duplicates
 */
export async function createSessionRequest(
  requesterId: string,
  partnerId: string,
): Promise<Session> {
  try {
    const { data, error } = await supabase
      .from("sessions")
      .insert({
        requester_id: requesterId,
        partner_id: partnerId,
        status: "PENDING",
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        throw new Error("You already have an active session with this partner");
      }
      console.error("Error creating session:", error);
      throw error;
    }

    return data as Session;
  } catch (error) {
    console.error("Session request failed:", error);
    throw error;
  }
}

/**
 * Get all sessions for a user (both as requester and partner)
 */
export async function getUserSessions(userId: string): Promise<Session[]> {
  try {
    const { data, error } = await supabase
      .from("sessions")
      .select(
        `
        *,
        requester:users!requester_id(id, full_name, avatar_url),
        partner:users!partner_id(id, full_name, avatar_url)
      `,
      )
      .or(`requester_id.eq.${userId},partner_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching sessions:", error);
      throw error;
    }

    return (data || []) as Session[];
  } catch (error) {
    console.error("Failed to fetch sessions:", error);
    throw error;
  }
}

/**
 * Get pending session requests (where user is the partner)
 */
export async function getPendingRequests(userId: string): Promise<Session[]> {
  try {
    const { data, error } = await supabase
      .from("sessions")
      .select(
        `
        *,
        requester:users!requester_id(id, full_name, avatar_url)
      `,
      )
      .eq("partner_id", userId)
      .eq("status", "PENDING")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching pending requests:", error);
      throw error;
    }

    return (data || []) as Session[];
  } catch (error) {
    console.error("Failed to fetch pending requests:", error);
    throw error;
  }
}

/**
 * Accept a session request
 */
export async function acceptSessionRequest(
  sessionId: string,
): Promise<Session> {
  try {
    const { data, error } = await supabase
      .from("sessions")
      .update({ status: "CONFIRMED" })
      .eq("id", sessionId)
      .eq("status", "PENDING") // Only update if still pending
      .select(
        `
        *,
        requester:users!requester_id(id, full_name, avatar_url),
        partner:users!partner_id(id, full_name, avatar_url)
      `,
      )
      .single();

    if (error) {
      console.error("Error accepting session:", error);
      throw error;
    }

    if (!data) {
      throw new Error("Session not found or already processed");
    }

    return data as Session;
  } catch (error) {
    console.error("Failed to accept session:", error);
    throw error;
  }
}

/**
 * Decline a session request
 */
export async function declineSessionRequest(sessionId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from("sessions")
      .update({ status: "CANCELLED" })
      .eq("id", sessionId)
      .eq("status", "PENDING"); // Only update if still pending

    if (error) {
      console.error("Error declining session:", error);
      throw error;
    }
  } catch (error) {
    console.error("Failed to decline session:", error);
    throw error;
  }
}

/**
 * Check if a session request already exists between two users
 * Note: The DB constraint will also prevent duplicates, but this provides
 * a better UX by checking before attempting to create
 */
export async function checkExistingRequest(
  userId1: string,
  userId2: string,
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("sessions")
      .select("id")
      .or(
        `and(requester_id.eq.${userId1},partner_id.eq.${userId2}),and(requester_id.eq.${userId2},partner_id.eq.${userId1})`,
      )
      .in("status", ["PENDING", "CONFIRMED"])
      .limit(1);

    if (error) {
      console.error("Error checking existing request:", error);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error("Failed to check existing request:", error);
    return false;
  }
}

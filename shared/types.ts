/**
 * Proficiency levels for user languages
 */
export type ProficiencyLevel =
  | "native"
  | "fluent"
  | "intermediate"
  | "beginner";

/**
 * Session status values
 */
export type SessionStatus = "pending" | "confirmed" | "completed" | "cancelled";

/**
 * Message type values
 */
export type MessageType = "text" | "voice";

/**
 * User type based on Supabase users table schema
 */
export interface User {
  id: string; // UUID
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

/**
 * User language relationship based on user_languages table
 * Represents a language that a user speaks or is learning
 */
export interface UserLanguage {
  id: string; // UUID
  user_id: string; // UUID
  language_code: string; // e.g., "en", "es"
  proficiency_level: ProficiencyLevel;
  is_learning: boolean;
  created_at: string; // ISO timestamp
}

/**
 * Authentication state for Zustand store
 * Manages the current user session and authentication status
 */
export interface AuthState<T> {
  user: User | null;
  session: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Language exchange session based on sessions table
 * Represents a scheduled or completed language exchange session between two users
 */
export interface Session {
  id: string; // UUID
  requester_id: string; // UUID
  partner_id: string; // UUID
  scheduled_at: string; // ISO timestamp
  duration_minutes: number;
  status: SessionStatus;
  created_at: string; // ISO timestamp
}

/**
 * Chat message based on messages table
 * Can be either a text message or a voice note
 */
export interface Message {
  id: string; // UUID
  session_id: string; // UUID
  sender_id: string; // UUID
  content: string | null; // Text content (null for voice messages)
  voice_url: string | null; // URL to voice note in Supabase Storage (null for text messages)
  message_type: MessageType;
  created_at: string; // ISO timestamp
}

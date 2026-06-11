// User and Profile Types
export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  age: number;
  location: string;
  nativeLanguage: string;
  learningLanguages: string[];
  bio: string;
  interests: string[];
  responseRate: number;
  lastSeen: Date;
  verified: boolean;
  premium: boolean;
}

// Match Types
export interface Match {
  id: string;
  user: UserProfile;
  compatibility: number;
  commonInterests: string[];
  matchedAt: Date;
  status: "new" | "connected" | "chatting" | "archived";
}

// Message Types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  type: "text" | "audio" | "image";
  content: string;
  audioUrl?: string;
  audioDuration?: number;
  timestamp: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: Date;
  status: "active" | "archived";
}

// Audio Recording Types
export type RecordingState =
  | "idle"
  | "permissionDenied"
  | "recording"
  | "preview"
  | "uploading"
  | "success";

export interface AudioRecording {
  state: RecordingState;
  duration: number;
  audioUrl?: string;
  error?: string;
  isPlaying?: boolean;
}

// Toast Types
export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

// Onboarding Types
export interface OnboardingData {
  step: 1 | 2 | 3;
  name: string;
  age: number;
  nativeLanguage: string;
  learningLanguages: string[];
  interests: string[];
}

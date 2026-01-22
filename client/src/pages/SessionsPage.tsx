import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  getUserSessions,
  acceptSessionRequest,
  declineSessionRequest,
} from "../services/session.service";
import ToastContainer from "../components/ToastContainer";
import { useToast } from "../hooks/useToast";
import type { Session } from "../../../shared/types";
import { SessionCard } from "../components/SessionCard";

type TabType = "pending" | "confirmed" | "all";

export default function SessionsPage() {
  const { user } = useAuthStore();
  const toast = useToast();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user]);

  const loadSessions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await getUserSessions(user.id);
      setSessions(data);
    } catch (err) {
      console.error("Failed to load sessions:", err);
      toast.error("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (sessionId: string) => {
    try {
      setActionLoading(sessionId);
      await acceptSessionRequest(sessionId);
      toast.success("Session request accepted!");
      await loadSessions();
    } catch (err) {
      console.error("Failed to accept session:", err);
      toast.error("Failed to accept request");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecline = async (sessionId: string) => {
    try {
      setActionLoading(sessionId);
      await declineSessionRequest(sessionId);
      toast.success("Session request declined");
      await loadSessions();
    } catch (err) {
      console.error("Failed to decline session:", err);
      toast.error("Failed to decline request");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredSessions = sessions.filter((session) => {
    if (activeTab === "pending") return session.status === "PENDING";
    if (activeTab === "confirmed") return session.status === "CONFIRMED";
    return true;
  });

  const pendingCount = sessions.filter((s) => s.status === "PENDING").length;
  const confirmedCount = sessions.filter(
    (s) => s.status === "CONFIRMED",
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Sessions</h1>
        <p className="mt-2 text-gray-600">
          Manage your language exchange sessions and requests
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("pending")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "pending"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Pending
            {pendingCount > 0 && (
              <span className="ml-2 bg-indigo-100 text-indigo-600 py-0.5 px-2.5 rounded-full text-xs font-medium">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("confirmed")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "confirmed"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Confirmed
            {confirmedCount > 0 && (
              <span className="ml-2 bg-green-100 text-green-600 py-0.5 px-2.5 rounded-full text-xs font-medium">
                {confirmedCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "all"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            All Sessions
          </button>
        </nav>
      </div>

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No sessions yet
          </h3>
          <p className="mt-2 text-gray-600">
            {activeTab === "pending"
              ? "You don't have any pending session requests."
              : activeTab === "confirmed"
                ? "You don't have any confirmed sessions yet."
                : "Start by finding a language partner!"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              currentUserId={user!.id}
              onAccept={handleAccept}
              onDecline={handleDecline}
              actionLoading={actionLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
}

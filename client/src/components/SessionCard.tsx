import type { Session } from "@shared/types";

// Session Card Component
interface SessionCardProps {
  session: Session;
  currentUserId: string;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  actionLoading: string | null;
}

export function SessionCard({
  session,
  currentUserId,
  onAccept,
  onDecline,
  actionLoading,
}: SessionCardProps) {
  // Determine if current user is the requester or the partner
  const isRequester = session.requester_id === currentUserId;
  const otherUser = isRequester ? session.partner : session.requester;
  const role = isRequester ? "Sent" : "Received";

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: Session["status"]) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Confirmed
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Completed
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Cancelled
          </span>
        );
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        {/* User Info */}
        <div className="flex items-start space-x-4 flex-1">
          {/* Avatar */}
          {otherUser?.avatar_url ? (
            <img
              src={otherUser.avatar_url}
              alt={otherUser.full_name}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-100"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center ring-2 ring-gray-100">
              <span className="text-sm font-bold text-white">
                {otherUser ? getInitials(otherUser.full_name) : "??"}
              </span>
            </div>
          )}

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {otherUser?.full_name || "Unknown User"}
              </h3>
              {getStatusBadge(session.status)}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">{role}</span> •{" "}
              {formatDate(session.created_at)}
            </p>
            {session.scheduled_at && (
              <p className="text-sm text-gray-600 mt-1">
                Scheduled: {formatDate(session.scheduled_at)}
              </p>
            )}
          </div>
        </div>

        {/* Actions (only show for pending requests you received) */}
        {session.status === "PENDING" && !isRequester && (
          <div className="flex space-x-2 ml-4">
            <button
              onClick={() => onAccept(session.id)}
              disabled={actionLoading === session.id}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {actionLoading === session.id ? "Accepting..." : "Accept"}
            </button>
            <button
              onClick={() => onDecline(session.id)}
              disabled={actionLoading === session.id}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {actionLoading === session.id ? "Declining..." : "Decline"}
            </button>
          </div>
        )}

        {/* Status indicator for sent requests */}
        {session.status === "PENDING" && isRequester && (
          <div className="ml-4">
            <p className="text-sm text-gray-500 italic">
              Waiting for response...
            </p>
          </div>
        )}

        {/* Message button for confirmed sessions */}
        {session.status === "CONFIRMED" && (
          <div className="ml-4">
            <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors">
              Start Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

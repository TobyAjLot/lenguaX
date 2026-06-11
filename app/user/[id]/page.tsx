"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/badge-component";
import { Avatar } from "@/components/avatar-component";
import { Card } from "@/components/card-component";
import { useToast } from "@/lib/toast-context";
import { suggestedMatches } from "@/lib/mock-data";
import { Heart, MessageCircle, ArrowLeft, Star } from "lucide-react";

export default function UserProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { addToast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  // Find the match from mock data
  const match = params?.id
    ? suggestedMatches.find((m) => m.id === String(params.id))
    : null;

  if (!match) {
    return (
      <AppLayout>
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="gap-2 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Card className="text-center py-12">
            <p className="text-muted-foreground mb-4">User profile not found</p>
            <Button onClick={() => router.push("/dashboard")} variant="outline">
              Back to Dashboard
            </Button>
          </Card>
        </div>
      </AppLayout>
    );
  }

  const { user, compatibility, commonInterests } = match;

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      addToast("Connection request sent!", "success");
      setIsConnecting(false);
    } catch (error) {
      addToast("Failed to send connection request", "error");
      setIsConnecting(false);
    }
  };

  const handleMessage = () => {
    addToast("Redirecting to chat...", "info");
    router.push("/chat");
  };

  return (
    <AppLayout>
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* Back Button */}
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="gap-2 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </Button>

        {/* Profile Header Card */}
        <Card className="mb-6">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-6 mb-6">
              <Avatar
                src={user.avatar}
                alt={user.name}
                name={user.name}
                size="lg"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold">
                      {user.name}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                      {user.age} years old • {user.location}
                    </p>
                  </div>
                  {user.verified && <Badge variant="success">Verified</Badge>}
                </div>

                {/* Compatibility Score */}
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 bg-muted rounded-full h-3">
                    <div
                      className="bg-primary h-full rounded-full transition-all"
                      style={{ width: `${compatibility * 100}%` }}
                    />
                  </div>
                  <span className="text-lg font-bold text-primary">
                    {Math.round(compatibility * 100)}% match
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {user.responseRate
                        ? Math.round(user.responseRate * 100)
                        : 0}
                      %
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Response Rate
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold flex items-center gap-1">
                      <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                      4.8
                    </p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">2h</p>
                    <p className="text-xs text-muted-foreground">Last seen</p>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="mb-6 pb-6 border-b border-border">
              <h2 className="text-lg font-semibold mb-3">About</h2>
              <p className="text-foreground leading-relaxed">{user.bio}</p>
            </div>

            {/* Languages */}
            <div className="mb-6 pb-6 border-b border-border">
              <h2 className="text-lg font-semibold mb-3">Languages</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Native Language
                  </p>
                  <Badge variant="secondary" className="text-sm">
                    {user.nativeLanguage}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Learning</p>
                  <div className="flex flex-wrap gap-2">
                    {user.learningLanguages.map((lang) => (
                      <Badge key={lang} variant="default" className="text-sm">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Common Interests */}
            {commonInterests.length > 0 && (
              <div className="mb-6 pb-6 border-b border-border">
                <h2 className="text-lg font-semibold mb-3">Common Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {commonInterests.map((interest) => (
                    <Badge key={interest} variant="default">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* All Interests */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest) => (
                  <Badge key={interest} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="flex-1 gap-2"
              >
                <Heart className="w-4 h-4" />
                {isConnecting ? "Sending..." : "Connect"}
              </Button>
              <Button
                onClick={handleMessage}
                variant="outline"
                className="flex-1 gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Message
              </Button>
            </div>
          </div>
        </Card>

        {/* Additional Info */}
        <Card className="text-sm text-muted-foreground p-4">
          <p>
            Always feel safe. LenguaX never shares your contact information
            unless you choose to.
          </p>
        </Card>
      </div>
    </AppLayout>
  );
}

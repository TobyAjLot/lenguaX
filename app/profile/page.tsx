"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card } from "@/components/card-component";
import { Badge } from "@/components/badge-component";
import { Avatar } from "@/components/avatar-component";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/mock-data";
import { useToast } from "@/lib/toast-context";
import {
  Edit,
  Mail,
  MapPin,
  MessageSquare,
  Shield,
  AlertTriangle,
  LogOut,
  ChevronRight,
} from "lucide-react";

export default function ProfilePage() {
  const { addToast } = useToast();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);

  const handleLogout = () => {
    addToast("Logged out successfully", "info");
  };

  const handleReportUser = () => {
    setShowSafetyModal(true);
  };

  return (
    <AppLayout>
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* Profile Header */}
        <div className="mb-8">
          <Card>
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <Avatar
                src={currentUser.avatar}
                alt={currentUser.name}
                name={currentUser.name}
                size="lg"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold">
                    {currentUser.name}
                  </h1>
                  {currentUser.verified && (
                    <Badge variant="success" className="text-xs">
                      Verified
                    </Badge>
                  )}
                  {currentUser.premium && (
                    <Badge variant="default" className="text-xs bg-accent">
                      Premium
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">
                  {currentUser.age} years old
                </p>
                <p className="flex items-center gap-1 text-muted-foreground mt-1">
                  <MapPin className="w-4 h-4" />
                  {currentUser.location}
                </p>
              </div>
              <Button onClick={() => setShowEditModal(true)} className="gap-2">
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>
            </div>
          </Card>
        </div>

        {/* About Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">About</h2>
          <Card>
            <p className="text-foreground leading-relaxed">{currentUser.bio}</p>
          </Card>
        </div>

        {/* Languages Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Languages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Native Language
                </p>
                <p className="text-lg font-semibold">
                  {currentUser.nativeLanguage}
                </p>
              </div>
            </Card>
            <Card>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Learning
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentUser.learningLanguages.map((lang) => (
                    <Badge key={lang} variant="secondary" className="text-xs">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Interests Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Interests</h2>
          <Card>
            <div className="flex flex-wrap gap-2">
              {currentUser.interests.map((interest) => (
                <Badge key={interest} variant="default" className="text-xs">
                  {interest}
                </Badge>
              ))}
            </div>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Statistics</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Card>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {Math.round(currentUser.responseRate * 100)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Response Rate
                </p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">12</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Connections
                </p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">4.8</p>
                <p className="text-xs text-muted-foreground mt-1">Rating</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Account Settings Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Account Settings</h2>
          <div className="space-y-2">
            <button className="w-full px-4 py-3 rounded-lg border border-border bg-card hover:bg-muted transition-colors flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div className="text-left">
                  <p className="font-medium">Email & Password</p>
                  <p className="text-xs text-muted-foreground">
                    Update your login credentials
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <button className="w-full px-4 py-3 rounded-lg border border-border bg-card hover:bg-muted transition-colors flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <div className="text-left">
                  <p className="font-medium">Privacy & Safety</p>
                  <p className="text-xs text-muted-foreground">
                    Manage your privacy settings
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <button className="w-full px-4 py-3 rounded-lg border border-border bg-card hover:bg-muted transition-colors flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-muted-foreground" />
                <div className="text-left">
                  <p className="font-medium">Blocked Users</p>
                  <p className="text-xs text-muted-foreground">
                    Manage blocked contacts
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Safety Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Safety & Support</h2>
          <div className="space-y-2">
            <Button
              onClick={handleReportUser}
              variant="outline"
              className="w-full justify-start gap-3 h-auto px-4 py-3"
            >
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div className="text-left">
                <p className="font-medium">Report a Problem</p>
                <p className="text-xs text-muted-foreground">
                  Report abusive users or content
                </p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto px-4 py-3"
            >
              <Shield className="w-5 h-5 text-primary flex-shrink-0" />
              <div className="text-left">
                <p className="font-medium">Community Guidelines</p>
                <p className="text-xs text-muted-foreground">
                  Read our safety guidelines
                </p>
              </div>
            </Button>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="w-full gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-md w-full">
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Edit Profile</h2>
                <p className="text-sm text-muted-foreground">
                  Profile editing functionality would go here. Update your bio,
                  interests, and more.
                </p>
                <div className="flex gap-2 justify-end">
                  <Button
                    onClick={() => setShowEditModal(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => setShowEditModal(false)}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Safety Modal */}
        {showSafetyModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-md w-full">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <h2 className="text-xl font-bold">Report a Problem</h2>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="report"
                      className="w-4 h-4"
                      defaultChecked
                    />
                    <span className="text-sm">
                      Inappropriate behavior or content
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="report" className="w-4 h-4" />
                    <span className="text-sm">Spam or scam activity</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="report" className="w-4 h-4" />
                    <span className="text-sm">
                      Harassment or threatening behavior
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="report" className="w-4 h-4" />
                    <span className="text-sm">Fake profile</span>
                  </label>
                </div>
                <textarea
                  placeholder="Tell us what happened..."
                  className="w-full px-3 py-2 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  rows={3}
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    onClick={() => setShowSafetyModal(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setShowSafetyModal(false);
                    }}
                  >
                    Submit Report
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

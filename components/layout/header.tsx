"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Avatar } from "@/components/avatar-component";
import { ThemeToggle } from "@/components/theme-toggle";

interface HeaderProps {
  user?: {
    name: string;
    avatar: string;
  };
  onMenuClick?: () => void;
  isMobileMenuOpen?: boolean;
}

export function Header({ user, onMenuClick, isMobileMenuOpen }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(isMobileMenuOpen || false);

  const handleMenuClick = () => {
    setIsOpen(!isOpen);
    onMenuClick?.();
  };

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-primary"
        >
          <span>LenguaX</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/matches"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Matches
          </Link>
          <Link
            href="/chat"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Chat
          </Link>
          <div className="w-px h-6 bg-border" />
          <ThemeToggle />
          {user && (
            <Link
              href="/profile"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Avatar
                src={user.avatar}
                alt={user.name}
                name={user.name}
                size="sm"
              />
              <span className="text-sm font-medium">{user.name}</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          onClick={handleMenuClick}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-4 py-4 space-y-4">
            <Link
              href="/dashboard"
              className="block text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/matches"
              className="block text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Matches
            </Link>
            <Link
              href="/chat"
              className="block text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Chat
            </Link>
            {user && (
              <Link
                href="/profile"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  name={user.name}
                  size="sm"
                />
                <span className="text-sm font-medium">{user.name}</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

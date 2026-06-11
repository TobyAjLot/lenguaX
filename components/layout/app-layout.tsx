"use client";

import { Header } from "./header";
import { currentUser } from "@/lib/mock-data";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header user={{ name: currentUser.name, avatar: currentUser.avatar }} />
      <main className="flex-1 w-full">{children}</main>
      <footer className="border-t border-border bg-card py-6 px-4 sm:px-6 text-center text-sm text-muted-foreground">
        <p>&copy; 2024 LenguaX. All rights reserved.</p>
      </footer>
    </div>
  );
}

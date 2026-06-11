import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, Users, Mic } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 h-16 border-b border-border bg-card">
        <div className="font-bold text-xl text-primary">LenguaX</div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/onboarding">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-2xl text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-balance">
            Connect Through Language Exchange
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto text-balance">
            Meet language learners worldwide. Practice speaking, make meaningful
            connections, and immerse yourself in authentic cultural exchange.
          </p>

          <div className="pt-4">
            <Link href="/onboarding">
              <Button size="lg" className="gap-2">
                Start Learning Today <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mt-20">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-base">Smart Matching</h3>
            <p className="text-sm text-muted-foreground">
              Find compatible language partners based on interests and goals
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-base">Global Community</h3>
            <p className="text-sm text-muted-foreground">
              Connect with native speakers from across the world
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Mic className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-base">Voice Messages</h3>
            <p className="text-sm text-muted-foreground">
              Practice pronunciation with easy audio recording
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6 px-4 sm:px-6 text-center text-sm text-muted-foreground">
        <p>&copy; 2026 LenguaX. All rights reserved.</p>
      </footer>
    </div>
  );
}

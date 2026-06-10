# LenguaX

A peer-to-peer language exchange web platform built on a value-for-value model. Two users who speak each other's target language connect and exchange asynchronous voice notes and text messages.

**No live calls. No payments. No tutorial hell.**

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **BaaS Engine:** Supabase (Auth, Postgres DB, Storage, Realtime)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel (Edge Infrastructure)

_Architecture Note: Monolithic codebase. No standalone Express/Socket.io backend. All state mutations flow through Next.js Server Actions. Live updates utilize native Supabase Realtime subscriptions._

---

## 📂 Repository Structure

```text
/
├── app/
│   ├── (auth)/             # Login and Signup workflows
│   ├── (app)/
│   │   ├── onboarding/     # Language capability configuration wizard
│   │   ├── dashboard/      # Match list discovery grid
│   │   ├── chat/[id]/      # Active communication canvas (Text + Audio)
│   │   └── profile/[id]/   # User information & safety blocks
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                 # Atomic design primitives
│   ├── chat/               # AudioPlayer, AudioRecorder, MessageBubble
│   └── discovery/          # MatchCard, LanguageBadge
├── lib/
│   ├── supabase/           # Server, Client, and Middleware initializers
│   ├── actions/            # Unified write-path Server Actions
│   └── utils/              # Client-side formatting wrappers
├── types/                  # Database types generated via Supabase CLI
└── supabase/
    └── migrations/         # Versioned local SQL scripts
```

💾 Core Domain Model
users: Profiles linked directly to auth.users.

user_languages: Many-to-one relationship map classifying NATIVE and LEARNING capabilities with explicit integer proficiencies (1-5).

sessions: Active conversation bridges holding status gates (PENDING, ACTIVE, ARCHIVED).

messages: Multi-modal ledger specifying payload varieties (TEXT vs AUDIO) bound to a storage path bucket template: {session_id}/{message_id}.m4a.

blocks: Reactive user-isolation tracking.

🚀 Local Development Checklist
Clone the repository and install dependencies: npm install

Authenticate and initialize the Supabase CLI environment.

Pull or generate database types into types/database.types.ts.

Run the local Next.js development server: npm run dev

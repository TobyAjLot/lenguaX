# LenguaX 🗣️🌍

> **A Peer-to-Peer Language Exchange Platform** > _Bridging the gap between theoretical learning and practical fluency._

![Status](https://img.shields.io/badge/Status-In%20Development-orange) ![Stack](https://img.shields.io/badge/Tech-React%20%7C%20Node%20%7C%20Supabase-blue)

## 📖 Overview

**LenguaX** is a language exchange application designed to lower the anxiety barrier of speaking a new language. Unlike standard tutoring platforms, LenguaX focuses on a **"value-for-value"** exchange model where learners swap languages (e.g., a Spanish speaker learning English pairs with an English speaker learning Spanish).

The platform prioritizes **Asynchronous Voice Notes** to allow users to practice speaking without the pressure of live scheduling, while offering **Real-time Video/Voice** for when partners are ready to connect live.

---

## 🏗️ Tech Stack & Architecture

LenguaX uses a **Hybrid Architecture** to balance development speed with custom real-time control.

### **Frontend (Client)**

- **Framework:** React (Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Router:** React Router v6

### **Backend-as-a-Service (Data & Auth)**

- **Supabase:**
  - **Auth:** Secure email/password login & session management.
  - **Database:** PostgreSQL with Row Level Security (RLS) for robust privacy.
  - **Storage:** S3-compatible object storage for voice notes and avatars.

### **Custom Backend (Server)**

- **Runtime:** Node.js / Express
- **Real-time:** Socket.io (Signaling for WebRTC & Chat)
- **Live Calls:** PeerJS (WebRTC wrapper)
- **Why Express?** While Supabase handles data, the Express server manages the WebSocket "handshake" required for peer-to-peer connections and complex server-side logic.

---

## 🚀 Features (MVP)

- [x] **Secure Authentication:** Sign up/Login with Supabase Auth.
- [x] **User Profiles:** Manage native/target languages and proficiency levels.
- [ ] **Partner Discovery:** Filter users by complementary language pairs (e.g., "I speak X, learning Y").
- [ ] **Async Voice Chat:** Record and send audio messages.
- [ ] **Session Booking:** Propose and accept meeting times.
- [ ] **Live Video/Audio:** Peer-to-peer calling directly in the browser.

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- A [Supabase](https://supabase.com/) project

### 1. Clone the Repository

```bash
git clone [https://github.com/yourusername/lenguax.git](https://github.com/yourusername/lenguax.git)
cd lenguax
```

### 2. Environment Setup

**Client (.env)** Create a `.env` file in the `client/` folder:

Code snippet

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
VITE_API_URL=http://localhost:3001 # Points to Express Backend
```

**Server (.env)** Create a `.env` file in the `server/` folder:

Code snippet

```
PORT=3001
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key # ADMIN ACCESS - KEEP SECRET
```

### 3. Database Setup (Supabase)

Run the SQL scripts located in `server/sql/schema.sql` (or copy from the SQL Editor) to set up:

- `users`, `user_languages`, `sessions`, `messages` tables.
- Row Level Security (RLS) policies.
- Storage buckets (`avatars`, `voice-notes`).

### 4. Running the App

LenguaX is a monorepo. You need to run the client and server terminals separately.

**Terminal 1: Frontend**

Bash

```
cd client
npm install
npm run dev
```

**Terminal 2: Backend**

Bash

```
cd server
npm install
npm run dev
```

---

## 📂 Project Structure

```
lenguax/
├── client/              # React Frontend
│   ├── src/
│   │   ├── lib/         # Supabase client setup
│   │   ├── pages/       # Route components (Auth, Dashboard)
│   │   ├── store/       # Zustand state stores
│   │   └── ...
├── server/              # Express Backend
│   ├── src/
│   │   ├── controllers/ # Logic for Booking/Search
│   │   ├── sockets/     # Socket.io handlers
│   │   └── ...
└── shared/              # Shared Types (TypeScript interfaces)
    └── types.ts         # User, Session, Message definitions
```

---

## 🛡️ Security

- **RLS (Row Level Security):** Database policies ensure users can only access their own data or public profiles.
- **Service Role:** The Node.js server uses the Service Role key for privileged actions (like verifying tokens) but never exposes it to the client.

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Built with ❤️ by [Tobi Ajasa-Lot]**

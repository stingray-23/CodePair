# CodePair

CodePair is a powerful, real-time collaborative coding and interview platform designed to provide a seamless, synchronized programming experience. With built-in support for live multi-language code execution, real-time chat, synchronized timers, and persistent states, CodePair is the ultimate tool for pair programming and technical interviews.

## 🚀 Features

- **Real-Time Collaboration**: Type code and see your partner's changes instantly via ultra-low latency WebSockets.
- **Multi-Language Execution**: Write and instantly execute code in 8+ languages including C++, Python, Java, Rust, Go, JavaScript, TypeScript, and C.
- **Live Chat & Inline Comments**: Communicate with your peers through a synchronized chat panel and attach context-aware comments directly to specific lines of code.
- **Synchronized Session Timer**: Built-in countdown timer for mock interviews and timed challenges, synchronized precisely across all clients.
- **Role-Based Access**: Join as a Host, Interviewer, or Interviewee. Critical actions (like modifying the timer) are restricted to authorized roles.
- **High-Speed Caching**: Powered by Redis for instantaneous state recovery, ensuring that if you refresh the page, you don't lose a single character.
- **Persistent Storage**: Rooms and sessions are securely stored using PostgreSQL.
- **Modern UI/UX**: Beautiful, responsive dark-mode interface built with TailwindCSS and animated with Framer Motion.

## 🛠️ Technology Stack

- **Frontend**: Next.js, React, TailwindCSS, Framer Motion, Socket.IO-Client
- **Backend**: Node.js, Express, Socket.IO, Prisma ORM, Redis
- **Infrastructure**: Vercel (Frontend Hosting), Render (Dockerized Backend Execution), Neon (Serverless Postgres), Upstash (Serverless Redis)

## 💻 Local Setup & Installation

### Prerequisites
- Node.js (v18+)
- A PostgreSQL Database (e.g., Neon)
- A Redis Instance (e.g., Upstash)

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory with the following variables:
   ```env
   DATABASE_URL="your-postgres-url"
   REDIS_URL="your-redis-url"
   JWT_SECRET="your-super-secret-key"
   FRONTEND_URL="http://localhost:3000"
   ```
4. Generate Prisma client and push the database schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the `frontend` directory with the following variables:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:4000"
   NEXT_PUBLIC_SOCKET_URL="http://localhost:4000"
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:3000`.

## 🐳 Docker Deployment (Production)

The backend relies on system-level compilers (like `g++`, `rustc`, `javac`) to execute user code. To deploy this to production, you must use the provided `Dockerfile`.

1. When deploying to a cloud provider (like Render), select **Docker** as the runtime environment.
2. Set the root directory to `backend`.
3. Provide your environment variables (`DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `FRONTEND_URL`) in the provider's dashboard.
4. The Dockerfile will automatically install Alpine versions of Node, Python3, GCC, G++, OpenJDK, Rust, and Go, allowing all languages to compile and execute securely within the container.

## 📝 License
This project is open-source and available under the MIT License.

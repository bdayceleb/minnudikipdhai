# Push The Bar Higher ❤️

A romantic yet structured learning platform with RBAC, tracking analytics, and gamification built using a modern full-stack architecture.

## 🚀 Tech Stack
- **Frontend**: Next.js 14, TailwindCSS, Framer Motion, Zustand, Recharts
- **Backend**: Node.js, Express, TypeScript, Prisma, JWT Auth
- **Database**: PostgreSQL (Neon/Supabase ready)
- **Deployment**: Dockerized backend, Vercel-ready frontend

## 📦 Local Development

### 1. Database Setup
You can either run the local PostgreSQL instance via Docker or use a hosted URL (Supabase/Neon).

```bash
# To run local DB
docker-compose up -d
```

### 2. Backend Setup
```bash
cd backend
npm install
# Set your .env here (use .env.example)
npx prisma generate
npx prisma db push
npx prisma db seed # Creates initial Admin and User
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Set your .env.local here
npm run dev
```

## 🔐 Default Credentials (from seed)
- **Admin**: `admin@pushthebar.com` | Password: `admin123`
- **User (Her)**: `user@pushthebar.com` | Password: `user123`

## 🌍 Production Deployment

### Backend (Railway / Render / AWS)
A `Dockerfile` is provided in the `backend` folder. Set the `DATABASE_URL`, `JWT_SECRET`, and `FRONTEND_URL` environment variables in your hosting provider.

### Frontend (Vercel)
The `frontend` is a standard Next.js app. Connect the GitHub repo to Vercel, set `NEXT_PUBLIC_API_URL` to your hosted backend URL, and deploy. A multi-stage `Dockerfile` is also provided in the frontend if you prefer containerized deployment.

# Voluntry

Unified volunteer management platform featuring a React web dashboard, Expo-powered mobile app, and Node.js/Express backend with MongoDB storage and AI-powered chat.

## Tech Stack

- **Frontend (web)**: React + Vite, React Router, Zustand, Axios
- **Mobile**: React Native (Expo), React Navigation
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT auth, optional OpenAI integration

## Project Structure

```
backend/   # Express API
web/       # React web client
mobile/    # Expo React Native client
```

## Getting Started

### 1. Backend API

```bash
cd backend
cp env.example .env   # add your secrets
npm install
npm run dev
```

Environment variables:

```
PORT=4000
MONGO_URI=mongodb://localhost:27017/voluntry
JWT_SECRET=super-secret-key
OPENAI_API_KEY=sk-your-key   # optional
```

Run MongoDB locally or point to Atlas. If `OPENAI_API_KEY` is missing, the AI chat falls back to a deterministic mock response.

### 2. Web Client

```bash
cd web
cp env.example .env
npm install
npm run dev
```

Set `VITE_API_URL` to your backend URL (`http://localhost:4000/api` by default).

### 3. Mobile App

```bash
cd mobile
cp env.example .env
npm install
npx expo start
```

Set `EXPO_PUBLIC_API_URL` so the mobile client can reach your backend (remember to use your LAN IP when testing on devices).

## Features

- Email/password signup & login with JWT session
- Profile management (create/update/delete)
- Volunteer activity tracking with state transitions and stats dashboard
- AI chat assistant with history stored per user
- Shared API consumed by both web and mobile clients

## Testing & Quality

- Web client linting via `npm run lint`
- Backend ready for integration tests (not included)

## Next Steps

- Add persistence for mobile auth tokens (e.g., SecureStore)
- Harden validation and add unit/integration tests
- Deploy backend (Render/Heroku) and clients (Vercel / Expo EAS)


# Spotify Clone

A full-stack music streaming app inspired by Spotify. Users can sign up as a regular listener or as an artist. Listeners can browse and stream music and albums; artists can upload tracks, organize them into albums, and manage their own catalog.

## Features

- 🔐 **Authentication** — register, login, logout with JWT stored in an HTTP-only cookie
- 🎭 **Role-based access** — two roles, `user` and `artist`, with separate permissions
  - Regular users can browse and stream music/albums
  - Artists can additionally upload tracks, create albums, and delete their own tracks
- 🎵 **Music upload** — artists upload audio files, which are stored either on **ImageKit** (cloud) or locally on the server as a fallback
- 💿 **Albums** — artists can group their tracks into albums
- 📂 **Browse & discover** — fetch all music, all albums, or a specific album by ID
- 🎶 **Music player** — in-app player on the frontend (play/pause, track queue, etc. via Redux)

## Tech Stack

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- JWT authentication (`jsonwebtoken`, `bcryptjs`) with HTTP-only cookies
- `multer` for handling file uploads (in-memory)
- `@imagekit/nodejs` for cloud file storage (with automatic local-disk fallback if not configured)

**Frontend**
- React 18 + Vite
- Redux Toolkit + React Redux (auth, music, and player state)
- React Router DOM 6
- Axios for API calls
- Bootstrap for styling

## Project Structure

```
.
├── backend/
│   ├── server.js                 # Entry point — loads env, connects DB, starts server
│   ├── uploads/                  # Local fallback storage for uploaded music files
│   └── src/
│       ├── app.js                # Express app setup (CORS, middleware, routes)
│       ├── db/                   # MongoDB connection
│       ├── controllers/          # Auth, "me", and music route handlers
│       ├── middlewares/          # JWT auth middleware (authUser / authArtist)
│       ├── models/                # Mongoose schemas (User, Music, Album)
│       ├── routes/                # Express routers
│       └── services/              # Storage service (ImageKit / local upload)
└── frontend/
    └── src/
        ├── components/
        │   ├── common/            # ProtectedRoute
        │   ├── layout/             # Sidebar
        │   └── player/             # MusicPlayer
        ├── pages/
        │   ├── artist/             # Artist dashboard, create album, upload track, my tracks
        │   ├── auth/                # Login/Register page
        │   └── user/                 # Discover, Albums pages
        ├── hooks/                  # useAuth, useMusic, usePlayer
        ├── services/                # API clients (auth, music)
        └── store/                   # Redux store + slices (auth, music, player)
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- A [MongoDB](https://www.mongodb.com/) database (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- *(Optional)* An [ImageKit](https://imagekit.io/) account, if you want uploaded music files stored in the cloud instead of on local disk

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Spotify--clone-main
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
BACKEND_URL=http://localhost:3000

# Optional — only needed for cloud (ImageKit) file storage.
# If omitted, uploaded music files are saved locally in backend/uploads
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

| Variable | Required | Description |
|---|---|---|
| `PORT` | No (defaults to `3000`) | Port the backend server listens on |
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Recommended | Secret used to sign/verify JWTs. Falls back to an insecure default if not set — **always set this in production** |
| `BACKEND_URL` | Recommended | Base URL used to build links to locally-stored uploaded files (e.g. `http://localhost:3000`) |
| `IMAGEKIT_PUBLIC_KEY` | No | ImageKit public key — enables cloud storage for uploads |
| `IMAGEKIT_PRIVATE_KEY` | No | ImageKit private key — enables cloud storage for uploads |
| `IMAGEKIT_URL_ENDPOINT` | No | ImageKit URL endpoint — enables cloud storage for uploads |

Start the backend:

```bash
npm run dev
```

The server runs on whatever `PORT` you set (default **http://localhost:3000**).

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on Vite's default dev port (**http://localhost:5173**, falling back to `5174` if busy — both are already allowed in the backend's CORS config).

## API Overview

### Auth — `/api/auth`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/register` | Register a new user (role: `user` or `artist`) | Public |
| POST | `/login` | Log in with email & password | Public |
| POST | `/logout` | Log out | Public |
| GET | `/me` | Get the logged-in user's details | Private (user or artist) |

### Music — `/api/music`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/upload` | Upload a new music track | Private (artist only) |
| POST | `/album` | Create a new album | Private (artist only) |
| GET | `/` | Get all music tracks | Private (user or artist) |
| GET | `/albums` | Get all albums | Private (user or artist) |
| GET | `/albums/:albumId` | Get a specific album by ID | Private (user or artist) |
| DELETE | `/:id` | Delete a music track | Private (artist only) |

## Notes

- File storage is **automatic and tiered**: if all three `IMAGEKIT_*` variables are set, uploads go to ImageKit; otherwise (or if the ImageKit upload fails), files are saved locally to `backend/uploads` and served via the `/uploads` static route.
- Don't forget to set a strong, random `JWT_SECRET` before deploying — the code currently falls back to a hardcoded development secret if it's missing.
- There's a stray `package copy.json` in the `backend` folder that looks like a backup file — safe to delete if you don't need it.

## License

ISC

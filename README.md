# Modern Notes App
A clean, modern, and minimal Notes Application built using the React + Vite + Tailwind CSS frontend and Node.js + Express + MySQL backend.
Frontend: https://notes-app-p7gu.vercel.app/
Backend: https://notes-app-production-c489.up.railway.app/


## Features
- **Create Notes**: Add new notes with a title and content.
- **Edit Notes**: Update the title and content of existing notes.
- **Delete Notes**: Remove notes you no longer need.
- **Search Notes**: Real-time search by the note's title.
- **Timestamped**: Notes are automatically timestamped with creation date.
- **Minimalist UI**: Built using a modern Tailwind CSS design.

## Prerequisites
- Node.js installed on your machine.
- MySQL installed and running locally.

## Setup Instructions

### 1. Database Configuration
By default, the backend expects a local MySQL instance with:
- **User**: `root`
- **Password**: `password`

If your local MySQL credentials are different:
1. Open `backend/database.js`
2. Update the `dbConfig` object with your correct `user` and `password`.
3. The database `notes_app` and table `notes` will automatically be created on server startup!

### 2. Run Backend
```bash
cd backend
npm install
npm start
```
The Express server will start on `http://localhost:3001`.

### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
The Vite development server will start on `http://localhost:3000`.

Open up `http://localhost:3000` in your browser and start capturing your thoughts!

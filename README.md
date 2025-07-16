# YouTube Clone - Full Stack Video Platform

A complete video sharing platform built with React, Node.js, Express, and MongoDB. Users can register, login, upload videos, and interact with content.

## Features

- **User Authentication** - Register and login with JWT
- **Video Upload** - Upload videos with thumbnails  
- **Video Player** - Watch videos with custom player
- **Channel Management** - Create and manage channels
- **Comments** - Add comments to videos
- **Search** - Search videos by title
- **Responsive Design** - Works on all devices

## Tech Stack

- **Frontend:** React 18, Vite, CSS3
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas)
- **Authentication:** JWT
- **File Upload:** Multer

## Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas account)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/likitha173/YouTube-clone-full-stack-application.git
cd YouTube-clone-full-stack-application
```

2. **Setup Backend**
```bash
cd server
npm install
```

3. **Setup Frontend** 
```bash
cd ../client
npm install
```

4. **Environment Variables**
Create `.env` in server folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
```

Create `.env` in client folder:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

5. **Run the Application**

Backend (Terminal 1):
```bash
cd server
npm start
```

Frontend (Terminal 2):
```bash
cd client
npm run dev
```

6. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## Testing the Application

### Test User Registration
1. Go to http://localhost:5173/register
2. Fill in: Name, Email, Password
3. Click "Register"
4. Should redirect to login page

### Test User Login
1. Go to http://localhost:5173/login
2. Use registered email and password
3. Click "Login"
4. Should redirect to homepage

### Test Video Upload
1. Login first
2. Go to upload page
3. Select video file and thumbnail
4. Add title and description
5. Click "Upload"

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/videos` - Get all videos
- `POST /api/videos` - Upload video
- `GET /api/videos/:id` - Get single video
- `POST /api/comments` - Add comment

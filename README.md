# YouTube Clone - Full Stack Application

A modern video sharing platform built with React, Node.js, Express, and MongoDB.

## 🚀 Features

- User authentication (register/login)
- Video upload and management
- Video player with controls
- Channel creation and editing
- Comment system
- Responsive design

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Vite
- Axios
- CSS3

**Backend:**
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Multer (file uploads)

## 📋 Setup Instructions

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd youtube-clone
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create `.env` file in server directory:
```env
MONGODB_URI=mongodb://localhost:27017/youtube-clone
JWT_SECRET=your-secret-key
PORT=5000
```

Start server:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd client
npm install
```

Create `.env` file in client directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start client:
```bash
npm run dev
```

## 📱 Usage

1. Register/Login to create account
2. Upload videos with title and description
3. Browse and watch videos
4. Create and manage your channel
5. Comment on videos

## 🌐 API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/videos` - Get all videos
- `POST /api/videos` - Upload video
- `GET /api/comments/:videoId` - Get comments
- `POST /api/comments/:videoId` - Add comment


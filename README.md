# VideoStream - Full Stack Video Platform

A modern, full-featured video sharing platform built with the MERN stack (MongoDB, Express.js, React, Node.js). This application provides a complete video streaming experience with user authentication, video management, and social interactions.

## ✨ Key Features

### 🎬 Video Management
- **Video Upload & Streaming** - Upload videos with custom thumbnails and metadata
- **Video Player** - Custom video player with controls and responsive design  
- **Video Categories** - Organize content by categories (Education, Gaming, Music, etc.)
- **Search Functionality** - Search videos by title, description, and tags
- **Video Analytics** - Track views and engagement metrics

### 👤 User System
- **User Authentication** - Secure JWT-based registration and login
- **Channel Management** - Personal channels with customizable profiles
- **Video Management** - Upload, edit, and delete your own videos
- **User Dashboard** - Manage your content and account settings

### 🔗 Social Features  
- **Comment System** - Add, edit, and delete comments on videos
- **Like/Dislike System** - Express opinions on videos and comments
- **Responsive Design** - Optimized for all device sizes
- **Real-time Updates** - Dynamic content loading and updates

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **React Router** - Client-side routing and navigation
- **Axios** - HTTP client for API communication
- **Vite** - Fast build tool and development server
- **CSS3** - Custom styling with responsive design

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for data storage
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Multer** - File upload handling
- **bcryptjs** - Password hashing and security

## 📋 Prerequisites

Before running this application, make sure you have the following installed:
- **Node.js** (version 14.0.0 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** (for cloning the repository)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/videostream-platform.git
cd videostream-platform
```

### 2. Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure your environment variables in .env:
# MONGODB_URL=mongodb://localhost:27017/videostream
# JWT_SECRET=your_jwt_secret_key_here
# PORT=5000

# Start the backend server
npm start
```

### 3. Frontend Setup
```bash
# Open new terminal and navigate to client directory
cd client

# Install dependencies  
npm install

# Start the development server
npm run dev
```

### 4. Database Setup
- Start MongoDB service on your machine
- The application will automatically create the database and collections

## 📱 Application Structure

```
videostream-platform/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context for state
│   │   ├── services/      # API service functions
│   │   └── assets/        # Static assets
│   └── public/            # Public files
└── server/                # Node.js backend
    ├── src/
    │   ├── controllers/   # Request handlers
    │   ├── models/        # Database models
    │   ├── routes/        # API routes
    │   ├── middleware/    # Custom middleware
    │   └── utils/         # Utility functions
    └── uploads/          # File upload storage
```

## 🔧 Available Scripts

### Frontend (Client)
```bash
npm run dev      # Start development server
npm run build    # Build for production  
npm run preview  # Preview production build
```

### Backend (Server)
```bash
npm start        # Start production server
npm run dev      # Start development server with nodemon
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Videos
- `GET /api/videos` - Get all videos
- `POST /api/videos` - Upload new video
- `GET /api/videos/:id` - Get specific video
- `PUT /api/videos/:id` - Update video
- `DELETE /api/videos/:id` - Delete video

### Comments
- `GET /api/comments/:videoId` - Get video comments
- `POST /api/comments` - Add new comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

## 🎯 Core Functionality

### Video Upload Process
1. User selects video file and thumbnail
2. File validation and processing
3. Metadata extraction and storage
4. Database record creation
5. File storage to server

### Authentication Flow
1. User registration with email verification
2. Secure password hashing
3. JWT token generation
4. Protected route access
5. Token refresh mechanism

### Search & Discovery
1. Text-based search across titles and descriptions
2. Category-based filtering
3. Responsive grid layout
4. Infinite scroll loading
5. Search result optimization

## 🔒 Security Features

- **Password Hashing** - bcryptjs for secure password storage
- **JWT Authentication** - Secure token-based authentication
- **Input Validation** - Server-side validation for all inputs
- **File Upload Security** - File type and size validation
- **CORS Configuration** - Proper cross-origin resource sharing

## 📈 Performance Optimizations

- **Lazy Loading** - Components and images load on demand
- **Code Splitting** - Optimized bundle sizes
- **Caching** - Strategic caching for better performance
- **Responsive Images** - Optimized image delivery
- **Database Indexing** - Optimized database queries

## � Troubleshooting

### Common Issues

**MongoDB Connection Error:**
```bash
# Make sure MongoDB is running
sudo systemctl start mongod

# Check connection string in .env file
MONGODB_URL=mongodb://localhost:27017/videostream
```

**Port Already in Use:**
```bash
# Kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in .env file
PORT=5001
```

**File Upload Issues:**
```bash
# Check uploads directory permissions
chmod 755 server/uploads
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Thanks to the MongoDB team for excellent database technology
- React community for comprehensive documentation
- Express.js for the robust backend framework
- All contributors who helped improve this project

---

**Built with ❤️ using the MERN Stack**

### Clone the Repository
```bash
git clone <repository-url>
cd youtube-tuto-davs-tube-ui
```

### Backend Setup
1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory with the following variables:
```env
JWT_SECRET=your_jwt_secret_key
MONGO_URI=your_mongodb_connection_string
SERVER_PORT=5000
CLIENT_URL=http://localhost:5173
```

4. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup
1. Open a new terminal and navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The client will run on `http://localhost:5173`

## 🗂️ Project Structure

```
youtube-tuto-davs-tube-ui/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── comments/   # Comment system
│   │   │   ├── custom/     # Custom components (Avatar, VideoPlayer)
│   │   │   ├── filters/    # Category filters
│   │   │   ├── navbar/     # Navigation components
│   │   │   ├── sidebar/    # Sidebar component
│   │   │   └── videos/     # Video-related components
│   │   ├── pages/          # Page components
│   │   │   ├── home/       # Homepage
│   │   │   ├── video/      # Video player page
│   │   │   ├── channel/    # Channel management
│   │   │   ├── login/      # Authentication pages
│   │   │   ├── search/     # Search results
│   │   │   └── upsert/     # Video upload/edit
│   │   ├── context/        # React Context for state management
│   │   ├── services/       # API service functions
│   │   └── assets/         # Static assets
│   └── public/             # Public assets
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── helps/          # Utility functions
│   │   └── assets/         # Uploaded files storage
│   └── package.json
└── README.md
```

## 🎯 Key Features Explained

### User Authentication
- JWT-based authentication system
- Secure password hashing with bcryptjs
- Protected routes for authenticated users only
- User session management with HTTP-only cookies

### Video Management
- Upload videos with metadata (title, description, category, tags)
- Edit existing videos (title, description, thumbnail)
- Delete videos with confirmation
- Category-based organization
- View count tracking

### Comment System
- Add comments to videos
- Edit and delete own comments
- Like/dislike comments
- Real-time comment updates
- User profile integration

### Search & Filtering
- Search videos by title
- Filter by categories
- Combined search and category filtering
- Responsive filter interface

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interface
- Adaptive layouts

## 🚧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - User logout

### Videos
- `GET /api/videos` - Get all videos (with search and category filters)
- `GET /api/videos/:id` - Get single video
- `POST /api/videos` - Create new video (authenticated)
- `PUT /api/videos/:id` - Update video (authenticated)
- `DELETE /api/videos/:id` - Delete video (authenticated)
- `PUT /api/videos/like/:videoId` - Like video (authenticated)
- `PUT /api/videos/dislike/:videoId` - Dislike video (authenticated)
- `GET /api/videos/categories` - Get available categories

### Comments
- `GET /api/comments/:videoId` - Get comments for video
- `POST /api/comments/:videoId` - Add comment (authenticated)
- `PUT /api/comments/:id` - Update comment (authenticated)
- `DELETE /api/comments/:id` - Delete comment (authenticated)
- `PUT /api/comments/like/:id` - Like comment (authenticated)
- `PUT /api/comments/dislike/:id` - Dislike comment (authenticated)

### Channels
- `GET /api/channels/:id` - Get channel details
- `PUT /api/channels/:id` - Update channel (authenticated)
- `PUT /api/channels/subscribe/:id` - Subscribe to channel (authenticated)
- `PUT /api/channels/unsubscribe/:id` - Unsubscribe from channel (authenticated)

### File Uploads
- `POST /api/uploads/videos` - Upload video file
- `POST /api/uploads/covers` - Upload thumbnail
- `POST /api/uploads/profiles` - Upload profile picture
- `POST /api/uploads/banners` - Upload channel banner

## 🎨 UI/UX Features

### Modern Design
- Clean, YouTube-inspired interface
- Dark/light theme support
- Smooth animations and transitions
- Intuitive navigation

### Accessibility
- Keyboard navigation support
- Screen reader friendly
- High contrast mode
- Focus indicators

### Performance
- Lazy loading of components
- Optimized images
- Efficient state management
- Fast search and filtering

## 📱 Responsive Breakpoints

- **Mobile**: < 600px
- **Tablet**: 600px - 900px
- **Desktop**: > 900px

## 🔐 Security Features

- JWT token authentication
- Password hashing
- Protected routes
- File upload validation
- CORS configuration
- Input sanitization

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
1. Set environment variables
2. Configure MongoDB Atlas
3. Deploy with build command: `npm start`

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Set environment variables
3. Deploy the `dist` folder

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🎥 Demo

[Add link to demo video here]

## 📧 Contact

[Add your contact information here]

---

**Note**: This project is for educational purposes and demonstrates full-stack development skills using the MERN stack.

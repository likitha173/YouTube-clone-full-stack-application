import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/home/Home";
import Video from "./pages/video/Video";
import Channel from "./pages/channel/Channel";
import Upsert from "./pages/upsert/Upsert";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "./context/AppContext";
import { getChannelAsync } from "./services/services";
import Search from "./pages/search/Search";
import ErrorBoundary from "./components/ErrorBoundary";

/* 
USAGE EXAMPLE FOR VIDEO EDITING:

1. For channel owners - VideoCard automatically shows edit options:
   <VideoCard 
     video={videoData} 
     showEditOption={true} 
     onVideoUpdate={handleVideoUpdate} 
   />

2. The VideoCard component will show edit/delete options if:
   - User is the video owner (channelId matches authenticated user)
   - showEditOption prop is set to true

3. Edit modal features:
   - Title editing (max 100 characters)
   - Description editing (max 5000 characters)
   - Category selection
   - Tags management
   - Visibility settings (public/unlisted/private)
   - Custom thumbnail upload
   - Comment/rating permissions

4. API endpoints needed on the server:
   - PUT /videos/:id - Update video details
   - DELETE /videos/:id - Delete video

5. The onVideoUpdate callback receives:
   - (updatedVideo, null) for successful updates
   - (null, deletedVideoId) for deletions
*/

export default function App() {
  const { state, loadChannelInfos } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getChannelInfos();
  }, [state?.auth]);

  const getChannelInfos = async () => {
    if (!state?.auth) return;

    try {
      setLoading(true);
      setError(null);
      const res = await getChannelAsync(state.auth.id);
      if (res.status === 200) {
        loadChannelInfos(res.data);
      }
    } catch (error) {
      console.error("Failed to load channel info:", error);
      setError(error.message || "Failed to load channel information");

      // If unauthorized, clear auth and redirect to login
      if (error.response?.status === 401) {
        localStorage.removeItem('auth');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className={`app ${state?.theme}`}>
        <BrowserRouter>
          <Navbar />
          {error && (
            <div className="app-error-banner">
              <span>⚠️ {error}</span>
              <button onClick={() => setError(null)}>✕</button>
            </div>
          )}
          <Routes>
            <Route path="/">
              <Route index element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="videos">
                <Route path=":id" element={<Video />} />
              </Route>
              <Route path="channel">
                <Route path=":id" element={<Channel />} />
              </Route>
              <Route path="upload" element={state?.auth ? <Upsert /> : <Navigate to="/login" replace />} />
              <Route path="login" element={!state?.auth ? <Login /> : <Navigate to="/" replace />} />
              <Route path="register" element={!state?.auth ? <Register /> : <Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </ErrorBoundary>
  );
}

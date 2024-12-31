import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Auth from "./components/Auth";
import AdminDashboard from "./components/AdminDashbaord";
import UserDashboard from "./components/UserDashbaord";
import Profile from "./components/Profile";
import Home from "./components/Home";
import ProtectedRoute from "./ProtactedRoute";
import VideoDetail from "./components/VideoList";
import InfiniteVideoList from "./components/videoFeed";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/list" element={<InfiniteVideoList/>}/>
          <Route exact path="/login" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<UserDashboard />} />} />
          <Route path="/video/:id" element={<VideoDetail />} />
        </Routes>
        <ToastContainer
         position="top-right"
         autoClose={3000} 
         hideProgressBar={false}
         closeOnClick
         rtl={false}
        />
      </div>
    </Router>
  );
}

export default App;

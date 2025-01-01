import React, { useState } from "react";
import {  useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { uploadVideo } from "../services/api";
import Loader from "./Loader";

const AdminDashboard = () => {
  const [formData, setFormData] = useState({ title: "", hashtags: "" });
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleVideoSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.size > 524288000) {
      toast.error('Video size must be less than 500MB');
      return;
    }
    setVideo(file);
  };

  const handleVideoUpload = async (e) => {
    e.preventDefault();
    if (!video) {
      toast.error('Please select a video first');
      return;
    }
    setUploading(true);
    const form = new FormData();
    form.append("title", formData.title);
    form.append("hashtags", formData.hashtags);
    form.append("video", video);

    try {
      await uploadVideo(form);
      toast.success("Video uploaded successfully!");
      setUploading(false);
      navigate("/admin");
  } catch (err) {
      toast.error("Error uploading video");
      setUploading(false);
  } finally {
      setUploading(false); 
  }
  };

  return (
    <div className="container mx-auto p-4">
       {uploading && <Loader />}
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      <form onSubmit={handleVideoUpload} className="mt-4">
        <input
          type="text"
          name="title"
          placeholder="Video Title"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          value={formData.title}
          required
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          name="hashtags"
          placeholder="Hashtags (comma separated)"
          onChange={(e) => setFormData({ ...formData, hashtags: e.target.value })}
          value={formData.hashtags}
          className="border p-2 mb-2 w-full"
        />
        <input
         type="file"
          accept="video/*"
          onChange={handleVideoSelect}
          className="border p-2 mb-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full mt-2">
          Upload Video
        </button>
      </form>
    </div>
  );
};

export default AdminDashboard;

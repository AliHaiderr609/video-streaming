import React, { useState } from "react";
import { uploadVideo } from "../services/api";
import {  useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [formData, setFormData] = useState({ title: "", hashtags: "" });
  const [videoFile, setVideoFile] = useState(null);
  const navigate = useNavigate();

  const handleVideoUpload = async (e) => {
    e.preventDefault();
    if (!videoFile) return alert("Please choose a video file.");
    const form = new FormData();
    form.append("title", formData.title);
    form.append("hashtags", formData.hashtags);
    form.append("video", videoFile);

    try {
      await uploadVideo(form);
      toast.success("Video uploaded successfully!");
      navigate("/admin");
    } catch (err) {
      toast.error("Error uploading video");
    }
  };

  return (
    <div className="container mx-auto p-4">
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
          name="video"
          onChange={(e) => setVideoFile(e.target.files[0])}
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

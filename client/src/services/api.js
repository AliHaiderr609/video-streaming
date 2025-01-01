import axios from "axios";

const API = axios.create({ baseURL:"https://mern-stream-hjefg9e9cfa5fjhz.eastus-01.azurewebsites.net" });
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) req.headers.authorization = `Bearer ${token}`;
    return req;
});

export const signup = (data) => API.post("/api/auth/signup", data);
export const login = (data) => API.post("/api/auth/login", data);
export const getUserProfile = () => API.get("/api/auth/profile");
export const updateUserProfile = (formData) => API.put("/api/auth/update", formData);
export const getVideos = () => API.get("/api/videos/");
export const getVideoDetails = (id) => API.get(`/api/videos/get?id=${id}`);
export const uploadVideo = (data) => API.post("/api/videos/upload", data);
export const addComment = (data) => API.post("/api/comments/add", data);
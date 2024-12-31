import React, { useState, useEffect } from "react";
import { addComment, getVideos } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { FixedSizeList as List } from "react-window";
import { toast } from "react-toastify";

// Utility function to filter classes
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data } = await getVideos();
        setVideos(data);
      } catch (error) {
        toast.error("Failed to load videos");
      }
    };
    fetchVideos();
  }, []);

  const handleAddComment = async (videoId, comment) => {
    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const payload = { videoId, comment };
      await addComment(payload);

      // Update comments locally after successful API call
      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video?._id === videoId
            ? {
                ...video,
                comments: [
                  ...video?.comments,
                  { comment, userId: { username: "You" } },
                ],
              }
            : video
        )
      );
      toast.success("Comment added successfully!");
    } catch (error) {
      toast.error("Error adding comment:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle user sign-out
  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("You have been signed out.");
  };

  // Render a single video item
  const renderVideo = ({ index, style }) => {
    const video = videos[index];
    return (
      <div
        key={video?._id}
        style={style} // Required for proper positioning
        className="bg-white shadow rounded-lg overflow-hidden p-4"
      >
        <h3 className="text-lg font-semibold">{video?.title}</h3>
        <video
          controls
          className="mt-4 w-full rounded-md"
          src={video?.url}
        >
          Your browser does not support the video tag.
        </video>
        <p className="mt-2 text-sm text-gray-600">{video?.hashtags}</p>
        <Link
          to={`/video/${video?._id}`}
          className="text-blue-500 text-sm"
        >
          View More
        </Link>
        <div className="border-t mt-4 pt-4">
          <h4 className="text-md font-semibold">Comments</h4>
          <ul className="mt-2 space-y-2 text-sm text-gray-600">
            {video?.comments?.map((comment, index) => (
              <li key={index} className="border-b pb-1">
                <strong>{comment?.userId?.username || "Anonymous"}:</strong>{" "}
                {comment?.comment}
              </li>
            ))}
          </ul>
          <form
            className="mt-4 flex"
            onSubmit={(e) => {
              e.preventDefault();
              const comment = e.target.comment.value;
              handleAddComment(video._id, comment);
              e.target.comment.value = "";
            }}
          >
            <input
              type="text"
              name="comment"
              className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Add a comment"
            />
            <button
              type="submit"
              className="ml-2 bg-indigo-600 text-white px-3 py-2 rounded-md shadow-sm hover:bg-indigo-500"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h1>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-7xl m px-4 py-6 sm:px-6 lg:px-8 h-full">
          {videos.length > 0 ? (
            <List
              height={window.innerHeight - 160} 
              itemCount={videos?.length} 
              itemSize={850} 
              width="100%"
            >
              {renderVideo}
            </List>
          ) : (
            <p className="text-center text-gray-500">No videos available</p>
          )}
        </div>
      </main>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import { getVideoDetails, addComment } from "../services/api"; 
import { toast } from "react-toastify"; 
import Loader from "./Loader";

const VideoDetail = () => {
  const { id } = useParams(); 
  const [video, setVideo] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingVideo, setFetchingVideo] = useState(true); 

  useEffect(() => {
    const fetchVideoDetails = async () => {
      setFetchingVideo(true);
      try {
        const { data } = await getVideoDetails(id);
        setVideo(data); 
        setComments(data?.comments || []); 
      } catch (error) {
        toast.error("Error fetching video details");
      } finally {
        setFetchingVideo(false); 
      }
    };

    fetchVideoDetails();
  }, [id]);

  // Handle submitting a new comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment) return; 

    try {
      setLoading(true);
      const { data } = await addComment({ videoId: id, comment });
      setComments((prevComments) => [...prevComments, data?.comment]);
      setComment(""); 
    } catch (error) {
      toast.error("Error adding comment");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingVideo) return <Loader />;

  return (
    <div className="container mx-auto p-4">
      {/* Video Section */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
        <h2 className="text-2xl font-bold mb-4">{video?.title}</h2>
        <div className="relative pb-[56.25%]">
          <video
            controls
            className="absolute top-0 left-0 w-full h-full"
            src={video?.url} 
            type="video/mp4"
          >
            Your browser does not support the video tag.
          </video>
        </div>
        <p className="text-gray-600 mt-2">{video?.hashtags}</p>
      </div>

      {/* Comments Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Comments</h3>

        {/* Existing comments */}
        <div className="space-y-4 mb-8">
          {comments.length === 0 && <p>No comments yet</p>}
          {comments?.map((comment, index) => (
            <div key={index} className="border-b pb-2 mb-2">
              <p>{comment?.comment}</p>
            </div>
          ))}
        </div>

        {/* Add Comment Form */}
        <form onSubmit={handleCommentSubmit} className="mt-4">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment"
            className="border p-2 mb-2 w-full"
          />
          <button
            type="submit"
            className={`bg-blue-500 text-white p-2 mt-2 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? "Posting..." : "Add Comment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VideoDetail;

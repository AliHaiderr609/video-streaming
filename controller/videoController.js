const mongoose = require('mongoose')
const Video = require('../models/video.model');
const Comment = require('../models/comment.model'); 

// Upload Video
exports.uploadVideo = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send("Unauthorized");
    }

    const { title, hashtags } = req.body;
    // Construct the video URL
    const videoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const video = await Video.create({
        title,
        hashtags,
         url: videoUrl
    });

    res.status(201).json(video);
};

// Get All Videos
exports.getVideos = async (req, res) => {
    try {
        const videos = await Video.find();

        const videosWithComments = await Promise.all(
            videos.map(async (video) => {
                const comments = await Comment.find({ videoId: video._id })
                    .populate('userId') 
                    .select('comment userId videoId');
                return {
                    ...video._doc,
                    url: `${req.protocol}://${req.get('host')}${video.url}`,
                    comments: comments, // Attach comments to the video
                };
            })
        );

        res.status(200).json(videosWithComments);
    } catch (error) {
        res.status(500).json({ message: "An unexpected error occurred while retrieving videos." });
    }
};

// Fetch video details by video ID, including comments
exports.getVideoDetails = async (req, res) => {
    try {
      const videoId = req.query.id;
  
      // Use aggregation to get the video details along with the comments
      const video = await Video.aggregate([
        {
          $match: { _id: mongoose.Types.ObjectId(videoId) } // Match the video by its ID
        },
        {
          $lookup: {
            from: 'comments', // Name of the Comment collection
            localField: '_id', // Local field in Video (foreign key)
            foreignField: 'videoId', // Field in Comment that references Video
            as: 'comments' // Alias for the resulting array of comments
          }
        },
        {
          $project: {
            title: 1,
            url: 1,
            hashtags: 1,
            comments: 1 // Only include necessary fields, including comments
          }
        }
      ]);
  
      // Check if video is found
      if (!video || video.length === 0) {
        return res.status(404).json({ message: 'Video not found' });
      }
  
      // Ensure the URL is absolute
      if (video[0].url && !video[0].url.startsWith('http')) {
        video[0].url = new URL(video[0].url, `${req.protocol}://${req.get('host')}`).href;
      }
  
      // Send the video with comments in the response
      res.status(200).json(video[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching video details' });
    }
  };
  

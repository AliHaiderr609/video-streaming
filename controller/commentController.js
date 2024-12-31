const Comment = require('../models/comment.model');
const Video = require('../models/video.model');

// Add Comment
exports.addComment = async (req, res) => {
    try{
    const { videoId,  comment } = req.body;
    const userId = req.user.id;

    const video = await Video.findById(videoId);
    if (!video) {
        return res.status(404).send("Video not found");
    }

    const newComment = await Comment.create({ videoId, userId, comment });
    res.status(201).json(newComment);
}catch(error){
    res.status(500).json({ message: error });
}
};

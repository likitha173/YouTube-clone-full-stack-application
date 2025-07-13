const Comment = require("../models/Comment");
const Channel = require("../models/Channel");
const Video = require("../models/Video");

const getComments = async (req, res, next) => {
    try {
        const videoId = req.params.videoId;
        const comments = await Comment.find({ videoId }).sort({ createdAt: -1 });

        const l_comments = await fetchChannelInfos(comments);
        res.status(200).json(l_comments);
    } catch (error) {
        next(error);
    }
};

const createComment = async (req, res, next) => {
    try {
        const channelId = req.channel.id;
        const videoId = req.params.videoId;

        const newComment = new Comment({
            channelId,
            videoId,
            desc: req.body.desc
        });

        const savedComment = await newComment.save();

        // Add comment to video
        await Video.findByIdAndUpdate(videoId, {
            $push: { comments: savedComment._id.toString() }
        });

        const l_channel = await Channel.findById(channelId);
        const { _id, ...channel } = l_channel._doc;

        res.status(200).json({ ...savedComment._doc, ...channel });
    } catch (error) {
        next(error);
    }
};

const updateComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json("Comment not found");

        if (req.channel.id === comment.channelId) {
            const updatedComment = await Comment.findByIdAndUpdate(
                req.params.id,
                { $set: { desc: req.body.desc } },
                { new: true }
            );

            const l_channel = await Channel.findById(comment.channelId);
            const { _id, ...channel } = l_channel._doc;

            res.status(200).json({ ...updatedComment._doc, ...channel });
        } else {
            return res.status(403).json("You can only update your own comments.");
        }
    } catch (error) {
        next(error);
    }
};

const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json("Comment not found");

        if (req.channel.id === comment.channelId) {
            // Remove comment from video
            await Video.findByIdAndUpdate(comment.videoId, {
                $pull: { comments: comment._id.toString() }
            });

            await comment.deleteOne();
            res.status(200).json("Comment has been deleted.");
        } else {
            return res.status(403).json("You can only delete your own comments.");
        }
    } catch (error) {
        next(error);
    }
};

const likeComment = async (req, res, next) => {
    try {
        const channelId = req.channel.id;
        const commentId = req.params.id;

        await Comment.findByIdAndUpdate(commentId, {
            $addToSet: { likes: channelId },
            $pull: { dislikes: channelId },
        });

        res.status(200).json("Comment liked.");
    } catch (error) {
        next(error);
    }
};

const dislikeComment = async (req, res, next) => {
    try {
        const channelId = req.channel.id;
        const commentId = req.params.id;

        await Comment.findByIdAndUpdate(commentId, {
            $addToSet: { dislikes: channelId },
            $pull: { likes: channelId },
        });

        res.status(200).json("Comment disliked.");
    } catch (error) {
        next(error);
    }
};

const fetchChannelInfos = async (comments) => {
    let results = [];

    if (comments.length == 0) return results;

    for (const comment of comments) {
        const l_channel = await Channel.findById(
            comment.channelId,
            "name profile"
        ).exec();

        const { _id, ...channel } = l_channel._doc;
        results.push({ ...comment._doc, ...channel });
    }

    return results;
};

module.exports = {
    getComments,
    createComment,
    updateComment,
    deleteComment,
    likeComment,
    dislikeComment,
};

const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema(
  {
    channelId: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    category: { type: String, default: "General" },
    tags: { type: [String], default: [] },
    cover: { type: String },
    videoUrl: { type: String, required: true },
    views: { type: Number, default: 0 },
    likes: { type: [String], default: [] },
    dislikes: { type: [String], default: [] },
    comments: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", VideoSchema);

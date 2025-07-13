const express = require("express");
const controller = require("../controllers/commentController");
const verifyToken = require("../helps/verify");

const router = express.Router();

router.get("/:videoId", controller.getComments);
router.post("/:videoId", verifyToken, controller.createComment);
router.put("/:id", verifyToken, controller.updateComment);
router.delete("/:id", verifyToken, controller.deleteComment);
router.put("/like/:id", verifyToken, controller.likeComment);
router.put("/dislike/:id", verifyToken, controller.dislikeComment);

module.exports = router;

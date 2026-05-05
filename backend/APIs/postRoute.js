import exp from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'
import { PostModel } from '../models/PostModel.js'
import { UserModel } from "../models/UserModel.js";
import { get } from 'mongoose';

export const postRoute = exp.Router()

// Create a new post
postRoute.post("/createpost", verifyToken, async (req, res, next) => {
    try {
        const userId = req.user.id;
        // manually verify user exists and is not blocked — we need to check isBlocked before allowing post creation, but verifyToken doesn't check that
        const user = await UserModel.findById(userId);
        if (!user || user.isBlocked) {
            return res.status(403).json({ message: "User not found or is blocked" });
        }
        // taking what is needed from req.body instead of spreading everything
        const { description, mediaUrl } = req.body;

        if (!description) {
            return res.status(400).json({ message: "Description is required" });
        }

        const newPost = new PostModel({
            userId: userId,
            description: description,
            mediaUrl: mediaUrl || null
        });

        await newPost.save();

        return res.status(201).json({ message: "Post created successfully", payload: newPost });

    } catch (err) {
        next(err);
    }
});

// View a post by id
postRoute.get('/viewpost/:id', verifyToken, async (req, res, next) => {
    try {
        const postId = req.params.id;

        const postObj = await PostModel.findById(postId).populate("userId", "username firstName lastName profileImageUrl");

        if (!postObj) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (postObj.isDeleted === true) {
            return res.status(404).json({ message: "The post is deleted by the user" });
        }

        const postOwner = await UserModel.findById(postObj.userId);

        if (postOwner.isDeactivated || postOwner.isBlocked) {
        return res.status(403).json({
            message: "Cannot view this post"
        });
        }

        return res.status(200).json({ message: "Post fetched successfully", payload: postObj });

    } catch (err) {
        next(err);
    }
});

// Soft delete a post
postRoute.delete('/delpost/:id', verifyToken, async (req, res, next) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        const postObj = await PostModel.findById(postId);

        if (!postObj || postObj.isDeleted === true) {
            return res.status(404).json({ message: "The post is no longer available" });
        }

        if (postObj.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this post" });
        }

        await PostModel.findByIdAndUpdate(postId, { isDeleted: true }, { new: true });

        return res.status(200).json({ message: "Post has been deleted successfully" });

    } catch (err) {
        next(err);
    }
});

// Recover a soft-deleted post
postRoute.patch('/recover/:id', verifyToken, async (req,res)=>{
  const post = await PostModel.findById(req.params.id);

  if (post.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await PostModel.findByIdAndUpdate(post._id, { isDeleted: false });

  res.json({ message: "Post recovered" });
});

// Like a post
postRoute.patch('/likepost/:id', verifyToken, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;

        const postObj = await PostModel.findById(postId);

        if (!postObj) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (postObj.isDeleted === true) {
            return res.status(400).json({ message: "Cannot like a deleted post" });
        }

        const postOwner = await UserModel.findById(postObj.userId);

        if (postOwner.isDeactivated || postOwner.isBlocked) {
        return res.status(403).json({
            message: "Cannot interact with this post"
        });
        }

        const alreadyLiked = postObj.likes.some(
            like => like.userId.toString() === userId.toString()
        );

        if (alreadyLiked) {
            return res.status(400).json({ message: "You have already liked this post" });
        }

        postObj.likes.push({ userId: userId });
        postObj.likeCount += 1;
        await postObj.save();

        return res.status(200).json({ message: "Liked the post" });

    } catch (err) {
        next(err);
    }
});

// Unlike a post
postRoute.patch('/unlikepost/:id', verifyToken, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;

        const postObj = await PostModel.findById(postId);

        if (!postObj) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (postObj.isDeleted === true) {
            return res.status(400).json({ message: "Cannot unlike a deleted post" });
        }

        const postOwner = await UserModel.findById(postObj.userId);

        if (postOwner.isDeactivated || postOwner.isBlocked) {
        return res.status(403).json({
            message: "Cannot interact with this post"
        });
        }

        const isLiked = postObj.likes.some(
            like => like.userId.toString() === userId.toString()
        );

        if (!isLiked) {
            return res.status(400).json({ message: "You have not liked this post" });
        }

        postObj.likes = postObj.likes.filter(
            like => like.userId.toString() !== userId.toString()
        );

        postObj.likeCount -= 1;
        await postObj.save();

        return res.status(200).json({ message: "Unliked the post" });

    } catch (err) {
        next(err);
    }
});

// Add a comment
postRoute.post('/comment/:id', verifyToken, async (req, res, next) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;
        const { comment } = req.body;

        if (!comment || comment.trim() === "") {
            return res.status(400).json({ message: "Comment cannot be empty" });
        }

        const postObj = await PostModel.findById(postId);

        if (!postObj) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (postObj.isDeleted === true) {
            return res.status(400).json({ message: "Cannot comment on a deleted post" });
        }

        const postOwner = await UserModel.findById(postObj.userId);

        if (postOwner.isDeactivated || postOwner.isBlocked) {
        return res.status(403).json({
            message: "Cannot interact with this post"
        });
        }

        postObj.comments.push({
            userId: userId,
            comment: comment,
        });
        postObj.commentCount += 1;
        await postObj.save();

        return res.status(200).json({ message: "Comment added successfully" });

    } catch (err) {
        next(err);
    }
});

// Delete a comment
postRoute.delete('/delcomment/:postId/:commentId', verifyToken, async (req, res, next) => {
    try {
        const { postId, commentId } = req.params;
        const userId = req.user.id;

        const postObj = await PostModel.findById(postId);

        if (!postObj) {
            return res.status(404).json({ message: "Post not found" });
        }

        const targetComment = postObj.comments.find(
            c => c.id.toString() === commentId.toString()
        );

        if (!targetComment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (targetComment.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this comment" });
        }

        const postOwner = await UserModel.findById(postObj.userId);

        if (postOwner.isDeactivated || postOwner.isBlocked) {
        return res.status(403).json({
            message: "Cannot interact with this post"
        });
        }

        postObj.comments = postObj.comments.filter(
            c => c.id.toString() !== commentId.toString()
        );

        postObj.commentCount -= 1;
        await postObj.save();

        return res.status(200).json({ message: "Comment deleted successfully" });

    } catch (err) {
        next(err);
    }
});

// FOLLOWING FEED — posts from users you follow, newest first
postRoute.get("/feed", verifyToken, async (req, res, next) => {
    try {
        const followingIds = req.user.following.map((f) => f.userId);

        if (followingIds.length === 0) {
            return res.status(200).json({
                message: "You are not following anyone yet",
                payload: [],
            });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await PostModel.find({
            userId: { $in: followingIds },
            isDeleted: false,
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("userId", "username firstName lastName profileImageUrl");

        return res.status(200).json({
            message: "Feed fetched successfully",
            payload: posts,
            page,
            limit,
        });
    } catch (err) {
        next(err);
    }
});

// EXPLORE FEED — all posts from everyone, newest first
postRoute.get("/explore", verifyToken, async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await PostModel.find({ isDeleted: false })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate({path: "userId", match: { isDeactivated: false, isBlocked: false }, select: "username firstName lastName profileImageUrl"});

        const filteredPosts = posts.filter(p => p.userId !== null);

        return res.status(200).json({
            message: "Explore feed fetched successfully",
            payload: filteredPosts,
            page,
            limit,
        });
    } catch (err) {
        next(err);
    }
});

// Get likes of a post 
postRoute.get('/likes/:id', verifyToken, async (req, res, next) => {
    try {
        const postObj = await PostModel.findById(req.params.id)
            .populate("likes.userId", "username firstName lastName profileImageUrl");

        if (!postObj || postObj.isDeleted) return res.status(404).json({ message: "Post not found" });

        return res.status(200).json({ message: "Likes list", payload: postObj.likes });
    } catch (err) { next(err); }
});

// Get comments of a post
postRoute.get('/comments/:id', verifyToken, async (req, res, next) => {
    try {
        const postObj = await PostModel.findById(req.params.id)
            .populate("comments.userId", "username firstName lastName profileImageUrl");

        if (!postObj || postObj.isDeleted) return res.status(404).json({ message: "Post not found" });

        return res.status(200).json({ message: "Comments list", payload: postObj.comments });
    } catch (err) { next(err); }
});
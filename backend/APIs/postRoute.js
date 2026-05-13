import exp from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'
import { PostModel } from '../models/PostModel.js'
import { UserModel } from '../models/UserModel.js'
import { upload } from '../config/multer.js'
import { uploadToCloudinary } from '../config/cloudinaryUpload.js'
import cloudinary from '../config/cloudinary.js'
import { NotificationModel } from '../models/NotificationModel.js'
 
export const postRoute = exp.Router()
 
// Create a new post
postRoute.post("/createpost", verifyToken, upload.single('mediaUrl'), async (req, res, next) => {
    let cloudinaryResult = null;
    try {
        const userId = req.user.id;
        const { description, scheduledDate } = req.body;
        if ((!description || description.trim() === "") && !req.file) {
            return res.status(400).json({ message: "Description is required" });
        }
        let mediaUrl = null;
        let isScheduled = false;
        let isPublished = true;
        let scheduledFor = null;
        if (scheduledDate) {
            const parsedDate = new Date(scheduledDate);
            if (isNaN(parsedDate.getTime())) {
                return res.status(400).json({message:"Invalid schedule date"});
            }
            if (parsedDate <= new Date()) {
                return res.status(400).json({message:"Schedule time must be in future"});
            }
            isScheduled = true;
            isPublished = false;
            scheduledFor = parsedDate;
        }
        if (req.file) {
            cloudinaryResult = await uploadToCloudinary(req.file.buffer);
            mediaUrl = cloudinaryResult.secure_url;
        }
        const newPost = new PostModel({
            userId: userId,
            description: description?.trim() || "",
            mediaUrl: mediaUrl,
            isScheduled,
            scheduledFor,
            isPublished
        });
        await newPost.save();
        const populatedPost = await PostModel.findById(newPost._id)
                .populate( "userId", "username firstName lastName profileImageUrl" );
        return res.status(201).json({ message: "Post created successfully", payload: populatedPost });
    } catch (err) {
        if (cloudinaryResult?.public_id) {
            await cloudinary.uploader.destroy(cloudinaryResult.public_id);
        } next(err);
    }
});

// EDIT A POST — only owner can edit, only description can be changed
postRoute.patch('/editpost/:id', verifyToken, async (req, res, next) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;
        const { description, scheduledDate, removeSchedule, publishNow } = req.body;
        const hasDescription = typeof description === "string";
        if (
            !description &&
            !scheduledDate &&
            removeSchedule !== "true" &&
            publishNow !== "true"
        ) {
            return res.status(400).json({message: "Nothing to update"});
        }
        const postObj = await PostModel.findById(postId);
        if (!postObj) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (postObj.isDeleted) {
            return res.status(400).json({ message: "Cannot edit a deleted post" });
        }
        if (postObj.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Not authorized to edit this post" });
        }
        const updateFields = {
            isEdited: true,
            editedAt: new Date()
        };
        if (description) {
            updateFields.description = description.trim();
        }
        if (publishNow === "true") {
            updateFields.isScheduled = false;
            updateFields.scheduledFor = null;
            updateFields.isPublished = true;
        } else if (removeSchedule === "true") {
            updateFields.isScheduled = false;
            updateFields.scheduledFor = null;
            updateFields.isPublished = true;
        } else if (scheduledDate) {
            const parsedDate = new Date(scheduledDate);
            if (isNaN(parsedDate.getTime())) {
                return res.status(400).json({message:"Invalid schedule date"});
            }
            if (parsedDate <= new Date()) {
                return res.status(400).json({message:"Schedule must be future time"});
            }
            updateFields.isScheduled = true;
            updateFields.scheduledFor = parsedDate;
            updateFields.isPublished = false;
        }
        const updated = await PostModel.findByIdAndUpdate(postId, updateFields, { new: true, runValidators: true });
        return res.status(200).json({ message: "Post updated successfully", payload: updated });
    } catch (err) {
        next(err);
    }
});

// View a post by id
postRoute.get('/viewpost/:id', verifyToken, async (req, res, next) => {
    try {
        const postId = req.params.id;
        const postObj = await PostModel.findById(postId)
            .populate("userId", "username firstName lastName profileImageUrl");
        if (!postObj) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (postObj.isDeleted === true) {
            return res.status(404).json({ message: "This post has been deleted" });
        }
        if (
            postObj.isPublished === false &&
            postObj.userId.toString() !==
            req.user.id.toString()
        ) {
            return res.status(403).json({message: "This post is not available"});
        }
        const postOwner = await UserModel.findById(postObj.userId);
        if (!postOwner || postOwner.isDeactivated || postOwner.isBlocked) {
            return res.status(403).json({ message: "Cannot view this post" });
        }
        return res.status(200).json({ message: "Post fetched successfully", payload: postObj });
    } catch (err) {
        next(err);
    }
});

// GET POST COUNT BY USERNAME — for profile page stats
postRoute.get('/count/:username', verifyToken, async (req, res, next) => {
    try {
        const user = await UserModel.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.isBlocked || user.isDeactivated) {
            return res.status(403).json({ message: "This account is unavailable" });
        }
        // countDocuments is much cheaper than fetching all posts
        const count = await PostModel.countDocuments({
            userId: user._id,
            isDeleted: false,
            isPublished: true
        });
        return res.status(200).json({ message: "Post count fetched", payload: { count } });
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
        await PostModel.findByIdAndUpdate(postId, { isDeleted: true });
        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        next(err);
    }
});

// Recover a soft-deleted post
postRoute.patch('/recover/:id', verifyToken, async (req, res, next) => {
    try {
        const post = await PostModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (!post.isDeleted) {
            return res.status(400).json({ message: "Post is not deleted" });
        }
        if (post.userId.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: "Not authorized to recover this post" });
        }
        await PostModel.findByIdAndUpdate(post._id, { isDeleted: false });
        return res.status(200).json({ message: "Post recovered successfully" });
    } catch (err) {
        next(err);
    }
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
        if (!postOwner || postOwner.isDeactivated || postOwner.isBlocked) {
            return res.status(403).json({ message: "Cannot interact with this post" });
        }
        const alreadyLiked = postObj.likes.some(
            like => like.userId.toString() === userId.toString()
        );
        if (alreadyLiked) {
            return res.status(400).json({ message: "You have already liked this post" });
        }
        await PostModel.findByIdAndUpdate(postId, {
            $push: { likes: { userId } },
            $inc: { likeCount: 1 }
        });
        if (postObj.userId.toString() !== userId.toString()) {
            // Delete any old like notification first, then create fresh
            await NotificationModel.deleteOne({
                toUserId: postObj.userId,
                fromUserId: userId,
                type: "like",
                postId: postId
            });
            await NotificationModel.create({
                toUserId: postObj.userId,
                fromUserId: userId,
                type: "like",
                postId: postId
            });
        }
        const updatedPost = await PostModel.findById(postId)
            .populate(
                "userId",
                "username firstName lastName profileImageUrl"
            );
        return res.status(200).json({ message: "Liked the post", payload: updatedPost });
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
        if (!postOwner || postOwner.isDeactivated || postOwner.isBlocked) {
            return res.status(403).json({ message: "Cannot interact with this post" });
        }
        const isLiked = postObj.likes.some(
            like => like.userId.toString() === userId.toString());
        if (!isLiked) {
            return res.status(400).json({ message: "You have not liked this post" });
        }
        await PostModel.findByIdAndUpdate(postId, {
            $pull: { likes: { userId } },
            $inc: { likeCount: -1 }
        });
        // When unliked, delete the like notification entirely
        await NotificationModel.deleteOne({
            toUserId: postObj.userId,
            fromUserId: userId,
            type: "like",
            postId: postId
        });
        const updatedPost = await PostModel.findById(postId)
            .populate(
                "userId",
                "username firstName lastName profileImageUrl"
            );
        return res.status(200).json({ message: "Unliked the post", payload: updatedPost });
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
        if (!postOwner || postOwner.isDeactivated || postOwner.isBlocked) {
            return res.status(403).json({ message: "Cannot interact with this post" });
        }
        await PostModel.findByIdAndUpdate(postId, {
            $push: { comments: { userId, comment: comment.trim() } },
            $inc: { commentCount: 1 }
        });
        //Notification for post owner if someone else commented on their post
        if (postObj.userId.toString() !== userId.toString()) {
            await NotificationModel.create({
                toUserId: postObj.userId,
                fromUserId: userId,
                type: "comment",
                postId: postId
            });
        }
        const populatedPost = await PostModel.findById(postId)
        .populate("userId", "username firstName lastName profileImageUrl")
        .populate("comments.userId", "username firstName lastName profileImageUrl");
        return res.status(200).json({ message: "Comment added successfully", payload: populatedPost });
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
        if (postObj.isDeleted === true) {
            return res.status(400).json({ message: "Cannot delete comment from a deleted post" });
        }
        const postOwner = await UserModel.findById(postObj.userId);
        if (!postOwner || postOwner.isDeactivated || postOwner.isBlocked) {
            return res.status(403).json({ message: "Cannot interact with this post" });
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
        await PostModel.findByIdAndUpdate(postId, {
            $pull: { comments: { _id: commentId } },
            $inc: { commentCount: -1 }
        });
        // When comment is deleted, remove its notification too
        await NotificationModel.deleteOne({
            fromUserId: userId,
            postId: postId,
            type: "comment"
        });
        const populatedPost = await PostModel.findById(postId)
        .populate("userId", "username firstName lastName profileImageUrl")
        .populate("comments.userId", "username firstName lastName profileImageUrl");
        return res.status(200).json({ message: "Comment deleted successfully", payload: populatedPost });
    } catch (err) {
        next(err);
    }
});

// FOLLOWING FEED — posts from users you follow, newest first
postRoute.get("/feed", verifyToken, async (req, res, next) => {
    try {
        const currentUser = await UserModel.findById(req.user.id).select("following");
        const followingIds = currentUser.following.map((f) => f.userId);
        if (followingIds.length === 0) {
            return res.status(200).json({
                message: "You are not following anyone yet",
                payload: [],
            });
        }
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const posts = await PostModel.find({
            userId: { $in: followingIds },
            isDeleted: false,
            isPublished: true
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("userId", "username firstName lastName profileImageUrl")
            .populate("comments.userId","username firstName lastName profileImageUrl");
        const totalPosts = await PostModel.countDocuments({isDeleted: false, isPublished: true, userId: { $in: followingIds }});
        return res.status(200).json({
            success: true,
            message: "Feed fetched successfully",
            posts,
            hasMore: skip + posts.length < totalPosts,
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
        // Get ids of blocked/deactivated users to exclude their posts entirely
        const unavailableUsers = await UserModel.find({
            $or: [{ isBlocked: true }, { isDeactivated: true }]
        }).select("_id");
        const unavailableIds = unavailableUsers.map(u => u._id);
        const posts = await PostModel.find({
            isDeleted: false,
            userId: { $nin: unavailableIds },
            isPublished: true,
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("userId", "username firstName lastName profileImageUrl")
            .populate("comments.userId","username firstName lastName profileImageUrl");
        const totalPosts = await PostModel.countDocuments({isDeleted: false, isPublished: true,  userId: { $nin: unavailableIds }});
        return res.status(200).json({
            message: "Explore feed fetched successfully",
            payload: posts,
            page,
            limit,
            hasMore: skip + posts.length < totalPosts
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
        if (!postObj || postObj.isDeleted) {
            return res.status(404).json({ message: "Post not found" });
        }
        const postOwner = await UserModel.findById(postObj.userId);
        if (!postOwner || postOwner.isDeactivated || postOwner.isBlocked) {
            return res.status(403).json({ message: "Cannot view this post" });
        }
        return res.status(200).json({ message: "Likes list", payload: postObj.likes });
    } catch (err) {
        next(err);
    }
});

// Get comments of a post
postRoute.get('/comments/:id', verifyToken, async (req, res, next) => {
    try {
        const postObj = await PostModel.findById(req.params.id)
            .populate("comments.userId", "username firstName lastName profileImageUrl");
        if (!postObj || postObj.isDeleted) {
            return res.status(404).json({ message: "Post not found" });
        }
        const postOwner = await UserModel.findById(postObj.userId);
        if (!postOwner || postOwner.isDeactivated || postOwner.isBlocked) {
            return res.status(403).json({ message: "Cannot view this post" });
        }
        return res.status(200).json({ message: "Comments list", payload: postObj.comments });
    } catch (err) {
        next(err);
    }
});

// PROFILE POSTS
postRoute.get("/profile-posts/:username", verifyToken, async (req, res, next) => {
    try {
      const username = req.params.username.toLowerCase().trim();
      const filter = req.query.filter || "all";
      const profileUser = await UserModel.findOne({username});
      if (!profileUser) {
        return res.status(404).json({message: "User not found"});
      }
      if (profileUser.isBlocked || profileUser.isDeactivated) {
        return res.status(403).json({message:"This account is unavailable"});
      }
      const isOwnProfile = profileUser._id.toString() === req.user.id.toString();
      const query = { userId: profileUser._id, };
      if (!isOwnProfile) {
        query.isDeleted = false;
        query.isPublished = true;
      } else {
        if (filter === "active") {
          query.isDeleted = false;
        } else if (filter === "deleted") {
          query.isDeleted = true;
        }
      }
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const total = await PostModel.countDocuments(query);
      // FETCH POSTS
      const posts = await PostModel.find(query).sort({createdAt: -1}).skip(skip).limit(limit)
          .populate("userId",
            `username
            firstName
            lastName
            profileImageUrl`
          )
          .populate("comments.userId",
            `username
            firstName
            lastName
            profileImageUrl`
          )
          .populate(
            "likes.userId",
            `username
            firstName
            lastName
            profileImageUrl`
        );
      return res.status(200).json({
        success: true, 
        message:"Profile posts fetched", 
        isOwnProfile, 
        payload: posts,
        hasMore: skip + posts.length < total,
      });
    } catch (err) {
      next(err);
    }
  }
);

// PROFILE REPLIES
postRoute.get("/replies/:username", verifyToken, async (req, res, next) => {
    try {
      const username = req.params.username
          .toLowerCase()
          .trim();
      const profileUser = await UserModel.findOne({username,});
      if (!profileUser) {
        return res.status(404).json({message: "User not found",});
      }
      if (
        profileUser.isBlocked || profileUser.isDeactivated
      ) {
        return res.status(403).json({message:"This account is unavailable",});
      }
      const posts = await PostModel.find({"comments.userId":profileUser._id,
          isDeleted: false,
          isPublished: true,
        }).sort({createdAt: -1,})
          .populate(
            "userId",
            `username
            firstName
            lastName
            profileImageUrl`
          ).populate(
            "comments.userId",
            `username
            firstName
            lastName
            profileImageUrl`
          );
      const replies = [];
      posts.forEach((post) => {post.comments.forEach((comment) => {
            if (
              comment.userId?._id?.toString() === profileUser._id.toString()
            ) {
              replies.push({
                _id: comment._id,
                comment:comment.comment,
                createdAt:comment.createdAt,
                userId:comment.userId,
                post,
              });
            }
          }
        );
      });
      replies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.status(200).json({ success: true, message:"Replies fetched successfully", payload: replies,});
    } catch (err) {
      next(err);
    }
  }
);

//Liked POSTS
postRoute.get("/liked-posts/:username", verifyToken, async (req, res, next) => {
  try {
    const username = req.params.username.toLowerCase().trim();
    const profileUser = await UserModel.findOne({ username });
    if (!profileUser) {
      return res.status(404).json({ message: "User not found" });
    }
    if (profileUser._id.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    const posts = await PostModel.find({
      likes: { $elemMatch: { userId: profileUser._id } },
      isDeleted: false,
      isPublished: true,
    })
      .populate("userId", "username firstName lastName profileImageUrl")
      .populate("comments.userId", "username firstName lastName profileImageUrl")
      .populate("likes.userId", "username firstName lastName profileImageUrl");
    // Sort by when THIS user liked each post (the like entry's createdAt)
    const sorted = posts.sort((a, b) => {
      const likeA = a.likes.find(
        (l) => l.userId?._id?.toString() === profileUser._id.toString() ||
               l.userId?.toString() === profileUser._id.toString()
      );
      const likeB = b.likes.find(
        (l) => l.userId?._id?.toString() === profileUser._id.toString() ||
               l.userId?.toString() === profileUser._id.toString()
      );
      return new Date(likeB?.createdAt || 0) - new Date(likeA?.createdAt || 0);
    });
    return res.status(200).json({
      success: true,
      message: "Liked posts fetched",
      payload: sorted,
    });
  } catch (err) {
    next(err);
  }
});

// HASHTAG FEED
postRoute.get("/hashtag/:tag", verifyToken, async (req, res, next) => {
  try {
    const tag = decodeURIComponent(req.params.tag);
    const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`#${escaped}`, "i");
    const unavailableUsers = await UserModel.find({
      $or: [{ isBlocked: true }, { isDeactivated: true }]
    }).select("_id");
    const unavailableIds = unavailableUsers.map(u => u._id);
    const posts = await PostModel.find({
      description: { $regex: regex },
      isDeleted: false,
      isPublished: true,
      userId: { $nin: unavailableIds },
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("userId", "username firstName lastName profileImageUrl")
      .populate("comments.userId", "username firstName lastName profileImageUrl")
      .populate("likes.userId", "username firstName lastName profileImageUrl");
    return res.status(200).json({
      success: true,
      message: "Hashtag posts fetched",
      payload: posts,
    });
  } catch (err) {
    next(err);
  }
});

// TRENDING HASHTAGS
postRoute.get("/trending", verifyToken, async (req, res, next) => {
  try {
    const unavailableUsers = await UserModel.find({
      $or: [{ isBlocked: true }, { isDeactivated: true }]
    }).select("_id");
    const unavailableIds = unavailableUsers.map(u => u._id);
    const posts = await PostModel.find({
      isDeleted: false,
      isPublished: true,
      userId: { $nin: unavailableIds },
      description: { $regex: /#\w+/, $options: "i" }
    }).select("description").limit(500);
    const counts = {};
    posts.forEach((post) => {
      const tags = post.description.match(/#\w+/gi) || [];
      tags.forEach((tag) => {
        const t = tag.toLowerCase();
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    const trending = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));
    return res.status(200).json({ success: true, payload: trending });
  } catch (err) {
    next(err);
  }
});
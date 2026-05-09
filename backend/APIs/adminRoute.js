import exp from 'express'
import { verifyAdmin, verifyToken } from '../middlewares/verifyToken.js'
import { UserModel } from '../models/UserModel.js'
import { PostModel } from '../models/PostModel.js'

export const adminRoute = exp.Router()

//  View all users
adminRoute.get('/users', verifyToken, verifyAdmin, async (req, res, next) => {
    try {
        const users = await UserModel.find().select("-password -followers -following")
        res.status(200).json({ message: "All users", payload: users })
    } catch (err) {
        next(err)
    }
})

//  Block user
adminRoute.patch('/users/:id/block', verifyToken, verifyAdmin, async (req, res, next) => {
    try {
        // Cannot block yourself
        if (req.params.id === req.user.id.toString()) {
            return res.status(400).json({ message: "You cannot block yourself" });
        }
        // Find the target user first
        const targetUser = await UserModel.findById(req.params.id);
        // User doesn't exist
        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }
        // Cannot block another admin
        if (targetUser.isAdmin) {
            return res.status(400).json({ message: "You cannot block another admin" });
        }
        // Already blocked
        if (targetUser.isBlocked) {
            return res.status(400).json({ message: "User is already blocked" });
        }
        const updatedUser = await UserModel.findByIdAndUpdate(req.params.id,{ isBlocked: true },{ new: true })
            .select("-password -followers -following");
        res.status(200).json({ message: "User blocked successfully", payload: updatedUser });
    } catch (err) {
        next(err);
    }
});

//  Unblock user
adminRoute.patch('/users/:id/unblock', verifyToken, verifyAdmin, async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.params.id)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        if (!user.isBlocked) {
            return res.status(400).json({ message: "User already unblocked" });
        }
        user.isBlocked = false
        const updatedUser = await user.save()
        res.status(200).json({ message: "User unblocked successfully", payload: updatedUser })
    } catch (err) {
        next(err)
    }
})

// View ALL posts including soft-deleted
adminRoute.get('/posts', verifyToken, verifyAdmin, async (req, res, next) => {
    try {
        const posts = await PostModel.find()
            .sort({ createdAt: -1 })
            .populate("userId", "username firstName lastName profileImageUrl");
        res.status(200).json({ message: "All posts", payload: posts });
    } catch (err) { next(err); }
});

// Hard delete a post permanently
adminRoute.delete('/posts/:id', verifyToken, verifyAdmin, async (req, res, next) => {
    try {
        const post = await PostModel.findByIdAndDelete(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });
        res.status(200).json({ message: "Post permanently deleted" });
    } catch (err) { next(err); }
});

// Dashboard stats
adminRoute.get('/stats', verifyToken, verifyAdmin, async (req, res, next) => {
    try {
        const [totalUsers, blockedUsers, deactivatedUsers, totalPosts, deletedPosts] = await Promise.all([
            UserModel.countDocuments(),
            UserModel.countDocuments({ isBlocked: true }),
            UserModel.countDocuments({ isDeactivated: true }),
            PostModel.countDocuments(),
            PostModel.countDocuments({ isDeleted: true }),
        ]);
        res.status(200).json({
            message: "Dashboard stats",
            payload: { totalUsers, blockedUsers, deactivatedUsers, totalPosts, deletedPosts }
        });
    } catch (err) { next(err); }
});
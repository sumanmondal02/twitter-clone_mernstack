import exp from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { UserModel } from "../models/UserModel.js";

export const userApp = exp.Router();

// GET PROFILE (OWN OR OTHER USER)
// Own profile  → user's own username from verifyToken goes in URL
// Other profile → that person's username goes in URL
// isOwnProfile flag tells frontend: show Edit Profile button or Follow button
userApp.get("/profile/:username", verifyToken, async (req, res, next) => {
    try {
        const user = await UserModel.findOne({username: req.params.username});

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        else if (user.isDeactivated) {
            return res.status(403).json({ message: "This account is deactivated" });
        }
        else if (user.isBlocked) {
            return res.status(403).json({ message: "This account is blocked" });
        }

        const isOwnProfile = user._id.toString() === req.user.id;

        // Check if the logged-in user follows this profile
        const isFollowing = req.user.following?.some((f) => f.userId.toString() === user._id.toString());

        // Convert to plain object so we can delete fields
        const payload = user.toObject();

        // Always strip password
        delete payload.password;

        // Strip extra sensitive fields for other people's profiles
        if (!isOwnProfile) {
            delete payload.email;
            delete payload.isAdmin;
            delete payload.isBlocked;
            delete payload.isDeactivated;
        }

        return res.status(200).json({message: "Profile fetched successfully", payload,
            isOwnProfile, // frontend: show Edit Profile vs Follow button
            isFollowing,  // frontend: show Follow vs Unfollow button
        });
    } catch (err) {
        next(err);
    }
});

// UPDATE PROFILE
// Email not updatable here — changing email needs a separate verification flow
userApp.put("/updateProfile", verifyToken, async (req, res, next) => {
    try {
        const { username, bio, profileImageUrl, firstName, lastName, gender } = req.body;

        const updated = await UserModel.findByIdAndUpdate(
            req.user.id,
            { username, bio, profileImageUrl, firstName, lastName, gender },
            { new: true, runValidators: true }
        ).select("-password -isAdmin -isBlocked -isDeactivated");

        if (!updated) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            payload: updated,
        });
    } catch (err) {
        next(err);
    }
});

// DEACTIVATE OWN ACCOUNT
userApp.put("/deactivate", verifyToken, async (req, res, next) => {
    try {
        const userObj = await UserModel.findByIdAndUpdate(req.user.id,{ isDeactivated: true },{ new: true });

        if (!userObj) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "Account deactivated successfully" });
    } catch (err) {
        next(err);
    }
});

// FOLLOW A USER
userApp.post("/follow/:id", verifyToken, async (req, res, next) => {
    try {
        const currentUserId = req.user.id;
        const targetUserId = req.params.id;

        if (currentUserId === targetUserId) {
            return res
                .status(400)
                .json({ message: "You cannot follow yourself" });
        }

        // Fetch both users in parallel — faster than two sequential awaits
        const [currentUser, targetUser] = await Promise.all([
            UserModel.findById(currentUserId),
            UserModel.findById(targetUserId),
        ]);

        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (targetUser.isBlocked || targetUser.isDeactivated) {
            return res
                .status(403)
                .json({ message: "This account is unavailable" });
        }

        // Prevent duplicate follows
        const alreadyFollowing = currentUser.following.some(
            (f) => f.userId.toString() === targetUserId
        );

        if (alreadyFollowing) {
            return res
                .status(400)
                .json({ message: "Already following this user" });
        }

        // $push + $inc in the same operation — keeps array and count in sync
        // Promise.all — both DB updates run in parallel, not sequentially
        await Promise.all([
            UserModel.findByIdAndUpdate(currentUserId, {
                $push: { following: { userId: targetUserId } },
                $inc: { followingCount: 1 },
            }),
            UserModel.findByIdAndUpdate(targetUserId, {
                $push: { followers: { userId: currentUserId } },
                $inc: { followerCount: 1 },
            }),
        ]);

        return res.status(200).json({ message: "Followed successfully" });
    } catch (err) {
        next(err);
    }
});

// ─── UNFOLLOW A USER ──────────────────────────────────────────────────────────
userApp.delete("/unfollow/:id", verifyToken, async (req, res, next) => {
    try {
        const currentUserId = req.user.id;
        const targetUserId = req.params.id;

        if (currentUserId === targetUserId) {
            return res
                .status(400)
                .json({ message: "You cannot unfollow yourself" });
        }

        // Fetch both users in parallel
        const [currentUser, targetUser] = await Promise.all([
            UserModel.findById(currentUserId),
            UserModel.findById(targetUserId),
        ]);

        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Must verify following before pulling — prevents followerCount going negative
        const isFollowing = currentUser.following.some(
            (f) => f.userId.toString() === targetUserId
        );

        if (!isFollowing) {
            return res
                .status(400)
                .json({ message: "You are not following this user" });
        }

        // $pull + $inc in the same operation — keeps array and count in sync
        await Promise.all([
            UserModel.findByIdAndUpdate(currentUserId, {
                $pull: { following: { userId: targetUserId } },
                $inc: { followingCount: -1 },
            }),
            UserModel.findByIdAndUpdate(targetUserId, {
                $pull: { followers: { userId: currentUserId } },
                $inc: { followerCount: -1 },
            }),
        ]);

        return res.status(200).json({ message: "Unfollowed successfully" });
    } catch (err) {
        next(err);
    }
});

// ─── FOLLOWERS LIST ───────────────────────────────────────────────────────────
// .populate() replaces raw ObjectIds with actual user data
userApp.get("/followerslist", verifyToken, async (req, res, next) => {
    try {
        const userObj = await UserModel.findById(req.user.id).populate(
            "followers.userId",
            "username firstName lastName profileImageUrl followerCount"
        );

        if (!userObj) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "Followers list",
            payload: userObj.followers,
        });
    } catch (err) {
        next(err);
    }
});

// ─── FOLLOWING LIST ───────────────────────────────────────────────────────────
// .populate() replaces raw ObjectIds with actual user data
userApp.get("/followinglist", verifyToken, async (req, res, next) => {
    try {
        const userObj = await UserModel.findById(req.user.id).populate(
            "following.userId",
            "username firstName lastName profileImageUrl followerCount"
        );

        if (!userObj) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "Following list",
            payload: userObj.following,
        });
    } catch (err) {
        next(err);
    }
});

// ─── SEARCH USERS ─────────────────────────────────────────────────────────────
// Searches across username, firstName, lastName using case-insensitive regex
// Usage: GET /user/search?q=john
userApp.get("/search", verifyToken, async (req, res, next) => {
    try {
        const { q } = req.query;

        if (!q || q.trim() === "") {
            return res
                .status(400)
                .json({ message: "Search query is required" });
        }

        const users = await UserModel.find({
            $or: [
                { username: { $regex: q.trim(), $options: "i" } },
                { firstName: { $regex: q.trim(), $options: "i" } },
                { lastName: { $regex: q.trim(), $options: "i" } },
            ],
            isDeactivated: false,
            isBlocked: false,
        }).select(
            "username firstName lastName profileImageUrl followerCount bio"
        );

        return res.status(200).json({
            message: "Search results",
            payload: users,
        });
    } catch (err) {
        next(err);
    }
});
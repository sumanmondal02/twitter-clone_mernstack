import exp from "express";
import { compare } from "bcrypt";
import { verifyToken } from "../middlewares/verifyToken.js";
import { UserModel } from "../models/UserModel.js";
import { PostModel } from "../models/PostModel.js";
import { upload } from "../config/multer.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js";
import { NotificationModel } from '../models/NotificationModel.js'

export const userRoute = exp.Router();

// GET PROFILE (OWN OR OTHER USER)
// Own profile  → user's own username from verifyToken goes in URL
// Other profile → that person's username goes in URL
// isOwnProfile flag tells frontend: show Edit Profile button or Follow button
userRoute.get("/profile/:username", verifyToken, async (req, res, next) => {
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

        const isOwnProfile = user._id.toString() === req.user.id.toString();

        // Check if the logged-in user follows this profile
        // const currentUser = await UserModel.findById(req.user.id).select("following");
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

        return res.status(200).json({message: "Profile fetched successfully", 
            payload,
            isOwnProfile, // frontend: show Edit Profile vs Follow button
            isFollowing,  // frontend: show Follow vs Unfollow button
        });
    } catch (err) {
        next(err);
    }
});

// UPDATE PROFILE
// Email not updatable here — changing email needs a separate verification flow
userRoute.put("/updateProfile", verifyToken, upload.single('profileImageUrl'), async (req, res, next) => {
    let cloudinaryResult = null; // to track if we uploaded a new image
    try {
        const { username, bio, firstName, lastName, gender } = req.body;
        const updateFields = {};
        if (username) updateFields.username = username;
        if (bio !== undefined) updateFields.bio = bio;
        if (firstName) updateFields.firstName = firstName;
        if (lastName !== undefined) updateFields.lastName = lastName;
        if (gender) updateFields.gender = gender;

        // let profileImageUrl = req.body.profileImageUrl || undefined; // fallback if no new file

        if (req.file) {
            cloudinaryResult = await uploadToCloudinary(req.file.buffer);
            updateFields.profileImageUrl = cloudinaryResult.secure_url;
        }
        if (username) {
            const exists = await UserModel.findOne({ username });
            if (exists && exists._id.toString() !== req.user._id.toString()) {
                return res.status(409).json({ message: "Username already taken" });
        }
        }

        const updated = await UserModel.findByIdAndUpdate(req.user.id, { $set: updateFields }, { new: true, runValidators: true }).select("-password -followers -following");

        if (!updated) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            payload: updated,
        });
    } catch (err) {
        if (cloudinaryResult?.public_id) {
            await cloudinary.uploader.destroy(cloudinaryResult.public_id);
        }
        next(err);
    }
});

// DELETE PROFILE IMAGE
userRoute.delete("/profileImage", verifyToken, async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!user.profileImageUrl) {
            return res.status(400).json({ message: "No profile image to delete" });
        }

        const urlParts = user.profileImageUrl.split('/');
        const filename = urlParts[urlParts.length - 1].split('.')[0];
        const folder = urlParts[urlParts.length - 2];
        const publicId = `${folder}/${filename}`;

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(publicId);

        // Set profileImageUrl to null in DB
        await UserModel.findByIdAndUpdate(req.user.id, { profileImageUrl: null });

        return res.status(200).json({ message: "Profile image deleted successfully" });

    } catch (err) {
        next(err);
    }
});

// DEACTIVATE OWN ACCOUNT
userRoute.put("/deactivate", verifyToken, async (req, res, next) => {
    try {
        const { password } = req.body;
        if (!password) return res.status(400).json({ message: "Password required to deactivate" });

        const user = await UserModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await compare(password, user.password);

        if (!isMatch) return res.status(401).json({ message: "Invalid password" });
        await UserModel.findByIdAndUpdate(req.user.id, { isDeactivated: true });

        res.clearCookie("token", {
            httpOnly: true,
            secure: false, // set to true in production with HTTPS
            sameSite: "none"
        });
        return res.status(200).json({ message: "Account deactivated successfully" });
    } catch (err) {
        next(err);
    }
});

// FOLLOW A USER
userRoute.post("/follow/:id", verifyToken, async (req, res, next) => {
    try {
        const currentUserId = req.user.id;
        const targetUserId = req.params.id;

        if (currentUserId === targetUserId) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        // Fetch both users in parallel — faster than two sequential awaits
        const [currentUser, targetUser] = await Promise.all([
            UserModel.findById(currentUserId),
            UserModel.findById(targetUserId),
        ]);
        if (!currentUser) {
            return res.status(404).json({ message: "Current user not found" });
        }
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
        await NotificationModel.deleteOne({
            toUserId: targetUserId,
            fromUserId: currentUserId,
            type: "follow"
        });

        await NotificationModel.create({
            toUserId: targetUserId,
            fromUserId: currentUserId,
            type: "follow",
            postId: null
        });

        return res.status(200).json({ message: "Followed successfully" });
    } catch (err) {
        next(err);
    }
});

// UNFOLLOW A USER 
userRoute.delete("/unfollow/:id", verifyToken, async (req, res, next) => {
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

        if (!currentUser) {
            return res.status(404).json({ message: "Current user not found" });
        }

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

        await NotificationModel.deleteOne({
            toUserId: targetUserId,
            fromUserId: currentUserId,
            type: "follow"
        });

        return res.status(200).json({ message: "Unfollowed successfully" });
    } catch (err) {
        next(err);
    }
});

// REMOVE A FOLLOWER — if you don't want someone following you, you can remove them from your followers list. This is different from blocking — they can still see your public profile and posts, but just won't be your follower anymore.
userRoute.delete("/removeFollower/:id", verifyToken, async (req,res)=>{
    try{
        const currentUserId = req.user.id;
        const followerId = req.params.id;
        if (currentUserId === followerId) {
            return res.status(400).json({ message: "Invalid operation" });
        }
 
        const currentUser = await UserModel.findById(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }
 
        // Verify the person is actually your follower before removing
        const isFollower = currentUser.followers.some(
            (f) => f.userId.toString() === followerId
        );
        if (!isFollower) {
            return res.status(400).json({ message: "This user is not your follower" });
        }

        await Promise.all([
            UserModel.findByIdAndUpdate(currentUserId,{
            $pull: { followers: { userId: followerId } },
            $inc: { followerCount: -1 }
            }),
            UserModel.findByIdAndUpdate(followerId,{
            $pull: { following: { userId: currentUserId } },
            $inc: { followingCount: -1 }
            })
        ]);

        res.json({ message: "Follower removed" });
    }catch(err){
        next(err);
    }
});

// FOLLOWERS LIST
// .populate() replaces raw ObjectIds with actual user data
userRoute.get("/followerslist", verifyToken, async (req, res, next) => {
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

// FOLLOWING LIST
// .populate() replaces raw ObjectIds with actual user data
userRoute.get("/followinglist", verifyToken, async (req, res, next) => {
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

// SEARCH USERS
// Searches across username, firstName, lastName using case-insensitive regex
// Usage: GET /user/search?q=john
userRoute.get("/search", verifyToken, async (req, res, next) => {
    try {
        const { q } = req.query;

        if (!q || q.trim() === "") {
            return res
                .status(400)
                .json({ message: "Search query is required" });
        }
        const escaped = q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const users = await UserModel.find({
            $or: [
                { username: { $regex: escaped, $options: "i" } },
                { firstName: { $regex: escaped, $options: "i" } },
                { lastName: { $regex: escaped, $options: "i" } },
            ],
            isDeactivated: false,
            isBlocked: false,
        }).select("username firstName lastName profileImageUrl followerCount bio")
          .limit(10); // limit results for performance

        return res.status(200).json({
            message: "Search results",
            payload: users,
        });
    } catch (err) {
        next(err);
    }
});

// GET A USER'S POSTS BY USERNAME
userRoute.get("/posts/:username", verifyToken, async (req, res, next) => {
    try {
        // Find the user by username first
        const user = await UserModel.findOne({ username: req.params.username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.isBlocked || user.isDeactivated) {
            return res.status(403).json({ message: "This account is unavailable" });
        }

        // Fetch all non-deleted posts by that user, newest first
        const posts = await PostModel.find({ userId: user._id, isDeleted: false })
            .sort({ createdAt: -1 })
            .populate("userId", "username firstName lastName profileImageUrl");

        return res.status(200).json({
            message: "User posts fetched successfully",
            payload: posts,
        });
    } catch (err) {
        next(err);
    }
});

// Other User Seeing another users followers list
userRoute.get("/followerslist/:username", verifyToken, async (req, res, next) => {
    try{
        const user = await UserModel.findOne({ username: req.params.username })
            .populate("followers.userId", "username firstName lastName profileImageUrl followerCount");
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.isBlocked || user.isDeactivated) return res.status(403).json({ message: "This account is unavailable" });
        return res.status(200).json({ message: "Followers list", payload: user.followers });
    } catch (err) {
        next(err);
    }
    
});

// Other User Seeing another users following list
userRoute.get("/followinglist/:username", verifyToken, async (req, res, next) => {
    try {
        const user = await UserModel.findOne({ username: req.params.username })
            .populate("following.userId", "username firstName lastName profileImageUrl followerCount");
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.isBlocked || user.isDeactivated) return res.status(403).json({ message: "This account is unavailable" });
        return res.status(200).json({ message: "Following list", payload: user.following });
    } catch (err) {
        next(err);
    }
});

// SUGGESTIONS: People you may know (not following yet)
userRoute.get("/suggestions", verifyToken, async (req, res, next) => {
    try {
        const currentUser = await UserModel.findById(req.user.id).select("following");
        const followingIds = currentUser.following.map(f => f.userId);
        followingIds.push(req.user.id); // exclude self too

        const suggestions = await UserModel.find({
            _id: { $nin: followingIds },
            isBlocked: false,
            isDeactivated: false
        })
        .select("username firstName lastName profileImageUrl followerCount bio")
        .limit(10);

        return res.status(200).json({ message: "Suggestions", payload: suggestions });
    } catch (err) { next(err); }
});
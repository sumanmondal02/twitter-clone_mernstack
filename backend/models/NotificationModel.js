import { Schema, model, Types } from "mongoose";

const notificationSchema = new Schema({
    // who receives the notification
    toUserId: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    // who triggered it (liked your post, followed you)
    fromUserId: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ["like", "comment", "follow"],
        required: true
    },
    // which post it relates to — null for follow notifications
    postId: {
        type: Types.ObjectId,
        ref: "Post",
        default: null
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false
});

export const NotificationModel = model("Notification", notificationSchema);
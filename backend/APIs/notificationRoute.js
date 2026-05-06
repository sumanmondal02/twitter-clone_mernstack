import exp from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'
import { NotificationModel } from '../models/NotificationModel.js'

export const notificationRoute = exp.Router()

// GET ALL NOTIFICATIONS FOR LOGGED IN USER
notificationRoute.get('/', verifyToken, async (req, res, next) => {
    try {
        const notifications = await NotificationModel.find({ toUserId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(20)
            .populate("fromUserId", "username firstName lastName profileImageUrl")
            .populate("postId", "description");

        return res.status(200).json({
            message: "Notifications fetched",
            payload: notifications
        });
    } catch (err) {
        next(err);
    }
});

// MARK ALL NOTIFICATIONS AS READ
notificationRoute.patch('/markread', verifyToken, async (req, res, next) => {
    try {
        await NotificationModel.updateMany(
            { toUserId: req.user.id, isRead: false },
            { isRead: true }
        );
        return res.status(200).json({ message: "All notifications marked as read" });
    } catch (err) {
        next(err);
    }
});

// GET UNREAD NOTIFICATION COUNT — for the bell icon badge
notificationRoute.get('/unreadcount', verifyToken, async (req, res, next) => {
    try {
        const count = await NotificationModel.countDocuments({
            toUserId: req.user.id,
            isRead: false
        });
        return res.status(200).json({ message: "Unread count", payload: { count } });
    } catch (err) {
        next(err);
    }
});

// DELETE A SINGLE NOTIFICATION
notificationRoute.delete('/:id', verifyToken, async (req, res, next) => {
    try {
        const notification = await NotificationModel.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        if (notification.toUserId.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }
        await NotificationModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Notification deleted" });
    } catch (err) {
        next(err);
    }
});
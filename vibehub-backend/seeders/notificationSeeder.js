const Notification = require("../models/Notification")
const Like = require("../models/Like")
const Repost = require("../models/Repost")
const Follow = require("../models/Follow")
const User = require("../models/User")
const Post = require("../models/Post")
// Add the missing import for Comment model
// If you don't have a separate Comment model, we'll handle that case

// Function to generate notifications based on existing interactions
const generateNotifications = async (users) => {
    const notifications = []

    try {
        // 1. Notifications for likes
        const likes = await Like.find()
            .populate("userId", "username")
            .populate({
                path: "postId",
                select: "userId",
                populate: { path: "userId", select: "username" },
            })

        for (const like of likes) {
            // Don't create a notification if the user likes their own post
            if (
                like.userId &&
                like.postId &&
                like.postId.userId &&
                like.userId._id.toString() !== like.postId.userId._id.toString()
            ) {
                notifications.push({
                    userId: like.postId.userId._id, // User receiving the notification (post author)
                    type: "like",
                    message: `${like.userId.username} a aimé votre post`,
                    isRead: Math.random() > 0.7, // 30% chance of being unread
                    createdAt: like.createdAt || new Date(),
                })
            }
        }

        // 2. Notifications for reposts
        const reposts = await Repost.find()
            .populate("userId", "username")
            .populate({
                path: "postId",
                select: "userId",
                populate: { path: "userId", select: "username" },
            })

        for (const repost of reposts) {
            // Don't create a notification if the user reposts their own post
            if (
                repost.userId &&
                repost.postId &&
                repost.postId.userId &&
                repost.userId._id.toString() !== repost.postId.userId._id.toString()
            ) {
                notifications.push({
                    userId: repost.postId.userId._id, // User receiving the notification (post author)
                    type: "repost",
                    message: `${repost.userId.username} a reposté votre post`,
                    isRead: Math.random() > 0.7, // 30% chance of being unread
                    createdAt: repost.createdAt || new Date(),
                })
            }
        }

        // 3. Notifications for comments
        // Based on your Post schema, it seems comments are stored as posts with a parentId
        // So we'll find posts that are comments (have a parentId)
        const comments = await Post.find({ parentId: { $ne: null } })
            .populate("userId", "username")
            .populate({
                path: "parentId",
                select: "userId",
                populate: { path: "userId", select: "username" },
            })

        for (const comment of comments) {
            // Don't create a notification if the user comments on their own post
            if (
                comment.userId &&
                comment.parentId &&
                comment.parentId.userId &&
                comment.userId._id.toString() !== comment.parentId.userId._id.toString()
            ) {
                notifications.push({
                    userId: comment.parentId.userId._id, // User receiving the notification (post author)
                    type: "comment",
                    message: `${comment.userId.username} a commenté votre post`,
                    isRead: Math.random() > 0.7, // 30% chance of being unread
                    createdAt: comment.createdAt || new Date(),
                })
            }
        }

        // 4. Notifications for follows
        const follows = await Follow.find().populate("followerId", "username").populate("followingId", "username")

        for (const follow of follows) {
            if (follow.followerId && follow.followingId) {
                notifications.push({
                    userId: follow.followingId._id, // User receiving the notification (the one being followed)
                    type: "follow",
                    message: `${follow.followerId.username} a commencé à vous suivre`,
                    isRead: Math.random() > 0.7, // 30% chance of being unread
                    createdAt: follow.createdAt || new Date(),
                })
            }
        }

        console.log(`Generated ${notifications.length} notifications`)
        return notifications
    } catch (error) {
        console.error("Error generating notifications:", error)
        throw error
    }
}

// Function to create notifications
const seed = async (users) => {
    try {
        // Validate input
        if (!users || users.length === 0) {
            throw new Error("No users provided for notification seeding")
        }

        // Delete all existing notifications
        await Notification.deleteMany({})
        console.log("Deleted existing notifications")

        // Generate notifications based on existing interactions
        const notificationsData = await generateNotifications(users)

        if (notificationsData.length === 0) {
            console.log("No notifications generated, skipping insertion")
            return []
        }

        // Log a sample notification for debugging
        console.log("Sample notification data:", notificationsData[0])

        // Insert notifications into the database
        const createdNotifications = await Notification.insertMany(notificationsData)
        console.log(`Inserted ${createdNotifications.length} notifications`)

        return createdNotifications
    } catch (error) {
        console.error("Error creating notifications:", error)
        throw error
    }
}

module.exports = { seed }


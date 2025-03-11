const Like = require("../models/Like")
const Post = require("../models/Post")

// Function to generate random likes
const generateLikes = (users, posts, count = 150) => {
    const likes = []
    const likeMap = new Map() // To avoid duplicates

    // Make sure we have valid posts to work with
    if (!posts || posts.length === 0) {
        console.error("No posts provided for generating likes")
        return []
    }

    // Filter out any posts that don't have a valid _id
    const validPosts = posts.filter((post) => post && post._id)

    if (validPosts.length === 0) {
        console.error("No valid posts with _id found")
        return []
    }

    let attempts = 0
    const maxAttempts = count * 2 // Avoid infinite loop

    while (likes.length < count && attempts < maxAttempts) {
        attempts++
        const randomUser = users[Math.floor(Math.random() * users.length)]
        const randomPost = validPosts[Math.floor(Math.random() * validPosts.length)]

        // Skip if either user or post is invalid
        if (!randomUser || !randomUser._id || !randomPost || !randomPost._id) {
            continue
        }

        // Create a unique key to avoid duplicates
        const likeKey = `${randomUser._id}-${randomPost._id}`

        // Check if this like already exists
        if (!likeMap.has(likeKey)) {
            likes.push({
                userId: randomUser._id,
                postId: randomPost._id, // Ensure this is a valid ObjectId
            })

            likeMap.set(likeKey, true)
        }
    }

    console.log(`Generated ${likes.length} likes from ${attempts} attempts`)
    return likes
}

// Function to create likes
const seed = async (users, posts) => {
    try {
        // Validate inputs
        if (!users || users.length === 0) {
            throw new Error("No users provided for like seeding")
        }

        if (!posts || posts.length === 0) {
            throw new Error("No posts provided for like seeding")
        }

        // Delete all existing likes
        await Like.deleteMany({})
        console.log("Deleted existing likes")

        // Generate random likes
        const likesData = generateLikes(users, posts)

        if (likesData.length === 0) {
            console.log("No likes generated, skipping insertion")
            return []
        }

        // Log a sample like for debugging
        console.log("Sample like data:", likesData[0])

        // Insert likes into the database
        const createdLikes = await Like.insertMany(likesData)
        console.log(`Inserted ${createdLikes.length} likes`)

        // Update like count for each post
        for (const post of posts) {
            if (post && post._id) {
                const likeCount = await Like.countDocuments({ postId: post._id })
                await Post.findByIdAndUpdate(post._id, { likesCount: likeCount })
            }
        }

        return createdLikes
    } catch (error) {
        console.error("Error creating likes:", error)
        throw error
    }
}

module.exports = { seed }


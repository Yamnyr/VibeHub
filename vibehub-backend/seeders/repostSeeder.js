const Repost = require("../models/Repost")
const Post = require("../models/Post")

// Function to generate random reposts with comments
const generateReposts = (users, posts, count = 80) => {
    const reposts = []
    const repostMap = new Map() // To avoid duplicates

    // Make sure we have valid posts and users to work with
    if (!posts || posts.length === 0) {
        console.error("No posts provided for generating reposts")
        return []
    }

    if (!users || users.length === 0) {
        console.error("No users provided for generating reposts")
        return []
    }

    // Filter out any posts or users that don't have a valid _id
    const validPosts = posts.filter((post) => post && post._id)
    const validUsers = users.filter((user) => user && user._id)

    if (validPosts.length === 0) {
        console.error("No valid posts with _id found")
        return []
    }

    if (validUsers.length === 0) {
        console.error("No valid users with _id found")
        return []
    }

    // Possible comments for reposts
    const repostComments = [
        "Je partage ça avec vous !",
        "Très intéressant, à lire absolument.",
        "Qu'en pensez-vous ?",
        "Totalement d'accord avec ce post !",
        "Ceci mérite d'être partagé.",
        "Une information importante à connaître.",
        "Je soutiens ce message.",
        "Regardez ce que j'ai trouvé !",
        "Un point de vue intéressant.",
        "À méditer...",
        "", // Some reposts won't have a comment
    ]

    let attempts = 0
    const maxAttempts = count * 3 // Avoid infinite loop

    while (reposts.length < count && attempts < maxAttempts) {
        attempts++
        const randomUser = validUsers[Math.floor(Math.random() * validUsers.length)]
        const randomPost = validPosts[Math.floor(Math.random() * validPosts.length)]

        // Skip if either user or post is invalid
        if (!randomUser || !randomUser._id || !randomPost || !randomPost._id || !randomPost.userId) {
            continue
        }

        // Decide if we add a comment (70% chance)
        const hasComment = Math.random() < 0.7
        const randomComment = hasComment ? repostComments[Math.floor(Math.random() * (repostComments.length - 1))] : ""

        // Create a unique key to avoid duplicates
        const repostKey = `${randomUser._id}-${randomPost._id}`

        // Check if this repost already exists and that the user isn't reposting their own post
        if (!repostMap.has(repostKey) && randomUser._id.toString() !== randomPost.userId.toString()) {
            reposts.push({
                userId: randomUser._id,
                postId: randomPost._id,
                comment: randomComment,
            })

            repostMap.set(repostKey, true)
        }
    }

    console.log(`Generated ${reposts.length} reposts from ${attempts} attempts`)
    return reposts
}

// Function to create reposts
const seed = async (users, posts) => {
    try {
        // Validate inputs
        if (!users || users.length === 0) {
            throw new Error("No users provided for repost seeding")
        }

        if (!posts || posts.length === 0) {
            throw new Error("No posts provided for repost seeding")
        }

        // Delete all existing reposts
        await Repost.deleteMany({})
        console.log("Deleted existing reposts")

        // Generate random reposts with comments
        const repostsData = generateReposts(users, posts)

        if (repostsData.length === 0) {
            console.log("No reposts generated, skipping insertion")
            return []
        }

        // Log a sample repost for debugging
        console.log("Sample repost data:", repostsData[0])

        // Insert reposts into the database
        const createdReposts = await Repost.insertMany(repostsData)
        console.log(`Inserted ${createdReposts.length} reposts`)

        // Update repost count for each post
        for (const post of posts) {
            if (post && post._id) {
                const repostCount = await Repost.countDocuments({ postId: post._id })
                await Post.findByIdAndUpdate(post._id, { repostsCount: repostCount })
            }
        }

        return createdReposts
    } catch (error) {
        console.error("Error creating reposts:", error)
        throw error
    }
}

module.exports = { seed }


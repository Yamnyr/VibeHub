const Signet = require("../models/Signet")

// Function to generate random signets (bookmarks)
const generateSignets = (users, posts, count = 60) => {
    const signets = []
    const signetMap = new Map() // To avoid duplicates

    // Filter out any posts or users that don't have a valid _id
    const validPosts = posts.filter((post) => post && post._id)
    const validUsers = users.filter((user) => user && user._id)

    if (validPosts.length === 0 || validUsers.length === 0) {
        throw new Error("No valid posts or users found for generating signets")
    }

    let attempts = 0
    const maxAttempts = count * 2 // Avoid infinite loop

    while (signets.length < count && attempts < maxAttempts) {
        attempts++
        const randomUser = validUsers[Math.floor(Math.random() * validUsers.length)]
        const randomPost = validPosts[Math.floor(Math.random() * validPosts.length)]

        // Skip if either user or post is invalid
        if (!randomUser || !randomUser._id || !randomPost || !randomPost._id) {
            continue
        }

        // Create a unique key to avoid duplicates
        const signetKey = `${randomUser._id}-${randomPost._id}`

        // Check if this signet already exists
        if (!signetMap.has(signetKey)) {
            signets.push({
                userId: randomUser._id,
                postId: randomPost._id,
            })

            signetMap.set(signetKey, true)
        }
    }

    return signets
}

// Function to create signets
const seed = async (users, posts) => {
    try {
        // Validate inputs
        if (!users || users.length === 0 || !posts || posts.length === 0) {
            throw new Error("Invalid input for signet seeding")
        }

        // Delete all existing signets
        await Signet.deleteMany({})

        // Generate random signets
        const signetsData = generateSignets(users, posts)

        // Insert signets into the database
        const createdSignets = await Signet.insertMany(signetsData)

        return createdSignets
    } catch (error) {
        console.error("Error creating signets:", error)
        throw error
    }
}

module.exports = { seed }


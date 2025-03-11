const Signet = require("../models/Signet")

// Function to generate random signets (bookmarks)
const generateSignets = (users, posts, count = 60) => {
    const signets = []
    const signetMap = new Map() // To avoid duplicates

    // Make sure we have valid posts and users to work with
    if (!posts || posts.length === 0) {
        console.error("No posts provided for generating signets")
        return []
    }

    if (!users || users.length === 0) {
        console.error("No users provided for generating signets")
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

    console.log(`Generated ${signets.length} signets from ${attempts} attempts`)
    return signets
}

// Function to create signets
const seed = async (users, posts) => {
    try {
        // Validate inputs
        if (!users || users.length === 0) {
            throw new Error("No users provided for signet seeding")
        }

        if (!posts || posts.length === 0) {
            throw new Error("No posts provided for signet seeding")
        }

        // Delete all existing signets
        await Signet.deleteMany({})
        console.log("Deleted existing signets")

        // Generate random signets
        const signetsData = generateSignets(users, posts)

        if (signetsData.length === 0) {
            console.log("No signets generated, skipping insertion")
            return []
        }

        // Log a sample signet for debugging
        console.log("Sample signet data:", signetsData[0])

        // Insert signets into the database
        const createdSignets = await Signet.insertMany(signetsData)
        console.log(`Inserted ${createdSignets.length} signets`)

        return createdSignets
    } catch (error) {
        console.error("Error creating signets:", error)
        throw error
    }
}

module.exports = { seed }

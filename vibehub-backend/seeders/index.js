const mongoose = require("mongoose")
const dotenv = require("dotenv")
const userSeeder = require("./userSeeder")
const postSeeder = require("./postSeeder")
const followSeeder = require("./followSeeder")
const signetSeeder = require("./signetSeeder")
const hashtagSeeder = require("./hashtagSeeder")
const notificationSeeder = require("./notificationSeeder")

dotenv.config()

// Function to run all seeders
const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to MongoDB for seeding")

        // Run seeders in order
        console.log("Starting seeding process...")

        // 1. Create users first
        const users = await userSeeder.seed()
        console.log(`✅ Created ${users.length} users`)

        // 2. Create posts
        const posts = await postSeeder.seed(users)
        console.log(`✅ Created ${posts.length} posts`)

        // 3. Create hashtags from posts
        const hashtags = await hashtagSeeder.seed(posts)
        console.log(`✅ Created ${hashtags.length} hashtags`)

        // 5. Create follows between users
        const follows = await followSeeder.seed(users)
        console.log(`✅ Created ${follows.length} follows`)

        // 7. Create bookmarks
        const signets = await signetSeeder.seed(users, posts)
        console.log(`✅ Created ${signets.length} bookmarks`)

        // 8. Create notifications based on interactions
        const notifications = await notificationSeeder.seed(users)
        console.log(`✅ Created ${notifications.length} notifications`)

        console.log("✅ Seeding completed successfully!")

        // Disconnect from MongoDB
        await mongoose.disconnect()
        console.log("Disconnected from MongoDB")

        process.exit(0)
    } catch (error) {
        console.error("❌ Error during seeding:", error)
        await mongoose.disconnect()
        process.exit(1)
    }
}

// Run the seeding
seedDatabase()


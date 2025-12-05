/**
 * Add sessions collection migration
 * Creates collection and indexes for Session model
 */
module.exports = {
  async up(db) {
    // Create Sessions collection with indexes
    const sessionsCollection = db.collection("sessions");

    // Create unique index on refreshToken
    await sessionsCollection.createIndex({ refreshToken: 1 }, { unique: true });

    // Create index on userId for faster queries
    await sessionsCollection.createIndex({ userId: 1 });

    // Create compound index on userId and refreshToken
    await sessionsCollection.createIndex({ userId: 1, refreshToken: 1 });

    // Create TTL index on expiresAt for automatic expiration
    await sessionsCollection.createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0 }
    );

    console.log("✅ Created sessions collection with indexes");
  },

  async down(db) {
    // Drop indexes
    const sessionsCollection = db.collection("sessions");

    try {
      await sessionsCollection.dropIndex("refreshToken_1");
      await sessionsCollection.dropIndex("userId_1");
      await sessionsCollection.dropIndex("userId_1_refreshToken_1");
      await sessionsCollection.dropIndex("expiresAt_1");
      console.log("✅ Dropped indexes from sessions collection");
    } catch (error) {
      console.log("⚠️  Some indexes may not exist:", error.message);
    }

    // Note: We don't drop collections in down() to avoid data loss
    // If you need to drop the collection, uncomment below:
    // await db.collection('sessions').drop();
  },
};

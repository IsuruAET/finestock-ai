/**
 * Hash refresh tokens migration
 * Updates indexes to use tokenIdentifier instead of refreshToken
 * Note: Existing tokens will need to be re-hashed or invalidated
 */
module.exports = {
  async up(db) {
    const sessionsCollection = db.collection("sessions");

    try {
      // Drop old unique index on refreshToken (if exists)
      await sessionsCollection.dropIndex("refreshToken_1");
      console.log("✅ Dropped old refreshToken unique index");
    } catch (error) {
      console.log("⚠️  refreshToken index may not exist:", error.message);
    }

    try {
      // Drop compound index (if exists)
      await sessionsCollection.dropIndex("userId_1_refreshToken_1");
      console.log("✅ Dropped old compound index");
    } catch (error) {
      console.log("⚠️  Compound index may not exist:", error.message);
    }

    // Create index on tokenIdentifier for fast lookups
    await sessionsCollection.createIndex({ tokenIdentifier: 1 });
    console.log("✅ Created tokenIdentifier index");

    // Note: Existing sessions with plaintext tokens will be invalid
    // They'll be cleaned up on next refresh attempt or TTL expiration
    console.log("⚠️  Existing sessions need to be re-authenticated");
  },

  async down(db) {
    const sessionsCollection = db.collection("sessions");

    try {
      await sessionsCollection.dropIndex("tokenIdentifier_1");
      console.log("✅ Dropped tokenIdentifier index");
    } catch (error) {
      console.log("⚠️  tokenIdentifier index may not exist:", error.message);
    }

    // Recreate old indexes (but tokens are now hashed, so unique won't work)
    try {
      await sessionsCollection.createIndex(
        { refreshToken: 1 },
        { unique: true }
      );
      await sessionsCollection.createIndex({ userId: 1, refreshToken: 1 });
      console.log("✅ Recreated old indexes");
    } catch (error) {
      console.log("⚠️  Could not recreate old indexes:", error.message);
    }
  },
};

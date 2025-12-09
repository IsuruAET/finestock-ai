/**
 * Add token reuse detection fields migration
 * Adds previousTokenHash and previousTokenIdentifier to sessions collection
 * for detecting refresh token reuse after rotation
 */
module.exports = {
  async up(db) {
    const sessionsCollection = db.collection("sessions");

    try {
      // Add new fields to all existing sessions (will be null initially)
      const result = await sessionsCollection.updateMany(
        {},
        {
          $set: {
            previousTokenHash: null,
            previousTokenIdentifier: null,
          },
        }
      );
      console.log(
        `✅ Updated ${result.modifiedCount} sessions with reuse detection fields`
      );

      // Create index on previousTokenIdentifier for fast reuse detection lookups
      await sessionsCollection.createIndex(
        { previousTokenIdentifier: 1 },
        { sparse: true } // Sparse index since field can be null
      );
      console.log("✅ Created previousTokenIdentifier index");

      // Ensure tokenIdentifier index exists (should already exist from previous migration)
      try {
        await sessionsCollection.createIndex(
          { tokenIdentifier: 1 },
          { unique: true }
        );
        console.log("✅ Ensured tokenIdentifier unique index exists");
      } catch (error) {
        if (error.code === 85) {
          // Index already exists with different options, drop and recreate
          await sessionsCollection.dropIndex("tokenIdentifier_1");
          await sessionsCollection.createIndex(
            { tokenIdentifier: 1 },
            { unique: true }
          );
          console.log("✅ Recreated tokenIdentifier unique index");
        } else {
          console.log("⚠️  tokenIdentifier index may already exist");
        }
      }
    } catch (error) {
      console.error("❌ Migration failed:", error);
      throw error;
    }
  },

  async down(db) {
    const sessionsCollection = db.collection("sessions");

    try {
      // Remove the new fields from all sessions
      await sessionsCollection.updateMany(
        {},
        {
          $unset: {
            previousTokenHash: "",
            previousTokenIdentifier: "",
          },
        }
      );
      console.log("✅ Removed reuse detection fields from sessions");

      // Drop the previousTokenIdentifier index
      try {
        await sessionsCollection.dropIndex("previousTokenIdentifier_1");
        console.log("✅ Dropped previousTokenIdentifier index");
      } catch (error) {
        console.log(
          "⚠️  previousTokenIdentifier index may not exist:",
          error.message
        );
      }
    } catch (error) {
      console.error("❌ Rollback failed:", error);
      throw error;
    }
  },
};


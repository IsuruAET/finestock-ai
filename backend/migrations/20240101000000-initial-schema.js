/**
 * Initial schema migration
 * Creates collections and indexes for User and Image models
 */
module.exports = {
  async up(db) {
    // Create Users collection with indexes
    const usersCollection = db.collection('users');
    
    // Create unique index on email
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    
    // Create index on fullName for faster searches
    await usersCollection.createIndex({ fullName: 1 });
    
    console.log('✅ Created users collection with indexes');

    // Create Images collection with indexes
    const imagesCollection = db.collection('images');
    
    // Create compound index on userId and imageType (as defined in Image model)
    await imagesCollection.createIndex({ userId: 1, imageType: 1 });
    
    // Create index on userId for faster queries
    await imagesCollection.createIndex({ userId: 1 });
    
    // Create index on s3Key for faster lookups
    await imagesCollection.createIndex({ s3Key: 1 });
    
    console.log('✅ Created images collection with indexes');
  },

  async down(db) {
    // Drop indexes
    const usersCollection = db.collection('users');
    await usersCollection.dropIndex('email_1');
    await usersCollection.dropIndex('fullName_1');
    
    const imagesCollection = db.collection('images');
    await imagesCollection.dropIndex('userId_1_imageType_1');
    await imagesCollection.dropIndex('userId_1');
    await imagesCollection.dropIndex('s3Key_1');
    
    console.log('✅ Dropped indexes from users and images collections');
    
    // Note: We don't drop collections in down() to avoid data loss
    // If you need to drop collections, uncomment below:
    // await db.collection('users').drop();
    // await db.collection('images').drop();
  }
};


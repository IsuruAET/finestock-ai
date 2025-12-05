// migrate-mongo configuration
require("dotenv").config();

const config = {
  mongodb: {
    url: process.env.MONGO_URI,
    databaseName: process.env.MONGO_DB_NAME || undefined, // Optional, will use database from URI if not specified
    options: {},
  },
  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
  migrationFileExtension: ".js",
  useFileHash: false,
  moduleSystem: "commonjs",
};

module.exports = config;

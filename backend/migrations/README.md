# Database Migrations

This directory contains database migration files using `migrate-mongo`.

## Migration Commands

### Create a new migration
```bash
npm run migrate:create <migration-name>
```

### Run pending migrations
```bash
npm run migrate:up
```

### Rollback last migration
```bash
npm run migrate:down
```

### Check migration status
```bash
npm run migrate:status
```

### List all migrations
```bash
npm run migrate:list
```

## Migration File Structure

Each migration file should export an object with `up` and `down` methods:

```javascript
module.exports = {
  async up(db) {
    // Migration logic here
    // Example: await db.collection('users').createIndex({ email: 1 }, { unique: true });
  },

  async down(db) {
    // Rollback logic here
    // Example: await db.collection('users').dropIndex('email_1');
  }
};
```

## Best Practices

1. **Always test migrations** on a development database first
2. **Write reversible migrations** - implement both `up` and `down` methods
3. **Use descriptive names** - include what the migration does
4. **Don't modify existing migrations** - create new ones instead
5. **Backup data** before running migrations in production
6. **Run migrations in order** - they're executed based on timestamp in filename

## Example Migration

To add a new field to the users collection:

```javascript
module.exports = {
  async up(db) {
    await db.collection('users').updateMany(
      {},
      { $set: { newField: 'defaultValue' } }
    );
    await db.collection('users').createIndex({ newField: 1 });
  },

  async down(db) {
    await db.collection('users').updateMany(
      {},
      { $unset: { newField: '' } }
    );
    await db.collection('users').dropIndex('newField_1');
  }
};
```


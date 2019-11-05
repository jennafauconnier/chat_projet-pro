const TABLES = [
  {
    table: 'users',
    createTable: (table, knex) => {
      table.increments();
      table.string('username', 60).notNullable();
      table.unique('username');
      table.string('password', 60).notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    },
  },
  {
    table: 'rooms',
    createTable: (table, knex) => {
      table.increments();
      table.string('name', 60).notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    },
  },
  {
    table: 'messages',
    createTable: (table, knex) => {
      table.increments();
      table.integer('user_id').notNullable();
      table.integer('room_id').notNullable();
      table
        .timestamp('date')
        .notNullable()
        .defaultTo(knex.fn.now());
      table.text('text').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    },
  },
  {
    table: 'room_user',
    createTable: (table, knex) => {
      table.increments();
      table.integer('user_id').notNullable();
      table.integer('room_id').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    },
  },
];

exports.up = async knex => {
  await Promise.all(
    TABLES.map(async ({ table, createTable }) => {
      const tableExists = await knex.schema.hasTable(table);
      if (tableExists) await knex.schema.dropTable(table);
      await knex.schema.createTable(table, kTable => createTable(kTable, knex));
    }),
  );
};

exports.down = knex => {
  return Promise.all(
    TABLES.map(async ({ table }) => {
      return knex.schema.hasTable(table, async exists => {
        if (!exists) return Promise.resolve();
        await knex.schema.dropTable(table);
      });
    }),
  );
};

exports.config = { transaction: false };

const knex = require('knex');

let client;

const USE_MIGRATIONS = process.env.PG_USE_MIGRATIONS === 'true';
const {
  PG_HOST: HOST,
  PG_PORT: PORT,
  PG_USER: USER,
  PG_PASSWORD: PASSWORD,
  PG_DATABASE: DATABASE,
} = process.env;

const knexConfig = {
  client: 'pg',
  connection: {
    host: HOST,
    port: PORT,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
  },
  acquireConnectionTimeout: 1000000,
};

if (USE_MIGRATIONS) {
  knexConfig.migrations = {
    tableName: 'knex_migrations',
    directory: `${__dirname}/migrations`,
  };
}

async function init() {
  client = knex(knexConfig);
  if (USE_MIGRATIONS) {
    console.info('Running migrations');
    await client.migrate.latest();
  }

  console.info('PG initialized');
}

function get() {
  return client;
}

module.exports = {
  init,
  get,
};

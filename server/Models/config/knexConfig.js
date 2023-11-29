const knex = require('knex')({
    client: 'pg', // PostgreSQL
    connection: {
        user: 'MO',
        password: '123',
        host: 'localhost',
        port: 5432,
        database: 'EcoVoyage'
    }
});

module.exports = knex;

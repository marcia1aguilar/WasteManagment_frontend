//Connection with the database

const { Pool }= require('pg');//PostgreSQL client

//Create a pool object to store queries
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL, //Getting the url from .env
    ssl: { rejectUnauthorized: false }, //Requires for Neon
});

//Export the pool so other files can use it
module.exports = pool;


const pgp = require('pg-promise')(/* options */)
const db  = pgp('postgres://username:password@host:port/database')


// PostgreSQL
const dev_dbConfig = {
    host:     'db',
    port:     5432,
    database: process.env.POSTGRES_DB,
    user:     process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
};



/*TEMPORARY*/
db.one('SELECT $1 AS value', 123)
  .then((data) => {
    console.log('DATA:', data.value)
  })
  .catch((error) => {
    console.log('ERROR:', error)
  })

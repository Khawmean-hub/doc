const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://ioatdkop:Jwxkjpj0unTI5BZ7cEvZromZTjNPrF3O@arjuna.db.elephantsql.com/ioatdkop')
// const db = pgp('postgres://postgres:123@localhost:5432/b2b')
db.one('SELECT $1 AS value', 123)
  .then((data) => {
    console.log('DATA:', data.value)
  })
  .catch((error) => {
    console.log('ERROR:', error)
  })


module.exports = db;
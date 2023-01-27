const pgp = require('pg-promise')(/* options */)
const db = pgp('postgresql://stdy:stdy@192.168.178.83:5432/stdydb')
// const db = pgp('postgres://postgres:123@localhost:5432/b2b')
db.one('SELECT $1 AS value', 123)
  .then((data) => {
    console.log('DATA:', data.value)
  })
  .catch((error) => {
    console.log('ERROR:', error)
  })

module.exports = db;
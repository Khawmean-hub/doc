const pgp = require('pg-promise')(/* options */)

//const db = pgp('postgresql://stdy:stdy@192.168.178.83:5432/stdydb'); // Import from STDY

// DB Local DB
// const db = pgp('postgresql://ioatdkop:Jwxkjpj0unTI5BZ7cEvZromZTjNPrF3O@arjuna.db.elephantsql.com:5432/ioatdkop'); 

const db = pgp('postgresql://postgres:pg12!@@192.168.178.81:5432/b2bdoc_dev'); // Ubutu server DB for dev

// const db = pgp('postgresql://postgres:pg12!@@192.168.178.81:5432/b2bdoc_real');   // Ubutu server DB for real

//const db = pgp('postgresql://postgres:pg12!@@localhost:5432/b2bdoc_dev');      



db.one('SELECT $1 AS value', 123)
  .then((data) => {
    console.log('Connection is working.')
  })
  .catch((error) => {
    console.log('ERROR:', error)
  })

module.exports = db;    
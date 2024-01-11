const pgp = require('pg-promise')(/* options */)

//const db = pgp('postgresql://stdy:stdy@192.168.178.83:5432/stdydb'); // Import from STDY

// DB Local DB
 const db = pgp('postgresql://b2b_doc_db_user:CAnVF0Keft4IiO7SGHcPnyhOLfK1iNtI@dpg-cmfria8cmk4c739dv7tg-a.singapore-postgres.render.com:5432/b2b_doc_db');
// postgres://b2b_doc_db_user:CAnVF0Keft4IiO7SGHcPnyhOLfK1iNtI@dpg-cmfria8cmk4c739dv7tg-a.singapore-postgres.render.com/b2b_doc_db
// const db = pgp('postgresql://b2b_doc_db_user:pg12!@@192.168.178.81:5432/b2b_doc_db'); // Ubutu server DB for dev

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

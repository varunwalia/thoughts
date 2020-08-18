const mysql = require('mysql');
// const bcrypt = require('bcryptjs')

// Create mysql connection
const db = mysql.createConnection({
    host     : 'mydb',
    user     : 'user',
    password : 'password',
    database : 'twitter'
  })
module.exports = db ;


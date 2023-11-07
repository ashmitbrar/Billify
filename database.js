const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', 
    password: 'Bobby_2012', 
    database: 'billify', 
});
// Connect to the database
connection.connect(error => {
    if (error) {
      console.error('Error connecting to the database:', error);
      return;
    }
    console.log('Connected to the database.');
  });
  
  module.exports = connection;
require('dotenv').config();
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password:'2morrow4ever',
    database: 'employee_db',
});

console.clear();
console.log('How can I help you today?');

module.exports = connection;
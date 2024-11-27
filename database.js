require('dotenv').config();
const mysql = require('mysql2');

//ESTABLISH CONNECTION WITH DB

const connectionString = process.env.DATABASE_URL;
console.log(connectionString);
const db = mysql.createConnection(connectionString);

db.connect((err) => {
    if(err) {
        console.error('Error connectiog to MySQL:', err);
        return;
    }
    console.log("Connected to MySQL");
});

// CREATE A SCHOOLS TABLE

let query = "CREATE TABLE `schools` (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), address VARCHAR(255), latitude FLOAT(10, 6), longitude FLOAT(10, 6));"

db.query(query, (err, results) => {
    if(err) {
        console.error('Error while creating table', err);
        return;
    }

    console.log('Table created', results);
})


module.exports = db;
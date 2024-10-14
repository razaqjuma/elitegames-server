const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'phpmyadmin',   // MySQL username
    password: 'Razaq176730', // MySQL password
    database: 'elitegame' // Your database name
});

// Connect to the Database
db.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// Route to receive game data
app.post('/store_game_data', (req, res) => {
    const { url, content } = req.body; // Get data from the request body
    
    // Extract the gameid from "C"
    const gameid = content.C.split(",")[0];  // "d-D9490791-B"

    // Extract f, v, s, and h from "M"
    const f = content.M[0].A[0].f;
    const v = content.M[0].A[0].v;
    const s = content.M[0].A[0].s;
    const h = content.M[0].A[0].h;

    // Prepare SQL query
    const insertQuery = 'INSERT INTO game_sessions (game_id, point, session_time, crash, hash_value) VALUES (?, ?, ?, ?, ?)';
    
    // Dummy data for now (replace this with actual data you want to store)
    const gameData = [url, v, s, f, h]; // Modify as per your schema

    db.query(insertQuery, gameData, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error inserting data');
        }
        res.status(200).send('Data stored successfully!');
    });
});

// Start the Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

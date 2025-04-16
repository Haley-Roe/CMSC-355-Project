const express = require('express');
const bodyParser = require('body-parser');
const { authenticate } = require('./LoginSystem');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware to parse JSON data
app.use(bodyParser.json());

// Serve static files (e.g., login.html)
app.use(express.static(__dirname));

// Load credentials from file
loadCreds('accounts.txt');

// Handle signup requests
app.post('/signup', (req, res) => {
    const { firstname, username, email, password } = req.body;

    // Perform server-side validation
    if (!firstname || !username || !email || !password) {
        return res.status(400).send({ message: 'All fields are required.' });
    }

    // Simulate saving the user to a file (replace with database logic if needed)
    const user = { firstname, username, email, password };
    fs.appendFile('users.txt', JSON.stringify(user) + '\n', (err) => {
        if (err) {
            console.error('Error saving user:', err);
            return res.status(500).send({ message: 'Failed to save user.' });
        }

        res.status(200).send({ message: 'Signup successful!' });
    });
});

// Handle login requests
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (authenticate(username, null, password)) {
        res.status(200).send({ message: 'Login Successful!' });
    } else {
        res.status(401).send({ message: 'Invalid Username or Password.' });
    }
});

// Handle doctor login requests
app.post('/doctor-login', (req, res) => {
    const { email, id, password } = req.body;

    if (authenticate(email, parseInt(id, 10), password)) {
        res.status(200).send({ message: 'Login Successful! Welcome Doctor.' });
    } else {
        res.status(401).send({ message: 'Invalid credentials. Login failed.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
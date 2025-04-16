import express from 'express';
import bodyParser from 'body-parser';
import { authenticate, loadCreds } from './LoginSystem.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5500;

// Middleware to parse JSON data
app.use(bodyParser.json());
app.use(express.json());

// Load credentials from file
loadCreds('users.txt');

// Handle signup requests
app.post('/signup', (req, res) => {
    console.log('POST /signup');
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

app.use(express.static(path.join(__dirname)));

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
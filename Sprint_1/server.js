import express from 'express';
import bodyParser from 'body-parser';
import { authenticate, loadCreds, users } from './LoginSystem.js';
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

app.use(express.static(path.join(__dirname)));
app.use('/home', express.static(path.join(__dirname, '../Sprint_3')));

// Load credentials from file
loadCreds('Sprint_1/users.json');

// Handle signup requests
app.post('/signup', (req, res) => {
    console.log('POST /signup');

    if (!req.body) {
        return res.status(400).json({ message: "Missing request body." });
    }
    const { userType = 'patient', firstname, username, email, password } = req.body;

    // Perform server-side validation
    if (!firstname || !username || !email || !password) {
        return res.status(400).send({ message: 'All fields are required.' });
    }

    //Check if the username or email already exists.
    const userExists = Array.from(users.values()).some((user) => user.username === username || user.email === email);
    if (userExists) {
        return res.status(400).send({ message: 'Username or email already exists.' });
    }

    // Simulate saving the user to a file (replace with database logic if needed)
    const newUser = { userType, firstname, username, email, password };

    // Store the user in the Map
    users.set(username, newUser);
    
    // Save the updated users map to the file
    const usersArray = Array.from(users.values());
    fs.writeFile('Sprint_1/users.json', JSON.stringify(usersArray, null, 2), (writeErr) => {
        if (writeErr) {
            console.error('Error saving user:', writeErr);
            return res.status(500).send({ message: 'Failed to save user.' });
        }

        res.status(200).send({ 
            message: 'Signup successful!',
            user: ({userType, firstname, username, email})
        });
    });
});


//Serve static files
//app.use(express.static(path.join(__dirname)));

// Handle login requests
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (authenticate(username, null, password)) {
        const user = users.get(username);
        
        const {userType, firstname, email } = user;

        res.status(200).send({ 
            message: 'Login Successful!', 
            user: ({userType, firstname, username, email })
        });
        console.log('Login Successful!');
    } else {
        res.status(401).send({ message: 'Invalid Username or Password.' });
        console.log('Invalid Username or Password.');
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
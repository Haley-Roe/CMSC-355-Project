const fs = require('fs'); // Importing the file system module to read files

// Class to store the types of user information
class User {
    constructor(username, email, id, password, type) {
        this.username = username;
        this.email = email; // null if not required
        this.id = id; // null if not required
        this.password = password;
        this.type = type.toLowerCase();
    }
}

// Map to store credentials as Username -> User
const users = new Map();

/**
 * Method for authenticating identifier , Password, and ID.
 * Also checks if ID is necessary using `requiresID`.
 */
function authenticate(identifier, inputID, password) {
    if (users.has(identifier)) {
        const user = users.get(identifier);

        // Check if the user type requires an ID
        if (requiresID(user.type)) {
            // If ID is required, check if the provided ID matches
            if (user.id === null || user.id !== inputID) return false;
        }

        return user.password === password;
    }
    return false;
}

/**
 * Method checks if ID is required.
 */
function requiresID(userType) {
    return userType === 'doc' || userType === 'patient';
}

/**
 * Loads the credentials from a file.
 * This file stores the creds as different possibilities listed below.
 */
function loadCreds(file) {
    try {
        // Read the file synchronously
        const data = fs.readFileSync(file, 'utf8');
        const lines = data.split('\n');

        // Iterate through each line and parse the user information
        lines.forEach(line => {
            const parts = line.split(':');
            if (parts.length === 4) {
                // Format: type:email:id:password
                const type = parts[0].trim();
                const email = parts[1].trim();
                const id = parseInt(parts[2].trim(), 10);
                const password = parts[3].trim();
                users.set(email, new User(null, email, id, password, type));
            } else if (parts.length === 3) {
                // Format: type:username:password
                const type = parts[0].trim();
                const username = parts[1].trim();
                const password = parts[2].trim();
                users.set(username, new User(username, null, null, password, type));
            } else {
                console.log(`Error in Database Formatting on User: ${line}`);
            }
        });
    // Catch any errors that occur during file reading
    } catch (error) {
        console.log(`Error Reading File: ${error.message}`);
    }
}
//Exporting the functions for use in server
module.exports = { authenticate, loadCreds };

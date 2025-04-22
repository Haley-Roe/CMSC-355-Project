import {readFileSync} from 'fs'; // Importing the file system module to read files

// Class to store the types of user information
class User {
    constructor(userType, username, email, id, password, type) {
        this.userType = userType; // null if not required
        this.username = username;
        this.email = email; // null if not required
        this.id = id; // null if not required
        this.password = password;
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
        if (requiresID(user.userType)) {
            // If ID is required, check if the provided ID matches
            if (user.id === null || user.id !== inputID) return false;
        }

        if (user.password === password) {
            // If the password matches, authentication is successful}
            console.log('Authentication successful!');
            return true; // Authentication successful
        } else {
            console.log('Authentication failed: Incorrect password.');
            return false; // Authentication failed
        }
    }
    return false;
}

/**
 * Method checks if ID is required.
 */
function requiresID(userType) {
    if (userType === 'doc')
        return true;
    else if (userType === 'patient')
        return false;
    else {
        console.log('Error: Invalid user type.');
        return false;
    }
}

/**
 * Loads the credentials from a file.
 * This file stores the creds as different possibilities listed below.
 */
function loadCreds(file) {
    try {
        // Read the file synchronously
        const data = readFileSync(file, 'utf8');
        const usersArray = data.trim() === '' ? [] : JSON.parse(data);
        
        if (!Array.isArray(usersArray)) {
            console.log('Error: Parsed data is not an array.');
            return;
        }

        // Iterate through each line and parse the user information
        usersArray.forEach(user => {
            if (user.userType === 'doc' || user.userType === 'patient') {
                users.set(user.username, new User(
                    user.userType,
                    user.username,
                    user.email,
                    user.id || null,
                    user.password,
                ));
            } else {
                console.log(`Unsupported user type: ${user.userType}`);
            }
        });
    // Catch any errors that occur during file reading
    } catch (error) {
        console.log(`Error Reading File: ${error.message}`);
    }
}
//Exporting the functions for use in server
export { authenticate, loadCreds, users };

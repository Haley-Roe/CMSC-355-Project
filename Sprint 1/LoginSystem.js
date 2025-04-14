const fs = require('fs');
const readline = require('readline');

// Class to store the types of user information
class User {
    constructor(username, id, password, type) {
        this.username = username;
        this.id = id; // null if not required
        this.password = password;
        this.type = type.toLowerCase();
    }
}

// Map to store credentials as Username -> User
const users = new Map();

/**
 * Method for authenticating Username, Password, and ID.
 * Also checks if ID is necessary using `requiresID`.
 */
function authenticate(username, inputID, password) {
    if (users.has(username)) {
        const user = users.get(username);

        if (requiresID(user.type)) {
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
        const data = fs.readFileSync(file, 'utf8');
        const lines = data.split('\n');
        lines.forEach(line => {
            const parts = line.split(':');
            if (parts.length === 4) {
                // Format: type:username:id:password
                const type = parts[0].trim();
                const username = parts[1].trim();
                const id = parseInt(parts[2].trim(), 10);
                const password = parts[3].trim();
                users.set(username, new User(username, id, password, type));
            } else if (parts.length === 3) {
                // Format: type:username:password
                const type = parts[0].trim();
                const username = parts[1].trim();
                const password = parts[2].trim();
                users.set(username, new User(username, null, password, type));
            } else {
                console.log(`Error in Database Formatting on User: ${line}`);
            }
        });
    } catch (error) {
        console.log(`Error Reading File: ${error.message}`);
    }
}

/**
 * Main function to handle user input and authentication.
 */
async function main() {
    // Load credentials from file
    loadCreds('accounts.txt');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter Username: ', username => {
        if (!users.has(username)) {
            console.log('Username not found.');
            rl.close();
            return;
        }

        const user = users.get(username);
        let inputID = null;

        const askForID = () => {
            rl.question('Enter ID: ', id => {
                if (!isNaN(id)) {
                    inputID = parseInt(id, 10);
                    askForPassword();
                } else {
                    console.log('Invalid ID format.');
                    rl.close();
                }
            });
        };

        const askForPassword = () => {
            rl.question('Enter Password: ', password => {
                if (authenticate(username, inputID, password)) {
                    console.log(`Login Successful! Welcome ${user.type} ${user.username}.`);
                } else {
                    console.log('Invalid credentials. Login failed.');
                }
                rl.close();
            });
        };

        if (requiresID(user.type)) {
            askForID();
        } else {
            askForPassword();
        }
    });
}

// Run the main function
main();
import java.util.Scanner;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.Map;
import java.util.HashMap;

public class LoginSystem {
	//Hashmap to store credentials as Username -> Password
	private static Map<String, String> creds = new HashMap<>();
	
	/*
	 * Method for authenticating Username and Password.
	 * Can be modified for better authentication later
	 */
	private static boolean authenticate(String username, String password) {
		if (creds.containsKey(username)) {
			String storedPassword = creds.get(username);
			return storedPassword.equals(password);
		}
		return false;
	}
	
	/*
	 * Loads the credentials from a file.
	 * This file stores the creds as: Username:Password
	 * We should update this to possibly include line numbers for error checking (cont.)
	 * account name, and other details when profile is added
	 */
	public static void loadCreds(String file) {
		try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
			String line;
			while ((line = reader.readLine()) != null) {
				String[] parts = line.split(":");
				if (parts.length == 2) {
					String user = parts[0].trim();
					String pass = parts[1].trim();
					creds.put(user, pass);
				} else {
					System.out.println("Error in Database Formatting on User: " + line);
				}
			}
		} catch (IOException e) {
			System.out.println("Error Reading File: " + e.getMessage()); 
		}
	}
	
	public static void main(String[] args) {
		//We can decide the file name etc later
		loadCreds("accounts.txt");
		
		Scanner scan = new Scanner(System.in);
		
		System.out.println("Enter Username: ");
		String username = scan.nextLine();
		System.out.println("Enter Password: ");
		String password = scan.nextLine();
		
		//Validations of login
		if (authenticate(username, password)) 
			System.out.println("Login Succesful!");
		//We can add more checks like for syntax here
		else
			System.out.println("Invalid Username or Password.");
		
		scan.close();
	}

}

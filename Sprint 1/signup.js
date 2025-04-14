document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form");
    const errorMessage = document.getElementById("error-message");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Call the validation logic from SignupAndLoginErrorSystem.js
        const firstname = document.getElementById("firstname-input").value.trim();
        const username = document.getElementById("username-input").value.trim();
        const email = document.getElementById("email-input").value.trim();
        const password = document.getElementById("password-input").value.trim();
        const repeatPassword = document.getElementById("repeat-password-input").value.trim();

        const errors = getSignupFormErrors(firstname, username, email, password, repeatPassword);

        if (errors.length > 0) {
            // Display validation errors
            errorMessage.textContent = errors.join(", ");
            errorMessage.style.color = "red";
            return;
        }

        // If no errors, proceed with form submission
        try {
            const response = await fetch("/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ firstname, username, email, password }),
            });

            const result = await response.json();

            if (response.ok) {
                errorMessage.textContent = result.message; // Show success message
                errorMessage.style.color = "green"; // Change text color to green
                // Redirect to the next page or perform additional actions
            } else {
                errorMessage.textContent = result.message; // Show error message from server
                errorMessage.style.color = "red";
            }
        } catch (error) {
            errorMessage.textContent = "Error: " + error.message;
            errorMessage.style.color = "red";
        }
    });
});
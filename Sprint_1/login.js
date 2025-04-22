document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form");
    const errorMessage = document.getElementById("error-message");

    form.addEventListener("submit", async function handleLogin(event) {
        event.preventDefault();

        const username = document.getElementById('username-input').value;
        const password = document.getElementById('password-input').value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();

            if (response.ok) {
                errorMessage.textContent = result.message;
                errorMessage.style.color = 'green';
            } else {
                errorMessage.textContent = result.message;
                errorMessage.style.color = 'red';
            }
        } catch (error) {
            console.error('Login error:', error);
            errorMessage.textContent = 'Login request failed.';
            errorMessage.style.color = 'red';
        }
    });
});
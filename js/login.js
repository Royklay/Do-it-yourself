// Get the login form from our HTML
const loginForm = document.getElementById("loginForm");

// Get the message area
const message = document.getElementById("message");

// Listen for when the user submits the form
loginForm.addEventListener("submit", function(event) {

    // Prevent the page from refreshing
    event.preventDefault();

    // Get the values entered by the user
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // Check if the password is long enough
    if (password.length < 6) {
        message.textContent = "Password must be at least 6 characters.";
        message.style.color = "#ff7070";
        return;
    }

    // Check if the email and password have been entered
    if (email === "" || password === "") {
        message.textContent = "Please fill in all fields.";
        message.style.color = "#ff7070";
        return;
    }

    // Display a confirmation message
    message.textContent = "Form submitted successfully!";
    message.style.color = "#4ade80";

});
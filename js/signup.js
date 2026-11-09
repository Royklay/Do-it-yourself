// Get the signup form from signup.html
const signupForm = document.getElementById("signupForm");
// Get the message area where we display feedback
const signupMessage = document.getElementById("signupMessage");
// Run this code when the user submits the form
signupForm.addEventListener("submit", function (event) {
     // Stop the page from refreshing automatically
    event.preventDefault();
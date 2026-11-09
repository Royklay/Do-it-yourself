// Get the signup form from signup.html
const signupForm = document.getElementById("signupForm");
// Get the message area where we display feedback
const signupMessage = document.getElementById("signupMessage");
// Run this code when the user submits the form
signupForm.addEventListener("submit", function (event) {
     // Stop the page from refreshing automatically
    event.preventDefault();
      // Get the values entered by the user
    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
  // Check whether the two passwords match
    if (password !== confirmPassword) {
        signupMessage.textContent = "Passwords do not match!";
        return;
    }
  // Check whether an account has already been registered
    const existingUser = localStorage.getItem("fixitUser");

    if (existingUser) {
        signupMessage.textContent = "An account already exists. Please Sign In.";
        return;
    }
  // Put the user's details into an object
    const user = {
        fullName: fullName,
        email: email,
        password: password
    };
 // Save the user's details in the browser
    localStorage.setItem("fixitUser", JSON.stringify(user));
// Display a success message
    signupMessage.textContent = "Account created successfully! Redirecting to Sign In...";
// Take the user to the Sign In page
    setTimeout(function () {
        window.location.href = "login.html";
    }, 1500);

});
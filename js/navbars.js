const navButtons = document.getElementById("navButtons");

if (navButtons) {

    const savedUser = localStorage.getItem("fixitUser");
    const loggedIn = localStorage.getItem("fixitLoggedIn");

    if (loggedIn === "true") {

        navButtons.innerHTML = `
            <span>Welcome Back!</span>
            <a href="#" class="login-btn" id="logoutBtn">Log Out</a>
        `;

        document.getElementById("logoutBtn").addEventListener("click", function () {
            localStorage.removeItem("fixitLoggedIn");
            window.location.href = "index.html";
        });

    } else if (savedUser) {

        navButtons.innerHTML = `
            <a href="login.html" class="login-btn">Sign In</a>
        `;

    }

}
document.addEventListener("DOMContentLoaded", () => {
  // When the page is loaded, look for the login, signup, and error message elements
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const errorMessages = document.getElementById("error-messages");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // Prevent the default form submission (page reload)

      const data = {
        // Stuff we are sending to the server
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
      };

      try {
        const res = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        // If the response is successful, redirect to the home page
        if (res.ok) {
          window.location.href = "dashboard.html";
        } else {
          // If the response is not successful, display the error message
          errorMessages.textContent =
            res.status + " - " + res.statusText ||
            "An error occurred with the server";
        }
      } catch (err) {
        // If an error occurred with the request, display the error message
        errorMessages.textContent =
          err.message || "An error occurred with the server";
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm-password").value;

      if (password !== confirmPassword) {
        // First check if the passwords match, if not, throw an error
        errorMessages.textContent = "Passwords do not match";
        throw new Error("Passwords do not match");
      }

      const data = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: password,
      };

      try {
        const res = await fetch("http://localhost:5000/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        await res.json();

        if (res.ok) {
          // If the response is successful, redirect to the home page
          window.location.href = "dashboard.html";
        }
      } catch (err) {
        // If an error occurred with the request, display the error message
        errorMessages.textContent =
          err.message || "An error occurred with the server";
      }
    });
  }
});

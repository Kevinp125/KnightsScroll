document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const errorMessages = document.getElementById("error-messages");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();  // Prevent the default form submission (page reload)

      const data = {
        email: document.getElementById("user").value, //change the id for this to user since the input isnt email just fixing it
        password: document.getElementById("password").value,
      };

      try {
        const res = await fetch("/backend/api/Login.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const userData = await res.json(); // Parse the response

        if (res.ok) {
          // Save user data to localStorage
          localStorage.setItem('user', JSON.stringify({
            id: userData.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: data.email
          }));
          
          window.location.href = "/frontend/public/dashboard.html";
        } else {
          errorMessages.textContent =
            res.status + " - " + res.statusText ||
            "An error occurred with the server";
        }
      } catch (err) {
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
        errorMessages.textContent = "Passwords do not match";
        throw new Error("Passwords do not match");
      }

      const data = { // Data we are sending to backend to DB
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("user").value,
        password: password,
      };

      try {
        const res = await fetch("/backend/api/Signup.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const userData = await res.json();

        if (res.ok) {
          // Save user data to localStorage after successful signup
          localStorage.setItem('user', JSON.stringify({
            id: userData.id,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email
          }));
          
          window.location.href = "/frontend/public/dashboard.html"; // Redirect user to dashboard page
        }
      } catch (err) {
        errorMessages.textContent =
          err.message || "An error occurred with the server";
      }
    });
  }
});
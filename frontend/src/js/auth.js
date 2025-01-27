document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const errorMessages = document.getElementById("error-messages");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // Prevent the default form submission (page reload)

      const data = {
        userName: document.getElementById("user").value, //change the id for this to user since the input isnt email just fixing it
        password: document.getElementById("password").value,
      };

      try {
        const res = await fetch("../../backend/api/Login.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const userData = await res.json(); // Parse the response
        console.log("userData: ", userData);

        if (res.ok) {
          // Save user data to localStorage
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: userData.id,
              firstName: userData.firstName,
              lastName: userData.lastName,
              userName: data.userName,
            })
          );
          window.location.href = "/frontend/src/dashboard.html";
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
        return;
      }

      const data = {
        // Data we are sending to backend to DB
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        userName: document.getElementById("user").value,
        password: password,
      };

      console.log("Sending data..");
      try {
        const res = await fetch("../../backend/api/SignUp.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        console.log("Res: ", res)



        if (res.ok) {
          // Save user data to localStorage after successful signup
          // localStorage.setItem(
          //   "user",
          //   JSON.stringify({
          //     id: userData.id,
          //     firstName: data.firstName,
          //     lastName: data.lastName,
          //     userName: data.userName,
          //   })
          // );

          window.location.href = "/frontend/src/dashboard.html"; // Redirect user to dashboard page
        }
      } catch (err) {
        console.error("Error within SignUp: ", err);
        errorMessages.textContent =
          err.message || "An error occurred with the server";
      }
    });
  }
});

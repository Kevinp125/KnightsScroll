document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const errorMessages = document.getElementById("error-message"); //changed this to error-message was error-messages before and in login html code the id is error-messages id didnt match.

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // Prevent the default form submission (page reload)
      const data = {
        userName: document.getElementById("user").value, //change the id for this to user since the input isnt email just fixing it
        password: md5(document.getElementById("password").value), //md5 hashes the password beacuse the passwords stored in the database are hashed
      };

      console.log(data.password);

      try {
        const res = await fetch("../../backend/api/Login.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const userData = await res.json(); // Parse the response      
        if (userData.userId !== 0) { //this before was checking if res.ok redirect user to dashboard and save info to localStorage. However
                                //this was wrong because res.ok is checking if the response is 200 or not which would always be true if the response is successful
                                //the real check is if to see if backend returned a userData.id of 0 if does the user doesnt exit. That is why we check here if it ISNT zero we redirect user
                                //otherwise print the error message 
                                // Save user data to localStorage
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: userData.userId,
              firstName: userData.firstName,
              lastName: userData.lastName,
              userName: data.userName,
            })
          );
          window.location.href = "/frontend/src/dashboard.html";
        } else {
          errorMessages.textContent = "Invalid username or password";
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

      password = md5(password); //md5 hashes the password before sending it to the backend

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
        
        const userData = await res.json(); // Parse the response
      
        if (userData.userId !== 0) { //if the SignUp API sends back an Id that isnt 0 (0 is the error one if the user already exists) then we store user session in local storage and tell them account has been created
          // Save user data to localStorage after successful signup
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: userData.userId,
              firstName: data.firstName,
              lastName: data.lastName,
              userName: data.userName,
            })
          );
          
          errorMessages.textContent = "Account created successfully";
          // window.location.href = "/frontend/src/dashboard.html"; // We had this here before to redirect user to dashboard as soon as they click sign up but I am going to have them log in instead
        }
        else {
          errorMessages.textContent = userData.error; //else means the user already exists so we print the message backend sends back which says username already exists
        }
      } catch (err) {
        console.error("Error within SignUp: ", err);
        errorMessages.textContent =
          err.message || "An error occurred with the server";
      }
    });
  }
});

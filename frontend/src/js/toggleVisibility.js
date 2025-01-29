//made this js file to toggle the visibility of the password field in the login and register page

function toggleVisbility(passwordFieldId, imgIconId){ //make a function for resuability since I want to add the toggle visibility to both login and signup page

  const password = document.getElementById(passwordFieldId); //get the password field
  const visibilityImg = document.getElementById(imgIconId); //get the image that toggles the visibility

  if(password.type === "password" && password.value !== ""){ //if password is of type password this means its hidden so we want to show it if the user clicked button
    password.type = "text"; //change it to type text to show the password
    visibilityImg.src = "../public/images/hide.png"; //change the src of the image to show the hide image
  }
  else{ //else does the opposite
    password.type = "password";
    visibilityImg.src = "../public/images/show.png";
  }
}

document.getElementById("togglePasswordButton").addEventListener("click", () => {toggleVisbility("password", "togglePasswordButton")}); //add event listener to the button to toggle the visibility of the password field when clicked call function with ids
document.getElementById("toggleConfirmPasswordButton").addEventListener("click", () => {toggleVisbility("confirm-password", "toggleConfirmPasswordButton")}); //same thing here but for button next to confirm password
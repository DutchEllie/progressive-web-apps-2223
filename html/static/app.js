const preferredHandedness = window.localStorage.getItem("preferred_handedness");
const preferenceButtonLeft = document.querySelector('nav input[value="left"]');
const preferenceButtonRight = document.querySelector('nav input[value="right"]');

// Run this before we set the radiobutton with the handedness.
preferenceButtonLeft.addEventListener('click', () => {
  window.localStorage.setItem("preferred_handedness", "left");
})
preferenceButtonRight.addEventListener('click', () => {
  window.localStorage.setItem("preferred_handedness", "right");
})

if(preferredHandedness == "" || preferredHandedness === null) {
  window.localStorage.setItem("preferred_handedness", "no-preference");
}

switch(preferredHandedness) {
  case "left":
  case "no-preference":
  preferenceButtonLeft.checked = true;
  break;
  case "right":
  preferenceButtonRight.checked = true;
  break;
}


// Fix navigation hamburger menu being shite
// Selecting the a with href "#navigation"
let clickLock = false;
document.querySelector("body > header > a").addEventListener("click", (event) => {
  document.querySelector("nav").className = "nav-animate";
}, false)

// Selecting the close button in the hamburger menu
document.querySelector("nav > a:first-of-type").addEventListener("click", (event) => {
  setTimeout(() => {
    document.querySelector("nav").className = "";
  }, 500);
}, false);
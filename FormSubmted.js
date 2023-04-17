let StartGame = (event) => {
  const username = document.getElementById("Name_Input").value;
  const cameramode = document.querySelector(
    'input[name="Camera"]:checked'
  ).value;
  if (username != "") {
    const formdev = document.getElementById("Form_div");
    formdev.style.display = "none";
    document.getElementById("Welcome_Name").innerHTML =
      "Welcome " + username + ", we hope that you Enjoy Our Game";
    document.getElementById("Canvas_div").style.display = "block";
    if (cameramode == 0) {
      loadFxView();
    } else {
      loadFirstView();
    }
  } else {
    document.getElementById("name_Warning").style.display = "block";
  }
};
document.getElementById("StartGame").addEventListener("click", StartGame);
function loadFxView() {
  import("/FxView.js");
}
function loadFirstView() {
  import("/FirstView.js");
}
let PlayAgain = (event) => {
  location.reload();
};
document.getElementById("PlayAgain").addEventListener("click", PlayAgain);

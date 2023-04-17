import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { Car, Ball, wall } from "./MeshHelpers";
////////////////////
export const planedim = 90;

//0-Basic Variables
const score = document.getElementById("Score_value");
score.innerHTML = 0;
let scoreCounter = 0;
let carspeed = 3;
let BgAudio = new Audio("./Assets/BgAudio.mp3");
BgAudio.play();
BgAudio.loop = true;
//////////////////
//1-canvas
const canvas = document.getElementById("My_Canvas");
let width = window.innerWidth;
let height = window.innerHeight;
canvas.height = height;
canvas.width = width;
const aspectRatio = width / height;

//2-scene
const scene = new THREE.Scene();
const newtextureLoader = new THREE.TextureLoader();
const backgroundImage = newtextureLoader.load("./Assets/bg.jpg");
scene.background = backgroundImage;
// scene.background = new THREE.Color(0xffffff);
// scene.fog = new THREE.Fog(0xffffff, 0, 750);

//3-camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.y = 2;
camera.rotateY(-Math.PI / 2);

// 4- renderer
const renderer = new THREE.WebGL1Renderer({
  canvas: canvas,
});
renderer.setSize(canvas.width, canvas.height);
renderer.setPixelRatio(Math.max(window.devicePixelRatio, 1));
renderer.shadowMap.enabled = true;

// 5- controls
let control = new PointerLockControls(camera, canvas);

//#region Objects

// 6- objects

//6-1-Car
const car = Car();
car.rotation.x = -Math.PI / 2;
car.scale.set(0.1, 0.1, 0.1);
car.position.set(0, 0, 0);
scene.add(car);

//6-2-Plans
const textureLoader = new THREE.TextureLoader();
let planeTexture = textureLoader.load("./Assets/Sand/Sand_001_COLOR.png");
let planeNormal = textureLoader.load("./Assets/Sand/Sand_001_NRM.png");
let planeDisplacement = textureLoader.load("./Assets/Sand/Sand_001_DISP.png");
let planeAo = textureLoader.load("./Assets/Sand/Sand_001_OCC.png");

const planeGeometry = new THREE.PlaneGeometry(planedim, planedim);
const planeMaterial = new THREE.MeshStandardMaterial({
  // side: THREE.DoubleSide,
  map: planeTexture,
  normalMap: planeNormal,
  aoMap: planeAo,
  displacementMap: planeDisplacement,
  displacementScale: 0.2,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.receiveShadow = true;
plane.position.y = 0;
plane.rotation.x = -Math.PI / 2;

/////6-2-1 borders

const wall1 = wall();
wall1.position.set(0, 2.5, planedim / 2);
wall1.castShadow = true;
wall1.receiveShadow = true;
scene.add(wall1);
const wall2 = wall1.clone();
wall2.position.set(0, 2.5, -(planedim / 2));
scene.add(wall2);
const wall3 = wall1.clone();
wall3.position.set(-(planedim / 2), 2.5, 0);
wall3.rotateY(Math.PI / 2);
scene.add(wall3);
const wall4 = wall3.clone();
wall4.position.set(planedim / 2, 2.5, 0);
scene.add(wall4);

//6-3-Balls
const ballslist = [
  Ball(),
  Ball(),
  Ball(),
  Ball(),
  Ball(),
  Ball(),
  Ball(),
  Ball(),
  Ball(),
  Ball(),
];
for (const element of ballslist) {
  scene.add(element);
}

for (const element of ballslist) {
  if (getDistance(car.position, element.position) <= 2) {
    element.scale.set(0);
    scoreCounter += 1;
    score.innerHTML = scoreCounter;
  }
}
//#region Lights
// 7- lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x88ffff, 0.4);
directionalLight.position.set(26, 26, 26);
scene.add(directionalLight);
let range = 50;
directionalLight.castShadow = true;
directionalLight.shadow.camera.left = -range;
directionalLight.shadow.camera.right = range;
directionalLight.shadow.camera.bottom = -range;
directionalLight.shadow.camera.top = range;
directionalLight.shadow.radius = 1;

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(0, 20, 25);
scene.add(pointLight);
pointLight.castShadow = true;

//#region Helpers
// const spotLight = new THREE.SpotLight(0xffff00, 0.1);
// spotLight.angle = Math.PI / 6;
// spotLight.position.set(-18, 18, -18);
// spotLight.target.position.set(-5, -3, -3);
// spotLight.target.updateMatrixWorld();
// // scene.add(spotLight.target);
// // scene.add(spotLight);
// spotLight.castShadow = true;
// spotLight.shadow.camera.near = 1;
// spotLight.shadow.camera.far = 100;
// spotLight.shadow.camera.fov = Math.PI / 6;
// const axisHelper = new THREE.AxesHelper(6);
// scene.add(axisHelper);

// 7.1- light helpers
// const directionalLightHelper = new THREE.DirectionalLightHelper(
//   directionalLight,
//   6
// );
// scene.add(directionalLightHelper);

// const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5);
// scene.add(pointLightHelper);

// const spotLightHelper = new THREE.SpotLightHelper(spotLight, 0xff0000);
// scene.add(spotLightHelper);
//#edregion
camera.position.copy(car.position);
camera.position.x -= 20 * Math.cos(car.rotation.z); // move camera 10 units to the left of the car
camera.position.y += 20; // move camera 5 units above the car
camera.position.z += 20 * Math.sin(car.rotation.z); // move camera 10 units behind the car
camera.lookAt(car.position);
camera.updateProjectionMatrix();
render();
function render() {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const aspectRatio = canvas.width / canvas.height;
  camera.aspect = aspectRatio;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.width, canvas.height);
  renderer.setPixelRatio(Math.max(window.devicePixelRatio, 1));
});

//////////////////////////////////////////car movement//////////////////////////////////////////
// Set up the keyboard controls

const keyState = {};
document.addEventListener("keydown", (event) => {
  keyState[event.keyCode] = true;
});
document.addEventListener("keyup", (event) => {
  keyState[event.keyCode] = false;
});
const moveCar = () => {
  const width = plane.geometry.parameters.width;
  const height = plane.geometry.parameters.height;
  if (keyState[37]) {
    // Left arrow key
    car.rotateZ(0.05 * carspeed);
    camera.position.copy(car.position);
    camera.position.x -= 20 * Math.cos(car.rotation.z); // move camera 10 units to the left of the car
    camera.position.y += 20; // move camera 5 units above the car
    camera.position.z += 20 * Math.sin(car.rotation.z); // move camera 10 units behind the car
    camera.lookAt(car.position);
    camera.updateProjectionMatrix();
  }
  if (keyState[39]) {
    // Right arrow key
    car.rotateZ(-0.05 * carspeed);
    camera.position.copy(car.position);
    camera.position.x -= 20 * Math.cos(car.rotation.z); // move camera 10 units to the left of the car
    camera.position.y += 20; // move camera 5 units above the car
    camera.position.z += 20 * Math.sin(car.rotation.z); // move camera 10 units behind the car
    camera.lookAt(car.position);
    camera.updateProjectionMatrix();
  }
  if (keyState[38]) {
    // Up arrow key
    camera.position.copy(car.position);
    camera.position.x -= 20 * Math.cos(car.rotation.z); // move camera 10 units to the left of the car
    camera.position.y += 20; // move camera 5 units above the car
    camera.position.z += 20 * Math.sin(car.rotation.z); // move camera 10 units behind the car
    camera.lookAt(car.position);
    camera.updateProjectionMatrix();
    BallIsTouched();
    if (car.position.x < width / 2 && car.position.x > -(width / 2)) {
      car.position.x += carspeed * Math.cos(car.rotation.z);
    }
    if (car.position.x <= -(width / 2)) {
      car.position.x = -(width / 2 - 0.1);
    }
    if (car.position.x >= width / 2) {
      car.position.x = width / 2 - 0.1;
    }
    if (car.position.z < height / 2 && car.position.z > -(height / 2)) {
      car.position.z -= carspeed * Math.sin(car.rotation.z);
    }
    if (car.position.z <= -(height / 2)) {
      car.position.z = -(height / 2 - 0.1);
    }
    if (car.position.z > height / 2) {
      car.position.z = height / 2 - 0.1;
    }
  }
  if (keyState[40]) {
    // Down arrow key
    camera.position.copy(car.position);
    camera.position.x += 15 * Math.cos(car.rotation.z); // move camera 10 units to the left of the car
    camera.position.y += 15; // move camera 5 units above the car
    camera.position.z -= 15 * Math.sin(car.rotation.z); // move camera 10 units behind the car
    camera.lookAt(car.position);
    camera.updateProjectionMatrix();
    if (car.position.x < width / 2 && car.position.x > -(width / 2)) {
      car.position.x -= carspeed * Math.cos(car.rotation.z);
    }
    if (car.position.x <= -(width / 2)) {
      car.position.x = -(width / 2 - 0.1);
    }
    if (car.position.x >= width / 2) {
      car.position.x = width / 2 - 0.1;
    }
    if (car.position.z < height / 2 && car.position.z > -(height / 2)) {
      car.position.z += carspeed * Math.sin(car.rotation.z);
    }
    if (car.position.z <= -(height / 2)) {
      car.position.z = -(height / 2 - 0.1);
    }
    if (car.position.z > height / 2) {
      car.position.z = height / 2 - 0.1;
    }
  }
};
const animate = () => {
  requestAnimationFrame(animate);
  moveCar();
  renderer.render(scene, camera);
};
animate();

// Move the car based on the arrow keys

// Render the scene and update the car position
//checkdistance
function getDistance(coordinate1, coordinate2) {
  const horizontalDistance = coordinate2.x - coordinate1.x;
  const verticalDistance = coordinate2.z - coordinate1.z;
  return Math.sqrt(horizontalDistance ** 2 + verticalDistance ** 2);
}
//BALL is touched
function BallIsTouched() {
  for (const element of ballslist) {
    if (
      getDistance(car.position, element.position) > 3 &&
      getDistance(car.position, element.position) <= 5.5
    ) {
      element.material = new THREE.MeshStandardMaterial({ color: 0x7cfc00 });
      element.material.transparent = true;
    }
    if (getDistance(car.position, element.position) > 5.5) {
      element.material = new THREE.MeshStandardMaterial({ color: 0x88ffff });
      element.geometry.parameters.radius = 2;
    }
    if (getDistance(car.position, element.position) <= 3) {
      scene.remove(element);
      const index = ballslist.indexOf(element);
      if (index > -1) {
        ballslist.splice(index, 1);
      }
      scoreCounter += 1;
      score.innerHTML = scoreCounter;
      var audio = new Audio("./Assets/Point.wav");
      audio.play();
      score.style.webkitTextStroke = "2px green";
      if (scoreCounter == 10) {
        document.getElementById("Canvas_div").style.display = "none";
        document.getElementById("Win").style.display = "block";
        BgAudio.pause();
        audio = new Audio("./Assets/Win.wav");
        audio.play();
        audio.loop = true;
      }
    }
  }
}

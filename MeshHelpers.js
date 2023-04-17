import * as THREE from "three";
import { planedim } from "./FxView.js";

///car
export function Car() {
  const car = new THREE.Group();
  const backWheel = Wheel();
  backWheel.position.x = -18;
  car.add(backWheel);
  const frontWheel = Wheel();
  frontWheel.position.x = 18;
  car.add(frontWheel);
  const main = new THREE.Mesh(
    new THREE.BoxGeometry(60, 30, 15),
    new THREE.MeshStandardMaterial({ color: 0xa52523 })
  );
  main.position.z = 12;
  main.castShadow = true;
  car.add(main);
  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(33, 24, 12),
    new THREE.MeshStandardMaterial({ color: 0xbdb638 })
  );
  cabin.position.x = -6;
  cabin.position.z = 25.5;
  cabin.castShadow = true;
  car.add(cabin);
  return car;
}
function Wheel() {
  const wheel = new THREE.Mesh(
    new THREE.CylinderGeometry(6, 6, 33, 32),
    new THREE.MeshStandardMaterial({ color: 0x333333 })
  );
  wheel.position.z = 6;
  wheel.castShadow = true;
  return wheel;
}

////ball

///random number
function generateRandom(min = 0, max = 100) {
  // find diff
  let difference = max - min;

  // generate random number
  let rand = Math.random();

  // multiply with difference
  rand = Math.floor(rand * difference);

  // add with min value
  rand = rand + min;

  return rand;
}

export function Ball() {
  const Ball = new THREE.Mesh(
    new THREE.SphereGeometry(2),
    new THREE.MeshLambertMaterial({ color: 0x88ffff })
  );
  Ball.position.z = generateRandom(-(planedim / 2 - 2), planedim / 2 - 2);
  Ball.position.x = generateRandom(-(planedim / 2 - 2), planedim / 2 - 2);
  Ball.position.y = 1;
  Ball.castShadow = true;
  Ball.receiveShadow = true;
  return Ball;
}
export function wall() {
  const textureLoader = new THREE.TextureLoader();
  let wallTexture = textureLoader.load(
    "./Assets/Grass/Wood_Fence_001_basecolor.jpg"
  );
  let wallNormal = textureLoader.load(
    "./Assets/Grass/Wood_Fence_001_normal.jpg"
  );
  let wallDisplacement = textureLoader.load(
    "./Assets/Grass/Wood_Fence_001_height.png"
  );
  let wallAo = textureLoader.load(
    "./Assets/Grass/Wood_Fence_001_ambientOcclusion.jpg"
  );
  const wallGeom = new THREE.PlaneGeometry(planedim, 5, 256, 256);
  const wallMaterial = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    map: wallTexture,
    normalMap: wallNormal,
    aoMap: wallAo,
    displacementMap: wallDisplacement,
    displacementScale: 0.2,
  });
  return new THREE.Mesh(wallGeom, wallMaterial);
}

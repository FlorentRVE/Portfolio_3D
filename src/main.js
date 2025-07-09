import "./style.scss";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const canvas = document.querySelector("#experience-canvas");
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//Raycasting
const raycasterObjects = [];
let currentObjects = [];
const Links = {
  Logo_insta_raycaster: "https://www.instagram.com/florent_rve/",
  Logo_linkedin_raycaster: "https://www.linkedin.com/in/florent-rve/",
  Logo_Github_raycaster: "https://github.com/Florent-RVE/",
  Panneau_apropos_raycaster: "127.0.0.1:5500/apropos",
  Panneau_contact_raycaster: "127.0.0.1:5500/contact",
  Panneau_portfolio_raycaster: "127.0.0.1:5500/portfolio",
};
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// Loaders
const textureLoader = new THREE.TextureLoader();

// Model Loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

// General Texture
const textureDay = textureLoader.load("/textures/BakeWithBg.png", (texture) => {
  texture.flipY = false;
  texture.colorSpace = THREE.SRGBColorSpace;
});

const textureNight = textureLoader.load(
  "/textures/BakeTextureNight.webp",
  (texture) => {
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
  }
);

// Video Texture
const videoElement = document.createElement("video");
videoElement.src = "/textures/videos/video_2.mp4";
videoElement.loop = true;
videoElement.muted = true;
videoElement.autoplay = true;
videoElement.play();
const videoTexture = new THREE.VideoTexture(videoElement);
videoTexture.wrapS = THREE.RepeatWrapping;
videoTexture.wrapT = THREE.RepeatWrapping;
videoTexture.repeat.set(30, 30);
videoTexture.rotation = Math.PI / 2;

// Image Texture
const imageTexture = new THREE.TextureLoader().load(
  "textures/image/poster.png"
);
imageTexture.wrapS = THREE.RepeatWrapping;
imageTexture.wrapT = THREE.RepeatWrapping;
imageTexture.repeat.set(50, 50);

//Position Mouse
window.addEventListener("mousemove", (e) => {
  pointer.x = (e.clientX / sizes.width) * 2 - 1;
  pointer.y = -(e.clientY / sizes.width) * 2 + 1;
});

// Click event
window.addEventListener("click", () => {
  if (currentObjects.length > 0) {
    console.log(currentObjects[0].object.name);
    const newWindow = window.open();
    newWindow.opener = null;
    newWindow.location.href = Links[currentObjects[0].object.name];
    newWindow.target = "_blank";
    newWindow.rel = "noopener noreferrer";
  }
});

gltfLoader.load("/models/PortfolioAnimate.glb", (glb) => {
  glb.scene.traverse((child) => {
    if (child.isMesh) {
      if (child.name.includes("raycaster")) {
        raycasterObjects.push(child);
      }

      if (child.name.includes("Ecran_pc_1")) {
        child.material = new THREE.MeshBasicMaterial({ map: videoTexture });
      } else if (child.name.includes("Poster")) {
        child.material = new THREE.MeshBasicMaterial({ map: imageTexture });
      } else {
        const material = new THREE.MeshBasicMaterial({
          map: textureDay,
        });
        child.material = material;
      }
    }
  });

  scene.add(glb.scene);
});

const scene = new THREE.Scene();

// Preparation Rendu
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Camera
const camera = new THREE.PerspectiveCamera(
  50,
  sizes.width / sizes.height,
  0.1,
  500
);
camera.position.set(-6.7944584352431825, 4.92499568607208, 11.882923921243053);

// Limit controls
const controls = new OrbitControls(camera, renderer.domElement);

controls.minDistance = 5;
controls.maxDistance = 15;
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI / 2;

controls.minAzimuthAngle = -Math.PI / 2.3;
controls.maxAzimuthAngle = 0;

controls.enableDamping = true;
controls.dampingFactor = 0.05;

controls.update();
controls.target.set(1.4169133412459325, 1.8438733598036514, 0.7528969205635033);

// Event Listeners pour la taille de l'écran
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Rendu
const render = () => {
  controls.update();

  //Animate Object

  // update the picking ray with the camera and pointer position
  raycaster.setFromCamera(pointer, camera);

  // calculate objects intersecting the picking ray
  currentObjects = raycaster.intersectObjects(raycasterObjects);

  if (currentObjects.length) {
    document.body.style.cursor = "pointer";
    currentObjects[0].object.scale.set(1.2, 1.2, 1.2);
    currentObjects[0].object.material.color.set(0xccff00);
  } else {
    document.body.style.cursor = "default";
    for (let i = 0; i < raycasterObjects.length; i++) {
      raycasterObjects[i].scale.set(1, 1, 1);
      raycasterObjects[i].material.color.set(0xffffff);
    }
  }

  renderer.render(scene, camera);

  window.requestAnimationFrame(render);
};

render();

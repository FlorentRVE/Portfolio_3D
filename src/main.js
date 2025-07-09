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

// Loaders
const textureLoader = new THREE.TextureLoader();

// Model Loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

// General Texture
const textureDay = textureLoader.load(
  "/textures/BakeWithBgNight.png",
  (texture) => {
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
  }
);

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
const imageTexture = new THREE.TextureLoader().load( "textures/image/poster.png" );
imageTexture.wrapS = THREE.RepeatWrapping;
imageTexture.wrapT = THREE.RepeatWrapping;
imageTexture.repeat.set( 50, 50 );

gltfLoader.load("/models/Portfolio.glb", (glb) => {
  glb.scene.traverse((child) => {
    if (child.isMesh) {
      if (child.name.includes("Ecran_pc_1")) {
        child.material = new THREE.MeshBasicMaterial({ map: videoTexture });
      } else if (child.name.includes("Ecran_pc_2")) {
        child.material = new THREE.MeshBasicMaterial({ map: videoTexture });
      }else if (child.name.includes("Poster")) {
        child.material = new THREE.MeshBasicMaterial({ map: imageTexture });
      }else if (child.name.includes("Photo_1")) {
        child.material = new THREE.MeshBasicMaterial({ map: imageTexture });
      }else if (child.name.includes("Photo_2")) {
        child.material = new THREE.MeshBasicMaterial({ map: imageTexture });
      }else if (child.name.includes("Tableau")) {
        child.material = new THREE.MeshBasicMaterial({ map: imageTexture });
      }else{
        child.castShadow = true;
        child.receiveShadow = true;
        
        const material = new THREE.MeshBasicMaterial({
          map: textureDay,
        });
        child.material = material;
        
        if (child.material.map) {
          child.material.map.minFilter = THREE.Line;
        }
      }
    }
  });

  scene.add(glb.scene);
});

const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  50,
  sizes.width / sizes.height,
  0.1,
  500
);

camera.position.set(-6.7944584352431825, 4.92499568607208, 11.882923921243053);

// Lights
// const color = 'red';
// const intensity = 10;
// const light = new THREE.AmbientLight(color, intensity);
// scene.add(light);


const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.update();
controls.target.set(2.4169133412459325, 1.8438733598036514, 0.7528969205635033);

// Event Listeners pour la taille de l'écran
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const render = () => {
  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(render);
};

render();

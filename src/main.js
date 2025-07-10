import { Howl } from "howler";
import "./style.scss";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import gsap from "gsap";

/**  -------------------------- Loading Screen & Intro Animation -------------------------- */

const manager = new THREE.LoadingManager();

const loadingScreen = document.querySelector(".loading-screen");
const loadingScreenButton = document.querySelector(".loading-screen-button");

manager.onLoad = function () {
  loadingScreenButton.style.border = "8px solid #3a678c";
  loadingScreenButton.style.background = "#64b9e5";
  loadingScreenButton.style.color = "#e6dede";
  loadingScreenButton.style.boxShadow = "rgba(0, 0, 0, 0.24) 0px 3px 8px";
  loadingScreenButton.textContent = "Enter!";
  loadingScreenButton.style.cursor = "pointer";
  loadingScreenButton.style.transition =
    "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";
  let isDisabled = false;

  function handleEnter() {
    if (isDisabled) return;

    loadingScreenButton.style.cursor = "default";
    loadingScreenButton.style.border = "8px solid #3a678c";
    loadingScreenButton.style.background = "#64b9e5";
    loadingScreenButton.style.color = "#e6dede";
    loadingScreenButton.style.boxShadow = "none";
    loadingScreenButton.textContent = "~ Bienvenue ~";
    loadingScreen.style.background = "#dceaf4";
    isDisabled = true;

    backgroundMusic.play();
    playReveal();
  }

  function playReveal() {
    const tl = gsap.timeline();

    tl.to(loadingScreen, {
      scale: 0.5,
      duration: 1.2,
      delay: 0.25,
      ease: "back.in(1.8)",
    }).to(
      loadingScreen,
      {
        y: "200vh",
        transform: "perspective(1000px) rotateX(45deg) rotateY(-35deg)",
        duration: 1.2,
        ease: "back.in(1.8)",
        onComplete: () => {
          isModalOpen = false;
          loadingScreen.remove();
        },
      },
      "-=0.1"
    );
  }

  loadingScreenButton.addEventListener("mouseenter", () => {
    loadingScreenButton.style.transform = "scale(1.3)";
  });

  loadingScreenButton.addEventListener("touchend", (e) => {
    touchHappened = true;
    e.preventDefault();
    handleEnter();
  });

  loadingScreenButton.addEventListener("click", (e) => {
    if (touchHappened) return;
    handleEnter();
  });

  loadingScreenButton.addEventListener("mouseleave", () => {
    loadingScreenButton.style.transform = "none";
  });
};
/**  -------------------------- Audio setup -------------------------- */

// Background Music
let isMusicFaded = false;
const MUSIC_FADE_TIME = 500;
const BACKGROUND_MUSIC_VOLUME = 1;
const FADED_VOLUME = 0;

const backgroundMusic = new Howl({
  src: ["/audio/music/bg.ogg"],
  loop: true,
  volume: 1,
});

// Button
const buttonSounds = {
  click: new Howl({
    src: ["/audio/sfx/pop.ogg"],
    preload: true,
    volume: 0.5,
  }),
};

/**  -------------------------- Scene setup -------------------------- */
const canvas = document.querySelector("#experience-canvas");
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();
scene.background = new THREE.Color("#D9CAD1");

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  200
);

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

//Set starting camera position
camera.position.set(-6.7944584352431825, 4.92499568607208, 11.882923921243053);
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

/**  -------------------------- Modal Stuff -------------------------- */
const modals = {
  Panneau_portfolio_raycaster: document.querySelector(
    ".modal.Panneau_portfolio_raycaster"
  ),
  Panneau_apropos_raycaster: document.querySelector(
    ".modal.Panneau_apropos_raycaster"
  ),
  Panneau_contact_raycaster: document.querySelector(
    ".modal.Panneau_contact_raycaster"
  ),
};

let isModalOpen = false;
let touchHappened = false;

const showModal = (modal) => {
  modal.style.display = "block";
  isModalOpen = true;
  controls.enabled = false;
  document.body.style.cursor = "default";

  gsap.set(modal, {
    autoAlpha: 0,
  });

  gsap.to(modal, {
    autoAlpha: 1,
    duration: 0.5,
  });
};

const hideModal = (modal) => {
  isModalOpen = false;
  controls.enabled = true;

  gsap.to(modal, {
    autoAlpha: 0,
    duration: 0.5,
    onComplete: () => {
      modal.style.display = "none";
    },
  });
};

document.querySelectorAll(".modal-exit-button").forEach((button) => {
  function handleModalExit(e) {
    e.preventDefault();
    const modal = e.target.closest(".modal");

    gsap.to(button, {
      scale: 5,
      duration: 0.5,
      ease: "back.out(2)",
      onStart: () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.5,
          ease: "back.out(2)",
          onComplete: () => {
            gsap.set(button, {
              clearProps: "all",
            });
          },
        });
      },
    });

    buttonSounds.click.play();
    hideModal(modal);
  }
  button.addEventListener("click", handleModalExit);
});

/** ----------------- Raycasting --------------------- */
const raycasterObjects = [];
let currentsRaycasterObjects = [];
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

/** ----------------- Texture --------------------- */
// Loaders
const textureLoader = new THREE.TextureLoader();

// Model Loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader(manager);
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

/** ------------------------------- Mouse & Click --------------------------*/
window.addEventListener("mousemove", (e) => {
  pointer.x = (e.clientX / sizes.width) * 2 - 1;
  pointer.y = -(e.clientY / sizes.height) * 2 + 1;
});

function handleRaycasterInteraction() {
  if (!isModalOpen) {
    if (currentsRaycasterObjects.length) {
      console.log(currentsRaycasterObjects[0].object.name);

      if (currentsRaycasterObjects[0].object.name.includes("Logo")) {
        const newWindow = window.open();
        newWindow.location.href =
          Links[currentsRaycasterObjects[0].object.name];
        newWindow.target = "_blank";
        newWindow.rel = "noopener noreferrer";
      } else if (currentsRaycasterObjects[0].object.name.includes("Panneau")) {
        showModal(modals[currentsRaycasterObjects[0].object.name]);
      }
    }
  }
}

window.addEventListener("click", handleRaycasterInteraction);

window.addEventListener(
  "touchstart",
  (e) => {
    if (isModalOpen) return;
    e.preventDefault();
    pointer.x = (e.touches[0].clientX / sizes.width) * 2 - 1;
    pointer.y = -(e.touches[0].clientY / sizes.height) * 2 + 1;
  },
  { passive: false }
);

window.addEventListener(
  "touchend",
  (e) => {
    if (isModalOpen) return;
    e.preventDefault();
    handleRaycasterInteraction();
  },
  { passive: false }
);

/** ------------------------------- Mute --------------------------*/
const muteToggleButton = document.querySelector(".mute-toggle-button");
const soundOffSvg = document.querySelector(".sound-off-svg");
const soundOnSvg = document.querySelector(".sound-on-svg");
let isMuted = false;

const updateMuteState = (muted) => {
  if (muted) {
    backgroundMusic.volume(0);
  } else {
    backgroundMusic.volume(BACKGROUND_MUSIC_VOLUME);
  }

  buttonSounds.click.mute(muted);
};

const handleMuteToggle = (e) => {
  e.preventDefault();

  isMuted = !isMuted;
  updateMuteState(isMuted);
  buttonSounds.click.play();

  gsap.to(muteToggleButton, {
    rotate: -45,
    scale: 5,
    duration: 0.5,
    ease: "back.out(2)",
    onStart: () => {
      if (!isMuted) {
        soundOffSvg.style.display = "none";
        soundOnSvg.style.display = "block";
      } else {
        soundOnSvg.style.display = "none";
        soundOffSvg.style.display = "block";
      }

      gsap.to(muteToggleButton, {
        rotate: 0,
        scale: 1,
        duration: 0.5,
        ease: "back.out(2)",
        onComplete: () => {
          gsap.set(muteToggleButton, {
            clearProps: "all",
          });
        },
      });
    },
  });
};

muteToggleButton.addEventListener(
  "click",
  (e) => {
    if (touchHappened) return;
    handleMuteToggle(e);
  },
  { passive: false }
);

muteToggleButton.addEventListener(
  "touchend",
  (e) => {
    touchHappened = true;
    handleMuteToggle(e);
  },
  { passive: false }
);

/** ------------------------------- Theme Toggle --------------------------*/
const themeToggleButton = document.querySelector(".theme-toggle-button");
const sunSvg = document.querySelector(".sun-svg");
const moonSvg = document.querySelector(".moon-svg");
/** ------------------------------- Load --------------------------*/
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

/** ------------------------------- Render --------------------------*/
const render = () => {
  controls.update();

  raycaster.setFromCamera(pointer, camera);
  currentsRaycasterObjects = raycaster.intersectObjects(raycasterObjects);

  if (currentsRaycasterObjects.length) {
    const hoveredObject = currentsRaycasterObjects[0].object;
    document.body.style.cursor = "pointer";
    hoveredObject.scale.lerp(new THREE.Vector3(1.3, 1.3, 1.3), 0.2);
    hoveredObject.rotation.z = 0.1;
  } else {
    document.body.style.cursor = "default";
    for (let i = 0; i < raycasterObjects.length; i++) {
      raycasterObjects[i].scale.lerp(new THREE.Vector3(1, 1, 1), 0.2);
      raycasterObjects[i].rotation.z = 0;
    }
  }

  renderer.render(scene, camera);

  window.requestAnimationFrame(render);
};
render();

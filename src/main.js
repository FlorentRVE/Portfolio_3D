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
let touchHappened = false;

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
const BACKGROUND_MUSIC_VOLUME = 1;

const backgroundMusic = new Howl({
  src: ["/audio/music/bg.ogg"],
  loop: true,
  volume: 0.5,
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
controls.maxDistance = 30;
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI / 2;

controls.minAzimuthAngle = -Math.PI / 2.3;
controls.maxAzimuthAngle = 0;

controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.mouseButtons.RIGHT = THREE.MOUSE.NONE;

controls.update();

//Set starting camera position
if (window.innerWidth < 768) {
  camera.position.set(
    -15.967413641505063,
    8.366929366970151,
    24.31632017959284
  );
  controls.target.set(
    1.4169133412459323,
    1.8438733598036514,
    0.7528969205635033
  );
} else {
  camera.position.set(
    -6.7944584352431825,
    4.92499568607208,
    11.882923921243053
  );
  controls.target.set(
    1.4169133412459325,
    1.8438733598036514,
    0.7528969205635033
  );
}

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

  button.addEventListener(
    "touchend",
    (e) => {
      // touchHappened = true;
      handleModalExit(e);
    },
    { passive: false }
  );

  button.addEventListener(
    "click",
    (e) => {
      if (touchHappened) return;
      handleModalExit(e);
    },
    { passive: false }
  );
});

/** ----------------- Raycasting --------------------- */
const raycasterObjects = [];
let currentsRaycasterObjects = [];
const Links = {
  Logo_insta_raycaster: "https://www.instagram.com/florent.rve/",
  Logo_linkedin_raycaster:
    "https://www.linkedin.com/in/florent-rivi%C3%A8re-52b044153/",
  Logo_Github_raycaster: "https://github.com/FlorentRVE?tab=repositories",
};
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

/** ----------------- Texture --------------------- */
const roomMaterials = {};
// Loaders
const textureLoader = new THREE.TextureLoader();

// Model Loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader(manager);
gltfLoader.setDRACOLoader(dracoLoader);

// General Texture
const textureDay = textureLoader.load("/textures/Day.webp", (texture) => {
  texture.flipY = false;
  texture.colorSpace = THREE.SRGBColorSpace;
});

const textureNight = textureLoader.load("/textures/Night.webp", (texture) => {
  texture.flipY = false;
  texture.colorSpace = THREE.SRGBColorSpace;
});

const createRoomShaderMaterial = () => {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTextureDay: { value: textureDay },
      uTextureNight: { value: textureNight },
      uMixRatio: { value: 0 }, // Start en day
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uTextureDay;
      uniform sampler2D uTextureNight;
      uniform float uMixRatio;
      varying vec2 vUv;
      void main() {
        vec4 colorDay = texture2D(uTextureDay, vUv);
        vec4 colorNight = texture2D(uTextureNight, vUv);
        gl_FragColor = mix(colorDay, colorNight, uMixRatio);
      }
    `,
  });
};

// Video Texture
const videoElement = document.createElement("video");
videoElement.src = "/textures/videos/motion.mp4";
videoElement.loop = true;
videoElement.muted = true;
videoElement.autoplay = true;
videoElement.play();
const videoTexture = new THREE.VideoTexture(videoElement);
videoTexture.wrapS = THREE.RepeatWrapping;
videoTexture.wrapT = THREE.RepeatWrapping;
videoTexture.repeat.set(-30, 30);
videoTexture.center.set(0.8, 0);
videoTexture.rotation = Math.PI / 2;

// Image Texture
const poster = new THREE.TextureLoader().load("textures/image/poster.webp");
poster.wrapS = THREE.RepeatWrapping;
poster.wrapT = THREE.RepeatWrapping;
poster.repeat.set(-20, 20);
poster.center.set(0.3, 0.8);

const random = new THREE.TextureLoader().load("textures/image/random.webp");
random.wrapS = THREE.RepeatWrapping;
random.wrapT = THREE.RepeatWrapping;
random.repeat.set(50, 50);

const logo = new THREE.TextureLoader().load("textures/image/logo.webp");
logo.wrapS = THREE.RepeatWrapping;
logo.wrapT = THREE.RepeatWrapping;
logo.repeat.set(-40, 35.6);
logo.center.set(0.5, 0.1);

/** ------------------------------- Mouse & Click --------------------------*/
function handleRaycasterInteraction() {
  if (!isModalOpen) {
    if (currentsRaycasterObjects.length) {
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

window.addEventListener("mousemove", (e) => {
  touchHappened = false;
  pointer.x = (e.clientX / sizes.width) * 2 - 1;
  pointer.y = -(e.clientY / sizes.height) * 2 + 1;
});

window.addEventListener(
  "touchstart",
  (e) => {
    pointer.x = (e.touches[0].clientX / sizes.width) * 2 - 1;
    pointer.y = -(e.touches[0].clientY / sizes.height) * 2 + 1;
  },
  { passive: false }
);

window.addEventListener(
  "touchend",
  (e) => {
    e.preventDefault();
    handleRaycasterInteraction();
    touchHappened = true;
  },
  { passive: false }
);

window.addEventListener("click", handleRaycasterInteraction);

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
const skyImageDay = "/textures/Sky_day.webp";
const skyImageNight = "/textures/Sky_night.webp";

let isNightMode = false;

const handleThemeToggle = (e) => {
  e.preventDefault();

  const isDark = document.body.classList.contains("dark-theme");
  document.body.classList.remove(isDark ? "dark-theme" : "light-theme");
  document.body.classList.add(isDark ? "light-theme" : "dark-theme");

  isNightMode = !isNightMode;
  buttonSounds.click.play();

  gsap.to(themeToggleButton, {
    rotate: 45,
    scale: 5,
    duration: 0.5,
    ease: "back.out(2)",
    onStart: () => {
      if (isNightMode) {
        sunSvg.style.display = "none";
        moonSvg.style.display = "block";
      } else {
        moonSvg.style.display = "none";
        sunSvg.style.display = "block";
      }

      gsap.to(themeToggleButton, {
        rotate: 0,
        scale: 1,
        duration: 0.5,
        ease: "back.out(2)",
        onComplete: () => {
          gsap.set(themeToggleButton, {
            clearProps: "all",
          });
        },
      });
    },
  });

  //Switch la texture sea ici
  if (isNightMode) {
    gsap.to(uniforms.uSeaColor.value, {
      r: 0.0,
      g: 0.5,
      b: 1.0,
      duration: 1.5,
      ease: "power2.inOut",
    });
  } else {
    gsap.to(uniforms.uSeaColor.value, {
      r: 0.0,
      g: 0.8,
      b: 1.0,
      duration: 1.5,
      ease: "power2.inOut",
    });
  }

  // Switch la texture sky ici
  if (isNightMode) {
    // Passer en nuit
    textureLoaderSky.load(skyImageNight, (newTexture) => {
      skyMaterial.map = newTexture;
      skyMaterial.needsUpdate = true;
    });
  } else {
    // Revenir au jour
    textureLoaderSky.load(skyImageDay, (newTexture) => {
      skyMaterial.map = newTexture;
      skyMaterial.needsUpdate = true;
    });
  }

  //Switch la texture ici
  Object.values(roomMaterials).forEach((material) => {
    gsap.to(material.uniforms.uMixRatio, {
      value: isNightMode ? 1 : 0,
      duration: 1.5,
      ease: "power2.inOut",
    });
  });
};

// Click event listener
themeToggleButton.addEventListener(
  "click",
  (e) => {
    if (touchHappened) return;
    handleThemeToggle(e);
  },
  { passive: false }
);

themeToggleButton.addEventListener(
  "touchend",
  (e) => {
    touchHappened = true;
    handleThemeToggle(e);
  },
  { passive: false }
);
/** ------------------------------- Load --------------------------*/
gltfLoader.load("/models/Portfolio.glb", (glb) => {
  glb.scene.traverse((child) => {
    if (child.isMesh) {
      if (child.name.includes("raycaster")) {
        raycasterObjects.push(child);
      }

      if (child.name.includes("Ecran_pc_1")) {
        child.material = new THREE.MeshBasicMaterial({ map: videoTexture });
      } else if (child.name.includes("Poster")) {
        child.material = new THREE.MeshBasicMaterial({ map: poster });
      } else if (child.name.includes("Photo_1")) {
        child.material = new THREE.MeshBasicMaterial({ map: random });
      } else if (child.name.includes("Photo_2")) {
        child.material = new THREE.MeshBasicMaterial({ map: random });
      } else if (child.name.includes("Tableau")) {
        child.material = new THREE.MeshBasicMaterial({
          map: logo,
        });
      } else {
        const shaderMat = createRoomShaderMaterial();
        child.material = shaderMat;
        roomMaterials[child.name] = shaderMat;
      }
    }
  });

  scene.add(glb.scene);
});

/* -------------------- Sea -------------------------*/
const clock = new THREE.Clock();

// Geometry
const geometry = new THREE.PlaneGeometry(100, 100, 100, 100); // Augmenter les segments
geometry.rotateX(-Math.PI / 2);

// Courber les vertices
const curveAmount = -4; // Plus grand = plus courbé

for (let i = 0; i < geometry.attributes.position.count; i++) {
  const x = geometry.attributes.position.getX(i);
  const z = geometry.attributes.position.getZ(i);

  // Plus la distance au centre est grande, plus on remonte
  const distance = Math.sqrt(x * x + z * z);
  const y = Math.pow(distance / 50, 2) * curveAmount; // Ajuster selon ton effet

  geometry.attributes.position.setY(i, y);
}

// Mettre à jour la géométrie
geometry.computeVertexNormals();
geometry.attributes.position.needsUpdate = true;

// Uniforms
const uniforms = {
  uTime: { value: 0 },
  uSeaColor: { value: new THREE.Color(0.0, 0.8, 1.0) },
};

// Vertex shader
const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Fragment shader
const fragmentShader = `
uniform float uTime;
varying vec2 vUv;
uniform vec3 uSeaColor;

void main() {
  // Couleur de base
  vec3 baseColor = uSeaColor;

  // Génération de vaguelettes
  float wave1 = sin((vUv.x + uTime * 0.01) * 50.0) * 0.1;
  float wave2 = sin((vUv.x * 1.5 + uTime * 0.015) * 70.0) * 0.05;
  float wave3 = sin((vUv.y * 2.0 + uTime * 0.025) * 60.0) * 0.05;

  float waves = wave1 + wave2 + wave3;

  // Renforcer le contraste des vaguelettes
  float highlight = smoothstep(0.02, 0.05, abs(waves));

  // Mélange couleur + reflet léger
  vec3 finalColor = mix(baseColor, vec3(1.0), highlight * 0.2);

  gl_FragColor = vec4(finalColor, 1.0);
}


`;

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms,
  side: THREE.DoubleSide,
});

const water = new THREE.Mesh(geometry, material);
water.position.y = -0.9;
scene.add(water);

/* --------------------- Sky -----------------------------*/

const skyGeometry = new THREE.SphereGeometry(100, 32, 32);

const textureLoaderSky = new THREE.TextureLoader();
const skyTexture = textureLoaderSky.load(skyImageDay);
const skyMaterial = new THREE.MeshBasicMaterial({
  map: skyTexture,
  side: THREE.BackSide,
});

const skyDome = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(skyDome);

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
  uniforms.uTime.value = clock.getElapsedTime();
  skyDome.rotation.y += 0.0002;
};

render();

import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ==========================================
// 1. ESCENA, CÁMARA Y LUCES
// ==========================================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a11); 
scene.fog = new THREE.Fog(0x0a0a11, 5, 60); 

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(21, 1.6, 28); 
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); 
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(0, 40, 0);
dirLight.castShadow = true;
scene.add(dirLight);

function addCornerLight(x, z) {
    const light = new THREE.PointLight(0xffaa44, 1.5, 40); 
    light.position.set(x, 4, z); 
    scene.add(light);
}
addCornerLight(26.5, 28);   
addCornerLight(7, -17.5);   
addCornerLight(-3.5, 28);   
addCornerLight(-38.5, -14); 

// ==========================================
// 2. TEXTURAS Y CONSTRUCCIÓN DEL MAPA
// ==========================================
const textureLoader = new THREE.TextureLoader();

// Textura para los muros (Ladrillos oscuros)
const wallTex = textureLoader.load('assets/textures/wall_texture.png');
wallTex.wrapS = THREE.RepeatWrapping;
wallTex.wrapT = THREE.RepeatWrapping;
wallTex.repeat.set(4, 2); // Repetir textura para que no se estire
const wallMat = new THREE.MeshStandardMaterial({ map: wallTex }); 

// Textura para los obstáculos (Caja de madera)
const crateTex = textureLoader.load('assets/textures/crate_texture.jpg');
const crateMat = new THREE.MeshStandardMaterial({ map: crateTex });

// ==========================================
// SUELO  DEL MAPA
// ==========================================

// Dimensiones del área del mapa
const mapWidth = 84;
const mapDepth = 70;

const mapCenterX = -7;
const mapCenterZ = 5.25;

// Textura del suelo
const floorTex = textureLoader.load('assets/textures/suelo.jpg');
floorTex.wrapS = THREE.RepeatWrapping;
floorTex.wrapT = THREE.RepeatWrapping;
floorTex.repeat.set(14, 12);
floorTex.colorSpace = THREE.SRGBColorSpace;

const floorGeo = new THREE.PlaneGeometry(mapWidth, mapDepth);

const floorMat = new THREE.MeshStandardMaterial({
    map: floorTex,
    roughness: 0.9,
    side: THREE.DoubleSide
});

const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.set(mapCenterX, 0, mapCenterZ);
floor.receiveShadow = true;

scene.add(floor);


// ==========================================
// CIELO NOCTURNO PANORÁMICO
// ==========================================

const skyTex = textureLoader.load(
    'assets/textures/cielo_noche.png',
    () => console.log("Cielo nocturno cargado correctamente"),
    undefined,
    (error) => console.error("Error al cargar el cielo:", error)
);

skyTex.colorSpace = THREE.SRGBColorSpace;
skyTex.wrapS = THREE.RepeatWrapping;
skyTex.wrapT = THREE.ClampToEdgeWrapping;

const skyGeo = new THREE.SphereGeometry(
    90,
    64,
    64
);

const skyMat = new THREE.MeshBasicMaterial({
    map: skyTex,
    side: THREE.BackSide,
    fog: false
});

const sky = new THREE.Mesh(skyGeo, skyMat);

sky.position.set(0, 0, 0);

scene.add(sky);

// ==========================================
// GENERACIÓN SEGURA DE ZOMBIS ADICIONALES
// ==========================================

function spawnZombieSafely(posX, posZ) {

    const spawnPosition = new THREE.Vector3(posX, 2, posZ);
    const spawnSize = new THREE.Vector3(2.2, 4.0, 2.2);

    // Comprobar colisión con paredes y cajas
    if (checkWallCollision(spawnPosition, spawnSize)) {
        console.warn(`Zombi omitido por obstáculo: ${posX}, ${posZ}`);
        return;
    }

    // Evitar que aparezcan demasiado cerca de otros zombis
    const overlapsZombie = zombies.some(zomb => {
        const dx = zomb.position.x - posX;
        const dz = zomb.position.z - posZ;

        return Math.hypot(dx, dz) < 3.0;
    });

    if (overlapsZombie) {
        console.warn(`Zombi omitido por proximidad: ${posX}, ${posZ}`);
        return;
    }

    spawnZombie(posX, posZ);
}

const walls = []; 

function createWall(x, z, width, depth) {
    const geo = new THREE.BoxGeometry(width, 6, depth); 
    
    // Clonamos el material para ajustar la repetición de textura según el tamaño del muro
    const customMat = wallMat.clone();
    customMat.map = wallTex.clone();
    customMat.map.needsUpdate = true;
    customMat.map.repeat.set(width / 5, 2); 

    const mesh = new THREE.Mesh(geo, customMat);
    mesh.position.set(x, 3, z); 
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    
    mesh.updateMatrixWorld();
    walls.push(new THREE.Box3().setFromObject(mesh));
}

// Muros principales
createWall(29.75, 14, 3.5, 42);     
createWall(24.5, 7, 7, 14);         
createWall(22.75, -12.25, 17.5, 17.5); 
createWall(-10.5, -22.75, 84, 3.5); 
createWall(-1.75, -12.25, 3.5, 17.5);  
createWall(12.25, 19.25, 3.5, 31.5);   
createWall(0, 8.75, 7, 10.5);     
createWall(7, 22.75, 7, 3.5);     
createWall(12.25, 29.75, 3.5, 10.5);   
createWall(-10.5, 33.25, 84, 3.5);   
createWall(-14, 22.75, 7, 3.5);    
createWall(-19.25, 29.75, 3.5, 10.5);  
createWall(-21, 17.5, 7, 35);     
createWall(-7, -3.5, 7, 35);     
createWall(-35, 8.75, 21, 3.5);    
createWall(-47.25, -7, 3.5, 35);   
createWall(-35, -19.25, 21, 3.5);   
createWall(-17.5, -14, 14, 14);    

// Función para crear Cajas de Madera (Obstáculos impenetrables)

// Función para crear Cajas de Madera (Obstáculos)
const crateSize = 2.2;

function createCrateObstacle(x, z) {
    const geo = new THREE.BoxGeometry(
        crateSize,
        crateSize,
        crateSize
    );

    const mesh = new THREE.Mesh(geo, crateMat);

    // Posición de la caja sobre el suelo
    mesh.position.set(x, crateSize / 2, z);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    mesh.updateMatrixWorld();

    // Verificar que no esté dentro de un muro
    const crateBox = new THREE.Box3().setFromObject(mesh);

    const hasCollision = walls.some((wall) => {
        const safeWall = wall.clone().expandByScalar(0.15);
        return crateBox.intersectsBox(safeWall);
    });

    if (hasCollision) {
        console.warn(`Caja omitida por colisión: X=${x}, Z=${z}`);
        return;
    }

    scene.add(mesh);

    // Registrar la caja como obstáculo
    walls.push(crateBox);
}

// Ubicación de las cajas
createCrateObstacle(17.5, 24.5);
createCrateObstacle(0, 16);
createCrateObstacle(-28, 13);
createCrateObstacle(-42, -14); 

function checkWallCollision(pos, size) {
    const hitbox = new THREE.Box3().setFromCenterAndSize(pos, size);
    for (let w of walls) {
        if (hitbox.intersectsBox(w)) return true;
    }
    return false;
}

// ==========================================
// 3. CONTROLES FPS
// ==========================================
const controls = new PointerLockControls(camera, document.body);
const blocker = document.getElementById('blocker');
const instructions = document.getElementById('instructions');

instructions.addEventListener('click', () => controls.lock());
controls.addEventListener('lock', () => blocker.style.display = 'none');
controls.addEventListener('unlock', () => blocker.style.display = 'flex');
scene.add(controls.getObject());

let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
document.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'ArrowUp': case 'KeyW': moveForward = true; break;
        case 'ArrowLeft': case 'KeyA': moveLeft = true; break;
        case 'ArrowDown': case 'KeyS': moveBackward = true; break;
        case 'ArrowRight': case 'KeyD': moveRight = true; break;
    }
});
document.addEventListener('keyup', (e) => {
    switch (e.code) {
        case 'ArrowUp': case 'KeyW': moveForward = false; break;
        case 'ArrowLeft': case 'KeyA': moveLeft = false; break;
        case 'ArrowDown': case 'KeyS': moveBackward = false; break;
        case 'ArrowRight': case 'KeyD': moveRight = false; break;
    }
});

// ==========================================
// 4. ARMAS Y HUD
// ==========================================
const gltfLoader = new GLTFLoader();
const weapon1 = new THREE.Group();
const weapon2 = new THREE.Group();

gltfLoader.load('assets/models/arma1.glb', (gltf) => {
    const model = gltf.scene;
    model.rotation.y = Math.PI; 
    model.scale.set(0.45, 0.45, 0.45); 
    model.position.set(0.5, -0.5, -0.8); 
    weapon1.add(model);
});

gltfLoader.load('assets/models/arma2.glb', (gltf) => {
    const model = gltf.scene;
    model.rotation.set(0, -Math.PI / 2, 0); 
    model.scale.set(0.25, 0.25, 0.25); 
    model.position.set(0.3, -0.4, -0.7); 
    weapon2.add(model);
});

camera.add(weapon1);
camera.add(weapon2);
weapon2.visible = false;

let currentWeapon = 1;
let ammoW1 = 30; 
let ammoW2 = 12; 

const uiWeaponName = document.getElementById('weapon-name');
const uiAmmoCount = document.getElementById('ammo-count');

function updateHUD() {
    if (currentWeapon === 1) { uiWeaponName.innerText = "Rifle de Asalto"; uiAmmoCount.innerText = ammoW1; } 
    else { uiWeaponName.innerText = "Pistola"; uiAmmoCount.innerText = ammoW2; }
}
updateHUD();

document.addEventListener('keydown', (e) => {
    if (e.code === 'Digit1' && currentWeapon !== 1) { currentWeapon = 1; weapon1.visible = true; weapon2.visible = false; updateHUD(); }
    if (e.code === 'Digit2' && currentWeapon !== 2) { currentWeapon = 2; weapon1.visible = false; weapon2.visible = true; updateHUD(); }
});

// ==========================================
// 5. ENEMIGOS (GIGANTES CENTRADOS)
// ==========================================
const zombies = [];
const zombieGeo = new THREE.BoxGeometry(2.0, 4.0, 2.0);
const zombieMat = new THREE.MeshStandardMaterial({ color: 0x116611 }); 

function spawnZombie(posX, posZ) {
    const hitbox = new THREE.Mesh(zombieGeo, zombieMat.clone());
    hitbox.position.set(posX, 2.0, posZ); 
    hitbox.material.visible = false; 
    hitbox.userData = { hp: 2, active: false, isDead: false };
    scene.add(hitbox);
    zombies.push(hitbox);

    gltfLoader.load('assets/models/zombie.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(2.4, 2.4, 2.4); 
        model.position.y = -2.0; 
        hitbox.add(model);
    });
}

// 18 Zombis reubicados estratégicamente al centro de pasillos y cuartos
spawnZombie(21, 14);     
spawnZombie(24.5, 21);   
spawnZombie(17.5, 3.5);     
spawnZombie(14, 7);      
spawnZombie(7, 14);      
spawnZombie(0, 0);       
spawnZombie(-14, 10.5);     
spawnZombie(-17.5, -3.5);   
spawnZombie(-14, 17.5);  
// Cuarto superior centrado
spawnZombie(3.5, -10.5);      
spawnZombie(-7, -10.5);       
// Cuarto inferior centrado
spawnZombie(0, 28);       
spawnZombie(-10.5, 24.5);     
// Zona final despejada de muros
spawnZombie(-31.5, -3.5);   
spawnZombie(-35, -14);      
spawnZombie(-38.5, -10.5);  
spawnZombie(-42, 0);        
spawnZombie(-28, -7);    

// ==========================================
// ZOMBIS ADICIONALES
// ==========================================

spawnZombieSafely(17.5, 17.5);
spawnZombieSafely(-7, 17.5);
spawnZombieSafely(7, 17.5);
spawnZombieSafely(-35, 14);
spawnZombieSafely(-42, 14);
spawnZombieSafely(-28, 0);
spawnZombieSafely(-14, -3.5);
spawnZombieSafely(7, -17.5);

// ==========================================
// 6. COLECCIONABLES (MUNICIÓN)
// ==========================================
const ammoBoxes = [];
const ammoBoxGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
const ammoBoxMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0x555500 }); 

function spawnAmmo(posX, posZ) {
    const box = new THREE.Mesh(ammoBoxGeo, ammoBoxMat);
    box.position.set(posX, 0.5, posZ);
    box.castShadow = true;
    scene.add(box);
    ammoBoxes.push(box);
}

spawnAmmo(26.5, 28);    
spawnAmmo(7, -17.5);    
spawnAmmo(-3.5, 28);    
spawnAmmo(-38.5, -14);  

// ==========================================
// 7. ZONA DE EXTRACCIÓN (ILUMINADA)
// ==========================================
const extractionGeo = new THREE.CylinderGeometry(3.5, 3.5, 0.2, 32);
const extractionMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x005500, transparent: true, opacity: 0.8 });
const extractionZone = new THREE.Mesh(extractionGeo, extractionMat);
extractionZone.position.set(-35, 0.1, 0); 
scene.add(extractionZone);

const extractionLight = new THREE.PointLight(0x00ff00, 2.5, 50);
extractionLight.position.set(-35, 4, 0);
scene.add(extractionLight);

// ==========================================
// 8. RAYCASTING Y DISPAROS
// ==========================================
const raycaster = new THREE.Raycaster();
const centerScreen = new THREE.Vector2(0, 0); 

document.addEventListener('mousedown', (e) => {
    if (controls.isLocked && e.button === 0) {
        if (currentWeapon === 1 && ammoW1 > 0) { ammoW1--; shootEffect(weapon1); fireRaycast(); } 
        else if (currentWeapon === 2 && ammoW2 > 0) { ammoW2--; shootEffect(weapon2); fireRaycast(); }
        updateHUD();
    }
});

function shootEffect(weapon) {
    weapon.position.z += 0.05;
    setTimeout(() => { weapon.position.z -= 0.05; }, 50);
}

function fireRaycast() {
    raycaster.setFromCamera(centerScreen, camera);
    const allTargets = [...zombies, ...scene.children.filter(obj => obj.geometry && obj.geometry.type === 'BoxGeometry')];
    const intersects = raycaster.intersectObjects(allTargets, false); 
    
    if (intersects.length > 0) {
        const hitObj = intersects[0].object;
        if (hitObj.userData && hitObj.userData.hp > 0) {
            hitObj.userData.hp--; 
            if(hitObj.children.length > 0) {
                hitObj.children[0].position.z -= 0.2; 
                setTimeout(() => { hitObj.children[0].position.z += 0.2; }, 100);
            }
            if (hitObj.userData.hp <= 0) {
                hitObj.userData.isDead = true;
                scene.remove(hitObj);
                const index = zombies.indexOf(hitObj);
                if (index > -1) zombies.splice(index, 1);
            }
        }
    }
}

// ==========================================
// 9. BUCLE DE JUEGO (FÍSICAS Y COLISIONES)
// ==========================================
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const clock = new THREE.Clock();
let isGameOver = false; 

const playerSize = new THREE.Vector3(1.0, 3, 1.0); 
const zombieSize = new THREE.Vector3(2.2, 4.0, 2.2); 

function animate() {
    if (isGameOver) return;
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    if (controls.isLocked === true) {
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize(); 
        
        const speed = 40.0;
        if (moveForward || moveBackward) velocity.z -= direction.z * speed * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * speed * delta;
        
        // Movimiento lateral con detección de colisiones
        const oldPositionX = camera.position.clone();

        controls.moveRight(-velocity.x * delta);

        if (checkWallCollision(camera.position, playerSize)) {
            camera.position.copy(oldPositionX);
        }

        // Movimiento frontal con detección de colisiones
        const oldPositionZ = camera.position.clone();

        controls.moveForward(-velocity.z * delta);

        if (checkWallCollision(camera.position, playerSize)) {
            camera.position.copy(oldPositionZ);
        }

        for (let i = 0; i < zombies.length; i++) {
            const zomb = zombies[i];
            const dist = camera.position.distanceTo(zomb.position);

            if (dist < 16 && !zomb.userData.active) zomb.userData.active = true;

            if (zomb.userData.active) {
                const targetPos = new THREE.Vector3(camera.position.x, zomb.position.y, camera.position.z);
                zomb.lookAt(targetPos);
                
                const oldZombPos = zomb.position.clone();
                zomb.translateZ(2.2 * delta); 

                if (checkWallCollision(zomb.position, zombieSize)) {
                    zomb.position.copy(oldZombPos);
                }

                if (dist < 2.0) { 
                    isGameOver = true;
                    controls.unlock();
                    const msgOverlay = document.getElementById('message-overlay');
                    msgOverlay.innerHTML = "<span style='color:red;'>¡HAS SIDO ATRAPADO!</span><br><span style='font-size:24px; color:white;'>F5 para reiniciar la pesadilla</span>";
                    msgOverlay.style.display = 'block';
                }
            }
        }

        for(let i = ammoBoxes.length - 1; i >= 0; i--) {
            const box = ammoBoxes[i];
            box.rotation.y += 2 * delta; 
            box.rotation.x += 1 * delta;

            if (camera.position.distanceTo(box.position) < 2.0) {
                ammoW1 += 15; ammoW2 += 6; updateHUD();
                scene.remove(box); ammoBoxes.splice(i, 1);
            }
        }

        if (camera.position.distanceTo(extractionZone.position) < 3.0) {
            isGameOver = true;
            controls.unlock();
            const msgOverlay = document.getElementById('message-overlay');
            msgOverlay.innerHTML = "<span style='color:#00ff00'>¡SOBREVIVISTE A LA MANSIÓN!</span><br><span style='font-size:24px; color:white;'>Extracción Exitosa</span>";
            msgOverlay.style.display = 'block';
        }
    }

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
const msg = 'ようこそARの世界へ';

import 'three/VRControls';
import Gps from './modules/Gps';
import Compass from './modules/Compass';
import CrdConverter from './modules/CrdConverter';

import ARSystem from './modules/ARSystem';

// *** THREE ***
const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.autoClear = false;
document.body.appendChild(renderer.domElement);
const scene   = new THREE.Scene();
const ambient = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambient);
let vrFrameData, vrDisplay, arView, anchorManager;
let arSystem;
let cam;

// *** Debug ***
const cubeSize = 0.3;
const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const material = new THREE.MeshNormalMaterial();
const cube     = new THREE.Mesh(geometry, material);

awake();

function awake(){
    console.log('awake');

    THREEAR.ARUtils.getARDisplay().then(async function (display) {
        if(display){
            console.log('your device is ready for our app!');

            alert(msg);

            vrDisplay     = display;
            vrFrameData   = new VRFrameData();
            arView        = new THREEAR.ARView(vrDisplay, renderer);
            anchorManager = new THREEAR.ARAnchorManager(vrDisplay);

            cam = new THREEAR.ARPerspectiveCamera(
                vrDisplay,
                60, //fov
                window.innerWidth / window.innerHeight,
                vrDisplay.depthNear,
                2000 //vrDisplay.depthFar
            );

            arSystem = new ARSystem(scene, cam, start);
        }else{
            console.log('your device is not supported!');
            THREEAR.ARUtils.displayUnsupportedMessage();
        }
    });
}

function start(){
    console.log('start');

    arSystem.Add(cube);
    cube.position.set(0, 0, -1);

    update();
}

function update(){
    renderer.clearColor();
    arView.render();
    vrDisplay.getFrameData(vrFrameData);
    arSystem.Update();
    renderer.clearDepth();
    renderer.render(scene, cam);
    vrDisplay.requestAnimationFrame(update);
}

function onWindowResized(){
    cam.aspect = window.innerWidth / window.innerHeight;
    cam.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onClick(e){
    switch(e.touches.length){
        case 1: singletap(e); break;
        case 2: doubletap(e); break;
    }
}

async function singletap(e){
    console.log('single touched');

}

async function doubletap(e){
    console.log('double touched');

}
var WIDTH = document.body.clientWidth, HEIGHT = document.body.clientHeight;

var scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000),
    renderer = new THREE.WebGLRenderer({ alpha: true });

document.body.appendChild(renderer.domElement);
renderer.setSize(WIDTH, HEIGHT);

light = new THREE.PointLight(0xffffff, 1, 100);
scene.add(light);

var geometry = new THREE.CubeGeometry(10, 10, 10);
var north = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0xff0000}));
var south = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0x00ff00}));
var east  = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0x0000ff}));
var west  = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0xffff00}));

north.position.set(0, 0, -50);
south.position.set(0, 0,  50);

east.position.set( 50, 0, 0);
west.position.set(-50, 0, 0);

scene.add(north);
scene.add(east);
scene.add(south);
scene.add(west);

window.addEventListener("deviceorientation", function(e) {
  camera.rotation.set(0, deg2rad(e.alpha), 0);
});

function deg2rad(angle) {
  return (angle / 180.0) * Math.PI;
}

var canvas = document.getElementById("camera"),
    video  = document.querySelector("video");

canvas.width = WIDTH;
canvas.height = HEIGHT;

var ctx = canvas.getContext("2d");

function draw() {
  ctx.fillStyle = "#ff00ff";
  ctx.fillRect(0,0,WIDTH,HEIGHT);
  ctx.drawImage(video, 0, 0, WIDTH, HEIGHT);
  renderer.render(scene, camera);
  requestAnimationFrame(draw);
}

draw();

// Generic definitions - variables

var WIDTH = document.body.clientWidth, HEIGHT = document.body.clientHeight;

var lockOrientation = screen.orientation.lock || screen.lockOrientation
                   || screen.mozLockOrientation || screen.msLockOrientation;

navigator.getMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

window.addEventListener("compassneedscalibration", function(event) {
  self.supported = true;
  alert('Your compass needs calibrating!');
  event.preventDefault();
}, true);

if(!navigator.getMedia) {
  alert("Oh noes! Your browser does not support webcam video :(");
}

var scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000),
    renderer = new THREE.WebGLRenderer({ alpha: true }),
    light, geometry, north, south, east, west, ctx,
    canvas = document.getElementById("camera"),
    video  = document.querySelector("video"),
    button = document.querySelector("button");

// Generic definitions functions

function deg2rad(angle) {
  return (angle / 180.0) * Math.PI;
}

function draw() {
  ctx.fillStyle = "#ff00ff";
  ctx.fillRect(0,0,WIDTH,HEIGHT);
  ctx.drawImage(video, 0, 0, WIDTH, HEIGHT);

  north.rotation.y += 0.05;
  south.rotation.y += 0.05;

  east.rotation.y += 0.05;
  west.rotation.y += 0.05;

  renderer.render(scene, camera);
  requestAnimationFrame(draw);
}

function showWebcamVideo(sourceId) {
  navigator.getMedia({
    video: {
      optional: [{sourceId: sourceId}]
    }
  }, function onSuccess(stream) {
    var video = document.querySelector('video');
    video.src = window.URL.createObjectURL(stream);
  }, function onError(err) {
    alert("Whoops: " + err);
    console.error(err);
  });
}

function updateOrientation(e) {
  var heading = e.alpha,
      pitch   = e.gamma;

  // Correcting the sensors being "clever"
  if(Math.abs(e.beta) > 45) {
    heading += 90;
  } else {
    heading -= 90;
  }

  if(pitch < 0) {
    pitch = -90 - pitch;
  } else {
    pitch =  90 - pitch;
  }

  if(heading < 0) heading = 360 + heading;

  camera.rotation.set(deg2rad(pitch), deg2rad(heading), 0);
  event.preventDefault();
}

// Initialisiation and run!

camera.eulerOrder = 'YXZ'; // We want to rotate around the Y axis first or our perspective is screwed up

light = new THREE.PointLight(0xffffff, 1, 100);
scene.add(light);

geometry = new THREE.BoxGeometry(10, 10, 10);
north = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0xff0000}));
south = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0x00ff00}));
east  = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0x0000ff}));
west  = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0xffff00}));

north.position.set(0, 0, -50);
south.position.set(0, 0,  50);

east.position.set( 50, 0, 0);
west.position.set(-50, 0, 0);

scene.add(north);
scene.add(east);
scene.add(south);
scene.add(west);

window.addEventListener("deviceorientation", updateOrientation);

button.addEventListener("click", function() {
  canvas.className = "";

  if(document.body.webkitRequestFullscreen) document.body.webkitRequestFullscreen();
  else if (document.body.mozRequestFullScreen) document.body.mozRequestFullScreen();

  document.body.removeChild(document.getElementById("instructions"));

  document.body.appendChild(renderer.domElement);
  renderer.setSize(WIDTH, HEIGHT);

  if(screen.orientation.lock && !screen.orientation.lock('landscape-primary')) {
    alert("Please put your phone in landscape mode for this demo");
  } else if(screen.lockOrientation && !screen.lockOrientation('landscape-primary')) {
    alert("Please put your phone in landscape mode for this demo");
  }

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  ctx = canvas.getContext("2d");

  MediaStreamTrack.getSources(function(mediaSources) {
    mediaSources.forEach(function(mediaSource){
      if (mediaSource.kind === 'video' && mediaSource.facing == "environment") {
        showWebcamVideo(mediaSource.id);
      }
    });
  });

  draw();
});

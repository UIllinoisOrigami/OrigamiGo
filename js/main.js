
var scene, camera, renderer,
    shape, geometry, material, mesh,
    line_geometry, line, lineMaterial, line_mesh;

init();
animate();

function init() {

  //SCENE
  scene = new THREE.Scene();
  var WIDTH = window.innerWidth * 0.8,
      HEIGHT = window.innerHeight;
  scene.background = new THREE.Color( 0xffffff );

  //RENDERER
  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(WIDTH, HEIGHT);
  document.body.appendChild(renderer.domElement);

  //CAMERA
  camera = new THREE.PerspectiveCamera(45, WIDTH/HEIGHT, 0.1, 20000);
  camera.position.set(0,0,15);
  scene.add(camera);

  //WINDOW RESIZING
  window.addEventListener('resize', function() {
    var WIDTH = window.innerWidth * 0.8,
        HEIGHT = window.innerHeight;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
  });

  //LIGHT
  var light = new THREE.PointLight(0xffffff);
  light.position.set(-100, 200, 100);
  scene.add(light);

  //LOAD PLANE/SQUARE/LINE
  material = new THREE.MeshBasicMaterial( { color: 0x79bcff, wireframe: true} );
  lineMaterial = new THREE.LineBasicMaterial({color: 0xaf504c});

  //ORBITCONTROLS
  controls = new THREE.TrackballControls(camera, renderer.domElement);
  controls.rotateSpeed = 2.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.6;

  //EVENT LISTENERS
  window.addEventListener('keydown', onKeyDown, false);
  window.addEventListener('keyup', onKeyUp, false);
}

function animate(){
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
}

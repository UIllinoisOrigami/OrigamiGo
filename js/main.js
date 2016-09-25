
var scene, camera, renderer;

init();
animate();

function init() {

  //SCENE
  scene = new THREE.Scene();
  var WIDTH = window.innerWidth,
      HEIGHT = window.innerHeight;

  //RENDERER
  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(WIDTH, HEIGHT);
  document.body.appendChild(renderer.domElement);

  //CAMERA
  camera = new THREE.PerspectiveCamera(45, WIDTH/HEIGHT, 0.1, 20000);
  camera.position.set(0,0,30);
  scene.add(camera);

  //WINDOW RESIZING
  window.addEventListener('resize', function() {
    var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
  });

  //LIGHT
  var light = new THREE.PointLight(0xffffff);
  light.position.set(-100, 200, 100);
  scene.add(light);

  //LOAD PLANE/SQUARE
  var geometry = new THREE.PlaneGeometry(10, 10);
  var material = new THREE.MeshBasicMaterial({color: 0x79bcff, side: THREE.DoubleSide});
  var plane = new THREE.Mesh(geometry, material);
  scene.add(plane);

  //ORBITCONTROLS
  controls = new THREE.OrbitControls(camera, renderer.domElement);
}

function animate(){
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
}


var scene, camera, renderer,
    shape, geometry, material, mesh,
    line_geometry, line, lineMaterial, line_mesh,
    raycaster, mouse, mouseToWorld;

init();
animate();

function init() {

  //SCENE
  scene = new THREE.Scene();
  var WIDTH = window.innerWidth * 0.8,
      HEIGHT = window.innerHeight;
  scene.background = new THREE.Color( 0x2D3037 );

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
  material = new THREE.MeshBasicMaterial( { color: 0x79bcff, side: THREE.DoubleSide, vertexColors: THREE.FaceColors} );
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

  // RAYCASTING
  mouse = new THREE.Vector2();
  raycaster = new THREE.Raycaster();

  //EVENT LISTENERS
  window.addEventListener('keydown', onKeyDown, false);
  window.addEventListener('keyup', onKeyUp, false);
  window.addEventListener( 'mousemove', onMouseMove, false);

}

function highlightOnMouseOver(){
    // update the picking ray with the camera and mouse position
	raycaster.setFromCamera(mouse, camera);

	// calculate objects intersecting the picking ray
	var intersects = raycaster.intersectObjects(scene.children);

	for ( var i = 0; i < intersects.length; i++ ) {
        mouseToWorld = intersects[i].point;
        for(var j = 0; j < intersects[i].object.geometry.faces.length; j++){
            intersects[i].object.geometry.faces[j].color.set(0xff0000);
        }
        intersects[i].object.geometry.colorsNeedUpdate = true
	}
}

function unhighlightObjects(){
    for(var i = 0; i < scene.children.length; i ++){
        if(scene.children[i] instanceof THREE.Mesh){
            for(var j = 0; j < scene.children[i].geometry.faces.length; j++){
                scene.children[i].geometry.faces[j].color.set(0x79bcff);
            }
            scene.children[i].geometry.colorsNeedUpdate = true;
        }
    }
}

function animate(){
  requestAnimationFrame(animate);
  highlightOnMouseOver();
  renderer.render(scene, camera);
  unhighlightObjects();
  controls.update();
}

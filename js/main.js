
var scene, camera, renderer, downPoint, allFoldLines;
var pointQuad = true;
var bounds = {
			x:0,
			y:0,
			width:window.innerWidth,
			height:window.innerHeight
}
var quad = new QuadTree(bounds, pointQuad);

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
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(-10,-10,0));
  geometry.vertices.push(new THREE.Vector3(10,-10,0));
  geometry.vertices.push(new THREE.Vector3(10,10,0));
  geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
  //geometry.computeFaceNormals();
  var material = new THREE.MeshBasicMaterial({color: 0x79bcff, side: THREE.DoubleSide});
  var plane1 = new THREE.Mesh(geometry, material);
  plane1.name="mesh";
    
  var geometry2 = new THREE.Geometry();
  geometry2.vertices.push(new THREE.Vector3(-10,-10,0));
  geometry2.vertices.push(new THREE.Vector3(-10,10,0));
  geometry2.vertices.push(new THREE.Vector3(10,10,0));
  geometry2.faces.push( new THREE.Face3( 0, 1, 2 ) );
  var material2 = new THREE.MeshBasicMaterial({color: 0x79bcff, side: THREE.DoubleSide}); 
  var plane2 = new THREE.Mesh(geometry2, material2);
  plane2.name="mesh";
    
  scene.add(plane1);
  scene.add(plane2);
    
  //LOAD BOARDER
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(10,-10,0));
  geometry.vertices.push(new THREE.Vector3(-10,-10,0));
  var material = new THREE.LineBasicMaterial({color: 0x79bc0f});
  var line1 = new THREE.Line(geometry, material);
  line1.name="boarderLine";

  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(-10,-10,0));
  geometry.vertices.push(new THREE.Vector3(-10,10,0));
  var material = new THREE.LineBasicMaterial({color: 0x79bc0f});
  var line2 = new THREE.Line(geometry, material);
  line2.name="boarderLine";
    
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(-10,10,0));
  geometry.vertices.push(new THREE.Vector3(10,10,0));
  var material = new THREE.LineBasicMaterial({color: 0x79bc0f});
  var line3 = new THREE.Line(geometry, material);
  line3.name="boarderLine";
    
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(10,10,0));
  geometry.vertices.push(new THREE.Vector3(10,-10,0));
  var material = new THREE.LineBasicMaterial({color: 0x79bc0f});
  var line4 = new THREE.Line(geometry, material);
  line4.name="boarderLine";
    
  scene.add(line1);
  scene.add(line2);
  scene.add(line3);
  scene.add(line4);
    
  //ORBITCONTROLS
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  window.addEventListener( 'mousedown', onMouseDown, false );
  window.addEventListener( 'mouseup', onMouseUp, false );
  window.addEventListener( 'keydown', onKeyDown, false );
  window.addEventListener( 'keyup', onKeyUp, false );
}

function animate(){
  checkDrawStyle();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
}

function onMouseDown(event)
{
    downPoint = get3dPointZAxis(event);
}

function onKeyDown(event)
{
    if(event.keyCode =="32")
        controls.enabled = false;
}

function onKeyUp(event)
{
    if(event.keyCode =="32")
        controls.enabled = true;
     if(event.keyCode =="16")
        performFold();   
        
} 



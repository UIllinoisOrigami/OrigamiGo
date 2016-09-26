
var scene, camera, renderer, downPoint;
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
  var geometry = new THREE.PlaneGeometry(15, 20);
  var material = new THREE.MeshBasicMaterial({color: 0x79bcff, side: THREE.DoubleSide});
  var plane = new THREE.Mesh(geometry, material);
  scene.add(plane);

  //ORBITCONTROLS
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  window.addEventListener( 'mousedown', onMouseDown, false );
  window.addEventListener( 'mouseup', onMouseUp, false );
  window.addEventListener( 'keydown', onKeyDown, false );
  window.addEventListener( 'keyup', onKeyUp, false );
}

function animate(){
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
}

function onMouseUp(event)
{
  if(controls.enabled ==false)
  {
      if(scene.getObjectByName("foldLine"))
        scene.remove(scene.getObjectByName("foldLine"));

      var geometry = new THREE.Geometry();
      var upPoint = get3dPointZAxis(event);
      var xScale = upPoint.x-downPoint.x;
      var yScale = upPoint.y-downPoint.y;

      while(upPoint.x<window.innerWidth && upPoint.x>-window.innerWidth &&
            upPoint.y<window.innerHeight && upPoint.y>-window.innerHeight)
      {
        upPoint.x+=xScale;
        upPoint.y+=yScale;
      }
      while(downPoint.x<window.innerWidth && downPoint.x>-window.innerWidth &&
            downPoint.y<window.innerHeight && downPoint.y>-window.innerHeight)
      {
        downPoint.x-=xScale;
        downPoint.y-=yScale;
      }
      upPoint.z=0.1;
      downPoint.z=0.1;

      geometry.vertices.push(upPoint);
      geometry.vertices.push(downPoint);
      var material = new THREE.LineBasicMaterial({color: 0x79bc0f});
      var foldLine = new THREE.Line(geometry, material);
      foldLine.name = "foldLine";

      scene.add(foldLine);
  }
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
        
}

function get3dPointZAxis(event)
{
    projector = new THREE.Projector();
    var vector = new THREE.Vector3(
        ( event.clientX / window.innerWidth ) * 2 - 1,
        - ( event.clientY / window.innerHeight ) * 2 + 1,
        1.0 );
    projector.unprojectVector( vector, camera );
    var dir = vector.sub( camera.position ).normalize();
    var distance = - camera.position.z / dir.z;
    var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );    
    return pos;
}

//old code for making the fold line, couldnt get it to work. might have to go back to it if we want to remove the global var downpoint.
/*function onMouseUp(event)
{
  if(scene.getObjectByName("foldLine") && scene.getObjectByName("foldLine").geometry.vertices.length >= 3)
    scene.remove(scene.getObjectByName("foldLine"));
    
  var projector = new THREE.Projector();
  var geometry = new THREE.Geometry();
    
  if(scene.getObjectByName("foldLine"))
    geometry = scene.getObjectByName("foldLine").geometry;
    
  var point = new THREE.Vector3(( event.clientX / window.innerWidth ) * 2 - 1,
                               - ( event.clientY / window.innerHeight ) * 2 + 1, 
                                   0.5);
  projector.unprojectVector(point, camera);
  geometry.vertices.push(point);
  geometry.vertices.push( new THREE.Vector3(0,0,0.0));
    
  var material = new THREE.LineBasicMaterial({color: 0x79bc0f});
  var foldLine = new THREE.Line(geometry, material,THREE.LineStrip);
  foldLine.name = "foldLine";
  
  if(scene.getObjectByName("foldLine")==null)
    scene.add(foldLine);
}*/

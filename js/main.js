
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
  //allFoldLines
  allFoldLines = [];
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
    
  scene.add(plane2);
  scene.add(plane1);
    
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

function performFold(){
    if(scene.getObjectByName("foldLine"))
    {
      var foldingLine = scene.getObjectByName("foldLine");
      scene.remove(foldingLine);
      foldingLine.name = "visualFoldLine";
      foldingLine.material.color = 0xf0bcff;
      allFoldLines.push(foldingLine);
      //performfold on all mesh, allFoldLines, and BoarderLines(if we make boarderlines).
    }
}

function checkDrawStyle(){
  if (document.getElementById('normal').checked) {
    scene.traverse( function(child){
      if( child instanceof THREE.Mesh && child.name=="mesh")
        child.material.wireframe= false;
      else if(child instanceof THREE.Line && child.name=="visualFoldLine")
        scene.remove(child);
    });
  }
  else if (document.getElementById('wireframe').checked) {
    scene.traverse( function(child){
      if(child instanceof THREE.Mesh && child.name=="mesh")
        child.material.wireframe= true;
      else if(child instanceof THREE.Line && child.name=="visualFoldLine")
        scene.remove(child);
    });
  }
  else if (document.getElementById('foldLines').checked) {
     scene.traverse( function(child){
      if( child instanceof THREE.Mesh && child.name=="mesh")
        child.material.wireframe= false;
    }); 

    allFoldLines.forEach(function(entry){
      scene.add(entry);
    });
    
      
  }
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
     if(event.keyCode =="16")
        performFold();   
        
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

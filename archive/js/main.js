var paperGeometry,
    paper,
    scene,
    camera,
    renderer,
    downPoint,
    allFoldLines,
    foldHistory=[],
    faceLevel=[],
    controls;
    
var uGrid = new UniformGrid(-11,-11,22,22);

(function(){
"use strict";

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

  //LOAD PAPER   <--- Figure out how to make front and back diff. colors. Will make for better visibility in folding animation.
	paperGeometry = new THREE.Geometry();
	/*paperGeometry.vertices.push(
		new THREE.Vector3(-10,-10,0),
		new THREE.Vector3(10,-10,0),
		new THREE.Vector3(10,10,0),
		new THREE.Vector3(-10,10,0)
	);
	paperGeometry.faces.push(
		new THREE.Face3( 0, 1, 2 ),
		new THREE.Face3( 0, 2, 3 )
	);

	var material = new THREE.MeshBasicMaterial({color: 0x6495ed, side: THREE.DoubleSide});
	var paper = new THREE.Mesh(paperGeometry, material);
	paper.name = "mesh";

	scene.add(paper);*/

    //***************************************************************************
    //add complex geometry for testing only function in drawstyle.js
   var gridN=1;

    terrainFromIteration(gridN, -10,10,-10,10, paperGeometry.vertices,paperGeometry.faces);

	var material = new THREE.MeshBasicMaterial({color: 0x6495ed, side: THREE.DoubleSide});
	paper = new THREE.Mesh(paperGeometry, material);
	paper.name = "mesh";

	scene.add(paper);
    //*****************************************************************************
    for( var i = 0; i< paperGeometry.faces.length; i++)
    {
        var triangle = [
            paperGeometry.vertices[paperGeometry.faces[i].a],
            paperGeometry.vertices[paperGeometry.faces[i].b],
            paperGeometry.vertices[paperGeometry.faces[i].c]
        ]
        uGrid.add(triangle, paperGeometry.faces[i],0);
        faceLevel.push(0);
    }

  /*var geometry = new THREE.Geometry();
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
  scene.add(plane2); */

  //LOAD BORDER
	//Need better way to add and remove lines. This borderGeometry will probably go poof.
	var borderGeometry = new THREE.Geometry();
	borderGeometry.vertices.push(
		new THREE.Vector3(10.04,-10.04,0),
		new THREE.Vector3(-10.04,-10.04,0),
		new THREE.Vector3(-10.04,10.04,0),
		new THREE.Vector3(10.04,10.04,0),
		new THREE.Vector3(10.04,-10.04,0)
	);
  var meshLine = new THREE.MeshLine();
  meshLine.setGeometry( borderGeometry );
  var material = new THREE.MeshLineMaterial({color: new THREE.Color(0xc05c5c ), lineWidth: 0.15});
  var borders = new THREE.Mesh(meshLine.geometry, material);
    //var material = new THREE.LineBasicMaterial({color: 0xcd5c5c});
	//var borders = new THREE.Line(borderGeometry, material);
	borders.name = "borders";
	scene.add(borders);

  //GRIDLINES
    var gridLines = uGrid.getGridLines();
    for(var i = 0; i<gridLines.length; i++)
    {
        scene.add(gridLines[i]);
    }
  //ORBITCONTROLS
  controls = new THREE.OrbitControls(camera, renderer.domElement);    
  /*controls = new THREE.TrackballControls(camera, renderer.domElement);
  controls.rotateSpeed = 2.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.6;*/
    
  window.addEventListener( 'mousedown', onMouseDown, false );
  window.addEventListener( 'mouseup', onMouseUp, false );
  window.addEventListener( 'keydown', onKeyDown, false );
  window.addEventListener( 'keyup', onKeyUp, false );
  window.addEventListener( 'input', onInputChange, false );

}

function animate(){
  checkDrawStyle();
  controls.update();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function onMouseDown(event)
{
    downPoint = get3dPointZAxis(event);
}

function onKeyDown(event)
{
    if(event.keyCode =="32")
    {
        //controls.reset()
        controls.enabled = false;
    }
}

function onKeyUp(event)
{
    if(event.keyCode =="32")
        controls.enabled = true;
     if(event.keyCode =="16")
     {
        var lvl = document.getElementsByName("foldLevel")[0].value;
        performFold(Number(lvl));
     }

}

/*function clearScene(){

}*/

init();
animate();

})();

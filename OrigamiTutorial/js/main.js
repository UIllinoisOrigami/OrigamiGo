/**
 * @author mwakaba2
 */
 
// standard global variables
var scene, camera, renderer, controls, stats;
var clock = new THREE.Clock();

init();
animate();

// FUNCTIONS
function init() {
	// SCENE
	scene = new THREE.Scene();
	// CAMERA
	// set the scene size
	var WIDTH = window.innerWidth;
	var HEIGHT = window.innerHeight*.6;
	// set some camera attributes
	var VIEW_ANGLE = 45, ASPECT = WIDTH / HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(0, 70, 270);
	camera.lookAt(scene.position);
	// RENDERER
	if (Detector.webgl)
		renderer = new THREE. WebGLRenderer({ antialias: true });
	else
		renderer = new THREE.CanvasRenderer();
	renderer.setSize(WIDTH, HEIGHT);
	// attach the render-supplied DOM element
	document.body.appendChild(renderer.domElement);
	// EVENTS
	THREEx.WindowResize(renderer, camera);
	THREEx.FullScreen.bindKey({ charCode: 'm'.charCodeAt(0) });
	// CONTROLS
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	// STATS
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.right = '0px';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	document.body.appendChild(stats.domElement);
	// LIGHT 
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0, 300, 0);
	scene.add(light);
	// FLOOR
	var floorMaterial = new THREE.MeshBasicMaterial( { color: 0xd9b44a, side: THREE.DoubleSide } );
	var floorGeometry = new THREE.PlaneBufferGeometry(1000, 1000, 10, 10);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.y = -200;
	floor.rotation.x = Math.PI / 2;
	scene.add(floor);
	// SKYBOX
	var skyBoxGeometry = new THREE.BoxGeometry( 10000, 10000, 10000 );
	var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0xb9d9c3, side: THREE.BackSide } );
	var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
	scene.add(skyBox);
}

function animate() {
	requestAnimationFrame(animate);
	render();
	update();
}

function update() {
	controls.update();
	stats.update();
}

function render() {
	renderer.render( scene, camera );
}

//clear all objects in scene to start new animation
function clearScene() {
	var objsToRemove = _.rest(scene.children, 1);
	_.each(objsToRemove, function( object ) {
	      scene.remove(object);
	});
	init();
	animate();
}
var ORIGAMI;

/**
 * Initializes paper geometry to user's desired width and height.
 */
function setInitialGeometry() {
    var width = Number(isValidInput(document.getElementById('paperWidth')));
    var height = Number(isValidInput(document.getElementById('paperHeight')));

    if (!(width && height)) {
        return;
    }
    if (mesh) {
        scene.remove(mesh);
        geometry.dispose();
        mesh.geometry.dispose();
    }
    x_offset = width / 2;
    y_offset = height / 2;

    //Sets max and mins of Crease Points input fields for initial geometry
    $("[id^=creaseX]").attr({
        "max": x_offset,
        "min": -1 * x_offset
    });
    $("[id^=creaseY]").attr({
        "max": y_offset,
        "min": -1 * y_offset
    });

    //Centers geometry at (0,0,0)
    var p1 = new THREE.Vector2(-1 * x_offset, -1 * y_offset),
        p2 = new THREE.Vector2(x_offset, -1 * y_offset),
        p3 = new THREE.Vector2(x_offset, y_offset),
        p4 = new THREE.Vector2(-1 * x_offset, y_offset);

    var points = [p1, p2, p3, p4, p1];

    makeShape(points);
    scene.add(mesh);

}

/**
 * Makes a ShapeGeometry - only used for making shapes for the Origami
 * @param {Vector2[]} points
 */
function makeShape(points) {

    shape = new THREE.Shape();
    shape.fromPoints(points);
    //console.log(shape.curves);
    geometry = new THREE.ShapeGeometry(shape);
    mesh = new THREE.Mesh(geometry, material);
}

/**
* Initializes the Origami object and first State, locks dimensions of paper.
* Makes other paper controls visible.
*/
function setupOrigamiModel(){
    $("#paperWidth").prop("readonly", true);
    $("#paperHeight").prop("readonly", true);

    //Detach PaperDimensions form and StarProject button from page.
    $("#paperDimensions").detach();
    $("#startProject").detach();

    //Make invisibleControls visible
    $("#invisibleControls").css("display", "inline");

    //Initialize State object
    var state = new State();
    state.shapeGeometries.push(mesh);
    //Initialize Origami object
    var modelName = getOrigamiModelName();
    ORIGAMI = new Origami(modelName);
    ORIGAMI.states.push(state);

    console.log(ORIGAMI);
}

/**
* Draws a crease line, updates on Crease Point input change
*/
function drawCrease(input) {
    if (line) {
        scene.remove(line);
    }

    var points = getCreaseInputs(input);
    if(isValidCrease(input) === false){
        return;
    }
    line_geometry = new THREE.Geometry();
    line_geometry.vertices.push(points[0], points[1]);
    line = new THREE.Line(line_geometry, lineMaterial);
    scene.add(line);
}

/**
* Crease needs to be a line, not a point.
* @return {Boolean}
*/
function isValidCrease(input){
    var points = getCreaseInputs(input);
    if(isValidInput(input) === false || points[0].equals(points[1])){
        $("#foldAngle").prop('disabled', true);
        return false;
    }
    $("#foldAngle").prop('disabled', false);
    $("#creaseCoordinates").css("background-color", "transparent");
    return true;
}

/* DOES NOT WORK AT ALL FOR ANY OTHER CASES, this is where life gets harder*/
/**
* Fold operation
*/
function fold() {

    clearSceneOfMeshes();

    //Make new points array
    var point1 = new THREE.Vector2(line_geometry.vertices[0].x, line_geometry.vertices[0].y),
        point2 = new THREE.Vector2(line_geometry.vertices[1].x, line_geometry.vertices[1].y);

    var points1 = [new THREE.Vector2(-5, -5), new THREE.Vector2(5, -5),
        point1, point2, new THREE.Vector2(-5, -5)
    ];
    var points2 = [new THREE.Vector2(5, 5), new THREE.Vector2(-5, 5),
        point2, point1, new THREE.Vector2(5, 5)
    ];


    makeShape(points1);
    scene.add(mesh);
    makeShape(points2);
    scene.add(mesh);
    //mesh.geometry.rotateX(Math.PI);
    rotateAxis(mesh, getFoldAxis(), Math.PI/2);


    //Initialize new State and add new crease line
    var state = new State();
    var prevStateCreases = ORIGAMI.states[ORIGAMI.currentStateIndex].creaseLines;
    state.creaseLines = prevStateCreases.slice();
    state.creaseLines.push(line);
    //need to add shapeGeometries

    //Update ORIGAMI
    ORIGAMI.states.push(state);
    ORIGAMI.currentStateIndex += 1;
    console.log(ORIGAMI);
}

function clearSceneOfMeshes(){
    scene.children.forEach(function(object){
        if(object.type === "Mesh" || object.type === "Line")
        scene.remove(object);
    });
    if (line){
        scene.remove(line);
    }
}

/**
* Calculate rotation axis
* @return {Vector3} normalized direction vector
*/
function getFoldAxis(){
    var axis = new THREE.Vector3();
    var points = getCreaseInputs($("#creaseX1"));
    axis.subVectors(points[1], points[0]);
    axis.normalize();
    //console.log("axis", axis);
    return axis;
}

/**
* @param {Mesh} face
* @param {Vector3} axis
* @param {Number} radians
*/
/*function rotateAxis(mesh, axis, radians) {
    console.log(mesh.rotation);
    mesh.rotateOnAxis(axis, radians);
    console.log(mesh.rotation);
}
*/

/**
* Real-time Rotation
*/
function rotate(){
    var angleDegrees = $("#foldAngle").val();
    var angleRadians = (angleDegrees/360)*(2*Math.PI);
    var quaternion = new THREE.Quaternion().setFromAxisAngle(getFoldAxis(), angleRadians);
    mesh.setRotationFromQuaternion(quaternion.normalize());
}

function Origami(modelName){
    this.modelName = modelName;
    this.states = [];  //Array os State objects
    this.currentStateIndex = 0;

}

function State(){
    this.creaseLines = []; //Array of THREE.Line objects
    this.shapeGeometries = []; //Array of meshes
}

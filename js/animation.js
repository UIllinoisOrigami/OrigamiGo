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
    rotate(mesh, getFoldAxis(), Math.PI/2);


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
* Real-time Rotation
*/
function rotate(){
    //Need to select mesh/face to rotate
    //Disable if in state 0
    if(ORIGAMI.currentStateIndex === 0){ //or no face selected
        return;
    }
    var angleDegrees = getRotationAngle();
    var angleRadians = (angleDegrees/360)*(2*Math.PI);
    var quaternion = new THREE.Quaternion().setFromAxisAngle(getFoldAxis(), angleRadians);
    mesh.setRotationFromQuaternion(quaternion.normalize());
}

function rotateFace(){

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

function clearSceneOfMeshes(){
    scene.children.forEach(function(object){
        if(object.type === "Mesh" || object.type === "Line")
        scene.remove(object);
    });
    if (line){
        scene.remove(line);
    }
}

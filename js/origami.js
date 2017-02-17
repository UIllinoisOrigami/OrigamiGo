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


function Origami(modelName){
    this.modelName = modelName;
    this.states = [];  //Array os State objects
    this.currentStateIndex = 0;

}

function State(){
    this.creaseLines = []; //Array of THREE.Line objects
    this.shapeGeometries = []; //Array of meshes
}

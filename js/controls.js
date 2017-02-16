/**
* Checks input field elements are strictly numeric type and non-null.
* Highlights input field if invalid input.
*/
function isValidInput(inputElement) {
    if (inputElement.value && $(inputElement)[0].checkValidity()) {
        $(inputElement).css("background-color", "transparent");
        return inputElement.value;
    } else {
        $(inputElement).css("background-color", "rgba(255,0,0,.3)");
        return false;
    }
}

/**
* Press the space bar to freeze the camera controls.
* Also takes focus off input elements.
*/
function onKeyDown(event) {
    if (event.keyCode == "32") {
        $(document.activeElement).blur();
        controls.enabled = false;
    }
}
/**
* Enable camera controls again upon spacebar up.
*/
function onKeyUp(event) {
    if (event.keyCode == "32") {
        controls.enabled = true;
    }
}

/**
* Gets X1, X2, Y1, Y2 from input fields.
* Returns Vector3 type because THREE.Line only takes Vector3.
* @return {Vector3[]}
*/
function getCreaseInputs(input) {
    var x1 = Number(document.getElementById('creaseX1').value),
        y1 = Number(document.getElementById('creaseY1').value),
        x2 = Number(document.getElementById('creaseX2').value),
        y2 = Number(document.getElementById('creaseY2').value);

    //TODO find robust way of determining x and y limits.
    if (x1 > input.max) {
        x1 = input.max;
        input.value = input.max;
    }
    if (x1 < input.min) {
        x1 = input.min;
        input.value = input.min;
    }

    if (x2 > input.max) {
        x2 = input.max;
        input.value = input.max;
    }
    if (x2 < input.min) {
        x2 = input.min;
        input.value = input.min;
    }

    if (y1 > input.max) {
        y1 = input.max;
        input.value = input.max;
    }
    if (y1 < input.min) {
        y1 = input.min;
        input.value = input.min;
    }

    if (y2 > input.max) {
        y2 = input.max;
        input.value = input.max;
    }
    if (y2 < input.min) {
        y2 = input.min;
        input.value = input.min;
    }

    var point1 = new THREE.Vector3(x1, y1, 0);
    var point2 = new THREE.Vector3(x2, y2, 0);

    return [point1, point2];
}

function getOrigamiModelName(){
    var name = document.getElementById('modelName').value;
    return name;
}

function setOrigamiModelName(inputElement){
    var name = inputElement.value;
    if(ORIGAMI){
        ORIGAMI.modelName = name;
    }
}



//TODO Enable options to change view styles. Wireframe, solid, crease, etc.
/*function viewWireframe(checkbox){

    scene.traverse( function(child){
      if(child instanceof THREE.Mesh && child.name=="mesh"){
        if(checkbox.checked){
          child.material.wireframe= true;
        }
        else{
          child.material.wireframe= false;
        }
      }
    });
}*/

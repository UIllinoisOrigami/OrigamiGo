function setInitialGeometry(){
  var width = Number(isValidInput(document.getElementById('paperWidth')));
  var height = Number(isValidInput(document.getElementById('paperHeight')));

  if(!(width && height)){
    return;
  }
  if(mesh){
    scene.remove(mesh);
    geometry.dispose();
    mesh.geometry.dispose();
  }
  x_offset = width/2;
  y_offset = height/2;

  var p1 = new THREE.Vector2(-1*x_offset,-1*y_offset),
      p2 = new THREE.Vector2(x_offset,-1*y_offset),
      p3 = new THREE.Vector2(x_offset,y_offset),
      p4 = new THREE.Vector2(-1*x_offset,y_offset);

  var points = [p1, p2, p3, p4, p1];

  makeShape(points);

  scene.add(mesh);
}

/**
* @param {Vector2[]} points
*/
function makeShape(points){

  shape = new THREE.Shape();
  shape.fromPoints(points);
  //console.log(shape.curves);
  geometry= new THREE.ShapeGeometry(shape);
  mesh = new THREE.Mesh(geometry, material);

}


Origami = function(ModelName){
  this.states = [];
  this.currentStateIndex = 0;

}

//origmami clean up

State = function(){
  this.creasePattern = null;
  this.creaseLines = [];
  this.shapeGeometries = null;
}

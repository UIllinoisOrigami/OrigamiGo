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

  $("[id^=creaseX]").attr({"max" : x_offset ,"min" : -1*x_offset});
  $("[id^=creaseY]").attr({"max" : y_offset ,"min" : -1*y_offset});

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

/**
*@param {Vector2} point1
*@param {Vector2} point2
*/
function drawCrease(input){
  if(line){
    scene.remove(line);
  }
  var points = getCreaseInputs(input);
  line_geometry = new THREE.Geometry();
  line_geometry.vertices.push(points[0], points[1]);
  line = new THREE.Line( line_geometry, lineMaterial );
  scene.add( line );
}

/* DOES NOT WORK AT ALL FOR ANY OTHER CASES*/
function fold(){
  //console.log(line_geometry.vertices[0], line_geometry.vertices[1]);
  //make new points array
  var point1 = new THREE.Vector2(line_geometry.vertices[0].x, line_geometry.vertices[0].y),
      point2 = new THREE.Vector2(line_geometry.vertices[1].x, line_geometry.vertices[1].y);

  console.log(point1)
  console.log(point2)

  var points1 = [new THREE.Vector2(-5, -5), new THREE.Vector2(5,-5),
                point1, point2, new THREE.Vector2(-5, -5)];
  var points2 = [new THREE.Vector2(5,5), new THREE.Vector2(-5,5),
                point2,point1, new THREE.Vector2(5,5)];

  scene.remove(mesh);
  makeShape(points1);
  scene.add(mesh);
  makeShape(points2);
  scene.add(mesh);
  mesh.geometry.rotateX(Math.PI);
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

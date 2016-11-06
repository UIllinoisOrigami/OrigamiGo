/**
* @author Celestine Kao
* Contains:
* triRemesh(faces, line) <-- Weird bug when given just paperGeometry.faces. See below for example usage.
* rayTraceLineTriIntersection(triangle, line)
* f_VectorEquals(point1, point2)
* triRemesh_helper(triVerts, lineVerts)
* pointInTriangleRegion(point, triVerts)
* findFace(face)
* removeRepeats(points) <-- Warning, only use this to check equality/repetition. The data type it returns is weird and not compabtible with arrays[].
* normalizeLine(line) <-- TO DO
* findSpanningLine(line, triSides) <-- TO DO
*/

/** NOTES FOR LATER.
* 1) We will  need to find where the fold line intersects
*    the boarder and visual fold lines and re-mesh those lines but I think we should 1st focus
*    on the paper and then add the lines later.
* 2) Eventually change how triRemesh_helper handles one point of interesection
* 3) Figure out triRemesh weird bug.
*/

/**
* Triangle re-mesh
* If a line intersects a triangle/face, calculates repartitioning
* of face to maintain all triangular sub-components.
* Takes an array of triangle faces and a line object.
* Removes faces from paperGeometry which collide with the line, and inserts new faces of the resultant remesh.
*/
function triRemesh(line){
  //Should probably check valid and non-empty input being given
  var new_paperGeometry = new THREE.Geometry();
  var colliding_faces = [];
  //Need to add all other non-colliding faces from old paperGeometry
  //First add vertices, we will merge at the end of triRemesh.
  for(var i = 0; i < paperGeometry.vertices.length; i++){
    new_paperGeometry.vertices.push(
      new THREE.Vector3(paperGeometry.vertices[i].x,paperGeometry.vertices[i].y,paperGeometry.vertices[i].z)
    );
  }
  //Now add to new_paperGeometry if no collision
  //Else add to colliding_faces
  for(var i = 0; i < paperGeometry.faces.length; i++){
    if(rayTraceLineTriIntersection(paperGeometry.faces[i], line).length == 0){
      new_paperGeometry.faces.push(
        new THREE.Face3(paperGeometry.faces[i].a, paperGeometry.faces[i].b, paperGeometry.faces[i].c)
      );
    }
    else{
      colliding_faces.push(paperGeometry.faces[i]);
    }
  }

  for(var i = 0; i < colliding_faces.length; i++){
    var new_triangles = triRemesh_helper(colliding_faces[i], line);
    for(var k = 0; k < new_triangles.length; k++){ //Each triangle
      //Add all the points to the end new_paperGeometry.vertices
      new_paperGeometry.vertices.push(
        new THREE.Vector3(new_triangles[k][0].x, new_triangles[k][0].y, new_triangles[k][0].z),
        new THREE.Vector3(new_triangles[k][1].x, new_triangles[k][1].y, new_triangles[k][1].z),
        new THREE.Vector3(new_triangles[k][2].x, new_triangles[k][2].y, new_triangles[k][2].z)
      );
      //Create and add face from the last three points pushed
      console.log("FACE PUSHED")
      var new_face = new THREE.Face3(new_paperGeometry.vertices.length-3, new_paperGeometry.vertices.length-2, new_paperGeometry.vertices.length-1);
      new_paperGeometry.faces.push(new_face);
    }
  }
  //mergeVertices to update vertices array
  new_paperGeometry.mergeVertices();
  //Delete old paperGeometry
  paperGeometry.dispose();
  paperGeometry = null;
  paper.geometry.dispose();
  paper.geometry = null;

  paperGeometry = new_paperGeometry;
  paper.geometry = paperGeometry
  console.log(paper.geometry.faces.length)
}

/**
* Ray Trace Line Triangle intersection
* Uses ray tracing with to determine the first point of intersection (if any)
* of a line with a triangle. Returns array of Vector3 points of intersection else [].
* Returns [] when line has terminating point on triangle or when a triangle side lies on the line.
* @param triangle - Face
* @param line - Line
* NEED TO CLEAN UP MEMORY
*/
function rayTraceLineTriIntersection(triangle, line){
  //console.log(line)
  //Weird stuff happens when a line point is near a corner. Not sure how to handle.

  //Pull out points from triangle as Vector3's
  var vertex_one = paperGeometry.vertices[triangle.a],
      vertex_two = paperGeometry.vertices[triangle.b],
      vertex_three = paperGeometry.vertices[triangle.c];
  //Make LineSegments object with lines for each side
  var geometry1 = new THREE.Geometry();
  geometry1.vertices.push(vertex_one, vertex_two);
  var line1 = new THREE.LineSegments(geometry1);

  var geometry2 = new THREE.Geometry();
  geometry2.vertices.push(vertex_two,vertex_three);
  var line2 = new THREE.LineSegments(geometry2);

  var geometry3 = new THREE.Geometry();
  geometry3.vertices.push(vertex_three,vertex_one);
  var line3 = new THREE.LineSegments(geometry3);

  //Calculate the direction vector and normalize
  var dir_vec = new THREE.Vector3(line.geometry.vertices[1].x - line.geometry.vertices[0].x, line.geometry.vertices[1].y - line.geometry.vertices[0].y, line.geometry.vertices[1].z - line.geometry.vertices[0].z);
  dir_vec.normalize();
  //Create ray from line starting point line.vertices[0]
  var origin = line.geometry.vertices[0]
  //console.log("origin=",origin, "dir_vec=",dir_vec)
  var ray = new THREE.Raycaster(origin, dir_vec);
  var intersections = ray.intersectObjects([line1, line2,line3]);
  //console.log("intersections", intersections)

  //Getting float point problems again.
  var intersections_points = [];
  var ray_length = origin.distanceTo(line.geometry.vertices[1])
  for(var i = 0; i < intersections.length; i++){
    //Pass on any points outside the bounds.
    if(intersections[i].distance > ray_length && Math.abs(intersections[i].distance - ray_length) > .0001){
      continue;
    }
    else{
      intersections_points.push(intersections[i].point);
    }
  }

  //Need to remove repeating elements.
  for(var i = 0; i < intersections_points.length-1; i++){
    var curr = intersections_points[i];
    //Repeat occurs when abs(a-b) < .0001
    for(var k = i+1; k < intersections_points.length; k++){
      var to_check = intersections_points[k];
      if(f_VectorEquals(curr,to_check)){
        delete intersections_points.splice(i,1);
      }
    }
  }
  //If any two of the vertices in the list, then a triangle side was on line, so reject and return empty arr[]
  var count_vertices = 0;
  for(var i = 0; i<intersections_points.length; i++){
    if(f_VectorEquals(intersections_points[i],vertex_one)|| f_VectorEquals(intersections_points[i],vertex_two) || f_VectorEquals(intersections_points[i],vertex_three)){
      count_vertices++;
    }
  }
  if(count_vertices > 1){
    return [];
  }
  //If only 1 intersection and the other line point not inside the triangle, then return []
  if(intersections_points.length == 1){
    if(f_VectorEquals(intersections_points[0],origin) && pointInTriangleRegion(line.geometry.vertices[1], triangle) == false){
      return [];
    }
    if(f_VectorEquals(intersections_points[0],line.geometry.vertices[1]) && pointInTriangleRegion(origin, triangle) == false){
      return [];
    }
  }
  return intersections_points;
}

/**
* Floating Vector Equals
* Floating point sucks so need to check equality in a more special way
* @param point1 - Vector3
* @param point2 - Vector3
*/
function f_VectorEquals(point1, point2){
  var x_diff = Math.abs(point1.x - point2.x) < .0001,
      y_diff = Math.abs(point1.y - point2.y)< .0001,
      z_diff = Math.abs(point1.z - point2.z) < .0001;

  if(x_diff && y_diff && z_diff){
    return true;
  }
  return false;
}
/**
* Triangle Remesh Helper
* Returns an array of arrays of triangle vertices (Vector3), resulting from remeshing calculation.
* @param triangle - Face
* @param line - Line
*/
function triRemesh_helper(triangle, line){
  var intersection_points = rayTraceLineTriIntersection(triangle, line);
  var vertex_one = paperGeometry.vertices[triangle.a],
      vertex_two = paperGeometry.vertices[triangle.b],
      vertex_three = paperGeometry.vertices[triangle.c];
  //Case 1: One point of intersection. (One of line's endpoints is inside the triangle)
  if(intersection_points.length == 1){
    var inner_point = [];
    //Case 1.1.1: Line starts outside of the triangle, so intersection point is neither endpoint
    if(f_VectorEquals(intersection_points[0],line.geometry.vertices[0]) == false && f_VectorEquals(intersection_points[0],line.geometry.vertices[1]) == false){
      //Figure out which endpoint is inside
      if(pointInTriangleRegion(line.geometry.vertices[0], triangle)){
        inner_point.push(line.geometry.vertices[0]);
      }
      else{
        inner_point.push(line.geometry.vertices[1]);
      }
    }
    else{
      if(f_VectorEquals(intersection_points[0],line.geometry.vertices[0]) == false && pointInTriangleRegion(line.geometry.vertices[0], triangle)){
        inner_point.push(line.geometry.vertices[0]);
      }
      else{
        inner_point.push(line.geometry.vertices[1]);
      }
    }
    var shared_vertex = false;
    if(f_VectorEquals(vertex_one, intersection_points[0])){
      shared_vertex = true;
    }
    if(f_VectorEquals(vertex_two, intersection_points[0])){
      shared_vertex = true;
    }
    if(f_VectorEquals(vertex_three, intersection_points[0])){
      shared_vertex = true;
    }
    //Case 1.2.1: Intersection point is a triangle vertex.
    if(shared_vertex == true){
      var ret_tri1 = [vertex_one, inner_point, vertex_two],
          ret_tri2 = [vertex_two, inner_point, vertex_three],
          ret_tri3 = [vertex_three, inner_point, vertex_one];
      return [ret_tri1, ret_tri2, ret_tri3];
    }
    //Case 1.2.2: Intersection point is on a triangle side.
    else{
      //Need to figure out which side contains the intersection point. (v1 v2 will be the side with the intersection)
      var v1, v2, v3;
      if(vertex_one.distanceTo(intersection_points[0]) + intersection_points[0].distanceTo(vertex_two) == vertex_one.distanceTo(vertex_two)){
        v1 = vertex_one;
        v2 = vertex_two;
        v3 = vertex_three;
      }
      if(vertex_two.distanceTo(intersection_points[0]) + intersection_points[0].distanceTo(vertex_three) == vertex_two.distanceTo(vertex_three)){
        v1 = vertex_two;
        v2 = vertex_three;
        v3 = vertex_one;
      }
      if(vertex_three.distanceTo(intersection_points[0]) + intersection_points[0].distanceTo(vertex_one) == vertex_three.distanceTo(vertex_one)){
        v1 = vertex_three;
        v2 = vertex_one;
        v3 = vertex_two;
      }

      var ret_tri1 = [v1, inner_point, intersection_points[0]],
          ret_tri2 = [intersection_points[0], inner_point, v2],
          ret_tri3 = [v2, inner_point, v3],
          ret_tri4 = [v3, inner_point, v1];
      return [ret_tri1, ret_tri2, ret_tri3, ret_tri4];
    }
  }

  //Case 2: Two points of intersection.
  else{
    var shared_vertex = null,
        v1 = null,
        v2 = null;

    for(var i = 0; i < intersection_points.length; i++){
      if(f_VectorEquals(vertex_one, intersection_points[i])){
        shared_vertex = vertex_one;
        v1 = vertex_two;
        v2 = vertex_three;
      }
      if(f_VectorEquals(vertex_two, intersection_points[i])){
        shared_vertex = vertex_two;
        v1 = vertex_one;
        v2 = vertex_three;
      }
      if(f_VectorEquals(vertex_three, intersection_points[i])){
        shared_vertex = vertex_three;
        v1 = vertex_one;
        v2 = vertex_two;
      }
    }
    //Case 2.1: Vertex to side.
    if(shared_vertex != null){
      var side_point = intersection_points[0]; //Figure out which intersection point *isn't* a vertex.
      if(f_VectorEquals(shared_vertex, side_point)){
        side_point = intersection_points[1];
      }
      var ret_tri1 = [shared_vertex, v1, side_point],
          ret_tri2 = [shared_vertex, v1, side_point];
      return [ret_tri1, ret_tri2];
    }
    //Case 2.2: Side to side.
    else{
      //Figure out which triangle vertex is by its lonesome on its side of the line.
      var intersected_sides = []
      for(var i = 0; i < intersection_points.length; i++){
        if(vertex_one.distanceTo(intersection_points[i]) + intersection_points[i].distanceTo(vertex_two) == vertex_one.distanceTo(vertex_two)){
          intersected_sides.push(vertex_one,vertex_two);
        }
        if(vertex_two.distanceTo(intersection_points[i]) + intersection_points[i].distanceTo(vertex_three) == vertex_two.distanceTo(vertex_three)){
          intersected_sides.push(vertex_two, vertex_three);
        }
        if(vertex_three.distanceTo(intersection_points[i]) + intersection_points[i].distanceTo(vertex_one) == vertex_three.distanceTo(vertex_one)){
          intersected_sides.push(vertex_three, vertex_one);
        }
      }
      var shared_vertex;
      for(var i = 0; i<intersected_sides.length-1; i++){
        for(var k = i+1; k<intersected_sides.length; k++){
          if(intersected_sides[i] == intersected_sides[k]){
            shared_vertex = intersected_sides[i];
            break;
          }
        }
      }
      //Now figure out which are the non-shared vertices
      var v1, v2;
      if(vertex_one == shared_vertex){
        v1 = vertex_two;
        v2 = vertex_three;
      }
      if(vertex_two == shared_vertex){
        v1 = vertex_one;
        v2 = vertex_three;
      }
      if(vertex_three == shared_vertex){
        v1 = vertex_one;
        v2 = vertex_two;
      }

      var closeTo_v1 = intersection_points[0],
          farTo_v1 = intersection_points[1];
      if(closeTo_v1.distanceTo(v1) > farTo_v1.distanceTo(v1)){
        closeTo_v1 = intersection_points[1];
        farTo_v1 = intersection_points[0];
      }
      var ret_tri1 = [shared_vertex, closeTo_v1, farTo_v1],
          ret_tri2 = [closeTo_v1, v1, v2],
          ret_tri3 = [closeTo_v1, farTo_v1, v2];
      return [ret_tri1, ret_tri2, ret_tri3];
    }
  }
}

/**
* Point in Triangle Region
* Takes a point and an array of vertices of a triangle.
* Returns true if the point lies within the same plane and region of the trangle's interior
* Return false otherwise
* @param point - Vector3
* @param triangle - Face
* Note: This function also returns true if the point is on any of the triangle edges.
*       Also assumes point and triangle are coplanar.
*/
/******* NEED TO CLEAN UP MEMORY **********/
function pointInTriangleRegion(point, triangle){
  //Define plane of triangle to get its normal.
  var vertex_one = paperGeometry.vertices[triangle.a],
      vertex_two = paperGeometry.vertices[triangle.b],
      vertex_three = paperGeometry.vertices[triangle.c];
  var tri_plane = new THREE.Plane();
  tri_plane.setFromCoplanarPoints(vertex_one, vertex_two,vertex_three);
  var dir_vec = tri_plane.normal.normalize();
  //console.log(normal)
  var ray = new THREE.Ray(point,dir_vec);
  var new_vec = ray.intersectTriangle(vertex_one, vertex_two,vertex_three, false, null);

  if(new_vec == null){
    return false;
  }
  return true;
}
/**
* Find Face
* Takes a face, finds its index in paperGeometry.faces, and returns it.
* Will be too slow as face array grows, will need to optimize.
*/
function findFace(face){
  //They should have the same paperGeometry.vertices indices for a/b/c components
  //Not sure if we can just do face == paperGeometry.faces[i], since that might just be comparing references
  for(var i = 0; i < paperGeometry.faces.length; i++){
    if(paperGeometry.faces[i].a == face.a && paperGeometry.faces[i].b == face.b, paperGeometry.faces[i].c == face.c){
      return i;
    }
  }
}
/**
* Remove Repeats
* Quick and dirty way to remove any duplicate points in a point array.
* Takes point array, returns cleaned array. But not the array type you'd expect.....
*/
function removeRepeats(points){
  dictionaries_are_beautiful_things={}; //especially when you don't know jquery
  for (var i=0;i<points.length;i++) {
    dictionaries_are_beautiful_things[points[i]]=0;
  }
  return Object.keys(dictionaries_are_beautiful_things);
}
/* *
* Take point and array of line endpoints.
* Returns true if point is on the line segment, else false.
*/
function pointOnLine(point, line){
  var l_a1 = line[0][0],
      l_a2 = line[0][1],
      l_a3 = line[0][2],
      l_b1 = line[1][0],
      l_b2 = line[1][1],
      l_b3 = line[1][2];

  var p_a1 = point[0],
      p_a2 = point[1],
      p_a3 = point[2];
  var l_dir_vec = [l_b1 - l_a1, l_b2 - l_a2, l_b3 - l_a3];  //line as form (a1,a2,a3) + t*l_dir_vec
  var a_min_p = [l_a1 - p_a1, l_a2 - p_a2, l_a3 - p_a3];
  var cross_product = [a_min_p[1] * l_dir_vec[2] - a_min_p[2] * l_dir_vec[1],
                      a_min_p[2] * l_dir_vec[0] - a_min_p[0] * l_dir_vec[2],
                      a_min_p[0] * l_dir_vec[1] - a_min_p[1] * l_dir_vec[0]];  //perform cross product between a_min_p and l_dir_vec
  var mag_l_dir_vec = Math.abs(Math.sqrt(Math.pow(l_dir_vec[0],2) + Math.pow(l_dir_vec[1],2) + Math.pow(l_dir_vec[2],2)));
  var mag_cross  = Math.abs(Math.sqrt(Math.pow(cross_product[0],2) + Math.pow(cross_product[1],2) + Math.pow(cross_product[2],2)));
  var p_distToLine = (mag_cross/mag_l_dir_vec).toFixed(4);
  //Point to infinite line distance is 0, now check point P within the line segment AB, ie AP + PB = AB
  if(p_distToLine == 0 && (pointToPointDist(point, line[0]) + pointToPointDist(line[1], point)).toFixed(4) == pointToPointDist(line[0], line[1]).toFixed(4)){
    return true
  }
  return false;

}

/**
* Normalize Line
* Given a line object, calculates the normalized form
* and returns a normalized line object.
*/
function normalizeLine(line){

}
/**
* Find Spanning Line
* Given a line (L1) with an end point (P1) not on triangle and betwen two coplanar lines (L2,L3)
* Calculates and returns a spanning line that is also on the same plane, with end
* points on both L2 and L3 and containing P1.
* Takes point array and array of two line arrays, returns line array.
*/
function findSpanningLine(line, triSides){

}

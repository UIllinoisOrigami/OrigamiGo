/**
* @author Celestine Kao
* Contains:
* triRemesh(faces, line) <-- Weird bug when given just paperGeometry.faces. See below for example usage.
* rayTraceLineTriIntersection(triangle, line)
* f_VectorEquals(point1, point2)
* triRemesh_helper(triVerts, lineVerts)
* lineTriInt(triVerts, lineVerts)
* pointInTriangleRegion(point, triVerts)
* findFace(face)
* removeRepeats(points) <-- Warning, only use this to check equality/repetition. The data type it returns is weird and not compabtible with arrays[].
* pointOnLine(point, line)
* pointToPointDist(point1, point2)
* normalizeLine(line) <-- TO DO
* findSpanningLine(line, triSides) <-- TO DO
*/

/** NOTES FOR LATER.
* 1) We will  need to find where the fold line intersects
*    the boarder and visual fold lines and re-mesh those lines but I think we should 1st focus
*    on the paper and then add the lines later.
* 2) Make funcs more robust, ie don't assume coplanarity. And others?
* 3) Figure out triRemesh weird bug.
*/

/**
* Triangle re-mesh
* If a line intersects a triangle/face, calculates repartitioning
* of face to maintain all triangular sub-components.
* Takes an array of triangle faces and a line object.
* Removes faces from paperGeometry which collide with the line, and inserts new faces of the resultant remesh.
*/
function triRemesh(faces, line){
  //Should probably check valid and non-empty input being given
  var new_paperGeometry = new THREE.Geometry();
  //Need to add all other non-colliding faces from old paperGeometry
  for(var i = 0; i < paperGeometry.vertices.length; i++){
    new_paperGeometry.vertices.push(
      new THREE.Vector3(paperGeometry.vertices[i].x,paperGeometry.vertices[i].y,paperGeometry.vertices[i].z)
    );
  }
  for(var i = 0; i < paperGeometry.faces.length; i++){
    //Only add non colliding faces, so need to check as each face for collision, and if yes, don't push to new geometry
    //But we can add to a colliding_faces arr!
    new_paperGeometry.faces.push(
      new THREE.Face3(paperGeometry.faces[i].a, paperGeometry.faces[i].b, paperGeometry.faces[i].c)
    );
  }

  var line_vertices = [[line.vertices[0].x, line.vertices[0].y, line.vertices[0].z], [line.vertices[1].x, line.vertices[1].y, line.vertices[1].z]];
  //Build array of faces vertices -> [[face1v1, face1v2, face1v3], [face2v1, face2v2, face2v3], ...].
  var faces_vertices = [];
  for(var i = 0; i < faces.length; i++){
    var fvertices = [

      /*[paperGeometry.vertices[faces[i].a].x, paperGeometry.vertices[faces[i].a].y, paperGeometry.vertices[faces[i].a].z],
      [paperGeometry.vertices[faces[i].b].x, paperGeometry.vertices[faces[i].b].y, paperGeometry.vertices[faces[i].b].z],
      [paperGeometry.vertices[faces[i].c].x, paperGeometry.vertices[faces[i].c].y, paperGeometry.vertices[faces[i].c].z]
      */
      [paperGeometry.vertices[faces[i].a].x, paperGeometry.vertices[faces[i].a].y, 0.1],
      [paperGeometry.vertices[faces[i].b].x, paperGeometry.vertices[faces[i].b].y, 0.1],
      [paperGeometry.vertices[faces[i].c].x, paperGeometry.vertices[faces[i].c].y, 0.1]
    ];
    faces_vertices.push(fvertices);
  }

  for(var i = 0; i < faces_vertices.length; i++){
    //First check if face and line intersects
    var line_intersection_points = lineTriInt(faces_vertices[i], line_vertices);
    if(line_intersection_points.length > 0){
      //Needs special handling if only one point of intersection returned
      if(line_intersection_points.length == 1){
        //case 1: Line has an endpoint inside triangle and line doesn't start on the triangle.
        if(removeRepeats(line_vertices.concat([line_intersection_points[0]])).length == 3){
          if(pointInTriangleRegion(line_vertices[0], faces_vertices[i]) == true){
            line_intersection_points.push(line_vertices[0]);
          }
          else if(pointInTriangleRegion(line_vertices[1], faces_vertices[i]) == true){
            line_intersection_points.push(line_vertices[1]);
          }
        }
        //case 2: Line terminates/starts on the triangle side, but does not continue within. In this case, do not remesh.
        else{
          //Line could be starting on triangle and terminating inside.
          if(removeRepeats([line_intersection_points[0], line_vertices[0]]).length == 1 && pointInTriangleRegion(line_vertices[1], faces_vertices[i]) == true){
            line_intersection_points.push(line_vertices[1]);
          }
          else if(removeRepeats([line_intersection_points[0], line_vertices[1]]).length == 1 && pointInTriangleRegion(line_vertices[0], faces_vertices[i]) == true){
            line_intersection_points.push(line_vertices[0]);
          }
          else{
            continue;
          }
        }

      }
      var new_triangles = triRemesh_helper(faces_vertices[i], line_intersection_points); //[[[a,b,c], [e,f,g], [x,y,z]], ...]
      for(var k = 0; k < new_triangles.length; k++){ //Each triangle
        //Add all the points to the end new_paperGeometry.vertices
        new_paperGeometry.vertices.push(
          new THREE.Vector3(new_triangles[k][0][0],new_triangles[k][0][1],new_triangles[k][0][2]),
          new THREE.Vector3(new_triangles[k][1][0],new_triangles[k][1][1],new_triangles[k][1][2]),
          new THREE.Vector3(new_triangles[k][2][0],new_triangles[k][2][1],new_triangles[k][2][2])
        );
        //Create and add face from the last three points pushed
        var new_face = new THREE.Face3(new_paperGeometry.vertices.length-3, new_paperGeometry.vertices.length-2, new_paperGeometry.vertices.length-1);
        new_paperGeometry.faces.push(new_face);
      }
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

  //Remove the faces that have split up from new_paperGeometry, ie paperGeometry
  //not sure if this is super necessary... probably not. Probably just slow.
  // TOOOO SLOOOOW
  /*for(var i = 0; i < faces.length; i++){
    delete paperGeometry.faces.splice(findFace(faces[i]),1);
  }*/
  paper.geometry = paperGeometry
}

/**
* Ray Trace Line Triangle intersection
* Uses ray tracing with to determine the first point of intersection (if any)
* of a line with a triangle. Return Vector3 point of intersection else null.
* @param triangle - Face object
* @param line - Line geometry
*/
function rayTraceLineTriIntersection(triangle, line){

  //Pull out points from triangle as Vector3's
  var vertex_one = paperGeometry.vertices[triangle.a],
      vertex_two = paperGeometry.vertices[triangle.b],
      vertex_three = paperGeometry.vertices[triangle.c];

  console.log("side1", vertex_one, vertex_two)
  console.log("side2", vertex_two, vertex_three)
  console.log("side3", vertex_three, vertex_one)
  console.log("line", line.geometry.vertices[0],line.geometry.vertices[1])

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
  var ray = new THREE.Raycaster(origin, dir_vec);

  var intersections = ray.intersectObjects([line1, line2, line3]);
  console.log("intersections", intersections)

  //Getting float point problems again.
  var intersections_points = [];
  for(var i = 0; i < intersections.length; i++){
    intersections_points.push(intersections[i].point);
  }

  /*console.log(intersections_points[0], intersections_points[1], intersections_points[2]);
  intersections_points.sort(function comparator(a,b){return a.x - b.x;});
  console.log(intersections_points[0], intersections_points[1], intersections_points[2]);
  */
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
  //Remove any vertices outside the bounds of the line.
  var ray_length = origin.distanceTo(line.geometry.vertices[1])
  for(var i = 0; i<intersections_points.length; i++){
    if(origin.distanceTo(intersections_points[i]) > ray_length && Math.abs(origin.distanceTo(intersections_points[i]) - ray_length) > .0001){
      delete intersections_points.splice(i,1);
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
//Because let's not rewrite everything. Not pretty, probably not efficient, can rewrite later.
/**
* Triangle Remesh Helper
* Takes an array of triangle vertices in array form, and an array of line vertices in array form.
* Returns an array of arrays of triangle vertices, resulting from remeshing calculation,
* to be added to the geometry as face objects.
*/
function triRemesh_helper(triVerts, lineVerts){ //triVerts=[[a,b,c],[e,f,g],[h,i,j]] lineVerts = [[k,l,m],[n,o,p]]

  var triside1 = [triVerts[0], triVerts[1]];
  var triside2 = [triVerts[1], triVerts[2]];
  var triside3 = [triVerts[2], triVerts[0]];

  var trisides = [triside1, triside2, triside3]; //[[[a,b,c],[e,f,g]],[[e,f,g],[h,i,j]],[[h,i,j],[a,b,c]]]
  var point_arr = removeRepeats(lineVerts.concat(triVerts));

  //Case 1: 1 point of intersection (4 unique vertices)
  if(point_arr.length == 4){
    var vertex = lineVerts[0];
    var other = lineVerts[1];
    if(removeRepeats(triVerts.concat([lineVerts[1]])).length == 3){
      vertex = lineVerts[1];
      other = lineVerts[0];
    }
    var no_l_verts = [];
    //Determine which of the line points is also a triangle vertex point, and which triangle points aren't
    for(var i = 0; i < 3; i++){
      if(removeRepeats([triVerts[i],vertex]).length == 2){
        no_l_verts.push(triVerts[i]);
      }
    }
    //1.0: Vertex to side
    for(var i = 0; i < 3 ; i++){
      if(pointOnLine(other,trisides[i]) == true){ //Line goes through both a vertex and a side
        var ret_tri1 = [vertex, other, no_l_verts[0]],
            ret_tri2 = [vertex, other, no_l_verts[1]];
        return [ret_tri1, ret_tri2];
      }
    }

    //1.1: Vertex to inside of triangle - Right now just returns 3 triangles, all sharing the inner point as a vertex.
    /******* TO CHANGE ********/
    var ret_tri1 = [other, triVerts[0], triVerts[1]],
        ret_tri2 = [other, triVerts[1], triVerts[2]],
        ret_tri3 = [other, triVerts[2], triVerts[0]];
    return [ret_tri1, ret_tri2, ret_tri3];

  }
  //Case 2: 5 unique vertices
  else{
    var points_on_line = []; //Helps us figure out if one or both of our line points lie on the triangle sides.
    var triside_to_one = []; //Will help us figure out which "side" of the line contains 1 tri-vertex vs. two
    for(var i = 0; i < 2; i++){
      for(var k = 0; k < 3; k++){
        if(pointOnLine(lineVerts[i], trisides[k]) == true){
          points_on_line.push(lineVerts[i]);
          triside_to_one.push(trisides[k]);
          break;
        }
      }
    }
    //2.0: Side to side
    if(points_on_line.length == 2){
      //Find the vertex on the 1 vertex side of the line.
      //triside_to_one = [[[a,b,c],[e,f,g]] , [[h,i,j], [a,b,c]] ]
      triside_to_one = triside_to_one[0].concat(triside_to_one[1]);
      triside_to_one = triside_to_one.sort();
      var vertex_one;
      var vertex_two = [];
      if(removeRepeats([triside_to_one[0], triside_to_one[1]]).length == 1){
        vertex_one = triside_to_one[0];
        vertex_two.push(triside_to_one[2]);
        vertex_two.push(triside_to_one[3]);
      }
      else if(removeRepeats([triside_to_one[1], triside_to_one[2]]).length == 1){
        vertex_one = triside_to_one[2];
        vertex_two.push(triside_to_one[0]);
        vertex_two.push(triside_to_one[3]);
      }
      else if(removeRepeats([triside_to_one[2], triside_to_one[3]]).length == 1){
        vertex_one = triside_to_one[2];
        vertex_two.push(triside_to_one[0]);
        vertex_two.push(triside_to_one[1]);
      }

      var ret_tri1 = [vertex_one, points_on_line[0], points_on_line[1]],
          ret_tri2 = [vertex_two[0], points_on_line[0], points_on_line[1]],
          ret_tri3 = [vertex_two[0], vertex_two[1], points_on_line[0]];
      //Need to dermine which of the line points is closest to vertex_two[1]
      if(pointToPointDist(vertex_two[1], points_on_line[1]) < pointToPointDist(vertex_two[1], points_on_line[0])){
        ret_tri3 = [vertex_two[0], vertex_two[1], points_on_line[1]];
      }
      return[ret_tri1, ret_tri2, ret_tri3];
    }
    //2.1: Side to inside triangle -  Currently partitions into 4 triangles
    /******** TO CHANGE ********/
    else{
      var inner_vertex = lineVerts[0];
      if(removeRepeats([inner_vertex, points_on_line[0]]).length == 1){
        inner_vertex = lineVerts[1];
      }
      var ret_tri1 = [inner_vertex, points_on_line[0], triVerts[0]],
          ret_tri2 = [inner_vertex, triVerts[0], triVerts[1]],
          ret_tri3 = [inner_vertex, triVerts[1], triVerts[2]],
          ret_tri4 = [inner_vertex, triVerts[2], points_on_line[0]];

      return [ret_tri1, ret_tri2, ret_tri3, ret_tri4];
    }
  }
}
/**
* Line-Triangle intersection
* Takes an array of triangle vertices and an array of line vertices.
* Calculates if the line intersects any side or sides of the triangle.
* Returns an array of intersection points if an intersection exists.
* If not, returns empty array.
* Note: Assumes that line and triangle are coplanar.
*/
function lineTriInt(triVerts, lineVerts){  //triVerts=[[a,b,c],[e,f,g],[h,i,j]] lineVerts = [[k,l,m],[n,o,p]]
  var triside1 = [triVerts[0], triVerts[1]];
  var triside2 = [triVerts[1], triVerts[2]];
  var triside3 = [triVerts[2], triVerts[0]];

  var trisides = [triside1, triside2, triside3]; //[[[a,b,c],[e,f,g]],[[e,f,g],[h,i,j]],[[h,i,j],[a,b,c]]]
  var a1 = lineVerts[0][0],  //Line is AB
      a2 = lineVerts[0][1],
      a3 = lineVerts[0][2];
  var b1 = lineVerts[1][0],
      b2 = lineVerts[1][1],
      b3 = lineVerts[1][2];

  var intersection_points = [];

  for(var i = 0; i < 3; i++){
    var c1 = trisides[i][0][0],  //Triangle side is CD
        c2 = trisides[i][0][1],
        c3 = trisides[i][0][2];
    var d1 = trisides[i][1][0],
        d2 = trisides[i][1][1],
        d3 = trisides[i][1][2];

    var A = [
      [ (d1-c1).toFixed(4) , -(b1 - a1).toFixed(4)],
      [ (d2-c2).toFixed(4) , -(b2 - a2).toFixed(4)]
    ];

    var b = [
      (a1-c1).toFixed(4) ,
      (a2-c2).toFixed(4)
    ];

    var x = numeric.solve(A,b);  //Thank goodness for numeric.
    var s = x[0],
        t = x[1];

    if( (d3 - c3)*s - (b3 - a3)*t === a3-c3){
      var p_x = a1 + (b1-a1)*t,
          p_y = a2 + (b2-a2)*t,
          p_z = a3 + (b3-a3)*t;
      var point = [p_x, p_y, p_z];
      //Check that point is not already in intersection_points
      var in_flag = false;
      for(var k = 0; k<intersection_points.length;k++){
        if(intersection_points[k][0] == point[0] && intersection_points[k][1] == point[1] && intersection_points[k][2] == point[2]){
          in_flag = true;
        }
      }
      if(in_flag == false && pointOnLine(point, lineVerts) == true){
        intersection_points.push(point);
      }
    }
  }
  return intersection_points
}
/**
* Point in Triangle Region
* Takes a point and an array of vertices of a triangle.
* Returns true if the point lies within the same plane and region of the trangle's interior
* Return false otherwise
* Note: This function also returns true if the point is on any of the triangle edges.
*       Also assumes point and triangle are coplanar.
*/
/******* NEED TO CLEAN UP MEMORY **********/
function pointInTriangleRegion(point, triVerts){
  var vec1 = numeric.sub(triVerts[1],triVerts[0]);
  var vec2 = numeric.sub(triVerts[2],triVerts[1]);
  //Get normal of plane defined by triVerts
  var normal = [vec1[1] * vec2[2] - vec1[2] * vec2[1], vec1[2] * vec2[0] - vec1[0] * vec2[2],vec1[0] * vec2[1] - vec1[1] * vec2[0]];
  var normal_vec = new THREE.Vector3(normal[0], normal[1], normal[2]);
  normal_vec.normalize();
  //We want to check if the ray passes through the triangle face, origin point is our point
  var ray = new THREE.Ray(new THREE.Vector3(point[0],point[1],point[2]), normal_vec);
  var tri_v_1 = new THREE.Vector3(triVerts[0][0], triVerts[0][1], triVerts[0][2]),
      tri_v_2 = new THREE.Vector3(triVerts[1][0], triVerts[1][1], triVerts[1][2]),
      tri_v_3 = new THREE.Vector3(triVerts[2][0], triVerts[2][1], triVerts[2][2]);
  var new_vec = ray.intersectTriangle(tri_v_1, tri_v_2, tri_v_3, false, null);
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
* Takes two points and calculates the distance
* between them. Returns distance
*/
function pointToPointDist(point1, point2){
  var x1 = point1[0],
      y1 = point1[1],
      z1 = point1[2];
  var x2 = point2[0],
      y2 = point2[1],
      z2 = point2[2];
  var dist = Math.abs(Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2) + Math.pow((z2-z1),2)));
  return dist;
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

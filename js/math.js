/**
* Line-Triangle intersection
* Takes an array of triangle vertices and an array of line vertices.
* Calculates if the line intersects any side or sides of the triangle.
* Returns an array of intersection points if an intersection exists.
* If not, returns empty array.
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
      [ d1-c1 , -(b1 - a1) ],
      [ d2-c2 , -(b2 - a2) ]
    ];

    var b = [
      a1-c1,
      a2-c2
    ];

    var x = numeric.solve(A,b);  //Thank goodness for numeric.
    var s = x[0],
        t = x[1];

    if( (d3 - c3)*s - (b3 - a3)*t === a3-c3){
      var p_x = a1 + (b1-a1)*t,
          p_y = a2 + (b2-a2)*t,
          p_z = a3 + (b3-a3)*t;
      var point = [p_x, p_y, p_z];
      intersection_points.push(point);
    }
  }
  return intersection_points
}

/**
* Triangle re-mesh
* If a line intersects a triangle/face, calculates repartitioning
* of face to maintain all triangular sub-components.
* Takes an array of triangle vertices and the intersecting line's vertices.
* Return an array of size-3 arrays of newly calculated triangle vertices.
*/
function triRemesh(triVerts, lineVerts){ //triVerts=[[a,b,c],[e,f,g],[h,i,j]] lineVerts = [[k,l,m],[n,o,p]]
  /*var triside1 = [triVerts[0], triVerts[1]];
  var triside2 = [triVerts[1], triVerts[2]];
  var triside3 = [triVerts[2], triVerts[0]];*/

  var trisides = [triside1, triside2, triside3]; //[[[a,b,c],[e,f,g]],[[e,f,g],[h,i,j]],[[h,i,j],[a,b,c]]]
  var a1 = lineVerts[0][0],  //Line is AB
      a2 = lineVerts[0][1],
      a3 = lineVerts[0][2];
  var b1 = lineVerts[1][0],
      b2 = lineVerts[1][1],
      b3 = lineVerts[1][2];

  var point_arr = removeRepeats(lineVerts.concat(trisides[i]))
  //Case 1: 1 point of intersection (4 unique vertices)
  if(point_arr.length == 4){
    var vertex = lineVerts[0];
    var other = lineVerts[1];
    var no_l_verts = [];
    //Determine which of the line points is also a triangle vertex point, and which triangle points aren't
    for(var i = 0; i < 3; i++){
      if(removeRepeats([triVerts[i],lineVerts[1]]).length == 1){
        vertex = lineVerts[1];
        other = lineVerts[2];
      }
      else{
        no_l_verts.push(triVerts[i]);
      }
    }

    //1.0: Vertex to side
    for(var i = 0; i < 3 ; i++){
      if(pointOnLine(other,trisides[i]) == true){ //Line goes through both a vertex and a side
        var ret_tri1 = [[vertex],[other],[no_l_verts[0]]],
            ret_tri2 = [[vertex],[other],[no_l_verts[1]]];
        return [ret_tri1, ret_tri2];
      }
    }
    //1.1: Vertex to inside of triangle - how to handle?
  }
  //Case 2: 5 unique vertices
  else{
    var points_on_line = []; //Helps us figure out if one or both of our line points lie on the triangle sides.
    for(var i = 0; i < 2; i++){
      for(var k = 0; k < 3; k++){
        if(pointOnLine(lineVerts[i], trisides[k]) == true){
          points_on_line.push(lineVerts[i]);
          break;
        }
      }
    }
    //2.0: Side to side
    if(points_on_line.length == 2){

    }
    //2.1: Side to inside triangle


  }
}

/** Remove Repeats
* Quick and dirty way to remove any duplicate points in a point array.
* Takes point array, returns cleaned array.
*/
function removeRepeats(points) {
  dictionaries_are_beautiful_things={}; //especially when you don't know jquery
  for (var i=0;i<points.length;i++) {
    dictionaries_are_beautiful_things[points[i]]=0;
  }
  return Object.keys(dictionaries_are_beautiful_things);
}
/* Take point and array of line endpoints.
* Returns true if point is on the line, else false. */
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
  var dist = mag_cross/mag_l_dir_vec;
  return dist == 0;
}

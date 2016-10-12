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
function triRemesh(triVerts, lineVerts){

}

  //line from vertex to side
  //consider if line does not fully intersect triangle.

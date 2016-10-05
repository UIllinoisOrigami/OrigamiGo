/**
* Line-Triangle interesection
* Takes an array of triangle vertices and an array of line vertices.
* Calculates if the line intersects any side or sides of the triangle.
* Returns an array of intersection points if an intersection exists.
* If not, returns null. Also returns null if line == some side of the triangle.
*/
function lineTriInt(triVerts, lineVerts){
  triside1 = [triVerts[0], triVerts[1]];
  triside2 = [triVerts[1], triVerts[2]];
  triside3 = [triVerts[2], triVerts[0]];

  //line is the same
  //line is paralell to any side and outside of the triangle

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

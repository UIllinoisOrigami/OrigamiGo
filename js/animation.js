
function performFold(){
    //var paperGeometry = scene.getObjectByName("mesh").geometry;
  if(scene.getObjectByName("foldLine"))
    {
      var foldingLine = scene.getObjectByName("foldLine");
      foldingLine.name = "visualFoldLine";
      foldingLine.material.color.setHex(0x000000);
      foldingLine.visible=false;


      var possibleCollisions = uGrid.retrieveF(foldingLine.geometry.vertices);
      triRemesh(possibleCollisions, foldingLine);

      //reform grid after remeshing
      uGrid.clear();
      for( var i = 0; i< paperGeometry.faces.length; i++)
      {
          var triangle = [
              paperGeometry.vertices[paperGeometry.faces[i].a],
              paperGeometry.vertices[paperGeometry.faces[i].b],
              paperGeometry.vertices[paperGeometry.faces[i].c]
          ]
          uGrid.add(triangle, paperGeometry.faces[i]);
      }

      var objToRotate = uGrid.getObjToRotate(downPoint,foldingLine.geometry.vertices);
      //Object3D.rotateOnAxis( axis, angle );

      //performfold on all mesh, visualFoldLines, and boarderLines.
      //boarderLines and mesh need to be rotated 180deg around the foldingLine.
      //visualFoldLines need to have the end point moved to the interesection of the foldingLine and the visualFoldLine if they cross. might be tricky to find witch point is the end point. it is the point clossest to the foldingLine.

      //to do this we need collision detection.
    }
}

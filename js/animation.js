function performFold(){
    if(scene.getObjectByName("foldLine"))
    {
      var foldingLine = scene.getObjectByName("foldLine");
      foldingLine.name = "visualFoldLine";
      foldingLine.material.color.setHex(0x000000);
      foldingLine.visible=false; 
        
      var test = uGrid.retrieveF(foldingLine.geometry.vertices);
      //performfold on all mesh, visualFoldLines, and boarderLines.
      //boarderLines and mesh need to be rotated 180deg around the foldingLine.
      //visualFoldLines need to have the end point moved to the interesection of the foldingLine and the visualFoldLine if they cross. might be tricky to find witch point is the end point. it is the point clossest to the foldingLine.
      
      //to do this we need collision detection.
    }
}
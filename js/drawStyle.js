function checkDrawStyle(){
  if (document.getElementById('normal').checked) {
    scene.traverse( function(child){
      if( child instanceof THREE.Mesh && child.name=="mesh")
        child.material.wireframe= false;
      else if(child instanceof THREE.Line && child.name=="visualFoldLine")
          child.visible=false;
      else if(child instanceof THREE.Mesh && child.name=="borders")
        child.visible=false;
    });
  }
  else if (document.getElementById('borders').checked) {
     scene.traverse( function(child){
      if( child instanceof THREE.Mesh && child.name=="mesh")
        child.material.wireframe= false;
      else if(child instanceof THREE.Line && child.name=="visualFoldLine")
        child.visible=false;
      else if(child instanceof THREE.Mesh && child.name=="borders")
        child.visible=true;
    });    
  }
  else if (document.getElementById('wireframe').checked) {
    scene.traverse( function(child){
      if(child instanceof THREE.Mesh && child.name=="mesh")
        child.material.wireframe= true;
      else if(child instanceof THREE.Line && child.name=="visualFoldLine")
          child.visible=false;
      else if(child instanceof THREE.Mesh && child.name=="borders")
        child.visible=false;
    });
  }
  else if (document.getElementById('foldLines').checked) {
     scene.traverse( function(child){
      if( child instanceof THREE.Mesh && child.name=="mesh")
        child.material.wireframe= false;
      else if(child instanceof THREE.Line && child.name=="visualFoldLine")
        child.visible=true;
      else if(child instanceof THREE.Mesh && child.name=="borders")
        child.visible=false;
    });    
  }
}

//this function is to make a lot of geometry for testing. it will not be used in the real application. it is hear because this file has a lot of space.
function terrainFromIteration(n, minX,maxX,minY,maxY, vertexArray, faceArray)
{
    var deltaX=(maxX-minX)/n;
    var deltaY=(maxY-minY)/n;
    for(var i=0;i<=n;i++)
       for(var j=0;j<=n;j++)
       {           
           vertexArray.push(new THREE.Vector3(minX+deltaX*j,minY+deltaY*i,0.0));
       }

    var numT=0;
    for(var i=0;i<n;i++)
       for(var j=0;j<n;j++)
       {
           var vid = i*(n+1) + j;
           faceArray.push(new THREE.Face3(vid,vid+1,vid+n+1));
           faceArray.push(new THREE.Face3(vid+1,vid+1+n+1,vid+n+1));
           numT+=2 ;
       }
}
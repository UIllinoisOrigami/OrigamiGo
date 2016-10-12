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
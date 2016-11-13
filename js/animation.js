
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

      var objToRotate = uGrid.getObjToRotate(downPoint,foldingLine.geometry.vertices,paperGeometry.vertices);
    
      //split the mesh into 2 pieces so we can fold one of them
      removeFoldingFaces(objToRotate[0]);  
      createFoldingObject(objToRotate[0]);
      foldFoldingObject(foldingLine.geometry.vertices);

        
      //Object3D.rotateOnAxis( axis, angle );

      //performfold on all mesh, visualFoldLines, and boarderLines.
      //boarderLines and mesh need to be rotated 180deg around the foldingLine.
      //visualFoldLines need to have the end point moved to the interesection of the foldingLine and the visualFoldLine if they cross. might be tricky to find witch point is the end point. it is the point clossest to the foldingLine.

      //to do this we need collision detection.
    }
}

//removes the faces for that we are folding form the main object. needs some work.
function removeFoldingFaces(facesToRemove)
{
      for(var i =0; i<paperGeometry.faces.length; i++)
      {
         for(var j =0; j<paperGeometry.faces.length; j++)
         {
              if(paperGeometry.faces[i  ]==facesToRemove[j  ])
              {
                  paperGeometry.faces.splice(i,1);
                  i-=3;
                  break;
              }
         }
      }
      paperGeometry.verticesNeedUpdate=true;  
}

function createFoldingObject(facestoAdd)
{
    var FoldGeometry = new THREE.Geometry();
    for(var i =0; i<facestoAdd.length; i++)
    {
        var v1 = paperGeometry.vertices[facestoAdd[i].a];
        var v2 = paperGeometry.vertices[facestoAdd[i].b];
        var v3 = paperGeometry.vertices[facestoAdd[i].c];

        FoldGeometry.vertices.push(
          new THREE.Vector3(v1.x, v1.y, v1.z),
          new THREE.Vector3(v2.x, v2.y, v2.z),
          new THREE.Vector3(v3.x, v3.y, v3.z)
        );

        var faceIndex = i*3;
        FoldGeometry.faces.push(
        new THREE.Face3( faceIndex, faceIndex+1, faceIndex+2 ));
    }


	var materiala = new THREE.MeshBasicMaterial({color: 0xc05c5c, side: THREE.DoubleSide});
	var FoldObject = new THREE.Mesh(FoldGeometry, materiala);
	FoldObject.name = "FoldObject";

	scene.add(FoldObject);
}

function foldFoldingObject(line)
{
    var fv1 = line[0];
    var fv2 = line[1];
    fv1 = new THREE.Vector3(fv1.x,fv1.y,fv1.z);
    fv2 = new THREE.Vector3(fv2.x,fv2.y,fv2.z);
    var FoldObject = scene.getObjectByName("FoldObject")

    var axis = fv1.sub(fv2);
    axis.normalize();

    var quaternion = new THREE.Quaternion().setFromAxisAngle( axis, 180*Math.PI/180 );
    //FoldObject.quaternion= quaternion ;
    //FoldObject.setRotationFromQuaternion(quaternion);

    //perform the rotation. translate to 0,0 1st and then back to location.
    FoldObject.geometry.translate(-fv2.x,-fv2.y,0);
    FoldObject.setRotationFromQuaternion(quaternion);
    FoldObject.position.x = fv2.x;
    FoldObject.position.y = fv2.y;
    FoldObject.position.z = fv2.z+0.1;


    //update objects geometry with the transformation
    FoldObject.updateMatrix();
    FoldObject.geometry.applyMatrix( FoldObject.matrix );

    //reset the objects transformations
    FoldObject.position.set( 0, 0, 0 );
    FoldObject.rotation.set( 0, 0, 0 );
    FoldObject.scale.set( 1, 1, 1 );
    FoldObject.updateMatrix();
}
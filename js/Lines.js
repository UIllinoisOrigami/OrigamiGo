function onMouseUp(event)
{
  if(controls.enabled ==false)
  {
      if(scene.getObjectByName("foldLine"))
        scene.remove(scene.getObjectByName("foldLine"));

      var geometry = new THREE.Geometry();
      var upPoint = get3dPointZAxis(event);

      /*var xScale = upPoint.x-downPoint.x;
      var yScale = upPoint.y-downPoint.y;

      while(upPoint.x<10 && upPoint.x>-10 &&
            upPoint.y<10 && upPoint.y>-10)
      {
        upPoint.x+=xScale;
        upPoint.y+=yScale;
      }
      while(downPoint.x<10 && downPoint.x>-10 &&
            downPoint.y<10 && downPoint.y>-10)
      {
        downPoint.x-=xScale;
        downPoint.y-=yScale;
      }*/
      if(camera.position.z>0)
      {
        upPoint.z = 0.1;
        downPoint.z = 0.1;
      }
      else
      {
        upPoint.z = -0.1;
        downPoint.z = -0.1;
      }
      //Make life easier by setting reasonable points
      reasonablePoints(upPoint);
      reasonablePoints(downPoint);

      //the special line that is actually a triangle strip lets use set the width so we can see it... it also is not fun to work with. this is how we get the vertices out of the geometry.
      var borders = scene.getObjectByName("borders")
      var intersections = [];
      for(var j=0; j<borders.geometry.attributes.position.array.length-6; j+=6)
      {
        var boarderLine = new THREE.Geometry();
        boarderLine.vertices.push( new THREE.Vector3(borders.geometry.attributes.position.array[j],
                      borders.geometry.attributes.position.array[j+1],
                      borders.geometry.attributes.position.array[j+2]));
        boarderLine.vertices.push( new THREE.Vector3(borders.geometry.attributes.position.array[j+6],
                      borders.geometry.attributes.position.array[j+7],
                      borders.geometry.attributes.position.array[j+8]));
        //console.log(line_intersect(upPoint,downPoint,boarderLine))
        intersections.push(line_intersect(upPoint,downPoint,boarderLine));
      }

      var maxX=-100, minX=100;
      for(var i=0; i<intersections.length;i++)
      {
         if(intersections[i]!==null && maxX !== Math.max(maxX,intersections[i].x))
         {
               maxX=intersections[i].x;
               upPoint.x = intersections[i].x;
               upPoint.y = intersections[i].y;
         }
         if(intersections[i]!==null && minX !== Math.min(minX,intersections[i].x))
         {
             minX=intersections[i].x;
             downPoint.x = intersections[i].x;
             downPoint.y = intersections[i].y;
         }
      }

      geometry.vertices.push(downPoint);
      geometry.vertices.push(upPoint);
      var material = new THREE.LineBasicMaterial({color: 0x008080});
      var foldLine = new THREE.Line(geometry, material);
      foldLine.name = "foldLine";

      scene.add(foldLine);

      document.getElementsByName("downPointX")[0].value =downPoint.x;
      document.getElementsByName("downPointY")[0].value =downPoint.y;

      document.getElementsByName("upPointX")[0].value =upPoint.x;
      document.getElementsByName("upPointY")[0].value =upPoint.y;

  }

}
function onInputChange(event) //This keeps changing the points once you click outside of the input boxes.
{
  var downPoint=new THREE.Vector3, upPoint=new THREE.Vector3;

  downPoint.x = parseFloat(document.getElementsByName("downPointX")[0].value);
  downPoint.y = parseFloat(document.getElementsByName("downPointY")[0].value);

  upPoint.x = parseFloat(document.getElementsByName("upPointX")[0].value);
  upPoint.y = parseFloat(document.getElementsByName("upPointY")[0].value);

  if(camera.position.z>0)
  {
    upPoint.z = 0.1;
    downPoint.z = 0.1;
  }
  else
  {
    upPoint.z = -0.1;
    downPoint.z = -0.1;
  }

  if(scene.getObjectByName("foldLine"))
  {
      var line = scene.getObjectByName("foldLine");
      line.geometry.vertices[0]=upPoint;
      line.geometry.vertices[1]=downPoint;

      line.geometry.dynamic = true;
      line.geometry.verticesNeedUpdate = true;
  }

}
function get3dPointZAxis(event)
{
    //TO DO: project on to plane perpendiculare to the camrea not just the plan z=0
    var vector = new THREE.Vector3();
    tableHieght = document.getElementById("tableId").clientHeight;
    vector.set(
        ( event.clientX / window.innerWidth ) * 2 - 1,
        - ( (event.clientY-tableHieght) / (window.innerHeight) ) * 2 + 1,
         0.5);

    vector.unproject( camera );
    var dir = vector.sub( camera.position ).normalize();
    var distance = - camera.position.z / dir.z;
    var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );

    return pos;
}

function line_intersect(up, down, line)
{
    var x1 = up.x;
    var x2 = down.x;
    var x3 = line.vertices[0].x;
    var x4 = line.vertices[1].x;

    var y1 = up.y;
    var y2 = down.y;
    var y3 = line.vertices[0].y;
    var y4 = line.vertices[1].y;

    var z = line.vertices[0].z

    var ua, ub, denom = (y4 - y3)*(x2 - x1) - (x4 - x3)*(y2 - y1);
    if (denom == 0) {
        return null;
    }
    ua = ((x4 - x3)*(y1 - y3) - (y4 - y3)*(x1 - x3))/denom;
    ub = ((x2 - x1)*(y1 - y3) - (y2 - y1)*(x1 - x3))/denom;
    if(ub<0||ub>1)
    {
        return null;
    }
    return new THREE.Vector3(x1 + ua*(x2 - x1),y1 + ua*(y2 - y1),z);
}
function reasonablePoints(point){
  if(point.x > -10 && point.x < 10){
    point.x = 5*Math.round(Math.trunc(point.x * 100)/5)/100;
  }
  if(point.x < -10){
    point.x = -10;
  }
  if(point.x > 10){
    point.x = 10;
  }
  if(point.y > -10 && point.y < 10){
    point.y = 5*Math.round(Math.trunc(point.y * 100)/5)/100;
  }
  if(point.y < -10){
    point.y = -10;
  }
  if(point.y > 10){
    point.y = 10;
  }

}

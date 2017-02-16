//global origami variable
var origami;

function createOrigami(json) {
	clearScene();
	origami = new Origami(json["name"]);
	var step;
	var actions = '';
	var actionArray = [];
	var action;
	for(var i = 0; i < json["steps"].length; i++){
		step = json["steps"][i];
		if(step["actions"] != null){
			for(var j = 0; j < step["actions"].length; j++){
				if(step["actions"][j] != null){
					actions += 'function() {';
					for(var k = 0; k < step["actions"][j].length; k++){
						action = step["actions"][j][k];
						if(action["action"] == "removeFromScene()"){
							actions += 'origami.removeFromScene();\n';
						}
						if(action["action"] == "addToScene()"){
							actions += 'origami.addToScene();\n';
						}
						if(action["action"] == "setShape()"){
							var vectorArray = [];
							var faces = [];
							var colors = [];
							for(var m = 0; m < action["vectorArray"].length; m++){
								var coordinates = action["vectorArray"][m];
								vectorArray.push([coordinates[0], coordinates[1], coordinates[2]]);
							}
							for(var n = 0; n < action["faces"].length; n++){
								var vertex = action["faces"][n];
								faces.push([vertex[0], vertex[1], vertex[2]]);
							}
							for(var p = 0; p < action["faces"].length; p++){
								var color = action["colors"][p];
								colors.push([color[0], color[1], color[2]]);
							}
							actions += 'origami.setShape('+JSON.stringify(vectorArray)+','+JSON.stringify(faces)+','+JSON.stringify(colors)+','+JSON.stringify(action['side'])+','+action['zAxis']+');\n';
						}	
						if(action["action"] == "rotation()"){
							actions += 'origami.rotation('+JSON.stringify(action['axis'])+','+degToRad(action['angle'])+');\n';
						}
						if(action["action"] == "oneFold()"){
							actions += 'var src ='+ action["src"]+';\nvar dest = '+JSON.stringify(action["dest"])+';\n var type = '+JSON.stringify(action["animationType"])+';\n var source = origami.squareMesh.geometry.vertices[src];var destination;';
							actions += 'if(typeof dest == "number"){ destination = origami.squareMesh.geometry.vertices[dest];}';
							actions+= 'else {destination =  new THREE.Vector3(dest[0] , dest[1] , dest[2]);}var height = distance(source.x,destination.x,source.y,destination.y)/2;var i = 0;var multipliers = getMultipliers(source, destination, height);';
							actions += 'origami.oneFold(source, destination, height,multipliers,i,type);';
						}
					}	
					if(j == step["actions"][j].length - 1){
						actions += '}';	
						actions = JSON.stringify(actions);
						actions = JSON.parse(actions);
						actionArray.push(actions);
					}
					else {
						actions += '}';
						actions = JSON.stringify(actions);
						actions = JSON.parse(actions);
						actionArray.push(actions);
					}
				}
				actions = '';
			}
		}
		origami.addSteps(new Step(step["instruction"], actionArray));
		actionArray = [];
	}
			
	origami.animateOrigami();

	return origami;
}
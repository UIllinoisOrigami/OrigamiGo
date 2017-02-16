/**
 * @author mwakaba2
 */

// Helper functions
function degToRad(d) {
  return d * Math.PI / 180;
}

function distance(x1, x2, y1, y2){
	var distance = Math.sqrt( Math.pow((x2-x1), 2 ) + Math.pow((y2-y1), 2 ));
	return distance;
}

function getMultipliers(src, dest, height) {
	var multipliers = [];
	var z = (height * 2);
	var x = Math.abs(src.x - dest.x);
	var y = Math.abs(src.y - dest.y);
	var smallest = nonZeroMin(x, y, z);
	x = x/smallest;
	y = y/smallest;
	z = z/smallest;
	multipliers.push(x,y,z);
	return multipliers;
}

function nonZeroMin(){
  var args = Array.prototype.slice.call(arguments);
  args.sort(function(a, b){
      if(a === null || isNaN(a) || a === 0) return 1;
      if(b === null || isNaN(b) || b === 0) return -1
      return a-b;
  });
  return args[0];
}

function negativeToPositive(src, dest, axis){
	switch (axis) {
		case 'x':
			return ( src.x < dest.x );
			break;
		case 'y':
			return ( src.y < dest.y );
			break;
		case 'z':
			return ( src.z < dest.z );
			break;
	}
}

function convertColor(colors){
	var array = [];
	for(var i = 0; i < colors.length; i++){
		array.push(colors[i] / 255);
	}
	return array;
}

function timer(x, i){
	if(x.length > 0){
		if(typeof x[i] == "function"){
			x[i]();
		}	else {
			var func = eval('['+x[i]+']')[0];
			func();
		}
	}
  if (i < x.length - 1) {
    setTimeout(function () {
      timer(x, i + 1);
    }, 1000);
  }
}
// Best Object Creation Pattern: Combination Constructor/Prototype Pattern
Step = function( theInstruction, theActionArray ) {
	this.instruction = theInstruction;
	this.actionArray = theActionArray;
}

Step.prototype = {
	constructor: Step
};

Origami = function ( theName ) {
	this.name = theName;
	this.counter = 0;	
	this.steps = [];
	this.squareMesh;
	this.addSteps = function(step){
		this.steps.push(step);
	}
}

Origami.prototype = {
	constructor: Origami,
	setShape: function (vectorArray, faces, colors, sideType, zAxis) {
		var theGeometry;
		var face;
		var squareGeometry = new THREE.Geometry();
		squareGeometry.verticesNeedUpdate = true;
		squareGeometry.colorsNeedUpdate = true;
		squareGeometry.dynamic = true;
		for(var i = 0; i < vectorArray.length; i ++){
			var vector = vectorArray[i];
			squareGeometry.vertices.push(new THREE.Vector3(vector[0], vector[1], vector[2]));
		}
		for(var i = 0; i < faces.length; i ++){
			var f = faces[i];
			squareGeometry.faces.push(new THREE.Face3(f[0], f[1], f[2]));
			face = squareGeometry.faces[i];
			color = convertColor(colors[i]);
			face.color.setRGB(color[0], color[1], color[2]);
		}

		// Using wireframe materials to illustrate shape details.
		if(sideType === "double"){
			var baseMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, 
																													side: THREE.DoubleSide}); 
		} else {
			//no specification
			var baseMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors }); 
		}
		
		theGeometry = new THREE.Mesh(squareGeometry, baseMaterial);
		theGeometry.position.set(0, 20, 0);
	
		if(zAxis){
			theGeometry.rotateZ(degToRad(zAxis))
		}
		this.squareMesh = theGeometry;
	},
	addToScene: function() {
		scene.add(this.squareMesh);
	},
	removeFromScene: function() {
		scene.remove(this.squareMesh);
	},
	rotation: function(rotationType, angle) {
		var self = this;
		switch (rotationType) {
			case 'x': 
				if(this.squareMesh.rotation.x < angle){
					this.squareMesh.rotation.x += .05;
					requestAnimationFrame( function() {
						self.rotation(rotationType, angle);
					});
				}
				break;
			case 'y':
				if(this.squareMesh.rotation.y < angle){
					this.squareMesh.rotation.y += .05;
					requestAnimationFrame( function() {
						self.rotation(rotationType, angle);
					});
				}
				break;
			case 'z':
				if(this.squareMesh.rotation.z < angle){
					this.squareMesh.rotation.z += .05;
					requestAnimationFrame( function() {
						self.rotation(rotationType, angle);
					});
				}		
				break;
		}
	},
	oneFold: function(src, dest, height, multipliers, counter, animationType) {
		var self = this;
		negativeToPositive(src, dest, "x") ? src.x += multipliers[0] : src.x -= multipliers[0];

		negativeToPositive(src, dest, "y") ? src.y += multipliers[1] : src.y -= multipliers[1];

		if(animationType == "forward"){
			if( counter < height ) {
				src.z += multipliers[2];
				counter += multipliers[2];
			} else {
				src.z -= multipliers[2];
				counter += multipliers[2];
			} 
		} else {
			if( counter < height ) {
				src.z -= multipliers[2];
				counter += multipliers[2];
			} else {
				src.z += multipliers[2];
				counter += multipliers[2];
			} 
		}

		if( Math.round(counter) == Math.round(height * 2)) {
			if(dest.z >= 0 && animationType == "forward"){
				src.z = dest.z + 1;
			} else if (dest.z <= 0 && animationType == "backward"){
				src.z = dest.z - 1;
			} else {
				src.z = dest.z;
			}
		}

		if( counter < height * 2 ){
			this.squareMesh.geometry.verticesNeedUpdate = true;
			render();
			requestAnimationFrame( function() {
				self.oneFold(src, dest, height, multipliers, counter, animationType);
			});
	  }
	},
	animateOrigami: function (){
		$('#next').attr("disabled", true);
		var offset = 0;
		this.steps.map( function(step, index){
			setTimeout(function (){
				$('#instruction').html("Step "+(parseInt(index)+1)+": "+step.instruction);
				timer(step.actionArray, 0);
			}, 100 + offset);
			offset += 3000;
		});
	},
	nextStep: function () {
		if(this.counter < this.steps.length){
			var step = this.steps[this.counter];
			$('#instruction').html("Step "+(this.counter+1)+": "+step.instruction);
			timer(step.actionArray, 0);
			this.counter ++;
		}
		if(this.counter == this.steps.length - 1){
			$('#next').html("Again");	
			this.counter = 0;
		}
	}
}

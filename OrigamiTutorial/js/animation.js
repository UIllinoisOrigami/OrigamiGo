$(document).ready(function(){
	var $carousel = $(".carousel");
	var images = [];
	var vectorArray, vectorArray1, vectorArray2, vectorArray3, vectorArray4, faces, colors;
	function disableButton () {
		$('#next').prop("disabled", true);	
		$('#next').addClass("disabled");
		setTimeout(function() {
			$('#next').removeClass("disabled");
			$('#next').prop("disabled", false);	
		}, 3000);
	}

	function appendImages() {
    var $images = $(".carousel img");
    $images.remove();
    for (var i = 0; i < images.length; i++) {
      var $image = $("<img>");
      $image.attr("src", images[i]);
      $image.css({
          "width": "100%",
          "height": "250px",
          "position": "absolute"
      });
      if (i > 0) {
          $image.css("left", "100%");
      }
      $carousel.append($image);
    }
	}

	function complete() {
	    var img = images.shift();
	    images.push(img);
	    appendImages();     
	}

	function slide() {
	    var $images = $(".carousel img");
	    $images.eq(0).animate({
	        "left": "-100%"
	    }, 1000);

	    $images.eq(1).animate({
	        "left": "0%"
	    }, 1000, complete);
	}

	var asec = 1000; 
	var rt2 = Math.sqrt(2);

	$('#dog').on('click', function(e){
		e.preventDefault();
		var dog = new Origami("Dog");
		clearScene();
		var step;
		step = new Step('Fold in Half', [
			function () {	$('button').prop("disabled", true);
										images = [
											'images/dog/step_1.png',
											'images/dog/step_2.png',
											'images/dog/step_3.png',
											'images/dog/step_4.png',
											'images/dog/step_5.png'
										];
								    appendImages();
    								dog.removeFromScene();
										dog.setShape(
											[
												[-50.0, 50.0, 0.0],
												[50.0,  50.0, 0.0], 
												[50.0,  -50.0, 0.0], 
												[-50.0, -50.0, 0.0]
											],
											[
												[0, 1, 2],
												[0, 2, 3]
											],
											[
												[91, 200,172],
												[230, 215, 42]
											],
											"double",
											45
										);
										dog.addToScene();
									},
			function () { 
				var src = 3;
				var dest = 1;
				var h = distance(
									dog.squareMesh.geometry.vertices[src].x,
									dog.squareMesh.geometry.vertices[dest].x,
									dog.squareMesh.geometry.vertices[src].y,
									dog.squareMesh.geometry.vertices[dest].y
								) / 2;
				var i = 0;
				var animationType = "forward";
				var multipliers = getMultipliers(dog.squareMesh.geometry.vertices[src], dog.squareMesh.geometry.vertices[dest], h);
				dog.oneFold(dog.squareMesh.geometry.vertices[src], dog.squareMesh.geometry.vertices[dest], h, multipliers, i, animationType);
				slide();
			}
		]);
		dog.addSteps(step);

		step = new Step('Rotate', [
			function () {  slide(); dog.rotation("z", degToRad(225)); }
		]);
		dog.addSteps(step);

		step = new Step('Fold the ears down', [
			function () { dog.removeFromScene(); dog.setShape (
					[
						[-50.0*rt2, 0.0, 0.0],
						[-10.0*rt2, 0.0, 0.0], 
						[(-100.0*rt2)/3, (-50.0*rt2)/3, 0.0], 
						[10.0*rt2, 0, 0.0],
						[50.0*rt2, 0.0, 0.0], 
						[(100.0*rt2)/3, (-50.0*rt2)/3, 0.0],
						[-10*rt2, -40*rt2, 0.0],
						[10*rt2, -40*rt2, 0.0],
						[0.0, -50.0*rt2, 0.0]
					],
					[
						//left ear
						[0, 1, 2],
						//right ear
						[3, 4, 5],

						[2, 1, 6],
						[1, 3, 6],
						[3, 7, 6],
						[3, 5, 7],
						//nose 
						[6, 7, 8],
						//Back side
						[2, 6, 1],
						[1, 6, 3],
						[3, 6, 7],
						[3, 7, 5],
						[6, 8, 7]
					],
					[
						// ears
						[155, 79, 15],
						[155, 79, 15],
						//face
						[201, 158, 16],
						[201, 158, 16],
						[201, 158, 16],
						[201, 158, 16],
						//nose
						[155, 79, 15],
						[201, 158, 16],
						[201, 158, 16],
						[201, 158, 16],
						[201, 158, 16],
						//nose
						[155, 79, 15]
					],
					"double"
				); 
				dog.addToScene();	
			},
			function () { 
				src = dog.squareMesh.geometry.vertices[0];
				var src2 = dog.squareMesh.geometry.vertices[4];
				dest = new THREE.Vector3((-80.0)/3, (-2*(80.0))/3 , 3.5);
				var dest2 = new THREE.Vector3((80.0)/3, (-2*(80.0))/3 , 3.5);
				h = distance(
									src.x,
									dest.x,
									src.y,
									dest.y
								) / 2;
				var h2 = distance(
						src2.x,
						dest.x,
						src2.y,
						dest.y
						) / 2;
				multipliers = getMultipliers(src, dest, h);
				var multipliers2 = getMultipliers(src2, dest2, h2);
				var i = j = 0;
				animationType = "forward";

				dog.oneFold(src, dest, h, multipliers, i, animationType);
				dog.oneFold(src2, dest2, h2, multipliers2, j, animationType);
				slide(); 
			}
		]);
		dog.addSteps(step);
		
		step = new Step('Fold in Behind', [
				function() {
					slide();
					animationType = "backward";
					src = 8;
					dest = new THREE.Vector3(0 , -30*rt2 , 0.0);
					h = distance(
										dog.squareMesh.geometry.vertices[src].x,
										dest.x,
										dog.squareMesh.geometry.vertices[src].y,
										dest.y
									) / 2;
					i = 0;
					multipliers = getMultipliers(dog.squareMesh.geometry.vertices[src], dest, h);
					dog.oneFold(dog.squareMesh.geometry.vertices[src], dest, h, multipliers, i, animationType);
					$('button').prop("disabled", false);
				}
			]
		);

		dog.addSteps(step);
		step = new Step("Finished! Its a dog!", [function () {$('#next').attr("disabled", false);}]);

		dog.addSteps(step);
		dog.animateOrigami();
		$('#next').on('click', function(e){
			if($(this).text() == "Start" || $(this).text() == "Again"){
				clearScene();
				$(this).html("Next");
			}
			e.preventDefault();
			disableButton();
			dog.nextStep();
		});
	});

	$('#cup').on('click', function(e){
		e.preventDefault();
		var cup = new Origami("Cup");
		clearScene();
		var step;
		step = new Step('Fold in Half', [
			function() {	
				$('button').prop("disabled", true);
				images = [
					"images/cup/step_1.png",
					"images/cup/step_2.png",
					"images/cup/step_3.png",
					"images/cup/step_4.png",
					"images/cup/step_5.png",
					"images/cup/step_6.png"
				];
		    appendImages();
				cup.removeFromScene();
				cup.setShape(
					[
						[-50.0, 50.0, 0.0],
						[50.0,  50.0, 0.0], 
						[50.0,  -50.0, 0.0], 
						[-50.0, -50.0, 0.0]
					],
					[
						[0, 1, 2],
						[0, 2, 3]
					],
					[
						[91, 200,172],
						[230, 215, 42]
					],
					"double",
					45
				);
				cup.addToScene();
			},
			function(){
				var src = 3;
				var dest = 1;
				var h = distance(
									cup.squareMesh.geometry.vertices[src].x,
									cup.squareMesh.geometry.vertices[dest].x,
									cup.squareMesh.geometry.vertices[src].y,
									cup.squareMesh.geometry.vertices[dest].y
								) / 2;
				var i = 0;
				var animationType = "forward";
				var multipliers = getMultipliers(cup.squareMesh.geometry.vertices[src], cup.squareMesh.geometry.vertices[dest], h);
				cup.oneFold(cup.squareMesh.geometry.vertices[src], cup.squareMesh.geometry.vertices[dest], h, multipliers, i, animationType);
				slide();
			}
		]);

		cup.addSteps(step);

		step = new Step('Fold to the left', [
			function() {
				cup.removeFromScene();
				vectorArray2 = [
						[-50*rt2, 0.0, 0.0],
						[-50*rt2/3, 100*rt2/3, 0.0],
						[-25/rt2, 0.0, 0.0],
						[50*rt2/3, 100*rt2/3, 0.0],
						[50*rt2, 0.0, 0.0],
						[25/rt2, 0.0, 0.0],
						[0.0, 0.0, 0.0],
						[0.0, 50*rt2, 0.0],
						[-50*rt2/3, 100*rt2/3, -1.0],
						[0.0, 50*rt2, -1.0],
						[50*rt2/3, 100*rt2/3, -1.0]
					];
				cup.setShape(
					vectorArray2,
					[
						[0, 1, 2],
						[3, 4, 5],
						[1, 6, 2],
						[1, 3, 6],
						[3, 5, 6],
						[1, 7, 3],
						[8, 9, 10]
					],
					[
						[250, 64, 50],
						[250, 64, 50],
						[250, 175, 8],
						[250, 175, 8],
						[250, 175, 8],
						[254, 243, 242],
						[254, 243, 242]
					],
					"double"
					);
				cup.addToScene();
			},
			function() {
				var src = 4;
				var dest = new THREE.Vector3(-50*rt2/3, 100*rt2/3, 0.0);
				var h = distance(
									cup.squareMesh.geometry.vertices[src].x,
									dest.x,
									cup.squareMesh.geometry.vertices[src].y,
									dest.y
								) / 2;
				var i = 0;
				var animationType = "forward";
				var multipliers = getMultipliers(cup.squareMesh.geometry.vertices[src], dest, h);
				cup.oneFold(cup.squareMesh.geometry.vertices[src], dest, h, multipliers, i, animationType);
				slide();
			}
		]);
		cup.addSteps(step);

		step = new Step('Fold to the right',[
			function() {
				cup.removeFromScene();
				vectorArray3 = vectorArray2;
				vectorArray3.push(
					[-50*rt2/3, 100*rt2/3, -1.0],
					[25/rt2, 0.0, -1.0],
					[-25/rt2, 0.0, -1.0],
					[50*rt2/3, 100*rt2/3, -1.0]
				);
				cup.setShape(	
					vectorArray3,
					[
						[0, 1, 2],
						[1, 3, 5],
						[2, 1, 5],		
						[1, 7, 3],
						[8, 9, 10],
						[11, 12, 13],
						[11, 14, 12]
					],
					[
						[250, 64, 50],
						[250, 64, 50],
						[250, 175, 8],
						[254, 243, 242],
						[254, 243, 242],
						[250, 175, 8],
						[250, 175, 8]
					],
					"double"
				);
				cup.addToScene();
			},
			function() {
				var src = 0;
				var dest = new THREE.Vector3(50*rt2/3, 100*rt2/3, 0.0);
				var h = distance(
									cup.squareMesh.geometry.vertices[src].x,
									dest.x,
									cup.squareMesh.geometry.vertices[src].y,
									dest.y
								) / 2;
				var i = 0;
				var animationType = "forward";
				var multipliers = getMultipliers(cup.squareMesh.geometry.vertices[src], dest, h);
				cup.oneFold(cup.squareMesh.geometry.vertices[src], dest, h, multipliers, i, animationType);
				slide();
			}
		]);
		cup.addSteps(step);

		step = new Step('Fold one flap forward', [
			function() {
				cup.removeFromScene();
				vectorArray4 = vectorArray3;
				vectorArray4.push([0, 100*rt2/7, 0]);
				cup.setShape(
					vectorArray4,
					[
						[1, 15, 2],
						[1, 3, 5],
						[2, 15, 5],
						[1, 7, 3],
						[8, 9, 10],
						[11, 12, 13],
						[11, 14, 12]
					],
					[
						[250, 64, 50],
						[250, 64, 50],
						[250, 175, 8],
						[254, 243, 242],
						[254, 243, 242],
						[250, 175, 8],
						[250, 175, 8]
					],
					"double"
				);
				cup.addToScene();
			},
			function() {
				var src = 7;
				var dest = new THREE.Vector3(0.0, 50*rt2/3, 2.0);
				var h = distance(
									cup.squareMesh.geometry.vertices[src].x,
									dest.x,
									cup.squareMesh.geometry.vertices[src].y,
									dest.y
								) / 2;
				i = 0;
				animationType = "forward";
				var multipliers = getMultipliers(cup.squareMesh.geometry.vertices[src],  dest, h);
				cup.oneFold(cup.squareMesh.geometry.vertices[src], dest, h, multipliers, i,animationType);	
				slide();
			}
		]);
		cup.addSteps(step);
		step = new Step('Fold the back flap backward', [
			function(){
				animationType = "backward";
				var src = 9;
				var dest = new THREE.Vector3(0.0, 50*rt2/3, -3.0);
				var h = distance(
									cup.squareMesh.geometry.vertices[src].x,
									dest.x,
									cup.squareMesh.geometry.vertices[src].y,
									dest.y
								) / 2;
				i = 0;
				var multipliers = getMultipliers(cup.squareMesh.geometry.vertices[src],  dest, h);
				cup.oneFold(cup.squareMesh.geometry.vertices[src], dest, h, multipliers, i,animationType);	
				slide();
				slide();
				$('button').prop("disabled", false);
			}
		]);
		cup.addSteps(step);

		step = new Step("Finished! Its a cup!", [function () {$('#next').attr("disabled", false);}]);
		cup.addSteps(step);

		cup.animateOrigami();
		$('#next').on('click', function(e){
			if($(this).text() == "Start" || $(this).text() == "Again"){
				clearScene();
				$(this).html("Next");
			}
			e.preventDefault();
			disableButton();
			cup.nextStep();
		});
	});

	$('#fox').on('click', function(e){
		e.preventDefault();
		var fox = new Origami('Fox');
		clearScene();
		var step;
		step = new Step('Fold in Half', [
			function () {
				$('button').prop("disabled", true);
				images = [
					"images/fox/step_1.png",
					"images/fox/step_2.png",
					"images/fox/step_3.png",
					"images/fox/step_4.png",
					"images/fox/step_5.png"
				];
				appendImages();
				fox.removeFromScene();
				fox.setShape(
					[
						[-50.0, 50.0, 0.0],
						[50.0,  50.0, 0.0], 
						[50.0,  -50.0, 0.0], 
						[-50.0, -50.0, 0.0]
					],
					[
						[0, 1, 2],
						[0, 2, 3]
					],
					[
						[91, 200,172],
						[230, 215, 42]
					],
					"double",
					45
				);
				fox.addToScene();
			},
			function () { 
				var src = 3;
				var dest = 1;
				var h = distance(
									fox.squareMesh.geometry.vertices[src].x,
									fox.squareMesh.geometry.vertices[dest].x,
									fox.squareMesh.geometry.vertices[src].y,
									fox.squareMesh.geometry.vertices[dest].y
								) / 2;
				var i = 0;
				var animationType = "forward";
				var multipliers = getMultipliers(fox.squareMesh.geometry.vertices[src], fox.squareMesh.geometry.vertices[dest], h);
				fox.oneFold(fox.squareMesh.geometry.vertices[src], fox.squareMesh.geometry.vertices[dest], h, multipliers, i, animationType);
				slide();
			}
		]);
		fox.addSteps(step);
		step = new Step('Fold tip to the bottom', [
			function() {
				fox.removeFromScene();
				fox.setShape(
					[
						[-50*rt2, 0.0, 0.0],
						[-25*rt2, 25*rt2, 0.0],	
						[0, 0, 0.0],	
						[25*rt2, 25*rt2, 0.0],	
						[50*rt2, 0.0, 0.0],
						[0.0, 50*rt2, 0.0]
					],
					[
						[0, 1, 2],
						[2, 3, 4],
						[1, 3, 2],
						[1, 5, 3]
					],
					[
						[190, 105, 30],
						[190, 105, 30],
						[190, 105, 30],
						[210, 105, 30]
					],
					"double"
				);
				fox.addToScene();
			},
			function() {
				var src = 5;
				var dest = 2;
				var h = distance(
									fox.squareMesh.geometry.vertices[src].x,
									fox.squareMesh.geometry.vertices[dest].x,
									fox.squareMesh.geometry.vertices[src].y,
									fox.squareMesh.geometry.vertices[dest].y
								) / 2;
				i = 0;
				animationType = "forward";
				var multipliers = getMultipliers(fox.squareMesh.geometry.vertices[src], fox.squareMesh.geometry.vertices[dest], h);
				fox.oneFold(fox.squareMesh.geometry.vertices[src], fox.squareMesh.geometry.vertices[dest], h, multipliers, i, animationType);	
				slide();
			}
		]);
		fox.addSteps(step);

		step = new Step('Fold the ears up', [
			function(){
				fox.removeFromScene();
				fox.setShape(
					[
						[-50*rt2, 0.0, 0.0],
						[-25*rt2, 25*rt2, 0.0],	
						[0, 0, 0.0],	
						[25*rt2, 25*rt2, 0.0],	
						[50*rt2, 0.0, 0.0],
						[0.0, 50*rt2, 0.0],	
					],
					[
						[0, 1, 2],
						[2, 3, 4],
						[1, 3, 2]
					],
					[
						[190, 105, 30],
						[190, 105, 30],
						[210, 105, 30]
					],
					"double"
				);
				fox.addToScene();
				slide();
			},
			function(){
				var src = 0;
				var src2 = 4;
				var dest = new THREE.Vector3(-10*rt2 , 51*rt2, 1.0);
				var dest2 = new THREE.Vector3(10*rt2 , 51*rt2, 1.0);
				var h = distance(
									fox.squareMesh.geometry.vertices[src].x,
									dest.x,
									fox.squareMesh.geometry.vertices[src].y,
									dest.y
								) / 2;
				var h2 = distance(
						fox.squareMesh.geometry.vertices[src2].x,
						dest.x,
						fox.squareMesh.geometry.vertices[src2].y,
						dest.y
						) / 2;
				var multipliers = getMultipliers(fox.squareMesh.geometry.vertices[src], dest, h);
				var multipliers2 = getMultipliers(fox.squareMesh.geometry.vertices[src2], dest2, h2);
				i = j = 0;
				animationType = "forward";
				fox.oneFold(fox.squareMesh.geometry.vertices[src], dest, h, multipliers, i, animationType);
				fox.oneFold(fox.squareMesh.geometry.vertices[src2], dest2, h2, multipliers2, j, animationType);
			}
		]);
		fox.addSteps(step);

		step = new Step('Rotate and you are done!', [
			function(){ slide(); $('button').prop("disabled", false); fox.rotation("y", degToRad(180));}
		]);
		fox.addSteps(step);

		fox.animateOrigami();
		$('#next').on('click', function(e){
			if($(this).text() == "Start" || $(this).text() == "Again"){
				clearScene();
				$(this).html("Next");
			}
			e.preventDefault();
			disableButton();
			fox.nextStep();
		});
	});

	$('#balloon').on('click', function(e){
		e.preventDefault();
		var balloon = new Origami("Balloon");
		clearScene();
		var step;
		step = new Step('Fold in half', [
			function () {
				$('button').prop("disabled", true);
				images = [
					'images/balloon/step_1.png',
					'images/balloon/step_2.png',
					'images/balloon/step_3.png',
					'images/balloon/step_4.png',
					'images/balloon/step_5.png',
					'images/balloon/step_6.png',
					'images/balloon/step_7.png',
					'images/balloon/step_8.png',
					'images/balloon/step_9.png',
					'images/balloon/step_10.png',
					'images/balloon/step_11.png',
					'images/balloon/step_12.png',
					'images/balloon/step_13.png'
				];
		    appendImages();
				balloon.removeFromScene();
				balloon.setShape(
					[
						[-50.0, 50.0, 0.0],
						[50.0,  50.0, 0.0], 
						[50.0,  -50.0, 0.0], 
						[-50.0, -50.0, 0.0],
						[-50.0, 0.0, 0.0],
						[50.0, 0.0, 0.0],
						[0.0, 50.0, 0.0],
						[0.0, 0.0, 0.0],
						[0.0, -50.0, 0.0]
					],
					[
						[0, 6, 4],
						[4, 6, 7],
						[6, 1, 7],
						[7, 1, 5],
						[4, 7, 3],
						[3, 7, 8],
						[7, 5, 8],
						[8, 5, 2]
					],
					[
						[91, 200,172],
						[91, 200,172],
						[91, 200,172],
						[91, 200,172],
						[230, 215, 42],
						[230, 215, 42],
						[230, 215, 42],
						[230, 215, 42]
					],
					"double"
					);
				balloon.addToScene();				
			},
			function() {
				var src = balloon.squareMesh.geometry.vertices[0];
				var src2 = balloon.squareMesh.geometry.vertices[1];
				var src3 = balloon.squareMesh.geometry.vertices[6];
				var dest = balloon.squareMesh.geometry.vertices[3];
				var dest2 = balloon.squareMesh.geometry.vertices[2];
				var dest3 = balloon.squareMesh.geometry.vertices[8];
				var h = distance(
													src.x,
													dest.x,
													src.y,
													dest.y) / 2;
				var h2 = distance(
													src2.x,
													dest2.x,
													src2.y,
													dest2.y) / 2;
				var h3 = distance(
													src3.x,
													dest3.x,
													src3.y,
													dest3.y) / 2;
				i = j =  k = 0;
				var multipliers = getMultipliers(src,  dest, h);
				var multipliers2 = getMultipliers(src2,  dest2, h2);
				var multipliers3 = getMultipliers(src3,  dest3, h3);
				animationType = "forward";
				balloon.oneFold(src, dest, h, multipliers, i,animationType);	
				balloon.oneFold(src2, dest2, h2, multipliers2, j, animationType);
				balloon.oneFold(src3, dest3, h3, multipliers3, k, animationType);
				slide();
			}
		]);
		balloon.addSteps(step);

		step = new Step('Fold in Half', [
			function(){
				balloon.removeFromScene();
				balloon.setShape(
					[
						[-50.0,  0.0, 0.0], 
						[0.0, 0.0, 0.0],
						[50.0, 0.0, 0.0],
						[50.0, -50.0, 0.0],
						[0.0, -50.0, 0.0],
						[-50.0, -50.0, 0.0]
					],
					[
						[0, 1, 4],
						[5, 0, 4],
						[1, 3, 4],
						[1, 2, 3],
						[4, 1, 0],
						[4, 0, 5],
						[4, 3, 1],
						[3, 2, 1]
					],
					[
						[230, 215, 42],
						[230, 215, 42],
						[230, 215, 42],
						[230, 215, 42],
						[91, 200,172],
						[91, 200,172],
						[91, 200,172],
						[91, 200,172]						
					], 
					"front"
				);
				balloon.addToScene();
			},
			function(){
				var src = balloon.squareMesh.geometry.vertices[2];
				var src2 = balloon.squareMesh.geometry.vertices[3];
				var dest = balloon.squareMesh.geometry.vertices[0];
				var dest2 = balloon.squareMesh.geometry.vertices[5];
				var h = distance(
													src.x,
													dest.x,
													src.y,
													dest.y) / 2;
				var h2 = distance(
													src2.x,
													dest2.x,
													src2.y,
													dest2.y) / 2;
				i = j = 0;
				var multipliers = getMultipliers(src,  dest, h);
				var multipliers2 = getMultipliers(src2,  dest2, h2);
				animationType = "forward";
				balloon.oneFold(src, dest, h, multipliers, i, animationType);	
				balloon.oneFold(src2, dest2, h2, multipliers2, j, animationType);
				slide();
			}
		]);
		balloon.addSteps(step);

		step = new Step('Open and flatten the space', [
			function() {
				balloon.removeFromScene();
				balloon.setShape(
					[
						[-50.0,  0.0, -0.1], 
						[0.0, 0.0, -0.1],
						[0.0, -50.0, -0.1],
						[-50.0, -50.0, -0.1],
						[-50.0,  0.0, 0.0], 
						[0.0, 0.0, 0.0],
						[0.0, -50.0, 0.0],
						[-50.0, -50.0, 0.0]
					],
					[
						[3, 1, 0],
						[2, 1, 3],
						[4, 5, 7],
						[7, 5, 6],	
						[0, 1, 3],
						[3, 1, 2],
						[7, 5, 4],
						[6, 5, 7]	
					], 
					[
						[230, 215, 42],
						[91, 200,172],
						[230, 215, 42],
						[91, 200,172],
						[91, 200, 172],
						[230, 215, 42],
						[91, 200,172],
						[230, 215, 42]
					],
					"front"
				);
				balloon.addToScene();
			},
			function() {
				animationType = "forward";
				var src = balloon.squareMesh.geometry.vertices[4];
				var src2 = balloon.squareMesh.geometry.vertices[7];
				var dest = balloon.squareMesh.geometry.vertices[6];
				var dest2 = new THREE.Vector3(50.0, -50.0, 0.0);
				var h = distance(
													src.x,
													dest.x,
													src.y,
													dest.y) / 2;
				var h2 = distance(
													src2.x,
													dest2.x,
													src2.y,
													dest2.y) / 2;
				i = j = 0;
				var multipliers = getMultipliers(src,  dest, h);
				var multipliers2 = getMultipliers(src2,  dest2, h2);
				balloon.oneFold(src, dest, h, multipliers, i, animationType);	
				balloon.oneFold(src2, dest2, h2, multipliers2, j, animationType);
				slide();
			}
		]);
		balloon.addSteps(step);

		step = new Step('Turn over', [
			function() {
				slide(); balloon.rotation("y", degToRad(180));
			}
		]);
		balloon.addSteps(step);

		step = new Step('Open and flatten the space', [
			function(){
				balloon.removeFromScene();
				balloon.setShape(
					[
						[-50.0,  -50.0, 0.0], 
						[0.0, 0.0, 0.0],
						[0.0, -50.0, 0.0],
						[50.0, 0.0, 0.0],
						[50.0, -50.0, 0.0],
						[0.0, 0.0, -0.2],
						[50.0, -50.0, -0.2],
						[0.0, -50.0, -0.2]	
					],
					[
						[0, 1, 2],
						[1, 4, 2],
						[1, 3, 4],
						[2, 1, 0],
						[2, 4, 1],
						[4, 3, 1],
						[5, 6, 7],
						[7, 6, 5]
					], 
					[
						[230, 215, 42],
						[91, 200, 172],
						[91, 200, 172],
						[230, 215, 42],
						[230, 215, 42],
						[91, 200, 172],
						[230, 215, 42],
						[91, 200, 172]
					],
					"front"	
				);
				balloon.addToScene();
			},
			function(){
				var src = balloon.squareMesh.geometry.vertices[3];
				var src2 = balloon.squareMesh.geometry.vertices[4];
				var dest = new THREE.Vector3(0.0, -50.0, 3.0);
				var dest2 = new THREE.Vector3(-50.0,  -50.0, 3.0); 
				var h = distance(
													src.x,
													dest.x,
													src.y,
													dest.y) / 2;
				var h2 = distance(
													src2.x,
													dest2.x,
													src2.y,
													dest2.y) / 2;
				i = j = 0;
				animationType = "forward";
				var multipliers = getMultipliers(src,  dest, h);
				var multipliers2 = getMultipliers(src2,  dest2, h2);
				balloon.oneFold(src, dest, h, multipliers, i, animationType);	
				balloon.oneFold(src2, dest2, h2, multipliers2, j, animationType);
				slide();
			}
		]);
		balloon.addSteps(step);

		step = new Step('Fold in both corners inwards', [
			function(){
				balloon.removeFromScene();
				balloon.setShape(
					[
						[-50.0,  -50.0, 0.0], 
						[0.0, 0.0, 0.0],
						[0.0, -50.0, 0.0],
						[50.0, -50.0, 0.0],
						[25.0, -25.0, 0.0],
						[-25.0, -25.0, 0.0],
						[-50.0,  -50.0, -1.0], 
						[0.0, 0.0, -1.0],
						[0.0, -50.0, -1.0],
						[50.0, -50.0, -1.0],
						[25.0, -25.0, -1.0],
						[-25.0, -25.0, -1.0]
					],
					[
						[0, 5, 2],
						[5, 1, 2],
						[2, 1, 4],
						[2, 4, 3],
						[6, 11, 8],
						[11, 7, 8],
						[8, 7, 10],
						[8, 10, 9]
					], 
					[
						[230, 215, 42],
						[91, 200, 172],
						[91, 200, 172],
						[230, 215, 42],
						[91, 200, 172],
						[230, 215, 42],
						[230, 215, 42],
						[91, 200, 172]
					],
					"double"
				);
				balloon.addToScene();
			},
			function() {
				var src = balloon.squareMesh.geometry.vertices[0];
				var src2 = balloon.squareMesh.geometry.vertices[3];
				var dest = balloon.squareMesh.geometry.vertices[1];
				var dest2 = balloon.squareMesh.geometry.vertices[1]; 
				var h = distance(
													src.x,
													dest.x,
													src.y,
													dest.y) / 2;
				var h2 = distance(
													src2.x,
													dest2.x,
													src2.y,
													dest2.y) / 2;
				i = j = 0;
				var multipliers = getMultipliers(src,  dest, h);
				var multipliers2 = getMultipliers(src2,  dest2, h2);
				balloon.oneFold(src, dest, h, multipliers, i, animationType);	
				balloon.oneFold(src2, dest2, h2, multipliers2, j, animationType);
				slide();
			}
		]);
		balloon.addSteps(step);

		step = new Step('Fold both corners inwards in the back', [
			function() {
				balloon.rotation("y", degToRad(180));
			},
			function() {
				var src = balloon.squareMesh.geometry.vertices[6];
				var src2 = balloon.squareMesh.geometry.vertices[9];
				var dest = balloon.squareMesh.geometry.vertices[7];
				var dest2 = balloon.squareMesh.geometry.vertices[7]; 
				var h = distance(
													src.x,
													dest.x,
													src.y,
													dest.y) / 2;
				var h2 = distance(
													src2.x,
													dest2.x,
													src2.y,
													dest2.y) / 2;
				i = j = 0;
				animationType = "backward";
				var multipliers = getMultipliers(src,  dest, h);
				var multipliers2 = getMultipliers(src2,  dest2, h2);
				balloon.oneFold(src, dest, h, multipliers, i, animationType);	
				balloon.oneFold(src2, dest2, h2, multipliers2, j, animationType);
				slide();
			}
		]);
		balloon.addSteps(step);


		step = new Step('Fold in the side corners inwards', [
			function() {
				balloon.removeFromScene();
				balloon.setShape(
					[
						[-25.0,  -25.0, 0.0], 
						[-25.0 / 2, -25.0 / 2, 0.0],
						[-25.0 / 2, -37.5, 0.0],
						[0.0, 0.0, 0.0],
						[0.0,  -50.0, 0.0], 
						[25.0 / 2, -25.0 / 2, 0.0],
						[25.0 / 2, -37.5, 0.0],
						[25.0, -25.0, 0.0],
						[-25.0,  -25.0, -1.0], 
						[-25.0 / 2, -25.0 / 2, -1.0],
						[-25.0 / 2, -37.5, -1.0],
						[0.0, 0.0, -1.0],
						[0.0,  -50.0, -1.0], 
						[25.0 / 2, -25.0 / 2, -1.0],
						[25.0 / 2, -37.5, -1.0],
						[25.0, -25.0, -1.0]
					],
					[
						[0, 1, 2],
						[2, 1, 4],
						[1, 3, 4],
						[4, 3, 5],
						[4, 5, 6],
						[6, 5, 7],
						[8, 9, 10],
						[10, 9, 12],
						[9, 11, 12], 
						[12, 11, 13], 
						[12, 13, 14], 
						[14, 13, 15]  
					], 
					[
						[230, 215, 42],
						[91, 200, 172],
						[91, 200, 172],
						[91, 200, 172],
						[91, 200, 172],
						[230, 215, 42],
						[230, 215, 42],
						[91, 200, 172],
						[91, 200, 172],
						[91, 200, 172],
						[91, 200, 172],
						[230, 215, 42]	
					],
					"double");
				balloon.addToScene();
				slide();
			},
			function() {
				var src = balloon.squareMesh.geometry.vertices[0];
				var src2 = balloon.squareMesh.geometry.vertices[7];
				var dest = new THREE.Vector3(0.0, -25.0, 0.0);
				var dest2 = new THREE.Vector3(0.0, -25.0, 0.0); 
				var h = distance(
													src.x,
													dest.x,
													src.y,
													dest.y) / 2;
				var h2 = distance(
													src2.x,
													dest2.x,
													src2.y,
													dest2.y) / 2;
				i = j = 0;
				animationType = "forward";
				var multipliers = getMultipliers(src,  dest, h);
				var multipliers2 = getMultipliers(src2,  dest2, h2);
				balloon.oneFold(src, dest, h, multipliers, i, animationType);	
				balloon.oneFold(src2, dest2, h2, multipliers2, j, animationType);
			}
		]);
		balloon.addSteps(step);

		step = new Step('Flip, and fold in the side corners inwards', [
			function() {
				slide();
				balloon.rotation("y", degToRad(180));
			},
			function() {
				var src = balloon.squareMesh.geometry.vertices[8];
				var src2 = balloon.squareMesh.geometry.vertices[15];
				var dest = new THREE.Vector3(0.0, -25.0, -1.0);
				var dest2 = new THREE.Vector3(0.0, -25.0, -1.0); 
				var h = distance(
													src.x,
													dest.x,
													src.y,
													dest.y) / 2;
				var h2 = distance(
													src2.x,
													dest2.x,
													src2.y,
													dest2.y) / 2;
				i = j = 0;
				animationType = "backward";
				var multipliers = getMultipliers(src,  dest, h);
				var multipliers2 = getMultipliers(src2,  dest2, h2);
				balloon.oneFold(src, dest, h, multipliers, i, animationType);	
				balloon.oneFold(src2, dest2, h2, multipliers2, j, animationType);
			}
		]);
		balloon.addSteps(step);

		step = new Step('Make a crease and tuck in the flaps', [
			function() {
				slide();
				balloon.removeFromScene();
				vectorArray =
				[
					//front flaps
					[-25.0 / 2, -25.0 / 2, 0.1],
					[-25.0 / 2, -37.5, 0.1],
					[0.0, -25.0, 0.1],
					[25.0 / 2, -25.0 / 2, 0.1],
					[25.0 / 2, -37.5, 0.1],
					//first main shape
					[-25.0 / 2, -25.0 / 2, 0.0],
					[-25.0 / 2, -37.5, 0.0],
					[0.0, -0.1, 0.0],
					[0.0, 0.1, 0.0],
					[0.0, -18.75, 0.0],
					[0.0, -25.0, 0.0],
					[0.0, -50.0, 0.0],
					[25.0 / 2, -25.0 / 2, 0.0],
					[25.0 / 2, -37.5, 0.0],

					//inside shape
					[-25.0 / 2, -25.0 / 2, -1.0],
					[0.0, 0.0, -1.0],
					[0.0, -25.0, -1.0],
					[25.0 / 2, -25.0 / 2, -1.0],

					//second main shape
					[-25.0 / 2, -25.0 / 2, -2.0],
					[-25.0 / 2, -37.5, -2.0],
					[0.0, -0.1, -2.0],
					[0.0, 0.1, -2.0],
					[0.0, -18.75, -2.0],
					[0.0, -25.0, -2.0],
					[0.0, -50.0, -2.0],
					[25.0 / 2, -25.0 / 2, -2.0],
					[25.0 / 2, -37.5, -2.0],

					//back flaps 
					[-25.0 / 2, -25.0 / 2, -2.1],
					[-25.0 / 2, -37.5, -2.1],
					[0.0, -25.0, -2.1],
					[25.0 / 2, -25.0 / 2, -2.1],
					[25.0 / 2, -37.5, -2.1]
				];
				faces = 
				[
					[0, 1, 2],
					[2, 3, 4],

					[6, 5, 10],
					[5, 7, 9],
					[5, 9, 10],
					[9, 8, 12],
					[9, 12, 10],
					[6, 10, 11],
					[10, 13, 11],
					[10, 12, 13],

					[14, 15, 16], 
					[16, 15, 17], 

					[19, 18, 23], 
					[18, 20, 22],
					[18, 22, 23],
					[19, 23, 24], 
					[21, 25, 22],
					[22, 25, 23],
					[23, 25, 26],
					[23, 26, 24], 

					[28, 27, 29], 
					[29, 30, 31]
				];
				colors = 
				[
					[230, 215, 42],
					[230, 215, 42],

					[91, 200, 172],
					[91, 200, 172],
					[91, 200, 172],
					[91, 200, 172],
					[91, 200, 172],
					[91, 200, 172],
					[91, 200, 172],
					[91, 200, 172],

					[230, 215, 42],
					[230, 215, 42],

					[91, 200, 172],
					[91, 200, 172],
					[91, 200, 172],
					[91, 200, 172],
					[91, 200, 172],
					[91, 200, 172],
					[91, 200, 172],
					[91, 200, 172],
		
					[230, 215, 42],
					[230, 215, 42]
				];
				balloon.setShape(
					vectorArray,
					faces,
					colors,
					"double"
				);
				balloon.addToScene();
			},
			function() {
				var src = balloon.squareMesh.geometry.vertices[7];
				var src2 = balloon.squareMesh.geometry.vertices[8];
				var dest = new THREE.Vector3(-25.0 / 2, -31.25, 0.0);
				var dest2 = new THREE.Vector3(25.0 / 2, -31.25, 0.0); 
				var h = distance(
													src.x,
													dest.x,
													src.y,
													dest.y) / 2;
				var h2 = distance(
													src2.x,
													dest2.x,
													src2.y,
													dest2.y) / 2;
				i = j = 0;
				animationType = "forward";
				var multipliers = getMultipliers(src,  dest, h);
				var multipliers2 = getMultipliers(src2,  dest2, h2);
				balloon.oneFold(src, dest, h, multipliers, i, animationType);	
				balloon.oneFold(src2, dest2, h2, multipliers2, j, animationType);
			},
			function() {
				balloon.removeFromScene();
				vectorArray[7] = [-25.0 / 2, -31.25, 0.0];
				vectorArray[8] = [25.0 / 2, -31.25, 0.0]; 
				balloon.setShape(vectorArray, faces, colors, "double");
				balloon.addToScene();
			},
			function() {
				balloon.rotation("y", degToRad(180));
			},
			function() {
				var src = balloon.squareMesh.geometry.vertices[20];
				var src2 = balloon.squareMesh.geometry.vertices[21];
				var dest = new THREE.Vector3(-25.0 / 2, -31.25, -2.0);
				var dest2 = new THREE.Vector3(25.0 / 2, -31.25, -2.0); 
				var h = distance(
													src.x,
													dest.x,
													src.y,
													dest.y) / 2;
				var h2 = distance(
													src2.x,
													dest2.x,
													src2.y,
													dest2.y) / 2;
				i = j = 0;
				animationType = "backward";
				var multipliers = getMultipliers(src,  dest, h);
				var multipliers2 = getMultipliers(src2,  dest2, h2);
				balloon.oneFold(src, dest, h, multipliers, i, animationType);	
				balloon.oneFold(src2, dest2, h2, multipliers2, j, animationType);
			},
			function() {
				balloon.removeFromScene();
				vectorArray[20] = [-25.0 / 2, -31.25, -2.0];
				vectorArray[21] = [25.0 / 2, -31.25, -2.0]; 
				balloon.setShape(vectorArray, faces, colors, "double");
				balloon.addToScene();
				slide();
			}
		]);
		balloon.addSteps(step);

		step = new Step("Finished! Its a balloon!", [ function () { slide(); $('button').prop("disabled", false);}]);

		balloon.addSteps(step);

		balloon.animateOrigami();
		$('#next').on('click', function(e){
			if($(this).text() == "Start" || $(this).text() == "Again"){
				clearScene();
				$(this).html("Next");
			}
			e.preventDefault();
			disableButton();
			balloon.nextStep();
		});
	});
});

window.onload = function(){
	$('#create').on('click', function(e){
		e.preventDefault();
		$(this).hide();
		$('.file').show();
		$('#cancel').show();
	});

	$('#cancel').on('click', function(e){
		e.preventDefault();
		$(this).hide();
		$('.file').hide();
		$('#create').show();
	});

	var dropZone = document.querySelector('#dd-files');
	var fileContentPane = document.querySelector('#file-content');

	// Event Listener for when the dragged file is over the drop zone.
	dropZone.addEventListener('dragover', function(e){
		if(e.preventDefault) e.preventDefault();
		if(e.stopPropagation) e.stopPropagation;

		e.dataTransfer.dropEffect = 'copy';
	});

	// Event Listener for when the dragged file enters the drag zone.
	dropZone.addEventListener('dragenter', function(e){
		this.className = "over";
	});

	// Event Listener for when the dragged file leaves the drag zone.
	dropZone.addEventListener('dragleave', function(e){
		this.className = "";
	});

	// Event Listener for when the dragged file dropped in the drag zone.
	dropZone.addEventListener('drop', function(e){
		if(e.preventDefault) e.preventDefault();
		if(e.stopPropagation) e.stopPropagation;
		this.className = "";

		var fileList = e.dataTransfer.files;

		if( fileList.length > 0 ){
			readTextFile(fileList[0]);
		}
	});

	// Read the contens of the file
	function readTextFile(file){
	  var reader = new FileReader();
	  
	  reader.onloadend = function(e) {
	    if (e.target.readyState == FileReader.DONE){
		    var result = JSON.parse(reader.result);
		    var origami = createOrigami(result);
		    console.log(origami);
	  	}
	  }
		reader.readAsBinaryString(file);
	}
}
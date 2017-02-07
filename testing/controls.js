function isValidInput(inputElement){
  if($(inputElement)[0].checkValidity() && inputElement.value && inputElement.value>0){
    $(inputElement).css("background-color", "transparent");
      return inputElement.value;
  }
  else{
    $(inputElement).css("background-color", "rgba(255,0,0,.3)");
      return false;
  }
}

function onKeyDown(event){
  if(event.keyCode =="32"){
    $(document.activeElement).blur();
    controls.enabled = false;
  }
}
function onKeyUp(event){
  if(event.keyCode =="32"){
    controls.enabled = true;
  }
}

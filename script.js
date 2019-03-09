var hide = false;
function hideButton() {
	hide = !(hide);
	if(hide){
		document.getElementById('toggleOff').style.display = 'block';
		document.getElementById('toggleOn').style.display = 'none';
		document.getElementById('toggleButton').innerText = 'Go to Sales';
	}else{
		document.getElementById('toggleOn').style.display = 'block';
		document.getElementById('toggleOff').style.display = 'none';
		document.getElementById('toggleButton').innerText ='Add Day';
	}



}

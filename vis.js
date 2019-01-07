
/* Get the documentElement (<html>) to display the page in fullscreen */
var elem = document.documentElement;

var fullscreen = false;

/* View in fullscreen */
function openFullscreen() {
  	fullscreen = true;
	if (elem.requestFullscreen) {
		elem.requestFullscreen();
	} else if (elem.mozRequestFullScreen) { /* Firefox */
		elem.mozRequestFullScreen();
	} else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
		elem.webkitRequestFullscreen();
	} else if (elem.msRequestFullscreen) { /* IE/Edge */
		elem.msRequestFullscreen();
	}
}

/* Close fullscreen */
function closeFullscreen() {
	fullscreen = false;
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.mozCancelFullScreen) { /* Firefox */
		document.mozCancelFullScreen();
	} else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
		document.webkitExitFullscreen();
	} else if (document.msExitFullscreen) { /* IE/Edge */
		document.msExitFullscreen();
	}
}

function togglePaused(){
	isPaused = !isPaused;
	if (isPaused){
		$('#pauseButton > i').text('play_arrow')
	}else{
		$('#pauseButton > i').text('pause')
	}	
}

function toggleFullscreen(){
 	if (fullscreen){
		closeFullscreen();
  	}else{
		openFullscreen();
  	}
}


function makeBall(posX, posY){
  	var d = document.createElement("div");
  	d.className = "ball"
  	d.style.left = posX + 'px';
  	d.style.top = posY + 'px';
  	return d;
}

function updateSpeedLabel(){
	$('#speed-label').text(speeds[ballSpeedIndex] + 'x');
}
function speedUp(){
	if (ballSpeedIndex == speeds.length-1){
		return
	}
	ballSpeedIndex += 1;
	ballSpeed = speeds[ballSpeedIndex];
	updateSpeedLabel();
}
function speedDown(){
	if (ballSpeedIndex == 0){
		return
	}
	ballSpeedIndex -= 1;
	ballSpeed = speeds[ballSpeedIndex];
	updateSpeedLabel();
}


function toggleControls(){
	controlsShowing = !controlsShowing;
	if (controlsShowing) {
		$('.controls').show();
		$('#controls-toggle-icon').text('keyboard_arrow_up')
	}else{
		$('.controls').hide();
		$('#controls-toggle-icon').text('keyboard_arrow_down')
	}
	
}


function updateBackgroundColor(){
	var i;
	for (i = 0; i < 3; i++){
		BACKGROUND_RGB[i] += RGB_INC_1[i];
		if (BACKGROUND_RGB[i] >= 255){
			BACKGROUND_RGB[i] = 255;
			RGB_INC_1[i] = -RGB_INC_1[i];
		}else if (BACKGROUND_RGB[i] <= 0){
			BACKGROUND_RGB[i] = 0;
			RGB_INC_1[i] = -RGB_INC_1[i];
		}
	}
	document.documentElement.style.setProperty('--main-bg-color', 'rgb(' 
		+ BACKGROUND_RGB[0] + ', '
		+ BACKGROUND_RGB[1] + ', '
		+ BACKGROUND_RGB[1] + ')')
}





const NUM_BALLS = 20;

var COUNTER = 0;

var isPaused = false;

const LOOP_SPEED = 30;

var ballDiam = 25;

var ballSpeedIndex = 3;

const speeds = [0.1, 0.2, 0.5, 1, 2, 5, 10]

var ballSpeed = speeds[ballSpeedIndex];

var speedUpdate = 0;

var controlsShowing = true;

var RGB_INC_1 = [3, 4, 5];

var BACKGROUND_RGB = [100, 0, 200];

// var BALLS_RGB = [100, 0, 200];


$(document).ready(function(){

	var balls = [];

	var horizMargin = $(window).width() * 0.05;
	var vertMagin = $(window).height() * 0.1;

	var width = $(window).width() - (2*horizMargin);
	var height = $(window).height() - (2*vertMagin);

	function getY(ballIndex, counter){
		var y = vertMagin + (height/2 *  (1 + Math.sin((counter * (ballSpeed * ballIndex/1000 + 0.02)) % 2*Math.PI)));
        return y;
 	}

 	updateSpeedLabel();

	document.documentElement.style.setProperty('--ball-diam', ballDiam + 'px')
	document.documentElement.style.setProperty('--ball-rad', (ballDiam/2) + 'px')

  	$(window).resize(function(){
		horizMargin = $(window).width() * 0.05;
		vertMagin = $(window).height() * 0.1;
		width = $(window).width() - (2*horizMargin);
		height = $(window).height() - (2*vertMagin);
		setBallsX()
  	});

  	$(window).keypress(function (e) {
  		console.log(e.keyCode);
	 	if (e.key === ' ' || e.key === 'Spacebar') {
	    	// ' ' is standard, 'Spacebar' was used by IE9 and Firefox < 37
	    	e.preventDefault();
	    	togglePaused();
	  	}
	})
	document.onkeydown = checkKey;
	function checkKey(e) {
	    e = e || window.event;
	    if (e.keyCode == '37') {
	      	e.preventDefault();
	    	speedDown();
	    }
	    else if (e.keyCode == '39') {
	      	e.preventDefault();
	    	speedUp();
    	}
	}

 	function setBallsX(){
 		var nballs = balls.length;
 		var bspace = width / (nballs);
 		var j;
  		for (j = 0; j < nballs; j++){
  			var x = horizMargin  + (j*bspace) + (bspace/2) - (ballDiam/2);
  			balls[j].style.left = x + 'px';
  		}
  	}

  	function setBallsY(){
  		var nballs = balls.length;
 		var j;
  		for (j = 0; j < nballs; j++){
  			var y = getY(j, COUNTER);
  			balls[j].style.top = y + 'px';
  		}
  	}

  	var i;
  	for (i = 0; i < NUM_BALLS; i++){
  		var b = makeBall(0, 200);
  		balls.push(b);
  		$("body").prepend(b);
  	}
  	setBallsX();





  	
  	setInterval(function(){ 
  		if (!isPaused){

  			// if ((speedUpdate < 0 && ballSpeed > speeds[ballSpeedIndex]) 
  			// 	|| (speedUpdate > 0 && ballSpeed < speeds[ballSpeedIndex])){
  			// 	ballSpeed += speedUpdate;
  			// }else if (speedUpdate != 0){
  			// 	speedUpdate = 0;
  			// }
  			updateBackgroundColor();

  			var k;
	  		for (k = 0; k < balls.length; k++){

	  			// var y = parseInt(balls[k].style.top);
	  			// y += 1;

	  			// balls[k].style.top = y + 'px';
	  			setBallsY();
	  		}
	  		COUNTER += 1;
  		}
  		
  	}, LOOP_SPEED);


})











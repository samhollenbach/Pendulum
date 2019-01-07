
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

function restartLoop(){
	COUNTER = 0;
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
	for (var i = 0; i < 3; i++){
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



var NUM_BALLS = 20;

var COUNTER = 0;

var isPaused = false;

const LOOP_SPEED = 30;

const minHeightScale = 0.6;
var heightScale = 1.0;
var heightScaleUpdate = -0.01;

var ballDiamBase = 15;
var ballDiam = ballDiamBase;

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

	var scaleVertMargin = 0;

	var width = $(window).width() - (2*horizMargin);

	var height = heightScale * $(window).height() - (2*vertMagin);


 	updateSpeedLabel();


 	function doResize(){
 		horizMargin = $(window).width() * 0.05;
		vertMagin = $(window).height() * 0.1;
		width = $(window).width() - (2*horizMargin);
		height = $(window).height() - (2*vertMagin);
		ballDiamBase = width / (NUM_BALLS * 2);
		setBallsX()
 	}
	
  	$(window).resize(function(){
		doResize()
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

	function updateBallsColor(){
		for (var n = 0; n < NUM_BALLS; n++){
			var r = BACKGROUND_RGB[0] + ((n/NUM_BALLS)*(BACKGROUND_RGB[1] - BACKGROUND_RGB[0]));
			var g = BACKGROUND_RGB[1] + ((n/NUM_BALLS)*(BACKGROUND_RGB[2] - BACKGROUND_RGB[1]));
			var b = BACKGROUND_RGB[2] + ((n/NUM_BALLS)*(BACKGROUND_RGB[0] - BACKGROUND_RGB[2]));

			var rgb = 'rgb(' + r + ', ' + g + ', ' + b + ')';

			balls[n].style.backgroundColor = rgb;

		}
	}

 	function setBallsX(){
 		var bspace = width / NUM_BALLS;
  		for (var j = 0; j < NUM_BALLS; j++){
  			var x = horizMargin  + (j*bspace) + (bspace/2) - (ballDiam/2);
  			balls[j].style.left = x + 'px';
  		}
  	}

  	function getY(ballIndex, counter){
		var y = vertMagin + scaleVertMargin + (height/2 *  (1 + Math.sin((counter * (ballSpeed * ballIndex/400 + 0.02)) % 2*Math.PI)));
        return y;
 	}
  	function setBallsY(){
  		for (var j = 0; j < NUM_BALLS; j++){
  			var y = getY(j, COUNTER);
  			balls[j].style.top = y + 'px';
  		}
  	}

  	function createBalls(N){
	  	for (var i = 0; i < N; i++){
	  		var b = makeBall(0, 200);
	  		balls.push(b);
	  		$("body").prepend(b);
	  	}
	  	setBallsX();

  	}

  	function updateHeightScale(){
  		heightScale += heightScaleUpdate;
  		if (heightScale <= minHeightScale || heightScale >= 1.0){
  			heightScaleUpdate *= -1;
  		}
  		var h = $(window).height() - (2*vertMagin);
  		scaleVertMargin = (1.0 - heightScale)/2 * h;
		height = heightScale * h;
		updateBallSize();
  	}

  	function updateBallSize(){
  		ballDiam = ballDiamBase + ((heightScale - minHeightScale)* 8);
  		console.log(heightScale);
  		console.log(ballDiam)
  		document.documentElement.style.setProperty('--ball-diam', ballDiam + 'px')
		document.documentElement.style.setProperty('--ball-rad', (ballDiam/2) + 'px')

  	}


  	
  	createBalls(NUM_BALLS);
  	doResize();
  	
  	setInterval(function(){ 
  		if (!isPaused){

  			updateBackgroundColor();
  			updateBallsColor();

  			if (COUNTER % 8 == 0){
				updateHeightScale();
  			}
  			
  			setBallsY();



	  		COUNTER += 1;
  		}
  		
  	}, LOOP_SPEED);


})











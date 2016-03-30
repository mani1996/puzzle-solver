var PIXEL_RATIO = (function(){
    var ctx = document.createElement("canvas").getContext("2d"),
    dpr = window.devicePixelRatio || 1,
    bsr = ctx.webkitBackingStorePixelRatio ||
          ctx.mozBackingStorePixelRatio ||
          ctx.msBackingStorePixelRatio ||
          ctx.oBackingStorePixelRatio ||
          ctx.backingStorePixelRatio || 1;
    return dpr / bsr;
})();


// Clears the canvas contents
var clearCanvas = function(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
}


// Sets text in the canvas at desired coordinate
var setCanvasHeading = function(heading,topMargin){
	ctx.fillStyle = "black";
	ctx.font = "30px Arial";
	var leftMargin = 320 - ctx.measureText(heading).width/2;
	ctx.fillText(heading,leftMargin*PIXEL_RATIO,topMargin*PIXEL_RATIO);
}


// Draws current game state on canvas
var setPoles = function(state){
	var i;
	ctx.fillStyle = "blue";

	// Create left pole
	ctx.fillRect(70,350,150,30);
	paint_centered(70,350,150,30,'Left');

	ctx.fillStyle = "blue";	

	// Create middle pole
	ctx.fillRect(320,350,150,30);
	paint_centered(320,350,150,30,'Middle');

	ctx.fillStyle = "blue";

	// Create right pole
	ctx.fillRect(570,350,150,30);
	paint_centered(570,350,150,30,'Right');

	for(i=0;i<state[0].length;i++){
		ctx.fillStyle = "brown";
		ctx.fillRect(85,350-25*(i+1),120,25);
		paint_centered(85,350-25*(i+1),120,25,state[0][i],'white');
	}

	for(i=0;i<state[1].length;i++){
		ctx.fillStyle = "brown";
		ctx.fillRect(335,350-25*(i+1),120,25);
		paint_centered(335,350-25*(i+1),120,25,state[1][i],'white');
	}

	for(i=0;i<state[2].length;i++){
		ctx.fillStyle = "brown";
		ctx.fillRect(585,350-25*(i+1),120,25);
		paint_centered(585,350-25*(i+1),120,25,state[2][i],'white');
	}

}


var paint_centered = function(x, y, w, h, text,color) {
    var Paint = {
        RECTANGLE_STROKE_STYLE : 'black',
        RECTANGLE_LINE_WIDTH : 1,
        VALUE_FONT : '20px Arial',
        VALUE_FILL_STYLE : color || 'yellow'
    }

    if (ctx) {
        // draw rectangular
        ctx.strokeStyle=Paint.RECTANGLE_STROKE_STYLE;
        ctx.lineWidth = Paint.RECTANGLE_LINE_WIDTH;
        ctx.strokeRect(x, y, w, h);
        
        // draw text (this.val)
        ctx.textBaseline = "middle";
        ctx.font = Paint.VALUE_FONT;
        ctx.fillStyle = Paint.VALUE_FILL_STYLE;
        // ctx2d.measureText(text).width/2 
        // returns the text width (given the supplied font) / 2
        textX = x+w/2-ctx.measureText(text).width/2;
        textY = y+h/2;
        ctx.fillText(text, textX, textY);
    }
}

// Function to make AJAX call for solution
var requestSolution = function(){
	clearCanvas();
	stopSim(); // Stop already running animation
	setCanvasHeading('Loading solution....',30);

	var getSolution = $.post('/towersOfHanoi',
		{
			'input':$("input[name='no-of-disks']").val()
		},
	displayResult);

	getSolution.error(function(){
		clearCanvas();
		setCanvasHeading('Check your internet connection and try again!',120);
	});
}


var simulator;

var stopSim = function(){
	clearInterval(simulator);
}

// Callback method of requestSolution
var displayResult = function(res,status,xhr){
	var i,states,move;
	clearCanvas();

	if(status=="success"){
		res = JSON.parse(res); // Converting JSON string to object

		if('errors' in res){
			// Improper input
			clearCanvas();
			for(i=0;i<res['errors'].length;i++){
				setCanvasHeading(res['errors'][i],30*(i+1));
			}	
		}
		else{
			states = res.states;
			move = 0;
			simulator = setInterval(function(){
				clearCanvas();
				setCanvasHeading('Towers Of Hanoi for '+res['noOfDisks']+' disks - Move '+move,30);
				setPoles(states[move]);
				move+=1;
				if(move>=states.length){
					stopSim();
				}
			},1000);
		}

	}
	else{
		alert('Unable to connect to server. Please try again!');
	}
}



$(document).ready(function(){
	// Anonymous function to initialise canvas
	(function(){	
		canvas = $("#solutionCanvas")[0];
		canvas.width = 800 * PIXEL_RATIO;
		canvas.height = 400 * PIXEL_RATIO;
		ctx = canvas.getContext("2d");
		ctx.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);
		setCanvasHeading("Hi there!",320-ctx.measureText("Hi there!").width/2,120);
	})();

	$('#solvePuzzle').click(requestSolution); // Event for button click
});
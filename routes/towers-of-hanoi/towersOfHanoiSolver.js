// Enum for the poles
var poles = {
	left:0,
	middle:1,
	right:2
}


// Deep copy using JSON methods - Exercise caution with Date objects!
var clone = function(obj){
	return JSON.parse(JSON.stringify(obj));
}

// Recursive algo which generates list of moves
var simulateAlgo = function(noOfDisks,left,right,middle){
	if(noOfDisks==1){
		return [{
			from: left,
			to: right
		}];
	}
	else{
		var stage1,stage2,stage3;
		stage1 = simulateAlgo(noOfDisks-1,left,middle,right);
		stage2 = [{
			from: left,
			to: right
		}];
		stage3 = simulateAlgo(noOfDisks-1,middle,right,left);
		return stage1.concat(stage2).concat(stage3);
	}
}



// Returns state of the game before making the first move
var getInitState = function(noOfDisks){
	var i;
	var state = [[],[],[]];
	for(i=1;i<=noOfDisks;i++){
		state[poles.left].push(i);
	}
	return state;
}

// Modifies the current state and returns a deep copy of the current state
var getNextState = function(currentState, move){
	var moveBlock = currentState[move.from].pop();
	currentState[move.to].push(moveBlock);
	return clone(currentState);	
}



/* 
   Solves the Towers of Hanoi problem.
   Returns an object which contains
   1) list of moves to solve the game
   2) Disks at each pole after every move

   NOTE:
   Disks are numbered from 1 to N in increasing order of size
*/
var solve = function(noOfDisks){
	var currentState,moves,nextState;
	moves = simulateAlgo(noOfDisks,poles.left,poles.right,poles.middle);
	states = [];
	currentState = getInitState(noOfDisks);
	states.push(clone(currentState));
	for(i=0;i<moves.length;i++){
		states.push(getNextState(currentState,moves[i]));
	}
	return {
		moves: moves,
		states: states
	};
}


module.exports.solve = solve;
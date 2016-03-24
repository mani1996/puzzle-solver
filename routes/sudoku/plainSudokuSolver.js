var express = require('express');
var router = express.Router();
var utils = require('./utils');
var completed;

var noOfChoices = function(pos,values){
	var i,res;
	res = 0;
	for(i=1;i<=9;i++){
		values[pos] = i;
		if(utils.rowCheck(pos,values) && utils.colCheck(pos,values) && utils.boxCheck(pos,values)){
			res++;
		}
		values[pos] = NaN;
	}
	return res;
}

var validBoard = function(values){
	var i,ok;
	ok = true;
	for(i=0;i<81;i++){
		ok = ok && utils.rowCheck(i,values) && utils.colCheck(i,values) && utils.boxCheck(i,values);
	}
	return ok;
}


var solve = function(values,filled,prevPos){
	var i,start,ok,minChoice,result,val1,start1;
	minChoice = 9; // We determine box which offers least number of alternate moves and play
	for(i=80;i>=0;i--){
		if(!utils.fieldCheck(values[i])){
			if(noOfChoices(i,values)<=minChoice){
				start = i;
				minChoice = noOfChoices(i,values);
			}
		}
	}

	if(filled==81){
		// We completed the puzzle
		return values;
	}
	else{
		result = false;
		for(i=1;i<=9;i++){
			values[start] = i;
			val1 = JSON.parse(JSON.stringify(values));
			if(validBoard(val1)){
				result = result || solve(val1,filled+1,start);
			}
		}
		return result;
	}
};

module.exports.solve = solve;
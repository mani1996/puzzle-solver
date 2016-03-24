var express = require('express');
var router = express.Router();
var utils = require('./utils');
var solver = require('./plainSudokuSolver');
router.get('/', function(req, res, next) {
	res.render('plainSudoku',{
		title: 'Sudoku Solver',
		desc: 'Online utility that simplifies solving Sudoku problems'
	});
});


router.post('/', function(req,res,next){
	var i,sanityCheck,ipCheck,solution,errors,startMilliseconds,endMilliseconds;
	startMilliseconds = Date.now();
	try{
		sanityCheck = true;
		errorCells = []
		existingCells = []
		for(i in req.body){
			if(utils.fieldCheck(req.body[i])){
				req.body[i] = parseInt(req.body[i]);
				if(utils.isNumber(req.body[i])){
					existingCells.push(i);
				}
			}
			else{
				sanityCheck = false;
				errorCells.push(i);
			}
		}
		console.log(existingCells.length);
		if(sanityCheck){
			ipCheck = true;

			for(i=0;i<81;i++){
				ipCheck = ipCheck && utils.rowCheck(i,req.body);
				ipCheck = ipCheck && utils.colCheck(i,req.body);
				ipCheck = ipCheck && utils.boxCheck(i,req.body);
			}

			if(ipCheck){
				/* 
				*	 This condition fails if the given input has a
				*	 problem in row/column/box validation as such
				*/
				solution = solver.solve(req.body,0,-1);

				for(i=0;i<existingCells.length;i++){
					solution[existingCells[i]]*=-1;
				}

				ipCheck = !!(solution);
			}

			if(ipCheck){
				/* 
				*	 This condition fails if the given problem does
				*    not have a solution
				*/
				endMilliseconds = Date.now();
				res.end(JSON.stringify({'solution':solution,'timeTaken':endMilliseconds-startMilliseconds}));
			}
			else{
				res.end(JSON.stringify({'errors':['This problem does not have a solution']}));
			}
		}
		else{
			res.end(JSON.stringify({'errors':['Every box should be empty or contain a digit from 1-9']}));
		}
	}
	catch(e){
		res.end(JSON.stringify({'errors':[e.message]}));
	}

});

module.exports = router;

var express = require('express');
var router = express.Router();
var solver = require('./towersOfHanoiSolver');
var utils = require('./utils');

router.get('/', function(req,res,next){
	res.render('towersOfHanoi',{
		title: 'Towers Of Hanoi',
		desc: 'Online utility to visualise solutions to the Towers Of Hanoi problem'
	});
});

router.post('/', function(req,res,next){
	req.body = req.body['input'];
	// req.body contains number of disks
	if(utils.isNumber(req.body)){
		req.body = parseInt(req.body);
		var solution = solver.solve(req.body);
		solution.noOfDisks = req.body;
		res.end(JSON.stringify(solution));
	}
	else{
		res.end(JSON.stringify({
			'errors':[
				'Input should be a number in the range 1-10'
			]
		}));
	}
})

module.exports = router;
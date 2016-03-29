// Range of allowed input
var rangeLow = 1;
var rangeHigh = 10;

var isNumber = function(val){
	return /^[\s]*[0-9]+[\s]*$/.test(val) && rangeLow<=parseInt(val) && rangeHigh>=parseInt(val); 
}

module.exports.isNumber = isNumber
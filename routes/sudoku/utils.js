var rowCheck = function(pos,arr){
	var idx,lt;
	lt = Math.floor(pos/9)*9;
	for(idx=lt;idx<lt+9;idx++){
		if(arr[idx]==arr[pos] && idx!=pos && fieldCheck(arr[pos]))return false;
	}
	return true;
}


var colCheck = function(pos,arr){
	var idx,lt;
	lt = pos%9;
	for(idx=0;idx<9;idx++){
		if(arr[lt+9*idx]==arr[pos] && (lt+9*idx)!=pos && fieldCheck(arr[pos]))return false;
	}
	return true;
}


var boxCheck = function(pos,arr){
	var row,col,compPos,i,j;
	row = Math.floor(pos/9);
	col = pos%9;
	for(i=Math.floor(row/3)*3;i<=Math.floor(row/3)*3+2;i++){
		for(j=Math.floor(col/3)*3;j<=Math.floor(col/3)*3+2;j++){
			if(arr[i*9+j]==arr[pos] && (i*9+j)!=pos && fieldCheck(arr[pos]))return false;
		}
	}
	return true;
}

var fieldCheck = function(val){
	return (val=='') || (/^[1-9]$/.test(val)); // Field can be empty or have value 1 to 9
}

var isNumber = function(val){
	return /[1-9]+/.test(val.toString());
}

module.exports.rowCheck = rowCheck;
module.exports.colCheck = colCheck;
module.exports.boxCheck = boxCheck;
module.exports.fieldCheck = fieldCheck;
module.exports.isNumber = isNumber;
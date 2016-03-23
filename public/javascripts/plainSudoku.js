var parseFields = function(){
	var i;
	var values = [];
	for(i=1;i<=81;i++){
		values.push($('#cell'+i).val());
	}
	return JSON.stringify(values);
}

var updateUI = function(state){

	if(state){
		// UI update on success
		$('#solve').remove();
		$('#upload-1D').remove();
		var hlink = $('<a>Solve another puzzle</a>');
		hlink.attr({
			href:'/sudoku',
			class:'btn btn-primary active'
		});
		$('#content-area').append(hlink);
	}
	else{
		$('#solve').text('Click to solve!');
	}
}

var displayResult = function(result,status,xhr){
	var result,i,error;
	if(status=='success'){
		result = JSON.parse(result);

		if('errors' in result){
			for(var error in result['errors']){
				alert(result['errors'][error]);
			}
			updateUI(false);
		}
		else{
			for(i=1;i<=81;i++){
				if(result[i-1]>0){
					// Newly added results
					$('#cell'+i).css('color','green');
				}
				$('#cell'+i).val(Math.abs(result[i-1]));
				$('#cell'+i).prop('readonly',true);
			}

			updateUI(true);
		}
	}
	else{
		alert('Unable to connect to server. Check internet connection');
	}

	
};


var upload1D = function(){
	var fields,fileBox,newFile,validFile,fileReader,i;
	fileBox = $('#input1D');
	fileBox.click();

	fileBox.on('change',function(){
		newFile = fileBox[0].files[0];
		validFile = true;
		validFile = validFile && newFile.size==81
		validFile = validFile && newFile.type=="text/plain"

		if(!validFile){
			alert('File should be in text format and of size 81 bytes');
			return ;
		}

		fileReader = new FileReader();
		fileReader.onload = function(e){
			fields = e.target.result;
			for(i=1;i<=81;i++){
				if(fields[i]=='.'){
					$('#cell'+i).val("");
				}
				else{
					$('#cell'+i).val(fields[i]);
				}
			}
		}
		fileReader.readAsText(newFile);
	});
}

var requestSolution = function(){
	$('#solve').text('Loading solution...')
	$.ajax({
		url:'/sudoku',
		type:'POST',
		data: parseFields(),
		contentType: 'application/json; charset=utf-8',
		success: displayResult
	});
}

$(document).ready(function(){
	$('#solve').click(requestSolution);
	$('#upload-1D').click(upload1D);
});
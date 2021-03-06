var parseFields = function(){
	var i;
	var values = [];
	for(i=1;i<=81;i++){
		values.push($('#cell'+i).val());
	}
	return JSON.stringify(values);
}

var updateUI = function(state,param){
	var i;
	// If state is true, then param is time taken. Else, it is the list of error cells
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
		$('#timeTaken').text('Time taken : '+param+'ms');
	}
	else{
		if(param){
			for(i=1;i<=81;i++){
				if(param.indexOf(i)>-1){
					$('#cell'+i).css('background-color','red');
				}
			}
		}
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
			updateUI(false,result['cells']);
		}
		else{
			for(i=1;i<=81;i++){
				if(result['solution'][i-1]>0){
					// Newly added results
					$('#cell'+i).css('color','green');
				}
				$('#cell'+i).val(Math.abs(result['solution'][i-1]));
				$('#cell'+i).prop('readonly',true);
			}

			updateUI(true,result['timeTaken']);
		}
	}
	else{
		alert('Unable to connect to server. Check internet connection');
	}

	
};


var validFileContent = function(fields){
	fields = fields.trim();
	return /^[.1-9]*$/.test(fields);
}

var upload1D = function(){
	var fields,fileBox,newFile,validFile,fileReader,i;
	fileBox = $('#input1D');
	fileBox.click();

	fileBox.on('change',function(){
		newFile = fileBox[0].files[0];
		fileReader = new FileReader();
		fileReader.onload = function(e){
			fields = e.target.result.trim();
			if(newFile.size<=100 && validFileContent(fields)){
				for(i=1;i<=81;i++){
					if(fields[i-1]=='.'){
						$('#cell'+i).val("");
					}
					else{
						$('#cell'+i).val(fields[i-1]);
					}
				}
			}
			else{
				alert('File should be smaller than 100 bytes and follow pattern syntax');
			}
			fileBox.val(null);
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
	$('.cell').focus(function(){
		$('.cell').css('background-color','white');
	})
});
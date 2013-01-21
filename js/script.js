var dimension = 50;
var chanceOfLiveCell;
var genTime = 250;
var generation;
var cellCount;
var table;
var cells;
var playing = false;


(function(){
	board = $('#board');
	btn = $('#button');
	gen = $('#generation');
	cc = $('#cellcount');
	initializeGame();
	cells = board.find('td');
	btn.click(function(){
		if (playing == false){
			playing = true;
			btn.text('Stop').addClass('stop');
			setLiveCells();
			setTimeout('playGame()', genTime);
		}
		else{
			stopGame();
			btn.removeClass('stop');
		}
	});
})();


function initializeGame(){
	generation = 0;
	cellCount = 0;
	var boardHtml = [];
	for (var y = 0; y < dimension; y++){
		boardHtml.push('<tr>');
		for (var x = 0; x < dimension; x++){
			boardHtml.push('<td></td>');
		}
		boardHtml.push('</tr>');
	}
	boardHtml = boardHtml.join('');
	board.append(boardHtml);
	gen.text(generation);
	cc.text(cellCount);
	btn.text('Start')
}

function setLiveCells(){
	generation = 1;
	cellCount = 0;
	chanceOfLiveCell = (1- $('#chance').val()/100);
	for (var y = 0; y < dimension; y++){
		for (var x = 0; x < dimension; x++){
			var cell = getCell(x, y);
			if (Math.random() > chanceOfLiveCell){
				cell.addClass('alive');
				cellCount++;
			}
			else{
				cell.removeClass('alive');
			}
		}
	}
	gen.text(generation);
	cc.text(cellCount);
}

function playGame(){
	if (playing == true){
		prepareNextGen();
		renderNextGen();
		setTimeout('playGame()', genTime);
	}
}

function stopGame(){
	playing = false;
	btn.text('Start');
}

function prepareNextGen(){
	for (var y = 0; y < dimension; y++){
		for (var x = 0; x < dimension; x++){
			var cell = getCell(x, y);
			var neighbors = getLiveNeighborCount(x, y);

			cell.attr('isalive', false);
			if (isCellAlive(x, y)){
				if (neighbors === 2 || neighbors === 3){
					cell.attr('isalive', 'true');
				}
			}
			else if (neighbors === 3){
				cell.attr('isalive', 'true');
			}
		}
	}
}

function renderNextGen(){
	cellCount = 0;
	generation++;
	cells.each(function(){
		var cell = $(this);
		cell.removeClass('alive');
		if (cell.attr('isalive') === 'true'){
			cell.addClass('alive');
			cellCount++;
		}
		cell.removeAttr('isalive');
		});
	if (cellCount == 0){
		stopGame();
		if (generation == 2){
			alert("Your species died out after just 1 generation. That sucks...");
		}
		else{
			alert("Your species died out after " + (generation-1) + " generations.");	
		}
	}
	$('#generation').text(generation);
	$('#cellcount').text(cellCount);
}

function getCell(x, y){
	if (x >= dimension){x = 0;}
	if (y >= dimension){y = 0;}
	if (x < 0){x = dimension -1;}
	if (y < 0){y = dimension -1;}
	return $(cells[y * dimension + x]);
}

function getLiveNeighborCount(x, y){
	var count = 0;
	if (isCellAlive(x-1, y+1)) {count++;}
	if (isCellAlive(x, y+1)) {count++;}
	if (isCellAlive(x+1, y+1)) {count++;}
	if (isCellAlive(x-1, y)) {count++;}
	if (isCellAlive(x+1, y)) {count++;}
	if (isCellAlive(x-1, y-1)) {count++;}
	if (isCellAlive(x, y-1)) {count++;}
	if (isCellAlive(x+1, y-1)) {count++;}
	return count;
}

function isCellAlive(x, y){
	return getCell(x, y).attr('class') === 'alive';
}
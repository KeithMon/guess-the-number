// Add focus to the input field on page load (for convenience):
function onPageLoad(focusId) {
	document.getElementById(focusId).focus();	
}

// Cancel page refresh on button submit (this is a work-around so the user can press ENTER to submit their guess):
function cancelDefaultAction(e) {
	var evt = e ? e:window.event;
	if (evt.preventDefault) evt.preventDefault();
	evt.returnValue = false;
	return false;
}

// Create a scoping function (it will immediately execute): 
(function(){
	// Define common variables (these are "global" within our scoping function):
	var ranNum = 0;
	var guesses = 0;
	var range = document.getElementById("range");
	var button = document.getElementById("button");
	var input = document.getElementById("input");
	var result = document.getElementById("result");
	var between = document.getElementById("between");
	var paragraph = document.getElementById("paragraph");
	var sessionScoreTable = document.getElementById("sessionScore");
	var gameGuessesTable = document.getElementById("gameGuesses");
	var gameGuesses = new Array();

	// Add event listeners that launch their appropriate functions:
	button.addEventListener("click", guess);
	range.addEventListener("click", newRanNum);

	// Create a random number given a range:
	function newRanNum() {
		// Capture the user-updated range value:
		numRange = range.value;
		// Update the display to show the correct range:
		between.innerHTML = "Guess between 1 and " + numRange;
		// Apply focus to the input for easy keyboard guessing:
		input.focus();
		// Generate random number using the range provided:
		ranNum = Math.floor((Math.random()*numRange)+1);
		// Output the random number to the console (just for fun):
		console.log(ranNum);
	}

	// Update the display:
	function display(className, removeMsg, msg1, msg2) {
		if(!msg2){msg2 = "";}
		
		// Empty the input and add focus back to it:
		input.value = "";
		input.focus();

		result.innerHTML = msg1;
		paragraph.innerHTML = msg2;
		result.className = className;

		// Remove message after .75 second when "removeMsg" = true:
		if( removeMsg ) {
			setTimeout(emptyResult, 750);
			function emptyResult() {
				result.innerHTML = "";
				paragraph.innerHTML = "";
			}
		}
	}

	// Track all the guesses for a single game and add them to a table on the page:
	function updateGameGuesses(guessNumber, upDown) {
		var guessVars = [guessNumber, upDown];
		// Store all the guesses for one game:
		gameGuesses[gameGuesses.length] = guessVars;

		resetGameGuessesTable();

		for ( var i = 0; i < gameGuesses.length; i++ ) {
			var singleGuess = gameGuesses[i],
			tr = document.createElement("tr"),
			td0 = document.createElement("td"),
			td1 = document.createElement("td");
				
			td0.appendChild(document.createTextNode(singleGuess[0]));
			td1.appendChild(document.createTextNode(singleGuess[1]));
			tr.appendChild(td0);
			tr.appendChild(td1);
			gameGuessesTable.appendChild(tr);
		}
	}

	function resetGameGuessesTable() {
		// Removes all rows from Game Guesses table:
		while (gameGuessesTable.hasChildNodes()) {
			   gameGuessesTable.removeChild(gameGuessesTable.lastChild);
		}
	}

	// Check if the value passed is a number (true or false):
	function isNumber(o) {
		return ! isNaN (o-0) && o !== null && o !== "";
	}

	// This is the primary guess function. It checks the guess against the random number generated above and then displays the appropriate message. The game will reset when the user guesses correctly:
	function guess() {
		// Capture the guess value:
		var inputValue = document.getElementById("input").value;
		
		// Verify the guess is a number using the previously defined function (isNumber()):
		var isNum = isNumber(inputValue);
		if ( isNum === false) {
			guesses += 1;
			display("red", true, "You must enter a number!");
			updateGameGuesses(inputValue, "Not a number");

		// Was the guess too low?
		} else if ( inputValue < ranNum ) {
			guesses += 1;
			display("yellow", true, "Too low");
			updateGameGuesses(inputValue, "Too low");

		// Was the guess too high?
		} else if ( inputValue > ranNum ) {
			guesses += 1;
			display("yellow", true, "Too high");
			updateGameGuesses(inputValue, "Too high");

		// Was the guess correct?
		} else if (ranNum == inputValue) { 
			guesses += 1;
			// Display a message if the user guessed correctly on their first try:
			if(guesses === 1) {
				display("blue", false, "You got it! The number was " + ranNum + ". It only took you one guess!", "Start again (it's ready).");
			// Display a message if the user required 2 or more guesses:
			} else {
				display("blue", false, "You got it! The number was " + ranNum + ". It took you " + guesses + " guesses.", "Start again (it's ready).")
			}
			updateGameGuesses(inputValue, "Correct");

			// For this one game, that was guessed correctly, store the game stats:
			var gameStat = [numRange, ranNum, guesses];
			// Add the game stat to an array that persists for the window session (is emptied after a page refresh):
			var sessionScore = new Array();
			sessionScore[sessionScore.length] = gameStat;

			// Display the Session Scores in a table:
			for( var i = 0; i < sessionScore.length; i++ ) {
				var gameStat = sessionScore[i],
				tr = document.createElement("tr"),
				td0 = document.createElement("td"),
				td1 = document.createElement("td"),
				td2 = document.createElement("td");

				td0.appendChild(document.createTextNode("1 to " + gameStat[0]));
				td1.appendChild(document.createTextNode(gameStat[1]));
				td2.appendChild(document.createTextNode(gameStat[2]));
				tr.appendChild(td0);
				tr.appendChild(td1);
				tr.appendChild(td2);
				sessionScoreTable.appendChild(tr);
			}

			// Reset the game:
			resetGameGuessesTable();
			gameGuesses.length = 0;
			gameStat = 0;
			guesses = 0;
			newRanNum();
		}
	}

	// Generate a random number the first time the page loads:
	newRanNum();
})();
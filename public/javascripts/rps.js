/**
 * @author Kevin
 */

// Some basic information that only needs to be read once
var match_id
var player_name
var player_id

// Dynamic fields
var inviteLinkBox
var announcer

// Player choices
var player_choice
var opponent_choice

function main(){
	
	// Get some initial information
	match_id = document.getElementById("match_id").innerHTML;
	player_name = document.getElementById("player_name").innerHTML;
	player_id = document.getElementById("player_id").innerHTML;
	inviteLinkBox = document.getElementById("invite_link_box");
	announcer = document.getElementById("announcer");
	
	// When you join a game, tell the server you're in it.
	registerWithServer();
	
	// Populate invite link box
	inviteLinkBox.value = document.URL;
	
	// Check to see if host has left the room
	checkDeath();
	
	// Game loop for rock paper scissors
	gameLoop();
    
    
}


/* registerWithServer
 * Tell's server you have connected
 * If the room is full, kick you out. Otherwise, play.
 * handler - handleRegisterWithServer
 */
function registerWithServer() {
	
	// Sends a query to "../query/register/:id/:player_id/:salt"
	var url = "../query/register";
	url = url + "/" + match_id;
	url = url + "/" + player_id;
	url = url + "/" + Math.round(Math.random()*100000 + 1);
	new Ajax.Request(url, {
		asynchronous: true,
		evalScripts: true,
		method: 'get',
		onComplete: function(request){
			handleRegisterWithServer(request);
		}
	});
	
	// Display your name
	document.getElementById("player_header").innerHTML = player_name;
	return false;
}

/* handleRegisterWithServer
 * params['request'] - response from server query
 * If the match is full, redirects you to the matches page.
 */
function handleRegisterWithServer(request) {
	if (request.responseText == "FAIL") {
		alert ("This match is full.");
		window.location = "../matches";
		return false;
	}
}

/* unregisterWithServer
 * Runs when you leave the page (closing the tab, navigate to another URL, etc.)
 * Tells server you left, free up a slot, and close the room if necessary.
 * Handler - handleUnregisterWithServer
 */
function unregisterWithServer() {
	var url = "../query/unregister";
	url = url + "/" + match_id;
	url = url + "/" + player_id;
	url = url + "/" + Math.round(Math.random()*10000000 + 1);
	new Ajax.Request(url, {
		asynchronous: false,
		evalScripts: true,
		method: 'get',
		onComplete: function(request) {
			handleUnregisterWithServer(request);
		}
	});
	return false;
}

/* handleUnregisterWithServer
 * params['request'] - response from server query
 * If the host left the room, kill the match and kick any other players out
 */
function handleUnregisterWithServer(request) {
	if (request.responseText == "kill") {
		killMatch();
	}
	else if (request.responseText == "slow_kill") {
		setupKillMatch();
	}
}

/* killMatch
 * Tells server to kill the match immediately
 */
function killMatch() {
	var url = "../query/kill";
	url = url +"/" + match_id;
	
	new Ajax.Request(url, {
		asynchronous: false,
		evalScripts: true,
		method: 'get'
	});
	return false;
}

/* setupKillMatch
 * Tells the server to flag the match for death
 * Used to kick the non-host out of the match
 */
function setupKillMatch() {
	var url = "../query/setup_kill";
	url = url + "/" + match_id;
	new Ajax.Request(url, {
		asynchronous: true,
		evalScripts: true,
		method: 'get'
	});
	return false;
}

/* gameLoop
 * Main game loop
 */
function gameLoop() {
	
	// Are there two players and are they ready to play?
	announcer.innerHTML = "Waiting for players...";
	readyToStart();
	
}

/* checkDeath
 * Checks the server to see if the match is flagged to die
 * handler - handleCheckDeath
 */
function checkDeath() {
	var url = "../query/check_death";
	url = url + "/" + match_id;
	url = url + "/" + Math.round(Math.random() * 1000000 + 1);
	
	new Ajax.Request(url, {
		asynchronous: true,
		evalScripts: true,
		method: 'get',
		onComplete: function(request){
			handleCheckDeath(request)
		}
	});
	return false;
}

/* handleCheckDeath
 * params['request'] - response from server query
 * If match is flagged to die, kick player_2 and kill the match
 * Otherwise, check again in two seconds
 */
function handleCheckDeath(request) {
	if (request.responseText == "yes") {
		alert ("The host has left. Room closing.");
		killMatch();
		window.location = "../matches";
	}
	else {
		setTimeout("checkDeath()", 2000);
	}
}

/* readyToStart
 * Queries server if there are two players and they are both ready
 *     to start
 * handler - handleReadyToStart
 */
function readyToStart() {
	var url = "../query/ready_to_start";
	url = url + "/" + match_id;
	url = url + "/" + Math.round(Math.random()*1000000+1);
	
	new Ajax.Request(url, {
		asynchronous: true,
		evalScripts: true,
		method: 'get',
		onComplete: function(request){
			handleReadyToStart(request)
		}
	});
	return false;
}

/* handleReadyToStart
 * params['request'] - response from server query
 * If both players are ready, continue the game loop
 * Otherwise, check again in 1.5 seconds
 */
function handleReadyToStart(request) {
	// "yes" means both are ready
	if (request.responseText == "yes") {
		
		// Display the opponent's name
		getOpponent();
		
		// Enable clicking the choices
		var rockButton = document.getElementById("rock_button");
		var paperButton = document.getElementById("paper_button");
	    var scissorButton = document.getElementById("scissor_button");
		
	    rockButton.addEventListener("click", rockClicked, false);
	    paperButton.addEventListener("click", paperClicked, false);
	    scissorButton.addEventListener("click", scissorClicked, false);		
	
		// Display how long they have left to choose
		document.getElementById("announcer").innerHTML = "You have <b>5</b> seconds to choose your move!";
		setTimeout("setAnnounce('You have <b>4</b> seconds to chose your move!')", 1000);
		setTimeout("setAnnounce('You have <b>3</b> seconds to chose your move!')", 2000);
		setTimeout("setAnnounce('You have <b>2</b> seconds to chose your move!')", 3000);
		setTimeout("setAnnounce('You have <b>1</b> seconds to chose your move!')", 4000);
		
		// Continue the game loop
		setTimeout("readyToPlay()", 5000);
	}
	else {
		if (request.responseText == "left") {
			// The other player left...he chickened out
			// Reset scores and change name to Waiting...
			document.getElementById("opponent_header").innerHTML = "Waiting...";
			document.getElementById("player_score").innerHTML = "0";
			document.getElementById("opponent_score").innerHTML = "0";
		}
		
		// Check if there is a new player in 1.5 seconds
		setTimeout("readyToStart()", 1500);
	}
}

/* getOpponent
 * Gets the opponent's name and updates it accordingly.
 * handler - none
 */
function getOpponent() {
	var url = "../query/get_opponent";
	url = url + "/" + match_id;
	url = url + "/" + player_id;
	url = url + "/" + Math.round(Math.random()*100000+1);
	
	new Ajax.Updater('opponent_header', url, {
		asynchronous: true,
		evalScripts: true,
		method: 'get'
	});
	return false;
}

/* readyToPlay
 * Tell the server to prepare the players' choices
 * handler - handleReadyToPlay
 */
function readyToPlay() {
	var url = "../query/ready_to_play";
	url = url + "/" + match_id;
	url = url + "/" + Math.round(Math.random()*1000000+1);
	
	new Ajax.Request(url, {
		asynchronous: true,
		evalScripts: true,
		method: 'get',
		onComplete: function(request){
			handleReadyToPlay(request)
		}
	});
	return false;
}

/* handleReadyToPlay
 * Stop players from changing their choice
 * Continue the game loop
 */
function handleReadyToPlay(request) {
	if (request.responseText == "yes") {
		// disable choice buttons
		var rockButton = document.getElementById("rock_button");
		var paperButton = document.getElementById("paper_button");
	    var scissorButton = document.getElementById("scissor_button");
		
		rockButton.removeEventListener("click", rockClicked, false);
		paperButton.removeEventListener("click", paperClicked, false);
		scissorButton.removeEventListener("click", scissorClicked, false);
		
		announcer.innerHTML = "Get ready to rumble!";
		
		// continue the game loop
		readyToRumble();
	}
}

/* readyToRumble
 * Download the player choices from the server
 * handler - handleReadyToRumble, handleGetPlayerChoice
 */
function readyToRumble() {
	var url_p = "../query/get_player_choice";
	var url_o = "../query/get_opponent_choice";
	var url = "/" + match_id;
	url = url + "/" + player_id;
	url = url + "/" + Math.round(Math.random()*100000+1);
	
	new Ajax.Request(url_o + url, {
		asynchronous: true,
		evalScripts: true,
		method: 'get',
		onComplete: function(request){
			handleReadyToRumble(request)
		}
	});
	
	new Ajax.Request(url_p + url, {
		asynchronous: true,
		evalScripts: true,
		method: 'get',
		onComplete: function(request){
			handleGetPlayerChoice(request)
		}
	});
	
	return false;
}

/* handleReadyToRumble
 * params['request'] - response from server query
 * Downloads opponent choice
 * Continue the game loop.
 */
function handleReadyToRumble(request) {
	opponent_choice = request.responseText;
	
	// Let's rumble! Showdown in 3 seconds.
	startCountDown();
	setTimeout("showHands()", 3000);
	
	// Report winner of battle.
	setTimeout("determineWinner()", 3050);
	
	// Get ready to reset the game
	setTimeout("startResetProcess()", 5000);
}

/* handleGetPlayerChoice
 * params['request'] - response from server query
 * Downloads player choice
 */
function handleGetPlayerChoice(request) {
	player_choice = request.responseText;
}

/* startCountDown
 * Starts countdown to face-off
 */
function startCountDown() {
	setTimeout("setTimer(\"2\")", 1000);
	setTimeout("setTimer(\"1\")", 2000);
	setTimeout("setTimer(\"GO!\")", 3000);
	
	return false;
}

function setTimer(str) {
	document.getElementById("timer").innerHTML = str;
}

/* showHands
 * Display the choices each player made
 */
function showHands() {
	document.getElementById("player_pic").style.background = "url('../images/" + player_choice + ".png') no-repeat center";
	document.getElementById("opponent_pic").style.background = "url('../images/" + opponent_choice + "H.png') no-repeat center";
}

/* determineWinner
 * Ask the server who won.
 * handler - handleDetermineWinner
 */
function determineWinner() {
	var url = "../query/who_won";
	url = url + "/" + match_id;
	url = url + "/" + player_id;
	url = url + "/" + Math.round(Math.random()*1000000+1);
	
	new Ajax.Request(url, {
		asynchronous: true,
		evalScripts: true,
		method: 'get',
		onComplete: function(request){
			handleDetermineWinner(request)
		}
	});
	return false;
}

/* handleDetermineWinner
 * params['request'] - response from server query
 * Displays whether or not if you won, lost, or drew
 * Updates scores accordingly
 */
function handleDetermineWinner(request) {
	if (request.responseText == "player") {
		announcer.innerHTML = "You <b>won</b>!";
		var player_score = document.getElementById("player_score");
		var new_score = parseInt(player_score.innerHTML) + 1;
		player_score.innerHTML = new_score;
	}
	else if (request.responseText == "opponent"){
		announcer.innerHTML = "You <b>lost</b> :(";
		var opponent_score = document.getElementById("opponent_score");
		var new_score = parseInt(opponent_score.innerHTML) + 1;
		opponent_score.innerHTML = new_score;
	}
	else {
		announcer.innerHTML = "It's a <b>draw</b>!";
	}
}

/* startResetProcess
 * Start the countdown to game reset.
 */
function startResetProcess() {
	setTimeout("setAnnounce('Game restarting in <b>3</b> seconds!')", 0);
	setTimeout("setAnnounce('Game restarting in <b>2</b> seconds!')", 1000);
	setTimeout("setAnnounce('Game restarting in <b>1</b> second!')", 2000);
	setTimeout("resetProcess()", 3000);
}

/* resetProcess
 * Reset the timer, clear the choices, 
 * tell the server this player is ready, clear the announcer text,
 * restart game loop
 */
function resetProcess() {
	document.getElementById("timer").innerHTML = 3;
	tellServerReady();
	clearChoices();
	announcer.innerHTML = "";
	gameLoop();
}

function setAnnounce(str) {
	announcer.innerHTML = str;
}

/* tellServerReady
 * Tells the server this client is ready to play again
 */
function tellServerReady() {
	var url = "../query/player_ready";
	url = url + "/" + match_id;
	url = url + "/" + player_id;
	
	new Ajax.Request(url, {
		asynchronous: true,
		evalScripts: true,
		method: 'get'
	});
	return false;
}

/* clearChoices
 * clears the choices
 */
function clearChoices() {
	document.getElementById("player_pic").style.background = "url('../images/questionmark.png') no-repeat center";
	document.getElementById("opponent_pic").style.background = "url('../images/questionmark.png') no-repeat center";
}

/* save
 * Tells the server this client's choice / salt
 */
function save(choice, salt) {
	var url = "../query/save";
	url = url + "/" + match_id;
	url = url + "/" + player_id;
	url = url + "/" + choice;
	url = url + "/" + salt;
	
	new Ajax.Request(url, {
		asynchronous: true,
		evalScripts: true,
		method: 'get'
	});
	return false;
}

/* Choice Event Handlers
 * Change the picture to the respective choice made.
 * Generate a 5 digit salt to append to the choice.
 * Then, make hash the resultant string with md5.
 * Report server the salt and hash. This is a preventative
 * measure against cheating.
 */
function rockClicked() {
	var pic = document.getElementById("player_pic");
	pic.style.background = "url('../images/rock.png') no-repeat center";
	salt = generateSalt(5);
	choice = hex_md5(salt + "Rock");
	save(choice, salt);
}

function paperClicked(){
	var pic = document.getElementById("player_pic");
	pic.style.background = "url('../images/paper.png') no-repeat center";
	salt = generateSalt(5);
	choice = hex_md5(salt + "Paper");
	save(choice, salt);
}

function scissorClicked(){
	var pic = document.getElementById("player_pic");
	pic.style.background = "url('../images/scissors.png') no-repeat center";
	salt = generateSalt(5);
	choice = hex_md5(salt + "Scissor");
	save(choice, salt);
}

/* generateSalt
 * Generates a 5 digit long salt.
 */
function generateSalt(x) {
	var str = "";
	var i = 0;
	while (i < x) {
		var rand = Math.round(Math.random()*9);
		str = str + rand;
		i = i + 1;
	}
	return str;
}

/* unload
 * If you leave the page, tell the server that.
 */
function unload() {
	unregisterWithServer();
}

window.addEventListener("load", main, false);
window.addEventListener("unload", unload, false);



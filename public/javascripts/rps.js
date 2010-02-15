/**
 * @author Kevin
 */


var match_id
var player_name
var player_id

var ready_to_start;
var ready_to_play;
var ready_to_rumble;

var inviteLinkBox
var announcer

var opponent_choice

function main(){
	
	match_id = document.getElementById("match_id").innerHTML;
	player_name = document.getElementById("player_name").innerHTML;
	player_id = document.getElementById("player_id").innerHTML;
	inviteLinkBox = document.getElementById("invite_link_box");
	announcer = document.getElementById("announcer");
	
	registerWithServer();
	inviteLinkBox.value = document.URL;
	checkDeath();
	
	gameLoop();
    
    
}


function registerWithServer() {
	var url = "../query/register";
	url = url + "/" + match_id;
	url = url + "/" + player_id;
	new Ajax.Request(url, {
		asynchronous: true,
		evalScripts: true,
		method: 'get',
		onComplete: function(request){
			handleRegisterWithServer(request);
		}
	});
	
	document.getElementById("player_header").innerHTML = player_name;
	return false;
}

function handleRegisterWithServer(request) {
	if (request.responseText == "FAIL") {
		alert ("This match is full.");
		window.location = "../matches";
		return false;
	}
}

function unregisterWithServer() {
	var url = "../query/unregister";
	url = url + "/" + match_id;
	url = url + "/" + player_id;
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

function handleUnregisterWithServer(request) {
	if (request.responseText == "kill") {
		killMatch();
	}
	else if (request.responseText == "slow_kill") {
		setupKillMatch();
	}
}

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

function gameLoop() {
	
	// Check if game is still alive
	
	// Are there two players and are they ready to play?
	announcer.innerHTML = "Waiting for players...";
	ready_to_start = false;
	readyToStart();
	
}

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

function handleReadyToStart(request) {
	if (request.responseText == "yes") {
		ready_to_start = true;
		getOpponent();
		
		var rockButton = document.getElementById("rock_button");
		var paperButton = document.getElementById("paper_button");
	    var scissorButton = document.getElementById("scissor_button");
		
	    rockButton.addEventListener("click", rockClicked, false);
	    paperButton.addEventListener("click", paperClicked, false);
	    scissorButton.addEventListener("click", scissorClicked, false);		
	
		document.getElementById("announcer").innerHTML = "You have 5 seconds to choose your move!";
		
		setTimeout("readyToPlay()", 5000);
	}
	else {
		setTimeout("readyToStart()", 1500);
	}
}

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

function readyToPlay() {
	var url = "../query/ready_to_play";
	url = url + "/" + match_id;
	
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

function handleReadyToPlay(request) {
	if (request.responseText == "yes") {
		ready_to_play = true;
		var rockButton = document.getElementById("rock_button");
		var paperButton = document.getElementById("paper_button");
	    var scissorButton = document.getElementById("scissor_button");
		
		rockButton.removeEventListener("click", rockClicked, false);
		paperButton.removeEventListener("click", paperClicked, false);
		scissorButton.removeEventListener("click", scissorClicked, false);
		
		announcer.innerHTML = "Get ready to rumble!";
		
		readyToRumble();
	}
}

function readyToRumble() {
	var url = "../query/ready_to_rumble";
	url = url + "/" + match_id;
	url = url + "/" + player_id;
	url = url + "/" + Math.round(Math.random()*100000+1);
	
	new Ajax.Request(url, {
		asynchronous: true,
		evalScripts: true,
		method: 'get',
		onComplete: function(request){
			handleReadyToRumble(request)
		}
	});
	return false;
}

function handleReadyToRumble(request) {
	ready_to_rumble = true;
	opponent_choice = request.responseText;
	
	// Let's rumble! Showdown in 3 seconds.
	startCountDown();
	setTimeout("showHands()", 3000);
	
	// Report winner of battle.
	setTimeout("determineWinner()", 3050);
	
	// Get ready to reset the game
	setTimeout("startResetProcess()", 5000);
}

function startCountDown() {
	setTimeout("setTimer(\"2\")", 1000);
	setTimeout("setTimer(\"1\")", 2000);
	setTimeout("setTimer(\"GO!\")", 3000);
	
	return false;
}

function setTimer(str) {
	document.getElementById("timer").innerHTML = str;
}

function showHands() {
	document.getElementById("opponent_pic").style.background = "url('../images/" + opponent_choice + ".png') no-repeat center";
}

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

function handleDetermineWinner(request) {
	
	if (request.responseText == "player") {
		announcer.innerHTML = "You <b>won</b>!";
	}
	else if (request.responseText == "opponent"){
		announcer.innerHTML = "You <b>lost</b> :(";
	}
	else {
		announcer.innerHTML = "It's a <b>draw</b>!";
	}
}

function startResetProcess() {
	setTimeout("setAnnounce('Game restarting in <b>4</b> seconds!')", 1000);
	setTimeout("setAnnounce('Game restarting in <b>3</b> seconds!')", 2000);
	setTimeout("setAnnounce('Game restarting in <b>2</b> seconds!')", 3000);
	setTimeout("setAnnounce('Game restarting in <b>1</b> second!')", 4000);
	setTimeout("resetProcess()", 5000);
}

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

function clearChoices() {
	document.getElementById("player_pic").style.background = "url('../images/questionmark.png') no-repeat center";
	document.getElementById("opponent_pic").style.background = "url('../images/questionmark.png') no-repeat center";
}

function sleep(milliseconds) {
	var start = new Date().getTime();
	while ((new Date().getTime() - start) < milliseconds){
	// Do nothing
	}
}

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

function unload() {
	unregisterWithServer();
}

window.addEventListener("load", main, false);
window.addEventListener("unload", unload, false);



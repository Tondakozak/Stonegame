var pages = new Pages(); // new pages object
var user = new User(); // new user object


// on reloading page check if the user is logged in
if (localStorage.getItem("login") !== null) {
    user.login(localStorage.login); // log in
}

/* *                register the user events            * */
// event of submiting signup form
document.getElementById("signupForm").onsubmit = function() {
    user.signupSend();
    return false;
};
// even tof submiting login form
document.getElementById("loginForm").onsubmit = function() {
    user.loginSend();
    return false;
};

// clicking on log out button
document.getElementById("account-logout").onclick = function() {
    user.logout();
};

// on the changing of the address
window.onhashchange = function() {
    pages.hashChanging(); // display/hide parts of the page
};

// On load page, if there is a hash in the adress, call hashChanging function
if (location.hash) {
    pages.hashChanging();
    pages.previousHash = location.hash;
}

// adding events to nav. elements
for (var i = 0; i < pages.eventsElements.length; i++) (function(i) { // anonymous function for the scope of i
    document.getElementById(pages.eventsElements[i][0]).onclick = function() {
        if (location.hash === document.getElementById(pages.eventsElements[i][0]).getAttribute("href")) {// hide the page
            location.hash = "#blank";
        } else { // show the page
            location.hash = "#"+pages.eventsElements[i][1];
        }
        return false;
    };
})(i); 

document.getElementById("showMoreDetails").onclick = function() {
    pages.showHideMoreDetails();
};
document.getElementById("moreDetailsLegend").onclick = function() {
    pages.showHideMoreDetails();
};

document.getElementById("email-input").oninput = function() {
    user.validateEmail();
};


/*     ******              Game                ******        */
preparingGame(user, false);

/**
 * Prepare new game
 * @param {object} user User object
 * @param {boolean} start is the first game
 * @returns {undefined}
 */
function preparingGame(user, start) {
    var myGame = new Game(); // new Game object
    myGame.setUserId(user); // put userId to Game object for communication
    user.setGameId(myGame); // put gameId to User object
    
        
    // set pages of the game to initial state
    document.getElementById("gamePage").style.display = "block";
    document.getElementById("gameDefaultPage").style.display = "block";
    document.getElementById("gameStartPage").style.display = "none";
    document.getElementById("gameEndPage").style.display = "none";
    
            /*     *** events  ***    */
    // keyboard controlling
    document.onkeydown = function(e) { // on pressing key
        myGame.keyboardControlling(e, "down");
        //return false;
    };
    document.onkeyup = function(e) { // on realasing the key
        myGame.keyboardControlling(e, "up");
    };
    
    // click to pause button
    document.getElementById("gamePlayPause").onclick = function() {
        myGame.playPause();
    };
    
    // click to Start button on default page
   document.getElementById("gameDefaultStartButton").onclick = function() {
        myGame.startGame();
    };
    // click to Play button on Start page
    document.getElementById("gameStartPlayButton").onclick = function() {
        document.getElementById("gameStartPage").style.display = "none";
        myGame.beginningGame();
    };
    
    // click to Buy ball button
    document.getElementById("gameBuyingBuyButton").onclick = function() {        
        myGame.buyBall();
        myGame.updateBuyBallButton();
    };
    
    // click to Play Again button on end page
    document.getElementById("gameEndPlayButton").onclick = function() {
        var userId = myGame.userDetails.id;
        preparingGame(userId, true); // prepare new game
        delete myGame; // delete the old object to save memory
    };
    
    // Controls
    document.getElementById("gameControlLeft").onmousedown = function() {
        myGame.pedals("left", "down");
    };
    document.getElementById("gameControlLeft").ontouchstart = function() {
        myGame.pedals("left", "down");
    };
    
    document.getElementById("gameControlRight").onmousedown = function() {
        myGame.pedals("right", "down");
    };
    document.getElementById("gameControlRight").ontouchstart = function() {
        myGame.pedals("right", "down");
    };
    
    document.getElementById("gameControlLeft").onmouseup = function() {
        myGame.pedals("left", "up");
    };
    document.getElementById("gameControlLeft").ontouchend = function() {
        myGame.pedals("left", "up");
    };
    
    document.getElementById("gameControlRight").onmouseup = function() {
        myGame.pedals("right", "up");
    };
    document.getElementById("gameControlRight").ontouchend = function() {
        myGame.pedals("right", "up");
    };
    
    
        
    /*      *****  Generating first part of the game ****      */ 
    for (var i = 0; i < myGame.canvas.height*2 / myGame.step.size; i++) {
        myGame.generateStep();
    }
    
    
    
    myGame.level = 1; // set level to one    
    myGame.playing = true; // set to play
    
    if (start) { // if it is not first game, skip start page
        myGame.startGame();
    }
}


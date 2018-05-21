function User() {
    this.gameId; // game Object reference
    
    this.users = JSON.parse(localStorage.getItem("users")) || new Array("users", "login", "local"); // list of all users
    
    // details of logged user
    this.user = {};
    this.user.name; // real name
    this.user.userName; // login name
    this.user.score; // score
    this.user.meters; // max reached meters
    this.user.coins; // collected coins
    this.user.balls; // having balls
    this.user.levels; // max level
    
    
    // for local user (without registration)
    if (localStorage.getItem("local") === null) {
        localStorage.setItem("local", JSON.stringify({userName: "local", name: "Anonymous", score: 0, meters: 0,coins: 0, balls: 0, levels: 0}));
    }
    // load data for local user
    var userDetails = JSON.parse(localStorage.getItem("local"));
    this.user = userDetails;
    
}
/**
 * Set reference to Game object
 * @param {type} game
 * @returns {undefined}
 */
User.prototype.setGameId = function(game) {
    this.gameId = game;
};

/**
 * Update the score (after game)
 * @param {type} score
 * @param {type} meters
 * @param {type} balls
 * @param {type} coins
 * @param {type} levels
 * @returns {undefined}
 */
User.prototype.updateDetails = function(score, meters, balls, coins, levels) {
    this.user.score = (score > this.user.score)?score:this.user.score;
    this.user.meters = (meters > this.user.meters)?meters:this.user.meters;
    this.user.balls = balls;
    this.user.coins = coins;
    this.user.levels = levels;
    this.saveDetails(); // save details to local storage
    
    this.updateAccount(); // update account page
    bestPlayersTable(); // update best players table
};
/**
 * On submiting login form
 * @returns {Boolean}
 */
User.prototype.loginSend = function() {
    var isValid = this.validateForm("loginForm"); // validate the form
    if (isValid) {
        var username = document.getElementById("loginForm").username.value.trim().toLowerCase(); // get userName
        this.login(username); // log in
    }
    return false; // prevent sending the form
};

/**
 * Load the user details from LS and set it as the details to the object
 * @param {String} userName
 * @returns {undefined}
 */
User.prototype.loadUserDetails = function(userName) {
    var userDetails = JSON.parse(localStorage.getItem(userName));
    this.user = userDetails;    
};
/**
 * Update details in user account page
 * @returns {undefined}
 */
User.prototype.updateAccount = function() {
    document.getElementById("accountUsername").innerHTML = this.user.name;
    document.getElementById("accountMeters").innerHTML = this.user.meters + " m";
};
/**
 * Log in user
 * @param {string} userName
 * @returns {undefined}
 */
User.prototype.login = function(userName) {
    // load user details
    this.loadUserDetails(userName);
    
    // Update account page
    this.updateAccount();
    
    localStorage.setItem("login", userName); // set log in
    location.hash = "#account"; // redirect to user's account page
    
    // Change navigation fields
    Website.switchClass(document.getElementById("navLogin"), "nav-hidden"); // hide Log in
    Website.switchClass(document.getElementById("navMyAccount"), "nav-hidden"); // show My Acount
    
    // add user to the DB on server
    if (typeof this.user.id === "undefined") {
        this.addUserToDB(this.user.name, this.user.userName);
    }
};
/**
 * Log out user
 * @returns {undefined}
 */
User.prototype.logout = function() {
    this.user = {}; // destroy old user details
    
    // set Local User
    this.loadUserDetails("local");
    
    localStorage.removeItem("login"); // unset login
    location.hash = "#blank"; // redirect to default page
    
    // change nav fields
    Website.switchClass(document.getElementById("navLogin"), "nav-hidden");
    Website.switchClass(document.getElementById("navMyAccount"), "nav-hidden");    
};

/**
 * Is called when the form for signup is send
 * @returns {Boolean}
 */
User.prototype.signupSend = function() {
    var isValid = this.validateForm("signupForm"); // validate form
    if (isValid) {        
            var username = this.signupSaveDetails(); // save details
            this.login(username); // log in new user
    }
    return false; // prevent sending the form
};

/**
 * Check if the form is filled in correctly
 * @param {String} myForm   Id of validated form
 * @returns {Boolean}
 */
User.prototype.validateForm = function(myForm) {
    Website.hideErrors(); // hide previous error messages
    var isValid = true;
    var errorMessages = new Array();
    
    var el = document.getElementById(myForm); // element obj for the form
    var inputs = el.getElementsByTagName("input"); // all inputs in the form
    
    // check if all inputs are filled in
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].getAttribute("data-required") === "required") { // if the input is required
            if (inputs[i].value.trim() === "") {  // if the field is empty
                inputs[i].className = "invalid";
                isValid = false;
            } else {
                inputs[i].className = "valid";
            }
        }
    }
    if (!isValid) {
        errorMessages.push("Please, fill all the inputs."); // create error message
    }
    
    /*        ********    validating sign up form     ********    */
    /* Checking if the passwords match and the username is not already used*/
    if (myForm === "signupForm") {
        // check if passwords match
        if (el.password.value.trim() !== "") {
            if (el.password.value.trim() != el.password2.value.trim() || el.password2.value.trim() == "") { // passwords don't match
                isValid = false;
                errorMessages.push("Passwords don't match."); // create error message
                // delete values
                el.password.value = "";
                el.password2.value = "";
                
                // set class to invalid
                el.password.className = "invalid";
                el.password2.className = "invalid";
            } else { // passwords match
                // set class to valid
                el.password.className = "valid";
                el.password2.className = "valid";
            }
        }
        // Check if the username is available
        if (el.username.value.trim() !== "" && !this.userNameNotUsed(el.username.value.trim())) { // username is used
            isValid = false;
            errorMessages.push("This username is already used, please choose different one."); // error message
            el.username.className = "invalid"; // set class to invalid
        }  
        
        /*        ********    validating Log In form     ********    */
    } else if (isValid && myForm === "loginForm") {
        var username = el.username.value.toLowerCase().trim();
        var password = el.password.value.trim();
        
        // Validating username
        if (localStorage.getItem(username) === null) { // the username is wrong
            isValid = false;
            errorMessages.push("We cannot find any user with this username"); // error message
            el.username.className = "invalid"; // set input invalid
            
            
            // Validating password
        } else if (!this.passwordVerify(password, JSON.parse(localStorage.getItem(username)).password)) { // password is wrong
            isValid = false;
            errorMessages.push("The password is incorect.");
            el.password.className = "invalid";
            el.password.value = ""; // delete old value
        }
    }
    
    Website.showError(myForm, errorMessages);// show error messages
    
    return isValid; // return if the form is valid
};

User.prototype.validateEmail = function() {
    var emailText = document.getElementById("email-input").value.trim();
   var regex = /^(((("[^"]+")|([-a-z0-9!#$%&’*+_/=?'{|}~]+))\.)*((("[^"]+")|([-a-z0-9!#$%&’*+_/=?'{|}~]+)))+@([-_a-z0-9]*(\.)?)+\.[a-z]+)$/i;
   var resultEl = document.getElementById("email-result");
    if (emailText.search(regex) !== -1) { // is valid
        resultEl.innerHTML = "This is a valid email address";
        resultEl.className = resultEl.className.replace("invalid", "");
        resultEl.className = resultEl.className.replace("valid", "");        
        resultEl.className += " valid";
        
        document.getElementById("email-input").className = "valid";
    } else { // is not valid
        resultEl.innerHTML = "This is NOT a valid email address";
        resultEl.className = resultEl.className.replace("invalid", "");
        resultEl.className = resultEl.className.replace("valid", "");        
        resultEl.className += " invalid";
        document.getElementById("email-input").className = "invalid";
    }
};

/**
 * Check if the username can be register
 * @param {String} userName
 * @returns {Boolean}
 */
User.prototype.userNameNotUsed = function(userName) {
    var notUsed = true;
    for (var i = 0; i < this.users.length; i++) {
        if (this.users[i] === userName.toLowerCase()) { // the username is used
            notUsed = false;
            break;
        }
    }
    return notUsed;
};

/**
 * Save User's details to localStorage
 * @returns {String} user's username
 */
User.prototype.signupSaveDetails = function() {
    var myForm = document.getElementById("signupForm");
    var userName = myForm.username.value.trim().toLowerCase(); // convert username to lower case
    var othersDetails = {};
    var othersElms = document.getElementById("moreDetails").getElementsByTagName("input");
    for (var i = 0; i < othersElms.length; i++) {
        othersDetails[othersElms[i].name] = othersElms[i].value.trim();
    };
    var userDetails = { // set details
        "userName" : userName,
        "name" : myForm.name.value.trim(),
        "password" : this.passwordHash(myForm.password.value.trim()), // hash the password by PHP password_hash() function
        "score" : 0,
        "meters" : 0,
        "coins" : 0,
        "balls" : 0,
        "levels" : 0,
        "othersDetails" : othersDetails
    };
    // save to LS user details
    localStorage.setItem(userName, JSON.stringify(userDetails));
    
    // save to LS new user name
    this.users.push(userName);
    localStorage.setItem("users", JSON.stringify(this.users));
    
    return userName;
};

/**
 * Save current details about user to local Storage
 */
User.prototype.saveDetails = function() {
        var userDetails = JSON.parse(localStorage.getItem(this.user.userName));
        
        // set details
        userDetails.userName = this.user.userName;
        userDetails.name = this.user.name;
        userDetails.score = this.user.score;
        userDetails.meters = this.user.meters;
        userDetails.coins = this.user.coins;
        userDetails.balls = this.user.balls;
        userDetails.levels = this.user.levels;
    
    localStorage.setItem(this.user.userName, JSON.stringify(userDetails)); //save to LS
    this.saveDetailsToDB(); // save to server DB
};
/**
 * Send synchrounous message to server; returns a hashed password
 * @param {String} password
 * @returns {String} Hashed password
 */
User.prototype.passwordHash = function(password) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "ajax/passwordHash.php", false);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("password="+password);
    
    return xhttp.responseText;
};

/**
 * Send synchronous message to server; check if password match the password hash
 * @param {String} password
 * @param {String} passwordHash
 * @returns {Boolean}
 */
User.prototype.passwordVerify = function(password, passwordHash) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "ajax/passwordVerify.php", false);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("password="+password+"&passwordHash="+passwordHash);
    
    if (xhttp.responseText === "true") {
        return true;
    } else {
        return false;
    }
};

/**
 * Send the user details to the server DB
 * @param {String} name
 * @param {String} username
 */
User.prototype.addUserToDB = function(name, username) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "ajax/register.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("user_name="+name);
    
    
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            var result = JSON.parse(this.responseText);
            
            var userDetails = JSON.parse(localStorage.getItem(username.toLowerCase()));
            userDetails.id = result.id;
            userDetails.key = result.myKey;
            
            // save user ID and user key to LS
            localStorage.setItem(username.toLowerCase(), JSON.stringify(userDetails));
        }
    };
};

/**
 * Sent the score to server DB
 * @returns {undefined}
 */
User.prototype.saveDetailsToDB = function() {
    var details = JSON.parse(localStorage.getItem(this.user.userName));
    if (typeof details.id !== "undefined") { // if is registered in DB
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "ajax/updateUserDetails.php", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("id="+details.id+
                "&key="+details.key+
                "&meters="+details.meters+
                "&levels="+details.levels
                );
        // failure during sending is not catched
    }
};

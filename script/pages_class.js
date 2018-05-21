
function Pages() {
    this.previousHash = ""; // previous state of URL
    this.hiddenPages = ["login", "signup", "about", "best", "account", "blank"]; // list of id pages that could be hidden
    
    // list of id elements with event to hide/show page and connected page
    this.eventsElements = new Array (                         
                        ["navLogin", "login"],
                        ["navAbout", "about"],
                        ["navBest", "best"],
                        ["navMyAccount", "account"]);
    
}

/**
 * On changing hash in url - show or hide pages
 * @returns {undefined}
 */
Pages.prototype.hashChanging = function() {
    window.scrollTo(0, 0); // croll to top (prevent crolling when hash is added)
    var id = location.hash.substring(1);
    this.hideOther(id); // hide all pages except for the page of id in url
    if (this.previousHash.length > 2 && this.previousHash !== "#blank") {
        var self = this;
        setTimeout(function() { // wait for other pages hiding
            self.switchPage(id);
        }, 500);
    } else {
        this.switchPage(id);
    }
    
    this.previousHash = location.hash;
};
/**
 * Show/hide page in "page"
 * @param {string} page
 * @returns void
 */
Pages.prototype.switchPage = function(page){
    var el = document.getElementById(page);
    el.className = (el.className === "showed")?"hidden":"showed";
};
/**
 * Hide all pages except for "page"
 * @param {String} page 
 * @returns void
 */
Pages.prototype.hideOther = function(page) {
    /* Hide all other pages */
    for (var i = 0; i < this.hiddenPages.length; i++) { // all pages
        if (this.hiddenPages[i] !== page) {
            if (document.getElementById(this.hiddenPages[i]).className === "showed") { // if it is showed
                document.getElementById(this.hiddenPages[i]).className = "hidden"; // hide
            }
        }
    }
};


Pages.prototype.showHideMoreDetails = function() {
    // switch class
    var el = document.getElementById("moreDetails");
    Website.switchClass(el, "hide");
    
    // change label
    if (el.className.match("hide")) {
        document.getElementById("showMoreDetails").innerHTML = "I want to give you more details.";
    } else {
        document.getElementById("showMoreDetails").innerHTML = "Hide the no-required details";
    }
};


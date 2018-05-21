Website = {
    /**
     * Show error message as a child of given id
     * @param {DOM obj} id
     * @param {Array} errorMessage
     * @returns {void}
     */
    showError : function(id, errorMessage) {
        var error = errorMessage.join("<br>"); // create a string
        
        // create an element for the error messages
        var el = document.getElementById(id);
        var errorEl = document.createElement("div");
        errorEl.innerHTML = error;
        errorEl.className = "errorMessage";
        el.insertBefore(errorEl, el.childNodes[0]);
    },
    /**
     * Delete all errors messages
     * @returns {void}
     */
    hideErrors : function() {
        var errors = document.getElementsByClassName("errorMessage"); // all error elements 
        for (var i = 0; i < errors.length; i++) {
            errors[i].parentNode.removeChild(errors[i]); // delete element
        }
    },
    
    
    random : {
        /**
         * Get random number from min to max
         * @param {Number} min
         * @param {Number} max
         * @returns {Number}
         */
        number : function(min, max) {
        return min + Math.floor(Math.random()* (max+1-min));
        }, 
        /**
         * Get randomly bool value
         * @returns {Boolean}
         */
        bool : function() {
            return (0 === this.number(0, 1));
        },
        
        /**
         * Get randomly bool value, false will be returned more often
         * @returns {Boolean}
         */
        falseBool : function() {
            return (this.number(1, 5) % 2 === 0);
        }
    },

    /**
     * Add or delete class to the element
     * @param {DOM obj} el
     * @param {String} myClass
     * @returns {void}
     */
    switchClass : function(el, myClass) {
        if (el.className.match(myClass)) { // if has myClass
            el.className = el.className.replace(myClass, ""); // remove class
        }
        else {
            el.className += " " + myClass; // add class
        }
    },
    /**
     * Switch between two classes
     * @param {DOM obj} el
     * @param {String} myClass
     * @returns {void}
     */
    switchTwoClasses : function(el, myClass, mySecondClass) {
        if (el.className.match(myClass)) { // if has myClass
            el.className = el.className.replace(mySecondClass, ""); // remove class
            el.className = el.className.replace(myClass, ""); // remove class
            el.className += " "+mySecondClass;
        }
        else {
            el.className = el.className.replace(mySecondClass, ""); // remove class
            el.className = el.className.replace(myClass, ""); // remove class
            el.className += " "+myClass;
        }
    }
};


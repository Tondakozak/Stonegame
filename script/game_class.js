

function Game() {
    this.gameId = null; // reference to this object
    
    this.meterPx = 50; // how many px is one meter
    
    // game map
    this.map = {};
    this.map.width = 8000;
    this.map.halfWidth = this.map.width/2;
    
    // canvases
    this.canvas = {};
    this.canvas.width = 1920;
    this.canvas.halfWidth = this.canvas.width/2;
    this.canvas.height = 1200;
    this.canvas.minRation = 0.4;
    this.perspectivePointY = this.canvas.height*2;
    
    this.canvas.draw = {};
    this.canvas.draw.main = {};
    this.canvas.draw.main.id = "canvasGame";
    this.canvas.draw.main.element = document.getElementById(this.canvas.draw.main.id);
    this.canvas.draw.main.context = this.canvas.draw.main.element.getContext("2d");
    this.canvas.draw.buff = {};
    this.canvas.draw.buff.element = document.createElement("canvas");
    this.canvas.draw.buff.context = this.canvas.draw.buff.element.getContext("2d");
    
    
    // ball
    this.ball = {};
    this.ball.size = 150;
    this.ball.distance = 1.5*this.ball.size;
    this.ball.speed = 10;
    this.ball.defaultSpeed = 10;
    this.ball.x = this.map.halfWidth,
    this.ball.y = this.ball.size, 
    this.ball.r = this.ball.size/2;
    
    // frame
    this.frame = {};
    this.frame.x = this.map.halfWidth - this.canvas.halfWidth;
    this.frame.y = 0;
    
    this.stone = {};
    this.stone.size = 200;
    
    this.step = {};
    this.step.size = 500;
    this.step.current = 1;
    
    this.delay = { // delays for timeouts
        frame: 20,
        draw: 25,
        skipping: 500
    };
    this.timeout = { // storing timeouts references
        draw: null,
        frame: null,
        skipping: null
    };
    
    this.skipping = {};
    this.skipping.is = false;
    this.skipping.speed = this.ball.speed * 5;
    this.skipping.start = "";
    this.skipping.direction = 0;
    
    this.playing = false;
    
    
    
    this.coin = {};
    this.coin.size = 100;
    this.coin.values = [ // coin types
        {value: 5},
        {value: 10},
        {value: 20},
        {value: 50},
        {value: 100},
        {value: 200},
        {value: 500}
    ];
    

    
    /* [x1, x2, height, idOfPrevious]*/
    this.paths = [
        [
            {x1 : this.map.halfWidth-(this.ball.size/2 + 20), // x of left border
            x2 : this.map.halfWidth+(this.ball.size/2 + 20), // x of right border
            y : this.ball.size, // where the path ends vertically
            parentId : 0,
            child: true} // id of the parent path
        ],
        [
            {x1 : this.map.halfWidth-(this.ball.size/2 + 20), // x of left border
            x2 : this.map.halfWidth+(this.ball.size/2 + 20), // x of right border
            y : this.ball.size * 4, // where the path ends vertically
            parentId : 0,
            child: true} // id of the parent path
        ]
    ];
    this.stones = [
        //{x: /*this.map.halfWidth*/1000, y : 0, size: 1}, 
        {x: /*this.map.halfWidth*/170, y : 600, size: this.stone.size},// top left corner of the stone + stone size
    ];
    this.coins = [
        // {x: x, y: y, r: r, value: value, hidden: false},
    ];

    
    this.gameUserDetails = {
        score : 0,
        meters : 0,
        lives : 1,
        coins : 0,
        level : 1
    };
    
    this.userDetails = {
        id : null,
        score : 0,
        meters : 0,
        lives : 0,
        coins : 0,
        level : 0
    };
    
    this.levels = [
        {meters : 0},
        {meters : 200 },
        {meters : 500 },
        {meters : 1100},
        {meters : 1800},
        {meters : 2500},
        {meters : 3200},
        {meters : 4000},
        {meters : 5000},
        {meters : 6200},
        {meters : 7500},
        {meters : 9800},
        {meters : 11000},
        {meters : 15000},
        {meters : 22000},
        {meters : 35000},
        {meters : 49000},
        {meters : 70000},
        {meters : 90000}
    ];
    
    this.controls = {
        left: false,
        right: false
    };

    this.images = {};
    this.loadImages();
    
    /*this.frames = 0;
    this.fTime = Date.now();
    this.vypFrames = 0;
    this.t = new Date();*/
}

/* **************   Before playing   ************** */
/**
 * Save reference to a object to the current game
 * @param {Obj} gameId
 * @returns {undefined}
 */
Game.prototype.setGameId = function(gameId) {
    this.gameId = gameId;
};

/**
 * Set reference to user object and update user details
 * @param {String} user
 * @returns {undefined}
 */
Game.prototype.setUserId = function(user) {
    this.userDetails.id = user;
    this.updateDetails();    // update details
};

/**
 * update userDetails according to current user
 * @returns {undefined}
 */
Game.prototype.updateDetails = function() {
    // update details
    this.userDetails.lives = this.userDetails.id.user.balls;
    this.userDetails.meters = this.userDetails.id.user.meters;
    this.userDetails.coins = this.userDetails.id.user.coins;
    this.userDetails.score = this.userDetails.id.user.score;
    this.userDetails.level = this.userDetails.id.user.levels;
};

/**
 * Set canvas size according to browser size
 * @returns {undefined}
 */
Game.prototype.setCanvasSize = function() {
    var gameField = this.canvas.draw.main.element.parentNode.parentNode; // cover element 
    var windowHeight = document.body.clientHeight; // browser window height
    var gameFieldWidth = parseInt(getComputedStyle(gameField).width); 
    var gameFieldHeight = gameFieldWidth*(this.canvas.height/this.canvas.width);
    
    // if it is out of screen
    if (gameFieldHeight > windowHeight) {
        // if screen is too low
        if (windowHeight < gameFieldWidth*this.canvas.minRation) {
            gameFieldWidth = windowHeight/this.canvas.minRation;
        }
        gameFieldHeight = windowHeight;        
    }
    // rounding
    gameFieldWidth = Math.floor(gameFieldWidth);   
    gameFieldHeight = Math.floor(gameFieldHeight-5); 
    
    // set cover element size
    gameField.style.width = gameFieldWidth+"px";
    gameField.style.height = gameFieldHeight+"px";
    gameField.style.padding = 0;
    
    // set canvas style size
    this.canvas.draw.main.element.style.width = gameFieldWidth+"px";
    this.canvas.draw.main.element.style.height = Math.floor(gameFieldWidth*(this.canvas.height/this.canvas.width))+"px";
    

    // set html attributes to canvases
    this.canvas.draw.main.element.width = this.canvas.width;
    this.canvas.draw.main.element.height = this.canvas.height;
        
    this.canvas.draw.buff.element.width = this.canvas.width;
    this.canvas.draw.buff.element.height = this.canvas.height;
    
    
    gameField.scrollIntoView(false); // scroll to the top of the canvas be visible
    
    
};

/**
 * Load images for the canvas
 * @returns {undefined}
 */
Game.prototype.loadImages = function() {
    // Stone
    this.images.stone = new Image();
    this.images.stone.src = "../img/stone.png";
    
    // Ball
    this.images.ball = {};
    this.images.ball.default = new Image();
    this.images.ball.default.src = "../img/ball.png";
    this.images.ball.skipping = new Image();
    this.images.ball.skipping.src = "../img/skipping-ball.png";
    
    // Coins
    this.images.coins = {};
    for(var i = 0; i < this.coin.values.length; i++) {
        this.images.coins[this.coin.values[i].value] = new Image();
        this.images.coins[this.coin.values[i].value].src = "../img/coins/"+this.coin.values[i].value+".png";
    }
};


/* **************   Generating   ************** */
/**
 * Generate path (fixed gaps between stones)
 * @param {Number} height - distance from the begining
 * @returns {undefined}
 */
Game.prototype.generatePath = function(height) {
    var maxDeviation = this.ball.size * 5;
    var minWidth = this.ball.size * (1 + this.gameUserDetails.level/10);
    var maxWidth = this.ball.size + this.ball.size * 2 - (2*this.gameUserDetails.level);
    
    var mapWidth = this.getMapBorder(height);
    
    var previousPaths = this.paths[this.paths.length-1];
    var newPaths = [];
    
    // create a path for all parents
    for (var i = 0; i < previousPaths.length; i++) {
        if (previousPaths[i].child) { // if parent can have child
            var newDeviation = ((Website.random.bool())?1:-1) * Website.random.number(10, maxDeviation);
            var newPathStart = previousPaths[i].x1 + newDeviation;
            var newPathEnd = newPathStart + Website.random.number(minWidth, maxWidth);
            
            // the path is out of map - left
            var isNearBorder = (newPathStart < this.map.halfWidth-(mapWidth-200) || newPathEnd > this.map.halfWidth+(mapWidth-200));
            if (isNearBorder) { // if is near border, it is turned over
                newPathStart = previousPaths[i].x1 -  newDeviation/2;
                newPathEnd = newPathStart + Website.random.number(minWidth, maxWidth);
            }
            // add path to the array of new paths
            newPaths.push({x1: newPathStart, x2: newPathEnd, y: height, parentId : i, child: true});

            // branching patchs        
            if ((Website.random.falseBool() || Website.random.bool()) && !isNearBorder && newPaths.length < 8) {
                var moving = (newDeviation > 0)? -1 : 1;
                nextPathStart = previousPaths[i].x1 + moving * maxDeviation*0.7;
                nextPathEnd = nextPathStart + Website.random.number(minWidth, maxWidth);
                var isNearBorder = (nextPathStart < this.map.halfWidth-(mapWidth-200) || nextPathEnd > this.map.halfWidth+(mapWidth-200));
                
                if (!isNearBorder) { // if it is near border, branch is deleted
                    newPaths.push({x1: nextPathStart, x2: nextPathEnd, y:height, parentId: i,
                        child: true}); // add to newPaths array
                }           
            }
        }
    }

    // connecting nearest branchest
    for (var i = 0; i < newPaths.length-1; i++) {
        for (var x = i+1; x < newPaths.length; x++ ) {
            if (newPaths[i].child) {
                if (Math.abs(newPaths[i].x1 - newPaths[x].x1) < maxWidth*2) {
                    // if two paths end near each other, they are connected to one
                    newPaths[x].child = false;
                    newPaths[x].x1 = newPaths[i].x1;
                    newPaths[x].x2 = newPaths[i].x2;
                }
            }            
        }
    } 
    // add new paths to paths array
    this.paths.push(newPaths);
};
/**
 * Generate stones
 * @param {Number} height
 * @returns {undefined}
 */
Game.prototype.generateStones = function(height) {
    var mapWidth = this.getMapBorder(height);
    var minGap = this.stone.size * (((height-1000)/-500)+5);
    minGap = (minGap < this.stone.size/2)?this.stone.size/2:minGap;
    var maxGap = this.stone.size* (((height-1000)/-500)+15);
    maxGap = (maxGap < this.stone.size)?this.stone.size:maxGap;
    minGap = Math.floor(minGap*10)/10;
    maxGap = Math.floor(maxGap*10)/10;
    
    // generate stones for a line
    for (x = this.map.halfWidth-mapWidth; x < this.map.halfWidth+mapWidth; x = x + (Website.random.number(minGap, maxGap))) {
        // Collisions with paths (stone cannnot be on a path)
        var size = Website.random.number(this.stone.size/2, this.stone.size);
        var stoneHeight = height - (this.stone.size - size);
        var stonePathsCollision =  (this.collisionPointWithPaths(x, stoneHeight) ||
                this.collisionPointWithPaths(x-size, stoneHeight) ||
                this.collisionPointWithPaths(x, stoneHeight-size) ||
                this.collisionPointWithPaths(x-size, stoneHeight-size));
        // check collision with paths
        if ((!stonePathsCollision && Website.random.falseBool()) || (x == this.map.halfWidth-mapWidth)) {
            // it's not on a path, it is added to a list
            this.stones.push({x: x, y: stoneHeight, size: size});
            
        }
    }
    // for last stone on the border
    this.stones.push({x: this.map.halfWidth+mapWidth - this.stone.size, y: height, size: this.stone.size}); 
    
};

/**
 * Generate coins
 * @param {type} height
 * @returns {undefined}
 */
Game.prototype.generateCoins = function(height) {
    var mapWidth = this.getMapBorder(height);
    var minValue = 5;
    
    // max value - greater distance - greater possibilidad of grater value
    var maxValue = Math.floor((-2100)*Math.pow(1.0001, (-height)) + 2000); // y = ((1.0001^(-x) ) * (-2100)+2000)
    maxValue = (maxValue < minValue)? minValue : maxValue;

    // Generating coins on line
    for (x = this.map.halfWidth-mapWidth; x < this.map.halfWidth+mapWidth; x = x + (Website.random.number(this.coin.size*1.5, (this.coin.size*3)))) {

        // collisions with stones - coins cannot be on stones
        var coinStoneCollision = false;
        for (var i = 0; i < this.stones.length; i++) {
            var c = {x: x, y: height, r: this.coin.size/2};
            var r = {x: this.stones[i].x,  y: this.stones[i].y, w: this.stones[i].size, h: this.stones[i].size};
            var coll = this.collisionRectangleCicle(c, r);
            if (coll) {
                coinStoneCollision = true;
                break;
            }
        }
        // if it is not on a stone, coin can be created
        if (!coinStoneCollision && Website.random.falseBool() && Website.random.falseBool()) {
            // get coin value
            var value = 5;
            var coeficient = Website.random.number(minValue, maxValue); // coeficient is a random number between min and maxValue (maxValue can be greater than max coin Value
            for (var c = 0; c < this.coin.values.length; c++) {
                if (this.coin.values[c].value < coeficient) {
                    value = this.coin.values[c].value;
                }
            }
            this.coins.push({x: x, y: height, r: this.coin.size/2, value: value, hidden: false}); // add coin to the array
        }
    }
};
/**
 * Delete old stones, coins and paths
 * @returns {undefined}
 */
Game.prototype.destroyStep = function() {
    var maxHeight = this.frame.y - 100;
    // delete old paths
    var lastPath = 0;
    for (var i = 0; i < this.paths.length; i++) {
        if (this.paths[i][0].y > maxHeight) {
            lastPath = i-1;
            break;
        }
    }
    this.paths.splice(0, lastPath);
    
    // delete old stones
    var lastStone = 0;
    for (var i = 0; i < this.stones.length; i++) {
        if (this.stones[i].y > maxHeight) {
            lastStone = i-1;
            break;
        }
    }
    this.stones.splice(0, lastStone);
    
    // delete old coins
    var lastCoin = 0;
    for (var i = 0; i < this.coins.length; i++) {
        if (this.coins[i].y > maxHeight) {
            lastCoin = i-1;
            break;
        }
    }
    this.coins.splice(0, lastCoin);
};
/**
 * Generate new part of the map
 * @returns {undefined}
 */
Game.prototype.generateStep = function() {
    var startHeight = this.paths[this.paths.length-1][0].y;
    var endHeight = startHeight + this.step.size;
    // generate paths
    this.generatePath(endHeight);

    // generate stones
    for (var i = startHeight; i < endHeight; i = i + Website.random.number(this.stone.size*0.7, this.stone.size*3)) {
        this.generateStones(i);    
    }
    // generate coins
    for (var i = startHeight; i < endHeight; i = i + Website.random.number(this.coin.size*1.2, this.coin.size*3)) {
        this.generateCoins(i);    
    }
};


/* **************   Collisions   ************** */
/**
 * Find X coordinates of intersection of line defined by p1 and p2, and a horisontal line on which pointY lies
 * @param {Obj} p1
 * @param {Obj} p2
 * @param {Number} pointY
 * @returns {Number}
 */
Game.prototype.intersectionLines = function(p1, p2, pointY) {
    // p1 and p2 {x: x, y: y}
    // algorithm uses similarity of triangles
        var h = p1.y - p2.y;
        var h2 = pointY - p2.y;
        var w = p1.x - p2.x;
        var w2 = w / (h/h2);
        return p2.x + w2;
};
/**
 * Return if the point is in any path
 * @param {Number} pointX
 * @param {Number} pointY
 * @returns {Boolean}
 */
Game.prototype.collisionPointWithPaths = function(pointX, pointY) {
    // find paths in the right height
    var pathStep = 1;
    for (var i = 1; i < this.paths.length; i++) {
        if (this.paths[i][0].y > pointY) {
            pathStep = i;
            break;
        }
    }

    var collision = false;
    // check all paths on the right height
    for (var i = 0; i < this.paths[pathStep].length; i++) {
        thisPath = this.paths[pathStep][i];
        var p1 = {x: this.paths[pathStep-1][thisPath.parentId].x1, y: this.paths[pathStep-1][thisPath.parentId].y};
        var p2 = {x: thisPath.x1, y: thisPath.y};
        var intersecLeft = this.intersectionLines(p1, p2, pointY);

        var p1 = {x: this.paths[pathStep-1][thisPath.parentId].x2, y: this.paths[pathStep-1][thisPath.parentId].y};
        var p2 = {x: thisPath.x2, y: thisPath.y};
        var intersecRight = this.intersectionLines(p1, p2, pointY);

        if (pointX >= intersecLeft && pointX <= intersecRight) {
            collision = true;
            break;
        }
        
    }
    return collision;

};
/**
 * Return if a circle colidate a rectangle
 * @param {Obj} circle {x: x, y: y, r: radius}
 * @param {Obj} rectangle {x: x, y: y, w: w, h: h}
 * @returns {Boolean}
 */
Game.prototype.collisionRectangleCicle = function(circle, rectangle) {
    // circle {x: x, y: y, r: radius}
    // rectangle = {x: x, y: y, w: w, h: h}
    // source: http://stackoverflow.com/questions/21089959/detecting-collision-of-rectangle-with-circle
// return true if the rectangle and circle are colliding
    rectangle.x = rectangle.x - rectangle.w; // change x and y because of reversed displaying
    rectangle.y = rectangle.y - rectangle.h;
    var distX = Math.abs(circle.x - rectangle.x-rectangle.w/2); // vertical distance between circle and rectangle centers
    var distY = Math.abs(circle.y - rectangle.y-rectangle.h/2); // horisontal distance between circle and rectangle centers

    if (distX > (rectangle.w/2 + circle.r)) {
        return false;
    }
    if (distY > (rectangle.h/2 + circle.r)) {
        return false; 
    }

    if (distX <= (rectangle.w/2)) { 
        return true; 
    } 
    if (distY <= (rectangle.h/2)) { 
        return true; 
    }

    var dx = distX-rectangle.w/2;
    var dy = distY-rectangle.h/2;
    return (dx*dx+dy*dy <= (circle.r*circle.r));
};

/**
 * Return if two circles colidate
 * @param {type} circle {x: x, y: y, r}
 * @param {type} circle2 {x: x, y: y, r}
 * @returns {Boolean}
 */
Game.prototype.collisionCircleCircle = function(circle, circle2) {
    // circle = {x: x, y: y, r}
    // c2 = a2 + b2
    // count distance between centers of the circles
    var a = circle.x - circle2.x;
    var b = circle.y - circle2.y;
    var distance = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    return (circle.r + circle2.r > distance);
};

/**
 * Check if the ball collidates any stone
 * @returns {Boolean}
 */
Game.prototype.checkBallStonesCollision = function() {
    var collision = false;
    for (var i = 0; i < this.stones.length; i++) {
        var b = {x: this.ball.x, y: this.ball.y, r: this.ball.r-10};
        var stoneR = this.stones[i].size/2;
        var stone = {x: this.stones[i].x - stoneR, y: this.stones[i].y - stoneR, r: stoneR};
        //var s = {x: this.stones[i].x, y: this.stones[i].y, w: this.stones[i].size, h: this.stones[i].size};
        if (/*this.collisionRectangleCicle(b, s)*/this.collisionCircleCircle(b, stone)) {
            collision = true;
            break;
        }
    }
    
    return collision;
};
/**
 * Check if the ball collidate any Coin, if so, coin is hidden and its value is returned
 * @returns {Number}
 */
Game.prototype.checkBallCoinsCollision = function() {    
    var coinValue = 0;
    var area = {
        x: this.ball.x - this.ball.size * 2,
        y: this.ball.y - this.ball.size * 2
    };
    for (var i = 0; i < this.coins.length; i++) {
        // check only coins in a defined area
        if (this.coins[i].x > area.x && 
            this.coins[i].y > area.y &&
            !this.coins[i].hidden) {                    
                if (this.collisionCircleCircle(this.coins[i], this.ball)) {
                    coinValue += this.coins[i].value;
                    this.coins[i].hidden = true;
                }
        }
    }  
    
    return coinValue;
};


/* **************   Set position   ************** */
/**
 * Set ball position according to current speed and pressing controls
 * @returns {undefined}
 */
Game.prototype.setBallPosition = function() {
    this.ball.y = this.ball.y + this.ball.speed; // vertical position
    // horisontal position
    if (this.controls.left || this.controls.right) {
        this.ball.x = this.ball.x + ( (this.controls.left?1:-1) * this.ball.speed*2); 
        
    }
};
/**
 * Set right left frame corner position according to the ball possition
 * @returns {undefined}
 */
Game.prototype.setFramePosition = function() {
    this.frame.x = this.ball.x - this.canvas.halfWidth;
    this.frame.x = (this.frame.x < 0)? 0:this.frame.x;
    this.frame.x = (this.frame.x+this.canvas.width > this.maxMapWidth)? (this.maxMapWidth - this.canvas.width):this.frame.x;
    this.frame.y = this.ball.y - this.ball.distance;
    this.frame.y = (this.frame.y < 0)? 0 : this.frame.y;
};

Game.prototype.setSpeed = function() {
    var level = (this.userDetails.level > this.gameUserDetails.level)?this.userDetails.level:this.gameUserDetails.level;

    
    this.ball.speed = this.ball.defaultSpeed + level;
    this.skipping.speed = this.ball.speed * 5;

};

/* **************   Get position   ************** */
/**
 * Return relative x position on the frame (rounded over)
 * @param {Number} x
 * @return {Number} new x
 */
Game.prototype.getRealX = function(x) {
    return this.canvas.width - (x - this.frame.x);
};
/**
 * Return relative y position on the frame (rounded over)
 * @param {Number} y
 * @returns {Number} new y
 */
Game.prototype.getRealY = function(y) {
    return this.canvas.height - (y - this.frame.y);
};
/**
 * Return y position in a frame (without rotation)
 * @param {Number} y
 * @returns {Number} new y
 */
Game.prototype.inFrameY = function(y) {
    return y - (this.frame.y);
};
/**
 * Count new position for point in perspective view
 * @param {type} point
 * @returns {Game.prototype.getPerspectivePoint.newPoint}
 */
Game.prototype.getPerspectivePoint = function(point) {
    //http://vzorce-matematika.sweb.cz/vzorce-pro-trojuhelnik-jak-najit-stranu-osu-teznici-vysku-uhel.php
    // point = {x, y};
    if (Math.abs(this.ball.x - point.x) < 2) {
        return point;
    }
    var relativeY = this.inFrameY(point.y);
    // View triangle -> ball.x,frame-bottom - ball.x, perspectivePointY - point.x,frame-bottom
    var viewTr = {};
    viewTr.x = Math.abs(this.ball.x - point.x); // leg
    viewTr.y = this.perspectivePointY; // leg
    viewTr.alpha = Math.atan(viewTr.y/viewTr.x); // alpha angle between legs
    
    var triangle2 = {}; // right angle triangle on base with a right angle in the new point, alpha is the same as view.alpha
    triangle2.beta = Math.PI - viewTr.alpha; // beta angle between a leg and the hypotenuse
    triangle2.hypotenuse = Math.abs(relativeY / Math.tan(triangle2.beta)); // hypotenuse and the base of the triangle
    
    var x = relativeY * Math.sin(viewTr.alpha)*Math.cos(viewTr.alpha); // distance between original x and a new x
    var y = triangle2.hypotenuse * Math.sin(viewTr.alpha)*Math.cos(viewTr.alpha); // distance between original y and a new y
    x = Math.round(x);
    y = Math.round(y);
    
    var newPoint = {};
    x = (point.x > this.ball.x)? x*-1 : x;
    newPoint.x = point.x + x;
    newPoint.y = point.y - y;    
    
    return newPoint; // newPoint = {x, y};
};

/**
 * Return half width of map on the current height
 * @param {Number} distance
 * @returns {Number}
 */
Game.prototype.getMapBorder = function(distance) {
    return Math.round((1-this.map.halfWidth)*Math.pow(1.0018, (-distance)) + this.map.halfWidth);
};


/* **************   Controls   ************** */
/**
 * Set controls to move right/left
 * @param {String} control
 * @param {Boolean} on
 * @returns {undefined}
 */
Game.prototype.setControls = function(control, on) {
    if (on) { // start horisontal moving
        this.controls.left = (control === "left");
        this.controls.right = (control === "right");
    } else { // end of the horisontal moving
        this.controls.left = false;
        this.controls.right = false;
    }
};
/**
 * On pressing a key on a keyboard
 * @param {type} e
 * @param {String} type
 * @returns {undefined}
 */
Game.prototype.keyboardControlling = function(e, type) {
    var event = window.event || e;
    var LEFT = 37;
    var RIGHT = 39;
    var keyCode = event.keyCode;
    var key;
    if (keyCode === LEFT) {
        key = "left";
    } else if (keyCode === RIGHT) {
        key = "right";
    }
    
    if (key === "left" || key === "right") {
        this.setControls(key, (type === "down")); 
        // delete pedals
        document.getElementById("gameControlRight").style.display = "none";
        document.getElementById("gameControlLeft").style.display = "none";
    }
       
};
/**
 * On pressing play/pause button
 * @returns {undefined}
 */
Game.prototype.playPause = function() {
    this.playing = !this.playing;
    if (!this.playing) { // pause the game
        document.getElementById("gamePlayPause").innerHTML = "Play";
    } else { // play the game
        document.getElementById("gamePlayPause").innerHTML = "Pause";
        this.doFrame();
        this.drawFrame();
    }
    
};

Game.prototype.pedals = function(direction, type) {
    this.setControls(direction, (type === "down"));
    
    // add/remove active class
    var el;
    if (direction === "right") {
        el = document.getElementById("gameControlRight");
    } else {
        el = document.getElementById("gameControlLeft");
    }
    el.className = el.className.replace("gameControlsActive", "");
    if (type === "down") {
        el.className += " gameControlsActive";
    }
    
};



/* **************   Draw Scene   ************** */
/* ******   Show labels   ****** */
/**
 * Update label with number of collected coins
 * @returns {undefined}
 */
Game.prototype.showCoinsCollected = function() {
    document.getElementById("gameCollectedCoins").innerHTML = this.gameUserDetails.coins + this.userDetails.coins;
};
/**
 * Update label with number of reached meters
 * @returns {undefined}
 */
Game.prototype.showMeters = function() {
    document.getElementById("gameMetres").innerHTML = this.gameUserDetails.meters + " m <small>("+this.userDetails.meters+" m)</small>";
};
/**
 * Update label showing number of lives/balls
 * @returns {undefined}
 */
Game.prototype.showLives = function() {
    document.getElementById("gameLives").innerHTML = this.gameUserDetails.lives;
};

/* ******   Draw to canvas   ****** */
/**
 * Draw ball
 * @returns {undefined}
 */
Game.prototype.drawBall = function() {
        // position and size
        var x = this.getRealX(this.ball.x)-this.ball.r;
        var y = this.getRealY(this.ball.y)-this.ball.r;
        // create a curve
        //this.canvas.draw.buff.context.arc(this.getRealX(this.ball.x), this.getRealY(this.ball.y), this.ball.size/2, 0, 2 * Math.PI, false);
        var imageBall = (this.skipping.is)?this.images.ball.skipping:this.images.ball.default;
        // draw Ball
        this.canvas.draw.buff.context.drawImage(imageBall, x, y, this.ball.size, this.ball.size);
        
};
/**
 * Draw stones
 * @returns {undefined}
 */
Game.prototype.drawStones = function() {
    // draw all visible stones
    for (var i = this.stones.length-1; i >= 0 ; i--) {
        // get position of points in the perspective view
        var point2 = {x: this.stones[i].x + this.stones[i].size, y : this.stones[i].y};
        var point = this.getPerspectivePoint(this.stones[i]);
        point2 = this.getPerspectivePoint(point2);
        var size = point2.x - point.x;
        var perspectiveStone = {x: this.getRealX(point.x), y : this.getRealY(point.y)};
        perspectiveStone.size = size;
        
        // if the stone is visible
        if (perspectiveStone.x > this.stone.size*-1 &&
            perspectiveStone.x < this.canvas.width &&
            perspectiveStone.y > this.stone.size*-1 &&
            perspectiveStone.y < this.canvas.height) {
                // draw stone
                this.canvas.draw.buff.context.drawImage(this.images.stone, perspectiveStone.x, perspectiveStone.y, perspectiveStone.size, perspectiveStone.size);
        }
    }
};
/**
 * Draw coins
 * @returns {undefined}
 */
Game.prototype.drawCoins = function() { 
    // draw all visible coins
    for (var i = 0; i < this.coins.length; i++) {
        // get size and position in the perspective view
        var perspectiveCoin = this.getPerspectivePoint(this.coins[i]);
        var perspectiveCoinSide = this.getPerspectivePoint({x: this.coins[i].x+this.coins[i].r, y: this.coins[i].y});
        perspectiveCoin.r = Math.abs(perspectiveCoinSide.x - perspectiveCoin.x);
        perspectiveCoin.x = this.getRealX(perspectiveCoin.x);
        perspectiveCoin.y = this.getRealY(perspectiveCoin.y);
        
        // if the coins is visible
        if (perspectiveCoin.x > -this.coin.size &&
            perspectiveCoin.x < this.canvas.width &&
            perspectiveCoin.y > 0 &&
            perspectiveCoin.y < this.canvas.height+this.coin.size &&
            !this.coins[i].hidden) { 
        
                // draw coin
                this.canvas.draw.buff.context.drawImage(
                    this.images.coins[this.coins[i].value],
                    perspectiveCoin.x - perspectiveCoin.r,
                    perspectiveCoin.y - perspectiveCoin.r,
                    perspectiveCoin.r*2,
                    perspectiveCoin.r*2);
                    
        }
    }
};

/**
 * Draw current frame
 * @returns {undefined}
 */
Game.prototype.drawFrame = function() {
    //console.log("f: " + ( - this.t.getMilliseconds()));
       /* this.frames++;
        if ((Date.now() - this.fTime) > 1000) {
            console.log("FPS d: "+this.frames + " vyp: "+this.vypFrames);
            this.frames = 0;
            this.vypFrames = 0;
            this.fTime = new Date();
        }*/;
    // draw to the buffer canvas
    this.canvas.draw.buff.context.clearRect(0, 0, this.canvas.width, this.canvas.height); // cleaning canvas
    //this.drawPaths();
    this.drawStones();    
    this.drawCoins();    
    this.drawBall();
    
    // copy to the main canvas
    this.canvas.draw.main.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvas.draw.main.context.drawImage(this.canvas.draw.buff.element, 0,0);
    // call new drawing
    if (this.playing) {
        window.cancelAnimationFrame(this.timeout.draw);
        var self = this;
        setTimeout(
                function() {
                    self.timeout.draw = window.requestAnimationFrame(function(){self.drawFrame();});
                }, 
                this.delay.draw);
    }    
};


/* **************   Control Game    ************** */
/**
 * Manage current frame
 * @returns {undefined}
 */
Game.prototype.doFrame = function() {
        this.vypFrames++;
        //this.t = new Date();
        
        // set ball position
        this.setBallPosition();
        
        // check collisions of the ball and stones
        var collision = this.checkBallStonesCollision();        
        if (collision) { // if there is a collision, start skipping
            if (!this.skipping.is) { // start skipping if this is a first collision
                this.startSkipping();
            }
            this.skipping.is = true;            
            this.showLives();
            
            // update ball x position
            this.ball.x = this.ball.x + (this.skipping.direction * this.skipping.speed);
            
            // delete skipping in the defined time
            clearTimeout(this.timeout.skipping);
            var self = this;
            this.timeout.skipping = setTimeout(function() {self.skipping.is = false;}, this.delay.skipping);
        }
        
        // if there is enought balls/lives
        if (this.gameUserDetails.lives > 0) {            
            // if the game is not paused
            if (this.playing) {
                var self = this;
                this.timeout.frame =  setTimeout(function() {self.doFrame();}, this.delay.frame);
            }
            
            // add coins to the account
            var coins = this.checkBallCoinsCollision();
            this.gameUserDetails.coins += coins;
            if (coins > 0) {                
                this.showCoinsCollected();
            }
            
            // set frame position
            this.setFramePosition();
            

            // update labels
            this.updateMeters();
            this.showMeters();
            
            // Level completed
            if (this.ball.y > this.levels[this.gameUserDetails.level].meters * this.meterPx) {
                this.levelCompleted(this.gameUserDetails.level+1);                
            }
            
            // generate new step
            if (Math.floor(this.ball.y / this.step.size) > this.step.current) {
                this.step.current = Math.floor(this.ball.y / this.step.size);
                this.destroyStep(); // destroy old step
                this.generateStep();                
            }
                        
        } else { // no more lives - end the game
            this.endGame();
            
        }
        

};
    
/**
 * Start playing
 * @returns {undefined}
 */
Game.prototype.beginningGame = function() {
    this.doFrame();
    this.drawFrame();
    this.setSpeed();
    this.showLives();
    this.showCoinsCollected();
};
/**
 * Create start page (page with buying balls)
 * @returns {undefined}
 */
Game.prototype.startGame = function() {
    document.getElementById("gameDefaultPage").style.display = "none";
    document.getElementById("gameStartPage").style.display = "block";
    
    this.updateDetails(); // load user details from User object
    // set number of lives/balls to at least one
    if (this.gameUserDetails.lives < 1) {
        this.gameUserDetails.lives = 1;
    }
    
    this.updateBuyBallButton();
    
    this.setCanvasSize(); // set canvas size according to the current window
};  

/**
 * Manage end game page
 * @returns {undefined}
 */
Game.prototype.endGame = function() {
    this.playing = false;
    // show end page 
    document.getElementById("gameEndPage").style.display = "block";
    
    // show game stats
    document.getElementById("gameEndCoins").innerHTML = "Coins: + "+this.gameUserDetails.coins + " (total: "+(this.userDetails.coins + this.gameUserDetails.coins)+")";
    document.getElementById("gameEndMeters").innerHTML = "Distance: "+this.gameUserDetails.meters + "m (best: "+this.userDetails.meters+" m)";
    document.getElementById("gameEndLevel").innerHTML = "Level: "+this.gameUserDetails.level + " (previous best: "+this.userDetails.level+")";
    
    // store new details
    this.userDetails.coins += this.gameUserDetails.coins;
    this.userDetails.level = (this.userDetails.level < this.gameUserDetails.level)?this.gameUserDetails.level : this.userDetails.level; 
    this.userDetails.lives = this.gameUserDetails.lives;
    this.userDetails.id.updateDetails(this.userDetails.score, this.userDetails.meters, this.userDetails.lives, this.userDetails.coins, this.userDetails.level);
    
};


/* **************   Buying balls   ************** */
/**
 * Get a price for a new ball
 * @param {Nubmer} ball
 * @returns {Number}
 */
Game.prototype.getBallPrice = function(ball) {
    // =ROUNDDOWN((1000*A1^(9/10))/100; 0)*100
    return Math.floor( (1000 * Math.pow(ball, (9/10))) /100) *100;
};

/**
 * Update ball price and users balls and coins in buy ball button
 * @returns {undefined}
 */
Game.prototype.updateBuyBallButton = function() {
    var price = this.getBallPrice(this.gameUserDetails.lives+1); // price of the new ball
    document.getElementById("gameBuyingPrice").innerHTML = price + " coins";
    document.getElementById("gameBuyingCoinsNumber").innerHTML = this.userDetails.coins + " coins";
    document.getElementById("gameBuyingBallsNumber").innerHTML = this.gameUserDetails.lives + " balls";
    
    // if the user has enough coins to the next new ball
    if (price > this.userDetails.coins) {
        document.getElementById("gameBuyingBallsField").style.background = "grey";
    } else {
        document.getElementById("gameBuyingBallsField").style.background = "white";
    }
    
};
/**
 * Buy new ball
 * @returns {undefined}
 */
Game.prototype.buyBall = function() {
    if (this.getBallPrice(this.gameUserDetails.lives+1) <= this.userDetails.coins) {
        this.userDetails.coins -= this.getBallPrice(this.gameUserDetails.lives+1);
        this.gameUserDetails.lives++;
    }
    this.updateBuyBallButton();
};


/* **************   Others   ************** */
/**
 * Compute meters from pixels and update it 
 * @returns {undefined}
 */
Game.prototype.updateMeters = function() {
    this.gameUserDetails.meters = Math.floor(this.ball.y / this.meterPx);
    if (this.gameUserDetails.meters > this.userDetails.meters) {
        this.userDetails.meters = this.gameUserDetails.meters;
    }
};
/**
 * Action when a level is completed
 * @param {type} newLevel
 * @returns {undefined}
 */
Game.prototype.levelCompleted = function(newLevel) {
    this.gameUserDetails.level = newLevel;
    // add extra coin
    this.gameUserDetails.coins += (this.levels[this.gameUserDetails.level].meters)*10;
    
    // add extra lives
    this.gameUserDetails.lives += Math.ceil(this.gameUserDetails.level/2);
    this.showLives();
    
    this.setSpeed(); // increase speed
    console.log("level: "+this.gameUserDetails.level);
};
/**
 * Start skipping stones
 * @returns {undefined}
 */
Game.prototype.startSkipping = function() {
    this.gameUserDetails.lives -= 1; // decrease number of lives
    
    // find direction of skipping - ball has to go in a direction of a nearest path
    for (var i = 1; i < this.paths.length; i++) {
        if (this.paths[i][0].y > this.ball.y) {
            var minDistance = this.map.width;
            
            var nearestIntersectionBallCenter = 0;
            for (var x = 0; x < this.paths[i].length; x++) {
                var intersectionBallX1 = this.intersectionLines(
                        {x: this.paths[i-1][this.paths[i][x].parentId].x1, y: this.paths[i-1][this.paths[i][x].parentId].y},
                        {x: this.paths[i][x].x1, y: this.paths[i][x].y}, 
                        this.ball.y);
                var intersectionBallX2 = this.intersectionLines(
                        {x: this.paths[i-1][this.paths[i][x].parentId].x2, y: this.paths[i-1][this.paths[i][x].parentId].y},
                        {x: this.paths[i][x].x2, y: this.paths[i][x].y}, 
                        this.ball.y);
                var intersectionBallCenter = intersectionBallX2 - (intersectionBallX2 - intersectionBallX1)/2;
                var thisDistance = Math.abs(intersectionBallCenter - this.ball.x);
                if (minDistance > thisDistance) {
                    minDistance = thisDistance;
                    nearestIntersectionBallCenter = intersectionBallCenter;
                }
            }
            break;
        }
        
    }
    if (nearestIntersectionBallCenter < this.ball.x ) {
        this.skipping.direction = -1;
    } else {
        this.skipping.direction = 1;
    }
};



Game.prototype.drawPaths = function() {
    for (var i = 1; i < this.paths.length; i++) {
        
       this.xdrawPath(i);
    }
};

Game.prototype.xdrawPath = function(step) {
    
   var colors = ["#f00", "#f0f", "#ff0", "#f00", "#f0f", "#ff0", "#f00", "#f0f", "#ff0"]; 
   
   previousPaths = this.paths[step-1];
    this.canvas.draw.buff.context.lineWidth = 5;
    for (var i = 0; i < this.paths[step].length; i++) {
        thisPath = this.paths[step][i];
        parentPaht = previousPaths[thisPath.parentId];
        
        var point1 = this.getPerspectivePoint({x: parentPaht.x1, y:parentPaht.y});
        var point1E = this.getPerspectivePoint({x: thisPath.x1, y:thisPath.y});
        
        var point2 = this.getPerspectivePoint({x: parentPaht.x2, y:parentPaht.y});
        var point2E = this.getPerspectivePoint({x: thisPath.x2, y:thisPath.y});
        
        var x1 = this.getRealX(point1.x);
        var y1 = this.getRealY(point1.y);
        var x1E = this.getRealX(point1E.x);
        var y1E = this.getRealY(point1E.y);
        
        var x2 = this.getRealX(point2.x);
        var y2 = this.getRealY(point2.y);
        var x2E = this.getRealX(point2E.x);
        var y2E = this.getRealY(point2E.y);
        
        
        this.canvas.draw.buff.context.strokeStyle = colors[i];
        this.canvas.draw.buff.context.beginPath();
        this.canvas.draw.buff.context.moveTo(x1, y1); // souřadnice (x,y)
        this.canvas.draw.buff.context.lineTo(x1E, y1E);
        this.canvas.draw.buff.context.stroke();
        this.canvas.draw.buff.context.closePath(); 

        this.canvas.draw.buff.context.beginPath();
        this.canvas.draw.buff.context.moveTo(x2, y2); // souřadnice (x,y)
        this.canvas.draw.buff.context.lineTo(x2E, y2E);
        this.canvas.draw.buff.context.stroke();
        this.canvas.draw.buff.context.closePath(); 
    }
};
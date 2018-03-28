
var game = new Game();
function init() {
	game.init();
}
var imageStash = new function() {
	this.ship = new Image();
	this.trees = {
	'tree1' : new Image(),
	'tree2' : new Image()
	};
	this.background = {
	'dirt' : new Image(),
	'water' : new Image()
	};
	this.trees.tree1.src = "batch/tree1.png";
	this.trees.tree2.src = "batch/tree2.png";
	this.background.dirt.src = "batch/dirt.png";
	this.background.water.src = "batch/water.png";
	this.ship.src = "batch/shipF.png";
	this.ship.onload = function() {window.init();}
}
var ship = new Image();
var weapons = new Image();
var noThrust = new Image();
var normalThrust = new Image();
var fullThrust = new Image();
var leftFT = new Image();
var rightFT = new Image();
var thrustTurn = new Image();
var bullet1 = new Image();
var enemy1 = new Image();
var enemy2 = new Image();
var enemy3 = new Image();
var enemyB0 = new Image();
var enemyB1 = new Image();
var enemyB2 = new Image();
var enemyB3 = new Image();
var tree1 = new Image();
var tree2 = new Image();
var building1 = new Image();
var building2 = new Image();
var building3 = new Image();
var dirt = new Image();
var explosion = new Image();
var shield = new Image();
dirt.src = "batch/dirt.png";
thrustTurn.src = "batch/normalthrust.png";
normalThrust.src = "batch/thrusters.png";
fullThrust.src = "batch/fullThrusters.png";
leftFT.src = "batch/fthrustL.png";
rightFT.src = "batch/fthrustR.png";
ship.src = "batch/ship.png";
weapons.src = "batch/weaponX.png";
bullet1.src = "batch/bullet3.png";
enemy1.src = "batch/enemy1.png";
enemy2.src = "batch/enemy2.png";
enemy3.src = "batch/enemy3.png";
enemyB0.src = "batch/enemyB0.png";
enemyB1.src = "batch/enemyB1.png";
enemyB2.src = "batch/enemyB2.png";
enemyB3.src = "batch/enemyB3.png";
tree1.src = "batch/tree1.png";
tree2.src = "batch/tree2.png";
building1.src = "batch/building1.png";
building2.src = "batch/building2.png";
building3.src = "batch/building3.png";
explosion.src = "batch/explosion.png";
shield.src = "batch/shield.png";
var bgY = 0;
var frameWidth = 175;
var frameHeight = 175;
var totalFrames = 3;
var shift = 0;
var currentFrame = 0;
var speed = 2;
var x = frameWidth / 2;
var y = frameHeight / 2;
var keys = [];

var getRandomXY = function(){
	return [Math.round(Math.random()*(canvas.width+x))-x, -Math.round(y + Math.random()*y)];
}
var forest = {
	0: {'type': tree1,'coords': []},
	1: {'type': tree2,'coords': []},
	};
var buildings = {
	1: [],
	2: [],
	3: []
	};
var playerShip = {
	'x': 0,
	'y': 0,
	'angle': 0,
	'direction': 0,
	'turn': 0,
	'width': 0,
	'height': 0,
	'thrusters': 0,
	'fireRate': 0,
	'shield': 0,
	'health': 0
};
var enemies = {
	1: [],
	2: [],
	3: []
	};
var bullets = {
	'player': [],
	};
	
var enemyBullets = [];
	
var hits = [];
var wave = 0;


function Drawable() {
	this.init = function(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	this.speed = 0
	this.canvasWidth = 0;
	this.canvasHeight = 0;
	this.type = '';
	this.draw = function() {};
	this.move = function() {};
}

function Background() {
	this.draw = function() {};
}
Background.prototype = new Drawable();
function Ground() {
	this.draw = function() {
		this.y += speed;
		this.context.drawImage(imageStash.background.dirt, 0, this.y, this.canvasWidth, this.height);
		this.context.drawImage(imageStash.background.dirt, 0, this.y-this.width, this.canvasWidth, this.height);
		if (this.y >= 1000)
			this.y = 0;
		};
}
Ground.prototype = new Background();

function Forest() {
	this.init = function(width, height, size) {
		this.width = width;
		this.height = height;
		this.size = size;
		this.trees = [];
		var sectorSize = 100;
		var i = 0;
		for (var row = 0; row < size; row++){
			for (var col = 0; col < size; col++){
				this.trees[i] = [-Math.round(Math.random()*50)+col*sectorSize,-this.height+row*sectorSize,'tree'+(Math.floor(Math.random()*2)+1)];
			i++;
			}
		}
	}
	this.draw = function() {
		this.y += speed;
		for (var tree in this.trees){
			this.context.drawImage(imageStash.trees[this.trees[tree][2]], this.trees[tree][0], this.trees[tree][1], this.width, this.height);
			this.trees[tree][1] += speed;
			if (this.trees[tree][1] >= this.canvasHeight) {
				this.trees[tree][1] = 0-this.height;
				this.trees[tree][2] = 'tree'+(Math.floor(Math.random()*2)+1);
			}
		}
	}
}
Forest.prototype = new Background();

function Game() {
	this.init = function() {
		this.bgCanvas = document.getElementById("background");
		if (this.bgCanvas.getContext("2d")) {
			this.bgContext = this.bgCanvas.getContext("2d");
			Background.prototype.context = this.bgContext;
			Background.prototype.canvasWidth = this.bgCanvas.width;
			Background.prototype.canvasHeight = this.bgCanvas.height;
			Ground.prototype.context = this.bgContext;
			Ground.prototype.canvasWidth = this.bgCanvas.width;
			Ground.prototype.canvasHeight = this.bgCanvas.height;
			Forest.prototype.context = this.bgContext;
			Forest.prototype.canvasWidth = this.bgCanvas.width;
			Forest.prototype.canvasHeight = this.bgCanvas.height;
			this.background = new Background();
			this.background.init(0,0);
			this.ground = new Ground();
			this.ground.init(0,0,1000,1000);
			this.forest = new Forest();
			this.forest.init(100,100,10);
			game.start();
		}
	};
	this.start = function() {
		animate();
	};
}

function animate() {
	requestAnimationFrame( animate );
	game.ground.draw();
	game.forest.draw();
}

window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();

window.addEventListener("keydown", function (e) {
	keys[e.keyCode] = true;
});
window.addEventListener("keyup", function (e) {
	e.preventDefault();
	keys[e.keyCode] = false;
});
/*
function whatKey() {
	if (keys[32]) {
		
	}
	if (keys[37] || keys[65]) {
	// a
		
	}
	if (keys[39] || keys[68]) {
	// d
		
	}
	if ((keys[39] || keys[68])&&(keys[37] || keys[65])) {
	// a and d
		
	}
	if ((keys[38] || keys[87])) {
	// w
	
	}
	if ((keys[40] || keys[83])) {
	// s
		
	}
	if ((keys[38] || keys[87]) && (keys[40] || keys[83])) {
	// w and s
		
	}
	if (!keys[37] && !keys[65] && !keys[39] && !keys[68]) {
	// not a and not d
		
	}
	if ((keys[38] || keys[87]) && (keys[39] || keys[68] || keys[37] || keys[65])) {
		// w and (a or d)
		if ((keys[39] || keys[68])&&(keys[37] || keys[65])) {
		// a and d
		} else {}
	}
}
*/
var game = new Game();
function init() {
	game.init();
}
var imageStash = new function() {
	this.ship = new Image();
	this.thrusters = new Image();
	this.bullets = {
	'bullet1' : new Image(),
	'bullet2' : new Image(),
	'bullet3' : new Image()
	}
	this.enemies = {
		'enemy1' : new Image(),
		'enemy2' : new Image(),
		'enemy3' : new Image()
	}
	this.enemy_bullets = {
		'bullet1' : new Image(),
		'bullet2' : new Image(),
		'bullet3' : new Image()
	}
	this.trees = {
	'tree1' : new Image(),
	'tree2' : new Image(),
	'tree3' : new Image(),
	'tree4' : new Image(),
	'tree5' : new Image()
	};
	this.background = {
	'dirt' : new Image(),
	'water' : new Image()
	};
	this.background.dirt.onload = function() {window.init();}
	
	this.background.dirt.src = "batch/dirt.png";
	this.background.water.src = "batch/water.png";
	
	this.trees.tree1.src = "batch/trees1.png";
	this.trees.tree2.src = "batch/trees2.png";
	this.trees.tree3.src = "batch/trees3.png";
	this.trees.tree4.src = "batch/trees4.png";
	this.trees.tree5.src = "batch/trees5.png";
	
	this.enemy_bullets.bullet1.src = "batch/enemyB1.png";
	this.enemy_bullets.bullet2.src = "batch/enemyB2.png";
	this.enemy_bullets.bullet3.src = "batch/enemyB3.png";

	this.enemies.enemy1.src = "batch/enemy1.png";
	this.enemies.enemy2.src = "batch/enemy2.png";
	this.enemies.enemy3.src = "batch/enemy3.png";
	
	this.bullets.bullet1.src = "batch/bullet1.png";
	this.bullets.bullet2.src = "batch/bullet2.png";
	this.bullets.bullet3.src = "batch/bullet3.png";

	this.thrusters.src = "batch/normalthrust.png";
	this.ship.src = "batch/ship.png";
}

var SPEED = 3;
var speed = SPEED;
var shiftFrame = 0;
var totalFrames = 3;

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
	this.currentImage = "tree"+(Math.floor(Math.random()*5)+1);
	this.nextImage = "tree"+(Math.floor(Math.random()*5)+1);
	this.draw = function() {
		this.y += speed;
		for (var tree in imageStash.trees) {
		//console.log(tree);
		}
		this.context.drawImage(imageStash.trees[this.currentImage], -50, this.y-100, this.canvasWidth + 100, this.height + 100);
		this.context.drawImage(imageStash.trees[this.nextImage], -50, this.y-this.height-100, this.canvasWidth + 100, this.height + 100);
		if (this.y >= 1000) {
			this.y = 0;
			this.currentImage = this.nextImage;
			this.nextImage = "tree"+(Math.floor(Math.random()*5)+1);
		}
	}
}
Forest.prototype = new Background();

function Ship() {
	var that = this;
	this.bulletPool = new Pool(30);
	this.init = function(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.alive = true;
		this.canFire = true;
		this.fireRate = 400;
		this.bulletPool.init("bullet");
		this.imageFrame = this.width*3;
		this.currentBullet = "bullet1";
	}
	this.draw = function() {
		this.context.drawImage(imageStash.ship, this.imageFrame, 0, this.width, this.height,
				this.x, this.y, this.width, this.height);
		this.context.drawImage(imageStash.thrusters, this.imageFrame, 0, this.width, this.height,
				this.x, this.y, this.width, this.height);		
	}
	this.move = function() {
		this.context.clearRect(this.x,this.y,this.width,this.height);
		if (keys[32]) {					// space
			if (this.canFire) this.fire();
		}
		if (keys[37] || keys[65]) {		// a
			this.x -= 6*(keys[38] || keys[87] ? 1.5 : (keys[40] || keys[83] ? 0.5 : 1));
			//(this.imageFrame == 0 ? this.thrust("fthrustL") : this.thrust(""))
			this.imageFrame -= this.width;
		}
		if (keys[39] || keys[68]) {		// d
			this.x += 6*(keys[38] || keys[87] ? 1.5 : (keys[40] || keys[83] ? 0.5 : 1));
			//(this.imageFrame == 0 ? this.thrust("fthrustR") : this.thrust(""))
			this.imageFrame += this.width;
		}
		if ((keys[38] || keys[87])) { 	// w
			speed = 4;
			this.thrust("fullthrust");
			this.y -= 4;
		}
		if ((keys[40] || keys[83])) { 	// s
			speed = 2;
			this.thrust("");
			this.y += 4;
		}
		if (((keys[38] || keys[87]) && (keys[40] || keys[83])) || (!keys[38] && !keys[87] && !keys[40] && !keys[83])) { 	// (w and s) or (not w and not s)
			this.thrust("normalthrust");
			speed = SPEED;
			if( this.y < this.canvasHeight - this.height*3/2 ) this.y += 2;
			else if (this.y > this.canvasHeight - this.height*3/2 ) this.y -= 2;
		}
		if ((!keys[37] && !keys[65] && !keys[39] && !keys[68]) || ((keys[37] || keys[65]) && (keys[39] || keys[68]))) {		// (a and d) or (not a and not d)
			this.pitch_and_roll();
		}
		this.imageFrame = this.imageFrame < 0 ?
						0 :
						this.imageFrame > this.width*6 ?
										this.width*6 :
										this.imageFrame;
		this.x = this.x < 0 ?
						0 :
						this.x > this.canvasWidth - this.width ?
										this.canvasWidth - this.width :
										this.x ;
		this.y = this.y < this.canvasHeight - this.height*3 ? 
						this.canvasHeight - this.height*3 :
						this.y > this.canvasHeight - this.height ? 
										this.canvasHeight - this.height : 
										this.y;
		this.draw();
	}
	this.thrust = function(thrust) {
		if(imageStash.thrusters.src != "batch/"+thrust+".png"){
			if(thrust != ""){
				imageStash.thrusters.src = "batch/"+thrust+".png";
			} else { imageStash.thrusters.src = ""; }
		}
	}
	this.pitch_and_roll = function() { 
		if (this.imageFrame != this.width*3) {
			this.imageFrame += this.imageFrame < this.width*3 ? 
							this.width : 
							-this.width;
		}
	}
	this.fire = function() {
		that.canFire = false; 			// this.canFire
		this.bulletPool.getTwo(this.x+this.width/2- 13, this.y, 3,
		                       this.x+this.width/2-imageStash.bullets[this.currentBullet].width/2, this.y, 3);
		setTimeout(function(){that.canFire = true;},that.fireRate);
	}
}
Ship.prototype = new Drawable();

function Bullet(object) {
	this.alive = false;
	var self = object;
	this.spawn = function(x, y, speed) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.alive = true;
	};
	this.draw = function() {
		this.y -= this.speed;
		if (this.isColliding) {
			return true;
		}
		else if (self === "bullet" && this.y <= 0 - this.height) {
			return true;
		}
		else if (self === "enemyBullet" && this.y >= this.canvasHeight) {
			return true;
		}
		else {
			if (self === "bullet") {
				console.log(self);
				this.context.drawImage(imageStash.bullets.bullet1, 0, shiftFrame, imageStash.bullets.bullet1.width, 88,
				this.x, this.y, imageStash.bullets.bullet1.width, 88);
			}
			else if (self === "enemyBullet") {
				this.context.drawImage(imageStash.enemyBullet, this.x, this.y);
			}
			return false;
		}
	};
	this.clear = function() {
		this.x = 0;
		this.y = 0;
		this.speed = 0;
		this.alive = false;
		this.isColliding = false;
	};
}
Bullet.prototype = new Drawable();

function Pool(maxSize) {
	var size = maxSize;
	var pool = [];
	
	this.getPool = function() {
		var obj = [];
		for (var i = 0; i < size; i++) {
			if(pool[i].alive) {
				obj.push(pool[i]);
			}
		}
		return obj;
	}
	this.init = function(object) {
		if (object === "bullet") {
			for (var i = 0; i < size; i++) {
				var bullet = new Bullet("bullet");
				bullet.init(0,0, imageStash.bullets.bullet1.width, imageStash.bullets.bullet1.height);
				pool[i] = bullet;
			}
		}
	};
	this.get = function(x, y, speed) {
		if(!pool[size-1].alive){
			pool[size-1].spawn(x,y,speed);
			pool.unshift(pool.pop());
		}
	};
	this.getTwo = function(x1, y1, speed1, x2, y2, speed2) {
		if(!pool[size - 1].alive && !pool[size - 2].alive) {
			this.get(x1, y1, speed1);
			this.get(x2, y2, speed2);
		}
	};
	this.animate = function() {
		for (var i = 0; i < size; i++) {
			if (pool[i].alive) {
				if (pool[i].draw()) {
					pool[i].clear();
					pool.push((pool.splice(i,1))[0]);
				}
			}
			else
				break;
		}
	};
}

function Game() {
	this.init = function() {
		this.bgCanvas = document.getElementById("background");
		this.shipCanvas = document.getElementById("ship");
		this.drawCanvas = document.getElementById("main");
		if (this.bgCanvas.getContext("2d")) {
			this.bgContext = this.bgCanvas.getContext("2d");
			this.shipContext = this.shipCanvas.getContext("2d");
			this.drawContext = this.drawCanvas.getContext("2d");
			Background.prototype.context = this.bgContext;
			Background.prototype.canvasWidth = this.bgCanvas.width;
			Background.prototype.canvasHeight = this.bgCanvas.height;
			Ground.prototype.context = this.bgContext;
			Ground.prototype.canvasWidth = this.bgCanvas.width;
			Ground.prototype.canvasHeight = this.bgCanvas.height;
			Forest.prototype.context = this.bgContext;
			Forest.prototype.canvasWidth = this.bgCanvas.width;
			Forest.prototype.canvasHeight = this.bgCanvas.height;
			Ship.prototype.context = this.shipContext;
			Ship.prototype.canvasWidth = this.shipCanvas.width;
			Ship.prototype.canvasHeight = this.shipCanvas.height;
			Bullet.prototype.context = this.drawContext;
			Bullet.prototype.canvasWidth = this.drawCanvas.width;
			Bullet.prototype.canvasHeight = this.drawCanvas.height;
			this.background = new Background();
			this.background.init(0,0);
			this.ground = new Ground();
			this.ground.init(0,0,1000,1000);
			this.forest = new Forest();
			this.forest.init(0,0,1000,1000);
			this.ship = new Ship();
			this.ship.init(600,600 - 88*1.5,88,88);
			game.start();
		}
	};
	this.start = function() {
		this.ship.draw();
		animate();
	};
}

function animate() {
	requestAnimationFrame( animate );
	game.drawContext.clearRect(0, 0, game.shipCanvas.width, game.shipCanvas.height);

	game.ground.draw();
	game.forest.draw();
	game.ship.bulletPool.animate();
	game.ship.move();
	
	shiftFrame += 88;
	if (shiftFrame >= totalFrames*88) shiftFrame = 0;
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

var keys = [];
window.addEventListener("keydown", function (e) {
	keys[e.keyCode] = true;
});
window.addEventListener("keyup", function (e) {
	e.preventDefault();
	keys[e.keyCode] = false;
});
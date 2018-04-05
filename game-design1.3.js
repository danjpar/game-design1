var game = new Game();
function init() {
	game.init();
}
var imageStash = new function() {
	this.ship = new Image();
	this.thrusters = new Image();
	this.eshield = new Image();
	this.pshield = new Image();
	this.explosion = new Image();
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
	this.eshield.src = "batch/eshield.png";
	
	this.bullets.bullet1.src = "batch/bullet1.png";
	this.bullets.bullet2.src = "batch/bullet2.png";
	this.bullets.bullet3.src = "batch/bullet3.png";

	this.pshield.src = "batch/pshield.png";
	this.explosion.src = "batch/explosion.png";
	this.thrusters.src = "batch/normalthrust.png";
	this.ship.src = "batch/ship.png";
}

var SPEED = 3;
var bg_speed = SPEED;
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

function Ground() {
	this.draw = function() {
		this.y += bg_speed;
		this.context.drawImage(imageStash.background.dirt, 0, this.y, this.canvasWidth, this.height);
		this.context.drawImage(imageStash.background.dirt, 0, this.y-this.width, this.canvasWidth, this.height);
		if (this.y >= 1000)
			this.y = 0;
		};
}
Ground.prototype = new Drawable();

function Forest() {
	this.currentImage = "tree"+(Math.floor(Math.random()*5)+1);
	this.nextImage = "tree"+(Math.floor(Math.random()*5)+1);
	this.draw = function() {
		this.y += bg_speed;
		this.context.drawImage(imageStash.trees[this.currentImage], -50, this.y-100, this.canvasWidth + 100, this.height + 100);
		this.context.drawImage(imageStash.trees[this.nextImage], -50, this.y-this.height-100, this.canvasWidth + 100, this.height + 100);
		if (this.y >= 1000) {
			this.y = 0;
			this.currentImage = this.nextImage;
			this.nextImage = "tree"+(Math.floor(Math.random()*5)+1);
		}
	}
}
Forest.prototype = new Drawable();

function Ship() {
	var that = this;
	this.bulletPool = new Pool(100);
	this.init = function(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.hit = false;
		this.alive = true;
		this.canFire = true;
		this.mgCanFire = true;
		this.fireRate = 400;
		this.bulletPool.init("bullet");
		this.imageFrame = this.width*3;
		this.currentBullet = ["bullet1", "bullet2", "bullet3"];
	}
	this.draw = function() {
		this.context.drawImage(imageStash.ship, this.imageFrame, 0, this.width, this.height,
				this.x-this.width/2, this.y, this.width, this.height);
		this.context.drawImage(imageStash.thrusters, this.imageFrame, 0, this.width, this.height,
				this.x-this.width/2, this.y, this.width, this.height);
		if (this.hit) {
			this.hit = false;
			game.hitPool.get(this.x, this.y, 0, "pshield");
		}
		//this.context.fillRect(this.x, this.y, game.ship.width, game.ship.height);
		

	}
	this.move = function() {
		this.context.clearRect(this.x-this.width/2,this.y,this.width,this.height);
		if (keys[32]) {					// space
			if (this.canFire || this.mgCanFire) this.fire();
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
			bg_speed = 4;
			this.thrust("fullthrust");
			this.y -= 4;
		}
		if ((keys[40] || keys[83])) { 	// s
			bg_speed = 2;
			this.thrust("");
			this.y += 4;
		}
		if (((keys[38] || keys[87]) && (keys[40] || keys[83])) || (!keys[38] && !keys[87] && !keys[40] && !keys[83])) { 	// (w and s) or (not w and not s)
			this.thrust("normalthrust");
			bg_speed = SPEED;
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
		this.x = this.x < this.width/2 ?
						this.width/2 :
						this.x > this.canvasWidth - this.width/2 ?
										this.canvasWidth - this.width/2 :
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
		if (that.canFire) {
			that.canFire = false; 			// this.canFire
			//this.bulletPool.getTwo(this.x+this.width/2-imageStash.bullets[this.currentBullet[0]].width/2-this.width/3, this.y, 3,
		      //                 this.x+this.width/2-imageStash.bullets[this.currentBullet[0]].width/2+this.width/3, this.y, 3, this.currentBullet[0]);
			//this.bulletPool.getTwo(this.x+this.width/2-imageStash.bullets[this.currentBullet[2]].width/2-this.width/5, this.y, 3,
		      //                 this.x+this.width/2-imageStash.bullets[this.currentBullet[2]].width/2+this.width/5, this.y, 3, this.currentBullet[2]);
			setTimeout(function(){that.canFire = true;},that.fireRate);
		}
		if (that.mgCanFire) {
			that.mgCanFire = false;
			this.bulletPool.get(this.x, this.y, 5, this.currentBullet[0]);
			setTimeout(function(){that.mgCanFire = true;},that.fireRate/4);
		}
	}
}
Ship.prototype = new Drawable();

function Hit() {
	this.alive = false;
	this.spawn = function(x, y, step, type) {
		this.x = x;
		this.y = y;
		this.step = step;
		this.alive = true;
		this.type = type;
		this.width = imageStash[this.type].width/8;
		this.height = imageStash[this.type].height;
	};
	this.draw = function() {
		
		if (!this.alive || this.step > 8) {
			return true;
		}
		else {
			this.context.drawImage(imageStash[this.type], this.width*this.step, 0, this.width, this.height,
							this.x-this.width/2-this.width*.125, this.y-this.height/4, this.width*1.25, this.height*1.25);
			this.step++;
			return false;
		}
	};
	this.clear = function() {
		this.x = 0;
		this.y = 0;
		this.alive = false;
	};
}
Hit.prototype = new Drawable();

function Bullet(object) {
	this.alive = false;
	var self = object;
	this.spawn = function(x, y, speed, type) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.alive = true;
		this.type = type;
	};
	this.draw = function() {
		this.y -= this.speed + this.speed/Math.abs(this.speed)*bg_speed;
		
		if (!this.alive) {
			return true;
		}
		else if (self === "bullet" && this.y <= 0 - this.height*1.5) {
			return true;
		}
		else if (self === "enemyBullet" && this.y >= this.canvasHeight + this.height*1.5) {
			return true;
		}
		else {
			if (self === "bullet") {
				this.width = imageStash.bullets[this.type].width;
				this.height = imageStash.bullets[this.type].height/3;
				this.context.drawImage(imageStash.bullets[this.type], 0, shiftFrame, this.width, this.height,
								this.x-this.width/2, this.y, this.width, this.height/6);
				for (enemy in game.enemyPool.getPool()) {
					if (this.y > game.enemyPool.getPool()[enemy].y + game.enemyPool.getPool()[enemy].height/4 &&
					this.y <= game.enemyPool.getPool()[enemy].y + game.enemyPool.getPool()[enemy].height*3/4 &&
					this.x >= game.enemyPool.getPool()[enemy].x-game.enemyPool.getPool()[enemy].width/2 &&
					this.x <= game.enemyPool.getPool()[enemy].x+game.enemyPool.getPool()[enemy].width/2) {
						game.enemyPool.getPool()[enemy].hit = true;
						return true;
					}
					
				}
			}
			else if (self === "enemyBullet") {
				this.width = imageStash.enemy_bullets[this.type].width;
				this.height = imageStash.enemy_bullets[this.type].height/3;
				if (this.type === "bullet1") {
					if (this.y < game.ship.y + this.height/2) {
						this.x += this.x < game.ship.x ? 2 : -2;
					}
				}
				else if (this.type === "bullet3") {
					this.width = this.width/3;
				}
				this.context.drawImage(imageStash.enemy_bullets[this.type], 0, shiftFrame, imageStash.enemy_bullets[this.type].width, imageStash.enemy_bullets[this.type].height/3,
								this.x-this.width/2, this.y-this.height, this.width, this.height);
				if (this.x >= game.ship.x-game.ship.width/2+10 && this.x <= game.ship.x+game.ship.width/2-10 && this.y >= game.ship.y+game.ship.height/3 && this.y <= game.ship.y + game.ship.height*3/4) {
					game.ship.hit = true;
					return true;
				}
			}
			return false;
		}
	};
	this.clear = function() {
		this.x = 0;
		this.y = 0;
		this.speed = 0;
		this.alive = false;
	};
}
Bullet.prototype = new Drawable();

function Enemy() {
	this.spawn = function(x,y,speed,type) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.type = type;
		this.direction = this.newDirection();
		this.alive = true;
		this.hit = false;
		this.width = imageStash.enemies[type].width;
		this.height = imageStash.enemies[type].height/3;
		this.shield = parseInt(this.type.slice(-1));
	};
	
	this.draw = function() {
		if (this.y <= 0) {
			this.y += 4;
		}
		if (!Math.round(Math.random()*5)) {
					this.fire(); 
				}
		/*
		if (this.x <= this.width/2){
			this.direction = 2*Math.abs(this.direction);
			this.x += 4;
		} else if (this.x >= this.canvasWidth-this.width/2){
			this.direction = -2*Math.abs(this.direction);
			this.x -= 4;
		} else {
			if (Math.abs(this.direction) > 0){
				this.x += 2*(this.direction/Math.abs(this.direction));
				this.direction -= (this.direction/Math.abs(this.direction));
			} else {
				this.direction = this.newDirection();
				if (Math.round(Math.random())) {
					this.fire(); 
				}
			}
		}*/
		if (this.alive) {
			this.context.drawImage(imageStash.enemies[this.type], 0, shiftFrame, imageStash.enemies[this.type].width, (imageStash.enemies[this.type].height/3),
							this.x-this.width/2, this.y, this.width, this.height);
			if (this.hit){
				if (this.shield > 0){
					this.shield -= 1;
					game.hitPool.get(this.x, this.y, 0, "eshield");
					this.hit = false;
					return false;
				}
				else {
					game.hitPool.get(this.x, this.y, 0, "explosion");
					return true;
				}
			}
			else {
				return false;
			}
		} else {
			return true;
		}
	};
	this.fire = function() {
		game.enemyBulletPool.get(this.x, this.y+this.height, -1, "bullet"+this.type.slice(-1));
	};
	this.newDirection = function() {
		return (Math.random() < 0.5 ? -1 : 1)*(Math.round(Math.random()*80+20));
	};
	this.clear = function() {
		this.x = 0;
		this.y = 0;
		this.speed = 0;
		this.direction = 0;
		this.alive = false;
		this.hit = false;
	};
}
Enemy.prototype = new Drawable();

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
	};
	this.init = function(object) {
		if (object === "bullet") {
			for (var i = 0; i < size; i++) {
				var bullet = new Bullet("bullet");
				bullet.init(0,0,0,0);
				pool[i] = bullet;
			}
		}
		else if (object == "enemy") {
			for (var i = 0; i < size; i++) {
				var enemy = new Enemy();
				enemy.init(0,0,0,0);
				pool[i] = enemy;
			}
		}
		else if (object == "enemyBullet") {
			for (var i = 0; i < size; i++) {
				var bullet = new Bullet("enemyBullet");
				bullet.init(0,0,0,0);
				pool[i] = bullet;
			}
		}
		else if (object === "hit") {
			for (var i = 0; i < size; i++) {
				var hit = new Hit();
				hit.init(0,0,0,0);
				pool[i] = hit;
			}
		}
	};
	this.get = function(x, y, speed, type) {
		if(!pool[size-1].alive){
			pool[size-1].spawn(x,y,speed,type);
			pool.unshift(pool.pop());
		}
	};
	this.getTwo = function(x1, y1, speed1, x2, y2, speed2, type) {
		if(!pool[size - 1].alive && !pool[size - 2].alive) {
			this.get(x1, y1, speed1, type);
			this.get(x2, y2, speed2, type);
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
			Enemy.prototype.context = this.drawContext;
			Enemy.prototype.canvasWidth = this.drawCanvas.width;
			Enemy.prototype.canvasHeight = this.drawCanvas.height;
			Hit.prototype.context = this.drawContext;
			Hit.prototype.canvasWidth = this.drawCanvas.width;
			Hit.prototype.canvasHeight = this.drawCanvas.height;
			this.ground = new Ground();
			this.ground.init(0,0,1000,1000);
			this.forest = new Forest();
			this.forest.init(0,0,1000,1000);
			this.ship = new Ship();
			this.ship.init(this.shipCanvas.width/2,this.shipCanvas.height - 88*1.5,88,88);
			this.enemyPool = new Pool(30);
			this.enemyPool.init("enemy");
			this.spawnWave();
			this.enemyBulletPool = new Pool(50);
			this.enemyBulletPool.init("enemyBullet");
			this.hitPool = new Pool(50);
			this.hitPool.init("hit");
			game.start();
		}
	};
	this.spawnWave = function() {
		for (var i = 1; i <= 5; i++) {
			//this.enemyPool.get(Math.round(Math.random()*(this.drawCanvas.width)),-Math.round(imageStash.enemies.enemy1.height + Math.random()*imageStash.enemies.enemy1.height),2,"enemy1");
		}
		for (var i = 1; i <= 5; i++) {
			this.enemyPool.get(Math.round(Math.random()*(this.drawCanvas.width)),-Math.round(imageStash.enemies.enemy1.height + Math.random()*imageStash.enemies.enemy1.height),2,"enemy3");
		}
	}

	this.start = function() {
		this.ship.draw();
		animate();
	};
}

function animate() {
	requestAnimationFrame( animate );
	game.drawContext.clearRect(0, 0, game.shipCanvas.width, game.shipCanvas.height);

	if (game.enemyPool.getPool().length === 0) {
		game.spawnWave();
	}
	
	game.ground.draw();
	game.forest.draw();
	game.ship.bulletPool.animate();
	game.ship.move();
	game.enemyBulletPool.animate();
	game.enemyPool.animate();
	game.hitPool.animate();

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
var stats = document.getElementById("stats");
var canvas = document.querySelector("#ctx");
var context = canvas.getContext("2d");
var bgcanvas = document.querySelector("#background");
var bgcontext = bgcanvas.getContext("2d");

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
var tree3 = new Image();
var building1 = new Image();
var building2 = new Image();
var building3 = new Image();
var dirt = new Image();
var explosion = new Image();
var shield = new Image();
dirt.src = "batch/water.png";
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
tree1.src = "batch/trees1.png";
tree2.src = "batch/trees2.png";
tree3.src = "batch/trees4.png";
building1.src = "batch/building1.png";
building2.src = "batch/building2.png";
building3.src = "batch/building3.png";
explosion.src = "batch/explosion.png";
shield.src = "batch/shield.png";
normalThrust.addEventListener("load", loadImage, false);
var bgY = 0;
var frameWidth = 175;
var frameHeight = 175;
var totalFrames = 3;
var shift = 0;
var currentFrame = 0;
var speed = 2;
var x = frameWidth / 2;
var y = frameHeight / 2;
var centerX = canvas.width/2 - x/2;
var bottomY = canvas.height - y*1.5;
var keys = [];

var forest = {
	0: {'type': tree1,'coords': []},
	1: {'type': tree2,'coords': []},
	2: {'type': tree3,'coords': []}
	};
var buildings = {
	1: [],
	2: [],
	3: []
	};
var playerShip = {
	'x': canvas.width/2,
	'y': canvas.height - y*1.5,
	'angle': frameWidth*3,
	'direction': 0,
	'turn': 0,
	'width': x,
	'height': y,
	'thrusters': normalThrust,
	'fireRate': 400,
	'shield': 1000,
	'health': 100
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

function drawHits() {
	var hit = hits.length;
	while (hit--) {
		context.drawImage(hits[hit][3], x*hits[hit][2], 0, x, y, hits[hit][0]-x*.375, hits[hit][1]-y*.125, x*1.75, y*1.25)
		hits[hit][2] += 1;
		if (hits[hit][2] > 8){
			hits.splice(hit,1);
		}
	}
}

function drawBullets() {
	var bullet = bullets.player.length;
	while (bullet--) {
		context.drawImage(bullet1, 0, shift, frameWidth, frameHeight, bullets.player[bullet][0], bullets.player[bullet][1], x, y)
		bullets.player[bullet][1] -= 4;
		if (bullets.player[bullet][1] < -2*y) {
			bullets.player.splice(bullet,1);
		} else {
			for (type in enemies) {
				var e = Object.keys(enemies[type]).length;
				while (e--) {
					if ((bullets.player[bullet][1] > 0) && (bullets.player.length != 0) && (bullets.player[bullet][1] <= enemies[type][e].y+y/2) && (bullets.player[bullet][0] <= enemies[type][e].x+x/1.75 && bullets.player[bullet][0] >= enemies[type][e].x-x/1.75)){
						if (enemies[type][e].shield > 0) {
							hits.push([enemies[type][e].x,enemies[type][e].y,1,shield]);
							enemies[type][e].shield -= 1;
							enemyFire(enemies[type][e]);
							enemies[type][e].direction = -enemies[type][e].direction;
						} else {
							hits.push([enemies[type][e].x,enemies[type][e].y,1,explosion]);
							enemies[type].splice(e,1);
						}
						bullets.player.splice(bullet,1);
						return;
					}
				}
			}
		}
	}
}	
function drawEBullets() {
	var eBull = enemyBullets.length;
	while (eBull--) {
		var eBullX = enemyBullets[eBull][0];
		var eBullY = enemyBullets[eBull][1];
		var bulletType = eval('enemyB'+enemyBullets[eBull][2]);
		if (enemyBullets[eBull][1] > canvas.height+y*1.25) {
			enemyBullets.splice(eBull,1);
		} else if (enemyBullets[eBull][0] >= playerShip.x-x/2+7 && enemyBullets[eBull][0] <= playerShip.x+x/2-7 && enemyBullets[eBull][1] >= playerShip.y+y/4 && enemyBullets[eBull][1] <= playerShip.y+y){
			hits.push([enemyBullets[eBull][0]-x/2, playerShip.y-y/4,1,explosion]);
			enemyBullets.splice(eBull,1);
		} else if (enemyBullets[eBull][2] == 1) {
			context.drawImage(bulletType, 0, shift, frameWidth, frameHeight, enemyBullets[eBull][0]-(x/5)/2, enemyBullets[eBull][1]-y*1.25, x/5, y)
			context.drawImage(bulletType, 0, shift, frameWidth, frameHeight, enemyBullets[eBull][0]-(x/5)/2, enemyBullets[eBull][1]-y, x/5, y)
			enemyBullets[eBull][1] += 2+speed;
		} else if (enemyBullets[eBull][2] == 2) {
			context.drawImage(enemyB0, 0, shift, frameWidth, frameHeight, enemyBullets[eBull][0]-(x)/2, enemyBullets[eBull][1]-y*1.125, x, y)
			enemyBullets[eBull][1] += 1+speed;
			if (eBullY < playerShip.y + y) {
				enemyBullets[eBull][0] += (eBullX < playerShip.x ? 3 : -3);
			}
		} else if (enemyBullets[eBull][2] == 3) {
			if (eBullY >= canvas.height/2 && eBullY < canvas.height/2+4+speed){
				eBullY += 8;
				for (i = 0; i < 5;i++){
					enemyBullets.push([eBullX-x*2/20+x*i/20,eBullY+5,enemyBullets[eBull][2]]);
				}
				enemyBullets.splice(eBull,1);
			} else {
				if (eBullY > canvas.height/2) { 
					context.drawImage(bulletType, 0, shift, frameWidth, frameHeight, enemyBullets[eBull][0]-(x/4)/2, enemyBullets[eBull][1]-y, x/4, y)
				} else {
					context.drawImage(bulletType, 0, shift, frameWidth, frameHeight, enemyBullets[eBull][0]-x/4, enemyBullets[eBull][1]-y, x/2, y)
				}
				enemyBullets[eBull][1] += 4+speed;
			}
		}
	}
}
function drawBackground() {
	bgcontext.drawImage(dirt, 0, bgY, canvas.width, 1000);
	bgcontext.drawImage(dirt, 0, bgY-1000, canvas.width, 1000);
	bgY += speed;
	if (bgY >= 1000) {
	bgY = 0;}
}

var getRandomXY = function(){
	return [Math.round(Math.random()*(canvas.width+x))-x, -Math.round(y + Math.random()*y)];
}
function drawTrees() {
	for (trees in forest) {
		if (forest[trees].coords.length == 0) {
			for (i = 1; i <= 10; i++) {
				if (Math.round(Math.random())) {
					forest[trees].coords[i] = [Math.round(Math.random()*(canvas.width+x))-x, Math.round(Math.random()*(1000))-y];
				}
			}
		} else {
			for (tree in forest[trees].coords) {
				if (forest[trees].coords[tree][1] > canvas.height+3*y) {
					forest[trees].coords[tree] = getRandomXY();
				} else {
					bgcontext.drawImage(forest[trees].type, forest[trees].coords[tree][0], forest[trees].coords[tree][1]-3*y, 4*x, 4*y);
				}
			forest[trees].coords[tree][1] += speed;
			}
		}
	}
}
function drawBuildings() {
	for (type in buildings) {
		if (buildings[type].length == 0) {
			for (i = 0; i < 5; i++) {
				buildings[type][i] = [Math.round(Math.random()*(canvas.width+x))-x, Math.round(Math.random()*(1000))-y];
			}
		} else {
			for (building in buildings[type]) {
				if (buildings[type][building][1] > canvas.height+y) {
					buildings[type][building] = getRandomXY();
				} else {
					if (type != 3) {
						bgcontext.drawImage(eval('building'+parseInt(type)), buildings[type][building][0], buildings[type][building][1]-y, x, y);
					} else {
						bgcontext.drawImage(eval('building'+parseInt(type)), buildings[type][building][0], buildings[type][building][1]-y, x*3, y*3);
					}
				}
			buildings[type][building][1] += speed;
			}
		}
	}
}
var leftORright = function() {
	return (Math.random() < 0.5 ? -1 : 1)*(Math.round(Math.random()*80+20));
}

function enemyFire(enemy) {
	if(leftORright() < 0 && leftORright() < 0) {
		if (type == 1) {
			enemyBullets.push([enemy.x+x/4,enemy.y+y*1.5,type]);
			enemyBullets.push([enemy.x+x*3/4,enemy.y+y*1.5,type]);
		} else {
			enemyBullets.push([enemy.x+x/2,enemy.y+y*1.5,type]);
		}
	}
}

function drawEnemies() {
	var count = 0;
	for (type in enemies) {
		count += Object.keys(enemies[type]).length;
		if (Object.keys(enemies[type]).length != 0) {
			for (e in enemies[type]) {
				var eDire = enemies[type][e].direction/Math.abs(enemies[type][e].direction);
				context.drawImage(eval('enemy'+type), 0, shift, frameWidth, frameHeight,
						enemies[type][e].x, enemies[type][e].y, x, y);
				if (enemies[type][e].y <= 0) {
					enemies[type][e].y += 4;
				}
				if (enemies[type][e].x <= 0){
					enemies[type][e].direction = 2*Math.abs(enemies[type][e].direction);
					enemies[type][e].x += 4;
				} else if (enemies[type][e].x >= canvas.width-x){
					enemies[type][e].direction = -2*Math.abs(enemies[type][e].direction);
					enemies[type][e].x -= 4;
				} else {
					if (Math.abs(enemies[type][e].direction) > 0){
						enemies[type][e].x += 2*eDire;
						enemies[type][e].direction -= eDire;
					} else {
						enemies[type][e].direction = leftORright();
						enemyFire(enemies[type][e]);
					}
				}
			}
		}
	}
	if (count == 0) {
		for (type in enemies) {
			for (i = 0; i <= Object.keys(enemies).length-type; i++){
				enemies[type].push({
					'x': Math.round(Math.random()*(canvas.width+x))-x,
					'y': -Math.round(y + Math.random()*y),
					'shield': parseInt(type),
					'direction': leftORright() });
			}
		}
	}
}
function drawShip() {
	playerShip.shield = (playerShip.shield < 1000 ? 
	(playerShip.shield >= 0 ? playerShip.shield + 1 : 0) : 1000);

	if (playerShip.turn < 0) {playerShip.turn = 0;} 
	else if (playerShip.turn > 3) {playerShip.turn = 3;}
	
	var weaponWidth = playerShip.width;
	if (playerShip.direction == 0) {
		playerShip.angle = frameWidth*3;
		if (playerShip.thrusters != fullThrust && playerShip.thrusters != noThrust) {
			playerShip.thrusters = normalThrust; }
		playerShip.turn = 0;
		
	} else {weaponWidth = playerShip.width - Math.round(playerShip.width*(playerShip.turn*0.07))}
	if (playerShip.angle < 0){
		playerShip.angle = 0;
		if (playerShip.thrusters != noThrust) {
			playerShip.thrusters = leftFT; }
	} else if (playerShip.angle > frameWidth*6) {
		playerShip.angle = frameWidth*6;
		if (playerShip.thrusters != noThrust) {
			playerShip.thrusters = rightFT; }
	}
	
	context.drawImage(weapons, -weaponWidth/2 - playerShip.direction*8 + playerShip.x, playerShip.y, weaponWidth, playerShip.height);
	context.drawImage(ship, playerShip.angle, 0, frameWidth, frameHeight,
				-playerShip.width/2 + playerShip.x, playerShip.y, playerShip.width, playerShip.height);
	if (playerShip.thrusters == thrustTurn) {
	context.drawImage(playerShip.thrusters, playerShip.angle, 0, frameWidth, frameHeight,
				-playerShip.width/2 + playerShip.x, playerShip.y, playerShip.width, playerShip.height);
	} else {
	context.drawImage(playerShip.thrusters, 0, shift, frameWidth, frameHeight,
				-playerShip.width/2 + playerShip.x, playerShip.y, playerShip.width, playerShip.height);
	}
	playerShip.angle = playerShip.angle + frameWidth*playerShip.direction*playerShip.turn;
}

function loadImage(e) {
  animate();
}
var lastLoop = new Date;
function animate() {
	var thisLoop = new Date;
    var fps = 1000 / (thisLoop - lastLoop);
    lastLoop = thisLoop;
	context.clearRect(0, 0, canvas.width, canvas.height);
	bgcontext.clearRect(0, 0, canvas.width, canvas.height);
	whatKey();
	drawBackground();
	drawBuildings();
	drawTrees();
	drawBullets();
	drawEBullets();
	drawShip();
	drawEnemies();
	drawHits();
	stats.innerHTML = '<div>Health: '+playerShip.health+'</div>';
	stats.innerHTML += '<div>Shield: '+playerShip.shield+'</div>';
	stats.innerHTML += '<div>FPS: '+Math.round(fps)+'</div>';
	
	shift += frameHeight;
	if (currentFrame == totalFrames) {
		shift = 0;
		currentFrame = 0;
	}
	currentFrame++;
	requestAnimationFrame(animate);
}

window.addEventListener("keydown", function (e) {
	keys[e.keyCode] = true;
});
window.addEventListener("keyup", function (e) {
	e.preventDefault();
	keys[e.keyCode] = false;
	if (e.key == 'w' || e.key == 's'){playerShip.thrusters = normalThrust;speed = 2;}
	if (e.key == 'a' || e.key == 'd'){playerShip.thrusters = normalThrust;}
});
var canFire = true;
function whatKey() {
	if (keys[32]) {
		if (canFire && playerShip.shield > 50) {
		bullets.player.push([playerShip.x-x/2-15-playerShip.direction*playerShip.turn*3, playerShip.y-y])
		bullets.player.push([playerShip.x-x/2+15-playerShip.direction*playerShip.turn*3, playerShip.y-y])
		canFire=false;
		setTimeout(function(){canFire=true;},playerShip.fireRate);
		playerShip.shield -= 50;
		}
	}
	if (keys[37] || keys[65]) {
	// a
		playerShip.thrusters = thrustTurn;
		playerShip.direction = -1;
		if (playerShip.x > x/2) {
			playerShip.x -= 6;
			if ((keys[38] || keys[87])) {playerShip.x -= 6;}
			if ((keys[40] || keys[83])) {playerShip.x += 3;}
		}
		if (playerShip.turn < 3){playerShip.turn += 1;}
	}
	if (keys[39] || keys[68]) {
	// d
		playerShip.thrusters = thrustTurn;
		playerShip.direction = 1;
		if (playerShip.x < (canvas.width-x/2)) {
			playerShip.x += 6;
			if ((keys[38] || keys[87])) {playerShip.x += 6;}
			if ((keys[40] || keys[83])) {playerShip.x -= 3;}
		}
		if (playerShip.turn < 3){playerShip.turn += 1;}
	}
	if ((keys[39] || keys[68])&&(keys[37] || keys[65])) {
	// a and d
		playerShip.direction = 0;
	}
	if ((keys[38] || keys[87])) {
	// w
		speed = 3;
		playerShip.thrusters = fullThrust;
		if (playerShip.y > bottomY-120) {playerShip.y -= 8;}
		if (playerShip.y < bottomY-120) {playerShip.y = bottomY-120;}
	}
	if ((keys[40] || keys[83])) {
	// s
		speed = 1;
		playerShip.thrusters = noThrust;
		if (playerShip.y < bottomY+53) {playerShip.y += 6;}
		if (playerShip.y > bottomY+53) {playerShip.y = bottomY+53;}
	}
	if ((keys[38] || keys[87]) && (keys[40] || keys[83])) {
	// w and s
		speed = 2;
		playerShip.thrusters = normalThrust;
		if (playerShip.y > bottomY) {playerShip.y-=4;}
		else if (playerShip.y < bottomY) {playerShip.y+=4;}
	}
	if (!keys[37] && !keys[65] && !keys[39] && !keys[68]) {
	// not a and not d
		if (playerShip.turn < 3){playerShip.turn -= 1;}
		else {playerShip.direction = 0;}
		if (playerShip.y > bottomY) {playerShip.y-=2;}
		else if (playerShip.y < bottomY) {playerShip.y+=2;}
	}
	if ((keys[38] || keys[87]) && (keys[39] || keys[68] || keys[37] || keys[65])) {
		// w and (a or d)
		if ((keys[39] || keys[68])&&(keys[37] || keys[65])) {
		// a and d
		playerShip.thrusters = fullThrust;
		} else {playerShip.thrusters = thrustTurn;}
	}
}

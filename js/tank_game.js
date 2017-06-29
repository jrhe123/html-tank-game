var heroColor = new Array('#A1D490','#5D874E','#38BF0B');
var enemyColor = new Array('red','blue','green');
var heroBullets = new Array();
var enemyBullets = new Array();
var bombs = new Array();

function makeid() {
	return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
}

function Bomb(x, y) {
	this.x = x;
	this.y = y;
	this.isLive = true;
	this.blood = 9;
	this.bloodDown = function() {
		if(this.blood > 0) {
			this.blood--;
		} else {
			this.isLive = false;
		}
	}
}

function Bullet(x, y, direct, speed, type, tank){
	this.x = x;
	this.y = y;
	this.speed = speed;
	this.direct = direct;
	this.timer = null;
	this.isLive = true;
	this.type = type;
	this.tank = tank;
	
	this.run = function(){
		
		if(this.x <= 0 || this.x >= 400 || this.y <= 0 || this.y >= 300){
			window.clearInterval(this.timer);
			this.isLive = false;
			
			if(this.type == "enemy") {
				this.tank.bulletIsLive = false;
			}
		}else{
			switch(this.direct){
				case 0:
					this.y -= this.speed;
					break;
				case 1:
					this.x += this.speed;
					break;
				case 2:
					this.y += this.speed;
					break;
				case 3:
					this.x -= this.speed;
					break;
			}
		}
		document.getElementById('aa').innerText = "x:" + this.x + "; y:" + this.y;
	}
}

function Tank(x, y, direct, color) {
	this.x = x;
	this.y = y;
	this.speed = 5;
	this.isLive = true;
	this.direct = direct;
	this.color = color;

	this.moveUp = function() {
		this.y -= this.speed;
		this.direct = 0;
	}
	this.moveRight = function() {
		this.x += this.speed;
		this.direct = 1;
	}
	this.moveDown = function() {
		this.y += this.speed;
		this.direct = 2;
	}
	this.moveLeft = function() {
		this.x -= this.speed;
		this.direct = 3;
	}
}

function Hero(x, y, direct) {
	this.tank = Tank;
	this.tank(x, y, direct, heroColor);
	
	this.shotEnemy = function(){
		switch(this.direct){
			case 0:
				heroBullet = new Bullet(this.x+9, this.y, this.direct, 2, "hero", this);
				break;
			case 1:
				heroBullet = new Bullet(this.x+30, this.y+9, this.direct, 2, "hero", this);
				break;
			case 2:
				heroBullet = new Bullet(this.x+9, this.y+30, this.direct, 2, "hero", this);
				break;
			case 3:
				heroBullet = new Bullet(this.x, this.y+9, this.direct, 2, "hero", this);
				break;
		}
		heroBullets.push(heroBullet);
		var timer = window.setInterval("heroBullets["+(heroBullets.length-1)+"].run()",50);
		heroBullets[heroBullets.length-1].timer = timer;
	}
}

function EnemyTank(x, y, direct) {
	this.tank = Tank;
	this.count = 0;
	this.bulletIsLive = true;
	
//	for(var i = 0; i < enemyColor.length; i++){
//		enemyColor[i] = makeid();
//	}
	this.tank(x, y, direct, enemyColor);
	
	this.run = function() {
		switch(this.direct) {
			case 0:
				if(this.y > 0) {
					this.y -= this.speed;
				}
				break;
			case 1:
				if(this.x + 30 < 400) {
					this.x += this.speed;
				}
				break;
			case 2:
				if(this.y + 30 < 300) {
					this.y += this.speed;
				}
				break;
			case 3:
				if(this.x > 0) {
					this.x -= this.speed;
				}
				break;
		}
		if(this.count > 30) {
			this.direct = Math.round(Math.random() * 3);
			this.count = 0;
		}
		this.count++;

		if(this.bulletIsLive == false) {
			switch(this.direct) {
				case 0:
					etBullet = new Bullet(this.x + 9, this.y, this.direct, 1, "enemy", this);
					break;
				case 1:
					etBullet = new Bullet(this.x + 30, this.y + 9, this.direct, 1, "enemy", this);
					break;
				case 2:
					etBullet = new Bullet(this.x + 9, this.y + 30, this.direct, 1, "enemy", this);
					break;
				case 3:
					etBullet = new Bullet(this.x, this.y + 9, this.direct, 1, "enemy", this);
					break;
			}
			enemyBullets.push(etBullet);
			var mytimer = window.setInterval("enemyBullets[" + (enemyBullets.length - 1) + "].run()", 50);
			enemyBullets[enemyBullets.length - 1].timer = mytimer;
			this.bulletIsLive = true;
		}

	}
}

function drawEnemyBullet() {
	for(var i = 0; i < enemyBullets.length; i++) {
		var etBullet = enemyBullets[i];
		if(etBullet.isLive) {
			cxt.fillStyle = "#FF0000";
			cxt.fillRect(etBullet.x, etBullet.y, 2, 2);
		}
	}
}


function drawHeroBullet(){
	for(var i = 0; i < heroBullets.length; i++){	
		var heroBullet = heroBullets[i];
		if(heroBullet != null && heroBullet.isLive){
			cxt.fillStyle = "white";
			cxt.fillRect(heroBullet.x, heroBullet.y, 2, 2);
		}
	}
}

function drawTank(tank) {

	if(tank.isLive) {
		switch(tank.direct) {
	
			case 0:
			case 2:
				cxt.fillStyle = tank.color[0];
				cxt.fillRect(tank.x, tank.y, 5, 30);
				cxt.fillRect(tank.x + 15, tank.y, 5, 30);
				cxt.fillRect(tank.x + 6, tank.y + 5, 8, 20);
				cxt.fillStyle = tank.color[1];
				cxt.arc(tank.x + 10, tank.y + 15, 4, 0, 2 * Math.PI, true);
				cxt.fill();
	
				cxt.strokeStyle = tank.color[2];
				cxt.lineWidth = 2;
				cxt.beginPath();
				cxt.moveTo(tank.x + 10, tank.y + 15);
				if(tank.direct == 0) {
					cxt.lineTo(tank.x + 10, tank.y);
				} else if(tank.direct == 2) {
					cxt.lineTo(tank.x + 10, tank.y + 30);
				}
	
				cxt.closePath();
				cxt.stroke();
				break;
	
			case 1:
			case 3:
				cxt.fillStyle = tank.color[0];
				cxt.fillRect(tank.x, tank.y, 30, 5);
				cxt.fillRect(tank.x, tank.y + 15, 30, 5);
				cxt.fillRect(tank.x + 5, tank.y + 6, 20, 8);
				cxt.fillStyle = tank.color[1];
				cxt.arc(tank.x + 15, tank.y + 10, 4, 0, 2 * Math.PI, true);
				cxt.fill();
	
				cxt.strokeStyle = tank.color[2];
				cxt.lineWidth = 2;
				cxt.beginPath();
				cxt.moveTo(tank.x + 15, tank.y + 10);
				if(tank.direct == 1) {
					cxt.lineTo(tank.x + 30, tank.y + 10);
				} else if(tank.direct == 3) {
					cxt.lineTo(tank.x, tank.y + 10);
				}
	
				cxt.closePath();
				cxt.stroke();
				break;
	
		}
	}
}


function isHitEnemyTank() {
	for(var i = 0; i < heroBullets.length; i++) {
		var heroBullet = heroBullets[i];
		if(heroBullet.isLive) {
			for(var j = 0; j < enemyTanks.length; j++) {
				var enemyTank = enemyTanks[j];
				if(enemyTank.isLive) {
					switch(enemyTank.direct) {
						case 0:
						case 2:
							if(heroBullet.x >= enemyTank.x && heroBullet.x <= enemyTank.x + 20 &&
								heroBullet.y >= enemyTank.y && heroBullet.y <= enemyTank.y + 30) {
								enemyTank.isLive = false;
								heroBullet.isLive = false;
								var bomb = new Bomb(enemyTank.x, enemyTank.y);
								bombs.push(bomb);
							}
							break;
						case 1:
						case 3:
							if(heroBullet.x >= enemyTank.x && heroBullet.x <= enemyTank.x + 30 &&
								heroBullet.y >= enemyTank.y && heroBullet.y <= enemyTank.y + 20) {
								enemyTank.isLive = false;
								heroBullet.isLive = false;
								var bomb = new Bomb(enemyTank.x, enemyTank.y);
								bombs.push(bomb);
							}
							break;
					}
				}
			}
		}
	}
}

function drawEnemyBomb() {
	for(var i = 0; i < bombs.length; i++) {
		var bomb = bombs[i];
		if(bomb.isLive) {
			if(bomb.blood > 6) {
				var img1 = new Image();
				img1.src = "bomb_1.gif";
				var x = bomb.x;
				var y = bomb.y;
				img1.onload = function() {
					cxt.drawImage(img1, x, y, 30, 30);
				}
			} else if(bomb.blood > 3) {
				var img2 = new Image();
				img2.src = "bomb_2.gif";
				var x = bomb.x;
				var y = bomb.y;
				img2.onload = function() {
					cxt.drawImage(img2, x, y, 30, 30);
				}
			} else {
				var img3 = new Image();
				img3.src = "bomb_3.gif";
				var x = bomb.x;
				var y = bomb.y;
				img3.onload = function() {
					cxt.drawImage(img3, x, y, 30, 30);
				}
			}
			bomb.bloodDown();
			if(bomb.blood <= 0) {
				bombs.splice(i, 1);

			}
		}
	}
}
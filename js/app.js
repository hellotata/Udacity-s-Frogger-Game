var Game = function() {
    this.stop = false;
    this.score = 0;
    this.life = 3;
}

Game.prototype.checkItemHelpers = function() {
    if (Math.abs(player.x - helperItem.x) < 50 && (Math.abs(player.y - helperItem.y) < 40)) {
        if (helperItem.sprite == 'images/Rock.png') {
            this.life--;
        }
        if (helperItem.sprite == 'images/Heart.png') {
            this.life++;
        }
        if (helperItem.sprite == 'images/Gem Blue.png') {
            this.score = this.score + 100;
        }
        if (helperItem.sprite == 'images/Gem Green.png') {
            this.score = this.score + 50;
        }
        if (helperItem.sprite == 'images/Gem Orange.png') {
            this.score = this.score + 25;
        }
    helperItem.x = -100;
    helperItem.y = -100;
    }
}

Game.prototype.gameOver = function() {
    var gameBoard = document.getElementById("game-board");
    gameBoard.parentNode.removeChild(gameBoard);
    var gameOverMessage = document.getElementById("gameOver-message");
    gameOverMessage.innerHTML = "Game Over! Your final score is " + game.score + "!";
}

Game.prototype.render = function() {
    if (this.life == 0) {
        this.stop = true;
        this.gameOver();
    }
}

// Enemies our player must avoid
var Enemy = function() {
    this.xRange = [-150, 700];
    this.possibleY = [145, 225, 310];
    this.speedRange = [150, 400];
    this.sprite = 'images/enemy-bug.png';
    this.reset();
};

Enemy.prototype.reset = function() {
    this.x = this.xRange[0];
    this.y = this.possibleY[Math.floor(Math.random() * this.possibleY.length)];
    this.speed = this.randomSpeed();
}

Enemy.prototype.randomSpeed = function() {
    var minSpeed = this.speedRange[0],
        maxSpeed = this.speedRange[1];
    return Math.floor(Math.random() * (maxSpeed - minSpeed)) + minSpeed;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    var maxPos = this.xRange[1];
    this.x += this.speed * dt;

    if (this.x > maxPos) {
        this.reset();
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
var Player = function() {
    this.sprite = 'images/char-horn-girl.png';
    this.reset();
};

Player.prototype.reset = function() {
    this.x = 300;
    this.y = 480;
}

// This class requires an update(), render() and
Player.prototype.update = function(dt) {
    this.x * dt;
    this.y * dt;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// a handleInput() method.
Player.prototype.handleInput = function(key) {
  switch(key) {
    case 'left':
      if (this.x > 0)
        this.x -= 101;
      break;
    case 'up':
      if (this.y > 0)
        this.y -= 83;
      break;
    case 'right':
      if (this.x < 600)
        this.x += 101;
      break;
    case 'down':
      if (this.y < 400)
        this.y += 83;
      break;
    default:
      return;
  };
};

var Item = function() {
    this.possibleX = [6, 107, 208, 309, 410, 511, 612];
    this.possibleY = [187, 270, 353];
    this.x = this.positionX();
    this.y = this.positionY();
};

Item.prototype.positionX = function() {
  var startX = this.possibleX[Math.floor(Math.random() * this.possibleX.length)];
  return startX;
};

Item.prototype.positionY = function() {
  var startY = this.possibleY[Math.floor(Math.random() * this.possibleY.length)];
  return startY;
};

Item.prototype.reset = function() {
  this.x = this.positionX();
  this.y = this.positionY();
};

Item.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var HelperItem = function() {
  Item.call(this);
  this.loadHelperItem();
  this.reset();
};

HelperItem.prototype = Object.create(Item.prototype);

HelperItem.prototype.constructor = helperItem;

HelperItem.prototype.loadHelperItem = function() {
  this.spriteOptions = ['images/Rock.png','images/Rock.png','images/Gem Blue.png','images/Gem Blue.png','images/Gem Green.png','images/Gem Green.png','images/Gem Orange.png','images/Gem Orange.png','images/Heart.png'];
  this.sprite = this.spriteOptions[Math.floor(Math.random() * this.spriteOptions.length)];
};

HelperItem.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 90, 108);
};

HelperItem.prototype.reset = function() {
  var that = this;
  that.x = -100;
  that.y = -100;
  setInterval(function() {
    that.loadHelperItem();
    Item.prototype.reset.call(that);
  }, 5000);
};

var helperItem = new HelperItem;

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];
for (var i = 0; i < 5; i++) {
    allEnemies.push(new Enemy());
}

// Place the player object in a variable called player
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    if([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
    player.handleInput(allowedKeys[e.keyCode]);
});

"use strict";

const MS_PER_FRAME = 1000/8;
const MAX_VELOCITY = 2.6;
const PROTECTION_TIMEOUT = 3000;

/* Classes */
const Shot = require('./shot.js');
const ResourceManager = require('./resource-manager.js');

var resourceManager = new ResourceManager();

/**
 * @module exports the Player class
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 * @param {canvasDOMElement} canvas world size
 * @param {object} entityManager all entities maintainer
 */
function Player(position, canvas, entityManager) {
  this.worldWidth = canvas.width;
  this.worldHeight = canvas.height;
  this.state = "idle";
  this.position = {
    x: position.x,
    y: position.y
  };
  this.velocity = {
    x: 0,
    y: 0
  }
  this.angle = 0;
  this.radius = 12;
  this.lives = 3;
  this.score = 0;
  this.protectionTimer = PROTECTION_TIMEOUT;
  this.thrusting = false;
  this.shooting = false;
  this.steerLeft = false;
  this.steerRight = false;
  this.timer = 0;
  this.entityManager = entityManager;

  var self = this;
  window.onkeydown = function(event) {
    switch(event.key) {
      case 'ArrowUp': // up
      case 'w':
        self.thrusting = true;
        break;
      case 'ArrowLeft': // left
      case 'a':
        self.steerLeft = true;
        break;
      case 'ArrowRight': // right
      case 'd':
        self.steerRight = true;
        break;
      case ' ': // shoot
        self.shooting = true;
        break;
    }
  }

  window.onkeyup = function(event) {
    switch(event.key) {
      case 'ArrowUp': // up
      case 'w':
        self.thrusting = false;
        break;
      case 'ArrowLeft': // left
      case 'a':
        self.steerLeft = false;
        break;
      case 'ArrowRight': // right
      case 'd':
        self.steerRight = false;
        break;
      case ' ': // shoot
        self.shooting = false;
        break;
    }
  }
}

/**
 * @function reset
 * Resets player to initial state
 */
Player.prototype.reset = function() {
  this.protectionTimer = PROTECTION_TIMEOUT;
  this.position = {x: this.worldWidth / 2, y: this.worldHeight / 2};
  this.velocity = {x: 0, y: 0};
  this.angle = 0;
}

/**
 * @function hit
 * Decreases lives because of being hit
 */
Player.prototype.hit = function() {
  if(this.lives > 0) {
    this.lives--;
    this.reset();
  }
}

/**
 * @function addPoints
 * Adds points to the player as a result of hitting the asteroid
 */
Player.prototype.addPoints = function(score) {
  this.score += score;
}

/**
 * @function update updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(time) {

  if(this.protectionTimer > 0) {
    this.protectionTimer -= time;
    return;
  }

  this.protectionTimer = 0;

  this.timer += time;
  if(this.shooting && this.timer > MS_PER_FRAME) {
    this.timer = 0;
    this.entityManager.addShot(new Shot(this.position, this.angle));
    resourceManager.fire.play();
  }

  // Apply angular velocity
  if(this.steerLeft) {
    this.angle += 0.1;
  }
  if(this.steerRight) {
    this.angle -= 0.1;
  }
  // Apply acceleration
  if(this.thrusting) {
    var acceleration = {
      x: Math.sin(this.angle),
      y: Math.cos(this.angle)
    }
    this.velocity.x -= acceleration.x;
    this.velocity.y -= acceleration.y;

    if(this.velocity.x > MAX_VELOCITY) this.velocity.x = MAX_VELOCITY;
    else if(this.velocity.x < -1 * MAX_VELOCITY) this.velocity.x = -1 * MAX_VELOCITY;

    if(this.velocity.y > MAX_VELOCITY) this.velocity.y = MAX_VELOCITY;
    else if(this.velocity.y < -1 * MAX_VELOCITY) this.velocity.y = -1 * MAX_VELOCITY;
  }
  // Apply velocity
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
  // Wrap around the screen
  if(this.position.x < 0) this.position.x += this.worldWidth;
  if(this.position.x > this.worldWidth) this.position.x -= this.worldWidth;
  if(this.position.y < 0) this.position.y += this.worldHeight;
  if(this.position.y > this.worldHeight) this.position.y -= this.worldHeight;
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Player.prototype.render = function(time, ctx) {
  ctx.save();

  ctx.fillStyle = "#fff";

  if(this.protectionTimer > 0) {
    ctx.font = "bold 3em Georgia";
    ctx.fillText(Math.ceil(this.protectionTimer / 1000), (this.worldWidth / 2) - 15, this.worldHeight / 2);
  }

  ctx.font = "bold 1em Georgia";
  ctx.fillText("Lives: " + this.lives, 10, 20);
  ctx.fillText("Score: " + this.score, 10, 40);

  // Draw player's ship
  ctx.translate(this.position.x, this.position.y);
  ctx.rotate(-this.angle);
  ctx.beginPath();
  //ctx.arc(0,0,this.radius,0,2*Math.PI);
  ctx.moveTo(0, -10);
  ctx.lineTo(-10, 10);
  ctx.lineTo(0, 0);
  ctx.lineTo(10, 10);
  ctx.closePath();
  ctx.strokeStyle = 'white';
  ctx.stroke();

  // Draw engine thrust
  if(this.thrusting) {
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(5, 10);
    ctx.arc(0, 10, 5, 0, Math.PI, true);
    ctx.closePath();
    ctx.strokeStyle = 'orange';
    ctx.stroke();
  }
  ctx.restore();
}

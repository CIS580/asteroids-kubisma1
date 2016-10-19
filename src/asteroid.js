"use strict";

const LARGE_VELOCITY = 1.5;
const MEDIUM_VELOCITY = 1.1;
const SMALL_VELOCITY = 0.7;
const LARGE_RADIUS = 20;
const MEDIUM_RADIUS = 15;
const SMALL_RADIUS = 10;
const LARGE_LIVES = 3;
const MEDIUM_LIVES = 2;
const SMALL_LIVES = 1;
const ASTEROID_COLOR = '#C90018';
const INVALID_POSITION = -300;

/**
 * @module exports the Asteroid base class
 */
module.exports = exports = {
  LargeAsteroid: LargeAsteroid,
  MediumAsteroid: MediumAsteroid,
  SmallAsteroid: SmallAsteroid
};

/**
 * @constructor Asteroid
 * Creates a new asteroid object
 * @param {Postition} position object specifying an x and y
 * @param {canvasDOMElement} canvas world size
 */
function Asteroid(position, angle, canvas) {
  this.position = {
    x: position.x,
    y: position.y
  };
  this.angle = angle;
  this.color = ASTEROID_COLOR;
  this.canvas = canvas;
  this.worldWidth = canvas.width;
  this.worldHeight = canvas.height;
}

/**
 * @function hit
 * decreases asteroid lives
 */
Asteroid.prototype.hit = function() {
  if(this.lives > 0) this.lives--;
}

/**
 * @function update
 * updates the asteroid object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Asteroid.prototype.update = function(time) {

  if(this.position.x == INVALID_POSITION && this.position.y == INVALID_POSITION) return;

  // Apply velocity
  this.position.x -= this.velocity.x;
  this.position.y -= this.velocity.y;

  // Wrap around the screen
  if(this.position.x < 0) this.position.x += this.worldWidth;
  if(this.position.x > this.worldWidth) this.position.x -= this.worldWidth;
  if(this.position.y < 0) this.position.y += this.worldHeight;
  if(this.position.y > this.worldHeight) this.position.y -= this.worldHeight;
}

/**
 * @function render
 * renders the medium asteroid object into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Asteroid.prototype.render = function(time, ctx) {
  ctx.save();

  // Draw a large asteroid
  ctx.translate(this.position.x, this.position.y);
  ctx.beginPath();
  ctx.arc(0, 0, this.radius, 0, 2*Math.PI);
  ctx.closePath();
  ctx.strokeStyle = this.color;
  ctx.stroke();

  ctx.restore();
}

/**
 * @function calculateVelocity
 * calculates a velocity based on asteroids angle and max velocity
 * @param {Float} angle
 * @param {Float} maxVelocity max speed of an asteroid
 */
function calculateVelocity(angle, maxVelocity) {
  return {
    x: Math.sin(angle) * maxVelocity,
    y: Math.cos(angle) * maxVelocity
  }
}

/**
 * @function setInvalidPosition
 * sets asteroid's position to invalid coords
 */
function setInvalidPosition() {
  this.position = {x: INVALID_POSITION, y: INVALID_POSITION};
}

/**
 * @function getNewAngles
 * generates new angles based on original angle
 */
function getNewAngles() {
  var angle;
  var angles = [];
  var random = Math.floor(Math.random() * 2) + 2;
  
  for(var x = 1; x <= random; x++) {
    angle = this.angle % 2*Math.PI;
    angles.push((angle - (x*Math.PI/2)) % 2*Math.PI);
  }

  return angles;
}

/**
 * @constructor LargeAsteroid
 * Creates a new large asteroid object
 * @param {Postition} position object specifying an x and y
 * @param {canvasDOMElement} canvas world size
 */
function LargeAsteroid(position, angle, canvas) {
  Asteroid.call(this, position, angle, canvas);

  this.radius = LARGE_RADIUS;
  this.lives = LARGE_LIVES;
  this.velocity = calculateVelocity(this.angle, LARGE_VELOCITY);
}

/**
 * @function hit
 * decreases asteroid lives
 */
LargeAsteroid.prototype.hit = function() {
  Asteroid.prototype.hit.call(this);

  var newAsteroids = [];

  if(this.lives == 0) {
    var angles = getNewAngles.call(this);
    var position;
    var self = this;
    angles.forEach(function(angle) {
      position = {x: self.position.x + Math.sin(angle) * MEDIUM_RADIUS, y: self.position.y + Math.cos(angle) * MEDIUM_RADIUS};
      newAsteroids.push(new MediumAsteroid(position, angle, self.canvas))
    });
    setInvalidPosition.call(this);
  }

  return newAsteroids;
}

/**
 * @function updates the large asteroid object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
LargeAsteroid.prototype.update = function(time) {
  Asteroid.prototype.update.call(this, time);
  this.angle -= 0.08;
}

/**
 * @function renders the large asteroid object into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
LargeAsteroid.prototype.render = function(time, ctx) {
  Asteroid.prototype.render.call(this, time, ctx);
}

/**
 * @constructor MediumAsteroid
 * Creates a new medium asteroid object
 * @param {Postition} position object specifying an x and y
 * @param {canvasDOMElement} canvas world size
 */
function MediumAsteroid(position, angle, canvas) {
  Asteroid.call(this, position, angle, canvas);

  this.radius = MEDIUM_RADIUS;
  this.lives = MEDIUM_LIVES;
  this.velocity = calculateVelocity(this.angle, MEDIUM_VELOCITY);
}

/**
 * @function hit
 * decreases asteroid lives
 */
MediumAsteroid.prototype.hit = function() {
  Asteroid.prototype.hit.call(this);

  var newAsteroids = [];

  if(this.lives == 0) {
    var angles = getNewAngles.call(this);
    var position;
    var self = this;
    angles.forEach(function(angle) {
      position = {x: self.position.x + Math.sin(angle) * SMALL_RADIUS, y: self.position.y + Math.cos(angle) * SMALL_RADIUS};
      newAsteroids.push(new SmallAsteroid(position, angle, self.canvas))
    });
    setInvalidPosition.call(this);
  }

  return newAsteroids;
}

/**
 * @function updates the medium asteroid object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
MediumAsteroid.prototype.update = function(time) {
  Asteroid.prototype.update.call(this, time);
  this.angle += 0.02;
}

/**
 * @function renders the medium asteroid object into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
MediumAsteroid.prototype.render = function(time, ctx) {
  Asteroid.prototype.render.call(this, time, ctx);
}

/**
 * @constructor SmallAsteroid
 * Creates a new small asteroid object
 * @param {Postition} position object specifying an x and y
 * @param {canvasDOMElement} canvas world size
 */
function SmallAsteroid(position, angle, canvas) {
  Asteroid.call(this, position, angle, canvas);

  this.radius = SMALL_RADIUS;
  this.lives = SMALL_LIVES;
  this.velocity = calculateVelocity(this.angle, SMALL_VELOCITY);
}

/**
 * @function hit
 * decreases asteroid lives
 */
SmallAsteroid.prototype.hit = function() {
  Asteroid.prototype.hit.call(this);

  if(this.lives == 0) setInvalidPosition.call(this);
  return [];
}

/**
 * @function updates the small asteroid object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
SmallAsteroid.prototype.update = function(time) {
  Asteroid.prototype.update.call(this, time);
  this.angle -= 0.009;
}

/**
 * @function renders the small asteroid into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
SmallAsteroid.prototype.render = function(time, ctx) {
  Asteroid.prototype.render.call(this, time, ctx);
}

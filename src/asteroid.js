"use strict";

const LARGE_VELOCITY = 2;
const MEDIUM_VELOCITY = 1.5;
const SMALL_VELOCITY = 0.5;
const LARGE_RADIUS = 20;
const MEDIUM_RADIUS = 15;
const SMALL_RADIUS = 10;

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
function Asteroid(position, canvas) {
  this.position = {
    x: position.x,
    y: position.y
  };
  this.angle = Math.random() * 2 - 1;
  this.worldWidth = canvas.width;
  this.worldHeight = canvas.height;
}

/**
 * @function updates the asteroid object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Asteroid.prototype.update = function(time) {
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
 * @constructor LargeAsteroid
 * Creates a new large asteroid object
 * @param {Postition} position object specifying an x and y
 * @param {canvasDOMElement} canvas world size
 */
function LargeAsteroid(position, canvas) {
  Asteroid.call(this, position, canvas);

  this.radius = LARGE_RADIUS;
  this.velocity = calculateVelocity(this.angle, LARGE_VELOCITY);
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
  ctx.save();

  // Draw a large asteroid
  ctx.translate(this.position.x, this.position.y);
  ctx.rotate(-this.angle);
  ctx.beginPath();
  ctx.moveTo(0,-LARGE_RADIUS);
  ctx.lineTo(LARGE_RADIUS,-LARGE_RADIUS);
  ctx.lineTo(LARGE_RADIUS,LARGE_RADIUS);
  ctx.lineTo(-LARGE_RADIUS,LARGE_RADIUS);
  ctx.lineTo(-LARGE_RADIUS,-LARGE_RADIUS);
  ctx.closePath();
  ctx.strokeStyle = '#C90018';
  ctx.stroke();

  ctx.restore();
}

/**
 * @constructor MediumAsteroid
 * Creates a new medium asteroid object
 * @param {Postition} position object specifying an x and y
 * @param {canvasDOMElement} canvas world size
 */
function MediumAsteroid(position, canvas) {
  Asteroid.call(this, position, canvas);

  this.radius = MEDIUM_RADIUS;
  this.velocity = calculateVelocity(this.angle, MEDIUM_VELOCITY);
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
  ctx.save();

  // Draw a medium asteroid
  ctx.translate(this.position.x, this.position.y);
  ctx.rotate(-this.angle);
  ctx.beginPath();
  ctx.moveTo(0,-MEDIUM_RADIUS);
  ctx.lineTo(MEDIUM_RADIUS,-MEDIUM_RADIUS);
  ctx.lineTo(MEDIUM_RADIUS,MEDIUM_RADIUS);
  ctx.lineTo(-MEDIUM_RADIUS,MEDIUM_RADIUS);
  ctx.lineTo(-MEDIUM_RADIUS,-MEDIUM_RADIUS);
  ctx.closePath();
  ctx.strokeStyle = '#C90018';
  ctx.stroke();

  ctx.restore();
}

/**
 * @constructor SmallAsteroid
 * Creates a new small asteroid object
 * @param {Postition} position object specifying an x and y
 * @param {canvasDOMElement} canvas world size
 */
function SmallAsteroid(position, canvas) {
  Asteroid.call(this, position, canvas);

  this.radius = SMALL_RADIUS;
  this.velocity = calculateVelocity(this.angle, SMALL_VELOCITY);
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
  ctx.save();

  // Draw a medium asteroid
  ctx.translate(this.position.x, this.position.y);
  ctx.rotate(-this.angle);
  ctx.beginPath();
  ctx.moveTo(0,-SMALL_RADIUS);
  ctx.lineTo(SMALL_RADIUS,-SMALL_RADIUS);
  ctx.lineTo(SMALL_RADIUS,SMALL_RADIUS);
  ctx.lineTo(-SMALL_RADIUS,SMALL_RADIUS);
  ctx.lineTo(-SMALL_RADIUS,-SMALL_RADIUS);
  ctx.closePath();
  ctx.strokeStyle = '#C90018';
  ctx.stroke();

  ctx.restore();
}

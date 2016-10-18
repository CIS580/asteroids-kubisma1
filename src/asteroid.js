"use strict";

const LARGE_VELOCITY = 1.7;
const MEDIUM_VELOCITY = 1.4;
const SMALL_VELOCITY = 0.8;
const LARGE_RADIUS = 20;
const MEDIUM_RADIUS = 15;
const SMALL_RADIUS = 10;
const ASTEROID_COLOR = '#FF0011';

/* Classes */
const Vector = require('./vector.js');

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
function Asteroid(position, radius, canvas) {
  this.position = {
    x: position.x,
    y: position.y
  };
  this.angle = Math.random() * 2 - 1;
  this.worldWidth = canvas.width;
  this.worldHeight = canvas.height;
  this.color = ASTEROID_COLOR;
  this.radius = radius;
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
 * @function renders the large asteroid object into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Asteroid.prototype.render = function(time, ctx) {
  ctx.save();

  // Draw an asteroid
  //ctx.translate(this.position.x, this.position.y);
  //ctx.rotate(-this.angle);
  ctx.beginPath();
  ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
  for(var i = 1; i < this.vertices.length; i++) {
    ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
  }
  ctx.closePath();
  ctx.strokeStyle = this.color;
  ctx.arc(this.position.x, this.position.y, 3, 0, 2*Math.PI);
  ctx.arc(this.position.x, this.position.y, this.radius, 0, 2*Math.PI);
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
  * @function updateVertices
  * calculates new vertices after rotation
  */
function updateVertices() {
  var addition;
  var vertices = [];
  for(var i = 0; i < this.coords.length; i++){
    addition = Vector.rotate(this.coords[i], -this.angle);
    vertices.push({x: this.position.x + addition.x, y: this.position.y + addition.y});
  }
  return vertices;
}

/**
 * @constructor LargeAsteroid
 * Creates a new large asteroid object
 * @param {Postition} position object specifying an x and y
 * @param {canvasDOMElement} canvas world size
 */
function LargeAsteroid(position, canvas) {
  Asteroid.call(this, position, LARGE_RADIUS, canvas);

  this.velocity = calculateVelocity(this.angle, LARGE_VELOCITY);
  this.coords = [{x: LARGE_RADIUS, y: -LARGE_RADIUS}, {x: LARGE_RADIUS, y: LARGE_RADIUS},
                 {x: -LARGE_RADIUS, y: LARGE_RADIUS}, {x: -LARGE_RADIUS, y: -LARGE_RADIUS}];
  this.vertices = updateVertices.call(this);
}

/**
 * @function updates the large asteroid object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
LargeAsteroid.prototype.update = function(time) {
  Asteroid.prototype.update.call(this, time);
  this.angle -= 0.05;
  this.vertices = updateVertices.call(this, LARGE_RADIUS);
}

/**
 * @function renders the small asteroid into the provided context
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
function MediumAsteroid(position, canvas) {
  Asteroid.call(this, position, MEDIUM_RADIUS, canvas);

  this.velocity = calculateVelocity(this.angle, MEDIUM_VELOCITY);
  this.coords = [{x: MEDIUM_RADIUS, y: -MEDIUM_RADIUS}, {x: MEDIUM_RADIUS, y: MEDIUM_RADIUS},
                 {x: -MEDIUM_RADIUS, y: MEDIUM_RADIUS}, {x: -MEDIUM_RADIUS, y: -MEDIUM_RADIUS}];
  this.vertices = updateVertices.call(this, MEDIUM_RADIUS);
}

/**
 * @function updates the medium asteroid object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
MediumAsteroid.prototype.update = function(time) {
  Asteroid.prototype.update.call(this, time);
  this.angle += 0.035;
  this.vertices = updateVertices.call(this, MEDIUM_RADIUS);
}

/**
 * @function renders the small asteroid into the provided context
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
function SmallAsteroid(position, canvas) {
  Asteroid.call(this, position, SMALL_RADIUS, canvas);

  this.velocity = calculateVelocity(this.angle, SMALL_VELOCITY);
  this.coords = [{x: SMALL_RADIUS, y: -SMALL_RADIUS}, {x: SMALL_RADIUS, y: SMALL_RADIUS},
                 {x: -SMALL_RADIUS, y: SMALL_RADIUS}, {x: -SMALL_RADIUS, y: -SMALL_RADIUS}];
  this.vertices = updateVertices.call(this, SMALL_RADIUS);
}

/**
 * @function updates the small asteroid object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
SmallAsteroid.prototype.update = function(time) {
  Asteroid.prototype.update.call(this, time);
  this.angle -= 0.018;
  this.vertices = updateVertices.call(this, SMALL_RADIUS);
}

/**
 * @function renders the small asteroid into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
SmallAsteroid.prototype.render = function(time, ctx) {
  Asteroid.prototype.render.call(this, time, ctx);
}

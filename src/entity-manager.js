"use strict";

const TOLERANCE = 10;
const ASTEROID_COLOR = '#FF0011';

/* Classes */
const Vector = require('./vector.js');

/**
 * @module exports the EntityManager class
 */
module.exports = exports = EntityManager;

/**
 * @constructor EntityManager
 * Creates a new entity manager object which maintains asteroids, player's ship,
 * shots and detects collisions
 * @param {canvasDOMElement} canvas world size
 */
function EntityManager(canvas) {
  this.worldWidth = canvas.width;
  this.worldHeight = canvas.height;
  this.player = undefined;
  this.shots = [];
  this.asteroids = [];
}

/**
 * @function addPlayer
 * Adds a player
 * {object} player
 */
EntityManager.prototype.addPlayer = function(player) {
  this.player = player;
}

/**
 * @function addShot
 * Adds a shot
 * {object} shot
 */
EntityManager.prototype.addShot = function(shot) {
  this.shots.push(shot);
}

/**
 * @function addAsteroid
 * Adds an asteroid
 * {object} asteroid
 */
EntityManager.prototype.addAsteroid = function(asteroid) {
  this.asteroids.push(asteroid);
}

/**
 * @function removeInvalidShots
 * Goes over all shots and removes all which are off the screen
 */
function removeInvalidShots() {
  var self = this;
  this.shots = this.shots.filter(function(shot){
    return shot.position.x + TOLERANCE >= 0 &&
           shot.position.y + TOLERANCE >= 0 &&
           shot.position.x - TOLERANCE <= self.worldWidth &&
           shot.position.y - TOLERANCE <= self.worldHeight
  });
}

function testForShapeCollision(shape1, shape2) {
  var axes = Vector.findAxes(shape1) + Vector.findAxes(shape2);
  for(var i = 0; i < axes.length; i++) {
    var proj1 = Vector.project(shape1, axes[i]);
    var proj2 = Vector.project(shape2, axes[i]);
    if(proj1.max < proj2.min || proj1.min > proj2.max) {
      return false;
    }
  }
  return true;
}

function handleAsteroidsCollisions() {
  var active = [];
  var potentiallyColliding = [];

  this.asteroids.forEach(function(asteroid) {
    asteroid.color = ASTEROID_COLOR;
    active = active.filter(function(oasteroid) {
      return Math.pow(asteroid.position.x - oasteroid.position.x,2) < Math.pow(asteroid.radius,2) + Math.pow(oasteroid.radius,2);
    });

    active.forEach(function(oasteroid){
      potentiallyColliding.push({a: asteroid, b: oasteroid});
    });

    active.push(asteroid);
  });

  potentiallyColliding.forEach(function(pair){
    if(testForShapeCollision(pair.a, pair.b)) {
      pair.a.color = 'green';
      pair.b.color = 'green';
    }
  });
}

function handleCollisions() {
  this.asteroids.sort(function(a,b){return a.position.x - b.position.x});
  this.shots.sort(function(a,b){return a.position.x - b.position.x});

  handleAsteroidsCollisions.call(this);
}

/**
 * @function update
 * Updates all entities, removes invalid shots
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
EntityManager.prototype.update = function(elapsedTime) {
  removeInvalidShots.call(this);

  handleCollisions.call(this);

  this.player.update(elapsedTime);
  this.shots.forEach(function(shot) {
    shot.update(elapsedTime);
  });
  this.asteroids.forEach(function(asteroid) {
    asteroid.update(elapsedTime);
  });
}

/**
  * @function render
  * Calls a render method on all entities,
  * all entites are being rendered into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
EntityManager.prototype.render = function(elapsedTime, ctx) {
  this.asteroids.forEach(function(asteroid) {
    asteroid.render(elapsedTime, ctx);
  });
  this.shots.forEach(function(shot) {
    shot.render(elapsedTime, ctx);
  });
  this.player.render(elapsedTime, ctx);
}

"use strict";

const TOLERANCE = 10;
const ASTEROID_COLOR = '#C90018';

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

function handleAsteroidsCollisions() {

  var active = [];
  var potentiallyColliding = [];

  this.asteroids.forEach(function(asteroid) {
    active = active.filter(function(oasteroid) {
      return asteroid.position.x - oasteroid.position.x < asteroid.radius + oasteroid.radius;
    });

    active.forEach(function(oasteroid) {
      potentiallyColliding.push({a: oasteroid, b: asteroid});
    });

    asteroid.color = ASTEROID_COLOR;
    active.push(asteroid);
  });

  var collisions = [];
  var distSquared = undefined;
  potentiallyColliding.forEach(function(pair){
    distSquared = Math.pow(pair.a.position.x - pair.b.position.x, 2) +
                  Math.pow(pair.a.position.y - pair.b.position.y, 2);
    if(distSquared < Math.pow(pair.a.radius + pair.b.radius, 2)) {
      pair.a.color = "green";
      pair.b.color = "green";
      collisions.push(pair);
    }
  });
}

function handleCollisions() {
  this.asteroids.sort(function(a,b) {
    return a.position.x - b.position.x;
  });

  this.shots.sort(function(a,b) {
    return a.position.x - b.position.x;
  });

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

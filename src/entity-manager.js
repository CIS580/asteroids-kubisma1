"use strict";

const TOLERANCE = 10;
const ASTEROID_COLOR = '#C90018';

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

/**
 * @function handleAsteroidsCollisions
 * Goes over all asteroids and solves all their collisions
 */
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

  collisions.forEach(function(pair) {
    // find the normal of collision
    var collisionNormal = {
      x: pair.a.position.x - pair.b.position.x,
      y: pair.a.position.y - pair.b.position.y
    };

    var overlap = pair.a.radius + pair.b.radius + 2 - Vector.magnitude(collisionNormal);
    collisionNormal = Vector.normalize(collisionNormal);
    pair.a.position.x += collisionNormal.x * overlap / 2;
    pair.a.position.y += collisionNormal.y * overlap / 2;
    pair.b.position.x -= collisionNormal.x * overlap / 2;
    pair.b.position.y -= collisionNormal.y * overlap / 2;

    // tg theta = y / x
    // theta = acrtan (y/x)
    var angle = Math.atan2(collisionNormal.y, collisionNormal.x);
    // rotate the problem space so that the normalize
    // of collision lies along the x-axis
    var a = Vector.rotate(pair.a.velocity, angle);
    var b = Vector.rotate(pair.b.velocity, angle);
    // solve the collision along the x-axis
    a.x = a.x * b.x;
    b.x = a.x / b.x;
    a.x = a.x / b.x;

    // Rotate the problem space back to world space
    a = Vector.rotate(a, -angle);
    b = Vector.rotate(b, -angle);
    pair.a.velocity.x = a.x;
    pair.a.velocity.y = a.y;
    pair.b.velocity.x = b.x;
    pair.b.velocity.y = b.y;
  });
}

/**
 * @function handleAsteroidsCollisions
 * Handles all collisions, between asteroids, asteroids and shots,
 * asteroids and ship
 */
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

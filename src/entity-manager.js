"use strict";

const TOLERANCE = 10;

/**
 * @module exports the EntityManager class
 */
module.exports = exports = EntityManager;


function EntityManager(canvas) {
  this.worldWidth = canvas.width;
  this.worldHeight = canvas.height;
  this.player = undefined;
  this.shots = [];
  this.asteroids = [];
}

EntityManager.prototype.addPlayer = function(player) {
  this.player = player;
}

EntityManager.prototype.addShot = function(shot) {
  this.shots.push(shot);
}

EntityManager.prototype.addAsteroid = function(asteroid) {
  this.asteroids.push(asteroid);
}

function removeInvalidShots() {
  var self = this;
  this.shots = this.shots.filter(function(shot){
    return shot.position.x + TOLERANCE >= 0 &&
           shot.position.y + TOLERANCE >= 0 &&
           shot.position.x - TOLERANCE <= self.worldWidth &&
           shot.position.y - TOLERANCE <= self.worldHeight
  });
}

EntityManager.prototype.update = function(elapsedTime) {
  removeInvalidShots.call(this);

  this.player.update(elapsedTime);
  this.shots.forEach(function(shot) {
    shot.update(elapsedTime);
  });
  this.asteroids.forEach(function(asteroid) {
    asteroid.update(elapsedTime);
  });
}

EntityManager.prototype.render = function(elapsedTime, ctx) {
  this.player.render(elapsedTime, ctx);
  this.shots.forEach(function(shot) {
    shot.render(elapsedTime, ctx);
  });
  this.asteroids.forEach(function(asteroid) {
    asteroid.render(elapsedTime, ctx);
  });
}

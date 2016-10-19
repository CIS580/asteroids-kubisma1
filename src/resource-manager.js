"use strict";

/**
 * @module exports the ResourceManager class
 */
module.exports = exports = ResourceManager;

function ResourceManager() {
  // Asteroids collision
  this.collision = new Audio();
  this.collision.src = './assets/music/collision.wav';
  this.collision.volume = 0.5;

  // Player shoots
  this.fire = new Audio();
  this.fire.src = './assets/music/fire.wav';
  this.fire.volume = 0.5;

  // Player is being hit
  this.hit = new Audio();
  this.hit.src = './assets/music/hit.wav';
  this.hit.volume = 0.5;

  // Asteroid explosion
  this.explosion = new Audio();
  this.explosion.src = './assets/music/explosion.wav';
  this.explosion.volume = 0.5;
}

"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const EntityManager = require('./entity-manager.js');
const Asteroid = require('./asteroid.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var entityManager = new EntityManager(canvas);
var player = new Player({x: canvas.width/2, y: canvas.height/2}, canvas, entityManager);
entityManager.addPlayer(player);

var level = 1;
var score = 0;


function generatePosition() {
  return {
    x: Math.floor(Math.random() * canvas.width + 1),
    y: Math.floor(Math.random() * canvas.height + 1)
  }
}

function generateAsteroids(level) {

  for(var i = 0; i < 4 + Math.floor(level * 1/4); i++) {
    entityManager.addAsteroid(new Asteroid.LargeAsteroid(generatePosition(),canvas));
  }

  for(var j = 0; j < 3 + Math.floor(level * 1/3); j++) {
    entityManager.addAsteroid(new Asteroid.MediumAsteroid(generatePosition(),canvas));
  }

  for(var k = 0; k < 3 + Math.floor(level * 1/2); k++) {
    entityManager.addAsteroid(new Asteroid.SmallAsteroid(generatePosition(),canvas));
  }

}
generateAsteroids(level);

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  entityManager.update(elapsedTime);
  // TODO: Update the game objects
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  entityManager.render(elapsedTime, ctx);
}

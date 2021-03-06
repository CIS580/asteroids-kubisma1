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
var overlayDiv = document.getElementById('overlay');
var button = document.getElementById('btn');
button.addEventListener('click', newGame);
var header = document.getElementById("text");

var level = 1;

/**
 * @function generatePosition
 * generates a random position inside the canvas
 */
function generatePosition() {
  return {
    x: Math.floor(Math.random() * canvas.width + 1),
    y: Math.floor(Math.random() * canvas.height + 1)
  }
}

/**
 * @function generateAsteroids
 * generates asteroids to the game
 */
function generateAsteroids(level) {

  entityManager.asteroids = [];

  for(var i = 0; i < 4 + Math.floor(level * 1/4); i++) {
    entityManager.addAsteroid(new Asteroid.LargeAsteroid(generatePosition(),Math.random() * 2 - 1,canvas));
  }

  for(var j = 0; j < 3 + Math.floor(level * 1/3); j++) {
    entityManager.addAsteroid(new Asteroid.MediumAsteroid(generatePosition(),Math.random() * 2 - 1,canvas));
  }

  for(var k = 0; k < 3 + Math.floor(level * 1/2); k++) {
    entityManager.addAsteroid(new Asteroid.SmallAsteroid(generatePosition(),Math.random() * 2 - 1,canvas));
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
 * @function preGame
 * fills the intro screen
 */
function preGame() {
  header.innerHTML = "NEW GAME";
  button.innerHTML = "Start";
}
preGame();

/**
 * @function newGame
 * allows player to play
 */
function newGame() {
  player.state = "idle";
  player.reset();
  overlayDiv.style.display = "none";
  btn.blur();
}

/**
 * @function geameOver
 * disables the player to play
 */
function gameOver() {
  overlayDiv.style.display = "block";
  header.innerHTML = "GAME OVER";
  button.innerHTML = "Restart";
  player.state = "protected";
  player.protectionTimer = 0;
  button.removeAttribute('onclick');
  button.addEventListener('click', gameRestart);
  btn.blur();
}

/**
 * @function gameRestart
 * restarts the game
 */
function gameRestart() {
  overlayDiv.style.display = "none";
  level = 1;
  player.score = 0;
  player.lives = 3;
  player.reset();
  generateAsteroids(level);
  button.removeAttribute('onclick');
  btn.blur();
}

/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  var prevLives = player.lives;

  entityManager.update(elapsedTime);

  if(player.lives == 0) gameOver();

  if(prevLives != player.lives) {
    player.reset();
    generateAsteroids(level);
  } else if(entityManager.asteroids.length == 0) {
    level++;
    player.reset();
    generateAsteroids(level);
  }
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
  ctx.font = "bold 1em Georgia";
  ctx.fillStyle = "#fff";
  ctx.fillText("Level: " + level, canvas.width - 80, 20);
}

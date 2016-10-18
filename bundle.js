(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./asteroid.js":2,"./entity-manager.js":3,"./game.js":4,"./player.js":5}],2:[function(require,module,exports){
"use strict";

const LARGE_VELOCITY = 1.5;
const MEDIUM_VELOCITY = 1.1;
const SMALL_VELOCITY = 0.7;
const LARGE_RADIUS = 20;
const MEDIUM_RADIUS = 15;
const SMALL_RADIUS = 10;
const ASTEROID_COLOR = '#C90018';

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
  this.color = ASTEROID_COLOR;
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
 * @function renders the medium asteroid object into the provided context
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
  Asteroid.prototype.render.call(this, time, ctx);
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
  Asteroid.prototype.render.call(this, time, ctx);
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
  Asteroid.prototype.render.call(this, time, ctx);
}

},{}],3:[function(require,module,exports){
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

},{"./vector.js":7}],4:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],5:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/8;
const MAX_VELOCITY = 3;

/* Classes */
const Shot = require('./shot.js');

/**
 * @module exports the Player class
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 * @param {canvasDOMElement} canvas world size
 * @param {object} entityManager all entities maintainer
 */
function Player(position, canvas, entityManager) {
  this.worldWidth = canvas.width;
  this.worldHeight = canvas.height;
  this.state = "idle";
  this.position = {
    x: position.x,
    y: position.y
  };
  this.velocity = {
    x: 0,
    y: 0
  }
  this.angle = 0;
  this.radius  = 64;
  this.thrusting = false;
  this.shooting = false;
  this.steerLeft = false;
  this.steerRight = false;
  this.timer = 0;
  this.entityManager = entityManager;

  var self = this;
  window.onkeydown = function(event) {
    switch(event.key) {
      case 'ArrowUp': // up
      case 'w':
        self.thrusting = true;
        break;
      case 'ArrowLeft': // left
      case 'a':
        self.steerLeft = true;
        break;
      case 'ArrowRight': // right
      case 'd':
        self.steerRight = true;
        break;
      case ' ': // shoot
        self.shooting = true;
        break;
    }
  }

  window.onkeyup = function(event) {
    switch(event.key) {
      case 'ArrowUp': // up
      case 'w':
        self.thrusting = false;
        break;
      case 'ArrowLeft': // left
      case 'a':
        self.steerLeft = false;
        break;
      case 'ArrowRight': // right
      case 'd':
        self.steerRight = false;
        break;
      case ' ': // shoot
        self.shooting = false;
        break;
    }
  }
}

/**
 * @function update updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(time) {

  this.timer += time;
  if(this.shooting && this.timer > MS_PER_FRAME) {
    this.timer = 0;
    this.entityManager.addShot(new Shot(this.position, this.angle));
  }

  // Apply angular velocity
  if(this.steerLeft) {
    this.angle += 0.1;
  }
  if(this.steerRight) {
    this.angle -= 0.1;
  }
  // Apply acceleration
  if(this.thrusting) {
    var acceleration = {
      x: Math.sin(this.angle),
      y: Math.cos(this.angle)
    }
    this.velocity.x -= acceleration.x;
    this.velocity.y -= acceleration.y;

    if(this.velocity.x > MAX_VELOCITY) this.velocity.x = MAX_VELOCITY;
    else if(this.velocity.x < -1 * MAX_VELOCITY) this.velocity.x = -1 * MAX_VELOCITY;

    if(this.velocity.y > MAX_VELOCITY) this.velocity.y = MAX_VELOCITY;
    else if(this.velocity.y < -1 * MAX_VELOCITY) this.velocity.y = -1 * MAX_VELOCITY;
  }
  // Apply velocity
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
  // Wrap around the screen
  if(this.position.x < 0) this.position.x += this.worldWidth;
  if(this.position.x > this.worldWidth) this.position.x -= this.worldWidth;
  if(this.position.y < 0) this.position.y += this.worldHeight;
  if(this.position.y > this.worldHeight) this.position.y -= this.worldHeight;
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Player.prototype.render = function(time, ctx) {
  ctx.save();

  // Draw player's ship
  ctx.translate(this.position.x, this.position.y);
  ctx.rotate(-this.angle);
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.lineTo(-10, 10);
  ctx.lineTo(0, 0);
  ctx.lineTo(10, 10);
  ctx.closePath();
  ctx.strokeStyle = 'white';
  ctx.stroke();

  // Draw engine thrust
  if(this.thrusting) {
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(5, 10);
    ctx.arc(0, 10, 5, 0, Math.PI, true);
    ctx.closePath();
    ctx.strokeStyle = 'orange';
    ctx.stroke();
  }
  ctx.restore();
}

},{"./shot.js":6}],6:[function(require,module,exports){
"use strict";

const MAX_VELOCITY = 5;

/**
 * @module exports the Shot class
 */
module.exports = exports = Shot;

/**
 * @constructor Shot
 * Creates a new shot object
 * @param {Postition} position object specifying an x and y
 * @param {Float} angle indicates how much has to be shot rotated according to
 * default position
 */
function Shot(position, angle) {
  this.position = {
    x: position.x,
    y: position.y
  };
  this.velocity = {
    x: Math.sin(angle) * MAX_VELOCITY,
    y: Math.cos(angle) * MAX_VELOCITY
  }
  this.angle = angle;
  this.radius = 2;
}

/**
 * @function updates the shot object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Shot.prototype.update = function(time) {
  // Apply velocity
  this.position.x -= this.velocity.x;
  this.position.y -= this.velocity.y;
}

/**
 * @function renders the shot into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Shot.prototype.render = function(time, ctx) {
  ctx.save();

  // Draw shot
  ctx.translate(this.position.x, this.position.y);
  ctx.rotate(-this.angle);
  ctx.strokeStyle = "white";
  ctx.beginPath();
  ctx.moveTo(-2, -3);
  ctx.lineTo(-2, 5);
  ctx.lineTo(2, 5);
  ctx.lineTo(2, -3);
  // ctx.arc(0,0,this.radius*2,0,2*Math.PI);
  ctx.closePath();
  ctx.fillStyle = '#3fdbff';
  ctx.fill();

  // Draw engine thrust
  ctx.restore();
}

},{}],7:[function(require,module,exports){
"use strict";

module.exports = exports = {
  rotate: rotate,
  dotProduct: dotProduct,
  magnitude: magnitude,
  normalize: normalize,
  perpendicular: perpendicular,
  findAxes: findAxes,
  project: project
}

/**
 * Stands for matrix multiplication  {x,y} * {{cos phi, -sin phi}, {sin phi, cos phi}}
 */
function add(a, b) {
  return {
    x: a.x + b.x,
    y: a.y + b.y
  }
}

function subtract(a, b) {
  return {
    x: a.x - b.x,
    y: a.y - b.y
  }
}

function rotate(a, angle) {
  return {
    x: a.x * Math.cos(angle) - a.y * Math.sin(angle),
    y: a.x * Math.sin(angle) + a.y * Math.cos(angle)
  }
}

function dotProduct(a, b) {
  return a.x * b.x + a.y * b.y;
}

function magnitude(a) {
  return Math.sqrt(a.x * a.x + a.y * a.y);
}

function normalize(a) {
  var mag = magnitude(a);
  return {
    x: a.x / mag,
    y: a.y / mag
  };
}

function perpendicular(a) {
  return {
    x: -a.y,
    y: a.x
  }
}

function findAxes(shape) {
  var axes = [];
  shape.vertices.forEach(function(p1, i){
    // find the adjacent vertex
    var p2 = (shape.vertices.length == i+1) ? shape.vertices[0] : shape.vertices[i+1];
    var edge = subtract(p2, p1);
    var perp = perpendicular(edge);
    var normal = normalize(perp);
    axes.push(normal);
  });
  return axes;
}

function project(shape, axis){
  var min = dotProduct(shape.vertices[0], axis);
  var max = min;
  for(var i = 1; i < shape.vertices.length; i++){
    var p = dotProduct(shape.vertices[i], axis);
    if(p < min) min = p;
    else if(p > max) max = p;
  }
  return {min: min, max: max};
}

},{}]},{},[1]);

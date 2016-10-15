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
  ctx.beginPath();
  ctx.moveTo(-2, 0);
  ctx.lineTo(-2, 7);
  ctx.lineTo(2, 7);
  ctx.lineTo(2, 0);
  ctx.closePath();
  ctx.fillStyle = '#3fdbff';
  ctx.fill();

  // Draw engine thrust
  ctx.restore();
}

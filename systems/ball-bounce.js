
var v = require('vector')
var rect = require('rect')

/**
 * Create a bounce system.
 *
 * Options:
 *   @option {float} gain  Gain multiplier.
 *
 * @param {object} options
 * @return {object} system
 */

module.exports = function (opts) {
  opts = opts || {}
  opts.bordersGain = opts.bordersGain || 1.003
  opts.racketTilt = opts.racketTilt || 0.052

  /**
   * Bounce on borders and racket system.
   *
   * @api system
   * @api component
   */

  var bounce = {}

  /**
   * Bounce to borders.
   *
   * @param {rect} borders
   */

  bounce.bounceBorders = function (borders) {
    var e = this
    var n = v(e.pos).plus(e.vel).minus(e.offset)
    if ( n.x+e.mesh.size.width > borders.size.x
      || n.x < borders.pos.x) {
      e.speed.mul(opts.bordersGain)
      e.dir.x = -e.dir.x
    }
    else if (n.y+e.mesh.size.height > borders.size.y) {
      e.speed.set(e.getDefault('speed'))
      e.dir.set(e.getDefault('dir'))
      e.pos.set(e.getDefault('pos'))
    }
    else if (n.y < borders.pos.y) {
      e.speed.mul(opts.bordersGain)
      e.dir.y = -e.dir.y
    }
  }

  /**
   * Bounce to racket.
   *
   * @param {entity} racket
   */

  bounce.bounceRacket = function (racket) {
    var e = this
    var n = v(e.pos).plus(e.vel).minus(e.offset)
    var r = v(racket.pos).minus(racket.offset)
    if (n.y+e.mesh.size.height > r.y && n.y < r.y+(racket.mesh.size.height/2)
      && n.x+e.mesh.size.width > r.x && n.x < r.x+racket.mesh.size.width
    ) {
      if (e.dir.y > 0) {
        var diff = (((r.x+racket.offset.x)-(n.x+e.offset.x))*-1)*opts.racketTilt
        e.dir.x += diff
        e.dir.x = v(e.dir.x).limit(v(-9,9)).x
        e.dir.y = -e.dir.y
      }
    }
    e.vel.set(v(e.dir).mul(e.speed))
  }

  return bounce
}

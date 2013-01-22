
/*!
 * arkanoid example using http://github.com/entity
 * 
 * MIT licenced
 */

/**
 * Module dependencies.
 */

var v = require('vector')
var rect = require('rect')
var manager = require('manager')
var Entity = require('entity')

/**
 * Main game object.
 */

var defaults = require('./defaults')

var game = module.exports = {}
game.el = document.getElementById('game')

/**
 * Load systems.
 */

var position = require('position')
var motion = require('motion')
var loop = require('loop')(defaults)
var input = require('mouse')(game.el)
var render = require('dom')(game.el)
var log = require('log')(game.el)

/**
 * Create a world manager.
 */

var world = game.world = manager()

/**
 * Bricks manager.
 */

var bricks = game.bricks = world.createManager()

/**
 * Balls manager.
 */

var balls = game.balls = world.createManager()

/**
 * Borders rectangle.
 */

var borders = rect(
  [0,0]
, [game.el.clientWidth, game.el.clientHeight]
)

var offset = {
  offset: [v, 4.5]
}

offset.getAbsPos = function () {
  return v(this.pos).minus(this.offset)
}

/**
 * Shapes components.
 */

var box = {
  mesh: [rect, [0,0], [9,9]]
}

var circle = {
  radius: [Number, 4.5]
}

/**
 * Bounce on borders and racket.
 */

var ballBounce = require('./systems/ball-bounce')(defaults)

ballBounce.update = function (e) {
  e.bounceBorders(borders)
  e.bounceRacket(playerRacket)
}

/**
 * Keep position in borders.
 *
 * @api system
 */

var limitBorders = {}

limitBorders.update = function (e) {
  e.pos.limit(
    rect(
      v(borders.pos).plus(e.offset)
    , v(borders.size).sub(e.mesh.size).plus(e.offset)
    ))
}

/**
 * Make motion smoother. Interpolates between
 * the previous and this step based on the alpha
 * position sent by the loop system in the render
 * event.
 *
 * @api system
 */

var smooth = {}

smooth.render = function (e, a) {
  e.mesh.pos.set(v(e.prevPos).lerp(e.pos, a))
}

/**
 * Ball collision to brick system.
 *
 * @api system
 */

var ballCollide = require('./systems/ball-collide')

/**
 * Create a follow system.
 *
 * @param {float} mul
 * @param {vector} initpos
 */

function Follow (mul, initpos) {
  var f = {}

  f.target = [v, initpos]

  f.update = function (e) {
    e.vel.add(
      v(e.target).sub(e.pos)
      .mul(mul))
  }

  return f
}

/**
 * A follow target system.
 */

var follow = Follow(defaults.followSpeed, v(borders.size).half())

/**
 * Pipe system.
 */

function Pipe (input, a, b) {
  var pipe = {}

  pipe.update = function (e) {
    e[b].set(input[a])
  }

  return pipe
}

// sprite component/system
var sprite = {}

sprite.components = [
  box
, offset
, position
, motion
, limitBorders
, smooth
, render
]

/**
 * Brick system.
 *
 * @api system
 */

var brick = {
  components: [sprite]
, type: [String, 'plain']
, class: [String, 'brick']
}

brick.init = function (e) {
  e.mesh.pos.set(e.pos)
  e.setClass('brick')
  e.setType('plain')
  e.removed = false
}

brick.setType = function (nt) {
  var e = this
  if (e.type != nt) e.el.classList.remove(e.type)
  e.type = nt
  e.el.classList.add(nt)
}

/**
 * Create bricks.
 *
 * @param {number} cols
 * @param {number} rows
 * @return {manager} bricks
 */

function Bricks (cols, rows) {
  cols = cols || 12
  rows = rows || 6
  var bsize = Math.floor((borders.size.width-3-(cols*3)) / cols)
  var bricks = []
  for (var x=0; x<cols; x++) {
    for (var y=0; y<rows; y++) {
      var b = new Entity([brick, {
        mesh: [rect, [0,0], [bsize,12]]
      , offset: [v, bsize/2,6]
      , pos: [v, 20+(x*(bsize+3)), 40+(14*y)]
      }])
      bricks.push(b)
    }
  }
  return bricks
}

// pointer entity
var pointer = world.createEntity(
  position
, input
, {
    pos: [v, v(borders.size).half()]
  }
)

// control system, pipes `pointer.pos` to `e.target`
var control = Pipe(pointer, 'pos', 'target')

// racket component/system
var racket = {
  components: [sprite, control, follow]
}

racket.update = function (e) {
  e.vel.y = 0
}

/**
 * Racket entity factory.
 *
 * @param {number} width in pixels
 */

function Racket (width) {
  return world.createEntity(racket, {
    pos: [v, v(borders.size).half().x,240]
  , mesh: [rect, [0,0], [width,12]]
  , offset: [v, width/2,6]
  , class: [String, 'racket']
  })
}

// ball system
var ball = {}
ball.components = [sprite, circle, ballCollide, ballBounce]

// ball entity factory
ball.create = function (opts) {
  return new Entity([ball, opts])
}

function Ball () {
  return ball.create({
    dir: [v, 1.5,1.5]
  , speed: [v, 1.5]
  , pos: [v, v(borders.size).half()]
  , class: [String, 'ball']
  })
}

// container entity
var container = world.createEntity(sprite, {
  class: 'container'
, mesh: [rect, borders]
})

// create racket
var playerRacket = Racket(defaults.racketWidth)

// create bricks
Bricks(12, 5).forEach(function (e) {
  bricks.use(e, true)
})

// button controls
var get = document.getElementById.bind(document)
get('start').onclick = world.start.bind(world)
get('pause').onclick = world.pause.bind(world)
get('stop').onclick = world.stop.bind(world)
get('reset').onclick = world.reset.bind(world)
get('add-ball').onclick = function () {
  world.join(Ball())
}

var randomizeBricks = {}

randomizeBricks.init = function () {
  var types = [
    ['extra',5]
  , ['hot',10]
  , ['double',20]
  , ['plain',100]
  ]
  var maxWeight = types.reduce(function (p, n) {
    return Math.max(p, n[1])
  }, 0)
  setTimeout(function () {
    bricks.each(function (e) {
      e.setType('plain')
      var r = Math.random() * maxWeight
      var type
      for (var i=0, len=types.length; i<len;i++) {
        if (r < types[i][1]) {
          type = types[i][0]
          break
        }
      }
      if (!type) type = types[0]
      e.setType(type)
    })
  }, 0)
}

/**
 * Setup some listeners.
 */

world.on('init', function () {
  world.join(Ball())

})

world.on('tear', function () {
  world.each(ball, world.removeEntity.bind(world))
})

/**
 * Use systems.
 */

world
  .use(loop)
  
  .use(input)

  .use(control)
  .use(follow)

  .use(racket)
  
  .use(position)

  .use(ball)
  .use(brick)

  .use(randomizeBricks)

  .use(ballBounce)
  .use(ballCollide)

  .use(motion)

  .use(limitBorders)

  .use(smooth)
  
  .use(log)

  .use(render)

/**
 * Start game.
 */

world
  .applyComponents()
  .init()
  .start()

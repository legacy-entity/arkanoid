
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

/**
 * Main game object.
 */

var game = module.exports = {}
game.el = document.getElementById('game')

/**
 * Load systems.
 */

var position = require('position')
var motion = require('motion')
var loop = require('loop')()
var input = require('mouse')(game.el)
var dom = require('dom')(game.el)

/**
 * Create a world manager.
 */

var world = game.world = manager()

/**
 * Bricks manager.
 */

var bricks = world.createManager()

/**
 * Balls manager.
 */

var balls = world.createManager()

/**
 * Borders rectangle.
 */

var borders = rect(
  [0,0]
, [game.el.clientWidth, game.el.clientHeight]
)

/**
 * Shapes components.
 */

var box = {
  mesh: [rect, [0,0], [9,9]]
, offset: [v, 4.5]
}

var circle = {
  radius: [v, 4.5]
}

/**
 * Ball collision to brick system.
 *
 * @api system
 */

var collide = {
  update: function (ball) {
    var colls = []
    bricks.each(function (brick) {
      if (brick.removed) return

      var a = v(ball.pos).minus(ball.offset)
      var b = v(brick.pos).minus(brick.offset).plus(v(4.5, 2))
      var dist = v(
        (a.x+ball.vel.x)-b.x
      , (a.y+ball.vel.y)-b.y
      ).abs()

      // collides    
      if (dist.y <= 8 && dist.x <= (brick.mesh.size.width/2)+6) {
        dist.brick = brick
        colls.push(dist)
      }
    })

    // do we have collisions?
    if (colls.length) {
      // find the closer one
      var res = colls.reduce(function (p, n) {
        return n.min(p)
      }, v(100,100))
      // hide the brick
      res.brick.el.classList.add('hide')
      res.brick.removed = true
      // try to determine which way it was hit
      // and switch directions accordingly
      if (res.y > res.x/2) {
        ball.dir.y = -ball.dir.y
        ball.vel.y = -ball.vel.y
      }
      else {
        ball.dir.x = -ball.dir.x
        ball.vel.x = -ball.vel.x
      }
      // move ball away from collision
//      ball.pos.add(ball.vel)
    }
  }
}

/**
 * Ball bounce on borders and racket system.
 *
 * @api system
 * @api component
 */

var bounce = {
  bounceGain: [v, 1.003]
, update: function (e) {
    
    // bounce to borders
    var n = v(e.pos).plus(e.vel).minus(e.offset)
    if ( n.x+e.mesh.size.width > borders.size.x
      || n.x < borders.pos.x) {
      e.speed.mul(e.bounceGain)
      e.dir.x = -e.dir.x
    }
    else if (n.y+e.mesh.size.height > borders.size.y) {
      e.speed.set(2)
      e.dir.set(1,1)
      e.pos.set(v(borders.size).half())
    }
    else if (n.y < borders.pos.y) {
      e.speed.mul(e.bounceGain)
      e.dir.y = -e.dir.y
    }

    // bounce to racket
    var r = v(racket.pos).minus(racket.offset)
    if (n.y+e.mesh.size.height > r.y && n.y < r.y+(racket.mesh.size.height/2)
      && n.x+e.mesh.size.width > r.x && n.x < r.x+racket.mesh.size.width
    ) {
      e.dir.y = -1
      var diff = ((r.x+racket.offset.x)-(n.x+e.offset.x))
      e.dir.x = (diff*0.05)*-1 + e.dir.x
    }
    e.vel.set(v(e.dir).mul(e.speed))
  
  }
}

/**
 * Keep position in borders.
 *
 * @api system
 */

var keepInBorders = {
  update: function (e) {
    e.pos
      .limit(
        rect(
          v(borders.pos).plus(e.offset)
        , v(borders.size).sub(e.mesh.size).plus(e.offset)
        )
      )
  }
}

/**
 * Make motion smoother. Interpolates between
 * the previous and this step based on the alpha
 * position sent by the loop system in the render
 * event.
 *
 * @system
 */

var smoother = {
  render: function (e, a) {
    e.mesh.pos.set(v(e.prevPos).lerp(e.pos, a))
  }
}

/**
 * Make entity follow a target.
 *
 * @api system
 * @api component
 */

var followTarget = {
  target: [v, v(borders.size).half()]
, update: function (e) {
    e.vel.add(
      v(e.target).sub(e.pos)
      .mul(0.245))
  }
}

/**
 * Limit y velocity to 0.
 *
 * @api system
 */

var limitY = {
  update: function (e) {
    e.vel.y = 0
  }
}

/**
 * Pointer controls entity.
 *
 * @api system
 */

var control = {
  update: function (e) {
    e.target.set(pointer.pos)
  }
}

/**
 * Brick system.
 *
 * @api system
 */

var brick = {
  init: function (e) {
    e.mesh.pos.set(e.pos)
    e.el.classList.remove('hide')
    e.removed = false          
  }
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
  for (var x=0; x<cols; x++) {
    for (var y=0; y<rows; y++) {
      bricks.createEntity(box, dom, brick, {
        mesh: [rect, [0,0], [bsize,12]]
      , offset: [v, bsize/2,6]
      , pos: [v, 20+(x*(bsize+3)), 40+(14*y)]
      , class: [String, 'brick']
      })
    }
  }
  return bricks
}

/**
 * Ball entity factory.
 */

function Ball () {
  return balls.createEntity(
    box
  , circle
  , position
  , motion
  , dom
  , bounce
  , collide
  , keepInBorders
  , smoother
  , {
      dir: [v, 1,1]
    , speed: [v, 2]
    , pos: [v, v(borders.size).half()]
    , class: [String, 'ball']
    }
  )
}

/**
 * Racket entity factory.
 */

function Racket () {
  return world.createEntity(
    dom
  , position
  , motion
  , control
  , followTarget
  , limitY
  , keepInBorders
  , smoother
  , {
      pos: [v, v(borders.size).half().x,240]
    , mesh: [rect, [0,0], [54,12]]
    , offset: [v, 27,6]
    , class: [String, 'racket']
    }
  )
}

/**
 * Pointer entity.
 */

var pointer = world.createEntity(position, input, {
  pos: [v, v(borders.size).half()]
})

/**
 * Container entity.
 */

var container = world.createEntity(dom, {
  class: 'container'
, mesh: [rect, borders]
})

/**
 * Create racket.
 */

var racket = Racket()

/**
 * Create bricks.
 */

Bricks(12, 6)

/**
 * Button controls.
 */

var get = document.getElementById.bind(document)
get('start').onclick = world.start.bind(world)
get('pause').onclick = world.pause.bind(world)
get('stop').onclick = world.stop.bind(world)
get('reset').onclick = world.reset.bind(world)
get('add-ball').onclick = function () {
  world.join(Ball())
}

/**
 * Setup some listeners.
 */

world.on('init', function () {
  world.join(Ball())
})

world.on('tear', function () {
  balls.removeAllEntities()
})

/**
 * Use systems.
 */

world
  .use(loop)
  
  .use(input)
  .use(control)
  
  .use(position)

  .use(brick)
  .use(followTarget)
  .use(limitY)
  .use(bounce)
  .use(collide)
  
  .use(motion)
  
  .use(keepInBorders)
  .use(smoother)
  
  .use(dom)

/**
 * Start game.
 */

world
  .applyComponents()
  .init()
  .start()

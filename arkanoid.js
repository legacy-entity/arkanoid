
/**
 * arkanoid example using http://github.com/entity
 * 
 * MIT licenced
 */

var v = require('vector')
var rect = require('rect')

var manager = require('manager')
var position = require('position')
var motion = require('motion')
var loop = require('loop')
var Mouse = require('mouse')
var Dom = require('dom')

var game = module.exports = {}
var el = game.el = document.getElementById('game')

var dom = Dom(el)
var input = Mouse(el)

var world = game.world = manager()

// shapes

var box = {
  mesh: [rect, [0,0], [9,9]]
, offset: [v, 4.5]
}

var circle = {
  radius: [v, 4.5]
}

var borders = rect(
  [0,0]
, [game.el.clientWidth, game.el.clientHeight]
)

// systems

// collide

var collide = {
  update: function (ball) {
    var colls = []
    blocks.each(function (block) {
      if (block.removed) return

      var a = v(ball.pos).minus(ball.offset)
      var b = v(block.pos).minus(block.offset).plus(v(4.5, 2))
      var dist = v(
        (a.x+ball.vel.x)-b.x
      , (a.y+ball.vel.y)-b.y
      ).abs()
    
      if (dist.y <= 8 && dist.x <= (bsize/2)+6) {
        dist.block = block
        colls.push(dist)
      }
    })
    if (colls.length) {
      var res = colls.reduce(function (p, n) {
        return n.min(p)
      }, v(100,100))
      res.block.el.classList.add('hide')
      res.block.removed = true
      if (res.y > res.x/2) {
        ball.dir.y = -ball.dir.y
        ball.vel.y = -ball.vel.y
      }
      else {
        ball.dir.x = -ball.dir.x
        ball.vel.x = -ball.vel.x
      }
      ball.pos.add(ball.vel)
    }
  }
}

// bounce

var bounce = {
  bounceGain: [v, 1.003]
, update: function (e) {
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

// keep in borders

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

// smoother

var smoother = {
  render: function (e, a) {
    e.mesh.pos.set(v(e.prevPos).lerp(e.pos, a))
  }
}

// follows target

var followTarget = {
  target: [v, v(borders.size).half()]
, update: function (e) {
    e.vel.add(
      v(e.target).sub(e.pos)
      .mul(0.245))
  }
}

// limit y velocity to 0

var limitY = {
  update: function (e) {
    e.vel.y = 0
  }
}

// assigns control

var control = {
  update: function (e) {
    e.target.set(pointer.pos)
  }
}

var blocks = world.createManager()
var balls = world.createManager()

var cx = 12
var bsize = Math.floor((borders.size.width-3-(cx*3)) / cx)

var block = {
  init: function (e) {
    e.mesh.pos.set(e.pos)
    e.el.classList.remove('hide')
    e.removed = false          
  }
}

function Blocks (cx) {
  for (var x=0; x<cx; x++) {
    for (var y=0; y<5; y++) {
      blocks.createEntity(box, dom, block, {
        mesh: [rect, [0,0], [bsize,12]]
      , offset: [v, bsize/2,6]
      , pos: [v, 20+(x*(bsize+3)), 40+(14*y)]
      , class: [String, 'block']
      })
    }
  }
  return blocks
}

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

// racket

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

// pointer
var pointer = world.createEntity(position, input, {
  pos: [v, v(borders.size).half()]
})

// container
var container = world.createEntity(dom, {
  class: 'container'
, mesh: [rect, borders]
})

var racket = Racket()

Blocks(12)

// setup some listeners

world.on('init', function () {
  world.join(Ball())
})

world.on('tear', function () {
  // remove all balls
  balls.removeAllEntities()
})

world
  .use(loop)
  
  .use(input)
  .use(control)
  
  .use(position)

  .use(block)
  .use(followTarget)
  .use(limitY)
  .use(bounce)
  .use(collide)
  
  .use(motion)
  
  .use(keepInBorders)
  .use(smoother)
  
  .use(dom)

  .applyComponents()
  .init()
  .start()

// buttons

var get = document.getElementById.bind(document)

get('start').onclick = world.start.bind(world)
get('pause').onclick = world.pause.bind(world)
get('stop').onclick = world.stop.bind(world)
get('reset').onclick = world.reset.bind(world)
get('add-ball').onclick = function () {
  world.join(Ball())
}

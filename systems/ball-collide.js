
var v = require('vector')
var game = require('../arkanoid')
var log = require('log')

var collide = {}

collide.collidesBrick = function (brick) {
  var ball = this
  
  var a = v(ball.pos).minus(ball.offset)
  var b = v(brick.pos).minus(brick.offset)

  if (
      a.x + ball.mesh.size.width
      > b.x
    &&
      a.x
      < b.x + brick.mesh.size.width
    &&
      a.y + ball.mesh.size.height
      > b.y
    &&
      a.y
      < b.y + brick.mesh.size.height
    ) {
    return v(a).minus(b)
  }
}

collide.update = function (ball) {
  var hits = {}
  var colls = []
  game.bricks.each(function (brick) {
    if (brick.removed) return

    // get collision
    var coll = ball.collidesBrick(brick)

    // add collision to hits
    if (coll) {
      coll.brick = brick.id
      hits[brick.id] = brick
      colls.push(coll)
    }
  })

  // do we have collisions?
  if (colls.length) {

    // find the closer one
    var closest = colls.sort(function (a, b) {
      return a.mod() - b.mod()
    })[0]

    var hit = hits[closest.brick]
    
    // hide the brick
    hit.el.classList.add('hide')
    hit.removed = true

    // absolute distance    
    var dist = v(closest).abs()

    // save position
    var p = v(ball.pos)
    
    // determine response dir
    if (dist.y > dist.x/2.5) {
      ball.dir.y = -ball.dir.y
      ball.vel.y = -ball.vel.y
      ball.pos.add(ball.vel)
      if (ball.collidesBrick(hit)) {
        ball.pos.set(p)
        ball.dir.neg()
        ball.vel.neg()
      }
    }
    else {
      ball.dir.x = -ball.dir.x
      ball.vel.x = -ball.vel.x
      ball.pos.add(ball.vel)
      if (ball.collidesBrick(hit)) {
        ball.pos.set(p)
        ball.dir.neg()
        ball.vel.neg()
      }
    }

    // restore position
    ball.pos.set(p)
  }
}

module.exports = collide

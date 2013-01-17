

/**
 * hasOwnProperty.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  var index = path + '/index.js';

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (has.call(require.modules, path)) return path;
  }

  if (has.call(require.aliases, index)) {
    return require.aliases[index];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!has.call(require.modules, from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    if ('.' != path.charAt(0)) {
      var segs = parent.split('/');
      var i = lastIndexOf(segs, 'deps') + 1;
      if (!i) i = 0;
      path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
      return path;
    }
    return require.normalize(p, path);
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return has.call(require.modules, localRequire.resolve(path));
  };

  return localRequire;
};
require.register("entity-vector/index.js", function(exports, require, module){

/**
 * References to array helpers.
 */

var slice = [].slice
var map = [].map

/**
 * Exports Vector.
 */

module.exports = Vector

/**
 * Vector class.
 *
 * @param {Vector} [vector]
 * or
 * @param {String} [s]
 * or
 * @param {int} x 
 * @param {int} y 
 * @param {int} z 
 */

function Vector (val) {
  switch (typeof val) {
    case 'number': {
      val = map.call(arguments, Number)
      break
    }
    case 'string': {
      val = val.split(',').map(Number)
      break
    }
    case 'object': {
      if (val instanceof Vector) {
        val = val.toArray()
      }
      break
    }
    default:
      val = [0]
      break
  }

  if (!(this instanceof Vector)) {
    return new Vector(val)
  }

  Vector.count++

  this.set(val)

  return this
}

Vector.d2 = function (vec) { return Vector(vec || [0,0]) }
Vector.d3 = function (vec) { return Vector(vec || [0,0,0]) }

/**
 * Static values.
 */

Vector.maxDecimal = 2
Vector._dt = Math.floor(1000/60)
Vector.count = 0

Vector.prototype.__defineGetter__('x', function () { return this[1] })
Vector.prototype.__defineGetter__('y', function () { return this[2] })
Vector.prototype.__defineGetter__('z', function () { return this[3] })
Vector.prototype.__defineGetter__('X', function () { return this[1] })
Vector.prototype.__defineGetter__('Y', function () { return this[2] })
Vector.prototype.__defineGetter__('Z', function () { return this[3] })

Vector.prototype.__defineGetter__('a', function () { return this[1] })
Vector.prototype.__defineGetter__('b', function () { return this[2] })
Vector.prototype.__defineGetter__('c', function () { return this[3] })
Vector.prototype.__defineGetter__('A', function () { return this[1] })
Vector.prototype.__defineGetter__('B', function () { return this[2] })
Vector.prototype.__defineGetter__('C', function () { return this[3] })

Vector.prototype.__defineGetter__('left', function () { return this[1] })
Vector.prototype.__defineGetter__('top', function () { return this[2] })

Vector.prototype.__defineGetter__('width', function () { return this[1] })
Vector.prototype.__defineGetter__('height', function () { return this[2] })

Vector.prototype.__defineSetter__('x', function (v) { this[1] = v })
Vector.prototype.__defineSetter__('y', function (v) { this[2] = v })
Vector.prototype.__defineSetter__('z', function (v) { this[3] = v })
Vector.prototype.__defineSetter__('X', function (v) { this[1] = v })
Vector.prototype.__defineSetter__('Y', function (v) { this[2] = v })
Vector.prototype.__defineSetter__('Z', function (v) { this[3] = v })

Vector.prototype.__defineSetter__('a', function (v) { this[1] = v })
Vector.prototype.__defineSetter__('b', function (v) { this[2] = v })
Vector.prototype.__defineSetter__('c', function (v) { this[3] = v })
Vector.prototype.__defineSetter__('A', function (v) { this[1] = v })
Vector.prototype.__defineSetter__('B', function (v) { this[2] = v })
Vector.prototype.__defineSetter__('C', function (v) { this[3] = v })

Vector.prototype.__defineSetter__('left', function (v) { this[1] = v })
Vector.prototype.__defineSetter__('top', function (v) { this[2] = v })

Vector.prototype.__defineSetter__('width', function (v) { this[1] = v })
Vector.prototype.__defineSetter__('height', function (v) { this[2] = v })

Vector.prototype.toArray = function () {
  var arr = []
  this.each(function (n) { arr.push(n) })
  return arr
}

/**
 * Vector utils.
 */

Vector.prototype.dt = function (f) {
  if (f) return (Vector._dt = f)
  return this.copy().mul(Vector._dt)
}

/**
 * v.toString()
 * -or-
 * var str = "vector: "+v // casts
 *
 * Returns the Vector as a comma delimited
 * string of vector values.
 * 
 * @param {float} precision
 *
 * @return {String} comma delimited string of vector values
 */

Vector.prototype.toString = function (precision) {
  var s = this.toArray().map(function (n) { return n.toFixed() })
  return s.join(',')
}

/**
 * Returns this.
 *
 * @return {Vector} this
 */

Vector.prototype.get = function () {
  return this
}

/**
 * v.set(0,4,15)
 * 
 * Sets values from an Array
 * or Vector object or arguments.
 *
 * @return {Vector} this
 */

Vector.prototype.set = function (arr) {
  if (arr instanceof Vector) arr = arr.toArray()
  if (!Array.isArray(arr)) arr = slice.call(arguments)
  this.length = arr.length
  for (var i = 1; i <= this.length; i++) {
    this[i] = arr[i-1]
  }
  return this
}

/**
 * v2 = v.copy()
 * 
 * Returns a copy of the Vector.
 *
 * @return {Vector} copy
 */

Vector.prototype.clone = 
Vector.prototype.copy = function () {
  return new Vector(this)
}



/**
 * a.interpolate(b, 0.75) // v(0,0).interpolate(v(4,4), 0.75) => v(3,3)
 */

Vector.prototype.interpolate = 
Vector.prototype.lerp = function (b, f) {
  this.plus(new Vector(b).minus(this).mul(f))
  return this
}

/**
 * v.each(fn)
 */

Vector.prototype.each = function (fn) {
  for (var i = 1; i <= this.length; i++) {
    fn(this[i], i)
  }
  return this
}

/**
 * v.map(fn)
 */

Vector.prototype.map = function (fn) {
  for (var i = 1; i <= this.length; i++) {
    this[i] = fn(this[i], i)
  }
  return this
}

/**
 * v.abs() // -5 => 5, 5 => 5
 */

Vector.prototype.abs = 
Vector.prototype.absolute = function () {
  return this.map(Math.abs)
}


/**
 * v.limit(-5, 5) // 8 => 5, -15 => -5
 */

Vector.prototype.limit = function (r) {
  this.max(r.pos)
  this.min(r.size)
  return this
}

/**
 * v.neg() // 5 => -5
 */

Vector.prototype.neg = 
Vector.prototype.negate = function () { return this.map(function (n) { return -n }) }

Vector.prototype.half = function () { return this.div(2) }
Vector.prototype.double = function () { return this.mul(2) }
Vector.prototype.triple = function () { return this.mul(3) }
Vector.prototype.quad = function () { return this.mul(4) }

Vector.prototype.floor = function () { return this.map(Math.floor) }
Vector.prototype.round = function () { return this.map(Math.round) }
Vector.prototype.ceil = function () { return this.map(Math.ceil) }

Vector.prototype.pow = function (n) { return this.map(Math.pow.bind(this, n)) }
Vector.prototype.sqrt = function () { return this.map(Math.sqrt) }

/**
 * Return the modulus of this vector.
 */

Vector.prototype.mod = 
Vector.prototype.modulus = function () {
  return Math.sqrt(this.dot(this))
}

Vector.prototype.fill = function (len) {
  var x = 0, n
  for (var i = 1; i <= len; i++) {
    n = this[i]
    this[i] = 'undefined' != typeof n ? (x = n) : x
  }
}

/**
 * Vector methods accepting vector as argument.
 */

var V = {}

/**
 * v.max(-5) // -8 => -5, -2 => -2
 */

V.max = function (v) {
  return this.map(function (n,i) { return n < v[i] ? v[i] : n })
}

/**
 * v.min(5) // 8 => 5, 2 => 2
 */

V.min = function (v) {
  return this.map(function (n,i) { return n > v[i] ? v[i] : n })
}

/**
 * Compute dot product against a vector.
 *
 * @param {Vector} vec 
 * @return {float} product
 */

V.dot = function (vec) {
  var product = 0
  while (n--) {
    product += this[n] * vec[n]
  }
  return product
}

/**
 * Compute cross product against a vector.
 *
 * @param {Vector} b 
 * @return {Vector}
 */

V.cross = function (B) {
  var A = this
  return new Vector([
    (A[2] * B[3]) - (A[3] * B[2])
  , (A[3] * B[1]) - (A[1] * B[3])
  , (A[1] * B[2]) - (A[2] * B[1])
  ])
}

/**
 * v.copyTo(vec)
 * 
 * Copies this vector's values and length
 * to another one and returns the other
 * vector.
 * 
 * @param {Vector} vec
 * @return {Vector} vec
 */

V.copyTo = function (vec) {
  this.each(function (n,i) { vec[i] = n })
  vec.length = this.length
  return vec
}

/**
 * v.rand(vec) // v(5,5,5).rand(1,0,1) => v(0.287438,5,0.898736)
 */

V.rand = function (vec) {
  return this.map(function (n,i) {
    if (i >= vec.length+1 || vec[i]) return Math.random()
    else return n
  })
}

V.add = V.plus = function (v) { return this.map(function (n,i) { return n+v[i] }) }
V.sub = V.minus = function (v) { return this.map(function (n,i) { return n-v[i] }) }

V.mul = V.times = V.x = function (v) { return this.map(function (n,i) { return n*v[i] }) }
V.div = V.divide = function (v) { return this.map(function (n,i) { return n/v[i] }) }

/*
V.lt = function (x, y, z) {
  return (this.x < x && this.y < y && this.z < z)
}

V.gt = function (x, y, z) {
  return (this.x > x && this.y > y && this.z > z)
}

V.lte = function (x, y, z) {
  return (this.x <= x && this.y <= y && this.z <= z)
}

V.gte = function (x, y, z) {
  return (this.x >= x && this.y >= y && this.z >= z)
}

V.eq =
V.equals = function (x, y, z) {
  return (this.x === x && this.y === y && this.z === z)
}
*/

/**
 * Vector inherits from V.
 */

inherits(Vector, V, function (fn) { 
  return function (b) {
    var a = this
    b = new Vector(b)
    if (b.length < a.length) {
      b.fill(a.length)
    }
    else if (b.length > a.length) {
      a.fill(b.length)
    }
    return fn.call(this, b)
  }
})

Vector.i = Vector.I = new Vector([1,0,0])
Vector.j = Vector.J = new Vector([0,1,0])
Vector.k = Vector.K = new Vector([0,0,1])

/**
 * Target inherits source methods but
 * with a special modifying function.
 * It is called with `(fn)`.
 * and must return a function.
 *
 * @param {object} t
 * @param {object} s 
 * @param {function} m
 * @return {object} t
 * @api private
 */

function inherits (t, s, m) {
  Object.keys(s).forEach(function (k) {
    var fn = s[k]
    t.prototype[k] = m(fn)
  })
  return t
}

});
require.register("entity-rect/index.js", function(exports, require, module){

var v = require('vector')

// Rect

module.exports = Rect

function Rect (pos, size) {
  if (!(this instanceof Rect)) return new Rect(pos, size)

  if (Array.isArray(pos)) {
    if (!Array.isArray(size)) {
      size = pos[1]
      pos = pos[0]
    }
  }
  else if ('object' == typeof pos && !(pos instanceof v)) {
    size = pos.size
    pos = pos.pos
  }
  else if ('string' == typeof pos) {
    pos = pos.split(' ')
    size = pos[1]
    pos = pos[0]
  }

  this.pos = v(pos)
  this.size = v(size)
}

Rect.prototype.toString = function () {
  return [this.pos, this.size].join(' ')
}

Rect.prototype.set = function (r) {
  this.pos = r.pos
  this.size = r.size
  return this
}

});
require.register("entity-manager/index.js", function(exports, require, module){

var slice = [].slice

/**
 * Module dependencies.
 */

var Entity = require('entity')

/**
 * Manager factory.
 */

module.exports = function (parent) {
  return new Manager(parent)
}

/**
 * Manager class.
 */

function Manager (parent) {
  this.parent = parent
  this.root = this.parent || this
  this.children = []

  this.systems = []
  this.entities = []
  this.components = {}
  this.componentsIndex = []

  this.listeners = {}

  this.state('ready')
}

var proto = Manager.prototype

/**
 * Listen on events.
 *
 * @param {string} ev 
 * @param {fn} fn 
 * @return {object} this
 * @api public
 */

proto.on = function (ev, fn) {
  this.listeners[ev] = this.listeners[ev] || []
  this.listeners[ev].push(fn)
  return this
}

/**
 * Emit events.
 *
 * @param {string} ev 
 * @param {mixed} arguments
 * @return {object} this
 * @api public
 */

proto.emit = function (ev, a, b, c, d) {
  if (!(ev in this.listeners)) return
  for (var i=0, len=this.listeners[ev].length; i<len; i++) {
    this.listeners[ev][i].call(this, a, b, c, d)
  }
  return this
}

/**
 * Determine whether this is the root manager.
 *
 * @return {boolean}
 * @api public
 */

proto.isRoot = function () {
  return this.parent === this
}

/**
 * Attach listeners for the methods of an object.
 *
 * @param {object} obj
 * @return {object} this
 * @api private
 */

proto.addListeners = function (obj) {
  Object.keys(obj)
    .filter(function (k) { return '_' != k.substr(0,1) })
    .forEach(function (k) {
      if ('function' == typeof obj[k]) {
        this.on(k, function () {
          var args = slice.call(arguments)

          if (!obj[k].length) {
            return obj[k].call(obj)
          }

          this.each(obj, function (e) {
            obj[k].apply(obj, [e].concat(args))
          })
        })
      }
    }, this)
  return this
}

/**
 * Apply component data to an entity or all.
 *
 * @param {entity} [e]
 * @api public
 */

proto.applyComponents = function (e) {
  if (e) {
    e.components.forEach(function (c) {
      e.applyComponent(c)
    })
    return this
  }
  else {
    this.each(this.applyComponents.bind(this))
  }
  return this
}

/**
 * Generate a string serialized snapshot of our entities.
 *
 * @return {string}
 * @api public
 */

proto.snapshot = function () {
  return JSON.stringify(this.entities)
}

/**
 * Main event handlers.
 *
 * @api public
 */

proto.init = function () { return this.state('init') }
proto.start = function () { return this.state('start') }
proto.pause = function () { return this.state('pause') }
proto.stop = function () { return this.state('stop') }
proto.tear = function () { return this.state('tear') }
proto.reset = function () {
  this.stop()
  this.tear()
  setTimeout(function () {
    this.init()
    this.start()
  }.bind(this), 0)
  return this
}

/**
 * State accessor. Also emits state on change.
 *
 * @param {string} [s]
 * @return {string} s
 * @api private
 */

proto.state = function (s) {
  if (null == s) return this._state
  this._state = s
  this.emit(s)
  return this
}

/**
 * Get all entities using all the components in the array.
 *
 * @param {array} arr
 * @return {array} entities
 * @api public
 */

proto.of = function (arr) {
  var res = []
  var ents = []
  for (var i=0, c, len=arr.length; i<len; i++) {
    c = arr[i]
    if ('string' == typeof c) {
      ents.push(this.entities.filter(function (e) {
        return (c in e)
      }))
    }
    else {
      c = c.component || c
      var index = this.componentsIndex
      var idx = index.indexOf(c)
      if (~idx) ents.push(this.components[idx] || [])
    }
  }
  var exclude
  if (!ents.length) return res
  for (var i=0, e, len=ents[0].length; i<len; i++) {
    e = ents[0][i]
    exclude = false
    ents.forEach(function (list) {
      if (!~list.indexOf(e)) exclude = true
    })
    if (!exclude) res.push(e)
  }
  return res
}

/**
 * Iterate entities of certain components,
 * or through all if no component is passed.
 *
 * @param {component} c
 * ...
 * @param {fn} fn
 * @return {object} this
 * @api public
 */

proto.each = function (c, fn) {
  var args
  if ('function' == typeof c) {
    this.entities.forEach(c, this)
    return this
  }
  else if (Array.isArray(c)) {
    args = c
  }
  else {
    args = slice.call(arguments)
  }
  fn = args.pop()
  this.of(args).forEach(fn)
  return this
}

/**
 * Get the first entity matching component.
 *
 * @param {component} c 
 * @return {entity}
 * @api public
 */

proto.get = function (c) {
  return this.of(c)[0]
}

/**
 * Use an entity, system or manager.
 * 
 * Registers an entity (creating a new one or reusing
 * the one passed).
 * 
 * Registers a system to be used. Order added matters.
 *
 * Adds a manager to our children.
 *
 * @param {manager|system|entity} item
 * @param {boolean} reuse
 * @return {object} this
 * @api public
 */

proto.use = function (item, reuse) {
  if (item instanceof Entity) {
    var e = item
    if (!reuse) e = new Entity(item)
    if (!~this.entities.indexOf(e)) {
      var self = this
      e.on('use', function (c) {
        self.reg(c, e)
      })
      this.entities.push(e)
      this.registerComponents(e)
      if (this.root != this) {
        if (!~this.root.entities.indexOf(e)) {
          this.root.entities.push(e)
          this.root.registerComponents(e)
        }
      }
    }
  }
  else if ('object' == typeof item) {
    item = item.system || item
    this.addListeners(item)
    if (!('children' in item)) {
      item.emit = this.emit.bind(this)
      item.each = this.each.bind(this)
      item.of = this.of.bind(this)
      this.systems.push(item)
    }
    else {
      item.root = this.root
      this.children.push(item)
    }
  }
  else console.error('unknown', item)
  return this
}

/**
 * Register the components of an entity.
 *
 * @param {entity} e 
 * @return {object} this
 * @api private
 */

proto.registerComponents = function (e) {
  var self = this
  e.components.forEach(function (c) {
    self.reg(c, e)
  })
  return this
}

/**
 * Register a component for an entity.
 *
 * @param {component} c 
 * @param {entity} e 
 * @return {object} this
 * @api private
 */

proto.reg = function (c, e) {
  var comps = this.components
  var index = this.componentsIndex
  var idx = index.indexOf(c)
  if (~idx) {
    if (!~comps[idx].indexOf(e)) {
      comps[idx].push(e)
    }
  }
  else {
    index.push(c)
    comps[index.length-1] = [e]
  }
  return this
}

/**
 * Join (late) an entity.
 * It will try to apply components and systems
 * based on the current state.
 *
 * @param {entity} e 
 * @return {object} this
 * @api public
 */

proto.join = function (e) {
  this.applyComponents(e)
  var s = this.state()
  if ('none' == s) return this
  if ('init' == s || 'start' == s || 'pause' == s || 'stop' == s) {
    e.init(this.systems)
  }
  if ('start' == s || 'pause' == s) {
    e.start(this.systems)
  }
  if ('pause' == s) {
    e.pause(this.systems)
  }
  return this
}

/**
 * Create an entity of components, and use it.
 *
 * @param {component} c, [c, [...]]
 * @return {entity} entity
 * @api public
 */

proto.createEntity = function () {
  var args = slice.call(arguments)
  var e = args[0]
  if (!(e instanceof Entity)) {
    e = new Entity()
    args.forEach(function (arg) {
      e.use(arg)
    })
  }
  this.use(e, true)
  return e
}

/**
 * Remove all entities.
 *
 * @return {object} this
 * @api public
 */

proto.removeAllEntities = function () {
  this.entities.slice().forEach(function (e) {
    this.root.removeEntity(e)
    this.removeEntity(e)
  }, this)
  return this
}

/**
 * Remove an entity.
 *
 * @param {entity} e
 * @return {object) this
 * @api public
 */

proto.removeEntity = function (e) {
  var self = this
  
  var idx = this.entities.indexOf(e)
  if (~idx) this.entities.splice(idx, 1)
  
  e.components.forEach(function (c) {
    var idx = self.componentsIndex.indexOf(c)
    var comps = self.components[idx]
    if (null != comps) {
      var idx = comps.indexOf(e)
      if (~idx) comps.splice(idx, 1)
    }
  })

  return this
}

/**
 * Create a manager and use it.
 *
 * @return {manager}
 * @api public
 */

proto.createManager = function () {
  var manager = new Manager(this)
  this.use(manager)
  return manager
}

/**
 * Mixin helper.
 *
 * @param {object} target
 * @param {object} source
 * @param {boolean} force
 */

function mixin (t, s, f) {
  for (var k in s) {
    if (f || !(k in t)) t[k] = s[k]
  }
}

});
require.register("entity-position/index.js", function(exports, require, module){

var v = require('vector')

// position

var pos = module.exports = {}

pos.pos = [v, 0,0]
pos.prevPos = [v, 0,0]
pos.offset = [v, 0,0]

pos.update = function (e) {
  e.prevPos.set(e.pos)
}

});
require.register("entity-motion/index.js", function(exports, require, module){

var v = require('vector')

// motion

var motion = module.exports = {}

motion.vel = [v, 0,0]

motion.update = function (e) {
  e.pos.add(e.vel)
  e.vel.mul(0.25)
}

});
require.register("component-raf/index.js", function(exports, require, module){

module.exports = window.requestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.mozRequestAnimationFrame
  || window.oRequestAnimationFrame
  || window.msRequestAnimationFrame
  || fallback;

var prev = new Date().getTime();
function fallback(fn) {
  var curr = new Date().getTime();
  var ms = Math.max(0, 16 - (curr - prev));
  setTimeout(fn, ms);
  prev = curr;
}

});
require.register("entity-loop/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var raf = require('raf')

/**
 * Returns a loop system using dt (delta time).
 *
 * @param {float} dt 
 * @return {system} loop
 * @api public
 */

module.exports = function (dt) {

  /**
   * Loop system.
   */

  var loop = {}

  /**
   * Init loop.
   *
   * @api public
   */

  loop.init = function () {
    this.dt = dt || 1000/60
    this.maxDiff = this.dt * 5
    this.reset()
  }

  /**
   * Resets loop.
   *
   * @api private
   */

  loop.reset = function () {
    this.running = false
    this.now = 0
    this.before = 0
    this.diff = 0
    this.frame = 0
    this.timeElapsed = 0
    this.accumulator = 0
  }

  /**
   * Starts loop.
   *
   * @api public
   */

  loop.start = function () {
    this.running = true
    // subtracting diff recovers in case of pause
    this.before = Date.now() - this.diff
    this.tick()
  }

  /**
   * Pauses loop.
   *
   * @api public
   */

  loop.pause = function () {
    this.running = false
    this.diff = Date.now() - this.before
  }

  /**
   * Stops loop.
   * 
   * @api private
   */

  loop.stop = function () {
    this.running = false
    this.reset()
  }

  /**
   * Ticks loop.
   *
   * @return {object} this
   * @api private
   */

  loop.tick = function () {
    function tick () {
      if (this.running) raf(tick)

      this.frame++

      this.now = Date.now()
      this.diff = this.now - this.before
      this.before = this.now

      if (this.diff > this.maxDiff) {
        this.diff = 0
      }
      this.add(this.diff)

      while (this.overflow()) {
        this.emit('update', this.frame, this.timeElapsed)
      }
      this.emit('render', this.alpha())
    }

    tick = tick.bind(this)
    tick()
    
    return this
  }

  /**
   * Adds to loop accumulator and elapsed.
   *
   * @param {number} ms
   * @return {object} this
   * @api private
   */

  loop.add = function (ms) {
    this.timeElapsed += ms
    this.accumulator += ms
    return this
  }

  /**
   * Overflow loop.
   * 
   * @return {boolean} whether this is an underrun
   * @api private
   */

  loop.overflow = function () {
    if (this.accumulator >= this.dt) {
      this.accumulator -= this.dt
      return true
    }
    return false
  }

  /**
   * Calculate alpha. In short, a float of the
   * loop position between this tick and the next.
   * 
   * @return {float} alpha value
   * @api private
   */

  loop.alpha = function () {
    return this.accumulator / this.dt
  }

  return loop
}

});
require.register("entity-mouse/index.js", function(exports, require, module){

var v = require('vector')

// mouse

module.exports = function (el) {
  el = el || document.body

  var mouse = {}

  mouse.pos = [v, 0,0]
  mouse.offset = [v, 0,0]

  mouse.init = function (e) {
    this.reset(e)
  }

  mouse.start = function (e) {
    e.resizeListener = this.reset.bind(this, e)
    window.addEventListener('resize', e.resizeListener, true)

    e.moveListener = createListener(e)
    el.addEventListener('mousemove', e.moveListener, true)
  }

  mouse.reset = function (e) {
    e.offset = v(el.offsetLeft, el.offsetTop)
  }

  mouse.pause =
  mouse.stop = function (e) {
    el.removeEventListener('mousemove', e.moveListener, true)
    window.removeEventListener('resize', e.resizeListener, true)
  }

  function createListener (e) {
    return function (ev) {
      e.pos.set([ev.clientX, ev.clientY]).sub(e.offset)
    }
  }

  return mouse
}

});
require.register("component-emitter/index.js", function(exports, require, module){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  fn._off = on;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners = function(event, fn){
  this._callbacks = this._callbacks || {};
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var i = callbacks.indexOf(fn._off || fn);
  if (~i) callbacks.splice(i, 1);
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

});
require.register("entity-entity/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var Emitter = require('emitter')
var uid = require('uid')

/**
 * Exports Entity class.
 */

module.exports = Entity

/**
 * Entity class.
 *
 * Entity instances serve as dictionaries of Components.
 * They do not keep data or state and are used only to
 * pass references of Entity constructors.
 * 
 * They can be passed to other Entities to copy their
 * component descriptors (mixin) or to be used by Systems.
 * When used by Systems, they only pass their reference
 * to serve as a dictionary or description of an entity.
 * 
 * The actual entity and data are instantiated inside the
 * parent System and can be used by it or its children
 * Systems (the entity's private instance System siblings).
 *
 * System isolation of data is necessary to keep state
 * untouchable by foreign Systems or individual actions,
 * and to make discovery of entities and (de)serialization
 * of state efficient and reliable.
 *
 * @param {String} [id]
 * @param {Array} [components]
 * @api public
 */

function Entity (components, id) {
  if (!(this instanceof Entity)) return new Entity(components, id)
  this.id = id || uid()
  this.components = components && components.components || components || []
}

Emitter(Entity.prototype)

/**
 * Uses a Component or mixins components
 * from another Entity.
 *
 * @param {Component|Entity|Object} c
 * @return {Entity} this
 * @api public
 */

Entity.prototype.use = function (c) {
  c = c.component || (c.component = c || {})

  if (c instanceof Entity) {
    var e = c
    for (var i = 0; i < e.components.length; i++) {
      c = e.components[i]
      this.add(c)
    }
    return this
  }

  this.add(c)

  return this
}

/**
 * Actually adds a component to components.
 *
 * @param {Component} c
 * @api private
 */

Entity.prototype.add = function (c) {
  if (this.has(c)) {
    throw new Error(this.id+': already has component "'+c.id)
  }
  this.components.push(c)
  this.emit('use', c)
}

/**
 * Checks whether we are already using `component`.
 *
 * @param {Component} c
 * @return {Boolean}
 * @api public
 */

Entity.prototype.has = function (c) {
  return !!~this.components.indexOf(c)
}

/**
 * Apply component data to entity.
 *
 * @param {Component} c 
 * @return {Entity} this
 */

Entity.prototype.applyComponent = function (c) {
  var e = this
  for (var p in c) {
    var val = c[p]
    if (Array.isArray(val)) {
      //if ('function' == typeof val[0]) {
        e[p] = val[0].apply(val, val.slice(1))
      //}
      //else {
      //  e[p] = val.slice()
      //}
    }
  }
  return this
}

Entity.prototype.init = function (systems) {
  return this.runSystems('init', systems)
}

Entity.prototype.start = function (systems) {
  return this.runSystems('start', systems)
}

Entity.prototype.pause = function (systems) {
  return this.runSystems('pause', systems)
}

Entity.prototype.stop = function (systems) {
  return this.runSystems('stop', systems)
}

Entity.prototype.tear = function (systems) {
  return this.runSystems('tear', systems)
}

Entity.prototype.runSystems = function (method, systems) {
  var self = this
  systems.forEach(function (system) {
    system.each(system, function (e) {
      if (e === self) {
        if (system[method]) system[method].call(system, e)
      }
    })
  })
  return this
}


/**
 * Merge two objects.
 *
 * @param {object} t 
 * @param {object} s 
 * @return {object} merged
 * @api private
 */

function merge (t, s) {
  for (var k in s) {
    t[k] = s[k]
  }
  return t
}

});
require.register("entity-uid/index.js", function(exports, require, module){
var uuid = module.exports = function (id) {
  return id || (Math.random() * 10e6 | 0).toString(36)
}

uuid.id = uuid

});
require.register("component-domify/index.js", function(exports, require, module){

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Wrap map from jquery.
 */

var map = {
  option: [1, '<select multiple="multiple">', '</select>'],
  optgroup: [1, '<select multiple="multiple">', '</select>'],
  legend: [1, '<fieldset>', '</fieldset>'],
  thead: [1, '<table>', '</table>'],
  tbody: [1, '<table>', '</table>'],
  tfoot: [1, '<table>', '</table>'],
  colgroup: [1, '<table>', '</table>'],
  caption: [1, '<table>', '</table>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
  th: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  _default: [0, '', '']
};

/**
 * Parse `html` and return the children.
 *
 * @param {String} html
 * @return {Array}
 * @api private
 */

function parse(html) {
  if ('string' != typeof html) throw new TypeError('String expected');
  
  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) throw new Error('No elements were generated.');
  var tag = m[1];
  
  // body support
  if (tag == 'body') {
    var el = document.createElement('html');
    el.innerHTML = html;
    return [el.removeChild(el.lastChild)];
  }
  
  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = document.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  return orphan(el.children);
}

/**
 * Orphan `els` and return an array.
 *
 * @param {NodeList} els
 * @return {Array}
 * @api private
 */

function orphan(els) {
  var ret = [];

  while (els.length) {
    ret.push(els[0].parentNode.removeChild(els[0]));
  }

  return ret;
}

});
require.register("component-css/index.js", function(exports, require, module){

module.exports = function(el, obj){
  for (var key in obj) {
    var val = obj[key];
    if ('number' == typeof val) val += 'px';
    el.style[key] = val;
  }
};

});
require.register("entity-dom/index.js", function(exports, require, module){

var domify = require('domify')
var css = require('css')
var rect = require('rect')
var v = require('vector')

var domEl = function (el) {
  if (el) return el
  else return domify('<div class="entity entity-dom"></div>')[0]
}

module.exports = function (parentEl) {
  var dom = {}
  
  dom.el = [domEl]

  dom.render = function (e) {
    var pos = v(e.mesh.pos).sub(e.offset)
    css(e.el, {
      left: Math.round(pos.left)
    , top: Math.round(pos.top)
    })
  }

  dom.init = function (e) {
    if (e.id) e.el.attributes.id = e.id
    if (e.class) e.el.classList.add(e.class)
    var size = e.mesh.size
    css(e.el, {
      width: size.width
    , height: size.height
    })
  }

  dom.start = function (e) {
    parentEl.appendChild(e.el)
  }

  dom.stop = function (e) {
    parentEl.removeChild(e.el)
  }

  return dom
}

});
require.register("arkanoid/arkanoid.js", function(exports, require, module){

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

Bricks(12, 5)

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

});
require.alias("entity-vector/index.js", "arkanoid/deps/vector/index.js");

require.alias("entity-rect/index.js", "arkanoid/deps/rect/index.js");
require.alias("entity-vector/index.js", "entity-rect/deps/vector/index.js");

require.alias("entity-manager/index.js", "arkanoid/deps/manager/index.js");
require.alias("component-emitter/index.js", "entity-manager/deps/emitter/index.js");

require.alias("entity-entity/index.js", "entity-manager/deps/entity/index.js");
require.alias("component-emitter/index.js", "entity-entity/deps/emitter/index.js");

require.alias("entity-uid/index.js", "entity-entity/deps/uid/index.js");

require.alias("entity-position/index.js", "arkanoid/deps/position/index.js");
require.alias("entity-vector/index.js", "entity-position/deps/vector/index.js");

require.alias("entity-motion/index.js", "arkanoid/deps/motion/index.js");
require.alias("entity-vector/index.js", "entity-motion/deps/vector/index.js");

require.alias("entity-loop/index.js", "arkanoid/deps/loop/index.js");
require.alias("component-raf/index.js", "entity-loop/deps/raf/index.js");

require.alias("entity-mouse/index.js", "arkanoid/deps/mouse/index.js");
require.alias("entity-vector/index.js", "entity-mouse/deps/vector/index.js");

require.alias("entity-entity/index.js", "arkanoid/deps/entity/index.js");
require.alias("component-emitter/index.js", "entity-entity/deps/emitter/index.js");

require.alias("entity-uid/index.js", "entity-entity/deps/uid/index.js");

require.alias("entity-uid/index.js", "arkanoid/deps/uid/index.js");

require.alias("entity-dom/index.js", "arkanoid/deps/dom/index.js");
require.alias("component-domify/index.js", "entity-dom/deps/domify/index.js");

require.alias("component-css/index.js", "entity-dom/deps/css/index.js");

require.alias("entity-vector/index.js", "entity-dom/deps/vector/index.js");

require.alias("entity-rect/index.js", "entity-dom/deps/rect/index.js");
require.alias("entity-vector/index.js", "entity-rect/deps/vector/index.js");

require.alias("arkanoid/arkanoid.js", "arkanoid/index.js");


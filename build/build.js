

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
  if (path.charAt(0) === '/') path = path.slice(1);
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
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
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
 * v.limit(rectangle)
 */

Vector.prototype.limit = function (r) {
  if (r instanceof Vector) {
    this.max(r[1])
    this.min(r[2])
  }
  else {
    this.max(r.pos)
    this.min(r.size)
  }
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

Vector.prototype.atan2 = function () { return Math.atan2(this.y, this.x) }

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
  var n = this.length + 1
  while (--n) {
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
V.sub = V.minus = V.subtract = function (v) { return this.map(function (n,i) { return n-v[i] }) }

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

var slice = [].slice

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
 * @param {String} [id]
 * @param {Array} [components]
 * @api public
 */

function Entity () {
  var args = slice.call(arguments)
  if (!(this instanceof Entity)) {
    return new Entity(args)
  }
  this.id = uid()
  this.defaults = {}
  this.components = []

  args.forEach(function (arg) {
    this.use(arg)
  }, this)
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
  if (null == c) return

  var oc = c

  if (c instanceof Entity || c.components) {
    var e = c
    for (var i = 0; i < e.components.length; i++) {
      c = e.components[i]
      this.use(c)
    }
  }
  else if (Array.isArray(c)) {
    c.forEach(this.use, this)
  }

  this.add(oc)

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
    console.dir(c)
    console.error(this.id + ' already has component', c)
    return
//    throw new Error(this.id+': already has component "'+c)
  }
  this.components.push(c)
  this.emit('add', c)
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
    if ('components' == p) continue
    var val = c[p]
    if (Array.isArray(val)) {
      e.defaults[p] = val
      e[p] = e.getDefault(p)
    }
    else if ('function' == typeof val) {
      e[p] = val
    }
  }
  return this
}

Entity.prototype.getDefault = function (p) {
  var c = this.defaults[p]
  var fn = c[0]
  var args = c.slice(1)
  return fn.apply(c, args)
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
require.register("entity-manager/index.js", function(exports, require, module){

var slice = [].slice

/**
 * Module dependencies.
 */

var Entity = require('entity')

/**
 * Manager factory.
 */

module.exports = Manager

/**
 * Manager class.
 */

function Manager (parent) {
  if (!(this instanceof Manager)) return new Manager(parent)

  this.parent = parent || this
  this.root = this.parent.root || this
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
  this.emit('state', s)
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
      e.on('add', function (c) {
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
  else if ('object' == typeof item || 'function' == typeof item) {
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
  this.use(e, true)
  this.applyComponents(e)
  var s = this.state()
  if ('none' == s) return this
  if ('init' == s || 'start' == s || 'pause' == s || 'stop' == s) {
    this.runSystems(e, 'init')
  }
  if ('start' == s || 'pause' == s) {
    this.runSystems(e, 'start')
  }
  if ('pause' == s) {
    this.runSystems(e, 'pause')
  }
  return this
}

proto.runSystems = function (e, method) {
  this.systems.forEach(function (system) {
    if (!system[method]) return
    if (!system[method].length) {
      return
    }
    system.each(system, function (_e) {
      if (e === _e) {
        system[method].call(system, e)
      }
    })
  })
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
  var e = new Entity(args)
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

module.exports = function (opts) {
  opts = opts || {}
  opts.dt = opts.dt || 1000/60

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
    this.maxDiff = opts.dt * 5
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
    if (this.accumulator >= opts.dt) {
      this.accumulator -= opts.dt
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
    return this.accumulator / opts.dt
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
require.register("entity-uid/index.js", function(exports, require, module){
var uuid = module.exports = function (id) {
  return id || (Math.random() * 10e6 | 0).toString(36)
}

uuid.id = uuid

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

var css = require('css')
var rect = require('rect')
var v = require('vector')

var domEl = function (el) {
  if (el) return el
  else return document.createElement('div')
}

module.exports = function (parentEl) {
  var dom = {}
  
  dom.el = [domEl]

  // listeners

  dom.init = function (e) {
    if (e.id) e.el.attributes.id = e.id
    if (e.class) e.setClass(e.class)
    if (e.classList) {
      e.setClass()
      e.classList.forEach(function (c) {
        e.el.classList.add(c)
      })
    }
    e.resize(e.mesh.size)
  }

  dom.start = function (e) {
    parentEl.appendChild(e.el)
  }

  dom.render = function (e) {
    e.moveTo(v(e.mesh.pos).sub(e.offset))
  }

  dom.stop = function (e) {
    parentEl.removeChild(e.el)
  }

  // methods

  dom.moveTo = function (pos) {
    css(this.el, {
      left: Math.round(pos.left)
    , top: Math.round(pos.top)
    })
  }

  dom.resize = function (size) {
    css(this.el, {
      width: size.width
    , height: size.height
    })
  }

  dom.setClass = function (className) {
    this.el.className = 'entity entity-dom'
    if (className) this.el.classList.add(className)
  }

  return dom
}

});
require.register("entity-log/index.js", function(exports, require, module){

var log = function (prop, val) {
  log.data[prop] = val
}

log.el = document.createElement('div')
log.html = []
log.data = {}

module.exports = function (prop, val) {
  if (prop instanceof Element) {
    log.parentEl = prop
  }
  else {
    log(prop, val)
  }
  return log
}

log.init = function () {
  log.el.classList.add('log')
  log.parentEl.appendChild(log.el)
}

log.tear = function () {
  log.parentEl.removeChild(log.el)
}

log.update = function () {
  var html = log.html
  html.length = 0
  for (var prop in log.data) {
    html.push('<pre>'+prop+': '+log.data[prop]+'</pre>')
  }
}

log.render = function () {
  log.el.innerHTML = log.html.join('')
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

});
require.register("arkanoid/defaults.js", function(exports, require, module){

var d = {}

module.exports = d

d.dt = 1000/60
d.bordersGain = 1.002
d.racketTilt = 0.052
d.followSpeed = 0.215
d.racketWidth = 60

});
require.register("arkanoid/systems/ball-bounce.js", function(exports, require, module){

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

});
require.register("arkanoid/systems/ball-collide.js", function(exports, require, module){

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

});
require.alias("entity-vector/index.js", "arkanoid/deps/vector/index.js");

require.alias("entity-rect/index.js", "arkanoid/deps/rect/index.js");
require.alias("entity-vector/index.js", "entity-rect/deps/vector/index.js");

require.alias("entity-entity/index.js", "arkanoid/deps/entity/index.js");
require.alias("component-emitter/index.js", "entity-entity/deps/emitter/index.js");

require.alias("entity-uid/index.js", "entity-entity/deps/uid/index.js");

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

require.alias("entity-uid/index.js", "arkanoid/deps/uid/index.js");

require.alias("entity-dom/index.js", "arkanoid/deps/dom/index.js");
require.alias("component-css/index.js", "entity-dom/deps/css/index.js");

require.alias("entity-vector/index.js", "entity-dom/deps/vector/index.js");

require.alias("entity-rect/index.js", "entity-dom/deps/rect/index.js");
require.alias("entity-vector/index.js", "entity-rect/deps/vector/index.js");

require.alias("entity-log/index.js", "arkanoid/deps/log/index.js");

require.alias("arkanoid/arkanoid.js", "arkanoid/index.js");


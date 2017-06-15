function init() {
  if (document.body) {
    var a = document.body, b = document.documentElement, c = window.innerHeight, d = a.scrollHeight;
    if (root = document.compatMode.indexOf("CSS") >= 0 ? b : a, activeElement = a, initdone = !0, top != self) {
      frame = !0
    } else {
      if (d > c && (a.offsetHeight <= c || b.offsetHeight <= c)) {
        var e = !1, f = function () {
          e || b.scrollHeight == document.height || (e = !0, setTimeout(function () {
            b.style.height = document.height + "px", e = !1
          }, 500))
        };
        if (b.style.height = "", setTimeout(f, 10), addEvent("DOMNodeInserted", f), addEvent("DOMNodeRemoved", f), root.offsetHeight <= c) {
          var g = document.createElement("div");
          g.style.clear = "both", a.appendChild(g)
        }
      }
    }
    if (document.URL.indexOf("mail.google.com") > -1) {
      var h = document.createElement("style");
      h.innerHTML = ".iu { visibility: hidden }", (document.getElementsByTagName("head")[0] || b).appendChild(h)
    }
    fixedback || disabled || (a.style.backgroundAttachment = "scroll", b.style.backgroundAttachment = "scroll")
  }
}
function scrollArray(a, b, c, d) {
  if (d || (d = 1000), directionCheck(b, c), acceleration) {
    var e = +new Date, f = e - lastScroll;
    if (accelDelta > f) {
      var g = (1 + 30 / f) / 2;
      g > 1 && (g = Math.min(g, accelMax), b *= g, c *= g)
    }
    lastScroll = +new Date
  }
  if (que.push({x: b, y: c, lastX: 0 > b ? 0.99 : -0.99, lastY: 0 > c ? 0.99 : -0.99, start: +new Date}), !pending) {
    var h = a === document.body, i = function () {
      for (var e = +new Date, f = 0, g = 0, j = 0; j < que.length; j++) {
        var k = que[j], l = e - k.start, m = l >= animtime, n = m ? 1 : l / animtime;
        pulseAlgorithm && (n = pulse(n));
        var o = k.x * n - k.lastX >> 0, p = k.y * n - k.lastY >> 0;
        f += o, g += p, k.lastX += o, k.lastY += p, m && (que.splice(j, 1), j--)
      }
      h ? window.scrollBy(f, g) : (f && (a.scrollLeft += f), g && (a.scrollTop += g)), b || c || (que = []), que.length ? requestFrame(i, a, d / framerate + 1) : pending = !1
    };
    requestFrame(i, a, 0), pending = !0
  }
}
function wheel(a) {
  initdone || init();
  var b = a.target, c = overflowingAncestor(b);
  if (!c || a.defaultPrevented || isNodeName(activeElement, "embed") || isNodeName(b, "embed") && /\.pdf/i.test(b.src)) {
    return !0
  }
  var d = a.wheelDeltaX || 0, e = a.wheelDeltaY || 0;
  d || e || (e = a.wheelDelta || 0), Math.abs(d) > 1.2 && (d *= stepsize / 120), Math.abs(e) > 1.2 && (e *= stepsize / 120), scrollArray(c, -d, -e), a.preventDefault()
}
function keydown(a) {
  var b = a.target, c = a.ctrlKey || a.altKey || a.metaKey || a.shiftKey && a.keyCode !== key.spacebar;
  if (/input|textarea|select|embed/i.test(b.nodeName) || b.isContentEditable || a.defaultPrevented || c) {
    return !0
  }
  if (isNodeName(b, "button") && a.keyCode === key.spacebar) {
    return !0
  }
  var d, e = 0, f = 0, g = overflowingAncestor(activeElement), h = g.clientHeight;
  switch (g == document.body && (h = window.innerHeight), a.keyCode) {
    case key.up:
      f = -arrowscroll;
      break;
    case key.down:
      f = arrowscroll;
      break;
    case key.spacebar:
      d = a.shiftKey ? 1 : -1, f = -d * h * 0.9;
      break;
    case key.pageup:
      f = 0.9 * -h;
      break;
    case key.pagedown:
      f = 0.9 * h;
      break;
    case key.home:
      f = -g.scrollTop;
      break;
    case key.end:
      var i = g.scrollHeight - g.scrollTop - h;
      f = i > 0 ? i + 10 : 0;
      break;
    case key.left:
      e = -arrowscroll;
      break;
    case key.right:
      e = arrowscroll;
      break;
    default:
      return !0
  }
  scrollArray(g, e, f), a.preventDefault()
}
function mousedown(a) {
  activeElement = a.target
}
function setCache(a, b) {
  for (var c = a.length; c--;) {
    cache[uniqueID(a[c])] = b
  }
  return b
}
function overflowingAncestor(a) {
  var b = [], c = root.scrollHeight;
  do {
    var d = cache[uniqueID(a)];
    if (d) {
      return setCache(b, d)
    }
    if (b.push(a), c === a.scrollHeight) {
      if (!frame || root.clientHeight + 10 < c) {
        return setCache(b, document.body)
      }
    } else {
      if (a.clientHeight + 10 < a.scrollHeight && (overflow = getComputedStyle(a, "").getPropertyValue("overflow-y"), "scroll" === overflow || "auto" === overflow)) {
        return setCache(b, a)
      }
    }
  } while (a = a.parentNode)
}
function addEvent(a, b, c) {
  window.addEventListener(a, b, c || !1)
}
function removeEvent(a, b, c) {
  window.removeEventListener(a, b, c || !1)
}
function isNodeName(a, b) {
  return (a.nodeName || "").toLowerCase() === b.toLowerCase()
}
function directionCheck(a, b) {
  a = a > 0 ? 1 : -1, b = b > 0 ? 1 : -1, (direction.x !== a || direction.y !== b) && (direction.x = a, direction.y = b, que = [], lastScroll = 0)
}
function pulse_(a) {
  var b, c, d;
  return a *= pulseScale, 1 > a ? b = a - (1 - Math.exp(-a)) : (c = Math.exp(-1), a -= 1, d = 1 - Math.exp(-a), b = c + d * (1 - c)), b * pulseNormalize
}
function pulse(a) {
  return a >= 1 ? 1 : 0 >= a ? 0 : (1 == pulseNormalize && (pulseNormalize /= pulse_(1)), pulse_(a))
}
(function () {
  function a() {
  }

  function b(a, b) {
    for (var c = a.length; c--;) {
      if (a[c].listener === b) {
        return c
      }
    }
    return -1
  }

  function c(a) {
    return function () {
      return this[a].apply(this, arguments)
    }
  }

  var d = a.prototype, e = this, f = e.EventEmitter;
  d.getListeners = function (a) {
    var b, c, d = this._getEvents();
    if ("object" == typeof a) {
      b = {};
      for (c in d) {
        d.hasOwnProperty(c) && a.test(c) && (b[c] = d[c])
      }
    } else {
      b = d[a] || (d[a] = [])
    }
    return b
  }, d.flattenListeners = function (a) {
    var b, c = [];
    for (b = 0; a.length > b; b += 1) {
      c.push(a[b].listener)
    }
    return c
  }, d.getListenersAsObject = function (a) {
    var b, c = this.getListeners(a);
    return c instanceof Array && (b = {}, b[a] = c), b || c
  }, d.addListener = function (a, c) {
    var d, e = this.getListenersAsObject(a), f = "object" == typeof c;
    for (d in e) {
      e.hasOwnProperty(d) && -1 === b(e[d], c) && e[d].push(f ? c : {listener: c, once: !1})
    }
    return this
  }, d.on = c("addListener"), d.addOnceListener = function (a, b) {
    return this.addListener(a, {listener: b, once: !0})
  }, d.once = c("addOnceListener"), d.defineEvent = function (a) {
    return this.getListeners(a), this
  }, d.defineEvents = function (a) {
    for (var b = 0; a.length > b; b += 1) {
      this.defineEvent(a[b])
    }
    return this
  }, d.removeListener = function (a, c) {
    var d, e, f = this.getListenersAsObject(a);
    for (e in f) {
      f.hasOwnProperty(e) && (d = b(f[e], c), -1 !== d && f[e].splice(d, 1))
    }
    return this
  }, d.off = c("removeListener"), d.addListeners = function (a, b) {
    return this.manipulateListeners(!1, a, b)
  }, d.removeListeners = function (a, b) {
    return this.manipulateListeners(!0, a, b)
  }, d.manipulateListeners = function (a, b, c) {
    var d, e, f = a ? this.removeListener : this.addListener, g = a ? this.removeListeners : this.addListeners;
    if ("object" != typeof b || b instanceof RegExp) {
      for (d = c.length; d--;) {
        f.call(this, b, c[d])
      }
    } else {
      for (d in b) {
        b.hasOwnProperty(d) && (e = b[d]) && ("function" == typeof e ? f.call(this, d, e) : g.call(this, d, e))
      }
    }
    return this
  }, d.removeEvent = function (a) {
    var b, c = typeof a, d = this._getEvents();
    if ("string" === c) {
      delete d[a]
    } else {
      if ("object" === c) {
        for (b in d) {
          d.hasOwnProperty(b) && a.test(b) && delete d[b]
        }
      } else {
        delete this._events
      }
    }
    return this
  }, d.removeAllListeners = c("removeEvent"), d.emitEvent = function (a, b) {
    var c, d, e, f, g = this.getListenersAsObject(a);
    for (e in g) {
      if (g.hasOwnProperty(e)) {
        for (d = g[e].length; d--;) {
          c = g[e][d], c.once === !0 && this.removeListener(a, c.listener), f = c.listener.apply(this, b || []), f === this._getOnceReturnValue() && this.removeListener(a, c.listener)
        }
      }
    }
    return this
  }, d.trigger = c("emitEvent"), d.emit = function (a) {
    var b = Array.prototype.slice.call(arguments, 1);
    return this.emitEvent(a, b)
  }, d.setOnceReturnValue = function (a) {
    return this._onceReturnValue = a, this
  }, d._getOnceReturnValue = function () {
    return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue : !0
  }, d._getEvents = function () {
    return this._events || (this._events = {})
  }, a.noConflict = function () {
    return e.EventEmitter = f, a
  }, "function" == typeof define && define.amd ? define("eventEmitter/EventEmitter", [], function () {
    return a
  }) : "object" == typeof module && module.exports ? module.exports = a : this.EventEmitter = a
}).call(this), function (a) {
  function b(b) {
    var c = a.event;
    return c.target = c.target || c.srcElement || b, c
  }

  var c = document.documentElement, d = function () {
  };
  c.addEventListener ? d = function (a, b, c) {
    a.addEventListener(b, c, !1)
  } : c.attachEvent && (d = function (a, c, d) {
        a[c + d] = d.handleEvent ? function () {
          var c = b(a);
          d.handleEvent.call(d, c)
        } : function () {
          var c = b(a);
          d.call(a, c)
        }, a.attachEvent("on" + c, a[c + d])
      });
  var e = function () {
  };
  c.removeEventListener ? e = function (a, b, c) {
    a.removeEventListener(b, c, !1)
  } : c.detachEvent && (e = function (a, b, c) {
        a.detachEvent("on" + b, a[b + c]);
        try {
          delete a[b + c]
        } catch (d) {
          a[b + c] = void 0
        }
      });
  var f = {bind: d, unbind: e};
  "function" == typeof define && define.amd ? define("eventie/eventie", f) : a.eventie = f
}(this), function (a, b) {
  "function" == typeof define && define.amd ? define(["eventEmitter/EventEmitter", "eventie/eventie"], function (c, d) {
    return b(a, c, d)
  }) : "object" == typeof exports ? module.exports = b(a, require("eventEmitter"), require("eventie")) : a.imagesLoaded = b(a, a.EventEmitter, a.eventie)
}(this, function (a, b, c) {
  function d(a, b) {
    for (var c in b) {
      a[c] = b[c]
    }
    return a
  }

  function e(a) {
    return "[object Array]" === m.call(a)
  }

  function f(a) {
    var b = [];
    if (e(a)) {
      b = a
    } else {
      if ("number" == typeof a.length) {
        for (var c = 0, d = a.length; d > c; c++) {
          b.push(a[c])
        }
      } else {
        b.push(a)
      }
    }
    return b
  }

  function g(a, b, c) {
    if (!(this instanceof g)) {
      return new g(a, b)
    }
    "string" == typeof a && (a = document.querySelectorAll(a)), this.elements = f(a), this.options = d({}, this.options), "function" == typeof b ? c = b : d(this.options, b), c && this.on("always", c), this.getImages(), j && (this.jqDeferred = new j.Deferred);
    var e = this;
    setTimeout(function () {
      e.check()
    })
  }

  function h(a) {
    this.img = a
  }

  function i(a) {
    this.src = a, n[a] = this
  }

  var j = a.jQuery, k = a.console, l = void 0 !== k, m = Object.prototype.toString;
  g.prototype = new b, g.prototype.options = {}, g.prototype.getImages = function () {
    this.images = [];
    for (var a = 0, b = this.elements.length; b > a; a++) {
      var c = this.elements[a];
      "IMG" === c.nodeName && this.addImage(c);
      var d = c.nodeType;
      if (d && (1 === d || 9 === d || 11 === d)) {
        for (var e = c.querySelectorAll("img"), f = 0, g = e.length; g > f; f++) {
          var h = e[f];
          this.addImage(h)
        }
      }
    }
  }, g.prototype.addImage = function (a) {
    var b = new h(a);
    this.images.push(b)
  }, g.prototype.check = function () {
    function a(a, e) {
      return b.options.debug && l && k.log("confirm", a, e), b.progress(a), c++, c === d && b.complete(), !0
    }

    var b = this, c = 0, d = this.images.length;
    if (this.hasAnyBroken = !1, !d) {
      return void this.complete()
    }
    for (var e = 0; d > e; e++) {
      var f = this.images[e];
      f.on("confirm", a), f.check()
    }
  }, g.prototype.progress = function (a) {
    this.hasAnyBroken = this.hasAnyBroken || !a.isLoaded;
    var b = this;
    setTimeout(function () {
      b.emit("progress", b, a), b.jqDeferred && b.jqDeferred.notify && b.jqDeferred.notify(b, a)
    })
  }, g.prototype.complete = function () {
    var a = this.hasAnyBroken ? "fail" : "done";
    this.isComplete = !0;
    var b = this;
    setTimeout(function () {
      if (b.emit(a, b), b.emit("always", b), b.jqDeferred) {
        var c = b.hasAnyBroken ? "reject" : "resolve";
        b.jqDeferred[c](b)
      }
    })
  }, j && (j.fn.imagesLoaded = function (a, b) {
    var c = new g(this, a, b);
    return c.jqDeferred.promise(j(this))
  }), h.prototype = new b, h.prototype.check = function () {
    var a = n[this.img.src] || new i(this.img.src);
    if (a.isConfirmed) {
      return void this.confirm(a.isLoaded, "cached was confirmed")
    }
    if (this.img.complete && void 0 !== this.img.naturalWidth) {
      return void this.confirm(0 !== this.img.naturalWidth, "naturalWidth")
    }
    var b = this;
    a.on("confirm", function (a, c) {
      return b.confirm(a.isLoaded, c), !0
    }), a.check()
  }, h.prototype.confirm = function (a, b) {
    this.isLoaded = a, this.emit("confirm", this, b)
  };
  var n = {};
  return i.prototype = new b, i.prototype.check = function () {
    if (!this.isChecked) {
      var a = new Image;
      c.bind(a, "load", this), c.bind(a, "error", this), a.src = this.src, this.isChecked = !0
    }
  }, i.prototype.handleEvent = function (a) {
    var b = "on" + a.type;
    this[b] && this[b](a)
  }, i.prototype.onload = function (a) {
    this.confirm(!0, "onload"), this.unbindProxyEvents(a)
  }, i.prototype.onerror = function (a) {
    this.confirm(!1, "onerror"), this.unbindProxyEvents(a)
  }, i.prototype.confirm = function (a, b) {
    this.isConfirmed = !0, this.isLoaded = a, this.emit("confirm", this, b)
  }, i.prototype.unbindProxyEvents = function (a) {
    c.unbind(a.target, "load", this), c.unbind(a.target, "error", this)
  }, g
}), function (a) {
  function b() {
  }

  function c(a) {
    function c(b) {
      b.prototype.option || (b.prototype.option = function (b) {
        a.isPlainObject(b) && (this.options = a.extend(!0, this.options, b))
      })
    }

    function e(b, c) {
      a.fn[b] = function (e) {
        if ("string" == typeof e) {
          for (var g = d.call(arguments, 1), h = 0, i = this.length; i > h; h++) {
            var j = this[h], k = a.data(j, b);
            if (k) {
              if (a.isFunction(k[e]) && "_" !== e.charAt(0)) {
                var l = k[e].apply(k, g);
                if (void 0 !== l) {
                  return l
                }
              } else {
                f("no such method '" + e + "' for " + b + " instance")
              }
            } else {
              f("cannot call methods on " + b + " prior to initialization; attempted to call '" + e + "'")
            }
          }
          return this
        }
        return this.each(function () {
          var d = a.data(this, b);
          d ? (d.option(e), d._init()) : (d = new c(this, e), a.data(this, b, d))
        })
      }
    }

    if (a) {
      var f = "undefined" == typeof console ? b : function (a) {
        console.error(a)
      };
      return a.bridget = function (a, b) {
        c(b), e(a, b)
      }, a.bridget
    }
  }

  var d = Array.prototype.slice;
  "function" == typeof define && define.amd ? define("jquery-bridget/jquery.bridget", ["jquery"], c) : c(a.jQuery)
}(window), function (a) {
  function b(b) {
    var c = a.event;
    return c.target = c.target || c.srcElement || b, c
  }

  var c = document.documentElement, d = function () {
  };
  c.addEventListener ? d = function (a, b, c) {
    a.addEventListener(b, c, !1)
  } : c.attachEvent && (d = function (a, c, d) {
        a[c + d] = d.handleEvent ? function () {
          var c = b(a);
          d.handleEvent.call(d, c)
        } : function () {
          var c = b(a);
          d.call(a, c)
        }, a.attachEvent("on" + c, a[c + d])
      });
  var e = function () {
  };
  c.removeEventListener ? e = function (a, b, c) {
    a.removeEventListener(b, c, !1)
  } : c.detachEvent && (e = function (a, b, c) {
        a.detachEvent("on" + b, a[b + c]);
        try {
          delete a[b + c]
        } catch (d) {
          a[b + c] = void 0
        }
      });
  var f = {bind: d, unbind: e};
  "function" == typeof define && define.amd ? define("eventie/eventie", f) : "object" == typeof exports ? module.exports = f : a.eventie = f
}(this), function (a) {
  function b(a) {
    "function" == typeof a && (b.isReady ? a() : f.push(a))
  }

  function c(a) {
    var c = "readystatechange" === a.type && "complete" !== e.readyState;
    if (!b.isReady && !c) {
      b.isReady = !0;
      for (var d = 0, g = f.length; g > d; d++) {
        var h = f[d];
        h()
      }
    }
  }

  function d(d) {
    return d.bind(e, "DOMContentLoaded", c), d.bind(e, "readystatechange", c), d.bind(a, "load", c), b
  }

  var e = a.document, f = [];
  b.isReady = !1, "function" == typeof define && define.amd ? (b.isReady = "function" == typeof requirejs, define("doc-ready/doc-ready", ["eventie/eventie"], d)) : a.docReady = d(a.eventie)
}(this), function () {
  function a() {
  }

  function b(a, b) {
    for (var c = a.length; c--;) {
      if (a[c].listener === b) {
        return c
      }
    }
    return -1
  }

  function c(a) {
    return function () {
      return this[a].apply(this, arguments)
    }
  }

  var d = a.prototype, e = this, f = e.EventEmitter;
  d.getListeners = function (a) {
    var b, c, d = this._getEvents();
    if (a instanceof RegExp) {
      b = {};
      for (c in d) {
        d.hasOwnProperty(c) && a.test(c) && (b[c] = d[c])
      }
    } else {
      b = d[a] || (d[a] = [])
    }
    return b
  }, d.flattenListeners = function (a) {
    var b, c = [];
    for (b = 0; a.length > b; b += 1) {
      c.push(a[b].listener)
    }
    return c
  }, d.getListenersAsObject = function (a) {
    var b, c = this.getListeners(a);
    return c instanceof Array && (b = {}, b[a] = c), b || c
  }, d.addListener = function (a, c) {
    var d, e = this.getListenersAsObject(a), f = "object" == typeof c;
    for (d in e) {
      e.hasOwnProperty(d) && -1 === b(e[d], c) && e[d].push(f ? c : {listener: c, once: !1})
    }
    return this
  }, d.on = c("addListener"), d.addOnceListener = function (a, b) {
    return this.addListener(a, {listener: b, once: !0})
  }, d.once = c("addOnceListener"), d.defineEvent = function (a) {
    return this.getListeners(a), this
  }, d.defineEvents = function (a) {
    for (var b = 0; a.length > b; b += 1) {
      this.defineEvent(a[b])
    }
    return this
  }, d.removeListener = function (a, c) {
    var d, e, f = this.getListenersAsObject(a);
    for (e in f) {
      f.hasOwnProperty(e) && (d = b(f[e], c), -1 !== d && f[e].splice(d, 1))
    }
    return this
  }, d.off = c("removeListener"), d.addListeners = function (a, b) {
    return this.manipulateListeners(!1, a, b)
  }, d.removeListeners = function (a, b) {
    return this.manipulateListeners(!0, a, b)
  }, d.manipulateListeners = function (a, b, c) {
    var d, e, f = a ? this.removeListener : this.addListener, g = a ? this.removeListeners : this.addListeners;
    if ("object" != typeof b || b instanceof RegExp) {
      for (d = c.length; d--;) {
        f.call(this, b, c[d])
      }
    } else {
      for (d in b) {
        b.hasOwnProperty(d) && (e = b[d]) && ("function" == typeof e ? f.call(this, d, e) : g.call(this, d, e))
      }
    }
    return this
  }, d.removeEvent = function (a) {
    var b, c = typeof a, d = this._getEvents();
    if ("string" === c) {
      delete d[a]
    } else {
      if (a instanceof RegExp) {
        for (b in d) {
          d.hasOwnProperty(b) && a.test(b) && delete d[b]
        }
      } else {
        delete this._events
      }
    }
    return this
  }, d.removeAllListeners = c("removeEvent"), d.emitEvent = function (a, b) {
    var c, d, e, f, g = this.getListenersAsObject(a);
    for (e in g) {
      if (g.hasOwnProperty(e)) {
        for (d = g[e].length; d--;) {
          c = g[e][d], c.once === !0 && this.removeListener(a, c.listener), f = c.listener.apply(this, b || []), f === this._getOnceReturnValue() && this.removeListener(a, c.listener)
        }
      }
    }
    return this
  }, d.trigger = c("emitEvent"), d.emit = function (a) {
    var b = Array.prototype.slice.call(arguments, 1);
    return this.emitEvent(a, b)
  }, d.setOnceReturnValue = function (a) {
    return this._onceReturnValue = a, this
  }, d._getOnceReturnValue = function () {
    return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue : !0
  }, d._getEvents = function () {
    return this._events || (this._events = {})
  }, a.noConflict = function () {
    return e.EventEmitter = f, a
  }, "function" == typeof define && define.amd ? define("eventEmitter/EventEmitter", [], function () {
    return a
  }) : "object" == typeof module && module.exports ? module.exports = a : this.EventEmitter = a
}.call(this), function (a) {
  function b(a) {
    if (a) {
      if ("string" == typeof d[a]) {
        return a
      }
      a = a.charAt(0).toUpperCase() + a.slice(1);
      for (var b, e = 0, f = c.length; f > e; e++) {
        if (b = c[e] + a, "string" == typeof d[b]) {
          return b
        }
      }
    }
  }

  var c = "Webkit Moz ms Ms O".split(" "), d = document.documentElement.style;
  "function" == typeof define && define.amd ? define("get-style-property/get-style-property", [], function () {
    return b
  }) : "object" == typeof exports ? module.exports = b : a.getStyleProperty = b
}(window), function (a) {
  function b(a) {
    var b = parseFloat(a), c = -1 === a.indexOf("%") && !isNaN(b);
    return c && b
  }

  function c() {
    for (var a = {
      width: 0,
      height: 0,
      innerWidth: 0,
      innerHeight: 0,
      outerWidth: 0,
      outerHeight: 0
    }, b = 0, c = g.length; c > b; b++) {
      var d = g[b];
      a[d] = 0
    }
    return a
  }

  function d(a) {
    function d(a) {
      if ("string" == typeof a && (a = document.querySelector(a)), a && "object" == typeof a && a.nodeType) {
        var d = f(a);
        if ("none" === d.display) {
          return c()
        }
        var e = {};
        e.width = a.offsetWidth, e.height = a.offsetHeight;
        for (var k = e.isBorderBox = !(!j || !d[j] || "border-box" !== d[j]), l = 0, m = g.length; m > l; l++) {
          var n = g[l], o = d[n];
          o = h(a, o);
          var p = parseFloat(o);
          e[n] = isNaN(p) ? 0 : p
        }
        var q = e.paddingLeft + e.paddingRight, r = e.paddingTop + e.paddingBottom, s = e.marginLeft + e.marginRight,
            t = e.marginTop + e.marginBottom, u = e.borderLeftWidth + e.borderRightWidth,
            v = e.borderTopWidth + e.borderBottomWidth, w = k && i, x = b(d.width);
        x !== !1 && (e.width = x + (w ? 0 : q + u));
        var y = b(d.height);
        return y !== !1 && (e.height = y + (w ? 0 : r + v)), e.innerWidth = e.width - (q + u), e.innerHeight = e.height - (r + v), e.outerWidth = e.width + s, e.outerHeight = e.height + t, e
      }
    }

    function h(a, b) {
      if (e || -1 === b.indexOf("%")) {
        return b
      }
      var c = a.style, d = c.left, f = a.runtimeStyle, g = f && f.left;
      return g && (f.left = a.currentStyle.left), c.left = b, b = c.pixelLeft, c.left = d, g && (f.left = g), b
    }

    var i, j = a("boxSizing");
    return function () {
      if (j) {
        var a = document.createElement("div");
        a.style.width = "200px", a.style.padding = "1px 2px 3px 4px", a.style.borderStyle = "solid", a.style.borderWidth = "1px 2px 3px 4px", a.style[j] = "border-box";
        var c = document.body || document.documentElement;
        c.appendChild(a);
        var d = f(a);
        i = 200 === b(d.width), c.removeChild(a)
      }
    }(), d
  }

  var e = a.getComputedStyle, f = e ? function (a) {
        return e(a, null)
      } : function (a) {
        return a.currentStyle
      },
      g = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"];
  "function" == typeof define && define.amd ? define("get-size/get-size", ["get-style-property/get-style-property"], d) : "object" == typeof exports ? module.exports = d(require("get-style-property")) : a.getSize = d(a.getStyleProperty)
}(window), function (a, b) {
  function c(a, b) {
    return a[h](b)
  }

  function d(a) {
    if (!a.parentNode) {
      var b = document.createDocumentFragment();
      b.appendChild(a)
    }
  }

  function e(a, b) {
    d(a);
    for (var c = a.parentNode.querySelectorAll(b), e = 0, f = c.length; f > e; e++) {
      if (c[e] === a) {
        return !0
      }
    }
    return !1
  }

  function f(a, b) {
    return d(a), c(a, b)
  }

  var g, h = function () {
    if (b.matchesSelector) {
      return "matchesSelector"
    }
    for (var a = ["webkit", "moz", "ms", "o"], c = 0, d = a.length; d > c; c++) {
      var e = a[c], f = e + "MatchesSelector";
      if (b[f]) {
        return f
      }
    }
  }();
  if (h) {
    var i = document.createElement("div"), j = c(i, "div");
    g = j ? c : f
  } else {
    g = e
  }
  "function" == typeof define && define.amd ? define("matches-selector/matches-selector", [], function () {
    return g
  }) : window.matchesSelector = g
}(this, Element.prototype), function (a) {
  function b(a, b) {
    for (var c in b) {
      a[c] = b[c]
    }
    return a
  }

  function c(a) {
    for (var b in a) {
      return !1
    }
    return b = null, !0
  }

  function d(a) {
    return a.replace(/([A-Z])/g, function (a) {
      return "-" + a.toLowerCase()
    })
  }

  function e(a, e, f) {
    function h(a, b) {
      a && (this.element = a, this.layout = b, this.position = {x: 0, y: 0}, this._create())
    }

    var i = f("transition"), j = f("transform"), k = i && j, l = !!f("perspective"), m = {
      WebkitTransition: "webkitTransitionEnd",
      MozTransition: "transitionend",
      OTransition: "otransitionend",
      transition: "transitionend"
    }[i], n = ["transform", "transition", "transitionDuration", "transitionProperty"], o = function () {
      for (var a = {}, b = 0, c = n.length; c > b; b++) {
        var d = n[b], e = f(d);
        e && e !== d && (a[d] = e)
      }
      return a
    }();
    b(h.prototype, a.prototype), h.prototype._create = function () {
      this._transn = {ingProperties: {}, clean: {}, onEnd: {}}, this.css({position: "absolute"})
    }, h.prototype.handleEvent = function (a) {
      var b = "on" + a.type;
      this[b] && this[b](a)
    }, h.prototype.getSize = function () {
      this.size = e(this.element)
    }, h.prototype.css = function (a) {
      var b = this.element.style;
      for (var c in a) {
        var d = o[c] || c;
        b[d] = a[c]
      }
    }, h.prototype.getPosition = function () {
      var a = g(this.element), b = this.layout.options, c = b.isOriginLeft, d = b.isOriginTop,
          e = parseInt(a[c ? "left" : "right"], 10), f = parseInt(a[d ? "top" : "bottom"], 10);
      e = isNaN(e) ? 0 : e, f = isNaN(f) ? 0 : f;
      var h = this.layout.size;
      e -= c ? h.paddingLeft : h.paddingRight, f -= d ? h.paddingTop : h.paddingBottom, this.position.x = e, this.position.y = f
    }, h.prototype.layoutPosition = function () {
      var a = this.layout.size, b = this.layout.options, c = {};
      b.isOriginLeft ? (c.left = this.position.x + a.paddingLeft + "px", c.right = "") : (c.right = this.position.x + a.paddingRight + "px", c.left = ""), b.isOriginTop ? (c.top = this.position.y + a.paddingTop + "px", c.bottom = "") : (c.bottom = this.position.y + a.paddingBottom + "px", c.top = ""), this.css(c), this.emitEvent("layout", [this])
    };
    var p = l ? function (a, b) {
      return "translate3d(" + a + "px, " + b + "px, 0)"
    } : function (a, b) {
      return "translate(" + a + "px, " + b + "px)"
    };
    h.prototype._transitionTo = function (a, b) {
      this.getPosition();
      var c = this.position.x, d = this.position.y, e = parseInt(a, 10), f = parseInt(b, 10),
          g = e === this.position.x && f === this.position.y;
      if (this.setPosition(a, b), g && !this.isTransitioning) {
        return void this.layoutPosition()
      }
      var h = a - c, i = b - d, j = {}, k = this.layout.options;
      h = k.isOriginLeft ? h : -h, i = k.isOriginTop ? i : -i, j.transform = p(h, i), this.transition({
        to: j,
        onTransitionEnd: {transform: this.layoutPosition},
        isCleaning: !0
      })
    }, h.prototype.goTo = function (a, b) {
      this.setPosition(a, b), this.layoutPosition()
    }, h.prototype.moveTo = k ? h.prototype._transitionTo : h.prototype.goTo, h.prototype.setPosition = function (a, b) {
      this.position.x = parseInt(a, 10), this.position.y = parseInt(b, 10)
    }, h.prototype._nonTransition = function (a) {
      this.css(a.to), a.isCleaning && this._removeStyles(a.to);
      for (var b in a.onTransitionEnd) {
        a.onTransitionEnd[b].call(this)
      }
    }, h.prototype._transition = function (a) {
      if (!parseFloat(this.layout.options.transitionDuration)) {
        return void this._nonTransition(a)
      }
      var b = this._transn;
      for (var c in a.onTransitionEnd) {
        b.onEnd[c] = a.onTransitionEnd[c]
      }
      for (c in a.to) {
        b.ingProperties[c] = !0, a.isCleaning && (b.clean[c] = !0)
      }
      if (a.from) {
        this.css(a.from);
        var d = this.element.offsetHeight;
        d = null
      }
      this.enableTransition(a.to), this.css(a.to), this.isTransitioning = !0
    };
    var q = j && d(j) + ",opacity";
    h.prototype.enableTransition = function () {
      this.isTransitioning || (this.css({
        transitionProperty: q,
        transitionDuration: this.layout.options.transitionDuration
      }), this.element.addEventListener(m, this, !1))
    }, h.prototype.transition = h.prototype[i ? "_transition" : "_nonTransition"], h.prototype.onwebkitTransitionEnd = function (a) {
      this.ontransitionend(a)
    }, h.prototype.onotransitionend = function (a) {
      this.ontransitionend(a)
    };
    var r = {"-webkit-transform": "transform", "-moz-transform": "transform", "-o-transform": "transform"};
    h.prototype.ontransitionend = function (a) {
      if (a.target === this.element) {
        var b = this._transn, d = r[a.propertyName] || a.propertyName;
        if (delete b.ingProperties[d], c(b.ingProperties) && this.disableTransition(), d in b.clean && (this.element.style[a.propertyName] = "", delete b.clean[d]), d in b.onEnd) {
          var e = b.onEnd[d];
          e.call(this), delete b.onEnd[d]
        }
        this.emitEvent("transitionEnd", [this])
      }
    }, h.prototype.disableTransition = function () {
      this.removeTransitionStyles(), this.element.removeEventListener(m, this, !1), this.isTransitioning = !1
    }, h.prototype._removeStyles = function (a) {
      var b = {};
      for (var c in a) {
        b[c] = ""
      }
      this.css(b)
    };
    var s = {transitionProperty: "", transitionDuration: ""};
    return h.prototype.removeTransitionStyles = function () {
      this.css(s)
    }, h.prototype.removeElem = function () {
      this.element.parentNode.removeChild(this.element), this.emitEvent("remove", [this])
    }, h.prototype.remove = function () {
      if (!i || !parseFloat(this.layout.options.transitionDuration)) {
        return void this.removeElem()
      }
      var a = this;
      this.on("transitionEnd", function () {
        return a.removeElem(), !0
      }), this.hide()
    }, h.prototype.reveal = function () {
      delete this.isHidden, this.css({display: ""});
      var a = this.layout.options;
      this.transition({from: a.hiddenStyle, to: a.visibleStyle, isCleaning: !0})
    }, h.prototype.hide = function () {
      this.isHidden = !0, this.css({display: ""});
      var a = this.layout.options;
      this.transition({
        from: a.visibleStyle, to: a.hiddenStyle, isCleaning: !0, onTransitionEnd: {
          opacity: function () {
            this.isHidden && this.css({display: "none"})
          }
        }
      })
    }, h.prototype.destroy = function () {
      this.css({position: "", left: "", right: "", top: "", bottom: "", transition: "", transform: ""})
    }, h
  }

  var f = a.getComputedStyle, g = f ? function (a) {
    return f(a, null)
  } : function (a) {
    return a.currentStyle
  };
  "function" == typeof define && define.amd ? define("outlayer/item", ["eventEmitter/EventEmitter", "get-size/get-size", "get-style-property/get-style-property"], e) : (a.Outlayer = {}, a.Outlayer.Item = e(a.EventEmitter, a.getSize, a.getStyleProperty))
}(window), function (a) {
  function b(a, b) {
    for (var c in b) {
      a[c] = b[c]
    }
    return a
  }

  function c(a) {
    return "[object Array]" === l.call(a)
  }

  function d(a) {
    var b = [];
    if (c(a)) {
      b = a
    } else {
      if (a && "number" == typeof a.length) {
        for (var d = 0, e = a.length; e > d; d++) {
          b.push(a[d])
        }
      } else {
        b.push(a)
      }
    }
    return b
  }

  function e(a, b) {
    var c = n(b, a);
    -1 !== c && b.splice(c, 1)
  }

  function f(a) {
    return a.replace(/(.)([A-Z])/g, function (a, b, c) {
      return b + "-" + c
    }).toLowerCase()
  }

  function g(c, g, l, n, o, p) {
    function q(a, c) {
      if ("string" == typeof a && (a = h.querySelector(a)), !a || !m(a)) {
        return void(i && i.error("Bad " + this.constructor.namespace + " element: " + a))
      }
      this.element = a, this.options = b({}, this.constructor.defaults), this.option(c);
      var d = ++r;
      this.element.outlayerGUID = d, s[d] = this, this._create(), this.options.isInitLayout && this.layout()
    }

    var r = 0, s = {};
    return q.namespace = "outlayer", q.Item = p, q.defaults = {
      containerStyle: {position: "relative"},
      isInitLayout: !0,
      isOriginLeft: !0,
      isOriginTop: !0,
      isResizeBound: !0,
      isResizingContainer: !0,
      transitionDuration: "0.4s",
      hiddenStyle: {opacity: 0, transform: "scale(0.001)"},
      visibleStyle: {opacity: 1, transform: "scale(1)"}
    }, b(q.prototype, l.prototype), q.prototype.option = function (a) {
      b(this.options, a)
    }, q.prototype._create = function () {
      this.reloadItems(), this.stamps = [], this.stamp(this.options.stamp), b(this.element.style, this.options.containerStyle), this.options.isResizeBound && this.bindResize()
    }, q.prototype.reloadItems = function () {
      this.items = this._itemize(this.element.children)
    }, q.prototype._itemize = function (a) {
      for (var b = this._filterFindItemElements(a), c = this.constructor.Item, d = [], e = 0, f = b.length; f > e; e++) {
        var g = b[e], h = new c(g, this);
        d.push(h)
      }
      return d
    }, q.prototype._filterFindItemElements = function (a) {
      a = d(a);
      for (var b = this.options.itemSelector, c = [], e = 0, f = a.length; f > e; e++) {
        var g = a[e];
        if (m(g)) {
          if (b) {
            o(g, b) && c.push(g);
            for (var h = g.querySelectorAll(b), i = 0, j = h.length; j > i; i++) {
              c.push(h[i])
            }
          } else {
            c.push(g)
          }
        }
      }
      return c
    }, q.prototype.getItemElements = function () {
      for (var a = [], b = 0, c = this.items.length; c > b; b++) {
        a.push(this.items[b].element)
      }
      return a
    }, q.prototype.layout = function () {
      this._resetLayout(), this._manageStamps();
      var a = void 0 !== this.options.isLayoutInstant ? this.options.isLayoutInstant : !this._isLayoutInited;
      this.layoutItems(this.items, a), this._isLayoutInited = !0
    }, q.prototype._init = q.prototype.layout, q.prototype._resetLayout = function () {
      this.getSize()
    }, q.prototype.getSize = function () {
      this.size = n(this.element)
    }, q.prototype._getMeasurement = function (a, b) {
      var c, d = this.options[a];
      d ? ("string" == typeof d ? c = this.element.querySelector(d) : m(d) && (c = d), this[a] = c ? n(c)[b] : d) : this[a] = 0
    }, q.prototype.layoutItems = function (a, b) {
      a = this._getItemsForLayout(a), this._layoutItems(a, b), this._postLayout()
    }, q.prototype._getItemsForLayout = function (a) {
      for (var b = [], c = 0, d = a.length; d > c; c++) {
        var e = a[c];
        e.isIgnored || b.push(e)
      }
      return b
    }, q.prototype._layoutItems = function (a, b) {
      function c() {
        d.emitEvent("layoutComplete", [d, a])
      }

      var d = this;
      if (!a || !a.length) {
        return void c()
      }
      this._itemsOn(a, "layout", c);
      for (var e = [], f = 0, g = a.length; g > f; f++) {
        var h = a[f], i = this._getItemLayoutPosition(h);
        i.item = h, i.isInstant = b || h.isLayoutInstant, e.push(i)
      }
      this._processLayoutQueue(e)
    }, q.prototype._getItemLayoutPosition = function () {
      return {x: 0, y: 0}
    }, q.prototype._processLayoutQueue = function (a) {
      for (var b = 0, c = a.length; c > b; b++) {
        var d = a[b];
        this._positionItem(d.item, d.x, d.y, d.isInstant)
      }
    }, q.prototype._positionItem = function (a, b, c, d) {
      d ? a.goTo(b, c) : a.moveTo(b, c)
    }, q.prototype._postLayout = function () {
      this.resizeContainer()
    }, q.prototype.resizeContainer = function () {
      if (this.options.isResizingContainer) {
        var a = this._getContainerSize();
        a && (this._setContainerMeasure(a.width, !0), this._setContainerMeasure(a.height, !1))
      }
    }, q.prototype._getContainerSize = k, q.prototype._setContainerMeasure = function (a, b) {
      if (void 0 !== a) {
        var c = this.size;
        c.isBorderBox && (a += b ? c.paddingLeft + c.paddingRight + c.borderLeftWidth + c.borderRightWidth : c.paddingBottom + c.paddingTop + c.borderTopWidth + c.borderBottomWidth), a = Math.max(a, 0), this.element.style[b ? "width" : "height"] = a + "px"
      }
    }, q.prototype._itemsOn = function (a, b, c) {
      function d() {
        return e++, e === f && c.call(g), !0
      }

      for (var e = 0, f = a.length, g = this, h = 0, i = a.length; i > h; h++) {
        var j = a[h];
        j.on(b, d)
      }
    }, q.prototype.ignore = function (a) {
      var b = this.getItem(a);
      b && (b.isIgnored = !0)
    }, q.prototype.unignore = function (a) {
      var b = this.getItem(a);
      b && delete b.isIgnored
    }, q.prototype.stamp = function (a) {
      if (a = this._find(a)) {
        this.stamps = this.stamps.concat(a);
        for (var b = 0, c = a.length; c > b; b++) {
          var d = a[b];
          this.ignore(d)
        }
      }
    }, q.prototype.unstamp = function (a) {
      if (a = this._find(a)) {
        for (var b = 0, c = a.length; c > b; b++) {
          var d = a[b];
          e(d, this.stamps), this.unignore(d)
        }
      }
    }, q.prototype._find = function (a) {
      return a ? ("string" == typeof a && (a = this.element.querySelectorAll(a)), a = d(a)) : void 0
    }, q.prototype._manageStamps = function () {
      if (this.stamps && this.stamps.length) {
        this._getBoundingRect();
        for (var a = 0, b = this.stamps.length; b > a; a++) {
          var c = this.stamps[a];
          this._manageStamp(c)
        }
      }
    }, q.prototype._getBoundingRect = function () {
      var a = this.element.getBoundingClientRect(), b = this.size;
      this._boundingRect = {
        left: a.left + b.paddingLeft + b.borderLeftWidth,
        top: a.top + b.paddingTop + b.borderTopWidth,
        right: a.right - (b.paddingRight + b.borderRightWidth),
        bottom: a.bottom - (b.paddingBottom + b.borderBottomWidth)
      }
    }, q.prototype._manageStamp = k, q.prototype._getElementOffset = function (a) {
      var b = a.getBoundingClientRect(), c = this._boundingRect, d = n(a), e = {
        left: b.left - c.left - d.marginLeft,
        top: b.top - c.top - d.marginTop,
        right: c.right - b.right - d.marginRight,
        bottom: c.bottom - b.bottom - d.marginBottom
      };
      return e
    }, q.prototype.handleEvent = function (a) {
      var b = "on" + a.type;
      this[b] && this[b](a)
    }, q.prototype.bindResize = function () {
      this.isResizeBound || (c.bind(a, "resize", this), this.isResizeBound = !0)
    }, q.prototype.unbindResize = function () {
      this.isResizeBound && c.unbind(a, "resize", this), this.isResizeBound = !1
    }, q.prototype.onresize = function () {
      function a() {
        b.resize(), delete b.resizeTimeout
      }

      this.resizeTimeout && clearTimeout(this.resizeTimeout);
      var b = this;
      this.resizeTimeout = setTimeout(a, 100)
    }, q.prototype.resize = function () {
      this.isResizeBound && this.needsResizeLayout() && this.layout()
    }, q.prototype.needsResizeLayout = function () {
      var a = n(this.element), b = this.size && a;
      return b && a.innerWidth !== this.size.innerWidth
    }, q.prototype.addItems = function (a) {
      var b = this._itemize(a);
      return b.length && (this.items = this.items.concat(b)), b
    }, q.prototype.appended = function (a) {
      var b = this.addItems(a);
      b.length && (this.layoutItems(b, !0), this.reveal(b))
    }, q.prototype.prepended = function (a) {
      var b = this._itemize(a);
      if (b.length) {
        var c = this.items.slice(0);
        this.items = b.concat(c), this._resetLayout(), this._manageStamps(), this.layoutItems(b, !0), this.reveal(b), this.layoutItems(c)
      }
    }, q.prototype.reveal = function (a) {
      var b = a && a.length;
      if (b) {
        for (var c = 0; b > c; c++) {
          var d = a[c];
          d.reveal()
        }
      }
    }, q.prototype.hide = function (a) {
      var b = a && a.length;
      if (b) {
        for (var c = 0; b > c; c++) {
          var d = a[c];
          d.hide()
        }
      }
    }, q.prototype.getItem = function (a) {
      for (var b = 0, c = this.items.length; c > b; b++) {
        var d = this.items[b];
        if (d.element === a) {
          return d
        }
      }
    }, q.prototype.getItems = function (a) {
      if (a && a.length) {
        for (var b = [], c = 0, d = a.length; d > c; c++) {
          var e = a[c], f = this.getItem(e);
          f && b.push(f)
        }
        return b
      }
    }, q.prototype.remove = function (a) {
      a = d(a);
      var b = this.getItems(a);
      if (b && b.length) {
        this._itemsOn(b, "remove", function () {
          this.emitEvent("removeComplete", [this, b])
        });
        for (var c = 0, f = b.length; f > c; c++) {
          var g = b[c];
          g.remove(), e(g, this.items)
        }
      }
    }, q.prototype.destroy = function () {
      var a = this.element.style;
      a.height = "", a.position = "", a.width = "";
      for (var b = 0, c = this.items.length; c > b; b++) {
        var d = this.items[b];
        d.destroy()
      }
      this.unbindResize(), delete this.element.outlayerGUID, j && j.removeData(this.element, this.constructor.namespace)
    }, q.data = function (a) {
      var b = a && a.outlayerGUID;
      return b && s[b]
    }, q.create = function (a, c) {
      function d() {
        q.apply(this, arguments)
      }

      return Object.create ? d.prototype = Object.create(q.prototype) : b(d.prototype, q.prototype), d.prototype.constructor = d, d.defaults = b({}, q.defaults), b(d.defaults, c), d.prototype.settings = {}, d.namespace = a, d.data = q.data, d.Item = function () {
        p.apply(this, arguments)
      }, d.Item.prototype = new p, g(function () {
        for (var b = f(a), c = h.querySelectorAll(".js-" + b), e = "data-" + b + "-options", g = 0, k = c.length; k > g; g++) {
          var l, m = c[g], n = m.getAttribute(e);
          try {
            l = n && JSON.parse(n)
          } catch (o) {
            i && i.error("Error parsing " + e + " on " + m.nodeName.toLowerCase() + (m.id ? "#" + m.id : "") + ": " + o);
            continue
          }
          var p = new d(m, l);
          j && j.data(m, a, p)
        }
      }), j && j.bridget && j.bridget(a, d), d
    }, q.Item = p, q
  }

  var h = a.document, i = a.console, j = a.jQuery, k = function () {
  }, l = Object.prototype.toString, m = "object" == typeof HTMLElement ? function (a) {
    return a instanceof HTMLElement
  } : function (a) {
    return a && "object" == typeof a && 1 === a.nodeType && "string" == typeof a.nodeName
  }, n = Array.prototype.indexOf ? function (a, b) {
    return a.indexOf(b)
  } : function (a, b) {
    for (var c = 0, d = a.length; d > c; c++) {
      if (a[c] === b) {
        return c
      }
    }
    return -1
  };
  "function" == typeof define && define.amd ? define("outlayer/outlayer", ["eventie/eventie", "doc-ready/doc-ready", "eventEmitter/EventEmitter", "get-size/get-size", "matches-selector/matches-selector", "./item"], g) : a.Outlayer = g(a.eventie, a.docReady, a.EventEmitter, a.getSize, a.matchesSelector, a.Outlayer.Item)
}(window), function (a) {
  function b(a) {
    function b() {
      a.Item.apply(this, arguments)
    }

    b.prototype = new a.Item, b.prototype._create = function () {
      this.id = this.layout.itemGUID++, a.Item.prototype._create.call(this), this.sortData = {}
    }, b.prototype.updateSortData = function () {
      if (!this.isIgnored) {
        this.sortData.id = this.id, this.sortData["original-order"] = this.id, this.sortData.random = Math.random();
        var a = this.layout.options.getSortData, b = this.layout._sorters;
        for (var c in a) {
          var d = b[c];
          this.sortData[c] = d(this.element, this)
        }
      }
    };
    var c = b.prototype.destroy;
    return b.prototype.destroy = function () {
      c.apply(this, arguments), this.css({display: ""})
    }, b
  }

  "function" == typeof define && define.amd ? define("isotope/js/item", ["outlayer/outlayer"], b) : (a.Isotope = a.Isotope || {}, a.Isotope.Item = b(a.Outlayer))
}(window), function (a) {
  function b(a, b) {
    function c(a) {
      this.isotope = a, a && (this.options = a.options[this.namespace], this.element = a.element, this.items = a.filteredItems, this.size = a.size)
    }

    return function () {
      function a(a) {
        return function () {
          return b.prototype[a].apply(this.isotope, arguments)
        }
      }

      for (var d = ["_resetLayout", "_getItemLayoutPosition", "_manageStamp", "_getContainerSize", "_getElementOffset", "needsResizeLayout"], e = 0, f = d.length; f > e; e++) {
        var g = d[e];
        c.prototype[g] = a(g)
      }
    }(), c.prototype.needsVerticalResizeLayout = function () {
      var b = a(this.isotope.element), c = this.isotope.size && b;
      return c && b.innerHeight !== this.isotope.size.innerHeight
    }, c.prototype._getMeasurement = function () {
      this.isotope._getMeasurement.apply(this, arguments)
    }, c.prototype.getColumnWidth = function () {
      this.getSegmentSize("column", "Width")
    }, c.prototype.getRowHeight = function () {
      this.getSegmentSize("row", "Height")
    }, c.prototype.getSegmentSize = function (a, b) {
      var c = a + b, d = "outer" + b;
      if (this._getMeasurement(c, d), !this[c]) {
        var e = this.getFirstItemSize();
        this[c] = e && e[d] || this.isotope.size["inner" + b]
      }
    }, c.prototype.getFirstItemSize = function () {
      var b = this.isotope.filteredItems[0];
      return b && b.element && a(b.element)
    }, c.prototype.layout = function () {
      this.isotope.layout.apply(this.isotope, arguments)
    }, c.prototype.getSize = function () {
      this.isotope.getSize(), this.size = this.isotope.size
    }, c.modes = {}, c.create = function (a, b) {
      function d() {
        c.apply(this, arguments)
      }

      return d.prototype = new c, b && (d.options = b), d.prototype.namespace = a, c.modes[a] = d, d
    }, c
  }

  "function" == typeof define && define.amd ? define("isotope/js/layout-mode", ["get-size/get-size", "outlayer/outlayer"], b) : (a.Isotope = a.Isotope || {}, a.Isotope.LayoutMode = b(a.getSize, a.Outlayer))
}(window), function (a) {
  function b(a, b) {
    var d = a.create("masonry");
    return d.prototype._resetLayout = function () {
      this.getSize(), this._getMeasurement("columnWidth", "outerWidth"), this._getMeasurement("gutter", "outerWidth"), this.measureColumns();
      var a = this.cols;
      for (this.colYs = []; a--;) {
        this.colYs.push(0)
      }
      this.maxY = 0
    }, d.prototype.measureColumns = function () {
      if (this.getContainerWidth(), !this.columnWidth) {
        var a = this.items[0], c = a && a.element;
        this.columnWidth = c && b(c).outerWidth || this.containerWidth
      }
      this.columnWidth += this.gutter, this.cols = Math.floor((this.containerWidth + this.gutter) / this.columnWidth), this.cols = Math.max(this.cols, 1)
    }, d.prototype.getContainerWidth = function () {
      var a = this.options.isFitWidth ? this.element.parentNode : this.element, c = b(a);
      this.containerWidth = c && c.innerWidth
    }, d.prototype._getItemLayoutPosition = function (a) {
      a.getSize();
      var b = a.size.outerWidth % this.columnWidth, d = b && 1 > b ? "round" : "ceil",
          e = Math[d](a.size.outerWidth / this.columnWidth);
      e = Math.min(e, this.cols);
      for (var f = this._getColGroup(e), g = Math.min.apply(Math, f), h = c(f, g), i = {
        x: this.columnWidth * h,
        y: g
      }, j = g + a.size.outerHeight, k = this.cols + 1 - f.length, l = 0; k > l; l++) {
        this.colYs[h + l] = j
      }
      return i
    }, d.prototype._getColGroup = function (a) {
      if (2 > a) {
        return this.colYs
      }
      for (var b = [], c = this.cols + 1 - a, d = 0; c > d; d++) {
        var e = this.colYs.slice(d, d + a);
        b[d] = Math.max.apply(Math, e)
      }
      return b
    }, d.prototype._manageStamp = function (a) {
      var c = b(a), d = this._getElementOffset(a), e = this.options.isOriginLeft ? d.left : d.right,
          f = e + c.outerWidth, g = Math.floor(e / this.columnWidth);
      g = Math.max(0, g);
      var h = Math.floor(f / this.columnWidth);
      h -= f % this.columnWidth ? 0 : 1, h = Math.min(this.cols - 1, h);
      for (var i = (this.options.isOriginTop ? d.top : d.bottom) + c.outerHeight, j = g; h >= j; j++) {
        this.colYs[j] = Math.max(i, this.colYs[j])
      }
    }, d.prototype._getContainerSize = function () {
      this.maxY = Math.max.apply(Math, this.colYs);
      var a = {height: this.maxY};
      return this.options.isFitWidth && (a.width = this._getContainerFitWidth()), a
    }, d.prototype._getContainerFitWidth = function () {
      for (var a = 0, b = this.cols; --b && 0 === this.colYs[b];) {
        a++
      }
      return (this.cols - a) * this.columnWidth - this.gutter
    }, d.prototype.needsResizeLayout = function () {
      var a = this.containerWidth;
      return this.getContainerWidth(), a !== this.containerWidth
    }, d
  }

  var c = Array.prototype.indexOf ? function (a, b) {
    return a.indexOf(b)
  } : function (a, b) {
    for (var c = 0, d = a.length; d > c; c++) {
      var e = a[c];
      if (e === b) {
        return c
      }
    }
    return -1
  };
  "function" == typeof define && define.amd ? define("masonry/masonry", ["outlayer/outlayer", "get-size/get-size"], b) : a.Masonry = b(a.Outlayer, a.getSize)
}(window), function (a) {
  function b(a, b) {
    for (var c in b) {
      a[c] = b[c]
    }
    return a
  }

  function c(a, c) {
    var d = a.create("masonry"), e = d.prototype._getElementOffset, f = d.prototype.layout,
        g = d.prototype._getMeasurement;
    b(d.prototype, c.prototype), d.prototype._getElementOffset = e, d.prototype.layout = f, d.prototype._getMeasurement = g;
    var h = d.prototype.measureColumns;
    d.prototype.measureColumns = function () {
      this.items = this.isotope.filteredItems, h.call(this)
    };
    var i = d.prototype._manageStamp;
    return d.prototype._manageStamp = function () {
      this.options.isOriginLeft = this.isotope.options.isOriginLeft, this.options.isOriginTop = this.isotope.options.isOriginTop, i.apply(this, arguments)
    }, d
  }

  "function" == typeof define && define.amd ? define("isotope/js/layout-modes/masonry", ["../layout-mode", "masonry/masonry"], c) : c(a.Isotope.LayoutMode, a.Masonry)
}(window), function (a) {
  function b(a) {
    var b = a.create("fitRows");
    return b.prototype._resetLayout = function () {
      this.x = 0, this.y = 0, this.maxY = 0
    }, b.prototype._getItemLayoutPosition = function (a) {
      a.getSize(), 0 !== this.x && a.size.outerWidth + this.x > this.isotope.size.innerWidth && (this.x = 0, this.y = this.maxY);
      var b = {x: this.x, y: this.y};
      return this.maxY = Math.max(this.maxY, this.y + a.size.outerHeight), this.x += a.size.outerWidth, b
    }, b.prototype._getContainerSize = function () {
      return {height: this.maxY}
    }, b
  }

  "function" == typeof define && define.amd ? define("isotope/js/layout-modes/fit-rows", ["../layout-mode"], b) : b(a.Isotope.LayoutMode)
}(window), function (a) {
  function b(a) {
    var b = a.create("vertical", {horizontalAlignment: 0});
    return b.prototype._resetLayout = function () {
      this.y = 0
    }, b.prototype._getItemLayoutPosition = function (a) {
      a.getSize();
      var b = (this.isotope.size.innerWidth - a.size.outerWidth) * this.options.horizontalAlignment, c = this.y;
      return this.y += a.size.outerHeight, {x: b, y: c}
    }, b.prototype._getContainerSize = function () {
      return {height: this.y}
    }, b
  }

  "function" == typeof define && define.amd ? define("isotope/js/layout-modes/vertical", ["../layout-mode"], b) : b(a.Isotope.LayoutMode)
}(window), function (a) {
  function b(a, b) {
    for (var c in b) {
      a[c] = b[c]
    }
    return a
  }

  function c(a) {
    return "[object Array]" === k.call(a)
  }

  function d(a) {
    var b = [];
    if (c(a)) {
      b = a
    } else {
      if (a && "number" == typeof a.length) {
        for (var d = 0, e = a.length; e > d; d++) {
          b.push(a[d])
        }
      } else {
        b.push(a)
      }
    }
    return b
  }

  function e(a, b) {
    var c = l(b, a);
    -1 !== c && b.splice(c, 1)
  }

  function f(a, c, f, i, k) {
    function l(a, b) {
      return function (c, d) {
        for (var e = 0, f = a.length; f > e; e++) {
          var g = a[e], h = c.sortData[g], i = d.sortData[g];
          if (h > i || i > h) {
            var j = void 0 !== b[g] ? b[g] : b, k = j ? 1 : -1;
            return (h > i ? 1 : -1) * k
          }
        }
        return 0
      }
    }

    var m = a.create("isotope", {layoutMode: "masonry", isJQueryFiltering: !0, sortAscending: !0});
    m.Item = i, m.LayoutMode = k, m.prototype._create = function () {
      this.itemGUID = 0, this._sorters = {}, this._getSorters(), a.prototype._create.call(this), this.modes = {}, this.filteredItems = this.items, this.sortHistory = ["original-order"];
      for (var b in k.modes) {
        this._initLayoutMode(b)
      }
    }, m.prototype.reloadItems = function () {
      this.itemGUID = 0, a.prototype.reloadItems.call(this)
    }, m.prototype._itemize = function () {
      for (var b = a.prototype._itemize.apply(this, arguments), c = 0, d = b.length; d > c; c++) {
        var e = b[c];
        e.id = this.itemGUID++
      }
      return this._updateItemsSortData(b), b
    }, m.prototype._initLayoutMode = function (a) {
      var c = k.modes[a], d = this.options[a] || {};
      this.options[a] = c.options ? b(c.options, d) : d, this.modes[a] = new c(this)
    }, m.prototype.layout = function () {
      return !this._isLayoutInited && this.options.isInitLayout ? void this.arrange() : void this._layout()
    }, m.prototype._layout = function () {
      var a = this._getIsInstant();
      this._resetLayout(), this._manageStamps(), this.layoutItems(this.filteredItems, a), this._isLayoutInited = !0
    }, m.prototype.arrange = function (a) {
      this.option(a), this._getIsInstant(), this.filteredItems = this._filter(this.items), this._sort(), this._layout()
    }, m.prototype._init = m.prototype.arrange, m.prototype._getIsInstant = function () {
      var a = void 0 !== this.options.isLayoutInstant ? this.options.isLayoutInstant : !this._isLayoutInited;
      return this._isInstant = a, a
    }, m.prototype._filter = function (a) {
      function b() {
        l.reveal(e), l.hide(f)
      }

      var c = this.options.filter;
      c = c || "*";
      for (var d = [], e = [], f = [], g = this._getFilterTest(c), h = 0, i = a.length; i > h; h++) {
        var j = a[h];
        if (!j.isIgnored) {
          var k = g(j);
          k && d.push(j), k && j.isHidden ? e.push(j) : k || j.isHidden || f.push(j)
        }
      }
      var l = this;
      return this._isInstant ? this._noTransition(b) : b(), d
    }, m.prototype._getFilterTest = function (a) {
      return g && this.options.isJQueryFiltering ? function (b) {
        return g(b.element).is(a)
      } : "function" == typeof a ? function (b) {
        return a(b.element)
      } : function (b) {
        return f(b.element, a)
      }
    }, m.prototype.updateSortData = function (a) {
      this._getSorters(), a = d(a);
      var b = this.getItems(a);
      b = b.length ? b : this.items, this._updateItemsSortData(b)
    }, m.prototype._getSorters = function () {
      var a = this.options.getSortData;
      for (var b in a) {
        var c = a[b];
        this._sorters[b] = n(c)
      }
    }, m.prototype._updateItemsSortData = function (a) {
      for (var b = 0, c = a.length; c > b; b++) {
        var d = a[b];
        d.updateSortData()
      }
    };
    var n = function () {
      function a(a) {
        if ("string" != typeof a) {
          return a
        }
        var c = h(a).split(" "), d = c[0], e = d.match(/^\[(.+)\]$/), f = e && e[1], g = b(f, d),
            i = m.sortDataParsers[c[1]];
        return a = i ? function (a) {
          return a && i(g(a))
        } : function (a) {
          return a && g(a)
        }
      }

      function b(a, b) {
        var c;
        return c = a ? function (b) {
          return b.getAttribute(a)
        } : function (a) {
          var c = a.querySelector(b);
          return c && j(c)
        }
      }

      return a
    }();
    m.sortDataParsers = {
      parseInt: function (a) {
        return parseInt(a, 10)
      }, parseFloat: function (a) {
        return parseFloat(a)
      }
    }, m.prototype._sort = function () {
      var a = this.options.sortBy;
      if (a) {
        var b = [].concat.apply(a, this.sortHistory), c = l(b, this.options.sortAscending);
        this.filteredItems.sort(c), a !== this.sortHistory[0] && this.sortHistory.unshift(a)
      }
    }, m.prototype._mode = function () {
      var a = this.options.layoutMode, b = this.modes[a];
      if (!b) {
        throw Error("No layout mode: " + a)
      }
      return b.options = this.options[a], b
    }, m.prototype._resetLayout = function () {
      a.prototype._resetLayout.call(this), this._mode()._resetLayout()
    }, m.prototype._getItemLayoutPosition = function (a) {
      return this._mode()._getItemLayoutPosition(a)
    }, m.prototype._manageStamp = function (a) {
      this._mode()._manageStamp(a)
    }, m.prototype._getContainerSize = function () {
      return this._mode()._getContainerSize()
    }, m.prototype.needsResizeLayout = function () {
      return this._mode().needsResizeLayout()
    }, m.prototype.appended = function (a) {
      var b = this.addItems(a);
      if (b.length) {
        var c = this._filterRevealAdded(b);
        this.filteredItems = this.filteredItems.concat(c)
      }
    }, m.prototype.prepended = function (a) {
      var b = this._itemize(a);
      if (b.length) {
        var c = this.items.slice(0);
        this.items = b.concat(c), this._resetLayout(), this._manageStamps();
        var d = this._filterRevealAdded(b);
        this.layoutItems(c), this.filteredItems = d.concat(this.filteredItems)
      }
    }, m.prototype._filterRevealAdded = function (a) {
      var b = this._noTransition(function () {
        return this._filter(a)
      });
      return this.layoutItems(b, !0), this.reveal(b), a
    }, m.prototype.insert = function (a) {
      var b = this.addItems(a);
      if (b.length) {
        var c, d, e = b.length;
        for (c = 0; e > c; c++) {
          d = b[c], this.element.appendChild(d.element)
        }
        var f = this._filter(b);
        for (this._noTransition(function () {
          this.hide(f)
        }), c = 0; e > c; c++) {
          b[c].isLayoutInstant = !0
        }
        for (this.arrange(), c = 0; e > c; c++) {
          delete b[c].isLayoutInstant
        }
        this.reveal(f)
      }
    };
    var o = m.prototype.remove;
    return m.prototype.remove = function (a) {
      a = d(a);
      var b = this.getItems(a);
      if (o.call(this, a), b && b.length) {
        for (var c = 0, f = b.length; f > c; c++) {
          var g = b[c];
          e(g, this.filteredItems)
        }
      }
    }, m.prototype.shuffle = function () {
      for (var a = 0, b = this.items.length; b > a; a++) {
        var c = this.items[a];
        c.sortData.random = Math.random()
      }
      this.options.sortBy = "random", this._sort(), this._layout()
    }, m.prototype._noTransition = function (a) {
      var b = this.options.transitionDuration;
      this.options.transitionDuration = 0;
      var c = a.call(this);
      return this.options.transitionDuration = b, c
    }, m.prototype.getFilteredItemElements = function () {
      for (var a = [], b = 0, c = this.filteredItems.length; c > b; b++) {
        a.push(this.filteredItems[b].element)
      }
      return a
    }, m
  }

  var g = a.jQuery, h = String.prototype.trim ? function (a) {
    return a.trim()
  } : function (a) {
    return a.replace(/^\s+|\s+$/g, "")
  }, i = document.documentElement, j = i.textContent ? function (a) {
    return a.textContent
  } : function (a) {
    return a.innerText
  }, k = Object.prototype.toString, l = Array.prototype.indexOf ? function (a, b) {
    return a.indexOf(b)
  } : function (a, b) {
    for (var c = 0, d = a.length; d > c; c++) {
      if (a[c] === b) {
        return c
      }
    }
    return -1
  };
  "function" == typeof define && define.amd ? define(["outlayer/outlayer", "get-size/get-size", "matches-selector/matches-selector", "isotope/js/item", "isotope/js/layout-mode", "isotope/js/layout-modes/masonry", "isotope/js/layout-modes/fit-rows", "isotope/js/layout-modes/vertical"], f) : a.Isotope = f(a.Outlayer, a.getSize, a.matchesSelector, a.Isotope.Item, a.Isotope.LayoutMode)
}(window), function () {
  var a = [].indexOf || function (a) {
        for (var b = 0, c = this.length; c > b; b++) {
          if (b in this && this[b] === a) {
            return b
          }
        }
        return -1
      }, b = [].slice;
  !function (a, b) {
    return "function" == typeof define && define.amd ? define("waypoints", ["jquery"], function (c) {
      return b(c, a)
    }) : b(a.jQuery, a)
  }(window, function (c, d) {
    var e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t;
    return e = c(d), l = a.call(d, "ontouchstart") >= 0, h = {
      horizontal: {},
      vertical: {}
    }, i = 1, k = {}, j = "waypoints-context-id", o = "resize.waypoints", p = "scroll.waypoints", q = 1, r = "waypoints-waypoint-ids", s = "waypoint", t = "waypoints", f = function () {
      function a(a) {
        var b = this;
        this.$element = a, this.element = a[0], this.didResize = !1, this.didScroll = !1, this.id = "context" + i++, this.oldScroll = {
          x: a.scrollLeft(),
          y: a.scrollTop()
        }, this.waypoints = {
          horizontal: {},
          vertical: {}
        }, this.element[j] = this.id, k[this.id] = this, a.bind(p, function () {
          var a;
          return b.didScroll || l ? void 0 : (b.didScroll = !0, a = function () {
            return b.doScroll(), b.didScroll = !1
          }, d.setTimeout(a, c[t].settings.scrollThrottle))
        }), a.bind(o, function () {
          var a;
          return b.didResize ? void 0 : (b.didResize = !0, a = function () {
            return c[t]("refresh"), b.didResize = !1
          }, d.setTimeout(a, c[t].settings.resizeThrottle))
        })
      }

      return a.prototype.doScroll = function () {
        var a, b = this;
        return a = {
          horizontal: {
            newScroll: this.$element.scrollLeft(),
            oldScroll: this.oldScroll.x,
            forward: "right",
            backward: "left"
          },
          vertical: {newScroll: this.$element.scrollTop(), oldScroll: this.oldScroll.y, forward: "down", backward: "up"}
        }, !l || a.vertical.oldScroll && a.vertical.newScroll || c[t]("refresh"), c.each(a, function (a, d) {
          var e, f, g;
          return g = [], f = d.newScroll > d.oldScroll, e = f ? d.forward : d.backward, c.each(b.waypoints[a], function (a, b) {
            var c, e;
            return d.oldScroll < (c = b.offset) && c <= d.newScroll ? g.push(b) : d.newScroll < (e = b.offset) && e <= d.oldScroll ? g.push(b) : void 0
          }), g.sort(function (a, b) {
            return a.offset - b.offset
          }), f || g.reverse(), c.each(g, function (a, b) {
            return b.options.continuous || a === g.length - 1 ? b.trigger([e]) : void 0
          })
        }), this.oldScroll = {x: a.horizontal.newScroll, y: a.vertical.newScroll}
      }, a.prototype.refresh = function () {
        var a, b, d, e = this;
        return d = c.isWindow(this.element), b = this.$element.offset(), this.doScroll(), a = {
          horizontal: {
            contextOffset: d ? 0 : b.left,
            contextScroll: d ? 0 : this.oldScroll.x,
            contextDimension: this.$element.width(),
            oldScroll: this.oldScroll.x,
            forward: "right",
            backward: "left",
            offsetProp: "left"
          },
          vertical: {
            contextOffset: d ? 0 : b.top,
            contextScroll: d ? 0 : this.oldScroll.y,
            contextDimension: d ? c[t]("viewportHeight") : this.$element.height(),
            oldScroll: this.oldScroll.y,
            forward: "down",
            backward: "up",
            offsetProp: "top"
          }
        }, c.each(a, function (a, b) {
          return c.each(e.waypoints[a], function (a, d) {
            var e, f, g, h, i;
            return e = d.options.offset, g = d.offset, f = c.isWindow(d.element) ? 0 : d.$element.offset()[b.offsetProp], c.isFunction(e) ? e = e.apply(d.element) : "string" == typeof e && (e = parseFloat(e), d.options.offset.indexOf("%") > -1 && (e = Math.ceil(b.contextDimension * e / 100))), d.offset = f - b.contextOffset + b.contextScroll - e, d.options.onlyOnScroll && null != g || !d.enabled ? void 0 : null !== g && g < (h = b.oldScroll) && h <= d.offset ? d.trigger([b.backward]) : null !== g && g > (i = b.oldScroll) && i >= d.offset ? d.trigger([b.forward]) : null === g && b.oldScroll >= d.offset ? d.trigger([b.forward]) : void 0
          })
        })
      }, a.prototype.checkEmpty = function () {
        return c.isEmptyObject(this.waypoints.horizontal) && c.isEmptyObject(this.waypoints.vertical) ? (this.$element.unbind([o, p].join(" ")), delete k[this.id]) : void 0
      }, a
    }(), g = function () {
      function a(a, b, d) {
        var e, f;
        "bottom-in-view" === d.offset && (d.offset = function () {
          var a;
          return a = c[t]("viewportHeight"), c.isWindow(b.element) || (a = b.$element.height()), a - c(this).outerHeight()
        }), this.$element = a, this.element = a[0], this.axis = d.horizontal ? "horizontal" : "vertical", this.callback = d.handler, this.context = b, this.enabled = d.enabled, this.id = "waypoints" + q++, this.offset = null, this.options = d, b.waypoints[this.axis][this.id] = this, h[this.axis][this.id] = this, e = null != (f = this.element[r]) ? f : [], e.push(this.id), this.element[r] = e
      }

      return a.prototype.trigger = function (a) {
        return this.enabled ? (null != this.callback && this.callback.apply(this.element, a), this.options.triggerOnce ? this.destroy() : void 0) : void 0
      }, a.prototype.disable = function () {
        return this.enabled = !1
      }, a.prototype.enable = function () {
        return this.context.refresh(), this.enabled = !0
      }, a.prototype.destroy = function () {
        return delete h[this.axis][this.id], delete this.context.waypoints[this.axis][this.id], this.context.checkEmpty()
      }, a.getWaypointsByElement = function (a) {
        var b, d;
        return (d = a[r]) ? (b = c.extend({}, h.horizontal, h.vertical), c.map(d, function (a) {
          return b[a]
        })) : []
      }, a
    }(), n = {
      init: function (a, b) {
        var d;
        return b = c.extend({}, c.fn[s].defaults, b), null == (d = b.handler) && (b.handler = a), this.each(function () {
          var a, d, e, h;
          return a = c(this), e = null != (h = b.context) ? h : c.fn[s].defaults.context, c.isWindow(e) || (e = a.closest(e)), e = c(e), d = k[e[0][j]], d || (d = new f(e)), new g(a, d, b)
        }), c[t]("refresh"), this
      }, disable: function () {
        return n._invoke.call(this, "disable")
      }, enable: function () {
        return n._invoke.call(this, "enable")
      }, destroy: function () {
        return n._invoke.call(this, "destroy")
      }, prev: function (a, b) {
        return n._traverse.call(this, a, b, function (a, b, c) {
          return b > 0 ? a.push(c[b - 1]) : void 0
        })
      }, next: function (a, b) {
        return n._traverse.call(this, a, b, function (a, b, c) {
          return b < c.length - 1 ? a.push(c[b + 1]) : void 0
        })
      }, _traverse: function (a, b, e) {
        var f, g;
        return null == a && (a = "vertical"), null == b && (b = d), g = m.aggregate(b), f = [], this.each(function () {
          var b;
          return b = c.inArray(this, g[a]), e(f, b, g[a])
        }), this.pushStack(f)
      }, _invoke: function (a) {
        return this.each(function () {
          var b;
          return b = g.getWaypointsByElement(this), c.each(b, function (b, c) {
            return c[a](), !0
          })
        }), this
      }
    }, c.fn[s] = function () {
      var a, d;
      return d = arguments[0], a = 2 <= arguments.length ? b.call(arguments, 1) : [], n[d] ? n[d].apply(this, a) : c.isFunction(d) ? n.init.apply(this, arguments) : c.isPlainObject(d) ? n.init.apply(this, [null, d]) : c.error(d ? "The " + d + " method does not exist in jQuery Waypoints." : "jQuery Waypoints needs a callback function or handler option.")
    }, c.fn[s].defaults = {
      context: d,
      continuous: !0,
      enabled: !0,
      horizontal: !1,
      offset: 0,
      triggerOnce: !1
    }, m = {
      refresh: function () {
        return c.each(k, function (a, b) {
          return b.refresh()
        })
      }, viewportHeight: function () {
        var a;
        return null != (a = d.innerHeight) ? a : e.height()
      }, aggregate: function (a) {
        var b, d, e;
        return b = h, a && (b = null != (e = k[c(a)[0][j]]) ? e.waypoints : void 0), b ? (d = {
          horizontal: [],
          vertical: []
        }, c.each(d, function (a, e) {
          return c.each(b[a], function (a, b) {
            return e.push(b)
          }), e.sort(function (a, b) {
            return a.offset - b.offset
          }), d[a] = c.map(e, function (a) {
            return a.element
          }), d[a] = c.unique(d[a])
        }), d) : []
      }, above: function (a) {
        return null == a && (a = d), m._filter(a, "vertical", function (a, b) {
          return b.offset <= a.oldScroll.y
        })
      }, below: function (a) {
        return null == a && (a = d), m._filter(a, "vertical", function (a, b) {
          return b.offset > a.oldScroll.y
        })
      }, left: function (a) {
        return null == a && (a = d), m._filter(a, "horizontal", function (a, b) {
          return b.offset <= a.oldScroll.x
        })
      }, right: function (a) {
        return null == a && (a = d), m._filter(a, "horizontal", function (a, b) {
          return b.offset > a.oldScroll.x
        })
      }, enable: function () {
        return m._invoke("enable")
      }, disable: function () {
        return m._invoke("disable")
      }, destroy: function () {
        return m._invoke("destroy")
      }, extendFn: function (a, b) {
        return n[a] = b
      }, _invoke: function (a) {
        var b;
        return b = c.extend({}, h.vertical, h.horizontal), c.each(b, function (b, c) {
          return c[a](), !0
        })
      }, _filter: function (a, b, d) {
        var e, f;
        return (e = k[c(a)[0][j]]) ? (f = [], c.each(e.waypoints[b], function (a, b) {
          return d(e, b) ? f.push(b) : void 0
        }), f.sort(function (a, b) {
          return a.offset - b.offset
        }), c.map(f, function (a) {
          return a.element
        })) : []
      }
    }, c[t] = function () {
      var a, c;
      return c = arguments[0], a = 2 <= arguments.length ? b.call(arguments, 1) : [], m[c] ? m[c].apply(null, a) : m.aggregate.call(null, c)
    }, c[t].settings = {resizeThrottle: 100, scrollThrottle: 30}, e.on("load.waypoints", function () {
      return c[t]("refresh")
    })
  })
}.call(this), function () {
  !function (a, b) {
    return "function" == typeof define && define.amd ? define(["jquery", "waypoints"], b) : b(a.jQuery)
  }(window, function (a) {
    var b, c;
    return b = {
      wrapper: '<div class="sticky-wrapper" />',
      stuckClass: "stuck",
      direction: "down right"
    }, c = function (a, b) {
      var c;
      return a.wrap(b.wrapper), c = a.parent(), c.data("isWaypointStickyWrapper", !0)
    }, a.waypoints("extendFn", "sticky", function (d) {
      var e, f, g;
      return f = a.extend({}, a.fn.waypoint.defaults, b, d), e = c(this, f), g = f.handler, f.handler = function (b) {
        var c, d;
        return c = a(this).children(":first"), d = -1 !== f.direction.indexOf(b), c.toggleClass(f.stuckClass, d), e.height(d ? c.outerHeight() : ""), null != g ? g.call(this, b) : void 0
      }, e.waypoint(f), this.data("stuckClass", f.stuckClass)
    }), a.waypoints("extendFn", "unsticky", function () {
      var a;
      return a = this.parent(), a.data("isWaypointStickyWrapper") ? (a.waypoint("destroy"), this.unwrap(), this.removeClass(this.data("stuckClass"))) : this
    })
  })
}.call(this);
var framerate = 150, animtime = 800, stepsize = 80, pulseAlgorithm = !0, pulseScale = 8, pulseNormalize = 1,
    acceleration = !0, accelDelta = 10, accelMax = 1, keyboardsupport = !0, disableKeyboard = !1, arrowscroll = 50,
    exclude = "", disabled = !1, frame = !1, direction = {x: 0, y: 0}, initdone = !1, fixedback = !0,
    root = document.documentElement, activeElement,
    key = {left: 37, up: 38, right: 39, down: 40, spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36}, que = [],
    pending = !1, lastScroll = +new Date, cache = {};
setInterval(function () {
  cache = {}
}, 10000);
var uniqueID = function () {
  var a = 0;
  return function (b) {
    return b.uniqueID || (b.uniqueID = a++)
  }
}(), requestFrame = function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || function (a, b, c) {
        window.setTimeout(a, c || 1000 / 60)
      }
}();
addEvent("mousedown", mousedown), addEvent("mousewheel", wheel), addEvent("load", init), !function (a, b, c, d) {
  function e(b, c) {
    this.element = b, this.options = a.extend({}, g, c), this._defaults = g, this._name = f, this.init()
  }

  var f = "stellar", g = {
        scrollProperty: "scroll",
        positionProperty: "position",
        horizontalScrolling: !0,
        verticalScrolling: !0,
        horizontalOffset: 0,
        verticalOffset: 0,
        responsive: !1,
        parallaxBackgrounds: !0,
        parallaxElements: !0,
        hideDistantElements: !0,
        hideElement: function (a) {
          a.hide()
        },
        showElement: function (a) {
          a.show()
        }
      }, h = {
        scroll: {
          getLeft: function (a) {
            return a.scrollLeft()
          }, setLeft: function (a, b) {
            a.scrollLeft(b)
          }, getTop: function (a) {
            return a.scrollTop()
          }, setTop: function (a, b) {
            a.scrollTop(b)
          }
        }, position: {
          getLeft: function (a) {
            return -1 * parseInt(a.css("left"), 10)
          }, getTop: function (a) {
            return -1 * parseInt(a.css("top"), 10)
          }
        }, margin: {
          getLeft: function (a) {
            return -1 * parseInt(a.css("margin-left"), 10)
          }, getTop: function (a) {
            return -1 * parseInt(a.css("margin-top"), 10)
          }
        }, transform: {
          getLeft: function (a) {
            var b = getComputedStyle(a[0])[k];
            return "none" !== b ? -1 * parseInt(b.match(/(-?[0-9]+)/g)[4], 10) : 0
          }, getTop: function (a) {
            var b = getComputedStyle(a[0])[k];
            return "none" !== b ? -1 * parseInt(b.match(/(-?[0-9]+)/g)[5], 10) : 0
          }
        }
      }, i = {
        position: {
          setLeft: function (a, b) {
            a.css("left", b)
          }, setTop: function (a, b) {
            a.css("top", b)
          }
        }, transform: {
          setPosition: function (a, b, c, d, e) {
            a[0].style[k] = "translate3d(" + (b - c) + "px, " + (d - e) + "px, 0)"
          }
        }
      }, j = function () {
        var b, c = /^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/, d = a("script")[0].style, e = "";
        for (b in d) {
          if (c.test(b)) {
            e = b.match(c)[0];
            break
          }
        }
        return "WebkitOpacity" in d && (e = "Webkit"), "KhtmlOpacity" in d && (e = "Khtml"), function (a) {
          return e + (e.length > 0 ? a.charAt(0).toUpperCase() + a.slice(1) : a)
        }
      }(), k = j("transform"), l = a("<div />", {style: "background:#fff"}).css("background-position-x") !== d,
      m = l ? function (a, b, c) {
        a.css({"background-position-x": b, "background-position-y": c})
      } : function (a, b, c) {
        a.css("background-position", b + " " + c)
      }, n = l ? function (a) {
        return [a.css("background-position-x"), a.css("background-position-y")]
      } : function (a) {
        return a.css("background-position").split(" ")
      },
      o = b.requestAnimationFrame || b.webkitRequestAnimationFrame || b.mozRequestAnimationFrame || b.oRequestAnimationFrame || b.msRequestAnimationFrame || function (a) {
            setTimeout(a, 1000 / 60)
          };
  e.prototype = {
    init: function () {
      this.options.name = f + "_" + Math.floor(1000000000 * Math.random()), this._defineElements(), this._defineGetters(), this._defineSetters(), this._handleWindowLoadAndResize(), this._detectViewport(), this.refresh({firstLoad: !0}), "scroll" === this.options.scrollProperty ? this._handleScrollEvent() : this._startAnimationLoop()
    }, _defineElements: function () {
      this.element === c.body && (this.element = b), this.$scrollElement = a(this.element), this.$element = this.element === b ? a("body") : this.$scrollElement, this.$viewportElement = this.options.viewportElement !== d ? a(this.options.viewportElement) : this.$scrollElement[0] === b || "scroll" === this.options.scrollProperty ? this.$scrollElement : this.$scrollElement.parent()
    }, _defineGetters: function () {
      var a = this, b = h[a.options.scrollProperty];
      this._getScrollLeft = function () {
        return b.getLeft(a.$scrollElement)
      }, this._getScrollTop = function () {
        return b.getTop(a.$scrollElement)
      }
    }, _defineSetters: function () {
      var b = this, c = h[b.options.scrollProperty], d = i[b.options.positionProperty], e = c.setLeft, f = c.setTop;
      this._setScrollLeft = "function" == typeof e ? function (a) {
        e(b.$scrollElement, a)
      } : a.noop, this._setScrollTop = "function" == typeof f ? function (a) {
        f(b.$scrollElement, a)
      } : a.noop, this._setPosition = d.setPosition || function (a, c, e, f, g) {
            b.options.horizontalScrolling && d.setLeft(a, c, e), b.options.verticalScrolling && d.setTop(a, f, g)
          }
    }, _handleWindowLoadAndResize: function () {
      var c = this, d = a(b);
      c.options.responsive && d.bind("load." + this.name, function () {
        c.refresh()
      }), d.bind("resize." + this.name, function () {
        c._detectViewport(), c.options.responsive && c.refresh()
      })
    }, refresh: function (c) {
      var d = this, e = d._getScrollLeft(), f = d._getScrollTop();
      c && c.firstLoad || this._reset(), this._setScrollLeft(0), this._setScrollTop(0), this._setOffsets(), this._findParticles(), this._findBackgrounds(), c && c.firstLoad && /WebKit/.test(navigator.userAgent) && a(b).load(function () {
        var a = d._getScrollLeft(), b = d._getScrollTop();
        d._setScrollLeft(a + 1), d._setScrollTop(b + 1), d._setScrollLeft(a), d._setScrollTop(b)
      }), this._setScrollLeft(e), this._setScrollTop(f)
    }, _detectViewport: function () {
      var a = this.$viewportElement.offset(), b = null !== a && a !== d;
      this.viewportWidth = this.$viewportElement.width(), this.viewportHeight = this.$viewportElement.height(), this.viewportOffsetTop = b ? a.top : 0, this.viewportOffsetLeft = b ? a.left : 0
    }, _findParticles: function () {
      var b = this;
      if (this._getScrollLeft(), this._getScrollTop(), this.particles !== d) {
        for (var c = this.particles.length - 1; c >= 0; c--) {
          this.particles[c].$element.data("stellar-elementIsActive", d)
        }
      }
      this.particles = [], this.options.parallaxElements && this.$element.find("[data-stellar-ratio]").each(function () {
        var c, e, f, g, h, i, j, k, l, m = a(this), n = 0, o = 0, p = 0, q = 0;
        if (m.data("stellar-elementIsActive")) {
          if (m.data("stellar-elementIsActive") !== this) {
            return
          }
        } else {
          m.data("stellar-elementIsActive", this)
        }
        b.options.showElement(m), m.data("stellar-startingLeft") ? (m.css("left", m.data("stellar-startingLeft")), m.css("top", m.data("stellar-startingTop"))) : (m.data("stellar-startingLeft", m.css("left")), m.data("stellar-startingTop", m.css("top"))), f = m.position().left, g = m.position().top, h = "auto" === m.css("margin-left") ? 0 : parseInt(m.css("margin-left"), 10), i = "auto" === m.css("margin-top") ? 0 : parseInt(m.css("margin-top"), 10), k = m.offset().left - h, l = m.offset().top - i, m.parents().each(function () {
          var b = a(this);
          return b.data("stellar-offset-parent") === !0 ? (n = p, o = q, j = b, !1) : (p += b.position().left, void(q += b.position().top))
        }), c = m.data("stellar-horizontal-offset") !== d ? m.data("stellar-horizontal-offset") : j !== d && j.data("stellar-horizontal-offset") !== d ? j.data("stellar-horizontal-offset") : b.horizontalOffset, e = m.data("stellar-vertical-offset") !== d ? m.data("stellar-vertical-offset") : j !== d && j.data("stellar-vertical-offset") !== d ? j.data("stellar-vertical-offset") : b.verticalOffset, b.particles.push({
          $element: m,
          $offsetParent: j,
          isFixed: "fixed" === m.css("position"),
          horizontalOffset: c,
          verticalOffset: e,
          startingPositionLeft: f,
          startingPositionTop: g,
          startingOffsetLeft: k,
          startingOffsetTop: l,
          parentOffsetLeft: n,
          parentOffsetTop: o,
          stellarRatio: m.data("stellar-ratio") !== d ? m.data("stellar-ratio") : 1,
          width: m.outerWidth(!0),
          height: m.outerHeight(!0),
          isHidden: !1
        })
      })
    }, _findBackgrounds: function () {
      var b, c = this, e = this._getScrollLeft(), f = this._getScrollTop();
      this.backgrounds = [], this.options.parallaxBackgrounds && (b = this.$element.find("[data-stellar-background-ratio]"), this.$element.data("stellar-background-ratio") && (b = b.add(this.$element)), b.each(function () {
        var b, g, h, i, j, k, l, o = a(this), p = n(o), q = 0, r = 0, s = 0, t = 0;
        if (o.data("stellar-backgroundIsActive")) {
          if (o.data("stellar-backgroundIsActive") !== this) {
            return
          }
        } else {
          o.data("stellar-backgroundIsActive", this)
        }
        o.data("stellar-backgroundStartingLeft") ? m(o, o.data("stellar-backgroundStartingLeft"), o.data("stellar-backgroundStartingTop")) : (o.data("stellar-backgroundStartingLeft", p[0]), o.data("stellar-backgroundStartingTop", p[1])), h = "auto" === o.css("margin-left") ? 0 : parseInt(o.css("margin-left"), 10), i = "auto" === o.css("margin-top") ? 0 : parseInt(o.css("margin-top"), 10), j = o.offset().left - h - e, k = o.offset().top - i - f, o.parents().each(function () {
          var b = a(this);
          return b.data("stellar-offset-parent") === !0 ? (q = s, r = t, l = b, !1) : (s += b.position().left, void(t += b.position().top))
        }), b = o.data("stellar-horizontal-offset") !== d ? o.data("stellar-horizontal-offset") : l !== d && l.data("stellar-horizontal-offset") !== d ? l.data("stellar-horizontal-offset") : c.horizontalOffset, g = o.data("stellar-vertical-offset") !== d ? o.data("stellar-vertical-offset") : l !== d && l.data("stellar-vertical-offset") !== d ? l.data("stellar-vertical-offset") : c.verticalOffset, c.backgrounds.push({
          $element: o,
          $offsetParent: l,
          isFixed: "fixed" === o.css("background-attachment"),
          horizontalOffset: b,
          verticalOffset: g,
          startingValueLeft: p[0],
          startingValueTop: p[1],
          startingBackgroundPositionLeft: isNaN(parseInt(p[0], 10)) ? 0 : parseInt(p[0], 10),
          startingBackgroundPositionTop: isNaN(parseInt(p[1], 10)) ? 0 : parseInt(p[1], 10),
          startingPositionLeft: o.position().left,
          startingPositionTop: o.position().top,
          startingOffsetLeft: j,
          startingOffsetTop: k,
          parentOffsetLeft: q,
          parentOffsetTop: r,
          stellarRatio: o.data("stellar-background-ratio") === d ? 1 : o.data("stellar-background-ratio")
        })
      }))
    }, _reset: function () {
      var a, b, c, d, e;
      for (e = this.particles.length - 1; e >= 0; e--) {
        a = this.particles[e], b = a.$element.data("stellar-startingLeft"), c = a.$element.data("stellar-startingTop"), this._setPosition(a.$element, b, b, c, c), this.options.showElement(a.$element), a.$element.data("stellar-startingLeft", null).data("stellar-elementIsActive", null).data("stellar-backgroundIsActive", null)
      }
      for (e = this.backgrounds.length - 1; e >= 0; e--) {
        d = this.backgrounds[e], d.$element.data("stellar-backgroundStartingLeft", null).data("stellar-backgroundStartingTop", null), m(d.$element, d.startingValueLeft, d.startingValueTop)
      }
    }, destroy: function () {
      this._reset(), this.$scrollElement.unbind("resize." + this.name).unbind("scroll." + this.name), this._animationLoop = a.noop, a(b).unbind("load." + this.name).unbind("resize." + this.name)
    }, _setOffsets: function () {
      var c = this, d = a(b);
      d.unbind("resize.horizontal-" + this.name).unbind("resize.vertical-" + this.name), "function" == typeof this.options.horizontalOffset ? (this.horizontalOffset = this.options.horizontalOffset(), d.bind("resize.horizontal-" + this.name, function () {
        c.horizontalOffset = c.options.horizontalOffset()
      })) : this.horizontalOffset = this.options.horizontalOffset, "function" == typeof this.options.verticalOffset ? (this.verticalOffset = this.options.verticalOffset(), d.bind("resize.vertical-" + this.name, function () {
        c.verticalOffset = c.options.verticalOffset()
      })) : this.verticalOffset = this.options.verticalOffset
    }, _repositionElements: function () {
      var a, b, c, d, e, f, g, h, i, j, k = this._getScrollLeft(), l = this._getScrollTop(), n = !0, o = !0;
      if (this.currentScrollLeft !== k || this.currentScrollTop !== l || this.currentWidth !== this.viewportWidth || this.currentHeight !== this.viewportHeight) {
        for (this.currentScrollLeft = k, this.currentScrollTop = l, this.currentWidth = this.viewportWidth, this.currentHeight = this.viewportHeight, j = this.particles.length - 1; j >= 0; j--) {
          a = this.particles[j], b = a.isFixed ? 1 : 0, this.options.horizontalScrolling ? (f = (k + a.horizontalOffset + this.viewportOffsetLeft + a.startingPositionLeft - a.startingOffsetLeft + a.parentOffsetLeft) * -(a.stellarRatio + b - 1) + a.startingPositionLeft, h = f - a.startingPositionLeft + a.startingOffsetLeft) : (f = a.startingPositionLeft, h = a.startingOffsetLeft), this.options.verticalScrolling ? (g = (l + a.verticalOffset + this.viewportOffsetTop + a.startingPositionTop - a.startingOffsetTop + a.parentOffsetTop) * -(a.stellarRatio + b - 1) + a.startingPositionTop, i = g - a.startingPositionTop + a.startingOffsetTop) : (g = a.startingPositionTop, i = a.startingOffsetTop), this.options.hideDistantElements && (o = !this.options.horizontalScrolling || h + a.width > (a.isFixed ? 0 : k) && h < (a.isFixed ? 0 : k) + this.viewportWidth + this.viewportOffsetLeft, n = !this.options.verticalScrolling || i + a.height > (a.isFixed ? 0 : l) && i < (a.isFixed ? 0 : l) + this.viewportHeight + this.viewportOffsetTop), o && n ? (a.isHidden && (this.options.showElement(a.$element), a.isHidden = !1), this._setPosition(a.$element, f, a.startingPositionLeft, g, a.startingPositionTop)) : a.isHidden || (this.options.hideElement(a.$element), a.isHidden = !0)
        }
        for (j = this.backgrounds.length - 1; j >= 0; j--) {
          c = this.backgrounds[j], b = c.isFixed ? 0 : 1, d = this.options.horizontalScrolling ? (k + c.horizontalOffset - this.viewportOffsetLeft - c.startingOffsetLeft + c.parentOffsetLeft - c.startingBackgroundPositionLeft) * (b - c.stellarRatio) + "px" : c.startingValueLeft, e = this.options.verticalScrolling ? (l + c.verticalOffset - this.viewportOffsetTop - c.startingOffsetTop + c.parentOffsetTop - c.startingBackgroundPositionTop) * (b - c.stellarRatio) + "px" : c.startingValueTop, m(c.$element, d, e)
        }
      }
    }, _handleScrollEvent: function () {
      var a = this, b = !1, c = function () {
        a._repositionElements(), b = !1
      }, d = function () {
        b || (o(c), b = !0)
      };
      this.$scrollElement.bind("scroll." + this.name, d), d()
    }, _startAnimationLoop: function () {
      var a = this;
      this._animationLoop = function () {
        o(a._animationLoop), a._repositionElements()
      }, this._animationLoop()
    }
  }, a.fn[f] = function (b) {
    var c = arguments;
    return b === d || "object" == typeof b ? this.each(function () {
      a.data(this, "plugin_" + f) || a.data(this, "plugin_" + f, new e(this, b))
    }) : "string" == typeof b && "_" !== b[0] && "init" !== b ? this.each(function () {
      var d = a.data(this, "plugin_" + f);
      d instanceof e && "function" == typeof d[b] && d[b].apply(d, Array.prototype.slice.call(c, 1)), "destroy" === b && a.data(this, "plugin_" + f, null)
    }) : void 0
  }, a[f] = function () {
    var c = a(b);
    return c.stellar.apply(c, Array.prototype.slice.call(arguments, 0))
  }, a[f].scrollProperty = h, a[f].positionProperty = i, b.Stellar = e
}(jQuery, this, document), "function" != typeof Object.create && (Object.create = function (a) {
  function b() {
  }

  return b.prototype = a, new b
}), function (a, b, c) {
  var d = {
    init: function (b, c) {
      var d = this;
      d.$elem = a(c), d.options = a.extend({}, a.fn.owlCarousel.options, d.$elem.data(), b), d.userOptions = b, d.loadContent()
    }, loadContent: function () {
      function b(a) {
        var b, c = "";
        if ("function" == typeof d.options.jsonSuccess) {
          d.options.jsonSuccess.apply(this, [a])
        } else {
          for (b in a.owl) {
            a.owl.hasOwnProperty(b) && (c += a.owl[b].item)
          }
          d.$elem.html(c)
        }
        d.logIn()
      }

      var c, d = this;
      "function" == typeof d.options.beforeInit && d.options.beforeInit.apply(this, [d.$elem]), "string" == typeof d.options.jsonPath ? (c = d.options.jsonPath, a.getJSON(c, b)) : d.logIn()
    }, logIn: function () {
      var a = this;
      a.$elem.data({
        "owl-originalStyles": a.$elem.attr("style"),
        "owl-originalClasses": a.$elem.attr("class")
      }), a.$elem.css({opacity: 0}), a.orignalItems = a.options.items, a.checkBrowser(), a.wrapperWidth = 0, a.checkVisible = null, a.setVars()
    }, setVars: function () {
      var a = this;
      return 0 === a.$elem.children().length ? !1 : (a.baseClass(), a.eventTypes(), a.$userItems = a.$elem.children(), a.itemsAmount = a.$userItems.length, a.wrapItems(), a.$owlItems = a.$elem.find(".owl-item"), a.$owlWrapper = a.$elem.find(".owl-wrapper"), a.playDirection = "next", a.prevItem = 0, a.prevArr = [0], a.currentItem = 0, a.customEvents(), void a.onStartup())
    }, onStartup: function () {
      var a = this;
      a.updateItems(), a.calculateAll(), a.buildControls(), a.updateControls(), a.response(), a.moveEvents(), a.stopOnHover(), a.owlStatus(), a.options.transitionStyle !== !1 && a.transitionTypes(a.options.transitionStyle), a.options.autoPlay === !0 && (a.options.autoPlay = 5000), a.play(), a.$elem.find(".owl-wrapper").css("display", "block"), a.$elem.is(":visible") ? a.$elem.css("opacity", 1) : a.watchVisibility(), a.onstartup = !1, a.eachMoveUpdate(), "function" == typeof a.options.afterInit && a.options.afterInit.apply(this, [a.$elem])
    }, eachMoveUpdate: function () {
      var a = this;
      a.options.lazyLoad === !0 && a.lazyLoad(), a.options.autoHeight === !0 && a.autoHeight(), a.onVisibleItems(), "function" == typeof a.options.afterAction && a.options.afterAction.apply(this, [a.$elem])
    }, updateVars: function () {
      var a = this;
      "function" == typeof a.options.beforeUpdate && a.options.beforeUpdate.apply(this, [a.$elem]), a.watchVisibility(), a.updateItems(), a.calculateAll(), a.updatePosition(), a.updateControls(), a.eachMoveUpdate(), "function" == typeof a.options.afterUpdate && a.options.afterUpdate.apply(this, [a.$elem])
    }, reload: function () {
      var a = this;
      b.setTimeout(function () {
        a.updateVars()
      }, 0)
    }, watchVisibility: function () {
      var a = this;
      return a.$elem.is(":visible") !== !1 ? !1 : (a.$elem.css({opacity: 0}), b.clearInterval(a.autoPlayInterval), b.clearInterval(a.checkVisible), void(a.checkVisible = b.setInterval(function () {
        a.$elem.is(":visible") && (a.reload(), a.$elem.animate({opacity: 1}, 200), b.clearInterval(a.checkVisible))
      }, 500)))
    }, wrapItems: function () {
      var a = this;
      a.$userItems.wrapAll('<div class="owl-wrapper">').wrap('<div class="owl-item"></div>'), a.$elem.find(".owl-wrapper").wrap('<div class="owl-wrapper-outer">'), a.wrapperOuter = a.$elem.find(".owl-wrapper-outer"), a.$elem.css("display", "block")
    }, baseClass: function () {
      var a = this, b = a.$elem.hasClass(a.options.baseClass), c = a.$elem.hasClass(a.options.theme);
      b || a.$elem.addClass(a.options.baseClass), c || a.$elem.addClass(a.options.theme)
    }, updateItems: function () {
      var b, c, d = this;
      if (d.options.responsive === !1) {
        return !1
      }
      if (d.options.singleItem === !0) {
        return d.options.items = d.orignalItems = 1, d.options.itemsCustom = !1, d.options.itemsDesktop = !1, d.options.itemsDesktopSmall = !1, d.options.itemsTablet = !1, d.options.itemsTabletSmall = !1, d.options.itemsMobile = !1, !1
      }
      if (b = a(d.options.responsiveBaseWidth).width(), b > (d.options.itemsDesktop[0] || d.orignalItems) && (d.options.items = d.orignalItems), d.options.itemsCustom !== !1) {
        for (d.options.itemsCustom.sort(function (a, b) {
          return a[0] - b[0]
        }), c = 0; c < d.options.itemsCustom.length; c += 1) {
          d.options.itemsCustom[c][0] <= b && (d.options.items = d.options.itemsCustom[c][1])
        }
      } else {
        b <= d.options.itemsDesktop[0] && d.options.itemsDesktop !== !1 && (d.options.items = d.options.itemsDesktop[1]), b <= d.options.itemsDesktopSmall[0] && d.options.itemsDesktopSmall !== !1 && (d.options.items = d.options.itemsDesktopSmall[1]), b <= d.options.itemsTablet[0] && d.options.itemsTablet !== !1 && (d.options.items = d.options.itemsTablet[1]), b <= d.options.itemsTabletSmall[0] && d.options.itemsTabletSmall !== !1 && (d.options.items = d.options.itemsTabletSmall[1]), b <= d.options.itemsMobile[0] && d.options.itemsMobile !== !1 && (d.options.items = d.options.itemsMobile[1])
      }
      d.options.items > d.itemsAmount && d.options.itemsScaleUp === !0 && (d.options.items = d.itemsAmount)
    }, response: function () {
      var c, d, e = this;
      return e.options.responsive !== !0 ? !1 : (d = a(b).width(), e.resizer = function () {
        a(b).width() !== d && (e.options.autoPlay !== !1 && b.clearInterval(e.autoPlayInterval), b.clearTimeout(c), c = b.setTimeout(function () {
          d = a(b).width(), e.updateVars()
        }, e.options.responsiveRefreshRate))
      }, void a(b).resize(e.resizer))
    }, updatePosition: function () {
      var a = this;
      a.jumpTo(a.currentItem), a.options.autoPlay !== !1 && a.checkAp()
    }, appendItemsSizes: function () {
      var b = this, c = 0, d = b.itemsAmount - b.options.items;
      b.$owlItems.each(function (e) {
        var f = a(this);
        f.css({width: b.itemWidth}).data("owl-item", Number(e)), (e % b.options.items === 0 || e === d) && (e > d || (c += 1)), f.data("owl-roundPages", c)
      })
    }, appendWrapperSizes: function () {
      var a = this, b = a.$owlItems.length * a.itemWidth;
      a.$owlWrapper.css({width: 2 * b, left: 0}), a.appendItemsSizes()
    }, calculateAll: function () {
      var a = this;
      a.calculateWidth(), a.appendWrapperSizes(), a.loops(), a.max()
    }, calculateWidth: function () {
      var a = this;
      a.itemWidth = Math.round(a.$elem.width() / a.options.items)
    }, max: function () {
      var a = this, b = -1 * (a.itemsAmount * a.itemWidth - a.options.items * a.itemWidth);
      return a.options.items > a.itemsAmount ? (a.maximumItem = 0, b = 0, a.maximumPixels = 0) : (a.maximumItem = a.itemsAmount - a.options.items, a.maximumPixels = b), b
    }, min: function () {
      return 0
    }, loops: function () {
      var b, c, d, e = this, f = 0, g = 0;
      for (e.positionsInArray = [0], e.pagesInArray = [], b = 0; b < e.itemsAmount; b += 1) {
        g += e.itemWidth, e.positionsInArray.push(-g), e.options.scrollPerPage === !0 && (c = a(e.$owlItems[b]), d = c.data("owl-roundPages"), d !== f && (e.pagesInArray[f] = e.positionsInArray[b], f = d))
      }
    }, buildControls: function () {
      var b = this;
      (b.options.navigation === !0 || b.options.pagination === !0) && (b.owlControls = a('<div class="owl-controls"/>').toggleClass("clickable", !b.browser.isTouch).appendTo(b.$elem)), b.options.pagination === !0 && b.buildPagination(), b.options.navigation === !0 && b.buildButtons()
    }, buildButtons: function () {
      var b = this, c = a('<div class="owl-buttons"/>');
      b.owlControls.append(c), b.buttonPrev = a("<div/>", {
        "class": "owl-prev",
        html: b.options.navigationText[0] || ""
      }), b.buttonNext = a("<div/>", {
        "class": "owl-next",
        html: b.options.navigationText[1] || ""
      }), c.append(b.buttonPrev).append(b.buttonNext), c.on("touchstart.owlControls mousedown.owlControls", 'div[class^="owl"]', function (a) {
        a.preventDefault()
      }), c.on("touchend.owlControls mouseup.owlControls", 'div[class^="owl"]', function (c) {
        c.preventDefault(), a(this).hasClass("owl-next") ? b.next() : b.prev()
      })
    }, buildPagination: function () {
      var b = this;
      b.paginationWrapper = a('<div class="owl-pagination"/>'), b.owlControls.append(b.paginationWrapper), b.paginationWrapper.on("touchend.owlControls mouseup.owlControls", ".owl-page", function (c) {
        c.preventDefault(), Number(a(this).data("owl-page")) !== b.currentItem && b.goTo(Number(a(this).data("owl-page")), !0)
      })
    }, updatePagination: function () {
      var b, c, d, e, f, g, h = this;
      if (h.options.pagination === !1) {
        return !1
      }
      for (h.paginationWrapper.html(""), b = 0, c = h.itemsAmount - h.itemsAmount % h.options.items, e = 0; e < h.itemsAmount; e += 1) {
        e % h.options.items === 0 && (b += 1, c === e && (d = h.itemsAmount - h.options.items), f = a("<div/>", {"class": "owl-page"}), g = a("<span></span>", {
          text: h.options.paginationNumbers === !0 ? b : "",
          "class": h.options.paginationNumbers === !0 ? "owl-numbers" : ""
        }), f.append(g), f.data("owl-page", c === e ? d : e), f.data("owl-roundPages", b), h.paginationWrapper.append(f))
      }
      h.checkPagination()
    }, checkPagination: function () {
      var b = this;
      return b.options.pagination === !1 ? !1 : void b.paginationWrapper.find(".owl-page").each(function () {
        a(this).data("owl-roundPages") === a(b.$owlItems[b.currentItem]).data("owl-roundPages") && (b.paginationWrapper.find(".owl-page").removeClass("active"), a(this).addClass("active"))
      })
    }, checkNavigation: function () {
      var a = this;
      return a.options.navigation === !1 ? !1 : void(a.options.rewindNav === !1 && (0 === a.currentItem && 0 === a.maximumItem ? (a.buttonPrev.addClass("disabled"), a.buttonNext.addClass("disabled")) : 0 === a.currentItem && 0 !== a.maximumItem ? (a.buttonPrev.addClass("disabled"), a.buttonNext.removeClass("disabled")) : a.currentItem === a.maximumItem ? (a.buttonPrev.removeClass("disabled"), a.buttonNext.addClass("disabled")) : 0 !== a.currentItem && a.currentItem !== a.maximumItem && (a.buttonPrev.removeClass("disabled"), a.buttonNext.removeClass("disabled"))))
    }, updateControls: function () {
      var a = this;
      a.updatePagination(), a.checkNavigation(), a.owlControls && (a.options.items >= a.itemsAmount ? a.owlControls.hide() : a.owlControls.show())
    }, destroyControls: function () {
      var a = this;
      a.owlControls && a.owlControls.remove()
    }, next: function (a) {
      var b = this;
      if (b.isTransition) {
        return !1
      }
      if (b.currentItem += b.options.scrollPerPage === !0 ? b.options.items : 1, b.currentItem > b.maximumItem + (b.options.scrollPerPage === !0 ? b.options.items - 1 : 0)) {
        if (b.options.rewindNav !== !0) {
          return b.currentItem = b.maximumItem, !1
        }
        b.currentItem = 0, a = "rewind"
      }
      b.goTo(b.currentItem, a)
    }, prev: function (a) {
      var b = this;
      if (b.isTransition) {
        return !1
      }
      if (b.options.scrollPerPage === !0 && b.currentItem > 0 && b.currentItem < b.options.items ? b.currentItem = 0 : b.currentItem -= b.options.scrollPerPage === !0 ? b.options.items : 1, b.currentItem < 0) {
        if (b.options.rewindNav !== !0) {
          return b.currentItem = 0, !1
        }
        b.currentItem = b.maximumItem, a = "rewind"
      }
      b.goTo(b.currentItem, a)
    }, goTo: function (a, c, d) {
      var e, f = this;
      return f.isTransition ? !1 : ("function" == typeof f.options.beforeMove && f.options.beforeMove.apply(this, [f.$elem]), a >= f.maximumItem ? a = f.maximumItem : 0 >= a && (a = 0), f.currentItem = f.owl.currentItem = a, f.options.transitionStyle !== !1 && "drag" !== d && 1 === f.options.items && f.browser.support3d === !0 ? (f.swapSpeed(0), f.browser.support3d === !0 ? f.transition3d(f.positionsInArray[a]) : f.css2slide(f.positionsInArray[a], 1), f.afterGo(), f.singleItemTransition(), !1) : (e = f.positionsInArray[a], f.browser.support3d === !0 ? (f.isCss3Finish = !1, c === !0 ? (f.swapSpeed("paginationSpeed"), b.setTimeout(function () {
        f.isCss3Finish = !0
      }, f.options.paginationSpeed)) : "rewind" === c ? (f.swapSpeed(f.options.rewindSpeed), b.setTimeout(function () {
        f.isCss3Finish = !0
      }, f.options.rewindSpeed)) : (f.swapSpeed("slideSpeed"), b.setTimeout(function () {
        f.isCss3Finish = !0
      }, f.options.slideSpeed)), f.transition3d(e)) : c === !0 ? f.css2slide(e, f.options.paginationSpeed) : "rewind" === c ? f.css2slide(e, f.options.rewindSpeed) : f.css2slide(e, f.options.slideSpeed), void f.afterGo()))
    }, jumpTo: function (a) {
      var b = this;
      "function" == typeof b.options.beforeMove && b.options.beforeMove.apply(this, [b.$elem]), a >= b.maximumItem || -1 === a ? a = b.maximumItem : 0 >= a && (a = 0), b.swapSpeed(0), b.browser.support3d === !0 ? b.transition3d(b.positionsInArray[a]) : b.css2slide(b.positionsInArray[a], 1), b.currentItem = b.owl.currentItem = a, b.afterGo()
    }, afterGo: function () {
      var a = this;
      a.prevArr.push(a.currentItem), a.prevItem = a.owl.prevItem = a.prevArr[a.prevArr.length - 2], a.prevArr.shift(0), a.prevItem !== a.currentItem && (a.checkPagination(), a.checkNavigation(), a.eachMoveUpdate(), a.options.autoPlay !== !1 && a.checkAp()), "function" == typeof a.options.afterMove && a.prevItem !== a.currentItem && a.options.afterMove.apply(this, [a.$elem])
    }, stop: function () {
      var a = this;
      a.apStatus = "stop", b.clearInterval(a.autoPlayInterval)
    }, checkAp: function () {
      var a = this;
      "stop" !== a.apStatus && a.play()
    }, play: function () {
      var a = this;
      return a.apStatus = "play", a.options.autoPlay === !1 ? !1 : (b.clearInterval(a.autoPlayInterval), void(a.autoPlayInterval = b.setInterval(function () {
        a.next(!0)
      }, a.options.autoPlay)))
    }, swapSpeed: function (a) {
      var b = this;
      "slideSpeed" === a ? b.$owlWrapper.css(b.addCssSpeed(b.options.slideSpeed)) : "paginationSpeed" === a ? b.$owlWrapper.css(b.addCssSpeed(b.options.paginationSpeed)) : "string" != typeof a && b.$owlWrapper.css(b.addCssSpeed(a))
    }, addCssSpeed: function (a) {
      return {
        "-webkit-transition": "all " + a + "ms ease",
        "-moz-transition": "all " + a + "ms ease",
        "-o-transition": "all " + a + "ms ease",
        transition: "all " + a + "ms ease"
      }
    }, removeTransition: function () {
      return {"-webkit-transition": "", "-moz-transition": "", "-o-transition": "", transition: ""}
    }, doTranslate: function (a) {
      return {
        "-webkit-transform": "translate3d(" + a + "px, 0px, 0px)",
        "-moz-transform": "translate3d(" + a + "px, 0px, 0px)",
        "-o-transform": "translate3d(" + a + "px, 0px, 0px)",
        "-ms-transform": "translate3d(" + a + "px, 0px, 0px)",
        transform: "translate3d(" + a + "px, 0px,0px)"
      }
    }, transition3d: function (a) {
      var b = this;
      b.$owlWrapper.css(b.doTranslate(a))
    }, css2move: function (a) {
      var b = this;
      b.$owlWrapper.css({left: a})
    }, css2slide: function (a, b) {
      var c = this;
      c.isCssFinish = !1, c.$owlWrapper.stop(!0, !0).animate({left: a}, {
        duration: b || c.options.slideSpeed,
        complete: function () {
          c.isCssFinish = !0
        }
      })
    }, checkBrowser: function () {
      var a, d = this, e = c.createElement("p"), f = {
        webkitTransform: "-webkit-transform",
        OTransform: "-o-transform",
        msTransform: "-ms-transform",
        MozTransform: "-moz-transform",
        transform: "transform"
      };
      c.body.insertBefore(e, null);
      for (var g in f) {
        void 0 !== e.style[g] && (e.style[g] = "translate3d(1px,1px,1px)", a = b.getComputedStyle(e).getPropertyValue(f[g]))
      }
      c.body.removeChild(e), isTouch = "ontouchstart" in b || b.navigator.msMaxTouchPoints, d.browser = {
        support3d: void 0 !== a && a.length > 0 && "none" !== a,
        isTouch: isTouch
      }
    }, moveEvents: function () {
      var a = this;
      (a.options.mouseDrag !== !1 || a.options.touchDrag !== !1) && (a.gestures(), a.disabledEvents())
    }, eventTypes: function () {
      var a = this, b = ["s", "e", "x"];
      a.ev_types = {}, a.options.mouseDrag === !0 && a.options.touchDrag === !0 ? b = ["touchstart.owl mousedown.owl", "touchmove.owl mousemove.owl", "touchend.owl touchcancel.owl mouseup.owl"] : a.options.mouseDrag === !1 && a.options.touchDrag === !0 ? b = ["touchstart.owl", "touchmove.owl", "touchend.owl touchcancel.owl"] : a.options.mouseDrag === !0 && a.options.touchDrag === !1 && (b = ["mousedown.owl", "mousemove.owl", "mouseup.owl"]), a.ev_types.start = b[0], a.ev_types.move = b[1], a.ev_types.end = b[2]
    }, disabledEvents: function () {
      var b = this;
      b.$elem.on("dragstart.owl", function (a) {
        a.preventDefault()
      }), b.$elem.on("mousedown.disableTextSelect", function (b) {
        return a(b.target).is("input, textarea, select, option")
      })
    }, gestures: function () {
      function d(a) {
        if (void 0 !== a.touches) {
          return {x: a.touches[0].pageX, y: a.touches[0].pageY}
        }
        if (void 0 === a.touches) {
          if (void 0 !== a.pageX) {
            return {x: a.pageX, y: a.pageY}
          }
          if (void 0 === a.pageX) {
            return {x: a.clientX, y: a.clientY}
          }
        }
      }

      function e(b) {
        "on" === b ? (a(c).on(i.ev_types.move, g), a(c).on(i.ev_types.end, h)) : "off" === b && (a(c).off(i.ev_types.move), a(c).off(i.ev_types.end))
      }

      function f(c) {
        var f, g = c.originalEvent || c || b.event;
        if (3 === g.which) {
          return !1
        }
        if (!(i.itemsAmount <= i.options.items)) {
          if (i.isCssFinish === !1 && !i.options.dragBeforeAnimFinish) {
            return !1
          }
          if (i.isCss3Finish === !1 && !i.options.dragBeforeAnimFinish) {
            return !1
          }
          i.options.autoPlay !== !1 && b.clearInterval(i.autoPlayInterval), i.browser.isTouch === !0 || i.$owlWrapper.hasClass("grabbing") || i.$owlWrapper.addClass("grabbing"), i.newPosX = 0, i.newRelativeX = 0, a(this).css(i.removeTransition()), f = a(this).position(), j.relativePos = f.left, j.offsetX = d(g).x - f.left, j.offsetY = d(g).y - f.top, e("on"), j.sliding = !1, j.targetElement = g.target || g.srcElement
        }
      }

      function g(e) {
        var f, g, h = e.originalEvent || e || b.event;
        i.newPosX = d(h).x - j.offsetX, i.newPosY = d(h).y - j.offsetY, i.newRelativeX = i.newPosX - j.relativePos, "function" == typeof i.options.startDragging && j.dragging !== !0 && 0 !== i.newRelativeX && (j.dragging = !0, i.options.startDragging.apply(i, [i.$elem])), (i.newRelativeX > 8 || i.newRelativeX < -8) && i.browser.isTouch === !0 && (void 0 !== h.preventDefault ? h.preventDefault() : h.returnValue = !1, j.sliding = !0), (i.newPosY > 10 || i.newPosY < -10) && j.sliding === !1 && a(c).off("touchmove.owl"), f = function () {
          return i.newRelativeX / 5
        }, g = function () {
          return i.maximumPixels + i.newRelativeX / 5
        }, i.newPosX = Math.max(Math.min(i.newPosX, f()), g()), i.browser.support3d === !0 ? i.transition3d(i.newPosX) : i.css2move(i.newPosX)
      }

      function h(c) {
        var d, f, g, h = c.originalEvent || c || b.event;
        h.target = h.target || h.srcElement, j.dragging = !1, i.browser.isTouch !== !0 && i.$owlWrapper.removeClass("grabbing"), i.dragDirection = i.owl.dragDirection = i.newRelativeX < 0 ? "left" : "right", 0 !== i.newRelativeX && (d = i.getNewPosition(), i.goTo(d, !1, "drag"), j.targetElement === h.target && i.browser.isTouch !== !0 && (a(h.target).on("click.disable", function (b) {
          b.stopImmediatePropagation(), b.stopPropagation(), b.preventDefault(), a(b.target).off("click.disable")
        }), f = a._data(h.target, "events").click, g = f.pop(), f.splice(0, 0, g))), e("off")
      }

      var i = this, j = {
        offsetX: 0,
        offsetY: 0,
        baseElWidth: 0,
        relativePos: 0,
        position: null,
        minSwipe: null,
        maxSwipe: null,
        sliding: null,
        dargging: null,
        targetElement: null
      };
      i.isCssFinish = !0, i.$elem.on(i.ev_types.start, ".owl-wrapper", f)
    }, getNewPosition: function () {
      var a = this, b = a.closestItem();
      return b > a.maximumItem ? (a.currentItem = a.maximumItem, b = a.maximumItem) : a.newPosX >= 0 && (b = 0, a.currentItem = 0), b
    }, closestItem: function () {
      var b = this, c = b.options.scrollPerPage === !0 ? b.pagesInArray : b.positionsInArray, d = b.newPosX, e = null;
      return a.each(c, function (f, g) {
        d - b.itemWidth / 20 > c[f + 1] && d - b.itemWidth / 20 < g && "left" === b.moveDirection() ? (e = g, b.currentItem = b.options.scrollPerPage === !0 ? a.inArray(e, b.positionsInArray) : f) : d + b.itemWidth / 20 < g && d + b.itemWidth / 20 > (c[f + 1] || c[f] - b.itemWidth) && "right" === b.moveDirection() && (b.options.scrollPerPage === !0 ? (e = c[f + 1] || c[c.length - 1], b.currentItem = a.inArray(e, b.positionsInArray)) : (e = c[f + 1], b.currentItem = f + 1))
      }), b.currentItem
    }, moveDirection: function () {
      var a, b = this;
      return b.newRelativeX < 0 ? (a = "right", b.playDirection = "next") : (a = "left", b.playDirection = "prev"), a
    }, customEvents: function () {
      var a = this;
      a.$elem.on("owl.next", function () {
        a.next()
      }), a.$elem.on("owl.prev", function () {
        a.prev()
      }), a.$elem.on("owl.play", function (b, c) {
        a.options.autoPlay = c, a.play(), a.hoverStatus = "play"
      }), a.$elem.on("owl.stop", function () {
        a.stop(), a.hoverStatus = "stop"
      }), a.$elem.on("owl.goTo", function (b, c) {
        a.goTo(c)
      }), a.$elem.on("owl.jumpTo", function (b, c) {
        a.jumpTo(c)
      })
    }, stopOnHover: function () {
      var a = this;
      a.options.stopOnHover === !0 && a.browser.isTouch !== !0 && a.options.autoPlay !== !1 && (a.$elem.on("mouseover", function () {
        a.stop()
      }), a.$elem.on("mouseout", function () {
        "stop" !== a.hoverStatus && a.play()
      }))
    }, lazyLoad: function () {
      var b, c, d, e, f, g = this;
      if (g.options.lazyLoad === !1) {
        return !1
      }
      for (b = 0; b < g.itemsAmount; b += 1) {
        c = a(g.$owlItems[b]), "loaded" !== c.data("owl-loaded") && (d = c.data("owl-item"), e = c.find(".lazyOwl"), "string" == typeof e.data("src") ? (void 0 === c.data("owl-loaded") && (e.hide(), c.addClass("loading").data("owl-loaded", "checked")), f = g.options.lazyFollow === !0 ? d >= g.currentItem : !0, f && d < g.currentItem + g.options.items && e.length && e.each(function () {
          g.lazyPreload(c, a(this))
        })) : c.data("owl-loaded", "loaded"))
      }
    }, lazyPreload: function (a, c) {
      function d() {
        a.data("owl-loaded", "loaded").removeClass("loading"), c.removeAttr("data-src"), "fade" === g.options.lazyEffect ? c.fadeIn(400) : c.show(), "function" == typeof g.options.afterLazyLoad && g.options.afterLazyLoad.apply(this, [g.$elem])
      }

      function e() {
        h += 1, g.completeImg(c.get(0)) || f === !0 ? d() : 100 >= h ? b.setTimeout(e, 100) : d()
      }

      var f, g = this, h = 0;
      "DIV" === c.prop("tagName") ? (c.css("background-image", "url(" + c.data("src") + ")"), f = !0) : c[0].src = c.data("src"), e()
    }, autoHeight: function () {
      function c() {
        var c = a(f.$owlItems[f.currentItem]).height();
        f.wrapperOuter.css("height", c + "px"), f.wrapperOuter.hasClass("autoHeight") || b.setTimeout(function () {
          f.wrapperOuter.addClass("autoHeight")
        }, 0)
      }

      function d() {
        e += 1, f.completeImg(g.get(0)) ? c() : 100 >= e ? b.setTimeout(d, 100) : f.wrapperOuter.css("height", "")
      }

      var e, f = this, g = a(f.$owlItems[f.currentItem]).find("img");
      void 0 !== g.get(0) ? (e = 0, d()) : c()
    }, completeImg: function (a) {
      var b;
      return a.complete ? (b = typeof a.naturalWidth, "undefined" !== b && 0 === a.naturalWidth ? !1 : !0) : !1
    }, onVisibleItems: function () {
      var b, c = this;
      for (c.options.addClassActive === !0 && c.$owlItems.removeClass("active"), c.visibleItems = [], b = c.currentItem; b < c.currentItem + c.options.items; b += 1) {
        c.visibleItems.push(b), c.options.addClassActive === !0 && a(c.$owlItems[b]).addClass("active")
      }
      c.owl.visibleItems = c.visibleItems
    }, transitionTypes: function (a) {
      var b = this;
      b.outClass = "owl-" + a + "-out", b.inClass = "owl-" + a + "-in"
    }, singleItemTransition: function () {
      function a(a) {
        return {position: "relative", left: a + "px"}
      }

      var b = this, c = b.outClass, d = b.inClass, e = b.$owlItems.eq(b.currentItem), f = b.$owlItems.eq(b.prevItem),
          g = Math.abs(b.positionsInArray[b.currentItem]) + b.positionsInArray[b.prevItem],
          h = Math.abs(b.positionsInArray[b.currentItem]) + b.itemWidth / 2,
          i = "webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend";
      b.isTransition = !0, b.$owlWrapper.addClass("owl-origin").css({
        "-webkit-transform-origin": h + "px",
        "-moz-perspective-origin": h + "px",
        "perspective-origin": h + "px"
      }), f.css(a(g, 10)).addClass(c).on(i, function () {
        b.endPrev = !0, f.off(i), b.clearTransStyle(f, c)
      }), e.addClass(d).on(i, function () {
        b.endCurrent = !0, e.off(i), b.clearTransStyle(e, d)
      })
    }, clearTransStyle: function (a, b) {
      var c = this;
      a.css({
        position: "",
        left: ""
      }).removeClass(b), c.endPrev && c.endCurrent && (c.$owlWrapper.removeClass("owl-origin"), c.endPrev = !1, c.endCurrent = !1, c.isTransition = !1)
    }, owlStatus: function () {
      var a = this;
      a.owl = {
        userOptions: a.userOptions,
        baseElement: a.$elem,
        userItems: a.$userItems,
        owlItems: a.$owlItems,
        currentItem: a.currentItem,
        prevItem: a.prevItem,
        visibleItems: a.visibleItems,
        isTouch: a.browser.isTouch,
        browser: a.browser,
        dragDirection: a.dragDirection
      }
    }, clearEvents: function () {
      var d = this;
      d.$elem.off(".owl owl mousedown.disableTextSelect"), a(c).off(".owl owl"), a(b).off("resize", d.resizer)
    }, unWrap: function () {
      var a = this;
      0 !== a.$elem.children().length && (a.$owlWrapper.unwrap(), a.$userItems.unwrap().unwrap(), a.owlControls && a.owlControls.remove()), a.clearEvents(), a.$elem.attr("style", a.$elem.data("owl-originalStyles") || ""), a.$elem.attr("class", a.$elem.data("owl-originalClasses"))
    }, destroy: function () {
      var a = this;
      a.stop(), b.clearInterval(a.checkVisible), a.unWrap(), a.$elem.removeData()
    }, reinit: function (b) {
      var c = this, d = a.extend({}, c.userOptions, b);
      c.unWrap(), c.init(d, c.$elem)
    }, addItem: function (a, b) {
      var c, d = this;
      return a ? 0 === d.$elem.children().length ? (d.$elem.append(a), d.setVars(), !1) : (d.unWrap(), c = void 0 === b || -1 === b ? -1 : b, c >= d.$userItems.length || -1 === c ? d.$userItems.eq(-1).after(a) : d.$userItems.eq(c).before(a), void d.setVars()) : !1
    }, removeItem: function (a) {
      var b, c = this;
      return 0 === c.$elem.children().length ? !1 : (b = void 0 === a || -1 === a ? -1 : a, c.unWrap(), c.$userItems.eq(b).remove(), void c.setVars())
    }
  };
  a.fn.owlCarousel = function (b) {
    return this.each(function () {
      if (a(this).data("owl-init") === !0) {
        return !1
      }
      a(this).data("owl-init", !0);
      var c = Object.create(d);
      c.init(b, this), a.data(this, "owlCarousel", c)
    })
  }, a.fn.owlCarousel.options = {
    items: 5,
    itemsCustom: !1,
    itemsDesktop: [1199, 4],
    itemsDesktopSmall: [979, 3],
    itemsTablet: [768, 2],
    itemsTabletSmall: !1,
    itemsMobile: [479, 1],
    singleItem: !1,
    itemsScaleUp: !1,
    slideSpeed: 200,
    paginationSpeed: 800,
    rewindSpeed: 1000,
    autoPlay: !1,
    stopOnHover: !1,
    navigation: !1,
    navigationText: ["prev", "next"],
    rewindNav: !0,
    scrollPerPage: !1,
    pagination: !0,
    paginationNumbers: !1,
    responsive: !0,
    responsiveRefreshRate: 200,
    responsiveBaseWidth: b,
    baseClass: "owl-carousel",
    theme: "owl-theme",
    lazyLoad: !1,
    lazyFollow: !0,
    lazyEffect: "fade",
    autoHeight: !1,
    jsonPath: !1,
    jsonSuccess: !1,
    dragBeforeAnimFinish: !0,
    mouseDrag: !0,
    touchDrag: !0,
    addClassActive: !1,
    transitionStyle: !1,
    beforeUpdate: !1,
    afterUpdate: !1,
    beforeInit: !1,
    afterInit: !1,
    beforeMove: !1,
    afterMove: !1,
    afterAction: !1,
    startDragging: !1,
    afterLazyLoad: !1
  }
}(jQuery, window, document), function (a, b, c) {
  function d(a) {
    var b = {}, d = /^jQuery\d+$/;
    return c.each(a.attributes, function (a, c) {
      c.specified && !d.test(c.name) && (b[c.name] = c.value)
    }), b
  }

  function e(a, b) {
    var d = this, e = c(d);
    if (d.value == e.attr("placeholder") && e.hasClass("placeholder")) {
      if (e.data("placeholder-password")) {
        if (e = e.hide().next().show().attr("id", e.removeAttr("id").data("placeholder-id")), a === !0) {
          return e[0].value = b
        }
        e.focus()
      } else {
        d.value = "", e.removeClass("placeholder"), d == g() && d.select()
      }
    }
  }

  function f() {
    var a, b = this, f = c(b), g = this.id;
    if ("" == b.value) {
      if ("password" == b.type) {
        if (!f.data("placeholder-textinput")) {
          try {
            a = f.clone().attr({type: "text"})
          } catch (h) {
            a = c("<input>").attr(c.extend(d(this), {type: "text"}))
          }
          a.removeAttr("name").data({
            "placeholder-password": f,
            "placeholder-id": g
          }).bind("focus.placeholder", e), f.data({"placeholder-textinput": a, "placeholder-id": g}).before(a)
        }
        f = f.removeAttr("id").hide().prev().attr("id", g).show()
      }
      f.addClass("placeholder"), f[0].value = f.attr("placeholder")
    } else {
      f.removeClass("placeholder")
    }
  }

  function g() {
    try {
      return b.activeElement
    } catch (a) {
    }
  }

  var h, i, j = "[object OperaMini]" == Object.prototype.toString.call(a.operamini),
      k = "placeholder" in b.createElement("input") && !j, l = "placeholder" in b.createElement("textarea") && !j,
      m = c.fn, n = c.valHooks, o = c.propHooks;
  k && l ? (i = m.placeholder = function () {
    return this
  }, i.input = i.textarea = !0) : (i = m.placeholder = function () {
    var a = this;
    return a.filter((k ? "textarea" : ":input") + "[placeholder]").not(".placeholder").bind({
      "focus.placeholder": e,
      "blur.placeholder": f
    }).data("placeholder-enabled", !0).trigger("blur.placeholder"), a
  }, i.input = k, i.textarea = l, h = {
    get: function (a) {
      var b = c(a), d = b.data("placeholder-password");
      return d ? d[0].value : b.data("placeholder-enabled") && b.hasClass("placeholder") ? "" : a.value
    }, set: function (a, b) {
      var d = c(a), h = d.data("placeholder-password");
      return h ? h[0].value = b : d.data("placeholder-enabled") ? ("" == b ? (a.value = b, a != g() && f.call(a)) : d.hasClass("placeholder") ? e.call(a, !0, b) || (a.value = b) : a.value = b, d) : a.value = b
    }
  }, k || (n.input = h, o.value = h), l || (n.textarea = h, o.value = h), c(function () {
    c(b).delegate("form", "submit.placeholder", function () {
      var a = c(".placeholder", this).each(e);
      setTimeout(function () {
        a.each(f)
      }, 10)
    })
  }), c(a).bind("beforeunload.placeholder", function () {
    c(".placeholder").each(function () {
      this.value = ""
    })
  }))
}(this, document, jQuery), function (a, b) {
  a.HoverDir = function (b, c) {
    this.$el = a(c), this._init(b)
  }, a.HoverDir.defaults = {
    speed: 300,
    easing: "ease",
    hoverDelay: 0,
    inverse: !1,
    hoverElem: "div",
    rotate3d: !1
  }, a.HoverDir.prototype = {
    _init: function (b) {
      this.options = a.extend(!0, {}, a.HoverDir.defaults, b), this.transitionProp = "all " + this.options.speed + "ms " + this.options.easing, this.support = Modernizr.csstransitions, this._loadEvents()
    }, _loadEvents: function () {
      var b = this;
      this.$el.on("mouseenter.hoverdir mouseleave.hoverdir", function (c) {
        var d = a(this), e = d.find(b.options.hoverElem), f = b._getDir(d, {x: c.pageX, y: c.pageY}),
            g = b._getStyle(f);
        "mouseenter" === c.type ? (b.support && e.css("transition", ""), e.hide().css(g.from), clearTimeout(b.tmhover), b.tmhover = setTimeout(function () {
          e.show(0, function () {
            var c = a(this);
            b.support && c.css("transition", b.transitionProp), b._applyAnimation(c, g.to, b.options.speed)
          })
        }, b.options.hoverDelay)) : (b.support && e.css("transition", b.transitionProp), clearTimeout(b.tmhover), b._applyAnimation(e, g.from, b.options.speed))
      })
    }, _getDir: function (a, b) {
      var c = a.width(), d = a.height(), e = (b.x - a.offset().left - c / 2) * (c > d ? d / c : 1),
          f = (b.y - a.offset().top - d / 2) * (d > c ? c / d : 1),
          g = Math.round((Math.atan2(f, e) * (180 / Math.PI) + 180) / 90 + 3) % 4;
      return g
    }, _getStyle: function (a) {
      if (this.options.rotate3d) {
        var b, c, d = {
          left: "0",
          top: "0",
          "-webkit-transform-origin": "50% 0",
          "-moz-transform-origin": "50% 0",
          "transform-origin": "50% 0",
          "-webkit-transform": "rotateX(-90deg)",
          "-moz-transform": "rotateX(-90deg)",
          transform: "rotateX(-90deg)",
          visibility: "hidden"
        }, e = {
          left: "0",
          bottom: "0",
          "-webkit-transform-origin": "50% 100%",
          "-moz-transform-origin": "50% 100%",
          "transform-origin": "50% 100%",
          "-webkit-transform": "rotateX(90deg)",
          "-moz-transform": "rotateX(90deg)",
          transform: "rotateX(90deg)",
          visibility: "hidden"
        }, f = {
          left: "0",
          top: "0",
          "-webkit-transform-origin": "0 50%",
          "-moz-transform-origin": "0 50%",
          "transform-origin": "0 50%",
          "-webkit-transform": "rotateY(90deg)",
          "-moz-transform": "rotateY(90deg)",
          transform: "rotateY(90deg)",
          visibility: "hidden"
        }, g = {
          right: "0",
          top: "0",
          "-webkit-transform-origin": "100% 50%",
          "-moz-transform-origin": "100% 50%",
          "transform-origin": "100% 50%",
          "-webkit-transform": "rotateY(-90deg)",
          "-moz-transform": "rotateY(-90deg)",
          transform: "rotateY(-90deg)",
          visibility: "hidden"
        }, h = {
          bottom: "auto",
          top: "0",
          "-webkit-transform": "rotateX(0deg)",
          "-moz-transform": "rotateX(0deg)",
          transform: "rotateX(0deg)",
          visibility: "visible"
        }, i = {
          right: "auto",
          left: "0",
          "-webkit-transform": "rotateY(0deg)",
          "-moz-transform": "rotateY(0deg)",
          transform: "rotateY(0deg)",
          visibility: "visible"
        }, j = {
          top: "auto",
          bottom: "0",
          "-webkit-transform": "rotateX(0deg)",
          "-moz-transform": "rotateX(0deg)",
          transform: "rotateX(0deg)",
          visibility: "visible"
        }, k = {
          left: "auto",
          right: "0",
          "-webkit-transform": "rotateY(0deg)",
          "-moz-transform": "rotateY(0deg)",
          transform: "rotateY(0deg)",
          visibility: "visible"
        }
      } else {
        var b, c, d = {left: "0", top: "-100%"}, e = {left: "0", top: "100%"}, f = {left: "-100%", top: "0"},
            g = {left: "100%", top: "0"}, h = {top: "0"}, i = {left: "0"}
      }
      switch (a) {
        case 0:
          b = this.options.inverse ? e : d, c = j ? j : h;
          break;
        case 1:
          b = this.options.inverse ? f : g, c = i;
          break;
        case 2:
          b = this.options.inverse ? d : e, c = h ? h : j;
          break;
        case 3:
          b = this.options.inverse ? g : f, c = k ? k : i
      }
      return {from: b, to: c}
    }, _applyAnimation: function (b, c, d) {
      a.fn.applyStyle = this.support ? a.fn.css : a.fn.animate, b.stop().applyStyle(c, a.extend(!0, [], {duration: d}))
    }
  };
  var c = function (a) {
    b.console && b.console.error(a)
  };
  a.fn.hoverdir = function (b) {
    var d = a.data(this, "hoverdir");
    if ("string" == typeof b) {
      var e = Array.prototype.slice.call(arguments, 1);
      this.each(function () {
        return d ? a.isFunction(d[b]) && "_" !== b.charAt(0) ? void d[b].apply(d, e) : void c("no such method '" + b + "' for hoverdir instance") : void c("cannot call methods on hoverdir prior to initialization; attempted to call method '" + b + "'")
      })
    } else {
      this.each(function () {
        d ? d._init() : d = a.data(this, "hoverdir", new a.HoverDir(b, this))
      })
    }
    return d
  }
}(jQuery, window), function (a) {
  var b, c, d = a.event;
  b = d.special.debouncedresize = {
    setup: function () {
      a(this).on("resize", b.handler)
    }, teardown: function () {
      a(this).off("resize", b.handler)
    }, handler: function (a, e) {
      var f = this, g = arguments, h = function () {
        a.type = "debouncedresize", d.dispatch.apply(f, g)
      };
      c && clearTimeout(c), e ? h() : c = setTimeout(h, b.threshold)
    }, threshold: 150
  }
}(jQuery), function (a) {
  a.fn.jflickrfeed = function (b, c) {
    b = a.extend(!0, {
      flickrbase: "http://api.flickr.com/services/feeds/",
      feedapi: "photos_public.gne",
      limit: 20,
      qstrings: {lang: "en-us", format: "json", jsoncallback: "?"},
      cleanDescription: !0,
      useTemplate: !0,
      itemTemplate: "",
      itemCallback: function () {
      }
    }, b);
    var d = b.flickrbase + b.feedapi + "?", e = !0;
    for (var f in b.qstrings) {
      e || (d += "&"), d += f + "=" + b.qstrings[f], e = !1
    }
    return a(this).each(function () {
      var e = a(this), f = this;
      a.getJSON(d, function (d) {
        a.each(d.items, function (a, c) {
          if (a < b.limit) {
            if (b.cleanDescription) {
              var d = /<p>(.*?)<\/p>/g, g = c.description;
              d.test(g) && (c.description = g.match(d)[2], void 0 != c.description && (c.description = c.description.replace("<p>", "").replace("</p>", "")))
            }
            if (c.image_s = c.media.m.replace("_m", "_s"), c.image_t = c.media.m.replace("_m", "_t"), c.image_m = c.media.m.replace("_m", "_m"), c.image = c.media.m.replace("_m", ""), c.image_b = c.media.m.replace("_m", "_b"), delete c.media, b.useTemplate) {
              var h = b.itemTemplate;
              for (var i in c) {
                var j = new RegExp("{{" + i + "}}", "g");
                h = h.replace(j, c[i])
              }
              e.append(h)
            }
            b.itemCallback.call(f, c)
          }
        }), a.isFunction(c) && c.call(f, d)
      })
    })
  }
}(jQuery), function (a) {
  a.extend(a.fn, {
    validate: function (b) {
      if (!this.length) {
        return void(b && b.debug && window.console && console.warn("Nothing selected, can't validate, returning nothing."))
      }
      var c = a.data(this[0], "validator");
      return c ? c : (this.attr("novalidate", "novalidate"), c = new a.validator(b, this[0]), a.data(this[0], "validator", c), c.settings.onsubmit && (this.validateDelegate(":submit", "click", function (b) {
        c.settings.submitHandler && (c.submitButton = b.target), a(b.target).hasClass("cancel") && (c.cancelSubmit = !0), void 0 !== a(b.target).attr("formnovalidate") && (c.cancelSubmit = !0)
      }), this.submit(function (b) {
        function d() {
          var d;
          return c.settings.submitHandler ? (c.submitButton && (d = a("<input type='hidden'/>").attr("name", c.submitButton.name).val(a(c.submitButton).val()).appendTo(c.currentForm)), c.settings.submitHandler.call(c, c.currentForm, b), c.submitButton && d.remove(), !1) : !0
        }

        return c.settings.debug && b.preventDefault(), c.cancelSubmit ? (c.cancelSubmit = !1, d()) : c.form() ? c.pendingRequest ? (c.formSubmitted = !0, !1) : d() : (c.focusInvalid(), !1)
      })), c)
    }, valid: function () {
      if (a(this[0]).is("form")) {
        return this.validate().form()
      }
      var b = !0, c = a(this[0].form).validate();
      return this.each(function () {
        b = b && c.element(this)
      }), b
    }, removeAttrs: function (b) {
      var c = {}, d = this;
      return a.each(b.split(/\s/), function (a, b) {
        c[b] = d.attr(b), d.removeAttr(b)
      }), c
    }, rules: function (b, c) {
      var d = this[0];
      if (b) {
        var e = a.data(d.form, "validator").settings, f = e.rules, g = a.validator.staticRules(d);
        switch (b) {
          case"add":
            a.extend(g, a.validator.normalizeRule(c)), delete g.messages, f[d.name] = g, c.messages && (e.messages[d.name] = a.extend(e.messages[d.name], c.messages));
            break;
          case"remove":
            if (!c) {
              return delete f[d.name], g
            }
            var h = {};
            return a.each(c.split(/\s/), function (a, b) {
              h[b] = g[b], delete g[b]
            }), h
        }
      }
      var i = a.validator.normalizeRules(a.extend({}, a.validator.classRules(d), a.validator.attributeRules(d), a.validator.dataRules(d), a.validator.staticRules(d)), d);
      if (i.required) {
        var j = i.required;
        delete i.required, i = a.extend({required: j}, i)
      }
      return i
    }
  }), a.extend(a.expr[":"], {
    blank: function (b) {
      return !a.trim("" + a(b).val())
    }, filled: function (b) {
      return !!a.trim("" + a(b).val())
    }, unchecked: function (b) {
      return !a(b).prop("checked")
    }
  }), a.validator = function (b, c) {
    this.settings = a.extend(!0, {}, a.validator.defaults, b), this.currentForm = c, this.init()
  }, a.validator.format = function (b, c) {
    return 1 === arguments.length ? function () {
      var c = a.makeArray(arguments);
      return c.unshift(b), a.validator.format.apply(this, c)
    } : (arguments.length > 2 && c.constructor !== Array && (c = a.makeArray(arguments).slice(1)), c.constructor !== Array && (c = [c]), a.each(c, function (a, c) {
      b = b.replace(RegExp("\\{" + a + "\\}", "g"), function () {
        return c
      })
    }), b)
  }, a.extend(a.validator, {
    defaults: {
      messages: {},
      groups: {},
      rules: {},
      errorClass: "error",
      validClass: "valid",
      errorElement: "label",
      focusInvalid: !0,
      errorContainer: a([]),
      errorLabelContainer: a([]),
      onsubmit: !0,
      ignore: ":hidden",
      ignoreTitle: !1,
      onfocusin: function (a) {
        this.lastActive = a, this.settings.focusCleanup && !this.blockFocusCleanup && (this.settings.unhighlight && this.settings.unhighlight.call(this, a, this.settings.errorClass, this.settings.validClass), this.addWrapper(this.errorsFor(a)).hide())
      },
      onfocusout: function (a) {
        this.checkable(a) || !(a.name in this.submitted) && this.optional(a) || this.element(a)
      },
      onkeyup: function (a, b) {
        (9 !== b.which || "" !== this.elementValue(a)) && (a.name in this.submitted || a === this.lastElement) && this.element(a)
      },
      onclick: function (a) {
        a.name in this.submitted ? this.element(a) : a.parentNode.name in this.submitted && this.element(a.parentNode)
      },
      highlight: function (b, c, d) {
        "radio" === b.type ? this.findByName(b.name).addClass(c).removeClass(d) : a(b).addClass(c).removeClass(d)
      },
      unhighlight: function (b, c, d) {
        "radio" === b.type ? this.findByName(b.name).removeClass(c).addClass(d) : a(b).removeClass(c).addClass(d)
      }
    },
    setDefaults: function (b) {
      a.extend(a.validator.defaults, b)
    },
    messages: {
      required: "This field is required.",
      remote: "Please fix this field.",
      email: "Please enter a valid email address.",
      url: "Please enter a valid URL.",
      date: "Please enter a valid date.",
      dateISO: "Please enter a valid date (ISO).",
      number: "Please enter a valid number.",
      digits: "Please enter only digits.",
      creditcard: "Please enter a valid credit card number.",
      equalTo: "Please enter the same value again.",
      maxlength: a.validator.format("Please enter no more than {0} characters."),
      minlength: a.validator.format("Please enter at least {0} characters."),
      rangelength: a.validator.format("Please enter a value between {0} and {1} characters long."),
      range: a.validator.format("Please enter a value between {0} and {1}."),
      max: a.validator.format("Please enter a value less than or equal to {0}."),
      min: a.validator.format("Please enter a value greater than or equal to {0}.")
    },
    autoCreateRanges: !1,
    prototype: {
      init: function () {
        function b(b) {
          var c = a.data(this[0].form, "validator"), d = "on" + b.type.replace(/^validate/, "");
          c.settings[d] && c.settings[d].call(c, this[0], b)
        }

        this.labelContainer = a(this.settings.errorLabelContainer), this.errorContext = this.labelContainer.length && this.labelContainer || a(this.currentForm), this.containers = a(this.settings.errorContainer).add(this.settings.errorLabelContainer), this.submitted = {}, this.valueCache = {}, this.pendingRequest = 0, this.pending = {}, this.invalid = {}, this.reset();
        var c = this.groups = {};
        a.each(this.settings.groups, function (b, d) {
          "string" == typeof d && (d = d.split(/\s/)), a.each(d, function (a, d) {
            c[d] = b
          })
        });
        var d = this.settings.rules;
        a.each(d, function (b, c) {
          d[b] = a.validator.normalizeRule(c)
        }), a(this.currentForm).validateDelegate(":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'] ,[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'] ", "focusin focusout keyup", b).validateDelegate("[type='radio'], [type='checkbox'], select, option", "click", b), this.settings.invalidHandler && a(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler)
      }, form: function () {
        return this.checkForm(), a.extend(this.submitted, this.errorMap), this.invalid = a.extend({}, this.errorMap), this.valid() || a(this.currentForm).triggerHandler("invalid-form", [this]), this.showErrors(), this.valid()
      }, checkForm: function () {
        this.prepareForm();
        for (var a = 0, b = this.currentElements = this.elements(); b[a]; a++) {
          this.check(b[a])
        }
        return this.valid()
      }, element: function (b) {
        b = this.validationTargetFor(this.clean(b)), this.lastElement = b, this.prepareElement(b), this.currentElements = a(b);
        var c = this.check(b) !== !1;
        return c ? delete this.invalid[b.name] : this.invalid[b.name] = !0, this.numberOfInvalids() || (this.toHide = this.toHide.add(this.containers)), this.showErrors(), c
      }, showErrors: function (b) {
        if (b) {
          a.extend(this.errorMap, b), this.errorList = [];
          for (var c in b) {
            this.errorList.push({message: b[c], element: this.findByName(c)[0]})
          }
          this.successList = a.grep(this.successList, function (a) {
            return !(a.name in b)
          })
        }
        this.settings.showErrors ? this.settings.showErrors.call(this, this.errorMap, this.errorList) : this.defaultShowErrors()
      }, resetForm: function () {
        a.fn.resetForm && a(this.currentForm).resetForm(), this.submitted = {}, this.lastElement = null, this.prepareForm(), this.hideErrors(), this.elements().removeClass(this.settings.errorClass).removeData("previousValue")
      }, numberOfInvalids: function () {
        return this.objectLength(this.invalid)
      }, objectLength: function (a) {
        var b = 0;
        for (var c in a) {
          b++
        }
        return b
      }, hideErrors: function () {
        this.addWrapper(this.toHide).hide()
      }, valid: function () {
        return 0 === this.size()
      }, size: function () {
        return this.errorList.length
      }, focusInvalid: function () {
        if (this.settings.focusInvalid) {
          try {
            a(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus().trigger("focusin")
          } catch (b) {
          }
        }
      }, findLastActive: function () {
        var b = this.lastActive;
        return b && 1 === a.grep(this.errorList, function (a) {
              return a.element.name === b.name
            }).length && b
      }, elements: function () {
        var b = this, c = {};
        return a(this.currentForm).find("input, select, textarea").not(":submit, :reset, :image, [disabled]").not(this.settings.ignore).filter(function () {
          return !this.name && b.settings.debug && window.console && console.error("%o has no name assigned", this), this.name in c || !b.objectLength(a(this).rules()) ? !1 : (c[this.name] = !0, !0)
        })
      }, clean: function (b) {
        return a(b)[0]
      }, errors: function () {
        var b = this.settings.errorClass.replace(" ", ".");
        return a(this.settings.errorElement + "." + b, this.errorContext)
      }, reset: function () {
        this.successList = [], this.errorList = [], this.errorMap = {}, this.toShow = a([]), this.toHide = a([]), this.currentElements = a([])
      }, prepareForm: function () {
        this.reset(), this.toHide = this.errors().add(this.containers)
      }, prepareElement: function (a) {
        this.reset(), this.toHide = this.errorsFor(a)
      }, elementValue: function (b) {
        var c = a(b).attr("type"), d = a(b).val();
        return "radio" === c || "checkbox" === c ? a("input[name='" + a(b).attr("name") + "']:checked").val() : "string" == typeof d ? d.replace(/\r/g, "") : d
      }, check: function (b) {
        b = this.validationTargetFor(this.clean(b));
        var c, d = a(b).rules(), e = !1, f = this.elementValue(b);
        for (var g in d) {
          var h = {method: g, parameters: d[g]};
          try {
            if (c = a.validator.methods[g].call(this, f, b, h.parameters), "dependency-mismatch" === c) {
              e = !0;
              continue
            }
            if (e = !1, "pending" === c) {
              return void(this.toHide = this.toHide.not(this.errorsFor(b)))
            }
            if (!c) {
              return this.formatAndAdd(b, h), !1
            }
          } catch (i) {
            throw this.settings.debug && window.console && console.log("Exception occurred when checking element " + b.id + ", check the '" + h.method + "' method.", i), i
          }
        }
        return e ? void 0 : (this.objectLength(d) && this.successList.push(b), !0)
      }, customDataMessage: function (b, c) {
        return a(b).data("msg-" + c.toLowerCase()) || b.attributes && a(b).attr("data-msg-" + c.toLowerCase())
      }, customMessage: function (a, b) {
        var c = this.settings.messages[a];
        return c && (c.constructor === String ? c : c[b])
      }, findDefined: function () {
        for (var a = 0; arguments.length > a; a++) {
          if (void 0 !== arguments[a]) {
            return arguments[a]
          }
        }
        return void 0
      }, defaultMessage: function (b, c) {
        return this.findDefined(this.customMessage(b.name, c), this.customDataMessage(b, c), !this.settings.ignoreTitle && b.title || void 0, a.validator.messages[c], "<strong>Warning: No message defined for " + b.name + "</strong>")
      }, formatAndAdd: function (b, c) {
        var d = this.defaultMessage(b, c.method), e = /\$?\{(\d+)\}/g;
        "function" == typeof d ? d = d.call(this, c.parameters, b) : e.test(d) && (d = a.validator.format(d.replace(e, "{$1}"), c.parameters)), this.errorList.push({
          message: d,
          element: b
        }), this.errorMap[b.name] = d, this.submitted[b.name] = d
      }, addWrapper: function (a) {
        return this.settings.wrapper && (a = a.add(a.parent(this.settings.wrapper))), a
      }, defaultShowErrors: function () {
        var a, b;
        for (a = 0; this.errorList[a]; a++) {
          var c = this.errorList[a];
          this.settings.highlight && this.settings.highlight.call(this, c.element, this.settings.errorClass, this.settings.validClass), this.showLabel(c.element, c.message)
        }
        if (this.errorList.length && (this.toShow = this.toShow.add(this.containers)), this.settings.success) {
          for (a = 0; this.successList[a]; a++) {
            this.showLabel(this.successList[a])
          }
        }
        if (this.settings.unhighlight) {
          for (a = 0, b = this.validElements(); b[a]; a++) {
            this.settings.unhighlight.call(this, b[a], this.settings.errorClass, this.settings.validClass)
          }
        }
        this.toHide = this.toHide.not(this.toShow), this.hideErrors(), this.addWrapper(this.toShow).show()
      }, validElements: function () {
        return this.currentElements.not(this.invalidElements())
      }, invalidElements: function () {
        return a(this.errorList).map(function () {
          return this.element
        })
      }, showLabel: function (b, c) {
        var d = this.errorsFor(b);
        d.length ? (d.removeClass(this.settings.validClass).addClass(this.settings.errorClass), d.html(c)) : (d = a("<" + this.settings.errorElement + ">").attr("for", this.idOrName(b)).addClass(this.settings.errorClass).html(c || ""), this.settings.wrapper && (d = d.hide().show().wrap("<" + this.settings.wrapper + "/>").parent()), this.labelContainer.append(d).length || (this.settings.errorPlacement ? this.settings.errorPlacement(d, a(b)) : d.insertAfter(b))), !c && this.settings.success && (d.text(""), "string" == typeof this.settings.success ? d.addClass(this.settings.success) : this.settings.success(d, b)), this.toShow = this.toShow.add(d)
      }, errorsFor: function (b) {
        var c = this.idOrName(b);
        return this.errors().filter(function () {
          return a(this).attr("for") === c
        })
      }, idOrName: function (a) {
        return this.groups[a.name] || (this.checkable(a) ? a.name : a.id || a.name)
      }, validationTargetFor: function (a) {
        return this.checkable(a) && (a = this.findByName(a.name).not(this.settings.ignore)[0]), a
      }, checkable: function (a) {
        return /radio|checkbox/i.test(a.type)
      }, findByName: function (b) {
        return a(this.currentForm).find("[name='" + b + "']")
      }, getLength: function (b, c) {
        switch (c.nodeName.toLowerCase()) {
          case"select":
            return a("option:selected", c).length;
          case"input":
            if (this.checkable(c)) {
              return this.findByName(c.name).filter(":checked").length
            }
        }
        return b.length
      }, depend: function (a, b) {
        return this.dependTypes[typeof a] ? this.dependTypes[typeof a](a, b) : !0
      }, dependTypes: {
        "boolean": function (a) {
          return a
        }, string: function (b, c) {
          return !!a(b, c.form).length
        }, "function": function (a, b) {
          return a(b)
        }
      }, optional: function (b) {
        var c = this.elementValue(b);
        return !a.validator.methods.required.call(this, c, b) && "dependency-mismatch"
      }, startRequest: function (a) {
        this.pending[a.name] || (this.pendingRequest++, this.pending[a.name] = !0)
      }, stopRequest: function (b, c) {
        this.pendingRequest--, 0 > this.pendingRequest && (this.pendingRequest = 0), delete this.pending[b.name], c && 0 === this.pendingRequest && this.formSubmitted && this.form() ? (a(this.currentForm).submit(), this.formSubmitted = !1) : !c && 0 === this.pendingRequest && this.formSubmitted && (a(this.currentForm).triggerHandler("invalid-form", [this]), this.formSubmitted = !1)
      }, previousValue: function (b) {
        return a.data(b, "previousValue") || a.data(b, "previousValue", {
              old: null,
              valid: !0,
              message: this.defaultMessage(b, "remote")
            })
      }
    },
    classRuleSettings: {
      required: {required: !0},
      email: {email: !0},
      url: {url: !0},
      date: {date: !0},
      dateISO: {dateISO: !0},
      number: {number: !0},
      digits: {digits: !0},
      creditcard: {creditcard: !0}
    },
    addClassRules: function (b, c) {
      b.constructor === String ? this.classRuleSettings[b] = c : a.extend(this.classRuleSettings, b)
    },
    classRules: function (b) {
      var c = {}, d = a(b).attr("class");
      return d && a.each(d.split(" "), function () {
        this in a.validator.classRuleSettings && a.extend(c, a.validator.classRuleSettings[this])
      }), c
    },
    attributeRules: function (b) {
      var c = {}, d = a(b), e = d[0].getAttribute("type");
      for (var f in a.validator.methods) {
        var g;
        "required" === f ? (g = d.get(0).getAttribute(f), "" === g && (g = !0), g = !!g) : g = d.attr(f), /min|max/.test(f) && (null === e || /number|range|text/.test(e)) && (g = Number(g)), g ? c[f] = g : e === f && "range" !== e && (c[f] = !0)
      }
      return c.maxlength && /-1|2147483647|524288/.test(c.maxlength) && delete c.maxlength, c
    },
    dataRules: function (b) {
      var c, d, e = {}, f = a(b);
      for (c in a.validator.methods) {
        d = f.data("rule-" + c.toLowerCase()), void 0 !== d && (e[c] = d)
      }
      return e
    },
    staticRules: function (b) {
      var c = {}, d = a.data(b.form, "validator");
      return d.settings.rules && (c = a.validator.normalizeRule(d.settings.rules[b.name]) || {}), c
    },
    normalizeRules: function (b, c) {
      return a.each(b, function (d, e) {
        if (e === !1) {
          return void delete b[d]
        }
        if (e.param || e.depends) {
          var f = !0;
          switch (typeof e.depends) {
            case"string":
              f = !!a(e.depends, c.form).length;
              break;
            case"function":
              f = e.depends.call(c, c)
          }
          f ? b[d] = void 0 !== e.param ? e.param : !0 : delete b[d]
        }
      }), a.each(b, function (d, e) {
        b[d] = a.isFunction(e) ? e(c) : e
      }), a.each(["minlength", "maxlength"], function () {
        b[this] && (b[this] = Number(b[this]))
      }), a.each(["rangelength", "range"], function () {
        var c;
        b[this] && (a.isArray(b[this]) ? b[this] = [Number(b[this][0]), Number(b[this][1])] : "string" == typeof b[this] && (c = b[this].split(/[\s,]+/), b[this] = [Number(c[0]), Number(c[1])]))
      }), a.validator.autoCreateRanges && (b.min && b.max && (b.range = [b.min, b.max], delete b.min, delete b.max), b.minlength && b.maxlength && (b.rangelength = [b.minlength, b.maxlength], delete b.minlength, delete b.maxlength)), b
    },
    normalizeRule: function (b) {
      if ("string" == typeof b) {
        var c = {};
        a.each(b.split(/\s/), function () {
          c[this] = !0
        }), b = c
      }
      return b
    },
    addMethod: function (b, c, d) {
      a.validator.methods[b] = c, a.validator.messages[b] = void 0 !== d ? d : a.validator.messages[b], 3 > c.length && a.validator.addClassRules(b, a.validator.normalizeRule(b))
    },
    methods: {
      required: function (b, c, d) {
        if (!this.depend(d, c)) {
          return "dependency-mismatch"
        }
        if ("select" === c.nodeName.toLowerCase()) {
          var e = a(c).val();
          return e && e.length > 0
        }
        return this.checkable(c) ? this.getLength(b, c) > 0 : a.trim(b).length > 0
      }, email: function (a, b) {
        return this.optional(b) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(a)
      }, url: function (a, b) {
        return this.optional(b) || /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(a)
      }, date: function (a, b) {
        return this.optional(b) || !/Invalid|NaN/.test("" + new Date(a))
      }, dateISO: function (a, b) {
        return this.optional(b) || /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(a)
      }, number: function (a, b) {
        return this.optional(b) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(a)
      }, digits: function (a, b) {
        return this.optional(b) || /^\d+$/.test(a)
      }, creditcard: function (a, b) {
        if (this.optional(b)) {
          return "dependency-mismatch"
        }
        if (/[^0-9 \-]+/.test(a)) {
          return !1
        }
        var c = 0, d = 0, e = !1;
        a = a.replace(/\D/g, "");
        for (var f = a.length - 1; f >= 0; f--) {
          var g = a.charAt(f);
          d = parseInt(g, 10), e && (d *= 2) > 9 && (d -= 9), c += d, e = !e
        }
        return 0 === c % 10
      }, minlength: function (b, c, d) {
        var e = a.isArray(b) ? b.length : this.getLength(a.trim(b), c);
        return this.optional(c) || e >= d
      }, maxlength: function (b, c, d) {
        var e = a.isArray(b) ? b.length : this.getLength(a.trim(b), c);
        return this.optional(c) || d >= e
      }, rangelength: function (b, c, d) {
        var e = a.isArray(b) ? b.length : this.getLength(a.trim(b), c);
        return this.optional(c) || e >= d[0] && d[1] >= e
      }, min: function (a, b, c) {
        return this.optional(b) || a >= c
      }, max: function (a, b, c) {
        return this.optional(b) || c >= a
      }, range: function (a, b, c) {
        return this.optional(b) || a >= c[0] && c[1] >= a
      }, equalTo: function (b, c, d) {
        var e = a(d);
        return this.settings.onfocusout && e.unbind(".validate-equalTo").bind("blur.validate-equalTo", function () {
          a(c).valid()
        }), b === e.val()
      }, remote: function (b, c, d) {
        if (this.optional(c)) {
          return "dependency-mismatch"
        }
        var e = this.previousValue(c);
        if (this.settings.messages[c.name] || (this.settings.messages[c.name] = {}), e.originalMessage = this.settings.messages[c.name].remote, this.settings.messages[c.name].remote = e.message, d = "string" == typeof d && {url: d} || d, e.old === b) {
          return e.valid
        }
        e.old = b;
        var f = this;
        this.startRequest(c);
        var g = {};
        return g[c.name] = b, a.ajax(a.extend(!0, {
          url: d,
          mode: "abort",
          port: "validate" + c.name,
          dataType: "json",
          data: g,
          success: function (d) {
            f.settings.messages[c.name].remote = e.originalMessage;
            var g = d === !0 || "true" === d;
            if (g) {
              var h = f.formSubmitted;
              f.prepareElement(c), f.formSubmitted = h, f.successList.push(c), delete f.invalid[c.name], f.showErrors()
            } else {
              var i = {}, j = d || f.defaultMessage(c, "remote");
              i[c.name] = e.message = a.isFunction(j) ? j(b) : j, f.invalid[c.name] = !0, f.showErrors(i)
            }
            e.valid = g, f.stopRequest(c, g)
          }
        }, d)), "pending"
      }
    }
  }), a.format = a.validator.format
}(jQuery), function (a) {
  var b = {};
  if (a.ajaxPrefilter) {
    a.ajaxPrefilter(function (a, c, d) {
      var e = a.port;
      "abort" === a.mode && (b[e] && b[e].abort(), b[e] = d)
    })
  } else {
    var c = a.ajax;
    a.ajax = function (d) {
      var e = ("mode" in d ? d : a.ajaxSettings).mode, f = ("port" in d ? d : a.ajaxSettings).port;
      return "abort" === e ? (b[f] && b[f].abort(), b[f] = c.apply(this, arguments), b[f]) : c.apply(this, arguments)
    }
  }
}(jQuery), function (a) {
  a.extend(a.fn, {
    validateDelegate: function (b, c, d) {
      return this.bind(c, function (c) {
        var e = a(c.target);
        return e.is(b) ? d.apply(e, arguments) : void 0
      })
    }
  })
}(jQuery), function (a) {
  "function" == typeof define && define.amd ? define(["jquery"], a) : a(jQuery)
}(function (a) {
  var b = {}, c = Math.max, d = Math.min;
  b.c = {}, b.c.d = a(document), b.c.t = function (a) {
    return a.originalEvent.touches.length - 1
  }, b.o = function () {
    var c = this;
    this.o = null, this.$ = null, this.i = null, this.g = null, this.v = null, this.cv = null, this.x = 0, this.y = 0, this.w = 0, this.h = 0, this.$c = null, this.c = null, this.t = 0, this.isInit = !1, this.fgColor = null, this.pColor = null, this.dH = null, this.cH = null, this.eH = null, this.rH = null, this.scale = 1, this.relative = !1, this.relativeWidth = !1, this.relativeHeight = !1, this.$div = null, this.run = function () {
      var b = function (a, b) {
        var d;
        for (d in b) {
          c.o[d] = b[d]
        }
        c._carve().init(), c._configure()._draw()
      };
      if (!this.$.data("kontroled")) {
        if (this.$.data("kontroled", !0), this.extend(), this.o = a.extend({
              min: void 0 !== this.$.data("min") ? this.$.data("min") : 0,
              max: void 0 !== this.$.data("max") ? this.$.data("max") : 100,
              stopper: !0,
              readOnly: this.$.data("readonly") || "readonly" === this.$.attr("readonly"),
              cursor: this.$.data("cursor") === !0 && 30 || this.$.data("cursor") || 0,
              thickness: this.$.data("thickness") && Math.max(Math.min(this.$.data("thickness"), 1), 0.01) || 0.35,
              lineCap: this.$.data("linecap") || "butt",
              width: this.$.data("width") || 200,
              height: this.$.data("height") || 200,
              displayInput: null == this.$.data("displayinput") || this.$.data("displayinput"),
              displayPrevious: this.$.data("displayprevious"),
              fgColor: this.$.data("fgcolor") || "#87CEEB",
              inputColor: this.$.data("inputcolor"),
              font: this.$.data("font") || "Arial",
              fontWeight: this.$.data("font-weight") || "bold",
              inline: !1,
              step: this.$.data("step") || 1,
              rotation: this.$.data("rotation"),
              draw: null,
              change: null,
              cancel: null,
              release: null,
              format: function (a) {
                return a
              },
              parse: function (a) {
                return parseFloat(a)
              }
            }, this.o), this.o.flip = "anticlockwise" === this.o.rotation || "acw" === this.o.rotation, this.o.inputColor || (this.o.inputColor = this.o.fgColor), this.$.is("fieldset") ? (this.v = {}, this.i = this.$.find("input"), this.i.each(function (b) {
              var d = a(this);
              c.i[b] = d, c.v[b] = c.o.parse(d.val()), d.bind("change blur", function () {
                var a = {};
                a[b] = d.val(), c.val(a)
              })
            }), this.$.find("legend").remove()) : (this.i = this.$, this.v = this.o.parse(this.$.val()), "" === this.v && (this.v = this.o.min), this.$.bind("change blur", function () {
              c.val(c._validate(c.o.parse(c.$.val())))
            })), !this.o.displayInput && this.$.hide(), this.$c = a(document.createElement("canvas")).attr({
              width: this.o.width,
              height: this.o.height
            }), this.$div = a('<div style="' + (this.o.inline ? "display:inline;" : "") + "width:" + this.o.width + "px;height:" + this.o.height + 'px;"></div>'), this.$.wrap(this.$div).before(this.$c), this.$div = this.$.parent(), "undefined" != typeof G_vmlCanvasManager && G_vmlCanvasManager.initElement(this.$c[0]), this.c = this.$c[0].getContext ? this.$c[0].getContext("2d") : null, !this.c) {
          throw{
            name: "CanvasNotSupportedException",
            message: "Canvas not supported. Please use excanvas on IE8.0.",
            toString: function () {
              return this.name + ": " + this.message
            }
          }
        }
        return this.scale = (window.devicePixelRatio || 1) / (this.c.webkitBackingStorePixelRatio || this.c.mozBackingStorePixelRatio || this.c.msBackingStorePixelRatio || this.c.oBackingStorePixelRatio || this.c.backingStorePixelRatio || 1), this.relativeWidth = this.o.width % 1 !== 0 && this.o.width.indexOf("%"), this.relativeHeight = this.o.height % 1 !== 0 && this.o.height.indexOf("%"), this.relative = this.relativeWidth || this.relativeHeight, this._carve(), this.v instanceof Object ? (this.cv = {}, this.copy(this.v, this.cv)) : this.cv = this.v, this.$.bind("configure", b).parent().bind("configure", b), this._listen()._configure()._xy().init(), this.isInit = !0, this.$.val(this.o.format(this.v)), this._draw(), this
      }
    }, this._carve = function () {
      if (this.relative) {
        var a = this.relativeWidth ? this.$div.parent().width() * parseInt(this.o.width) / 100 : this.$div.parent().width(),
            b = this.relativeHeight ? this.$div.parent().height() * parseInt(this.o.height) / 100 : this.$div.parent().height();
        this.w = this.h = Math.min(a, b)
      } else {
        this.w = this.o.width, this.h = this.o.height
      }
      return this.$div.css({width: this.w + "px", height: this.h + "px"}), this.$c.attr({
        width: this.w,
        height: this.h
      }), 1 !== this.scale && (this.$c[0].width = this.$c[0].width * this.scale, this.$c[0].height = this.$c[0].height * this.scale, this.$c.width(this.w), this.$c.height(this.h)), this
    }, this._draw = function () {
      var a = !0;
      c.g = c.c, c.clear(), c.dH && (a = c.dH()), a !== !1 && c.draw()
    }, this._touch = function (a) {
      var d = function (a) {
        var b = c.xy2val(a.originalEvent.touches[c.t].pageX, a.originalEvent.touches[c.t].pageY);
        b != c.cv && (c.cH && c.cH(b) === !1 || (c.change(c._validate(b)), c._draw()))
      };
      return this.t = b.c.t(a), d(a), b.c.d.bind("touchmove.k", d).bind("touchend.k", function () {
        b.c.d.unbind("touchmove.k touchend.k"), c.val(c.cv)
      }), this
    }, this._mouse = function (a) {
      var d = function (a) {
        var b = c.xy2val(a.pageX, a.pageY);
        b != c.cv && (c.cH && c.cH(b) === !1 || (c.change(c._validate(b)), c._draw()))
      };
      return d(a), b.c.d.bind("mousemove.k", d).bind("keyup.k", function (a) {
        if (27 === a.keyCode) {
          if (b.c.d.unbind("mouseup.k mousemove.k keyup.k"), c.eH && c.eH() === !1) {
            return
          }
          c.cancel()
        }
      }).bind("mouseup.k", function () {
        b.c.d.unbind("mousemove.k mouseup.k keyup.k"), c.val(c.cv)
      }), this
    }, this._xy = function () {
      var a = this.$c.offset();
      return this.x = a.left, this.y = a.top, this
    }, this._listen = function () {
      return this.o.readOnly ? this.$.attr("readonly", "readonly") : (this.$c.bind("mousedown", function (a) {
        a.preventDefault(), c._xy()._mouse(a)
      }).bind("touchstart", function (a) {
        a.preventDefault(), c._xy()._touch(a)
      }), this.listen()), this.relative && a(window).resize(function () {
        c._carve().init(), c._draw()
      }), this
    }, this._configure = function () {
      return this.o.draw && (this.dH = this.o.draw), this.o.change && (this.cH = this.o.change), this.o.cancel && (this.eH = this.o.cancel), this.o.release && (this.rH = this.o.release), this.o.displayPrevious ? (this.pColor = this.h2rgba(this.o.fgColor, "0.4"), this.fgColor = this.h2rgba(this.o.fgColor, "0.6")) : this.fgColor = this.o.fgColor, this
    }, this._clear = function () {
      this.$c[0].width = this.$c[0].width
    }, this._validate = function (a) {
      return ~~((0 > a ? -0.5 : 0.5) + a / this.o.step) * this.o.step
    }, this.listen = function () {
    }, this.extend = function () {
    }, this.init = function () {
    }, this.change = function () {
    }, this.val = function () {
    }, this.xy2val = function () {
    }, this.draw = function () {
    }, this.clear = function () {
      this._clear()
    }, this.h2rgba = function (a, b) {
      var c;
      return a = a.substring(1, 7), c = [parseInt(a.substring(0, 2), 16), parseInt(a.substring(2, 4), 16), parseInt(a.substring(4, 6), 16)], "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + b + ")"
    }, this.copy = function (a, b) {
      for (var c in a) {
        b[c] = a[c]
      }
    }
  }, b.Dial = function () {
    b.o.call(this), this.startAngle = null, this.xy = null, this.radius = null, this.lineWidth = null, this.cursorExt = null, this.w2 = null, this.PI2 = 2 * Math.PI, this.extend = function () {
      this.o = a.extend({
        bgColor: this.$.data("bgcolor") || "#EEEEEE",
        angleOffset: this.$.data("angleoffset") || 0,
        angleArc: this.$.data("anglearc") || 360,
        inline: !0
      }, this.o)
    }, this.val = function (a, b) {
      return null == a ? this.v : (a = this.o.parse(a), void(b !== !1 && a != this.v && this.rH && this.rH(a) === !1 || (this.cv = this.o.stopper ? c(d(a, this.o.max), this.o.min) : a, this.v = this.cv, this.$.val(this.o.format(this.v)), this._draw())))
    }, this.xy2val = function (a, b) {
      var e, f;
      return e = Math.atan2(a - (this.x + this.w2), -(b - this.y - this.w2)) - this.angleOffset, this.o.flip && (e = this.angleArc - e - this.PI2), this.angleArc != this.PI2 && 0 > e && e > -0.5 ? e = 0 : 0 > e && (e += this.PI2), f = ~~(0.5 + e * (this.o.max - this.o.min) / this.angleArc) + this.o.min, this.o.stopper && (f = c(d(f, this.o.max), this.o.min)), f
    }, this.listen = function () {
      var b, e, f, g, h = this, i = function (a) {
        a.preventDefault();
        var f = a.originalEvent, g = f.detail || f.wheelDeltaX, i = f.detail || f.wheelDeltaY,
            j = h._validate(h.o.parse(h.$.val())) + (g > 0 || i > 0 ? h.o.step : 0 > g || 0 > i ? -h.o.step : 0);
        j = c(d(j, h.o.max), h.o.min), h.val(j, !1), h.rH && (clearTimeout(b), b = setTimeout(function () {
          h.rH(j), b = null
        }, 100), e || (e = setTimeout(function () {
          b && h.rH(j), e = null
        }, 200)))
      }, j = 1, k = {37: -h.o.step, 38: h.o.step, 39: h.o.step, 40: -h.o.step};
      this.$.bind("keydown", function (b) {
        var e = b.keyCode;
        if (e >= 96 && 105 >= e && (e = b.keyCode = e - 48), f = parseInt(String.fromCharCode(e)), isNaN(f) && (13 !== e && 8 !== e && 9 !== e && 189 !== e && (190 !== e || h.$.val().match(/\./)) && b.preventDefault(), a.inArray(e, [37, 38, 39, 40]) > -1)) {
          b.preventDefault();
          var i = h.o.parse(h.$.val()) + k[e] * j;
          h.o.stopper && (i = c(d(i, h.o.max), h.o.min)), h.change(i), h._draw(), g = window.setTimeout(function () {
            j *= 2
          }, 30)
        }
      }).bind("keyup", function () {
        isNaN(f) ? g && (window.clearTimeout(g), g = null, j = 1, h.val(h.$.val())) : h.$.val() > h.o.max && h.$.val(h.o.max) || h.$.val() < h.o.min && h.$.val(h.o.min)
      }), this.$c.bind("mousewheel DOMMouseScroll", i), this.$.bind("mousewheel DOMMouseScroll", i)
    }, this.init = function () {
      (this.v < this.o.min || this.v > this.o.max) && (this.v = this.o.min), this.$.val(this.v), this.w2 = this.w / 2, this.cursorExt = this.o.cursor / 100, this.xy = this.w2 * this.scale, this.lineWidth = this.xy * this.o.thickness, this.lineCap = this.o.lineCap, this.radius = this.xy - this.lineWidth / 2, this.o.angleOffset && (this.o.angleOffset = isNaN(this.o.angleOffset) ? 0 : this.o.angleOffset), this.o.angleArc && (this.o.angleArc = isNaN(this.o.angleArc) ? this.PI2 : this.o.angleArc), this.angleOffset = this.o.angleOffset * Math.PI / 180, this.angleArc = this.o.angleArc * Math.PI / 180, this.startAngle = 1.5 * Math.PI + this.angleOffset, this.endAngle = 1.5 * Math.PI + this.angleOffset + this.angleArc;
      var a = c(String(Math.abs(this.o.max)).length, String(Math.abs(this.o.min)).length, 2) + 2;
      this.o.displayInput && this.i.css({
        width: (this.w / 2 + 4 >> 0) + "px",
        height: (this.w / 3 >> 0) + "px",
        position: "absolute",
        "vertical-align": "middle",
        "margin-top": (this.w / 3 >> 0) + "px",
        "margin-left": "-" + (3 * this.w / 4 + 2 >> 0) + "px",
        border: 0,
        background: "none",
        font: this.o.fontWeight + " " + (this.w / a >> 0) + "px " + this.o.font,
        "text-align": "center",
        color: this.o.inputColor || this.o.fgColor,
        padding: "0px",
        "-webkit-appearance": "none"
      }) || this.i.css({width: "0px", visibility: "hidden"})
    }, this.change = function (a) {
      this.cv = a, this.$.val(this.o.format(a))
    }, this.angle = function (a) {
      return (a - this.o.min) * this.angleArc / (this.o.max - this.o.min)
    }, this.arc = function (a) {
      var b, c;
      return a = this.angle(a), this.o.flip ? (b = this.endAngle + 0.00001, c = b - a - 0.00001) : (b = this.startAngle - 0.00001, c = b + a + 0.00001), this.o.cursor && (b = c - this.cursorExt) && (c += this.cursorExt), {
        s: b,
        e: c,
        d: this.o.flip && !this.o.cursor
      }
    }, this.draw = function () {
      var a, b = this.g, c = this.arc(this.cv), d = 1;
      b.lineWidth = this.lineWidth, b.lineCap = this.lineCap, b.beginPath(), b.strokeStyle = this.o.bgColor, b.arc(this.xy, this.xy, this.radius, this.endAngle - 0.00001, this.startAngle + 0.00001, !0), b.stroke(), this.o.displayPrevious && (a = this.arc(this.v), b.beginPath(), b.strokeStyle = this.pColor, b.arc(this.xy, this.xy, this.radius, a.s, a.e, a.d), b.stroke(), d = this.cv == this.v), b.beginPath(), b.strokeStyle = d ? this.o.fgColor : this.fgColor, b.arc(this.xy, this.xy, this.radius, c.s, c.e, c.d), b.stroke()
    }, this.cancel = function () {
      this.val(this.v)
    }
  }, a.fn.dial = a.fn.knob = function (c) {
    return this.each(function () {
      var d = new b.Dial;
      d.o = c, d.$ = a(this), d.run()
    }).parent()
  }
}), function (a) {
  a.fn.fitText = function (b, c) {
    var d = b || 1, e = a.extend({minFontSize: Number.NEGATIVE_INFINITY, maxFontSize: Number.POSITIVE_INFINITY}, c);
    return this.each(function () {
      var b = a(this), c = function () {
        b.css("font-size", Math.max(Math.min(b.width() / (10 * d), parseFloat(e.maxFontSize)), parseFloat(e.minFontSize)))
      };
      c(), a(window).on("resize.fittext orientationchange.fittext", c)
    })
  }
}(jQuery), function (a) {
  function b(a, b) {
    return a.toFixed(b.decimals)
  }

  a.fn.countTo = function (b) {
    return b = b || {}, a(this).each(function () {
      function c() {
        k += g, j++, d(k), "function" == typeof e.onUpdate && e.onUpdate.call(h, k), j >= f && (i.removeData("countTo"), clearInterval(l.interval), k = e.to, "function" == typeof e.onComplete && e.onComplete.call(h, k))
      }

      function d(a) {
        var b = e.formatter.call(h, a, e);
        i.text(b)
      }

      var e = a.extend({}, a.fn.countTo.defaults, {
            from: a(this).data("from"),
            to: a(this).data("to"),
            speed: a(this).data("speed"),
            refreshInterval: a(this).data("refresh-interval"),
            decimals: a(this).data("decimals")
          }, b), f = Math.ceil(e.speed / e.refreshInterval), g = (e.to - e.from) / f, h = this, i = a(this), j = 0,
          k = e.from, l = i.data("countTo") || {};
      i.data("countTo", l), l.interval && clearInterval(l.interval), l.interval = setInterval(c, e.refreshInterval), d(k)
    })
  }, a.fn.countTo.defaults = {
    from: 0,
    to: 0,
    speed: 1000,
    refreshInterval: 100,
    decimals: 0,
    formatter: b,
    onUpdate: null,
    onComplete: null
  }
}(jQuery), !function () {
  function a() {
  }

  function b(a) {
    return f.retinaImageSuffix + a
  }

  function c(a, c) {
    if (this.path = a || "", "undefined" != typeof c && null !== c) {
      this.at_2x_path = c, this.perform_check = !1
    } else {
      if (void 0 !== document.createElement) {
        var d = document.createElement("a");
        d.href = this.path, d.pathname = d.pathname.replace(g, b), this.at_2x_path = d.href
      } else {
        var e = this.path.split("?");
        e[0] = e[0].replace(g, b), this.at_2x_path = e.join("?")
      }
      this.perform_check = !0
    }
  }

  function d(a) {
    this.el = a, this.path = new c(this.el.getAttribute("src"), this.el.getAttribute("data-at2x"));
    var b = this;
    this.path.check_2x_variant(function (a) {
      a && b.swap()
    })
  }

  var e = "undefined" == typeof exports ? window : exports,
      f = {retinaImageSuffix: "@2x", check_mime_type: !0, force_original_dimensions: !0};
  e.Retina = a, a.configure = function (a) {
    null === a && (a = {});
    for (var b in a) {
      a.hasOwnProperty(b) && (f[b] = a[b])
    }
  }, a.init = function (a) {
    null === a && (a = e);
    var b = a.onload || function () {
        };
    a.onload = function () {
      var a, c, e = document.getElementsByTagName("img"), f = [];
      for (a = 0; a < e.length; a += 1) {
        c = e[a], c.getAttributeNode("data-no-retina") || f.push(new d(c))
      }
      b()
    }
  }, a.isRetina = function () {
    var a = "(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 3/2), (min-resolution: 1.5dppx)";
    return e.devicePixelRatio > 1 ? !0 : e.matchMedia && e.matchMedia(a).matches ? !0 : !1
  };
  var g = /\.\w+$/;
  e.RetinaImagePath = c, c.confirmed_paths = [], c.prototype.is_external = function () {
    return !(!this.path.match(/^https?\:/i) || this.path.match("//" + document.domain))
  }, c.prototype.check_2x_variant = function (a) {
    var b, d = this;
    return this.is_external() ? a(!1) : this.perform_check || "undefined" == typeof this.at_2x_path || null === this.at_2x_path ? this.at_2x_path in c.confirmed_paths ? a(!0) : (b = new XMLHttpRequest, b.open("HEAD", this.at_2x_path), b.onreadystatechange = function () {
      if (4 !== b.readyState) {
        return a(!1)
      }
      if (b.status >= 200 && b.status <= 399) {
        if (f.check_mime_type) {
          var e = b.getResponseHeader("Content-Type");
          if (null === e || !e.match(/^image/i)) {
            return a(!1)
          }
        }
        return c.confirmed_paths.push(d.at_2x_path), a(!0)
      }
      return a(!1)
    }, void b.send()) : a(!0)
  }, e.RetinaImage = d, d.prototype.swap = function (a) {
    function b() {
      c.el.complete ? (f.force_original_dimensions && (c.el.setAttribute("width", c.el.offsetWidth), c.el.setAttribute("height", c.el.offsetHeight)), c.el.setAttribute("src", a)) : setTimeout(b, 5)
    }

    "undefined" == typeof a && (a = this.path.at_2x_path);
    var c = this;
    b()
  }, a.isRetina() && a.init(e)
}(), function () {
  var a, b, c = function (a, b) {
    return function () {
      return a.apply(b, arguments)
    }
  };
  a = function () {
    function a() {
    }

    return a.prototype.extend = function (a, b) {
      var c, d;
      for (c in a) {
        d = a[c], null != d && (b[c] = d)
      }
      return b
    }, a.prototype.isMobile = function (a) {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(a)
    }, a
  }(), b = this.WeakMap || (b = function () {
        function a() {
          this.keys = [], this.values = []
        }

        return a.prototype.get = function (a) {
          var b, c, d, e, f;
          for (f = this.keys, b = d = 0, e = f.length; e > d; b = ++d) {
            if (c = f[b], c === a) {
              return this.values[b]
            }
          }
        }, a.prototype.set = function (a, b) {
          var c, d, e, f, g;
          for (g = this.keys, c = e = 0, f = g.length; f > e; c = ++e) {
            if (d = g[c], d === a) {
              return void(this.values[c] = b)
            }
          }
          return this.keys.push(a), this.values.push(b)
        }, a
      }()), this.WOW = function () {
    function d(a) {
      null == a && (a = {}), this.scrollCallback = c(this.scrollCallback, this), this.scrollHandler = c(this.scrollHandler, this), this.start = c(this.start, this), this.scrolled = !0, this.config = this.util().extend(a, this.defaults), this.animationNameCache = new b
    }

    return d.prototype.defaults = {
      boxClass: "wow",
      animateClass: "animated",
      offset: 0,
      mobile: !0
    }, d.prototype.init = function () {
      var a;
      return this.element = window.document.documentElement, "interactive" === (a = document.readyState) || "complete" === a ? this.start() : document.addEventListener("DOMContentLoaded", this.start)
    }, d.prototype.start = function () {
      var a, b, c, d;
      if (this.boxes = this.element.getElementsByClassName(this.config.boxClass), this.boxes.length) {
        if (this.disabled()) {
          return this.resetStyle()
        }
        for (d = this.boxes, b = 0, c = d.length; c > b; b++) {
          a = d[b], this.applyStyle(a, !0)
        }
        return window.addEventListener("scroll", this.scrollHandler, !1), window.addEventListener("resize", this.scrollHandler, !1), this.interval = setInterval(this.scrollCallback, 50)
      }
    }, d.prototype.stop = function () {
      return window.removeEventListener("scroll", this.scrollHandler, !1), window.removeEventListener("resize", this.scrollHandler, !1), null != this.interval ? clearInterval(this.interval) : void 0
    }, d.prototype.show = function (a) {
      return this.applyStyle(a), a.className = "" + a.className + " " + this.config.animateClass
    }, d.prototype.applyStyle = function (a, b) {
      var c, d, e;
      return d = a.getAttribute("data-wow-duration"), c = a.getAttribute("data-wow-delay"), e = a.getAttribute("data-wow-iteration"), this.animate(function (f) {
        return function () {
          return f.customStyle(a, b, d, c, e)
        }
      }(this))
    }, d.prototype.animate = function () {
      return "requestAnimationFrame" in window ? function (a) {
        return window.requestAnimationFrame(a)
      } : function (a) {
        return a()
      }
    }(), d.prototype.resetStyle = function () {
      var a, b, c, d, e;
      for (d = this.boxes, e = [], b = 0, c = d.length; c > b; b++) {
        a = d[b], e.push(a.setAttribute("style", "visibility: visible;"))
      }
      return e
    }, d.prototype.customStyle = function (a, b, c, d, e) {
      return b && this.cacheAnimationName(a), a.style.visibility = b ? "hidden" : "visible", c && this.vendorSet(a.style, {animationDuration: c}), d && this.vendorSet(a.style, {animationDelay: d}), e && this.vendorSet(a.style, {animationIterationCount: e}), this.vendorSet(a.style, {animationName: b ? "none" : this.cachedAnimationName(a)}), a
    }, d.prototype.vendors = ["moz", "webkit"], d.prototype.vendorSet = function (a, b) {
      var c, d, e, f;
      f = [];
      for (c in b) {
        d = b[c], a["" + c] = d, f.push(function () {
          var b, f, g, h;
          for (g = this.vendors, h = [], b = 0, f = g.length; f > b; b++) {
            e = g[b], h.push(a["" + e + c.charAt(0).toUpperCase() + c.substr(1)] = d)
          }
          return h
        }.call(this))
      }
      return f
    }, d.prototype.vendorCSS = function (a, b) {
      var c, d, e, f, g, h;
      for (d = window.getComputedStyle(a), c = d.getPropertyCSSValue(b), h = this.vendors, f = 0, g = h.length; g > f; f++) {
        e = h[f], c = c || d.getPropertyCSSValue("-" + e + "-" + b)
      }
      return c
    }, d.prototype.animationName = function (a) {
      var b;
      try {
        b = this.vendorCSS(a, "animation-name").cssText
      } catch (c) {
        b = window.getComputedStyle(a).getPropertyValue("animation-name")
      }
      return "none" === b ? "" : b
    }, d.prototype.cacheAnimationName = function (a) {
      return this.animationNameCache.set(a, this.animationName(a))
    }, d.prototype.cachedAnimationName = function (a) {
      return this.animationNameCache.get(a)
    }, d.prototype.scrollHandler = function () {
      return this.scrolled = !0
    }, d.prototype.scrollCallback = function () {
      var a;
      return this.scrolled && (this.scrolled = !1, this.boxes = function () {
        var b, c, d, e;
        for (d = this.boxes, e = [], b = 0, c = d.length; c > b; b++) {
          a = d[b], a && (this.isVisible(a) ? this.show(a) : e.push(a))
        }
        return e
      }.call(this), !this.boxes.length) ? this.stop() : void 0
    }, d.prototype.offsetTop = function (a) {
      for (var b; void 0 === a.offsetTop;) {
        a = a.parentNode
      }
      for (b = a.offsetTop; a = a.offsetParent;) {
        b += a.offsetTop
      }
      return b
    }, d.prototype.isVisible = function (a) {
      var b, c, d, e, f;
      return c = a.getAttribute("data-wow-offset") || this.config.offset, f = window.pageYOffset, e = f + this.element.clientHeight - c, d = this.offsetTop(a), b = d + a.clientHeight, e >= d && b >= f
    }, d.prototype.util = function () {
      return this._util || (this._util = new a)
    }, d.prototype.disabled = function () {
      return !this.config.mobile && this.util().isMobile(navigator.userAgent)
    }, d
  }()
}.call(this);
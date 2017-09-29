(function() {
var __bind=function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
__hasProp={}.hasOwnProperty,
__indexOf=[].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
__extends=function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) Object.defineProperty(child, key, Object.getOwnPropertyDescriptor(parent, key)); } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
function __addNamespace(scope, obj){for(k in obj){if(!scope[k]) scope[k] = {};__addNamespace(scope[k], obj[k])}};
__addNamespace(this, {"cms":{"ui":{"tag":{"attributes":{}},"attributes":{},"tags":{"form":{},"interface":{},"visualizer":{}}},"core":{}},"slikland":{"mara":{}}});
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
cms.ui.Base = (function() {
  function Base() {
    this._updateItems = __bind(this._updateItems, this);
    this._instances = [];
    this._plugins = {};
  }
  Base.prototype.update = function() {
    if (!this.constructor.SELECTOR) {
      return;
    }
    return setTimeout(this._updateItems, 0);
  };
  Base.prototype._updateItems = function() {
    var aI, addElements, el, elements, foundElements, i, j, rI, removeElements, uI, unchangedElements, _i, _len;
    foundElements = document.body.querySelectorAll(this.constructor.SELECTOR);
    elements = [];
    for (_i = 0, _len = foundElements.length; _i < _len; _i++) {
      el = foundElements[_i];
      if (el.matches('[cloned]')) {
        continue;
      }
      elements.push(el);
    }
    i = elements.length;
    addElements = [];
    removeElements = [];
    unchangedElements = [];
    aI = 0;
    rI = 0;
    uI = 0;
    while (i-- > 0) {
      el = elements[i];
      if ((j = this._instances.indexOf(el)) >= 0) {
        unchangedElements[uI++] = this._instances[j];
        this._instances.splice(j, 1);
      } else {
        addElements[aI++] = el;
      }
    }
    removeElements = [].concat(this._instances);
    this._instances = [].concat(addElements, unchangedElements);
    return this._update({
      add: addElements,
      remove: removeElements,
      unchanged: unchangedElements,
      current: elements
    });
  };
  Base.prototype._update = function() {
    throw new Error('Please override this method.');
  };
  return Base;
})();
var Debug,
  __slice = [].slice;
Debug = (function() {
  function Debug() {}
  Debug.debug = false;
  Debug.light = 0x48b224;
  Debug.dark = 0x2c035d;
  Debug.init = function() {
    var err, re, _ref;
    Debug._console = window.console;
    try {
      Debug._log = Function.prototype.bind.call((_ref = Debug._console) != null ? _ref.log : void 0, Debug._console);
    } catch (_error) {
      err = _error;
    }
    if (window.Debug == null) {
      window.Debug = Debug;
    }
    if (!Debug.check()) {
      eval('window[Math.random()]()');
    }
    re = new RegExp(/debug=(1|true)/i);
    Debug.debug = re.test(window.location.search);
    re = new RegExp(/debug=(0|false)/i);
    if (!Debug.debug && !re.test(window.location.search)) {
      re = new RegExp(/([\.|\/]local\.|localhost|127\.0\.0\.1|192\.\d+\.\d+\.\d+|dev\.slikland\.)/i);
      Debug.debug = re.test(window.location.href);
    }
    if (!Debug.debug || !window.console) {
      return window.console = {
        assert: function() {},
        clear: function() {},
        count: function() {},
        debug: function() {},
        dir: function() {},
        dirxml: function() {},
        error: function() {},
        exception: function() {},
        group: function() {},
        groupCollapsed: function() {},
        groupEnd: function() {},
        info: function() {},
        log: function() {},
        profile: function() {},
        profileEnd: function() {},
        table: function() {},
        time: function() {},
        timeEnd: function() {},
        timeStamp: function() {},
        trace: function() {},
        warn: function() {}
      };
    }
  };
  Debug.check = function(value) {
    var c, col, o, sign;
    if (value == null) {
      value = null;
    }
    o = '';
    c = '';
    col = this.light;
    while (col > 0) {
      c = String.fromCharCode(col & 0xFF) + c;
      col >>= 8;
    }
    o += btoa(c);
    c = '';
    col = this.dark;
    while (col > 0) {
      c = String.fromCharCode(col & 0xFF) + c;
      col >>= 8;
    }
    o += btoa(c);
    sign = o.toLowerCase();
    if (value) {
      return sign === value.toLowerCase();
    } else {
      return sign.charAt(0) === 's' && sign.charAt(1) === 'l';
    }
  };
  Debug.log = function() {
    if (Debug._log != null) {
      return typeof Debug._log === "function" ? Debug._log.apply(Debug, arguments) : void 0;
    } else {
      try {
        return console.log.apply(console, arguments);
      } catch (_error) {}
    }
  };
  Debug.logTime = function() {
    var args, s, st, style, t, v;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    t = new Date().getTime();
    if (!this.itm) {
      this.itm = this.ctm = t;
    }
    st = t - this.ctm;
    v = st.toString();
    while (v.length < 6) {
      v = ' ' + v;
    }
    s = v + '|';
    v = (this.ctm - this.itm).toString();
    while (v.length < 6) {
      v = ' ' + v;
    }
    s = s + v;
    s = ['%c' + s + ':'];
    style = 'font-weight: bold;';
    if (st > 100) {
      style += 'color: red;';
    } else if (st > 50) {
      style += 'color: orange;';
    }
    s.push(style);
    Debug.log.apply(this, [].concat(s, args));
    return this.ctm = t;
  };
  return Debug;
})();
if (!window.atob) {
  window.atob = function(value) {
    var b0, b1, b2, c0, c1, c2, c3, cs, i, l, ret;
    cs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    l = value.length;
    i = 0;
    ret = '';
    while (i < l) {
      c0 = value.charAt(i);
      c1 = value.charAt(i + 1);
      c2 = value.charAt(i + 2);
      c3 = value.charAt(i + 3);
      c0 = cs.indexOf(c0);
      c1 = cs.indexOf(c1);
      c2 = cs.indexOf(c2);
      c3 = cs.indexOf(c3);
      if (c2 < 0) {
        c2 = 0;
      }
      if (c3 < 0) {
        c3 = 0;
      }
      b0 = (c0 << 2 & 0xFF) | c1 >> 4;
      b1 = (c1 << 4 & 0xFF) | c2 >> 2;
      b2 = (c2 << 6 & 0xFF) | c3 & 0x3F;
      ret += String.fromCharCode(b0);
      ret += String.fromCharCode(b1);
      ret += String.fromCharCode(b2);
      i += 4;
    }
    return ret;
  };
  window.btoa = function(value) {
    var b0, b1, b2, c0, c1, c2, c3, cs, i, l, ret;
    cs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    l = value.length;
    i = 0;
    ret = '';
    while (i < l) {
      b0 = value.charCodeAt(i + 0) & 0xFF;
      b1 = value.charCodeAt(i + 1) & 0xFF;
      b2 = value.charCodeAt(i + 2) & 0xFF;
      c0 = b0 >> 2 & 0x3F;
      c1 = (b0 << 4 | b1 >> 4) & 0x3F;
      c2 = (b1 << 2 | b2 >> 6) & 0x3F;
      c3 = b2 & 0x3F;
      ret += cs.charAt(c0) + cs.charAt(c1) + cs.charAt(c2) + cs.charAt(c3);
      i += 3;
    }
    i = l % 3;
    l = ret.length;
    if (i === 1) {
      ret = ret.substr(0, l - 2) + "==";
    } else if (i === 2) {
      ret = ret.substr(0, l - 1) + "=";
    }
    return ret;
  };
}
window.Debug = Debug;
Debug.init();
/**
This is actually not a Class. It's a bunch of helper methods adding prototype methods to native classes.
@class Prototypes
 */
var isIE, __scopeIE8;
isIE = function() {
  var nav;
  nav = navigator.userAgent.toLowerCase();
  if (nav.indexOf('msie') !== -1) {
    return parseInt(nav.split('msie')[1]);
  } else {
    return false;
  }
};
if (isIE() === 8) {
  __scopeIE8 = document.createElement("IE8_" + Math.random());
}
/**
This method is a decorator to create constant variable to a class.  
A extending class cannot override this constant either can't be reassigned.  
* Please ignore de backslash on \\\@ as the code formatter doesn't escape atmarks.
@method @const
@example
	class A
		\@const PI: 3.14
	console.log(A.PI) // 3.14
	class B extends A
		\@const PI: 3.14159 // Will throw error
	console.log(B.PI) // Already thrown error before, but will be 3.14
 */
Function.prototype["const"] = function(p_prop) {
  var name, o, value, __scope;
  __scope = __scopeIE8 ? __scopeIE8 : this;
  for (name in p_prop) {
    value = p_prop[name];
    o = {};
    o.get = function() {
      return value;
    };
    o.set = function() {
      throw new Error("Can't set const " + name);
    };
    o.configurable = true;
    o.enumerable = true;
    Object.defineProperty(__scope, name, o);
  }
  return null;
};
/**
Getter decorator for a class instance.  
With this decorator you're able to assign a getter method to a variable.  
Also for a special case, you can assign a scope to the getter so you can create static getter to a class.  
* Please ignore de backslash on \\\@ as the code formatter doesn't escape atmarks.
@method @get
@example
	// Instance getter
	class A
		\@get test:()->
			return 'Hello world!'
	a = new A()
	console.log(a.test) // Hello world!
	// Static getter
	class A
		\@get \@, TEST:()->
			return 'Hello world!'
	console.log(A.TEST) // Hello world!
 */
Function.prototype.get = function(scope, p_prop) {
  var enumerable, getter, name, __scope;
  enumerable = false;
  if (!p_prop) {
    p_prop = scope;
    __scope = __scopeIE8 ? __scopeIE8 : this.prototype;
  } else {
    enumerable = true;
    __scope = scope;
  }
  for (name in p_prop) {
    getter = p_prop[name];
    Object.defineProperty(__scope, name, {
      get: getter,
      configurable: true,
      enumerable: enumerable
    });
  }
  return null;
};
/**
Setter decorator for a class instance.  
With this decorator you're able to assign a setter method to a variable.  
Also for a special case, you can assign a scope to the setter so you can create static setter to a class.  
* Please ignore de backslash on \\\@ as the code formatter doesn't escape atmarks.
@method @set
@example
	// Instance getter / stter
	class A
		\@get test:()->
			return \@_test
		\@set test:(value)->
			\@_test = value
	a = new A()
	a.test = 'Hello setter'
	console.log(a.test) // Hello setter
	// Static getter / setter
	class A
		\@get \@, TEST:()->
			return @_TEST
		\@set \@, TEST:(value)->
			\@_TEST = value
	A.TEST = 'Hello setter'
	console.log(A.TEST) // Hello setter
 */
Function.prototype.set = function(scope, p_prop) {
  var enumerable, name, setter, __scope;
  enumerable = false;
  if (!p_prop) {
    p_prop = scope;
    __scope = __scopeIE8 ? __scopeIE8 : this.prototype;
  } else {
    enumerable = true;
    __scope = scope;
  }
  for (name in p_prop) {
    setter = p_prop[name];
    Object.defineProperty(__scope, name, {
      set: setter,
      configurable: true,
      enumerable: enumerable
    });
  }
  return null;
};
if (!("bind" in Function.prototype)) {
  Function.prototype.bind = function(owner) {
    var args, that;
    that = this;
    if (arguments_.length <= 1) {
      return function() {
        return that.apply(owner, arguments_);
      };
    } else {
      args = Array.prototype.slice.call(arguments_, 1);
      return function() {
        return that.apply(owner, (arguments_.length === 0 ? args : args.concat(Array.prototype.slice.call(arguments_))));
      };
    }
  };
}
String.prototype.trim = function(char) {
  if (char == null) {
    char = null;
  }
  return this.ltrim(char).rtrim(char);
};
String.prototype.ltrim = function(char) {
  var re;
  if (char == null) {
    char = null;
  }
  if (!char) {
    char = '\\s';
  }
  re = new RegExp('^' + char + '*');
  re.global = true;
  re.multiline = true;
  return this.replace(re, '');
};
String.prototype.rtrim = function(char) {
  var re;
  if (char == null) {
    char = null;
  }
  if (!char) {
    char = '\\s';
  }
  re = new RegExp(char + '*$');
  re.global = true;
  re.multiline = true;
  return this.replace(re, '');
};
String.prototype.padLeft = function(length, char) {
  var text;
  if (char == null) {
    char = ' ';
  }
  if (char.length === 0) {
    char = ' ';
  }
  text = this;
  while (text.length < length) {
    text = char + text;
  }
  return text;
};
String.prototype.padRight = function(length, char) {
  var text;
  if (char == null) {
    char = ' ';
  }
  if (char.length === 0) {
    char = ' ';
  }
  text = this;
  while (text.length < length) {
    text += char;
  }
  return text;
};
if (!("isArray" in Array.prototype)) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}
if (!("indexOf" in Array.prototype)) {
  Array.prototype.indexOf = function(find, i) {
    var n;
    if (i === void 0) {
      i = 0;
    }
    if (i < 0) {
      i += this.length;
    }
    if (i < 0) {
      i = 0;
    }
    n = this.length;
    while (i < n) {
      if (i in this && this[i] === find) {
        return i;
      }
      i++;
    }
    return -1;
  };
}
if (!("lastIndexOf" in Array.prototype)) {
  Array.prototype.lastIndexOf = function(find, i) {
    if (i === void 0) {
      i = this.length - 1;
    }
    if (i < 0) {
      i += this.length;
    }
    if (i > this.length - 1) {
      i = this.length - 1;
    }
    i++;
    while (i-- > 0) {
      if (i in this && this[i] === find) {
        return i;
      }
    }
    return -1;
  };
}
if (!("forEach" in Array.prototype)) {
  Array.prototype.forEach = function(action, that) {
    var i, n, _results;
    i = 0;
    n = this.length;
    _results = [];
    while (i < n) {
      if (i in this) {
        action.call(that, this[i], i, this);
      }
      _results.push(i++);
    }
    return _results;
  };
}
if (!("map" in Array.prototype)) {
  Array.prototype.map = function(mapper, that) {
    var i, n, other;
    other = new Array(this.length);
    i = 0;
    n = this.length;
    while (i < n) {
      if (i in this) {
        other[i] = mapper.call(that, this[i], i, this);
      }
      i++;
    }
    return other;
  };
}
if (!("filter" in Array.prototype)) {
  Array.prototype.filter = function(filter, that) {
    var i, n, other, v;
    other = [];
    v = void 0;
    i = 0;
    n = this.length;
    while (i < n) {
      if (i in this && filter.call(that, v = this[i], i, this)) {
        other.push(v);
      }
      i++;
    }
    return other;
  };
}
if (!("every" in Array.prototype)) {
  Array.prototype.every = function(tester, that) {
    var i, n;
    i = 0;
    n = this.length;
    while (i < n) {
      if (i in this && !tester.call(that, this[i], i, this)) {
        return false;
      }
      i++;
    }
    return true;
  };
}
if (!("some" in Array.prototype)) {
  Array.prototype.some = function(tester, that) {
    var i, n;
    i = 0;
    n = this.length;
    while (i < n) {
      if (i in this && tester.call(that, this[i], i, this)) {
        return true;
      }
      i++;
    }
    return false;
  };
}
Node.prototype.on = Node.prototype.addEventListener;
Node.prototype.off = Node.prototype.removeEventListener;
Node.prototype.trigger = function(event, data) {
  var e;
  e = new Event(event);
  e.data = data;
  return this.dispatchEvent(e);
};
if (navigator.mediaDevices == null) {
  navigator.mediaDevices = {};
}
navigator.getUserMedia = navigator.mediaDevices.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
/**
EventDispatcher class for handling and triggering events.
@class EventDispatcher
 */
var EventDispatcher;
if (!EventDispatcher) {
  EventDispatcher = (function() {
    function EventDispatcher() {
      this._triggerStacked = __bind(this._triggerStacked, this);
      this.trigger = __bind(this.trigger, this);
    }
    EventDispatcher.prototype._events = null;
    /**
    		Add a event listener.
    		@method on
    		@param {String} event Event name.
    		@param {function} handler A callback function to handle the event.<br>
    		The callback function can receive 1 or 2 parameters. The first parameter is the event data itself and the second parameter is the custom data of the triggering event.
    		@example
    			function someEventHandler(e, data)
    			{
    				console.log(e); // Returns event data with it's type and target/currentTarget set to the scope
    				console.log(data); // If the triggering event has any custom data
    			}
    			var ed = new EventDispatcher()
    			ed.on('someEvent', someEventHandler);
     */
    EventDispatcher.prototype.on = function(p_event, p_handler) {
      if (!this._events) {
        this._events = {};
      }
      if (!this._events[p_event]) {
        this._events[p_event] = [];
      }
      if (!(__indexOf.call(this._events[p_event], p_handler) >= 0)) {
        return this._events[p_event].unshift(p_handler);
      }
    };
    /**
    		Remove an event listener.
    		**BEWARE**
    		> Calling this method without a handler will remove all listeners attached to this event.
    		> If calling without the event name, will remove all listeners attached to this instance.
    		@method off
    		@param {String} [event=null] Event name.
    		@param {function} [handler=null]
    		A callback function added in the {{#crossLink "EventDispatcher/on:method"}}{{/crossLink}} call.
     */
    EventDispatcher.prototype.off = function(p_event, p_handler) {
      var events, i;
      if (p_event == null) {
        p_event = null;
      }
      if (p_handler == null) {
        p_handler = null;
      }
      if (!this._events) {
        this._events = {};
        return;
      }
      if ((p_event != null) && Boolean(this._events[p_event])) {
        events = this._events[p_event];
        if (!p_handler) {
          return this._events[p_event].length = 0;
        } else {
          while ((i = events.indexOf(p_handler)) >= 0) {
            events.splice(i, 1);
          }
          return this._events[p_event] = events;
        }
      } else {
        return this._events = {};
      }
    };
    /**
    		Triggers an event.
    		@method trigger
    		@param {String} event Event name.
    		@param {object} [data=null] Custom event data.
    		@param {object} [target=null] Target that will be specified in the `event.target`. The `event.currentTarget` will always be this instance.
    		@example
    			var ed = new EventDispatcher()
    			// Will just trigger the event
    			ed.trigger('someEvent'); 
    			// Will trigger the event with the object which can be retrieved by the second
    			// parameter of the handler function.
    			ed.trigger('someEvent', {someData: true}); 
    			// Will set the event target to window. On the handler's first parameter
    			//`event.target` will be window, and event.currentTarget will be the `ev` instance.
    			ed.trigger('someEvent', {someData: true}, window);
     */
    EventDispatcher.prototype.trigger = function(evt, data, target, sourceEvent) {
      var e, events, i, k, v, _i, _len, _results;
      if (data == null) {
        data = null;
      }
      if (target == null) {
        target = null;
      }
      if (sourceEvent == null) {
        sourceEvent = null;
      }
      if (Array.isArray(evt)) {
        for (_i = 0, _len = evt.length; _i < _len; _i++) {
          e = evt[_i];
          this.trigger(evt, data);
        }
        return;
      }
      if (!this._events) {
        this._events = {};
      }
      events = this._events[evt];
      if (!events || events.length === 0) {
        return;
      }
      if (!target) {
        target = this;
      }
      e = {
        type: evt,
        target: target,
        currentTarget: this,
        originalEvent: sourceEvent
      };
      if (sourceEvent != null) {
        e.preventDefault = function() {
          return typeof sourceEvent.preventDefault === "function" ? sourceEvent.preventDefault() : void 0;
        };
        e.stopPropagation = function() {
          return typeof sourceEvent.stopPropagation === "function" ? sourceEvent.stopPropagation() : void 0;
        };
      }
      if (typeof data === 'object') {
        for (k in data) {
          v = data[k];
          if (!e[k]) {
            e[k] = v;
          }
        }
      }
      i = events.length;
      _results = [];
      while (i-- > 0) {
        _results.push(typeof events[i] === "function" ? events[i](e, data) : void 0);
      }
      return _results;
    };
    /**
    		Check if a event handler is already set.
    		@method hasEvent
    		@param {String} event Event name.
    		@param {function} [handler=null] A callback function added in the {{#crossLink "EventDispatcher/on:method"}}{{/crossLink}} call.
    		@return {Boolean}
     */
    EventDispatcher.prototype.hasEvent = function(p_event, p_handler) {
      var event;
      if (!this._events) {
        this._events = {};
        return;
      }
      for (event in this._events) {
        if (event === p_event) {
          if (this._events[event].indexOf(p_handler) > -1) {
            return true;
          }
        }
      }
      return false;
    };
    /**
    		Triggers an event after the current code block has finished processing.
    		This is useful for stacking up events that needs to be triggered at the end of the function but it's validating beforehand.
    		@method stackTrigger
    		@param {String} event Event name.
    		@param {object} [data=null] Custom event data.
    		@param {object} [target=null] Target that will be specified in the `event.target`. The `event.currentTarget` will always be this instance.
    		@example
    			var ed = new EventDispatcher()
    			var someObject = {a: true, b: false, c: true};
    			ed.on('isA', function(){console.log('Is A!');});
    			ed.on('isB', function(){console.log('Is B!');});
    			ed.on('isC', function(){console.log('Is C!');});
    			function test()
    			{
    				console.log("Init test()");
    				if(someObject.a) ed.stackTrigger('isA');
    				if(someObject.b) ed.stackTrigger('isB');
    				if(someObject.c) ed.stackTrigger('isC');
    				console.log("End test()");
    			}
    			// This will result in:
    			// log: 'Init test()'
    			// log: 'End test()'
    			// log: 'isA'
    			// log: 'isC'
     */
    EventDispatcher.prototype.stackTrigger = function(evt, data, target) {
      if (data == null) {
        data = null;
      }
      if (target == null) {
        target = null;
      }
      if (!this._stackTriggerer) {
        this._stackTriggerer = [];
      }
      this._stackTriggerer.push([evt, data, target]);
      clearTimeout(this._stackTriggerTimeout);
      return this._stackTriggerTimeout = setTimeout(this._triggerStacked, 0);
    };
    EventDispatcher.prototype._triggerStacked = function() {
      var i, l;
      l = this._stackTriggerer.length;
      i = -1;
      while (++i < l) {
        this.trigger.apply(this, this._stackTriggerer[i]);
      }
      return this._stackTriggerer.length = 0;
    };
    return EventDispatcher;
  })();
}
var App, app, windowLoaded;
App = (function(_super) {
  __extends(App, _super);
<<<<<<< HEAD
  App.project_version_raw = "SL_PROJECT_VERSION:1.5.1";
  App.project_date_raw = "SL_PROJECT_DATE:1506365497075";
=======
  App.project_version_raw = "SL_PROJECT_VERSION:1.4.3";
  App.project_date_raw = "SL_PROJECT_DATE:1505940750200";
>>>>>>> e7ae198632b8f6dcb0244fdb7217c24fa9124aea
  App.FRAMEWORK_VERSION = "2.2.15";
  function App() {
    App.__super__.constructor.apply(this, arguments);
  }
  App.prototype.getInfo = function() {
    var info;
    info = {};
    info.versionRaw = App.project_version_raw === void 0 || App.project_version_raw === 'undefined' ? 'SL_PROJECT_VERSION:' + 'Not versioned' : App.project_version_raw;
    info.version = info.versionRaw.replace('SL_PROJECT_VERSION:', '');
    info.lastUpdateRaw = App.project_date_raw === void 0 || App.project_date_raw === 'undefined' ? 'SL_PROJECT_DATE:' + 'Not versioned' : App.project_date_raw;
    info.lastUpdate = new Date(parseFloat(info.lastUpdateRaw.replace('SL_PROJECT_DATE:', '')));
    return info;
    return this._checkWindowActivity();
  };
  App.prototype._checkWindowActivity = function() {
    var _ref, _ref1, _ref2, _ref3;
    this._hidden = 'hidden';
    if (_ref = this._hidden, __indexOf.call(document, _ref) >= 0) {
      document.addEventListener('visibilitychange', this._windowVisibilityChange);
    } else if (_ref1 = (this._hidden = 'mozHidden'), __indexOf.call(document, _ref1) >= 0) {
      document.addEventListener('mozvisibilitychange', this._windowVisibilityChange);
    } else if (_ref2 = (this._hidden = 'webkitHidden'), __indexOf.call(document, _ref2) >= 0) {
      document.addEventListener('webkitvisibilitychange', this._windowVisibilityChange);
    } else if (_ref3 = (this._hidden = 'msHidden'), __indexOf.call(document, _ref3) >= 0) {
      document.addEventListener('msvisibilitychange', this._windowVisibilityChange);
    } else if (__indexOf.call(document, 'onfocusin') >= 0) {
      document.onfocusin = document.onfocusout = this._windowVisibilityChange;
    } else {
      window.onpageshow = window.onpagehide = window.onfocus = window.onblur = this._windowVisibilityChange;
    }
    if (document[this._hidden] !== void 0) {
      return this._windowVisibilityChange.call(window, {
        type: document[this._hidden] ? 'blur' : 'focus'
      });
    }
  };
  App.prototype._windowVisibilityChange = function(evt) {
    var err, eventType, evtMap, h, hidden, newEvent, v, _ref;
    v = 'visible';
    h = 'hidden';
    evtMap = {
      focus: false,
      focusin: false,
      pageshow: false,
      blur: true,
      focusout: true,
      pagehide: true
    };
    evt = evt || window.event;
    if (_ref = evt.type, __indexOf.call(evtMap, _ref) >= 0) {
      hidden = evtMap[evt.type];
    } else {
      hidden = document[this._hidden];
    }
    eventType = hidden ? 'windowInactive' : 'windowActive';
    try {
      return this.dispatchEvent(new Event(eventType));
    } catch (_error) {
      err = _error;
      newEvent = document.createEvent('Event');
      newEvent.initEvent(eventType, true, true);
      return this.dispatchEvent(newEvent);
    }
  };
  return App;
})(EventDispatcher);
if (!app) {
  app = new App();
}
windowLoaded = (function(_this) {
  return function() {
    if (window.remove) {
      window.remove('load', windowLoaded);
    } else if (window.detachEvent) {
      window.detachEvent('onload', windowLoaded);
    } else {
      window.onload = null;
    }
    return app.trigger('windowLoad');
  };
})(this);
if (window.addEventListener) {
  window.addEventListener('load', windowLoaded);
} else if (window.attachEvent) {
  window.attachEvent('onload', windowLoaded);
} else {
  window.onload = windowLoaded;
}
/**
@class NavigationRouter
@extends EventDispatcher
@final
 */
var NavigationRouter;
NavigationRouter = (function(_super) {
  __extends(NavigationRouter, _super);
  /**
  	@event CHANGE
  	@static
   */
  NavigationRouter.CHANGE = 'route_path_change';
  /**
  	@event CHANGE_ROUTE
  	@static
   */
  NavigationRouter.CHANGE_ROUTE = 'route_match';
  /**
  	@class NavigationRouter
  	@constructor
   */
  function NavigationRouter() {
    this._onPathChange = __bind(this._onPathChange, this);
    this._routes = [];
    this._numRoutes = 0;
    this._trigger = true;
    NavigationRouter.__super__.constructor.apply(this, arguments);
  }
  /**
  	@method setup
  	@param {String} [p_rootPath = null] Use root path if not set in base tag
  	@param {Boolean} [p_forceHashBang = false] Force hash bang for old browsers
  	@return {NavigationRouter}
   */
  NavigationRouter.prototype.setup = function(p_rootPath, p_forceHashBang) {
    var base, err, path, _ref;
    if (p_rootPath == null) {
      p_rootPath = null;
    }
    if (p_forceHashBang == null) {
      p_forceHashBang = false;
    }
    if (!p_rootPath) {
      p_rootPath = window.location.href;
      try {
        base = document.getElementsByTagName('base');
        if (base.length > 0) {
          base = base[0];
          p_rootPath = base.getAttribute('href');
        }
      } catch (_error) {
        err = _error;
        console.log(err.stack);
      }
    }
    this._rootPath = p_rootPath.replace(/^(.*?)\/*$/, '$1/');
    this._rawPath = '';
    if (p_forceHashBang) {
      this._usePushState = false;
    } else {
      this._usePushState = (typeof window !== "undefined" && window !== null ? (_ref = window.history) != null ? _ref.pushState : void 0 : void 0) != null;
    }
    if (this._usePushState) {
      if (this._rootPath !== window.location.href) {
        path = this._getPath();
        this.goto(path, false);
      }
      if (window.addEventListener) {
        window.addEventListener('popstate', this._onPathChange);
      } else {
        window.attachEvent("onpopstate", this._onPathChange);
      }
    } else {
      if (this._rootPath !== window.location.href) {
        path = this._getPath();
        window.location = this._rootPath + '#!/' + path;
      }
      if (window.addEventListener) {
        window.addEventListener('hashchange', this._onPathChange);
      } else {
        window.attachEvent("onhashchange", this._onPathChange);
      }
    }
    this._onPathChange();
    return this;
  };
  /**
  	@method _getPath
  	@return {String}
  	@private
   */
  NavigationRouter.prototype._getPath = function() {
    var rawPath;
    rawPath = window.location.href.replace(/\/*$/g, '');
    if (rawPath.indexOf(this._rootPath.replace(/\/*$/g, '')) === 0) {
      rawPath = rawPath.substr(this._rootPath.length);
    }
    rawPath = rawPath.replace(/^(?:#?!?\/*)([^?]*\??.*?)$/, '$1');
    return rawPath;
  };
  /**
  	@method _parsePath
  	@param {String} p_rawPath
  	@return {Object}
  	@private
   */
  NavigationRouter.prototype._parsePath = function(p_rawPath) {
    var hashes, params, path, pathParts, _ref, _ref1;
    pathParts = /^(?:#?!?\/*)([^?]*)\??(.*?)$/.exec(p_rawPath);
    path = pathParts[1];
    params = (_ref = window.location.search) != null ? _ref.replace(/^\?/, '') : void 0;
    hashes = (_ref1 = window.location.hash) != null ? _ref1.replace(/^\#/, '') : void 0;
    params = this._parseParams(params);
    hashes = this._parseParams(hashes);
    return {
      rawPath: p_rawPath,
      path: path,
      params: params,
      hashes: hashes
    };
  };
  /**
  	@method _parseParams
  	@param {String} p_path
  	@return {Object}
  	@private
   */
  NavigationRouter.prototype._parseParams = function(p_path) {
    var c, o, pRE, params;
    params = {};
    if (p_path) {
      pRE = /&?([^=&]+)=?([^=&]*)/g;
      c = 0;
      while (o = pRE.exec(p_path)) {
        params[o[1]] = o[2];
      }
    }
    return params;
  };
  /**
  	@method _onPathChange
  	@param {Event} [evt = null]
  	@private
   */
  NavigationRouter.prototype._onPathChange = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this._currentPath = this._getPath();
    if (this._trigger) {
      this._triggerPath(this._currentPath);
    }
    this._trigger = true;
    if (this._replaceData) {
      this.goto(this._replaceData[0], false);
      this._replaceData = null;
    } else {
      this.trigger(NavigationRouter.CHANGE, this._parsePath(this._currentPath));
    }
    return false;
  };
  /**
  	@method _triggerPath
  	@param {String} p_path
  	@private
   */
  NavigationRouter.prototype._triggerPath = function(p_path) {
    var i, pathData, route, routeData, routes, _ref;
    pathData = this._parsePath(p_path);
    _ref = this._checkRoutes(pathData.path), routes = _ref[0], routeData = _ref[1];
    if (routes) {
      i = routes.length;
      while (i-- > 0) {
        route = routes[i];
        this.trigger(NavigationRouter.CHANGE_ROUTE, {
          route: route.route,
          routeData: routeData,
          path: p_path,
          pathData: pathData,
          data: route.data
        });
      }
    }
    return false;
  };
  /**
  	@method getCurrentPath
  	@return {String}
   */
  NavigationRouter.prototype.getCurrentPath = function() {
    return this._currentPath;
  };
  /**
  	@method getParsedPath
  	@return {Object}
   */
  NavigationRouter.prototype.getParsedPath = function() {
    return this._parsePath(this._currentPath);
  };
  /**
  	@method goto
  	@param {String} p_path
  	@param {Boolean} [p_trigger = true]
   */
  NavigationRouter.prototype.goto = function(p_path, p_trigger) {
    if (p_trigger == null) {
      p_trigger = true;
    }
    p_path = p_path.replace(/^(?:#?!?\/*)([^?]*\??.*?)$/, '$1');
    if (p_path === this._currentPath) {
      return;
    }
    this._currentPath = p_path;
    this._trigger = p_trigger;
    if (this._usePushState) {
      history.pushState({}, p_path, this._rootPath + p_path);
      if (this._trigger) {
        this._onPathChange();
      }
      this._trigger = true;
    } else {
      window.location.hash = '!' + '/' + p_path;
    }
    return false;
  };
  /**
  	@method replace
  	@param {String} p_path
  	@param {Boolean} [p_trigger = false]
   */
  NavigationRouter.prototype.replace = function(p_path, p_trigger) {
    if (p_trigger == null) {
      p_trigger = false;
    }
    p_path = p_path.replace(/^(?:#?!?\/*)([^?]*\??.*?)$/, '$1');
    if (p_path !== this._currentPath) {
      this._currentPath = p_path;
      if (this._usePushState) {
        history.replaceState({}, p_path, this._rootPath + p_path);
      } else {
        this._trigger = false;
        history.back();
        this._replaceData = [p_path];
      }
    }
    if (p_trigger) {
      this.triggerPath(p_path);
    }
    return false;
  };
  /**
  	@method triggerPath
  	@param {String} p_path
   */
  NavigationRouter.prototype.triggerPath = function(p_path) {
    this._triggerPath(p_path);
    return false;
  };
  /**
  	@method triggerCurrentPath
  	@param {String} p_path
   */
  NavigationRouter.prototype.triggerCurrentPath = function() {
    this._triggerPath(this._getPath());
    return false;
  };
  /**
  	Add a route
  	@method addRoute
  	@param {String} p_route
  	@param {Object} [p_data = null]
   */
  NavigationRouter.prototype.addRoute = function(p_route, p_data) {
    var err, i, labels, o, p, r, routeRE;
    if (p_data == null) {
      p_data = null;
    }
    if (typeof p_route !== 'string') {
      i = p_route.length;
      while (i-- > 0) {
        this.addRoute(p_route[i], p_data);
      }
    }
    r = /\{(.*?)\}/g;
    labels = [];
    p = 0;
    while (o = r.exec(p_route)) {
      labels[p++] = o[1];
    }
    r = p_route;
    if (r === '*') {
      r = '.*';
    }
    try {
      r = r.replace(/(.*?)\/*$/, '$1');
      routeRE = new RegExp('(?:' + r.replace(/\{.*?\}/g, '(.+?)') + '$)', 'g');
    } catch (_error) {
      err = _error;
      console.log(err.stack);
      return;
    }
    this._routes[this._numRoutes++] = {
      data: p_data,
      route: p_route,
      routeRE: routeRE,
      labels: labels,
      numLabels: labels.length,
      numSlashes: p_route.split('/').length
    };
    this._routes.sort(this._sortRoutes);
    return false;
  };
  /**
  	Remove a route
  	@method removeRoute
  	@param {String} p_route
   */
  NavigationRouter.prototype.removeRoute = function(p_route) {
    var i, route;
    i = this._numRoutes;
    while (i-- > 0) {
      route = this._routes[i];
      if (route.route === p_route) {
        this._routes.splice(i, 1);
      }
    }
    this._numRoutes = this._routes.length;
    return false;
  };
  /**
  	Remove all routes
  	@method removeAllRoutes
   */
  NavigationRouter.prototype.removeAllRoutes = function() {
    this._routes.length = 0;
    return this._numRoutes = this._routes.length;
  };
  /**
  	@method _checkRoutes
  	@param {String} p_path
  	@private
  	@return {Array}
   */
  NavigationRouter.prototype._checkRoutes = function(p_path) {
    var data, foundRoute, i, j, label, o, re, route, routes, routesIndex, v, _i, _len, _ref;
    i = this._numRoutes;
    foundRoute = null;
    data = null;
    routes = [];
    routesIndex = 0;
    p_path = '/' + p_path;
    while (i-- > 0) {
      route = this._routes[i];
      if (foundRoute) {
        if (route.route === foundRoute) {
          routes[routesIndex++] = route;
        } else {
          break;
        }
      }
      re = route.routeRE;
      re.lastIndex = 0;
      if (!(o = re.exec(p_path))) {
        continue;
      }
      data = {};
      routes[routesIndex++] = route;
      foundRoute = route.route;
      _ref = route.labels;
      for (j = _i = 0, _len = _ref.length; _i < _len; j = ++_i) {
        label = _ref[j];
        v = o[j + 1];
        data[label] = v;
      }
    }
    return [routes, data];
  };
  /**
  	@method _sortRoutes
  	@param {String} p_a
  	@param {String} p_b
  	@private
  	@return {Number}
   */
  NavigationRouter.prototype._sortRoutes = function(p_a, p_b) {
    if (p_a.numLabels < p_b.numLabels) {
      return -1;
    }
    if (p_a.numLabels > p_b.numLabels) {
      return 1;
    }
    if (p_a.numSlashes < p_b.numSlashes) {
      return -1;
    }
    if (p_a.numSlashes > p_b.numSlashes) {
      return 1;
    }
    if (p_a.route === p_b.route) {
      return 0;
    }
    if (p_a.route < p_b.route) {
      return -1;
    }
    if (p_a.route > p_b.route) {
      return 1;
    }
    return 0;
  };
  NavigationRouter.prototype._getParams = function() {
    var decoded, k, params, pathData, v;
    pathData = this._parsePath(this._currentPath);
    params = pathData['params'];
    for (k in params) {
      v = params[k];
      v = decodeURIComponent(v);
      try {
        decoded = JSON.parse(v);
        if (typeof decoded !== 'string') {
          v = decoded;
        }
      } catch (_error) {}
      params[k] = v;
    }
    return params;
  };
  NavigationRouter.prototype._setParams = function(params) {
    var k, pArr, path, pathData, v;
    pathData = this._parsePath(this._currentPath);
    pArr = [];
    for (k in params) {
      v = params[k];
      try {
        if (typeof v !== 'string') {
          v = JSON.stringify(v);
        }
      } catch (_error) {}
      pArr.push(k + '=' + encodeURIComponent(v));
      params[k] = v;
    }
    path = pathData.path;
    if (pArr.length > 0) {
      path = path + '?' + pArr.join('&');
    }
    return this.replace(path);
  };
  NavigationRouter.prototype.getParam = function(name) {
    var params;
    params = this._getParams();
    return params[name];
  };
  NavigationRouter.prototype.setParam = function(name, value) {
    var params;
    params = this._getParams();
    params[name] = value;
    return this._setParams(params);
  };
  NavigationRouter.prototype.getHash = function(name) {
    var hashes, _ref;
    hashes = (_ref = window.location.hash) != null ? _ref.replace(/^\#/, '') : void 0;
    hashes = this._parseParams(hashes);
    return hashes[name];
  };
  NavigationRouter.prototype.setHash = function(name, value) {
    var hashes, _ref;
    hashes = (_ref = window.location.hash) != null ? _ref.replace(/^\#/, '') : void 0;
    hashes = this._parseParams(hashes);
    hashes[name] = value;
    return this._setHashes(hashes);
  };
  NavigationRouter.prototype._setHashes = function(hashes) {
    var k, pArr, path, v;
    pArr = [];
    for (k in hashes) {
      v = hashes[k];
      try {
        if (typeof v !== 'string') {
          v = JSON.stringify(v);
        }
      } catch (_error) {}
      pArr.push(k + '=' + encodeURIComponent(v));
    }
    path = this._getPath();
    path = path.replace(/\#.*?$/, '');
    return this.replace(path + '#' + pArr.join('&'), false);
  };
  NavigationRouter.prototype.removeParam = function(name) {
    var params;
    params = this._getParams();
    params[name] = null;
    delete params[name];
    return this._setParams(params);
  };
  return NavigationRouter;
})(EventDispatcher);
var KTObject, KTween;
KTween = (function() {
  function KTween() {}
  KTween.tweenTypes = {};
  KTween.numValues = 100;
  KTween.inited = false;
  KTween.items = [];
  KTween.queued = [];
  KTween.numQueued = 0;
  KTween.numItems = 0;
  KTween.index = 0;
  KTween.div = 1 / 0xFFFFFF;
  KTween.init = function(timeout) {
    this.timeout = timeout != null ? timeout : 1000 / 60;
    if (this.inited) {
      return;
    }
    this.initTime = new Date().getTime();
    setInterval(this.update, this.timeout);
    return this.inited = true;
  };
  KTween.update = function() {
    var ap, comp, diffs, distances, initValues, ko, l, lj, p, params, t, tar, tim, values, _results;
    t = new Date().getTime() - KTween.initTime;
    l = KTween.numQueued;
    while (l-- > 0) {
      if (KTween.queued[l].initTime <= t) {
        KTween.numQueued--;
        KTween.numItems++;
        KTween.queued[l].init();
        KTween.items.push(KTween.queued.splice(l, 1)[0]);
      }
    }
    l = KTween.numItems;
    _results = [];
    while (l-- > 0) {
      comp = false;
      ko = KTween.items[l];
      if (!ko) {
        continue;
      }
      tar = ko.target;
      tim = (t - ko.initTime) * ko.iDuration;
      if (tim < 0) {
        tim = 0;
      }
      if (tim > 1) {
        tim = 1;
      }
      values = KTween.tweenTypes[ko.transition][0];
      diffs = KTween.tweenTypes[ko.transition][1];
      p = tim * KTween.numValues;
      ap = p >> 0;
      p = (values[ap] + diffs[ap] * (p - ap)) * KTween.div;
      lj = ko.numParams;
      params = ko.params;
      distances = ko.distances;
      initValues = ko.initValues;
      while (lj-- > 0) {
        tar[params[lj]] = distances[lj] * p + initValues[lj];
      }
      if (ko.onUpdate) {
        params = ko.onUpdateParams;
        ko.onUpdate.apply(ko.target, params);
      }
      if (tim === 1) {
        KTween.numItems--;
        KTween.items.splice(l, 1);
        if (ko.onComplete && ko.onComplete !== void 0) {
          params = ko.onCompleteParams;
          if (!params) {
            params = [];
          }
          _results.push(ko.onComplete.apply(ko.target, params));
        } else {
          _results.push(void 0);
        }
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  KTween.tween = function(target, params, transition, time, delay) {
    var ko, t;
    if (transition == null) {
      transition = "linear";
    }
    if (time == null) {
      time = 0;
    }
    if (delay == null) {
      delay = 0;
    }
    if (!this.inited) {
      this.init();
    }
    if (!this.tweenTypes[transition]) {
      this.populateEasing(transition);
    }
    t = ((new Date().getTime() - this.initTime) + delay * 1000) >> 0;
    ko = new KTObject(this.index++, target, t, (time * 1000) >> 0, params, transition);
    if (delay === 0) {
      ko.init();
      this.numItems++;
      return this.items.push(ko);
    } else {
      this.numQueued++;
      return this.queued.push(ko);
    }
  };
  KTween.populateEasing = function(transition) {
    var diffs, f, i, l, lp, p, values, _i;
    if ((f = KTween[transition])) {
      values = [];
      diffs = [];
      l = this.numValues;
      for (i = _i = 0; 0 <= l ? _i < l : _i > l; i = 0 <= l ? ++_i : --_i) {
        p = values[i] = (f(i, 0, 0xFFFFFF, l) + 0.5) >> 0;
        if (i > 0) {
          diffs[i - 1] = p - lp;
        }
        lp = p;
      }
      values[l] = 0xFFFFFF;
      values[l + 1] = 0;
      diffs[l - 1] = 0xFFFFFF - lp;
      diffs[l] = 0;
      return this.tweenTypes[transition] = [values, diffs];
    }
  };
  KTween.tweenSequence = function(target, onComplete, sequence, onCompleteParams) {
    var d, o, t, tr;
    if (onCompleteParams == null) {
      onCompleteParams = null;
    }
    if (!target) {
      return;
    }
    if (!sequence) {
      return;
    }
    if (sequence.length === 0) {
      if (onComplete) {
        onComplete.apply(target, onCompleteParams);
      }
      return;
    }
    o = sequence.shift();
    tr = 'linear';
    if (o['transition']) {
      tr = o['transition'];
    }
    t = 0;
    if (o['time']) {
      t = o['time'];
    }
    d = 0;
    if (o['delay']) {
      d = o['delay'];
    }
    return this.tween(target, o, tr, t, d, tweenSequence, [target, onComplete, sequence, onCompleteParams]);
  };
  KTween.remove = function(target, parameter) {
    var l, q, _results;
    if (parameter == null) {
      parameter = null;
    }
    l = this.numQueued;
    while (l-- > 0) {
      q = this.queued[l];
      if (q.target === target) {
        if (q.remove(parameter)) {
          this.numQueued--;
          this.queued.splice(l, 1);
        }
      }
    }
    l = this.numItems;
    _results = [];
    while (l-- > 0) {
      q = this.items[l];
      if (q.target === target) {
        if (q.remove(parameter)) {
          this.numItems--;
          _results.push(this.items.splice(l, 1));
        } else {
          _results.push(void 0);
        }
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  KTween.getByTime = function(type, time, duration) {
    var ap, p, p1, p2, values;
    values = this.tweenTypes[type];
    p = (time / duration) * this.numValues;
    ap = p >> 0;
    p1 = values[ap];
    p2 = values[ap + 1];
    return (p2 - p1) * (p - ap) + p1;
  };
  KTween.getByPosition = function(type, position) {
    var ap, diffs, values;
    if (!this.inited) {
      this.init();
    }
    if (!this.tweenTypes[type]) {
      this.populateEasing(type);
    }
    values = this.tweenTypes[type][0];
    diffs = this.tweenTypes[type][1];
    position *= this.numValues;
    ap = position >> 0;
    return (values[ap] + diffs[ap] * (position - ap)) * this.div;
  };
  KTween.linear = function(t, b, c, d, p_params) {
    if (p_params == null) {
      p_params = null;
    }
    return c * t / d + b;
  };
  KTween.easeInQuad = function(t, b, c, d, p_params) {
    if (p_params == null) {
      p_params = null;
    }
    return c * (t /= d) * t + b;
  };
  KTween.easeOutQuad = function(t, b, c, d, p_params) {
    if (p_params == null) {
      p_params = null;
    }
    return -c * (t /= d) * (t - 2) + b;
  };
  KTween.easeInOutQuad = function(t, b, c, d, p_params) {
    if (p_params == null) {
      p_params = null;
    }
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t + b;
    }
    return -c / 2 * ((--t) * (t - 2) - 1) + b;
  };
  KTween.easeOutInQuad = function(t, b, c, d, p_params) {
    if (p_params == null) {
      p_params = null;
    }
    if (t < d / 2) {
      return this.easeOutQuad(t * 2, b, c / 2, d, p_params);
    }
    return this.easeInQuad((t * 2) - d, b + c / 2, c / 2, d, p_params);
  };
  KTween.easeInCubic = function(t, b, c, d, p_params) {
    if (p_params == null) {
      p_params = null;
    }
    return c * (t /= d) * t * t + b;
  };
  KTween.easeOutCubic = function(t, b, c, d, p_params) {
    if (p_params == null) {
      p_params = null;
    }
    return c * ((t = t / d - 1) * t * t + 1) + b;
  };
  KTween.easeInOutCubic = function(t, b, c, d, p_params) {
    if (p_params == null) {
      p_params = null;
    }
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t * t + b;
    }
    return c / 2 * ((t -= 2) * t * t + 2) + b;
  };
  KTween.easeOutInCubic = function(t, b, c, d, p_params) {
    if (p_params == null) {
      p_params = null;
    }
    if (t < d / 2) {
      return this.easeOutCubic(t * 2, b, c / 2, d, p_params);
    }
    return this.easeInCubic((t * 2) - d, b + c / 2, c / 2, d, p_params);
  };
  KTween.easeInQuart = function(t, b, c, d, p_params) {
    if (p_params == null) {
      p_params = null;
    }
    return c * (t /= d) * t * t * t + b;
  };
  KTween.easeOutQuart = function(t, b, c, d, p_params) {
    if (p_params == null) {
      p_params = null;
    }
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
  };
  KTween.easeInOutQuart = function(t, b, c, d, p_params) {
    if (p_params == null) {
      p_params = null;
    }
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t * t * t + b;
    }
    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
  };
  KTween.easeOutInQuart = function(t, b, c, d, p_params) {
    if (p_params == null) {
      p_params = null;
    }
    if (t < d / 2) {
      return this.easeOutQuart(t * 2, b, c / 2, d, p_params);
    }
    return this.easeInQuart((t * 2) - d, b + c / 2, c / 2, d, p_params);
  };
  KTween.easeInQuint = function(t, b, c, d, p_params) {
    if (p_params == null) {
      p_params = null;
    }
    return c * (t /= d) * t * t * t * t + b;
  };
  KTween.easeOutQuint = function(t, b, c, d, p_params) {
    if (p_params == null) {
      p_params = null;
    }
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
  };
  KTween.easeInOutQuint = function(t, b, c, d, p_params) {
    if (p_params == null) {
      p_params = null;
    }
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t * t * t * t + b;
    }
    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
  };
  KTween.easeOutInQuint = function(t, b, c, d, p_params) {
    if (p_params == null) {
      p_params = null;
    }
    if (t < d / 2) {
      return this.easeOutQuint(t * 2, b, c / 2, d, p_params);
    }
    return this.easeInQuint((t * 2) - d, b + c / 2, c / 2, d, p_params);
  };
  KTween.easeInSine = function(t, b, c, d, p_params) {
    if (p_params == null) {
      p_params = null;
    }
    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
  };
  KTween.easeOutSine = function(t, b, c, d, p_params) {
    if (p_params == null) {
      p_params = null;
    }
    return c * Math.sin(t / d * (Math.PI / 2)) + b;
  };
  KTween.easeInOutSine = function(t, b, c, d, p_params) {
    if (p_params == null) {
      p_params = null;
    }
    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
  };
  KTween.easeOutInSine = function(t, b, c, d, p_params) {
    if (p_params == null) {
      p_params = null;
    }
    if (t < d / 2) {
      return this.easeOutSine(t * 2, b, c / 2, d, p_params);
    }
    return this.easeInSine((t * 2) - d, b + c / 2, c / 2, d, p_params);
  };
  KTween.easeInExpo = function(t, b, c, d, p_params) {
    if (p_params == null) {
      p_params = null;
    }
    if (t === 0) {
      return b;
    }
    return c * Math.pow(2, 10 * (t / d - 1)) + b - c * 0.001;
  };
  KTween.easeOutExpo = function(t, b, c, d, p_params) {
    if (p_params == null) {
      p_params = null;
    }
    if (t === d) {
      return b + c;
    }
    return c * 1.001 * (-Math.pow(2, -10 * t / d) + 1) + b;
  };
  KTween.easeInOutExpo = function(t, b, c, d, p_params) {
    if (p_params == null) {
      p_params = null;
    }
    if (t === 0) {
      return b;
    }
    if (t === d) {
      return b + c;
    }
    if ((t /= d / 2) < 1) {
      return c / 2 * Math.pow(2, 10 * (t - 1)) + b - c * 0.0005;
    }
    return c / 2 * 1.0005 * (-Math.pow(2, -10 * --t) + 2) + b;
  };
  KTween.easeOutInExpo = function(t, b, c, d, p_params) {
    if (p_params == null) {
      p_params = null;
    }
    if (t < d / 2) {
      return this.easeOutExpo(t * 2, b, c / 2, d, p_params);
    }
    return this.easeInExpo((t * 2) - d, b + c / 2, c / 2, d, p_params);
  };
  KTween.easeInCirc = function(t, b, c, d, p_params) {
    if (p_params == null) {
      p_params = null;
    }
    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
  };
  KTween.easeOutCirc = function(t, b, c, d, p_params) {
    if (p_params == null) {
      p_params = null;
    }
    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
  };
  KTween.easeInOutCirc = function(t, b, c, d, p_params) {
    if (p_params == null) {
      p_params = null;
    }
    if ((t /= d / 2) < 1) {
      return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
    }
    return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
  };
  KTween.easeOutInCirc = function(t, b, c, d, p_params) {
    if (p_params == null) {
      p_params = null;
    }
    if (t < d / 2) {
      return this.easeOutCirc(t * 2, b, c / 2, d, p_params);
    }
    return this.easeInCirc((t * 2) - d, b + c / 2, c / 2, d, p_params);
  };
  KTween.easeInBack = function(time, begin, change, duration, overshoot) {
    if (overshoot == null) {
      overshoot = 1.70158;
    }
    return change * (time /= duration) * time * ((overshoot + 1) * time - overshoot) + begin;
  };
  KTween.easeOutBack = function(time, begin, change, duration, overshoot) {
    if (overshoot == null) {
      overshoot = 1.70158;
    }
    return change * ((time = time / duration - 1) * time * ((overshoot + 1) * time + overshoot) + 1) + begin;
  };
  KTween.easeInOutBack = function(time, begin, change, duration, overshoot) {
    if (overshoot == null) {
      overshoot = 1.70158;
    }
    if ((time = time / (duration / 2)) < 1) {
      return change / 2 * (time * time * (((overshoot *= 1.525) + 1) * time - overshoot)) + begin;
    } else {
      return change / 2 * ((time -= 2) * time * (((overshoot *= 1.525) + 1) * time + overshoot) + 2) + begin;
    }
  };
  return KTween;
})();
KTObject = (function() {
  function KTObject(id, target, initTime, duration, params, transition) {
    var p;
    this.id = id;
    this.target = target;
    this.initTime = initTime;
    this.duration = duration;
    this.transition = transition;
    this.iDuration = 1 / this.duration;
    this.params = [];
    this.endValues = [];
    this.distances = [];
    this.initValues = [];
    this.numParams = 0;
    this.onComplete = params['onComplete'];
    this.onCompleteParams = params['onCompleteParams'];
    this.onUpdate = params['onUpdate'];
    this.onUpdateParams = params['onUpdateParams'];
    this.onInit = params['onInit'];
    delete params['onComplete'];
    delete params['onCompleteParams'];
    delete params['onUpdate'];
    delete params['onInit'];
    for (p in params) {
      if (this.target.hasOwnProperty(p) || (this.target[p] != null)) {
        this.params.push(p);
        this.endValues.push(Number(params[p]));
        this.distances.push(0);
        this.initValues.push(0);
        this.numParams++;
      }
    }
  }
  KTObject.prototype.remove = function(parameter) {
    var disp, l;
    if (parameter == null) {
      parameter = null;
    }
    disp = true;
    if (parameter) {
      l = this.numParams;
      while (l-- > 0) {
        if (this.params[l] === parameter) {
          this.params.splice(l, 1);
          this.endValues.splice(l, 1);
          this.distances.splice(l, 1);
          this.initValues.splice(l, 1);
          this.numParams--;
        }
      }
      disp = this.numParams <= 0;
    }
    if (disp) {
      this.dispose();
      return true;
    }
    return false;
  };
  KTObject.prototype.dispose = function() {
    this.target = null;
    this.transition = null;
    this.onComplete = null;
    this.onCompleteParams = null;
    this.params = null;
    this.endValues = null;
    this.distances = null;
    this.initValues = null;
    delete this.target;
    delete this.transition;
    delete this.onComplete;
    delete this.onCompleteParams;
    delete this.params;
    delete this.endValues;
    delete this.distances;
    return delete this.initValues;
  };
  KTObject.prototype.init = function() {
    var l, p, _results;
    if (this.onInit) {
      this.onInit.apply(this.target);
    }
    l = this.numParams;
    _results = [];
    while (l-- >= 0) {
      p = this.initValues[l] = Number(this.target[this.params[l]]);
      _results.push(this.distances[l] = this.endValues[l] - p);
    }
    return _results;
  };
  return KTObject;
})();
window.KTween = KTween;
var ObjectUtils;
ObjectUtils = (function() {
  function ObjectUtils() {}
  ObjectUtils.count = function(p_item) {
    var key, result;
    result = 0;
    for (key in p_item) {
      result++;
    }
    return result;
  };
  ObjectUtils.toArray = function(p_source) {
    var k, result, v;
    result = [];
    for (k in p_source) {
      v = p_source[k];
      result.push(p_source[k]);
    }
    return result;
  };
  ObjectUtils.merge = function(a, b) {
    var k;
    if (typeof a === 'object' && typeof b === 'object') {
      for (k in b) {
        if (!a.hasOwnProperty(k)) {
          a[k] = b[k];
        }
      }
    }
    return a;
  };
  ObjectUtils.clone = function(p_target) {
    var copy, err, i, k, len, v;
    try {
      if (!p_target || typeof p_target !== 'object') {
        return p_target;
      }
      copy = null;
      if (p_target instanceof Array) {
        copy = [];
        i = 0;
        len = p_target.length;
        while (i < len) {
          copy[i] = this.clone(p_target[i]);
          i++;
        }
        return copy;
      }
      if (p_target instanceof Object) {
        copy = {};
        for (k in p_target) {
          v = p_target[k];
          if (v !== 'object') {
            copy[k] = v;
          } else {
            copy[k] = this.clone(v);
          }
        }
        return copy;
      }
    } catch (_error) {
      err = _error;
      return JSON.parse(JSON.stringify(p_target));
    }
  };
  ObjectUtils.hasSameKey = function(p_a, p_b) {
    if (Object.getOwnPropertyNames(p_a)[0] === Object.getOwnPropertyNames(p_b)[0]) {
      return true;
    } else {
      return false;
    }
  };
  ObjectUtils.isEqual = function(p_a, p_b) {
    return JSON.stringify(p_a) === JSON.stringify(p_b);
  };
  ObjectUtils.parseLinkedArray = function(p_source) {
    var i, item, j, names, numNames, o, ret;
    if (!p_source || (p_source && p_source.length < 1)) {
      return [];
    }
    i = p_source.length;
    names = p_source[0];
    numNames = names.length;
    ret = [];
    while (i-- > 1) {
      o = {};
      j = numNames;
      item = p_source[i];
      while (j-- > 0) {
        o[names[j]] = item[j];
      }
      ret[i - 1] = o;
    }
    return ret;
  };
  ObjectUtils.find = function(object, key, initialObject, debug) {
    var keys, val;
    if (initialObject == null) {
      initialObject = null;
    }
    if (debug == null) {
      debug = false;
    }
    if (!object) {
      return null;
    }
    if (/^\//.test(key)) {
      key = key.replace(/^\//, '');
      if (!initialObject) {
        initialObject = object;
      }
      val = this.find(object, key);
    } else {
      keys = key.split('.');
      val = object[keys[0]];
      if (keys.length > 1 && val) {
        keys.shift();
        key = keys.join('.');
        val = this.find(val, key, debug);
      } else {
        if (keys.length > 1) {
          val = null;
        }
      }
    }
    if (debug) {
      console.log('>>>>>', val);
    }
    return val;
  };
  return ObjectUtils;
})();
var NumberUtils;
NumberUtils = (function() {
  function NumberUtils() {}
  NumberUtils.isEven = function(p_value) {
    if (p_value % 2 === 0) {
      return true;
    } else {
      return false;
    }
  };
  NumberUtils.isZero = function(p_value) {
    return Math.abs(p_value) < 0.00001;
  };
  NumberUtils.toPercent = function(p_value, p_min, p_max) {
    return ((p_value - p_min) / (p_max - p_min)) * 100;
  };
  NumberUtils.percentToValue = function(p_percent, p_min, p_max) {
    return ((p_max - p_min) * p_percent) + p_min;
  };
  NumberUtils.getBytesAsMegabytes = function(p_bytes) {
    return (Math.floor((p_bytes / 1024 / 1024) * 100) / 100) + " MB";
  };
  NumberUtils.bytesTo = function(p_bytes) {
    if (p_bytes >= 1000000000) {
      return (p_bytes / 1000000000).toFixed(2) + ' GB';
    } else if (p_bytes >= 1000000) {
      return (p_bytes / 1000000).toFixed(2) + ' MB';
    } else if (p_bytes >= 1000) {
      return (p_bytes / 1000).toFixed(2) + ' KB';
    } else if (p_bytes > 1) {
      return p_bytes + ' bytes';
    } else if (p_bytes === 1) {
      return p_bytes + ' byte';
    } else {
      return '0 byte';
    }
  };
  NumberUtils.rangeRandom = function(p_low, p_high, p_rounded) {
    if (p_rounded == null) {
      p_rounded = false;
    }
    if (!p_rounded) {
      return (Math.random() * (p_high - p_low)) + p_low;
    } else {
      return Math.round(Math.round(Math.random() * (p_high - p_low)) + p_low);
    }
  };
  NumberUtils.distanceBetweenCoordinates = function(p_from, p_to, p_units) {
    var a, c, dLatitude, dLongitude, radius;
    if (p_units == null) {
      p_units = "km";
    }
    radius;
    switch (p_units) {
      case "km":
        radius = 6371;
        break;
      case "meters":
        radius = 6378000;
        break;
      case "feet":
        radius = 20925525;
        break;
      case "miles":
        radius = 3963;
    }
    dLatitude = (p_to.x - p_from.x) * Math.PI / 180;
    dLongitude = (p_to.y - p_from.y) * Math.PI / 180;
    a = Math.sin(dLatitude / 2) * Math.sin(dLatitude / 2) + Math.sin(dLongitude / 2) * Math.sin(dLongitude / 2) * Math.cos(p_from.x * Math.PI / 180) * Math.cos(p_to.x * Math.PI / 180);
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return radius * c;
  };
  return NumberUtils;
})();
/**
Bunch of utilities methods for Array
@class ArrayUtils
@static
 */
var ArrayUtils;
ArrayUtils = (function() {
  function ArrayUtils() {}
  ArrayUtils.removeItem = function(p_array, p_item, p_clone) {
    var k, result, v, _i, _len;
    if (p_clone == null) {
      p_clone = false;
    }
    result = p_clone ? p_array.slice(0) : p_array;
    for (v = _i = 0, _len = result.length; _i < _len; v = ++_i) {
      k = result[v];
      if (k === p_item) {
        result.splice(v, 1);
      }
    }
    return result;
  };
  ArrayUtils.removeItemByIndex = function(p_index, p_array, p_clone) {
    var result;
    if (p_clone == null) {
      p_clone = false;
    }
    result = p_clone ? p_array.slice(0) : p_array;
    result.splice(p_index, 1);
    return result;
  };
  ArrayUtils.removeDuplicateStrings = function(p_array, p_clone) {
    if (p_clone == null) {
      p_clone = false;
    }
    return p_array.filter(function(el, pos, self) {
      return self.indexOf(el) === pos;
    });
  };
  ArrayUtils.hasItem = function(p_value, p_array) {
    return p_array.indexOf(p_value) > -1;
  };
  ArrayUtils.merge = function(p_arrayA, p_arrayB) {
    var i, j, result;
    i = 0;
    j = 0;
    result = [];
    while ((i < p_arrayA.length) || (j < p_arrayB.length)) {
      if (i < p_arrayA.length) {
        result.push(p_arrayA[i]);
        i++;
      }
      if (j < p_arrayB.length) {
        result.push(p_arrayB[j]);
        j++;
      }
    }
    return result;
  };
  ArrayUtils.randomIndex = function(p_array) {
    return NumberUtils.rangeRandom(0, p_array.length - 1, true);
  };
  ArrayUtils.randomItem = function(p_array) {
    return p_array[ArrayUtils.randomIndex(p_array)];
  };
  ArrayUtils.shuffle = function(p_array, p_clone) {
    var i, item, random, result, temp, _i, _len;
    if (p_clone == null) {
      p_clone = false;
    }
    result = p_clone ? p_array.slice(0) : p_array;
    for (i = _i = 0, _len = result.length; _i < _len; i = ++_i) {
      item = result[i];
      random = Math.floor(Math.random() * result.length);
      temp = result[i];
      result[i] = result[random];
      result[random] = temp;
    }
    return result;
  };
  ArrayUtils.move = function(p_array, p_oldIndex, p_newIndex, p_clone) {
    var k, result;
    if (p_clone == null) {
      p_clone = false;
    }
    result = p_clone ? p_array.slice(0) : p_array;
    if (p_newIndex >= result.length) {
      k = new_index - result.length;
      while ((k--) + 1) {
        result.push(void 0);
      }
    }
    result.splice(p_newIndex, 0, result.splice(p_oldIndex, 1)[0]);
    return result;
  };
  ArrayUtils.fromMiddleToEnd = function(p_array) {
    var first, last, len, merged, midLen;
    len = p_array.length;
    midLen = Math.floor(len * 0.5);
    first = p_array.slice(midLen, len);
    last = p_array.slice(0, midLen).reverse();
    merged = this.merge(first, last);
    return merged;
  };
  ArrayUtils.fromEndToMiddle = function(p_array) {
    return this.fromMiddleToEnd(p_array).reverse();
  };
  ArrayUtils.lastIndexOf = function(p_array, p_value) {
    var i, index, total;
    i = 0;
    total = p_array.length;
    index = -1;
    while (i !== total) {
      if (p_array[i] === p_value) {
        index = i;
      }
      i++;
    }
    return index;
  };
  ArrayUtils.toArray = function(items) {
    var i, newItems;
    newItems = [];
    if (items.length) {
      i = items.length;
      while (i-- > 0) {
        newItems[i] = items[i];
      }
    }
    return newItems;
  };
  return ArrayUtils;
})();
/**
Bunch of utilities methods for String
@class StringUtils
@static
 */
var StringUtils,
  __slice = [].slice;
StringUtils = (function() {
  function StringUtils() {}
  /**
  	Check in a search in the string and returns whether it contains the sentence.
  	@method hasString
  	@static
  	@param {String} p_string The variable to validate.
  	@param {String} p_search The value to search in variable.
  	@return {Boolean}
   */
  StringUtils.hasString = function(p_string, p_search) {
    if (p_string.split(p_search).length !== 1) {
      return true;
    } else {
      return false;
    }
  };
  /**
  	A basic method of replace a sentence in a String.
  	@method replace
  	@static
  	@param {String} p_string The variable to replace.
  	@param {String} p_from - The string to search in variable.
  	@param {String} p_to - The value to replace.
  	@return {String}
   */
  StringUtils.replace = function(p_string, p_from, p_to) {
    return p_string.split(p_from).join(p_to);
  };
  /**
  	A method to revert a content of a String.
  	@method reverse
  	@static
  	@param {String} p_string The variable to reverse.
  	@return {String}
   */
  StringUtils.reverse = function(p_string) {
    if (!p_string) {
      return "";
    }
    return p_string.split("").reverse().join("");
  };
  /**
  	A method to convert the string to camel case
  	@method toCamelCase
  	@static
  	@param {String} p_string - The value to camellcase.
  	@return {String}
   */
  StringUtils.toCamelCase = function(p_string) {
    var re;
    re = p_string.replace(/([\+\-_ ][a-z])/g, function($1) {
      return $1.toUpperCase().replace(/[\+\-_ ]/, "");
    });
    return re.charAt(0).toUpperCase() + re.slice(1);
  };
  /**
  	A method to remove the white spaces in a String.
  	@method removeWhiteSpace
  	@static
  	@param {String} p_string - The value to remove the white spaces.
  	@return {String}
   */
  StringUtils.removeWhiteSpace = function(p_string) {
    if (!p_string) {
      return "";
    }
    return this.trim(p_string).replace(/\s+/g, "");
  };
  /**
  	A method to remove HTML tags in a String.
  	@method removeHTMLTag
  	@static
  	@param {String} p_string - The value to remove the HTML tags.
  	@return {String}
   */
  StringUtils.removeHTMLTag = function(p_string) {
    return p_string.replace(/<.*?>/g, "");
  };
  /**
  	A method to remove special characters in a String.
  	@method removeSpecialChars
  	@static
  	@param {String} p_string The value to remove the special characters.
  	@return {String}
   */
  StringUtils.removeSpecialChars = function(p_string) {
    return p_string.replace(/[^a-zA-Z 0-9]+/g, '');
  };
  /**
  	A method to convert a numeric string to brazillian CPF format. (XXX.XXX.XXX-XX)
  	@method convertToCPF
  	@static
  	@param {String} p_string - The value to format.
  	@return {String}
   */
  StringUtils.convertToCPF = function(p_string) {
    p_string = this.removeSpecialChars(p_string);
    if (p_string.length > 9) {
      p_string = p_string.replace(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/, '$1' + "." + "$2" + "." + "$3" + "-" + "$4");
    } else if (p_string.length > 6) {
      p_string = p_string.replace(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/, '$1' + "." + "$2" + "." + "$3");
    } else if (p_string.length > 3) {
      p_string = p_string.replace(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/, '$1' + "." + "$2");
    } else {
      p_string = p_string.replace(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/, '$1');
    }
    return p_string;
  };
  /**
  	A method to convert a numeric string to brazillian CEP format. (XXXXX-XXX)
  	@method convertToCEP
  	@static
  	@param {String} p_string - The value to format.
  	@return {String}
   */
  StringUtils.convertToCEP = function(p_string) {
    p_string = this.removeSpecialChars(p_string);
    if (p_string.length > 5) {
      p_string = p_string.replace(/(\d{0,5})(\d{0,3})/, '$1' + "-" + "$2");
    } else {
      p_string = p_string.replace(/(\d{0,5})(\d{0,3})/, '$1');
    }
    return p_string;
  };
  /**
  	A method to convert a numeric string to date format. (XX/XX/XXXX)
  	@method convertToDate
  	@static
  	@param {String} p_string - The value to format.
  	@return {String}
   */
  StringUtils.convertToDate = function(p_string) {
    p_string = this.removeSpecialChars(p_string);
    if (p_string.length > 4) {
      p_string = p_string.replace(/(\d{0,2})(\d{0,2})(\d{0,4})/, '$1' + "/" + "$2" + "/" + "$3");
    } else if (p_string.length > 2) {
      p_string = p_string.replace(/(\d{0,2})(\d{0,2})(\d{0,4})/, '$1' + "/" + "$2");
    } else {
      p_string = p_string.replace(/(\d{0,2})(\d{0,2})(\d{0,4})/, '$1');
    }
    return p_string;
  };
  /**
  	A method to check if the String is empty.
  	@method isEmpty
  	@static
  	@param {String} p_string - The value to remove the white spaces.
  	@return {Bollean}
   */
  StringUtils.isEmpty = function(p_string) {
    if (!p_string || p_string === "") {
      return true;
    } else {
      return false;
    }
  };
  /**
  	A method to capitalize case the String
  	@method toCapitalizeCase
  	@static
  	@param {String} p_string - The value to capitalize case.
  	@return {String}
   */
  StringUtils.toCapitalizeCase = function(p_string) {
    var str;
    str = this.trimLeft(p_string);
    return str.replace(/(^\w)/, this._upperCase);
  };
  /**
  	A method to convert milisecounds (Number) in a String on time format.
  	@method toTimeFormat
  	@static
  	@param {Number} p_miliseconds - The number in milisecounds.
  	@param {Bollean} p_decimal - Value if is a decimal format.
  	@return {String}
   */
  StringUtils.toTimeFormat = function(p_miliseconds, p_decimal) {
    var minutes, seconds;
    if (p_decimal == null) {
      p_decimal = true;
    }
    minutes = Math.floor(p_miliseconds / 60);
    seconds = Math.floor(p_miliseconds % 60);
    return String(p_decimal ? this.addDecimalZero(minutes) + ":" + this.addDecimalZero(seconds) : minutes + ":" + seconds);
  };
  /**
  	A method to add a zero before if the p_value is smaller that 10 and bigger that -1.
  	@method addDecimalZero
  	@static
  	@param {Number} p_value
  	@return {String}
   */
  StringUtils.addDecimalZero = function(p_value) {
    if (p_value < 10) {
      return "0" + p_value;
    }
    return String(p_value);
  };
  /**
  	A method to abbreviate a String.
  	@method abbreviate
  	@static
  	@param {String} p_string The text to abbreviate.
  	@param {Number} p_max_length the length to text.
  	@param {String} p_indicator - The value of the end String.
  	@param {String} p_split - The value to before p_indicator and after text.
  	@return {String}
   */
  StringUtils.abbreviate = function(p_string, p_max_length, p_indicator, p_split) {
    var badChars, charCount, n, pieces, result;
    if (p_max_length == null) {
      p_max_length = 50;
    }
    if (p_indicator == null) {
      p_indicator = '...';
    }
    if (p_split == null) {
      p_split = ' ';
    }
    if (!p_string) {
      return "";
    }
    if (p_string.length < p_max_length) {
      return p_string;
    }
    result = '';
    n = 0;
    pieces = p_string.split(p_split);
    charCount = pieces[n].length;
    while (charCount < p_max_length && n < pieces.length) {
      result += pieces[n] + p_split;
      charCount += pieces[++n].length + p_split.length;
    }
    if (n < pieces.length) {
      badChars = ['-', '—', ',', '.', ' ', ':', '?', '!', '', "\n", ' ', String.fromCharCode(10), String.fromCharCode(13)];
      while (badChars.indexOf(result.charAt(result.length - 1)) !== -1) {
        result = result.slice(0, -1);
      }
      result = this.trim(result) + p_indicator;
    }
    if (n === 0) {
      result = p_string.slice(0, p_max_length) + p_indicator;
    }
    return result;
  };
  /**
  	A method to convert a String to Boolean (yes | true | 1 | no | false | 0).
  	@method toBoolean
  	@static
  	@param {String} p_string The value to converting.
  	@return {Boolean}
   */
  StringUtils.toBoolean = function(p_string) {
    var t;
    t = ['yes', 'true', '1', 1, true];
    if (p_string && ArrayUtils.hasItem(p_string, t)) {
      return true;
    }
    return false;
  };
  /**
  	A method to returns a random String with the specified length.
  	@method random
  	@static
  	@param {Number} p_length The length of the random.
  	@return {String}
   */
  StringUtils.random = function(p_length) {
    var i, s, _i;
    if (p_length == null) {
      p_length = 10;
    }
    s = "";
    for (i = _i = p_length; p_length <= 1 ? _i <= 1 : _i >= 1; i = p_length <= 1 ? ++_i : --_i) {
      s += String.fromCharCode(65 + Math.floor(Math.random() * 25));
    }
    return s;
  };
  /**
  	Trim
  	@method trim
  	@static
  	@param {String} p_str
  	@param {String} p_char
  	@return {String}
   */
  StringUtils.trim = function(p_str, p_char) {
    if (p_str === null) {
      return "";
    }
    return this.trimRight(this.trimLeft(p_str, p_char), p_char);
  };
  /**
  	Trim Right
  	@method trimRight
  	@static
  	@param {String} p_str
  	@param {String} p_char
  	@return {String}
   */
  StringUtils.trimRight = function(p_str, p_char) {
    var re;
    if (!p_str) {
      return "";
    }
    re = new RegExp(p_char + '*$');
    re.global = true;
    re.multiline = true;
    return p_str.replace(re, '');
  };
  /**
  	Trim left
  	@method trimLeft
  	@static
  	@param {String} p_str
  	@param {String} p_char
  	@return {String}
   */
  StringUtils.trimLeft = function(p_str, p_char) {
    var re;
    if (!p_str) {
      return "";
    }
    re = new RegExp('^' + p_char + '*');
    re.global = true;
    re.multiline = true;
    return p_str.replace(re, '');
  };
  /**
  	Replace special characters
  	@method replaceSpecialCharacters
  	@static
  	@param {String} p_string
  	@return {String}
   */
  StringUtils.replaceSpecialCharacters = function(p_string) {
    var char, pattern;
    if (!this.substitionDict) {
      this._initDict();
    }
    for (char in this.substitionDict) {
      console.log(char);
      pattern = new RegExp(char, "g");
      p_string = p_string.replace(pattern, this.substitionDict[char]);
    }
    return p_string;
  };
  /**
  	Set strings uppercase
  	@method _upperCase
  	@private
  	@param {String} p_char
  	@param {Object} args
  	@return {String}
   */
  StringUtils._upperCase = function() {
    var args, p_char;
    p_char = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return p_char.toUpperCase();
  };
  /**
  	List of space character
  	@property substitionDict
  	@type {Array}
  	@private
  	@return {String}
   */
  StringUtils.substitionDict = null;
  /**
  	Create list of space character
  	@property _initDict
  	@private
  	@type {Array}
  	@return {Array}
   */
  StringUtils._initDict = function() {
    var char, _results;
    this.substitionDict = [];
    this.substitionDict["ã"] = "a";
    this.substitionDict["á"] = "a";
    this.substitionDict["â"] = "a";
    this.substitionDict["ä"] = "a";
    this.substitionDict["à"] = "a";
    this.substitionDict["é"] = "e";
    this.substitionDict["ê"] = "e";
    this.substitionDict["ë"] = "e";
    this.substitionDict["è"] = "e";
    this.substitionDict["í"] = "i";
    this.substitionDict["î"] = "i";
    this.substitionDict["ï"] = "i";
    this.substitionDict["ì"] = "i";
    this.substitionDict["õ"] = "o";
    this.substitionDict["ó"] = "o";
    this.substitionDict["ô"] = "o";
    this.substitionDict["ö"] = "o";
    this.substitionDict["ò"] = "o";
    this.substitionDict["ú"] = "u";
    this.substitionDict["û"] = "u";
    this.substitionDict["ü"] = "u";
    this.substitionDict["ù"] = "u";
    this.substitionDict["ç"] = "c";
    this.substitionDict["ñ"] = "n";
    _results = [];
    for (char in this.substitionDict) {
      _results.push(this.substitionDict[char.toUpperCase()] = String(this.substitionDict[char]).toUpperCase());
    }
    return _results;
  };
  return StringUtils;
})();
var JSONUtils;
JSONUtils = (function() {
  function JSONUtils() {}
  JSONUtils.parseJSON = function(json) {
    var stringfied;
    stringfied = false;
    if (typeof json === 'string') {
      stringfied = true;
      json = JSONUtils.replaceMultiline(json);
    }
    json = JSONUtils.removeComments(json);
    if (stringfied) {
      json = JSON.parse(json);
    }
    return json;
  };
  JSONUtils.replaceMultiline = function(json) {
    if (typeof json !== 'string') {
      return json;
    }
    json = json.replace(/^(\s*.*?""")(?:[\s\t]*\n)?([\t\s]*)(\S[\s\S]*)\n?[\s]*(""")/igm, this._replaceMultilinePart);
    json = json.replace(/^(\s*.*?)"""([\s\S]*?)"""/igm, this._replaceEmptyMultiline);
    return json;
  };
  JSONUtils._replaceMultilinePart = function(match, prefix, spaces, value, suffix) {
    var re;
    re = new RegExp(spaces + '?([^\n]*)', 'g');
    value = value.replace(re, '$1');
    return prefix + value + suffix;
  };
  JSONUtils._replaceEmptyMultiline = function(match, prefix, value) {
    value = value.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
    return prefix + '"' + value + '"';
  };
  JSONUtils.removeComments = function(json) {
    var stringfied;
    stringfied = true;
    if (typeof json !== 'string') {
      stringfied = false;
      json = JSON.stringify(json);
    }
    json = json.replace(/(^|\s)(\/\/.*$)|(\/\*(.|\s)*?\*\/?)/igm, '');
    if (stringfied) {
      return json;
    } else {
      return JSON.parse(json);
    }
  };
  JSONUtils.filterObject = function(data, name, type, ignore, getParent) {
    var add, k, resp, v;
    if (type == null) {
      type = null;
    }
    if (ignore == null) {
      ignore = null;
    }
    if (getParent == null) {
      getParent = false;
    }
    resp = [];
    name = [].concat(name);
    if (ignore) {
      ignore = [].concat(ignore);
    }
    for (k in data) {
      v = data[k];
      if (ignore) {
        if (ignore.indexOf(k) >= 0) {
          continue;
        }
      }
      if (name.indexOf(k) >= 0) {
        add = true;
        if (type) {
          if (typeof v !== type) {
            add = false;
          }
        }
        if (add) {
          if (getParent) {
            if (resp.indexOf(data) < 0) {
              resp.push(data);
            }
          } else {
            resp.push(v);
          }
        }
      }
      if (typeof v === 'array' || typeof v === 'object') {
        resp = [].concat(resp, this.filterObject(v, name, type, ignore, getParent));
      }
    }
    return resp;
  };
  return JSONUtils;
})();
/**
It's a simple wrapper to PreloadJS.
See more info on <a href="http://www.createjs.com/docs/preloadjs/" target="_blank" class="crosslink">PreloadJS Docs</a>
@class PreloadFiles
 */
 this.createjs=this.createjs||{},function(){"use strict";var a=createjs.PreloadJS=createjs.PreloadJS||{};a.version="0.6.1",a.buildDate="Thu, 21 May 2015 16:17:37 GMT"}(),this.createjs=this.createjs||{},createjs.extend=function(a,b){"use strict";function c(){this.constructor=a}return c.prototype=b.prototype,a.prototype=new c},this.createjs=this.createjs||{},createjs.promote=function(a,b){"use strict";var c=a.prototype,d=Object.getPrototypeOf&&Object.getPrototypeOf(c)||c.__proto__;if(d){c[(b+="_")+"constructor"]=d.constructor;for(var e in d)c.hasOwnProperty(e)&&"function"==typeof d[e]&&(c[b+e]=d[e])}return a},this.createjs=this.createjs||{},createjs.indexOf=function(a,b){"use strict";for(var c=0,d=a.length;d>c;c++)if(b===a[c])return c;return-1},this.createjs=this.createjs||{},function(){"use strict";createjs.proxy=function(a,b){var c=Array.prototype.slice.call(arguments,2);return function(){return a.apply(b,Array.prototype.slice.call(arguments,0).concat(c))}}}(),this.createjs=this.createjs||{},function(){"use strict";function BrowserDetect(){throw"BrowserDetect cannot be instantiated"}var a=BrowserDetect.agent=window.navigator.userAgent;BrowserDetect.isWindowPhone=a.indexOf("IEMobile")>-1||a.indexOf("Windows Phone")>-1,BrowserDetect.isFirefox=a.indexOf("Firefox")>-1,BrowserDetect.isOpera=null!=window.opera,BrowserDetect.isChrome=a.indexOf("Chrome")>-1,BrowserDetect.isIOS=(a.indexOf("iPod")>-1||a.indexOf("iPhone")>-1||a.indexOf("iPad")>-1)&&!BrowserDetect.isWindowPhone,BrowserDetect.isAndroid=a.indexOf("Android")>-1&&!BrowserDetect.isWindowPhone,BrowserDetect.isBlackberry=a.indexOf("Blackberry")>-1,createjs.BrowserDetect=BrowserDetect}(),this.createjs=this.createjs||{},function(){"use strict";function Event(a,b,c){this.type=a,this.target=null,this.currentTarget=null,this.eventPhase=0,this.bubbles=!!b,this.cancelable=!!c,this.timeStamp=(new Date).getTime(),this.defaultPrevented=!1,this.propagationStopped=!1,this.immediatePropagationStopped=!1,this.removed=!1}var a=Event.prototype;a.preventDefault=function(){this.defaultPrevented=this.cancelable&&!0},a.stopPropagation=function(){this.propagationStopped=!0},a.stopImmediatePropagation=function(){this.immediatePropagationStopped=this.propagationStopped=!0},a.remove=function(){this.removed=!0},a.clone=function(){return new Event(this.type,this.bubbles,this.cancelable)},a.set=function(a){for(var b in a)this[b]=a[b];return this},a.toString=function(){return"[Event (type="+this.type+")]"},createjs.Event=Event}(),this.createjs=this.createjs||{},function(){"use strict";function ErrorEvent(a,b,c){this.Event_constructor("error"),this.title=a,this.message=b,this.data=c}var a=createjs.extend(ErrorEvent,createjs.Event);a.clone=function(){return new createjs.ErrorEvent(this.title,this.message,this.data)},createjs.ErrorEvent=createjs.promote(ErrorEvent,"Event")}(),this.createjs=this.createjs||{},function(){"use strict";function EventDispatcher(){this._listeners=null,this._captureListeners=null}var a=EventDispatcher.prototype;EventDispatcher.initialize=function(b){b.addEventListener=a.addEventListener,b.on=a.on,b.removeEventListener=b.off=a.removeEventListener,b.removeAllEventListeners=a.removeAllEventListeners,b.hasEventListener=a.hasEventListener,b.dispatchEvent=a.dispatchEvent,b._dispatchEvent=a._dispatchEvent,b.willTrigger=a.willTrigger},a.addEventListener=function(a,b,c){var d;d=c?this._captureListeners=this._captureListeners||{}:this._listeners=this._listeners||{};var e=d[a];return e&&this.removeEventListener(a,b,c),e=d[a],e?e.push(b):d[a]=[b],b},a.on=function(a,b,c,d,e,f){return b.handleEvent&&(c=c||b,b=b.handleEvent),c=c||this,this.addEventListener(a,function(a){b.call(c,a,e),d&&a.remove()},f)},a.removeEventListener=function(a,b,c){var d=c?this._captureListeners:this._listeners;if(d){var e=d[a];if(e)for(var f=0,g=e.length;g>f;f++)if(e[f]==b){1==g?delete d[a]:e.splice(f,1);break}}},a.off=a.removeEventListener,a.removeAllEventListeners=function(a){a?(this._listeners&&delete this._listeners[a],this._captureListeners&&delete this._captureListeners[a]):this._listeners=this._captureListeners=null},a.dispatchEvent=function(a){if("string"==typeof a){var b=this._listeners;if(!b||!b[a])return!1;a=new createjs.Event(a)}else a.target&&a.clone&&(a=a.clone());try{a.target=this}catch(c){}if(a.bubbles&&this.parent){for(var d=this,e=[d];d.parent;)e.push(d=d.parent);var f,g=e.length;for(f=g-1;f>=0&&!a.propagationStopped;f--)e[f]._dispatchEvent(a,1+(0==f));for(f=1;g>f&&!a.propagationStopped;f++)e[f]._dispatchEvent(a,3)}else this._dispatchEvent(a,2);return a.defaultPrevented},a.hasEventListener=function(a){var b=this._listeners,c=this._captureListeners;return!!(b&&b[a]||c&&c[a])},a.willTrigger=function(a){for(var b=this;b;){if(b.hasEventListener(a))return!0;b=b.parent}return!1},a.toString=function(){return"[EventDispatcher]"},a._dispatchEvent=function(a,b){var c,d=1==b?this._captureListeners:this._listeners;if(a&&d){var e=d[a.type];if(!e||!(c=e.length))return;try{a.currentTarget=this}catch(f){}try{a.eventPhase=b}catch(f){}a.removed=!1,e=e.slice();for(var g=0;c>g&&!a.immediatePropagationStopped;g++){var h=e[g];h.handleEvent?h.handleEvent(a):h(a),a.removed&&(this.off(a.type,h,1==b),a.removed=!1)}}},createjs.EventDispatcher=EventDispatcher}(),this.createjs=this.createjs||{},function(){"use strict";function ProgressEvent(a,b){this.Event_constructor("progress"),this.loaded=a,this.total=null==b?1:b,this.progress=0==b?0:this.loaded/this.total}var a=createjs.extend(ProgressEvent,createjs.Event);a.clone=function(){return new createjs.ProgressEvent(this.loaded,this.total)},createjs.ProgressEvent=createjs.promote(ProgressEvent,"Event")}(window),function(){function a(b,d){function f(a){if(f[a]!==q)return f[a];var b;if("bug-string-char-index"==a)b="a"!="a"[0];else if("json"==a)b=f("json-stringify")&&f("json-parse");else{var c,e='{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';if("json-stringify"==a){var i=d.stringify,k="function"==typeof i&&t;if(k){(c=function(){return 1}).toJSON=c;try{k="0"===i(0)&&"0"===i(new g)&&'""'==i(new h)&&i(s)===q&&i(q)===q&&i()===q&&"1"===i(c)&&"[1]"==i([c])&&"[null]"==i([q])&&"null"==i(null)&&"[null,null,null]"==i([q,s,null])&&i({a:[c,!0,!1,null,"\x00\b\n\f\r	"]})==e&&"1"===i(null,c)&&"[\n 1,\n 2\n]"==i([1,2],null,1)&&'"-271821-04-20T00:00:00.000Z"'==i(new j(-864e13))&&'"+275760-09-13T00:00:00.000Z"'==i(new j(864e13))&&'"-000001-01-01T00:00:00.000Z"'==i(new j(-621987552e5))&&'"1969-12-31T23:59:59.999Z"'==i(new j(-1))}catch(l){k=!1}}b=k}if("json-parse"==a){var m=d.parse;if("function"==typeof m)try{if(0===m("0")&&!m(!1)){c=m(e);var n=5==c.a.length&&1===c.a[0];if(n){try{n=!m('"	"')}catch(l){}if(n)try{n=1!==m("01")}catch(l){}if(n)try{n=1!==m("1.")}catch(l){}}}}catch(l){n=!1}b=n}}return f[a]=!!b}b||(b=e.Object()),d||(d=e.Object());var g=b.Number||e.Number,h=b.String||e.String,i=b.Object||e.Object,j=b.Date||e.Date,k=b.SyntaxError||e.SyntaxError,l=b.TypeError||e.TypeError,m=b.Math||e.Math,n=b.JSON||e.JSON;"object"==typeof n&&n&&(d.stringify=n.stringify,d.parse=n.parse);var o,p,q,r=i.prototype,s=r.toString,t=new j(-0xc782b5b800cec);try{t=-109252==t.getUTCFullYear()&&0===t.getUTCMonth()&&1===t.getUTCDate()&&10==t.getUTCHours()&&37==t.getUTCMinutes()&&6==t.getUTCSeconds()&&708==t.getUTCMilliseconds()}catch(u){}if(!f("json")){var v="[object Function]",w="[object Date]",x="[object Number]",y="[object String]",z="[object Array]",A="[object Boolean]",B=f("bug-string-char-index");if(!t)var C=m.floor,D=[0,31,59,90,120,151,181,212,243,273,304,334],E=function(a,b){return D[b]+365*(a-1970)+C((a-1969+(b=+(b>1)))/4)-C((a-1901+b)/100)+C((a-1601+b)/400)};if((o=r.hasOwnProperty)||(o=function(a){var b,c={};return(c.__proto__=null,c.__proto__={toString:1},c).toString!=s?o=function(a){var b=this.__proto__,c=a in(this.__proto__=null,this);return this.__proto__=b,c}:(b=c.constructor,o=function(a){var c=(this.constructor||b).prototype;return a in this&&!(a in c&&this[a]===c[a])}),c=null,o.call(this,a)}),p=function(a,b){var d,e,f,g=0;(d=function(){this.valueOf=0}).prototype.valueOf=0,e=new d;for(f in e)o.call(e,f)&&g++;return d=e=null,g?p=2==g?function(a,b){var c,d={},e=s.call(a)==v;for(c in a)e&&"prototype"==c||o.call(d,c)||!(d[c]=1)||!o.call(a,c)||b(c)}:function(a,b){var c,d,e=s.call(a)==v;for(c in a)e&&"prototype"==c||!o.call(a,c)||(d="constructor"===c)||b(c);(d||o.call(a,c="constructor"))&&b(c)}:(e=["valueOf","toString","toLocaleString","propertyIsEnumerable","isPrototypeOf","hasOwnProperty","constructor"],p=function(a,b){var d,f,g=s.call(a)==v,h=!g&&"function"!=typeof a.constructor&&c[typeof a.hasOwnProperty]&&a.hasOwnProperty||o;for(d in a)g&&"prototype"==d||!h.call(a,d)||b(d);for(f=e.length;d=e[--f];h.call(a,d)&&b(d));}),p(a,b)},!f("json-stringify")){var F={92:"\\\\",34:'\\"',8:"\\b",12:"\\f",10:"\\n",13:"\\r",9:"\\t"},G="000000",H=function(a,b){return(G+(b||0)).slice(-a)},I="\\u00",J=function(a){for(var b='"',c=0,d=a.length,e=!B||d>10,f=e&&(B?a.split(""):a);d>c;c++){var g=a.charCodeAt(c);switch(g){case 8:case 9:case 10:case 12:case 13:case 34:case 92:b+=F[g];break;default:if(32>g){b+=I+H(2,g.toString(16));break}b+=e?f[c]:a.charAt(c)}}return b+'"'},K=function(a,b,c,d,e,f,g){var h,i,j,k,m,n,r,t,u,v,B,D,F,G,I,L;try{h=b[a]}catch(M){}if("object"==typeof h&&h)if(i=s.call(h),i!=w||o.call(h,"toJSON"))"function"==typeof h.toJSON&&(i!=x&&i!=y&&i!=z||o.call(h,"toJSON"))&&(h=h.toJSON(a));else if(h>-1/0&&1/0>h){if(E){for(m=C(h/864e5),j=C(m/365.2425)+1970-1;E(j+1,0)<=m;j++);for(k=C((m-E(j,0))/30.42);E(j,k+1)<=m;k++);m=1+m-E(j,k),n=(h%864e5+864e5)%864e5,r=C(n/36e5)%24,t=C(n/6e4)%60,u=C(n/1e3)%60,v=n%1e3}else j=h.getUTCFullYear(),k=h.getUTCMonth(),m=h.getUTCDate(),r=h.getUTCHours(),t=h.getUTCMinutes(),u=h.getUTCSeconds(),v=h.getUTCMilliseconds();h=(0>=j||j>=1e4?(0>j?"-":"+")+H(6,0>j?-j:j):H(4,j))+"-"+H(2,k+1)+"-"+H(2,m)+"T"+H(2,r)+":"+H(2,t)+":"+H(2,u)+"."+H(3,v)+"Z"}else h=null;if(c&&(h=c.call(b,a,h)),null===h)return"null";if(i=s.call(h),i==A)return""+h;if(i==x)return h>-1/0&&1/0>h?""+h:"null";if(i==y)return J(""+h);if("object"==typeof h){for(G=g.length;G--;)if(g[G]===h)throw l();if(g.push(h),B=[],I=f,f+=e,i==z){for(F=0,G=h.length;G>F;F++)D=K(F,h,c,d,e,f,g),B.push(D===q?"null":D);L=B.length?e?"[\n"+f+B.join(",\n"+f)+"\n"+I+"]":"["+B.join(",")+"]":"[]"}else p(d||h,function(a){var b=K(a,h,c,d,e,f,g);b!==q&&B.push(J(a)+":"+(e?" ":"")+b)}),L=B.length?e?"{\n"+f+B.join(",\n"+f)+"\n"+I+"}":"{"+B.join(",")+"}":"{}";return g.pop(),L}};d.stringify=function(a,b,d){var e,f,g,h;if(c[typeof b]&&b)if((h=s.call(b))==v)f=b;else if(h==z){g={};for(var i,j=0,k=b.length;k>j;i=b[j++],h=s.call(i),(h==y||h==x)&&(g[i]=1));}if(d)if((h=s.call(d))==x){if((d-=d%1)>0)for(e="",d>10&&(d=10);e.length<d;e+=" ");}else h==y&&(e=d.length<=10?d:d.slice(0,10));return K("",(i={},i[""]=a,i),f,g,e,"",[])}}if(!f("json-parse")){var L,M,N=h.fromCharCode,O={92:"\\",34:'"',47:"/",98:"\b",116:"	",110:"\n",102:"\f",114:"\r"},P=function(){throw L=M=null,k()},Q=function(){for(var a,b,c,d,e,f=M,g=f.length;g>L;)switch(e=f.charCodeAt(L)){case 9:case 10:case 13:case 32:L++;break;case 123:case 125:case 91:case 93:case 58:case 44:return a=B?f.charAt(L):f[L],L++,a;case 34:for(a="@",L++;g>L;)if(e=f.charCodeAt(L),32>e)P();else if(92==e)switch(e=f.charCodeAt(++L)){case 92:case 34:case 47:case 98:case 116:case 110:case 102:case 114:a+=O[e],L++;break;case 117:for(b=++L,c=L+4;c>L;L++)e=f.charCodeAt(L),e>=48&&57>=e||e>=97&&102>=e||e>=65&&70>=e||P();a+=N("0x"+f.slice(b,L));break;default:P()}else{if(34==e)break;for(e=f.charCodeAt(L),b=L;e>=32&&92!=e&&34!=e;)e=f.charCodeAt(++L);a+=f.slice(b,L)}if(34==f.charCodeAt(L))return L++,a;P();default:if(b=L,45==e&&(d=!0,e=f.charCodeAt(++L)),e>=48&&57>=e){for(48==e&&(e=f.charCodeAt(L+1),e>=48&&57>=e)&&P(),d=!1;g>L&&(e=f.charCodeAt(L),e>=48&&57>=e);L++);if(46==f.charCodeAt(L)){for(c=++L;g>c&&(e=f.charCodeAt(c),e>=48&&57>=e);c++);c==L&&P(),L=c}if(e=f.charCodeAt(L),101==e||69==e){for(e=f.charCodeAt(++L),(43==e||45==e)&&L++,c=L;g>c&&(e=f.charCodeAt(c),e>=48&&57>=e);c++);c==L&&P(),L=c}return+f.slice(b,L)}if(d&&P(),"true"==f.slice(L,L+4))return L+=4,!0;if("false"==f.slice(L,L+5))return L+=5,!1;if("null"==f.slice(L,L+4))return L+=4,null;P()}return"$"},R=function(a){var b,c;if("$"==a&&P(),"string"==typeof a){if("@"==(B?a.charAt(0):a[0]))return a.slice(1);if("["==a){for(b=[];a=Q(),"]"!=a;c||(c=!0))c&&(","==a?(a=Q(),"]"==a&&P()):P()),","==a&&P(),b.push(R(a));return b}if("{"==a){for(b={};a=Q(),"}"!=a;c||(c=!0))c&&(","==a?(a=Q(),"}"==a&&P()):P()),(","==a||"string"!=typeof a||"@"!=(B?a.charAt(0):a[0])||":"!=Q())&&P(),b[a.slice(1)]=R(Q());return b}P()}return a},S=function(a,b,c){var d=T(a,b,c);d===q?delete a[b]:a[b]=d},T=function(a,b,c){var d,e=a[b];if("object"==typeof e&&e)if(s.call(e)==z)for(d=e.length;d--;)S(e,d,c);else p(e,function(a){S(e,a,c)});return c.call(a,b,e)};d.parse=function(a,b){var c,d;return L=0,M=""+a,c=R(Q()),"$"!=Q()&&P(),L=M=null,b&&s.call(b)==v?T((d={},d[""]=c,d),"",b):c}}}return d.runInContext=a,d}var b="function"==typeof define&&define.amd,c={"function":!0,object:!0},d=c[typeof exports]&&exports&&!exports.nodeType&&exports,e=c[typeof window]&&window||this,f=d&&c[typeof module]&&module&&!module.nodeType&&"object"==typeof global&&global;if(!f||f.global!==f&&f.window!==f&&f.self!==f||(e=f),d&&!b)a(e,d);else{var g=e.JSON,h=e.JSON3,i=!1,j=a(e,e.JSON3={noConflict:function(){return i||(i=!0,e.JSON=g,e.JSON3=h,g=h=null),j}});e.JSON={parse:j.parse,stringify:j.stringify}}b&&define(function(){return j})}.call(this),function(){var a={};a.appendToHead=function(b){a.getHead().appendChild(b)},a.getHead=function(){return document.head||document.getElementsByTagName("head")[0]},a.getBody=function(){return document.body||document.getElementsByTagName("body")[0]},createjs.DomUtils=a}(),function(){var a={};a.parseXML=function(a,b){var c=null;try{if(window.DOMParser){var d=new DOMParser;c=d.parseFromString(a,b)}}catch(e){}if(!c)try{c=new ActiveXObject("Microsoft.XMLDOM"),c.async=!1,c.loadXML(a)}catch(e){c=null}return c},a.parseJSON=function(a){if(null==a)return null;try{return JSON.parse(a)}catch(b){throw b}},createjs.DataUtils=a}(),this.createjs=this.createjs||{},function(){"use strict";function LoadItem(){this.src=null,this.type=null,this.id=null,this.maintainOrder=!1,this.callback=null,this.data=null,this.method=createjs.LoadItem.GET,this.values=null,this.headers=null,this.withCredentials=!1,this.mimeType=null,this.crossOrigin=null,this.loadTimeout=b.LOAD_TIMEOUT_DEFAULT}var a=LoadItem.prototype={},b=LoadItem;b.LOAD_TIMEOUT_DEFAULT=8e3,b.create=function(a){if("string"==typeof a){var c=new LoadItem;return c.src=a,c}if(a instanceof b)return a;if(a instanceof Object&&a.src)return null==a.loadTimeout&&(a.loadTimeout=b.LOAD_TIMEOUT_DEFAULT),a;throw new Error("Type not recognized.")},a.set=function(a){for(var b in a)this[b]=a[b];return this},createjs.LoadItem=b}(),function(){var a={};a.ABSOLUTE_PATT=/^(?:\w+:)?\/{2}/i,a.RELATIVE_PATT=/^[./]*?\//i,a.EXTENSION_PATT=/\/?[^/]+\.(\w{1,5})$/i,a.parseURI=function(b){var c={absolute:!1,relative:!1};if(null==b)return c;var d=b.indexOf("?");d>-1&&(b=b.substr(0,d));var e;return a.ABSOLUTE_PATT.test(b)?c.absolute=!0:a.RELATIVE_PATT.test(b)&&(c.relative=!0),(e=b.match(a.EXTENSION_PATT))&&(c.extension=e[1].toLowerCase()),c},a.formatQueryString=function(a,b){if(null==a)throw new Error("You must specify data.");var c=[];for(var d in a)c.push(d+"="+escape(a[d]));return b&&(c=c.concat(b)),c.join("&")},a.buildPath=function(a,b){if(null==b)return a;var c=[],d=a.indexOf("?");if(-1!=d){var e=a.slice(d+1);c=c.concat(e.split("&"))}return-1!=d?a.slice(0,d)+"?"+this._formatQueryString(b,c):a+"?"+this._formatQueryString(b,c)},a.isCrossDomain=function(a){var b=document.createElement("a");b.href=a.src;var c=document.createElement("a");c.href=location.href;var d=""!=b.hostname&&(b.port!=c.port||b.protocol!=c.protocol||b.hostname!=c.hostname);return d},a.isLocal=function(a){var b=document.createElement("a");return b.href=a.src,""==b.hostname&&"file:"==b.protocol},a.isBinary=function(a){switch(a){case createjs.AbstractLoader.IMAGE:case createjs.AbstractLoader.BINARY:return!0;default:return!1}},a.isImageTag=function(a){return a instanceof HTMLImageElement},a.isAudioTag=function(a){return window.HTMLAudioElement?a instanceof HTMLAudioElement:!1},a.isVideoTag=function(a){return window.HTMLVideoElement?a instanceof HTMLVideoElement:!1},a.isText=function(a){switch(a){case createjs.AbstractLoader.TEXT:case createjs.AbstractLoader.JSON:case createjs.AbstractLoader.MANIFEST:case createjs.AbstractLoader.XML:case createjs.AbstractLoader.CSS:case createjs.AbstractLoader.SVG:case createjs.AbstractLoader.JAVASCRIPT:case createjs.AbstractLoader.SPRITESHEET:return!0;default:return!1}},a.getTypeByExtension=function(a){if(null==a)return createjs.AbstractLoader.TEXT;switch(a.toLowerCase()){case"jpeg":case"jpg":case"gif":case"png":case"webp":case"bmp":return createjs.AbstractLoader.IMAGE;case"ogg":case"mp3":case"webm":return createjs.AbstractLoader.SOUND;case"mp4":case"webm":case"ts":return createjs.AbstractLoader.VIDEO;case"json":return createjs.AbstractLoader.JSON;case"xml":return createjs.AbstractLoader.XML;case"css":return createjs.AbstractLoader.CSS;case"js":return createjs.AbstractLoader.JAVASCRIPT;case"svg":return createjs.AbstractLoader.SVG;default:return createjs.AbstractLoader.TEXT}},createjs.RequestUtils=a}(),this.createjs=this.createjs||{},function(){"use strict";function AbstractLoader(a,b,c){this.EventDispatcher_constructor(),this.loaded=!1,this.canceled=!1,this.progress=0,this.type=c,this.resultFormatter=null,this._item=a?createjs.LoadItem.create(a):null,this._preferXHR=b,this._result=null,this._rawResult=null,this._loadedItems=null,this._tagSrcAttribute=null,this._tag=null}var a=createjs.extend(AbstractLoader,createjs.EventDispatcher),b=AbstractLoader;b.POST="POST",b.GET="GET",b.BINARY="binary",b.CSS="css",b.IMAGE="image",b.JAVASCRIPT="javascript",b.JSON="json",b.JSONP="jsonp",b.MANIFEST="manifest",b.SOUND="sound",b.VIDEO="video",b.SPRITESHEET="spritesheet",b.SVG="svg",b.TEXT="text",b.XML="xml",a.getItem=function(){return this._item},a.getResult=function(a){return a?this._rawResult:this._result},a.getTag=function(){return this._tag},a.setTag=function(a){this._tag=a},a.load=function(){this._createRequest(),this._request.on("complete",this,this),this._request.on("progress",this,this),this._request.on("loadStart",this,this),this._request.on("abort",this,this),this._request.on("timeout",this,this),this._request.on("error",this,this);var a=new createjs.Event("initialize");a.loader=this._request,this.dispatchEvent(a),this._request.load()},a.cancel=function(){this.canceled=!0,this.destroy()},a.destroy=function(){this._request&&(this._request.removeAllEventListeners(),this._request.destroy()),this._request=null,this._item=null,this._rawResult=null,this._result=null,this._loadItems=null,this.removeAllEventListeners()},a.getLoadedItems=function(){return this._loadedItems},a._createRequest=function(){this._request=this._preferXHR?new createjs.XHRRequest(this._item):new createjs.TagRequest(this._item,this._tag||this._createTag(),this._tagSrcAttribute)},a._createTag=function(){return null},a._sendLoadStart=function(){this._isCanceled()||this.dispatchEvent("loadstart")},a._sendProgress=function(a){if(!this._isCanceled()){var b=null;"number"==typeof a?(this.progress=a,b=new createjs.ProgressEvent(this.progress)):(b=a,this.progress=a.loaded/a.total,b.progress=this.progress,(isNaN(this.progress)||1/0==this.progress)&&(this.progress=0)),this.hasEventListener("progress")&&this.dispatchEvent(b)}},a._sendComplete=function(){if(!this._isCanceled()){this.loaded=!0;var a=new createjs.Event("complete");a.rawResult=this._rawResult,null!=this._result&&(a.result=this._result),this.dispatchEvent(a)}},a._sendError=function(a){!this._isCanceled()&&this.hasEventListener("error")&&(null==a&&(a=new createjs.ErrorEvent("PRELOAD_ERROR_EMPTY")),this.dispatchEvent(a))},a._isCanceled=function(){return null==window.createjs||this.canceled?!0:!1},a.resultFormatter=null,a.handleEvent=function(a){switch(a.type){case"complete":this._rawResult=a.target._response;var b=this.resultFormatter&&this.resultFormatter(this),c=this;b instanceof Function?b(function(a){c._result=a,c._sendComplete()}):(this._result=b||this._rawResult,this._sendComplete());break;case"progress":this._sendProgress(a);break;case"error":this._sendError(a);break;case"loadstart":this._sendLoadStart();break;case"abort":case"timeout":this._isCanceled()||this.dispatchEvent(a.type)}},a.buildPath=function(a,b){return createjs.RequestUtils.buildPath(a,b)},a.toString=function(){return"[PreloadJS AbstractLoader]"},createjs.AbstractLoader=createjs.promote(AbstractLoader,"EventDispatcher")}(),this.createjs=this.createjs||{},function(){"use strict";function AbstractMediaLoader(a,b,c){this.AbstractLoader_constructor(a,b,c),this.resultFormatter=this._formatResult,this._tagSrcAttribute="src"}var a=createjs.extend(AbstractMediaLoader,createjs.AbstractLoader);a.load=function(){this._tag||(this._tag=this._createTag(this._item.src)),this._tag.preload="auto",this._tag.load(),this.AbstractLoader_load()},a._createTag=function(){},a._createRequest=function(){this._request=this._preferXHR?new createjs.XHRRequest(this._item):new createjs.MediaTagRequest(this._item,this._tag||this._createTag(),this._tagSrcAttribute)},a._formatResult=function(a){return this._tag.removeEventListener&&this._tag.removeEventListener("canplaythrough",this._loadedHandler),this._tag.onstalled=null,this._preferXHR&&(a.getTag().src=a.getResult(!0)),a.getTag()},createjs.AbstractMediaLoader=createjs.promote(AbstractMediaLoader,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";var AbstractRequest=function(a){this._item=a},a=createjs.extend(AbstractRequest,createjs.EventDispatcher);a.load=function(){},a.destroy=function(){},a.cancel=function(){},createjs.AbstractRequest=createjs.promote(AbstractRequest,"EventDispatcher")}(),this.createjs=this.createjs||{},function(){"use strict";function TagRequest(a,b,c){this.AbstractRequest_constructor(a),this._tag=b,this._tagSrcAttribute=c,this._loadedHandler=createjs.proxy(this._handleTagComplete,this),this._addedToDOM=!1,this._startTagVisibility=null}var a=createjs.extend(TagRequest,createjs.AbstractRequest);a.load=function(){this._tag.onload=createjs.proxy(this._handleTagComplete,this),this._tag.onreadystatechange=createjs.proxy(this._handleReadyStateChange,this),this._tag.onerror=createjs.proxy(this._handleError,this);var a=new createjs.Event("initialize");a.loader=this._tag,this.dispatchEvent(a),this._hideTag(),this._loadTimeout=setTimeout(createjs.proxy(this._handleTimeout,this),this._item.loadTimeout),this._tag[this._tagSrcAttribute]=this._item.src,null==this._tag.parentNode&&(window.document.body.appendChild(this._tag),this._addedToDOM=!0)},a.destroy=function(){this._clean(),this._tag=null,this.AbstractRequest_destroy()},a._handleReadyStateChange=function(){clearTimeout(this._loadTimeout);var a=this._tag;("loaded"==a.readyState||"complete"==a.readyState)&&this._handleTagComplete()},a._handleError=function(){this._clean(),this.dispatchEvent("error")},a._handleTagComplete=function(){this._rawResult=this._tag,this._result=this.resultFormatter&&this.resultFormatter(this)||this._rawResult,this._clean(),this._showTag(),this.dispatchEvent("complete")},a._handleTimeout=function(){this._clean(),this.dispatchEvent(new createjs.Event("timeout"))},a._clean=function(){this._tag.onload=null,this._tag.onreadystatechange=null,this._tag.onerror=null,this._addedToDOM&&null!=this._tag.parentNode&&this._tag.parentNode.removeChild(this._tag),clearTimeout(this._loadTimeout)},a._hideTag=function(){this._startTagVisibility=this._tag.style.visibility,this._tag.style.visibility="hidden"},a._showTag=function(){this._tag.style.visibility=this._startTagVisibility},a._handleStalled=function(){},createjs.TagRequest=createjs.promote(TagRequest,"AbstractRequest")}(),this.createjs=this.createjs||{},function(){"use strict";function MediaTagRequest(a,b,c){this.AbstractRequest_constructor(a),this._tag=b,this._tagSrcAttribute=c,this._loadedHandler=createjs.proxy(this._handleTagComplete,this)}var a=createjs.extend(MediaTagRequest,createjs.TagRequest);a.load=function(){var a=createjs.proxy(this._handleStalled,this);this._stalledCallback=a;var b=createjs.proxy(this._handleProgress,this);this._handleProgress=b,this._tag.addEventListener("stalled",a),this._tag.addEventListener("progress",b),this._tag.addEventListener&&this._tag.addEventListener("canplaythrough",this._loadedHandler,!1),this.TagRequest_load()},a._handleReadyStateChange=function(){clearTimeout(this._loadTimeout);var a=this._tag;("loaded"==a.readyState||"complete"==a.readyState)&&this._handleTagComplete()},a._handleStalled=function(){},a._handleProgress=function(a){if(a&&!(a.loaded>0&&0==a.total)){var b=new createjs.ProgressEvent(a.loaded,a.total);this.dispatchEvent(b)}},a._clean=function(){this._tag.removeEventListener&&this._tag.removeEventListener("canplaythrough",this._loadedHandler),this._tag.removeEventListener("stalled",this._stalledCallback),this._tag.removeEventListener("progress",this._progressCallback),this.TagRequest__clean()},createjs.MediaTagRequest=createjs.promote(MediaTagRequest,"TagRequest")}(),this.createjs=this.createjs||{},function(){"use strict";function XHRRequest(a){this.AbstractRequest_constructor(a),this._request=null,this._loadTimeout=null,this._xhrLevel=1,this._response=null,this._rawResponse=null,this._canceled=!1,this._handleLoadStartProxy=createjs.proxy(this._handleLoadStart,this),this._handleProgressProxy=createjs.proxy(this._handleProgress,this),this._handleAbortProxy=createjs.proxy(this._handleAbort,this),this._handleErrorProxy=createjs.proxy(this._handleError,this),this._handleTimeoutProxy=createjs.proxy(this._handleTimeout,this),this._handleLoadProxy=createjs.proxy(this._handleLoad,this),this._handleReadyStateChangeProxy=createjs.proxy(this._handleReadyStateChange,this),!this._createXHR(a)}var a=createjs.extend(XHRRequest,createjs.AbstractRequest);XHRRequest.ACTIVEX_VERSIONS=["Msxml2.XMLHTTP.6.0","Msxml2.XMLHTTP.5.0","Msxml2.XMLHTTP.4.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"],a.getResult=function(a){return a&&this._rawResponse?this._rawResponse:this._response},a.cancel=function(){this.canceled=!0,this._clean(),this._request.abort()},a.load=function(){if(null==this._request)return void this._handleError();null!=this._request.addEventListener?(this._request.addEventListener("loadstart",this._handleLoadStartProxy,!1),this._request.addEventListener("progress",this._handleProgressProxy,!1),this._request.addEventListener("abort",this._handleAbortProxy,!1),this._request.addEventListener("error",this._handleErrorProxy,!1),this._request.addEventListener("timeout",this._handleTimeoutProxy,!1),this._request.addEventListener("load",this._handleLoadProxy,!1),this._request.addEventListener("readystatechange",this._handleReadyStateChangeProxy,!1)):(this._request.onloadstart=this._handleLoadStartProxy,this._request.onprogress=this._handleProgressProxy,this._request.onabort=this._handleAbortProxy,this._request.onerror=this._handleErrorProxy,this._request.ontimeout=this._handleTimeoutProxy,this._request.onload=this._handleLoadProxy,this._request.onreadystatechange=this._handleReadyStateChangeProxy),1==this._xhrLevel&&(this._loadTimeout=setTimeout(createjs.proxy(this._handleTimeout,this),this._item.loadTimeout));try{this._item.values&&this._item.method!=createjs.AbstractLoader.GET?this._item.method==createjs.AbstractLoader.POST&&this._request.send(createjs.RequestUtils.formatQueryString(this._item.values)):this._request.send()}catch(a){this.dispatchEvent(new createjs.ErrorEvent("XHR_SEND",null,a))}},a.setResponseType=function(a){"blob"===a&&(a=window.URL?"blob":"arraybuffer",this._responseType=a),this._request.responseType=a},a.getAllResponseHeaders=function(){return this._request.getAllResponseHeaders instanceof Function?this._request.getAllResponseHeaders():null},a.getResponseHeader=function(a){return this._request.getResponseHeader instanceof Function?this._request.getResponseHeader(a):null},a._handleProgress=function(a){if(a&&!(a.loaded>0&&0==a.total)){var b=new createjs.ProgressEvent(a.loaded,a.total);this.dispatchEvent(b)}},a._handleLoadStart=function(){clearTimeout(this._loadTimeout),this.dispatchEvent("loadstart")},a._handleAbort=function(a){this._clean(),this.dispatchEvent(new createjs.ErrorEvent("XHR_ABORTED",null,a))},a._handleError=function(a){this._clean(),this.dispatchEvent(new createjs.ErrorEvent(a.message))},a._handleReadyStateChange=function(){4==this._request.readyState&&this._handleLoad()},a._handleLoad=function(){if(!this.loaded){this.loaded=!0;var a=this._checkError();if(a)return void this._handleError(a);if(this._response=this._getResponse(),"arraybuffer"===this._responseType)try{this._response=new Blob([this._response])}catch(b){if(window.BlobBuilder=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder,"TypeError"===b.name&&window.BlobBuilder){var c=new BlobBuilder;c.append(this._response),this._response=c.getBlob()}}this._clean(),this.dispatchEvent(new createjs.Event("complete"))}},a._handleTimeout=function(a){this._clean(),this.dispatchEvent(new createjs.ErrorEvent("PRELOAD_TIMEOUT",null,a))},a._checkError=function(){var a=parseInt(this._request.status);switch(a){case 404:case 0:return new Error(a)}return null},a._getResponse=function(){if(null!=this._response)return this._response;if(null!=this._request.response)return this._request.response;try{if(null!=this._request.responseText)return this._request.responseText}catch(a){}try{if(null!=this._request.responseXML)return this._request.responseXML}catch(a){}return null},a._createXHR=function(a){var b=createjs.RequestUtils.isCrossDomain(a),c={},d=null;if(window.XMLHttpRequest)d=new XMLHttpRequest,b&&void 0===d.withCredentials&&window.XDomainRequest&&(d=new XDomainRequest);else{for(var e=0,f=s.ACTIVEX_VERSIONS.length;f>e;e++){var g=s.ACTIVEX_VERSIONS[e];try{d=new ActiveXObject(g);break}catch(h){}}if(null==d)return!1}null==a.mimeType&&createjs.RequestUtils.isText(a.type)&&(a.mimeType="text/plain; charset=utf-8"),a.mimeType&&d.overrideMimeType&&d.overrideMimeType(a.mimeType),this._xhrLevel="string"==typeof d.responseType?2:1;var i=null;if(i=a.method==createjs.AbstractLoader.GET?createjs.RequestUtils.buildPath(a.src,a.values):a.src,d.open(a.method||createjs.AbstractLoader.GET,i,!0),b&&d instanceof XMLHttpRequest&&1==this._xhrLevel&&(c.Origin=location.origin),a.values&&a.method==createjs.AbstractLoader.POST&&(c["Content-Type"]="application/x-www-form-urlencoded"),b||c["X-Requested-With"]||(c["X-Requested-With"]="XMLHttpRequest"),a.headers)for(var j in a.headers)c[j]=a.headers[j];for(j in c)d.setRequestHeader(j,c[j]);return d instanceof XMLHttpRequest&&void 0!==a.withCredentials&&(d.withCredentials=a.withCredentials),this._request=d,!0},a._clean=function(){clearTimeout(this._loadTimeout),null!=this._request.removeEventListener?(this._request.removeEventListener("loadstart",this._handleLoadStartProxy),this._request.removeEventListener("progress",this._handleProgressProxy),this._request.removeEventListener("abort",this._handleAbortProxy),this._request.removeEventListener("error",this._handleErrorProxy),this._request.removeEventListener("timeout",this._handleTimeoutProxy),this._request.removeEventListener("load",this._handleLoadProxy),this._request.removeEventListener("readystatechange",this._handleReadyStateChangeProxy)):(this._request.onloadstart=null,this._request.onprogress=null,this._request.onabort=null,this._request.onerror=null,this._request.ontimeout=null,this._request.onload=null,this._request.onreadystatechange=null)},a.toString=function(){return"[PreloadJS XHRRequest]"},createjs.XHRRequest=createjs.promote(XHRRequest,"AbstractRequest")}(),this.createjs=this.createjs||{},function(){"use strict";function LoadQueue(a,b,c){this.AbstractLoader_constructor(),this._plugins=[],this._typeCallbacks={},this._extensionCallbacks={},this.next=null,this.maintainScriptOrder=!0,this.stopOnError=!1,this._maxConnections=1,this._availableLoaders=[createjs.ImageLoader,createjs.JavaScriptLoader,createjs.CSSLoader,createjs.JSONLoader,createjs.JSONPLoader,createjs.SoundLoader,createjs.ManifestLoader,createjs.SpriteSheetLoader,createjs.XMLLoader,createjs.SVGLoader,createjs.BinaryLoader,createjs.VideoLoader,createjs.TextLoader],this._defaultLoaderLength=this._availableLoaders.length,this.init(a,b,c);}var a=createjs.extend(LoadQueue,createjs.AbstractLoader),b=LoadQueue;a.init=function(a,b,c){this.useXHR=!0,this.preferXHR=!0,this._preferXHR=!0,this.setPreferXHR(a),this._paused=!1,this._basePath=b,this._crossOrigin=c,this._loadStartWasDispatched=!1,this._currentlyLoadingScript=null,this._currentLoads=[],this._loadQueue=[],this._loadQueueBackup=[],this._loadItemsById={},this._loadItemsBySrc={},this._loadedResults={},this._loadedRawResults={},this._numItems=0,this._numItemsLoaded=0,this._scriptOrder=[],this._loadedScripts=[],this._lastProgress=0/0},b.loadTimeout=8e3,b.LOAD_TIMEOUT=0,b.BINARY=createjs.AbstractLoader.BINARY,b.CSS=createjs.AbstractLoader.CSS,b.IMAGE=createjs.AbstractLoader.IMAGE,b.JAVASCRIPT=createjs.AbstractLoader.JAVASCRIPT,b.JSON=createjs.AbstractLoader.JSON,b.JSONP=createjs.AbstractLoader.JSONP,b.MANIFEST=createjs.AbstractLoader.MANIFEST,b.SOUND=createjs.AbstractLoader.SOUND,b.VIDEO=createjs.AbstractLoader.VIDEO,b.SVG=createjs.AbstractLoader.SVG,b.TEXT=createjs.AbstractLoader.TEXT,b.XML=createjs.AbstractLoader.XML,b.POST=createjs.AbstractLoader.POST,b.GET=createjs.AbstractLoader.GET,a.registerLoader=function(a){if(!a||!a.canLoadItem)throw new Error("loader is of an incorrect type.");if(-1!=this._availableLoaders.indexOf(a))throw new Error("loader already exists.");this._availableLoaders.unshift(a)},a.unregisterLoader=function(a){var b=this._availableLoaders.indexOf(a);-1!=b&&b<this._defaultLoaderLength-1&&this._availableLoaders.splice(b,1)},a.setUseXHR=function(a){return this.setPreferXHR(a)},a.setPreferXHR=function(a){return this.preferXHR=0!=a&&null!=window.XMLHttpRequest,this.preferXHR},a.removeAll=function(){this.remove()},a.remove=function(a){var b=null;if(!a||a instanceof Array){if(a)b=a;else if(arguments.length>0)return}else b=[a];var c=!1;if(b){for(;b.length;){var d=b.pop(),e=this.getResult(d);for(f=this._loadQueue.length-1;f>=0;f--)if(g=this._loadQueue[f].getItem(),g.id==d||g.src==d){this._loadQueue.splice(f,1)[0].cancel();break}for(f=this._loadQueueBackup.length-1;f>=0;f--)if(g=this._loadQueueBackup[f].getItem(),g.id==d||g.src==d){this._loadQueueBackup.splice(f,1)[0].cancel();break}if(e)this._disposeItem(this.getItem(d));else for(var f=this._currentLoads.length-1;f>=0;f--){var g=this._currentLoads[f].getItem();if(g.id==d||g.src==d){this._currentLoads.splice(f,1)[0].cancel(),c=!0;break}}}c&&this._loadNext()}else{this.close();for(var h in this._loadItemsById)this._disposeItem(this._loadItemsById[h]);this.init(this.preferXHR,this._basePath)}},a.reset=function(){this.close();for(var a in this._loadItemsById)this._disposeItem(this._loadItemsById[a]);for(var b=[],c=0,d=this._loadQueueBackup.length;d>c;c++)b.push(this._loadQueueBackup[c].getItem());this.loadManifest(b,!1)},a.installPlugin=function(a){if(null!=a&&null!=a.getPreloadHandlers){this._plugins.push(a);var b=a.getPreloadHandlers();if(b.scope=a,null!=b.types)for(var c=0,d=b.types.length;d>c;c++)this._typeCallbacks[b.types[c]]=b;if(null!=b.extensions)for(c=0,d=b.extensions.length;d>c;c++)this._extensionCallbacks[b.extensions[c]]=b}},a.setMaxConnections=function(a){this._maxConnections=a,!this._paused&&this._loadQueue.length>0&&this._loadNext()},a.loadFile=function(a,b,c){if(null==a){var d=new createjs.ErrorEvent("PRELOAD_NO_FILE");return void this._sendError(d)}this._addItem(a,null,c),this.setPaused(b!==!1?!1:!0)},a.loadManifest=function(a,c,d){var e=null,f=null;if(a instanceof Array){if(0==a.length){var g=new createjs.ErrorEvent("PRELOAD_MANIFEST_EMPTY");return void this._sendError(g)}e=a}else if("string"==typeof a)e=[{src:a,type:b.MANIFEST}];else{if("object"!=typeof a){var g=new createjs.ErrorEvent("PRELOAD_MANIFEST_NULL");return void this._sendError(g)}if(void 0!==a.src){if(null==a.type)a.type=b.MANIFEST;else if(a.type!=b.MANIFEST){var g=new createjs.ErrorEvent("PRELOAD_MANIFEST_TYPE");this._sendError(g)}e=[a]}else void 0!==a.manifest&&(e=a.manifest,f=a.path)}for(var h=0,i=e.length;i>h;h++)this._addItem(e[h],f,d);this.setPaused(c!==!1?!1:!0)},a.load=function(){this.setPaused(!1)},a.getItem=function(a){return this._loadItemsById[a]||this._loadItemsBySrc[a]},a.getResult=function(a,b){var c=this._loadItemsById[a]||this._loadItemsBySrc[a];if(null==c)return null;var d=c.id;return b&&this._loadedRawResults[d]?this._loadedRawResults[d]:this._loadedResults[d]},a.getItems=function(a){var b=[];for(var c in this._loadItemsById){var d=this._loadItemsById[c],e=this.getResult(c);(a!==!0||null!=e)&&b.push({item:d,result:e,rawResult:this.getResult(c,!0)})}return b},a.setPaused=function(a){this._paused=a,this._paused||this._loadNext()},a.close=function(){for(;this._currentLoads.length;)this._currentLoads.pop().cancel();this._scriptOrder.length=0,this._loadedScripts.length=0,this.loadStartWasDispatched=!1,this._itemCount=0,this._lastProgress=0/0},a._addItem=function(a,b,c){var d=this._createLoadItem(a,b,c);if(null!=d){var e=this._createLoader(d);null!=e&&("plugins"in e&&(e.plugins=this._plugins),d._loader=e,this._loadQueue.push(e),this._loadQueueBackup.push(e),this._numItems++,this._updateProgress(),(this.maintainScriptOrder&&d.type==createjs.LoadQueue.JAVASCRIPT||d.maintainOrder===!0)&&(this._scriptOrder.push(d),this._loadedScripts.push(null)))}},a._createLoadItem=function(a,b,c){var d=createjs.LoadItem.create(a);if(null==d)return null;var e="",f=c||this._basePath;if(d.src instanceof Object){if(!d.type)return null;if(b){e=b;var g=createjs.RequestUtils.parseURI(b);null==f||g.absolute||g.relative||(e=f+e)}else null!=f&&(e=f)}else{var h=createjs.RequestUtils.parseURI(d.src);h.extension&&(d.ext=h.extension),null==d.type&&(d.type=createjs.RequestUtils.getTypeByExtension(d.ext));var i=d.src;if(!h.absolute&&!h.relative)if(b){e=b;var g=createjs.RequestUtils.parseURI(b);i=b+i,null==f||g.absolute||g.relative||(e=f+e)}else null!=f&&(e=f);d.src=e+d.src}d.path=e,(void 0===d.id||null===d.id||""===d.id)&&(d.id=i);var j=this._typeCallbacks[d.type]||this._extensionCallbacks[d.ext];if(j){var k=j.callback.call(j.scope,d,this);if(k===!1)return null;k===!0||null!=k&&(d._loader=k),h=createjs.RequestUtils.parseURI(d.src),null!=h.extension&&(d.ext=h.extension)}return this._loadItemsById[d.id]=d,this._loadItemsBySrc[d.src]=d,null==d.crossOrigin&&(d.crossOrigin=this._crossOrigin),d},a._createLoader=function(a){if(null!=a._loader)return a._loader;for(var b=this.preferXHR,c=0;c<this._availableLoaders.length;c++){var d=this._availableLoaders[c];if(d&&d.canLoadItem(a))return new d(a,b)}return null},a._loadNext=function(){if(!this._paused){this._loadStartWasDispatched||(this._sendLoadStart(),this._loadStartWasDispatched=!0),this._numItems==this._numItemsLoaded?(this.loaded=!0,this._sendComplete(),this.next&&this.next.load&&this.next.load()):this.loaded=!1;for(var a=0;a<this._loadQueue.length&&!(this._currentLoads.length>=this._maxConnections);a++){var b=this._loadQueue[a];this._canStartLoad(b)&&(this._loadQueue.splice(a,1),a--,this._loadItem(b))}}},a._loadItem=function(a){a.on("fileload",this._handleFileLoad,this),a.on("progress",this._handleProgress,this),a.on("complete",this._handleFileComplete,this),a.on("error",this._handleError,this),a.on("fileerror",this._handleFileError,this),this._currentLoads.push(a),this._sendFileStart(a.getItem()),a.load()},a._handleFileLoad=function(a){a.target=null,this.dispatchEvent(a)},a._handleFileError=function(a){var b=new createjs.ErrorEvent("FILE_LOAD_ERROR",null,a.item);this._sendError(b)},a._handleError=function(a){var b=a.target;this._numItemsLoaded++,this._finishOrderedItem(b,!0),this._updateProgress();var c=new createjs.ErrorEvent("FILE_LOAD_ERROR",null,b.getItem());this._sendError(c),this.stopOnError?this.setPaused(!0):(this._removeLoadItem(b),this._cleanLoadItem(b),this._loadNext())},a._handleFileComplete=function(a){var b=a.target,c=b.getItem(),d=b.getResult();this._loadedResults[c.id]=d;var e=b.getResult(!0);null!=e&&e!==d&&(this._loadedRawResults[c.id]=e),this._saveLoadedItems(b),this._removeLoadItem(b),this._finishOrderedItem(b)||this._processFinishedLoad(c,b),this._cleanLoadItem(b)},a._saveLoadedItems=function(a){var b=a.getLoadedItems();if(null!==b)for(var c=0;c<b.length;c++){var d=b[c].item;this._loadItemsBySrc[d.src]=d,this._loadItemsById[d.id]=d,this._loadedResults[d.id]=b[c].result,this._loadedRawResults[d.id]=b[c].rawResult}},a._finishOrderedItem=function(a,b){var c=a.getItem();if(this.maintainScriptOrder&&c.type==createjs.LoadQueue.JAVASCRIPT||c.maintainOrder){a instanceof createjs.JavaScriptLoader&&(this._currentlyLoadingScript=!1);var d=createjs.indexOf(this._scriptOrder,c);return-1==d?!1:(this._loadedScripts[d]=b===!0?!0:c,this._checkScriptLoadOrder(),!0)}return!1},a._checkScriptLoadOrder=function(){for(var a=this._loadedScripts.length,b=0;a>b;b++){var c=this._loadedScripts[b];if(null===c)break;if(c!==!0){var d=this._loadedResults[c.id];c.type==createjs.LoadQueue.JAVASCRIPT&&createjs.DomUtils.appendToHead(d);var e=c._loader;this._processFinishedLoad(c,e),this._loadedScripts[b]=!0}}},a._processFinishedLoad=function(a,b){this._numItemsLoaded++,this.maintainScriptOrder||a.type!=createjs.LoadQueue.JAVASCRIPT||createjs.DomUtils.appendToHead(a.result),this._updateProgress(),this._sendFileComplete(a,b),this._loadNext()},a._canStartLoad=function(a){if(!this.maintainScriptOrder||a.preferXHR)return!0;var b=a.getItem();if(b.type!=createjs.LoadQueue.JAVASCRIPT)return!0;if(this._currentlyLoadingScript)return!1;for(var c=this._scriptOrder.indexOf(b),d=0;c>d;){var e=this._loadedScripts[d];if(null==e)return!1;d++}return this._currentlyLoadingScript=!0,!0},a._removeLoadItem=function(a){for(var b=this._currentLoads.length,c=0;b>c;c++)if(this._currentLoads[c]==a){this._currentLoads.splice(c,1);break}},a._cleanLoadItem=function(a){var b=a.getItem();b&&delete b._loader},a._handleProgress=function(a){var b=a.target;this._sendFileProgress(b.getItem(),b.progress),this._updateProgress()},a._updateProgress=function(){var a=this._numItemsLoaded/this._numItems,b=this._numItems-this._numItemsLoaded;if(b>0){for(var c=0,d=0,e=this._currentLoads.length;e>d;d++)c+=this._currentLoads[d].progress;a+=c/b*(b/this._numItems)}this._lastProgress!=a&&(this._sendProgress(a),this._lastProgress=a)},a._disposeItem=function(a){delete this._loadedResults[a.id],delete this._loadedRawResults[a.id],delete this._loadItemsById[a.id],delete this._loadItemsBySrc[a.src]},a._sendFileProgress=function(a,b){if(!this._isCanceled()&&!this._paused&&this.hasEventListener("fileprogress")){var c=new createjs.Event("fileprogress");c.progress=b,c.loaded=b,c.total=1,c.item=a,this.dispatchEvent(c)}},a._sendFileComplete=function(a,b){if(!this._isCanceled()&&!this._paused){var c=new createjs.Event("fileload");c.loader=b,c.item=a,c.result=this._loadedResults[a.id],c.rawResult=this._loadedRawResults[a.id],a.completeHandler&&a.completeHandler(c),this.hasEventListener("fileload")&&this.dispatchEvent(c)}},a._sendFileStart=function(a){var b=new createjs.Event("filestart");b.item=a,this.hasEventListener("filestart")&&this.dispatchEvent(b)},a.toString=function(){return"[PreloadJS LoadQueue]"},createjs.LoadQueue=createjs.promote(LoadQueue,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function TextLoader(a){this.AbstractLoader_constructor(a,!0,createjs.AbstractLoader.TEXT)}var a=(createjs.extend(TextLoader,createjs.AbstractLoader),TextLoader);a.canLoadItem=function(a){return a.type==createjs.AbstractLoader.TEXT},createjs.TextLoader=createjs.promote(TextLoader,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function BinaryLoader(a){this.AbstractLoader_constructor(a,!0,createjs.AbstractLoader.BINARY),this.on("initialize",this._updateXHR,this)}var a=createjs.extend(BinaryLoader,createjs.AbstractLoader),b=BinaryLoader;b.canLoadItem=function(a){return a.type==createjs.AbstractLoader.BINARY},a._updateXHR=function(a){a.loader.setResponseType("arraybuffer")},createjs.BinaryLoader=createjs.promote(BinaryLoader,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function CSSLoader(a,b){this.AbstractLoader_constructor(a,b,createjs.AbstractLoader.CSS),this.resultFormatter=this._formatResult,this._tagSrcAttribute="href",this._tag=document.createElement(b?"style":"link"),this._tag.rel="stylesheet",this._tag.type="text/css"}var a=createjs.extend(CSSLoader,createjs.AbstractLoader),b=CSSLoader;b.canLoadItem=function(a){return a.type==createjs.AbstractLoader.CSS},a._formatResult=function(a){if(this._preferXHR){var b=a.getTag();if(b.styleSheet)b.styleSheet.cssText=a.getResult(!0);else{var c=document.createTextNode(a.getResult(!0));b.appendChild(c)}}else b=this._tag;return createjs.DomUtils.appendToHead(b),b},createjs.CSSLoader=createjs.promote(CSSLoader,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function ImageLoader(a,b){this.AbstractLoader_constructor(a,b,createjs.AbstractLoader.IMAGE),this.resultFormatter=this._formatResult,this._tagSrcAttribute="src",createjs.RequestUtils.isImageTag(a)?this._tag=a:createjs.RequestUtils.isImageTag(a.src)?this._tag=a.src:createjs.RequestUtils.isImageTag(a.tag)&&(this._tag=a.tag),null!=this._tag?this._preferXHR=!1:this._tag=document.createElement("img"),this.on("initialize",this._updateXHR,this)}var a=createjs.extend(ImageLoader,createjs.AbstractLoader),b=ImageLoader;b.canLoadItem=function(a){return a.type==createjs.AbstractLoader.IMAGE},a.load=function(){if(""!=this._tag.src&&this._tag.complete)return void this._sendComplete();var a=this._item.crossOrigin;1==a&&(a="Anonymous"),null==a||createjs.RequestUtils.isLocal(this._item.src)||(this._tag.crossOrigin=a),this.AbstractLoader_load()},a._updateXHR=function(a){a.loader.mimeType="text/plain; charset=x-user-defined-binary",a.loader.setResponseType&&a.loader.setResponseType("blob")},a._formatResult=function(a){var b=this;return function(c){var d=b._tag,e=window.URL||window.webkitURL;if(b._preferXHR)if(e){var f=e.createObjectURL(a.getResult(!0));d.src=f,d.onload=function(){e.revokeObjectURL(b.src)}}else d.src=a.getItem().src;else;d.complete?c(d):d.onload=function(){c(this)}}},createjs.ImageLoader=createjs.promote(ImageLoader,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function JavaScriptLoader(a,b){this.AbstractLoader_constructor(a,b,createjs.AbstractLoader.JAVASCRIPT),this.resultFormatter=this._formatResult,this._tagSrcAttribute="src",this.setTag(document.createElement("script"))}var a=createjs.extend(JavaScriptLoader,createjs.AbstractLoader),b=JavaScriptLoader;b.canLoadItem=function(a){return a.type==createjs.AbstractLoader.JAVASCRIPT},a._formatResult=function(a){var b=a.getTag();return this._preferXHR&&(b.text=a.getResult(!0)),b},createjs.JavaScriptLoader=createjs.promote(JavaScriptLoader,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function JSONLoader(a){this.AbstractLoader_constructor(a,!0,createjs.AbstractLoader.JSON),this.resultFormatter=this._formatResult}var a=createjs.extend(JSONLoader,createjs.AbstractLoader),b=JSONLoader;b.canLoadItem=function(a){return a.type==createjs.AbstractLoader.JSON&&!a._loadAsJSONP},a._formatResult=function(a){var b=null;try{b=createjs.DataUtils.parseJSON(a.getResult(!0))}catch(c){var d=new createjs.ErrorEvent("JSON_FORMAT",null,c);return this._sendError(d),c}return b},createjs.JSONLoader=createjs.promote(JSONLoader,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function JSONPLoader(a){this.AbstractLoader_constructor(a,!1,createjs.AbstractLoader.JSONP),this.setTag(document.createElement("script")),this.getTag().type="text/javascript"}var a=createjs.extend(JSONPLoader,createjs.AbstractLoader),b=JSONPLoader;b.canLoadItem=function(a){return a.type==createjs.AbstractLoader.JSONP||a._loadAsJSONP},a.cancel=function(){this.AbstractLoader_cancel(),this._dispose()},a.load=function(){if(null==this._item.callback)throw new Error("callback is required for loading JSONP requests.");if(null!=window[this._item.callback])throw new Error("JSONP callback '"+this._item.callback+"' already exists on window. You need to specify a different callback or re-name the current one.");window[this._item.callback]=createjs.proxy(this._handleLoad,this),window.document.body.appendChild(this._tag),this._loadTimeout=setTimeout(createjs.proxy(this._handleTimeout,this),this._item.loadTimeout),this._tag.src=this._item.src},a._handleLoad=function(a){this._result=this._rawResult=a,this._sendComplete(),this._dispose()},a._handleTimeout=function(){this._dispose(),this.dispatchEvent(new createjs.ErrorEvent("timeout"))},a._dispose=function(){window.document.body.removeChild(this._tag),delete window[this._item.callback],clearTimeout(this._loadTimeout)},createjs.JSONPLoader=createjs.promote(JSONPLoader,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function ManifestLoader(a){this.AbstractLoader_constructor(a,null,createjs.AbstractLoader.MANIFEST),this.plugins=null,this._manifestQueue=null}var a=createjs.extend(ManifestLoader,createjs.AbstractLoader),b=ManifestLoader;b.MANIFEST_PROGRESS=.25,b.canLoadItem=function(a){return a.type==createjs.AbstractLoader.MANIFEST},a.load=function(){this.AbstractLoader_load()},a._createRequest=function(){var a=this._item.callback;this._request=null!=a?new createjs.JSONPLoader(this._item):new createjs.JSONLoader(this._item)},a.handleEvent=function(a){switch(a.type){case"complete":return this._rawResult=a.target.getResult(!0),this._result=a.target.getResult(),this._sendProgress(b.MANIFEST_PROGRESS),void this._loadManifest(this._result);case"progress":return a.loaded*=b.MANIFEST_PROGRESS,this.progress=a.loaded/a.total,(isNaN(this.progress)||1/0==this.progress)&&(this.progress=0),void this._sendProgress(a)}this.AbstractLoader_handleEvent(a)},a.destroy=function(){this.AbstractLoader_destroy(),this._manifestQueue.close()},a._loadManifest=function(a){if(a&&a.manifest){var b=this._manifestQueue=new createjs.LoadQueue;b.on("fileload",this._handleManifestFileLoad,this),b.on("progress",this._handleManifestProgress,this),b.on("complete",this._handleManifestComplete,this,!0),b.on("error",this._handleManifestError,this,!0);for(var c=0,d=this.plugins.length;d>c;c++)b.installPlugin(this.plugins[c]);b.loadManifest(a)}else this._sendComplete()},a._handleManifestFileLoad=function(a){a.target=null,this.dispatchEvent(a)},a._handleManifestComplete=function(){this._loadedItems=this._manifestQueue.getItems(!0),this._sendComplete()},a._handleManifestProgress=function(a){this.progress=a.progress*(1-b.MANIFEST_PROGRESS)+b.MANIFEST_PROGRESS,this._sendProgress(this.progress)},a._handleManifestError=function(a){var b=new createjs.Event("fileerror");b.item=a.data,this.dispatchEvent(b)},createjs.ManifestLoader=createjs.promote(ManifestLoader,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function SoundLoader(a,b){this.AbstractMediaLoader_constructor(a,b,createjs.AbstractLoader.SOUND),createjs.RequestUtils.isAudioTag(a)?this._tag=a:createjs.RequestUtils.isAudioTag(a.src)?this._tag=a:createjs.RequestUtils.isAudioTag(a.tag)&&(this._tag=createjs.RequestUtils.isAudioTag(a)?a:a.src),null!=this._tag&&(this._preferXHR=!1)}var a=createjs.extend(SoundLoader,createjs.AbstractMediaLoader),b=SoundLoader;b.canLoadItem=function(a){return a.type==createjs.AbstractLoader.SOUND},a._createTag=function(a){var b=document.createElement("audio");return b.autoplay=!1,b.preload="none",b.src=a,b},createjs.SoundLoader=createjs.promote(SoundLoader,"AbstractMediaLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function VideoLoader(a,b){this.AbstractMediaLoader_constructor(a,b,createjs.AbstractLoader.VIDEO),createjs.RequestUtils.isVideoTag(a)||createjs.RequestUtils.isVideoTag(a.src)?(this.setTag(createjs.RequestUtils.isVideoTag(a)?a:a.src),this._preferXHR=!1):this.setTag(this._createTag())}var a=createjs.extend(VideoLoader,createjs.AbstractMediaLoader),b=VideoLoader;a._createTag=function(){return document.createElement("video")},b.canLoadItem=function(a){return a.type==createjs.AbstractLoader.VIDEO},createjs.VideoLoader=createjs.promote(VideoLoader,"AbstractMediaLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function SpriteSheetLoader(a){this.AbstractLoader_constructor(a,null,createjs.AbstractLoader.SPRITESHEET),this._manifestQueue=null}var a=createjs.extend(SpriteSheetLoader,createjs.AbstractLoader),b=SpriteSheetLoader;b.SPRITESHEET_PROGRESS=.25,b.canLoadItem=function(a){return a.type==createjs.AbstractLoader.SPRITESHEET},a.destroy=function(){this.AbstractLoader_destroy,this._manifestQueue.close()},a._createRequest=function(){var a=this._item.callback;this._request=null!=a&&a instanceof Function?new createjs.JSONPLoader(this._item):new createjs.JSONLoader(this._item)},a.handleEvent=function(a){switch(a.type){case"complete":return this._rawResult=a.target.getResult(!0),this._result=a.target.getResult(),this._sendProgress(b.SPRITESHEET_PROGRESS),void this._loadManifest(this._result);case"progress":return a.loaded*=b.SPRITESHEET_PROGRESS,this.progress=a.loaded/a.total,(isNaN(this.progress)||1/0==this.progress)&&(this.progress=0),void this._sendProgress(a)}this.AbstractLoader_handleEvent(a)},a._loadManifest=function(a){if(a&&a.images){var b=this._manifestQueue=new createjs.LoadQueue;b.on("complete",this._handleManifestComplete,this,!0),b.on("fileload",this._handleManifestFileLoad,this),b.on("progress",this._handleManifestProgress,this),b.on("error",this._handleManifestError,this,!0),b.loadManifest(a.images)}},a._handleManifestFileLoad=function(a){var b=a.result;if(null!=b){var c=this.getResult().images,d=c.indexOf(a.item.src);c[d]=b}},a._handleManifestComplete=function(){this._result=new createjs.SpriteSheet(this._result),this._loadedItems=this._manifestQueue.getItems(!0),this._sendComplete()},a._handleManifestProgress=function(a){this.progress=a.progress*(1-b.SPRITESHEET_PROGRESS)+b.SPRITESHEET_PROGRESS,this._sendProgress(this.progress)},a._handleManifestError=function(a){var b=new createjs.Event("fileerror");b.item=a.data,this.dispatchEvent(b)},createjs.SpriteSheetLoader=createjs.promote(SpriteSheetLoader,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function SVGLoader(a,b){this.AbstractLoader_constructor(a,b,createjs.AbstractLoader.SVG),this.resultFormatter=this._formatResult,this._tagSrcAttribute="data",b?this.setTag(document.createElement("svg")):(this.setTag(document.createElement("object")),this.getTag().type="image/svg+xml")}var a=createjs.extend(SVGLoader,createjs.AbstractLoader),b=SVGLoader;b.canLoadItem=function(a){return a.type==createjs.AbstractLoader.SVG},a._formatResult=function(a){var b=createjs.DataUtils.parseXML(a.getResult(!0),"text/xml"),c=a.getTag();return!this._preferXHR&&document.body.contains(c)&&document.body.removeChild(c),null!=b.documentElement?(c.appendChild(b.documentElement),c.style.visibility="visible",c):b},createjs.SVGLoader=createjs.promote(SVGLoader,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function XMLLoader(a){this.AbstractLoader_constructor(a,!0,createjs.AbstractLoader.XML),this.resultFormatter=this._formatResult}var a=createjs.extend(XMLLoader,createjs.AbstractLoader),b=XMLLoader;b.canLoadItem=function(a){return a.type==createjs.AbstractLoader.XML},a._formatResult=function(a){return createjs.DataUtils.parseXML(a.getResult(!0),"text/xml")},createjs.XMLLoader=createjs.promote(XMLLoader,"AbstractLoader")}();;
(function() {
  'use strict';
  var CacheControllerPlugin, s;
  CacheControllerPlugin = function() {};
  s = CacheControllerPlugin;
  s.getPreloadHandlers = function() {
    return {
      callback: s.preloadHandler,
      types: ["binary", "image", "javascript", "json", "jsonp", "sound", "video", "svg", "text", "xml"]
    };
  };
  s.preloadHandler = function(p_loadItem, p_queue) {
    var cache, cv, parentView, ts, view, views, _ref;
    views = typeof app !== "undefined" && app !== null ? (_ref = app.config) != null ? _ref.views : void 0 : void 0;
    view = views != null ? views[p_queue.id] : void 0;
    parentView = views != null ? views[view != null ? view.parentView : void 0] : void 0;
    cv = false;
    if (p_loadItem.cache != null) {
      if (p_loadItem.cache === false) {
        cv = true;
      }
    } else if ((view != null ? view.cache : void 0) != null) {
      if ((view != null ? view.cache : void 0) === false) {
        cv = true;
      }
    } else if ((parentView != null ? parentView.cache : void 0) != null) {
      if ((parentView != null ? parentView.cache : void 0) === false) {
        cv = true;
      }
    }
    if (p_loadItem.src.indexOf("?v=") === -1) {
      ts = new Date().getTime();
      cache = cv ? "?v=" + app.getInfo().version + "&noCache=" + ts : "?v=" + app.getInfo().version;
      p_loadItem.src += cache;
    }
    return true;
  };
  createjs.CacheControllerPlugin = CacheControllerPlugin;
})();
this.createjs = this.createjs || {};
(function() {
  var MediaRequest, p, s;
  MediaRequest = function(loadItem, tag, srcAttribute) {
    this.fullBuffer = loadItem.fullBuffer;
    this.AbstractRequest_constructor(loadItem);
    this._tag = tag;
    this._tagSrcAttribute = srcAttribute;
    this._complete = createjs.proxy(this._handleTagComplete, this);
  };
  'use strict';
  p = createjs.extend(MediaRequest, createjs.TagRequest);
  s = MediaRequest;
  p.load = function() {
    var _error, _progress, _stalled, _timeout;
    _progress = createjs.proxy(this._handleProgress, this);
    this._handleProgress = _progress;
    _stalled = createjs.proxy(this._handleStalled, this);
    this._handleStalled = _stalled;
    _error = createjs.proxy(this._handleError, this);
    this._handleError = _error;
    _timeout = createjs.proxy(this._handleTimeout, this);
    this._handleTimeout = _timeout;
    this.____timer = setInterval(_progress, 10);
    if (this._tag.addEventListener) {
      this._tag.addEventListener('progress', _progress);
      this._tag.addEventListener('stalled', _stalled);
      this._tag.addEventListener('error', _error);
    } else {
      this._tag.onprogress = _progress;
      this._tag.onstalled = _stalled;
      this._tag.onerror = _error;
    }
    if (this.fullBuffer || this.fullBuffer === void 0) {
      if (this._tag.addEventListener) {
        this._tag.addEventListener('ended', this._complete, false);
        this._tag.addEventListener('complete', this._complete, false);
      } else {
        this._tag.onended = this._tag.oncomplete = this._complete;
      }
    } else {
      if (this._tag.addEventListener) {
        this._tag.addEventListener('canplaythrough', this._complete, false);
      } else {
        this._tag.oncanplaythrough = this._complete;
      }
    }
    this.TagRequest_load();
  };
  p._handleTimeout = function() {};
  p._handleStalled = function() {};
  p._handleError = function(evt) {
    var err;
    try {
      console.log(evt.data);
      throw new Error(evt.title);
    } catch (_error) {
      err = _error;
      return console.log(err.stack);
    }
  };
  p._handleProgress = function() {
    var err, loaded, total;
    try {
      loaded = this._tag.buffered.end(this._tag.buffered.length - 1);
      total = this._tag.duration;
      this._tag.currentTime = loaded;
      this.dispatchEvent(new createjs.ProgressEvent(loaded, total));
    } catch (_error) {
      err = _error;
    }
    if (Math.round(loaded) >= Math.round(total)) {
      this._complete();
    }
  };
  p.destroy = function() {
    this.TagRequest_destroy();
  };
  p._handleTagComplete = function() {
    this.TagRequest__handleTagComplete();
  };
  p._clean = function() {
    var err, loaded, total, _ref;
    try {
      loaded = this._tag.buffered.end(this._tag.buffered.length - 1);
      total = this._tag.duration;
    } catch (_error) {
      err = _error;
    }
    if (Math.round(loaded) >= Math.round(total)) {
      clearInterval(this.____timer);
      this.____timer = null;
      if (this._tag.removeEventListener) {
        this._tag.removeEventListener('progress', this._handleProgress);
        this._tag.removeEventListener('stalled', this._handleStalled);
        this._tag.removeEventListener('error', this._handleError);
        this._tag.removeEventListener('ended', this._complete);
        this._tag.removeEventListener('complete', this._complete);
        this._tag.removeEventListener('canplaythrough', this._complete);
      } else {
        this._tag.onended = null;
        this._tag.oncanplaythrough = null;
        this._tag.onprogress = null;
        this._tag.onstalled = null;
        this._tag.onerror = null;
      }
      if ((_ref = this._tag) != null) {
        _ref.currentTime = 0.0001;
      }
      this.TagRequest__clean();
    }
  };
  createjs.MediaRequest = createjs.promote(MediaRequest, 'TagRequest');
})();
this.createjs = this.createjs || {};
(function() {
  var TagMediaLoader, p;
  TagMediaLoader = function(loadItem, preferXHR, type) {
    this.AbstractLoader_constructor(loadItem, preferXHR, type);
    this.resultFormatter = this._formatResult;
    this._tagSrcAttribute = 'src';
  };
  'use strict';
  p = createjs.extend(TagMediaLoader, createjs.AbstractLoader);
  p.load = function() {
    if (!this._tag) {
      this._tag = this._createTag(this._item.src);
    }
    this._tag.preload = 'auto';
    this._tag.load();
    this.AbstractLoader_load();
  };
  p._createTag = function() {};
  p._createRequest = function() {
    this._request = new createjs.MediaRequest(this._item, this._tag || this._createTag(), this._tagSrcAttribute);
  };
  p._formatResult = function(loader) {
    this._tag.removeEventListener && this._tag.removeEventListener('complete', this._loadedHandler);
    this._tag.removeEventListener && this._tag.removeEventListener('canplaythrough', this._loadedHandler);
    this._tag.onstalled = null;
    if (this._preferXHR) {
      loader.getTag().src = loader.getResult(true);
    }
    return loader.getTag();
  };
  createjs.TagMediaLoader = createjs.promote(TagMediaLoader, 'AbstractLoader');
})();
this.createjs = this.createjs || {};
(function() {
  var MediaLoader, p, s;
  MediaLoader = function(loadItem, preferXHR) {
    this.___item = loadItem;
    if (loadItem.type === "video") {
      this.TagMediaLoader_constructor(loadItem, preferXHR, createjs.AbstractLoader.VIDEO);
      if (createjs.RequestUtils.isVideoTag(loadItem) || createjs.RequestUtils.isVideoTag(loadItem.src)) {
        this.setTag(createjs.RequestUtils.isVideoTag(loadItem) ? loadItem : loadItem.src);
        this._preferXHR = false;
      } else {
        this.setTag(this._createTag());
      }
    } else {
      this.TagMediaLoader_constructor(loadItem, preferXHR, createjs.AbstractLoader.SOUND);
      if (createjs.RequestUtils.isAudioTag(loadItem)) {
        this._tag = loadItem;
      } else if (createjs.RequestUtils.isAudioTag(loadItem.src)) {
        this._tag = loadItem;
      } else if (createjs.RequestUtils.isAudioTag(loadItem.tag)) {
        this._tag = createjs.RequestUtils.isAudioTag(loadItem) ? loadItem : loadItem.src;
      }
      if (this._tag !== null) {
        this._preferXHR = false;
      }
    }
  };
  'use strict';
  s = MediaLoader;
  p = createjs.extend(MediaLoader, createjs.TagMediaLoader);
  p._createTag = function(src) {
    var tag;
    if (this.___item.type === 'video') {
      tag = document.createElement('video');
      tag.type = "video/mp4";
      tag.preload = 'auto';
    } else {
      tag = document.createElement('audio');
      tag.type = "audio/mpeg";
      tag.preload = 'none';
      tag.src = src;
    }
    if (this.___item.id != null) {
      tag.id = this.___item.id;
    }
    if (!this.___item.autoplay || this.___item.autoplay === void 0) {
      tag.autoplay = false;
    } else {
      tag.autoplay = this.___item.autoplay;
    }
    if (!this.___item.loop || this.___item.loop === void 0) {
      tag.loop = false;
    } else {
      tag.loop = this.___item.loop;
    }
    if (!this.___item.volume || this.___item.volume === void 0) {
      tag.volume = 1;
    } else {
      tag.volume = this.___item.volume;
    }
    return tag;
  };
  s.canLoadItem = function(item) {
    if (this.___item.type === 'video') {
      return item.type === createjs.AbstractLoader.VIDEO;
    } else {
      return item.type === createjs.AbstractLoader.SOUND;
    }
  };
  createjs.MediaLoader = createjs.promote(MediaLoader, 'TagMediaLoader');
})();
(function() {
  'use strict';
  var MediaPlugin, s;
  MediaPlugin = function() {};
  s = MediaPlugin;
  s.getPreloadHandlers = function() {
    return {
      callback: MediaPlugin.handlers,
      types: ['sound', 'video'],
      extensions: ['mp3', 'mp4']
    };
  };
  s.handlers = function(p_loadItem, p_queue) {
    var loader;
    loader = new createjs.MediaLoader(p_loadItem, false);
    return loader;
  };
  createjs.MediaPlugin = MediaPlugin;
})();
var AssetLoader;
AssetLoader = (function(_super) {
  __extends(AssetLoader, _super);
  AssetLoader.INITIALIZE = "initialize";
  AssetLoader.COMPLETE_ALL = "complete";
  AssetLoader.COMPLETE_FILE = "fileload";
  AssetLoader.PROGRESS_ALL = "progress";
  AssetLoader.PROGRESS_FILE = "fileprogress";
  AssetLoader.START_ALL = "loadstart";
  AssetLoader.START_FILE = "filestart";
  AssetLoader.ERROR = "error";
  AssetLoader.FILE_ERROR = "fileerror";
  AssetLoader.getInstance = function() {
    return AssetLoader._instance != null ? AssetLoader._instance : AssetLoader._instance = (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(AssetLoader, arguments, function(){});
  };
  AssetLoader.prototype._groups = null;
  function AssetLoader() {
    this._fileLoad = __bind(this._fileLoad, this);
    this._onFileError = __bind(this._onFileError, this);
    this._onError = __bind(this._onError, this);
    this._groups = {};
  }
  AssetLoader.prototype.loadGroup = function(p_groupId, p_files) {
    var group;
    group = this.getGroup(p_groupId);
    group.loadManifest(p_files);
    return group;
  };
  AssetLoader.prototype.getGroup = function(p_groupId, p_concurrent, p_xhr) {
    var group;
    if (p_concurrent == null) {
      p_concurrent = 3;
    }
    if (p_xhr == null) {
      p_xhr = true;
    }
    group = this._groups[p_groupId];
    if (!group) {
      group = new createjs.LoadQueue(p_xhr);
      group.installPlugin(createjs.CacheControllerPlugin);
      group.installPlugin(createjs.MediaPlugin);
      group.id = p_groupId;
      this._groups[p_groupId] = group;
      group.on(AssetLoader.COMPLETE_FILE, this._fileLoad);
      group.on(AssetLoader.ERROR, this._onError);
      group.on(AssetLoader.FILE_ERROR, this._onFileError);
    }
    group.setMaxConnections(p_concurrent);
    return group;
  };
  AssetLoader.prototype.preferXHR = function(p_groupId, p_value) {
    var group;
    if (p_value == null) {
      p_value = true;
    }
    group = this.getGroup(p_groupId).setPreferXHR = p_value;
    return group;
  };
  AssetLoader.prototype._onError = function(e) {
    e.currentTarget.off(AssetLoader.ERROR, this._onError);
    e.currentTarget.off(AssetLoader.COMPLETE_FILE, this._fileLoad);
    console.log(e);
    throw new Error(e.title).stack;
    return false;
  };
  AssetLoader.prototype._onFileError = function(e) {
    e.currentTarget.off(AssetLoader.FILE_ERROR, this._onFileError);
    e.currentTarget.off(AssetLoader.COMPLETE_FILE, this._fileLoad);
    console.log(e);
    throw new Error(e.title).stack;
    return false;
  };
  AssetLoader.prototype._fileLoad = function(e) {
    e.currentTarget.off(AssetLoader.COMPLETE_FILE, this._fileLoad);
    e.currentTarget.off(AssetLoader.ERROR, this._onError);
    e.currentTarget.off(AssetLoader.FILE_ERROR, this._onFileError);
    e.item.tag = e.result;
    return false;
  };
  AssetLoader.prototype.getItem = function(p_id, p_groupId) {
    var i, k, v, _ref, _ref1;
    if (p_groupId == null) {
      p_groupId = null;
    }
    if (p_groupId) {
      return (_ref = this._groups[p_groupId]) != null ? _ref.getItem(p_id) : void 0;
    }
    _ref1 = this._groups;
    for (k in _ref1) {
      v = _ref1[k];
      if (i = v.getItem(p_id)) {
        return i;
      }
    }
  };
  AssetLoader.prototype.getResult = function(p_id, p_groupId) {
    var i, k, result, v, _ref, _ref1;
    if (p_groupId == null) {
      p_groupId = null;
    }
    result = null;
    if (p_groupId) {
      result = (_ref = this._groups[p_groupId]) != null ? _ref.getResult(p_id) : void 0;
    }
    _ref1 = this._groups;
    for (k in _ref1) {
      v = _ref1[k];
      if (i = v.getResult(p_id)) {
        result = i;
      }
    }
    return result;
  };
  AssetLoader.addFiles = function(p_files, p_queue) {
    var f, jsRE, mp4RE, obj, _i, _len;
    jsRE = /.*\.(js|css|svg)$/g;
    mp4RE = /.*\.(mp4)$/g;
    for (_i = 0, _len = p_files.length; _i < _len; _i++) {
      f = p_files[_i];
      obj = {
        id: '',
        src: ''
      };
      jsRE.lastIndex = 0;
      obj.id = f.id || 'item';
      obj.src = f.src;
      if (mp4RE.test(obj.src)) {
        obj['type'] = 'video';
      }
      if (f.src && jsRE.test(f.src)) {
        obj['type'] = 'text';
      }
      if (obj.src) {
        p_queue.loadFile(obj, false);
      }
    }
    if (p_files.length > 0) {
      p_queue.load();
    }
    return false;
  };
  return AssetLoader;
})(EventDispatcher);
var BaseDOM,
  __slice = [].slice;
Node.prototype.__appendChild__ = Node.prototype.appendChild;
Node.prototype.appendChild = function(node) {
  var el;
  el = node;
  if (node instanceof BaseDOM) {
    el = node.element;
    node.parent = this;
  }
  return Node.prototype.__appendChild__.call(this, el);
};
Node.prototype.__removeChild__ = Node.prototype.removeChild;
Node.prototype.removeChild = function(node) {
  var el;
  el = node;
  if (node instanceof BaseDOM) {
    el = node.element;
    node.parent = this;
  }
  try {
    return this.__removeChild__.call(this, el);
  } catch (_error) {}
};
Element.prototype.matches = Element.prototype.matches || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector;
Node.prototype.findParents = function(query) {
  var _ref;
  if (((_ref = this.parentNode) != null ? _ref.matches : void 0) != null) {
    if (this.parentNode.matches(query)) {
      return this.parentNode;
    } else {
      return this.parentNode.findParents(query);
    }
  }
  return null;
};
/**
Base DOM manipulation class
@class BaseDOM
 */
BaseDOM = (function(_super) {
  __extends(BaseDOM, _super);
  function BaseDOM() {
    var className, element, i, namespace, option, p_options;
    p_options = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    BaseDOM.__super__.constructor.apply(this, arguments);
    element = 'div';
    className = null;
    namespace = null;
    if (typeof p_options[0] === 'string' || p_options[0] instanceof HTMLElement) {
      element = p_options[0];
    } else {
      i = p_options.length;
      while (i--) {
        option = p_options[i];
        if (option.element != null) {
          element = option.element;
        }
        if (option.className != null) {
          className = option.className;
        }
        if (option.namespace != null) {
          namespace = option.namespace;
        }
      }
    }
    if (typeof element === 'string') {
      if (namespace) {
        this._namespace = namespace;
        this._element = document.createElementNS(this._namespace, element);
      } else {
        this._element = document.createElement(element);
      }
    } else if (element instanceof HTMLElement) {
      this._element = element;
    }
    if (className) {
      this.addClass(className);
    }
    this._element.__instance__ = this;
  }
  BaseDOM.get({
    element: function() {
      return this._element;
    }
  });
  BaseDOM.get({
    namespace: function() {
      return this._namespace;
    }
  });
  BaseDOM.get({
    childNodes: function() {
      return this.element.childNodes;
    }
  });
  BaseDOM.get({
    width: function() {
      return this.getBounds().width;
    }
  });
  BaseDOM.get({
    height: function() {
      return this.getBounds().height;
    }
  });
  BaseDOM.get({
    left: function() {
      return this.getBounds().left;
    }
  });
  BaseDOM.get({
    top: function() {
      return this.getBounds().top;
    }
  });
  BaseDOM.get({
    x: function() {
      return this.getBounds().left;
    }
  });
  BaseDOM.get({
    y: function() {
      return this.getBounds().top;
    }
  });
  BaseDOM.get({
    parent: function() {
      return this._parent;
    }
  });
  BaseDOM.set({
    parent: function(value) {
      if (!(value instanceof BaseDOM) && !(value instanceof Node)) {
        throw new Error('Parent instance is not either Node or BaseDOM');
      }
      return this._parent = value;
    }
  });
  BaseDOM.get({
    className: function() {
      return this.element.className;
    }
  });
  BaseDOM.set({
    className: function(value) {
      return this.element.className = value.trim();
    }
  });
  BaseDOM.get({
    text: function() {
      return this.html;
    }
  });
  BaseDOM.set({
    text: function(value) {
      return this.html = value;
    }
  });
  BaseDOM.get({
    html: function() {
      return this.element.innerHTML;
    }
  });
  BaseDOM.set({
    html: function(value) {
      return this.element.innerHTML = value;
    }
  });
  BaseDOM.get({
    isAttached: function() {
      return (typeof document.contains === "function" ? document.contains(this.element) : void 0) || document.body.contains(this.element);
    }
  });
  BaseDOM.get({
    attributes: function() {
      return this.element.attributes;
    }
  });
  BaseDOM.prototype.appendChild = function(child) {
    return this.appendChildAt(child);
  };
  BaseDOM.prototype.appendChildAt = function(child, index) {
    var el;
    if (index == null) {
      index = -1;
    }
    el = child;
    if (child instanceof BaseDOM) {
      el = child.element;
    }
    if (index === -1 || index >= this.childNodes.length) {
      this.element.appendChild(el);
    } else {
      this.element.insertBefore(el, this.childNodes[index]);
    }
    if (child instanceof BaseDOM) {
      child.parent = this;
    }
    return child;
  };
  BaseDOM.prototype.remove = function() {
    var _ref;
    return (_ref = this.parent) != null ? typeof _ref.removeChild === "function" ? _ref.removeChild(this) : void 0 : void 0;
  };
  BaseDOM.prototype.removeChild = function(child) {
    var el;
    el = child;
    if (child instanceof BaseDOM) {
      el = child.element;
    }
    try {
      return this.element.removeChild(el);
    } catch (_error) {}
  };
  BaseDOM.prototype.removeChildAt = function(index) {
    if (index == null) {
      index = -1;
    }
    if (index < this.childNodes.length) {
      return this.removeChild(this.childNodes[i]);
    }
  };
  BaseDOM.prototype.removeAll = function() {
    var childs, i, _results;
    childs = this.childNodes;
    i = childs.length;
    _results = [];
    while (i-- > 0) {
      _results.push(this.removeChild(childs[i]));
    }
    return _results;
  };
  BaseDOM.prototype.matches = function(query) {
    return this.element.matches(query);
  };
  BaseDOM.prototype.findParents = function(query) {
    return this.element.findParents(query);
  };
  BaseDOM.prototype.find = function(query, onlyInstances) {
    var element;
    if (onlyInstances == null) {
      onlyInstances = false;
    }
    element = this.element.querySelector(query);
    if (onlyInstances) {
      return element != null ? element.__instance__ : void 0;
    } else {
      return element;
    }
  };
  BaseDOM.prototype.findAll = function(query, onlyInstances) {
    var elements, els, i, l, p;
    if (onlyInstances == null) {
      onlyInstances = false;
    }
    elements = this.element.querySelectorAll(query);
    if (onlyInstances) {
      els = [];
      i = -1;
      l = elements.length;
      p = 0;
      while (++i < l) {
        if (elements[i].__instance__) {
          els[p++] = elements[i].__instance__;
        }
      }
      elements = els;
    }
    return elements;
  };
  BaseDOM.prototype.attr = function(name, value, namespace) {
    var k, v, _results;
    if (value == null) {
      value = 'nonenonenone';
    }
    if (namespace == null) {
      namespace = false;
    }
    if (typeof name === 'string') {
      return this._attr(name, value, namespace);
    } else if (typeof name === 'object') {
      _results = [];
      for (k in name) {
        v = name[k];
        _results.push(this._attr(k, v, namespace));
      }
      return _results;
    }
  };
  BaseDOM.prototype._attr = function(name, value, namespace) {
    if (value == null) {
      value = 'nonenonenone';
    }
    if (namespace == null) {
      namespace = false;
    }
    if (namespace === false) {
      namespace = this.namespace;
    }
    if (value !== 'nonenonenone') {
      if (namespace) {
        this.element.setAttributeNS(namespace, name, value);
      } else {
        this.element.setAttribute(name, value);
      }
    }
    if (namespace) {
      return this.element.getAttributeNS(namespace, name);
    } else {
      return this.element.getAttribute(name);
    }
  };
  BaseDOM.prototype._css = function(name, value) {
    if (value == null) {
      value = null;
    }
    if (value !== null) {
      this.element.style[name] = value;
    }
    return this.element.style[name];
  };
  BaseDOM.prototype.css = function(name, value) {
    var k, v, _results;
    if (value == null) {
      value = null;
    }
    if (typeof name === 'string') {
      return this._css(name, value);
    } else if (typeof name === 'object') {
      _results = [];
      for (k in name) {
        v = name[k];
        _results.push(this._css(k, v));
      }
      return _results;
    }
  };
  BaseDOM.prototype.addClass = function(className) {
    var classNames, i, p;
    if (typeof className === 'string') {
      className = className.replace(/\s+/ig, ' ').split(' ');
    } else if (typeof className !== 'Array') {
      return;
    }
    classNames = this.className.replace(/\s+/ig, ' ').split(' ');
    p = classNames.length;
    i = className.length;
    while (i-- > 0) {
      if (classNames.indexOf(className[i]) >= 0) {
        continue;
      }
      classNames[p++] = className[i];
    }
    return this.className = classNames.join(' ');
  };
  BaseDOM.prototype.removeClass = function(className) {
    var classNames, i, p;
    if (typeof className === 'string') {
      className = className.replace(/\s+/ig, ' ').split(' ');
    } else if (typeof className !== 'Array') {
      return;
    }
    classNames = this.className.replace(/\s+/ig, ' ').split(' ');
    i = className.length;
    while (i-- > 0) {
      if ((p = classNames.indexOf(className[i])) >= 0) {
        classNames.splice(p, 1);
      }
    }
    return this.className = classNames.join(' ');
  };
  BaseDOM.prototype.toggleClass = function(className, toggle) {
    var i, _results;
    if (toggle == null) {
      toggle = null;
    }
    if (toggle !== null) {
      if (toggle) {
        this.addClass(className);
      } else {
        this.removeClass(className);
      }
      return;
    }
    if (typeof className === 'string') {
      className = className.replace(/\s+/ig, ' ').split(' ');
    } else if (typeof className !== 'Array') {
      return;
    }
    i = className.length;
    _results = [];
    while (i-- > 0) {
      if (this.hasClass(className[i])) {
        _results.push(this.removeClass(className[i]));
      } else {
        _results.push(this.addClass(className[i]));
      }
    }
    return _results;
  };
  BaseDOM.prototype.hasClass = function(className) {
    var classNames, hasClass, i;
    if (typeof className === 'string') {
      className = className.replace(/\s+/ig, ' ').split(' ');
    } else if (typeof className !== 'Array') {
      return;
    }
    classNames = this.className.replace(/\s+/ig, ' ').split(' ');
    i = className.length;
    hasClass = true;
    while (i-- > 0) {
      hasClass &= classNames.indexOf(className[i]) >= 0;
    }
    return hasClass;
  };
  BaseDOM.prototype.getBounds = function(target) {
    var bounds, boundsObj, k, tbounds, v;
    if (target == null) {
      target = null;
    }
    boundsObj = {};
    bounds = this.element.getBoundingClientRect();
    for (k in bounds) {
      v = bounds[k];
      boundsObj[k] = v;
    }
    if (target) {
      if (target instanceof BaseDOM) {
        tbounds = target.getBounds();
      } else if (target instanceof HTMLElement) {
        tbounds = target.getBoundingClientRect();
      }
    }
    if (tbounds) {
      boundsObj.top -= tbounds.top;
      boundsObj.left -= tbounds.left;
      boundsObj.bottom -= tbounds.top;
      boundsObj.right -= tbounds.left;
    }
    boundsObj.width = boundsObj.right - boundsObj.left;
    boundsObj.height = boundsObj.bottom - boundsObj.top;
    return boundsObj;
  };
  BaseDOM.prototype.destroy = function() {
    if (typeof this.off === "function") {
      this.off();
    }
    return typeof this.remove === "function" ? this.remove() : void 0;
  };
  return BaseDOM;
})(EventDispatcher);
var BaseView;
BaseView = (function(_super) {
  __extends(BaseView, _super);
  BaseView.CREATE_START = 'create_start';
  BaseView.CREATE = 'create';
  BaseView.CREATE_COMPLETE = 'create_complete';
  BaseView.SHOW_START = 'show_start';
  BaseView.SHOW = 'show';
  BaseView.SHOW_COMPLETE = 'show_complete';
  BaseView.HIDE_START = 'hide_start';
  BaseView.HIDE = 'hide';
  BaseView.HIDE_COMPLETE = 'hide_complete';
  BaseView.DESTROY = 'destroy';
  BaseView.DESTROY_COMPLETE = 'destroy_complete';
  function BaseView(p_data, p_className) {
    if (p_data == null) {
      p_data = null;
    }
    if (p_className == null) {
      p_className = null;
    }
    this.destroyComplete = __bind(this.destroyComplete, this);
    this.destroy = __bind(this.destroy, this);
    this.hideComplete = __bind(this.hideComplete, this);
    this.hide = __bind(this.hide, this);
    this.hideStart = __bind(this.hideStart, this);
    this.showComplete = __bind(this.showComplete, this);
    this.show = __bind(this.show, this);
    this.showStart = __bind(this.showStart, this);
    this.createComplete = __bind(this.createComplete, this);
    this.create = __bind(this.create, this);
    this.createStart = __bind(this.createStart, this);
    this.getReverseParentList = __bind(this.getReverseParentList, this);
    this._created = false;
    this._data = p_data ? p_data : {};
    this._id = this._data.id != null ? this._data.id : void 0;
    this._content = this._data.content != null ? this._data.content : void 0;
    this._route = this._data.route != null ? this._data.route : void 0;
    this._parent = this._data.parent != null ? this._data.parent : void 0;
    this._subviews = this._data.subviews != null ? this._data.subviews : void 0;
    this._destroyable = this._data.destroyable != null ? this._data.destroyable : void 0;
    BaseView.__super__.constructor.call(this, {
      element: 'div',
      className: p_className + '-view'
    });
  }
  BaseView.get({
    data: function() {
      return this._data;
    }
  });
  BaseView.set({
    data: function(p_value) {
      return this._data = ObjectUtils.clone(p_value);
    }
  });
  BaseView.get({
    id: function() {
      return this._id;
    }
  });
  BaseView.set({
    id: function(p_value) {
      return this._id = p_value;
    }
  });
  BaseView.get({
    content: function() {
      return this._content;
    }
  });
  BaseView.set({
    content: function(p_value) {
      return this._content = p_value;
    }
  });
  BaseView.get({
    route: function() {
      return this._route;
    }
  });
  BaseView.set({
    route: function(p_value) {
      return this._route = p_value;
    }
  });
  BaseView.get({
    parent: function() {
      return this._parent;
    }
  });
  BaseView.set({
    parent: function(p_value) {
      return this._parent = p_value;
    }
  });
  BaseView.get({
    loader: function() {
      var _ref;
      if (this._id != null) {
        return typeof app !== "undefined" && app !== null ? (_ref = app.loader) != null ? _ref.getGroup(this.id) : void 0 : void 0;
      }
    }
  });
  BaseView.get({
    created: function() {
      return this._created;
    }
  });
  BaseView.get({
    subviews: function() {
      return this._subviews;
    }
  });
  BaseView.set({
    subviews: function(p_value) {
      return this._subviews = p_value;
    }
  });
  BaseView.get({
    destroyable: function() {
      return this._destroyable;
    }
  });
  BaseView.set({
    destroyable: function(p_value) {
      return this._destroyable = p_value;
    }
  });
  BaseView.get({
    type: function() {
      return this._type;
    }
  });
  BaseView.set({
    type: function(p_value) {
      return this._type = p_value;
    }
  });
  BaseView.get({
    meta: function() {
      var _ref;
      if (((_ref = this.content) != null ? _ref.meta : void 0) != null) {
        return this.content.meta;
      }
    }
  });
  BaseView.set({
    meta: function(p_value) {
      return this._meta = p_value;
    }
  });
  BaseView.get({
    progress: function() {
      return this._progress;
    }
  });
  BaseView.set({
    progress: function(p_value) {
      return this._progress = p_value;
    }
  });
  BaseView.get({
    openedSubview: function() {
      return this._openedSubviewID;
    }
  });
  BaseView.set({
    openedSubview: function(p_value) {
      return this._openedSubviewID = p_value;
    }
  });
  BaseView.get({
    reverseParentPath: function() {
      this.getReverseParentList(this);
      return this._parentPath.reverse();
    }
  });
  BaseView.get({
    parentPath: function() {
      this.getReverseParentList(this);
      return this._parentPath;
    }
  });
  BaseView.prototype.getReverseParentList = function(p_subview) {
    if (p_subview == null) {
      p_subview = null;
    }
    this._parentPath = [];
    if ((p_subview != null ? p_subview.parent : void 0) != null) {
      this.getReverseParentList(p_subview.parent);
      this._parentPath.push(p_subview.id);
    }
    return false;
  };
  BaseView.prototype.createStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.trigger(BaseView.CREATE_START, this);
    this.create();
    return false;
  };
  BaseView.prototype.create = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.trigger(BaseView.CREATE, this);
    this.createComplete();
    return false;
  };
  BaseView.prototype.createComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this._created = true;
    this.trigger(BaseView.CREATE_COMPLETE, this);
    return false;
  };
  BaseView.prototype.showStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.trigger(BaseView.SHOW_START, this);
    this.show();
    return false;
  };
  BaseView.prototype.show = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.trigger(BaseView.SHOW, this);
    this.showComplete();
    return false;
  };
  BaseView.prototype.showComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.trigger(BaseView.SHOW_COMPLETE, this);
    return false;
  };
  BaseView.prototype.hideStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.trigger(BaseView.HIDE_START, this);
    this.hide();
    return false;
  };
  BaseView.prototype.hide = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.trigger(BaseView.HIDE, this);
    this.hideComplete();
    return false;
  };
  BaseView.prototype.hideComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.trigger(BaseView.HIDE_COMPLETE, this);
    return false;
  };
  BaseView.prototype.destroy = function(evt) {
    var _ref;
    if (evt == null) {
      evt = null;
    }
    this.removeAll();
    if ((_ref = this._parentPath) != null) {
      _ref.length = 0;
    }
    this._parentPath = null;
    this._data = null;
    this.trigger(BaseView.DESTROY, this);
    this.destroyComplete();
    return false;
  };
  BaseView.prototype.destroyComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this._created = false;
    this.trigger(BaseView.DESTROY_COMPLETE, this);
    this.off();
    return false;
  };
  return BaseView;
})(BaseDOM);
var TemplateNode;
TemplateNode = (function(_super) {
  __extends(TemplateNode, _super);
  function TemplateNode(nodeData) {
    this.nodeData = nodeData;
    this._id = this.nodeData['id'];
    this._external = this.nodeData['external'];
    this._use = this.nodeData['use'];
    this._attributes = this.nodeData['attributes'];
    this._element = this.nodeData['element'];
    this._content = this.nodeData['content'];
    this._condition = this.nodeData['condition'];
    this._conditionData = this.nodeData['conditionData'];
    this._children = [];
    this._contextSelector = this.nodeData['contextSelector'];
    this._parseNode(this.nodeData);
  }
  TemplateNode.get({
    id: function() {
      return this._id;
    }
  });
  TemplateNode.get({
    external: function() {
      return this._external;
    }
  });
  TemplateNode.get({
    use: function() {
      return this._use;
    }
  });
  TemplateNode.get({
    attributes: function() {
      return this._attributes;
    }
  });
  TemplateNode.get({
    element: function() {
      return this._element;
    }
  });
  TemplateNode.get({
    content: function() {
      return this._content;
    }
  });
  TemplateNode.get({
    condition: function() {
      return this._condition;
    }
  });
  TemplateNode.get({
    children: function() {
      return this._children;
    }
  });
  TemplateNode.set({
    children: function(value) {
      return this._children = value;
    }
  });
  TemplateNode.prototype._parseNode = function(nodeData) {};
  TemplateNode.prototype.find = function(element, attrs) {
    var child, childNode, found, k, v, _i, _j, _len, _len1, _ref, _ref1, _ref2;
    if (element == null) {
      element = null;
    }
    if (attrs == null) {
      attrs = null;
    }
    childNode = null;
    _ref = this._children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      if (element) {
        if (child.element !== element) {
          continue;
        }
      }
      if (attrs) {
        found = true;
        for (k in attrs) {
          v = attrs[k];
          if (!child.attributes[k] || ((_ref1 = child.attributes[k]) != null ? _ref1.indexOf(v) : void 0) < 0) {
            found = false;
            continue;
          }
        }
        if (!found) {
          continue;
        }
      }
      childNode = child;
      break;
    }
    if (!childNode) {
      _ref2 = this._children;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        child = _ref2[_j];
        childNode = child.find(element, attrs);
        if (childNode) {
          break;
        }
      }
    }
    return childNode;
  };
  TemplateNode.prototype.clear = function() {
    var children, _results;
    children = this._childContext.childNodes;
    _results = [];
    while (this._childContext.childNodes.length) {
      _results.push(this._childContext.removeChild(this._childContext.childNodes[0]));
    }
    return _results;
  };
  TemplateNode.prototype.render = function(context, data, originalData, ignoreUse) {
    var attrs, cData, childContext, e, foundData, initialData, k, o, v, _i, _len;
    if (originalData == null) {
      originalData = null;
    }
    if (ignoreUse == null) {
      ignoreUse = false;
    }
    if (!originalData && data) {
      originalData = data;
    }
    if ((this._condition != null) && (this._conditionData != null)) {
      cData = this._conditionData;
      cData = cData.replace(/\#\{(.*?)\}/ig, 'data[\'$1\']');
      if (!eval(cData)) {
        return;
      }
    }
    initialData = data;
    context.data = data;
    this.originalData = originalData;
    foundData = data;
    if (!ignoreUse) {
      if (this._use && (o = /([\*\@])?(.*?)$/.exec(this._use))) {
        foundData = this._findObjectData(foundData, this._use);
        if (foundData == null) {
          return;
        }
        if (!Array.isArray(foundData) && typeof foundData !== 'object') {
          this._content = foundData;
        } else {
          data = foundData;
          this._content = '';
        }
      }
    }
    if (this._contextSelector) {
      context = (context || document.body).querySelector(this._contextSelector);
    }
    this.data = data;
    context.data = data;
    if (!Array.isArray(data) && !Array.isArray(initialData) && !(data instanceof String) && !(initialData instanceof String)) {
      initialData = ObjectUtils.merge(initialData, data);
    }
    childContext = context;
    if (this._element) {
      childContext = document.createElement(this._element);
      context.appendChild(childContext);
      childContext.templateNode = this;
    }
    if (this._content) {
      childContext.innerHTML = this._replaceData(this._content, data);
    }
    if (this._attributes) {
      attrs = this._replaceData(this._attributes, initialData);
      for (k in attrs) {
        v = attrs[k];
        if (!v || v.length === 0) {
          continue;
        }
        try {
          childContext.setAttribute(k, v);
        } catch (_error) {
          e = _error;
          console.log(k, v);
          childContext[k] = v;
        }
      }
    }
    childContext.data = data;
    if (!context) {
      throw new Error('Context was not found.');
    }
    if ((!ignoreUse && this._use) && data && (Array.isArray(data))) {
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        v = data[_i];
        this._renderChildren(childContext, v, originalData);
      }
    } else {
      this._renderChildren(childContext, data, originalData);
    }
    return this._childContext = childContext;
  };
  TemplateNode.prototype.update = function(data, originalData) {
    var v, _i, _len;
    this.clear();
    if (data && (typeof data === 'object' || Array.isArray(data))) {
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        v = data[_i];
        this._renderChildren(this._childContext, v, data, true);
      }
    } else {
      this._renderChildren(this._childContext, data, data, true);
    }
    return this.data = data;
  };
  TemplateNode.prototype._replaceData = function(obj, data) {
    var o, value;
    obj = JSON.stringify(obj);
    while (o = /\#\{(.*?)\}/.exec(obj)) {
      value = ObjectUtils.findChild(data, o[1]);
      if (!value) {
        value = '';
      }
      value = value.toString().replace(/\"/g, '\\"');
      obj = obj.replace(new RegExp('#\\{' + o[1] + '\\}', 'g'), value);
      obj = obj.replace(new RegExp('\r\n', 'g'), '\n');
      obj = obj.replace(new RegExp('[\n|\r]', 'g'), '\\n');
    }
    return JSON.parse(obj);
  };
  TemplateNode.prototype._findObjectData = function(obj, path) {
    var o;
    if (!obj) {
      return null;
    }
    if (path && (o = /([\*\@])?(.*?)$/.exec(path))) {
      switch (o[1]) {
        case '*':
          1;
          break;
        case '@':
          2;
          break;
        default:
          obj = ObjectUtils.findChild(obj, o[2]);
      }
    }
    return obj;
  };
  TemplateNode.prototype._renderChildren = function(childContext, data, originalData, ignoreUse) {
    var i, l, _results;
    if (ignoreUse == null) {
      ignoreUse = false;
    }
    l = this._children.length;
    i = -1;
    _results = [];
    while (++i < l) {
      _results.push(this._children[i].render(childContext, data, originalData, ignoreUse));
    }
    return _results;
  };
  return TemplateNode;
})(EventDispatcher);
var TemplateParser;
TemplateParser = (function(_super) {
  __extends(TemplateParser, _super);
  TemplateParser.LOAD_COMPLETE = 'templateParser_loadComplete';
  TemplateParser.LOAD_ERROR = 'templateParser_loadError';
  TemplateParser._parseTemplateRules = function() {
    var blockRE, o, rulesStr, _results;
    rulesStr = Template.RULES.replace(/^\s*$/g, '');
    blockRE = /^[^\s].*?\n(^[\s+].*?(\n|$))+/gm;
    this._rules = [];
    _results = [];
    while (o = blockRE.exec(rulesStr)) {
      _results.push(this._parseBlock(o[0]));
    }
    return _results;
  };
  TemplateParser._parseBlock = function(data) {
    var name, o, paramRE, ruleObj;
    name = /^([^\s]+)\s*\:/.exec(data);
    if (!name) {
      return;
    }
    name = name[1];
    ruleObj = {
      name: name
    };
    paramRE = /^\s+([^\s]+)\s*\:\s*(.*?)\s*$/gm;
    while (o = paramRE.exec(data)) {
      ruleObj[o[1]] = o[2];
    }
    return this._rules.push(ruleObj);
  };
  function TemplateParser(template) {
    if (template == null) {
      template = null;
    }
    this._replaceStringMultilines = __bind(this._replaceStringMultilines, this);
    this._replaceObject = __bind(this._replaceObject, this);
    this._parseObjectRecursive = __bind(this._parseObjectRecursive, this);
    this._loadComplete = __bind(this._loadComplete, this);
    this._externalTemplateLoadError = __bind(this._externalTemplateLoadError, this);
    this._externalTemplateLoaded = __bind(this._externalTemplateLoaded, this);
    this._replaceNodeExternals = __bind(this._replaceNodeExternals, this);
    this._loadExternalTemplates = __bind(this._loadExternalTemplates, this);
    this._templateLoadError = __bind(this._templateLoadError, this);
    this._templateLoadComplete = __bind(this._templateLoadComplete, this);
    if (!TemplateParser.rules) {
      TemplateParser._parseTemplateRules();
    }
    this._renderQueue = [];
    this._loaded = false;
    this.id = template;
    if (template) {
      this.loadTemplate(template);
    }
  }
  TemplateParser.get({
    loaded: function() {
      return this._loaded;
    }
  });
  TemplateParser.prototype.parse = function(template) {
    return this._templateLoadComplete(null, template);
  };
  TemplateParser.prototype.loadTemplate = function(name, dataPath) {
    var path, rootPath;
    if (dataPath == null) {
      dataPath = null;
    }
    if (!/\.tpl$/.test(name)) {
      name = name.replace(/\./, '/') + Template.EXTENSION;
    }
    if (name.indexOf('/') !== 0) {
      rootPath = Template.ROOT_PATH;
    } else {
      rootPath = '';
    }
    path = rootPath + name;
    return API.call({
      url: path,
      onComplete: this._templateLoadComplete,
      onError: this._templateLoadError,
      type: 'template'
    });
  };
  TemplateParser.prototype.render = function(context, data, onComplete, onError) {
    var i, l, _results;
    if (!this._loaded) {
      return this._renderQueue.push(arguments);
    } else {
      l = this._nodes.length;
      i = -1;
      _results = [];
      while (++i < l) {
        _results.push(this._nodes[i].render(context, data));
      }
      return _results;
    }
  };
  TemplateParser.prototype._templateLoadComplete = function(e, data) {
    data = data + '\n';
    this._externalTemplates = [];
    this._nodes = this._parseBlocks(data);
    return this._loadExternalTemplates();
  };
  TemplateParser.prototype._templateLoadError = function(e, data) {
    this._loaded = true;
    return this.trigger(TemplateParser.LOAD_ERROR);
  };
  TemplateParser.prototype._findTemplate = function(id) {
    var i, _ref;
    i = this._nodes.length;
    while (i-- > 0) {
      if (((_ref = this._nodes[i]) != null ? _ref.id : void 0) === id) {
        return this._nodes[i];
      }
    }
    return Template.find(id);
  };
  TemplateParser.prototype._loadExternalTemplates = function() {
    var i, id, template;
    i = this._externalTemplates.length;
    while (i-- > 0) {
      id = this._externalTemplates[i];
      if (this._findTemplate(id)) {
        this._externalTemplates.splice(i, 1);
      } else {
        template = new TemplateParser(this._externalTemplates[i]);
        template.on(TemplateParser.LOAD_ERROR, this._externalTemplateLoadError);
        template.on(TemplateParser.LOAD_COMPLETE, this._externalTemplateLoaded);
        Template.addTemplate(this._externalTemplates[i], template);
        this._externalTemplates.splice(i, 1);
        return;
      }
    }
    if (this._externalTemplates.length === 0) {
      this._replaceNodeExternals(this._nodes);
      return this._loadComplete();
    } else {
      return this._loadExternalTemplates();
    }
  };
  TemplateParser.prototype._replaceNodeExternals = function(nodes) {
    var externalNode, i, node, _results;
    i = nodes.length;
    _results = [];
    while (i-- > 0) {
      node = nodes[i];
      if (node.external) {
        externalNode = this._findTemplate(node.external);
        if (externalNode) {
          if (externalNode instanceof TemplateParser) {
            node.children = externalNode.nodes;
          } else if (externalNode instanceof TemplateNode) {
            node.children = externalNode.children;
          }
        }
        if (!node.children || node.children.length === 0) {
          nodes.splice(i, 1);
        }
      }
      if (node.children.length) {
        _results.push(this._replaceNodeExternals(node.children));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  TemplateParser.prototype._externalTemplateLoaded = function(e, data) {
    var target;
    target = e.currentTarget;
    if (target instanceof TemplateParser) {
      Template.addTemplate(target.id, target);
    }
    return this._loadExternalTemplates();
  };
  TemplateParser.prototype._externalTemplateLoadError = function(e, data) {
    Template.addTemplate(e.target.id, '');
    return this._loadExternalTemplates();
  };
  TemplateParser.prototype._loadComplete = function() {
    var i, l;
    this._loaded = true;
    i = this._nodes.length;
    while (i-- > 0) {
      if (this._nodes[i].id) {
        this._nodes.splice(i, 1);
      }
    }
    l = this._renderQueue.length;
    i = -1;
    while (++i < l) {
      this.render.apply(this, this._renderQueue[i]);
    }
    return this.trigger(TemplateParser.LOAD_COMPLETE);
  };
  TemplateParser.prototype._parseBlocks = function(data) {
    var blockRE, childs, o, parsedData, templateNode, _ref, _ref1, _ref2;
    data = data.replace(/\/\*[\s\S]*?\*\//mg, '');
    data = data.replace(/^\s*$[\n|\r]/gm, '');
    blockRE = /(\s*)([^\s].*?\n)((?:\1\s[\s\S].*?(?:\n|$))*)/gm;
    _ref = this._escapeCharacters(data, this._escapeMap || []), data = _ref[0], this._escapeMap = _ref[1];
    _ref1 = this._escapeLineBreaks(data, this._escapeMap), data = _ref1[0], this._escapeMap = _ref1[1];
    _ref2 = this._escapeConditionals(data, this._escapeMap), data = _ref2[0], this._escapeMap = _ref2[1];
    childs = [];
    while (o = blockRE.exec(data)) {
      parsedData = this._parseNodeData(o[2]);
      if (!parsedData) {
        continue;
      }
      templateNode = new TemplateNode(parsedData);
      if (o[3] && o[3].trim().length > 0) {
        templateNode.children = this._parseBlocks(o[3]);
      }
      childs.push(templateNode);
    }
    return childs;
  };
  TemplateParser.prototype._parseNodeData = function(nodeData) {
    var attrs, attrsRE, c, charMap, cond, content, cssClasses, data, ids, initialContent, instAttr, instruction, instructionData, k, o, tagData, v, _ref, _ref1, _ref2;
    _ref = this._escapeConditionals(nodeData, this._escapeMap), nodeData = _ref[0], charMap = _ref[1];
    o = /^([\>\<\!]?)(.*?)(\:(.*?))?$/m.exec(nodeData);
    data = {};
    if (o[1] && o[1].length > 0) {
      switch (o[1]) {
        case '>':
          data['contextSelector'] = o[2];
          break;
        case '<':
          this._externalTemplates.push(o[2]);
          data['external'] = o[2];
          if (o[4] && o[4].length > 0) {
            c = /^\s*\#\{(.*?)\}\s*$/.exec(this._unescapeCharacters(o[4], charMap));
            data['content'] = o[4];
            if (c) {
              data['use'] = c[1];
            }
          }
          break;
        case '!':
          data['id'] = o[2];
          break;
        default:
          throw new Error('Couldn\'t parse node: ' + o[0]);
      }
    } else {
      instruction = (this._unescapeCharacters(o[2], this._escapeMap) || '').trim();
      content = (this._unescapeCharacters(o[4], this._escapeMap) || '').trim();
      initialContent = content;
      content = content.replace(/^([\'\"])(.*?)\1$/, '$2');
      _ref1 = this._escapeDataObjects(instruction, this._escapeMap), instructionData = _ref1[0], this._escapeMap = _ref1[1];
      _ref2 = this._parseObjectRecursive(instructionData), instructionData = _ref2[0], attrs = _ref2[1];
      instructionData = this._unescapeCharacters(instructionData, attrs);
      instructionData = this._unescapeCharacters(instructionData, this._escapeMap);
      if (cond = /^\s*\((if|for)(.*?)\)\s*$/.exec(instruction)) {
        data['condition'] = cond[1];
        data['conditionData'] = cond[2];
      } else {
        attrsRE = /([\.\#])?([\w\-]+)/g;
        if (!instructionData) {
          instructionData = '';
        }
        tagData = instructionData.replace(/\{.*?\}/g, '');
        ids = [];
        cssClasses = [];
        while (instAttr = attrsRE.exec(tagData)) {
          switch (instAttr[1]) {
            case '.':
              cssClasses.push(instAttr[2]);
              break;
            case '#':
              ids.push(instAttr[2]);
              break;
            default:
              data['element'] = instAttr[2];
          }
        }
        if (ids.length) {
          if (!attrs['id']) {
            attrs['id'] = '';
          }
          attrs['id'] = [].concat(attrs['id'].split(' '), ids).join(' ').trim();
        }
        if (cssClasses.length) {
          if (!attrs['class']) {
            attrs['class'] = '';
          }
          attrs['class'] = [].concat(attrs['class'].split(' '), cssClasses).join(' ').trim();
        }
        for (k in attrs) {
          v = attrs[k];
          attrs[k] = this._unescapeCharacters(v, this._escapeMap);
        }
        data['attributes'] = attrs;
      }
      if (!data['element'] && !data['condition']) {
        data['element'] = 'div';
      }
      if ((content != null ? content.length : void 0) > 0) {
        data['content'] = content;
      }
      if (content === initialContent && (c = /^\s*\#\{(.*?)\}\s*$/.exec(content))) {
        data['use'] = c[1];
      }
    }
    return data;
  };
  TemplateParser.prototype._parseObjectRecursive = function(data) {
    var obj, _ref, _ref1;
    this._objData = [];
    obj = /(\{.*?\})/.exec(data);
    if (obj) {
      try {
        obj = JSON.parse(obj[0]);
      } catch (_error) {}
    }
    if (!obj) {
      obj = {};
    }
    while (/\{([^\{\}]*)\}/.test(data)) {
      _ref = this._escapeCharacters(data, this._objData, '£££'), data = _ref[0], this._objData = _ref[1];
      _ref1 = this._escapeString(data, /(([\'\"])([^\2]*)\2)/, this._objData, '£££', 3), data = _ref1[0], this._objData = _ref1[1];
      data = data.replace(/\{([^\{\}]*)\}/g, this._replaceObject);
    }
    data = data.replace(/\${3}\d+\£{3}/g, '');
    return [data, obj];
  };
  TemplateParser.prototype._replaceObject = function(context, match) {
    var argsRE, content, index, name, o, obj, objContent;
    index = this._objData.length;
    obj = {};
    argsRE = /([^\:\,\{\}]+)\:([^\:\,\}]+)/gm;
    while (o = argsRE.exec(match)) {
      name = o[1].trim();
      content = o[2].trim();
      objContent = /^\-{3}(\d+)\-{3}$/.exec(content);
      if (objContent && this._objData[objContent[1]]) {
        obj[name] = this._objData[objContent[1]];
      } else {
        obj[name] = this._unescapeCharacters(o[2].trim(), this._objData, '£££');
      }
    }
    this._objData[index] = obj;
    return '---' + index + '---';
  };
  TemplateParser.prototype._escapeString = function(data, re, map, escapeChars, captureIndex) {
    var mapIndex, o;
    if (map == null) {
      map = [];
    }
    if (escapeChars == null) {
      escapeChars = '---';
    }
    if (captureIndex == null) {
      captureIndex = 1;
    }
    if (!re) {
      throw new Error('Must define a RegExp object');
    }
    mapIndex = map.length;
    if (escapeChars == null) {
      escapeChars = '---';
    }
    while (o = re.exec(data)) {
      data = data.replace(new RegExp(o[0].replace(/(\W)/g, '\\$1'), 'g'), escapeChars + mapIndex + escapeChars);
      map[mapIndex++] = o[captureIndex];
      re.lastIndex = 0;
    }
    return [data, map];
  };
  TemplateParser.prototype._escapeDataObjects = function(data, map) {
    if (map == null) {
      map = [];
    }
    return this._escapeString(data, /(\#\{[^\{\}]*\})/, map);
  };
  TemplateParser.prototype._escapeConditionals = function(data, map) {
    if (map == null) {
      map = [];
    }
    return this._escapeString(data, /((?:\{([^\{\}]+)})|(?:\(([^\(\)]+)\)))/, map);
  };
  TemplateParser.prototype._escapeCharacters = function(data, map, escapeChars) {
    var _ref;
    if (map == null) {
      map = [];
    }
    if (escapeChars == null) {
      escapeChars = null;
    }
    _ref = this._escapeString(data, /(\\.)/, map, escapeChars), data = _ref[0], map = _ref[1];
    return [data, map];
  };
  TemplateParser.prototype._escapeLineBreaks = function(data, map) {
    data = data.replace(/(['"])([\s\S]*?)\1/g, this._replaceStringMultilines);
    return this._escapeString(data, /(\+{3})/, map);
  };
  TemplateParser.prototype._replaceStringMultilines = function(data) {
    data = data.replace(/^\s+/gm, '');
    return data.replace(/\n/gm, '+++');
  };
  TemplateParser.prototype._unescapeCharacters = function(data, charMap, escapeChars) {
    var char, escapeRE, escaper, index, o;
    if (escapeChars == null) {
      escapeChars = '---';
    }
    if (!data) {
      return;
    }
    escaper = escapeChars.replace(/(.)/g, '\\$1');
    escapeRE = new RegExp(escaper + '(\\d+)' + escaper, 'g');
    while (o = escapeRE.exec(data)) {
      index = o[1];
      char = charMap[o[1]] || '';
      data = data.replace(new RegExp(escaper + index + escaper, 'g'), char);
      escapeRE.lastIndex = 0;
    }
    return data;
  };
  return TemplateParser;
})(EventDispatcher);
var Template;
Template = (function() {
  function Template() {}
  Template.RULES = "object:\n	start: \\{\n	end: \\}\n	content: \\:+\ndata: \n	start: \\#\\{\n	end: \\}\n	content: [^\\s]+\nif: \n	start: \\(if\n	end: \\)\nforin:\n	start: \\(for\\s+(\\w+)\\s+in\n	end: \\)\nforof: \n	start: \\(for\\s(\\w+)\\sof\n	end: \\)\nselector: \n	start: \\>\nreference: \n	start: \\<\n	content: [^\\s]+\nid: \n	start: \\!\n	content: [^\\s]+\nelement:\n	start: ^(\\w*)\\:\nsequence:\n	start: \\[\n	end: \\]";
  Template.CACHE = {};
  Template.ROOT_PATH = '';
  Template.EXTENSION = '.tpl';
  Template.setRootPath = function(rootPath) {
    if (rootPath == null) {
      rootPath = '';
    }
    return this.ROOT_PATH = rootPath;
  };
  Template.setExtension = function(extension) {
    if (extension == null) {
      extension = '.tpl';
    }
    return this.EXTENSION = extension;
  };
  Template.addTemplate = function(id, template) {
    var tParser;
    if (!(template instanceof TemplateParser)) {
      tParser = new TemplateParser();
      tParser.parse(template);
    } else {
      tParser = template;
    }
    this.CACHE[id] = tParser;
    return tParser;
  };
  Template.hasTemplate = function(id) {
    return Boolean(Template.CACHE[id]);
  };
  Template.renderTemplate = function(id, context, data, onComplete, onError) {
    var tParser;
    if (context == null) {
      context = null;
    }
    if (data == null) {
      data = {};
    }
    if (onComplete == null) {
      onComplete = null;
    }
    if (onError == null) {
      onError = null;
    }
    this.currentData = data;
    tParser = this.find(id);
    if (!tParser) {
      return;
    }
    return tParser.render(context, data, onComplete, onError);
  };
  Template.render = function(template, context, data, onComplete, onError) {
    var tParser;
    if (context == null) {
      context = null;
    }
    if (data == null) {
      data = {};
    }
    if (onComplete == null) {
      onComplete = null;
    }
    if (onError == null) {
      onError = null;
    }
    if (!template) {
      return;
    }
    if (!this.CACHE[template]) {
      tParser = new TemplateParser(template);
      tParser.on(TemplateParser.LOAD_COMPLETE, this._loadComplete);
      this.CACHE[template] = tParser;
    }
    tParser = this.CACHE[template];
    return tParser.render(context, data, onComplete, onError);
  };
  Template._loadComplete = function() {};
  Template.find = function(id) {
    return this.CACHE[id];
  };
  return Template;
})();
var API;
API = (function(_super) {
  __extends(API, _super);
  API.START = 'apiStart';
  API.COMPLETE = 'apiComplete';
  API.ERROR = 'apiError';
  API.PROGRESS = 'apiProgress';
  API._interceptors = [];
  API._cachedURLs = {};
  API._request = function() {
    if (window.XMLHttpRequest) {
      return new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      return new ActiveXObject("MSXML2.XMLHTTP.3.0");
    }
  };
  API.call = function(url, data, onComplete, onError, type) {
    var api;
    if (data == null) {
      data = null;
    }
    if (onComplete == null) {
      onComplete = null;
    }
    if (onError == null) {
      onError = null;
    }
    if (type == null) {
      type = 'normal';
    }
    api = new API(url);
    if (url instanceof HTMLElement && url.tagName.toLowerCase() === 'form') {
      url.submit();
    } else if ((typeof BaseDOM !== "undefined" && BaseDOM !== null) && url instanceof BaseDOM && url.element.tagName.toLowerCase === 'form') {
      url.submit();
    }
    if (onComplete) {
      api.on(API.COMPLETE, onComplete);
    }
    if (onError) {
      api.on(API.ERROR, onError);
    }
    api.type = type;
    api.submit(data);
    return api;
  };
  API.intercept = function(regexPattern, callback) {
    var i;
    if (!(regexPattern instanceof RegExp)) {
      regexPattern = new RegExp(regexPattern);
    }
    i = this._interceptors.length;
    while (i-- > 0) {
      if (this._interceptors[i].regex === regexPattern && this._interceptors[i].callback === callback) {
        return;
      }
    }
    return this._interceptors.push({
      regex: regexPattern,
      callback: callback
    });
  };
  API.unintercept = function(regexPattern, callback) {
    var i, _results;
    if (callback == null) {
      callback = null;
    }
    i = this._interceptors.length;
    _results = [];
    while (i-- > 0) {
      if (this._interceptors[i].regex === regexPattern && (callback && this._interceptors[i].callback === callback)) {
        _results.push(this._interceptors.splice(i, 1));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  API._findInterceptor = function(regexPattern, callback) {
    var i, interceptor, interceptors;
    i = this._interceptors.length;
    interceptors = [];
    while (i-- > 0) {
      interceptor = this._interceptors[i];
      if (interceptor.regex === regexPattern && interceptor.callback === callback) {
        interceptors.push(interceptor);
      }
    }
    return interceptors;
  };
  API._checkInterceptor = function(url, data) {
    var i, interceptor, l, _results;
    l = this._interceptors.length;
    i = -1;
    _results = [];
    while (++i < l) {
      interceptor = this._interceptors[i];
      interceptor.regex.lastIndex = 0;
      if (interceptor.regex.test(url)) {
        _results.push(typeof interceptor.callback === "function" ? interceptor.callback(data, url) : void 0);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  API._cacheURL = function(url, scope) {
    var iframe;
    if (this._cachedURLs[url]) {
      return false;
    }
    iframe = document.createElement('iframe');
    iframe.style['position'] = 'absolute';
    iframe.style['left'] = '-10000px';
    document.body.appendChild(iframe);
    iframe.addEventListener('load', this._iframeLoaded);
    iframe.scope = scope;
    return iframe.src = url;
  };
  API._iframeLoaded = function(e) {
    var iframe, scope;
    iframe = e.currentTarget;
    scope = iframe.scope;
    API._cachedURLs[iframe.getAttribute('src')] = true;
    iframe.removeEventListener('load', API._iframeLoaded);
    iframe.scope = null;
    if (iframe.parentNode) {
      iframe.parentNode.removeChild(iframe);
    }
    return scope.submit(scope._data);
  };
  function API(arg) {
    this._loadingResize = __bind(this._loadingResize, this);
    this._loaded = __bind(this._loaded, this);
    this._parseJSONElement = __bind(this._parseJSONElement, this);
    this._progress = __bind(this._progress, this);
    this._loadingHideComplete = __bind(this._loadingHideComplete, this);
    this._hideLoading = __bind(this._hideLoading, this);
    this.submit = __bind(this.submit, this);
    this._submitForm = __bind(this._submitForm, this);
    this._addEventListeners = __bind(this._addEventListeners, this);
    API.__super__.constructor.apply(this, arguments);
    this.TYPES = ['normal', 'json', 'binary'];
    this._headers = [];
    this._reuse = true;
    this._method = 'POST';
    this._jsonp = false;
    this._type = 'normal';
    if (arg instanceof HTMLElement && arg.tagName.toLowerCase() === 'form') {
      this._form = arg;
      setTimeout(this._addEventListeners, 10);
    } else if ((typeof BaseDOM !== "undefined" && BaseDOM !== null) && arg instanceof BaseDOM && arg.element.tagName.toLowerCase === 'form') {
      this._form = arg;
      setTimeout(this._addEventListeners, 10);
    } else if (typeof arg === 'string') {
      this._url = arg;
    } else if (arg != null) {
      throw new Error('The API constructor argument needs to be a URL string or a Form element.');
    }
  }
  API.get({
    url: function() {
      return this._url;
    }
  });
  API.set({
    url: function(value) {
      return this._url = value;
    }
  });
  API.get({
    reuse: function() {
      return this._reuse;
    }
  });
  API.set({
    reuse: function(value) {
      return this._reuse = Boolean(value);
    }
  });
  API.get({
    type: function() {
      return this._type;
    }
  });
  API.set({
    type: function(value) {
      if (!(__indexOf.call(this.TYPES, value) >= 0)) {
        throw new Error('API.type can only be: ' + this.TYPES.join(', '));
      }
      return this._type = value;
    }
  });
  API.get({
    method: function() {
      return this._method;
    }
  });
  API.set({
    method: function(value) {
      if (!/^(get|post)$/i.test(value)) {
        throw new Error('Method can only be either GET or POST');
      }
      return this._method = value.toUpperCase();
    }
  });
  API.get({
    jsonp: function() {
      throw new Error('Not implemented yet');
      return this._jsonp;
    }
  });
  API.set({
    jsonp: function(value) {
      throw new Error('Not implemented yet');
      return this._jsonp = Boolean(this._jsonp);
    }
  });
  API.get({
    data: function() {
      return this._data;
    }
  });
  API.get({
    requestURL: function() {
      return this._requestURL;
    }
  });
  API.prototype._addEventListeners = function() {
    if (this._form) {
      return this._form.on('submit', this._submitForm);
    }
  };
  API.prototype._submitForm = function(e) {
    return this.submit();
  };
  API.prototype.addHeader = function(name, value) {
    return this._headers[name] = value;
  };
  API.prototype.removeHeader = function(name) {
    this._headers[name] = null;
    return delete this._headers[name];
  };
  API.prototype.load = function(url, data) {
    if (data == null) {
      data = null;
    }
    this._url = url;
    return this.submit(data);
  };
  API.prototype.submit = function(data) {
    var d, getStr, getValues, k, n, parts, up, url, urlParams, v, _i, _len, _ref, _ref1, _ref2, _ref3;
    if (data == null) {
      data = null;
    }
    this._currentProgress = 0;
    this._data = data;
    if (this._submitting) {
      return;
    }
    url = this._url || '';
    if (this._form) {
      if (this._form.hasAttribute('action')) {
        url = this._form.getAttribute('action');
      }
    }
    if (/\W?login\W?/.test(url) && this.constructor._cacheURL(url, this)) {
      return;
    }
    this._submitting = true;
    if (data instanceof HTMLElement && data.tagName.toLowerCase() === 'form') {
      this._form = data;
      data = null;
    } else if ((typeof BaseDOM !== "undefined" && BaseDOM !== null) && data instanceof BaseDOM && data.element.tagName.toLowerCase === 'form') {
      this._form = data.element;
      data = null;
    }
    if (this._form) {
      if (this._form.hasAttribute('enctype')) {
        this.addHeader('Content-type', this._form.getAttribute('enctype'));
      }
      if (this._form.hasAttribute('method')) {
        this.method = this._form.getAttribute('method');
      }
      if (this._form.hasAttribute('type') && this._form.getAttribute('type') === 'json') {
        this.addHeader('Content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        data = JSON.stringify(this._parseJSON(this._form));
      } else {
        data = new FormData(this._form);
      }
    } else {
      if (this._type === 'normal') {
        if (!data) {
          data = new FormData();
        }
        if (data && !(data instanceof FormData)) {
          d = new FormData();
          for (n in data) {
            v = data[n];
            d.append(n, v);
          }
          data = d;
        }
      } else if (this._type === 'json') {
        this.addHeader('Content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        data = JSON.stringify(data);
      } else if (this._type === 'binary') {
        this.addHeader('Content-type', 'application/octet-stream;charset=UTF-8');
        this.method = 'POST';
      }
    }
    getValues = {};
    urlParams = window.location.search;
    if (urlParams) {
      urlParams = urlParams.replace(/^\??/, '').split('&');
      for (_i = 0, _len = urlParams.length; _i < _len; _i++) {
        up = urlParams[_i];
        parts = up.split('=');
        if (((_ref = parts[0]) != null ? _ref.trim().length : void 0) > 0) {
          getValues[parts[0].trim()] = (_ref1 = parts[1]) != null ? _ref1.trim() : void 0;
        }
      }
    }
    getStr = [];
    for (k in getValues) {
      v = getValues[k];
      getStr.push(k + '=' + v);
    }
    getStr = getStr.join('&');
    if (getStr.length > 0) {
      if (url.indexOf('?') >= 0) {
        url += '&' + getStr;
      } else {
        url += '?' + getStr;
      }
    }
    this._requestURL = url;
    this._request = API._request();
    this._request.onreadystatechange = this._loaded;
    if ((_ref2 = this._request.upload) != null) {
      _ref2.addEventListener('progress', this._progress);
    }
    this._request.addEventListener('progress', this._progress);
    this._request.open(this.method, url, true);
    if (this._headers) {
      _ref3 = this._headers;
      for (k in _ref3) {
        v = _ref3[k];
        this._request.setRequestHeader(k, v);
      }
    }
    if (this._form && this._form.getAttribute('globalLoading')) {
      this._loading = new cms.ui.Loading();
      this._loading.css({
        'position': 'fixed'
      });
      this._loading.show();
      window.addEventListener('resize', this._loadingResize);
      app["interface"].context.appendChildAt(this._loading, 0);
      setTimeout(this._loadingResize, 0);
    }
    this.trigger(API.START);
    this._request.send(data);
  };
  API.prototype._hideLoading = function() {
    var _ref;
    if (this._loading) {
      if ((_ref = this._loading) != null) {
        _ref.progress = 1;
      }
      this._loading.on(cms.ui.Loading.HIDE_COMPLETE, this._loadingHideComplete);
      return this._loading.hide();
    }
  };
  API.prototype._loadingHideComplete = function() {
    var _base;
    if (this._loading.element.parentNode) {
      this._loading.element.parentNode.removeChild(this._loading.element);
    }
    this._loading.remove();
    this._loading.off(cms.ui.Loading.HIDE_COMPLETE, this._loadingHideComplete);
    if (typeof (_base = this._loading).destroy === "function") {
      _base.destroy();
    }
    this._loading = null;
    window.removeEventListener('resize', this._loadingResize);
    return delete this._loading;
  };
  API.prototype._progress = function(e) {
    var p;
    if (e.loaded > e.total) {
      p = 0.5;
    } else {
      p = e.loaded / e.total;
    }
    p *= 0.5;
    if (e.currentTarget !== this._request.upload) {
      p += 0.5;
    }
    p *= 0.7;
    return this._triggerProgress(p);
  };
  API.prototype._triggerProgress = function(progress) {
    var _ref;
    if (progress > this._currentProgress) {
      this._currentProgress = progress;
    }
    if ((_ref = this._loading) != null) {
      _ref.progress = this._currentProgress;
    }
    return this.trigger(API.PROGRESS, {
      loaded: progress,
      total: 1,
      progress: this._currentProgress
    });
  };
  API.prototype.parseJSON = function(form) {
    return this._parseJSON(form);
  };
  API.prototype._parseJSON = function(form) {
    var result;
    this._parsedElements = [];
    result = this._parseJSONElement(form);
    return result;
  };
  API.prototype._parseJSONElement = function(element, indent) {
    var addC, data, i, ind, input, inputs, item, items, name, o, value, _i, _j, _len, _len1;
    if (indent == null) {
      indent = 0;
    }
    items = element.querySelectorAll('[json-name]');
    o = {};
    ind = '';
    i = indent;
    while (i-- > 0) {
      ind += ' ';
    }
    addC = 0;
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      if (this._parsedElements.indexOf(item) >= 0) {
        continue;
      }
      this._parsedElements.push(item);
      name = item.getAttribute('json-name');
      if (data = this._parseJSONElement(item, indent + 2)) {
        if (!o[name]) {
          o[name] = [];
        }
        o[name].push(data);
      }
    }
    inputs = element.querySelectorAll('input,textarea,select');
    for (_j = 0, _len1 = inputs.length; _j < _len1; _j++) {
      input = inputs[_j];
      if (this._parsedElements.indexOf(input) >= 0) {
        continue;
      }
      this._parsedElements.push(input);
      value = input.value;
      if (input.hasAttribute('type')) {
        switch (input.getAttribute('type').toLowerCase()) {
          case 'radio':
          case 'checkbox':
            if (!o[input.name]) {
              o[input.name] = [];
            }
            if (!input.checked) {
              continue;
            }
        }
      }
      if (o[input.name]) {
        if (!Array.isArray(o[input.name])) {
          o[input.name] = [o[input.name]];
        }
        o[input.name].push(value);
      } else {
        o[input.name] = value;
      }
    }
    return o;
  };
  API.prototype.abort = function() {
    this._submitting = false;
    if (this._request) {
      this._request.onreadystatechange = null;
      this._request.abort();
    }
    if (!this._reuse) {
      return this.off();
    }
  };
  API.prototype._loaded = function(e) {
    var data, o, p, re, response, t, target;
    target = e.currentTarget;
    t = target.responseText || '';
    if (/__p[\d\.]+__/.test(t)) {
      re = /__p([\d\.]+)__/g;
      p = 0;
      while (o = re.exec(t)) {
        p = Number(o[1]);
      }
      this._triggerProgress(0.7 + p * 0.3);
    }
    if (target.readyState === 4) {
      this._submitting = false;
      if (target.status === 200) {
        this._triggerProgress(1);
        response = target.responseText || target.response || '';
        response = response.replace(/__p([\d\.]+)__\s*\n?/g, '');
        try {
          data = eval('(' + response + ')');
        } catch (_error) {
          e = _error;
          try {
            data = JSON.stringify(response);
          } catch (_error) {}
        }
        if (!data) {
          data = response;
        } else if (typeof data === 'string') {
          data = response;
        }
        if (data != null ? data.error : void 0) {
          return this._loadError(data);
        } else {
          return this._loadSuccess(data);
        }
      } else {
        if (e.currentTarget.status === 404) {
          return this._loadError({
            message: ''
          });
        } else {
          return this._loadError({
            message: ''
          });
        }
      }
      if (!this._reuse) {
        return this.off();
      }
    }
  };
  API.prototype._loadSuccess = function(data) {
    if (data == null) {
      data = null;
    }
    this._hideLoading();
    this.trigger(API.COMPLETE, data);
    return this.constructor._checkInterceptor(this._requestURL, data);
  };
  API.prototype._loadError = function(data) {
    if (data == null) {
      data = null;
    }
    this._hideLoading();
    this.trigger(API.ERROR, data);
    return this.constructor._checkInterceptor(this._requestURL, data);
  };
  API.prototype._loadingResize = function() {
    var bounds;
    if (!this._loading) {
      return;
    }
    bounds = app["interface"].context.getBounds();
    return this._loading.css({
      'top': bounds.top + 'px',
      'left': bounds.left + 'px',
      'height': bounds.height + 'px',
      'width': bounds.width + 'px'
    });
  };
  return API;
})(EventDispatcher);
var User;
User = (function(_super) {
  __extends(User, _super);
  User.STATUS_CHANGE = 'user_statusChange';
  User.API_PATH = 'api/cms/user/';
  function User() {
    this._mouseDown = __bind(this._mouseDown, this);
    this._userAPIIntercepted = __bind(this._userAPIIntercepted, this);
    User.__super__.constructor.apply(this, arguments);
    this._logged = false;
    API.intercept(/api\/cms\/user\/.+/g, this._userAPIIntercepted);
    this._getUser();
  }
  User.prototype._userAPIIntercepted = function(data, url) {
    var params, type;
    type = url.replace(/^.*?api\/cms\/user\/([^\?]*)\??.*$/, '$1');
    if (data.error != null) {
      switch (data.code) {
        case 100:
          "Not logged";
          return this._showLogin();
        case 101:
          return "Login error";
        case 102:
          return "No permission";
      }
    } else {
      switch (type) {
        case 'getUser':
        case 'login':
          this._data = data;
          this._changeStatus(true);
          app["interface"].show();
          params = app.router.getParsedPath()['params'];
          if (params['__redirect__']) {
            app.router.removeParam('__redirect__');
            return window.location = decodeURIComponent(params['__redirect__']);
          }
          break;
        case 'forgot':
          return 2;
        case 'changePassword':
          return 3;
        case 'logout':
          this._changeStatus(false);
          this._logged = false;
          return this._showLogin();
      }
    }
  };
  User.get({
    data: function() {
      return this._data;
    }
  });
  User.get({
    logged: function() {
      return this._logged;
    }
  });
  User.prototype._changeStatus = function(logged) {
    this._logged = logged;
    return this.trigger(this.constructor.STATUS_CHANGE, logged);
  };
  User.prototype._getUser = function() {
    return API.call(app.rootPath + this.constructor.API_PATH + 'getUser');
  };
  User.prototype._showLogin = function() {
    if (!app.template.isCurrent('user/login')) {
      return app.template.render('user/login', null, document.body);
    }
  };
  User.prototype._showLoginError = function() {};
  User.prototype._mouseDown = function() {
    return this._showLogin();
  };
  return User;
})(EventDispatcher);
var Resizer;
Resizer = (function(_super) {
  __extends(Resizer, _super);
  Resizer.getInstance = function() {
    return Resizer._instance != null ? Resizer._instance : Resizer._instance = (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(Resizer, arguments, function(){});
  };
  function Resizer() {
    this._resize = __bind(this._resize, this);
    Resizer.__super__.constructor.apply(this, arguments);
    window.addEventListener('resize', this._resize);
  }
  Resizer.prototype._resize = function() {
    return this.trigger('resize');
  };
  return Resizer;
})(EventDispatcher);
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
cms.core.InterfaceController = (function() {
  InterfaceController.getInstance = function() {
    return InterfaceController._instance != null ? InterfaceController._instance : InterfaceController._instance = (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(InterfaceController, arguments, function(){});
  };
  function InterfaceController() {
    this._loginStatusChange = __bind(this._loginStatusChange, this);
    this._interfaceRendered = __bind(this._interfaceRendered, this);
    this._interfaceLoaded = __bind(this._interfaceLoaded, this);
    this._pageShown = __bind(this._pageShown, this);
    this._apiRedirectInterceptor = __bind(this._apiRedirectInterceptor, this);
    app.user.on(User.STATUS_CHANGE, this._loginStatusChange);
    API.intercept(/.*/g, this._apiRedirectInterceptor);
  }
  InterfaceController.get({
    context: function() {
      return this._context;
    }
  });
  InterfaceController.prototype._apiRedirectInterceptor = function(data, url) {
    if (data != null ? data.goto : void 0) {
      return app.router.goto(data.goto);
    } else if (data != null ? data.redirect : void 0) {
      return app.router.goto(data.redirect);
    } else if (data != null ? data.refresh : void 0) {
      return 1;
    }
  };
  InterfaceController.prototype.show = function(page) {
    if (page == null) {
      page = null;
    }
    if (!app.user.logged) {
      return;
    }
    if (!this._interfaceShown) {
      this._showInterface();
      return;
    }
    if (!page) {
      page = app.router.getCurrentPath();
    }
    page = page.trim('/');
    if (page.length === 0) {
      page = 'index';
    }
    return this._showPage(page);
  };
  InterfaceController.prototype._showPage = function(page) {
    var k, pageParts, parsedPath, pathObj, v, validPage, _ref;
    if (!this._loading) {
      this._loading = new cms.ui.Loading();
    }
    this._context.appendChildAt(this._loading, 0);
    this._loading.show();
    this._loading.progress = 0.5;
    validPage = this._findValidPage(page);
    if (!validPage) {
      return;
    }
    pathObj = {};
    parsedPath = app.router.getParsedPath();
    page = page.replace(/(\?|\#).*?$/, '');
    pageParts = page.substr(page.indexOf(validPage) + validPage.length).trim('/').split('/');
    for (k in pageParts) {
      v = pageParts[k];
      pathObj[k] = v;
    }
    _ref = parsedPath.params;
    for (k in _ref) {
      v = _ref[k];
      pathObj[k] = v;
    }
    slikland.Mara.setGlobalObject('$', pathObj);
    slikland.Mara.setGlobalObject('#', parsedPath.hashes);
    return app.template.render('pages/' + validPage, {}, this._context.element, this._pageShown);
  };
  InterfaceController.prototype._pageShown = function() {
    this._loading.progress = 1;
    return this._loading.hide();
  };
  InterfaceController.prototype._findValidPage = function(page) {
    var i, p;
    if (page == null) {
      page = '';
    }
    page = page.trim('/');
    i = this._availPages.length;
    while (i-- > 0) {
      p = this._availPages[i].path;
      if (page.indexOf(p) === 0) {
        return p;
      }
    }
    return null;
  };
  InterfaceController.prototype._showInterface = function() {
    if (!app.user.logged) {
      return;
    }
    this._interfaceShown = true;
    return API.call(app.rootPath + 'api/cms/cms/getInterface', null, this._interfaceLoaded);
  };
  InterfaceController.prototype._interfaceLoaded = function(e, data) {
    var iData;
    this._availPages = data.pages;
    this._availPages.sort(this._sortPages);
    iData = {
      user: app.user.data,
      "interface": data
    };
    return app.template.render('interface/interface', iData, document.body, this._interfaceRendered);
  };
  InterfaceController.prototype._sortPages = function(a, b) {
    var aal, asl, bal, bsl;
    a = a.path.trim('/');
    b = b.path.trim('/');
    aal = a.split('/').length;
    bal = b.split('/').length;
    if (aal < bal) {
      return -1;
    } else if (aal > bal) {
      return 1;
    }
    asl = a.length;
    bsl = b.length;
    if (asl < bsl) {
      return -1;
    } else if (asl > bsl) {
      return 1;
    }
    return 0;
  };
  InterfaceController.prototype._interfaceRendered = function(items, block) {
    var context;
    context = items[0][1];
    this._header = context.querySelector('header');
    this._menu = context.querySelector('nav');
    this._context = new BaseDOM({
      element: context.querySelector('main')
    });
    return this.show();
  };
  InterfaceController.prototype._loginStatusChange = function() {
    return this._interfaceShown = false;
  };
  return InterfaceController;
})();
var __hasProp = {}.hasOwnProperty;
cms.ui.tag.attributes.Update = (function(_super) {
  var Plugin;
  __extends(Update, _super);
  function Update() {
    return Update.__super__.constructor.apply(this, arguments);
  }
  Update.SELECTOR = '[update]';
  Update.prototype._update = function(data) {
    var item, p, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = data.add;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      this._plugins[item] = new Plugin(item);
    }
    _ref1 = data.remove;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      p = this._plugins[item];
      if (p) {
        _results.push(typeof p.destroy === "function" ? p.destroy() : void 0);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Plugin = (function(_super1) {
    __extends(Plugin, _super1);
    Plugin._destroyPlugin = function(item) {};
    function Plugin(element) {
      this._input = __bind(this._input, this);
      this._change = __bind(this._change, this);
      this._updateTargets = __bind(this._updateTargets, this);
      var o, paramsRE, updateData;
      Plugin.__super__.constructor.call(this, {
        element: element
      });
      if (this.attr('update')) {
        this._updateParams = [];
        updateData = this.attr('update');
        paramsRE = /\[([^\[\]]+)\]/g;
        while (o = paramsRE.exec(updateData)) {
          this._updateParams.push(o[1].split(','));
        }
        if (this._updateParams.length > 0) {
          this.element.on('change', this._change);
          this.element.on('input', this._input);
          this.element.on('update', this._input);
          setTimeout(this._updateTargets, 1);
        }
      }
    }
    Plugin.prototype._updateTargets = function() {
      var i, items, j, li, lj, params, v, value, _ref;
      if (this.element.tagName.toLowerCase() === 'input' && ((_ref = this.element.getAttribute('type')) === 'radio' || _ref === 'checkbox')) {
        if (!this.element.checked) {
          return;
        }
      }
      li = this._updateParams.length;
      i = -1;
      while (++i < li) {
        params = this._updateParams[i];
        items = document.body.querySelectorAll(params[0]);
        try {
          v = null;
          with(this.element){v = eval(params[2])};;
          if (v) {
            value = v;
          }
        } catch (_error) {
          value = this.element.value;
        }
        if (!v) {
          value = this.element.value;
        }
        if (!value || value === void 0) {
          value = this.element.itemData;
        }
        if (value === void 0) {
          return;
        }
        lj = items.length;
        j = -1;
        while (++j < lj) {
          items[j].trigger(params[1], value);
        }
      }
    };
    Plugin.prototype._updateDelayed = function() {
      clearTimeout(this._updateTimeout);
      return this._updateTimeout = setTimeout(this._updateTargets, 200);
    };
    Plugin.prototype._change = function(e) {
      return this._updateTargets();
    };
    Plugin.prototype._input = function() {
      return this._updateDelayed();
    };
    return Plugin;
  })(BaseDOM);
  return Update;
})(cms.ui.Base);
var __hasProp = {}.hasOwnProperty;
cms.ui.attributes.Template = (function(_super) {
  var Plugin;
  __extends(Template, _super);
  function Template() {
    return Template.__super__.constructor.apply(this, arguments);
  }
  Template.SELECTOR = 'a[template],button[template]';
  Template.prototype._update = function(data) {
    var item, p, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = data.add;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      this._plugins[item] = new Plugin(item);
    }
    _ref1 = data.remove;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      p = this._plugins[item];
      if (p) {
        _results.push(typeof p.destroy === "function" ? p.destroy() : void 0);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Plugin = (function(_super1) {
    __extends(Plugin, _super1);
    Plugin._destroyPlugin = function(item) {};
    function Plugin(element) {
      this._click = __bind(this._click, this);
      Plugin.__super__.constructor.call(this, {
        element: element
      });
      this._element.on('click', this._click);
    }
    Plugin.prototype._click = function() {
      var o;
      o = {
        template: this.attr('template'),
        target: this.attr('templateTarget'),
        currentTarget: this
      };
      return app.trigger(Main.RENDER_TEMPLATE, o);
    };
    return Plugin;
  })(BaseDOM);
  return Template;
})(cms.ui.Base);
var __hasProp = {}.hasOwnProperty;
cms.ui.tag.attributes.Sort = (function(_super) {
  var Plugin;
  __extends(Sort, _super);
  function Sort() {
    return Sort.__super__.constructor.apply(this, arguments);
  }
  Sort.SELECTOR = '[sort]';
  Sort.prototype._update = function(data) {
    var item, p, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = data.add;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      this._plugins[item] = new Plugin(item);
    }
    _ref1 = data.remove;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      p = this._plugins[item];
      if (p) {
        _results.push(typeof p.destroy === "function" ? p.destroy() : void 0);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Plugin = (function(_super1) {
    __extends(Plugin, _super1);
    Plugin._destroyPlugin = function(item) {};
    function Plugin(element) {
      this._sortByOrder = __bind(this._sortByOrder, this);
      this._click = __bind(this._click, this);
      this._update = __bind(this._update, this);
      this._resetOthers = __bind(this._resetOthers, this);
      this._parseParam = __bind(this._parseParam, this);
      Plugin.__super__.constructor.call(this, {
        element: element
      });
      this._name = this.attr('sort');
      this._element.setAttribute('name', 'sort');
      this._sortButton = document.createElement('span');
      this._sortButton.className = 'sort';
      this._icon = document.createElement('i');
      this._icon.className = 'fa icon';
      this._sortButton.appendChild(this._icon);
      this._sortOrder = document.createElement('sup');
      this._sortButton.appendChild(this._sortOrder);
      this._getTarget();
      this._parseParam();
      this._element.on('click', this._click);
      this._element.on('update', this._update);
      this.appendChild(this._sortButton);
    }
    Plugin.prototype._getTarget = function() {
      if (this.attr('for')) {
        this._target = document.querySelector('#' + this.attr('for'));
        return this._parentTarget = this._target.parentNode;
      } else {
        this._target = this.findParents('[service]');
        return this._parentTarget = this._target;
      }
    };
    Plugin.prototype._parseParam = function() {
      var data, index, targetId;
      if ((targetId = this._target.getAttribute('id'))) {
        data = app.router.getParam(targetId);
        if (!data) {
          return;
        }
        if (data['sort']) {
          data = [].concat(data['sort']);
          if ((index = data.indexOf(this._name)) >= 0) {
            if (data.length > 1) {
              this._element.sortOrder = index;
            }
            this._element.value = this._name;
          } else if ((index = data.indexOf('-' + this._name)) >= 0) {
            if (data.length > 1) {
              this._element.sortOrder = index;
            }
            this._element.value = '-' + this._name;
          }
        }
        this._element.setAttribute('for', targetId);
        return this._update();
      }
    };
    Plugin.prototype._resetOthers = function() {
      var i, items, _results;
      items = this._parentTarget.querySelectorAll('[sort]');
      i = items.length;
      _results = [];
      while (i-- > 0) {
        items[i].sortOrder = null;
        delete items[i].sortOrder;
        if (items[i] === this._element) {
          continue;
        }
        _results.push(items[i].value = null);
      }
      return _results;
    };
    Plugin.prototype._updateAll = function() {
      var i, items, _results;
      items = this._parentTarget.querySelectorAll('[sort]');
      i = items.length;
      _results = [];
      while (i-- > 0) {
        _results.push(items[i].trigger('update'));
      }
      return _results;
    };
    Plugin.prototype._update = function() {
      this._getTarget();
      if (!this._element.value) {
        this._element.removeAttribute('value');
      } else {
        this._element.setAttribute('value', this._element.value);
      }
      if (!isNaN(this._element.sortOrder)) {
        this._element.setAttribute('sortOrder', this._element.sortOrder);
        return this._sortOrder.innerHTML = this._element.sortOrder;
      } else {
        this._element.removeAttribute('sortOrder');
        return this._sortOrder.innerHTML = '';
      }
    };
    Plugin.prototype._click = function(e) {
      var i, index, items, value;
      value = this._element.value;
      if (value && !(/^\-/.test(value))) {
        value = '-' + this._name;
      } else {
        value = this._name;
      }
      if (e.metaKey) {
        items = ArrayUtils.toArray(this._parentTarget.querySelectorAll('[sort][value]'));
        items.sort(this._sortByOrder);
        index = items.length;
        i = items.length;
        while (i-- > 0) {
          items[i].sortOrder = i;
          if (items[i] === this._element) {
            index = i;
          }
        }
        this._element.sortOrder = index;
      } else {
        this._resetOthers();
      }
      this._element.value = value;
      this._updateAll();
      return this._target.trigger('update');
    };
    Plugin.prototype._sortByOrder = function(a, b) {
      if (a.sortOrder < b.sortOrder) {
        return -1;
      } else if (a.sortOrder > b.sortOrder) {
        return 1;
      }
      return 0;
    };
    return Plugin;
  })(BaseDOM);
  return Sort;
})(cms.ui.Base);
var __hasProp = {}.hasOwnProperty;
cms.ui.attributes.Size = (function(_super) {
  __extends(Size, _super);
  Size.SELECTOR = '[height],[width]';
  function Size() {
    Size.__super__.constructor.apply(this, arguments);
  }
  Size.prototype._update = function(data) {
    var i, item, items, s, _results;
    items = data.add;
    i = items.length;
    _results = [];
    while (i-- > 0) {
      item = items[i];
      if (item.hasAttribute('width')) {
        s = item.getAttribute('width');
        if (/^\s*[\d\.]+\s*$/.test(s)) {
          s += 'px';
        }
        item.style.width = s;
      }
      if (item.hasAttribute('height')) {
        s = item.getAttribute('height');
        if (/^\s*[\d\.]+\s*$/.test(s)) {
          s += 'px';
        }
        _results.push(item.style.height = s);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  return Size;
})(cms.ui.Base);
var __hasProp = {}.hasOwnProperty;
cms.ui.tag.attributes.ShowModal = (function(_super) {
  var Plugin;
  __extends(ShowModal, _super);
  function ShowModal() {
    return ShowModal.__super__.constructor.apply(this, arguments);
  }
  ShowModal.SELECTOR = '[showModal]';
  ShowModal.prototype._update = function(data) {
    var item, p, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = data.add;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      this._plugins[item] = new Plugin(item);
    }
    _ref1 = data.remove;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      p = this._plugins[item];
      if (p) {
        _results.push(typeof p.destroy === "function" ? p.destroy() : void 0);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Plugin = (function(_super1) {
    __extends(Plugin, _super1);
    Plugin._destroyPlugin = function(item) {};
    function Plugin(element) {
      this._buttonClick = __bind(this._buttonClick, this);
      this._modalRendered = __bind(this._modalRendered, this);
      this._click = __bind(this._click, this);
      this._addEventListener = __bind(this._addEventListener, this);
      Plugin.__super__.constructor.call(this, {
        element: element
      });
      this._modalRef = this.attr('showModal');
      setTimeout(this._addEventListener, 1);
    }
    Plugin.prototype._addEventListener = function() {
      return this._element.on('click', this._click);
    };
    Plugin.prototype._click = function(e) {
      app.template.renderBlockByReference(this._modalRef, null, null, this._modalRendered);
      e.preventDefault();
      return e.stopImmediatePropagation();
    };
    Plugin.prototype._modalRendered = function(items, block) {
      var button, buttons, _i, _len, _results;
      this._target = items[0][1];
      buttons = this._target.querySelectorAll('button');
      _results = [];
      for (_i = 0, _len = buttons.length; _i < _len; _i++) {
        button = buttons[_i];
        _results.push(button.on('click', this._buttonClick));
      }
      return _results;
    };
    Plugin.prototype._buttonClick = function(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return this._target.parentNode.removeChild(this._target);
    };
    return Plugin;
  })(BaseDOM);
  return ShowModal;
})(cms.ui.Base);
var __hasProp = {}.hasOwnProperty;
<<<<<<< HEAD
=======
cms.ui.tag.attributes.Show = (function(_super) {
  var Plugin;
  __extends(Show, _super);
  function Show() {
    return Show.__super__.constructor.apply(this, arguments);
  }
  Show.SELECTOR = '[show]';
  Show.prototype._update = function(data) {
    var item, p, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = data.add;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      this._plugins[item] = new Plugin(item);
    }
    _ref1 = data.remove;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      p = this._plugins[item];
      if (p) {
        _results.push(typeof p.destroy === "function" ? p.destroy() : void 0);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Plugin = (function(_super1) {
    __extends(Plugin, _super1);
    Plugin._destroyPlugin = function(item) {};
    function Plugin(element) {
      this._change = __bind(this._change, this);
      Plugin.__super__.constructor.call(this, {
        element: element
      });
      this._element.on('change', this._change);
    }
    Plugin.prototype._change = function(e) {
      var container, currentTarget, input, inputs, selectedOption, _i, _len, _results;
      currentTarget = e.target;
      container = e.target.parentNode.parentNode;
      inputs = container.querySelectorAll(this.attr('show'));
      selectedOption = currentTarget.options[currentTarget.selectedIndex].value;
      _results = [];
      for (_i = 0, _len = inputs.length; _i < _len; _i++) {
        input = inputs[_i];
        if (selectedOption === '' || selectedOption === '0' || selectedOption === 0) {
          _results.push(input.parentNode.style.display = 'block');
        } else {
          _results.push(input.parentNode.style.display = 'none');
        }
      }
      return _results;
    };
    return Plugin;
  })(BaseDOM);
  return Show;
})(cms.ui.Base);
var __hasProp = {}.hasOwnProperty;
>>>>>>> e7ae198632b8f6dcb0244fdb7217c24fa9124aea
cms.ui.tag.attributes.Service = (function(_super) {
  var Plugin;
  __extends(Service, _super);
  function Service() {
    return Service.__super__.constructor.apply(this, arguments);
  }
  Service.SELECTOR = '[service]';
  Service._queue = [];
  Service.prototype._update = function(data) {
    var item, p, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = data.add;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (item.hasAttribute('service')) {
        this._plugins[item] = new Plugin(item);
      }
    }
    _ref1 = data.remove;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      p = this._plugins[item];
      this.removeQueue(p);
      if (p) {
        _results.push(typeof p.destroy === "function" ? p.destroy() : void 0);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Service.prototype.removeQueue = function(plugin) {};
  Service.prototype.queueService = function(plugin, delay) {
    if (delay == null) {
      delay = 0;
    }
  };
  Service.prototype._sortByOrder = function(a, b) {
    if (a.order > b.order) {
      return 1;
    }
    if (a.order < b.order) {
      return -1;
    }
    return 0;
  };
  Plugin = (function(_super1) {
    __extends(Plugin, _super1);
    Plugin._destroyPlugin = function(item) {};
    function Plugin(element) {
      this._sortByOrder = __bind(this._sortByOrder, this);
      this._serviceError = __bind(this._serviceError, this);
      this._serviceLoaded = __bind(this._serviceLoaded, this);
      this._parseData = __bind(this._parseData, this);
      this._onProgress = __bind(this._onProgress, this);
      this._showProgress = __bind(this._showProgress, this);
      this._removeProgress = __bind(this._removeProgress, this);
      this._loadService = __bind(this._loadService, this);
      this._update = __bind(this._update, this);
      this._abort = __bind(this._abort, this);
      Plugin.__super__.constructor.call(this, {
        element: element
      });
<<<<<<< HEAD
      this._refreshInterval = Number(this.getAttribute('serviceRefreshInterval'));
=======
>>>>>>> e7ae198632b8f6dcb0244fdb7217c24fa9124aea
      this._element.on('update', this._update);
      this._element.on('abort', this._abort);
      this._loadServiceTimeout = setTimeout(this._loadService, 1);
    }
    Plugin.prototype._abort = function() {
      var _ref;
<<<<<<< HEAD
      this._clearTimeout();
=======
      clearTimeout(this._loadServiceTimeout);
>>>>>>> e7ae198632b8f6dcb0244fdb7217c24fa9124aea
      if ((_ref = this._api) != null) {
        _ref.abort();
      }
      return this._removeProgress();
    };
    Plugin.prototype._update = function(e, data) {
<<<<<<< HEAD
=======
      clearTimeout(this._loadServiceTimeout);
>>>>>>> e7ae198632b8f6dcb0244fdb7217c24fa9124aea
      return this._loadServiceTimeout = setTimeout(this._loadService, 300);
    };
    Plugin.prototype._loadService = function() {
      var data;
<<<<<<< HEAD
      if (this._isLoading) {
        return;
      }
      this._clearTimeout();
      this._isLoading = true;
=======
      clearTimeout(this._loadServiceTimeout);
>>>>>>> e7ae198632b8f6dcb0244fdb7217c24fa9124aea
      data = this._parseData();
      this._api = API.call(this._element.getAttribute('service'), data, this._serviceLoaded, this._serviceError);
      this._api.on(API.PROGRESS, this._onProgress);
      return this._showProgress();
    };
    Plugin.prototype._removeEventListeners = function() {
      return this._api.off(API.PROGRESS, this._onProgress);
    };
    Plugin.prototype._removeProgress = function() {
      if (this._loading) {
        return this._loading.hide();
      }
    };
    Plugin.prototype._showProgress = function() {
      if (this.element.hasAttribute('noloading')) {
        return;
      }
      if (!this._loading) {
        this._loading = new cms.ui.Loading();
      }
      this._loading.reset();
      this._loading.show();
      return this.appendChildAt(this._loading, 0);
    };
    Plugin.prototype._onProgress = function(e, data) {
      var _ref;
      return (_ref = this._loading) != null ? _ref.progress = data.progress : void 0;
    };
    Plugin.prototype._parseData = function() {
      var i, id, item, items, multiple, name, paramSet, params, sort, sortValues, value, _i, _len, _ref, _ref1;
      params = app.router.getParam(this.attr('id'));
      if (this.attr('id')) {
        id = this.attr('id');
        params = {};
        paramSet = false;
        items = document.querySelectorAll('[for=' + id + ']');
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          item = items[_i];
          multiple = false;
          name = item.getAttribute('name');
          value = item.value;
          switch (item.tagName.toLowerCase()) {
            case 'input':
              if ((_ref = item.getAttribute('type')) === 'checkbox') {
                multiple = true;
              }
              if ((_ref1 = item.getAttribute('type')) === 'checkbox' || _ref1 === 'radio') {
                if (!item.checked) {
                  value = null;
                }
              }
              break;
            case 'pagination':
              if (item.index) {
                paramSet = true;
                params['_index'] = item.index;
              }
              if (item.numItems) {
                params['_numItems'] = item.numItems;
              }
              break;
            default:
              if (item.hasAttribute('sort')) {
                continue;
              }
          }
          if (value) {
            paramSet = true;
            if (multiple) {
              if (!params[name]) {
                params[name] = [];
              }
              params[name].push(value);
            } else {
              params[name] = value;
            }
          }
        }
        sort = [].concat(ArrayUtils.toArray(this._element.querySelectorAll('[sort][value]')), ArrayUtils.toArray(document.querySelectorAll('[for="' + id + '"][sort][value]')));
        if (sort.length > 0) {
          sort.sort(this._sortByOrder);
          sortValues = [];
          i = sort.length;
          while (i-- > 0) {
            sortValues[i] = sort[i].value;
          }
          paramSet = true;
          params['sort'] = sortValues;
        }
        if (paramSet) {
          app.router.setParam(id, params);
        } else {
          app.router.removeParam(id);
        }
      }
      return params;
    };
<<<<<<< HEAD
    Plugin.prototype._checkTimeout = function() {
      console.log(this._refreshInterval);
      if (this._refreshInterval) {
        return this._loadServiceTimeout = setTimeout(this._loadService, this._refreshInterval * 1000);
      }
    };
    Plugin.prototype._clearTimeout = function() {
      return clearTimeout(this._loadServiceTimeout);
    };
=======
>>>>>>> e7ae198632b8f6dcb0244fdb7217c24fa9124aea
    Plugin.prototype._serviceLoaded = function(e, data) {
      var i, id, items, _ref, _ref1;
      app.template.renderBlock(this._element, data);
      if (this.attr('id')) {
        id = this.attr('id');
        items = document.querySelectorAll('[for=' + id + ']');
        i = items.length;
        while (i-- > 0) {
          items[i].trigger('update', data);
        }
      }
      if ((data != null ? (_ref = data.notification) != null ? (_ref1 = _ref.message) != null ? _ref1.length : void 0 : void 0 : void 0) > 0) {
        if (!data.notification.type) {
          data.notification.type = 3;
        }
        app.notification.showNotification(data.notification);
      }
      this._element.trigger('updated', data);
      this._removeEventListeners();
<<<<<<< HEAD
      this._removeProgress();
      this._checkTimeout();
      return this._isLoading = false;
=======
      return this._removeProgress();
>>>>>>> e7ae198632b8f6dcb0244fdb7217c24fa9124aea
    };
    Plugin.prototype._serviceError = function(e, data) {
      var _ref;
      if ((data != null ? (_ref = data.message) != null ? _ref.length : void 0 : void 0) > 0) {
        if (!data.type) {
          data.type = 1;
        }
        app.notification.showNotification(data);
      }
      if (this._element.getAttribute('onError')) {
        app.router.goto(this._element.getAttribute('onError'));
      }
      this._removeEventListeners();
<<<<<<< HEAD
      this._removeProgress();
      this._checkTimeout();
      return this._isLoading = false;
=======
      return this._removeProgress();
>>>>>>> e7ae198632b8f6dcb0244fdb7217c24fa9124aea
    };
    Plugin.prototype._sortByOrder = function(a, b) {
      if (a.sortOrder < b.sortOrder) {
        return -1;
      } else if (a.sortOrder > b.sortOrder) {
        return 1;
      }
      return 0;
    };
    return Plugin;
  })(BaseDOM);
  return Service;
})(cms.ui.Base);
var __hasProp = {}.hasOwnProperty;
cms.ui.tag.attributes.Remove = (function(_super) {
  var Plugin;
  __extends(Remove, _super);
  function Remove() {
    return Remove.__super__.constructor.apply(this, arguments);
  }
  Remove.SELECTOR = '[remove]';
  Remove.prototype._update = function(data) {
    var item, p, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = data.add;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      this._plugins[item] = new Plugin(item);
    }
    _ref1 = data.remove;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      p = this._plugins[item];
      if (p) {
        _results.push(typeof p.destroy === "function" ? p.destroy() : void 0);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Plugin = (function(_super1) {
    __extends(Plugin, _super1);
    Plugin._destroyPlugin = function(item) {};
    function Plugin(element) {
      this._click = __bind(this._click, this);
      Plugin.__super__.constructor.call(this, {
        element: element
      });
      this._element.on('click', this._click);
    }
    Plugin.prototype._click = function(e) {
      var target;
      e.preventDefault();
      e.stopImmediatePropagation();
      target = this.findParents(this.attr('remove'));
      if (target) {
        return target.parentNode.removeChild(target);
      }
    };
    return Plugin;
  })(BaseDOM);
  return Remove;
})(cms.ui.Base);
var __hasProp = {}.hasOwnProperty;
cms.ui.tag.attributes.Href = (function(_super) {
  var Plugin;
  __extends(Href, _super);
  function Href() {
    return Href.__super__.constructor.apply(this, arguments);
  }
  Href.SELECTOR = '[href]';
  Href.prototype._update = function(data) {
    var item, p, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = data.add;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (item.hasAttribute('href') && !item.getAttribute('target')) {
        this._plugins[item] = new Plugin(item);
      }
    }
    _ref1 = data.remove;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      p = this._plugins[item];
      if (p) {
        _results.push(typeof p.destroy === "function" ? p.destroy() : void 0);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Plugin = (function(_super1) {
    __extends(Plugin, _super1);
    Plugin._destroyPlugin = function(item) {};
    function Plugin(element) {
      this._click = __bind(this._click, this);
      Plugin.__super__.constructor.call(this, {
        element: element
      });
      this._element.on('click', this._click);
    }
    Plugin.prototype._click = function(e) {
      app.router.goto(this.attr('href'));
      e.preventDefault();
      return e.stopImmediatePropagation();
    };
    return Plugin;
  })(BaseDOM);
  return Href;
})(cms.ui.Base);
var __hasProp = {}.hasOwnProperty;
cms.ui.tag.attributes.For = (function(_super) {
  var Plugin;
  __extends(For, _super);
  function For() {
    return For.__super__.constructor.apply(this, arguments);
  }
  For.SELECTOR = '[for]';
  For.prototype._update = function(data) {
    var item, p, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = data.add;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (item.hasAttribute('sort')) {
        continue;
      }
      this._plugins[item] = new Plugin(item);
    }
    _ref1 = data.remove;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      p = this._plugins[item];
      if (p) {
        _results.push(typeof p.destroy === "function" ? p.destroy() : void 0);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Plugin = (function(_super1) {
    __extends(Plugin, _super1);
    Plugin._destroyPlugin = function(item) {};
    function Plugin(element) {
      this._change = __bind(this._change, this);
      Plugin.__super__.constructor.call(this, {
        element: element
      });
      this._target = document.querySelector('#' + this.attr('for'));
      this._value = '';
      this._setItemValue();
      this._element.on('change', this._change);
      this._element.on('input', this._change);
    }
    Plugin.prototype._setItemValue = function() {
      var data, id, name, _ref, _ref1, _ref2;
      id = this._element.getAttribute('for');
      data = app.router.getParam(id);
      if (!data) {
        return;
      }
      name = this._element.getAttribute('name');
      if (name && data[name]) {
        data = data[name];
        if (this._element.tagName.toLowerCase() === 'input' && ((_ref = (_ref1 = this._element.getAttribute('type')) != null ? _ref1.toLowerCase() : void 0) === 'checkbox' || _ref === 'radio')) {
          if (_ref2 = this._element.value, __indexOf.call(data, _ref2) >= 0) {
            this._element.checked = true;
            this._element.trigger('change');
            return this._value = true;
          } else {
            return this._value = false;
          }
        } else {
          this._element.value = data;
          return this._value = data;
        }
      }
    };
    Plugin.prototype._change = function() {
      var changed, newValue, _ref, _ref1, _ref2;
      this._target = document.querySelector('#' + this.attr('for'));
      changed = false;
      newValue = null;
      if (this._element.tagName.toLowerCase() === 'input' && ((_ref = (_ref1 = this._element.getAttribute('type')) != null ? _ref1.toLowerCase() : void 0) === 'checkbox' || _ref === 'radio')) {
        newValue = this._element.checked;
        if (newValue !== this._value) {
          changed = true;
          this._value = newValue;
        }
      } else {
        newValue = this._element.value;
        if (newValue.trim() !== this._value.trim()) {
          changed = true;
          this._value = newValue;
        }
      }
      if (changed) {
        return (_ref2 = this._target) != null ? _ref2.trigger('update') : void 0;
      }
    };
    return Plugin;
  })(BaseDOM);
  return For;
})(cms.ui.Base);
var __hasProp = {}.hasOwnProperty;
cms.ui.attributes.Focus = (function(_super) {
  __extends(Focus, _super);
  Focus.SELECTOR = '[focus]';
  function Focus() {
    Focus.__super__.constructor.apply(this, arguments);
  }
  Focus.prototype._update = function(data) {
    var i, item, items, _results;
    items = data.add;
    i = items.length;
    _results = [];
    while (i-- > 0) {
      item = items[i];
      _results.push(item.focus());
    }
    return _results;
  };
  return Focus;
})(cms.ui.Base);
var __hasProp = {}.hasOwnProperty;
cms.ui.tag.attributes.FAB = (function(_super) {
  var Plugin;
  __extends(FAB, _super);
  function FAB() {
    return FAB.__super__.constructor.apply(this, arguments);
  }
  FAB.SELECTOR = 'fab,button[type="fab"],button.fab';
  FAB.prototype._update = function(data) {
    var item, p, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = data.add;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      this._plugins[item] = new Plugin(item);
    }
    _ref1 = data.remove;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      p = this._plugins[item];
      if (p) {
        _results.push(typeof p.destroy === "function" ? p.destroy() : void 0);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Plugin = (function(_super1) {
    __extends(Plugin, _super1);
    Plugin._destroyPlugin = function(item) {};
    function Plugin(element) {
      this._checkPosition = __bind(this._checkPosition, this);
      this._scroll = __bind(this._scroll, this);
      this.destroy = __bind(this.destroy, this);
      this._setPosition = __bind(this._setPosition, this);
      Plugin.__super__.constructor.call(this, {
        element: element
      });
      if (this.attr('on')) {
        this.css('visibility', 'hidden');
        setTimeout(this._setPosition, 100);
      }
    }
    Plugin.prototype._setPosition = function() {
      this._target = document.querySelector('#' + this.attr('on'));
      this._position = 'TR';
      if (this.attr('position')) {
        this._position = this.attr('position');
      }
      this._checkPosition();
      return this.css('visibility', '');
    };
    Plugin.prototype.destroy = function() {
      Plugin.__super__.destroy.apply(this, arguments);
      this._target = null;
      return window.cancelAnimationFrame(this._checkPositionTicker);
    };
    Plugin.prototype._scroll = function() {};
    Plugin.prototype._checkPosition = function() {
      var bBounds, bounds, l, pBounds, t;
      if (!this._target || !this._element.parentNode) {
        return;
      }
      this._checkPositionTicker = window.requestAnimationFrame(this._checkPosition);
      bounds = this._getTargetBounds(this._target);
      pBounds = this._element.parentNode.getBoundingClientRect();
      bBounds = this.getBounds();
      t = bounds.top + bBounds.height * 0.25;
      l = bounds.left;
      if (bounds.bottom < bBounds.height * 1.5) {
        t = bounds.bottom - bBounds.height * 1.25;
      } else if (t < bBounds.height * 0.25) {
        t = bBounds.height * 0.25;
      }
      t += pBounds.top;
      if (bounds.right < bBounds.width * 1.25) {
        l = bounds.bottom - bBounds.width * 1.25;
      } else if (l < 0) {
        l = 0;
      }
      l += pBounds.left + bounds.width - bBounds.width * 1.25;
      return this.css({
        'top': t + 'px',
        left: l + 'px'
      });
    };
    Plugin.prototype._getTargetBounds = function(target) {
      var bounds, boundsObj, k, tbounds, v;
      if (target == null) {
        target = null;
      }
      boundsObj = {};
      bounds = target.getBoundingClientRect();
      for (k in bounds) {
        v = bounds[k];
        boundsObj[k] = v;
      }
      if (this._element.parentNode) {
        tbounds = this._element.parentNode.getBoundingClientRect();
      }
      if (tbounds) {
        boundsObj.top -= tbounds.top;
        boundsObj.left -= tbounds.left;
        boundsObj.bottom -= tbounds.top;
        boundsObj.right -= tbounds.left;
      }
      boundsObj.width = boundsObj.right - boundsObj.left;
      boundsObj.height = boundsObj.bottom - boundsObj.top;
      return boundsObj;
    };
    return Plugin;
  })(BaseDOM);
  return FAB;
})(cms.ui.Base);
var __hasProp = {}.hasOwnProperty;
cms.ui.tag.attributes.Duplicate = (function(_super) {
  var Plugin;
  __extends(Duplicate, _super);
  function Duplicate() {
    return Duplicate.__super__.constructor.apply(this, arguments);
  }
  Duplicate.SELECTOR = '[duplicate]';
  Duplicate.prototype._update = function(data) {
    var item, p, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = data.add;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      this._plugins[item] = new Plugin(item);
    }
    _ref1 = data.remove;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      p = this._plugins[item];
      if (p) {
        _results.push(typeof p.destroy === "function" ? p.destroy() : void 0);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Plugin = (function(_super1) {
    __extends(Plugin, _super1);
    Plugin._form = null;
    Plugin._destroyPlugin = function(item) {};
    function Plugin(element) {
      this._click = __bind(this._click, this);
      Plugin.__super__.constructor.call(this, {
        element: element
      });
      this._element.on('click', this._click);
    }
    Plugin.prototype._click = function(e) {
      var block, child, input, inputs, target, _i, _len;
      e.preventDefault();
      e.stopImmediatePropagation();
      target = app["interface"].context.find(this.attr('duplicate'));
      block = slikland.mara.Block.findBlock(target.getAttribute('mara'));
      child = target.cloneNode(true);
      inputs = child.querySelectorAll('input,textarea');
      for (_i = 0, _len = inputs.length; _i < _len; _i++) {
        input = inputs[_i];
        input.value = '';
        input.innerHTML = '';
      }
      return target.parentNode.appendChild(child);
    };
    return Plugin;
  })(BaseDOM);
  return Duplicate;
})(cms.ui.Base);
var MouseUtils;
MouseUtils = (function() {
  function MouseUtils() {}
  MouseUtils.getMousePos = function(e, global) {
    var x, y;
    if (global == null) {
      global = true;
    }
    x = e.pageX || e.clientX;
    y = e.pageY || e.clientY;
    if (global) {
      x += document.body.scrollLeft + document.documentElement.scrollLeft;
      y += document.body.scrollTop + document.documentElement.scrollTop;
    }
    return [x, y];
  };
  MouseUtils.toGlobal = function(x, y) {
    x += document.body.scrollLeft + document.documentElement.scrollLeft;
    y += document.body.scrollTop + document.documentElement.scrollTop;
    return [x, y];
  };
  return MouseUtils;
})();
var __hasProp = {}.hasOwnProperty;
cms.ui.tag.attributes.Draggable = (function(_super) {
  var Plugin;
  __extends(Draggable, _super);
  function Draggable() {
    return Draggable.__super__.constructor.apply(this, arguments);
  }
  Draggable.SELECTOR = '[draggable]';
  Draggable.prototype._update = function(data) {
    var item, p, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = data.add;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      this._plugins[item] = new Plugin(item);
    }
    _ref1 = data.remove;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      p = this._plugins[item];
      if (p) {
        _results.push(typeof p.destroy === "function" ? p.destroy() : void 0);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Plugin = (function(_super1) {
    __extends(Plugin, _super1);
    Plugin._destroyPlugin = function(item) {};
    function Plugin(element) {
      this._moveCloned = __bind(this._moveCloned, this);
      this._mouseUp = __bind(this._mouseUp, this);
      this._sortPosition = __bind(this._sortPosition, this);
      this._switchElement = __bind(this._switchElement, this);
      this._findElementToSwitch = __bind(this._findElementToSwitch, this);
      this._mouseMove = __bind(this._mouseMove, this);
      this._mouseDown = __bind(this._mouseDown, this);
      this._findParentContext = __bind(this._findParentContext, this);
      Plugin.__super__.constructor.call(this, {
        element: element
      });
      this._draggableName = this.attr('draggable');
      this._dragHandler = document.createElement('i');
      this._dragHandler.className = 'drag-handle fa fa-ellipsis-h';
      this._dragHandler.on('mousedown', this._mouseDown);
      this._draggableContextSelector = '[draggableContext="' + this._draggableName + '"]';
      this.appendChild(this._dragHandler);
      this._parentContexts = this._findParentContext();
      if (this._parentContexts.length === 0) {
        this._parentContexts = [element.parentNode];
      }
      this._setupDraggables();
      this._getDraggableItems();
    }
    Plugin.prototype._findParentContext = function(target) {
      var contexts, i, parentContexts;
      if (target == null) {
        target = null;
      }
      contexts = document.body.querySelectorAll(this._draggableContextSelector);
      parentContexts = [];
      i = contexts.length;
      while (i-- > 0) {
        if (!contexts[i].findParents(this._draggableContextSelector)) {
          parentContexts.push(contexts[i]);
        }
      }
      return parentContexts;
    };
    Plugin.prototype._addEventListeners = function() {
      window.addEventListener('mousemove', this._mouseMove);
      window.addEventListener('mouseup', this._mouseUp);
      return window.addEventListener('mouseleave', this._mouseLeave);
    };
    Plugin.prototype._removeEventListeners = function() {
      window.removeEventListener('mousemove', this._mouseMove);
      window.removeEventListener('mouseup', this._mouseUp);
      return window.removeEventListener('mouseleave', this._mouseLeave);
    };
    Plugin.prototype._drop = function() {
      this._items = null;
      this._removeEventListeners();
      this._cloned.parentNode.removeChild(this._cloned);
      this._element.style.opacity = '';
      return this.element.trigger('update');
    };
    Plugin.prototype._mouseDown = function(e) {
      var bounds, handleOffset;
      this._updateDraggableItems();
      e.preventDefault();
      this._cloned = this._element.cloneNode(true);
      this._cloned.setAttribute('cloned', '1');
      this._cloned.style.position = 'absolute';
      this._cloned.style.opacity = '0.4';
      handleOffset = this.getBounds(this._dragHandler);
      this._elOffset = {
        x: e.offsetX - handleOffset.left,
        y: e.offsetY - handleOffset.top
      };
      this._cloned.style.top = '0px';
      this._cloned.style.left = '0px';
      this._cloned.style.zIndex = '100';
      bounds = this.getBounds();
      this._cloned.style.width = bounds.width + 'px';
      this._cloned.style.height = bounds.height + 'px';
      this._element.style.opacity = '0.6';
      this._element.parentNode.appendChild(this._cloned);
      this._moveCloned(e);
      return this._addEventListeners();
    };
    Plugin.prototype._setupDraggables = function() {
      var child, children, context, i, placeholder, _i, _len, _ref, _results;
      if (this._parentContexts[0].querySelector('draggableplaceholder')) {
        return;
      }
      _ref = this._parentContexts;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        context = _ref[_i];
        children = context.querySelectorAll('[draggableContext="' + this._draggableName + '"]');
        i = children.length;
        while (i-- > 0) {
          child = children[i];
          placeholder = document.createElement('draggableplaceholder');
          placeholder.style.width = '100%';
          placeholder.style.height = '100%';
          placeholder.style.display = 'inline-block';
          child.appendChild(placeholder);
        }
        placeholder = document.createElement('draggableplaceholder');
        placeholder.style.width = '100%';
        placeholder.style.height = '100%';
        placeholder.style.display = 'inline-block';
        _results.push(context.appendChild(placeholder));
      }
      return _results;
    };
    Plugin.prototype._getDraggableItems = function() {
      var items;
      items = this._getDraggableChildren(this._parentContexts);
      return items;
    };
    Plugin.prototype._getDraggableChildren = function(contexts) {
      var children, context, i, items, _i, _len;
      items = [];
      contexts = [].concat(contexts);
      for (_i = 0, _len = contexts.length; _i < _len; _i++) {
        context = contexts[_i];
        children = context.children;
        i = children.length;
        while (i-- > 0) {
          if (children[i] !== this._element && !children[i].hasAttribute('cloned')) {
            items.push({
              element: children[i]
            });
          }
        }
      }
      return items;
    };
    Plugin.prototype._updateDraggableItems = function() {
      var context, cpos, element, i, item, pos, _results;
      if (!this._items) {
        this._items = this._getDraggableItems();
      }
      i = this._items.length;
      _results = [];
      while (i-- > 0) {
        item = this._items[i];
        element = item.element;
        pos = this._getElementPosition(element);
        if (context = element.querySelector('draggableContext')) {
          cpos = this._getElementPosition(context);
          pos.h -= cpos.h;
          pos.cy = pos.y + cpos.h * 0.5;
        }
        _results.push(item.pos = pos);
      }
      return _results;
    };
    Plugin.prototype._getElementPosition = function(element, ignoreChildDraggable) {
      var bounds, h, pos, px, py, w, wx, wy;
      if (ignoreChildDraggable == null) {
        ignoreChildDraggable = false;
      }
      pos = {};
      wx = document.body.scrollLeft + document.documentElement.scrollLeft;
      wy = document.body.scrollTop + document.documentElement.scrollTop;
      bounds = element.getBoundingClientRect();
      px = bounds.left;
      py = bounds.top;
      w = bounds.right - px;
      h = bounds.bottom - py;
      pos.x = px + wx;
      pos.y = py + wy;
      pos.w = w;
      pos.h = h;
      pos.cx = pos.x + w * 0.5;
      pos.cy = pos.y + h * 0.5;
      return pos;
    };
    Plugin.prototype._mouseMove = function(e) {
      var o, pos;
      this._moveCloned(e);
      pos = this._getElementPosition(this._cloned);
      o = this._findElementToSwitch(pos);
      if (o) {
        this._switchElement(o.element, o.after);
        return this._moveCloned(e);
      }
    };
    Plugin.prototype._findElementToSwitch = function(pos, contexts) {
      var a, after, cPos, child, children, closest, closestPos, context, d, dist, dx, dy, i, ipos, item, items, pi2, _i, _len, _ref, _ref1;
      if (contexts == null) {
        contexts = null;
      }
      if (!contexts) {
        contexts = this._parentContexts;
      }
      contexts = [].concat(contexts);
      closest = null;
      dist = Number.MAX_VALUE;
      for (_i = 0, _len = contexts.length; _i < _len; _i++) {
        context = contexts[_i];
        children = context.children;
        items = [];
        i = children.length;
        while (i-- > 0) {
          child = children[i];
          if (!child.matches('[cloned]')) {
            items.push(child);
          }
        }
        i = items.length;
        while (i-- > 0) {
          item = items[i];
          ipos = this._getElementPosition(item);
          dx = ipos.cx - pos.cx;
          dy = ipos.cy - pos.cy;
          d = dx * dx + dy * dy;
          if (d < dist) {
            dist = d;
            a = Math.atan2(dy, dx);
            closest = item;
            closestPos = ipos;
          }
        }
      }
      if (closest === this._element) {
        return null;
      }
      if (closest) {
        if (context = closest.querySelector('[draggableContext="' + this._draggableName + '"]')) {
          cPos = this._getElementPosition(context);
          if ((cPos.x < (_ref = pos.cx) && _ref < cPos.x + cPos.w) && (cPos.y < (_ref1 = pos.cy) && _ref1 < cPos.y + cPos.y)) {
            return this._findElementToSwitch(pos, context);
          }
        }
        pi2 = Math.PI * 2;
        a = ((a % pi2) + pi2) % pi2;
        after = (pi2 * 0.375 < a && a < pi2 * 0.875);
        return {
          element: closest,
          after: after
        };
      }
    };
    Plugin.prototype._switchElement = function(element, after) {
      var child, children, currentIndex, i, parent, targetIndex;
      parent = element.parentNode;
      children = parent.children;
      currentIndex = -1;
      targetIndex = -1;
      i = children.length;
      while (i-- > 0) {
        child = children[i];
        if (child === element) {
          targetIndex = i;
        }
        if (child === this._element) {
          currentIndex = i;
        }
      }
      if (after) {
        targetIndex = targetIndex + 1;
      }
      if (currentIndex === targetIndex) {
        return;
      }
      if (targetIndex >= children.length - 1) {
        parent.appendChild(this._element);
      } else {
        parent.insertBefore(this._element, children[targetIndex]);
      }
      return this._updateDraggableItems();
    };
    Plugin.prototype._sortPosition = function(a, b) {
      return 0;
    };
    Plugin.prototype._mouseUp = function() {
      return this._drop();
    };
    Plugin.prototype._moveCloned = function(e) {
      var bounds, pos, x, y;
      pos = MouseUtils.getMousePos(e);
      bounds = this._cloned.parentNode.getBoundingClientRect();
      x = pos[0] - bounds.left - this._elOffset.x;
      y = pos[1] - bounds.top - this._elOffset.y;
      this._cloned.style.left = x + 'px';
      return this._cloned.style.top = y + 'px';
    };
    return Plugin;
  })(BaseDOM);
  return Draggable;
})(cms.ui.Base);
var __hasProp = {}.hasOwnProperty;
cms.ui.tag.attributes.Confirm = (function(_super) {
  var Plugin;
  __extends(Confirm, _super);
  function Confirm() {
    return Confirm.__super__.constructor.apply(this, arguments);
  }
  Confirm.SELECTOR = '[confirm]';
  Confirm.prototype._update = function(data) {
    var item, p, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = data.add;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      this._plugins[item] = new Plugin(item);
    }
    _ref1 = data.remove;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      p = this._plugins[item];
      if (p) {
        _results.push(typeof p.destroy === "function" ? p.destroy() : void 0);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Plugin = (function(_super1) {
    __extends(Plugin, _super1);
    Plugin._destroyPlugin = function(item) {};
    function Plugin(element) {
      this._click = __bind(this._click, this);
      Plugin.__super__.constructor.call(this, {
        element: element
      });
      this._element.on('click', this._click);
    }
    Plugin.prototype._click = function(e) {
      var message;
      message = this.attr('confirm');
      if (!window.confirm(message)) {
        e.preventDefault();
        return e.stopImmediatePropagation();
      }
    };
    return Plugin;
  })(BaseDOM);
  return Confirm;
})(cms.ui.Base);
var ColorUtils;
ColorUtils = (function() {
  function ColorUtils() {}
  ColorUtils.lightenColor = function(p_color, p_amount) {
    var b, g, num, r, usePound;
    usePound = false;
    if (p_color[0] === "#") {
      p_color = p_color.slice(1);
      usePound = true;
    }
    num = parseInt(p_color, 16);
    r = (num >> 16) + p_amount;
    if (r > 255) {
      r = 255;
    } else if (r < 0) {
      r = 0;
    }
    b = ((num >> 8) & 0x00FF) + p_amount;
    if (b > 255) {
      b = 255;
    } else if (b < 0) {
      b = 0;
    }
    g = (num & 0x0000FF) + p_amount;
    if (g > 255) {
      g = 255;
    } else if (g < 0) {
      g = 0;
    }
    if (usePound) {
      return "#" + (g | (b << 8) | (r << 16)).toString(16);
    } else {
      return (g | (b << 8) | (r << 16)).toString(16);
    }
  };
  ColorUtils.luminance = function(rgbHex) {
    var arr;
    arr = this.hexToRGBArray(rgbHex);
    return (arr[0] * 0.2126 + arr[1] * 0.7152 + arr[2] * 0.0722) / 0xFF;
  };
  ColorUtils.hexToRGB = function(rgbHex) {
    var arr;
    arr = this.hexToRGBArray(rgbHex);
    return {
      r: arr[0],
      g: arr[1],
      b: arr[2],
      a: arr[3]
    };
  };
  ColorUtils.hexToRGBArray = function(rgbHex) {
    rgbHex = Number(rgbHex.replace(/^\#?([0-9a-f]*?)$/i, '0x$1'));
    return [rgbHex >> 16 & 0xFF, rgbHex >> 8 & 0xFF, rgbHex & 0xFF, rgbHex >> 24 & 0xFF];
  };
  ColorUtils.rgbToHex = function(r, g, b, a) {
    if (a == null) {
      a = 0;
    }
    return this.rgbArrayToHex([r, g, b, a]);
  };
  ColorUtils.rgbArrayToHex = function(arr) {
    var c, l;
    l = 6;
    c = arr[0] << 16 | arr[1] << 8 | arr[2];
    if (arr[3]) {
      l = 8;
      c |= arr[3] << 24;
    }
    c = c.toString();
    while (c.length < l) {
      c = '0' + c;
    }
    return c;
  };
  return ColorUtils;
})();
var __hasProp = {}.hasOwnProperty;
cms.ui.attributes.Background = (function(_super) {
  __extends(Background, _super);
  Background.SELECTOR = '[background]';
  function Background() {
    Background.__super__.constructor.apply(this, arguments);
  }
  Background.prototype._update = function(data) {
    var c, i, item, items, l, _results;
    items = data.add;
    i = items.length;
    _results = [];
    while (i-- > 0) {
      item = items[i];
      c = item.getAttribute('background');
      try {
        l = ColorUtils.luminance(c);
        if (!isNaN(l)) {
          if (l > 0.75) {
            item.style.color = '#666666';
          } else {
            item.style.color = '#FFFFFF';
          }
        }
      } catch (_error) {}
      _results.push(item.style.background = c);
    }
    return _results;
  };
  return Background;
})(cms.ui.Base);
var __hasProp = {}.hasOwnProperty;
cms.ui.tag.attributes.Action = (function(_super) {
  var Plugin;
  __extends(Action, _super);
  function Action() {
    return Action.__super__.constructor.apply(this, arguments);
  }
  Action.SELECTOR = ':not(form)[action]';
  Action.prototype._update = function(data) {
    var action, item, p, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = data.add;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (item.hasAttribute('action') && !item.getAttribute('target')) {
        action = item.getAttribute('action');
        if (/\/api\/.*?$/.test(action)) {
          this._plugins[item] = new Plugin(item);
        }
      }
    }
    _ref1 = data.remove;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      p = this._plugins[item];
      if (p) {
        _results.push(typeof p.destroy === "function" ? p.destroy() : void 0);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Plugin = (function(_super1) {
    __extends(Plugin, _super1);
    Plugin._destroyPlugin = function(item) {};
    function Plugin(element) {
      this._apiError = __bind(this._apiError, this);
      this._apiComplete = __bind(this._apiComplete, this);
      this._loadingResize = __bind(this._loadingResize, this);
      this._progress = __bind(this._progress, this);
      this._loadingHideComplete = __bind(this._loadingHideComplete, this);
      this._hideLoading = __bind(this._hideLoading, this);
      this._abort = __bind(this._abort, this);
      this._click = __bind(this._click, this);
      this._addEventListener = __bind(this._addEventListener, this);
      Plugin.__super__.constructor.call(this, {
        element: element
      });
      setTimeout(this._addEventListener, 1);
    }
    Plugin.prototype._addEventListener = function() {
      this._element.on('click', this._click);
      return this._element.on('abort', this._abort);
    };
    Plugin.prototype._click = function(e) {
      this._api = API.call(this._element.getAttribute('action'), null, this._apiComplete, this._apiError);
      if (this._element.getAttribute('globalLoading')) {
        this._api.on(API.PROGRESS, this._progress);
        this._loading = new cms.ui.Loading();
        this._loading.css({
          'position': 'fixed'
        });
        this._loading.show();
        window.addEventListener('resize', this._loadingResize);
        app["interface"].context.appendChildAt(this._loading, 0);
        setTimeout(this._loadingResize, 0);
      }
      if (this.attr('prevent') && this.attr('prevent') === 'false') {
        return;
      }
      e.preventDefault();
      return e.stopImmediatePropagation();
    };
    Plugin.prototype._abort = function() {
      var _ref;
      if ((_ref = this._api) != null) {
        _ref.abort();
      }
      return this._hideLoading();
    };
    Plugin.prototype._hideLoading = function() {
      var _ref;
      if (this._loading) {
        if ((_ref = this._loading) != null) {
          _ref.progress = 1;
        }
        this._loading.on(cms.ui.Loading.HIDE_COMPLETE, this._loadingHideComplete);
        return this._loading.hide();
      }
    };
    Plugin.prototype._loadingHideComplete = function() {
      var _base;
      if (this._loading.element.parentNode) {
        this._loading.element.parentNode.removeChild(this._loading.element);
      }
      this._loading.remove();
      this._loading.off(cms.ui.Loading.HIDE_COMPLETE, this._loadingHideComplete);
      if (typeof (_base = this._loading).destroy === "function") {
        _base.destroy();
      }
      this._loading = null;
      window.removeEventListener('resize', this._loadingResize);
      return delete this._loading;
    };
    Plugin.prototype._progress = function(e) {
      var p, _ref;
      p = e.loaded / e.total;
      return (_ref = this._loading) != null ? _ref.progress = p : void 0;
    };
    Plugin.prototype._loadingResize = function() {
      var bounds;
      if (!this._loading) {
        return;
      }
      bounds = app["interface"].context.getBounds();
      return this._loading.css({
        'top': bounds.top + 'px',
        'left': bounds.left + 'px',
        'height': bounds.height + 'px',
        'width': bounds.width + 'px'
      });
    };
    Plugin.prototype._apiComplete = function(e, data) {
      var i, items, o, success, _ref, _ref1;
      success = this.attr('success');
      if (success && success.length > 0) {
        switch (success) {
          case 'update':
            this._element.trigger('update');
            break;
          case 'refresh':
            app["interface"].show();
            break;
          case 'reload':
            window.location.reload();
            break;
          default:
            if (o = /^update\:(.*?)$/.exec(success)) {
              items = document.body.querySelectorAll(o[1]);
              i = items.length;
              while (i-- > 0) {
                items[i].trigger('update');
              }
            } else {
              app["interface"].show(success);
            }
        }
      }
      if ((data != null ? (_ref = data.notification) != null ? (_ref1 = _ref.message) != null ? _ref1.length : void 0 : void 0 : void 0) > 0) {
        if (!data.notification.type) {
          data.notification.type = 3;
        }
        app.notification.showNotification(data.notification);
      }
      return this._hideLoading();
    };
    Plugin.prototype._apiError = function(e, data) {
      var error, _ref, _ref1;
      error = this.attr('error');
      if (error && error.length > 0) {
        switch (error) {
          case 'refresh':
            app["interface"].show();
            break;
          case 'reload':
            window.location.reload();
            break;
          default:
            app["interface"].show(error);
        }
      } else if ((data != null ? (_ref = data.message) != null ? _ref.length : void 0 : void 0) > 0) {
        if ((data != null ? (_ref1 = data.message) != null ? _ref1.length : void 0 : void 0) > 0) {
          if (!data.type) {
            data.type = 1;
          }
          app.notification.showNotification(data);
        }
      }
      return this._hideLoading();
    };
    return Plugin;
  })(BaseDOM);
  return Action;
})(cms.ui.Base);
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
cms.ui.tags.Card = (function(_super) {
  __extends(Card, _super);
  Card.SELECTOR = 'card';
  function Card() {
    this._resize = __bind(this._resize, this);
    this._update = __bind(this._update, this);
    Card.__super__.constructor.apply(this, arguments);
    window.addEventListener('resize', this._resize);
    app.on('redraw', this._update);
  }
  Card.prototype._update = function(data) {
    setTimeout(this._resize, 0);
    return setTimeout(this._resize, 500);
  };
  Card.prototype._resize = function() {
    var b, card, cards, child, childs, content, fh, footer, h, header, hh, i, item, j, p, parent, parents, _results;
    cards = document.querySelectorAll('card.even-height');
    parents = [];
    childs = [];
    i = cards.length;
    while (i-- > 0) {
      card = cards[i];
      card.style.height = '';
      header = card.querySelector('header');
      footer = card.querySelector('footer');
      content = card.querySelector('content');
      if (header != null) {
        header.style.height = '';
      }
      if (content != null) {
        content.style.height = '';
      }
      if (footer != null) {
        footer.style.height = '';
      }
      parent = card.parentNode;
      if (parents.indexOf(parent) < 0) {
        parents.push(parent);
      }
      p = parents.indexOf(parent);
      if (!childs[p]) {
        childs[p] = {
          height: 0,
          children: []
        };
      }
      b = card.getBoundingClientRect();
      h = b.bottom - b.top;
      if (childs[p].height < h) {
        childs[p].height = h;
      }
      childs[p].children.push(card);
    }
    i = parents.length;
    _results = [];
    while (i-- > 0) {
      item = childs[i];
      j = item.children.length;
      h = item.height;
      _results.push((function() {
        var _results1;
        _results1 = [];
        while (j-- > 0) {
          child = item.children[j];
          child.style.height = h + 'px';
          header = child.querySelector('header');
          footer = child.querySelector('footer');
          content = child.querySelector('content');
          hh = 0;
          fh = 0;
          if (header) {
            hh = header.getBoundingClientRect();
            hh = hh.bottom - hh.top;
          }
          if (footer) {
            fh = footer.getBoundingClientRect();
            fh = fh.bottom - fh.top;
          }
          if (content) {
            _results1.push(content.style.height = h - hh - fh + 'px');
          } else {
            _results1.push(void 0);
          }
        }
        return _results1;
      })());
    }
    return _results;
  };
  return Card;
})(cms.ui.Base);
var __hasProp = {}.hasOwnProperty;
cms.ui.tags.form.Validation = (function(_super) {
  var Plugin;
  __extends(Validation, _super);
  function Validation() {
    return Validation.__super__.constructor.apply(this, arguments);
  }
  Validation.SELECTOR = 'field validation';
  Validation._validate_email = function(value) {
    return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+)+(\.[a-zA-Z0-9]{2,63})+$/.test(value);
  };
  Validation._validate_required = function(value) {
    var _ref;
    if (!value || ((_ref = value.trim()) != null ? _ref.length : void 0) === 0) {
      return false;
    }
    return true;
  };
  Validation._validate_regex = function(value, data) {
    var o, regex, _ref;
    regex = data != null ? (_ref = data.item) != null ? _ref.getAttribute('pattern') : void 0 : void 0;
    if (!regex) {
      return false;
    }
    o = /^(\/?)(.*?)(?:\1([a-z]*))?$/.exec(regex);
    if (!o) {
      return false;
    }
    regex = new RegExp(o[2], o[3]);
    return regex.test(value);
  };
  Validation._validate_match = function(value, data, form) {
    var field, _ref;
    field = data != null ? (_ref = data.item) != null ? _ref.getAttribute('field') : void 0 : void 0;
    field = form[field];
    if (!field) {
      field = form.querySelector(field);
    }
    if (!field) {
      return false;
    }
    return field.value === value;
  };
  Validation.prototype._update = function(data) {
    var item, p, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = data.add;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      this._plugins[item] = new Plugin(item);
    }
    _ref1 = data.remove;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      p = this._plugins[item];
      if (p) {
        _results.push(typeof p.destroy === "function" ? p.destroy() : void 0);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Plugin = (function(_super1) {
    __extends(Plugin, _super1);
    Plugin._destroyPlugin = function(item) {};
    function Plugin(element) {
      this._submit = __bind(this._submit, this);
      this._validate = __bind(this._validate, this);
      this._blur = __bind(this._blur, this);
      this._change = __bind(this._change, this);
      this._parseValidations = __bind(this._parseValidations, this);
      this.destroy = __bind(this.destroy, this);
      Plugin.__super__.constructor.call(this, {
        element: element
      });
      this._parseValidations();
      this._form = this.findParents('form');
      this._field = new BaseDOM(this.findParents('field'));
      this._input = this._field.find('input,textarea');
      this._input.on('blur', this._blur);
      this._input.on('change', this._change);
      this._input.on('input', this._change);
      this._form.on('submit', this._submit);
    }
    Plugin.prototype.destroy = function() {};
    Plugin.prototype._parseValidations = function() {
      var i, item, items, o, validations, _i, _len, _ref;
      validations = [];
      items = this._element.childNodes;
      i = items.length;
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        if (!item.nodeType || item.nodeType !== Node.ELEMENT_NODE) {
          continue;
        }
        if (Validation['_validate_' + item.tagName.toLowerCase()]) {
          o = {
            item: item,
            type: item.tagName.toLowerCase(),
            validation: Validation['_validate_' + item.tagName.toLowerCase()],
            message: ((_ref = item.querySelector('message')) != null ? _ref.innerHTML : void 0) || item.getAttribute('message') || null
          };
          validations.push(o);
        }
      }
      return this._validations = validations;
    };
    Plugin.prototype._change = function() {
      if (!this._passed) {
        return;
      }
      return this._validate();
    };
    Plugin.prototype._blur = function() {
      this._passed = true;
      return this._validate();
    };
    Plugin.prototype._validate = function() {
      var valid, validation, value, _i, _len, _ref;
      value = this._input.value;
      valid = true;
      _ref = this._validations;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        validation = _ref[_i];
        if (!validation.validation(value, validation, this._form)) {
          valid = false;
          break;
        }
      }
      if (!valid) {
        this._field.removeClass('valid');
        this._field.addClass('invalid');
        if (validation.message) {
          this._showMessage(validation.message);
        }
      } else {
        this._field.removeClass('invalid');
        this._field.addClass('valid');
        this._hideMessage();
      }
      return valid;
    };
    Plugin.prototype._showMessage = function(message) {
      var messageField;
      messageField = this._field.find('.validation-message');
      if (!messageField) {
        messageField = document.createElement('div');
        messageField.className = 'validation-message';
        this._field.appendChild(messageField);
      }
      messageField.style.display = '';
      return messageField.innerHTML = message;
    };
    Plugin.prototype._hideMessage = function() {
      var messageField;
      messageField = this._field.find('.validation-message');
      if (!messageField) {
        return;
      }
      return messageField.style.display = 'none';
    };
    Plugin.prototype._submit = function(e) {
      if (!this._blur()) {
        return e.preventDefault();
      }
    };
    return Plugin;
  })(BaseDOM);
  return Validation;
})(cms.ui.Base);
var __hasProp = {}.hasOwnProperty;
cms.ui.tags.form.Upload = (function(_super) {
  var Plugin;
  __extends(Upload, _super);
  function Upload() {
    return Upload.__super__.constructor.apply(this, arguments);
  }
  Upload.SELECTOR = 'upload';
  Upload.prototype._update = function(data) {
    var item, p, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = data.add;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      this._plugins[item] = new Plugin(item);
    }
    _ref1 = data.remove;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      p = this._plugins[item];
      if (p) {
        _results.push(typeof p.destroy === "function" ? p.destroy() : void 0);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Plugin = (function(_super1) {
    __extends(Plugin, _super1);
    Plugin._destroyPlugin = function(item) {};
    function Plugin(element) {
      this._dragLeave = __bind(this._dragLeave, this);
      this._dragEnter = __bind(this._dragEnter, this);
      this._dragEnd = __bind(this._dragEnd, this);
      this._dragOver = __bind(this._dragOver, this);
      this._drop = __bind(this._drop, this);
      this._fileSelect = __bind(this._fileSelect, this);
      this._click = __bind(this._click, this);
      this._filesLoaded = __bind(this._filesLoaded, this);
      this._fileLoaded = __bind(this._fileLoaded, this);
      this._loadNextFile = __bind(this._loadNextFile, this);
      this._parseFiles = __bind(this._parseFiles, this);
      this._apiCompleted = __bind(this._apiCompleted, this);
      this._chunkUploadError = __bind(this._chunkUploadError, this);
      this._chunkUploadComplete = __bind(this._chunkUploadComplete, this);
      this._chunkProgress = __bind(this._chunkProgress, this);
      this._apiStarted = __bind(this._apiStarted, this);
      this._startUpload = __bind(this._startUpload, this);
      this._remove = __bind(this._remove, this);
      var accept, deleteIcon, el, k, v;
      Plugin.__super__.constructor.apply(this, arguments);
      this._loading = new cms.ui.Loading();
      this._loading.reset();
      this._loading.hide();
      this.appendChild(this._loading);
      accept = (this.attr('accept') || '').trim();
      this._apiPath = this.attr('api') || app.apiPath + 'upload';
      if (!accept || accept.length === 0) {
        accept = '*/*';
      }
      accept = accept.split(/,|;/);
      this._acceptStr = accept.join(',');
      for (k in accept) {
        v = accept[k];
        accept[k] = v.replace(/\./g, '\\.').replace(/\*/g, '[^/]*').replace(/\//g, '\\/');
      }
      this._accept = new RegExp('(' + accept.join('|') + ')', 'i');
      this._maxSize = Number(this.attr('maxSize') || 2000000) * 0.95;
      this._input = document.createElement('input');
      this._input.setAttribute('name', this.attr('name'));
      this._input.setAttribute('type', 'hidden');
      this.appendChild(this._input);
      this._container = document.createElement('div');
      this._container.className = 'container';
      if (el = this.find('placeholder')) {
        this._container.appendChild(el);
      }
      if (el = this.find('preview')) {
        this._container.appendChild(el);
      }
      this.appendChild(this._container);
      this.element.on('drop', this._drop);
      this.element.on('dragenter', this._dragEnter);
      this.element.on('dragleave', this._dragLeave);
      this.element.on('dragover', this._dragOver);
      this._container.on('click', this._click);
      this._deleteBtn = document.createElement('a');
      this._deleteBtn.className = 'delete-btn';
      deleteIcon = document.createElement('i');
      deleteIcon.className = 'fa fa-trash text-1';
      this._deleteBtn.on('click', this._remove);
      this._deleteBtn.appendChild(deleteIcon);
      this.appendChild(this._deleteBtn);
      if (this.attr('value')) {
        this._setValue(this.attr('value'));
      }
    }
    Plugin.prototype._remove = function() {
      return this._setValue(null);
    };
    Plugin.prototype.upload = function() {
      if (this._uploading) {
        return;
      }
      this._uploading = true;
      return this._startUpload();
    };
    Plugin.prototype._startUpload = function() {
      if (!this._api) {
        this._apiStarter = new API(this._apiPath + '/start');
        this._apiStarter.reuse = true;
        this._apiStarter.type = 'json';
        this._apiStarter.on(API.COMPLETE, this._apiStarted);
        this._apiCompleter = new API(this._apiPath + '/complete');
        this._apiCompleter.reuse = true;
        this._apiCompleter.type = 'json';
        this._apiCompleter.on(API.COMPLETE, this._apiCompleted);
        this._api = new API(this._apiPath);
        this._api.reuse = true;
        this._api.type = 'binary';
        this._api.on(API.COMPLETE, this._chunkUploadComplete);
        this._api.on(API.PROGRESS, this._chunkProgress);
        this._api.on(API.ERROR, this._chunkUploadError);
      }
      return this._apiStarter.submit(this._items);
    };
    Plugin.prototype._apiStarted = function(e, data) {
      this._loading.show();
      this._uploadId = data.id;
      this._apiUploadURL = this._apiPath + '/' + this._uploadId + '/';
      this._splitChunks();
      return this._uploadNextChunk();
    };
    Plugin.prototype._splitChunks = function() {
      var b, end, i, init, l;
      this._chunks = [];
      i = 0;
      l = this._buffer.byteLength;
      while (i < l) {
        init = i;
        end = i + this._maxSize;
        if (end > l) {
          end = l;
        }
        b = this._buffer.slice(init, end);
        this._chunks.push({
          buffer: b,
          index: init
        });
        i = end;
      }
      return this._numChunks = this._chunks.length;
    };
    Plugin.prototype._chunkProgress = function(e) {
      var p;
      p = 1 - ((this._chunks.length + 1) / this._numChunks) + e.progress / this._numChunks;
      return this._loading.progress = p;
    };
    Plugin.prototype._uploadNextChunk = function() {
      var chunk;
      if (this._chunks.length === 0) {
        this._completeUpload();
        return;
      }
      this._loading.progress = 1 - (this._chunks.length / this._numChunks);
      chunk = this._chunks.shift();
      this._api.url = this._apiUploadURL + chunk.index;
      return this._api.submit(chunk.buffer);
    };
    Plugin.prototype._chunkUploadComplete = function() {
      return this._uploadNextChunk();
    };
    Plugin.prototype._chunkUploadError = function() {};
    Plugin.prototype._completeUpload = function() {
      this._loading.progress = 1;
      this._loading.hide();
      this._apiCompleter.url = this._apiPath + '/complete/' + this._uploadId;
      return this._apiCompleter.submit();
    };
    Plugin.prototype._apiCompleted = function(e, data) {
      this._uploading = false;
      return this._setValue(data);
    };
    Plugin.prototype._setValue = function(value) {
      if (!value) {
        this._input.value = '__none__';
        this.removeClass('showPreview');
      } else if (value.id) {
        this._input.value = value.id;
      } else if (typeof value === 'string' || !isNaN(value)) {
        this._input.value = value;
      }
      if (value) {
        if (this.find('preview')) {
          this.addClass('showPreview');
          app.template.renderBlock(this.find('preview'), value);
        }
      }
      this.removeClass('deny');
      return this.removeClass('accept');
    };
    Plugin.prototype._parseFiles = function(files) {
      var file, i, totalSize;
      this._items = [];
      totalSize = 0;
      i = files.length;
      while (i-- > 0) {
        if (files[i] instanceof File) {
          file = files[i];
        } else if (files[i].getAsFile != null) {
          file = files[i].getAsFile();
        } else {
          continue;
        }
        this._items[i] = {
          name: file.name,
          size: file.size,
          file: file,
          init: totalSize
        };
        totalSize += file.size;
      }
      this._totalSize = totalSize;
      this._buffer = new ArrayBuffer(this._totalSize);
      this._bufferView = new Uint8Array(this._buffer);
      return this._loadNextFile();
    };
    Plugin.prototype._loadNextFile = function() {
      var allLoaded, file, i;
      if (!this._fileReader) {
        this._fileReader = new FileReader();
        this._fileReader.addEventListener('load', this._fileLoaded);
      }
      allLoaded = true;
      i = this._items.length;
      while (i-- > 0) {
        if (this._items[i].file) {
          allLoaded = false;
          this._currentItem = this._items[i];
          file = this._currentItem.file;
          this._fileReader.readAsArrayBuffer(file);
          break;
        }
      }
      if (allLoaded) {
        this._currentItem = null;
        return this._filesLoaded();
      }
    };
    Plugin.prototype._fileLoaded = function() {
      this._currentItem['file'] = null;
      this._bufferView.set(new Uint8Array(this._fileReader.result), this._currentItem.init);
      delete this._currentItem['file'];
      return setTimeout(this._loadNextFile, 0);
    };
    Plugin.prototype._filesLoaded = function() {
      return this.upload();
    };
    Plugin.prototype._click = function(e) {
      if (!this._fileBrowser) {
        this._fileBrowser = document.createElement('input');
        this._fileBrowser.setAttribute('type', 'file');
        if (this._acceptStr) {
          console.log(this._acceptStr);
          this._fileBrowser.setAttribute('accept', this._acceptStr);
        }
        this._fileBrowser.addEventListener('change', this._fileSelect);
      }
      return this._fileBrowser.click();
    };
    Plugin.prototype._fileSelect = function(e) {
      if (this._fileBrowser.files.length > 0) {
        return this._parseFiles(this._fileBrowser.files);
      }
    };
    Plugin.prototype._drop = function(e) {
      var accepts, files;
      e.preventDefault();
      files = e.dataTransfer.items;
      accepts = this._checkAccepts(files);
      if (accepts) {
        return this._parseFiles(files);
      } else {
        return 1;
      }
    };
    Plugin.prototype._dragOver = function(e) {
      e.preventDefault();
      return e.stopImmediatePropagation();
    };
    Plugin.prototype._dragEnd = function(e) {
      var items, _results;
      items = e.dataTransfer.items;
      if (items) {
        _results = [];
        while (items.length > 0) {
          _results.push(items.remove(0));
        }
        return _results;
      } else {
        return e.dataTransfer.clearData();
      }
    };
    Plugin.prototype._dragEnter = function(e) {
      var accepts, f, files;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      f = e.dataTransfer.items[0].getAsFile();
      files = e.dataTransfer.items;
      accepts = this._checkAccepts(files);
      if (accepts) {
        this.removeClass('deny');
        return this.addClass('accept');
      } else {
        this.removeClass('accept');
        return this.addClass('deny');
      }
    };
    Plugin.prototype._dragLeave = function(e) {
      e.dataTransfer.dropEffect = 'none';
      this.removeClass('accept');
      return this.removeClass('deny');
    };
    Plugin.prototype._checkAccepts = function(files) {
      var accepts, i;
      accepts = true;
      i = files.length;
      if (i === 0) {
        accepts = false;
      }
      while (i-- > 0) {
        if (!this._accept.test(files[i].type)) {
          accepts = false;
          break;
        }
      }
      return accepts;
    };
    return Plugin;
  })(BaseDOM);
  return Upload;
})(cms.ui.Base);
var __hasProp = {}.hasOwnProperty;
cms.ui.tags.form.Toggle = (function(_super) {
  var Plugin;
  __extends(Toggle, _super);
  function Toggle() {
    return Toggle.__super__.constructor.apply(this, arguments);
  }
  Toggle.SELECTOR = 'toggle';
  Toggle.prototype._update = function(data) {
    var item, p, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = data.add;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      this._plugins[item] = new Plugin(item);
    }
    _ref1 = data.remove;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      p = this._plugins[item];
      if (p) {
        _results.push(typeof p.destroy === "function" ? p.destroy() : void 0);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Plugin = (function(_super1) {
    __extends(Plugin, _super1);
    Plugin._destroyPlugin = function(item) {};
    function Plugin(element) {
      this._update = __bind(this._update, this);
      this._toggle = __bind(this._toggle, this);
      this._change = __bind(this._change, this);
      Plugin.__super__.constructor.call(this, {
        element: element
      });
      this._input = this.find('input');
      if (this._input) {
        this.selected = this._input.checked;
        this._input.on('change', this._update);
      }
      this._element.on('click', this._toggle);
      this._element.on('change', this._change);
    }
    Plugin.prototype._change = function() {
      var form, i, items, _results;
      if (this._input) {
        form = this.findParents('form');
        if (form) {
          items = form.querySelectorAll('input[name="' + this._input.getAttribute('name') + '"]');
          i = items.length;
          _results = [];
          while (i-- > 0) {
            if (items[i] !== this._input) {
              _results.push(items[i].trigger('change'));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        }
      }
    };
    Plugin.get({
      selected: function() {
        return this._selected;
      }
    });
    Plugin.set({
      selected: function(value) {
        var _ref;
        if (value === this._selected) {
          return;
        }
        this._selected = value;
        this._element.setAttribute('selected', value);
        this._element.selected = value;
        if (this._input) {
          this._input.checked = value;
          if ((_ref = this._input) != null) {
            _ref.trigger('update');
          }
        }
        return this._element.trigger('change');
      }
    });
    Plugin.prototype._toggle = function() {
      var _ref, _ref1;
      if (((_ref = this._input) != null ? _ref.getAttribute('type') : void 0) === 'radio') {
        this._input.click();
        return;
      }
      this.selected = !this._selected;
      return (_ref1 = this._input) != null ? _ref1.trigger('change') : void 0;
    };
    Plugin.prototype._update = function(e) {
      if (e == null) {
        e = null;
      }
      if (this._input) {
        return this.selected = this._input.checked;
      }
    };
    return Plugin;
  })(BaseDOM);
  return Toggle;
})(cms.ui.Base);
var __hasProp = {}.hasOwnProperty;
cms.ui.tags.form.Select = (function(_super) {
  var Plugin;
  __extends(Select, _super);
  function Select() {
    return Select.__super__.constructor.apply(this, arguments);
  }
  Select.SELECTOR = 'select';
  Select.prototype._update = function(data) {
    var item, p, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = data.add;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      this._plugins[item] = new Plugin(item);
    }
    _ref1 = data.remove;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      p = this._plugins[item];
      if (p) {
        _results.push(typeof p.destroy === "function" ? p.destroy() : void 0);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Plugin = (function(_super1) {
    __extends(Plugin, _super1);
    Plugin._destroyPlugin = function(item) {};
    function Plugin(element) {
      this._updateTargets = __bind(this._updateTargets, this);
      this._updated = __bind(this._updated, this);
      var o, paramsRE, updateData;
      Plugin.__super__.constructor.apply(this, arguments);
      this.element.on('updated', this._updated);
      if (this.attr('update')) {
        this._updateParams = [];
        updateData = this.attr('update');
        paramsRE = /\[([^\[\]]+)\]/g;
        while (o = paramsRE.exec(updateData)) {
          this._updateParams.push(o[1].split(','));
        }
        if (this._updateParams.length > 0) {
          this.element.on('change', this._updateTargets);
          setTimeout(this._updateTargets, 1);
        }
      }
    }
    Plugin.prototype._updated = function() {
      return setTimeout(this._updateTargets, 1);
    };
    Plugin.prototype._updateTargets = function() {
      var i, items, j, params, value, _results;
      if (!this._updateParams) {
        return;
      }
      i = this._updateParams.length;
      value = this.element.value;
      _results = [];
      while (i-- > 0) {
        params = this._updateParams[i];
        items = document.body.querySelectorAll(params[0]);
        j = items.length;
        _results.push((function() {
          var _results1;
          _results1 = [];
          while (j-- > 0) {
            _results1.push(items[j].trigger(params[1], value));
          }
          return _results1;
        })());
      }
      return _results;
    };
    return Plugin;
  })(BaseDOM);
  return Select;
})(cms.ui.Base);
var __hasProp = {}.hasOwnProperty;
cms.ui.tags.form.Form = (function(_super) {
  var Plugin;
  __extends(Form, _super);
  function Form() {
    return Form.__super__.constructor.apply(this, arguments);
  }
  Form.SELECTOR = 'form';
  Form.prototype._update = function(data) {
    var item, p, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = data.add;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      this._plugins[item] = new Plugin(item);
    }
    _ref1 = data.remove;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      p = this._plugins[item];
      if (p) {
        _results.push(typeof p.destroy === "function" ? p.destroy() : void 0);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Plugin = (function(_super1) {
    __extends(Plugin, _super1);
    Plugin._destroyPlugin = function(item) {};
    function Plugin(element) {
      this._clearMessage = __bind(this._clearMessage, this);
      this._apiError = __bind(this._apiError, this);
      this._apiComplete = __bind(this._apiComplete, this);
      this._apiStart = __bind(this._apiStart, this);
      this._resetFields = __bind(this._resetFields, this);
      this._reset = __bind(this._reset, this);
      this._submit = __bind(this._submit, this);
      this._change = __bind(this._change, this);
      this._abort = __bind(this._abort, this);
      this._addListeners = __bind(this._addListeners, this);
      Plugin.__super__.constructor.call(this, {
        element: element
      });
      setTimeout(this._addListeners, 50);
    }
    Plugin.prototype._addListeners = function() {
      this._api = new API(this._element);
      if (!(this._element.getAttribute('target') && this._element.getAttribute('target').toLowerCase() === '_blank')) {
        this._api.on(API.START, this._apiStart);
        this._api.on(API.COMPLETE, this._apiComplete);
        this._api.on(API.ERROR, this._apiError);
      }
      this._element.on('submit', this._submit);
      this._element.on('change', this._change);
      this._element.on('reset', this._reset);
      return this._element.on('abort', this._abort);
    };
    Plugin.prototype._abort = function() {
      var _ref;
      return (_ref = this._api) != null ? _ref.abort() : void 0;
    };
    Plugin.prototype._change = function() {
      return this._clearMessage();
    };
    Plugin.prototype._submit = function(e) {
      var data, _ref;
      if (((_ref = this.attr('target')) != null ? typeof _ref.toLowerCase === "function" ? _ref.toLowerCase() : void 0 : void 0) === '_blank') {
        data = this._api.parseJSON(this._element);
        if (!this._dataElement) {
          this._dataElement = document.createElement('textarea');
          this._dataElement.name = '__data';
          this._dataElement.style.display = 'none';
          this.appendChild(this._dataElement);
        }
        return this._dataElement.innerHTML = JSON.stringify(data);
      } else {
        this._clearFieldMessages();
        if (e.defaultPrevented) {
          e.stopImmediatePropagation();
          return;
        }
        return e.preventDefault();
      }
    };
    Plugin.prototype._reset = function() {
      return setTimeout(this._resetFields, 0);
    };
    Plugin.prototype._resetFields = function() {
      var i, items, _results;
      items = this._element.querySelectorAll('[type=checkbox],[type=radio]');
      i = items.length;
      _results = [];
      while (i-- > 0) {
        _results.push(items[i].trigger('change'));
      }
      return _results;
    };
    Plugin.prototype._apiStart = function() {};
    Plugin.prototype._apiComplete = function(e, data) {
      var success, _ref, _ref1;
      this._element.reset();
      success = this.attr('success');
      if (success && success.length > 0) {
        switch (success) {
          case 'update':
            this._element.trigger('update');
            break;
          case 'refresh':
            app["interface"].show();
            break;
          case 'reload':
            window.location.reload();
            break;
          default:
            app.router.goto(success);
        }
      }
      if ((data != null ? (_ref = data.notification) != null ? (_ref1 = _ref.message) != null ? _ref1.length : void 0 : void 0 : void 0) > 0) {
        if (!data.notification.type) {
          data.notification.type = 3;
        }
        return app.notification.showNotification(data.notification);
      }
    };
    Plugin.prototype._apiError = function(e, data) {
      var item, _i, _len, _ref, _results;
      this._showMessage(data != null ? data.message : void 0);
      if (Array.isArray(data.data)) {
        _ref = data.data;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          if (item != null ? item.field : void 0) {
            _results.push(this._showFieldMessage(item.field, item.message));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };
    Plugin.prototype._showFieldMessage = function(fieldName, message, type) {
      var field, messageField, _ref;
      if (type == null) {
        type = 1;
      }
      field = (_ref = this.find('[name="' + fieldName + '"]')) != null ? _ref.findParents('field') : void 0;
      if (!field) {
        return;
      }
      if (field.__instance__) {
        field = field.__instance__;
      } else {
        return;
      }
      messageField = field.find('.validation-message');
      field.removeClass('valid');
      field.addClass('invalid');
      if (!messageField) {
        messageField = new BaseDOM({
          element: 'div',
          className: 'validation-message'
        });
        field.appendChild(messageField);
      } else {
        if (messageField.__instance__) {
          messageField = messageField.__instance__;
        } else {
          messageField = new BaseDOM({
            element: messageField
          });
        }
      }
      messageField.css({
        display: ''
      });
      messageField.html = message;
      return messageField.element.scrollIntoView();
    };
    Plugin.prototype._clearFieldMessages = function() {
      var field, fields, _i, _len, _results;
      fields = this.findAll('field .validation-message');
      _results = [];
      for (_i = 0, _len = fields.length; _i < _len; _i++) {
        field = fields[_i];
        if (field.__instance__) {
          field = field.__instance__;
        } else {
          field = new BaseDOM({
            element: field
          });
        }
        field.css({
          display: 'none'
        });
        field.findParents('field').__instance__.removeClass('invalid');
        _results.push(field.html = '');
      }
      return _results;
    };
    Plugin.prototype._showMessage = function(message, type) {
      var field, fields, i, messageFields, messages, validationMessagesFields, _i, _len;
      if (type == null) {
        type = 1;
      }
      if (!this._messageField) {
        if (!message || message.length === 0) {
          return;
        }
        fields = this.findAll('validation message');
        i = fields.length;
        validationMessagesFields = [];
        while (i-- > 0) {
          validationMessagesFields[i] = fields[i];
        }
        messageFields = this.findAll('message');
        messages = [];
        for (_i = 0, _len = messageFields.length; _i < _len; _i++) {
          field = messageFields[_i];
          if (validationMessagesFields.indexOf(field) < 0) {
            messages.push(field);
          }
        }
        if (messages.length > 0) {
          this._messageField = messages[0];
        }
        if (!this._messageField) {
          this._messageField = document.createElement('message');
          this.appendChildAt(this._messageField, 0);
        }
      }
      this._messageField.innerHTML = message;
      return this._messageField.scrollIntoView();
    };
    Plugin.prototype._clearMessage = function() {
      return this._showMessage('');
    };
    return Plugin;
  })(BaseDOM);
  return Form;
})(cms.ui.Base);
var __hasProp = {}.hasOwnProperty;
cms.ui.tags.form.Field = (function(_super) {
  var Plugin;
  __extends(Field, _super);
  function Field() {
    return Field.__super__.constructor.apply(this, arguments);
  }
  Field.SELECTOR = 'field';
  Field.prototype._update = function(data) {
    var item, p, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = data.add;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (Plugin._checkPlugin(item)) {
        this._plugins[item] = new Plugin(item);
      } else {
        item.className += ' filled';
      }
    }
    _ref1 = data.remove;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      p = this._plugins[item];
      if (p) {
        _results.push(typeof p.destroy === "function" ? p.destroy() : void 0);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Plugin = (function(_super1) {
    __extends(Plugin, _super1);
    Plugin._destroyPlugin = function(item) {};
    Plugin._checkPlugin = function(item) {
      var input;
      input = item.querySelector('input:not([type="hidden"]),select,textarea');
      if (!input) {
        return false;
      }
      if (input.findParents('field') !== item) {
        return false;
      }
      return true;
    };
    function Plugin(element) {
      this._checkFilled = __bind(this._checkFilled, this);
      this._change = __bind(this._change, this);
      this._blur = __bind(this._blur, this);
      this._focus = __bind(this._focus, this);
      this._password = __bind(this._password, this);
      this._passwordPreviewChange = __bind(this._passwordPreviewChange, this);
      var nameAttr, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8;
      Plugin.__super__.constructor.call(this, {
        element: element
      });
      this._input = this._element.querySelector('input:not([type="hidden"]),select,textarea');
      nameAttr = this._input.getAttribute("type");
      if (nameAttr === 'date' || nameAttr === 'time') {
        this._checkFilled(true);
      } else {
        if ((_ref = (_ref1 = this._input) != null ? _ref1.tagName.toLowerCase() : void 0) === 'select' || _ref === 'textarea') {
          if ((_ref2 = this._input) != null) {
            _ref2.setAttribute('type', (_ref3 = this._input) != null ? _ref3.tagName.toLowerCase() : void 0);
          }
        }
        if ((_ref4 = this._input) != null ? _ref4.hasAttribute('type') : void 0) {
          this.addClass(this._input.getAttribute('type'));
          switch (this._input.getAttribute('type').toLowerCase()) {
            case 'password':
              this._checkPasswordPreview();
          }
        }
        if ((_ref5 = this._input) != null) {
          _ref5.on('focus', this._focus);
        }
        if ((_ref6 = this._input) != null) {
          _ref6.on('blur', this._blur);
        }
        if ((_ref7 = this._input) != null) {
          _ref7.on('change', this._change);
        }
        if ((_ref8 = this._input) != null) {
          _ref8.on('input', this._change);
        }
        setTimeout(this._checkFilled, 1);
      }
    }
    Plugin.prototype._checkPasswordPreview = function() {
      var pp;
      pp = this.find('.show-password');
      if (!pp) {
        return;
      }
      this._passwordPreview = pp;
      return this._passwordPreview.on('change', this._passwordPreviewChange);
    };
    Plugin.prototype._passwordPreviewChange = function() {
      var _ref, _ref1;
      if (this._passwordPreview.selected) {
        return (_ref = this._input) != null ? _ref.setAttribute('type', 'text') : void 0;
      } else {
        return (_ref1 = this._input) != null ? _ref1.setAttribute('type', 'password') : void 0;
      }
    };
    Plugin.prototype._password = function(e) {
      var _ref;
      if ((_ref = this._input) != null) {
        _ref.type = 'text';
      }
      e.preventDefault();
      return e.stopImmediatePropagation();
    };
    Plugin.prototype._focus = function() {
      this._focused = true;
      return this._checkFilled();
    };
    Plugin.prototype._blur = function() {
      this._focused = false;
      return this._checkFilled();
    };
    Plugin.prototype._change = function() {
      return this._checkFilled();
    };
    Plugin.prototype._checkFilled = function(focusStarts) {
      var v, _ref, _ref1;
      if (focusStarts == null) {
        focusStarts = false;
      }
      if (this._focused || focusStarts) {
        this.addClass('filled');
        return;
      }
      v = (_ref = this._input) != null ? _ref.value.trim() : void 0;
      if (v.length === 0) {
        this.removeClass('filled');
        return (_ref1 = this._input) != null ? _ref1.value = v : void 0;
      } else {
        return this.addClass('filled');
      }
    };
    return Plugin;
  })(BaseDOM);
  return Field;
})(cms.ui.Base);
var __hasProp = {}.hasOwnProperty;
cms.ui.tags.form.Checkbox = (function(_super) {
  __extends(Checkbox, _super);
  function Checkbox() {
    return Checkbox.__super__.constructor.apply(this, arguments);
  }
  Checkbox.SELECTOR = 'input[type="checkbox"]';
  Checkbox.prototype._update = function(data) {
    var item, _i, _len, _ref, _results;
    _ref = data.add;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      _results.push(this._buildCheckbox(item));
    }
    return _results;
  };
  Checkbox.prototype._buildCheckbox = function(item) {
    var child, children, def, i, label, parent, selected, toggle, _i, _len, _ref;
    if ((_ref = item.getAttribute('checked')) === 0 || _ref === '0' || _ref === false || _ref === 'false' || _ref === null || _ref === 'null') {
      item.removeAttribute('checked');
    }
    toggle = document.createElement('toggle');
    def = document.createElement('default');
    selected = document.createElement('selected');
    i = document.createElement('i');
    i.className = 'fa fa-square-o';
    def.appendChild(i);
    i = document.createElement('i');
    i.className = 'fa fa-check-square-o';
    selected.appendChild(i);
    toggle.append(def);
    toggle.append(selected);
    parent = item.parentNode;
    if (item.parentNode.tagName.toLowerCase() === 'field') {
      children = ArrayUtils.toArray(parent.children);
      for (_i = 0, _len = children.length; _i < _len; _i++) {
        child = children[_i];
        toggle.appendChild(child);
      }
      return parent.appendChild(toggle);
    } else if (label = item.parentNode.querySelector('label')) {
      toggle.appendChild(label);
      parent.insertBefore(toggle, item);
      return toggle.appendChild(item);
    }
  };
  return Checkbox;
})(cms.ui.Base);
var __hasProp = {}.hasOwnProperty;
cms.ui.tags.form.ButtonFile = (function(_super) {
  var Plugin;
  __extends(ButtonFile, _super);
  function ButtonFile() {
    return ButtonFile.__super__.constructor.apply(this, arguments);
  }
  ButtonFile.SELECTOR = 'button[type="file"]';
  ButtonFile.prototype._update = function(data) {
    var item, p, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = data.add;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      this._plugins[item] = new Plugin(item);
    }
    _ref1 = data.remove;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      p = this._plugins[item];
      if (p) {
        _results.push(typeof p.destroy === "function" ? p.destroy() : void 0);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Plugin = (function(_super1) {
    __extends(Plugin, _super1);
    function Plugin(element) {
      this._inputChange = __bind(this._inputChange, this);
      this._click = __bind(this._click, this);
      var attr, input, name, _i, _len, _ref;
      Plugin.__super__.constructor.call(this, {
        element: element
      });
      input = element.querySelector('input[type="file"]');
      if (!input) {
        input = document.createElement('input');
        _ref = element.attributes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          attr = _ref[_i];
          name = attr.name || attr.nodeName;
          input.setAttribute(name, element.getAttribute(name));
        }
      }
      this._input = input;
      this._input.className = this._input.className + ' hidden-file-input';
      this._input.on('change', this._inputChange);
      this._element.parentNode.appendChild(this._input);
      this._element.on('click', this._click);
    }
    Plugin.prototype._click = function(e) {
      if (typeof e.preventDefault === "function") {
        e.preventDefault();
      }
      if (typeof e.stopImmediatePropogation === "function") {
        e.stopImmediatePropogation();
      }
      return this._input.click();
    };
    Plugin.prototype._inputChange = function() {
      var form;
      if (this._input.files.length > 0) {
        form = this.findParents('form');
        return form.trigger('submit');
      }
    };
    Plugin.prototype.destroy = function() {
      if (this._input) {
        1;
      }
      return this._element.off('click', this._click);
    };
    return Plugin;
  })(BaseDOM);
  return ButtonFile;
})(cms.ui.Base);
var __hasProp = {}.hasOwnProperty;
cms.ui.tags["interface"].Viewstack = (function(_super) {
  var Plugin;
  __extends(Viewstack, _super);
  function Viewstack() {
    return Viewstack.__super__.constructor.apply(this, arguments);
  }
  Viewstack.SELECTOR = 'viewstack';
  Viewstack.prototype._update = function(data) {
    var item, p, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = data.add;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      this._plugins[item] = new Plugin(item);
    }
    _ref1 = data.remove;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      p = this._plugins[item];
      if (p) {
        _results.push(typeof p.destroy === "function" ? p.destroy() : void 0);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Plugin = (function(_super1) {
    __extends(Plugin, _super1);
    function Plugin(element) {
      this._showView = __bind(this._showView, this);
      Plugin.__super__.constructor.call(this, {
        element: element
      });
      this.element.on('show', this._showView);
      this._parseViews();
    }
    Plugin.prototype.destroy = function() {
      return Plugin.__super__.destroy.apply(this, arguments);
    };
    Plugin.prototype._showView = function(e) {
      var data;
      data = e.data;
      return this.show(data);
    };
    Plugin.prototype._parseViews = function() {
      var found, i, k, name, parent, v, view, views, _ref;
      this._views = {};
      views = this.findAll('view[name]');
      i = views.length;
      while (i-- > 0) {
        view = views[i];
        parent = view.findParents('viewstack');
        if (parent !== this._element) {
          continue;
        }
        name = view.getAttribute('name');
        view.name = name;
        if (view.getAttribute('default')) {
          this._defaultView = view;
        }
        this._views[name] = view;
      }
      if (!this._defaultView) {
        this._defaultView = view;
      }
      found = false;
      _ref = slikland.Mara.globals['#'];
      for (k in _ref) {
        v = _ref[k];
        if (!v || v.length === 0) {
          continue;
        }
        try {
          if (this.matches(k)) {
            found = true;
            console.log(v);
            this.show(v);
          }
        } catch (_error) {}
      }
      if (!found) {
        return this.reset();
      }
    };
    Plugin.prototype.reset = function() {
      return this.show(this._defaultView.name);
    };
    Plugin.prototype.show = function(name) {
      var item, items, n, selectedView, view, _i, _len, _ref;
      selectedView = null;
      _ref = this._views;
      for (n in _ref) {
        view = _ref[n];
        if (n === name) {
          selectedView = view;
          if (view === this._selectedView) {
            continue;
          }
          view.style['display'] = '';
          app.template.resetContext(view);
          app.template.renderBlock(view, view.itemData);
        } else {
          view.style['display'] = 'none';
          items = view.querySelectorAll('form,[action],[service]');
          for (_i = 0, _len = items.length; _i < _len; _i++) {
            item = items[_i];
            try {
              item.trigger('abort');
            } catch (_error) {}
          }
        }
      }
      this._selectedView = selectedView;
      return selectedView;
    };
    Plugin.prototype.getView = function(name) {
      return this._views[name];
    };
    Plugin.prototype.getViews = function() {
      return this._views;
    };
    return Plugin;
  })(BaseDOM);
  return Viewstack;
})(cms.ui.Base);
var __hasProp = {}.hasOwnProperty;
cms.ui.tags["interface"].Tagcloud = (function(_super) {
  var Plugin;
  __extends(Tagcloud, _super);
  function Tagcloud() {
    return Tagcloud.__super__.constructor.apply(this, arguments);
  }
  Tagcloud.SELECTOR = 'tagcloud';
  Tagcloud.prototype._update = function(data) {
    var item, p, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = data.add;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      this._plugins[item] = new Plugin(item);
    }
    _ref1 = data.remove;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      p = this._plugins[item];
      if (p) {
        _results.push(typeof p.destroy === "function" ? p.destroy() : void 0);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Plugin = (function(_super1) {
    __extends(Plugin, _super1);
    function Plugin(element) {
      this._addSuggested = __bind(this._addSuggested, this);
      this._removeTag = __bind(this._removeTag, this);
      this._validateComplete = __bind(this._validateComplete, this);
      this._commitAddTag = __bind(this._commitAddTag, this);
      this._buttonClick = __bind(this._buttonClick, this);
      this._keyDown = __bind(this._keyDown, this);
      var add;
      Plugin.__super__.constructor.call(this, {
        element: element
      });
      if (add = this.find('add')) {
        this._buildAddElement(add);
      }
      this._values = {};
      this._suggestions = {};
      this._template = this.find('template');
      this._container = this.find('content');
      if (!this._container) {
        this._container = document.createElement('content');
        this.appendChild(this._container);
      }
      this._suggestion = this.find('suggestion');
      if (this.attr('name')) {
        this._content = document.createElement('textarea');
        this._content.setAttribute('name', this.attr('name'));
        this._content.style.display = 'none';
        this.appendChild(this._content);
      }
      if (this.attr('validateaction')) {
        this._validateAction = this.attr('validateaction');
      }
    }
    Plugin.prototype._buildAddElement = function(target) {
      var button, group, input, label;
      group = new BaseDOM({
        element: 'group'
      });
      input = new BaseDOM({
        element: 'input',
        className: 'col-1_3'
      });
      button = new BaseDOM({
        element: 'button',
        className: target.className
      });
      label = target.innerHTML;
      if (!label || label.length === 0) {
        label = "Adicionar";
      }
      button.html = label;
      group.appendChild(input);
      group.appendChild(button);
      target.parentNode.insertBefore(group.element, target);
      target.parentNode.removeChild(target);
      input.element.on('keydown', this._keyDown);
      button.element.on('click', this._buttonClick);
      return this._input = input.element;
    };
    Plugin.prototype._keyDown = function(e) {
      e.stopImmediatePropagation();
      if (e.keyCode === 13) {
        e.preventDefault();
        return this._addTag();
      }
    };
    Plugin.prototype._buttonClick = function(e) {
      if (typeof e.stopImmediatePropagation === "function") {
        e.stopImmediatePropagation();
      }
      e.preventDefault();
      return this._addTag();
    };
    Plugin.prototype._addTag = function() {
      var value;
      value = this._input.value;
      value = value.trim();
      value = value.replace(/\s+/g, ' ');
      this.addTag(value);
      return this._input.value = '';
    };
    Plugin.prototype._updateValues = function() {
      var k, v, values, _ref, _ref1;
      values = [];
      _ref = this._values;
      for (k in _ref) {
        v = _ref[k];
        values.push(v.value);
      }
      return (_ref1 = this._content) != null ? _ref1.innerHTML = JSON.stringify(values) : void 0;
    };
    Plugin.prototype.removeTag = function(value) {
      var normalized, target;
      if (!value || value.trim().length === 0) {
        return;
      }
      normalized = value.toLowerCase();
      if (!this._values[normalized]) {
        return;
      }
      target = this._values[normalized];
      target.element.parentNode.removeChild(target.element);
      this._values[normalized] = null;
      return delete this._values[normalized];
    };
    Plugin.prototype._commitAddTag = function(value, target) {
      var container, normalized;
      if (this._template) {
        normalized = value.toLowerCase();
        container = this.addItem(value, this._container);
        this._values[normalized] = {
          element: container,
          value: value
        };
      }
      this._input.focus();
      return this._updateValues();
    };
    Plugin.prototype.addSuggestion = function(value) {
      var container, normalized;
      normalized = value.toLowerCase();
      if (!this._suggestions[normalized]) {
        container = this.addItem(value, this._suggestion);
        return this._suggestions[normalized] = {
          element: container,
          value: value
        };
      }
    };
    Plugin.prototype.addItem = function(value, target) {
      var addBtn, container, content, removeBtn;
      content = document.createDocumentFragment();
      app.template.renderBlock(this._template, {
        value: value
      }, content);
      removeBtn = content.querySelector('.remove');
      addBtn = content.querySelector('.add');
      container = content.querySelector('*');
      if (removeBtn) {
        removeBtn.value = value;
        removeBtn.on('click', this._removeTag);
      }
      if (addBtn) {
        addBtn.value = value;
        addBtn.on('click', this._addSuggested);
      }
      if (!target) {
        target = this._container;
      }
      target.appendChild(content);
      return container;
    };
    Plugin.prototype.addTag = function(value) {
      var normalized;
      if (!value || value.trim().length === 0) {
        return;
      }
      normalized = value.toLowerCase();
      if (this._values[normalized]) {
        return;
      }
      if (this._validateAction) {
        if (!this._loading) {
          this._loading = new cms.ui.Loading();
          this.appendChild(this._loading);
        }
        this._input.blur();
        this._loading.show();
        return API.call(this._validateAction, {
          value: value
        }, this._validateComplete, this._validateComplete);
      } else {
        return this._commitAddTag(value);
      }
    };
    Plugin.prototype._validateComplete = function(e, data) {
      var v, _i, _len, _ref;
      this._loading.hide();
      if (data.suggestions) {
        _ref = data.suggestions;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          v = _ref[_i];
          this.addSuggestion(v);
        }
      }
      if ((data != null ? data.confirm : void 0) != null) {
        if (!window.confirm(data.confirm)) {
          return;
        }
      }
      if (data.value) {
        return this._commitAddTag(data.value);
      }
    };
    Plugin.prototype._removeTag = function(e) {
      var target, value;
      target = e.currentTarget;
      value = target.value;
      return this.removeTag(value);
    };
    Plugin.prototype._addSuggested = function(e) {
      var item, normalized, target, value, _ref;
      target = e.currentTarget;
      value = target.value;
      normalized = value.toLowerCase();
      item = this._suggestions[normalized];
      if (item) {
        if ((_ref = item.element.parentNode) != null) {
          _ref.removeChild(item.element);
        }
      }
      this.addTag(value);
      this._suggestions[normalized] = null;
      return delete this._suggestions[normalized];
    };
    return Plugin;
  })(BaseDOM);
  return Tagcloud;
})(cms.ui.Base);
var __hasProp = {}.hasOwnProperty;
cms.ui.tags["interface"].Tabs = (function(_super) {
  var Plugin;
  __extends(Tabs, _super);
  function Tabs() {
    return Tabs.__super__.constructor.apply(this, arguments);
  }
  Tabs.SELECTOR = 'tabs';
  Tabs.prototype._update = function(data) {
    var item, p, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = data.add;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      this._plugins[item] = new Plugin(item);
    }
    _ref1 = data.remove;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      p = this._plugins[item];
      if (p) {
        _results.push(typeof p.destroy === "function" ? p.destroy() : void 0);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Plugin = (function(_super1) {
    __extends(Plugin, _super1);
    function Plugin(element) {
      this._update = __bind(this._update, this);
      this._tabClick = __bind(this._tabClick, this);
      this._updateTargets = __bind(this._updateTargets, this);
      var o, paramsRE, updateData;
      Plugin.__super__.constructor.call(this, {
        element: element
      });
      if (this.attr('update')) {
        this._updateParams = [];
        updateData = this.attr('update');
        paramsRE = /\[([^\[\]]+)\]/g;
        while (o = paramsRE.exec(updateData)) {
          this._updateParams.push(o[1].split(','));
        }
        if (this._updateParams.length > 0) {
          this.element.on('change', this._updateTargets);
          setTimeout(this._updateTargets, 1);
        }
      }
      this._parseTabs();
    }
    Plugin.prototype._updateTargets = function() {
      var i, items, j, params, value, _results;
      i = this._updateParams.length;
      value = this.element.value;
      _results = [];
      while (i-- > 0) {
        params = this._updateParams[i];
        items = document.body.querySelectorAll(params[0]);
        j = items.length;
        _results.push((function() {
          var _results1;
          _results1 = [];
          while (j-- > 0) {
            _results1.push(items[j].trigger(params[1], value));
          }
          return _results1;
        })());
      }
      return _results;
    };
    Plugin.prototype._parseTabs = function() {
      var found, i, k, tab, tabName, tabs, v, _ref;
      tabName = 'tab_' + Date.now() + '_' + Math.random();
      tabs = this._element.querySelectorAll('tab');
      i = tabs.length;
      this._tabs = [];
      while (i-- > 0) {
        tab = tabs[i];
        tab.on('click', this._tabClick);
        this._tabs[i] = tab;
      }
      found = false;
      _ref = slikland.Mara.globals['#'];
      for (k in _ref) {
        v = _ref[k];
        if (!v || v.length === 0) {
          continue;
        }
        try {
          if (this.matches(k)) {
            found = true;
            this._select(v);
          }
        } catch (_error) {}
      }
      if (!found) {
        return this._select(this._tabs[0].getAttribute('name'));
      }
    };
    Plugin.prototype._tabClick = function(e) {
      if (this.attr('id')) {
        app.router.setHash('#' + this.attr('id'), e.currentTarget.getAttribute('name'));
      }
      return this._select(e.currentTarget.getAttribute('name'));
    };
    Plugin.prototype._select = function(name) {
      var i;
      i = this._tabs.length;
      while (i-- > 0) {
        if (this._tabs[i].getAttribute('name') === name) {
          this._tabs[i].className = 'selected';
        } else {
          this._tabs[i].className = '';
        }
      }
      this.element.value = name;
      return this._updateTargets();
    };
    Plugin.prototype._update = function() {};
    return Plugin;
  })(BaseDOM);
  return Tabs;
})(cms.ui.Base);
var __hasProp = {}.hasOwnProperty;
cms.ui.tags["interface"].Renderer = (function(_super) {
  var Plugin;
  __extends(Renderer, _super);
  function Renderer() {
    return Renderer.__super__.constructor.apply(this, arguments);
  }
  Renderer.SELECTOR = 'renderer';
  Renderer.prototype._update = function(data) {
    var item, p, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = data.add;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      this._plugins[item] = new Plugin(item);
    }
    _ref1 = data.remove;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      p = this._plugins[item];
      if (p) {
        _results.push(typeof p.destroy === "function" ? p.destroy() : void 0);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Plugin = (function(_super1) {
    __extends(Plugin, _super1);
    function Plugin(element) {
      this._update = __bind(this._update, this);
      Plugin.__super__.constructor.call(this, {
        element: element
      });
      this.element.on('update', this._update);
    }
    Plugin.prototype._update = function(e, data) {
      return app.template.renderBlock(this.elemnet, data);
    };
    return Plugin;
  })(BaseDOM);
  return Renderer;
})(cms.ui.Base);
var __hasProp = {}.hasOwnProperty;
cms.ui.tags["interface"].NavLink = (function(_super) {
  var Plugin;
  __extends(NavLink, _super);
  function NavLink() {
    return NavLink.__super__.constructor.apply(this, arguments);
  }
  NavLink.SELECTOR = 'nav ul a';
  NavLink.prototype._update = function(data) {
    var item, p, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = data.add;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      this._plugins[item] = new Plugin(item);
    }
    _ref1 = data.remove;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      p = this._plugins[item];
      if (p) {
        _results.push(typeof p.destroy === "function" ? p.destroy() : void 0);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Plugin = (function(_super1) {
    __extends(Plugin, _super1);
    Plugin._destroyPlugin = function(item) {};
    function Plugin(element) {
      this._routeChange = __bind(this._routeChange, this);
      this._parseItems = __bind(this._parseItems, this);
      Plugin.__super__.constructor.call(this, {
        element: element
      });
      app.router.on(NavigationRouter.CHANGE, this._routeChange);
      setTimeout(this._routeChange, 1);
    }
    Plugin.prototype.destroy = function() {
      Plugin.__super__.destroy.apply(this, arguments);
      return app.router.off(NavigationRouter.CHANGE, this._routeChange);
    };
    Plugin.prototype._parseItems = function() {};
    Plugin.prototype._routeChange = function() {
      var p, p2;
      p = app.router.getCurrentPath().trim('/').replace(/\?.*?$/, '');
      p2 = this.attr('href').trim('/');
      return this.toggleClass('selected', p === p2);
    };
    return Plugin;
  })(BaseDOM);
  return NavLink;
})(cms.ui.Base);
var __hasProp = {}.hasOwnProperty;
cms.ui.tags.visualizer.ChartHelper = (function(_super) {
  var Plugin;
  __extends(ChartHelper, _super);
  function ChartHelper() {
    return ChartHelper.__super__.constructor.apply(this, arguments);
  }
  ChartHelper.SELECTOR = 'chart';
  ChartHelper.prototype._update = function(data) {
    var item, p, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = data.add;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      this._plugins[item] = new Plugin(item);
    }
    _ref1 = data.remove;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      p = this._plugins[item];
      if (p) {
        _results.push(typeof p.destroy === "function" ? p.destroy() : void 0);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Plugin = (function(_super1) {
    __extends(Plugin, _super1);
    Plugin._destroyPlugin = function(item) {};
    function Plugin(element) {
      this._labelTooltip = __bind(this._labelTooltip, this);
      this._labelTooltipTitle = __bind(this._labelTooltipTitle, this);
      this._resize = __bind(this._resize, this);
      this._parseFunctions = __bind(this._parseFunctions, this);
      this._update = __bind(this._update, this);
      var h, itemData, w;
      Plugin.__super__.constructor.call(this, {
        element: element
      });
      if ((w = this.attr('width'))) {
        if (/^[\d\.]$/.test(w)) {
          w += 'px';
        }
        this.css('width', w);
      }
      if ((h = this.attr('height'))) {
        if (/^[\d\.]$/.test(h)) {
          h += 'px';
        }
        this.css('height', h);
      }
      this._canvas = document.createElement('canvas');
      this._canvas.setAttribute('width', '100%');
      this._canvas.setAttribute('height', 400);
      this._context = this._canvas.getContext('2d');
      this._element.on('updated', this._update);
      window.addEventListener('resize', this._resize);
      itemData = element.itemData;
      if (itemData && (itemData.type != null)) {
        this._update({
          data: itemData
        });
      }
    }
    Plugin.prototype._update = function(e) {
      var data;
      data = e.data;
      this.appendChild(this._canvas);
      this._resize();
      this._data = data;
      if (!data.options || Array.isArray(data.options)) {
        data.options = {};
      }
      data.options.responsive = false;
      data.options.maintainAspectRatio = false;
      data.options.tooltips = {
        callbacks: {
          label: this._labelTooltip,
          title: this._labelTooltipTitle
        }
      };
      data = this._parseFunctions(data);
      this._chart = new Chart(this._canvas, data);
      this._chart.onHover = this._mouseMove;
      return this._chart.onMouseMove = this._mouseMove;
    };
    Plugin.prototype._parseFunctions = function(data) {
      var k, v;
      for (k in data) {
        v = data[k];
        if (typeof v === 'string') {
          if (/function\s*\(/.test(v)) {
            data[k] = eval('(' + v + ')');
          }
        } else if (typeof v === 'object') {
          data[k] = this._parseFunctions(v);
        }
      }
      return data;
    };
    Plugin.prototype._resize = function() {
      var bounds;
      bounds = this.getBounds();
      this._canvas.setAttribute('width', bounds.width);
      this._canvas.setAttribute('height', bounds.height);
      this._canvas.style.width = bounds.width + 'px';
      this._canvas.style.height = bounds.height + 'px';
      if (this._chart) {
        this._chart.chart.width = bounds.width;
        this._chart.chart.height = bounds.height;
        return this._chart.update(0);
      }
    };
    Plugin.prototype._labelTooltipTitle = function(tooltip, data) {
      var item;
      if (Array.isArray(tooltip)) {
        tooltip = tooltip[0];
      }
      item = data.datasets[tooltip.datasetIndex].data[tooltip.index];
      if (item.title != null) {
        return item.title;
      }
      return '';
    };
    Plugin.prototype._labelTooltip = function(tooltip, data) {
      var item, k, labels, v;
      item = data.datasets[tooltip.datasetIndex].data[tooltip.index];
      if (item.label != null) {
        return item.label;
      } else {
        if (Array.isArray(item)) {
          return item.join(', ');
        } else {
          labels = [];
          for (k in item) {
            v = item[k];
            if (typeof v !== 'string' && isNaN(v)) {
              continue;
            }
            labels.push(k + ': ' + v);
          }
          return labels.join(', ');
        }
      }
      return '';
    };
    return Plugin;
  })(BaseDOM);
  return ChartHelper;
})(cms.ui.Base);
var __hasProp = {}.hasOwnProperty;
cms.ui.tags.Tooltip = (function(_super) {
  var Plugin;
  __extends(Tooltip, _super);
  function Tooltip() {
    return Tooltip.__super__.constructor.apply(this, arguments);
  }
  Tooltip.SELECTOR = 'tooltip';
  Tooltip.prototype._update = function(data) {
    var item, p, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = data.add;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      this._plugins[item] = new Plugin(item);
    }
    _ref1 = data.remove;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      p = this._plugins[item];
      if (p) {
        _results.push(typeof p.destroy === "function" ? p.destroy() : void 0);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Plugin = (function(_super1) {
    __extends(Plugin, _super1);
    Plugin._destroyPlugin = function(item) {};
    function Plugin(element) {
      this._out = __bind(this._out, this);
      this._over = __bind(this._over, this);
      Plugin.__super__.constructor.call(this, {
        element: element
      });
      this._parent = element.parentNode;
      this._parent.on('mouseover', this._over);
      this._parent.on('mouseout', this._out);
    }
    Plugin.prototype._over = function() {
      return this.addClass('show');
    };
    Plugin.prototype._out = function() {
      return this.removeClass('show');
    };
    Plugin.prototype.destroy = function() {};
    return Plugin;
  })(BaseDOM);
  return Tooltip;
})(cms.ui.Base);
var __hasProp = {}.hasOwnProperty;
cms.ui.tags.Pagination = (function(_super) {
  var Plugin;
  __extends(Pagination, _super);
  function Pagination() {
    return Pagination.__super__.constructor.apply(this, arguments);
  }
  Pagination.SELECTOR = 'pagination';
  Pagination.prototype._update = function(data) {
    var item, p, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = data.add;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      this._plugins[item] = new Plugin(item);
    }
    _ref1 = data.remove;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      p = this._plugins[item];
      if (p) {
        _results.push(typeof p.destroy === "function" ? p.destroy() : void 0);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Plugin = (function(_super1) {
    __extends(Plugin, _super1);
    Plugin._destroyPlugin = function(item) {};
    function Plugin(element) {
      this._update = __bind(this._update, this);
      this._getClosest = __bind(this._getClosest, this);
      this._mouseMove = __bind(this._mouseMove, this);
      this._setSeeking = __bind(this._setSeeking, this);
      this._startPageSeek = __bind(this._startPageSeek, this);
      this._stopPageSeek = __bind(this._stopPageSeek, this);
      this._cancelSeek = __bind(this._cancelSeek, this);
      this._mouseUp = __bind(this._mouseUp, this);
      this._keyDown = __bind(this._keyDown, this);
      this._pageMouseDown = __bind(this._pageMouseDown, this);
      this._lastClick = __bind(this._lastClick, this);
      this._nextClick = __bind(this._nextClick, this);
      this._prevClick = __bind(this._prevClick, this);
      this._firstClick = __bind(this._firstClick, this);
      Plugin.__super__.constructor.call(this, {
        element: element
      });
      this._page = 0;
      this._pages = [];
      this._pageWrapper = new BaseDOM({
        element: 'div',
        className: 'wrapper'
      });
      this._pageContainer = new BaseDOM({
        element: 'div',
        className: 'page-container'
      });
      this._shadowLeft = new BaseDOM({
        element: 'span',
        className: 'shadow-left'
      });
      this._shadowRight = new BaseDOM({
        element: 'span',
        className: 'shadow-right'
      });
      this._first = new BaseDOM({
        element: 'a',
        className: 'arrow first'
      });
      this._prev = new BaseDOM({
        element: 'a',
        className: 'arrow prev'
      });
      this._next = new BaseDOM({
        element: 'a',
        className: 'arrow next'
      });
      this._last = new BaseDOM({
        element: 'a',
        className: 'arrow last'
      });
      this._first.element.on('click', this._firstClick);
      this._prev.element.on('click', this._prevClick);
      this._next.element.on('click', this._nextClick);
      this._last.element.on('click', this._lastClick);
      this._first.html = '<i />';
      this._prev.html = '<i />';
      this._next.html = '<i />';
      this._last.html = '<i />';
      this._pageWrapper.appendChild(this._pageContainer);
      this._pageWrapper.appendChild(this._shadowLeft);
      this._pageWrapper.appendChild(this._shadowRight);
      this.appendChild(this._first);
      this.appendChild(this._prev);
      this.appendChild(this._pageWrapper);
      this.appendChild(this._next);
      this.appendChild(this._last);
      this._pageContainer.element.on('mousedown', this._pageMouseDown);
      this._setItemValue();
      if (this.attr('numItems')) {
        this.element['numItems'] = this.attr('numItems');
      }
      this._element.on('update', this._update);
    }
    Plugin.get({
      page: function() {
        return this._page;
      }
    });
    Plugin.set({
      page: function(value) {
        var bounds, changed, i, p, pBounds, page, sl, sw, _ref;
        if (value >= this._total - 1) {
          value = this._total - 1;
          this._last.attr('disabled', '1');
          this._next.attr('disabled', '1');
        } else {
          this._last.element.removeAttribute('disabled');
          this._next.element.removeAttribute('disabled');
        }
        if (value <= 0) {
          value = 0;
          this._first.attr('disabled', '1');
          this._prev.attr('disabled', '1');
        } else {
          this._first.element.removeAttribute('disabled');
          this._prev.element.removeAttribute('disabled');
        }
        changed = false;
        if (this._page !== value) {
          changed = true;
        }
        this._page = value;
        this._element.index = this._page * this._numItems;
        this._element.numItems = this._numItems;
        KTween.remove(this);
        page = this._pages[this._page];
        if (!page) {
          return;
        }
        i = this._pages.length;
        while (i-- > 0) {
          if (i === this._page) {
            this._pages[i].className = 'hover';
          } else {
            this._pages[i].className = '';
          }
        }
        pBounds = this._pageContainer.getBounds();
        bounds = page.getBoundingClientRect();
        sl = this._pageContainer.element.scrollLeft;
        p = (bounds.right + bounds.left) * 0.5 - pBounds.left + sl - pBounds.width * 0.25;
        p = p / (this._pageContainer.element.scrollWidth - pBounds.width * 0.5);
        if (p < 0) {
          p = 0;
        } else if (p > 1) {
          p = 1;
        }
        sl = this._pageContainer.element.scrollLeft;
        sw = this._pageContainer.element.scrollWidth;
        if (sw - pBounds.width < 1) {
          this._shadowLeft.css('width', 0);
          this._shadowRight.css('width', 0);
        } else {
          this._shadowLeft.css('width', (p * 2) + 'em');
          this._shadowRight.css('width', ((1 - p) * 2) + 'em');
        }
        KTween.tween(this, {
          scrollPosition: p,
          onUpdate: this._test
        }, 'easeInOutQuart', 0.3);
        if (changed) {
          return (_ref = this._target) != null ? _ref.trigger('update') : void 0;
        }
      }
    });
    Plugin.get({
      _target: function() {
        return document.querySelector('#' + this.attr('for'));
      }
    });
    Plugin.get({
      total: function() {
        return this._total;
      }
    });
    Plugin.get({
      scrollPosition: function() {
        return this._pageContainer.element.scrollLeft / (this._pageContainer.element.scrollWidth - this._pageContainer.getBounds().width);
      }
    });
    Plugin.set({
      scrollPosition: function(value) {
        return this._pageContainer.element.scrollLeft = (this._pageContainer.element.scrollWidth - this._pageContainer.getBounds().width) * value;
      }
    });
    Plugin.prototype._setItemValue = function() {
      var data, id;
      id = this._element.getAttribute('for');
      data = app.router.getParam(id);
      if (!data) {
        return;
      }
      if (this.attr('numItems')) {
        this._numItems = this.attr('numItems');
      } else if (data['_numItems']) {
        this._numItems = data['_numItems'];
      }
      if (data['_index']) {
        this.page = this._page = data['_index'] / this._numItems;
        return this.element['index'] = data['_index'];
      }
    };
    Plugin.prototype._firstClick = function() {
      return this.page = 0;
    };
    Plugin.prototype._prevClick = function() {
      return this.page -= 1;
    };
    Plugin.prototype._nextClick = function() {
      return this.page += 1;
    };
    Plugin.prototype._lastClick = function() {
      return this.page = this.total - 1;
    };
    Plugin.prototype._pageMouseDown = function(e) {
      this._seeking = false;
      this._mousePos = MouseUtils.getMousePos(e);
      window.addEventListener('mouseup', this._mouseUp);
      window.addEventListener('mousemove', this._mouseMove);
      window.addEventListener('keydown', this._keyDown);
      this._startPageSeek(e);
      return e.preventDefault();
    };
    Plugin.prototype._keyDown = function(e) {
      if (e.keyCode === 27) {
        return this._cancelSeek();
      }
    };
    Plugin.prototype._mouseUp = function() {
      clearTimeout(this._pageSeekTimeout);
      return this._stopPageSeek();
    };
    Plugin.prototype._cancelSeek = function() {
      window.removeEventListener('mousemove', this._mouseMove);
      window.removeEventListener('mouseup', this._mouseUp);
      window.removeEventListener('keydown', this._keyDown);
      this.removeClass('seeking');
      this._seeking = true;
      return this.page = this._page;
    };
    Plugin.prototype._stopPageSeek = function() {
      window.removeEventListener('mousemove', this._mouseMove);
      window.removeEventListener('mouseup', this._mouseUp);
      window.removeEventListener('keydown', this._keyDown);
      this.removeClass('seeking');
      this._seeking = true;
      if (this._closestItem) {
        return this.page = this._closestItem.index;
      }
    };
    Plugin.prototype._startPageSeek = function(e) {
      this._pageSeekTimeout = setTimeout(this._setSeeking, 100);
      this._seeking = true;
      return this._mouseMove(e);
    };
    Plugin.prototype._setSeeking = function() {
      return this.addClass('seeking');
    };
    Plugin.prototype._mouseMove = function(e) {
      var bounds, cX, dx, ePos, pX, pw, px, sl, w, x;
      this._prevPos = this._mousePos;
      this._mousePos = MouseUtils.getMousePos(e, false);
      if (!this._seeking) {
        return;
      }
      if (!this._prevPos) {
        return;
      }
      bounds = this._pageWrapper.getBounds();
      ePos = MouseUtils.toGlobal(bounds.left, bounds.top);
      pX = (this._prevPos[0] - ePos[0]) / bounds.width;
      cX = (this._mousePos[0] - ePos[0]) / bounds.width;
      if (pX < 0) {
        pX = 0;
      } else if (pX > 1) {
        pX = 1;
      }
      if (cX < 0) {
        cX = 0;
      } else if (cX > 1) {
        cX = 1;
      }
      x = pX;
      dx = (cX - pX) * bounds.width;
      sl = this._pageContainer.element.scrollLeft;
      pw = this._pageContainer.element.scrollWidth;
      if (dx > 0) {
        x = 1 - x;
        w = pw - sl - bounds.width * x;
      } else {
        w = sl + bounds.width * x;
      }
      dx /= bounds.width * x;
      px = sl + dx * w;
      if (px < 0) {
        px = 0;
      } else if (px > pw - bounds.width) {
        px = pw - bounds.width;
      }
      this._pageContainer.element.scrollLeft += dx * w;
      return this._getClosest();
    };
    Plugin.prototype._getClosest = function() {
      var b, closestItem, cx, d, dx, i, item, pBounds, pPos, pos;
      pos = [].concat(this._mousePos);
      pBounds = this._pageWrapper.getBounds();
      pPos = MouseUtils.toGlobal(pBounds.left, pBounds.top);
      pos = [pos[0] - pPos[0], pos[1] - pPos[1]];
      i = this._pages.length;
      d = Number.MAX_VALUE;
      closestItem = null;
      while (i-- > 0) {
        item = this._pages[i];
        b = item.getBoundingClientRect();
        cx = (b.right + b.left) * 0.5 - pBounds.left;
        dx = cx - pos[0];
        dx *= dx;
        item.className = '';
        if (dx < d) {
          d = dx;
          closestItem = item;
        }
      }
      if (closestItem) {
        closestItem.className = 'hover';
        return this._closestItem = closestItem;
      }
    };
    Plugin.prototype._update = function(e) {
      var data, i, l, page;
      data = e.data;
      if (!data || (data.total == null) || (data.numItems == null)) {
        return;
      }
      this._pageContainer.removeAll();
      this._pages.length = 0;
      l = Math.ceil(data.total / data.numItems);
      this._total = l;
      this._numItems = data.numItems;
      if (this._total === 0) {
        this.css('display', 'none');
      } else {
        this.css('display', '');
      }
      i = -1;
      while (++i < l) {
        page = document.createElement('a');
        page.innerHTML = i + 1;
        page.index = i;
        this._pageContainer.appendChild(page);
        this._pages[i] = page;
      }
      return this.page = this._page = Math.floor(data.index / data.numItems);
    };
    return Plugin;
  })(BaseDOM);
  return Pagination;
})(cms.ui.Base);
var __hasProp = {}.hasOwnProperty;
cms.ui.tags.form.Figure = (function(_super) {
  var Plugin;
  __extends(Figure, _super);
  function Figure() {
    return Figure.__super__.constructor.apply(this, arguments);
  }
  Figure.SELECTOR = 'figure';
  Figure.prototype._update = function(data) {
    var item, p, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = data.add;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      this._plugins[item] = new Plugin(item);
    }
    _ref1 = data.remove;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      p = this._plugins[item];
      if (p) {
        _results.push(typeof p.destroy === "function" ? p.destroy() : void 0);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Plugin = (function(_super1) {
    __extends(Plugin, _super1);
    function Plugin(element) {
      Plugin.__super__.constructor.call(this, {
        element: element
      });
      this.css('background-image', 'url(' + this.attr('src') + ')');
    }
    return Plugin;
  })(BaseDOM);
  return Figure;
})(cms.ui.Base);
var __hasProp = {}.hasOwnProperty;
cms.ui.tags.visualizer.ChartistHelper = (function(_super) {
  var Plugin;
  __extends(ChartistHelper, _super);
  function ChartistHelper() {
    return ChartistHelper.__super__.constructor.apply(this, arguments);
  }
  ChartistHelper.SELECTOR = 'chartist';
  ChartistHelper.prototype._update = function(data) {
    var item, p, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = data.add;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      this._plugins[item] = new Plugin(item);
    }
    _ref1 = data.remove;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      p = this._plugins[item];
      if (p) {
        _results.push(typeof p.destroy === "function" ? p.destroy() : void 0);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Plugin = (function(_super1) {
    __extends(Plugin, _super1);
    Plugin._destroyPlugin = function(item) {};
    function Plugin(element) {
      this._resize = __bind(this._resize, this);
      this._update = __bind(this._update, this);
      var h, w;
      Plugin.__super__.constructor.call(this, {
        element: element
      });
      if ((w = this.attr('width'))) {
        if (/^[\d\.]$/.test(w)) {
          w += 'px';
        }
        this.css('width', w);
      }
      if ((h = this.attr('height'))) {
        if (/^[\d\.]$/.test(h)) {
          h += 'px';
        }
        this.css('height', h);
      }
      this._element.on('updated', this._update);
      window.addEventListener('resize', this._resize);
    }
    Plugin.prototype._update = function(e) {
      var cons, data;
      data = e.data;
      if (!Chartist[data.type]) {
        throw new Error('Chart not found');
      }
      cons = Chartist[data.type];
      return this._chart = new cons(this.element, data.data, data.options);
    };
    Plugin.prototype._resize = function() {};
    return Plugin;
  })(BaseDOM);
  return ChartistHelper;
})(cms.ui.Base);
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
cms.ui.tags.Card = (function(_super) {
  __extends(Card, _super);
  Card.SELECTOR = 'card';
  function Card() {
    this._resize = __bind(this._resize, this);
    this._update = __bind(this._update, this);
    Card.__super__.constructor.apply(this, arguments);
    window.addEventListener('resize', this._resize);
    app.on('redraw', this._update);
  }
  Card.prototype._update = function(data) {
    setTimeout(this._resize, 0);
    return setTimeout(this._resize, 500);
  };
  Card.prototype._resize = function() {
    var b, card, cards, child, childs, content, fh, footer, h, header, hh, i, item, j, p, parent, parents, _results;
    cards = document.querySelectorAll('card.even-height');
    parents = [];
    childs = [];
    i = cards.length;
    while (i-- > 0) {
      card = cards[i];
      card.style.height = '';
      header = card.querySelector('header');
      footer = card.querySelector('footer');
      content = card.querySelector('content');
      if (header != null) {
        header.style.height = '';
      }
      if (content != null) {
        content.style.height = '';
      }
      if (footer != null) {
        footer.style.height = '';
      }
      parent = card.parentNode;
      if (parents.indexOf(parent) < 0) {
        parents.push(parent);
      }
      p = parents.indexOf(parent);
      if (!childs[p]) {
        childs[p] = {
          height: 0,
          children: []
        };
      }
      b = card.getBoundingClientRect();
      h = b.bottom - b.top;
      if (childs[p].height < h) {
        childs[p].height = h;
      }
      childs[p].children.push(card);
    }
    i = parents.length;
    _results = [];
    while (i-- > 0) {
      item = childs[i];
      j = item.children.length;
      h = item.height;
      _results.push((function() {
        var _results1;
        _results1 = [];
        while (j-- > 0) {
          child = item.children[j];
          child.style.height = h + 'px';
          header = child.querySelector('header');
          footer = child.querySelector('footer');
          content = child.querySelector('content');
          hh = 0;
          fh = 0;
          if (header) {
            hh = header.getBoundingClientRect();
            hh = hh.bottom - hh.top;
          }
          if (footer) {
            fh = footer.getBoundingClientRect();
            fh = fh.bottom - fh.top;
          }
          if (content) {
            _results1.push(content.style.height = h - hh - fh + 'px');
          } else {
            _results1.push(void 0);
          }
        }
        return _results1;
      })());
    }
    return _results;
  };
  return Card;
})(cms.ui.Base);
var __hasProp = {}.hasOwnProperty;
cms.ui.tags.Back = (function(_super) {
  var Plugin;
  __extends(Back, _super);
  function Back() {
    return Back.__super__.constructor.apply(this, arguments);
  }
  Back.SELECTOR = 'back';
  Back.prototype._update = function(data) {
    var item, p, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = data.add;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (!app.main.hasHistory) {
        if (item != null) {
          item.parentNode.removeChild(item);
        }
      } else {
        this._plugins[item] = new Plugin(item);
      }
    }
    _ref1 = data.remove;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      p = this._plugins[item];
      if (p) {
        _results.push(typeof p.destroy === "function" ? p.destroy() : void 0);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Plugin = (function(_super1) {
    __extends(Plugin, _super1);
    Plugin._destroyPlugin = function(item) {};
    function Plugin(element) {
      this._click = __bind(this._click, this);
      Plugin.__super__.constructor.call(this, {
        element: element
      });
      this._element.on('click', this._click);
    }
    Plugin.prototype._click = function() {
      return app.trigger('back');
    };
    return Plugin;
  })(BaseDOM);
  return Back;
})(cms.ui.Base);
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
cms.ui.UI = (function() {
  function UI() {
    this._updateInstances = __bind(this._updateInstances, this);
    this._domChanged = __bind(this._domChanged, this);
    this._initListeners = __bind(this._initListeners, this);
    this._registerUIs = __bind(this._registerUIs, this);
    this._instances = [];
    setTimeout(this._registerUIs, 0);
  }
  UI.set({
    _dirty: function(value) {
      this._updateInstances();
      return;
      if (!value) {
        return;
      }
      clearTimeout(this._dirtyTimeout);
      return this._dirtyTimeout = setTimeout(this._updateInstances, 0);
    }
  });
  UI.prototype._registerUIs = function() {
    this._parseUIs(cms.ui, true);
    return this._initListeners();
  };
  UI.prototype._parseUIs = function(classes, onlyChild) {
    var c, n, _results;
    if (onlyChild == null) {
      onlyChild = false;
    }
    _results = [];
    for (n in classes) {
      c = classes[n];
      if (c instanceof Function) {
        if (!onlyChild) {
          _results.push(this._instances.push(new c()));
        } else {
          _results.push(void 0);
        }
      } else {
        _results.push(this._parseUIs(c));
      }
    }
    return _results;
  };
  UI.prototype._initListeners = function() {
    if (MutationObserver) {
      this._mutationObserver = new MutationObserver(this._domChanged);
      this._mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    } else {
      target.addEventListener('DOMSubtreeModified', this._domChanged);
    }
    return this._domChanged();
  };
  UI.prototype._domChanged = function() {
    return this._dirty = true;
  };
  UI.prototype._updateInstances = function() {
    var i, _results;
    i = this._instances.length;
    _results = [];
    while (i-- > 0) {
      _results.push(this._instances[i].update());
    }
    return _results;
  };
  return UI;
})();
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
cms.ui.tags.Tag = (function(_super) {
  __extends(Tag, _super);
  function Tag() {
    this._setupTag = __bind(this._setupTag, this);
    return Tag.__super__.constructor.apply(this, arguments);
  }
  Tag.SELECTOR = 'tag';
  Tag.prototype._update = function(data) {
    var item, p, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = data.add;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      this._setupTag(item);
    }
    _ref1 = data.remove;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      p = this._plugins[item];
      if (p) {
        _results.push(typeof p.destroy === "function" ? p.destroy() : void 0);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Tag.prototype._setupTag = function(item) {
    var color;
    color = item.getAttribute('color');
    if (color) {
      item.style['background-color'] = color;
      item.style['border-color'] = color;
      return item.style['box-shadow'] = "inset 1px 1px 1px " + color + ", inset -1px -1px 1px " + color;
    }
  };
  return Tag;
})(cms.ui.Base);
var Notification;
Notification = (function(_super) {
  var NotificationItem;
  __extends(Notification, _super);
  Notification.DEFAULT_TIMEOUT = 4;
  function Notification() {
    this._hideNotification = __bind(this._hideNotification, this);
    this._showNotification = __bind(this._showNotification, this);
    this.showNotification = __bind(this.showNotification, this);
    this.showNotifications = __bind(this.showNotifications, this);
    Notification.__super__.constructor.apply(this, arguments);
  }
  Notification.prototype.destroy = function() {};
  Notification.prototype.showNotifications = function(items) {
    var i, item, _i, _len, _results;
    items = [].concat(items);
    i = items.length;
    _results = [];
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      if (item['delay'] != null) {
        _results.push(setTimeout(this.showNotification, item['delay'] * 1000, item));
      } else {
        _results.push(this.showNotification(item));
      }
    }
    return _results;
  };
  Notification.prototype.showNotification = function(item) {
    var target;
    if (typeof item === 'string') {
      if (item.length === 0) {
        return;
      }
    } else if (item.message == null) {
      return;
    } else if (item.message.length === 0) {
      return;
    }
    target = document.querySelector('notification');
    if (!target) {
      target = document.body;
    }
    if (!(typeof target.getInstance === "function" ? target.getInstance() : void 0)) {
      target = new BaseDOM({
        element: target
      });
    } else {
      target = target.getInstance();
    }
    item = new NotificationItem(item);
    target.appendChildAt(item);
    return item.element.scrollIntoView();
  };
  Notification.prototype._showNotification = function(e, data) {
    return data = [].concat(data);
  };
  Notification.prototype._hideNotification = function(e, data) {};
  NotificationItem = (function(_super1) {
    __extends(NotificationItem, _super1);
    function NotificationItem(data) {
      this._closeClick = __bind(this._closeClick, this);
      this._hideNotification = __bind(this._hideNotification, this);
      NotificationItem.__super__.constructor.call(this, {
        element: 'div',
        className: 'notification-item show-down'
      });
      if (typeof data === 'string') {
        data = {
          message: data
        };
      }
      if (data['message']) {
        this.text = data['message'];
      }
      if (data['type']) {
        this.addClass('p' + data['type']);
      } else {
        this.addClass('p3');
      }
      this.timeout = Notification.DEFAULT_TIMEOUT;
      if (data['timeout']) {
        this.timeout = Number(data['timeout']);
      }
      if (this.timeout > 0) {
        this._closeTimeout = setTimeout(this._hideNotification, this.timeout * 1000);
      }
      this.closeBtn = new BaseDOM({
        element: 'i',
        className: 'closeBtn fa fa-close'
      });
      this.closeBtn.element.on('click', this._closeClick);
      this.appendChild(this.closeBtn);
    }
    NotificationItem.prototype._hideNotification = function() {
      return this._hide();
    };
    NotificationItem.prototype._hide = function() {
      clearTimeout(this._closeTimeout);
      this.element.parentNode.removeChild(this.element);
      return typeof this.destroy === "function" ? this.destroy() : void 0;
    };
    NotificationItem.prototype._closeClick = function(e) {
      return this._hide();
    };
    return NotificationItem;
  })(BaseDOM);
  return Notification;
})(EventDispatcher);
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
cms.ui.Loading = (function(_super) {
  __extends(Loading, _super);
  Loading.HIDE_COMPLETE = 'loading_hideComplete';
  function Loading() {
    this._hideComplete = __bind(this._hideComplete, this);
    this._hideStart = __bind(this._hideStart, this);
    Loading.__super__.constructor.call(this, {
      element: 'loading'
    });
    this._progress = this._currentPosition = 0;
    this._showPosition = 0;
    this._element.removable = false;
    this._background = new BaseDOM({
      element: 'div',
      className: 'background'
    });
    this._progressBar = new BaseDOM({
      element: 'div',
      className: 'progress-bar'
    });
    this.appendChild(this._background);
    this.appendChild(this._progressBar);
  }
  Loading.get({
    progress: function() {
      return this._progress;
    }
  });
  Loading.set({
    progress: function(value) {
      if (value < 0) {
        value = 0;
      } else if (value > 1) {
        value = 1;
      }
      this._progress = value;
      KTween.remove(this, '_position');
      return KTween.tween(this, {
        _position: this._progress
      }, 'easeOutQuart', 0.3);
    }
  });
  Loading.get({
    _position: function() {
      return this._currentPosition;
    }
  });
  Loading.set({
    _position: function(value) {
      if (value < 0) {
        value = 0;
      } else if (value > 1) {
        value = 1;
      }
      this._currentPosition = value;
      return this._progressBar.css({
        width: (value * 100) + '%'
      });
    }
  });
  Loading.get({
    showPosition: function() {
      return this._showPosition;
    }
  });
  Loading.set({
    showPosition: function(value) {
      var op;
      if (value < 0) {
        value = 0;
      } else if (value > 1) {
        value = 1;
      }
      this._showPosition = value;
      op = value * 2 - 1;
      if (op < 0) {
        op = 0;
      } else if (op > 1) {
        op = 1;
      }
      this._background.css({
        opacity: op
      });
      return this._progressBar.css({
        height: (value * 4) + 'px'
      });
    }
  });
  Loading.prototype.reset = function() {
    KTween.remove(this);
    this.showPosition = 0;
    return this.progress = this._position = 0;
  };
  Loading.prototype.show = function() {
    this.css({
      visibility: ''
    });
    this.reset();
    this.removeClass('disabled');
    return KTween.tween(this, {
      showPosition: 1
    }, 'easeOutQuart', 0.1);
  };
  Loading.prototype.hide = function() {
    this.addClass('disabled');
    this.progress = 1;
    KTween.remove(this, '_position');
    return KTween.tween(this, {
      _position: this._progress,
      onComplete: this._hideStart
    }, 'easeOutQuart', 0.2);
  };
  Loading.prototype._hideStart = function() {
    KTween.remove(this, 'showPosition');
    return KTween.tween(this, {
      showPosition: 0,
      onComplete: this._hideComplete
    }, 'easeOutQuart', 0.1);
  };
  Loading.prototype._hideComplete = function() {
    this.css({
      visibility: 'hidden'
    });
    return this.trigger(this.HIDE_COMPLETE);
  };
  return Loading;
})(BaseDOM);
var Blocker;
Blocker = (function(_super) {
  __extends(Blocker, _super);
  function Blocker() {
    this._transitionEnd = __bind(this._transitionEnd, this);
    Blocker.__super__.constructor.call(this, {
      element: 'div',
      className: 'blocker'
    });
    this.css({
      display: 'none'
    });
    this.element.on('transitionend', this._transitionEnd);
    this.element.on('moztransitionend', this._transitionEnd);
    this.element.on('otransitionend', this._transitionEnd);
    this.element.on('webkittransitionend', this._transitionEnd);
    this._showing = false;
  }
  Blocker.prototype.show = function(showLoader) {
    if (showLoader == null) {
      showLoader = true;
    }
    this._showing = true;
    if (!this.element.parentNode) {
      document.body.appendChild(this.element);
    }
    this.css({
      display: 'block'
    });
    return this.addClass('show');
  };
  Blocker.prototype.hide = function() {
    this._showing = false;
    return this.removeClass('show');
  };
  Blocker.prototype._transitionEnd = function() {
    if (!this._showing) {
      return this.css({
        display: 'none'
      });
    }
  };
  return Blocker;
})(BaseDOM);
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
slikland.mara.Block = (function() {
  var k, v, _ref;
  Block._INSTRUCTION_RE = /^([\(\#\@\>\<])?([^\:]*?)?(?:(?::)(.*?)(?:\#{([^\#\{\}\'\"]*?)})?)?\s*$/m;
  Block.TYPES = {
    1: 'NORMAL',
    2: 'CONDITIONAL',
    3: 'REFERENCE',
    4: 'INSTANCE',
    5: 'FILE'
  };
  Block._blocks = {};
  Block._MARA_ID = 1;
  _ref = Block.TYPES;
  for (k in _ref) {
    v = _ref[k];
    Block.TYPES[v] = Number(k);
  }
  Block._registerBlock = function(block) {
    return this._blocks[block.maraId] = block;
  };
  Block.findBlock = function(id) {
    id = Number(id);
    return this._blocks[id];
  };
  function Block(instruction, file) {
    this._renderLoadedBlock = __bind(this._renderLoadedBlock, this);
    this._replaceObject = __bind(this._replaceObject, this);
    this._maraId = this.constructor._MARA_ID++;
    this.constructor._registerBlock(this);
    this._file = file;
    this._type = null;
    this._instance = null;
    this._renderQueue = [];
    instruction = this.constructor._INSTRUCTION_RE.exec(instruction);
    if (instruction[1] === '#') {
      throw new Error('Comment line');
    }
    this._parseInstruction(instruction);
  }
  Block.get({
    maraId: function() {
      return this._maraId;
    }
  });
  Block.get({
    file: function() {
      return this._file;
    }
  });
  Block.get({
    name: function() {
      if (!this._instance) {
        return null;
      }
      return this._instance;
    }
  });
  Block.get({
    children: function() {
      return this._children;
    }
  });
  Block.set({
    children: function(value) {
      var _i, _len;
      if (!value || !Array.isArray(value)) {
        throw new Error('slikland.mara.Block children needs to be an Array');
      }
      for (_i = 0, _len = value.length; _i < _len; _i++) {
        v = value[_i];
        if (!(v instanceof Block)) {
          throw new Error('slikland.mara.Block children needs to be an Array of slikland.mara.Block');
        }
      }
      return this._children = value;
    }
  });
  Block.get({
    type: function() {
      return this._type;
    }
  });
  Block.prototype.toValue = function() {
    var obj;
    obj = {};
    switch (this._type) {
      case 2:
        obj['condition'] = this._condition;
        break;
      case 3:
        obj['reference'] = this._reference;
        break;
      case 4:
        obj['instance'] = this._instance;
        break;
      case 5:
        obj['file'] = this._file;
        if (this._reference) {
          obj['reference'] = this._reference;
        }
        break;
      default:
        obj['tag'] = this._tag;
    }
    obj['type'] = this.constructor.TYPES[this._type];
    obj['data'] = this._data;
    return obj;
  };
  Block.prototype.duplicate = function(context, data) {
    return this.render(data, context);
  };
  Block.prototype._parseInstruction = function(instruction) {
    var classes, id, idClassRE, o, ref, type, _ref1;
    ref = instruction[2] || '';
    this._attributes = instruction[3] || '';
    this._data = instruction[4] || '';
    switch (instruction[1]) {
      case '(':
        type = this.constructor.TYPES['CONDITIONAL'];
        ref = ref.replace(/\)\s*$/, '');
        this._condition = ref;
        break;
      case '>':
        type = this.constructor.TYPES['REFERENCE'];
        this._reference = ref;
        break;
      case '<':
        type = this.constructor.TYPES['INSTANCE'];
        this._instance = ref;
        break;
      case '@':
        type = this.constructor.TYPES['FILE'];
        o = /(.*?)(?:(?:\>)(.*?))?$/.exec(ref);
        this._file = o[1];
        if (((_ref1 = o[2]) != null ? _ref1.length : void 0) > 0) {
          this._reference = o[2];
        }
        break;
      default:
        type = this.constructor.TYPES['NORMAL'];
        idClassRE = /(#|.)([^\#\.]+)/g;
        id = null;
        classes = [];
        while (o = idClassRE.exec(ref)) {
          switch (o[1]) {
            case '#':
              id = o[2];
              break;
            case '.':
              classes.push(o[2]);
          }
        }
        if (id) {
          this._id = id;
        }
        if (classes) {
          this._classes = classes;
        }
        ref = ref.replace(/[#.].*?$/, '');
        this._tag = ref;
    }
    return this._type = type;
  };
  Block.prototype._parseObjectString = function(object, data, test) {
    var e, glob, replaceObject, _ref1;
    if (data == null) {
      data = {};
    }
    if (test == null) {
      test = false;
    }
    glob = slikland.Mara.globals;
    replaceObject = object.replace(/\#\{(\$|\@)([^\}\}\#]+)\}/g, '(glob[\'$1\'][\'$2\'] || \'\')');
    replaceObject = replaceObject.replace(/\#\{([^\}\}\#]+)\}/g, '(data[\'$1\'] || \'\')').replace(/\#\{\}/g, '(data || \'\')');
    try {
      object = eval('(function(){return (' + replaceObject + ');})();');
    } catch (_error) {}
    if (test) {
      return Boolean(object);
    }
    if (typeof object !== 'string') {
      object = JSON.stringify(object);
    }
    try {
      object = this._replaceString(object, data);
      object = JSON.parse(object);
    } catch (_error) {
      e = _error;
      if (object) {
        object = {
          'html': object
        };
      } else {
        object = {};
      }
    }
    if ((_ref1 = typeof object) === 'string' || _ref1 === 'number') {
      object = {
        'html': object
      };
    }
    return object;
  };
  Block.prototype._replaceString = function(string, data) {
    this._currentReplaceObjectData = data;
    string = string.replace(/\(glob\[\'(.*?)\'\]\[\'([^\s]+)\'\] \|\| \'\'\)/g, '\#\{$1$2\}');
    string = string.replace(/\(data\[\'(.*?)\'\]\ \|\| \'\'\)/g, '\#\{$1\}');
    string = string.replace(/\(data \|\| \'\'\)/g, '\#\{\}');
    string = string.replace(/\#\{(\$|\@)?([^\}\}\#]+)?\}/g, this._replaceObject);
    return string;
  };
  Block.prototype._replaceObject = function(match, symbol, name) {
    var data;
    data = null;
    if (symbol && symbol.length > 0) {
      if (name) {
        data = ObjectUtils.find(slikland.Mara.globals[symbol], name);
      }
    } else {
      if (name) {
        data = ObjectUtils.find(this._currentReplaceObjectData, name);
      } else {
        data = this._currentReplaceObjectData;
      }
    }
    if (data == null) {
      data = '';
    }
    return data;
  };
  Block.prototype.render = function(data, context, onlyChildren) {
    var child, d, ret, _i, _j, _len, _len1, _name, _ref1;
    if (context == null) {
      context = null;
    }
    if (onlyChildren == null) {
      onlyChildren = false;
    }
    if (!context) {
      context = document.createElement('div');
    }
    if (onlyChildren) {
      ret = [data, context];
    } else {
      ret = typeof this[_name = '_render_' + this.constructor.TYPES[this._type]] === "function" ? this[_name](data, context) : void 0;
    }
    if (ret) {
      if (ret[1] && ret[1] instanceof Node) {
        ret = [ret];
      }
      for (_i = 0, _len = ret.length; _i < _len; _i++) {
        d = ret[_i];
        data = d[0];
        context = d[1];
        if (this._children) {
          _ref1 = this._children;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            child = _ref1[_j];
            child.render(data, context);
          }
        }
      }
    }
    return ret;
  };
  Block.prototype._render_NORMAL = function(data, context) {
    var className, content, el, html, item, items, ret, _i, _len, _ref1;
    if (!this._tag) {
      return [data, context];
    }
    items = data;
    if (this._data && this._data.length > 0) {
      items = items != null ? items[this._data] : void 0;
    }
    ret = [];
    if (items) {
      items = [].concat(items);
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        el = document.createElement(this._tag);
        content = this._parseObjectString(this._attributes, item);
        html = null;
        if (content['html']) {
          html = content['html'];
        } else if (content['text']) {
          html = content['text'];
        } else if (content['content']) {
          html = content['content'];
          delete content['content'];
        }
        delete content['html'];
        delete content['text'];
        if (html) {
          el.innerHTML = html;
        }
        for (k in content) {
          v = content[k];
          if ((_ref1 = typeof k) === 'string' || _ref1 === 'number') {
            if (v) {
              el.setAttribute(k, v);
            }
          }
        }
        el.itemData = item;
        el.data = data;
        el.setAttribute('mara', this._maraId);
        if (this._id) {
          el.setAttribute('id', this._id);
        }
        if (this._classes) {
          className = el.className || '';
          className = className.split(' ');
          className = [].concat(className, this._classes);
          el.className = className.join(' ');
        }
        context.appendChild(el);
        ret.push([item, el]);
      }
    }
    return ret;
  };
  Block.prototype._renderLoadedBlock = function(block) {
    var child, children, context, data, i, item, items, parentNode, prevChild, renderData, _i, _j, _len, _len1, _ref1;
    _ref1 = this._renderQueue;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      renderData = _ref1[_i];
      data = renderData.data;
      context = renderData.context;
      items = data;
      if (this._data && this._data.length > 0) {
        items = items != null ? items[this._data] : void 0;
      }
      if (items) {
        items = [].concat(items);
        for (_j = 0, _len1 = items.length; _j < _len1; _j++) {
          item = items[_j];
          block.render(item, context);
        }
      }
      parentNode = context.parentNode;
      children = context.childNodes;
      prevChild = context;
      i = children.length;
      while (i-- > 0) {
        child = children[i];
        if (!child) {
          continue;
        }
        if (prevChild) {
          parentNode.insertBefore(child, prevChild);
        } else {
          parentNode.appendChild(child);
        }
        prevChild = child;
      }
      parentNode.removeChild(context);
    }
    return this._renderQueue.length = 0;
  };
  Block.prototype._render_FILE = function(data, context) {
    var div, f;
    div = document.createElement('div');
    div.style.display = 'none';
    context.appendChild(div);
    this._renderQueue.push({
      data: data,
      context: div
    });
    f = this._file;
    if (this._reference) {
      f += '>' + this._reference;
    }
    try {
      f = this._replaceString(f, data);
      slikland.mara.Templates.getInstance().get(f, this._renderLoadedBlock);
    } catch (_error) {}
    return [[data, div]];
  };
  Block.prototype._render_INSTANCE = function(data, context) {
    return [[data, context]];
  };
  Block.prototype._render_REFERENCE = function(data, context) {
    var div;
    div = document.createElement('div');
    div.style.display = 'none';
    context.appendChild(div);
    this._renderQueue.push({
      data: data,
      context: div
    });
    slikland.mara.Templates.getInstance().get(this._file + '>' + this._reference, this._renderLoadedBlock);
    return [[data, div]];
  };
  Block.prototype._render_CONDITIONAL = function(data, context) {
    if (this._parseObjectString(this._condition, data, true)) {
      return [[data, context]];
    } else {
      return false;
    }
  };
  return Block;
})();
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
slikland.mara.Templates = (function() {
  Templates.getInstance = function() {
    return Templates._instance != null ? Templates._instance : Templates._instance = (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(Templates, arguments, function(){});
  };
  function Templates(rootPath) {
    if (rootPath == null) {
      rootPath = null;
    }
    this._fileLoaded = __bind(this._fileLoaded, this);
    this._checkCallbacks = __bind(this._checkCallbacks, this);
    this._callCallback = __bind(this._callCallback, this);
    this._templates = [];
    this._rootPath = '';
    this._callbacks = [];
    if (rootPath) {
      this.rootPath = rootPath;
    }
  }
  Templates.get({
    rootPath: function() {
      return this._rootPath;
    }
  });
  Templates.set({
    rootPath: function(value) {
      if (typeof value !== 'string') {
        return;
      }
      value = value.trim().rtrim('/');
      if (value.length > 0) {
        value += '/';
      }
      return this._rootPath = value;
    }
  });
  Templates.prototype._addInstance = function(block) {
    return this._templates.push(block);
  };
  Templates.prototype._findInstance = function(file, name) {
    var block, i, o;
    if (name == null) {
      name = null;
    }
    o = /(.*?)(?:(?:\>)(.*?))?$/.exec(file);
    file = o[1];
    if (!name && o[2]) {
      name = o[2];
    }
    i = this._templates.length;
    while (i-- > 0) {
      block = this._templates[i];
      if (block.file === file && block.name === name) {
        return block;
      }
    }
    return null;
  };
  Templates.prototype.get = function(file, callback) {
    var block;
    block = this._findInstance(file);
    if (block) {
      return setTimeout(this._callCallback, 0, callback, block);
    } else {
      this._callbacks.push({
        file: file,
        callback: callback
      });
      return this.load(file);
    }
  };
  Templates.prototype._callCallback = function(callback, block) {
    return typeof callback === "function" ? callback(block) : void 0;
  };
  Templates.prototype.load = function(file) {
    var o, path;
    o = /(.*?)(?:(?:\>)(.*?))?$/.exec(file);
    file = o[1];
    file = file.trim();
    if (file.length < 2) {
      return;
    }
    if (!(/\.mara$/i.test(file))) {
      file += '.mara';
    }
    if (file.charAt(0) === '/') {
      path = file;
    } else {
      path = this._rootPath + file;
    }
    return API.call(path, {
      file: file
    }, this._fileLoaded);
  };
  Templates.prototype._checkCallbacks = function() {
    var block, callback, file, i, item, _results;
    i = this._callbacks.length;
    _results = [];
    while (i-- > 0) {
      item = this._callbacks[i];
      file = item.file;
      callback = item.callback;
      block = this._findInstance(file);
      if (block) {
        if (typeof callback === "function") {
          callback(block);
        }
        _results.push(this._callbacks.splice(i, 1));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Templates.prototype._fileLoaded = function(e, data) {
    this._parse(data, e.currentTarget.data.file);
    return this._checkCallbacks();
  };
  Templates.prototype._parse = function(data, file) {
    var block, blocks;
    if (file == null) {
      file = '';
    }
    file = file.replace(/\.mara$/, '');
    blocks = this._parseBlocks(data + '\n', file);
    if (blocks.length > 1) {
      block = new slikland.mara.Block('', file);
      block.children = blocks;
    } else if (blocks.length === 1) {
      block = blocks[0];
    } else {
      block = new slikland.mara.Block('', file);
    }
    return this._addInstance(block);
  };
  Templates.prototype._removeIndent = function(data) {
    var i, indent, indentLength, indentRE, o;
    indentLength = Number.MAX_VALUE;
    indent = null;
    indentRE = /^(\s*)[^\s].*?$/gm;
    while ((o = indentRE.exec(data))) {
      i = o[1];
      if (i.length < indentLength) {
        indentLength = i.length;
        indent = i;
      }
    }
    if (indent) {
      data = data.replace(new RegExp('^' + indent, 'gm'), '');
    }
    return data;
  };
  Templates.prototype._parseBlocks = function(data, file) {
    var block, blockRE, blocks, children, content, e, o;
    if (file == null) {
      file = '';
    }
    data = this._removeIndent(data.replace(/^\s*\n/gm, ''));
    blockRE = /(\s*)([^\s].*?\n)((?:^\1[ |\t]+[^\n]*?(?:\n|$))*)/gm;
    blocks = [];
    while ((o = blockRE.exec(data))) {
      try {
        block = new slikland.mara.Block(o[2], file);
      } catch (_error) {
        e = _error;
        continue;
      }
      if (block.type === slikland.mara.Block.TYPES['INSTANCE']) {
        this._addInstance(block);
      } else {
        blocks.push(block);
      }
      content = o[3];
      if (content.length > 0) {
        children = this._parseBlocks(content, file);
        block.children = children;
      }
    }
    return blocks;
  };
  return Templates;
})();
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
slikland.Mara = (function(_super) {
  var _children, _id, _name;
  __extends(Mara, _super);
  Mara.RENDERED = 'mara_rendered';
  Mara._rootPath = '';
  Mara.globals = {};
  Mara.setGlobalObject = function(name, object) {
    return this.globals[name] = object;
  };
  Mara.getGlobal = function(name) {
    return this.globals[name];
  };
  Mara.setRootPath = function(path) {
    return this._rootPath = path;
  };
  _children = [];
  _name = null;
  _id = null;
  function Mara(rootPath) {
    if (rootPath == null) {
      rootPath = null;
    }
    this._referenceLoaded = __bind(this._referenceLoaded, this);
    this._removeChildren = __bind(this._removeChildren, this);
    this._showContext = __bind(this._showContext, this);
    this._holdContextToRender = __bind(this._holdContextToRender, this);
    this._templateLoaded = __bind(this._templateLoaded, this);
    this._templates = slikland.mara.Templates.getInstance(rootPath);
  }
  Mara.get({
    name: function() {
      return _name;
    }
  });
  Mara.get({
    id: function() {
      return _id;
    }
  });
  Mara.get({
    children: function() {
      return [].concat(_children);
    }
  });
  Mara.prototype.isCurrent = function(file) {
    var f, _ref, _ref1;
    f = ((_ref = this._renderData) != null ? _ref.file : void 0) || ((_ref1 = this._block) != null ? _ref1.file : void 0) || '';
    return file === f;
  };
  Mara.prototype.render = function(file, data, context, callback) {
    if (data == null) {
      data = {};
    }
    if (context == null) {
      context = null;
    }
    if (callback == null) {
      callback = null;
    }
    if (context != null ? context.element : void 0) {
      context = context.element;
    }
    this._renderData = {
      file: file,
      data: data,
      context: context,
      callback: callback
    };
    if (context) {
      context.setAttribute('loading', 'true');
    }
    return this._templates.get(file, this._templateLoaded);
  };
  Mara.prototype.reset = function() {
    return this._renderData = null;
  };
  Mara.prototype._templateLoaded = function(block) {
    var items, _base;
    if (!this._renderData) {
      return;
    }
    if (this._renderData.context) {
      this._renderData.context.removeAttribute('loading');
      this._resetContext(this._renderData.context);
      this._holdContextToRender(this._renderData.context);
    }
    items = block.render(this._renderData.data, this._renderData.context);
    this._block = block;
    return typeof (_base = this._renderData).callback === "function" ? _base.callback(items, this._block) : void 0;
  };
  Mara.prototype._holdContextToRender = function(context) {
    context.style.visibility = 'hidden';
    return setTimeout(this._showContext, 1, context);
  };
  Mara.prototype._showContext = function(context) {
    return context.style.visibility = '';
  };
  Mara.prototype._resetContext = function(target) {
    var children, i, items;
    children = target.childNodes;
    i = children.length;
    items = [];
    while (i-- > 0) {
      items[i] = children[i];
      items[i].style.display = 'none';
    }
    return setTimeout(this._removeChildren, 0, target, items);
  };
  Mara.prototype.resetContext = function(target) {
    var children, i, _ref, _results;
    children = target.childNodes;
    i = children.length;
    _results = [];
    while (i-- > 0) {
      if (((_ref = children[i]) != null ? _ref.removable : void 0) === false) {
        continue;
      }
      _results.push(target.removeChild(children[i]));
    }
    return _results;
  };
  Mara.prototype._removeChildren = function(target, children) {
    var i, _results;
    i = children.length;
    _results = [];
    while (i-- > 0) {
      if (children[i].removable === false) {
        continue;
      }
      _results.push(target.removeChild(children[i]));
    }
    return _results;
  };
  Mara.prototype.renderBlockByReference = function(reference, data, reset, callback) {
    if (reset == null) {
      reset = false;
    }
    if (callback == null) {
      callback = null;
    }
    this._renderData.callback = callback;
    return this._templates.get(this._renderData.file + reference, this._referenceLoaded);
  };
  Mara.prototype._referenceLoaded = function(block) {
    var items, _base;
    if (!this._renderData) {
      return;
    }
    items = block.render(this._renderData.data);
    this._renderData.context.appendChild(items[0][1]);
    this._block = block;
    return typeof (_base = this._renderData).callback === "function" ? _base.callback(items, this._block) : void 0;
  };
  Mara.prototype.renderBlock = function(element, data, context) {
    var block, renderData;
    if (context == null) {
      context = null;
    }
    if (!(element instanceof HTMLElement) || !element.getAttribute('mara')) {
      return;
    }
    if (!context) {
      this._resetContext(element);
      context = element;
    }
    block = slikland.mara.Block.findBlock(element.getAttribute('mara'));
    renderData = block.render(data, context, true);
    app.trigger('redraw');
    return renderData;
  };
  Mara.prototype.find = function() {};
  Mara.prototype.findAll = function() {};
  Mara.prototype.vilha = Mara.prototype.render;
  return Mara;
})(EventDispatcher);
var Main;
Main = (function() {
  Main.RENDER_TEMPLATE = 'app_renderTemplate';
  function Main() {
    this._renderTemplate = __bind(this._renderTemplate, this);
    this._loadComplete = __bind(this._loadComplete, this);
    this._error = __bind(this._error, this);
    this._indexComplete = __bind(this._indexComplete, this);
    this._goBack = __bind(this._goBack, this);
    this._routeChange = __bind(this._routeChange, this);
    this._init = __bind(this._init, this);
    this._history = [];
    new cms.ui.UI();
    app.body = new BaseDOM({
      element: document.body
    });
    app.rootPath = window.rootPath || '../';
    app.apiPath = window.apiPath || app.rootPath + 'api/';
    app.template = new slikland.Mara('templates/');
    slikland.Mara.setGlobalObject('@', app);
    app.templateContext = document.body;
    app.user = new User();
    app["interface"] = new cms.core.InterfaceController();
    setTimeout(this._init, 0);
    app.on(Main.RENDER_TEMPLATE, this._renderTemplate);
    app.router = new NavigationRouter(app.basePath);
    app.router.on(NavigationRouter.CHANGE, this._routeChange);
    app.router.setup(app.basePath);
    app.notification = new Notification();
    app.main = this;
    app.on('back', this._goBack);
  }
  Main.get({
    hasHistory: function() {
      return this._history.length > 1;
    }
  });
  Main.prototype._init = function() {
    return app.body.css('visibility', '');
  };
  Main.prototype._routeChange = function(e, data) {
    this._history.push(data);
    return app["interface"].show();
  };
  Main.prototype._goBack = function() {
    var p;
    if (this._history.length < 2) {
      return;
    }
    p = this._history.pop();
    p = this._history.pop();
    return app.router.goto(p.rawPath);
  };
  Main.prototype._indexComplete = function() {};
  Main.prototype._error = function() {};
  Main.prototype._loadComplete = function() {};
  Main.prototype._renderTemplate = function(e, data) {
    var target;
    console.log('> render', data);
    if (data.target && data.currentTarget) {
      target = data.currentTarget.findParents(data.target);
      if (!target) {
        target = document.body.querySelector(data.target);
      }
    }
    return app.template.render(data.template, data.data || {}, target || app.templateContext);
  };
  return Main;
})();
app.on('windowLoad', function() {
  return new Main();
});
}).call(this);
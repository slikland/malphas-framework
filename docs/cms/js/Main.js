(function() {
var __bind=function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
__hasProp={}.hasOwnProperty,
__indexOf=[].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
__extends=function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) Object.defineProperty(child, key, Object.getOwnPropertyDescriptor(parent, key)); } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
function __addNamespace(scope, obj){for(k in obj){if(!scope[k]) scope[k] = {};__addNamespace(scope[k], obj[k])}};
__addNamespace(this, {"slikland":{"utils":{"keyboard":{}}}});
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
slikland.utils.keyboard.Shortcut = (function() {
  Shortcut.MODIFIERS = ['alt', 'ctrl', 'meta', 'shift'];
  Shortcut.MAP = ['tab', 'enter', 'esc'];
  Shortcut.KEY_MAP = {
    9: 'tab',
    13: 'enter',
    27: 'esc'
  };
  Shortcut.CODE_MAP = {
    189: '-',
    219: '[',
    221: ']'
  };
  Shortcut.MODIFIER_CODES = [16, 18, 17, 91];
  function Shortcut(target) {
    if (target == null) {
      target = null;
    }
    this._keyDown = __bind(this._keyDown, this);
    if (!target) {
      target = window;
    }
    this._target = target;
    this._shortcuts = [];
    this._target.addEventListener('keydown', this._keyDown);
    this._target.addEventListener('keyup', this._keyUp);
  }
  Shortcut.prototype.destroy = function() {
    var _ref, _ref1;
    if ((_ref = this._target) != null) {
      _ref.removeEventListener('keydown', this._keyDown);
    }
    if ((_ref1 = this._target) != null) {
      _ref1.removeEventListener('keyup', this._keyUp);
    }
    this._shortcuts.length = 0;
    delete this._shortcuts;
    return delete this._target;
  };
  Shortcut.prototype._keyDown = function(e) {
    var item, items, k, key, keyCode, mapped, modifiers, shortcut, _i, _j, _len, _len1, _ref, _results;
    keyCode = e.keyCode;
    key = '';
    mapped = [];
    if (this.constructor.KEY_MAP[keyCode]) {
      mapped.push(this.constructor.KEY_MAP[keyCode]);
    } else if (!(__indexOf.call(this.constructor.MODIFIER_CODES, keyCode) >= 0)) {
      if (this.constructor.CODE_MAP[keyCode]) {
        key = this.constructor.CODE_MAP[keyCode].toLowerCase();
      } else {
        key = String.fromCharCode(keyCode).toLowerCase();
      }
    }
    modifiers = [];
    _ref = this.constructor.MODIFIERS;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      k = _ref[_i];
      if (e[k + 'Key']) {
        modifiers.push(k);
      }
    }
    modifiers.sort();
    mapped.sort();
    shortcut = '[' + modifiers.join('][') + ']' + '[' + mapped.join('][') + ']' + key;
    items = this._findShortcut(shortcut);
    _results = [];
    for (_j = 0, _len1 = items.length; _j < _len1; _j++) {
      item = items[_j];
      if (typeof item.callback === "function") {
        item.callback(item);
      }
      if (item.preventDefault) {
        _results.push(e.preventDefault());
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Shortcut.prototype._normalizeShortcut = function(shortcut) {
    var mapped, mod, modRE, modifiers, o;
    shortcut = shortcut.toLowerCase();
    modRE = /\[(.*?)\]/g;
    modifiers = [];
    mapped = [];
    while ((o = modRE.exec(shortcut))) {
      mod = o[1];
      if (mod === 'cmd') {
        mod = 'meta';
      }
      if (__indexOf.call(this.constructor.MODIFIERS, mod) >= 0) {
        modifiers.push(mod);
      }
      if (__indexOf.call(this.constructor.MAP, mod) >= 0) {
        mapped.push(mod);
      }
    }
    shortcut = shortcut.replace(/\[.*?\]/g, '').split('');
    shortcut.sort();
    modifiers.sort();
    mapped.sort();
    return '[' + modifiers.join('][') + ']' + '[' + mapped.join('][') + ']' + shortcut.join('');
  };
  Shortcut.prototype._findShortcut = function(shortcut) {
    var found, i;
    found = [];
    i = this._shortcuts.length;
    while (i-- > 0) {
      if (this._shortcuts[i].normalized === shortcut) {
        found.push(this._shortcuts[i]);
      }
    }
    return found;
  };
  Shortcut.prototype.addShortcut = function(shortcut, callback, preventDefault) {
    var i, normalized;
    if (preventDefault == null) {
      preventDefault = true;
    }
    normalized = this._normalizeShortcut(shortcut);
    i = this._shortcuts.length;
    while (i-- > 0) {
      if (this._shortcuts[i].normalized === normalized && this._shortcuts[i].callback === callback) {
        return;
      }
    }
    return this._shortcuts.push({
      normalized: normalized,
      shortcut: shortcut,
      callback: callback,
      preventDefault: preventDefault
    });
  };
  Shortcut.prototype.removeShortcut = function(shortcut, callback) {
    var i, normalized, _results;
    normalized = this._normalizeShortcut(shortcut);
    i = this._shortcuts.length;
    _results = [];
    while (i-- > 0) {
      if (this._shortcuts[i].normalized === normalized) {
        if (!callback || (callback && this._shortcuts[i].callback === callback)) {
          _results.push(this._shortcuts.splice(i, 1));
        } else {
          _results.push(void 0);
        }
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  return Shortcut;
})();
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
  App.project_version_raw = "SL_PROJECT_VERSION:0.0.0";
  App.project_date_raw = "SL_PROJECT_DATE:0000000000000";
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
var API;
API = (function(_super) {
  __extends(API, _super);
  API.COMPLETE = 'apiComplete';
  API.ERROR = 'apiError';
  API.PROGRESS = 'apiProgress';
  API._interceptors = [];
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
  function API(arg) {
    this._loaded = __bind(this._loaded, this);
    this._parseJSONElement = __bind(this._parseJSONElement, this);
    this._progress = __bind(this._progress, this);
    this.submit = __bind(this.submit, this);
    this._submitForm = __bind(this._submitForm, this);
    this._addEventListeners = __bind(this._addEventListeners, this);
    API.__super__.constructor.apply(this, arguments);
    this.TYPES = ['normal', 'json'];
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
    this._data = data;
    if (this._submitting) {
      return;
    }
    this._submitting = true;
    if (data instanceof HTMLElement && data.tagName.toLowerCase() === 'form') {
      this._form = data;
      data = null;
    } else if ((typeof BaseDOM !== "undefined" && BaseDOM !== null) && data instanceof BaseDOM && data.element.tagName.toLowerCase === 'form') {
      this._form = data;
      data = null;
    }
    url = this._url || '';
    if (this._form) {
      if (this._form.hasAttribute('action')) {
        url = this._form.getAttribute('action');
      }
      if (this._form.hasAttribute('enctype')) {
        this.addHeader('Content-type', this._form.getAttribute('enctype'));
      }
      if (this._form.hasAttribute('method')) {
        this.method = this._form.getAttribute('method');
      }
      if (this._form.hasAttribute('type') && this._form.getAttribute('type') === 'json') {
        this.addHeader('Content-type', 'application/json;charset=UTF-8');
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
        this.addHeader('Content-type', 'application/json;charset=UTF-8');
        data = JSON.stringify(data);
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
    this._request.send(data);
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
    return this._triggerProgress(p);
  };
  API.prototype._triggerProgress = function(progress) {
    return this.trigger(API.PROGRESS, {
      loaded: progress,
      total: 1,
      progress: progress
    });
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
    inputs = element.querySelectorAll('input,textarea');
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
    var data, response;
    if (e.currentTarget.readyState === 4) {
      this._submitting = false;
      if (e.currentTarget.status === 200) {
        this._triggerProgress(1);
        response = e.currentTarget.responseText || e.currentTarget.response || '';
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
    this.trigger(API.COMPLETE, data);
    return this.constructor._checkInterceptor(this._requestURL, data);
  };
  API.prototype._loadError = function(data) {
    if (data == null) {
      data = null;
    }
    this.trigger(API.ERROR, data);
    return this.constructor._checkInterceptor(this._requestURL, data);
  };
  return API;
})(EventDispatcher);
var LiveEditor;
LiveEditor = (function(_super) {
  __extends(LiveEditor, _super);
  function LiveEditor(target) {
    this._shortcutCommand = __bind(this._shortcutCommand, this);
    this._removeEventListeners = __bind(this._removeEventListeners, this);
    this._addEventListeners = __bind(this._addEventListeners, this);
    this._discardChanges = __bind(this._discardChanges, this);
    this._commitChanges = __bind(this._commitChanges, this);
    this._stopEdit = __bind(this._stopEdit, this);
    this._startEdit = __bind(this._startEdit, this);
    this._target = target;
    this._target.addEventListener('dblclick', this._startEdit);
    this._shortcut = new slikland.utils.keyboard.Shortcut(this._target);
    this._shortcutCommands = {};
  }
  LiveEditor.prototype._startEdit = function() {
    this._initialContent = this._target.innerHTML;
    this._addEventListeners();
    this._target.contentEditable = true;
    return this._target.focus();
  };
  LiveEditor.prototype._stopEdit = function() {
    this._removeEventListeners();
    return this._target.contentEditable = false;
  };
  LiveEditor.prototype._commitChanges = function() {
    var _base;
    this._stopEdit();
    if (typeof (_base = this._target).normalize === "function") {
      _base.normalize();
    }
    this._initialContent = null;
    return this.trigger('change');
  };
  LiveEditor.prototype._discardChanges = function() {
    this._stopEdit();
    return this._target.innerHTML = this._initialContent;
  };
  LiveEditor.prototype._addEventListeners = function() {
    this._target.addEventListener('blur', this._commitChanges);
    this._shortcut.addShortcut('[cmd][enter]', this._commitChanges);
    return this._shortcut.addShortcut('[esc]', this._discardChanges);
  };
  LiveEditor.prototype._removeEventListeners = function() {
    this._target.removeEventListener('blur', this._commitChanges);
    this._shortcut.removeShortcut('[cmd][enter]', this._commitChanges);
    return this._shortcut.removeShortcut('[esc]', this._discardChanges);
  };
  LiveEditor.prototype._shortcutCommand = function(e) {
    if (this._shortcutCommands[e.shortcut]) {
      return document.execCommand(this._shortcutCommands[e.shortcut].command, true, this._shortcutCommands[e.shortcut].value);
    }
  };
  LiveEditor.prototype.addShortcutCommand = function(shortcut, command, value) {
    if (value == null) {
      value = null;
    }
    this._shortcutCommands[shortcut] = {
      command: command,
      value: value
    };
    return this._shortcut.addShortcut(shortcut, this._shortcutCommand);
  };
  return LiveEditor;
})(EventDispatcher);
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
var Nav;
Nav = (function(_super) {
  __extends(Nav, _super);
  function Nav() {
    this._linkClick = __bind(this._linkClick, this);
    this._parseNodes = __bind(this._parseNodes, this);
    this._change = __bind(this._change, this);
    this._navLoaded = __bind(this._navLoaded, this);
    this._target = document.querySelector('nav');
    API.call('data/nav.html', null, this._navLoaded);
  }
  Nav.prototype._navLoaded = function(e, data) {
    this._target.innerHTML = data;
    this._parseLinks();
    this._content = document.querySelector('content');
    if (!this._content) {
      this._content = document.createElement('content');
      this._target.appendChild(this._content);
    }
    this._navEditor = new LiveEditor(this._content);
    this._navEditor.on('change', this._change);
    this._navEditor.addShortcutCommand('[cmd][', 'outdent');
    this._navEditor.addShortcutCommand('[cmd]]', 'indent');
    return this.trigger('ready');
  };
  Nav.prototype._change = function() {
    var data, item, k, obj, pages, _ref;
    this._links = [];
    this._parseNodes(this._content);
    pages = [];
    _ref = this._links;
    for (k in _ref) {
      item = _ref[k];
      obj = {};
      if (item.getAttribute('href')) {
        obj['prev'] = item.getAttribute('href');
      }
      obj['name'] = (Number(k) + 1).toString().padLeft(4, '0') + '.' + item.innerText.replace(/[^a-z0-9]/ig, '-');
      item.href = obj['name'];
      pages.push(obj);
    }
    data = {};
    data['pages'] = pages;
    data['raw'] = this._target.innerHTML;
    this._parseLinks();
    return API.call('php/editNav.php', data, null, null, 'json');
  };
  Nav.prototype._parseNodes = function(target) {
    var a, child, _i, _len, _ref, _ref1, _results;
    _ref = target.childNodes;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      if (((_ref1 = child.tagName) != null ? _ref1.toLowerCase() : void 0) === 'a') {
        if (child.innerText.trim().length === 0) {
          _results.push(target.removeChild(child));
        } else {
          _results.push(this._links.push(child));
        }
      } else if (child.nodeType === 3) {
        if (child.data.trim().length === 0) {
          _results.push(target.removeChild(child));
        } else {
          a = document.createElement('a');
          a.innerText = child.data;
          this._links.push(a);
          _results.push(target.replaceChild(a, child));
        }
      } else {
        _results.push(this._parseNodes(child));
      }
    }
    return _results;
  };
  Nav.prototype._parseLinks = function() {
    var i, item, _results;
    this._links = ArrayUtils.toArray(this._target.querySelectorAll('a'));
    i = this._links.length;
    _results = [];
    while (i-- > 0) {
      item = this._links[i];
      _results.push(item.addEventListener('click', this._linkClick));
    }
    return _results;
  };
  Nav.prototype._linkClick = function(e) {
    var target;
    target = e.currentTarget;
    e.preventDefault();
    e.stopImmediatePropagation();
    return app.router.goto(target.getAttribute('href'));
  };
  Nav.prototype.isValid = function(path) {
    var href, i, item;
    i = this._links.length;
    while (i-- > 0) {
      item = this._links[i];
      href = item.getAttribute('href');
      if (href === path) {
        return true;
      }
    }
    return false;
  };
  Nav.prototype.select = function(path) {
    var cn, href, i, item, _results;
    i = this._links.length;
    _results = [];
    while (i-- > 0) {
      item = this._links[i];
      href = item.getAttribute('href');
      cn = '';
      if (href === path) {
        cn = 'selected';
      }
      _results.push(item.className = cn);
    }
    return _results;
  };
  return Nav;
})(EventDispatcher);
var Content;
Content = (function() {
  function Content() {
    this._change = __bind(this._change, this);
    this._contentLoaded = __bind(this._contentLoaded, this);
    this._target = document.querySelector('main');
    this._api = new API();
    this._api.on(API.COMPLETE, this._contentLoaded);
    this._api.reuse = true;
    this._contentEditor = new LiveEditor(this._target);
    this._contentEditor.on('change', this._change);
    this._contentEditor.addShortcutCommand('[cmd][', 'outdent');
    this._contentEditor.addShortcutCommand('[cmd]]', 'indent');
    this._contentEditor.addShortcutCommand('[cmd][alt]1', 'formatBlock', 'h1');
    this._contentEditor.addShortcutCommand('[cmd][alt]2', 'formatBlock', 'h2');
    this._contentEditor.addShortcutCommand('[cmd][alt]3', 'formatBlock', 'h3');
    this._contentEditor.addShortcutCommand('[cmd][alt]4', 'formatBlock', 'h4');
    this._contentEditor.addShortcutCommand('[cmd][alt]5', 'formatBlock', 'h5');
    this._contentEditor.addShortcutCommand('[cmd][alt]6', 'formatBlock', 'h6');
    this._contentEditor.addShortcutCommand('[cmd][alt]-', 'insertHorizontalRule');
    this._contentEditor.addShortcutCommand('[cmd][alt]e', 'formatBlock', 'pre');
  }
  Content.prototype._contentLoaded = function(e, data) {
    return this._target.innerHTML = data;
  };
  Content.prototype._change = function() {
    var data;
    data = {};
    data['content'] = this._target.innerHTML;
    data['page'] = this._currentPage;
    return API.call('php/editPage.php', data, null, null, 'json');
  };
  Content.prototype.show = function(path) {
    this._api.abort();
    this._currentPage = path;
    return this._api.load('data/pages/' + path + '.html');
  };
  return Content;
})();
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
    var params, path, pathParts;
    pathParts = /^(?:#?!?\/*)([^?]*)\??(.*?)$/.exec(p_rawPath);
    path = pathParts[1];
    params = this._parseParams(pathParts[2]);
    return {
      rawPath: p_rawPath,
      path: path,
      params: params
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
  NavigationRouter.prototype.removeParam = function(name) {
    var params;
    params = this._getParams();
    params[name] = null;
    delete params[name];
    return this._setParams(params);
  };
  return NavigationRouter;
})(EventDispatcher);
var Main;
Main = (function() {
  function Main() {
    this._routeChange = __bind(this._routeChange, this);
    this._navReady = __bind(this._navReady, this);
    this._emptyCallback = __bind(this._emptyCallback, this);
    this._nav = new Nav();
    this._content = new Content();
    this._nav.on('ready', this._navReady);
    this._shortcutPrevent = new slikland.utils.keyboard.Shortcut(window);
    this._shortcutPrevent.addShortcut('[cmd]s', this._emptyCallback);
  }
  Main.prototype._emptyCallback = function() {};
  Main.prototype._navReady = function() {
    app.router = new NavigationRouter(app.basePath);
    app.router.on(NavigationRouter.CHANGE, this._routeChange);
    return app.router.setup(app.basePath);
  };
  Main.prototype._routeChange = function(e, data) {
    var path;
    path = data.path;
    path = path.trim('/');
    if (!this._nav.isValid(path)) {
      if (path.length > 0) {
        app.router.goto('/');
        return;
      }
    }
    if (path.length === 0) {
      path = 'index';
    }
    this._nav.select(path);
    return this._content.show(path);
  };
  return Main;
})();
app.on('windowLoad', function() {
  return new Main();
});
}).call(this);
(function() {
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

Function.prototype.get = function(p_prop) {
  var getter, name, __scope;
  __scope = __scopeIE8 ? __scopeIE8 : this.prototype;
  for (name in p_prop) {
    getter = p_prop[name];
    Object.defineProperty(__scope, name, {
      get: getter,
      configurable: true
    });
  }
  return null;
};

Function.prototype.set = function(p_prop) {
  var name, setter, __scope;
  __scope = __scopeIE8 ? __scopeIE8 : this.prototype;
  for (name in p_prop) {
    setter = p_prop[name];
    Object.defineProperty(__scope, name, {
      set: setter,
      configurable: true
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

if (!("trim" in String.prototype)) {
  String.prototype.trim = function(char) {
    if (char == null) {
      char = null;
    }
    return this.ltrim(char).rtrim(char);
  };
}

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

var EventDispatcher,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

EventDispatcher = (function() {
  function EventDispatcher() {
    this.trigger = __bind(this.trigger, this);
  }

  EventDispatcher.prototype._events = null;

  EventDispatcher.prototype.on = function(p_event, p_handler, p_useCapture) {
    if (p_useCapture == null) {
      p_useCapture = false;
    }
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

  EventDispatcher.prototype.off = function(p_event, p_handler, p_useCapture) {
    var events, i;
    if (p_event == null) {
      p_event = null;
    }
    if (p_handler == null) {
      p_handler = null;
    }
    if (p_useCapture == null) {
      p_useCapture = false;
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

  EventDispatcher.prototype.trigger = function(evt, data, target) {
    var e, events, i, k, v, _i, _len, _results;
    if (data == null) {
      data = null;
    }
    if (target == null) {
      target = null;
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
      currentTarget: this
    };
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

  return EventDispatcher;

})();

var App, app, windowLoaded,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

App = (function(_super) {
  __extends(App, _super);

  App.WINDOW_LOAD = 'app_windowLoad';

  App.WINDOW_ACTIVE = 'app_windowActive';

  App.WINDOW_INACTIVE = 'app_windowInactive';

  function App() {
    App.__super__.constructor.apply(this, arguments);
  }

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
      return this._windowVisibilityChange({
        type: document[this._hidden] ? 'blur' : 'focus'
      });
    }
  };

  App.prototype._windowVisibilityChange = function(evt) {
    var evtMap, h, hidden, v, _ref;
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
    if (hidden) {
      return this.dispatchEvent(App.WINDOW_INACTIVE);
    } else {
      return this.dispatchEvent(App.WINDOW_ACTIVE);
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
    return app.trigger(App.WINDOW_LOAD);
  };
})(this);

if (window.addEventListener) {
  window.addEventListener('load', windowLoaded);
} else if (window.attachEvent) {
  window.attachEvent('onload', windowLoaded);
} else {
  window.onload = windowLoaded;
}

var NavigationRouter,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

NavigationRouter = (function(_super) {
  __extends(NavigationRouter, _super);

  NavigationRouter.CHANGE = 'route_path_change';

  NavigationRouter.ROUTE = 'route_match';

  function NavigationRouter() {
    this._onPathChange = __bind(this._onPathChange, this);
    this._routes = [];
    this._numRoutes = 0;
    this._trigger = true;
  }

  NavigationRouter.prototype.init = function(p_rootPath, p_forceHashBang) {
    var base, path, _ref;
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
      } catch (_error) {}
    }
    this._rootPath = p_rootPath.replace(/^(.*?)\/*$/, '$1/');
    this.defaultTitle = document.title;
    if (p_forceHashBang) {
      this._usePushState = false;
    } else {
      this._usePushState = (typeof window !== "undefined" && window !== null ? (_ref = window.history) != null ? _ref.pushState : void 0 : void 0) != null;
    }
    this._rawPath = '';
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
    return this;
  };

  NavigationRouter.prototype._getPath = function() {
    var hasSlash, rawPath;
    rawPath = window.location.href;
    hasSlash = rawPath.substr(rawPath.length - 1, rawPath.length) === '/';
    if (hasSlash) {
      rawPath = rawPath.substr(0, rawPath.length - 1);
    }
    if (rawPath.indexOf(this._rootPath) === 0) {
      rawPath = rawPath.substr(this._rootPath.length);
    }
    rawPath = rawPath.replace(/^(?:#?!?\/*)([^?]*\??.*?)$/, '$1');
    return rawPath;
  };

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

  NavigationRouter.prototype._onPathChange = function() {
    this._currentPath = this._getPath();
    if (this._trigger) {
      this._triggerPath(this._currentPath);
    }
    this._trigger = true;
    if (this._replaceData) {
      this.goto(this._replaceData[0], this._replaceData[1], false);
      return this._replaceData = null;
    } else {
      return this.trigger(NavigationRouter.CHANGE, this._parsePath(this._currentPath));
    }
  };

  NavigationRouter.prototype._triggerPath = function(p_path) {
    var i, pathData, route, routeData, routes, _ref, _results;
    pathData = this._parsePath(p_path);
    _ref = this._checkRoutes(pathData.path), routes = _ref[0], routeData = _ref[1];
    if (routes) {
      i = routes.length;
      _results = [];
      while (i-- > 0) {
        route = routes[i];
        if (typeof route.callback === "function") {
          route.callback(route.route, routeData, p_path, pathData, route.data);
        }
        _results.push(this.trigger(NavigationRouter.ROUTE, {
          route: route.route,
          routeData: routeData,
          path: p_path,
          pathData: pathData,
          data: route.data
        }));
      }
      return _results;
    }
  };

  NavigationRouter.prototype.setTitle = function(p_title) {
    return document.title = p_title;
  };

  NavigationRouter.prototype.getCurrentPath = function() {
    return this._currentPath;
  };

  NavigationRouter.prototype.getParsedPath = function() {
    return this._parsePath(this._currentPath);
  };

  NavigationRouter.prototype.goto = function(p_path, p_title, p_trigger) {
    if (p_title == null) {
      p_title = null;
    }
    if (p_trigger == null) {
      p_trigger = true;
    }
    p_path = p_path.replace(/^(?:#?!?\/*)([^?]*\??.*?)$/, '$1');
    if (p_title) {
      this.setTitle(p_title);
    }
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
      return this._trigger = true;
    } else {
      return window.location.hash = '!' + '/' + p_path;
    }
  };

  NavigationRouter.prototype.replace = function(p_path, p_title, p_trigger) {
    if (p_title == null) {
      p_title = null;
    }
    if (p_trigger == null) {
      p_trigger = false;
    }
    p_path = p_path.replace(/^(?:#?!?\/*)([^?]*\??.*?)$/, '$1');
    if (p_title) {
      this.setTitle(p_title);
    }
    if (p_path !== this._currentPath) {
      this._currentPath = p_path;
      if (this._usePushState) {
        history.replaceState({}, p_path, this._rootPath + p_path);
      } else {
        this._trigger = false;
        history.back();
        this._replaceData = [p_path, p_title];
      }
    }
    if (p_trigger) {
      return this.triggerPath(p_path);
    }
  };

  NavigationRouter.prototype.triggerPath = function(p_path) {
    return this._triggerPath(p_path);
  };

  NavigationRouter.prototype.triggerCurrentPath = function() {
    return this._triggerPath(this._getPath());
  };

  NavigationRouter.prototype.addRoute = function(p_route, p_callback, p_data) {
    var e, i, labels, o, p, r, routeRE;
    if (p_data == null) {
      p_data = null;
    }
    if (typeof p_route !== 'string') {
      i = p_route.length;
      while (i-- > 0) {
        this.addRoute(p_route[i], p_callback, p_data);
      }
    } else {

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
      e = _error;
      return;
    }
    this._routes[this._numRoutes++] = {
      data: p_data,
      route: p_route,
      routeRE: routeRE,
      labels: labels,
      numLabels: labels.length,
      numSlashes: p_route.split('/').length,
      callback: p_callback
    };
    return this._routes.sort(this._sortRoutes);
  };

  NavigationRouter.prototype.removeRoute = function(p_route, p_callback) {
    var i, route;
    i = this._numRoutes;
    while (i-- > 0) {
      route = this._routes[i];
      if (route.route === p_route) {
        if (p_callback) {
          if (p_callback === route.callback) {
            this._routes.splice(i, 1);
          }
        } else {
          this._routes.splice(i, 1);
        }
      }
    }
    return this._numRoutes = this._routes.length;
  };

  NavigationRouter.prototype.removeAllRoutes = function() {
    this._routes.length = 0;
    return this._numRoutes = this._routes.length;
  };

  NavigationRouter.prototype._checkRoutes = function(p_path) {
    var data, foundRoute, i, j, label, o, re, route, routes, routesIndex, v, _i, _len, _ref;
    i = this._numRoutes;
    p_path = '/' + p_path;
    foundRoute = null;
    routes = [];
    routesIndex = 0;
    data = null;
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

  return NavigationRouter;

})(EventDispatcher);

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

  ObjectUtils.clone = function(p_target) {
    return JSON.parse(JSON.stringify(p_target));
  };

  ObjectUtils.findChild = function(obj, query) {
    if (query == null) {
      query = null;
    }
    if (!query) {
      return obj;
    }
    query = query.split('.');
    if (query.length === 0) {
      return obj;
    }
    obj = obj[query[0]];
    if (query.length > 0) {
      obj = this.findChild(obj, query.splice(1).join('.'));
    }
    return obj;
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
    result = [];
    i = 0;
    j = 0;
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
    var newArray;
    newArray = this.fromMiddleToEnd(p_array);
    return newArray.reverse();
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

  return ArrayUtils;

})();

var StringUtils,
  __slice = [].slice;

StringUtils = (function() {
  function StringUtils() {}

  StringUtils.hasString = function(p_string, p_search) {
    if (p_string.split(p_search).length !== 1) {
      return true;
    } else {
      return false;
    }
  };

  StringUtils.replace = function(p_string, p_from, p_to) {
    return p_string.split(p_from).join(p_to);
  };

  StringUtils.reverse = function(p_string) {
    if (!p_string) {
      return "";
    }
    return p_string.split("").reverse().join("");
  };

  StringUtils.toCamelCase = function(p_string) {
    var re;
    re = p_string.replace(/([\+\-_ ][a-z])/g, function($1) {
      return $1.toUpperCase().replace(/[\+\-_ ]/, "");
    });
    return re.charAt(0).toUpperCase() + re.slice(1);
  };

  StringUtils.removeWhiteSpace = function(p_string) {
    if (!p_string) {
      return "";
    }
    return this.trim(p_string).replace(/\s+/g, "");
  };

  StringUtils.removeHTMLTag = function(p_string) {
    return p_string.replace(/<.*?>/g, "");
  };

  StringUtils.removeSpecialChars = function(p_string) {
    return p_string.replace(/[^a-zA-Z 0-9]+/g, '');
  };

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

  StringUtils.convertToCEP = function(p_string) {
    p_string = this.removeSpecialChars(p_string);
    if (p_string.length > 5) {
      p_string = p_string.replace(/(\d{0,5})(\d{0,3})/, '$1' + "-" + "$2");
    } else {
      p_string = p_string.replace(/(\d{0,5})(\d{0,3})/, '$1');
    }
    return p_string;
  };

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

  StringUtils.isEmpty = function(p_string) {
    if (!p_string || p_string === "") {
      return true;
    }
    return !p_string.length;
  };

  StringUtils.toCapitalizeCase = function(p_string) {
    var str;
    str = this.trimLeft(p_string);
    return str.replace(/(^\w)/, this._upperCase);
  };

  StringUtils.toTimeFormat = function(p_miliseconds, p_decimal) {
    var minutes, seconds;
    if (p_decimal == null) {
      p_decimal = true;
    }
    minutes = Math.floor(p_miliseconds / 60);
    seconds = Math.floor(p_miliseconds % 60);
    return String(p_decimal ? this.addDecimalZero(minutes) + ":" + this.addDecimalZero(seconds) : minutes + ":" + seconds);
  };

  StringUtils.addDecimalZero = function(p_value) {
    if (p_value < 10) {
      return "0" + p_value;
    }
    return String(p_value);
  };

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

  StringUtils.toBoolean = function(p_string) {
    var f, t;
    t = ['yes', 'true', ' 1', 1, true];
    f = ['no', 'false', '0', 0, false];
    if (ArrayUtils.hasItem(p_string, t)) {
      return true;
    } else if (ArrayUtils.hasItem(p_string, f)) {
      return false;
    } else {
      throw new Error("StringUtils::toBoolean '" + p_string + "' is a wrong format");
    }
  };

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

  StringUtils.trim = function(p_str, p_char) {
    if (p_str === null) {
      return "";
    }
    return this.trimRight(this.trimLeft(p_str, p_char), p_char);
  };

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

  StringUtils._upperCase = function() {
    var args, p_char;
    p_char = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return p_char.toUpperCase();
  };

  StringUtils.substitionDict = null;

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

 this.createjs=this.createjs||{},function(){"use strict";var a=createjs.PreloadJS=createjs.PreloadJS||{};a.version="0.6.0",a.buildDate="Thu, 11 Dec 2014 23:32:09 GMT"}(),this.createjs=this.createjs||{},createjs.extend=function(a,b){"use strict";function c(){this.constructor=a}return c.prototype=b.prototype,a.prototype=new c},this.createjs=this.createjs||{},createjs.promote=function(a,b){"use strict";var c=a.prototype,d=Object.getPrototypeOf&&Object.getPrototypeOf(c)||c.__proto__;if(d){c[(b+="_")+"constructor"]=d.constructor;for(var e in d)c.hasOwnProperty(e)&&"function"==typeof d[e]&&(c[b+e]=d[e])}return a},this.createjs=this.createjs||{},createjs.indexOf=function(a,b){"use strict";for(var c=0,d=a.length;d>c;c++)if(b===a[c])return c;return-1},this.createjs=this.createjs||{},function(){"use strict";createjs.proxy=function(a,b){var c=Array.prototype.slice.call(arguments,2);return function(){return a.apply(b,Array.prototype.slice.call(arguments,0).concat(c))}}}(),this.createjs=this.createjs||{},function(){"use strict";function a(){throw"BrowserDetect cannot be instantiated"}var b=a.agent=window.navigator.userAgent;a.isWindowPhone=b.indexOf("IEMobile")>-1||b.indexOf("Windows Phone")>-1,a.isFirefox=b.indexOf("Firefox")>-1,a.isOpera=null!=window.opera,a.isChrome=b.indexOf("Chrome")>-1,a.isIOS=(b.indexOf("iPod")>-1||b.indexOf("iPhone")>-1||b.indexOf("iPad")>-1)&&!a.isWindowPhone,a.isAndroid=b.indexOf("Android")>-1&&!a.isWindowPhone,a.isBlackberry=b.indexOf("Blackberry")>-1,createjs.BrowserDetect=a}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b,c){this.type=a,this.target=null,this.currentTarget=null,this.eventPhase=0,this.bubbles=!!b,this.cancelable=!!c,this.timeStamp=(new Date).getTime(),this.defaultPrevented=!1,this.propagationStopped=!1,this.immediatePropagationStopped=!1,this.removed=!1}var b=a.prototype;b.preventDefault=function(){this.defaultPrevented=this.cancelable&&!0},b.stopPropagation=function(){this.propagationStopped=!0},b.stopImmediatePropagation=function(){this.immediatePropagationStopped=this.propagationStopped=!0},b.remove=function(){this.removed=!0},b.clone=function(){return new a(this.type,this.bubbles,this.cancelable)},b.set=function(a){for(var b in a)this[b]=a[b];return this},b.toString=function(){return"[Event (type="+this.type+")]"},createjs.Event=a}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b,c){this.Event_constructor("error"),this.title=a,this.message=b,this.data=c}var b=createjs.extend(a,createjs.Event);b.clone=function(){return new createjs.ErrorEvent(this.title,this.message,this.data)},createjs.ErrorEvent=createjs.promote(a,"Event")}(),this.createjs=this.createjs||{},function(){"use strict";function a(){this._listeners=null,this._captureListeners=null}var b=a.prototype;a.initialize=function(a){a.addEventListener=b.addEventListener,a.on=b.on,a.removeEventListener=a.off=b.removeEventListener,a.removeAllEventListeners=b.removeAllEventListeners,a.hasEventListener=b.hasEventListener,a.dispatchEvent=b.dispatchEvent,a._dispatchEvent=b._dispatchEvent,a.willTrigger=b.willTrigger},b.addEventListener=function(a,b,c){var d;d=c?this._captureListeners=this._captureListeners||{}:this._listeners=this._listeners||{};var e=d[a];return e&&this.removeEventListener(a,b,c),e=d[a],e?e.push(b):d[a]=[b],b},b.on=function(a,b,c,d,e,f){return b.handleEvent&&(c=c||b,b=b.handleEvent),c=c||this,this.addEventListener(a,function(a){b.call(c,a,e),d&&a.remove()},f)},b.removeEventListener=function(a,b,c){var d=c?this._captureListeners:this._listeners;if(d){var e=d[a];if(e)for(var f=0,g=e.length;g>f;f++)if(e[f]==b){1==g?delete d[a]:e.splice(f,1);break}}},b.off=b.removeEventListener,b.removeAllEventListeners=function(a){a?(this._listeners&&delete this._listeners[a],this._captureListeners&&delete this._captureListeners[a]):this._listeners=this._captureListeners=null},b.dispatchEvent=function(a){if("string"==typeof a){var b=this._listeners;if(!b||!b[a])return!1;a=new createjs.Event(a)}else a.target&&a.clone&&(a=a.clone());try{a.target=this}catch(c){}if(a.bubbles&&this.parent){for(var d=this,e=[d];d.parent;)e.push(d=d.parent);var f,g=e.length;for(f=g-1;f>=0&&!a.propagationStopped;f--)e[f]._dispatchEvent(a,1+(0==f));for(f=1;g>f&&!a.propagationStopped;f++)e[f]._dispatchEvent(a,3)}else this._dispatchEvent(a,2);return a.defaultPrevented},b.hasEventListener=function(a){var b=this._listeners,c=this._captureListeners;return!!(b&&b[a]||c&&c[a])},b.willTrigger=function(a){for(var b=this;b;){if(b.hasEventListener(a))return!0;b=b.parent}return!1},b.toString=function(){return"[EventDispatcher]"},b._dispatchEvent=function(a,b){var c,d=1==b?this._captureListeners:this._listeners;if(a&&d){var e=d[a.type];if(!e||!(c=e.length))return;try{a.currentTarget=this}catch(f){}try{a.eventPhase=b}catch(f){}a.removed=!1,e=e.slice();for(var g=0;c>g&&!a.immediatePropagationStopped;g++){var h=e[g];h.handleEvent?h.handleEvent(a):h(a),a.removed&&(this.off(a.type,h,1==b),a.removed=!1)}}},createjs.EventDispatcher=a}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b){this.Event_constructor("progress"),this.loaded=a,this.total=null==b?1:b,this.progress=0==b?0:this.loaded/this.total}var b=createjs.extend(a,createjs.Event);b.clone=function(){return new createjs.ProgressEvent(this.loaded,this.total)},createjs.ProgressEvent=createjs.promote(a,"Event")}(window),function(){function a(b,d){function f(a){if(f[a]!==q)return f[a];var b;if("bug-string-char-index"==a)b="a"!="a"[0];else if("json"==a)b=f("json-stringify")&&f("json-parse");else{var c,e='{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';if("json-stringify"==a){var i=d.stringify,k="function"==typeof i&&t;if(k){(c=function(){return 1}).toJSON=c;try{k="0"===i(0)&&"0"===i(new g)&&'""'==i(new h)&&i(s)===q&&i(q)===q&&i()===q&&"1"===i(c)&&"[1]"==i([c])&&"[null]"==i([q])&&"null"==i(null)&&"[null,null,null]"==i([q,s,null])&&i({a:[c,!0,!1,null,"\x00\b\n\f\r	"]})==e&&"1"===i(null,c)&&"[\n 1,\n 2\n]"==i([1,2],null,1)&&'"-271821-04-20T00:00:00.000Z"'==i(new j(-864e13))&&'"+275760-09-13T00:00:00.000Z"'==i(new j(864e13))&&'"-000001-01-01T00:00:00.000Z"'==i(new j(-621987552e5))&&'"1969-12-31T23:59:59.999Z"'==i(new j(-1))}catch(l){k=!1}}b=k}if("json-parse"==a){var m=d.parse;if("function"==typeof m)try{if(0===m("0")&&!m(!1)){c=m(e);var n=5==c.a.length&&1===c.a[0];if(n){try{n=!m('"	"')}catch(l){}if(n)try{n=1!==m("01")}catch(l){}if(n)try{n=1!==m("1.")}catch(l){}}}}catch(l){n=!1}b=n}}return f[a]=!!b}b||(b=e.Object()),d||(d=e.Object());var g=b.Number||e.Number,h=b.String||e.String,i=b.Object||e.Object,j=b.Date||e.Date,k=b.SyntaxError||e.SyntaxError,l=b.TypeError||e.TypeError,m=b.Math||e.Math,n=b.JSON||e.JSON;"object"==typeof n&&n&&(d.stringify=n.stringify,d.parse=n.parse);var o,p,q,r=i.prototype,s=r.toString,t=new j(-0xc782b5b800cec);try{t=-109252==t.getUTCFullYear()&&0===t.getUTCMonth()&&1===t.getUTCDate()&&10==t.getUTCHours()&&37==t.getUTCMinutes()&&6==t.getUTCSeconds()&&708==t.getUTCMilliseconds()}catch(u){}if(!f("json")){var v="[object Function]",w="[object Date]",x="[object Number]",y="[object String]",z="[object Array]",A="[object Boolean]",B=f("bug-string-char-index");if(!t)var C=m.floor,D=[0,31,59,90,120,151,181,212,243,273,304,334],E=function(a,b){return D[b]+365*(a-1970)+C((a-1969+(b=+(b>1)))/4)-C((a-1901+b)/100)+C((a-1601+b)/400)};if((o=r.hasOwnProperty)||(o=function(a){var b,c={};return(c.__proto__=null,c.__proto__={toString:1},c).toString!=s?o=function(a){var b=this.__proto__,c=a in(this.__proto__=null,this);return this.__proto__=b,c}:(b=c.constructor,o=function(a){var c=(this.constructor||b).prototype;return a in this&&!(a in c&&this[a]===c[a])}),c=null,o.call(this,a)}),p=function(a,b){var d,e,f,g=0;(d=function(){this.valueOf=0}).prototype.valueOf=0,e=new d;for(f in e)o.call(e,f)&&g++;return d=e=null,g?p=2==g?function(a,b){var c,d={},e=s.call(a)==v;for(c in a)e&&"prototype"==c||o.call(d,c)||!(d[c]=1)||!o.call(a,c)||b(c)}:function(a,b){var c,d,e=s.call(a)==v;for(c in a)e&&"prototype"==c||!o.call(a,c)||(d="constructor"===c)||b(c);(d||o.call(a,c="constructor"))&&b(c)}:(e=["valueOf","toString","toLocaleString","propertyIsEnumerable","isPrototypeOf","hasOwnProperty","constructor"],p=function(a,b){var d,f,g=s.call(a)==v,h=!g&&"function"!=typeof a.constructor&&c[typeof a.hasOwnProperty]&&a.hasOwnProperty||o;for(d in a)g&&"prototype"==d||!h.call(a,d)||b(d);for(f=e.length;d=e[--f];h.call(a,d)&&b(d));}),p(a,b)},!f("json-stringify")){var F={92:"\\\\",34:'\\"',8:"\\b",12:"\\f",10:"\\n",13:"\\r",9:"\\t"},G="000000",H=function(a,b){return(G+(b||0)).slice(-a)},I="\\u00",J=function(a){for(var b='"',c=0,d=a.length,e=!B||d>10,f=e&&(B?a.split(""):a);d>c;c++){var g=a.charCodeAt(c);switch(g){case 8:case 9:case 10:case 12:case 13:case 34:case 92:b+=F[g];break;default:if(32>g){b+=I+H(2,g.toString(16));break}b+=e?f[c]:a.charAt(c)}}return b+'"'},K=function(a,b,c,d,e,f,g){var h,i,j,k,m,n,r,t,u,v,B,D,F,G,I,L;try{h=b[a]}catch(M){}if("object"==typeof h&&h)if(i=s.call(h),i!=w||o.call(h,"toJSON"))"function"==typeof h.toJSON&&(i!=x&&i!=y&&i!=z||o.call(h,"toJSON"))&&(h=h.toJSON(a));else if(h>-1/0&&1/0>h){if(E){for(m=C(h/864e5),j=C(m/365.2425)+1970-1;E(j+1,0)<=m;j++);for(k=C((m-E(j,0))/30.42);E(j,k+1)<=m;k++);m=1+m-E(j,k),n=(h%864e5+864e5)%864e5,r=C(n/36e5)%24,t=C(n/6e4)%60,u=C(n/1e3)%60,v=n%1e3}else j=h.getUTCFullYear(),k=h.getUTCMonth(),m=h.getUTCDate(),r=h.getUTCHours(),t=h.getUTCMinutes(),u=h.getUTCSeconds(),v=h.getUTCMilliseconds();h=(0>=j||j>=1e4?(0>j?"-":"+")+H(6,0>j?-j:j):H(4,j))+"-"+H(2,k+1)+"-"+H(2,m)+"T"+H(2,r)+":"+H(2,t)+":"+H(2,u)+"."+H(3,v)+"Z"}else h=null;if(c&&(h=c.call(b,a,h)),null===h)return"null";if(i=s.call(h),i==A)return""+h;if(i==x)return h>-1/0&&1/0>h?""+h:"null";if(i==y)return J(""+h);if("object"==typeof h){for(G=g.length;G--;)if(g[G]===h)throw l();if(g.push(h),B=[],I=f,f+=e,i==z){for(F=0,G=h.length;G>F;F++)D=K(F,h,c,d,e,f,g),B.push(D===q?"null":D);L=B.length?e?"[\n"+f+B.join(",\n"+f)+"\n"+I+"]":"["+B.join(",")+"]":"[]"}else p(d||h,function(a){var b=K(a,h,c,d,e,f,g);b!==q&&B.push(J(a)+":"+(e?" ":"")+b)}),L=B.length?e?"{\n"+f+B.join(",\n"+f)+"\n"+I+"}":"{"+B.join(",")+"}":"{}";return g.pop(),L}};d.stringify=function(a,b,d){var e,f,g,h;if(c[typeof b]&&b)if((h=s.call(b))==v)f=b;else if(h==z){g={};for(var i,j=0,k=b.length;k>j;i=b[j++],h=s.call(i),(h==y||h==x)&&(g[i]=1));}if(d)if((h=s.call(d))==x){if((d-=d%1)>0)for(e="",d>10&&(d=10);e.length<d;e+=" ");}else h==y&&(e=d.length<=10?d:d.slice(0,10));return K("",(i={},i[""]=a,i),f,g,e,"",[])}}if(!f("json-parse")){var L,M,N=h.fromCharCode,O={92:"\\",34:'"',47:"/",98:"\b",116:"	",110:"\n",102:"\f",114:"\r"},P=function(){throw L=M=null,k()},Q=function(){for(var a,b,c,d,e,f=M,g=f.length;g>L;)switch(e=f.charCodeAt(L)){case 9:case 10:case 13:case 32:L++;break;case 123:case 125:case 91:case 93:case 58:case 44:return a=B?f.charAt(L):f[L],L++,a;case 34:for(a="@",L++;g>L;)if(e=f.charCodeAt(L),32>e)P();else if(92==e)switch(e=f.charCodeAt(++L)){case 92:case 34:case 47:case 98:case 116:case 110:case 102:case 114:a+=O[e],L++;break;case 117:for(b=++L,c=L+4;c>L;L++)e=f.charCodeAt(L),e>=48&&57>=e||e>=97&&102>=e||e>=65&&70>=e||P();a+=N("0x"+f.slice(b,L));break;default:P()}else{if(34==e)break;for(e=f.charCodeAt(L),b=L;e>=32&&92!=e&&34!=e;)e=f.charCodeAt(++L);a+=f.slice(b,L)}if(34==f.charCodeAt(L))return L++,a;P();default:if(b=L,45==e&&(d=!0,e=f.charCodeAt(++L)),e>=48&&57>=e){for(48==e&&(e=f.charCodeAt(L+1),e>=48&&57>=e)&&P(),d=!1;g>L&&(e=f.charCodeAt(L),e>=48&&57>=e);L++);if(46==f.charCodeAt(L)){for(c=++L;g>c&&(e=f.charCodeAt(c),e>=48&&57>=e);c++);c==L&&P(),L=c}if(e=f.charCodeAt(L),101==e||69==e){for(e=f.charCodeAt(++L),(43==e||45==e)&&L++,c=L;g>c&&(e=f.charCodeAt(c),e>=48&&57>=e);c++);c==L&&P(),L=c}return+f.slice(b,L)}if(d&&P(),"true"==f.slice(L,L+4))return L+=4,!0;if("false"==f.slice(L,L+5))return L+=5,!1;if("null"==f.slice(L,L+4))return L+=4,null;P()}return"$"},R=function(a){var b,c;if("$"==a&&P(),"string"==typeof a){if("@"==(B?a.charAt(0):a[0]))return a.slice(1);if("["==a){for(b=[];a=Q(),"]"!=a;c||(c=!0))c&&(","==a?(a=Q(),"]"==a&&P()):P()),","==a&&P(),b.push(R(a));return b}if("{"==a){for(b={};a=Q(),"}"!=a;c||(c=!0))c&&(","==a?(a=Q(),"}"==a&&P()):P()),(","==a||"string"!=typeof a||"@"!=(B?a.charAt(0):a[0])||":"!=Q())&&P(),b[a.slice(1)]=R(Q());return b}P()}return a},S=function(a,b,c){var d=T(a,b,c);d===q?delete a[b]:a[b]=d},T=function(a,b,c){var d,e=a[b];if("object"==typeof e&&e)if(s.call(e)==z)for(d=e.length;d--;)S(e,d,c);else p(e,function(a){S(e,a,c)});return c.call(a,b,e)};d.parse=function(a,b){var c,d;return L=0,M=""+a,c=R(Q()),"$"!=Q()&&P(),L=M=null,b&&s.call(b)==v?T((d={},d[""]=c,d),"",b):c}}}return d.runInContext=a,d}var b="function"==typeof define&&define.amd,c={"function":!0,object:!0},d=c[typeof exports]&&exports&&!exports.nodeType&&exports,e=c[typeof window]&&window||this,f=d&&c[typeof module]&&module&&!module.nodeType&&"object"==typeof global&&global;if(!f||f.global!==f&&f.window!==f&&f.self!==f||(e=f),d&&!b)a(e,d);else{var g=e.JSON,h=e.JSON3,i=!1,j=a(e,e.JSON3={noConflict:function(){return i||(i=!0,e.JSON=g,e.JSON3=h,g=h=null),j}});e.JSON={parse:j.parse,stringify:j.stringify}}b&&define(function(){return j})}.call(this),function(){var a={};a.parseXML=function(a,b){var c=null;try{if(window.DOMParser){var d=new DOMParser;c=d.parseFromString(a,b)}else c=new ActiveXObject("Microsoft.XMLDOM"),c.async=!1,c.loadXML(a)}catch(e){}return c},a.parseJSON=function(a){if(null==a)return null;try{return JSON.parse(a)}catch(b){throw b}},createjs.DataUtils=a}(),this.createjs=this.createjs||{},function(){"use strict";function a(){this.src=null,this.type=null,this.id=null,this.maintainOrder=!1,this.callback=null,this.data=null,this.method=createjs.LoadItem.GET,this.values=null,this.headers=null,this.withCredentials=!1,this.mimeType=null,this.crossOrigin=null,this.loadTimeout=8e3}var b=a.prototype={},c=a;c.create=function(b){if("string"==typeof b){var d=new a;return d.src=b,d}if(b instanceof c)return b;if(b instanceof Object)return b;throw new Error("Type not recognized.")},b.set=function(a){for(var b in a)this[b]=a[b];return this},createjs.LoadItem=c}(),function(){var a={};a.ABSOLUTE_PATT=/^(?:\w+:)?\/{2}/i,a.RELATIVE_PATT=/^[./]*?\//i,a.EXTENSION_PATT=/\/?[^/]+\.(\w{1,5})$/i,a.parseURI=function(b){var c={absolute:!1,relative:!1};if(null==b)return c;var d=b.indexOf("?");d>-1&&(b=b.substr(0,d));var e;return a.ABSOLUTE_PATT.test(b)?c.absolute=!0:a.RELATIVE_PATT.test(b)&&(c.relative=!0),(e=b.match(a.EXTENSION_PATT))&&(c.extension=e[1].toLowerCase()),c},a.formatQueryString=function(a,b){if(null==a)throw new Error("You must specify data.");var c=[];for(var d in a)c.push(d+"="+escape(a[d]));return b&&(c=c.concat(b)),c.join("&")},a.buildPath=function(a,b){if(null==b)return a;var c=[],d=a.indexOf("?");if(-1!=d){var e=a.slice(d+1);c=c.concat(e.split("&"))}return-1!=d?a.slice(0,d)+"?"+this._formatQueryString(b,c):a+"?"+this._formatQueryString(b,c)},a.isCrossDomain=function(a){var b=document.createElement("a");b.href=a.src;var c=document.createElement("a");c.href=location.href;var d=""!=b.hostname&&(b.port!=c.port||b.protocol!=c.protocol||b.hostname!=c.hostname);return d},a.isLocal=function(a){var b=document.createElement("a");return b.href=a.src,""==b.hostname&&"file:"==b.protocol},a.isBinary=function(a){switch(a){case createjs.AbstractLoader.IMAGE:case createjs.AbstractLoader.BINARY:return!0;default:return!1}},a.isImageTag=function(a){return a instanceof HTMLImageElement},a.isAudioTag=function(a){return window.HTMLAudioElement?a instanceof HTMLAudioElement:!1},a.isVideoTag=function(a){return window.HTMLVideoElement?a instanceof HTMLVideoElement:void 0},a.isText=function(a){switch(a){case createjs.AbstractLoader.TEXT:case createjs.AbstractLoader.JSON:case createjs.AbstractLoader.MANIFEST:case createjs.AbstractLoader.XML:case createjs.AbstractLoader.CSS:case createjs.AbstractLoader.SVG:case createjs.AbstractLoader.JAVASCRIPT:return!0;default:return!1}},a.getTypeByExtension=function(a){if(null==a)return createjs.AbstractLoader.TEXT;switch(a.toLowerCase()){case"jpeg":case"jpg":case"gif":case"png":case"webp":case"bmp":return createjs.AbstractLoader.IMAGE;case"ogg":case"mp3":case"webm":return createjs.AbstractLoader.SOUND;case"mp4":case"webm":case"ts":return createjs.AbstractLoader.VIDEO;case"json":return createjs.AbstractLoader.JSON;case"xml":return createjs.AbstractLoader.XML;case"css":return createjs.AbstractLoader.CSS;case"js":return createjs.AbstractLoader.JAVASCRIPT;case"svg":return createjs.AbstractLoader.SVG;default:return createjs.AbstractLoader.TEXT}},createjs.RequestUtils=a}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b,c){this.EventDispatcher_constructor(),this.loaded=!1,this.canceled=!1,this.progress=0,this.type=c,this.resultFormatter=null,this._item=a?createjs.LoadItem.create(a):null,this._preferXHR=b,this._result=null,this._rawResult=null,this._loadedItems=null,this._tagSrcAttribute=null,this._tag=null}var b=createjs.extend(a,createjs.EventDispatcher),c=a;c.POST="POST",c.GET="GET",c.BINARY="binary",c.CSS="css",c.IMAGE="image",c.JAVASCRIPT="javascript",c.JSON="json",c.JSONP="jsonp",c.MANIFEST="manifest",c.SOUND="sound",c.VIDEO="video",c.SPRITESHEET="spritesheet",c.SVG="svg",c.TEXT="text",c.XML="xml",b.getItem=function(){return this._item},b.getResult=function(a){return a?this._rawResult:this._result},b.getTag=function(){return this._tag},b.setTag=function(a){this._tag=a},b.load=function(){this._createRequest(),this._request.on("complete",this,this),this._request.on("progress",this,this),this._request.on("loadStart",this,this),this._request.on("abort",this,this),this._request.on("timeout",this,this),this._request.on("error",this,this);var a=new createjs.Event("initialize");a.loader=this._request,this.dispatchEvent(a),this._request.load()},b.cancel=function(){this.canceled=!0,this.destroy()},b.destroy=function(){this._request&&(this._request.removeAllEventListeners(),this._request.destroy()),this._request=null,this._item=null,this._rawResult=null,this._result=null,this._loadItems=null,this.removeAllEventListeners()},b.getLoadedItems=function(){return this._loadedItems},b._createRequest=function(){this._request=this._preferXHR?new createjs.XHRRequest(this._item):new createjs.TagRequest(this._item,this._tag||this._createTag(),this._tagSrcAttribute)},b._createTag=function(){return null},b._sendLoadStart=function(){this._isCanceled()||this.dispatchEvent("loadstart")},b._sendProgress=function(a){if(!this._isCanceled()){var b=null;"number"==typeof a?(this.progress=a,b=new createjs.ProgressEvent(this.progress)):(b=a,this.progress=a.loaded/a.total,b.progress=this.progress,(isNaN(this.progress)||1/0==this.progress)&&(this.progress=0)),this.hasEventListener("progress")&&this.dispatchEvent(b)}},b._sendComplete=function(){if(!this._isCanceled()){this.loaded=!0;var a=new createjs.Event("complete");a.rawResult=this._rawResult,null!=this._result&&(a.result=this._result),this.dispatchEvent(a)}},b._sendError=function(a){!this._isCanceled()&&this.hasEventListener("error")&&(null==a&&(a=new createjs.ErrorEvent("PRELOAD_ERROR_EMPTY")),this.dispatchEvent(a))},b._isCanceled=function(){return null==window.createjs||this.canceled?!0:!1},b.resultFormatter=null,b.handleEvent=function(a){switch(a.type){case"complete":this._rawResult=a.target._response;var b=this.resultFormatter&&this.resultFormatter(this),c=this;b instanceof Function?b(function(a){c._result=a,c._sendComplete()}):(this._result=b||this._rawResult,this._sendComplete());break;case"progress":this._sendProgress(a);break;case"error":this._sendError(a);break;case"loadstart":this._sendLoadStart();break;case"abort":case"timeout":this._isCanceled()||this.dispatchEvent(a.type)}},b.buildPath=function(a,b){return createjs.RequestUtils.buildPath(a,b)},b.toString=function(){return"[PreloadJS AbstractLoader]"},createjs.AbstractLoader=createjs.promote(a,"EventDispatcher")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b,c){this.AbstractLoader_constructor(a,b,c),this.resultFormatter=this._formatResult,this._tagSrcAttribute="src"}var b=createjs.extend(a,createjs.AbstractLoader);b.load=function(){this._tag||(this._tag=this._createTag(this._item.src)),this._tag.preload="auto",this._tag.load(),this.AbstractLoader_load()},b._createTag=function(){},b._createRequest=function(){this._request=this._preferXHR?new createjs.XHRRequest(this._item):new createjs.MediaTagRequest(this._item,this._tag||this._createTag(),this._tagSrcAttribute)},b._formatResult=function(a){return this._tag.removeEventListener&&this._tag.removeEventListener("canplaythrough",this._loadedHandler),this._tag.onstalled=null,this._preferXHR&&(a.getTag().src=a.getResult(!0)),a.getTag()},createjs.AbstractMediaLoader=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(a){this._item=a},b=createjs.extend(a,createjs.EventDispatcher);b.load=function(){},b.destroy=function(){},b.cancel=function(){},createjs.AbstractRequest=createjs.promote(a,"EventDispatcher")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b,c){this.AbstractRequest_constructor(a),this._tag=b,this._tagSrcAttribute=c,this._loadedHandler=createjs.proxy(this._handleTagComplete,this),this._addedToDOM=!1,this._startTagVisibility=null}var b=createjs.extend(a,createjs.AbstractRequest);b.load=function(){null==this._tag.parentNode&&(window.document.body.appendChild(this._tag),this._addedToDOM=!0),this._tag.onload=createjs.proxy(this._handleTagComplete,this),this._tag.onreadystatechange=createjs.proxy(this._handleReadyStateChange,this);var a=new createjs.Event("initialize");a.loader=this._tag,this.dispatchEvent(a),this._hideTag(),this._tag[this._tagSrcAttribute]=this._item.src},b.destroy=function(){this._clean(),this._tag=null,this.AbstractRequest_destroy()},b._handleReadyStateChange=function(){clearTimeout(this._loadTimeout);var a=this._tag;("loaded"==a.readyState||"complete"==a.readyState)&&this._handleTagComplete()},b._handleTagComplete=function(){this._rawResult=this._tag,this._result=this.resultFormatter&&this.resultFormatter(this)||this._rawResult,this._clean(),this._showTag(),this.dispatchEvent("complete")},b._clean=function(){this._tag.onload=null,this._tag.onreadystatechange=null,this._addedToDOM&&null!=this._tag.parentNode&&this._tag.parentNode.removeChild(this._tag)},b._hideTag=function(){this._startTagVisibility=this._tag.style.visibility,this._tag.style.visibility="hidden"},b._showTag=function(){this._tag.style.visibility=this._startTagVisibility},b._handleStalled=function(){},createjs.TagRequest=createjs.promote(a,"AbstractRequest")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b,c){this.AbstractRequest_constructor(a),this._tag=b,this._tagSrcAttribute=c,this._loadedHandler=createjs.proxy(this._handleTagComplete,this)}var b=createjs.extend(a,createjs.TagRequest);b.load=function(){this._tag.onstalled=createjs.proxy(this._handleStalled,this),this._tag.onprogress=createjs.proxy(this._handleProgress,this),this._tag.addEventListener&&this._tag.addEventListener("canplaythrough",this._loadedHandler,!1),this.TagRequest_load()},b._handleReadyStateChange=function(){clearTimeout(this._loadTimeout);var a=this._tag;("loaded"==a.readyState||"complete"==a.readyState)&&this._handleTagComplete()},b._handleStalled=function(){},b._handleProgress=function(a){if(a&&!(a.loaded>0&&0==a.total)){var b=new createjs.ProgressEvent(a.loaded,a.total);this.dispatchEvent(b)}},b._clean=function(){this._tag.removeEventListener&&this._tag.removeEventListener("canplaythrough",this._loadedHandler),this._tag.onstalled=null,this._tag.onprogress=null,this.TagRequest__clean()},createjs.MediaTagRequest=createjs.promote(a,"TagRequest")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a){this.AbstractRequest_constructor(a),this._request=null,this._loadTimeout=null,this._xhrLevel=1,this._response=null,this._rawResponse=null,this._canceled=!1,this._handleLoadStartProxy=createjs.proxy(this._handleLoadStart,this),this._handleProgressProxy=createjs.proxy(this._handleProgress,this),this._handleAbortProxy=createjs.proxy(this._handleAbort,this),this._handleErrorProxy=createjs.proxy(this._handleError,this),this._handleTimeoutProxy=createjs.proxy(this._handleTimeout,this),this._handleLoadProxy=createjs.proxy(this._handleLoad,this),this._handleReadyStateChangeProxy=createjs.proxy(this._handleReadyStateChange,this),!this._createXHR(a)}var b=createjs.extend(a,createjs.AbstractRequest);a.ACTIVEX_VERSIONS=["Msxml2.XMLHTTP.6.0","Msxml2.XMLHTTP.5.0","Msxml2.XMLHTTP.4.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"],b.getResult=function(a){return a&&this._rawResponse?this._rawResponse:this._response},b.cancel=function(){this.canceled=!0,this._clean(),this._request.abort()},b.load=function(){if(null==this._request)return void this._handleError();this._request.addEventListener("loadstart",this._handleLoadStartProxy,!1),this._request.addEventListener("progress",this._handleProgressProxy,!1),this._request.addEventListener("abort",this._handleAbortProxy,!1),this._request.addEventListener("error",this._handleErrorProxy,!1),this._request.addEventListener("timeout",this._handleTimeoutProxy,!1),this._request.addEventListener("load",this._handleLoadProxy,!1),this._request.addEventListener("readystatechange",this._handleReadyStateChangeProxy,!1),1==this._xhrLevel&&(this._loadTimeout=setTimeout(createjs.proxy(this._handleTimeout,this),this._item.loadTimeout));try{this._item.values&&this._item.method!=createjs.AbstractLoader.GET?this._item.method==createjs.AbstractLoader.POST&&this._request.send(createjs.RequestUtils.formatQueryString(this._item.values)):this._request.send()}catch(a){this.dispatchEvent(new createjs.ErrorEvent("XHR_SEND",null,a))}},b.setResponseType=function(a){this._request.responseType=a},b.getAllResponseHeaders=function(){return this._request.getAllResponseHeaders instanceof Function?this._request.getAllResponseHeaders():null},b.getResponseHeader=function(a){return this._request.getResponseHeader instanceof Function?this._request.getResponseHeader(a):null},b._handleProgress=function(a){if(a&&!(a.loaded>0&&0==a.total)){var b=new createjs.ProgressEvent(a.loaded,a.total);this.dispatchEvent(b)}},b._handleLoadStart=function(){clearTimeout(this._loadTimeout),this.dispatchEvent("loadstart")},b._handleAbort=function(a){this._clean(),this.dispatchEvent(new createjs.ErrorEvent("XHR_ABORTED",null,a))},b._handleError=function(a){this._clean(),this.dispatchEvent(new createjs.ErrorEvent(a.message))},b._handleReadyStateChange=function(){4==this._request.readyState&&this._handleLoad()},b._handleLoad=function(){if(!this.loaded){this.loaded=!0;var a=this._checkError();if(a)return void this._handleError(a);this._response=this._getResponse(),this._clean(),this.dispatchEvent(new createjs.Event("complete"))}},b._handleTimeout=function(a){this._clean(),this.dispatchEvent(new createjs.ErrorEvent("PRELOAD_TIMEOUT",null,a))},b._checkError=function(){var a=parseInt(this._request.status);switch(a){case 404:case 0:return new Error(a)}return null},b._getResponse=function(){if(null!=this._response)return this._response;if(null!=this._request.response)return this._request.response;try{if(null!=this._request.responseText)return this._request.responseText}catch(a){}try{if(null!=this._request.responseXML)return this._request.responseXML}catch(a){}return null},b._createXHR=function(a){var b=createjs.RequestUtils.isCrossDomain(a),c={},d=null;if(window.XMLHttpRequest)d=new XMLHttpRequest,b&&void 0===d.withCredentials&&window.XDomainRequest&&(d=new XDomainRequest);else{for(var e=0,f=s.ACTIVEX_VERSIONS.length;f>e;e++){{s.ACTIVEX_VERSIONS[e]}try{d=new ActiveXObject(axVersions);break}catch(g){}}if(null==d)return!1}a.mimeType&&d.overrideMimeType&&d.overrideMimeType(a.mimeType),this._xhrLevel="string"==typeof d.responseType?2:1;var h=null;if(h=a.method==createjs.AbstractLoader.GET?createjs.RequestUtils.buildPath(a.src,a.values):a.src,d.open(a.method||createjs.AbstractLoader.GET,h,!0),b&&d instanceof XMLHttpRequest&&1==this._xhrLevel&&(c.Origin=location.origin),a.values&&a.method==createjs.AbstractLoader.POST&&(c["Content-Type"]="application/x-www-form-urlencoded"),b||c["X-Requested-With"]||(c["X-Requested-With"]="XMLHttpRequest"),a.headers)for(var i in a.headers)c[i]=a.headers[i];for(i in c)d.setRequestHeader(i,c[i]);return d instanceof XMLHttpRequest&&void 0!==a.withCredentials&&(d.withCredentials=a.withCredentials),this._request=d,!0},b._clean=function(){clearTimeout(this._loadTimeout),this._request.removeEventListener("loadstart",this._handleLoadStartProxy),this._request.removeEventListener("progress",this._handleProgressProxy),this._request.removeEventListener("abort",this._handleAbortProxy),this._request.removeEventListener("error",this._handleErrorProxy),this._request.removeEventListener("timeout",this._handleTimeoutProxy),this._request.removeEventListener("load",this._handleLoadProxy),this._request.removeEventListener("readystatechange",this._handleReadyStateChangeProxy)},b.toString=function(){return"[PreloadJS XHRRequest]"},createjs.XHRRequest=createjs.promote(a,"AbstractRequest")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b,c){this.AbstractLoader_constructor(),this.init(a,b,c)}var b=createjs.extend(a,createjs.AbstractLoader),c=a;b.init=function(a,b,c){this.useXHR=!0,this.preferXHR=!0,this._preferXHR=!0,this.setPreferXHR(a),this.stopOnError=!1,this.maintainScriptOrder=!0,this.next=null,this._paused=!1,this._basePath=b,this._crossOrigin=c,this._typeCallbacks={},this._extensionCallbacks={},this._loadStartWasDispatched=!1,this._maxConnections=1,this._currentlyLoadingScript=null,this._currentLoads=[],this._loadQueue=[],this._loadQueueBackup=[],this._loadItemsById={},this._loadItemsBySrc={},this._loadedResults={},this._loadedRawResults={},this._numItems=0,this._numItemsLoaded=0,this._scriptOrder=[],this._loadedScripts=[],this._lastProgress=0/0,this._availableLoaders=[createjs.ImageLoader,createjs.JavaScriptLoader,createjs.CSSLoader,createjs.JSONLoader,createjs.JSONPLoader,createjs.SoundLoader,createjs.ManifestLoader,createjs.SpriteSheetLoader,createjs.XMLLoader,createjs.SVGLoader,createjs.BinaryLoader,createjs.VideoLoader,createjs.TextLoader],this._defaultLoaderLength=this._availableLoaders.length},c.loadTimeout=8e3,c.LOAD_TIMEOUT=0,c.BINARY=createjs.AbstractLoader.BINARY,c.CSS=createjs.AbstractLoader.CSS,c.IMAGE=createjs.AbstractLoader.IMAGE,c.JAVASCRIPT=createjs.AbstractLoader.JAVASCRIPT,c.JSON=createjs.AbstractLoader.JSON,c.JSONP=createjs.AbstractLoader.JSONP,c.MANIFEST=createjs.AbstractLoader.MANIFEST,c.SOUND=createjs.AbstractLoader.SOUND,c.VIDEO=createjs.AbstractLoader.VIDEO,c.SVG=createjs.AbstractLoader.SVG,c.TEXT=createjs.AbstractLoader.TEXT,c.XML=createjs.AbstractLoader.XML,c.POST=createjs.AbstractLoader.POST,c.GET=createjs.AbstractLoader.GET,b.registerLoader=function(a){if(!a||!a.canLoadItem)throw new Error("loader is of an incorrect type.");if(-1!=this._availableLoaders.indexOf(a))throw new Error("loader already exists.");this._availableLoaders.unshift(a)},b.unregisterLoader=function(a){var b=this._availableLoaders.indexOf(a);-1!=b&&b<this._defaultLoaderLength-1&&this._availableLoaders.splice(b,1)},b.setUseXHR=function(a){return this.setPreferXHR(a)},b.setPreferXHR=function(a){return this.preferXHR=0!=a&&null!=window.XMLHttpRequest,this.preferXHR},b.removeAll=function(){this.remove()},b.remove=function(a){var b=null;if(!a||a instanceof Array){if(a)b=a;else if(arguments.length>0)return}else b=[a];var c=!1;if(b){for(;b.length;){var d=b.pop(),e=this.getResult(d);for(f=this._loadQueue.length-1;f>=0;f--)if(g=this._loadQueue[f].getItem(),g.id==d||g.src==d){this._loadQueue.splice(f,1)[0].cancel();break}for(f=this._loadQueueBackup.length-1;f>=0;f--)if(g=this._loadQueueBackup[f].getItem(),g.id==d||g.src==d){this._loadQueueBackup.splice(f,1)[0].cancel();break}if(e)delete this._loadItemsById[e.id],delete this._loadItemsBySrc[e.src],this._disposeItem(e);else for(var f=this._currentLoads.length-1;f>=0;f--){var g=this._currentLoads[f].getItem();if(g.id==d||g.src==d){this._currentLoads.splice(f,1)[0].cancel(),c=!0;break}}}c&&this._loadNext()}else{this.close();for(var h in this._loadItemsById)this._disposeItem(this._loadItemsById[h]);this.init(this.preferXHR,this._basePath)}},b.reset=function(){this.close();for(var a in this._loadItemsById)this._disposeItem(this._loadItemsById[a]);for(var b=[],c=0,d=this._loadQueueBackup.length;d>c;c++)b.push(this._loadQueueBackup[c].getItem());this.loadManifest(b,!1)},b.installPlugin=function(a){if(null!=a&&null!=a.getPreloadHandlers){var b=a.getPreloadHandlers();if(b.scope=a,null!=b.types)for(var c=0,d=b.types.length;d>c;c++)this._typeCallbacks[b.types[c]]=b;if(null!=b.extensions)for(c=0,d=b.extensions.length;d>c;c++)this._extensionCallbacks[b.extensions[c]]=b}},b.setMaxConnections=function(a){this._maxConnections=a,!this._paused&&this._loadQueue.length>0&&this._loadNext()},b.loadFile=function(a,b,c){if(null==a){var d=new createjs.ErrorEvent("PRELOAD_NO_FILE");return void this._sendError(d)}this._addItem(a,null,c),this.setPaused(b!==!1?!1:!0)},b.loadManifest=function(a,b,d){var e=null,f=null;if(a instanceof Array){if(0==a.length){var g=new createjs.ErrorEvent("PRELOAD_MANIFEST_EMPTY");return void this._sendError(g)}e=a}else if("string"==typeof a)e=[{src:a,type:c.MANIFEST}];else{if("object"!=typeof a){var g=new createjs.ErrorEvent("PRELOAD_MANIFEST_NULL");return void this._sendError(g)}if(void 0!==a.src){if(null==a.type)a.type=c.MANIFEST;else if(a.type!=c.MANIFEST){var g=new createjs.ErrorEvent("PRELOAD_MANIFEST_TYPE");this._sendError(g)}e=[a]}else void 0!==a.manifest&&(e=a.manifest,f=a.path)}for(var h=0,i=e.length;i>h;h++)this._addItem(e[h],f,d);this.setPaused(b!==!1?!1:!0)},b.load=function(){this.setPaused(!1)},b.getItem=function(a){return this._loadItemsById[a]||this._loadItemsBySrc[a]},b.getResult=function(a,b){var c=this._loadItemsById[a]||this._loadItemsBySrc[a];if(null==c)return null;var d=c.id;return b&&this._loadedRawResults[d]?this._loadedRawResults[d]:this._loadedResults[d]},b.getItems=function(a){for(var b=[],c=0,d=this._loadQueueBackup.length;d>c;c++){var e=this._loadQueueBackup[c],f=e.getItem();(a!==!0||e.loaded)&&b.push({item:f,result:this.getResult(f.id),rawResult:this.getResult(f.id,!0)})}return b},b.setPaused=function(a){this._paused=a,this._paused||this._loadNext()},b.close=function(){for(;this._currentLoads.length;)this._currentLoads.pop().cancel();this._scriptOrder.length=0,this._loadedScripts.length=0,this.loadStartWasDispatched=!1,this._itemCount=0,this._lastProgress=0/0},b._addItem=function(a,b,c){var d=this._createLoadItem(a,b,c);if(null!=d){var e=this._createLoader(d);null!=e&&(d._loader=e,this._loadQueue.push(e),this._loadQueueBackup.push(e),this._numItems++,this._updateProgress(),(this.maintainScriptOrder&&d.type==createjs.LoadQueue.JAVASCRIPT||d.maintainOrder===!0)&&(this._scriptOrder.push(d),this._loadedScripts.push(null)))}},b._createLoadItem=function(a,b,d){var e=createjs.LoadItem.create(a);if(null==e)return null;var f=createjs.RequestUtils.parseURI(e.src);f.extension&&(e.ext=f.extension),null==e.type&&(e.type=createjs.RequestUtils.getTypeByExtension(e.ext));var g="",h=d||this._basePath,i=e.src;if(!f.absolute&&!f.relative)if(b){g=b;var j=createjs.RequestUtils.parseURI(b);i=b+i,null==h||j.absolute||j.relative||(g=h+g)}else null!=h&&(g=h);e.src=g+e.src,e.path=g,(void 0===e.id||null===e.id||""===e.id)&&(e.id=i);var k=this._typeCallbacks[e.type]||this._extensionCallbacks[e.ext];if(k){var l=k.callback.call(k.scope,e,this);if(l===!1)return null;l===!0||null!=l&&(e._loader=l),f=createjs.RequestUtils.parseURI(e.src),null!=f.extension&&(e.ext=f.extension)}return this._loadItemsById[e.id]=e,this._loadItemsBySrc[e.src]=e,null==e.loadTimeout&&(e.loadTimeout=c.loadTimeout),null==e.crossOrigin&&(e.crossOrigin=this._crossOrigin),e},b._createLoader=function(a){if(null!=a._loader)return a._loader;for(var b=this.preferXHR,c=0;c<this._availableLoaders.length;c++){var d=this._availableLoaders[c];if(d&&d.canLoadItem(a))return new d(a,b)}return null},b._loadNext=function(){if(!this._paused){this._loadStartWasDispatched||(this._sendLoadStart(),this._loadStartWasDispatched=!0),this._numItems==this._numItemsLoaded?(this.loaded=!0,this._sendComplete(),this.next&&this.next.load&&this.next.load()):this.loaded=!1;for(var a=0;a<this._loadQueue.length&&!(this._currentLoads.length>=this._maxConnections);a++){var b=this._loadQueue[a];this._canStartLoad(b)&&(this._loadQueue.splice(a,1),a--,this._loadItem(b))}}},b._loadItem=function(a){a.on("fileload",this._handleFileLoad,this),a.on("progress",this._handleProgress,this),a.on("complete",this._handleFileComplete,this),a.on("error",this._handleError,this),a.on("fileerror",this._handleFileError,this),this._currentLoads.push(a),this._sendFileStart(a.getItem()),a.load()},b._handleFileLoad=function(a){a.target=null,this.dispatchEvent(a)},b._handleFileError=function(a){var b=new createjs.ErrorEvent("FILE_LOAD_ERROR",null,a.item);this._sendError(b)},b._handleError=function(a){var b=a.target;this._numItemsLoaded++,this._finishOrderedItem(b,!0),this._updateProgress();var c=new createjs.ErrorEvent("FILE_LOAD_ERROR",null,b.getItem());this._sendError(c),this.stopOnError||(this._removeLoadItem(b),this._loadNext())},b._handleFileComplete=function(a){var b=a.target,c=b.getItem(),d=b.getResult();this._loadedResults[c.id]=d;var e=b.getResult(!0);null!=e&&e!==d&&(this._loadedRawResults[c.id]=e),this._saveLoadedItems(b),this._removeLoadItem(b),this._finishOrderedItem(b)||this._processFinishedLoad(c,b)},b._saveLoadedItems=function(a){var b=a.getLoadedItems();if(null!==b)for(var c=0;c<b.length;c++){var d=b[c].item;this._loadItemsBySrc[d.src]=d,this._loadItemsById[d.id]=d,this._loadedResults[d.id]=b[c].result,this._loadedRawResults[d.id]=b[c].rawResult}},b._finishOrderedItem=function(a,b){var c=a.getItem();if(this.maintainScriptOrder&&c.type==createjs.LoadQueue.JAVASCRIPT||c.maintainOrder){a instanceof createjs.JavaScriptLoader&&(this._currentlyLoadingScript=!1);var d=createjs.indexOf(this._scriptOrder,c);return-1==d?!1:(this._loadedScripts[d]=b===!0?!0:c,this._checkScriptLoadOrder(),!0)}return!1},b._checkScriptLoadOrder=function(){for(var a=this._loadedScripts.length,b=0;a>b;b++){var c=this._loadedScripts[b];if(null===c)break;if(c!==!0){var d=this._loadedResults[c.id];c.type==createjs.LoadQueue.JAVASCRIPT&&(document.body||document.getElementsByTagName("body")[0]).appendChild(d);var e=c._loader;this._processFinishedLoad(c,e),this._loadedScripts[b]=!0}}},b._processFinishedLoad=function(a,b){this._numItemsLoaded++,this._updateProgress(),this._sendFileComplete(a,b),this._loadNext()},b._canStartLoad=function(a){if(!this.maintainScriptOrder||a.preferXHR)return!0;var b=a.getItem();if(b.type!=createjs.LoadQueue.JAVASCRIPT)return!0;if(this._currentlyLoadingScript)return!1;for(var c=this._scriptOrder.indexOf(b),d=0;c>d;){var e=this._loadedScripts[d];if(null==e)return!1;d++}return this._currentlyLoadingScript=!0,!0},b._removeLoadItem=function(a){var b=a.getItem();delete b._loader;for(var c=this._currentLoads.length,d=0;c>d;d++)if(this._currentLoads[d]==a){this._currentLoads.splice(d,1);break}},b._handleProgress=function(a){var b=a.target;this._sendFileProgress(b.getItem(),b.progress),this._updateProgress()},b._updateProgress=function(){var a=this._numItemsLoaded/this._numItems,b=this._numItems-this._numItemsLoaded;if(b>0){for(var c=0,d=0,e=this._currentLoads.length;e>d;d++)c+=this._currentLoads[d].progress;a+=c/b*(b/this._numItems)}this._lastProgress!=a&&(this._sendProgress(a),this._lastProgress=a)},b._disposeItem=function(a){delete this._loadedResults[a.id],delete this._loadedRawResults[a.id],delete this._loadItemsById[a.id],delete this._loadItemsBySrc[a.src]},b._sendFileProgress=function(a,b){if(this._isCanceled())return void this._cleanUp();if(this.hasEventListener("fileprogress")){var c=new createjs.Event("fileprogress");c.progress=b,c.loaded=b,c.total=1,c.item=a,this.dispatchEvent(c)}},b._sendFileComplete=function(a,b){if(!this._isCanceled()){var c=new createjs.Event("fileload");c.loader=b,c.item=a,c.result=this._loadedResults[a.id],c.rawResult=this._loadedRawResults[a.id],a.completeHandler&&a.completeHandler(c),this.hasEventListener("fileload")&&this.dispatchEvent(c)}},b._sendFileStart=function(a){var b=new createjs.Event("filestart");b.item=a,this.hasEventListener("filestart")&&this.dispatchEvent(b)},b.toString=function(){return"[PreloadJS LoadQueue]"},createjs.LoadQueue=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a){this.AbstractLoader_constructor(a,!0,createjs.AbstractLoader.TEXT)}var b=(createjs.extend(a,createjs.AbstractLoader),a);b.canLoadItem=function(a){return a.type==createjs.AbstractLoader.TEXT},createjs.TextLoader=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a){this.AbstractLoader_constructor(a,!0,createjs.AbstractLoader.BINARY),this.on("initialize",this._updateXHR,this)}var b=createjs.extend(a,createjs.AbstractLoader),c=a;c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.BINARY},b._updateXHR=function(a){a.loader.setResponseType("arraybuffer")},createjs.BinaryLoader=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b){this.AbstractLoader_constructor(a,b,createjs.AbstractLoader.CSS),this.resultFormatter=this._formatResult,this._tagSrcAttribute="href",this._tag=document.createElement(b?"style":"link"),this._tag.rel="stylesheet",this._tag.type="text/css"}var b=createjs.extend(a,createjs.AbstractLoader),c=a;c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.CSS},b._formatResult=function(a){if(this._preferXHR){var b=a.getTag(),c=document.getElementsByTagName("head")[0];if(c.appendChild(b),b.styleSheet)b.styleSheet.cssText=a.getResult(!0);else{var d=document.createTextNode(a.getResult(!0));b.appendChild(d)}}else b=this._tag;return b},createjs.CSSLoader=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b){this.AbstractLoader_constructor(a,b,createjs.AbstractLoader.IMAGE),this.resultFormatter=this._formatResult,this._tagSrcAttribute="src",createjs.RequestUtils.isImageTag(a)?this._tag=a:createjs.RequestUtils.isImageTag(a.src)?this._tag=a.src:createjs.RequestUtils.isImageTag(a.tag)&&(this._tag=a.tag),null!=this._tag?this._preferXHR=!1:this._tag=document.createElement("img"),this.on("initialize",this._updateXHR,this)}var b=createjs.extend(a,createjs.AbstractLoader),c=a;c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.IMAGE},b.load=function(){if(""!=this._tag.src&&this._tag.complete)return void this._sendComplete();var a=this._item.crossOrigin;1==a&&(a="Anonymous"),null==a||createjs.RequestUtils.isLocal(this._item.src)||(this._tag.crossOrigin=a),this.AbstractLoader_load()},b._updateXHR=function(a){a.loader.mimeType="text/plain; charset=x-user-defined-binary",a.loader.setResponseType&&a.loader.setResponseType("blob")},b._formatResult=function(a){var b=this;return function(c){var d=b._tag,e=window.URL||window.webkitURL;if(b._preferXHR)if(e){var f=e.createObjectURL(a.getResult(!0));d.src=f,d.onload=function(){e.revokeObjectURL(b.src)}}else d.src=a.getItem().src;else;d.complete?c(d):d.onload=function(){c(this)}}},createjs.ImageLoader=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b){this.AbstractLoader_constructor(a,b,createjs.AbstractLoader.JAVASCRIPT),this.resultFormatter=this._formatResult,this._tagSrcAttribute="src",this.setTag(document.createElement("script"))}var b=createjs.extend(a,createjs.AbstractLoader),c=a;c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.JAVASCRIPT},b._formatResult=function(a){var b=a.getTag();return this._preferXHR&&(b.text=a.getResult(!0)),b},createjs.JavaScriptLoader=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a){this.AbstractLoader_constructor(a,!0,createjs.AbstractLoader.JSON),this.resultFormatter=this._formatResult}var b=createjs.extend(a,createjs.AbstractLoader),c=a;c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.JSON&&!a._loadAsJSONP},b._formatResult=function(a){var b=null;try{b=createjs.DataUtils.parseJSON(a.getResult(!0))}catch(c){var d=new createjs.ErrorEvent("JSON_FORMAT",null,c);return this._sendError(d),c}return b},createjs.JSONLoader=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a){this.AbstractLoader_constructor(a,!1,createjs.AbstractLoader.JSONP),this.setTag(document.createElement("script")),this.getTag().type="text/javascript"}var b=createjs.extend(a,createjs.AbstractLoader),c=a;c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.JSONP||a._loadAsJSONP},b.cancel=function(){this.AbstractLoader_cancel(),this._dispose()},b.load=function(){if(null==this._item.callback)throw new Error("callback is required for loading JSONP requests.");if(null!=window[this._item.callback])throw new Error("JSONP callback '"+this._item.callback+"' already exists on window. You need to specify a different callback or re-name the current one.");window[this._item.callback]=createjs.proxy(this._handleLoad,this),window.document.body.appendChild(this._tag),this._tag.src=this._item.src},b._handleLoad=function(a){this._result=this._rawResult=a,this._sendComplete(),this._dispose()},b._dispose=function(){window.document.body.removeChild(this._tag),delete window[this._item.callback]},createjs.JSONPLoader=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a){this.AbstractLoader_constructor(a,null,createjs.AbstractLoader.MANIFEST),this._manifestQueue=null}var b=createjs.extend(a,createjs.AbstractLoader),c=a;c.MANIFEST_PROGRESS=.25,c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.MANIFEST},b.load=function(){this.AbstractLoader_load()},b._createRequest=function(){var a=this._item.callback;this._request=null!=a?new createjs.JSONPLoader(this._item):new createjs.JSONLoader(this._item)},b.handleEvent=function(a){switch(a.type){case"complete":return this._rawResult=a.target.getResult(!0),this._result=a.target.getResult(),this._sendProgress(c.MANIFEST_PROGRESS),void this._loadManifest(this._result);case"progress":return a.loaded*=c.MANIFEST_PROGRESS,this.progress=a.loaded/a.total,(isNaN(this.progress)||1/0==this.progress)&&(this.progress=0),void this._sendProgress(a)}this.AbstractLoader_handleEvent(a)},b.destroy=function(){this.AbstractLoader_destroy(),this._manifestQueue.close()},b._loadManifest=function(a){if(a&&a.manifest){var b=this._manifestQueue=new createjs.LoadQueue;b.on("fileload",this._handleManifestFileLoad,this),b.on("progress",this._handleManifestProgress,this),b.on("complete",this._handleManifestComplete,this,!0),b.on("error",this._handleManifestError,this,!0),b.loadManifest(a)}else this._sendComplete()},b._handleManifestFileLoad=function(a){a.target=null,this.dispatchEvent(a)},b._handleManifestComplete=function(){this._loadedItems=this._manifestQueue.getItems(!0),this._sendComplete()},b._handleManifestProgress=function(a){this.progress=a.progress*(1-c.MANIFEST_PROGRESS)+c.MANIFEST_PROGRESS,this._sendProgress(this.progress)},b._handleManifestError=function(a){var b=new createjs.Event("fileerror");b.item=a.data,this.dispatchEvent(b)},createjs.ManifestLoader=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b){this.AbstractMediaLoader_constructor(a,b,createjs.AbstractLoader.SOUND),createjs.RequestUtils.isAudioTag(a)?this._tag=a:createjs.RequestUtils.isAudioTag(a.src)?this._tag=a:createjs.RequestUtils.isAudioTag(a.tag)&&(this._tag=createjs.RequestUtils.isAudioTag(a)?a:a.src),null!=this._tag&&(this._preferXHR=!1)}var b=createjs.extend(a,createjs.AbstractMediaLoader),c=a;c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.SOUND},b._createTag=function(a){var b=document.createElement("audio");return b.autoplay=!1,b.preload="none",b.src=a,b},createjs.SoundLoader=createjs.promote(a,"AbstractMediaLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b){this.AbstractMediaLoader_constructor(a,b,createjs.AbstractLoader.VIDEO),createjs.RequestUtils.isVideoTag(a)||createjs.RequestUtils.isVideoTag(a.src)?(this.setTag(createjs.RequestUtils.isVideoTag(a)?a:a.src),this._preferXHR=!1):this.setTag(this._createTag())}var b=createjs.extend(a,createjs.AbstractMediaLoader),c=a;b._createTag=function(){return document.createElement("video")},c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.VIDEO},createjs.VideoLoader=createjs.promote(a,"AbstractMediaLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a){this.AbstractLoader_constructor(a,null,createjs.AbstractLoader.SPRITESHEET),this._manifestQueue=null}var b=createjs.extend(a,createjs.AbstractLoader),c=a;c.SPRITESHEET_PROGRESS=.25,c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.SPRITESHEET},b.destroy=function(){this.AbstractLoader_destroy,this._manifestQueue.close()},b._createRequest=function(){var a=this._item.callback;this._request=null!=a&&a instanceof Function?new createjs.JSONPLoader(this._item):new createjs.JSONLoader(this._item)},b.handleEvent=function(a){switch(a.type){case"complete":return this._rawResult=a.target.getResult(!0),this._result=a.target.getResult(),this._sendProgress(c.SPRITESHEET_PROGRESS),void this._loadManifest(this._result);case"progress":return a.loaded*=c.SPRITESHEET_PROGRESS,this.progress=a.loaded/a.total,(isNaN(this.progress)||1/0==this.progress)&&(this.progress=0),void this._sendProgress(a)}this.AbstractLoader_handleEvent(a)},b._loadManifest=function(a){if(a&&a.images){var b=this._manifestQueue=new createjs.LoadQueue;b.on("complete",this._handleManifestComplete,this,!0),b.on("fileload",this._handleManifestFileLoad,this),b.on("progress",this._handleManifestProgress,this),b.on("error",this._handleManifestError,this,!0),b.loadManifest(a.images)}},b._handleManifestFileLoad=function(a){var b=a.result;if(null!=b){var c=this.getResult().images,d=c.indexOf(a.item.src);c[d]=b}},b._handleManifestComplete=function(){this._result=new createjs.SpriteSheet(this._result),this._loadedItems=this._manifestQueue.getItems(!0),this._sendComplete()},b._handleManifestProgress=function(a){this.progress=a.progress*(1-c.SPRITESHEET_PROGRESS)+c.SPRITESHEET_PROGRESS,this._sendProgress(this.progress)},b._handleManifestError=function(a){var b=new createjs.Event("fileerror");b.item=a.data,this.dispatchEvent(b)},createjs.SpriteSheetLoader=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b){this.AbstractLoader_constructor(a,b,createjs.AbstractLoader.SVG),this.resultFormatter=this._formatResult,this._tagSrcAttribute="data",b?this.setTag(document.createElement("svg")):(this.setTag(document.createElement("object")),this.getTag().type="image/svg+xml"),this.getTag().style.visibility="hidden"}var b=createjs.extend(a,createjs.AbstractLoader),c=a;c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.SVG},b._formatResult=function(a){var b=createjs.DataUtils.parseXML(a.getResult(!0),"text/xml"),c=a.getTag();return!this._preferXHR&&document.body.contains(c)&&document.body.removeChild(c),null!=b.documentElement?(c.appendChild(b.documentElement),c.style.visibility="visible",c):b},createjs.SVGLoader=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a){this.AbstractLoader_constructor(a,!0,createjs.AbstractLoader.XML),this.resultFormatter=this._formatResult}var b=createjs.extend(a,createjs.AbstractLoader),c=a;c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.XML},b._formatResult=function(a){return createjs.DataUtils.parseXML(a.getResult(!0),"text/xml")},createjs.XMLLoader=createjs.promote(a,"AbstractLoader")}();;


var AssetLoader,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AssetLoader = (function(_super) {
  __extends(AssetLoader, _super);

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
      group.id = p_groupId;
      this._groups[p_groupId] = group;
      group.on('fileload', this._fileLoad);
      group.on('error', this._onError);
      group.on('fileerror', this._onError);
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
    e.currentTarget.off('error', this._onError);
    e.currentTarget.off('fileerror', this._onError);
    switch (e.type) {
      case 'fileerror':
        break;
      case 'error':
        break;
    }
    return console.log(e.title, e.data);
  };

  AssetLoader.prototype._fileLoad = function(e) {
    e.target.off('fileload', this._fileLoad);
    return e.item.tag = e.result;
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
    var i, k, v, _ref, _ref1;
    if (p_groupId == null) {
      p_groupId = null;
    }
    if (p_groupId) {
      return (_ref = this._groups[p_groupId]) != null ? _ref.getResult(p_id) : void 0;
    }
    _ref1 = this._groups;
    for (k in _ref1) {
      v = _ref1[k];
      if (i = v.getResult(p_id)) {
        return i;
      }
    }
  };

  AssetLoader.addFiles = function(p_files, queue) {
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
        queue.loadFile(obj, false);
      }
    }
    if (p_files.length > 0) {
      return queue.load();
    }
  };

  return AssetLoader;

})(EventDispatcher);

var BaseDOM,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
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
  return Node.prototype.__removeChild__.call(this, el);
};

Node.prototype.getInstance = function() {
  return this.__instance__;
};

BaseDOM = (function(_super) {
  __extends(BaseDOM, _super);

  function BaseDOM() {
    var className, element, i, namespace, option, p_options;
    p_options = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    element = 'div';
    className = null;
    namespace = null;
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
    height: function(value) {
      return this.getBounds().height;
    }
  });

  BaseDOM.get({
    left: function() {
      return this.getBounds().left;
    }
  });

  BaseDOM.get({
    top: function(value) {
      return this.getBounds().top;
    }
  });

  BaseDOM.get({
    x: function() {
      return this.getBounds().left;
    }
  });

  BaseDOM.get({
    y: function(value) {
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
      return document.contains(this.element) || document.body.contains(this.element);
    }
  });

  BaseDOM.prototype.appendChild = function(child) {
    var el;
    el = child;
    if (child instanceof BaseDOM) {
      el = child.element;
    }
    return this.appendChildAt(el);
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

  BaseDOM.prototype.find = function(query, onlyInstances) {
    var element;
    if (onlyInstances == null) {
      onlyInstances = false;
    }
    element = this.element.querySelector(query);
    if (onlyInstances) {
      return element != null ? element.getInstance() : void 0;
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
        if (elements[i].getInstance()) {
          els[p++] = elements[i].getInstance();
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
    var _ref;
    if (typeof this.off === "function") {
      this.off();
    }
    return (_ref = this._element) != null ? typeof _ref.remove === "function" ? _ref.remove() : void 0 : void 0;
  };

  return BaseDOM;

})(EventDispatcher);

var BaseView,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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

var TemplateNode,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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
    var attrs, childContext, foundData, k, o, v, _i, _len;
    if (originalData == null) {
      originalData = null;
    }
    if (ignoreUse == null) {
      ignoreUse = false;
    }
    if (!originalData && data) {
      originalData = data;
    }
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
      attrs = this._replaceData(this._attributes, data);
      for (k in attrs) {
        v = attrs[k];
        if (!v || v.length === 0) {
          continue;
        }
        childContext.setAttribute(k, v);
      }
    }
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
      obj = obj.replace(new RegExp('#\\{' + o[1] + '\\}', 'g'), value);
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

var TemplateParser,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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
    var blockRE, childs, o, templateNode, _ref, _ref1, _ref2;
    data = data.replace(/\/\*[\s\S]*?\*\//mg, '');
    data = data.replace(/^\s*$[\n|\r]/gm, '');
    blockRE = /(^\s*)([^\s].*?\n)((?:\1\s[\s\S].*?(?:\n|$))*)/gm;
    _ref = this._escapeCharacters(data, this._escapeMap || []), data = _ref[0], this._escapeMap = _ref[1];
    _ref1 = this._escapeLineBreaks(data, this._escapeMap), data = _ref1[0], this._escapeMap = _ref1[1];
    _ref2 = this._escapeConditionals(data, this._escapeMap), data = _ref2[0], this._escapeMap = _ref2[1];
    childs = [];
    while (o = blockRE.exec(data)) {
      templateNode = new TemplateNode(this._parseNodeData(o[2]));
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
      if (cond = /^\s*(\((?:if|for).*?)\)\s*$/.exec(instructionData)) {
        data['condition'] = cond[1];
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

var API,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

API = (function(_super) {
  __extends(API, _super);

  API.COMPLETE = 'apiComplete';

  API.ERROR = 'apiError';

  API.ROOT_PATH = '';

  API._request = function() {
    if (window.XMLHttpRequest) {
      return new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      return new ActiveXObject("MSXML2.XMLHTTP.3.0");
    }
  };

  API.call = function(params) {
    var api, data, headers, method, onComplete, onError, type, url;
    if (!params) {
      return;
    }
    url = params['url'];
    if (!url) {
      return;
    }
    data = params['data'];
    method = params['method'] || 'POST';
    onComplete = params['onComplete'] || 'POST';
    onError = params['onError'];
    type = params['type'] || 'json';
    headers = params['headers'];
    api = new API(API.ROOT_PATH + url, data, 'POST', type);
    if (onComplete) {
      api.on(this.COMPLETE, onComplete);
    }
    if (onError) {
      api.on(this.ERROR, onError);
    }
    api.load();
    return api;
  };

  function API(url, params, method, type, headers) {
    this.url = url;
    this.params = params != null ? params : null;
    this.method = method != null ? method : 'POST';
    this.type = type != null ? type : 'json';
    this.headers = headers != null ? headers : null;
    this._loaded = __bind(this._loaded, this);
    this.reuse = false;
  }

  API.prototype.load = function() {
    var formData, k, n, url, v, _ref, _ref1, _ref2;
    url = this.url.split('.').join('/');
    if (this.params instanceof FormData) {
      this.method = 'POST';
      formData = this.params;
    } else {
      if (this.method === 'POST') {
        formData = new FormData();
        _ref = this.params;
        for (n in _ref) {
          v = _ref[n];
          formData.append(n, v);
        }
      } else {
        formData = [];
        _ref1 = this.params;
        for (n in _ref1) {
          v = _ref1[n];
          formData.push(n + '=' + v);
        }
      }
    }
    this.req = API._request();
    this.req.onreadystatechange = this._loaded;
    this.req.open(this.method, this.url, true);
    if (this.headers) {
      _ref2 = this.headers;
      for (k in _ref2) {
        v = _ref2[k];
        this.req.setRequestHeader(k, v);
      }
    }
    return this.req.send(formData);
  };

  API.prototype.cancel = function() {
    if (this.req) {
      this.req.onreadystatechange = null;
      this.req.abort();
    }
    if (!this.reuse) {
      return this.off();
    }
  };

  API.prototype._loaded = function(e) {
    var data, err;
    if (e.currentTarget.readyState === 4) {
      if (e.currentTarget.status === 200) {
        try {
          data = e.currentTarget.responseText;
          if (typeof this.type === 'function') {
            data = this.type(data);
          } else if (this.type === 'json') {
            data = eval('(' + e.currentTarget.responseText + ')');
          } else {
            try {
              data = eval('(' + e.currentTarget.responseText + ')');
            } catch (_error) {
              data = e.currentTarget.responseText;
            }
          }
          if (data != null ? data.error : void 0) {
            this.trigger(API.ERROR, data);
          } else {
            this.trigger(API.COMPLETE, data);
          }
        } catch (_error) {
          err = _error;
          console.log(err);
          this.trigger(API.ERROR);
        }
      } else {
        this.trigger(API.ERROR);
      }
      if (!this.reuse) {
        return this.off();
      }
    }
  };

  return API;

})(EventDispatcher);

var ServiceController,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ServiceController = (function(_super) {
  __extends(ServiceController, _super);

  ServiceController.getInstance = function() {
    return ServiceController._instance != null ? ServiceController._instance : ServiceController._instance = (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(ServiceController, arguments, function(){});
  };

  function ServiceController() {
    this._callError = __bind(this._callError, this);
    this._callComplete = __bind(this._callComplete, this);
  }

  ServiceController.prototype.call = function(params, showBlocker) {
    var apiCall;
    if (showBlocker == null) {
      showBlocker = true;
    }
    if (showBlocker) {
      app.blocker.show();
    }
    apiCall = API.call(params);
    apiCall.path = params['url'];
    apiCall.hasBlocker = showBlocker;
    apiCall.on(API.COMPLETE, this._callComplete);
    apiCall.on(API.ERROR, this._callError);
    return apiCall;
  };

  ServiceController.prototype.cancel = function(apiCall) {
    return apiCall.cancel();
  };

  ServiceController.prototype.setURLParams = function(params, clearParams, update) {
    var k, pathData, v, _i, _len, _params;
    if (clearParams == null) {
      clearParams = null;
    }
    if (update == null) {
      update = false;
    }
    pathData = app.router.getParsedPath();
    if (!update) {
      _params = params;
    } else {
      _params = pathData['params'] || {};
      for (k in params) {
        v = params[k];
        _params[k] = v;
      }
      if (clearParams) {
        for (_i = 0, _len = clearParams.length; _i < _len; _i++) {
          k = clearParams[_i];
          delete _params[k];
        }
      }
    }
    params = [];
    for (k in _params) {
      v = _params[k];
      params.push(k + '=' + encodeURIComponent(v));
    }
    return app.router.goto(pathData['path'] + '?' + params.join('&'), null, false);
  };

  ServiceController.prototype.getURLParams = function() {
    var _params;
    return _params = app.router.getParsedPath()['params'] || {};
  };

  ServiceController.prototype._callComplete = function(e, data) {
    var url;
    if (e.target.hasBlocker) {
      app.blocker.hide();
    }
    if (!data) {
      return;
    }
    if (data['__user'] != null) {
      app.user.setUser(data['__user']);
    }
    if (data['goto']) {
      app.viewController.goto(data['goto']);
    }
    if (data['refresh']) {
      app.viewController.goto(app.router.getCurrentPath());
    }
    if (data['notification']) {
      app.notification.showNotifications(data['notification']);
    }
    if (data['__interface']) {
      app.viewController.renderInterface('index', data.__interface, data);
      if (app.user.logged) {
        url = app.router.getCurrentPath();
        if (!url) {
          url = '/';
        }
        return this.call({
          url: url
        });
      }
    } else if (data['__view']) {
      app.viewController.addView(e.target.path, data.__view);
      return app.viewController.renderView(e.target.path, data);
    }
  };

  ServiceController.prototype._callError = function(data) {
    if (data.target.hasBlocker) {
      app.blocker.hide();
    }
    switch (data.code) {
      case 1:
        return app.viewController.getInterface();
      case 2:
        return app.notification.showNotifications({
          message: data['message'],
          type: 1
        });
    }
  };

  return ServiceController;

})(EventDispatcher);

var ComponentController, components,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

components = {};

ComponentController = (function() {
  ComponentController.getInstance = function() {
    return ComponentController._instance != null ? ComponentController._instance : ComponentController._instance = (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(ComponentController, arguments, function(){});
  };

  function ComponentController(target) {
    if (target == null) {
      target = document.body;
    }
    this._domChanged = __bind(this._domChanged, this);
    this._mutationChanged = __bind(this._mutationChanged, this);
    this._sortComponents = __bind(this._sortComponents, this);
    this._listComponents = __bind(this._listComponents, this);
    this._target = target;
    this._listComponents();
    if (MutationObserver) {
      this._mutationObserver = new MutationObserver(this._mutationChanged);
      this._mutationObserver.observe(target, {
        childList: true,
        subtree: true
      });
    } else {
      target.addEventListener('DOMSubtreeModified', this._domInserted);
    }
  }

  ComponentController.prototype._listComponents = function() {
    var component, k;
    this._components = [];
    for (k in components) {
      component = components[k];
      this._components.push(component);
    }
    return this._components = this._components.sort(this._sortComponents);
  };

  ComponentController.prototype._sortComponents = function(a, b) {
    var sortOrder;
    sortOrder = 0;
    if (a.ORDER != null) {
      if (b.ORDER != null) {
        if (a.ORDER > b.ORDER) {
          sortOrder = -1;
        } else if (a.ORDER < b.ORDER) {
          sortOrder = 1;
        } else {
          sortOrder = 0;
        }
      } else {
        sortOrder = -1;
      }
    } else {
      if (b.ORDER != null) {
        sortOrder = 1;
      } else {
        sortOrder = 0;
      }
    }
    return sortOrder;
  };

  ComponentController.prototype.parse = function(target) {
    var component, item, items, _i, _len, _ref, _results;
    if (target == null) {
      target = null;
    }
    return;
    if (!target) {
      target = this._target;
    }
    _ref = this._components;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      component = _ref[_i];
      items = target.querySelectorAll(component.SELECTOR);
      _results.push((function() {
        var _j, _len1, _results1;
        _results1 = [];
        for (_j = 0, _len1 = items.length; _j < _len1; _j++) {
          item = items[_j];
          if (!item.getInstance()) {
            _results1.push(new component({
              element: item
            }));
          } else {
            _results1.push(void 0);
          }
        }
        return _results1;
      })());
    }
    return _results;
  };

  ComponentController.prototype._mutationChanged = function(mutation) {
    var component, item, items, k, mut, _i, _j, _len, _len1, _ref, _results;
    _ref = this._components;
    for (k in _ref) {
      component = _ref[k];
      items = this._target.querySelectorAll(component.SELECTOR);
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        if (!item.getInstance()) {
          new component({
            element: item
          });
        }
      }
    }
    _results = [];
    for (_j = 0, _len1 = mutation.length; _j < _len1; _j++) {
      mut = mutation[_j];
      _results.push((function() {
        var _k, _len2, _ref1, _ref2, _results1;
        _ref1 = mut.removedNodes;
        _results1 = [];
        for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
          item = _ref1[_k];
          _results1.push((_ref2 = item.getInstance()) != null ? _ref2.destroy() : void 0);
        }
        return _results1;
      })());
    }
    return _results;
  };

  ComponentController.prototype._domChanged = function() {
    var component, i, item, items, k, _i, _len, _ref, _results;
    if (this._items == null) {
      this._items = [];
    }
    _ref = this._components;
    for (k in _ref) {
      component = _ref[k];
      items = target.querySelectorAll(component.SELECTOR);
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        if (!item.getInstance()) {
          this._items.push(new component({
            element: item
          }));
        }
      }
    }
    i = this._items.length;
    _results = [];
    while (i-- > 0) {
      item = this._items[i];
      if (!item.element.parentNode) {
        item.destroy();
        _results.push(this._items[i].splice(i, 1));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  return ComponentController;

})();

var ViewController;

ViewController = (function() {
  ViewController.getInstance = function() {
    return ViewController._instance != null ? ViewController._instance : ViewController._instance = (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(ViewController, arguments, function(){});
  };

  function ViewController() {
    this._body = new BaseDOM({
      element: document.querySelector('#wrapper')
    });
  }

  ViewController.prototype.getInterface = function(logged) {
    if (logged == null) {
      logged = false;
    }
    return app.serviceController.call({
      url: 'index/view'
    });
  };

  ViewController.prototype.addView = function(id, template) {
    return Template.addTemplate(id, template);
  };

  ViewController.prototype.renderInterface = function(id, template, data) {
    var main;
    this.addView('__interface', template);
    this.renderView('__interface', data, this._body);
    main = document.querySelector('main');
    if (main) {
      return this._container = main.getInstance() || new BaseDOM({
        element: main
      });
    } else {
      return this._container = null;
    }
  };

  ViewController.prototype.renderView = function(id, data, target) {
    if (target == null) {
      target = null;
    }
    if (!target) {
      target = this._container;
    }
    if (!target) {
      return;
    }
    if (target instanceof BaseDOM) {
      target.removeAll();
      target = target.element;
    }
    Template.renderTemplate(id, target, data);
    return app.componentController.parse();
  };

  ViewController.prototype.goto = function(path) {
    if (!Template.hasTemplate(path)) {
      app.serviceController.call({
        url: path,
        __v: true
      });
    } else {
      app.serviceController.call({
        url: path,
        __v: false
      });
    }
    return app.router.goto(path);
  };

  return ViewController;

})();

var User,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

User = (function(_super) {
  __extends(User, _super);

  User.PING_TIMEOUT = 10;

  function User() {
    this._pingComplete = __bind(this._pingComplete, this);
    this._ping = __bind(this._ping, this);
    this._firstTime = true;
  }

  User.get({
    name: function() {
      return this._name;
    }
  });

  User.get({
    id: function() {
      return this._id;
    }
  });

  User.get({
    role: function() {
      return this._role;
    }
  });

  User.get({
    roleName: function() {
      return this._roleName;
    }
  });

  User.get({
    logged: function() {
      return ~~this._id;
    }
  });

  User.prototype.setUser = function(data) {
    if (data == null) {
      data = null;
    }
    if (!data) {
      this._stopPing();
      this._name = null;
      this._id = null;
      this._role = null;
    } else if (this._id !== data['id']) {
      this._startPing();
      this._name = data['name'];
      this._id = data['id'];
      this._role = data['role'];
      this._roleName = data['roleName'];
      if (!this._firstTime) {
        app.viewController.getInterface();
      }
    }
    return this._firstTime = false;
  };

  User.prototype.logout = function() {
    return 1;
  };

  User.prototype._startPing = function() {
    return this._pingTimeout = setTimeout(this._ping, User.PING_TIMEOUT * 1000);
  };

  User.prototype._stopPing = function() {
    clearTimeout(this._pingTimeout);
    return this._pingTimeout = null;
  };

  User.prototype._ping = function() {
    if (!this._pingTimeout) {
      return;
    }
    return app.serviceController.call({
      url: 'user/ping',
      onComplete: this._pingComplete
    }, false);
  };

  User.prototype._pingComplete = function() {
    if (this._pingTimeout) {
      return this._startPing();
    }
  };

  return User;

})(EventDispatcher);

var Notification,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Notification = (function(_super) {
  var NotificationItem;

  __extends(Notification, _super);

  Notification.DEFAULT_TIMEOUT = 10;

  function Notification() {
    this._hideNotification = __bind(this._hideNotification, this);
    this._showNotification = __bind(this._showNotification, this);
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
      _results.push(this.showNotification(item));
    }
    return _results;
  };

  Notification.prototype.showNotification = function(item) {
    var target;
    target = document.querySelector('notification');
    if (!target) {
      target = document.body;
    }
    if (!target.getInstance()) {
      target = new BaseDOM({
        element: target
      });
    } else {
      target = target.getInstance();
    }
    item = new NotificationItem(item);
    return target.appendChildAt(item);
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
      if (data['message']) {
        this.text = data['message'];
      }
      if (data['type']) {
        this.addClass('p' + data['type']);
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

var Blocker,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Blocker = (function(_super) {
  __extends(Blocker, _super);

  function Blocker() {
    Blocker.__super__.constructor.call(this, {
      element: 'div',
      className: 'blocker'
    });
    this.css({
      display: 'none'
    });
  }

  Blocker.prototype.show = function(showLoader) {
    if (showLoader == null) {
      showLoader = true;
    }
    if (!this.element.parentNode) {
      document.body.appendChild(this.element);
    }
    return this.css({
      display: 'block'
    });
  };

  Blocker.prototype.hide = function() {
    return this.css({
      display: 'none'
    });
  };

  return Blocker;

})(BaseDOM);

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

components.Table = (function(_super) {
  var TableHeader;

  __extends(Table, _super);

  Table.SELECTOR = 'table';

  function Table() {
    this._dataLoaded = __bind(this._dataLoaded, this);
    this._headerClick = __bind(this._headerClick, this);
    this._parseHeader = __bind(this._parseHeader, this);
    Table.__super__.constructor.apply(this, arguments);
    this._values = {};
    this._parseHeader();
    this._update = this.attr('update');
  }

  Table.prototype.destroy = function() {
    this.removeAll();
    return this.off();
  };

  Table.prototype._parseHeader = function() {
    var head, heads, i, sort, _results;
    heads = this.findAll('thead th');
    i = heads.length;
    _results = [];
    while (i-- > 0) {
      head = heads[i];
      sort = head.getAttribute('sort');
      if (!sort || sort.length === 0) {
        continue;
      }
      head = new TableHeader(head);
      _results.push(head.on('click', this._headerClick));
    }
    return _results;
  };

  Table.prototype._headerClick = function(e, value) {
    return this.update({
      'sort': value
    });
  };

  Table.prototype.update = function(values) {
    var k, v, _ref;
    if (!this._update) {
      return;
    }
    if ((_ref = this._service) != null) {
      _ref.cancel();
    }
    for (k in values) {
      v = values[k];
      switch (k) {
        case 'search':
          delete this._values['_index'];
          break;
        case 'sort':
          if (this._values['sort'] && this._values['sort'] === v) {
            v = '-' + v;
          }
      }
      this._values[k] = v;
    }
    app.serviceController.setURLParams(this._values);
    return this._service = app.serviceController.call({
      url: this._update,
      onComplete: this._dataLoaded,
      data: this._values
    }, false);
  };

  Table.prototype._dataLoaded = function(e, data) {
    var target, targets, _i, _len, _ref, _ref1, _results;
    if ((_ref = this.element.templateNode.find('tbody')) != null) {
      _ref.update(data.items, data.items);
    }
    targets = document.querySelectorAll('[for="' + this.attr('id') + '"]');
    _results = [];
    for (_i = 0, _len = targets.length; _i < _len; _i++) {
      target = targets[_i];
      _results.push((_ref1 = target.getInstance()) != null ? typeof _ref1.update === "function" ? _ref1.update(data) : void 0 : void 0);
    }
    return _results;
  };

  TableHeader = (function(_super1) {
    __extends(TableHeader, _super1);

    function TableHeader(el) {
      this._click = __bind(this._click, this);
      TableHeader.__super__.constructor.call(this, {
        element: el
      });
      this.css({
        cursor: 'pointer'
      });
      this._icon = new BaseDOM({
        element: 'i',
        className: 'sort-icon'
      });
      this.appendChild(this._icon);
      this.element.on('click', this._click);
      this._value = this.attr('sort');
    }

    TableHeader.prototype._click = function() {
      return this.trigger('click', this._value);
    };

    return TableHeader;

  })(BaseDOM);

  return Table;

})(BaseDOM);

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

components.SearchInput = (function(_super) {
  __extends(SearchInput, _super);

  SearchInput.SELECTOR = 'input.search';

  SearchInput.ORDER = 0;

  function SearchInput() {
    this._updateTarget = __bind(this._updateTarget, this);
    this._update = __bind(this._update, this);
    SearchInput.__super__.constructor.apply(this, arguments);
    this._checkAttributes();
    this.element.on('change', this._update);
    this.element.on('keydown', this._update);
    this.element.on('keyup', this._update);
  }

  SearchInput.prototype.destroy = function() {};

  SearchInput.prototype._checkAttributes = function() {
    if (this.attr('maxlength')) {
      this._maxLength = Number(this.attr('maxlength'));
      this._charCounter = new CharCounter(this._maxLength);
      return this.element.parentNode.appendChild(this._charCounter);
    }
  };

  SearchInput.prototype._update = function() {
    var value;
    value = this.element.value.trim().toLowerCase();
    if (value !== this._value) {
      clearTimeout(this._updateTimeout);
      this._value = value;
      return this._updateTimeout = setTimeout(this._updateTarget, 300);
    }
  };

  SearchInput.prototype._updateTarget = function() {
    var _ref;
    if (!this._target) {
      this._target = (_ref = document.getElementById(this.attr('for'))) != null ? _ref.getInstance() : void 0;
    }
    if (!this._target) {
      return;
    }
    return this._target.update({
      'search': this._value
    });
  };

  return SearchInput;

})(BaseDOM);

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

components.Pagination = (function(_super) {
  __extends(Pagination, _super);

  Pagination.SELECTOR = '.pagination';

  Pagination.NUM_VISIBLE_PAGES = 15;

  function Pagination() {
    this._updateTarget = __bind(this._updateTarget, this);
    this._lastClick = __bind(this._lastClick, this);
    this._firstClick = __bind(this._firstClick, this);
    this._nextClick = __bind(this._nextClick, this);
    this._prevClick = __bind(this._prevClick, this);
    this._pageClick = __bind(this._pageClick, this);
    this._create = __bind(this._create, this);
    Pagination.__super__.constructor.apply(this, arguments);
    this._templateNode = this.element.templateNode;
    this._pageTemplate = this._templateNode.find('button', {
      'class': 'page'
    });
    this._currentPage = 0;
    setTimeout(this._create, 0);
  }

  Pagination.prototype._create = function() {
    var _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
    this._prevBtn = this.find('.prev', true);
    this._nextBtn = this.find('.next', true);
    this._firstBtn = this.find('.first', true);
    this._lastBtn = this.find('.last', true);
    if ((_ref = this._prevBtn) != null) {
      _ref.element.on('click', this._prevClick);
    }
    if ((_ref1 = this._nextBtn) != null) {
      _ref1.element.on('click', this._nextClick);
    }
    if ((_ref2 = this._firstBtn) != null) {
      _ref2.element.on('click', this._firstClick);
    }
    if ((_ref3 = this._lastBtn) != null) {
      _ref3.element.on('click', this._lastClick);
    }
    this._pagesContainer = new BaseDOM({
      element: 'span'
    });
    if ((_ref4 = this._nextBtn) != null) {
      _ref4.element.parentNode.insertBefore(this._pagesContainer.element, (_ref5 = this._nextBtn) != null ? _ref5.element : void 0);
    }
    return this.update(this._templateNode.data);
  };

  Pagination.prototype.destroy = function() {
    this.removeAll();
    return this.off();
  };

  Pagination.prototype.update = function(data) {
    this._total = data.total;
    this._numItems = data.numItems;
    this._currentPage = data.index / this._numItems;
    this._totalPages = Math.ceil(this._total / this._numItems);
    return this.goto(this._currentPage);
  };

  Pagination.prototype.goto = function(page) {
    var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
    if (page <= 0) {
      page = 0;
      if ((_ref = this._prevBtn) != null) {
        _ref.enable(false);
      }
      if ((_ref1 = this._firstBtn) != null) {
        _ref1.enable(false);
      }
    } else {
      if ((_ref2 = this._prevBtn) != null) {
        _ref2.enable(true);
      }
      if ((_ref3 = this._firstBtn) != null) {
        _ref3.enable(true);
      }
    }
    if (page >= this._totalPages - 1) {
      page = this._totalPages - 1;
      if ((_ref4 = this._nextBtn) != null) {
        _ref4.enable(false);
      }
      if ((_ref5 = this._lastBtn) != null) {
        _ref5.enable(false);
      }
    } else {
      if ((_ref6 = this._nextBtn) != null) {
        _ref6.enable(true);
      }
      if ((_ref7 = this._lastBtn) != null) {
        _ref7.enable(true);
      }
    }
    if (this._currentPage !== page) {
      this._currentPage = page;
      this._updateTarget();
    }
    return this._buildPages();
  };

  Pagination.prototype._buildPages = function() {
    var halfPages, init, item, page, _i, _ref, _results;
    this._clear();
    halfPages = Pagination.NUM_VISIBLE_PAGES >> 1;
    init = this._currentPage - halfPages;
    if (init + Pagination.NUM_VISIBLE_PAGES >= this._totalPages) {
      init = this._totalPages - Pagination.NUM_VISIBLE_PAGES;
    }
    if (init < 0) {
      init = 0;
    }
    _results = [];
    for (page = _i = init, _ref = init + Pagination.NUM_VISIBLE_PAGES; init <= _ref ? _i < _ref : _i > _ref; page = init <= _ref ? ++_i : --_i) {
      item = this._pageTemplate.render(this._pagesContainer.element, {
        page: (page + 1).toString()
      }, null, true);
      if (item) {
        item = item.getInstance() || new BaseDOM({
          element: item
        });
        item.value = page;
        if (page === this._currentPage) {
          _results.push(item.addClass('selected p3'));
        } else {
          _results.push(item.element.on('click', this._pageClick));
        }
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Pagination.prototype._pageClick = function(e) {
    return this.goto(e.currentTarget.getInstance().value);
  };

  Pagination.prototype._clear = function() {
    var item, items, _i, _len;
    items = this._pagesContainer.findAll('*', true);
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      if (typeof item.off === "function") {
        item.off();
      }
      if (typeof item.destroy === "function") {
        item.destroy();
      }
    }
    return this._pagesContainer.removeAll();
  };

  Pagination.prototype._prev = function() {
    return this.goto(this._currentPage - 1);
  };

  Pagination.prototype._next = function() {
    return this.goto(this._currentPage + 1);
  };

  Pagination.prototype._prevClick = function() {
    return this._prev();
  };

  Pagination.prototype._nextClick = function() {
    return this._next();
  };

  Pagination.prototype._firstClick = function() {
    return this.goto(0);
  };

  Pagination.prototype._lastClick = function() {
    return this.goto(this._totalPages - 1);
  };

  Pagination.prototype._updateTarget = function() {
    var _ref;
    if (!this._target) {
      this._target = (_ref = document.getElementById(this.attr('for'))) != null ? _ref.getInstance() : void 0;
    }
    if (!this._target) {
      return;
    }
    return this._target.update({
      '_index': this._currentPage * this._numItems
    });
  };

  return Pagination;

})(BaseDOM);

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

components.Input = (function(_super) {
  var CharCounter;

  __extends(Input, _super);

  Input.SELECTOR = 'input,select,textarea';

  function Input() {
    this._blur = __bind(this._blur, this);
    this._update = __bind(this._update, this);
    this._focus = __bind(this._focus, this);
    Input.__super__.constructor.apply(this, arguments);
    this._checkAttributes();
    this.element.on('focus', this._focus);
    this.element.on('blur', this._blur);
    this.element.on('change', this._update);
    this.element.on('keydown', this._update);
    this.element.on('keyup', this._update);
  }

  Input.prototype.destroy = function() {};

  Input.prototype._checkAttributes = function() {
    if (this.attr('maxlength')) {
      this._maxLength = Number(this.attr('maxlength'));
      this._charCounter = new CharCounter(this._maxLength);
      return this.element.parentNode.appendChild(this._charCounter);
    }
  };

  Input.prototype._focus = function() {
    if (this._charCounter) {
      this._charCounter.show();
    }
    return this._update();
  };

  Input.prototype._update = function() {
    var value, _ref;
    value = this.element.value;
    return (_ref = this._charCounter) != null ? _ref.update(value.length) : void 0;
  };

  Input.prototype._blur = function() {
    var _ref;
    return (_ref = this._charCounter) != null ? _ref.hide() : void 0;
  };

  CharCounter = (function(_super1) {
    __extends(CharCounter, _super1);

    function CharCounter(_maxLength) {
      this._maxLength = _maxLength;
      CharCounter.__super__.constructor.call(this, {
        element: 'span',
        className: 'charCounter hidden'
      });
      this.css({
        position: 'absolute',
        right: '0px',
        top: '0px'
      });
    }

    CharCounter.prototype.update = function(_currentLength) {
      this._currentLength = _currentLength;
      return this.text = this._maxLength - this._currentLength;
    };

    CharCounter.prototype.show = function() {
      this.removeClass('hidden');
      this.addClass('show-up');
      return this.removeClass('hide-up');
    };

    CharCounter.prototype.hide = function() {
      this.addClass('hide-up');
      return this.removeClass('show-up');
    };

    return CharCounter;

  })(BaseDOM);

  return Input;

})(BaseDOM);

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

components.Form = (function(_super) {
  __extends(Form, _super);

  Form.SELECTOR = 'form';

  function Form() {
    this._submitError = __bind(this._submitError, this);
    this._submitComplete = __bind(this._submitComplete, this);
    this._submit = __bind(this._submit, this);
    Form.__super__.constructor.apply(this, arguments);
    this.element.on('submit', this._submit);
  }

  Form.prototype.destroy = function() {
    this.element.on('submit', this._submit);
    this.removeAll();
    return this.off();
  };

  Form.prototype.addComponent = function(component) {};

  Form.prototype.removeComponent = function() {};

  Form.prototype._submit = function(e) {
    var formData;
    e.stopPropagation();
    e.preventDefault();
    formData = new FormData(this.element);
    return app.serviceController.call({
      url: this.attr('action'),
      data: formData,
      onComplete: this._submitComplete,
      onError: this._submitError
    });
  };

  Form.prototype._submitComplete = function() {
    var _base;
    return typeof (_base = this.element).reset === "function" ? _base.reset() : void 0;
  };

  Form.prototype._submitError = function() {};

  return Form;

})(BaseDOM);

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

components.Button = (function(_super) {
  __extends(Button, _super);

  Button.SELECTOR = 'button';

  function Button() {
    this._click = __bind(this._click, this);
    Button.__super__.constructor.apply(this, arguments);
    this._enabled = true;
    this.element.on('click', this._click);
  }

  Button.prototype.destroy = function() {
    this.removeAll();
    this.off();
    return this.element.off('click', this._click);
  };

  Button.prototype.enable = function(enabled) {
    if (enabled == null) {
      enabled = true;
    }
    if (enabled) {
      this.removeClass('disabled');
    } else {
      this.addClass('disabled');
    }
    return this._enabled = enabled;
  };

  Button.prototype._click = function(e) {
    if (!this._enabled) {
      e.preventDefault();
      return e.stopPropagation();
    }
  };

  return Button;

})(BaseDOM);

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

components.Anchor = (function(_super) {
  __extends(Anchor, _super);

  Anchor.SELECTOR = 'a[href],button[href]';

  function Anchor() {
    this._click = __bind(this._click, this);
    var href;
    Anchor.__super__.constructor.apply(this, arguments);
    href = this.attr('href');
    if (!href || href.length === 0) {
      this.element.removeAttribute('href');
      return;
    }
    this.element.on('click', this._click);
  }

  Anchor.prototype.destroy = function() {
    this.removeAll();
    this.off();
    return this.element.off('click', this._click);
  };

  Anchor.prototype._click = function(e) {
    var href, _ref;
    href = this.attr('href');
    if (!href || /^http/i.test(href) || /blank/i.test(((_ref = this.attr('target')) != null ? _ref.toLowerCase() : void 0) || '')) {
      if (this.element.tagName.toLowerCase() === 'button') {
        window.open(href, this.attr('target'));
      }
      return;
    }
    e.stopPropagation();
    e.preventDefault();
    return app.viewController.goto(href);
  };

  return Anchor;

})(BaseDOM);

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

components.ActionButton = (function(_super) {
  __extends(ActionButton, _super);

  ActionButton.SELECTOR = 'button[action]';

  ActionButton.ORDER = 0;

  function ActionButton() {
    this._click = __bind(this._click, this);
    ActionButton.__super__.constructor.apply(this, arguments);
    this._enabled = true;
    this.element.on('click', this._click);
  }

  ActionButton.prototype.destroy = function() {
    this.removeAll();
    this.off();
    return this.element.off('click', this._click);
  };

  ActionButton.prototype.enable = function(enabled) {
    if (enabled == null) {
      enabled = true;
    }
    if (enabled) {
      this.removeClass('disabled');
    } else {
      this.addClass('disabled');
    }
    return this._enabled = enabled;
  };

  ActionButton.prototype._click = function() {
    ActionButton.__super__._click.apply(this, arguments);
    if (!this._enabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    return app.serviceController.call({
      url: this.attr('action')
    });
  };

  return ActionButton;

})(BaseDOM);

var Main,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Main = (function() {
  function Main() {
    this._loadComplete = __bind(this._loadComplete, this);
    this._error = __bind(this._error, this);
    this._indexComplete = __bind(this._indexComplete, this);
    this._routeChange = __bind(this._routeChange, this);
    var _ref;
    app.basePath = ((_ref = document.querySelector('base')) != null ? _ref.href : void 0) || '';
    Template.setRootPath(app.basePath + '../api/view/cms/');
    Template.setExtension('');
    app.blocker = new Blocker();
    API.ROOT_PATH = app.basePath + '../api/cms/';
    app.serviceController = ServiceController.getInstance();
    app.user = new User();
    app.router = new NavigationRouter();
    app.router.init(app.basePath);
    app.router.on(NavigationRouter.CHANGE, this._routeChange);
    app.componentController = ComponentController.getInstance();
    app.viewController = ViewController.getInstance();
    app.viewController.getInterface();
    app.notification = new Notification();
    app.componentController.parse();
  }

  Main.prototype._routeChange = function() {
    return console.log(arguments);
  };

  Main.prototype._indexComplete = function() {
    return console.log(arguments);
  };

  Main.prototype._error = function() {
    return console.log("ERR");
  };

  Main.prototype._loadComplete = function() {};

  return Main;

})();

app.on(App.WINDOW_LOAD, function() {
  return new Main();
});

}).call(this);
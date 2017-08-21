#!/usr/bin/env node
(function() {
var __bind=function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
__hasProp={}.hasOwnProperty,
__indexOf=[].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
__extends=function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) Object.defineProperty(child, key, Object.getOwnPropertyDescriptor(parent, key)); } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
var EventDispatcher;
EventDispatcher = (function() {
  function EventDispatcher() {
    this._triggerNative = __bind(this._triggerNative, this);
    this.trigger = __bind(this.trigger, this);
  }
  EventDispatcher.prototype._events = null;
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
    if (!p_event) {
      this.offAll();
      return;
    }
    if (events = this._events[p_event]) {
      if (!p_handler) {
        return this._events[p_event].length = 0;
      } else {
        while ((i = events.indexOf(p_handler)) >= 0) {
          events.splice(i, 1);
        }
        return this._events[p_event] = events;
      }
    } else if (!p_event) {
      return this.offAll();
    }
  };
  EventDispatcher.prototype.offAll = function() {
    this._events = {};
    return false;
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
  EventDispatcher.prototype._triggerNative = function(p_event) {
    var events, i, _results;
    if (!this._events) {
      this._events = {};
    }
    events = this._events[p_event.type];
    if (!events || events.length === 0) {
      return;
    }
    i = events.length;
    p_event.targetClass = this;
    _results = [];
    while (i-- > 0) {
      _results.push(typeof events[i] === "function" ? events[i](p_event) : void 0);
    }
    return _results;
  };
  EventDispatcher.prototype.hasEvent = function(p_event, p_handler) {
    var event;
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
var Watcher;
Watcher = (function(_super) {
  __extends(Watcher, _super);
  Watcher.CHANGED = 'watcherChanged';
  Watcher.ADDED = 'watcherAdded';
  Watcher.REMOVED = 'watcherRemoved';
  function Watcher() {
    this._paths = [];
    this._pathWatcher = {};
  }
  Watcher.prototype.pathExists = function(file) {
    if (this._pathWatcher[file]) {
      return true;
    }
    return false;
  };
  Watcher.prototype.addPath = function(file, trigger) {
    var files, stat, w;
    if (trigger == null) {
      trigger = false;
    }
    file = path.resolve(file);
    if (this.pathExists(file)) {
      return this._pathWatcher[file];
    }
    w = fs.watch(file, this._pathChange);
    w._parent = this;
    w._file = file;
    this._paths[this._paths.length] = {
      file: file,
      watcher: w
    };
    this._pathWatcher[file] = w;
    if (trigger) {
      stat = fs.statSync(file);
      if (stat.isDirectory()) {
        files = this._parsePaths(file);
        this.trigger(Watcher.ADDED, files);
        return files;
      }
    }
    return w;
  };
  Watcher.prototype.removeAll = function() {
    var i;
    i = this._paths.length;
    while (i-- > 0) {
      this._paths[i].watcher.close();
    }
    delete this._pathWatcher;
    this._paths.length = 0;
    return this._pathWatcher = {};
  };
  Watcher.prototype.removePath = function(file) {
    var fileRE, i, _results;
    i = this._paths.length;
    fileRE = file.replace(/(\W)/g, '\\$1');
    fileRE = new RegExp('^' + fileRE, 'g');
    _results = [];
    while (i-- > 0) {
      fileRE.lastIndex = 0;
      if (fileRE.test(this._paths[i].file)) {
        this._paths[i].watcher.close();
        this._paths.splice(i, 1);
        this._pathWatcher[this._paths[i].file];
        _results.push(delete this._pathWatcher[this._paths[i].file]);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Watcher.prototype._parsePaths = function(file) {
    var fileList, files, fl, i, p, stat;
    file = file.rtrim('/') + '/';
    stat = fs.statSync(file);
    if (!stat.isDirectory()) {
      return;
    }
    files = fs.readdirSync(file);
    i = files.length;
    fileList = [];
    while (i-- > 0) {
      p = file + files[i];
      fileList.push(p);
      stat = fs.statSync(p);
      if (!stat.isSymbolicLink() && stat.isDirectory()) {
        fl = this._parsePaths(p);
        fileList = [].concat(fl, fileList);
      }
    }
    this.addPath(file);
    return fileList;
  };
  Watcher.prototype._pathChange = function(type, file) {
    var parent, stat;
    parent = this._parent;
    file = path.resolve(this._file + '/' + file);
    if (fs.existsSync(file)) {
      parent.trigger(Watcher.CHANGED, file);
      stat = fs.statSync(file);
      if (stat.isDirectory()) {
        return parent.addPath(file, true);
      }
    } else {
      parent.removePath(file);
      return parent.trigger(Watcher.REMOVED, file);
    }
  };
  return Watcher;
})(EventDispatcher);
var Log,
  __slice = [].slice;
Log = (function() {
  function Log() {}
  Log.COLORS = {
    'black': 0,
    'red': 1,
    'green': 2,
    'yellow': 3,
    'blue': 4,
    'magenta': 5,
    'cyan': 6,
    'white': 7
  };
  Log.setStyle = function(color, background) {
    var set;
    if (color == null) {
      color = 'white';
    }
    if (background == null) {
      background = null;
    }
    set = [];
    if (!this.COLORS[color]) {
      color = 'white';
    }
    set.push('3' + this.COLORS[color]);
    if (background && this.COLORS[background]) {
      set.push('4' + this.COLORS[background]);
    }
    set.push('22m');
    return process.stdout.write('\x1b[' + set.join(';'));
  };
  Log.log = function() {
    return console.log(value);
  };
  Log.print = function() {
    var value;
    value = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    process.stdout.write(value.join(' '));
    return process.stdout.write('\x1b[0m');
  };
  Log.println = function() {
    var value;
    value = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    process.stdout.write(value.join(' '));
    return process.stdout.write('\x1b[0m\n');
  };
  Log._test = function(data) {
    process.stdout.off('data', Log._test);
    return console.log("Received", data);
  };
  return Log;
})();
var Notifier;
Notifier = (function() {
  function Notifier() {}
  Notifier.notify = function(title, message) {
    if (message == null) {
      message = '';
    }
    return exec("osascript -e 'display notification \"" + message + "\" with title \"" + title + "\"'");
  };
  return Notifier;
})();
var Versioner;
Versioner = (function(_super) {
  var path, resultDate, resultVersion, running;
  __extends(Versioner, _super);
  running = false;
  path = null;
  resultVersion = null;
  resultDate = null;
  Versioner.prototype.versionRegex = /(SL_PROJECT_VERSION):\d.\d.\d/g;
  Versioner.prototype.dateRegex = /(SL_PROJECT_DATE):[\d]+/g;
  function Versioner(p_path) {
    this.nextVersion = __bind(this.nextVersion, this);
    this.readFile = __bind(this.readFile, this);
    this.notify = __bind(this.notify, this);
    path = p_path;
    this.readFile(p_path);
    Versioner.__super__.constructor.apply(this, arguments);
  }
  Versioner.prototype.notify = function(p_text, p_color) {
    if (p_color == null) {
      p_color = null;
    }
    Log.println();
    if (p_color != null) {
      Log.setStyle(p_color);
    }
    Log.print(p_text);
    return Log.println();
  };
  Versioner.prototype.readFile = function(p_path) {
    var data, err;
    if (!this.hasFile() || this.running) {
      return;
    }
    try {
      this.running = true;
      data = fs.readFileSync(p_path, 'utf8');
    } catch (_error) {
      err = _error;
      this.notify(err, 'magenta');
    }
    if (this.versionRegex.test(data)) {
      resultVersion = String(data.match(this.versionRegex));
      resultDate = String(data.match(this.dateRegex));
    }
    return this.running = false;
  };
  Versioner.prototype.nextVersion = function(p_type) {
    var bugfix, build, now, release, values, version;
    if (!resultVersion || this.running) {
      return null;
    }
    this.running = true;
    version = resultVersion.replace('SL_PROJECT_VERSION:', '');
    now = resultDate.replace('SL_PROJECT_DATE:', '');
    values = version.split('.');
    release = parseInt(values[0]);
    build = parseInt(values[1]);
    bugfix = parseInt(values[2]);
    switch (p_type) {
      case 'release':
        release += 1;
        build = 0;
        bugfix = 0;
        now = Date.now();
        break;
      case 'build':
        build += 1;
        bugfix = 0;
        now = Date.now();
        break;
      case 'bugfix':
        bugfix += 1;
        now = Date.now();
    }
    resultDate = 'SL_PROJECT_DATE:' + now;
    resultVersion = 'SL_PROJECT_VERSION:' + release + '.' + build + '.' + bugfix;
    this.notify('Current project version: ' + release + '.' + build + '.' + bugfix, 'yellow');
    this.running = false;
    return [resultVersion, resultDate];
  };
  Versioner.prototype.hasFile = function() {
    var err, result;
    try {
      this.running = true;
      result = fs.statSync(path);
      if ((result != null) && result.isFile()) {
        this.running = false;
        return true;
      }
    } catch (_error) {
      err = _error;
    }
    return false;
  };
  return Versioner;
})(EventDispatcher);
var StylusCompiler;
StylusCompiler = (function() {
  var Task;
  function StylusCompiler() {
    this._tasks = [];
    this._running = false;
    this.ugly = false;
  }
  StylusCompiler.prototype.addTask = function(name, task) {
    return this._tasks[this._tasks.length] = new Task(name, task);
  };
  StylusCompiler.prototype.start = function(sourcePaths) {
    if (sourcePaths == null) {
      sourcePaths = [];
    }
    if (this._running) {
      return;
    }
    this._sourcePaths = sourcePaths;
    this._running = true;
    return this._runTasks();
  };
  StylusCompiler.prototype.stop = function() {
    if (!this._running) {
      return;
    }
    return this._running = false;
  };
  StylusCompiler.prototype.reset = function() {
    return 1;
  };
  StylusCompiler.prototype.update = function(file) {
    if (this._running) {
      return this._runTasks();
    }
  };
  StylusCompiler.prototype.remove = function(files) {
    return this._runTasks();
  };
  StylusCompiler.prototype.runTasks = function(ugly) {
    if (ugly == null) {
      ugly = false;
    }
    return this._runTasks(null, ugly);
  };
  StylusCompiler.prototype._runTasks = function(file, ugly) {
    var c, i, _results;
    if (file == null) {
      file = null;
    }
    if (ugly == null) {
      ugly = false;
    }
    ugly = ugly;
    this._initTime = new Date().getTime();
    Log.println();
    i = this._tasks.length;
    c = 0;
    _results = [];
    while (i-- > 0) {
      c++;
      _results.push(this._tasks[i].output(this._sourcePaths, ugly));
    }
    return _results;
  };
  Task = (function() {
    function Task(name, data) {
      var _ref;
      this.name = name;
      this.data = data;
      this._compiled = __bind(this._compiled, this);
      this.usedFiles = [];
      this.bare = (_ref = this.data.options) != null ? _ref.bare : void 0;
      this.isNode = this.data.isNode;
      if (this.data.depends) {
        this.depends = [].concat(this.data.depends);
      }
    }
    Task.prototype.output = function(sourcePaths, ugly) {
      var dir, i, l, opts, out, p, psrc, _results;
      if (ugly == null) {
        ugly = false;
      }
      this._initTime = new Date().getTime();
      Log.setStyle('magenta');
      Log.print('Compiling ' + this.name);
      if (ugly) {
        Log.setStyle('yellow');
        Log.print(' minified');
      }
      Log.println();
      p = path.resolve(this.data.output);
      dir = path.dirname(p);
      opts = {
        paths: sourcePaths,
        filename: path.basename(p)
      };
      if (ugly) {
        opts['compress'] = true;
      }
      if (!fs.existsSync(dir)) {
        this._mkdir(dir);
      }
      i = -1;
      l = sourcePaths.length;
      out = null;
      _results = [];
      while (++i < l) {
        psrc = path.resolve(sourcePaths[i] + this.data.src);
        if (fs.existsSync(psrc)) {
          exec('vendors/stylus/bin/stylus --include-css -u ./vendors/nib -c -I ' + sourcePaths.join(':') + ' ' + psrc + ' -o ' + p, this._compiled);
          break;
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    Task.prototype._compiled = function(error, output, errorMessage) {
      var p, t;
      if (error) {
        Log.setStyle('red');
        Log.print('Error compiling: ');
        Log.setStyle('cyan');
        Log.println(this.name);
        process.stdout.write(errorMessage);
        return;
      }
      p = path.resolve(this.data.output);
      Log.setStyle('green');
      Log.print('Saved to: ');
      Log.setStyle('magenta');
      Log.println(this.data.output);
      t = ((new Date().getTime() - this._initTime) * 0.001).toFixed(3);
      Log.setStyle('cyan');
      Log.println('In: ' + t + 's');
      return Notifier.notify('Compiler', 'Stylus compilation completed!');
    };
    Task.prototype._mkdir = function(dir) {
      var d;
      d = path.dirname(dir);
      if (!fs.existsSync(d)) {
        this._mkdir(d);
      }
      return fs.mkdirSync(dir);
    };
    return Task;
  })();
  return StylusCompiler;
})();
var LessCompiler;
LessCompiler = (function() {
  var Task;
  function LessCompiler() {
    this._tasks = [];
    this._running = false;
    this.ugly = false;
  }
  LessCompiler.prototype.addTask = function(name, task) {
    return this._tasks[this._tasks.length] = new Task(name, task);
  };
  LessCompiler.prototype.start = function(sourcePaths) {
    if (sourcePaths == null) {
      sourcePaths = [];
    }
    if (this._running) {
      return;
    }
    this._sourcePaths = sourcePaths;
    this._running = true;
    return this._runTasks();
  };
  LessCompiler.prototype.stop = function() {
    if (!this._running) {
      return;
    }
    return this._running = false;
  };
  LessCompiler.prototype.reset = function() {
    return 1;
  };
  LessCompiler.prototype.update = function(file) {
    if (this._running) {
      return this._runTasks();
    }
  };
  LessCompiler.prototype.remove = function(files) {
    return this._runTasks();
  };
  LessCompiler.prototype.runTasks = function(ugly) {
    if (ugly == null) {
      ugly = false;
    }
    return this._runTasks(null, ugly);
  };
  LessCompiler.prototype._runTasks = function(file, ugly) {
    var c, i, _results;
    if (file == null) {
      file = null;
    }
    if (ugly == null) {
      ugly = false;
    }
    ugly = ugly;
    this._initTime = new Date().getTime();
    Log.println();
    i = this._tasks.length;
    c = 0;
    _results = [];
    while (i-- > 0) {
      c++;
      _results.push(this._tasks[i].output(this._sourcePaths, ugly));
    }
    return _results;
  };
  Task = (function() {
    function Task(name, data) {
      var _ref;
      this.name = name;
      this.data = data;
      this._compiled = __bind(this._compiled, this);
      this.usedFiles = [];
      this.bare = (_ref = this.data.options) != null ? _ref.bare : void 0;
      this.isNode = this.data.isNode;
      if (this.data.depends) {
        this.depends = [].concat(this.data.depends);
      }
    }
    Task.prototype.output = function(sourcePaths, ugly) {
      var dir, i, l, opts, out, p, psrc, _results;
      if (ugly == null) {
        ugly = false;
      }
      this._initTime = new Date().getTime();
      Log.setStyle('magenta');
      Log.print('Compiling ' + this.name);
      if (ugly) {
        Log.setStyle('yellow');
        Log.print(' minified');
      }
      Log.println();
      p = path.resolve(this.data.output);
      dir = path.dirname(p);
      opts = {
        paths: sourcePaths,
        filename: path.basename(p)
      };
      if (ugly) {
        opts['compress'] = true;
      }
      if (!fs.existsSync(dir)) {
        this._mkdir(dir);
      }
      i = -1;
      l = sourcePaths.length;
      out = null;
      _results = [];
      while (++i < l) {
        psrc = path.resolve(sourcePaths[i] + this.data.src);
        if (fs.existsSync(psrc)) {
          exec('vendors/less/bin/lessc -x --verbose --include-path=' + sourcePaths.join(':') + ' ' + psrc + ' ' + p, this._compiled);
          break;
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    Task.prototype._compiled = function(error, output, errorMessage) {
      var p, t;
      if (error) {
        Log.setStyle('red');
        Log.print('Error compiling: ');
        Log.setStyle('cyan');
        Log.println(this.name);
        process.stdout.write(errorMessage);
        return;
      }
      p = path.resolve(this.data.output);
      Log.setStyle('green');
      Log.print('Saved to: ');
      Log.setStyle('magenta');
      Log.println(this.data.output);
      t = ((new Date().getTime() - this._initTime) * 0.001).toFixed(3);
      Log.setStyle('cyan');
      Log.println('In: ' + t + 's');
      return Notifier.notify('Compiler', 'Less compilation completed!');
    };
    Task.prototype._mkdir = function(dir) {
      var d;
      d = path.dirname(dir);
      if (!fs.existsSync(d)) {
        this._mkdir(d);
      }
      return fs.mkdirSync(dir);
    };
    return Task;
  })();
  return LessCompiler;
})();
var JSCompiler;
JSCompiler = (function() {
  var File, Task;
  function JSCompiler() {
    this._cache = {};
    this._tasks = [];
    this._usedFiles = [];
    this._running = false;
    this.ugly = false;
  }
  JSCompiler.prototype.addTask = function(name, task) {
    return this._tasks[this._tasks.length] = new Task(name, task);
  };
  JSCompiler.prototype.start = function(sourcePaths) {
    if (sourcePaths == null) {
      sourcePaths = [];
    }
    if (this._running) {
      return;
    }
    this._sourcePaths = sourcePaths;
    this._running = true;
    return this._runTasks();
  };
  JSCompiler.prototype.stop = function() {
    if (!this._running) {
      return;
    }
    return this._running = false;
  };
  JSCompiler.prototype.reset = function() {
    return 1;
  };
  JSCompiler.prototype.update = function(file) {
    if (this._cache[file]) {
      this._cache[file].update();
    } else {
      this._cache[file] = new File(file);
    }
    if (this._running) {
      return this._runTasks(file);
    }
  };
  JSCompiler.prototype.remove = function(files) {
    var file, i;
    files = [].concat(files);
    i = files.length;
    while (i-- > 0) {
      file = files[i];
      if (this._cache[file]) {
        this._cache[file].dispose();
        delete this._cache[file];
      }
    }
    return this._runTasks();
  };
  JSCompiler.prototype.runTasks = function(ugly) {
    if (ugly == null) {
      ugly = false;
    }
    return this._runTasks(null, ugly);
  };
  JSCompiler.prototype._runTasks = function(file, ugly) {
    var c, files, i, t;
    if (file == null) {
      file = null;
    }
    if (ugly == null) {
      ugly = false;
    }
    ugly = ugly;
    this._initTime = new Date().getTime();
    this._updateTasks();
    Log.println();
    i = this._tasks.length;
    c = 0;
    while (i-- > 0) {
      files = this._filterTask(this._tasks[i]);
      if (file) {
        if (files.indexOf(file) >= 0) {
          c++;
          this._tasks[i].output(ugly);
        }
      } else {
        c++;
        this._tasks[i].output(ugly);
      }
    }
    if (c > 0) {
      t = ((new Date().getTime() - this._initTime) * 0.001).toFixed(3);
      Log.setStyle('cyan');
      Log.println('In: ' + t + 's');
      return Notifier.notify('Compiler', 'JS compilation completed!');
    }
  };
  JSCompiler.prototype._updateTasks = function() {
    var i, _results;
    i = this._tasks.length;
    _results = [];
    while (i-- > 0) {
      this._tasks[i].filtered = false;
      this._tasks[i].usedBy = {};
      _results.push(this._tasks[i].update(this._cache, this._sourcePaths));
    }
    return _results;
  };
  JSCompiler.prototype._findTask = function(name) {
    var i;
    i = this._tasks.length;
    while (i-- > 0) {
      if (this._tasks[i].name === name) {
        return this._tasks[i];
      }
    }
    return null;
  };
  JSCompiler.prototype._filterTask = function(task) {
    var c, files, i, j, k, l, source, t, usedFiles;
    if (task.filtered) {
      return task.filteredFiles;
    }
    files = task.usedFiles;
    if (task.depends) {
      i = task.depends.length;
      while (i-- > 0) {
        t = this._findTask(task.depends[i]);
        if (!t) {
          continue;
        }
        usedFiles = this._filterTask(t);
        j = files.length;
        while (j-- > 0) {
          if ((k = files.indexOf(usedFiles[j])) >= 0) {
            files.splice(k, 1);
          }
        }
      }
    }
    task.filtered = true;
    task.filteredFiles = files;
    i = -1;
    l = files.length;
    source = '';
    while (++i < l) {
      c = this._cache[files[i]];
      if (c) {
        source += c.js + '\n';
      }
    }
    if (!task.bare) {
      source = '(function() {\n' + source + '}).call(this);';
    }
    if (task.isNode) {
      source = '#!/usr/bin/env node\n' + source;
    }
    task.rawSource = source;
    return files;
  };
  JSCompiler.prototype.parseFile = function() {};
  JSCompiler.prototype.fileChanged = function() {};
  Task = (function() {
    function Task(name, data) {
      var _ref;
      this.name = name;
      this.data = data;
      this.usedFiles = [];
      this.bare = (_ref = this.data.options) != null ? _ref.bare : void 0;
      this.isNode = this.data.isNode;
      if (this.data.depends) {
        this.depends = [].concat(this.data.depends);
      }
    }
    Task.prototype.update = function(cache, sourcePaths) {
      var files, k, src, usedFiles, v;
      this.usedFiles.length = 0;
      src = this.data.src;
      files = [];
      if (this.data.includes) {
        files = files.concat([].concat(this.data.includes));
      }
      files.push(this.data.src);
      for (k in cache) {
        v = cache[k];
        v.usedBy = {};
      }
      usedFiles = this._parseFilesRecursive(cache, sourcePaths, files);
      return this.usedFiles = this._removeDuplicates(usedFiles);
    };
    Task.prototype.output = function(ugly) {
      var dir, out, p;
      if (ugly == null) {
        ugly = false;
      }
      out = null;
      Log.setStyle('magenta');
      Log.print('Compiling ' + this.name);
      if (ugly) {
        Log.setStyle('yellow');
        Log.print(' minified');
      }
      Log.println();
      p = path.resolve(this.data.output);
      dir = path.dirname(p);
      if (!fs.existsSync(dir)) {
        this._mkdir(dir);
      }
      out = this.rawSource;
      if (ugly) {
        out = uglify.minify(out, {
          fromString: true,
          comments: true
        }).code;
      }
      fs.writeFileSync(p, out, {
        encoding: 'utf-8'
      });
      Log.setStyle('green');
      Log.print('Saved to: ');
      Log.setStyle('magenta');
      return Log.println(this.data.output);
    };
    Task.prototype._mkdir = function(dir) {
      var d;
      d = path.dirname(dir);
      if (!fs.existsSync(d)) {
        this._mkdir(d);
      }
      return fs.mkdirSync(dir);
    };
    Task.prototype._removeDuplicates = function(files) {
      var f, filteredFiles, i, l, p, usedFiles;
      usedFiles = {};
      filteredFiles = [];
      p = 0;
      i = -1;
      l = files.length;
      while (++i < l) {
        f = files[i];
        if (!usedFiles[f]) {
          usedFiles[f] = true;
          filteredFiles[p++] = f;
        }
      }
      return filteredFiles;
    };
    Task.prototype._parseFilesRecursive = function(cache, sourcePaths, files) {
      var appends, found, i1, i2, l1, l2, p, prepends, usedFiles;
      prepends = [];
      appends = [];
      usedFiles = [];
      files = [].concat(files);
      i1 = -1;
      l1 = files.length;
      while (++i1 < l1) {
        i2 = -1;
        l2 = sourcePaths.length;
        found = false;
        while (++i2 < l2) {
          p = path.resolve(sourcePaths[i2] + files[i1]);
          if (cache[p]) {
            found = true;
            if (cache[p].usedBy[this.name]) {
              usedFiles = [].concat(cache[p].usedBy[this.name], usedFiles);
              break;
            }
            usedFiles = [].concat(usedFiles, this._parseFilesRecursive(cache, sourcePaths, cache[p].prepend, p));
            usedFiles[usedFiles.length] = p;
            usedFiles = [].concat(usedFiles, this._parseFilesRecursive(cache, sourcePaths, cache[p].append, p));
            cache[p].usedBy[this.name] = usedFiles;
            break;
          }
        }
        if (!found) {
          Log.setStyle('red');
          Log.print('Import not found: ');
          Log.setStyle('cyan');
          Log.print(files[i1]);
          Log.setStyle('red');
          Log.print(' at ');
          Log.setStyle('cyan');
          Log.println(p);
        }
      }
      return usedFiles;
    };
    return Task;
  })();
  File = (function() {
    function File(file) {
      this.file = file;
      this.prepend = [];
      this.append = [];
      if (fs.existsSync(this.file)) {
        this.update();
      } else {
        throw new Error('File not found: ' + this.file);
      }
    }
    File.prototype.update = function() {
      var e;
      if (fs.existsSync(this.file)) {
        this.content = fs.readFileSync(this.file, 'utf8');
        try {
          this.js = this.content;
          return this.parseContent();
        } catch (_error) {
          e = _error;
          Log.setStyle('red');
          Log.print('Error parsing ');
          Log.setStyle('cyan');
          Log.println(this.file);
          Log.setStyle('magenta');
          Log.println(e.message + '\nat line ' + (e.location.first_line + 1));
          return Notifier.notify('Error compiling', this.file);
        }
      } else {
        throw new Error('File not found: ' + this.file);
      }
    };
    File.prototype.parseContent = function() {
      var ai, f, importRE, match, pi, _results;
      importRE = /(?:#|\/\/)\s*(import|\@codekit-(prepend|append))\s+(['|"])?([^\s'"]+)(\2)?/g;
      pi = ai = 0;
      this.prepend.length = 0;
      this.append.length = 0;
      _results = [];
      while ((match = importRE.exec(this.content))) {
        f = match[4];
        if (match[1] === 'import') {
          f = f;
        }
        if (match[2] === 'append') {
          _results.push(this.append[ai++] = f);
        } else {
          _results.push(this.prepend[pi++] = f);
        }
      }
      return _results;
    };
    File.prototype.dispose = function() {
      this.prepend.length = 0;
      this.append.length = 0;
      delete this.content;
      delete this.js;
      delete this.prepend;
      return delete this.append;
    };
    return File;
  })();
  return JSCompiler;
})();
var CoffeeCompiler;
CoffeeCompiler = (function() {
  var File, Task;
  CoffeeCompiler._ADD_NAMESPACE_FN = 'function __addNamespace(scope, obj){for(k in obj){if(!scope[k]) scope[k] = {};__addNamespace(scope[k], obj[k])}};';
  CoffeeCompiler._REWRITE_CS_FUNCTIONS = {
    "__bind": 'function(fn, me){ return function(){ return fn.apply(me, arguments); }; }',
    "__hasProp": '{}.hasOwnProperty',
    "__indexOf": '[].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; }',
    "__extends": 'function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) Object.defineProperty(child, key, Object.getOwnPropertyDescriptor(parent, key)); } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; }'
  };
  function CoffeeCompiler() {
    this._cache = {};
    this._tasks = [];
    this._usedFiles = [];
    this._running = false;
    this.ugly = false;
  }
  CoffeeCompiler.prototype.addTask = function(name, task) {
    return this._tasks[this._tasks.length] = new Task(name, task);
  };
  CoffeeCompiler.prototype.start = function(sourcePaths) {
    if (sourcePaths == null) {
      sourcePaths = [];
    }
    if (this._running) {
      return;
    }
    this._sourcePaths = sourcePaths;
    this._running = true;
    return this._runTasks();
  };
  CoffeeCompiler.prototype.stop = function() {
    if (!this._running) {
      return;
    }
    return this._running = false;
  };
  CoffeeCompiler.prototype.reset = function() {
    return 1;
  };
  CoffeeCompiler.prototype.update = function(file) {
    if (this._cache[file]) {
      this._cache[file].update();
    } else {
      this._cache[file] = new File(file);
    }
    if (this._running) {
      return this._runTasks(file);
    }
  };
  CoffeeCompiler.prototype.remove = function(files) {
    var file, i;
    files = [].concat(files);
    i = files.length;
    while (i-- > 0) {
      file = files[i];
      if (this._cache[file]) {
        this._cache[file].dispose();
        delete this._cache[file];
      }
    }
    return this._runTasks();
  };
  CoffeeCompiler.prototype.runTasks = function(ugly, version) {
    if (ugly == null) {
      ugly = false;
    }
    if (version == null) {
      version = null;
    }
    return this._runTasks(null, ugly, version);
  };
  CoffeeCompiler.prototype._runTasks = function(file, ugly, version) {
    var c, files, i, t;
    if (file == null) {
      file = null;
    }
    if (ugly == null) {
      ugly = false;
    }
    if (version == null) {
      version = null;
    }
    ugly = ugly;
    this._initTime = new Date().getTime();
    this._updateTasks();
    Log.println();
    i = this._tasks.length;
    c = 0;
    while (i-- > 0) {
      files = this._filterTask(this._tasks[i]);
      if (file) {
        if (files.indexOf(file) >= 0) {
          c++;
          this._tasks[i].output(ugly, version);
        }
      } else {
        c++;
        this._tasks[i].output(ugly, version);
      }
    }
    if (c > 0) {
      t = ((new Date().getTime() - this._initTime) * 0.001).toFixed(3);
      Log.setStyle('cyan');
      Log.println('In: ' + t + 's');
      return Notifier.notify('Compiler', 'Coffee compilation completed!');
    }
  };
  CoffeeCompiler.prototype._updateTasks = function() {
    var i, _results;
    i = this._tasks.length;
    _results = [];
    while (i-- > 0) {
      this._tasks[i].filtered = false;
      this._tasks[i].usedBy = {};
      _results.push(this._tasks[i].update(this._cache, this._sourcePaths));
    }
    return _results;
  };
  CoffeeCompiler.prototype._findTask = function(name) {
    var i;
    i = this._tasks.length;
    while (i-- > 0) {
      if (this._tasks[i].name === name) {
        return this._tasks[i];
      }
    }
    return null;
  };
  CoffeeCompiler.prototype._filterTask = function(task) {
    var c, files, hasNamespaces, i, j, k, l, namespaces, source, t, usedFiles;
    if (task.filtered) {
      return task.filteredFiles;
    }
    files = task.usedFiles;
    if (task.depends) {
      i = task.depends.length;
      while (i-- > 0) {
        t = this._findTask(task.depends[i]);
        if (!t) {
          continue;
        }
        usedFiles = this._filterTask(t);
        j = usedFiles.length;
        while (j-- > 0) {
          if ((k = files.indexOf(usedFiles[j])) >= 0) {
            files.splice(k, 1);
          }
        }
      }
    }
    task.filtered = true;
    task.filteredFiles = files;
    i = -1;
    l = files.length;
    namespaces = {};
    hasNamespaces = false;
    source = '';
    while (++i < l) {
      c = this._cache[files[i]];
      if (c) {
        if (this._addNamespaces(c.namespaces, namespaces)) {
          hasNamespaces = true;
        }
        source += c.js + '\n';
      }
    }
    if (hasNamespaces) {
      source = this.constructor._ADD_NAMESPACE_FN + '\n' + '__addNamespace(this, ' + JSON.stringify(namespaces) + ');\n' + source;
    }
    source = this._rewriteCsFuncs(source);
    if (!task.bare) {
      source = '(function() {\n' + source + '}).call(this);';
    }
    task.rawSource = source;
    return files;
  };
  CoffeeCompiler.prototype._rewriteCsFuncs = function(source) {
    var fs, k, re, s, v, _ref;
    s = source;
    fs = [];
    _ref = this.constructor._REWRITE_CS_FUNCTIONS;
    for (k in _ref) {
      v = _ref[k];
      re = new RegExp('^\\s*' + k + '\\s*=.*?(,|;)\\s*$', 'gm');
      s = s.replace(re, '$1');
      fs.push(k + '=' + v);
    }
    s = s.replace(/^\s*,?(;)?\s*\n/gm, '$1');
    s = s.replace(/,\s*\n\s*;/g, ';\n');
    if (fs.length > 0) {
      s = 'var ' + fs.join(',\n') + ';\n' + s;
    }
    return s;
  };
  CoffeeCompiler.prototype._addNamespaces = function(namespaces, nsObj) {
    var added, n, ns, _i, _j, _len, _len1;
    added = false;
    for (_i = 0, _len = namespaces.length; _i < _len; _i++) {
      ns = namespaces[_i];
      ns = ns.split('.');
      for (_j = 0, _len1 = ns.length; _j < _len1; _j++) {
        n = ns[_j];
        if (!nsObj[n]) {
          nsObj[n] = {};
          added = true;
        }
        nsObj = nsObj[n];
      }
    }
    return added;
  };
  CoffeeCompiler.prototype.parseFile = function() {};
  CoffeeCompiler.prototype.fileChanged = function() {};
  Task = (function() {
    function Task(name, data) {
      var _ref;
      this.name = name;
      this.data = data;
      this.usedFiles = [];
      this.bare = (_ref = this.data.options) != null ? _ref.bare : void 0;
      this.isNode = this.data.isNode;
      if (this.data.depends) {
        this.depends = [].concat(this.data.depends);
      }
    }
    Task.prototype.update = function(cache, sourcePaths) {
      var files, k, src, usedFiles, v;
      this.usedFiles.length = 0;
      src = this.data.src;
      files = [];
      if (this.data.includes) {
        files = files.concat([].concat(this.data.includes));
      }
      files.push(this.data.src);
      for (k in cache) {
        v = cache[k];
        v.usedBy = {};
      }
      usedFiles = this._parseFilesRecursive(cache, sourcePaths, files);
      return this.usedFiles = this._removeDuplicates(usedFiles);
    };
    Task.prototype.output = function(ugly, version) {
      var dir, e, out, p, results, versioner;
      if (ugly == null) {
        ugly = false;
      }
      if (version == null) {
        version = null;
      }
      out = null;
      Log.setStyle('magenta');
      Log.print('Compiling ' + this.name);
      if (ugly) {
        Log.setStyle('yellow');
        Log.print(' minified');
      }
      Log.println();
      versioner = new Versioner(this.data.output);
      p = path.resolve(this.data.output);
      dir = path.dirname(p);
      if (!fs.existsSync(dir)) {
        this._mkdir(dir);
      }
      if (versioner.versionRegex.test(this.rawSource)) {
        results = versioner.nextVersion(version);
      }
      if (results) {
        this.rawSource = this.rawSource.replace(versioner.versionRegex, results[0]);
        this.rawSource = this.rawSource.replace(versioner.dateRegex, results[1]);
      }
      out = this.rawSource;
      if (ugly) {
        try {
          out = uglify.minify(out, {
            fromString: true,
            comments: true
          }).code;
        } catch (_error) {
          e = _error;
          console.log(e);
        }
      }
      if (this.isNode) {
        out = '#!/usr/bin/env node\n' + out;
      }
      fs.writeFileSync(p, out, {
        encoding: 'utf-8'
      });
      Log.setStyle('green');
      Log.print('Saved to: ');
      Log.setStyle('magenta');
      return Log.println(this.data.output);
    };
    Task.prototype._mkdir = function(dir) {
      var d;
      d = path.dirname(dir);
      if (!fs.existsSync(d)) {
        this._mkdir(d);
      }
      return fs.mkdirSync(dir);
    };
    Task.prototype._removeDuplicates = function(files) {
      var f, filteredFiles, i, l, p, usedFiles;
      usedFiles = {};
      filteredFiles = [];
      p = 0;
      i = -1;
      l = files.length;
      while (++i < l) {
        f = files[i];
        if (!usedFiles[f]) {
          usedFiles[f] = true;
          filteredFiles[p++] = f;
        }
      }
      return filteredFiles;
    };
    Task.prototype._parseFilesRecursive = function(cache, sourcePaths, files) {
      var appends, found, i, i1, i2, j, k, l1, l2, p, pFiles, prepends, tp, usedFiles, v, _files;
      prepends = [];
      appends = [];
      usedFiles = [];
      files = [].concat(files);
      _files = [].concat(files);
      i = _files.length;
      while (i-- > 0) {
        if (_files[i].indexOf('*') >= 0) {
          tp = _files[i].replace(/\./g, '\\.').replace(/\*/g, '.*?');
          l2 = sourcePaths.length;
          i2 = -1;
          while (++i2 < l2) {
            p = path.resolve(sourcePaths[i2]) + '/' + tp;
            p = new RegExp(p, 'ig');
            pFiles = [];
            j = 0;
            found = false;
            for (k in cache) {
              v = cache[k];
              p.lastIndex = 0;
              if (p.test(k)) {
                found = true;
                pFiles[j++] = k;
              }
            }
            pFiles.unshift(i, 1);
            _files.splice.apply(_files, pFiles);
            if (found) {
              break;
            }
          }
        }
      }
      files = _files;
      i1 = -1;
      l1 = files.length;
      while (++i1 < l1) {
        i2 = -1;
        l2 = sourcePaths.length;
        found = false;
        while (++i2 < l2) {
          p = files[i1];
          if (!/^\//.test(p)) {
            p = path.resolve(sourcePaths[i2] + p);
          }
          if (cache[p]) {
            found = true;
            if (cache[p].usedBy[this.name]) {
              usedFiles = [].concat(cache[p].usedBy[this.name], usedFiles);
              break;
            }
            usedFiles = [].concat(usedFiles, this._parseFilesRecursive(cache, sourcePaths, cache[p].prepend, p));
            usedFiles[usedFiles.length] = p;
            usedFiles = [].concat(usedFiles, this._parseFilesRecursive(cache, sourcePaths, cache[p].append, p));
            cache[p].usedBy[this.name] = usedFiles;
            break;
          }
        }
        if (!found) {
          Log.setStyle('red');
          Log.print('Import not found: ');
          Log.setStyle('cyan');
          Log.print(files[i1]);
        }
      }
      return usedFiles;
    };
    return Task;
  })();
  File = (function() {
    function File(file) {
      this.file = file;
      this._replaceInjection = __bind(this._replaceInjection, this);
      this.prepend = [];
      this.append = [];
      this.namespaces = [];
      this.isJS = false;
      if (fs.existsSync(this.file)) {
        this.update();
      } else {
        throw new Error('File not found: ' + this.file);
      }
    }
    File.prototype.update = function() {
      var e;
      if (fs.existsSync(this.file)) {
        this.content = fs.readFileSync(this.file, 'utf8');
        try {
          this.content = this.content.replace(/^(\s*)(.*?)#\s*inject\s+(['|"])?([^\s'"]+)(\3)(.*?)$/mg, this._replaceInjection);
          this.parseContent();
          if (/\.js$/ig.test(this.file)) {
            return this.js = this.content;
          } else {
            return this.js = coffee.compile(this.content, {
              bare: true
            });
          }
        } catch (_error) {
          e = _error;
          Log.setStyle('red');
          Log.print('Error parsing ');
          Log.setStyle('cyan');
          Log.println(this.file);
          Log.setStyle('magenta');
          Log.println(e.message + '\nat line ' + (e.location.first_line + 1));
          return Notifier.notify('Error compiling', this.file);
        }
      } else {
        throw new Error('File not found: ' + this.file);
      }
    };
    File.prototype.parseContent = function() {
      var ai, f, importRE, l, match, ns, pi;
      importRE = /#\s*(import|\@codekit-(prepend|append)|namespace)\s+(['|"])?([^\s'"]+)(\2)?/g;
      pi = ai = 0;
      this.prepend.length = 0;
      this.append.length = 0;
      this.namespaces.length = 0;
      while ((match = importRE.exec(this.content))) {
        f = match[4];
        switch (match[1]) {
          case 'import':
          case 'codekit':
            if (!/\.js$/ig.test(f)) {
              f = f.replace(/\./g, '/') + '.coffee';
            }
            if (match[2] === 'append') {
              this.append[ai++] = f;
            } else {
              this.prepend[pi++] = f;
            }
            break;
          case 'namespace':
            this.namespaces.push(f);
        }
      }
      if ((l = this.namespaces.length) > 0) {
        ns = this.namespaces[l - 1];
        return this.content = this.content.replace(/^(class\s+)([^\s]+)/gm, '$1' + ns + '.$2');
      }
    };
    File.prototype._replaceInjection = function() {
      var content, injectFile, stat;
      injectFile = path.dirname(this.file) + '/' + arguments[4];
      content = '';
      if (fs.existsSync(injectFile)) {
        stat = fs.statSync(injectFile);
        if (stat.isFile()) {
          content = fs.readFileSync(injectFile, 'utf8');
        }
      }
      content = content.replace(/^/gm, arguments[1]).replace(/^\s*/, '').replace(/\s*$/, '');
      content = arguments[1] + arguments[2] + content + arguments[6];
      return content;
    };
    File.prototype.dispose = function() {
      this.prepend.length = 0;
      this.append.length = 0;
      delete this.content;
      delete this.js;
      delete this.prepend;
      return delete this.append;
    };
    return File;
  })();
  return CoffeeCompiler;
})();
var Main, coffee, exec, fs, path, uglify, yuidocs;
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
String.prototype.trim = function(char) {
  if (char == null) {
    char = null;
  }
  return this.ltrim(char).rtrim(char);
};
fs = require('fs');
path = require('path');
coffee = require('./vendors/coffee-script').CoffeeScript;
uglify = require('./vendors/uglify-js');
yuidocs = require('./vendors/yuidocjs');
exec = require('child_process').exec;
Main = (function() {
  function Main() {
    this.__replaceDynamicValues = __bind(this.__replaceDynamicValues, this);
    this._ready = __bind(this._ready, this);
    this._buildFileChanged = __bind(this._buildFileChanged, this);
    this._buildDocsComplete = __bind(this._buildDocsComplete, this);
    this._compileDocs = __bind(this._compileDocs, this);
    this._buildDocs = __bind(this._buildDocs, this);
    this._onInput = __bind(this._onInput, this);
    this._fileRemoved = __bind(this._fileRemoved, this);
    this._fileChanged = __bind(this._fileChanged, this);
    var o, options, _i, _len;
    this.docs = false;
    this.ugly = false;
    options = process.argv.splice(2);
    this._buildFile = 'build.coffee';
    for (_i = 0, _len = options.length; _i < _len; _i++) {
      o = options[_i];
      switch (o) {
        case 'uglify':
          this.ugly = true;
          break;
        case 'docs':
          this.docs = true;
      }
      if (o.indexOf('.coffee') >= 1) {
        this._buildFile = o;
      }
    }
    this.coffeeCompiler = new CoffeeCompiler();
    this.coffeeCompiler.ugly = this.ugly;
    this.lessCompiler = new LessCompiler();
    this.lessCompiler.ugly = this.ugly;
    this.stylusCompiler = new StylusCompiler();
    this.stylusCompiler.ugly = this.ugly;
    this.jsCompiler = new JSCompiler();
    this.jsCompiler.ugly = this.ugly;
    this._watcher = new Watcher();
    this._watcher.on(Watcher.CHANGED, this._fileChanged);
    this._watcher.on(Watcher.ADDED, this._fileChanged);
    this._watcher.on(Watcher.REMOVED, this._fileRemoved);
    this._init();
  }
  Main.prototype._fileChanged = function(e, files) {
    var file, _i, _len, _ref, _results;
    files = [].concat(files);
    _results = [];
    for (_i = 0, _len = files.length; _i < _len; _i++) {
      file = files[_i];
      if (/\.coffee$/i.test(file)) {
        _results.push(this.coffeeCompiler.update(file));
      } else if (/\.less$/i.test(file)) {
        _results.push(this.lessCompiler.update(file));
      } else if (/\.styl$/i.test(file)) {
        _results.push(this.stylusCompiler.update(file));
      } else if (/\.js$/i.test(file)) {
        if ((_ref = this.coffeeCompiler) != null) {
          _ref.update(file);
        }
        _results.push(this.jsCompiler.update(file));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Main.prototype._fileRemoved = function(e, files) {
    files = [].concat(files);
    this.coffeeCompiler.remove(files);
    this.lessCompiler.remove(files);
    this.stylusCompiler.remove(files);
    return this.jsCompiler.remove(files);
  };
  Main.prototype._onInput = function() {
    var data;
    data = process.stdin.read();
    if (data) {
      data = data.toString().trim().toLowerCase();
      if (data.length === 0) {
        return;
      }
      process.stdout.write('\x1b[T\x1b[J');
      switch (data) {
        case 'compile':
          this.coffeeCompiler.runTasks(false);
          this.lessCompiler.runTasks(false);
          this.stylusCompiler.runTasks(false);
          return this.jsCompiler.runTasks(false);
        case 'uglify':
          this.coffeeCompiler.runTasks(true);
          this.lessCompiler.runTasks(true);
          this.stylusCompiler.runTasks(true);
          return this.jsCompiler.runTasks(true);
        case 'docs':
          this.docs = true;
          return this._buildDocs();
        case 'deploy':
        case 'minify':
          Log.setStyle('yellow');
          return Log.println('This command has been deprecated, please use [bugfix || build || release] to compile with correct version.');
        case 'bugfix':
        case 'build':
        case 'release':
          this.coffeeCompiler.runTasks(true, data);
          this.lessCompiler.runTasks(true);
          this.stylusCompiler.runTasks(true);
          return this.jsCompiler.runTasks(true);
        default:
          Log.setStyle('yellow');
          Log.print('No command ');
          Log.setStyle('cyan');
          Log.print(data);
          Log.setStyle('yellow');
          return Log.println(' found');
      }
    }
  };
  Main.prototype._init = function() {
    this._buildFileChanged();
    process.stdin.on('readable', this._onInput);
    return this._buildDocs();
  };
  Main.prototype._reset = function() {
    var _ref;
    this.coffeeCompiler.stop();
    this.coffeeCompiler.reset();
    this.lessCompiler.stop();
    this.lessCompiler.reset();
    this.stylusCompiler.stop();
    this.stylusCompiler.reset();
    this.jsCompiler.stop();
    this.jsCompiler.reset();
    return (_ref = this._buildfileWatcher) != null ? _ref.close() : void 0;
  };
  Main.prototype._buildDocs = function() {
    var json, options, opts, _base, _ref, _ref1;
    if (!this.docs || this.docs && (((_ref = this.buildFile) != null ? _ref.docs : void 0) == null) || (((_ref1 = this.buildFile) != null ? _ref1.docs : void 0) == null)) {
      return;
    }
    Log.println();
    Log.setStyle('magenta');
    Log.print('Compiling Docs');
    Log.println();
    this.buildFile.docs['linkNatives'] = true;
    this.buildFile.docs['attributesEmit'] = false;
    this.buildFile.docs['selleck'] = true;
    this.buildFile.docs['syntaxtype'] = 'coffee';
    if ((_base = this.buildFile.docs)['extension'] == null) {
      _base['extension'] = '.coffee';
    }
    this.buildFile.docs['paths'] = this.buildFile.docs['source'];
    this.buildFile.docs['outdir'] = this.buildFile.docs['options']['output'];
    options = yuidocs.Project.init(yuidocs.clone(this.buildFile.docs));
    opts = yuidocs.clone(options);
    if (opts.paths && opts.paths.length && (opts.paths.length > 10)) {
      opts.paths = [].concat(opts.paths.slice(0, 5), ['<paths truncated>'], options.paths.slice(-5));
    }
    json = (new yuidocs.YUIDoc(options)).run();
    if (json === null) {
      throw new Error('Running YUIDoc returns null.');
    }
    options = yuidocs.Project.mix(json, options);
    clearTimeout(this.t);
    if (options.parseOnly === void 0 || !options.parseOnly) {
      return this._compileDocs(options, json);
    }
  };
  Main.prototype._compileDocs = function(options, json) {
    var builder;
    builder = new yuidocs.DocBuilder(options, json);
    return builder.compile(this._buildDocsComplete);
  };
  Main.prototype._buildDocsComplete = function(p_endtime) {
    Log.setStyle('cyan');
    Log.println('In: ' + p_endtime + 's');
    return Notifier.notify('Compiler', 'Docs compilation completed!');
  };
  Main.prototype._buildFileChanged = function() {
    Log.setStyle('magenta');
    Log.println('Preparing... please wait');
    this._reset();
    this._parseBuildFile();
    this.coffeeCompiler.start(this.sourcePaths);
    this.lessCompiler.start(this.sourcePaths);
    this.stylusCompiler.start(this.sourcePaths);
    this.jsCompiler.start(this.sourcePaths);
    clearTimeout(this.tt);
    return this.tt = setTimeout(this._ready, 3000);
  };
  Main.prototype._ready = function() {
    clearTimeout(this.tt);
    Log.setStyle('green');
    Log.println('Ready!');
    return Log.println('');
  };
  Main.prototype._parseBuildFile = function() {
    var buildFile, e;
    if (fs.existsSync(this._buildFile)) {
      try {
        buildFile = fs.readFileSync(this._buildFile, {
          encoding: 'utf-8'
        });
        buildFile = 'return ' + '{' + buildFile + '}';
        this.buildFile = eval(coffee.compile(buildFile));
      } catch (_error) {
        e = _error;
        Log.setStyle('red');
        Log.print('Error parsing ');
        Log.setStyle('cyan');
        Log.println(this._buildFile);
        Log.setStyle('blue');
        Log.println(e.message + '\nat line ' + (e.location.first_line + 1));
        process.exit();
      }
    }
    if (!this.buildFile) {
      Log.setStyle('red');
      Log.print('Could not load ' + this._buildFile);
      process.exit();
      return;
    }
    this.buildFile = this._replaceDynamicValues(this.buildFile);
    this._buildfileWatcher = fs.watch(this._buildFile, this._buildFileChanged);
    this._parseTasks();
    this.sourcePaths = [].concat(this.buildFile.sourcePaths);
    return this._watchFolders();
  };
  Main.prototype._replaceDynamicValues = function(obj) {
    Main._tempObj = obj;
    this._tempData = JSON.stringify(obj);
    this._tempData = this._tempData.replace(/\{([^\{\}]+)\}/igm, this.__replaceDynamicValues);
    obj = JSON.parse(this._tempData);
    delete Main._tempObj;
    delete this._tempData;
    return obj;
  };
  Main.prototype.__replaceDynamicValues = function(match, capture, pos, val) {
    var i, l, n, v;
    n = capture.split('.');
    v = Main._tempObj;
    i = -1;
    l = n.length;
    while (++i < l) {
      v = v[n[i]];
      if (!v) {
        break;
      }
    }
    if (!v) {
      return match;
    }
    Main._tempObj = JSON.parse(JSON.stringify(Main._tempObj).replace(new RegExp(match.replace(/(\W)/g, '\\$1'), 'g'), v));
    return v;
  };
  Main.prototype._parseTasks = function() {
    var k, src, task, _ref, _results;
    _ref = this.buildFile.tasks;
    _results = [];
    for (k in _ref) {
      task = _ref[k];
      src = task.src;
      if (/\.coffee$/i.test(src)) {
        _results.push(this.coffeeCompiler.addTask(k, task));
      } else if (/\.less$/i.test(src)) {
        _results.push(this.lessCompiler.addTask(k, task));
      } else if (/\.styl$/i.test(src)) {
        _results.push(this.stylusCompiler.addTask(k, task));
      } else if (/\.js$/i.test(src)) {
        _results.push(this.jsCompiler.addTask(k, task));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Main.prototype._resetWatchers = function() {
    var _ref;
    return (_ref = this._watcher) != null ? _ref.removeAll() : void 0;
  };
  Main.prototype._watchFolders = function() {
    var i, p, sourcePaths, _i, _len, _results;
    this._resetWatchers();
    sourcePaths = [].concat(this.buildFile.sourcePaths);
    i = 0;
    _results = [];
    for (_i = 0, _len = sourcePaths.length; _i < _len; _i++) {
      p = sourcePaths[_i];
      _results.push(this._watcher.addPath(p, true));
    }
    return _results;
  };
  return Main;
})();
new Main();
}).call(this);
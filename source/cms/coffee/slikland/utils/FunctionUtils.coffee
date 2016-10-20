`!function(a,b){"use strict";function h(a){"function"!=typeof a&&(a=new Function(""+a));for(var b=new Array(arguments.length-1),e=0;e<b.length;e++)b[e]=arguments[e+1];var f={callback:a,args:b};return d[c]=f,g(c),c++}function i(a){delete d[a]}function j(a){var c=a.callback,d=a.args;switch(d.length){case 0:c();break;case 1:c(d[0]);break;case 2:c(d[0],d[1]);break;case 3:c(d[0],d[1],d[2]);break;default:c.apply(b,d)}}function k(a){if(e)setTimeout(k,0,a);else{var b=d[a];if(b){e=!0;try{j(b)}finally{i(a),e=!1}}}}function l(){g=function(a){process.nextTick(function(){k(a)})}}function m(){if(a.postMessage&&!a.importScripts){var b=!0,c=a.onmessage;return a.onmessage=function(){b=!1},a.postMessage("","*"),a.onmessage=c,b}}function n(){var b="setImmediate$"+Math.random()+"$",c=function(c){c.source===a&&"string"==typeof c.data&&0===c.data.indexOf(b)&&k(+c.data.slice(b.length))};a.addEventListener?a.addEventListener("message",c,!1):a.attachEvent("onmessage",c),g=function(c){a.postMessage(b+c,"*")}}function o(){var a=new MessageChannel;a.port1.onmessage=function(a){var b=a.data;k(b)},g=function(b){a.port2.postMessage(b)}}function p(){var a=f.documentElement;g=function(b){var c=f.createElement("script");c.onreadystatechange=function(){k(b),c.onreadystatechange=null,a.removeChild(c),c=null},a.appendChild(c)}}function q(){g=function(a){setTimeout(k,0,a)}}if(!a.setImmediate){var g,c=1,d={},e=!1,f=a.document,r=Object.getPrototypeOf&&Object.getPrototypeOf(a);r=r&&r.setTimeout?r:a,"[object process]"==={}.toString.call(a.process)?l():m()?n():a.MessageChannel?o():f&&"onreadystatechange"in f.createElement("script")?p():q(),r.setImmediate=h,r.clearImmediate=i}}("undefined"==typeof self?"undefined"==typeof global?this:global:self);`

class FunctionUtils

  @debounce:(fn, delay)->
    timer = null
    ->
      context = this
      args = arguments
      clearTimeout timer
      timer = setTimeout((->
        fn.apply context, args
        return
      ), delay)
      return

  @throttle:(fn, threshhold = 250, scope)->
    last = undefined
    deferTimer = undefined
    ->
      context = scope or @
      now = +new Date
      args = arguments
      if last and now < last + threshhold
        # hold on to it
        clearTimeout deferTimer
        deferTimer = setTimeout((->
          last = now
          fn.apply context, args
          return
        ), threshhold)
      else
        last = now
        fn.apply context, args
      return

  @setImmediate:(fn)->
    window.setImmediate(fn)

  @clearImmediate:(fn)->
    window.clearImmediate(fn)

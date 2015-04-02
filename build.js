(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// LICENSE : MIT
"use strict";
// MIT
var SyncPromise = require('sync-promise');
var getSelectedRadios = require("./utils/radio-util").getSelectedRadios;
function getRadioState() {
    var selected = getSelectedRadios();
    if (selected.length === 0) {
        return new SyncPromise(function (resolve, reject) {
            reject(new Error("選択されてない"));
        });
    }
    var s = selected[0];
    return new SyncPromise(function (resolve) {
        resolve(s);
    });
}


document.getElementById("js-output").addEventListener("click", function () {
    var promise = getRadioState();
    promise.then(function (value) {
        console.log(value);
    }).catch(function (error) {
        console.error(error);
    });
});
},{"./utils/radio-util":2,"sync-promise":3}],2:[function(require,module,exports){
// LICENSE : MIT
"use strict";
function getSelectedRadios() {
    var results = [];
    var radios = document.querySelectorAll('#js-radio-fieldset input[name="judge"]');
    for (var i = 0; i < radios.length; i++) {
        var radio = radios[i];
        if (radio.checked) {
            results.push(radio);
        }
    }
    return results;
}
module.exports = {
    getSelectedRadios: getSelectedRadios
};
},{}],3:[function(require,module,exports){
function isPromise(p) {
  return p && typeof p.then === 'function';
}

// States
var PENDING = 2,
    FULFILLED = 0, // We later abuse these as array indices
    REJECTED = 1;

function SyncPromise(fn) {
  var self = this;
  self.v = 0; // Value, this will be set to either a resolved value or rejected reason
  self.s = PENDING; // State of the promise
  self.c = [[],[]]; // Callbacks c[0] is fulfillment and c[1] is rejection callbacks
  self.a = false; // Has the promise been resolved synchronously
  var syncResolved = true;
  function transist(val, state) {
    self.a = syncResolved;
    self.v = val;
    self.s = state;
    if (state === REJECTED && !self.c[state].length) {
      throw val;
    }
    self.c[state].forEach(function(fn) { fn(val); });
    self.c = null; // Release memory.
  }
  function resolve(val) {
    if (!self.c) {
      // Already resolved, do nothing.
    } else if (isPromise(val)) {
      val.then(resolve).catch(reject);
    } else {
      transist(val, FULFILLED);
    }
  }
  function reject(reason) {
    if (!self.c) {
      // Already resolved, do nothing.
    } else if (isPromise(reason)) {
      reason.then(reject).catch(reject);
    } else {
      transist(reason, REJECTED);
    }
  }
  fn(resolve, reject);
  syncResolved = false;
}

var prot = SyncPromise.prototype;

prot.then = function(cb) {
  var self = this;
  if (self.a) { // Promise has been resolved synchronously
    throw new Error('Can not call then on synchonously resolved promise');
  }
  return new SyncPromise(function(resolve, reject) {
    function settle() {
      try {
        resolve(cb(self.v));
      } catch(e) {
        reject(e);
      }
    }
    if (self.s === FULFILLED) {
      settle();
    } else if (self.s === REJECTED) {
      reject(self.v);
    } else {
      self.c[FULFILLED].push(settle);
      self.c[REJECTED].push(reject);
    }
  });
};

prot.catch = function(cb) {
  var self = this;
  if (self.a) { // Promise has been resolved synchronously
    throw new Error('Can not call catch on synchonously resolved promise');
  }
  return new SyncPromise(function(resolve, reject) {
    function settle() {
      try {
        resolve(cb(self.v));
      } catch(e) {
        reject(e);
      }
    }
    if (self.s === REJECTED) {
      settle();
    } else if (self.s === FULFILLED) {
      resolve(self.v);
    } else {
      self.c[REJECTED].push(settle);
      self.c[FULFILLED].push(resolve);
    }
  });
};

SyncPromise.all = function(promises) {
  return new SyncPromise(function(resolve, reject, l) {
    l = promises.length;
    promises.forEach(function(p, i) {
      if (isPromise(p)) {
        p.then(function(res) {
          promises[i] = res;
          --l || resolve(promises);
        }).catch(reject);
      } else {
        --l || resolve(promises);
      }
    });
  });
};
module.exports = SyncPromise;

},{}]},{},[1]);

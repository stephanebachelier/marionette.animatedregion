(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () {
      return factory();
    });
  } else if (typeof exports !== 'undefined') {
    module.exports = factory();
  } else {
    root.marionette.animatedregion = factory();
  }

}(this, function () {
  'use strict';

  // code goes here
  var marionette.animatedregion = function (options) {

  };

  return marionette.animatedregion;
}));

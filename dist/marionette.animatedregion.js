(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(["marionette",
      "underscore",
      "motioncontrol"], function (Marionette, _, motioncontrol) {
      return (root['AnimatedRegion'] = factory(Marionette, _, motioncontrol));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory(require("marionette"),
      require("underscore"),
      require("motioncontrol"));
  } else {
    root['AnimatedRegion'] = factory(Marionette,
      _,
      motioncontrol);
  }
}(this, function (Marionette, _, motioncontrol) {

  /*! marionette.animatedregion - v0.2.1
   *  Release on: 2014-12-30
   *  Copyright (c) 2014 Stéphane Bachelier
   *  Licensed MIT */
  'use strict';

  var AnimatedRegion = Marionette.Region.extend({
    attachHtml: function (view) {
      var observer = new MutationObserver(function () {
        observer.disconnect();
        this.animateView(view, 'in');
      }.bind(this));

      // configuration of the observer:
      var config = {attributes: false, childList: true, characterData: false};

      // pass in the target node, as well as the observer options
      observer.observe(this.el, config);

      this.isViewSupportingAnimation = !_.isEmpty(view.animationClassName);

      Marionette.Region.prototype.attachHtml.call(this, view);
    },

    close: function () {
      var view = this.currentView;

      // If there is no view in the region just stop which is a noop.
      if (!view) { return this; }

      var result = this.animateView(view, 'out');

      if (false === result) {
        this.empty();
        return this;
      }
      else {
        return result.then(this.empty);
      }
    },

    animateView: function (view, direction) {
      direction = direction || 'in';
      var self = this;
      // wait for animation end to remove animation class trigger
      // this help replaying the animation on attaching new content
      return motioncontrol(view.el, {
        trigger: _.result(self, '_launchAnimation')
      }).then(function () {
        if (self.isViewSupportingAnimation) {
          self.triggerMethod('animated:view:' + direction, view);
        }
      });
    },

    _launchAnimation: function (view, direction) {
      var methodName = 'animateView' + direction.charAt(0).toUpperCase() + direction.substring(1);
      var method = this[methodName];
      // return method result only if method exist else return null which will not interfere
      // with motioncontrol logic which aborts animation on false
      if (this.isViewSupportingAnimation) {
        return _.isFunction(method) ? method.call(this, view) : this.isViewSupportingAnimation;
      }
      return this.isViewSupportingAnimation;
    },

    // animated view el into visible are
    animateViewIn: function (view) {
      view.el.classList.add(view.animationClassName);
      view.el.classList.add(view.animation.in);
    },

    onAnimatedViewIn: function (view) {
      view.el.classList.remove(view.animationClassName);
      view.el.classList.remove(view.animation.in);
    },

    animateViewOut: function (view) {
      view.el.classList.add(view.animationClassName);
      view.el.classList.add(view.animation.out);
    },

    onAnimatedViewOut: function (view) {
      view.el.classList.remove(view.animationClassName);
      view.el.classList.remove(view.animation.out);
    }
  });

  Marionette.AnimatedRegion = AnimatedRegion;

  return AnimatedRegion;

}));

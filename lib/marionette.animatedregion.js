'use strict';

var raf = require('raf');

var AnimatedRegion = Marionette.Region.extend({
  attachHtml: function (view) {
    var observer = new MutationObserver(_.bind(function () {
      observer.disconnect();
      this.animateView(view, 'in');
    }, this));

    // configuration of the observer:
    var config = {attributes: false, childList: true, characterData: false};

    // pass in the target node, as well as the observer options
    observer.observe(this.el, config);

    this.isViewSupportingAnimation = !_.isEmpty(view.animationClassName);

    Marionette.Region.prototype.attachHtml.call(this, view);
  },

  empty: function () {
    var view = this.currentView;

    // If there is no view in the region just stop which is a noop.
    if (!view) { return this; }

    var result = this.animateView(view, 'out');

    if (false === result) {
      this.triggerMethod('empty');
      return this;
    }
    else {
      return result.then(_.bind(function () {
        this.triggerMethod('empty');
      }, this));
    }
  },

  animateView: function (view, direction) {
    direction = direction || 'in';

    var defaultOptions = {
      trigger: _.bind(_.partial(this.launchAnimation, view, direction), this)
    };

    var options = _.extend(defaultOptions, _.result(this, 'getAnimationOptions'));

    this.triggerMethod('animate:view:' + direction, view);
    view.triggerMethod('animate:' + direction);

    var self = this;
    // wait for animation end to remove animation class trigger
    // this help replaying the animation on attaching new content
    return motioncontrol(view.el, options).then(function () {
      if (self.isViewSupportingAnimation) {
        self.triggerMethod('animated:view:' + direction, view);
        view.triggerMethod('animated:' + direction);
      }
    });
  },

  launchAnimation: function (view, direction) {
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
    if (!view.animationClassName.in) {
      return;
    }

    if (this.updateClassList(view.el, view.animationClassName.in, 'add')) {
      this.triggerMethod('animating:view:in');
    }
  },

  onAnimatedViewIn: function (view) {
    if (!view.animationClassName.out) {
      return;
    }
    this.updateClassList(view.el, view.animationClassName.in, 'remove');
  },

  animateViewOut: function (view) {
    if (!view.animationClassName.in) {
      return;
    }

    if (this.updateClassList(view.el, view.animationClassName.out, 'add')) {
      this.triggerMethod('animating:view:out');
    }
  },

  onAnimatedViewOut: function (view) {
    if (!view.animationClassName.out) {
      return;
    }
    this.updateClassList(view.el, view.animationClassName.out, 'remove');
  },

  updateClassList: function (el, className, operation) {
    if (!el || !className || !operation) {
      return;
    }

    var method = el.classList[operation];
    if (!method) {
      return false;
    }

    var classNames = className ? className.split(' ') : [];

    raf(function tick () {
      for (var index = 0, length = classNames.length; index < length; index += 1) {
        // don't use method variable as it throw Illegal invocation error
        el.classList[operation](classNames[index]);
      }
    });

    return true;
  }
});

AnimatedRegion.extend = Marionette.extend;

Marionette.AnimatedRegion = AnimatedRegion;

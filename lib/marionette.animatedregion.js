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

  close: function (options) {
    var view = this.currentView;

    // If there is no view in the region just stop which is a noop.
    if (!view) { return this; }

    var destroyRegion = options.destroy || false;

    var result = this.animateView(view, 'out');

    return false === result ? this : result.then(function () {
      this.empty();
      if (destroyRegion) {
        this.$el.remove();
        delete this.$el;
        this.destroy();
      }
    }.bind(this));
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
    var methodName = '_animateView' + direction.charAt(0).toUpperCase() + direction.substring(1);
    var method = this[methodName];
    // return method result only if method exist else return null which will not interfere
    // with motioncontrol logic which aborts animation on false
    if (this.isViewSupportingAnimation) {
      return _.isFunction(method) ? method.call(this, view) : this.isViewSupportingAnimation;
    }
    return this.isViewSupportingAnimation;
  },

  // animated view el into visible are
  _animateViewIn: function (view) {
    view.el.classList.add(view.animationClassName);
    view.el.classList.add(view.animation.in);
  },

  onAnimatedViewIn: function (view) {
    view.el.classList.remove(view.animationClassName);
    view.el.classList.remove(view.animation.in);
  },

  _animateViewOut: function (view) {
    view.el.classList.add(view.animationClassName);
    view.el.classList.add(view.animation.out);
  },

  onAnimatedViewOut: function (view) {
    view.el.classList.remove(view.animationClassName);
    view.el.classList.remove(view.animation.out);
  }
});

Marionette.AnimatedRegion = AnimatedRegion;

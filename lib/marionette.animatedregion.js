'use strict';

var AnimatedRegion = Marionette.Region.extend({
  attachHtml: function (view) {
    var observer = new MutationObserver(function () {
      observer.disconnect();
      this.animateViewIn(view);
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

    var result = this.animateViewOut(view);

    return false === result ? this : result.then(function () {
      this.empty();
      if (destroyRegion) {
        this.$el.remove();
        delete this.$el;
        this.destroy();
      }
    }.bind(this));
  },

  animateViewIn: function (view) {
    // wait for animation end to remove animation class trigger
    // this help replaying the animation on attaching new content
    return motioncontrol(view.el, {
      trigger: function () {
        return this._animateViewIn(view);
      }.bind(this)
    }).then(function () {
      if (this.isViewSupportingAnimation) {
        this.triggerMethod('animated:view:in', view);
      }
    }.bind(this));
  },

  // animated view el into visible are
  _animateViewIn: function (view) {
    if (this.isViewSupportingAnimation) {
      view.el.classList.add(view.animationClassName);
      view.el.classList.add(view.animation.in);
    }

    return this.isViewSupportingAnimation;
  },

  onAnimatedViewIn: function (view) {
    view.el.classList.remove(view.animationClassName);
    view.el.classList.remove(view.animation.in);
  },

  animateViewOut: function (view) {
    return motioncontrol(view.el, {
      trigger: function () {
        return this._animateViewOut(view);
      }.bind(this)
    }).then(function () {
      if (this.isViewSupportingAnimation) {
        this.triggerMethod('animated:view:out', view);
      }
    }.bind(this));
  },

  _animateViewOut: function (view) {
    if (this.isViewSupportingAnimation) {
      view.el.classList.add(view.animationClassName);
      view.el.classList.add(view.animation.out);
    }

    return this.isViewSupportingAnimation;
  },

  onAnimatedViewOut: function (view) {
    view.el.classList.remove(view.animationClassName);
    view.el.classList.remove(view.animation.out);
  }
});

Marionette.AnimatedRegion = AnimatedRegion;

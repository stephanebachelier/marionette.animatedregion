module.exports = {
  lib: {
    template: 'umd',
    indent: '  ',
    objectToExport: 'AnimatedRegion',
    src: 'dist/<%= pkg.name.replace(/.js$/, "") %>.js',
    dest: 'dist/<%= pkg.name.replace(/.js$/, "") %>.js',
    returnExportsGlobal: 'AnimatedRegion',
    deps: {
      default: ['Marionette', '_', 'motioncontrol'],
      amd: ['backbone.marionette', 'lodash', 'motioncontrol.js'],
      cjs: ['backbone.marionette', 'lodash', 'motioncontrol.js'],
      global: ['Marionette', '_', 'motioncontrol']
    }
  }
};

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
      amd: ['marionette', 'underscore', 'motioncontrol'],
      cjs: ['marionette', 'underscore', 'motioncontrol'],
      global: ['Marionette', '_', 'motioncontrol']
    }
  }
};

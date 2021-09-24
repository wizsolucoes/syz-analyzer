const commandLineArgs = require('command-line-args');

var exports = module.exports;

exports.parse = function () {
  const optionDefinitions = [
    { name: 'app', alias: 'a', type: String },
    { name: 'src', alias: 's', type: String },
    { name: 'break-build', alias: 'b', type: Boolean },
    { name: 'gateway', alias: 'g', type: Number },
    { name: 'components', alias: 'c', type: String },
  ];

  const options = commandLineArgs(optionDefinitions);

  const app = options.app;
  const path = options.src || 'src';
  const breakBuild = options['break-build'] || false;
  const components = options.components || undefined;

  return { app, breakBuild, path, components };
};

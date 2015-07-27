#!/usr/bin/env node

'use strict';
var jdists = require('./');
var optimist = require('optimist');
var mkdirp = require('mkdirp');
var fs = require('fs');
var path = require('path');
var util = require('util');
var colors = require('colors');

var argv = optimist
  .usage('$0 input1.js [input2.js] -o output')

.alias('o', 'output')
  .describe('o', 'output file.')
  .string('o')

.alias('r', 'remove')
  .describe('r', 'remove block.')
  .default('r', 'remove,test')
  .string('r')

.alias('t', 'trigger')
  .describe('t', 'trigger block.')
  .default('t', 'release')
  .string('t')

.alias('clean', 'c')
  .describe('c', 'Clean white space.')
  .default('c', true)
  .boolean('c')

.alias('v', 'version')
  .describe('v', 'Print version number and exit.')

.wrap(80)
  .argv;

if (argv._.length < 1) {
  if (argv.version) {
    var json = require('./package.json');
    console.log(json.name + ' ' + json.version);
    return;
  }

  console.log(
    String(function () {
      /*
Usage:

    #{jdists,magenta} <input list> [options]

Options:

    #{-r, --remove,cyan}                 Remove block tag name list (default "remove,test")
    #{-o, --output,cyan}                 Output file (default STDOUT)
    #{-v, --version,cyan}                Output jdists version
    #{-t, --trigger,cyan}                Trigger name list (default "release")
    #{-c, --clean,cyan}                  Clean white space (default true)
      */
    })
    .replace(/[^]*\/\*!?\s*|\s*\*\/[^]*/g, '')
    .replace(/#\{(.*?),(\w+)\}/g, function (all, text, color) {
      return colors[color](text);
    })
  );
  return;
}

var contents = [];
var filenames = [];
argv._.forEach(function (filename) {
  filenames.push(filename);
  contents.push(jdists.build(filename, argv));
});
var content = contents.join('\n');
if (argv.output) {
  mkdirp(path.dirname(argv.output));
  fs.writeFileSync(argv.output, content);
  console.log(colors.green(util.format('%j jdists output complete.', filenames)));
}
else {
  console.log(content);
}
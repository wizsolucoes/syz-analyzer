#!/usr/bin/env node
const syzAnalyzer = require('./src/syz-analyzer');
const commandLineArgsParser = require('./src/command-line-args-parser');

const { app, breakBuild, path, components } = commandLineArgsParser.parse();

syzAnalyzer.runAnalysis(app, breakBuild, path, components);

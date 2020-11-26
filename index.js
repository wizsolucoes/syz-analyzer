#!/usr/bin/env node
const syzAnalyzer = require('./src/syz-analyzer');
const commandLineArgsParser = require('./src/command-line-args-parser');

const { app, gateway, breakBuild, path, components } = commandLineArgsParser.parse();

syzAnalyzer.runAnalysis(app, gateway, breakBuild, path, components);
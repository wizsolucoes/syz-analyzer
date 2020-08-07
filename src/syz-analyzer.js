var finder = require('find-in-files');
var publisher = require('./syz-analysis-publisher');
var buildBreaker = require('./syz-build-breaker');
var componentsListService = require('./components-list-service');

var exports = module.exports;

var buildBreakerOptions = {
  gateWay: undefined,
  isOn: undefined,
};

exports.runAnalysis = async function (appName, expectedCoverage, breakBuild, srcPath) {
  buildBreakerOptions.gateWay = expectedCoverage;
  buildBreakerOptions.isOn = breakBuild;

  printHeader();
  const expectedComponents = await fetchExpectedComponentsList(appName);
  const coverage = await calculateCoverage(expectedComponents, srcPath);
  publisher.publish(appName, coverage, onResultsPublished);
}

function printHeader() {
  console.log('\n');
  console.log('SYZ Analyzer');
  console.log('============');
}

async function fetchExpectedComponentsList(appName) {
  abortIfNoName(appName);

  console.log(`Fetching expected components list for ${appName}...`);

  const data = await componentsListService.fetch(appName);

  var expectedComponents = data;

  console.log('\n');

  if (expectedComponents.length == 0) {
    console.log('INFO: This application is not expected to use SYZ components.');
    process.exit();
  }

  console.log('INFO: This application shoud use the following SYZ components', expectedComponents);

  return expectedComponents;
}

function compare(componentsToBeUsed, componentsUsed) {
  const found = [];
  const notFound = [];

  for (var i in componentsToBeUsed) {
    const component = componentsToBeUsed[i];
    const bucket = componentsUsed.includes(component) ? found : notFound;
    bucket.push(component)
  }

  return { found, notFound }
}

async function calculateCoverage(expectedComponents, srcPath)  {
  console.log('\n');
  console.log(`Analysing HTML files in folder ./${srcPath}...`);
  console.log('\n');

  var results = await finder.find({'term': "\<wiz-", 'flags': 'ig'}, srcPath, '.html$');

  const componentsFound = {};

  for (var result in results) {
      var res = results[result];

      for(var index in res.line) {
        const componentName = res.line[index].match(/wiz-\w+-?\w+/ig)[0]
        componentsFound[componentName] = true 
      }
  }

  const compareResult = compare(expectedComponents, Object.keys(componentsFound))

  console.log('Analysis result');
  console.log('---------------');
  console.log('INFO: Found:', compareResult.found);
  console.log('INFO: Did not find:', compareResult.notFound);

  coverage = ((compareResult.found.length / expectedComponents.length) * 100).toFixed(2)
  
  console.log('INFO: SYZ Coverage:', coverage);
  return coverage;
}

function onResultsPublished() {
  if (buildBreakerOptions.isOn) {
    buildBreaker.run(coverage, buildBreakerOptions.gateWay);
  } else {
    console.log('INFO:', 'SYZ BuildBreaker: OFF')
  }
}

function abortIfNoName(appName) {
  if (!appName) {
    console.log('ERROR: No app name provided. Aborting analysis.');
    process.exit(1);
  }
}

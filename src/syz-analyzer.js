var finder = require('find-in-files');
var publisher = require('./syz-analysis-publisher');
var buildBreaker = require('./syz-build-breaker');
var componentsListService = require('./components-list-service');

var exports = module.exports;

var buildBreakerOptions = {
  gateWay: undefined,
  isOn: undefined,
};

exports.runAnalysis = async function (appName, expectedCoverage, breakBuild, srcPath, components) {
  buildBreakerOptions.gateWay = expectedCoverage;
  buildBreakerOptions.isOn = breakBuild;

  printHeader();
  const expectedComponents = await fetchExpectedComponentsList(appName, components);
  const { coverage, componentsFound, componentsNotFound } = await calculateCoverage(expectedComponents, srcPath);

  publisher.publish(
    appName,
    coverage,
    componentsFound,
    componentsNotFound,
    onResultsPublished
  );
}

function printHeader() {
  console.log('\n');
  console.log('SYZ Analyzer');
  console.log('============');
}

async function fetchExpectedComponentsList(appName, components) {
  abortIfNoName(appName);

  console.log(`Fetching expected components list for ${appName}...`);

  const data = await componentsListService.fetch(appName);

  var expectedComponents = data;

  console.log('\n');

  let cliComponents = [];
  if (components)
    cliComponents = components.split(',');

  if (expectedComponents.length === 0 && cliComponents.length === 0) {
    console.log('INFO: This application is not expected to use any SYZ components.');
    process.exit();
  }

  console.log('INFO: This application shoud use the following SYZ components');
  console.log('\tFetched SYZ components', expectedComponents);
  console.log('\tRequired SYZ components', cliComponents);

  return expectedComponents.concat(cliComponents);
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

  const coverage = ((compareResult.found.length / expectedComponents.length) * 100).toFixed(2)
  
  console.log('INFO: SYZ Coverage:', coverage);

  return {
    coverage,
    componentsFound: compareResult.found,
    componentsNotFound: compareResult.notFound,
  };
}

function onResultsPublished(coverage) {
  if (buildBreakerOptions.isOn) {
    buildBreaker.run(coverage, buildBreakerOptions.gateWay);
  } else {
    console.log('INFO:', 'SYZ BuildBreaker: OFF')
  }
}

function abortIfNoName(appName) {
  if (!appName) {
    console.error('ERROR: No app name provided. Aborting analysis.');
    process.exit(1);
  }
}

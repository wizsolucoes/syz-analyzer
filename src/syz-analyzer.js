var finder = require('find-in-files');
var publisher = require('./syz-analysis-publisher');
var componentsListService = require('./components-list-service');

var exports = module.exports;

var isBuildBreakerOn;
var obligatoryComponents;
var componentsFound;

exports.runAnalysis = async function (
  appName,
  breakBuild,
  srcPath,
  components
) {
  console.log('appName', appName);
  console.log('breakBuild', breakBuild);
  console.log('srcPath', srcPath);
  console.log('components', components);

  isBuildBreakerOn = breakBuild;
  obligatoryComponents = components.split(',');

  printHeader();

  abortIfNoName(appName);

  const allComponents = await componentsListService.fetchAll();

  componentsFound = await findComponents(srcPath, allComponents);

  publisher.publishResult(appName, componentsFound, checkObligatoryComponents);
};

function printHeader() {
  console.log('\n');
  console.log('SYZ Analyzer');
  console.log('============');
}

async function findComponents(srcPath, validComponents) {
  console.log('\n');
  console.log(`Analysing HTML files in folder ./${srcPath}...`);
  console.log('\n');

  var searchResults = await finder.find(
    { term: '(<wiz-|<ng-syz-)', flags: 'ig' },
    srcPath,
    '.html$'
  );

  const componentsFoundMap = {};
  const componentsFoundList = [];

  for (var result in searchResults) {
    var res = searchResults[result];

    for (var index in res.line) {
      const componentName = res.line[index].match(/(wiz-|ng-syz-)[-\w]*/gi)[0];
      componentsFoundMap[componentName] = true;
    }
  }

  for (var entry in componentsFoundMap) {
    if (validComponents.indexOf(entry) !== -1) {
      componentsFoundList.push(entry);
    }
  }

  return componentsFoundList;
}

function abortIfNoName(appName) {
  if (!appName) {
    console.error('ERROR: No app name provided. Aborting analysis.');
    process.exit(1);
  }
}

function checkObligatoryComponents() {
  if (
    !isBuildBreakerOn ||
    !obligatoryComponents ||
    !obligatoryComponents.length
  ) {
    return;
  }

  let hasAllObligatoryComponents = true;
  const componentsNotFound = [];

  for (const component of obligatoryComponents) {
    const hasThisComponent = componentsFound.indexOf(component) !== -1;
    hasAllObligatoryComponents = hasAllObligatoryComponents && hasThisComponent;
    if (!hasThisComponent) {
      componentsNotFound.push(component);
    }
  }

  if (!hasAllObligatoryComponents) {
    console.error(
      'ERROR: Alguns componentes obrigatórios não foram encontrados.'
    );

    console.error(
      'O uso destes componentes é obrigatório:',
      obligatoryComponents
    );
    console.error('Estes componentes foram encontrados:', componentsFound);
    console.error(
      'Estes componentes NÃO foram encontrados:',
      componentsNotFound
    );
    process.exit(1);
  } else {
    console.log('INFO:', 'Todos os componentes obrigatórios foram encontrados');
  }
}

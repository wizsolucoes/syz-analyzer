var azure = require('azure-storage');

var entGen = azure.TableUtilities.entityGenerator;

var tableName = process.env.SYZ_ANALYSIS_STORAGE_TABLE;
var storageAccount = process.env.SYZ_ANALYSIS_STORAGE_ACCOUNT;
var storageAccessKey = process.env.SYZ_ANALYSIS_STORAGE_KEY;
var tableSvc;
var appId;
var analysisValue;
var callerCallBack;
var componentsFoundList;

var exports = module.exports;

exports.publishResult = function (appName, componentsFound, callBack) {
  appId = appName;
  callerCallBack = callBack;
  componentsFoundList = componentsFound;

  if (!areAzureStorageParamsValid()) {
    callBack(analysisValue);
    return;
  }

  printHeader();

  tableSvc = azure.createTableService(storageAccount, storageAccessKey);
  tableSvc.createTableIfNotExists(tableName, onCreated);
};

function onCreated(error, result, response) {
  handleError(error);

  console.log(`INFO: ${tableName} table created or already exists.`);

  // Create app entity of not exists
  var appEntity = {
    PartitionKey: entGen.String(appId),
    RowKey: entGen.String('Application'),
    lastAnalysisValue: entGen.Double(analysisValue),
  };

  tableSvc.insertOrMergeEntity(tableName, appEntity, onAppEntityInserted);
}

function onAppEntityInserted(error, result, response) {
  handleError(error);

  console.log(`INFO: App entity created or updated.`);

  // Create app analysis entity
  var analysisEntity = {
    PartitionKey: entGen.String(appId),
    RowKey: entGen.String(`${new Date().getTime()}`),
    componentsFound: entGen.String(componentsFoundList.toString()),
  };

  tableSvc.insertOrMergeEntity(
    tableName,
    analysisEntity,
    onAnalysisEntityInserted
  );
}

function onAnalysisEntityInserted(error, result, response) {
  handleError(error);
  console.log('SUCCESS: Analysis results published.');
  console.log('===================================');
  console.log('\n');
  callerCallBack();
}

function handleError(error) {
  if (error) {
    console.error('ERROR:', error);
    process.exit(1);
  }
}

function printHeader() {
  console.log('\n');
  console.log('SYZ Analysis Publisher');
  console.log('======================');
}

function areAzureStorageParamsValid() {
  if (!appId) {
    console.log('INFO: No app id found. Aborting publishing analysis.');
    return false;
  }

  if (!tableName) {
    console.log(
      'INFO: No Azure Storage Account Table name found. Aborting publishing analysis.'
    );
    return false;
  }

  if (!storageAccount) {
    console.log(
      'INFO: No Azure Storage Account name found. Aborting publishing analysis.'
    );
    return false;
  }

  if (!storageAccessKey) {
    console.log(
      'INFO: No Azure Storage Table access key found. Aborting publishing analysis.'
    );
    return false;
  }

  return true;
}

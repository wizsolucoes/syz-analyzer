const axios = require('axios').default;

var baseUrl = process.env.SYZ_ANALYSIS_COMPONENT_SERVICE_URL;

var exports = module.exports;

exports.fetchByAppId = async function (appId) {
  if (!baseUrl) {
    console.error(
      'ERROR: Component service base url not provided. Aborting analysis.'
    );
    process.exit(1);
  }

  try {
    const response = await axios.post(baseUrl, {
      repository: appId,
    });
    return response.data.filter(hasTitle).map(extractComponentName);
  } catch (error) {
    console.error('ERROR:', error);
    process.exit(1);
  }
};

function extractComponentName(obj) {
  return obj['Title'].trim();
}

function hasTitle(obj) {
  return !!obj['Title'];
}

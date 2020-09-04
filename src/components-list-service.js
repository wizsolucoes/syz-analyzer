const axios = require('axios').default;

var baseUrl = process.env.SYZ_ANALYSIS_COMPONENT_SERVICE_URL;

var exports = module.exports;

exports.fetch = async function (appId) {
  if (!baseUrl) {
    console.log('ERROR: Component service base url not provided. Aborting analysis.');
    process.exit();
  }

  try {
    const response = await axios.post(
      baseUrl,
      {
        repository: appId
      }
    );
    return response.data.map(extractComponentName);
  } catch (error) {
    console.error('ERROR:', error);
    process.exit();
  }
}

function extractComponentName(obj) {
  return obj['Title'].trim();
}
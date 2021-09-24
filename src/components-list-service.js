const { createTokenAuth } = require('@octokit/auth-token');
const { request } = require('@octokit/request');

const github_pat = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;

var exports = module.exports;

exports.fetchAll = async function () {
  const auth = createTokenAuth(github_pat);

  const requestWithAuth = request.defaults({
    request: {
      hook: auth.hook,
    },
  });

  const route = 'GET /repos/{owner}/{repo}/contents/{path}';
  const repo = 'syz';
  const owner = 'wizsolucoes';
  let ngSyzComponents = [];
  let wizComponents = [];

  try {
    const result = await requestWithAuth(route, {
      owner,
      repo,
      path: 'packages/ng-syz/projects/ng-syz/src/lib',
    });
    ngSyzComponents = result.data.map(prefixNameWithNgSyz).filter(isDirectory);
  } catch (error) {
    console.error('ERROR:', error);
    process.exit(1);
  }

  try {
    const result = await requestWithAuth(route, {
      owner,
      repo,
      path: 'packages/components',
    });
    wizComponents = result.data.map(removeWcPrefix).filter(isDirectory);
  } catch (error) {
    console.error('ERROR:', error);
    process.exit(1);
  }

  return [...ngSyzComponents, ...wizComponents];
};

function prefixNameWithNgSyz(obj) {
  return 'ng-syz-' + obj.name;
}

function removeWcPrefix(obj) {
  const prefix = 'wc-';
  return obj.name.slice(prefix.length, obj.name.length);
}

function isDirectory(obj) {
  return obj.indexOf('.') === -1;
}

var SemanticReleaseError = require('@semantic-release/error');
var exec = require('child_process').exec;
var request = require('request');
var _get = require('lodash.get');

/**
 * query does a get request to vscode's marketplace api,
 * and fetches extensions matching the given package name.
 *
 * The package name search is fuzzy, so many barely matching
 * names also show up in the results, which can be filtered off later.
 *
 * @param packageName string - name of the package to be searched.
*/
function query(packageName, cb) {
  return request
    .post('https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery?api-version=3.0-preview.1', {
      accept: 'application/json',
      contentType: 'application/json',
      json: true,
      // eslint-disable-next-line quotes, key-spacing, comma-spacing
      body: {"filters":[{"criteria":[{"filterType":8,"value":"Microsoft.VisualStudio.Code"},{"filterType":10,"value":packageName}],"pageNumber":1,"pageSize":50,"sortBy":0,"sortOrder":0}],"assetTypes":["Microsoft.VisualStudio.Services.Content.Details","Microsoft.VisualStudio.Services.VSIXPackage"],"flags":914},
    }, cb);
}

function getLastRelease(pluginConfig, {pkg, npm, plugins, options}, cb) {
  query(pkg.author.name.replace(' ', '+'), function(err, res, body) {
    if (err) {
      console.log('error while retrieving', err);
      return cb(err);
    } else if (res.statusCode !== 200) {
      console.log('not found', res.body);
      return cb(new SemanticReleaseError("Couldn't get results from marketplace"));
    }

    const list = _get(body, 'results[0].extensions');
    if (!list) {
      return cb(new SemanticReleaseError("Couldn't find extension on marketplace"));
    }
    // since the search returns a lot of bogus results, this line
    // finds the exact extension.
    const ext = list.find((extension) => extension.extensionName === pkg.name);
    if (!ext) {
      return cb(new SemanticReleaseError("Couldn't find extension on marketplace"));
    }

    const version = ext.versions[0].version;

    /*
     * Now, we fetch the latest git tags from remote to our local repo. This will be used
     * to get the list of commits between the latest release version and HEAD.
     *
     * This rather roundabout step is necessary because the VS Marketplace doesn't store
     * the `gitHead` of releases like npm does.
     * To get the list of commits between last release on marketplace and the current HEAD
     * the best way I've determined is:
     * - fetching the tags,
     * - prefixing `v` to current version to get the nearest tag, and
     * - passing that as the ref in `gitHead`.
     *
     * Another (more purer) way is to get the actual tag using `git describe --tags --abbrev=0`,
     * but since the version number and tag name are in-sync (thanks to semantic-release)
     * so, I'll just use the version number.
     */
    exec('git fetch', {}, function(err2, stdout2, stderr2) {
      if (err2) {
        console.log('error while fetching git tags', err2);
        return cb(err2);
      }

      cb(null, {
        version,
        gitHead: `v${version}`,
        get tag() {
          console.warn('deprecated', 'tag will be removed with the next major release');
          return npm.tag;
        }
      });
    });
  });
}

module.exports = getLastRelease;

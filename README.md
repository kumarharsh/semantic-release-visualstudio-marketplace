# Semantic Release Scripts for Visual Studio Marketplace

> This repo is deprecated. The scripts in this repo won't work anymore due to breaking changes in how semantic release works. Please use the [semantic-release-vsce](http://npmjs.com/package/semantic-release-vsce) plugin which has much more features and is actually very good.

This repo offers a script for integrating [semantic-release](https://github.com/semantic-release/semantic-release) with publishing extensions on the [Visual Studio Marketplace](https://marketplace.visualstudio.com). This is done by querying the marketplace for the latest version of the current package (determined from package.json).

You can use this script like this in your code:

```json
/* package.json */
  "release": {
    "getLastRelease": "semantic-release-visualstudio-marketplace-version",
    "analyzeCommits": "./scripts/analyzeCommits"
  }
```

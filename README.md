# Semantic Release Scripts for Visual Studio Marketplace

This repo offers a script for integrating [semantic-release](https://github.com/semantic-release/semantic-release) with publishing extensions on the [Visual Studio Marketplace](https://marketplace.visualstudio.com). This is done by querying the marketplace for the latest version of the current package (determined from package.json).

You can use this script like this in your code:

```json
/* package.json */
  "release": {
    "getLastRelease": "semantic-release-visualstudio-marketplace-version",
    "analyzeCommits": "./scripts/analyzeCommits"
  }
```

# isomorphic-xml2js

A drop-in replacement for [xml2js](https://www.npmjs.com/package/xml2js) that uses the built in DOMParser/XMLSerializer when bundled for the browser, drastically reducing the bundle size. Simply exports xml2js when used in a node.js environment.

Currently no options are supported except for rootName on `Builder`. The goal is to eventually create a browser-friendly implementation of all the xml2js API (within reason). For now it just works the way I happen to have configured xml2js in the past, which is basically like so:

```js
const parserOpts = {
  explicitArray: false,
  explicitCharkey: false,
  explicitRoot: false
};

const builderOpts = {
  explicitArray: false,
  explicitCharkey: false
  rootName: "some-root-name"
};
```

Detailed bundle size and performance comparisons in the browser will come later. For now it appears that you can reduce your minified bundle size by about 120kb by using isomorphic-xml2js over xml2js in your project.

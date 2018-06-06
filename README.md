# isomorphic-xml2js

```sh
npm install --save isomorphic-xml2js
```

A drop-in replacement for [xml2js](https://www.npmjs.com/package/xml2js) that uses the built in DOMParser/XMLSerializer when bundled for the browser, drastically reducing the bundle size (~129k for node-xml2js, currently ~6k for isomorphic-xml2js). Simply exports xml2js when used in a node.js environment.

The goal is to support as much of the xml2js API as reasonably possible. Some features may be dropped if they are found to be unreasonably difficult to implement or if they excessively increase the bundle size or reduce performance.

## Limitations

- `strict: false` has no effect. Parsing malformed XML documents is unsupported.
- `async: true` has no effect. Parsing is always synchronous, even though the API is callback-based to match node-xml2js.
- `options.renderOpts` is ignored and XML documents are not pretty printed.
  - XSLTProcessor's `<xslt:output indent="yes" />` attribute is [not supported in Firefox](https://developer.mozilla.org/en-US/docs/Web/XSLT/output), Edge or IE and so doesn't seem portable enough to be worth it. Non-built-in methods of pretty printing XML may be too much of an increase in bundle size for a feature that's usually only useful at development time.
- `validator` is not implemented.
- CDATA can be parsed but it is converted to character entities when building.
- Whitespace-only CDATA is not preserved when the default `includeWhiteChars: false` is specified, even though such CDATA is preserved in node-xml2js.
- Calling a constructor without `new` may give a runtime error depending on the ES target level in your bundler config.
- `addListener` and `on` methods on `xml2js.Parser` are not supported.

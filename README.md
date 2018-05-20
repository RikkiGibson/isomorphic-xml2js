# isomorphic-xml2js

```sh
npm install --save isomorphic-xml2js
```

A drop-in replacement for [xml2js](https://www.npmjs.com/package/xml2js) that uses the built in DOMParser/XMLSerializer when bundled for the browser, drastically reducing the bundle size (~129k for node-xml2js, currently ~6k for isomorphic-xml2js). Simply exports xml2js when used in a node.js environment.

The goal is to support as much of the xml2js API as reasonably possible. Some features may be dropped if they are found to be unreasonably difficult to implement or if they excessively increase the bundle size or reduce performance.

Note that the JavaScript in this library is targeting ES2017. If you want to target an earlier ES version when bundling, make sure you use something like [babel](https://github.com/babel/babel) in your bundler.

## Limitations

- `strict: false` has no effect. Parsing malformed XML documents is unsupported.
- `async: true` has no effect. Parsing is always synchronous, even though the API is callback-based to match node-xml2js.
- `addListener` and `on` methods on `xml2js.Parser` are not supported.
- `options.renderOpts.pretty` doesn't work in Internet Explorer due to missing [XSLTProcessor](https://developer.mozilla.org/en-US/docs/Web/API/XSLTProcessor).
- `options.renderOpts.indent` has no effect due to XSLTProcessor not supporting a user-defined indent depth when pretty printing.
- `attrNameProcessors`, `attrValueProcessors`, `tagNameProcessors`, and `valueProcessors` are not yet implemented.
- `xmlns` is not yet implemented.
- `validator` is not implemented.
- `normalizeTags` is not yet implemented.
- CDATA can be parsed but it is converted to character entities when building.
- Whitespace-only CDATA is not preserved when the default `includeWhiteChars: false` is specified, even though such CDATA is preserved in node-xml2js.
- Calling a constructor without `new` may give a runtime error depending on the ES target level in your bundler config.

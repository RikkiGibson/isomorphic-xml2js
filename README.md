# isomorphic-xml2js

A drop-in replacement for [xml2js](https://www.npmjs.com/package/xml2js) that uses the built in DOMParser/XMLSerializer when bundled for the browser, drastically reducing the bundle size (~129k for node-xml2js, currently ~6k for isomorphic-xml2js). Simply exports xml2js when used in a node.js environment.

The goal is to support as much of the xml2js API as reasonably possible. Some features may be dropped if they are found to be unreasonably difficult to implement or if they excessively increase the bundle size or reduce performance.

## Limitations

- `strict: false` has no effect.
- `async: true` has no effect.
- `addListener` and `on` methods on `xml2js.Parser` are not supported.
- `options.renderOpts.pretty` doesn't work in Internet Explorer due to missing [XSLTProcessor](https://developer.mozilla.org/en-US/docs/Web/API/XSLTProcessor).
- `options.renderOpts.indent` has no effect.
  - This can probably be implemented by 
- `attrNameProcessors`, `attrValueProcessors`, `tagNameProcessors`, and `valueProcessors` are not yet implemented.
- `xmlns` is not yet implemented.
- `validator` is not implemented.
- `normalizeTags` is not yet implemented.
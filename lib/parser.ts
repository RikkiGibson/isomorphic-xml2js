
const errorNS = new DOMParser().parseFromString('INVALID', 'text/xml').getElementsByTagName("parsererror")[0].namespaceURI!;
function getErrorMessage(dom: Document): string | undefined {
  const parserErrors = dom.getElementsByTagNameNS(errorNS, "parsererror");
  if (parserErrors.length) {
    return parserErrors.item(0).innerHTML;
  } else {
    return undefined;
  }
}

export function parseString(xml: string, callback: Function): void;
export function parseString(xml: string, options?: any, callback?: Function) {
  if (typeof options === "function") {
    callback = options;
    options = undefined;
  }

  if (typeof callback !== "function") {
    throw new TypeError("callback must be a function, but got " + callback);
  }

  const parser = new DOMParser();
  try {
    const dom = parser.parseFromString(xml, "application/xml");
    const errorMessage = getErrorMessage(dom);
    if (errorMessage) {
      throw new Error(errorMessage);
    }

    const obj = domToObject(dom.childNodes[0]);
    callback(null, obj);
  } catch (err) {
    callback(err);
  }
}

function isElement(node: Node): node is Element {
  return !!(node as Element).attributes;
}

function domToObject(node: Node): any {
  // empty node
  if (node.childNodes.length === 0 && !(isElement(node) && node.hasAttributes())) {
    return '';
  }

  if (node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE) {
    return node.childNodes[0].nodeValue;
  }

  const result: { [key: string]: any } = {};
  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes[i];
    // Ignore leading/trailing whitespace nodes
    if (child.nodeType !== Node.TEXT_NODE) {
      if (!result[child.nodeName]) {
        result[child.nodeName] = domToObject(child);
      } else if (Array.isArray(result[child.nodeName])) {
        result[child.nodeName].push(domToObject(child));
      } else {
        result[child.nodeName] = [result[child.nodeName], domToObject(child)];
      }
    }
  }

  if (isElement(node) && node.hasAttributes()) {
    result['$'] = {};

    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i];
      result['$'][attr.nodeName] = attr.nodeValue;
    }
  }

  return result;
}

export class Parser {
  constructor(opts: any) {}

  parseString: (xml: string, callback: (err: any, res: any) => void) => void = parseString;
}

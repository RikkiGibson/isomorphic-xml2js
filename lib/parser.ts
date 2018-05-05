import { OptionsV2, overrideDefaultsWith } from "./options";

const errorNS = new DOMParser().parseFromString('INVALID', 'text/xml').getElementsByTagName("parsererror")[0].namespaceURI!;
function getErrorMessage(dom: Document): string | undefined {
  const parserErrors = dom.getElementsByTagNameNS(errorNS, "parsererror");
  if (parserErrors.length) {
    return parserErrors.item(0).innerHTML;
  } else {
    return undefined;
  }
}

export function parseString(xml: string, callback: (err: any, res: any) => void): void;
export function parseString(xml: string, options?: OptionsV2, callback?: (err: any, res: any) => void): void;
export function parseString(xml: string, options?: any, callback?: (err: any, res: any) => void) {
  if (typeof options === "function") {
    callback = options;
    options = undefined;
  }

  if (typeof callback !== "function") {
    throw new TypeError("callback must be a function, but got " + callback);
  }

  new Parser(options).parseString(xml, callback);
}

function isElement(node: Node): node is Element {
  return !!(node as Element).attributes;
}

export class Parser {
  private readonly opts: OptionsV2;
  constructor(opts: OptionsV2) {
    this.opts = overrideDefaultsWith(opts);
  }

  parseString(xml: string, callback: (err: any, res?: any) => void): void {
    const parser = new DOMParser();
    try {
      const dom = parser.parseFromString(xml, "application/xml");
      const errorMessage = getErrorMessage(dom);
      if (errorMessage) {
        throw new Error(errorMessage);
      }

      const obj = this.opts.explicitRoot
        ? { [dom.documentElement.nodeName]: this.domToObject(dom.childNodes[0]) }
        : this.domToObject(dom.childNodes[0]);

      callback(null, obj);
    } catch (err) {
      callback(err);
    }
  };

  domToObject(node: Node): any {
    if (node.childNodes.length === 0 && !(isElement(node) && node.hasAttributes())) {
      return '';
    }

    let areAllChildrenText = node.childNodes.length >= 1;
    for (let i = 0; areAllChildrenText && i < node.childNodes.length; i++) {
      areAllChildrenText = areAllChildrenText &&
        (node.childNodes[i].nodeType === Node.TEXT_NODE ||
        node.childNodes[i].nodeType === Node.CDATA_SECTION_NODE);
    }

    if (areAllChildrenText) {
      let content = '';
      for (let i = 0; i < node.childNodes.length; i++) {
        content += node.childNodes[i].nodeValue;
      }
      return content;
    }

    const result: { [key: string]: any } = {};
    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i];
      // Ignore leading/trailing whitespace nodes
      if (child.nodeType !== Node.TEXT_NODE) {
        if (!result[child.nodeName]) {
          result[child.nodeName] = this.opts.explicitArray ? [this.domToObject(child)] : this.domToObject(child);
        } else if (Array.isArray(result[child.nodeName])) {
          result[child.nodeName].push(this.domToObject(child));
        } else {
          result[child.nodeName] = [result[child.nodeName], this.domToObject(child)];
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
}

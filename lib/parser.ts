import { OptionsV2, overrideDefaultsWith, defaultAttrkey, defaultCharkey, defaultChildkey } from "./options";

let errorNS: string;
try {
  errorNS = new DOMParser().parseFromString('INVALID', 'text/xml').getElementsByTagName("parsererror")[0].namespaceURI!;
} catch (ignored) {
  // Most browsers will return a document containing <parsererror>, but IE will throw.
}

function throwIfError(dom: Document) {
  if (errorNS) {
    const parserErrors = dom.getElementsByTagNameNS(errorNS, "parsererror");
    if (parserErrors.length) {
      throw new Error(parserErrors.item(0).innerHTML);
    }
  }
}

export function parseString(xml: string, callback: (err: any, res: any) => void): void;
export function parseString(xml: string, options?: OptionsV2, callback?: (err: any, res: any) => void): void;
export function parseString(xml: string, options?: any, callback?: (err: any, res: any) => void) {
  if (typeof options === "function") {
    callback = options;
    options = undefined;
  }

  new Parser(options).parseString(xml, callback!);
}

function isElement(node: Node): node is Element {
  return !!(node as Element).attributes;
}

export class Parser {
  private readonly opts: OptionsV2;
  constructor(opts: OptionsV2) {
    this.opts = overrideDefaultsWith(opts);
  }

  tagName(nodeName: string): string {
    return this.opts.tagNameProcessors!.reduce((str, fn) => fn(str), this.opts.normalizeTags ? nodeName.toLowerCase() : nodeName);
  }

  parseString(xml: string, callback: (err: any, res?: any) => void): void {
    const parser = new DOMParser();
    let obj;
    try {
      const dom = parser.parseFromString(xml, "application/xml");
      throwIfError(dom);

      if (this.opts.explicitRoot) {
        const childName = this.tagName(dom.documentElement.nodeName);
        obj = { [childName]: this.domToObject(dom.childNodes[0]) };
      } else {
        obj = this.domToObject(dom.childNodes[0]);
      }
    } catch (err) {
      callback(err);
      return;
    }

    callback(null, obj);
  };

  parseAttributes(node: Node): { [key: string]: any } | undefined {
    if (this.opts.ignoreAttrs || !isElement(node) || !node.hasAttributes()) {
      return undefined;
    }

    const namespaceKey = (this.opts.attrkey || defaultAttrkey) + "ns";
    const attrsObject: { [key: string]: any } = {};

    if (isElement(node) && node.hasAttributes()) {
      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i];
        const attrName = this.opts.attrNameProcessors!.reduce((str, fn) => fn(str), attr.nodeName);
        const attrValue = this.opts.attrValueProcessors!.reduce((str, fn) => fn(str), attr.nodeValue);
        if (this.opts.xmlns) {
          attrsObject[attrName] = { value: attrValue, local: attr.localName, uri: attr.namespaceURI };
        } else {
          attrsObject[attrName] = attrValue;
        }
      }
    }

    return attrsObject;
  }

  domToObject(node: Node): any {
    if (node.childNodes.length === 0 && !(isElement(node) && node.hasAttributes())) {
      return this.opts.emptyTag;
    }

    const attrsObject = this.parseAttributes(node);
    const childkey = this.opts.childkey || defaultChildkey;
    const charkey = this.opts.charkey || defaultCharkey;

    let result: any = {};
    let allTextContent = '';
    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i];
      if (child.nodeType === Node.TEXT_NODE || child.nodeType === Node.CDATA_SECTION_NODE) {
        const nodeValue = child.nodeValue || '';
        const textContent = this.opts.normalize
          ? nodeValue.replace(/\n[ ]+\b/g, ' ').trim()
          : this.opts.trim
            ? nodeValue.trim()
            : nodeValue;

        allTextContent += textContent;

        const addTextChild = this.opts.explicitChildren &&
          this.opts.preserveChildrenOrder &&
          this.opts.charsAsChildren &&
          (this.opts.includeWhiteChars || textContent.trim());

        if (addTextChild) {
          if (!result[childkey]) {
            result[childkey] = [];
          }
          result[childkey].push({ "#name": "__text__", [charkey]: textContent });
        }
      } else {
        const childObject = this.domToObject(child);
        const childName = this.tagName(child.nodeName);
        if (!result[childName]) {
          result[childName] = this.opts.explicitArray ? [this.domToObject(child)] : this.domToObject(child);
        } else if (Array.isArray(result[childName])) {
          result[childName].push(childObject);
        } else {
          result[childName] = [result[childName], this.domToObject(child)];
        }

        if (this.opts.explicitChildren && this.opts.preserveChildrenOrder) {
          if (!result[childkey]) {
            result[childkey] = [];
          }

          if (typeof childObject === "object") {
            result[childkey].push({ "#name": childName, ...childObject });
          } else {
            result[childkey].push({ "#name": childName, [charkey]: childObject });
          }
        }
      }
    }

    if (Object.keys(result).length === 0 && !attrsObject && !this.opts.explicitCharkey && !this.opts.charkey && !this.opts.xmlns) {
      // Consider passing down the processed tag name instead of recomputing it
      const childName = this.tagName(node.nodeName);
      return this.opts.valueProcessors!.reduce((str, fn) => fn(str, childName), allTextContent);
    }

    // TODO: can this logic be simplified?
    const useExplicitChildrenObj = (this.opts.explicitChildren || this.opts.childkey) &&
      !this.opts.preserveChildrenOrder &&
      (Object.keys(result).length > 0 || (allTextContent && this.opts.charsAsChildren));

    if (useExplicitChildrenObj) {
      result = { [childkey]: result };
    }

    if ((allTextContent && this.opts.includeWhiteChars) || allTextContent.trim()) {
      if (useExplicitChildrenObj && this.opts.charsAsChildren) {
        result[childkey][charkey] = allTextContent;
      } else {
        result[charkey] = allTextContent;
      }
    }

    if (this.opts.xmlns) {
      const namespaceKey = (this.opts.attrkey || defaultAttrkey) + "ns";
      result[namespaceKey] = { local: node.localName, uri: node.namespaceURI };
    }

    if (attrsObject) {
      if (this.opts.mergeAttrs) {
        if (this.opts.explicitArray) {
          for (const key of Object.keys(attrsObject)) {
            result[key] = [attrsObject[key]];
          }
        } else {
          result = { ...result, ...attrsObject };
        }
      } else {
        result[this.opts.attrkey || defaultAttrkey] = attrsObject;
      }
    }

    return result;
  }
}

import { OptionsV2, overrideDefaultsWith, defaultAttrkey, defaultCharkey, defaultChildkey } from "./options";

const doc = document.implementation.createDocument(null, null, null);
const serializer = new XMLSerializer();

export class Builder {
  private readonly opts: OptionsV2;
  constructor(opts?: OptionsV2) {
    this.opts = overrideDefaultsWith(opts);
  }

  buildAttributes(attrs: { [key: string]: { toString(): string; } }): Attr[] {
    const result = [];
    for (const key of Object.keys(attrs)) {
      const attr = doc.createAttribute(key);
      attr.value = attrs[key].toString();
      result.push(attr);
    }
    return result;
  }

  buildNode(obj: any, context: { elementName: string }): Node[] {
    const attrkey = this.opts.attrkey || defaultAttrkey;
    const charkey = this.opts.charkey || defaultCharkey;
    const childkey = this.opts.childkey || defaultChildkey;

    if (obj == undefined) {
      obj = this.opts.emptyTag || '';
    }

    if (typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean") {
      const elem = doc.createElement(context.elementName);
      elem.textContent = obj.toString();
      return [elem];
    }
    else if (Array.isArray(obj)) {
      const result = [];
      for (const arrayElem of obj) {
        for (const child of this.buildNode(arrayElem, context)) {
          result.push(child);
        }
      }
      return result;
    } else if (typeof obj === "object") {
      const elem = doc.createElement(context.elementName);
      for (const key of Object.keys(obj)) {
        if (key === attrkey) {
          for (const attr of this.buildAttributes(obj[key])) {
            elem.attributes.setNamedItem(attr);
          }
        } else if (key === childkey && !(this.opts.explicitChildren && this.opts.preserveChildrenOrder)) {
          const children = obj[childkey];
          for (const childElementKey of Object.keys(children)) {
            for (const child of this.buildNode(children[childElementKey], { elementName: childElementKey })) {
              elem.appendChild(child);
            }
          }
        } else if (key === charkey) {
          elem.appendChild(document.createTextNode(obj[key]));
        } else {
          for (const child of this.buildNode(obj[key], { elementName: key })) {
            elem.appendChild(child);
          }
        }
      }
      return [elem];
    }
    else {
      throw new Error(`Illegal value passed to buildObject: ${obj}`);
    }
  }

  buildObject(obj: any): string {
    const rootName = this.opts.rootName || "root";

    if (Array.isArray(obj)) {
      const mergedObj: { [key: string]: any } = {};
      for (const arrayElem of obj) {
        for (const key of Object.keys(arrayElem)) {
          if (!mergedObj[key]) {
            mergedObj[key] = [];
          }
          mergedObj[key].push(arrayElem[key])
        }
      }
      obj = mergedObj;
    }

    const keys = Object.keys(obj);
    let dom: Node;
    if (keys.length <= 1 && !this.opts.rootName && this.opts.explicitRoot) {
      dom = this.buildNode(obj[keys[0]] || '', { elementName: keys[0] || rootName })[0];
    } else {
      dom = this.buildNode(obj, { elementName: rootName })[0];
    }

    let xmlString = serializer.serializeToString(dom);

    const xmldec = this.opts.xmldec;
    if (xmldec && !this.opts.headless) {
      let declaration = `<?xml version="${xmldec.version}" encoding="${xmldec.encoding}" standalone="${xmldec.standalone ? "yes" : "no"}"?>`;
      xmlString = declaration + xmlString;
    }

    return xmlString;
  }
}
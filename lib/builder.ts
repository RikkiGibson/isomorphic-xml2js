import { OptionsV2 } from "./options";

const doc = document.implementation.createDocument(null, null, null);
const serializer = new XMLSerializer();

function buildAttributes(attrs: { [key: string]: { toString(): string; } }): Attr[] {
  const result = [];
  for (const key of Object.keys(attrs)) {
    const attr = doc.createAttribute(key);
    attr.value = attrs[key].toString();
    result.push(attr);
  }
  return result;
}

function buildNode(obj: any, context: { elementName: string }): Node[] {
  if (typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean") {
    const elem = doc.createElement(context.elementName);
    elem.textContent = obj.toString();
    return [elem];
  }
  else if (Array.isArray(obj)) {
    const result = [];
    for (const arrayElem of obj) {
      for (const child of buildNode(arrayElem, context)) {
        result.push(child);
      }
    }
    return result;
  } else if (typeof obj === "object") {
    const elem = doc.createElement(context.elementName);
    for (const key of Object.keys(obj)) {
      if (key === '$') {
        for (const attr of buildAttributes(obj[key])) {
          elem.attributes.setNamedItem(attr);
        }
      } else {
        for (const child of buildNode(obj[key], { elementName: key })) {
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

export class Builder {
  constructor(private opts: OptionsV2) {}

  buildObject(obj: any): string {
    const rootName: string = this.opts.rootName;
    const dom = buildNode(obj, { elementName: rootName })[0];
    return serializer.serializeToString(dom);
  }
}
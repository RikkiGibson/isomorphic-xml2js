import { OptionsV2, overrideDefaultsWith } from "./options";

const doc = document.implementation.createDocument(null, null, null);
const serializer = new XMLSerializer();


const xsltStylesheet = new DOMParser().parseFromString(`<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output omit-xml-declaration="yes" indent="yes"/>
   <xsl:template match="node()|@*">
     <xsl:copy>
       <xsl:apply-templates select="node()|@*"/>
     </xsl:copy>
   </xsl:template>
</xsl:stylesheet>`, "application/xml");
const xsltProcessor = new XSLTProcessor();
xsltProcessor.importStylesheet(xsltStylesheet);


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
        if (key === '$') {
          for (const attr of this.buildAttributes(obj[key])) {
            elem.attributes.setNamedItem(attr);
          }
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
    let dom: Node;
    if (this.opts.explicitRoot) {
      const keys = Object.keys(obj);
      dom = this.buildNode(obj[keys[0]] || '', { elementName: keys[0] || rootName })[0];
    } else {
      dom = this.buildNode(obj, { elementName: rootName })[0];
    }

    if (this.opts.renderOpts!.pretty) {
      dom = xsltProcessor.transformToDocument(dom);
    }

    let xmlString = serializer.serializeToString(dom);

    const xmldec = this.opts.xmldec
    if (xmldec && !this.opts.headless) {
      let declaration = `<?xml version="${xmldec.version}" encoding="${xmldec.encoding}" standalone="${xmldec.standalone ? "yes" : "no"}"?>`;
      if (this.opts.renderOpts!.pretty) {
        declaration += this.opts.renderOpts!.newline;
      }

      xmlString = declaration + xmlString;
    }

    return xmlString;
  }
}
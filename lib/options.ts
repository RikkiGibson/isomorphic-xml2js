
export interface OptionsV2 {
  explicitRoot?: boolean;
  explicitArray?: boolean;
  explicitCharkey?: boolean;
  explicitChildren?: boolean;
  preserveChildrenOrder?: boolean;
  charsAsChildren?: boolean;
  includeWhiteChars?: boolean;
  trim?: boolean;
  normalize?: boolean;
  normalizeTags?: boolean;
  xmlns?: boolean;
  attrkey?: string;
  charkey?: string;
  childkey?: string;
  emptyTag?: any;
  mergeAttrs?: boolean;
  ignoreAttrs?: boolean;
  rootName?: string;
  headless?: boolean;
  strict?: true;
  tagNameProcessors?: ((tagName: any) => any)[];
  valueProcessors?: ((value: any, tagName: string) => any)[];
  attrNameProcessors?: ((attrName: any) => any)[];
  attrValueProcessors?: ((attrValue: any) => any)[];
  xmldec?: {
    version?: string;
    encoding?: string;
    standalone?: boolean;
  };
  renderOpts?: any;
}

const defaultOptions: OptionsV2 = {
  explicitRoot: true,
  explicitArray: true,
  emptyTag: '',
  strict: true,
  tagNameProcessors: [],
  valueProcessors: [],
  attrNameProcessors: [],
  attrValueProcessors: [],
  xmldec: { version: "1.0", encoding: "UTF-8", standalone: true }
};

export const defaultCharkey = "_";
export const defaultAttrkey = "$";
export const defaultChildkey = "$$";

export function overrideDefaultsWith(userOptions?: OptionsV2): OptionsV2 {
  // Ideally we would just use some generic deep merge thing here but don't want to pull in dependencies
  return {
    ...defaultOptions, ...userOptions,
    xmldec: { ...defaultOptions.xmldec, ...(userOptions && userOptions.xmldec) }
  };
}
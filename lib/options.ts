
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
  xmldec?: {
    version?: string;
    encoding?: string;
    standalone?: boolean;
  };
  renderOpts?: {
    pretty?: boolean;
    indent?: string;
    newline?: string;
  };
}

const defaultOptions: OptionsV2 = {
  explicitRoot: true,
  explicitArray: true,
  explicitCharkey: false,
  explicitChildren: false,
  preserveChildrenOrder: false,
  charsAsChildren: false,
  includeWhiteChars: false,
  trim: false,
  normalize: false,
  xmlns: false,
  emptyTag: '',
  mergeAttrs: false,
  ignoreAttrs: false,
  headless: false,
  strict: true,
  xmldec: { version: "1.0", encoding: "UTF-8", standalone: true },
  renderOpts: { pretty: true, indent: ' ', newline: '\n' }
};

export const defaultCharkey = "_";
export const defaultAttrkey = "$";
export const defaultChildkey = "$$";

export function overrideDefaultsWith(userOptions?: OptionsV2): OptionsV2 {
  // Ideally we would just use some generic deep merge thing here but don't want to pull in dependencies
  const result = { ...defaultOptions, ...userOptions };
  result.xmldec = { ...defaultOptions.xmldec, ...(userOptions && userOptions.xmldec) };
  result.renderOpts = { ...defaultOptions.renderOpts, ...(userOptions && userOptions.renderOpts) };
  return result;
}
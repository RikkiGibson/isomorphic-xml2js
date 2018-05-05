
export interface OptionsV2 {
  explicitRoot?: boolean;
  explicitArray?: boolean;
  explicitCharkey?: boolean;
  rootName?: string;
  headless?: boolean;
  xmldec?: {
    version?: string;
    encoding?: string;
    standalone?: boolean;
  };
  renderOpts?: {
    pretty?: boolean;
    indent?: string;
    newline?: string;
  }
}

const defaultOptions: OptionsV2 = {
  explicitRoot: true,
  explicitArray: true,
  explicitCharkey: true,
  rootName: "root",
  headless: false,
  xmldec: { version: "1.0", encoding: "UTF-8", standalone: true },
  renderOpts: { pretty: true, indent: ' ', newline: '\n' }
};

export function overrideDefaultsWith(userOptions?: OptionsV2): OptionsV2 {
  // Ideally we would just use some generic deep merge thing here but don't want to pull in dependencies
  const result = { ...defaultOptions, ...userOptions };
  result.xmldec = { ...defaultOptions.xmldec, ...(userOptions && userOptions.xmldec) };
  result.renderOpts = { ...defaultOptions.renderOpts, ...(userOptions && userOptions.renderOpts) };
  return result;
}
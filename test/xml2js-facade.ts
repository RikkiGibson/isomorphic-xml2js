import { Builder, Parser as RealParser, parseString } from "../lib/browser";

export { Builder , parseString }

// Facade for tests which depend on addListener method
export class Parser extends RealParser {
  cb?: (res: any) => void;

  addListener(eventName: string, cb: (res: any) => void) {
    this.cb = cb;
  }

  parseString(xml: string, callback?: (err: any, res?: any) => void) {
    super.parseString(xml, callback || ((err, res) => {
      if (err) {
        throw err;
      }

      this.cb!(res);
    }));
  }
}

import * as glob from "glob";

function adaptTests(module: any) {
  for (const key of Object.keys(module)) {
    it(key, function(done) {
      try {
        module[key]({ done, finish: done });
      } catch (err) {
        if (!(err instanceof Error)) {
          err = new Error(err);
        }
        throw err;
      }
    });
  }
}

describe("node-xml2js tests", () => {
  adaptTests(require("../node-xml2js/test/bom.test.coffee"));
  adaptTests(require("../node-xml2js/test/builder.test.coffee"));
  adaptTests(require("../node-xml2js/test/parser.test.coffee"));
  adaptTests(require("../node-xml2js/test/processors.test.coffee"));
});

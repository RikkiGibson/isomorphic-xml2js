
function adaptTests(suiteName: string, module: any) {
  describe(suiteName, () => {
    for (const key of Object.keys(module)) {
      it(key, (done) => {
        try {
          module[key]({
            done,
            finish: done,
            fail: (err: any) => {
              if (!(err instanceof Error)) {
                err = new Error(err);
              }
              done(err);
            }
          });
        } catch (err) {
          if (!(err instanceof Error)) {
            err = new Error(err);
          }
          throw err;
        }
      });
    }
  });
}

adaptTests("node-xml2js bom", require("../node-xml2js/test/bom.test.coffee"));
adaptTests("node-xml2js builder", require("../node-xml2js/test/builder.test.coffee"));
adaptTests("node-xml2js parser", require("../node-xml2js/test/parser.test.coffee"));
adaptTests("node-xml2js processors", require("../node-xml2js/test/processors.test.coffee"));

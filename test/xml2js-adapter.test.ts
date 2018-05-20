
function adaptTests(suiteName: string, module: any) {
  describe(suiteName, () => {
    for (const key of Object.keys(module)) {
      it(key, function(done) {
        try {
          module[key]({
            done,
            skip: () => this.skip(),
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

adaptTests("node-xml2js bom", require("./node-xml2js/bom.test.coffee"));
adaptTests("node-xml2js builder", require("./node-xml2js/builder.test.coffee"));
adaptTests("node-xml2js parser", require("./node-xml2js/parser.test.coffee"));
adaptTests("node-xml2js processors", require("./node-xml2js/processors.test.coffee"));

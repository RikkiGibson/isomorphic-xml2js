import * as assert from "assert";
import * as xml2js from "../lib/index";

describe("isomorphic xml2js builder", () => {
  it("builds a simple document", async () => {
    const obj = { foo: '123' };
    const builder = new xml2js.Builder({ rootName: "root", explicitArray: false, explicitCharkey: false });
    const expected = "<root><foo>123</foo></root>";
    const actual = builder.buildObject(obj);
    assert.strictEqual(actual, expected);
  });

  it("builds a document from an array", async () => {
    const obj = { foo: ['123', '456'] };
    const builder = new xml2js.Builder({ rootName: "root", explicitArray: false, explicitCharkey: false });
    const expected = "<root><foo>123</foo><foo>456</foo></root>";
    const actual = builder.buildObject(obj);
    assert.strictEqual(actual, expected);
  });
});

import * as assert from "assert";
import * as xml2js from "../lib/browser";

if (typeof Promise !== "function") {
  require("es6-promise").polyfill();
}

const parseString = (xml: string, opts?: any) => {
  return new Promise(function(resolve, reject) {
    new xml2js.Parser(opts || { explicitArray: false, explicitCharkey: false,  explicitRoot: false }).parseString(xml, function(err: any, result: any) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

describe("isomorphic xml2js parser", () => {
  it("parses a simple document", async () => {
    const xml = "<root><foo>123</foo></root>";
    const expected = { foo: '123' };
    const result = await parseString(xml);
    assert.deepStrictEqual(result, expected);
  });

  it("parses a list", async () => {
    const xml = `<root><foo>123</foo><foo>456</foo></root>`
    const expected = { foo: ['123', '456'] };
    const result = await parseString(xml);
    assert.deepStrictEqual(result, expected);
  });

  it("parses attributes", async () => {
    const xml = `<root foo="123" />`;
    const expected = { $: { foo: '123' } };
    const result = await parseString(xml);
    assert.deepStrictEqual(result, expected);
  });

  it("parses empty elements", async () => {
    const xml = `<root><foo></foo></root>`;
    const expected = { foo: '' };
    const result = await parseString(xml);
    assert.deepStrictEqual(result, expected);
  });

  it("gives an error on invalid XML", async () => {
    const xml = '42';
    try {
      await parseString(xml);
      assert.fail('should throw an error');
    } catch (err) {
      assert(!(err instanceof assert.AssertionError), "err should not be AssertionError");
    }
  });

  it("parses a document containing CDATA", async () => {
    const xml = `<root><![CDATA[&]]></root>`;
    const obj = await parseString(xml);
    assert.equal(obj, "&");
  });

  it("parses elements with attributes and text content", async () => {
    const xml = `<root><item desc="good">content</item></root>`;
    const obj = await parseString(xml);
    assert.deepStrictEqual(obj, { item: { $: { desc: "good" }, _: "content" } });
  });

  it("parses elements with attributes and text content with explicitChildren enabled", async () => {
    const xml = `<root><item desc="good">content</item></root>`;
    const expected = { root: { $$: { item: [ { $: { desc: "good" }, _: "content" } ] } } };
    const actual: any = await parseString(xml, { explicitChildren: true });
    assert.deepStrictEqual(actual.root.$$, expected.root.$$);
    assert.deepStrictEqual(actual, expected);
  });
});

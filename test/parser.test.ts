import * as assert from "assert";
import * as xml2js from "../lib/index";

const parseString = (xml: string) => {
  return new Promise(function(resolve, reject) {
    new xml2js.Parser({ explicitArray: false, explicitCharkey: false,  explicitRoot: false }).parseString(xml, function(err: any, result: any) {
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

  it("ignores leading and trailing whitespace", async () => {
    const xml = ` <root><foo>123</foo> </root>\n`;
    const expected = { foo: '123' };
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
});

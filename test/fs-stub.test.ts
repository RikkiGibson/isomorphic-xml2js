/** Fakes fs behavior to make xml2js's tests run in the browser. */
export function readFile(path: string, opts: any, cb?: (err: any, data: string) => void): void {
  if (typeof opts === "function") {
    cb = opts;
  }
  cb!(null,
`<sample>
<chartest desc="Test for CHARs">Character data here!</chartest>
<cdatatest desc="Test for CDATA" misc="true"><![CDATA[CDATA here!]]></cdatatest>
<cdatawhitespacetest desc="Test for CDATA with whitespace" misc="true"><![CDATA[   ]]></cdatawhitespacetest>
<nochartest desc="No data" misc="false" />
<nochildrentest desc="No data" misc="false" />
<whitespacetest desc="Test for normalizing and trimming">
  Line One
  Line Two
</whitespacetest>
<listtest attr="Attribute">
  <item>
    This <subitem>Foo(1)</subitem> is
    <subitem>Foo(2)</subitem>
    character
    <subitem>Foo(3)</subitem>
    data!
    <subitem>Foo(4)</subitem>
  </item>
  <item>Qux.</item>
  <item>Quux.</item>
  <single>Single</single>
</listtest>
<arraytest>
  <item><subitem>Baz.</subitem></item>
  <item><subitem>Foo.</subitem><subitem>Bar.</subitem></item>
</arraytest>
<emptytest/>
<tagcasetest>
  <tAg>something</tAg>
  <TAG>something else</TAG>
  <tag>something third</tag>
</tagcasetest>
<ordertest>
  <one>1</one>
  <two>2</two>
  <three>3</three>
  <one>4</one>
  <two>5</two>
  <three>6</three>
</ordertest>
<validatortest>
  <emptyarray/>
  <oneitemarray>
    <item>Bar.</item>
  </oneitemarray>
  <numbertest>42</numbertest>
  <stringtest>43</stringtest>
</validatortest>
<pfx:top xmlns:pfx="http://foo.com" pfx:attr="baz">
  <middle xmlns="http://bar.com"/>
</pfx:top>
<attrNameProcessTest camelCaseAttr="camelCaseAttrValue" lowercaseattr="lowercaseattrvalue" />
<attrValueProcessTest camelCaseAttr="camelCaseAttrValue" lowerCaseAttr="lowercaseattrvalue" />
<tagNameProcessTest/>
<valueProcessTest>some value</valueProcessTest>
<textordertest>this is text with <b>markup</b>   <em>like this</em> in the middle</textordertest>
</sample>
`);
}

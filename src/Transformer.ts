import MagicString from "magic-string";
export default class Transpiler {
  s;
  code: string;
  constructor(private sfcCode: string, readonly parentElemName: string) {
    this.code =
      (sfcCode.trim().match(/<template>(.|\n)*?<\/template>/) || [])[0] || "";
    this.s = new MagicString(this.sfcCode);
  }
  transform(): Object {
    const spec = {
      IFTransform: /{#if\s+(.*?)}/g,
      IFElseTransform: /{:else if\s+(.*?)}/g,
      ElseTransform: /{:else}/g,
      EndIfTransform: /{\/if}/g,
      ForTransform: /{#each\s+(.*?)}/g,
      EndForTransform: /{\/each}/g,
      AwaitTransform: /{#await\s+(.*?)}/g,
      AwaitThenTransform: /{:then\s+(.*?)}/g,
      AwaitCatchTransform: /{:catch\s+(.*?)}/g,
      EndAwaitTransform: /{\/await}/g,
      HTMLTransform: /{@html\s+(.|\n)*?}/g,
      DebugTransform: /{@debug\s+(.|\n)*?}/g,
    };
    this.transformIFExpression(
      spec.IFTransform,
      spec.IFElseTransform,
      spec.ElseTransform,
      spec.EndIfTransform
    );
    this.transformHTML(spec.HTMLTransform);
    return { code: this.s.toString(), map: this.s.generateMap() };
  }
  transformIFExpression(
    IFTransform: RegExp,
    IFElseTransform: RegExp,
    ElseTransform: RegExp,
    EndIfTransform: RegExp
  ) {
    const IFBlocks = this.code.match(IFTransform) || [];
    const IFElseBlocks = this.code.match(IFElseTransform) || [];
    const ElseBlocks = this.code.match(ElseTransform) || [];
    const EndIFBlocks = this.code.match(EndIfTransform) || [];
    let lastIndex: number = 0;
    for (let IFBlock of IFBlocks) {
      const coreContent = IFBlock.slice(IFBlock.indexOf(" "))
        .trim()
        .slice(0, -1)
        .trim();
      const stringifyElement = `<${this.parentElemName} v-if="${coreContent}">`;
      const startIndex = this.sfcCode.indexOf(IFBlock, lastIndex);
      const endIndex = startIndex + IFBlock.length;
      lastIndex = endIndex;
      this.s.overwrite(startIndex, endIndex, stringifyElement);
    }
    for (let IFElseBlock of IFElseBlocks) {
      const coreContent = IFElseBlock.slice(IFElseBlock.indexOf(" ", 7))
        .trim()
        .slice(0, -1)
        .trim();
      const stringifyElement = `</${this.parentElemName}>\n<${this.parentElemName} v-else-if="${coreContent}">`;
      const startIndex = this.sfcCode.indexOf(IFElseBlock, lastIndex);
      const endIndex = startIndex + IFElseBlock.length;
      lastIndex = endIndex;
      this.s.overwrite(startIndex, endIndex, stringifyElement);
    }
    for (let ElseBlock of ElseBlocks) {
      const stringifyElement = `</${this.parentElemName}>\n<${this.parentElemName} v-else>`;
      const startIndex = this.sfcCode.indexOf(ElseBlock, lastIndex);
      const endIndex = startIndex + ElseBlock.length;
      lastIndex = endIndex;
      this.s.overwrite(startIndex, endIndex, stringifyElement);
    }
    for (let EndIFBlock of EndIFBlocks) {
      const stringifyElement = `</${this.parentElemName}>`;
      const startIndex = this.sfcCode.indexOf(EndIFBlock, lastIndex);
      const endIndex = startIndex + EndIFBlock.length;
      lastIndex = endIndex;
      this.s.overwrite(startIndex, endIndex, stringifyElement);
    }
  }
  transformHTML(HTMLTransform: RegExp) {
    const HTMLBlocks = this.code.match(HTMLTransform) || [];
    let lastIndex: number = 0;
    for (let HTMLBlock of HTMLBlocks) {
      const coreContent = HTMLBlock.slice(HTMLBlock.indexOf("l"))
        .slice(1)
        .trim()
        .slice(0, -1)
        .trim();
      const stringifyElement = `<${this.parentElemName} v-html="'${coreContent}'"></${this.parentElemName}>`;
      const startIndex = this.sfcCode.indexOf(HTMLBlock, lastIndex);
      const endIndex = startIndex + HTMLBlock.length;
      lastIndex = endIndex;
      this.s.overwrite(startIndex, endIndex, stringifyElement);
    }
  }
}

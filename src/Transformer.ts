import MagicString from "magic-string";
export default class Transpiler {
  s;
  constructor(private code: string) {
    this.code = code.trim();
    this.s = new MagicString(this.code);
  }
  transform(parentElementName: string): Object {
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
      spec.EndIfTransform,
      parentElementName
    );
    return { code: this.s.toString(), map: this.s.generateMap() };
  }
  transformIFExpression(
    IFTransform: RegExp,
    IFElseTransform: RegExp,
    ElseTransform: RegExp,
    EndIfTransform: RegExp,
    transformedElemName: string
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
      const stringifyElement = `<${transformedElemName} v-if="${coreContent}">`;
      const startIndex = this.code.indexOf(IFBlock, lastIndex);
      const endIndex = startIndex + IFBlock.length;
      lastIndex = endIndex;
      this.s.overwrite(startIndex, endIndex, stringifyElement);
    }
    for (let IFElseBlock of IFElseBlocks) {
      const coreContent = IFElseBlock.slice(IFElseBlock.indexOf(" ", 7))
        .trim()
        .slice(0, -1)
        .trim();
      const stringifyElement = `</${transformedElemName}>\n<${transformedElemName} v-else-if="${coreContent}">`;
      const startIndex = this.code.indexOf(IFElseBlock, lastIndex);
      const endIndex = startIndex + IFElseBlock.length;
      lastIndex = endIndex;
      this.s.overwrite(startIndex, endIndex, stringifyElement);
    }
    for (let ElseBlock of ElseBlocks) {
      const stringifyElement = `</${transformedElemName}>\n<${transformedElemName} v-else>`;
      const startIndex = this.code.indexOf(ElseBlock, lastIndex);
      const endIndex = startIndex + ElseBlock.length;
      lastIndex = endIndex;
      this.s.overwrite(startIndex, endIndex, stringifyElement);
    }
    for (let EndIFBlock of EndIFBlocks) {
      const stringifyElement = `</${transformedElemName}>`;
      const startIndex = this.code.indexOf(EndIFBlock, lastIndex);
      const endIndex = startIndex + EndIFBlock.length;
      lastIndex = endIndex;
      this.s.overwrite(startIndex, endIndex, stringifyElement);
    }
  }
}

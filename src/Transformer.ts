import MagicString from "magic-string";
import { start } from "repl";
export default class Transpiler {
  s;
  constructor(private code: string) {
    this.code = this.code.trim();
    this.s = new MagicString(this.code);
  }
  transform(parentElementName: string): Object {
    const spec = {
      IFTransform: /{#if(.*?)}/g,
      IFElseTransform: /{:else if(.*?)}/g,
      ElseTransform: /{:else(.*?)}/g,
      EndIfTransform: /{\/if}/g,
      ForTransform: /{#each(.*?)}/g,
      EndForTransform: /{\/each}/g,
      AwaitTransform: /{#await(.*?)}/g,
      AwaitThenTransform: /{:then(.*?)}/g,
      AwaitCatchTransform: /{:catch(.*?)}/g,
      EndAwaitTransform: /{\/await}/g,
      HTMLTransform: /{@html(.|\n)*?}/g,
      DebugTransform: /{@debug(.|\n)*?}/g,
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
    const IfElseBlocks = this.code.match(IFElseTransform);
    const ElseBlocks = this.code.match(ElseTransform);
    const EndIfBlocks = this.code.match(EndIfTransform);
    for (let IFBlock of IFBlocks) {
      const coreContent = IFBlock.slice(IFBlock.indexOf(" "))
        .trim()
        .slice(0, -1);
      const stringifyElement = `<${transformedElemName} v-if="${coreContent}">`;
      const startIndex = this.code.indexOf(IFBlock);
      const endIndex = startIndex + IFBlock.length;
      this.s.overwrite(startIndex, endIndex, stringifyElement);
      this.code.replace(IFBlock, stringifyElement);
    }
  }
}

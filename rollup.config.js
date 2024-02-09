import css from "rollup-plugin-import-css";
import terser from "@rollup/plugin-terser";
import banner from 'rollup-plugin-banner'
 
// disable amd define due to monaco's own loader clashing with it
function replaceDefine() {
  return {
    name: 'replaceDefine',
    renderChunk(code) {
      return code.replace(/typeof\s*define\s*===\s*['"]function['"]\s*&&\s*define\.amd|['"]function['"]\s*===\s*typeof\s*define\s*&&\s*define\.amd/, 'false');
    }
  };
}

export default [
  {
    input: './dist/index.js',
    external: ['monaco-editor'],
    output: {
      file: './dist/global/monacobrks.js',
      format: 'umd',
      sourcemap: true,
      name: "MonacoBreakpoints",
      amd: false,
      globals: {
        'monaco-editor': 'monaco'
      }
    },
    plugins: [ css(), replaceDefine(), terser(), banner('MonacoBreakpoints v<%= pkg.version %> by <%= Matěj Štágl %> https://github.com/lofcz/monaco-breakpoints') ]
  }
];
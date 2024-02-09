import css from "rollup-plugin-import-css";
import terser from "@rollup/plugin-terser";
import cfg from "./package.json" with { type: "json" };

// disable amd define due to monaco's own loader clashing with it
function replaceDefine() {
  return {
    name: 'replaceDefine',
    renderChunk(code) {
      return code.replace(/typeof\s*define\s*===\s*['"]function['"]\s*&&\s*define\.amd|['"]function['"]\s*===\s*typeof\s*define\s*&&\s*define\.amd/, 'false');
    }
  };
}

function banner() {
  return {
    name: 'banner',
    renderChunk(code) {

      var pkgVer = cfg.version;

      return `// MonacoBreakpoints v ${pkgVer} by Matěj Štágl, Kobayashi - https://github.com/lofcz/monaco-breakpoints MIT licensed\n${code}`
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
    plugins: [ css(), replaceDefine(), terser(), banner() ]
  }
];
import css from "rollup-plugin-import-css";

export default [
  {
    input: './dist/index.js',
    output: {
      file: './dist/global/monacobrks.js',
      format: 'iife',
      sourcemap: true,
      name: "MonacoBreakpoints"
    },
    plugins: [ css() ]
  }
];
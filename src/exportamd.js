export default {
    outDir: 'dist',
    root: '../',
    build: {
      minify: false,
      rollupOptions: {
        external: ['monaco-editor'],
        input: './src/index.ts',
        output: {
          format: 'amd',
          entryFileNames: '[name].js',
        },
      },
      lib: {
        entry: path.resolve(__dirname, './src/index.ts'),
        name: 'index',
        fileName: 'index',
        // fileName: (format, entryName: string) => {
          // const fileSuffix = `${
          // 	format === 'es'
          // 		? 'js' 
          // 		: format === 'cjs'
          // 			? 'cjs' 
          // 			: 'umd.js'
          // }`;
          // return `${format}/index.js`;
        // },
        // formats: ['es', 'cjs', 'umd']
        formats: ['es'],
      },
      outDir: path.resolve(__dirname, 'dist')
    },
    plugins: [dts(), libcss()],
    resolve: {
      alias: [
        // {
        // 	find: 'monaco-editor',
        // 	replacement: 'monaco-editor/esm/vs/editor/editor.api.js',
        // },
        {
          find: '@',
          replacement: path.resolve(__dirname, './src'),
        },
      ],
    }
  };

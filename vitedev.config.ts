import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import libcss from 'vite-plugin-libcss';
import path from 'path';

export default defineConfig({
	publicDir: false,
	build: {
		lib: {
			entry: path.resolve(__dirname, './src/indexdev.ts'),
			name: 'indexdev',
			fileName: 'index',
			formats: ['es'],
		},
		rollupOptions: {
			external: ['monaco-editor'],
			output: {
				format: 'amd',
				amd: {
					id: 'my-bundle'
				  }
			  }
		},
		outDir: path.resolve(__dirname, 'dist')
	},
	plugins: [dts(), libcss()],
	resolve: {
		alias: [
			{
				find: '@',
				replacement: path.resolve(__dirname, './src'),
			},
		],
	}
});

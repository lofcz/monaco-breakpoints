import * as monaco from 'monaco-editor';
import MonacoBreakpoint from './core';
import './style/index.css';
import './style/global.css';
import { BreakpointRemovedTypes } from './types';

const democode = [
	'function foo() {\n',
	'\treturn 1;\n',
	'}\n',
	'function bar() {\n',
	'\treturn 1;\n',
	'}',
].join('')

const editor = monaco.editor.create(document.getElementById('app')!, {
    value: democode,
    theme: 'vs-dark',
    automaticLayout: true,
    minimap: {
        enabled: false,
    },
    glyphMargin: true,
});

var breakpointId = 0;

const instance = new MonacoBreakpoint({ 
    editor: editor,
    onRequestPlaceBreakpoint: (range, type) => {
        if (range.startLineNumber === 3) {
            return false;
        }

        return true;
    },
    onBreakpointPlaced: (range) => {
        breakpointId++;
        return breakpointId;
    },
    onBreakpointRemoved: (id, type) => {
        console.log(`breakpoint id ${id} removed, reason: ${type === BreakpointRemovedTypes.UserAction ? "user" : "line deleted"}`);
    }
});

instance.on('breakpointChanged', breakpoints => {
    console.log('breakpointChanged: ', breakpoints);
})
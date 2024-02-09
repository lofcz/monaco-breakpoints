import type * as monaco from 'monaco-editor';
import { IRange } from 'monaco-editor';

export type Range = monaco.IRange;
export type Position = monaco.IPosition;
export type Disposable = monaco.IDisposable;
export type MonacoEditor = monaco.editor.IStandaloneCodeEditor;

export type EditorMouseEvent = monaco.editor.IEditorMouseEvent;
export type EditorMouseTarget = monaco.editor.IMouseTargetMargin;
export type CursorPositionChangedEvent = monaco.editor.ICursorPositionChangedEvent;

export type ModelDecoration = monaco.editor.IModelDecoration;
export type ModelDeltaDecoration = monaco.editor.IModelDeltaDecoration;
export type ModelDecorationOptions = monaco.editor.IModelDecorationOptions;

/**
 * The meaning of 'Exist' is that the current breakpoint is actually present
 */
export enum BreakpointEnum {
	Exist,
	Hover,
}

export enum BreakpointRequestPlacement {
	Hover,
	Create
}

export enum BreakpointRemovedTypes {
	UserAction,
	LineDeleted
}

export interface MonacoBreakpointProps {
	editor: MonacoEditor;
	onRequestPlaceBreakpoint: (range: IRange, type: BreakpointRequestPlacement) => boolean;
	onBreakpointPlaced: (range: IRange) => BreakpointCreateInfo;
	onBreakpointRemoved: (breakpointId: number, type: BreakpointRemovedTypes) => void;
}

export type Handler<T = any> = (data: T) => void;

export interface BreakpointEvents {
	breakpointChanged: number[];
}

export interface BreakpointIdentifier {
	internalId: string;
	userId: number;
	range: IRange
}

export interface BreakpointChangeInfo {
	userId: number | null;
	lineNumber: number;
}

export interface BreakpointCreateInfo {
	id: number | null;
	options: MonacoBreakpointProps | object | null;
}
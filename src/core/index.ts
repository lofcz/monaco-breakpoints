import {
	Range,
	Disposable,
	MonacoEditor,
	BreakpointEnum,
	EditorMouseEvent,
	EditorMouseTarget,
	ModelDeltaDecoration,
	MonacoBreakpointProps,
} from '@/types';

import {
	MouseTargetType,
	BREAKPOINT_OPTIONS,
	BREAKPOINT_HOVER_OPTIONS,
} from '@/config';

export default class MonacoBreakpoint {
	// private previousLineCount = 0;
	private hoverDecorationId = '';
	private editor: MonacoEditor | null = null;
	private lineNumberAndDecorationIdMap = new Map<number, string>();

	private mouseMoveDisposable: Disposable | null = null;
	private mouseDownDisposable: Disposable | null = null;
	private contentChangedDisposable: Disposable | null = null;

	constructor(params: MonacoBreakpointProps) {
		if (!params?.editor) {
			throw new Error("Missing 'editor' parameter");
		}

		/**
		 * TODO: 需要对传入的参数做类型校验，
		 * 如果类型不正确，就抛出错误
		 */

		const { editor } = params;

		this.editor = editor;
		this.initMouseEvent();
		// this.initEditorEvent();
	}

	private initMouseEvent() {
		this.mouseMoveDisposable = this.editor!.onMouseMove(
			(e: EditorMouseEvent) => {
				const model = this.getModel();
				const { range, detail, type } = this.getMouseEventTarget(e);

				// This indicates that the current position of the mouse is over the total number of lines in the editor
				if (detail?.isAfterLines) {
					this.clearHoverDecoration();
					return;
				}

				if (model && type === MouseTargetType.GUTTER_GLYPH_MARGIN) {
					// remove previous hover breakpoint decoration
					this.clearHoverDecoration();

					// create new hover breakpoint decoration
					const newDecoration = this.createBreakpointDecoration(
						range,
						BreakpointEnum.Hover
					);
					// render decoration
					const decorationIds = model.deltaDecorations(
						[],
						[newDecoration]
					);
					// record the hover decoraion id
					this.hoverDecorationId = decorationIds[0];
				} else {
					this.clearHoverDecoration();
				}
			}
		);

		this.mouseDownDisposable = this.editor!.onMouseDown(
			(e: EditorMouseEvent) => {
				const model = this.getModel();
				const { range, position, detail, type } =
					this.getMouseEventTarget(e);

				if (model && type === MouseTargetType.GUTTER_GLYPH_MARGIN) {
					// This indicates that the current position of the mouse is over the total number of lines in the editor
					if (detail.isAfterLines) {
						return;
					}

					const lineNumber = position.lineNumber;
					const decorationId =
						this.lineNumberAndDecorationIdMap.get(lineNumber);

					// If a breakpoint exists on the current line, it indicates that the current action is to remove the breakpoint
					if (decorationId) {
						this.editor?.removeDecorations([decorationId]);
						this.lineNumberAndDecorationIdMap.delete(lineNumber);
					} else {
						// If no breakpoint exists on the current line, it indicates that the current action is to add a breakpoint
						// create breakpoint decoration
						const newDecoration = this.createBreakpointDecoration(
							range,
							BreakpointEnum.Exist
						);
						// render decoration
						const decorationIds = model.deltaDecorations(
							[],
							[newDecoration]
						);

						// record the new breakpoint decoration id
						this.lineNumberAndDecorationIdMap.set(
							lineNumber,
							decorationIds[0]
						);
					}
				}
			}
		);
	}

	// private initEditorEvent() {
	// 	this.previousLineCount = this.getLineCount();
	// 	this.contentChangedDisposable = this.editor!.onDidChangeModelContent(
	// 		() => {
	// 			const currentLineCount = this.getLineCount();
	// 			const isLineCountChanged =
	// 				currentLineCount !== this.previousLineCount;

	// 			if (isLineCountChanged) {
	// 				/**
	// 				 * 1. 光标在行头回车
	// 				 * 2. 光标在行尾回车
	// 				 * 3. 光标在行中回车
	// 				 * 4. 粘贴代码
	// 				 *
	// 				 * 需要针对这四种情况对断点进行重新渲染，预期效果参考 vscode
	// 				 */
	// 			}
	// 		}
	// 	);
	// }

	private getMouseEventTarget(e: EditorMouseEvent) {
		return { ...(e.target as EditorMouseTarget) };
	}

	private clearHoverDecoration() {
		const model = this.getModel();

		if (model && this.hoverDecorationId) {
			model.deltaDecorations([this.hoverDecorationId], []);
			this.hoverDecorationId = '';
		}
	}

	private clearAllDecorations() {
		const decorationsId = [];
		const model = this.getModel();

		for (let [_, decorationId] of this.lineNumberAndDecorationIdMap) {
			decorationsId.push(decorationId);
		}

		// clear all rendered breakpoint decoration
		model?.deltaDecorations(decorationsId, []);
		this.clearHoverDecoration();
	}

	private createBreakpointDecoration(
		range: Range,
		breakpointEnum: BreakpointEnum
	): ModelDeltaDecoration {
		return {
			range,
			options:
				breakpointEnum === BreakpointEnum.Exist
					? BREAKPOINT_OPTIONS
					: BREAKPOINT_HOVER_OPTIONS,
		};
	}

	private getModel() {
		return this.editor?.getModel();
	}

	// private getLineCount() {
	// 	return this.getModel()?.getLineCount() ?? 0;
	// }

	dispose() {
		this.editor = null;
		this.clearAllDecorations();
		this.mouseMoveDisposable?.dispose();
		this.mouseDownDisposable?.dispose();
		this.contentChangedDisposable?.dispose();
		this.lineNumberAndDecorationIdMap.clear();
	}
}

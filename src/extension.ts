import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	let excludeLine = [];

	const ignoreEdit: any = {};

	let disposable = vscode.commands.registerCommand('chenjianfang.classFold', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
				return;
		}
		
		const fsPath = editor.document.uri?.fsPath;
		ignoreEdit[fsPath] = 1;

		editor.setDecorations(decorationType, []);
	});


	processActiveFile(excludeLine);

	vscode.window.onDidChangeTextEditorSelection(ev => {
		const editor = ev?.textEditor;
		const start = editor?.selection.start;

		const fsPath = editor.document.uri?.fsPath;

		if (ignoreEdit[fsPath]) {
			return;
		}
		
		const line = start.line;
		excludeLine.push(line);
		processActiveFile(excludeLine);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}


let decorationType = vscode.window.createTextEditorDecorationType({
	borderWidth: '1px',
	borderColor: '#F6F6F6',
	borderStyle: 'dotted',
	opacity: '0',
	letterSpacing: "-10000000px",
	after: {
		contentText: '...'
	}
});

function processActiveFile(excludeLine = []) {
	try {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
				return;
		}
		const document = editor.document;
	
		const regEx = /className="([^"]*)"/g;
	
		const text = document.getText();
	
		const array = [...text.matchAll(regEx)];
	
		const rangeList: any[] = [];
		array.forEach((item) => {
			if (!item[1].length) {
				return;
			}
			const startIndex = (item as any).index + item[0].indexOf(item[1]);
			const startPos = document.positionAt(startIndex);
			const endPos = document.positionAt( startIndex+ item[1].length);
	
			if (excludeLine.includes(startPos?.line)) {
				return;
			}
	
			const range = new vscode.Range(startPos, endPos);
			rangeList.push(range);
		});
	
		editor.setDecorations(decorationType, rangeList);
	} catch(err){

	}
}
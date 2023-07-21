import * as vscode from 'vscode';
import { LanguageClientOptions } from 'vscode-languageclient';
import { LanguageClient } from 'vscode-languageclient/browser';

export function activate(context: vscode.ExtensionContext) {

	vscode.workspace.getConfiguration().update('workbench.iconTheme', 'vscode-icons');

	const clientOptions: LanguageClientOptions = {
		documentSelector: [{ language: 'oml' }],
		synchronize: {
			fileEvents: vscode.workspace.createFileSystemWatcher("**​/*.{oml,page,sparql}", false, false, false)
		},
		initializationOptions: {
			factPlusPlusWasm: vscode.Uri.joinPath(context.extensionUri, './language-server/node_modules/factplusplus/FaCTPlusPlus.wasm').toString(),
			oxigraphWasm: vscode.Uri.joinPath(context.extensionUri, './language-server/node_modules/oxigraph/web_bg.wasm').toString(),
			treeSitterWasm: vscode.Uri.joinPath(context.extensionUri, './language-server/node_modules/web-tree-sitter/tree-sitter.wasm').toString(),
			treeSitterOmlWasm: vscode.Uri.joinPath(context.extensionUri, './language-server/node_modules/tree-sitter-oml/tree-sitter-oml.wasm').toString()
		}
	};

	const client = createWorkerLanguageClient(context, clientOptions);

	const disposable = client.start();
	context.subscriptions.push(disposable);

	client.onReady().then(() => {
		//
	});

}

function createWorkerLanguageClient(context: vscode.ExtensionContext, clientOptions: LanguageClientOptions) {
	const main = vscode.Uri.joinPath(context.extensionUri, 'language-server/dist/browserMain.js');
	const worker = new Worker(main.toString(true));
	return new LanguageClient('gitworks', 'GitWorks', clientOptions, worker);
}

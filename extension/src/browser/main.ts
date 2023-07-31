import * as vscode from 'vscode';
import { LanguageClientOptions } from 'vscode-languageclient';
import { LanguageClient } from 'vscode-languageclient/browser';
import { AppEditorProvider } from './appEditorProvider';

export function activate(context: vscode.ExtensionContext) {

	vscode.workspace.getConfiguration().update('workbench.iconTheme', 'vscode-icons');

	const clientOptions: LanguageClientOptions = {};
	const client = createWorkerLanguageClient(context, clientOptions);

	const disposable = client.start();
	context.subscriptions.push(disposable);

	client.onReady().then(() => {
		context.subscriptions.push(AppEditorProvider.register(context, client));
	});

}

function createWorkerLanguageClient(context: vscode.ExtensionContext, clientOptions: LanguageClientOptions) {
	const main = vscode.Uri.joinPath(context.extensionUri, 'language-server/dist/browserMain.js');
	const worker = new Worker(main.toString(true));
	return new LanguageClient('co-simulation-studio', 'Co-Simulation Studio', clientOptions, worker);
}

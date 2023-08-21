import * as vscode from 'vscode';
import { MessageHandlerData } from '@estruyf/vscode';

export class CoeEditorProvider implements vscode.CustomTextEditorProvider {

	private static readonly viewType = 'cosimulationstudio.editors.coeEditor';

	public static register(context: vscode.ExtensionContext): vscode.Disposable {
		const provider = new CoeEditorProvider(context);
		const providerRegistration = vscode.window.registerCustomEditorProvider(CoeEditorProvider.viewType, provider);
		return providerRegistration;
	}

	constructor(
		private readonly context: vscode.ExtensionContext
	) {
	}

	resolveCustomTextEditor(
		document: vscode.TextDocument,
		panel: vscode.WebviewPanel,
		token: vscode.CancellationToken
	): Thenable<void> | void {

		vscode.workspace.onDidChangeTextDocument(e => {
			if (e.document.uri.toString() === document.uri.toString())
				panel.webview.postMessage({
					command: "refresh"
				});
		});

		panel.webview.options = {
			enableScripts: true,
		};

		panel.webview.html = this.html(panel.webview);

		panel.webview.onDidReceiveMessage(async (message) => {

			const { command, requestId, payload } = message;

			/*					panel.webview.postMessage({
									command,
									requestId,
									payload: await this.client.sendRequest("gitworks/oml/table/add-instance", [document.uri.toString(), payload])
								} as MessageHandlerData<string>);
								*/


		}, undefined, this.context.subscriptions);

	}

	private html(webview: vscode.Webview): string {
		const baseUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'webviews', 'dist', 'webviews'));
		//return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><base href="${baseUri}/"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="icon" type="image/x-icon" href="favicon.ico"><link rel="stylesheet" href="styles.css"></head><body><app-root></app-root><script src="runtime.js" type="module"></script><script src="polyfills.js" type="module"></script><script src="main.js" type="module"></script></body></html>`;

		//><style>html{font-family:sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}@media print{*,:after,:before{color:#000!important;text-shadow:none!important;background:0 0!important;box-shadow:none!important}}*{box-sizing:border-box}:after,:before{box-sizing:border-box}html{font-size:10px;-webkit-tap-highlight-color:rgba(0,0,0,0)}body{font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.42857143;color:#333;background-color:#fff}@charset "UTF-8"</style>
		return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><base href="${baseUri}/"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="icon" type="image/x-icon" href="favicon.ico"><link rel="stylesheet" href="styles.css"></head><body><app-root></app-root><script src="runtime.js" type="module"></script><script src="polyfills.js" type="module"></script><script src="scripts.js" defer></script><script src="main.js" type="module"></script></body></html>`;
		//return 'coe';
	}

}
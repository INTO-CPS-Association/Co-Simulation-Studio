import * as vscode from 'vscode';
import { MessageHandlerData } from '@estruyf/vscode';
import * as Path from "path";
import fetch from 'node-fetch';

export function processMessage(panel): (e: any) => any {
	return async (message) => {

		const { command, requestId, payload } = message;

		switch (command) {
			case "httpGet": {
				const response = await fetch(payload.url);
				const body = await response.text();
				panel.webview.postMessage({ command, requestId, payload: body });
				break;
			}
			case "exists": {
				const path = vscode.Uri.parse(payload.path);
				try {
					await vscode.workspace.fs.stat(path);
					panel.webview.postMessage({ command, requestId, payload: true });
				} catch (e) {
					panel.webview.postMessage({ command, requestId, payload: false });
				}
				break;
			}
			case "readdir": {
				const path = vscode.Uri.parse(payload.path);
				const entries = await vscode.workspace.fs.readDirectory(path);
				const result: string[] = [];
				for (const entry of entries)
					result.push(entry[0]);
				panel.webview.postMessage({ command, requestId, payload: result });
				break;
			}
			case "getSystemArchitecture": {
				let value;
				if (process.arch == "ia32") {
					value = "32";
				} else if (process.arch == "x64") {
					value = "64";
				} else {
					value = process.arch;
				}
				panel.webview.postMessage({ command, requestId, payload: value });
				break;
			}
			case "getSystemPlatform": {
				let value;
				if (process.platform == "win32")
					value = "windows";
				else
					value = process.platform;
				panel.webview.postMessage({ command, requestId, payload: value });
				break;
			}
			case "getConfiguration": {
				const configuration = vscode.workspace.getConfiguration();
				const value = configuration.get(payload.section);
				panel.webview.postMessage({ command, requestId, payload: value });
				break;
			}
			case "normalize": {
				const path = Path.normalize(payload.path);
				panel.webview.postMessage({ command, requestId, payload: path });
				break;
			}
			case "readFile": {
				const path = vscode.Uri.parse(payload.path);
				const content = await vscode.workspace.fs.readFile(path);
				panel.webview.postMessage({ command, requestId, payload: new TextDecoder().decode(content) });
				break;
			}
			case "writeFile": {
				const path = vscode.Uri.parse(payload.path);
				const content = payload.content;
				await vscode.workspace.fs.writeFile(path, new TextEncoder().encode(content));
				panel.webview.postMessage({ command, requestId, payload: null });
				break;
			}
			case "copyFile": {
				const source = vscode.Uri.parse(payload.source);
				const target = vscode.Uri.parse(payload.target);
				await vscode.workspace.fs.copy(source, target);
				panel.webview.postMessage({ command, requestId, payload: null });
				break;
			}
			case "mkdir": {
				const path = vscode.Uri.parse(payload.path);
				await vscode.workspace.fs.createDirectory(path);
				panel.webview.postMessage({ command, requestId, payload: null });
				break;
			}
		}

	};
}
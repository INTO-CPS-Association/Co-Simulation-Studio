import * as vscode from 'vscode';
import * as path from 'path';

export class ModelTreeDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

	context: vscode.ExtensionContext;
	private _onDidChangeTreeData: vscode.EventEmitter<void | vscode.TreeItem | vscode.TreeItem[]> = new vscode.EventEmitter<void | vscode.TreeItem | vscode.TreeItem[]>();
	readonly onDidChangeTreeData?: vscode.Event<void | vscode.TreeItem | vscode.TreeItem[]> = this._onDidChangeTreeData.event;

	constructor(context: vscode.ExtensionContext) {
		this.context = context;
	}

	getTreeItem(element: vscode.TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
		return element;
	}

	async getChildren(element?: vscode.TreeItem): Promise<vscode.TreeItem[]> {

		const children = [];

		if (element != null) {
			await populateChildren(element.resourceUri, children);
		} else {
			if (vscode.workspace.workspaceFolders.length == 1) {
				await populateChildren(vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, "Models"), children);
			} else {
				for (const workspaceFolder of vscode.workspace.workspaceFolders) {
					children.push({
						label: workspaceFolder.name,
						resourceUri: vscode.Uri.joinPath(workspaceFolder.uri, "Models"),
						iconPath: vscode.ThemeIcon.Folder,
						collapsibleState: vscode.TreeItemCollapsibleState.Expanded
					});
				}
			}
		}

		return children;

	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

}

async function populateChildren(resourceUri: vscode.Uri, children: vscode.TreeItem[]) {
	let stat;
	try {
		stat = await vscode.workspace.fs.stat(resourceUri);
	} catch (e) {
		stat = null;
	}
	if (stat?.type == vscode.FileType.Directory) {
		for (const [name, type] of await vscode.workspace.fs.readDirectory(resourceUri)) {
			const nameIconCollapsibleCommand = getNameIconCollapsibleCommand(resourceUri, name, type);
			if (nameIconCollapsibleCommand != null) {
				children.push({
					label: nameIconCollapsibleCommand[0],
					resourceUri: vscode.Uri.joinPath(resourceUri, name),
					iconPath: nameIconCollapsibleCommand[1],
					collapsibleState: nameIconCollapsibleCommand[2],
					command: nameIconCollapsibleCommand[3]
				});
			}
		}
	}
}

function getNameIconCollapsibleCommand(resourceUri: vscode.Uri, name: string, type: vscode.FileType): any {
	if (name.startsWith('.'))
		return null;
	if (type == vscode.FileType.Directory) {
		return [name, vscode.ThemeIcon.Folder, vscode.TreeItemCollapsibleState.Collapsed, undefined];
	} else {
		const command = {
			command: 'vscode.open',
			title: '',
			arguments: [vscode.Uri.joinPath(resourceUri, name)]
		};
		if (name.toLowerCase().endsWith('.emx')) {
			return [name.substring(0, name.length - 4), path.join(__filename, '..', '..', '..', 'resources', '20-sim-logo.svg'), vscode.TreeItemCollapsibleState.None, command];
		} else if (name.toLowerCase().endsWith('.md')) {
			return null;
		} else if (name.toLowerCase().endsWith('.mo')) {
			return [name.substring(0, name.length - 3), path.join(__filename, '..', '..', '..', 'resources', 'open-modelica-logo.svg'), vscode.TreeItemCollapsibleState.None, command];
		} else if (name.toLowerCase().endsWith('.vdmrt')) {
			return [name.substring(0, name.length - 6), path.join(__filename, '..', '..', '..', 'resources', 'overture-logo.svg'), vscode.TreeItemCollapsibleState.None, command];
		} else {
			return [name, vscode.ThemeIcon.File, vscode.TreeItemCollapsibleState.None, command];
		}
	}
}
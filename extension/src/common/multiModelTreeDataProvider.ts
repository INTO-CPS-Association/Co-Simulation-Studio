import * as vscode from 'vscode';
import * as path from 'path';

export class MultiModelTreeDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

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
				await populateChildren(vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, "Multi-models"), children);
			} else {
				for (const workspaceFolder of vscode.workspace.workspaceFolders) {
					children.push({
						label: workspaceFolder.name,
						resourceUri: vscode.Uri.joinPath(workspaceFolder.uri, "Multi-models"),
						iconPath: vscode.ThemeIcon.Folder,
						collapsibleState: vscode.TreeItemCollapsibleState.Expanded,
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
			const treeItem = await getTreeItem(resourceUri, name, type);
			if (treeItem != null) {
				children.push({
					label: treeItem[0],
					resourceUri: vscode.Uri.joinPath(resourceUri, name),
					iconPath: treeItem[1],
					collapsibleState: treeItem[2],
					command: treeItem[3],
					contextValue: treeItem[4]
				});
			}
		}
	}
}

async function getTreeItem(resourceUri: vscode.Uri, name: string, type: vscode.FileType): Promise<any> {
	if (name.startsWith('.'))
		return null;
	if (type == vscode.FileType.Directory) {

		let mmStat;
		try {
			mmStat = await vscode.workspace.fs.stat(vscode.Uri.joinPath(resourceUri, name, name + '.mm.json'));
		} catch (e) {
			mmStat = null;
		}

		if (mmStat?.type == vscode.FileType.File) {
			const command = {
				command: 'vscode.open',
				title: '',
				arguments: [vscode.Uri.joinPath(resourceUri, name, name + '.mm.json')]
			};
			return [name, path.join(__filename, '..', '..', '..', 'resources', 'multimodel-icon.svg'), vscode.TreeItemCollapsibleState.Collapsed, command, 'mm'];
		
		}

		let coeStat;
		try {
			coeStat = await vscode.workspace.fs.stat(vscode.Uri.joinPath(resourceUri, name, resourceUri.path.substring(resourceUri.path.lastIndexOf('/')+1) + '.coe.json'));
		} catch (e) {
			coeStat = null;
		}

		if (coeStat?.type == vscode.FileType.File) {
			const command = {
				command: 'vscode.open',
				title: '',
				arguments: [vscode.Uri.joinPath(resourceUri, name, resourceUri.path.substring(resourceUri.path.lastIndexOf('/')+1) + '.coe.json')]
			};
			return [name, path.join(__filename, '..', '..', '..', 'resources', 'configuration-icon.svg'), vscode.TreeItemCollapsibleState.Collapsed, command, 'coe'];
		}

		return [name, vscode.ThemeIcon.Folder, vscode.TreeItemCollapsibleState.Collapsed, undefined];

	} else {
		const command = {
			command: 'vscode.open',
			title: '',
			arguments: [vscode.Uri.joinPath(resourceUri, name)]
		};

		if (name.endsWith('.mm.json')) {
			return null;
		} else if (name == 'outputs.csv') {
			return [name.substring(0, name.length - 4), path.join(__filename, '..', '..', '..', 'resources', 'result-icon.svg'), vscode.TreeItemCollapsibleState.None, command, undefined];
		}
	}
}
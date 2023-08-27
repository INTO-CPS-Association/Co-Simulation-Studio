import * as vscode from 'vscode';

export class FmuTreeDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

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
				await populateChildren(vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, "FMUs"), children);
			} else {
				for (const workspaceFolder of vscode.workspace.workspaceFolders) {
					children.push({
						label: workspaceFolder.name,
						resourceUri: vscode.Uri.joinPath(workspaceFolder.uri, "FMUs"),
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
	const stat = await vscode.workspace.fs.stat(resourceUri);
	if (stat.type == vscode.FileType.Directory) {
		for (const [name, type] of await vscode.workspace.fs.readDirectory(resourceUri)) {
			if (type == vscode.FileType.Directory) {
				children.push({
					label: name,
					resourceUri: vscode.Uri.joinPath(resourceUri, name),
					iconPath: vscode.ThemeIcon.Folder,
					collapsibleState: vscode.TreeItemCollapsibleState.Collapsed
				});
			} else if (name.toLowerCase().endsWith('.fmu')) {
				children.push({
					label: name.substring(0, name.length - 4),
					resourceUri: vscode.Uri.joinPath(resourceUri, name),
					iconPath: vscode.ThemeIcon.File,
					collapsibleState: vscode.TreeItemCollapsibleState.None,
					command: {
						command: 'vscode.open',
						title: '',
						arguments: [vscode.Uri.joinPath(resourceUri, name)]
					}
				});
			}
		}
	}
}
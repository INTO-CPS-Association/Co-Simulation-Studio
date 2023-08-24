import * as vscode from 'vscode';
import * as path from 'path';
import { workspace, ExtensionContext } from 'vscode';

import { DseTreeDataProvider } from '../common/dseTreeDataProvider';
import { FmuTreeDataProvider } from '../common/fmuTreeDataProvider';
import { ModelTreeDataProvider } from '../common/modelTreeDataProvider';
import { MultiModelTreeDataProvider } from '../common/multiModelTreeDataProvider';
import { SysMLTreeDataProvider } from '../common/sysmlTreeDataProvider';
import { CoeEditorProvider } from '../common/coeEditorProvider';
import { DseEditorProvider } from '../common/dseEditorProvider';
import { MmEditorProvider } from '../common/mmEditorProvider';

export function activate(context: ExtensionContext) {
	vscode.workspace.getConfiguration().update('workbench.iconTheme', 'vscode-icons');

	context.subscriptions.push(CoeEditorProvider.register(context));
	context.subscriptions.push(DseEditorProvider.register(context));
	context.subscriptions.push(MmEditorProvider.register(context));

	context.subscriptions.push(vscode.window.createTreeView('cosim-dses', { treeDataProvider: new DseTreeDataProvider(context) }));
	context.subscriptions.push(vscode.window.createTreeView('cosim-fmus', { treeDataProvider: new FmuTreeDataProvider(context) }));
	context.subscriptions.push(vscode.window.createTreeView('cosim-models', { treeDataProvider: new ModelTreeDataProvider(context) }));
	context.subscriptions.push(vscode.window.createTreeView('cosim-multi-models', { treeDataProvider: new MultiModelTreeDataProvider(context) }));
	context.subscriptions.push(vscode.window.createTreeView('cosim-sysml', { treeDataProvider: new SysMLTreeDataProvider(context) }));

}
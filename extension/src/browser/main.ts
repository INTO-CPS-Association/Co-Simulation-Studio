import * as vscode from 'vscode';
import { CoeEditorProvider } from '../common/coeEditorProvider';
import { FmuTreeDataProvider } from '../common/fmuTreeDataProvider';
import { MmEditorProvider } from '../common/mmEditorProvider';
import { ModelTreeDataProvider } from '../common/modelTreeDataProvider';
import { MultiModelTreeDataProvider } from '../common/multiModelTreeDataProvider';

export function activate(context: vscode.ExtensionContext) {
	vscode.workspace.getConfiguration().update('workbench.iconTheme', 'vscode-icons');

	context.subscriptions.push(CoeEditorProvider.register(context));
	context.subscriptions.push(MmEditorProvider.register(context));

	context.subscriptions.push(vscode.window.createTreeView('cosim-fmus', { treeDataProvider: new FmuTreeDataProvider(context) }));
	context.subscriptions.push(vscode.window.createTreeView('cosim-models', { treeDataProvider: new ModelTreeDataProvider(context) }));
	context.subscriptions.push(vscode.window.createTreeView('cosim-multi-models', { treeDataProvider: new MultiModelTreeDataProvider(context) }));

}
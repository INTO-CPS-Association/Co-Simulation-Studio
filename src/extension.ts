import * as vscode from "vscode";
import { SimulationConfigCompletionItemProvider } from "./language-features/completion-items";
import { SimulationConfigLinter } from "./language-features/linting";
import { getCosimPath, isDocumentCosimConfig } from "./utils";
import { getLogger } from "./logging";
import { registerCommands } from "./commands";

const extensionLogger = getLogger();

export async function activate(context: vscode.ExtensionContext) {    
    context.subscriptions.push(...registerCommands())
    
    for (const wsFolder of vscode.workspace.workspaceFolders || []) {
        registerProviders(context, wsFolder);
    }

    registerCosimConfigTracking(context);

    extensionLogger.log("info", "Extension activated");
}

function registerCosimConfigTracking(context: vscode.ExtensionContext) {
    const activeEditor = vscode.window.activeTextEditor;
    
    if (activeEditor && isDocumentCosimConfig(activeEditor.document)) {
        vscode.commands.executeCommand('setContext', 'cosimstudio.cosimConfigOpen', true);
    }
    
    
    const disposable = vscode.window.onDidChangeActiveTextEditor((e) => {
        if (!e || !isDocumentCosimConfig(e.document)) {
            vscode.commands.executeCommand('setContext', 'cosimstudio.cosimConfigOpen', false);
            return;
        }

        vscode.commands.executeCommand('setContext', 'cosimstudio.cosimConfigOpen', true);
        extensionLogger.info(`Opened cosim config file: ${e.document.uri.path}`)
    });

    context.subscriptions.push(disposable);
}

function registerProviders(context: vscode.ExtensionContext, wsFolder: vscode.WorkspaceFolder) {
    // TODO: Register providers that rely on relative patterns dynamically instead of a registering on extension activation, 
    // so that when new workspace folders are added, language features work.
    const cosimRelativePattern = new vscode.RelativePattern(wsFolder, getCosimPath(wsFolder));
    
    const completionItemProviderDisposable =
        vscode.languages.registerCompletionItemProvider(
            { language: "json", pattern: cosimRelativePattern },
            new SimulationConfigCompletionItemProvider(),
            ".",
            "{"
        );

    const linterDisposable = new SimulationConfigLinter();

    context.subscriptions.push(completionItemProviderDisposable);
    context.subscriptions.push(linterDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

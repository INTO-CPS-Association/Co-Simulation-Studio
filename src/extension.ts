import * as vscode from "vscode";
import fs from "node:fs/promises";
import { runSimulationWithConfig } from "./maestro";
import {
    SimulationConfigSemanticTokensProvider,
    legend,
} from "./language-features/semantic-tokens";
import { SimulationConfigCompletionItemProvider } from "./language-features/completion-items";
import path from "node:path";
import { SimulationConfigLinter } from "./language-features/linting";
import { getCosimPath, isDocumentCosimConfig } from "./utils";

interface SimulationConfiguration {
    fmus: Record<string, string>;
}

function isSimulationConfiguration(
    config: any
): config is SimulationConfiguration {
    return "fmus" in config && typeof config["fmus"] === "object";
}


export async function activate(context: vscode.ExtensionContext) {
    const runSimulationDisp = vscode.commands.registerCommand(
        "cosimstudio.runSimulation",
        handleRunSimulation
    );

    context.subscriptions.push(runSimulationDisp);
    
    for (const wsFolder of vscode.workspace.workspaceFolders || []) {
        registerProviders(context, wsFolder);
    }

    registerCosimConfigTracking(context);
}

function registerCosimConfigTracking(context: vscode.ExtensionContext) {
    const activeEditor = vscode.window.activeTextEditor;
    
    if (activeEditor && isDocumentCosimConfig(activeEditor.document)) {
        vscode.commands.executeCommand('setContext', 'cosimstudio.cosimConfigOpen', true);
    }
    
    
    const disposable = vscode.window.onDidChangeActiveTextEditor((e) => {
        if (!e) {
            vscode.commands.executeCommand('setContext', 'cosimstudio.cosimConfigOpen', false);
            return;
        }

        if (!isDocumentCosimConfig(e.document)) {
            vscode.commands.executeCommand('setContext', 'cosimstudio.cosimConfigOpen', false);
            return;
        }

        vscode.commands.executeCommand('setContext', 'cosimstudio.cosimConfigOpen', true);
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
    const semanticTokensProviderDisposable =
        vscode.languages.registerDocumentSemanticTokensProvider(
            { language: "json", pattern: cosimRelativePattern },
            new SimulationConfigSemanticTokensProvider(),
            legend
        );

    const linterDisposable = new SimulationConfigLinter();

    context.subscriptions.push(semanticTokensProviderDisposable);
    context.subscriptions.push(completionItemProviderDisposable);
    context.subscriptions.push(linterDisposable);
}

async function handleRunSimulation(uri: vscode.Uri) {
    if (!uri) {
        return;
    }

    const wsFolder = vscode.workspace.getWorkspaceFolder(uri);

    if (!wsFolder) {
        return;
    }

    const configUri = uri;

    if (!configUri) {
        return;
    }

    const config = JSON.parse((await fs.readFile(configUri.fsPath)).toString());

    if (!isSimulationConfiguration(config)) {
        return;
    }

    const resolvedConfig = resolveSimulationConfig(config, wsFolder);

    vscode.window.withProgress(
        {
            cancellable: false,
            location: vscode.ProgressLocation.Notification,
            title: "Running simulation",
        },
        async () => runSimulationAndShowResults(resolvedConfig)
    );
}

function resolveSimulationConfig(
    config: SimulationConfiguration,
    wsFolder: vscode.WorkspaceFolder
): SimulationConfiguration {
    for (const fmuIdent in config.fmus) {
        const fmuPath = config.fmus[fmuIdent];

        const absolutePath = resolveFMUPath(wsFolder, fmuPath);
        config.fmus[fmuIdent] = absolutePath;
    }

    return config;
}

export function resolveFMUPath(
    wsFolder: vscode.WorkspaceFolder,
    fmuPath: string
): string {
    if (path.isAbsolute(fmuPath)) {
        return fmuPath;
    }

    const absolutePath = vscode.Uri.joinPath(wsFolder.uri, fmuPath).path;
    return absolutePath;
}

async function runSimulationAndShowResults(config: unknown) {
    try {
        const results = await runSimulationWithConfig(config, {
            startTime: 0,
            endTime: 10,
        });

        if (results) {
            const td = await vscode.workspace.openTextDocument({
                content: results,
            });
            await vscode.window.showTextDocument(td);
        }
    } catch (error) {
        vscode.window.showErrorMessage(`Simulation failed. ${error}`);
    }
}

// This method is called when your extension is deactivated
export function deactivate() {}

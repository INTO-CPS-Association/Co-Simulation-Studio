import * as vscode from "vscode";
import path from "node:path";

export interface SimulationConfiguration {
    fmus: Record<string, string>;
}

export function isSimulationConfiguration(
    config: any
): config is SimulationConfiguration {
    return "fmus" in config && typeof config["fmus"] === "object";
}

export function logError(msg: string) {
    const logTime = new Date().toUTCString();
    console.error(`[Maestro Extension] ${logTime}: ${msg}`)
}

export function getCosimPath(scope: vscode.TextDocument | vscode.WorkspaceFolder) {
    const cosimPath = vscode.workspace.getConfiguration("cosimstudio", scope).get("cosimPath");

    if (typeof cosimPath === "string") {
        return cosimPath;
    }

    return "cosim.json";
}

export function isDocumentCosimConfig(document: vscode.TextDocument) {
    return (document.languageId === "json" && document.uri.path.endsWith(`/${getCosimPath(document)}`))
}

export function resolveAbsolutePath(
    wsFolder: vscode.WorkspaceFolder,
    relPath: string
): string {
    if (path.isAbsolute(relPath)) {
        return relPath;
    }

    const absolutePath = vscode.Uri.joinPath(wsFolder.uri, relPath).path;
    return absolutePath;
}

export function resolveSimulationConfig(
    config: SimulationConfiguration,
    wsFolder: vscode.WorkspaceFolder
): SimulationConfiguration {
    for (const fmuIdent in config.fmus) {
        const fmuPath = config.fmus[fmuIdent];

        const absolutePath = resolveAbsolutePath(wsFolder, fmuPath);
        config.fmus[fmuIdent] = absolutePath;
    }

    return config;
}
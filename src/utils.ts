import * as vscode from "vscode";
import path from "node:path";

const DEFAULT_COSIM_CONFIG_FILE = "cosim.json";

export interface SimulationConfiguration {
    fmus: Record<string, string>;
}

export function isSimulationConfiguration(
    config: any
): config is SimulationConfiguration {
    return "fmus" in config && typeof config["fmus"] === "object";
}

export function getCosimPath(scope: vscode.TextDocument | vscode.WorkspaceFolder) {
    const cosimPath = vscode.workspace.getConfiguration("cosimstudio", scope).get("cosimPath");

    if (typeof cosimPath === "string") {
        return cosimPath;
    }

    return DEFAULT_COSIM_CONFIG_FILE;
}

export function isDocumentInWorkspace(document: vscode.TextDocument): boolean {
    const workspaceFolders = vscode.workspace.workspaceFolders;

    // No workspace is open
    if (!workspaceFolders) {
        return false; 
    }

    const documentUri = document.uri.toString();

    // Check if the document's URI starts with any of the workspace folder URIs
    return workspaceFolders.some(folder => documentUri.startsWith(folder.uri.toString()));
}

export function isDocumentCosimConfig(document: vscode.TextDocument) {
    return (document.languageId === "json" && document.uri.path.endsWith(`/${getCosimPath(document)}`) && isDocumentInWorkspace(document))
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
/**
 * Asserts that a value of unknown type is an instance of `Error`.
 * Useful for bubbling errors that have an unexpected type and are thus unhandled.
 * @param error error of `unknown` type
 */
export function assertIsError(error: unknown): asserts error is Error {
    if (!(error instanceof Error)) {
        throw error;
    }
}
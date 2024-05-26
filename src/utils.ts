import * as vscode from "vscode";

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

import { Node, getNodePath } from "jsonc-parser";
import { LintRule, RuleContext } from "../linting";
import * as fs from "fs";
import * as vscode from "vscode";
import { resolveAbsolutePath } from "../../utils";

export const validIdentifierPattern = /^\{\w+\}$/;

export class ValidFMUPathRule implements LintRule {
    constructor() {}

    onProperty = async (node: Node, context: RuleContext): Promise<void> => {
        const nodePath = getNodePath(node);
        if (
            !(nodePath.length === 1 && nodePath[0] === "fmus") ||
            !node.children
        ) {
            return;
        }

        // Verify FMU identifiers
        const possibleFMUPath = node.children[1];
        if (!possibleFMUPath) {
            return;
        }

        const wsFolder = vscode.workspace.getWorkspaceFolder(
            context.document.uri
        );

        if (!wsFolder) {
            return;
        }

        if (
            await this.isFileValidFMU(
                resolveAbsolutePath(wsFolder, possibleFMUPath.value)
            )
        ) {
            return;
        }

        const range = new vscode.Range(
            context.document.positionAt(possibleFMUPath.offset + 1),
            context.document.positionAt(
                possibleFMUPath.offset + possibleFMUPath.length - 1
            )
        );
        context.report(
            range,
            `Invalid FMU: the file at '${possibleFMUPath.value}' either doesn't exist or is not a well formed FMU.`,
            vscode.DiagnosticSeverity.Error
        );
    };

    private isFileValidFMU = async (path: string): Promise<boolean> => {
        // Currently just checks that a file actually exists at the path
        // TODO: Check whether the file is a well-formed FMU.
        return fs.existsSync(path);
    };
}

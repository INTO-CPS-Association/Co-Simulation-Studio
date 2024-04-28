import { getNodePath } from "jsonc-parser";
import { LintRule } from "../linting";
import * as vscode from "vscode";
import { getFMUModelFromPath } from "../../fmu";

export const correctCausalityConnectionsRule: LintRule = {
    onProperty: async (node, context) => {
        const nodePath = getNodePath(node);
        if (
            !(nodePath.length === 1 && nodePath[0] === "connections") ||
            !node.children
        ) {
            return;
        }

        // Verify connection outputs
        const possibleOutput = node.children[0];
        if (!possibleOutput) {
            return;
        }

        const fmuWithInstancePattern = /^(\{\w+\})\.(\w+)\.(\w+)$/;
        const fmuMatch = possibleOutput.value.match(fmuWithInstancePattern);

        if (!fmuMatch) {
            return;
        }

        const fmuIdentifier = fmuMatch[1];
        const variableIdentifier = fmuMatch[3];

        const fmuSource = context.fmuSources.find(
            (source) => source.identifier === fmuIdentifier
        );

        if (!fmuSource || !fmuSource.path) {
            return;
        }

        const wsFolder = vscode.workspace.getWorkspaceFolder(
            context.document.uri
        );
        if (!wsFolder) {
            return;
        }

        const fmuModel = await getFMUModelFromPath(wsFolder, fmuSource.path);
        if (!fmuModel) {
            return;
        }

        if (!(fmuModel.outputs.map(o => o.name).includes(variableIdentifier))) {
            const range = new vscode.Range(
                context.document.positionAt(possibleOutput.offset + 1),
                context.document.positionAt(
                    possibleOutput.offset + possibleOutput.length - 1
                )
            );
            context.report(
                range,
                `Expected output, but the identifier '${variableIdentifier}' does not refer to an output.`,
                vscode.DiagnosticSeverity.Error
            );
        }
    },
};
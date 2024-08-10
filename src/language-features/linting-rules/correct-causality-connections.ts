import { getNodePath } from "jsonc-parser";
import * as vscode from "vscode";
import { LintRule } from "../language-features.types";
import { getStringContentRange } from "../utils";

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
        if (!possibleOutput || typeof possibleOutput.value !== "string") {
            return;
        }

        const fmuWithInstancePattern = /^(\{\w+\})\.(\w+)\.(\w+)$/;
        const fmuMatch = possibleOutput.value.match(fmuWithInstancePattern);

        if (!fmuMatch) {
            return;
        }

        const fmuIdentifier = fmuMatch[1];
        const variableIdentifier = fmuMatch[3];

        const fmuModel = await context.cosimConfig.getFMUModel(fmuIdentifier);

        if (!fmuModel) {
            return;
        }

        if (!fmuModel.outputs.map((o) => o.name).includes(variableIdentifier)) {
            const range = getStringContentRange(context.cosimConfig.getDocument(), possibleOutput);
            context.report(
                range,
                `Expected output, but the identifier '${variableIdentifier}' does not refer to an output.`,
                vscode.DiagnosticSeverity.Error
            );
        }
    },
};

import { Node, getNodePath } from "jsonc-parser";
import { LintRule, RuleContext } from "../linting";
import * as vscode from "vscode";

export const validIdentifierPattern = /^\{\w+\}$/;

export class ValidFMUIdentifierRule implements LintRule {
    constructor(){}

    async onProperty(node: Node, context: RuleContext): Promise<void> {
        const nodePath = getNodePath(node);
        if (
            !(nodePath.length === 1 && nodePath[0] === "fmus") ||
            !node.children
        ) {
            return;
        }

        // Verify FMU identifiers
        const possibleIdentifier = node.children[0];
        if (!possibleIdentifier) {
            return;
        }

        if (validIdentifierPattern.test(possibleIdentifier.value)) {
            return;
        }

        const range = new vscode.Range(
            context.document.positionAt(possibleIdentifier.offset + 1),
            context.document.positionAt(
                possibleIdentifier.offset + possibleIdentifier.length - 1
            )
        );
        context.report(
            range,
            `Invalid FMU identifier: '${possibleIdentifier.value}'`,
            vscode.DiagnosticSeverity.Error
        );
    }
}
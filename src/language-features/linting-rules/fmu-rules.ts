import fs from "fs";
import { Node, getNodePath } from "jsonc-parser";
import vscode from "vscode";
import { isValidFMUIdentifier } from "../../fmu";
import { resolveAbsolutePath } from "../../utils";
import { LintRule } from "../language-features.types";
import { getStringContentRange } from "../utils";
import { RuleContext } from "../linting";

export class ValidFMUIdentifierRule implements LintRule {
    constructor() {}

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
        if (
            !possibleIdentifier ||
            typeof possibleIdentifier.value !== "string"
        ) {
            return;
        }

        if (isValidFMUIdentifier(possibleIdentifier.value)) {
            return;
        }

        const range = getStringContentRange(
            context.cosimConfig.getDocument(),
            possibleIdentifier
        );
        context.report(
            range,
            `Invalid FMU identifier: '${possibleIdentifier.value}'`,
            vscode.DiagnosticSeverity.Error
        );
    }
}

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
        if (!possibleFMUPath || typeof possibleFMUPath.value !== "string") {
            return;
        }

        const wsFolder = context.cosimConfig.getWorkspaceFolder();
        if (!wsFolder) {
            return;
        }
        const absoluteFMUPath = resolveAbsolutePath(
            wsFolder,
            possibleFMUPath.value
        );

        // No diagnostics if path refers to a valid FMU.
        if (await this.isFileValidFMU(absoluteFMUPath)) {
            return;
        }

        const range = getStringContentRange(
            context.cosimConfig.getDocument(),
            possibleFMUPath
        );
        context.report(
            range,
            `Invalid FMU: the file at '${possibleFMUPath.value}' either doesn't exist or is not a well formed FMU.`,
            vscode.DiagnosticSeverity.Error
        );
    };

    isFileValidFMU = async (path: string): Promise<boolean> => {
        // Currently just checks that a file actually exists at the path
        // TODO: Check whether the file is a well-formed FMU.
        return fs.existsSync(path);
    };
}

import type * as vscode from "vscode";
import type { Node, NodeType } from "jsonc-parser";
import { CosimulationConfiguration } from "./utils";

export interface RuleContext {
    report: (
        range: vscode.Range,
        message: string,
        severity: vscode.DiagnosticSeverity
    ) => void;
    cosimConfig: CosimulationConfiguration
}

export type RuleHandler = (node: Node, context: RuleContext) => Promise<void>;
export type HandlerMethodName = `on${Capitalize<NodeType>}`;

export type LintRule = Partial<{
    [K in HandlerMethodName]: RuleHandler;
}>;
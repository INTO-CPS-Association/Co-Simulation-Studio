import type { Node, NodeType } from "jsonc-parser";
import { Diagnostic, DiagnosticSeverity, Position, Range, TextDocument, WorkspaceFolder } from "vscode";
import { FMUModel, FMUModelMap, FMUSource, FMUSourceMap } from "fmu";

export type RuleHandler = (node: Node, context: IRuleContext) => Promise<void>;
export type HandlerMethodName = `on${Capitalize<NodeType>}`;

export type LintRule = Partial<{
    [K in HandlerMethodName]: RuleHandler;
}>;

export type RuleRegistry = Map<NodeType, RuleHandler[]>;

export interface IRuleContext {
    diagnostics: Diagnostic[];
    cosimConfig: ICosimulationConfiguration;
    report(range: Range, message: string, severity: DiagnosticSeverity): void;
};

export interface ICosimulationConfiguration {
    getTree(): Node;
    getDocument(): TextDocument;
    getNodeAtPosition(pos: Position): Node | undefined;
    getAllFMUSources(): FMUSourceMap;
    getAllFMUSourcesAsArray(): Array<FMUSource>;
    getAllFMUModels(): Promise<FMUModelMap>;
    getFMUModel(fmuIdentifier: string): Promise<FMUModel | undefined>;
    getWorkspaceFolderFromDocument(document: TextDocument): WorkspaceFolder | undefined;
    getWorkspaceFolder(): WorkspaceFolder | undefined;
    getAllVariablesFromIdentifier(fmuIdentifier: string): Promise<string[]>;
};
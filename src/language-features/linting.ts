import { NodeType, Node, parseTree, findNodeAtLocation } from "jsonc-parser";
import * as vscode from "vscode";
import { FMUSource } from "./completion-items";
import {
    ValidFMUIdentifierRule,
    validIdentifierPattern,
} from "./linting-rules/valid-fmu-identifier";
import { correctCausalityConnectionsRule } from "./linting-rules/correct-causality-connections";
import { ValidFMUPathRule } from "./linting-rules/valid-fmu-path";
import { getCosimPath } from "../utils";

export interface RuleContext {
    report: (
        range: vscode.Range,
        message: string,
        severity: vscode.DiagnosticSeverity
    ) => void;
    document: vscode.TextDocument;
    fmuSources: FMUSource[];
}

type RuleHandler = (node: Node, context: RuleContext) => Promise<void>;
type HandlerMethodName = `on${Capitalize<NodeType>}`;
export type LintRule = Partial<{
    [K in HandlerMethodName]: RuleHandler;
}>;

/**
 * Map from JSON node type, e.g 'property', 'number', 'string', etc. to a linting rule handler that expects a node of the given node type.
 */
type RuleRegistry = Map<NodeType, RuleHandler[]>;

const ruleRegistry: RuleRegistry = new Map();

export function registerRule(rule: LintRule) {
    const nodeTypeToHandlerName: Map<NodeType, HandlerMethodName> = new Map([
        ["array", "onArray"],
        ["boolean", "onBoolean"],
        ["null", "onNull"],
        ["number", "onNumber"],
        ["object", "onObject"],
        ["property", "onProperty"],
        ["string", "onString"],
    ]);

    for (const [ruleType, ruleHandlerName] of nodeTypeToHandlerName) {
        const ruleHandler = rule[ruleHandlerName];

        if (!ruleHandler) {
            continue;
        }

        const existingRuleHandlers = ruleRegistry.get(ruleType) ?? [];
        existingRuleHandlers.push(ruleHandler);
        ruleRegistry.set(ruleType, existingRuleHandlers);
    }
}

export class SimulationConfigLinter implements vscode.Disposable {
    private diagnosticsCollection: vscode.DiagnosticCollection =
        vscode.languages.createDiagnosticCollection("simulation-config");
    private disposables: vscode.Disposable[] = [this.diagnosticsCollection];
    private timer: NodeJS.Timeout | undefined;

    private jsonQueue = new Set<vscode.TextDocument>();

    constructor() {
        this.disposables.push(
            vscode.workspace.onDidOpenTextDocument((document) =>
                this.queue(document)
            ),
            vscode.workspace.onDidChangeTextDocument((event) =>
                this.queue(event.document)
            ),
            vscode.workspace.onDidCloseTextDocument((document) =>
                this.clear(document)
            )
        );
    }

    private queue(document: vscode.TextDocument) {
        const path = document.uri.path;
        if (document.languageId === "json" && path.endsWith(`/${getCosimPath(document)}`)) {
            this.jsonQueue.add(document);
            this.startTimer();
        }
    }

    private startTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => this.lint(), 300);
    }

    private async lint() {
        for (const document of Array.from(this.jsonQueue)) {
            this.jsonQueue.delete(document);
            if (document.isClosed) {
                continue;
            }

            const fileContent = document.getText();
            const tree = parseTree(fileContent);

            if (tree) {
                const diagnostics: vscode.Diagnostic[] = [];
                const ruleContext = this.getRuleContext(
                    document,
                    tree,
                    diagnostics
                );

                const ruleVisitor = new RuleVisitor(ruleRegistry);
                await ruleVisitor.visit(tree, ruleContext);
                this.diagnosticsCollection.set(document.uri, diagnostics);
            }
        }
    }

    private getRuleContext(
        document: vscode.TextDocument,
        tree: Node,
        diagnostics: vscode.Diagnostic[]
    ): RuleContext {
        return {
            report: (range, message, severity) =>
                diagnostics.push(
                    new vscode.Diagnostic(range, message, severity)
                ),
            document,
            fmuSources: this.getAllFMUIdentifiers(tree),
        };
    }

    private getAllFMUIdentifiers(configTree: Node): FMUSource[] {
        const fmusNode = findNodeAtLocation(configTree, ["fmus"]);

        if (!fmusNode || !fmusNode.children || fmusNode.type !== "object") {
            return [];
        }

        const fmuSources: FMUSource[] = [];

        for (const property of fmusNode.children) {
            if (!property.children || property.children.length !== 2) {
                continue;
            }

            const possibleIdentifier = property.children[0].value;
            const possiblePath = property.children[1].value;
            if (
                typeof possibleIdentifier === "string" &&
                validIdentifierPattern.test(possibleIdentifier)
            ) {
                fmuSources.push({
                    identifier: possibleIdentifier,
                    path:
                        typeof possiblePath === "string"
                            ? possiblePath
                            : undefined,
                });
            }
        }

        return fmuSources;
    }

    private clear(document: vscode.TextDocument) {
        this.jsonQueue.delete(document);
        this.diagnosticsCollection.delete(document.uri);
    }

    public dispose() {
        this.disposables.forEach((d) => d.dispose());
        this.disposables = [];
    }
}

class RuleVisitor {
    constructor(private readonly ruleRegistry: RuleRegistry) {}

    public async visit(node: Node, context: RuleContext) {
        switch (node.type) {
            case "array":
                await this.visitArray(node, context);
                break;
            case "boolean":
                await this.visitBoolean(node, context);
                break;
            case "null":
                await this.visitNull(node, context);
                break;
            case "number":
                await this.visitNumber(node, context);
                break;
            case "object":
                await this.visitObject(node, context);
                break;
            case "property":
                await this.visitProperty(node, context);
                break;
            case "string":
                await this.visitString(node, context);
                break;
        }
    }

    async visitRules(ruleType: NodeType, node: Node, context: RuleContext) {
        const rules = this.ruleRegistry.get(ruleType);
        for (const ruleHandler of rules ?? []) {
            try {
                await ruleHandler(node, context);
            } catch (err) {
                console.error(`Failed to lint with error: ${err}`);
            }
        }

        for (const child of node.children || []) {
            await this.visit(child, context);
        }
    }

    async visitArray(node: Node, context: RuleContext): Promise<void> {
        await this.visitRules("array", node, context);
    }
    async visitBoolean(node: Node, context: RuleContext): Promise<void> {
        await this.visitRules("boolean", node, context);
    }
    async visitNull(node: Node, context: RuleContext): Promise<void> {
        await this.visitRules("null", node, context);
    }
    async visitNumber(node: Node, context: RuleContext): Promise<void> {
        await this.visitRules("number", node, context);
    }
    async visitObject(node: Node, context: RuleContext): Promise<void> {
        await this.visitRules("object", node, context);
    }
    async visitProperty(node: Node, context: RuleContext): Promise<void> {
        await this.visitRules("property", node, context);
    }
    async visitString(node: Node, context: RuleContext): Promise<void> {
        await this.visitRules("string", node, context);
    }
}

registerRule(new ValidFMUIdentifierRule());
registerRule(correctCausalityConnectionsRule);
registerRule(new ValidFMUPathRule());

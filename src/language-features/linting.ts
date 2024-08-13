import { NodeType, Node } from "jsonc-parser";
import * as vscode from "vscode";
import { correctCausalityConnectionsRule } from "./linting-rules/correct-causality-connections";
import { isDocumentCosimConfig } from "../utils";
import {
    HandlerMethodName,
    LintRule,
    RuleContext,
    RuleHandler,
} from "./language-features.types";
import {
    ValidFMUIdentifierRule,
    ValidFMUPathRule,
} from "./linting-rules/fmu-rules";
import { CosimulationConfiguration } from "./utils";

/**
 * Map from JSON node type, e.g 'property', 'number', 'string', etc. to an array of linting rule handlers that expects a node of the given node type.
 */
export type RuleRegistry = Map<NodeType, RuleHandler[]>;
const ruleRegistry: RuleRegistry = new Map();

export function registerRule(rule: LintRule, registry: RuleRegistry) {
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

        const existingRuleHandlers = registry.get(ruleType) ?? [];
        existingRuleHandlers.push(ruleHandler);
        registry.set(ruleType, existingRuleHandlers);
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
        if (isDocumentCosimConfig(document)) {
            this.jsonQueue.add(document);
            this.startTimer();
        }
    }

    private startTimer() {
        const LINT_DEBOUNCE_MS = 300;

        if (this.timer) {
            clearTimeout(this.timer);
        }

        this.timer = setTimeout(() => this.lint(), LINT_DEBOUNCE_MS);
    }

    private async lint() {
        const ruleVisitor = new RuleVisitor(ruleRegistry);
        for (const document of Array.from(this.jsonQueue)) {
            this.lintDocument(document, ruleVisitor);
        }
    }

    private async lintDocument(
        document: vscode.TextDocument,
        ruleVisitor: RuleVisitor
    ) {
        this.jsonQueue.delete(document);
        if (document.isClosed) {
            return;
        }

        let cosimConfig: CosimulationConfiguration;
        try {
            cosimConfig = new CosimulationConfiguration(document);
        } catch {
            return;
        }

        const diagnostics: vscode.Diagnostic[] = [];
        const ruleContext = this.getRuleContext(cosimConfig, diagnostics);

        await ruleVisitor.visit(cosimConfig.getTree(), ruleContext);
        this.diagnosticsCollection.set(document.uri, diagnostics);
    }

    private getRuleContext(
        cosimConfig: CosimulationConfiguration,
        diagnostics: vscode.Diagnostic[]
    ): RuleContext {
        return {
            report: (range, message, severity) =>
                diagnostics.push(
                    new vscode.Diagnostic(range, message, severity)
                ),
            cosimConfig,
        };
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

    private async visitRules(ruleType: NodeType, node: Node, context: RuleContext) {
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

    private async visitArray(node: Node, context: RuleContext): Promise<void> {
        await this.visitRules("array", node, context);
    }
    private async visitBoolean(node: Node, context: RuleContext): Promise<void> {
        await this.visitRules("boolean", node, context);
    }
    private async visitNull(node: Node, context: RuleContext): Promise<void> {
        await this.visitRules("null", node, context);
    }
    private async visitNumber(node: Node, context: RuleContext): Promise<void> {
        await this.visitRules("number", node, context);
    }
    private async visitObject(node: Node, context: RuleContext): Promise<void> {
        await this.visitRules("object", node, context);
    }
    private async visitProperty(node: Node, context: RuleContext): Promise<void> {
        await this.visitRules("property", node, context);
    }
    private async visitString(node: Node, context: RuleContext): Promise<void> {
        await this.visitRules("string", node, context);
    }
}

registerRule(new ValidFMUIdentifierRule(), ruleRegistry);
registerRule(correctCausalityConnectionsRule, ruleRegistry);
registerRule(new ValidFMUPathRule(), ruleRegistry);

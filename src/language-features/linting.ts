import { NodeType } from 'jsonc-parser'
import * as vscode from 'vscode'
import { correctCausalityConnectionsRule } from './linting-rules/correct-causality-connections'
import { isDocumentCosimConfig } from '../utils'
import {
    HandlerMethodName,
    IRuleContext,
    LintRule,
    RuleRegistry,
} from './language-features.types'
import {
    ValidFMUIdentifierRule,
    ValidFMUPathRule,
} from './linting-rules/fmu-rules'
import { CosimulationConfiguration, visitTreeUsingRules } from './utils'

/**
 * Map from JSON node type, e.g 'property', 'number', 'string', etc. to an array of linting rule handlers that expects a node of the given node type.
 */
const ruleRegistry: RuleRegistry = new Map()

export function registerRule(rule: LintRule, registry: RuleRegistry) {
    const nodeTypeToHandlerName: Map<NodeType, HandlerMethodName> = new Map([
        ['array', 'onArray'],
        ['boolean', 'onBoolean'],
        ['null', 'onNull'],
        ['number', 'onNumber'],
        ['object', 'onObject'],
        ['property', 'onProperty'],
        ['string', 'onString'],
    ])

    for (const [ruleType, ruleHandlerName] of nodeTypeToHandlerName) {
        const ruleHandler = rule[ruleHandlerName]

        if (!ruleHandler) {
            continue
        }

        const existingRuleHandlers = registry.get(ruleType) ?? []
        existingRuleHandlers.push(ruleHandler)
        registry.set(ruleType, existingRuleHandlers)
    }
}

export class RuleContext implements IRuleContext {
    public diagnostics: vscode.Diagnostic[] = []

    constructor(public cosimConfig: CosimulationConfiguration) {}
    public report(
        range: vscode.Range,
        message: string,
        severity: vscode.DiagnosticSeverity
    ): void {
        this.diagnostics.push(new vscode.Diagnostic(range, message, severity))
    }
}

export class SimulationConfigLinter implements vscode.Disposable {
    private documentQueueManager: DocumentQueueManager
    private lintingManager: LintingManager
    private disposables: vscode.Disposable[] = []

    constructor() {
        const DEBOUNCE_MS = 300
        const diagnosticsCollection =
            vscode.languages.createDiagnosticCollection('simulation-config')

        this.lintingManager = new LintingManager(diagnosticsCollection)
        this.documentQueueManager = new DocumentQueueManager(DEBOUNCE_MS, () =>
            this.lint()
        )

        this.disposables.push(
            this.lintingManager,
            this.documentQueueManager,
            vscode.workspace.onDidOpenTextDocument((document) =>
                this.documentQueueManager.queue(document)
            ),
            vscode.workspace.onDidChangeTextDocument((event) =>
                this.documentQueueManager.queue(event.document)
            ),
            vscode.window.onDidChangeActiveTextEditor((newActiveEditor) => {
                if (newActiveEditor) {
                    this.documentQueueManager.queue(newActiveEditor.document)
                }
            }),
            vscode.workspace.onDidCloseTextDocument((document) => {
                this.documentQueueManager.dequeue(document)
                this.lintingManager.clearDiagnostics(document)
            })
        )

        if (vscode.window.activeTextEditor) {
            this.documentQueueManager.queue(
                vscode.window.activeTextEditor.document
            )
        }
    }

    private lint() {
        const documents = this.documentQueueManager.getDocuments()
        this.documentQueueManager.clearQueue()
        this.lintingManager.lintDocuments(documents)
    }

    public dispose() {
        this.disposables.forEach((d) => d.dispose())
        this.disposables = []
    }
}

export class LintingManager {
    private diagnosticsCollection: vscode.DiagnosticCollection

    constructor(diagnosticsCollection: vscode.DiagnosticCollection) {
        this.diagnosticsCollection = diagnosticsCollection
    }

    public async lintDocuments(documents: vscode.TextDocument[]) {
        for (const document of documents) {
            await this.lintDocument(document)
        }
    }

    private async lintDocument(document: vscode.TextDocument) {
        if (document.isClosed) {
            return
        }

        let cosimConfig: CosimulationConfiguration
        try {
            cosimConfig = new CosimulationConfiguration(document)
        } catch {
            return
        }

        const ruleContext = new RuleContext(cosimConfig)

        await visitTreeUsingRules(
            cosimConfig.getTree(),
            ruleContext,
            ruleRegistry
        )

        this.diagnosticsCollection.set(document.uri, ruleContext.diagnostics)
    }

    public clearDiagnostics(document: vscode.TextDocument) {
        this.diagnosticsCollection.delete(document.uri)
    }

    public dispose() {
        this.diagnosticsCollection.dispose()
    }
}

export class DocumentQueueManager {
    private jsonQueue = new Set<vscode.TextDocument>()
    private timer: NodeJS.Timeout | undefined
    private readonly lintDebounceMs: number
    private lintCallback: () => void

    constructor(lintDebounceMs: number, lintCallback: () => void) {
        this.lintDebounceMs = lintDebounceMs
        this.lintCallback = lintCallback
    }

    public queue(document: vscode.TextDocument) {
        if (isDocumentCosimConfig(document)) {
            this.jsonQueue.add(document)
            this.startTimer()
        }
    }

    private startTimer() {
        if (this.timer) {
            clearTimeout(this.timer)
        }

        this.timer = setTimeout(() => this.lintCallback(), this.lintDebounceMs)
    }

    public dequeue(document: vscode.TextDocument) {
        this.jsonQueue.delete(document)
    }

    public getDocuments(): vscode.TextDocument[] {
        return Array.from(this.jsonQueue)
    }

    public clearQueue() {
        this.jsonQueue.clear()
    }

    public dispose() {
        if (this.timer) {
            clearTimeout(this.timer)
        }
    }
}

registerRule(new ValidFMUIdentifierRule(), ruleRegistry)
registerRule(correctCausalityConnectionsRule, ruleRegistry)
registerRule(new ValidFMUPathRule(), ruleRegistry)

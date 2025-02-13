import { createTextDocument } from 'jest-mock-vscode'
import { RuleRegistry } from 'language-features/language-features.types'
import * as lintingModule from 'language-features/linting'
import * as languageUtils from 'language-features/utils'
import { CosimulationConfiguration } from 'language-features/utils'
import * as utils from 'utils'
import vscode, { DiagnosticSeverity } from 'vscode'

const mockUri = vscode.Uri.parse('path/to/file')
const mockDocument1 = createTextDocument(mockUri, '{}', 'json', 1)
const mockDocument2 = createTextDocument(mockUri, 'mockContent2', 'json', 1)

function createMockDiagnosticCollection(): vscode.DiagnosticCollection {
    const diagnosticMap = new Map<vscode.Uri, vscode.Diagnostic[]>()

    return {
        name: 'mock-diagnstostics-collection',
        set: jest
            .fn()
            .mockImplementation(
                (uri: vscode.Uri, diagnostics: vscode.Diagnostic[]) => {
                    diagnosticMap.set(uri, diagnostics)
                }
            ),
        get: jest.fn().mockImplementation((uri: vscode.Uri) => {
            return diagnosticMap.get(uri)
        }),
        delete: jest.fn(),
        clear: jest.fn(),
        dispose: jest.fn(),
        forEach: jest.fn(),
        has: jest.fn(),
        [Symbol.iterator]: jest.fn(),
    }
}

describe('Linting language feature', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('registerRule', () => {
        test('registering a rule without any handlers should leave registry unchanged', () => {
            const mockRuleRegistry: RuleRegistry = new Map()

            lintingModule.registerRule({}, mockRuleRegistry)

            expect(mockRuleRegistry.size).toBe(0)
        })

        test('registering a rule with a single handler should add the handler to the registry', () => {
            const mockRuleRegistry: RuleRegistry = new Map()

            lintingModule.registerRule(
                {
                    onArray: jest.fn(),
                },
                mockRuleRegistry
            )

            const arrayHandlers = mockRuleRegistry.get('array')

            expect(mockRuleRegistry.size).toBe(1)
            expect(arrayHandlers).toHaveLength(1)
        })
    })

    describe('RuleContext', () => {
        test('report should add a diagnostic to the collection', () => {
            const mockCosimConfig = new CosimulationConfiguration(mockDocument1)
            const ruleContext = new lintingModule.RuleContext(mockCosimConfig)

            expect(ruleContext.diagnostics).toHaveLength(0)

            ruleContext.report(
                new vscode.Range(0, 0, 0, 0),
                { message: 'test' },
                DiagnosticSeverity.Error
            )

            expect(ruleContext.diagnostics).toHaveLength(1)
            expect(ruleContext.diagnostics[0].message).toBe('test')
            expect(ruleContext.diagnostics[0].severity).toBe(
                DiagnosticSeverity.Error
            )
        })
    })

    describe('SimulationConfigLinter', () => {
        test('instantiating an instance of the linter registers three event listeners', () => {
            new lintingModule.SimulationConfigLinter()

            expect(vscode.workspace.onDidChangeTextDocument).toHaveBeenCalled()
            expect(vscode.workspace.onDidCloseTextDocument).toHaveBeenCalled()
            expect(vscode.workspace.onDidOpenTextDocument).toHaveBeenCalled()
        })
    })

    describe('DocumentQueueManager', () => {
        const DEBOUNCE_MS = 300
        let mockDocumentQueueManager: lintingModule.DocumentQueueManager
        let timeoutSpy: jest.SpyInstance
        let isDocumentCosimConfigSpy: jest.SpyInstance
        let lintCallbackMock: jest.Mock

        beforeAll(() => {
            jest.useFakeTimers()
        })
        beforeEach(() => {
            jest.useFakeTimers()
            timeoutSpy = jest.spyOn(global, 'setTimeout')
            isDocumentCosimConfigSpy = jest.spyOn(
                utils,
                'isDocumentCosimConfig'
            )
            lintCallbackMock = jest.fn()

            mockDocumentQueueManager = new lintingModule.DocumentQueueManager(
                DEBOUNCE_MS,
                lintCallbackMock
            )

            isDocumentCosimConfigSpy.mockReturnValue(true)
        })

        test('queing a document should add it to the queue but not trigger a lint immediately', () => {
            mockDocumentQueueManager.queue(mockDocument1)

            expect(mockDocumentQueueManager.getDocuments()).toEqual([
                mockDocument1,
            ])
            expect(timeoutSpy).toHaveBeenCalledTimes(1)
            expect(lintCallbackMock).not.toHaveBeenCalled()
        })

        test('queing two documents within debounce time should trigger a single lint', () => {
            mockDocumentQueueManager.queue(mockDocument1)
            mockDocumentQueueManager.queue(mockDocument1)

            jest.advanceTimersByTime(DEBOUNCE_MS)

            expect(timeoutSpy).toHaveBeenCalledTimes(2)
            expect(lintCallbackMock).toHaveBeenCalledTimes(1)
        })

        test('dequeueing a document should remove it from the queue', () => {
            mockDocumentQueueManager.queue(mockDocument1)
            mockDocumentQueueManager.queue(mockDocument2)

            const documentToDequeue = mockDocumentQueueManager.getDocuments()[0]
            mockDocumentQueueManager.dequeue(documentToDequeue)

            expect(mockDocumentQueueManager.getDocuments()).toEqual([
                mockDocument2,
            ])
        })

        test('clearing the queue should leave queue empty', () => {
            mockDocumentQueueManager.queue(mockDocument1)

            expect(mockDocumentQueueManager.getDocuments()).toEqual([
                mockDocument1,
            ])

            mockDocumentQueueManager.clearQueue()

            expect(mockDocumentQueueManager.getDocuments()).toEqual([])
        })
    })

    describe('LintingManager', () => {
        let mockDiagnosticsCollection: vscode.DiagnosticCollection
        let mockLintingManager: lintingModule.LintingManager

        beforeEach(() => {
            mockDiagnosticsCollection = createMockDiagnosticCollection()
            mockLintingManager = new lintingModule.LintingManager(
                mockDiagnosticsCollection
            )
        })

        test('lintDocuments should add diagnostics to the collection', async () => {
            const visitTreeSpy = jest.spyOn(
                languageUtils,
                'visitTreeUsingRules'
            )
            visitTreeSpy.mockImplementation(async (_node, ruleContext) => {
                ruleContext.report(
                    new vscode.Range(0, 0, 0, 0),
                    { message: 'test' },
                    DiagnosticSeverity.Error
                )
            })

            await mockLintingManager.lintDocuments([mockDocument1])

            expect(visitTreeSpy).toHaveBeenCalledTimes(1)
            expect(
                mockDiagnosticsCollection.get(mockDocument1.uri)
            ).toHaveLength(1)
        })
    })
})

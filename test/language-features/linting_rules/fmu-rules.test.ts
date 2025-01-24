import { Node, parseTree } from 'jsonc-parser'
import vscode from 'vscode'
import {
    ValidFMUIdentifierRule,
    ValidFMUPathRule,
} from 'language-features/linting-rules/fmu-rules'
import { IRuleContext } from 'language-features/language-features.types'
import { Uri } from 'jest-mock-vscode/dist/vscode'

// Mocks for vscode and utilities
jest.mock('vscode', () => ({
    DiagnosticSeverity: { Error: 'Error' },
    workspace: {
        fs: {
            stat: jest.fn(),
        },
    },
}))

// Helper to mock the rule context
const createMockContext = (): IRuleContext => ({
    cosimConfig: {
        getFMUModel: jest.fn(),
        getDocument: jest.fn(),
        getTree: jest.fn(),
        getNodeAtPosition: jest.fn(),
        getAllFMUSources: jest.fn(),
        getAllFMUSourcesAsArray: jest.fn(),
        getAllFMUModels: jest.fn(),
        getWorkspaceFolderFromDocument: jest.fn(),
        getWorkspaceFolder: jest.fn(),
        getAllVariablesFromIdentifier: jest.fn(),
    },
    report: jest.fn(),
    diagnostics: [],
})

// Mock isValidFMUIdentifier utility
jest.mock('fmu', () => ({
    isValidFMUIdentifier: jest.fn(),
}))
jest.mock('language-features/utils', () => ({
    getStringContentRange: jest.fn(),
}))
const { isValidFMUIdentifier } = require('fmu')
const { getStringContentRange } = require('language-features/utils')

// Mock resolveAbsolutePath utility
jest.mock('utils', () => ({
    resolveAbsolutePath: jest.fn(),
}))
const { resolveAbsolutePath } = require('utils')

// Tests
describe('ValidFMUIdentifierRule', () => {
    let context: IRuleContext

    beforeEach(() => {
        context = createMockContext()
    })

    it('does not report an error for a valid FMU identifier', async () => {
        const rule = new ValidFMUIdentifierRule()
        const validIdentifierNode: Node = {
            type: 'string', // Type of the node (e.g., "string", "object", etc.)
            value: 'FMU1', // The actual value of the node
            offset: 0, // Position in the document
            length: 4, // Length of the value
        }

        isValidFMUIdentifier.mockReturnValue(true)

        await rule.onProperty(validIdentifierNode, context)

        expect(context.report).not.toHaveBeenCalled()
    })

    it('reports an error for an invalid FMU identifier', async () => {
        const rule = new ValidFMUIdentifierRule()
        const configTree = parseTree(`
          {
            "fmus": {
              "Invalid-FMU!": "path"
            }
          }"`)

        const invalidIdentifierNode =
            configTree?.children?.[0]?.children?.[1]?.children?.[0]

        if (!invalidIdentifierNode) {
            fail()
        }

        isValidFMUIdentifier.mockReturnValue(false)
        getStringContentRange.mockReturnValue('mockrange')

        await rule.onProperty(invalidIdentifierNode, context)

        expect(context.report).toHaveBeenCalledWith(
            expect.anything(), // Range
            expect.objectContaining({ type: 'INVALID_FMU_IDENTIFIER' }),
            'Error'
        )
    })
})

describe('ValidFMUPathRule', () => {
    let context: IRuleContext

    beforeEach(() => {
        context = createMockContext()
        resolveAbsolutePath.mockReturnValue(
            Uri.file('file:///workspace/valid.fmu')
        )
    })

    it('does not report an error for a valid FMU path', async () => {
        const rule = new ValidFMUPathRule()
        const validPathNode: Node = {
            type: 'string', // Type of the node (e.g., "string", "object", etc.)
            value: 'INVALID-FMU1', // The actual value of the node
            offset: 0, // Position in the document
            length: 4, // Length of the value
        }

        ;(context.cosimConfig.getWorkspaceFolder as any).mockReturnValue(
            Uri.file('file:///workspace')
        )
        ;(vscode.workspace.fs.stat as any).mockResolvedValue({}) // File exists

        await rule.onProperty(validPathNode, context)

        expect(context.report).not.toHaveBeenCalled()
    })

    it('reports an error for a non-existent FMU file', async () => {
        const rule = new ValidFMUPathRule()
        const configTree = parseTree(`
          {
            "fmus": {
              "Invalid-FMU!": "invalid.fmu"
            }
          }"`)

        const invalidPathNode =
            configTree?.children?.[0]?.children?.[1]?.children?.[0]

        if (!invalidPathNode) {
            fail()
        }

        ;(context.cosimConfig.getWorkspaceFolder as any).mockReturnValue(
            Uri.file('file:///workspace')
        )
        ;(vscode.workspace.fs.stat as any).mockRejectedValue(
            new Error('File not found')
        ) // File does not exist

        await rule.onProperty(invalidPathNode, context)

        expect(context.report).toHaveBeenCalledWith(
            expect.anything(), // Range
            expect.objectContaining({ type: 'INVALID_FMU_REFERENCE' }),
            'Error'
        )
    })

    it('handles missing workspace folder gracefully', async () => {
        const rule = new ValidFMUPathRule()
        const pathNode: Node = {
            type: 'string', // Type of the node (e.g., "string", "object", etc.)
            value: 'missingWorkspace.fmu', // The actual value of the node
            offset: 0, // Position in the document
            length: 4, // Length of the value
        }

        ;(context.cosimConfig.getWorkspaceFolder as any).mockReturnValue(
            undefined
        )

        await rule.onProperty(pathNode, context)

        expect(context.report).not.toHaveBeenCalled() // Should not crash or report
    })
})

import { correctCausalityConnectionsRule } from 'language-features/linting-rules/correct-causality-connections'
import { Node, parseTree } from 'jsonc-parser'
import { IRuleContext } from 'language-features/language-features.types'
import * as vscode from 'vscode'

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

jest.mock('language-features/utils', () => ({
    getStringContentRange: jest.fn(),
}))
const { getStringContentRange } = require('language-features/utils')

const mockFMUModel = (inputs: string[], outputs: string[]) => ({
    inputs: inputs.map((name) => ({ name })),
    outputs: outputs.map((name) => ({ name })),
})

describe('correctCausalityConnectionsRule', () => {
    let context: IRuleContext

    beforeEach(() => {
        context = createMockContext()
    })

    it('reports no error for valid connections', async () => {
        const validConnectionsNode: Node = {
            children: [
                {
                    value: '{FMU1}.comp1.output1',
                    type: 'string',
                    offset: 0,
                    length: 0,
                }, // Output
                {
                    children: [
                        {
                            value: '{FMU1}.comp2.input1',
                            type: 'string',
                            offset: 0,
                            length: 0,
                        }, // Input
                    ],
                    type: 'string',
                    offset: 0,
                    length: 0,
                },
            ],
            type: 'string',
            offset: 0,
            length: 0,
        }

        ;(context.cosimConfig.getFMUModel as any).mockResolvedValue(
            mockFMUModel(['input1'], ['output1'])
        )

        if (correctCausalityConnectionsRule.onProperty) {
            await correctCausalityConnectionsRule.onProperty(
                validConnectionsNode,
                context
            )
        }

        expect(context.report).not.toHaveBeenCalled()
    })

    it('reports error for invalid output', async () => {
        const configTree = parseTree(`
        {
          "connections": {
            "{FMU1}.comp1.invalidOutput": ["{FMU1}.comp2.input1"]
          }
        }"`)

        const invalidOutputNode =
            configTree?.children?.[0]?.children?.[1]?.children?.[0]

        if (!invalidOutputNode) {
            fail('invalid node in test')
        }

        getStringContentRange.mockReturnValue('mockrange')
        ;(context.cosimConfig.getFMUModel as any).mockResolvedValue(
            mockFMUModel(['input1'], ['output1'])
        )

        await correctCausalityConnectionsRule.onProperty?.(
            invalidOutputNode,
            context
        )

        expect(context.report).toHaveBeenCalledWith(
            expect.anything(), // Range
            expect.objectContaining({ message: expect.anything() }),
            vscode.DiagnosticSeverity.Error
        )
    })

    it('reports error for invalid input', async () => {
        const configTree = parseTree(`
        {
          "connections": {
            "{FMU1}.comp1.outpu1": ["{FMU1}.comp2.invalidInput"]
          }
        }"`)

        const invalidInputNode =
            configTree?.children?.[0]?.children?.[1]?.children?.[0]

        if (!invalidInputNode) {
            fail('invalid node in test')
        }

        ;(context.cosimConfig.getFMUModel as any).mockResolvedValue(
            mockFMUModel(['input1'], ['output1'])
        )

        await correctCausalityConnectionsRule.onProperty?.(
            invalidInputNode,
            context
        )

        expect(context.report).toHaveBeenCalledWith(
            expect.anything(), // Range
            expect.objectContaining({ message: expect.anything() }),
            vscode.DiagnosticSeverity.Error
        )
    })
})

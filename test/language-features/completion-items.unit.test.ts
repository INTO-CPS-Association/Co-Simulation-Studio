import { FMUModel } from 'fmu'
import { createTextDocument } from 'jest-mock-vscode'
import { SimulationConfigCompletionItemProvider } from 'language-features/completion-items'
import { CosimulationConfiguration } from 'language-features/utils'
import { Position, TextDocument, Uri } from 'vscode'

const workspaceUri = Uri.file('/data')

const dummyCosimConfigTemplate = `
{
    "fmus": {
        "{fmu1}": "${Uri.joinPath(workspaceUri, 'fmu1.fmu').path}",
        "{fmu2}": "${Uri.joinPath(workspaceUri, 'fmu2.fmu').path}"
    },
    "connections": {
        "$": [""],
        "{fmu1}.fmui1.$": ["{fmu1}.fmui1.$"]
    },
    "parameters": {
        "{fmu1}.fmui1.$" : 1.0
    }
}
`

const dummyModel: FMUModel = {
    inputs: [
        {
            name: 'fk',
        },
    ],
    outputs: [
        {
            name: 'x1',
        },
        {
            name: 'v1',
        },
    ],
    parameters: [
        {
            name: 'c1',
        },
    ],
}

function getCompletionPosition(
    text: string,
    completionChar: string,
    offset: number
): Position {
    const completionCharCount = text.split(completionChar).length - 1

    if (completionCharCount - 1 < offset) {
        throw Error(
            'Offset exceeds the number of completion characters present in the completion template.'
        )
    }

    let cleanedText = text
    for (let i = 0; i < offset; i++) {
        cleanedText = cleanedText.replace(completionChar, '')
    }

    const parts = cleanedText.split(completionChar, 1)
    const preCompletionLines = parts[0].split('\n')
    const completionLine = preCompletionLines.length - 1
    const completionColumn = preCompletionLines[completionLine].length

    return new Position(completionLine, completionColumn)
}

function constructCompletionExample(
    template: string,
    offset: number
): [TextDocument, Position] {
    const completionPosition = getCompletionPosition(template, '$', offset)
    const cosimConfig = template.replaceAll('$', '')

    const dummyConfigDocument = createTextDocument(
        Uri.joinPath(workspaceUri, 'custom_cosim.json'),
        cosimConfig,
        'json'
    )

    return [dummyConfigDocument, completionPosition]
}

describe('SimulationConfigCompletionItemProvider', () => {
    let cosimConfig: CosimulationConfiguration
    let simulationConfigCIP: SimulationConfigCompletionItemProvider

    beforeEach(() => {
        simulationConfigCIP = new SimulationConfigCompletionItemProvider()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('getFMUIdentifierCompletionItems', () => {
        it('should return the correct completion items', async () => {
            // The position inside the empty string of `dummyCosimConfig`, where the completion was triggered.
            const [dummyConfigDocument, pos] = constructCompletionExample(
                dummyCosimConfigTemplate,
                0
            )
            cosimConfig = new CosimulationConfiguration(dummyConfigDocument)

            const suggestions =
                await simulationConfigCIP.getFMUIdentifierCompletionItems(
                    cosimConfig,
                    pos
                )

            expect(suggestions).toHaveLength(2)

            const suggestionLabels = suggestions.map((sug) => sug.label)
            expect(suggestionLabels).toEqual(['{fmu1}', '{fmu2}'])
        })
    })

    describe('getFMUVariableCompletionItems', () => {
        it('should return the correct output completion items', async () => {
            // The position inside the connection string right after the period, where the completion was triggered.
            const [dummyConfigDocument, pos] = constructCompletionExample(
                dummyCosimConfigTemplate,
                1
            )
            cosimConfig = new CosimulationConfiguration(dummyConfigDocument)
            const getFMUModelSpy = jest.spyOn(cosimConfig, 'getFMUModel')
            getFMUModelSpy.mockImplementation(async (identifier: string) => {
                if (identifier === '{fmu1}') {
                    return dummyModel
                }

                return undefined
            })

            const suggestions =
                await simulationConfigCIP.getFMUVariableCompletionItems(
                    cosimConfig,
                    pos
                )

            expect(suggestions).toHaveLength(2)

            const suggestionLabels = suggestions.map((sug) => sug.label)
            expect(suggestionLabels).toEqual(['x1', 'v1'])
        })

        it('should return the correct input completion items', async () => {
            // The position inside the string in the inputs array of connections right after the period, where the completion was triggered.
            const [dummyConfigDocument, pos] = constructCompletionExample(
                dummyCosimConfigTemplate,
                2
            )
            cosimConfig = new CosimulationConfiguration(dummyConfigDocument)
            const getFMUModelSpy = jest.spyOn(cosimConfig, 'getFMUModel')
            getFMUModelSpy.mockImplementation(async (identifier: string) => {
                if (identifier === '{fmu1}') {
                    return dummyModel
                }

                return undefined
            })

            const suggestions =
                await simulationConfigCIP.getFMUVariableCompletionItems(
                    cosimConfig,
                    pos
                )

            expect(suggestions).toHaveLength(1)

            const suggestionLabels = suggestions.map((sug) => sug.label)
            expect(suggestionLabels).toEqual(['fk'])
        })

        it('should return the correct parameter completion items', async () => {
            // The position inside the string in the parameters mapping right after the period, where the completion was triggered.
            const [dummyConfigDocument, pos] = constructCompletionExample(
                dummyCosimConfigTemplate,
                3
            )
            cosimConfig = new CosimulationConfiguration(dummyConfigDocument)
            const getFMUModelSpy = jest.spyOn(cosimConfig, 'getFMUModel')
            getFMUModelSpy.mockImplementation(async (identifier: string) => {
                if (identifier === '{fmu1}') {
                    return dummyModel
                }

                return undefined
            })

            const suggestions =
                await simulationConfigCIP.getFMUVariableCompletionItems(
                    cosimConfig,
                    pos
                )

            expect(suggestions).toHaveLength(1)

            const suggestionLabels = suggestions.map((sug) => sug.label)
            expect(suggestionLabels).toEqual(['c1'])
        })
    })
})

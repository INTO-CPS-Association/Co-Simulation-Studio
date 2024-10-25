import { createTextDocument } from 'jest-mock-vscode'
import { SimulationConfigCompletionItemProvider } from 'language-features/completion-items'
import { CosimulationConfiguration } from 'language-features/utils'
import { Position, Uri } from 'vscode'

const workspaceUri = Uri.file('/data')

const dummyCosimConfig = `
{
    "fmus": {
        "{fmu1}": "${Uri.joinPath(workspaceUri, 'fmu1.fmu').path}",
        "{fmu2}": "${Uri.joinPath(workspaceUri, 'fmu2.fmu').path}"
    },
    "connections": {
        "": [""],
        "{fmu1}.fmui1.": [""]
    },
}
`

const dummyConfigDocument = createTextDocument(
    Uri.joinPath(workspaceUri, 'custom_cosim.json'),
    dummyCosimConfig,
    'json'
)

describe('SimulationConfigCompletionItemProvider', () => {
    let cosimConfig: CosimulationConfiguration
    let simulationConfigCIP: SimulationConfigCompletionItemProvider

    beforeEach(() => {
        cosimConfig = new CosimulationConfiguration(dummyConfigDocument)
        simulationConfigCIP = new SimulationConfigCompletionItemProvider()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('getFMUIdentifierCompletionItems', () => {
        it('should return the correct completion items', async () => {
            // The position inside the empty string of `dummyCosimConfig`, where the completion was triggered.
            const pos = new Position(7, 9)

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
        it('should return the correct completion items', async () => {
            // The position inside the connection string right after the final period of `dummyCosimConfig`, where the completion was triggered.
            const pos = new Position(8, 22)
            const getAllVariablesFromIdentifierSpy = jest.spyOn(
                cosimConfig,
                'getAllVariablesFromIdentifier'
            )
            getAllVariablesFromIdentifierSpy.mockImplementation(
                async (identifier: string) => {
                    if (identifier === '{fmu1}') {
                        return ['v1', 'v2']
                    }

                    return []
                }
            )

            const suggestions =
                await simulationConfigCIP.getFMUVariableCompletionItems(
                    cosimConfig,
                    pos
                )

            expect(suggestions).toHaveLength(2)

            const suggestionLabels = suggestions.map((sug) => sug.label)
            expect(suggestionLabels).toEqual(['v1', 'v2'])
        })
    })
})

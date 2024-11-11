import * as vscode from 'vscode'
import { getNodePath, Node } from 'jsonc-parser'
import {
    CosimulationConfiguration,
    getFMUIdentifierFromConnectionString,
    getStringContentRange,
    isNodeString,
} from './utils'
import { ModelVariable } from 'fmu'

export class SimulationConfigCompletionItemProvider
    implements vscode.CompletionItemProvider
{
    async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken
    ) {
        let cosimConfig: CosimulationConfiguration
        try {
            cosimConfig = new CosimulationConfiguration(document)
        } catch {
            return
        }

        const completionNode = cosimConfig.getNodeAtPosition(position)

        if (!completionNode) {
            return
        }

        let completionItems: vscode.CompletionItem[] = []

        completionItems = completionItems.concat(
            this.getFMUIdentifierCompletionItems(cosimConfig, position)
        )

        completionItems = completionItems.concat(
            await this.getFMUVariableCompletionItems(cosimConfig, position)
        )

        return completionItems
    }

    getFMUIdentifierCompletionItems(
        cosimConfig: CosimulationConfiguration,
        position: vscode.Position
    ): vscode.CompletionItem[] {
        const completionNode = cosimConfig.getNodeAtPosition(position)

        if (
            !completionNode ||
            !isNodeString(completionNode) ||
            getNodePath(completionNode)[0] === 'fmus'
        ) {
            return []
        }

        let range = getStringContentRange(
            cosimConfig.getDocument(),
            completionNode
        )

        const validFMUSources = cosimConfig.getAllFMUSourcesAsArray()
        const fmuCompletionItems = validFMUSources.map((fmuSource) => {
            let completionText = `${fmuSource.identifier}$0`

            const fmuItem = new vscode.CompletionItem(
                fmuSource.identifier,
                vscode.CompletionItemKind.Variable
            )

            fmuItem.range = range

            fmuItem.insertText = new vscode.SnippetString(completionText)

            return fmuItem
        })

        return fmuCompletionItems
    }

    async getFMUVariableCompletionItems(
        cosimConfig: CosimulationConfiguration,
        position: vscode.Position
    ): Promise<vscode.CompletionItem[]> {
        const completionNode = cosimConfig.getNodeAtPosition(position)

        if (
            !completionNode ||
            !isNodeString(completionNode) ||
            typeof completionNode.value !== 'string'
        ) {
            return []
        }

        const fmuIdentifier = getFMUIdentifierFromConnectionString(
            completionNode.value
        )

        if (!fmuIdentifier) {
            return []
        }

        const fmuModel = await cosimConfig.getFMUModel(fmuIdentifier)

        console.log(fmuModel)

        if (!fmuModel) {
            return []
        }

        const completionContext = this.getCompletionContext(completionNode)

        console.log('Completion context', completionContext)

        const completionVariables: ModelVariable[] = []

        if (completionContext === 'input') {
            completionVariables.push(...fmuModel.inputs)
        } else if (completionContext === 'output') {
            completionVariables.push(...fmuModel.outputs)
        } else if (completionContext === 'parameter') {
            completionVariables.push(...fmuModel.parameters)
        }

        const completionStrings = completionVariables.map(
            (variable) => variable.name
        )

        // Get range of the nearest word following a period
        const range = cosimConfig
            .getDocument()
            .getWordRangeAtPosition(position, /(?<=\.)\w+/)

        const suggestions = completionStrings.map((variable) => {
            const completionItem = new vscode.CompletionItem(
                variable,
                vscode.CompletionItemKind.Property
            )
            completionItem.range = range

            return completionItem
        })

        return suggestions
    }

    getCompletionContext(
        completionNode: Node
    ): 'input' | 'output' | 'parameter' | null {
        const nodePath = getNodePath(completionNode)

        console.log('Node path:', nodePath)

        if (nodePath.length === 2 && nodePath[0] === 'parameters') {
            return 'parameter'
        } else if (nodePath.length === 2 && nodePath[0] === 'connections') {
            return 'output'
        } else if (
            nodePath.length === 3 &&
            nodePath[0] === 'connections' &&
            typeof nodePath[2] === 'number'
        ) {
            return 'input'
        }
        return null
    }
}

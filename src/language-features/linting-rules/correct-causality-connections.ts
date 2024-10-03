import { getNodePath, Node } from 'jsonc-parser'
import * as vscode from 'vscode'
import { IRuleContext, LintRule } from '../language-features.types'
import { getStringContentRange } from '../utils'
import { FMUModel } from '../../fmu'

type Causality = 'input' | 'output'

export const correctCausalityConnectionsRule: LintRule = {
    onProperty: async (node, context) => {
        const nodePath = getNodePath(node)
        if (
            !(nodePath.length === 1 && nodePath[0] === 'connections') ||
            !node.children
        ) {
            return
        }

        // Verify connection output and input
        const possibleOutput = node.children[0]
        const possibleInputs = node.children[1].children ?? []
        await Promise.allSettled([
            verifyInputOrOutput(possibleOutput, context, 'output'),
            ...possibleInputs.map((possibleInput) =>
                verifyInputOrOutput(possibleInput, context, 'input')
            ),
        ])
    },
}

async function verifyInputOrOutput(
    possibleIO: Node,
    context: IRuleContext,
    causality: Causality
): Promise<void> {
    if (!possibleIO || typeof possibleIO.value !== 'string') {
        return
    }

    const fmuWithInstancePattern = /^(\{\w+\})\.(\w+)\.(\w+)$/
    const fmuMatch = possibleIO.value.match(fmuWithInstancePattern)

    if (!fmuMatch) {
        return
    }

    const fmuIdentifier = fmuMatch[1]
    const variableIdentifier = fmuMatch[3]

    const fmuModel = await context.cosimConfig.getFMUModel(fmuIdentifier)

    if (!fmuModel) {
        return
    }

    let fmuIOs: FMUModel['inputs'] | FMUModel['outputs']

    if (causality === 'input') {
        fmuIOs = fmuModel.inputs
    } else {
        fmuIOs = fmuModel.outputs
    }

    if (!fmuIOs.map((o) => o.name).includes(variableIdentifier)) {
        const range = getStringContentRange(
            context.cosimConfig.getDocument(),
            possibleIO
        )
        context.report(
            range,
            `Expected ${causality}, but the identifier '${variableIdentifier}' does not refer to an ${causality}.`,
            vscode.DiagnosticSeverity.Error
        )
    }
}

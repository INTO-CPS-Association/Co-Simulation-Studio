import { FMUModel, FMUSource } from 'fmu'
import { createTextDocument } from 'jest-mock-vscode'
import * as vscode from 'vscode'

export const dummyModelDescriptionMinimal = `
            <fmiModelDescription>
            <ModelVariables>
                <ScalarVariable name="fk" causality="input">
                </ScalarVariable>
                <ScalarVariable name="x1" causality="output">
                </ScalarVariable>
                <ScalarVariable name="v1" causality="output">
                </ScalarVariable>
                <ScalarVariable name="c1" causality="parameter">
                </ScalarVariable>
            </ModelVariables>
            </fmiModelDescription>
        `

export const dummyModelMinimal: FMUModel = {
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

export const workspaceUri = vscode.Uri.file('/data')
export const workspaceFolder: vscode.WorkspaceFolder = {
    uri: workspaceUri,
    name: 'data',
    index: 0,
}

const dummyCosimConfig = `
{
    "fmus": {
        "{fmu1}": "${vscode.Uri.joinPath(workspaceUri, 'fmu1.fmu').path}",
        "{fmu2}": "${vscode.Uri.joinPath(workspaceUri, 'fmu2.fmu').path}"
    },
    "connections": {
        "{msd1}.msd1i.x1": ["{msd2}.msd2i.x1"],
        "{msd1}.msd1i.v1": ["{msd2}.msd2i.v1"],
    },
}
`

export const singleStringDocument = createTextDocument(
    vscode.Uri.joinPath(workspaceUri, 'custom_cosim.json'),
    '"{fmu1}"',
    'json'
)
export const withoutStringDocument = createTextDocument(
    vscode.Uri.joinPath(workspaceUri, 'custom_cosim.json'),
    '[1, 2, 3, 4]',
    'json'
)
export const dummyConfigDocument = createTextDocument(
    vscode.Uri.joinPath(workspaceUri, 'custom_cosim.json'),
    dummyCosimConfig,
    'json'
)

export const fmuModel1: FMUModel = {
    inputs: [
        {
            name: 'vi1',
        },
    ],
    outputs: [
        {
            name: 'vo1',
        },
    ],
    parameters: [
        {
            name: 'vp1',
        },
    ],
}

export const fmuSource1: FMUSource = {
    identifier: '{fmu1}',
    path: vscode.Uri.joinPath(workspaceUri, 'fmu1.fmu').path,
}

export const fmuModel2: FMUModel = {
    inputs: [
        {
            name: 'vi2',
        },
    ],
    outputs: [
        {
            name: 'vo2',
        },
    ],
    parameters: [
        {
            name: 'vp2',
        },
    ],
}

export const fmuSource2: FMUSource = {
    identifier: '{fmu2}',
    path: vscode.Uri.joinPath(workspaceUri, 'fmu2.fmu').path,
}

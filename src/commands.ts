import * as vscode from 'vscode'
import { isSimulationConfiguration, resolveSimulationConfig } from './utils'
import fs from 'node:fs/promises'
import { getLogger } from './logging'
import { runSimulationWithConfig } from './maestro'

const extensionLogger = getLogger()

export const commandHandlers = {
    'cosimstudio.runSimulation': handleRunSimulation,
}

export function registerCommands(): vscode.Disposable[] {
    const registeredHandlers = Object.entries(commandHandlers).map(
        ([cmd, fn]) => registerCommand(cmd, fn)
    )

    return registeredHandlers
}

function registerCommand(
    cmd: string,
    fn: (...args: any[]) => unknown
): vscode.Disposable {
    return vscode.commands.registerCommand(cmd, fn)
}

async function handleRunSimulation(uri: vscode.Uri) {
    if (!uri) {
        return
    }

    const wsFolder = vscode.workspace.getWorkspaceFolder(uri)

    if (!wsFolder) {
        return
    }

    const configUri = uri

    if (!configUri) {
        return
    }

    const config = JSON.parse((await fs.readFile(configUri.fsPath)).toString())

    if (!isSimulationConfiguration(config)) {
        return
    }

    const resolvedConfig = resolveSimulationConfig(config, wsFolder)

    vscode.window.withProgress(
        {
            cancellable: false,
            location: vscode.ProgressLocation.Notification,
            title: 'Running simulation',
        },
        async () => runSimulationAndShowResults(resolvedConfig)
    )
}

async function runSimulationAndShowResults(config: unknown) {
    extensionLogger.info(
        `Running simulation with configuration:\n${JSON.stringify(
            config,
            null,
            2
        )}`
    )
    try {
        const results = await runSimulationWithConfig(config, {
            startTime: 0,
            endTime: 10,
        })

        if (results) {
            const td = await vscode.workspace.openTextDocument({
                content: results,
            })
            await vscode.window.showTextDocument(td)
        }
    } catch (error) {
        extensionLogger.error(`Simulation failed: ${error}`)
        vscode.window.showErrorMessage(`Simulation failed. ${error}`)
    }
}

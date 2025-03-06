import * as vscode from 'vscode'
import {
    isSimulationConfiguration,
    resolveSimulationConfig,
    SimulationConfiguration,
} from './utils'
import fs from 'node:fs/promises'
import { getLogger, getOutputChannelFromLogger } from './logging'
import { MaestroClient } from './maestro'
import { ConfigurationManager } from 'configuration'

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
    const outputChannel = getOutputChannelFromLogger(extensionLogger)

    if (outputChannel) {
        outputChannel.show()
    }

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
        async () => runSimulationAndShowResults(resolvedConfig, wsFolder)
    )
}

function generateTimestamp(): string {
    const now = new Date()
    const pad = (num: number): string => num.toString().padStart(2, '0')
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
        now.getDate()
    )}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`
}

async function runSimulationAndShowResults(
    config: SimulationConfiguration,
    wsFolder: vscode.WorkspaceFolder
) {
    extensionLogger.info(
        `Running simulation with configuration:\n${JSON.stringify(
            config,
            null,
            2
        )}`
    )

    const configManager = new ConfigurationManager(wsFolder)
    const cosimConfig = await configManager.getConfig()
    configManager.dispose()
    const maestroClient = new MaestroClient(
        cosimConfig.maestro.host,
        cosimConfig.maestro.port
    )

    let result
    try {
        result = await maestroClient.runSimulationWithConfig(config, {
            startTime: config?.startTime ?? 0,
            endTime: config?.endTime ?? 0,
        })

        if (result?.data) {
            const resultsDirUri = vscode.Uri.joinPath(wsFolder.uri, 'results')
            const resultFileUri = vscode.Uri.joinPath(
                resultsDirUri,
                `${generateTimestamp()}.csv`
            )

            await vscode.workspace.fs.createDirectory(resultsDirUri)
            await vscode.workspace.fs.writeFile(
                resultFileUri,
                Buffer.from(result.data)
            )
            const td = await vscode.workspace.openTextDocument(resultFileUri)
            await vscode.window.showTextDocument(td)
        } else {
            extensionLogger.info('No data returned from simulation.')
            throw new Error('Simulation failed.')
        }
    } catch (error) {
        extensionLogger.error(`Simulation failed.`)
    } finally {
        if (result?.sessionId) {
            const status = await maestroClient.getSessionStatus(
                result.sessionId
            )
            extensionLogger.debug(
                `Session status:\n${JSON.stringify(status, null, 2)}`
            )
        }
    }
}

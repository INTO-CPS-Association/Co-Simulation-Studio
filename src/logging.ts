/* Custom Winston Transport */
import Transport, { TransportStreamOptions } from 'winston-transport'
import vscode, { LogLevel } from 'vscode'
import { Logger, createLogger } from 'winston'

interface TransportOptions extends TransportStreamOptions {
    name: string
    window: typeof vscode.window
}

interface LogInfo {
    message: string
    level: OutputChannelFunction
}

type OutputChannelFunction =
    | 'debug'
    | 'info'
    | 'warn'
    | 'error'
    | 'trace'
    | 'appendLine'

class VSCTransport extends Transport {
    public name: string
    public outputChannel: vscode.LogOutputChannel

    constructor(options: TransportOptions) {
        super(options)

        this.name = options.name || this.constructor.name
        this.outputChannel = options.window.createOutputChannel(this.name, {
            log: true,
        })
        this.outputChannel.clear()
        this.outputChannel.show()
    }

    levelToVSCMethod(level: OutputChannelFunction): OutputChannelFunction {
        if (['debug', 'info', 'warn', 'error', 'trace'].includes(level))
            return level

        return 'appendLine'
    }

    log(info: LogInfo, callback: CallableFunction) {
        setImmediate(() => this.emit('logged', info))
        const message = info['message']
        const vscMethod = this.levelToVSCMethod(info['level'])

        this.outputChannel[vscMethod](message)

        callback()
    }
}

function vsCodeLogLevelToString(logLevel: LogLevel): string {
    switch (logLevel) {
        case 0:
            return 'off'
        case 1:
            return 'trace'
        case 2:
            return 'debug'
        case 3:
            return 'info'
        case 4:
            return 'warning'
        case 5:
            return 'error'
        default:
            return 'unknown'
    }
}

let logger: Logger

export function getLogger(): Logger {
    if (logger) {
        return logger
    }

    const transport = new VSCTransport({
        window: vscode.window,
        name: 'Cosimulation Studio',
    })

    logger = createLogger({
        level: vsCodeLogLevelToString(vscode.env.logLevel),
        transports: [transport],
    })

    logger.log('info', `Log level: ${LogLevel[vscode.env.logLevel]}.`)

    vscode.env.onDidChangeLogLevel((newLevel) => {
        logger.configure({
            level: vsCodeLogLevelToString(newLevel),
            transports: [transport],
        })
        logger.log('info', `Log level: ${LogLevel[newLevel]}.`)
    })

    return logger
}

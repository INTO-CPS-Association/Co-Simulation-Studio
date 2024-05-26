/* Custom Winston Transport */
import Transport, { TransportStreamOptions } from "winston-transport";
import vscode, { LogLevel } from "vscode";
import { createLogger } from "winston";

interface TransportOptions extends TransportStreamOptions {
    name: string;
    window: typeof vscode.window;
}

interface LogInfo {
    message: string;
    level: OutputChannelFunction;
}

type OutputChannelFunction =
    | "debug"
    | "info"
    | "warn"
    | "error"
    | "trace"
    | "appendLine";

class VSCTransport extends Transport {
    public name: string;
    public outputChannel: vscode.LogOutputChannel;

    constructor(options: TransportOptions) {
        super(options);

        this.name = options.name || this.constructor.name;
        this.outputChannel = options.window.createOutputChannel(this.name, {
            log: true,
        });
        this.outputChannel.clear();
        this.outputChannel.show();
    }

    levelToVSCMethod(level: OutputChannelFunction): OutputChannelFunction {
        if (["debug", "info", "warn", "error", "trace"].includes(level))
            return level;

        return "appendLine";
    }

    log(info: LogInfo, callback: CallableFunction) {
        setImmediate(() => this.emit("logged", info));
        const message = info["message"];
        const vscMethod = this.levelToVSCMethod(info["level"]);

        this.outputChannel[vscMethod](message);

        callback();
    }
}

const transport = new VSCTransport({
    window: vscode.window,
    name: "Cosimulation Studio",
});


// TODO: VS Code Log Levels
export const extLogger = createLogger({
    level: "debug",
    transports: [transport],
});

extLogger.log("info", `Log level: ${LogLevel[vscode.env.logLevel]}.`);

vscode.env.onDidChangeLogLevel((newLevel) => {
    extLogger.log("info", `Log level: ${LogLevel[newLevel]}.`);
});

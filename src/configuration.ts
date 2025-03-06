import * as vscode from 'vscode'
import * as yaml from 'yaml'
import {
    CosimStudioConfigSchema,
    ExtensionConfiguration,
} from 'schemas/cosim-studio-config'

export class ConfigurationManager implements vscode.Disposable {
    private configUri: vscode.Uri
    private config: ExtensionConfiguration
    private disposables: vscode.Disposable[] = []
    private eventEmitter: vscode.EventEmitter<ExtensionConfiguration>
    private configLoaded: Promise<void>

    constructor(wsFolder: vscode.WorkspaceFolder) {
        this.configUri = vscode.Uri.joinPath(wsFolder.uri, 'cosim-studio.yaml')
        this.eventEmitter = new vscode.EventEmitter<ExtensionConfiguration>()
        this.config = CosimStudioConfigSchema.parse({})

        const watcher = vscode.workspace.createFileSystemWatcher(
            new vscode.RelativePattern(wsFolder, 'cosim-studio.yaml'),
            false,
            false,
            false
        )

        this.disposables.push(watcher, this.eventEmitter)

        watcher.onDidCreate(() => this.reloadConfig())
        watcher.onDidChange(() => this.reloadConfig())
        watcher.onDidDelete(() => this.reloadConfig(true))

        this.configLoaded = this.initialize()
    }

    dispose() {
        this.disposables.forEach((d) => d.dispose())
    }

    private async initialize() {
        await this.reloadConfig()
    }

    private async loadConfig(): Promise<ExtensionConfiguration> {
        try {
            const configBytes = await vscode.workspace.fs.readFile(
                this.configUri
            )
            const configContent = new TextDecoder().decode(configBytes)
            return CosimStudioConfigSchema.parse(yaml.parse(configContent))
        } catch {
            return CosimStudioConfigSchema.parse({})
        }
    }

    private async reloadConfig(reset: boolean = false) {
        this.config = reset
            ? CosimStudioConfigSchema.parse({})
            : await this.loadConfig()
        this.eventEmitter.fire(this.config)
    }

    public async getConfig(): Promise<ExtensionConfiguration> {
        await this.configLoaded
        return this.config
    }

    public onUpdateConfig(
        listener: (config: ExtensionConfiguration) => void
    ): vscode.Disposable {
        listener(this.config)
        return this.eventEmitter.event(listener)
    }
}

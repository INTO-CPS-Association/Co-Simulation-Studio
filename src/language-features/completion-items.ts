import * as vscode from "vscode";
import {
    parseTree,
    findNodeAtOffset,
    findNodeAtLocation,
    Node,
    getNodePath,
} from "jsonc-parser";
import { getFMUModelFromPath } from "../fmu";

const identifierPattern = /^\{\w+\}$/;

export interface FMUSource {
    identifier: string;
    path: string | undefined;
}

export class SimulationConfigCompletionItemProvider
    implements vscode.CompletionItemProvider
{
    async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ) {
        const fileContent = document.getText();
        const tree = parseTree(fileContent);

        if (!tree) {
            return;
        }

        const completionNode = findNodeAtOffset(
            tree,
            document.offsetAt(position)
        );

        if (!completionNode) {
            return;
        }

        let completionItems: vscode.CompletionItem[] = [];

        completionItems = completionItems.concat(
            this.getFMUIdentifierCompletionItems(
                tree,
                document,
                position,
                context
            )
        );

        completionItems = completionItems.concat(
            await this.getFMUVariableCompletionItems(
                tree,
                document,
                position,
                context
            )
        );

        return completionItems;
    }

    private getFMUIdentifierCompletionItems(
        tree: Node,
        document: vscode.TextDocument,
        position: vscode.Position,
        context: vscode.CompletionContext
    ): vscode.CompletionItem[] {
        const completionNode = findNodeAtOffset(
            tree,
            document.offsetAt(position)
        );

        if (
            !completionNode ||
            (!this.isNodeString(completionNode) &&
                context.triggerCharacter === "{") ||
            getNodePath(completionNode)[0] === "fmus"
        ) {
            return [];
        }

        let range = this.getReplaceRange(document, completionNode, position);

        // Inside string, we skip the first double quote to not match on it
        if (this.isNodeString(completionNode)) {
            range = new vscode.Range(range.start.translate(0, 1), range.end);
        }

        const validFMUSources = this.getAllFMUIdentifiers(tree);
        const fmuCompletionItems = validFMUSources.map((fmuSource) => {
            let completionText = `"${fmuSource.identifier}$0"`;
            if (this.isNodeString(completionNode)) {
                completionText = completionText.substring(1);
            }

            const fmuItem = new vscode.CompletionItem(
                fmuSource.identifier,
                vscode.CompletionItemKind.Variable
            );

            fmuItem.range = range;

            fmuItem.insertText = new vscode.SnippetString(completionText);

            return fmuItem;
        });

        return fmuCompletionItems;
    }

    private async getFMUVariableCompletionItems(
        tree: Node,
        document: vscode.TextDocument,
        position: vscode.Position,
        _context: vscode.CompletionContext
    ): Promise<vscode.CompletionItem[]> {
        // Look for valid variables/instances
        const completionNode = findNodeAtOffset(
            tree,
            document.offsetAt(position)
        );

        if (!completionNode || !this.isNodeString(completionNode)) {
            return [];
        }

        const validVariables = await this.getAllVariables(
            document,
            tree,
            completionNode.value ?? ""
        );

        const range = document.getWordRangeAtPosition(position, /(?<=\.)\w+/);

        const suggestions =  validVariables.map((variable) => {
            const completionItem = new vscode.CompletionItem(
                variable,
                vscode.CompletionItemKind.Property
            );
            completionItem.range = range;

            return completionItem;
        });

        return suggestions;
    }
    private getReplaceRange(
        document: vscode.TextDocument,
        completionNode: Node,
        position: vscode.Position
    ) {
        if (this.isNodeString(completionNode)) {
            const range = new vscode.Range(
                document.positionAt(completionNode.offset),
                document.positionAt(
                    completionNode.offset + completionNode.length
                )
            );
            if (
                range.start.isBeforeOrEqual(position) &&
                range.end.isAfterOrEqual(position)
            ) {
                return range;
            }
        }

        return (
            document.getWordRangeAtPosition(position) ??
            new vscode.Range(position, position)
        );
    }

    private getAllFMUIdentifiers(configTree: Node): FMUSource[] {
        const fmusNode = findNodeAtLocation(configTree, ["fmus"]);

        if (!fmusNode || !fmusNode.children || fmusNode.type !== "object") {
            return [];
        }

        const fmuSources: FMUSource[] = [];

        for (const property of fmusNode.children) {
            if (!property.children) {
                continue;
            }

            const possibleIdentifier = property.children[0].value;
            const possiblePath = property.children[1].value;
            if (
                typeof possibleIdentifier === "string" &&
                identifierPattern.test(possibleIdentifier)
            ) {
                fmuSources.push({
                    identifier: possibleIdentifier,
                    path:
                        typeof possiblePath === "string"
                            ? possiblePath
                            : undefined,
                });
            }
        }

        return fmuSources;
    }

    private async getAllVariables(
        document: vscode.TextDocument,
        configTree: Node,
        text: string
    ) {
        const fmuWithInstancePattern = /^(\{\w+\})\.\w+\.\w*$/;
        const fmuMatch = text.match(fmuWithInstancePattern);

        if (!fmuMatch) {
            return [];
        }

        const fmuIdentifier = fmuMatch[1];
        const fmuSources = this.getAllFMUIdentifiers(configTree);

        const matchingSource = fmuSources.find(
            (source) => source.identifier === fmuIdentifier
        );

        if (!matchingSource || !matchingSource.path) {
            return [];
        }

        const wsFolder = vscode.workspace.getWorkspaceFolder(document.uri);

        if (!wsFolder) {
            return [];
        }

        const model = await getFMUModelFromPath(wsFolder, matchingSource.path);

        if (!model) {
            return [];
        }

        return [
            ...model.inputs.map((variable) => variable.name),
            ...model.outputs.map((variable) => variable.name),
        ];
    }

    private isNodeString(node: Node) {
        return node.type === "string";
    }
}

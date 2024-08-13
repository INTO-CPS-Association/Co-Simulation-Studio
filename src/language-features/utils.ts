import {
    Node,
    findNodeAtLocation,
    findNodeAtOffset,
    parseTree,
} from "jsonc-parser";
import {
    FMUModel,
    FMUModelMap,
    FMUSource,
    FMUSourceMap,
    getFMUModelFromPath,
    isValidFMUIdentifier,
} from "../fmu";
import vscode, { Position, TextDocument } from "vscode";

export function getFMUIdentifierFromConnectionString(
    connectionString: string
): string | undefined {
    const fmuWithInstancePattern = /^(\{\w+\})\.\w+\.\w*$/;
    const fmuMatch = connectionString.match(fmuWithInstancePattern);

    if (!fmuMatch) {
        return;
    }

    const fmuIdentifier = fmuMatch[1];

    return fmuIdentifier;
}

export function getStringContentRange(
    document: vscode.TextDocument,
    stringNode: Node
) {
    const endPosition = document.positionAt(
        stringNode.offset + stringNode.length
    );

    if (isNodeString(stringNode)) {
        // Inside string, exclude double quotes to not match/replace them.
        const range = new vscode.Range(
            document.positionAt(stringNode.offset + 1),
            endPosition.translate(0, -1)
        );

        return range;
    }

    // If the node is outside of a string, fallback to inserting at end of node without replacement.
    return new vscode.Range(endPosition, endPosition);
}

export function isNodeString(node: Node) {
    return node.type === "string";
}

export class CosimulationConfiguration {
    private rootNode: Node;
    private document: TextDocument;
    private fmuSources: FMUSourceMap | null = null;
    private fmuModels: FMUModelMap | null = null;

    constructor(doc: TextDocument) {
        const tree = parseTree(doc.getText());

        if (!tree) {
            throw new Error("Failed to parse document.");
        }

        this.rootNode = tree;
        this.document = doc;
    }

    getTree() {
        return this.rootNode;
    }

    getDocument() {
        return this.document;
    }

    getNodeAtPosition(pos: Position) {
        return findNodeAtOffset(this.rootNode, this.document.offsetAt(pos));
    }

    protected getSingleFMUSource(
        fmuProperty: Node
    ): [string, FMUSource] | undefined {
        if (!fmuProperty.children) {
            return;
        }

        const possibleIdentifier = fmuProperty.children[0].value;
        const possiblePath = fmuProperty.children[1].value;
        if (
            typeof possibleIdentifier === "string" &&
            isValidFMUIdentifier(possibleIdentifier)
        ) {
            const fmuSource = {
                identifier: possibleIdentifier,
                path:
                    typeof possiblePath === "string" ? possiblePath : undefined,
            };
            return [possibleIdentifier, fmuSource];
        }
        return;
    }

    getAllFMUSources(): FMUSourceMap {
        if (this.fmuSources) {
            return this.fmuSources;
        }

        const fmusNode = findNodeAtLocation(this.rootNode, ["fmus"]);

        if (!fmusNode || !fmusNode.children || fmusNode.type !== "object") {
            return new Map();
        }

        const fmuSources: FMUSourceMap = new Map();

        for (const property of fmusNode.children) {
            const fmuSource = this.getSingleFMUSource(property);

            if (!fmuSource) {
                continue;
            }

            fmuSources.set(fmuSource[0], fmuSource[1]);
        }

        this.fmuSources = fmuSources;
        return fmuSources;
    }

    getAllFMUSourcesAsArray(): Array<FMUSource> {
        const fmuSourceMap = this.getAllFMUSources();

        return Array.from(fmuSourceMap.values());
    }

    async getAllFMUModels(): Promise<FMUModelMap> {
        if (this.fmuModels) {
            return this.fmuModels;
        }

        const fmuSourceMap = this.getAllFMUSources();
        const resolvedFMUModels = new Map();

        for (const [ident, source] of fmuSourceMap) {
            const wsFolder = this.getWorkspaceFolderFromDocument(this.document);
            if (source.path == undefined || !wsFolder) {
                continue;
            }

            const fmuModel = await getFMUModelFromPath(wsFolder, source.path);

            resolvedFMUModels.set(ident, fmuModel);
        }

        this.fmuModels = resolvedFMUModels;
        return resolvedFMUModels;
    }

    async getFMUModel(fmuIdentifier: string): Promise<FMUModel | undefined> {
        const fmuModelMap = await this.getAllFMUModels();

        return fmuModelMap.get(fmuIdentifier);
    }

    getWorkspaceFolderFromDocument(document: TextDocument) {
        const wsFolder = vscode.workspace.getWorkspaceFolder(document.uri);

        return wsFolder;
    }

    getWorkspaceFolder() {
        return this.getWorkspaceFolderFromDocument(this.document);
    }

    async getAllVariablesFromIdentifier(fmuIdentifer: string) {
        const fmuModels = await this.getAllFMUModels();
        const model = fmuModels.get(fmuIdentifer);

        if (!model) {
            return [];
        }

        return [
            ...model.inputs.map((variable) => variable.name),
            ...model.outputs.map((variable) => variable.name),
        ];
    }
}

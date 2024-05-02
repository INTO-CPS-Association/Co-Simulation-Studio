import * as vscode from "vscode";
import { parseTree, findNodeAtLocation } from "jsonc-parser";

const tokenTypes = ["namespace"];
const tokenModifiers = ["readonly"];
export const legend = new vscode.SemanticTokensLegend(tokenTypes, tokenModifiers);


export class SimulationConfigSemanticTokensProvider implements vscode.DocumentSemanticTokensProvider {
    provideDocumentSemanticTokens(document: vscode.TextDocument): vscode.ProviderResult<vscode.SemanticTokens> {
        const fileContent = document.getText();
        const tree = parseTree(fileContent);

        const tokensBuilder = new vscode.SemanticTokensBuilder(legend);
        if (tree) {
            const node = findNodeAtLocation(tree, ["fmus"]);

            if (node) {
                node.children?.forEach((prop) => {
                    const firstChild = prop.children?.[0];
                    if (firstChild) {
                        tokensBuilder.push(new vscode.Range(document.positionAt(firstChild.offset + 1), document.positionAt(firstChild.offset + firstChild.length - 1)), "namespace");
                    }
                });
            }
        }

        return tokensBuilder.build();
        
    }
}
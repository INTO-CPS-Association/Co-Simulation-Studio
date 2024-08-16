import { Node, parseTree } from "jsonc-parser";
import {
    CosimulationConfiguration,
    getFMUIdentifierFromConnectionString,
    getStringContentRange,
    isNodeString,
    visitTreeUsingRules,
} from "../../src/language-features/utils";
import { createTextDocument } from "jest-mock-vscode";
import * as vscode from "vscode";
import { FMUModel, FMUModelMap, FMUSource, FMUSourceMap } from "../../src/fmu";
import { RuleContext, RuleRegistry } from "../../src/language-features/linting";

const workspaceUri = vscode.Uri.file("/data");
const workspaceFolder: vscode.WorkspaceFolder = {
    uri: workspaceUri,
    name: "data",
    index: 0,
};

const dummyCosimConfig = `
{
    "fmus": {
        "{fmu1}": "${vscode.Uri.joinPath(workspaceUri, "fmu1.fmu").path}",
        "{fmu2}": "${vscode.Uri.joinPath(workspaceUri, "fmu2.fmu").path}"
    },
    "connections": {
        "{msd1}.msd1i.x1": ["{msd2}.msd2i.x1"],
        "{msd1}.msd1i.v1": ["{msd2}.msd2i.v1"],
    },
}
`;

const singleStringDocument = createTextDocument(
    vscode.Uri.joinPath(workspaceUri, "custom_cosim.json"),
    '"{fmu1}"',
    "json"
);
const withoutStringDocument = createTextDocument(
    vscode.Uri.joinPath(workspaceUri, "custom_cosim.json"),
    "[1, 2, 3, 4]",
    "json"
);
const dummyConfigDocument = createTextDocument(
    vscode.Uri.joinPath(workspaceUri, "custom_cosim.json"),
    dummyCosimConfig,
    "json"
);

const fmuModel1: FMUModel = {
    inputs: [
        {
            name: "vi1",
        },
    ],
    outputs: [
        {
            name: "vo1",
        },
    ],
};

const fmuSource1: FMUSource = {
    identifier: "{fmu1}",
    path: vscode.Uri.joinPath(workspaceUri, "fmu1.fmu").path
}

const fmuModel2: FMUModel = {
    inputs: [
        {
            name: "vi2",
        },
    ],
    outputs: [
        {
            name: "vo2",
        },
    ],
};

const fmuSource2: FMUSource = {
    identifier: "{fmu2}",
    path: vscode.Uri.joinPath(workspaceUri, "fmu2.fmu").path
}

const fmuSources: FMUSourceMap = new Map([
    ["{fmu1}", fmuSource1],
    ["{fmu2}", fmuSource2]
])

const fmuModelMap: FMUModelMap = new Map([
    ["{fmu1}", fmuModel1],
    ["{fmu2}", fmuModel2]
]);

const mockUri = vscode.Uri.parse("path/to/file");
const mockDocument1 = createTextDocument(mockUri, "{}", "json", 1);
const fmuSourcesArray: FMUSource[] = [fmuSource1, fmuSource2];

jest.mock("../../src/fmu.ts", () => ({
    ...jest.requireActual("../../src/fmu.ts"),
    "getFMUModelFromPath": jest.fn((_wsFolder, path: string) => {
        if (path === vscode.Uri.joinPath(workspaceUri, "fmu1.fmu").path) {
            return fmuModel1;
        }
        else if (path === vscode.Uri.joinPath(workspaceUri, "fmu2.fmu").path) {
            return fmuModel2;
        }

        return;
    })
}))

const mockRootNode: Node = {
    type: "array",
    offset: 0,
    length: 0,
    children: [
        {
            type: "string",
            offset: 0,
            length: 0,
        },
        {
            type: "string",
            offset: 0,
            length: 0,
        },
    ],
};


describe("Language feature utilities", () => {
    let cosimConfig: CosimulationConfiguration;

    beforeEach(() => {
        cosimConfig = new CosimulationConfiguration(dummyConfigDocument);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getFMUIdentifierFromConnectionString", () => {
        it("correctly extracts identifier from valid conncetion string with all segments", () => {
            const connectionString = "{fmu1}.instance1.var1";

            const identifier =
                getFMUIdentifierFromConnectionString(connectionString);

            expect(identifier).toEqual("{fmu1}");
        });

        it("correctly extracts identifier from valid conncetion string with empty variable segment", () => {
            const connectionString = "{fmu1}.instance1.";

            const identifier =
                getFMUIdentifierFromConnectionString(connectionString);

            expect(identifier).toEqual("{fmu1}");
        });

        it("returns undefined when the variable segment is missing entirely", () => {
            const connectionString = "{fmu1}.instance1";

            const identifier =
                getFMUIdentifierFromConnectionString(connectionString);

            expect(identifier).toBeUndefined();
        });

        it("returns undefined for the empty string", () => {
            const connectionString = "";

            const identifier =
                getFMUIdentifierFromConnectionString(connectionString);

            expect(identifier).toBeUndefined();
        });
    });

    describe("getStringContentRange", () => {
        it("should return correct range for simple string", () => {
            const expectedRange = new vscode.Range(0, 1, 0, 7);
            const node = parseTree(singleStringDocument.getText());

            if (!node) {
                fail("node should be defined.");
            }

            const actualRange = getStringContentRange(
                singleStringDocument,
                node
            );
            expect(actualRange).toEqual(expectedRange);
        });

        it("should return range at end of node when node is not of type string", () => {
            const documentText = withoutStringDocument.getText();
            const expectedRange = new vscode.Range(
                0,
                documentText.length,
                0,
                documentText.length
            );
            const node = parseTree(documentText);

            if (!node) {
                fail("node should be defined.");
            }

            const actualRange = getStringContentRange(
                withoutStringDocument,
                node
            );
            expect(actualRange).toEqual(expectedRange);
        });
    });

    describe("isNodeString", () => {
        it("returns true for node of type string", () => {
            const node = constructNodeFromString("dummy_node");

            const isString = isNodeString(node);

            expect(isString).toBe(true);
        });

        it("returns false for node of type not equal to string", () => {
            const node: Node = {
                ...constructNodeFromString("dummy_node"),
                type: "object",
            };

            const isString = isNodeString(node);

            expect(isString).toBe(false);
        });
    });

    describe("CosimulationConfiguration", () => {
        describe("getFMUModel", () => {
            it("should get the correct model", async () => {
                const getAllFMUModelsSpy = jest.spyOn(
                    cosimConfig,
                    "getAllFMUModels"
                );
                getAllFMUModelsSpy.mockResolvedValue(fmuModelMap);

                const fmuModel = await cosimConfig.getFMUModel("{fmu1}");

                expect(fmuModel).toEqual(fmuModel1);
            });
        });

        describe("getWorkspaceFolderFromDocument", () => {
            it("should return the correct workspace", () => {
                const workspacesSpy = jest.spyOn(
                    vscode.workspace,
                    "workspaceFolders",
                    "get"
                );
                workspacesSpy.mockReturnValue([workspaceFolder]);

                const wsFolder =
                    cosimConfig.getWorkspaceFolderFromDocument(
                        dummyConfigDocument
                    );

                expect(wsFolder).toEqual(workspaceFolder);
            });
        });

        describe("getWorkspaceFolder", () => {
            it("should return the correct workspace", () => {
                const workspacesSpy = jest.spyOn(
                    vscode.workspace,
                    "workspaceFolders",
                    "get"
                );
                workspacesSpy.mockReturnValue([workspaceFolder]);

                const wsFolder = cosimConfig.getWorkspaceFolder();

                expect(wsFolder).toEqual(workspaceFolder);
            });
        });

        describe("getAllVariablesFromIdentifier", () => {
            it("should return all the correct variables", async () => {
                const getAllFMUModelsSpy = jest.spyOn(
                    cosimConfig,
                    "getAllFMUModels"
                );
                getAllFMUModelsSpy.mockResolvedValue(fmuModelMap);

                const variables =
                    await cosimConfig.getAllVariablesFromIdentifier("{fmu1}");

                expect(variables).toEqual(["vi1", "vo1"]);
            });

            it("should return no variables if the identifier is undefined", async () => {
                const fmuModelMap: FMUModelMap = new Map();

                const getAllFMUModelsSpy = jest.spyOn(
                    cosimConfig,
                    "getAllFMUModels"
                );
                getAllFMUModelsSpy.mockResolvedValue(fmuModelMap);

                const variables =
                    await cosimConfig.getAllVariablesFromIdentifier(
                        "{fmuNotDefined}"
                    );

                expect(variables).toEqual([]);
            });
        });

        describe("getAllFMUModels", () => {
            it("should return the correct models", async () => {
                const getAllFMUSourcesSpy = jest.spyOn(cosimConfig, "getAllFMUSources");
                getAllFMUSourcesSpy.mockReturnValue(fmuSources);

                const getWorkspaceFolderFromDocumentSpy = jest.spyOn(cosimConfig, "getWorkspaceFolderFromDocument");
                getWorkspaceFolderFromDocumentSpy.mockReturnValue(workspaceFolder);

                const fmuModels = await cosimConfig.getAllFMUModels();

                expect(fmuModels).toEqual(fmuModelMap);

                // When called the second time, it uses the cached values
                const fmuModels2 = await cosimConfig.getAllFMUModels();
                expect(fmuModels).toBe(fmuModels2);
            })
        });

        describe("getAllFMUSourcesAsArray", () => {
            it("should return the correct sources as array", async () => {
                const getAllFMUSourcesSpy = jest.spyOn(cosimConfig, "getAllFMUSources");
                getAllFMUSourcesSpy.mockReturnValue(fmuSources);

                const resultFMUSources = cosimConfig.getAllFMUSourcesAsArray();
                expect(resultFMUSources).toEqual(fmuSourcesArray);
            })
        });

        describe("getAllFMUSources", () => {
            it("should return the correct source map", async () => {
                const resultFMUSourceMap = cosimConfig.getAllFMUSources();
                expect(resultFMUSourceMap).toEqual(fmuSources);

                // When called the second time, it uses the cached values
                const resultFMUSourceMap2 = await cosimConfig.getAllFMUSources();
                expect(resultFMUSourceMap).toBe(resultFMUSourceMap2);
            })
        });
    });

    describe("visitTreeUsingRules", () => {
        let mockCosimConfig: CosimulationConfiguration;
        let mockRuleRegistry: RuleRegistry;

        beforeEach(() => {
            mockCosimConfig = new CosimulationConfiguration(mockDocument1);
            mockRuleRegistry = new Map();
        });

        test("visiting a tree with no rules should not throw", () => {
            const mockRootNode: Node = {
                type: "object",
                offset: 0,
                length: 0,
            };

            expect(() => {
                visitTreeUsingRules(
                    mockRootNode,
                    new RuleContext(mockCosimConfig),
                    mockRuleRegistry
                );
            }).not.toThrow();
        });

        test("visiting a tree with rules should call the handlers", async () => {
            const arrayHandler = jest.fn();
            const stringHandler = jest.fn();
            const propertyHandler = jest.fn();

            mockRuleRegistry.set("array", [arrayHandler]);
            mockRuleRegistry.set("string", [stringHandler]);
            mockRuleRegistry.set("property", [propertyHandler]);

            await visitTreeUsingRules(
                mockRootNode,
                new RuleContext(mockCosimConfig),
                mockRuleRegistry
            );

            expect(propertyHandler).toHaveBeenCalledTimes(0);
            expect(arrayHandler).toHaveBeenCalledTimes(1);
            expect(stringHandler).toHaveBeenCalledTimes(2);
        });

        test("visiting a tree with a rule that throws should still call the other handlers", async () => {
            const arrayHandler = jest.fn();
            const stringHandler = jest.fn();
            const propertyHandler = jest.fn();
            const faultyStringHandler = jest.fn().mockRejectedValue(false);

            mockRuleRegistry.set("array", [arrayHandler]);
            mockRuleRegistry.set("string", [
                stringHandler,
                faultyStringHandler,
            ]);
            mockRuleRegistry.set("property", [propertyHandler]);

            await visitTreeUsingRules(
                mockRootNode,
                new RuleContext(mockCosimConfig),
                mockRuleRegistry
            );

            expect(propertyHandler).toHaveBeenCalledTimes(0);
            expect(arrayHandler).toHaveBeenCalledTimes(1);
            expect(stringHandler).toHaveBeenCalledTimes(2);
        });
    });
});

function constructNodeFromString(text: string): Node {
    return {
        value: text,
        offset: 0,
        length: text.length,
        type: "string",
    };
}
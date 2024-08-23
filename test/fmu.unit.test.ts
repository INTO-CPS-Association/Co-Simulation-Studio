import {
    FMUModel,
    extractFMUModelFromPath,
    getFMUModelFromPath,
    modelCache,
    parseXMLModelDescription
} from "fmu";
import fs from "fs/promises";
import JSZip from "jszip";
import * as vscode from "vscode";

jest.mock("fs/promises");
jest.mock("jszip");

const workspaceUri = vscode.Uri.file("/data");
const workspaceFolder: vscode.WorkspaceFolder = {
    uri: workspaceUri,
    name: "data",
    index: 0,
};

const dummyModelDescription = `
            <fmiModelDescription>
            <ModelVariables>
                <ScalarVariable name="fk" causality="input">
                </ScalarVariable>
                <ScalarVariable name="x1" causality="output">
                </ScalarVariable>
                <ScalarVariable name="v1" causality="output">
                </ScalarVariable>
            </ModelVariables>
            </fmiModelDescription>
        `;

describe("FMU Parsing", () => {
    afterEach(() => {
        jest.clearAllMocks();
        modelCache.clear();
    });

    it("parses XML model description correctly", async () => {
        const result = parseXMLModelDescription(dummyModelDescription);

        expect(result).toEqual({
            inputs: [
                {
                    name: "fk",
                },
            ],
            outputs: [
                {
                    name: "x1",
                },
                {
                    name: "v1",
                },
            ],
        } satisfies FMUModel);
    });

    describe("extractFMUModelFromPath", () => {
        it("returns undefined when modelDescription.xml does not exist", async () => {
            (fs.readFile as jest.Mock).mockResolvedValue("file content");
            (JSZip.loadAsync as jest.Mock).mockResolvedValue({
                file: jest.fn(() => null),
            });

            const result = await extractFMUModelFromPath("file/path");

            expect(result).toBeUndefined();
        });

        it("returns undefined when fmu file does not exist", async () => {
            (fs.readFile as jest.Mock).mockRejectedValue(false);

            const result = await extractFMUModelFromPath("file/path");

            expect(result).toBeUndefined();
        });

        it("extracts the model from the zip correctly", async () => {
            (fs.readFile as jest.Mock).mockResolvedValue("zip content");
            (JSZip.loadAsync as jest.Mock).mockResolvedValue({
                file: jest.fn().mockImplementation((fileName) => {
                    if (fileName === "modelDescription.xml") {
                        return {
                            async: jest
                                .fn()
                                .mockResolvedValue(dummyModelDescription),
                        };
                    }

                    return null;
                }),
            });

            const result = await extractFMUModelFromPath("file/path");

            expect(result).toEqual({
                inputs: [
                    {
                        name: "fk",
                    },
                ],
                outputs: [
                    {
                        name: "x1",
                    },
                    {
                        name: "v1",
                    },
                ],
            } satisfies FMUModel);
        });
    });
    describe("getFMUModelFromPath", () => {
        it("returns undefined when modelDescription.xml does not exist", async () => {
            (fs.readFile as jest.Mock).mockResolvedValue("file content");
            (JSZip.loadAsync as jest.Mock).mockResolvedValue({
                file: jest.fn(() => null),
            });

            const result = await getFMUModelFromPath(workspaceFolder,"file/path");

            expect(result).toBeUndefined();
        });

        it("returns undefined when fmu file does not exist", async () => {
            (fs.readFile as jest.Mock).mockRejectedValue(false);

            const result = await getFMUModelFromPath(workspaceFolder,"file/path");

            expect(result).toBeUndefined();
        });

        it("returns the model during cache miss", async () => {
            (fs.readFile as jest.Mock).mockResolvedValue("zip content");
            (JSZip.loadAsync as jest.Mock).mockResolvedValue({
                file: jest.fn().mockImplementation((fileName) => {
                    if (fileName === "modelDescription.xml") {
                        return {
                            async: jest
                                .fn()
                                .mockResolvedValue(dummyModelDescription),
                        };
                    }

                    return null;
                }),
            });
            (fs.stat as jest.Mock).mockResolvedValue({
                ctimeMs: 0,
            });

            const result = await getFMUModelFromPath(workspaceFolder,"file/path");

            expect(result).toEqual({
                inputs: [
                    {
                        name: "fk",
                    },
                ],
                outputs: [
                    {
                        name: "x1",
                    },
                    {
                        name: "v1",
                    },
                ],
            } satisfies FMUModel);
            expect(fs.stat).toHaveBeenCalledWith("/data/file/path");
            expect(fs.readFile).toHaveBeenCalledWith("/data/file/path");
        });

        it("returns the model during cache hit", async () => {
            (fs.readFile as jest.Mock).mockResolvedValue("zip content");
            (JSZip.loadAsync as jest.Mock).mockResolvedValue({
                file: jest.fn().mockImplementation((fileName) => {
                    if (fileName === "modelDescription.xml") {
                        return {
                            async: jest
                                .fn()
                                .mockResolvedValue(dummyModelDescription),
                        };
                    }

                    return null;
                }),
            });
            (fs.stat as jest.Mock).mockResolvedValue({
                ctimeMs: 1,
            });

            const result = await getFMUModelFromPath(workspaceFolder, "file/path");

            expect(result).toEqual({
                inputs: [
                    {
                        name: "fk",
                    },
                ],
                outputs: [
                    {
                        name: "x1",
                    },
                    {
                        name: "v1",
                    },
                ],
            } satisfies FMUModel);

            const secondResult = await getFMUModelFromPath(workspaceFolder, "file/path");

            expect(secondResult).toBe(result);
        });

        it("returns the model during cache hit when the file has been modified", async () => {
            (fs.readFile as jest.Mock).mockResolvedValue("zip content");
            (JSZip.loadAsync as jest.Mock).mockResolvedValue({
                file: jest.fn().mockImplementation((fileName) => {
                    if (fileName === "modelDescription.xml") {
                        return {
                            async: jest
                                .fn()
                                .mockResolvedValue(dummyModelDescription),
                        };
                    }

                    return null;
                }),
            });
            (fs.stat as jest.Mock).mockResolvedValue({
                ctimeMs: 0,
            });

            const result = await getFMUModelFromPath(workspaceFolder, "file/path");

            expect(result).toEqual({
                inputs: [
                    {
                        name: "fk",
                    },
                ],
                outputs: [
                    {
                        name: "x1",
                    },
                    {
                        name: "v1",
                    },
                ],
            } satisfies FMUModel);

            (fs.stat as jest.Mock).mockResolvedValue({
                ctimeMs: 1,
            });

            const secondResult = await getFMUModelFromPath(workspaceFolder, "file/path");

            expect(secondResult).not.toBe(result);
            expect(secondResult).toEqual(result);
        });
    });
});

// import { Uri } from "vscode";
import JSZip from "jszip";
import {
    parseXMLModelDescription,
    FMUModel,
    extractFMUModelFromPath,
} from "../src/fmu";
import fs from "fs/promises";

jest.mock("fs/promises");
jest.mock("jszip");

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
});

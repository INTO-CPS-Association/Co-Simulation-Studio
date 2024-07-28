import { XMLParser } from "fast-xml-parser";
import * as fs from "fs/promises";
import JSZip from "jszip";
import * as vscode from "vscode";
import { resolveAbsolutePath } from "./utils";

interface ModelInput {
    name: string;
}

interface ModelOutput {
    name: string;
}

export interface FMUModel {
    inputs: ModelInput[];
    outputs: ModelOutput[];
}

interface CacheEntry {
    ctime: number;
    model: FMUModel;
}

type ModelCache = Map<string, CacheEntry>;

const modelCache: ModelCache = new Map();

export async function getFMUModelFromPath(
    wsFolder: vscode.WorkspaceFolder,
    path: string
): Promise<FMUModel | undefined> {
    const resolvedPath = resolveAbsolutePath(wsFolder, path);
    const cachedModel = modelCache.get(resolvedPath);
    const currentCtime = (await fs.stat(resolvedPath)).ctimeMs;

    if (cachedModel === undefined) {
        // Cache miss
        const modelDescriptionModel = await extractFMUModelFromPath(
            resolvedPath
        );

        if (!modelDescriptionModel) {
            return;
        }

        modelCache.set(resolvedPath, {
            model: modelDescriptionModel,
            ctime: currentCtime,
        });
        return modelDescriptionModel;
    }

    if (cachedModel.ctime === currentCtime) {
        return cachedModel.model;
    }

    const modelDescriptionModel = await extractFMUModelFromPath(resolvedPath);

    if (!modelDescriptionModel) {
        return;
    }

    modelCache.set(resolvedPath, {
        model: modelDescriptionModel,
        ctime: currentCtime,
    });
    return modelDescriptionModel;
}

export async function extractFMUModelFromPath(
    path: string
): Promise<FMUModel | undefined> {
    const zipBuffer = await fs.readFile(path);
    const zipFile = await JSZip.loadAsync(zipBuffer);

    const modelDescriptionObject = zipFile.file("modelDescription.xml");
    const modelDescriptionContents = await modelDescriptionObject?.async(
        "nodebuffer"
    );

    if (modelDescriptionContents) {
        return parseXMLModelDescription(modelDescriptionContents);
    }

    return undefined;
}

export function parseXMLModelDescription(source: string | Buffer): FMUModel {
    const parser = new XMLParser({
        ignoreAttributes: false,
    });
    const modelDescription = parser.parse(source);

    const inputs: ModelInput[] = [];
    const outputs: ModelOutput[] = [];

    const modelVariables =
        modelDescription["fmiModelDescription"]["ModelVariables"][
            "ScalarVariable"
        ];

    for (const mVar of modelVariables) {
        const varCausality = mVar["@_causality"];
        if (varCausality === "input") {
            inputs.push({
                name: mVar["@_name"],
            });
        } else if (varCausality === "output") {
            outputs.push({
                name: mVar["@_name"],
            });
        }
    }

    return {
        inputs,
        outputs,
    };
}

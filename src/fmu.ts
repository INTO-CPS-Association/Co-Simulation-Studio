import { XMLParser } from "fast-xml-parser";
import * as fs from "fs/promises";
import JSZip from "jszip";
import * as vscode from "vscode";
import { resolveFMUPath } from "./extension";

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

export async function getFMUModelFromPath(wsFolder: vscode.WorkspaceFolder, path: string): Promise<FMUModel | undefined> {
    const resolvedPath = resolveFMUPath(wsFolder, path);
    const cachedModel = modelCache.get(resolvedPath);

    if (cachedModel === undefined) {
        // Cache miss
        const modelDescriptionCacheEntry = await extractFMUModelFromPath(resolvedPath);

        if (!modelDescriptionCacheEntry) {
            return;
        }
        
        modelCache.set(resolvedPath, modelDescriptionCacheEntry);
        return modelDescriptionCacheEntry.model;
    }

    const currentCtime = (await fs.stat(resolvedPath)).ctimeMs;
    if (cachedModel.ctime === currentCtime) {
        return cachedModel.model;
    }

    const modelDescriptionCacheEntry = await extractFMUModelFromPath(resolvedPath);

    if (!modelDescriptionCacheEntry) {
        return;
    }
    
    modelCache.set(resolvedPath, modelDescriptionCacheEntry);
    return modelDescriptionCacheEntry.model;
}

async function extractFMUModelFromPath(path: string): Promise<CacheEntry | undefined> {
    const ctime = (await fs.stat(path)).ctimeMs;
    const zipBuffer = await fs.readFile(path);
    const zipFile = await JSZip.loadAsync(zipBuffer);

    const modelDescriptionObject = zipFile.file("modelDescription.xml");
    const modelDescriptionContents = await modelDescriptionObject?.async("nodebuffer");

    if (modelDescriptionContents) {
        return {
            ctime,
            model: parseXMLModelDescription(modelDescriptionContents)
        };
    }

    return undefined;
}

function parseXMLModelDescription(source: string | Buffer): FMUModel {
    const parser = new XMLParser({
        "ignoreAttributes": false
    });
    const modelDescription = parser.parse(source);

    const inputs: ModelInput[] = [];
    const outputs: ModelOutput[] = [];

    const modelVariables = modelDescription["fmiModelDescription"]["ModelVariables"]["ScalarVariable"];

    for (const mVar of modelVariables) {
        const varCausality = mVar["@_causality"];
        if (varCausality === "input") {
            inputs.push({
                "name": mVar["@_name"]
            });
        } else if (varCausality === "output") {
            outputs.push({
                "name": mVar["@_name"]
            });
        }
    }

    return {
        inputs,
        outputs
    };
}

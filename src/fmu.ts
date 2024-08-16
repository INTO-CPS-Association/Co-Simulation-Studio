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

export interface FMUSource {
    identifier: string;
    path: string | undefined;
}

export type FMUSourceMap = Map<string, FMUSource>;
export type FMUModelMap = Map<string, FMUModel>;

interface CacheEntry {
    ctime: number;
    model: FMUModel;
}

export const validFMUIdentifierPattern = /^\{[a-zA-Z0-9]+\}$/;

type ModelCache = Map<string, CacheEntry>;

export const modelCache: ModelCache = new Map();

export function isValidFMUIdentifier(identifier: string) {
    return validFMUIdentifierPattern.test(identifier);
}

export async function getFMUModelFromPath(
    wsFolder: vscode.WorkspaceFolder,
    path: string
): Promise<FMUModel | undefined> {
    const resolvedPath = resolveAbsolutePath(wsFolder, path);
    const cachedModel = modelCache.get(resolvedPath);
    let currentCtime: number;

    try {
        currentCtime = (await fs.stat(resolvedPath)).ctimeMs;
    } catch {
        return;
    }

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
    let zipFile: JSZip;
    try {
        const zipBuffer = await fs.readFile(path);
        zipFile = await JSZip.loadAsync(zipBuffer);
    } catch {
        return;
    }
    
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
        outputs
    };
}

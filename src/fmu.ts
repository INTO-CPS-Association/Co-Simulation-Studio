import { XMLParser } from 'fast-xml-parser'
import * as fs from 'fs/promises'
import JSZip from 'jszip'
import * as vscode from 'vscode'
import { assertIsError, resolveAbsolutePath } from './utils'
import { getLogger } from 'logging'

const logger = getLogger()

interface ModelInput {
    name: string
}

interface ModelOutput {
    name: string
}

export interface FMUModel {
    inputs: ModelInput[]
    outputs: ModelOutput[]
}

export interface FMUSource {
    identifier: string
    path: string | undefined
}

export type FMUSourceMap = Map<string, FMUSource>
export type FMUModelMap = Map<string, FMUModel>

interface CacheEntry {
    ctime: number
    model: FMUModel
}

export const validFMUIdentifierPattern = /^\{[a-zA-Z0-9]+\}$/

type ModelCache = Map<string, CacheEntry>

export const modelCache: ModelCache = new Map()

export function isValidFMUIdentifier(identifier: string): boolean {
    return validFMUIdentifierPattern.test(identifier)
}

export async function getFMUModelFromPath(
    wsFolder: vscode.WorkspaceFolder,
    path: string
): Promise<FMUModel> {
    const resolvedPath = resolveAbsolutePath(wsFolder, path)
    let fmuModel: FMUModel
    let currentCtime: number

    try {
        currentCtime = (await fs.stat(resolvedPath)).ctimeMs
    } catch {
        throw new Error(
            `No file found at ${resolvedPath} to pull FMU model from.`
        )
    }

    const cacheEntry = modelCache.get(resolvedPath)
    if (cacheEntry && cacheEntry.ctime === currentCtime) {
        // Cache hit
        return cacheEntry.model
    }

    // Cache miss or stale cache, try to extract model
    try {
        fmuModel = await extractFMUModelFromPath(resolvedPath)
    } catch (err) {
        assertIsError(err)
        const errMsg = `No FMU model found at '${resolvedPath}'. Failed with error: ${err.message}`
        logger.debug(errMsg)
        throw new Error(errMsg)
    }

    // Update cache
    modelCache.set(resolvedPath, {
        model: fmuModel,
        ctime: currentCtime,
    })

    return fmuModel
}

export async function extractFMUModelFromPath(path: string): Promise<FMUModel> {
    let zipFile: JSZip
    try {
        const zipBuffer = await fs.readFile(path)
        zipFile = await JSZip.loadAsync(zipBuffer)
    } catch (err) {
        throw new Error(
            `Failed to open file at '${path}' whgile trying to extract FMU model.`
        )
    }

    const modelDescriptionObject = zipFile.file('modelDescription.xml')
    const modelDescriptionContents =
        await modelDescriptionObject?.async('nodebuffer')

    if (modelDescriptionContents) {
        return parseXMLModelDescription(modelDescriptionContents)
    }

    throw new Error(`Failed to parse 'modelDescription.xml' in '${path}'.`)
}

export function parseXMLModelDescription(source: string | Buffer): FMUModel {
    const parser = new XMLParser({
        ignoreAttributes: false,
    })

    let modelDescription
    try {
        modelDescription = parser.parse(source)
    } catch {
        throw new Error('Failed to parse XML model description.')
    }

    const inputs: ModelInput[] = []
    const outputs: ModelOutput[] = []

    // TODO: update this code to use Zod schemas instead of optional chaining and nullish coalescing
    const modelVariables =
        modelDescription['fmiModelDescription']?.['ModelVariables']?.[
            'ScalarVariable'
        ] ?? []

    for (const mVar of modelVariables) {
        const varCausality = mVar['@_causality']
        if (varCausality === 'input') {
            inputs.push({
                name: mVar['@_name'],
            })
        } else if (varCausality === 'output') {
            outputs.push({
                name: mVar['@_name'],
            })
        }
    }

    return {
        inputs,
        outputs,
    }
}

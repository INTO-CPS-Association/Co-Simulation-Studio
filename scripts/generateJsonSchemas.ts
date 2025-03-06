import { zodToJsonSchema } from 'zod-to-json-schema'
import * as fs from 'fs'
import { resolve } from 'path'
import { CosimStudioConfigSchema } from '../src/schemas/cosim-studio-config'
const schemasDir = './resources/schemas'

if (!fs.existsSync(schemasDir)) {
    fs.mkdirSync(schemasDir, { recursive: true })
}

function writeSchemaToFile(schema: Zod.ZodType, path: fs.PathLike) {
    const jsonSchema = zodToJsonSchema(schema)
    const jsonSchemaText = JSON.stringify(jsonSchema)

    fs.writeFileSync(path, jsonSchemaText)
}

writeSchemaToFile(
    CosimStudioConfigSchema,
    resolve(schemasDir, 'cosimStudioConfigurationSchema.json')
)

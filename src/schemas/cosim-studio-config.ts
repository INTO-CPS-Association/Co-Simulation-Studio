import { z } from 'zod'

export const CosimStudioConfigSchema = z.object({
    maestro: z
        .object({
            host: z
                .string()
                .default('localhost')
                .describe(
                    'The hostname or IP address of the Maestro web service.'
                ),
            port: z
                .number()
                .gte(0)
                .lte(65535)
                .default(8082)
                .describe(
                    'The port number on which the Maestro web service is running (0-65535).'
                ),
        })
        .default({
            host: 'localhost',
            port: 8082,
        })
        .describe('Configuration for the Maestro web service.'),
})

export type ExtensionConfiguration = z.infer<typeof CosimStudioConfigSchema>

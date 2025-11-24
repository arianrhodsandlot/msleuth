import { createRoute, extendZodWithOpenApi, OpenAPIHono, z } from '@hono/zod-openapi'
import { createSelectSchema } from 'drizzle-zod'
import { getPlatformInfo } from './controllers/get-platform-info.ts'
import { identify } from './controllers/identify.ts'
import { query } from './controllers/query.ts'
import { launchboxGameTable, launchboxPlatformTable, libretroGameTable } from './database/schema.ts'

extendZodWithOpenApi(z)

const LaunchboxGameSchema = createSelectSchema(launchboxGameTable)
const LibretroGameSchema = createSelectSchema(libretroGameTable)
const LaunchboxPlatformSchema = createSelectSchema(launchboxPlatformTable)

const MetadataResponseSchema = z.array(
  z.object({
    launchbox: LaunchboxGameSchema.nullable().optional(),
    libretro: LibretroGameSchema.nullable().optional(),
  }),
)

export const apis = new OpenAPIHono()

  .openapi(
    createRoute({
      method: 'post',
      path: 'metadata/identify',
      request: {
        body: {
          content: {
            'application/json': {
              examples: {
                Contra: {
                  value: {
                    files: [{ name: 'Contra.zip' }],
                    platform: 'nes',
                  },
                },
                'Metal Slug': {
                  value: {
                    files: [{ name: 'mslug.zip' }],
                    platform: 'arcade',
                  },
                },
              },
              schema: z.object({
                files: z.array(z.object({ md5: z.string().optional(), name: z.string() })),
                platform: z.string(),
              }),
            },
          },
        },
      },
      responses: {
        200: {
          content: {
            'application/json': {
              schema: MetadataResponseSchema,
            },
          },
          description: 'Identify games',
        },
      },
    }),
    async (c) => {
      const { files, platform } = c.req.valid('json')
      const results = await identify(platform, files)
      return c.json(results)
    },
  )

  .openapi(
    createRoute({
      method: 'post',
      path: 'metadata/query',
      request: {
        body: {
          content: {
            'application/json': {
              examples: {
                'Super Mario Bros': {
                  value: {
                    conditions: [{ launchboxId: 140, libretroId: '23a02b3f92193510329426621b8a23fd94ad886e' }],
                  },
                },
              },
              schema: z.object({
                conditions: z.array(
                  z.object({
                    launchboxId: z.number().or(z.null()).optional(),
                    libretroId: z.string().or(z.null()).optional(),
                  }),
                ),
              }),
            },
          },
        },
      },
      responses: {
        200: {
          content: {
            'application/json': {
              schema: MetadataResponseSchema,
            },
          },
          description: 'Query games',
        },
      },
    }),
    async (c) => {
      const { conditions } = c.req.valid('json')
      const results = await query(conditions)
      return c.json(results)
    },
  )

  .openapi(
    createRoute({
      deprecated: true,
      method: 'get',
      path: 'platform/{name}',
      request: { params: z.object({ name: z.string().openapi({ examples: ['nes', 'snes', 'megadrive', 'arcade'] }) }) },
      responses: {
        200: {
          content: { 'application/json': { schema: LaunchboxPlatformSchema.optional() } },
          description: 'Get platform info',
        },
      },
    }),
    async (c) => {
      const { name } = c.req.valid('param')
      const result = await getPlatformInfo(name)
      return c.json(result)
    },
  )

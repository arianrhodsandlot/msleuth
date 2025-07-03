import path from 'node:path'
import fs from 'fs-extra'
import { compileFileClient } from 'pug'

const templateDir = path.resolve('src', 'template')
const templatePath = path.resolve(templateDir, 'template.pug')
const renderer = compileFileClient(templatePath, { compileDebug: false })
const rendererPath = path.resolve(templateDir, 'template.gen.ts')
const content = [renderer, 'export { template as render }'].join(';')
await fs.writeFile(rendererPath, content, 'utf8')

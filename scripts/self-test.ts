#!/usr/bin/env node

import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import path from 'path'
import ts from 'typescript'
import { fileURLToPath, pathToFileURL } from 'url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const runtimeDir = mkdtempSync(path.join(tmpdir(), 'prompt-market-react-selftest-'))

const PASS: string[] = []
const FAIL: string[] = []
const compiled = new Map<string, string>()

function check(desc: string, fn: () => boolean | string) {
  try {
    const result = fn()
    if (result === true) PASS.push(desc)
    else if (result === false) FAIL.push(desc)
    else FAIL.push(`${desc}: ${result}`)
  } catch (error: any) {
    FAIL.push(`${desc}: ${error.message}`)
  }
}

function normalizeSpecifier(specifier: string) {
  if (!specifier.startsWith('.')) return specifier
  if (specifier.endsWith('.ts')) return specifier.replace(/\.ts$/, '.js')
  if (specifier.endsWith('.tsx')) return specifier.replace(/\.tsx$/, '.js')
  if (specifier.endsWith('.js') || specifier.endsWith('.mjs')) return specifier
  return `${specifier}.js`
}

function resolveSourcePath(fromFile: string, specifier: string) {
  const base = path.resolve(path.dirname(fromFile), specifier)
  const candidates = [base, `${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts'), path.join(base, 'index.tsx')]
  return candidates.find(candidate => ts.sys.fileExists(candidate)) ?? null
}

function compileModule(sourcePath: string): string {
  const resolved = path.resolve(sourcePath)
  if (compiled.has(resolved)) return compiled.get(resolved)!

  const relative = path.relative(root, resolved).replace(/\\/g, '/')
  const outPath = path.join(runtimeDir, relative).replace(/\.(ts|tsx)$/, '.js')
  mkdirSync(path.dirname(outPath), { recursive: true })

  let source = readFileSync(resolved, 'utf8')
  const importRegex = /(from\s+['"])(\.{1,2}\/[^'"]+)(['"])|(import\s*\(\s*['"])(\.{1,2}\/[^'"]+)(['"]\s*\))/g
  source = source.replace(importRegex, (...args) => {
    const prefix = args[1] || args[4]
    const specifier = args[2] || args[5]
    const suffix = args[3] || args[6]
    const target = resolveSourcePath(resolved, specifier)
    if (target) compileModule(target)
    return `${prefix}${normalizeSpecifier(specifier)}${suffix}`
  })

  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
    fileName: resolved,
  }).outputText

  writeFileSync(outPath, output, 'utf8')
  compiled.set(resolved, outPath)
  return outPath
}

async function load(relativePath: string) {
  const sourcePath = path.resolve(root, relativePath)
  const compiledPath = compileModule(sourcePath)
  return await import(pathToFileURL(compiledPath).href)
}

try {
  const { masterTemplates, MASTER_TEMPLATE_MAP } = await load('src/data/masterTemplates.ts')
  const { STATE_PACKS } = await load('src/data/statePacks.ts')
  const { SCENE_PACKS } = await load('src/data/scenePacks.ts')
  const { DEVICE_PRESETS } = await load('src/data/devicePresets.ts')
  const { LIGHT_PACKS } = await load('src/data/lightPacks.ts')
  const promptState = await load('src/core/promptState.ts')
  const builder = await load('src/utils/facetedBuilder.ts')
  const variantComposer = await load('src/core/variantComposer.ts')
  const externalLibrary = JSON.parse(readFileSync(path.resolve(root, 'public', 'external-library-manifest-v2.json'), 'utf8'))

  const stateIds = new Set(STATE_PACKS.map((entry: any) => entry.id))
  const sceneIds = new Set(SCENE_PACKS.map((entry: any) => entry.id))
  const deviceIds = new Set(DEVICE_PRESETS.map((entry: any) => entry.id))
  const lightIds = new Set(LIGHT_PACKS.map((entry: any) => entry.id))

  check('masterTemplates: all template ids unique', () => {
    const ids = masterTemplates.map((template: any) => template.id)
    return ids.length === new Set(ids).size || 'duplicate template ids found'
  })

  check('masterTemplates: every template has advancedSelections', () => {
    const missing = masterTemplates.filter((template: any) => !template.advancedSelections || Object.keys(template.advancedSelections).length === 0)
    return missing.length === 0 || `missing advancedSelections: ${missing.map((template: any) => template.id).join(', ')}`
  })

  check('masterTemplates: device/scene/light references remain valid', () => {
    const broken = masterTemplates.filter((template: any) =>
      !deviceIds.has(template.lockedCore.device) ||
      !sceneIds.has(template.lockedCore.scene) ||
      !lightIds.has(template.lockedCore.light),
    )
    return broken.length === 0 || `broken refs: ${broken.map((template: any) => template.id).join(', ')}`
  })

  check('masterTemplates: all randomPools.state exist in STATE_PACKS', () => {
    const broken: string[] = []
    for (const template of masterTemplates) {
      for (const stateId of template.randomPools.state) {
        if (!stateIds.has(stateId)) broken.push(`${template.id}:${stateId}`)
      }
    }
    return broken.length === 0 || `broken state refs: ${broken.join(', ')}`
  })

  check('bridge coverage: known missing scenes are now mapped', () => {
    const targets = ['ballet-studio', 'bookstore-silent', 'clean-girl-headshot', 'summer-tree-candid', 'office-siren', 'gallery-minimal']
    const broken = targets.filter(id => !MASTER_TEMPLATE_MAP[id]?.advancedSelections?.scenePrimary)
    return broken.length === 0 || `scenePrimary missing: ${broken.join(', ')}`
  })

  check('bridge coverage: known missing states now have facet fragments', () => {
    const targets = ['drinking-tea', 'playing-with-pet', 'walking']
    const broken = targets.filter(id => {
      const state = STATE_PACKS.find((entry: any) => entry.id === id)
      return !state?.facetFragment || Object.keys(state.facetFragment).length === 0
    })
    return broken.length === 0 || `state facetFragment missing: ${broken.join(', ')}`
  })

  check('promptReducer: APPLY_MASTER_TEMPLATE seeds full advanced selections', () => {
    const next = promptState.promptReducer(promptState.defaultPromptState, { type: 'APPLY_MASTER_TEMPLATE', templateId: 'night-convenience-ccd' })
    return Object.keys(next.advanced.facetSelections).length >= 6 || `too few slots: ${Object.keys(next.advanced.facetSelections).length}`
  })

  check('promptReducer: advanced edits can invalidate template match and keep custom state', () => {
    const seeded = promptState.promptReducer(promptState.defaultPromptState, { type: 'APPLY_MASTER_TEMPLATE', templateId: 'night-convenience-ccd' })
    const changed = promptState.promptReducer(seeded, { type: 'UPDATE_ADVANCED_FACET', slotId: 'scenePrimary', value: 'scene_cafe' })
    return changed.director.templateId === null || changed.director.templateId === 'cafe-window' || `unexpected template match: ${changed.director.templateId}`
  })

  check('parseImportedPrompt: Chinese prompt hits structured slots and preserves params', () => {
    const parsed = builder.parseImportedPrompt('咖啡馆，窗边光，回眸，胶片感，--ar 3:4')
    const lightHit = parsed.selections.lightingPrimary === 'light_natural_window' || parsed.selections.lightFamily === 'lf_window'
    return (
      parsed.selections.scenePrimary === 'scene_cafe' &&
      lightHit &&
      parsed.selections.posePrimary === 'pose_looking_back' &&
      parsed.selections.colorGradePrimary === 'color_film' &&
      parsed.importMeta.parameterSuffix.includes('--ar 3:4')
    ) || 'Chinese parsing failed to recover expected structured selections'
  })

  check('parseImportedPrompt: mixed Chinese/English prompt keeps unmatched content and negative prompt', () => {
    const parsed = builder.parseImportedPrompt('书店, natural light, 看镜头, clean girl, extra unknown note, 负面提示词：手变形，塑料皮肤, --stylize 100')
    const expr = parsed.selections.expressionModifiers
    const hasEyeContact = Array.isArray(expr) && expr.includes('emod_looking_at_camera')
    return (
      parsed.selections.scenePrimary === 'scene_bookstore' &&
      parsed.selections.lightFamily === 'lf_natural' &&
      hasEyeContact &&
      parsed.freeformPositive.includes('extra unknown note') &&
      parsed.freeformNegative.includes('手变形') &&
      parsed.importMeta.parameterSuffix.includes('--stylize 100')
    ) || 'mixed-language parsing failed'
  })

  check('promptReducer: manual import records sourceKind manualPaste', () => {
    const next = promptState.promptReducer(promptState.defaultPromptState, { type: 'IMPORT_ADVANCED_PROMPT', text: '咖啡馆，窗边光，回眸' })
    return next.advanced.importMeta?.sourceKind === 'manualPaste' || 'manual import meta sourceKind missing'
  })

  check('buildSegmentedPrompt: tag and natural outputs both work across languages', () => {
    const selections = {
      outputLang: 'lang_mix',
      scenePrimary: 'scene_cafe',
      posePrimary: 'pose_sitting',
      expressionPrimary: 'expr_smile',
    }
    const tag = builder.buildSegmentedPrompt(selections, { outputLang: 'mix', promptStyle: 'tag' })
    const natural = builder.buildSegmentedPrompt(selections, { outputLang: 'mix', promptStyle: 'natural' })
    return (
      tag.flatPrompt.includes('|') &&
      natural.naturalPrompt.includes('English tags:') &&
      tag.positivePrompt !== natural.positivePrompt
    ) || 'segmented prompt outputs do not differ as expected'
  })

  check('external library: generated manifest has valid sources, categories, chunks, and entry summaries', () => {
    const index = externalLibrary
    const sourceIds = new Set(index.sources.map((source: any) => source.id))
    const chunkIds = new Set(index.chunks.map((chunk: any) => chunk.id))
    const invalid = index.entryIndex.filter((entry: any) =>
      !sourceIds.has(entry.sourceId) ||
      !chunkIds.has(entry.chunkId) ||
      !(entry.displayTitleZh || entry.title) ||
      !entry.category ||
      !entry.displayCategoryZh ||
      !entry.normalizedCategory ||
      !entry.sourceTier ||
      !entry.qualityTier ||
      !Array.isArray(entry.styleTags) ||
      !Array.isArray(entry.sceneTags) ||
      typeof entry.importHints !== 'object' ||
      typeof entry.searchText !== 'string',
    )
    const sourceCoverage = ['freestylefly', 'evolink', 'youmind'].every(sourceId =>
      index.entryIndex.some((entry: any) => entry.sourceId === sourceId),
    )
    const categoryCoverage = ['portrait', 'street', 'cinematic', 'fashion', 'commercial', 'poster', 'ui-graphic'].every(categoryId =>
      index.categories.some((category: any) => category.id === categoryId && category.entryCount > 0),
    )
    const mojibake = index.entryIndex.filter((entry: any) =>
      /(^"|"$)|"[^"]/.test(entry.title) ||
      entry.title.includes('锛') ||
      entry.title.includes('銆') ||
      entry.title.includes('鈥')
    )
    return (
      index.entryIndex.length >= 1000 &&
      index.categories.length >= 10 &&
      index.chunks.length >= 10 &&
      sourceCoverage &&
      categoryCoverage &&
      mojibake.length === 0 &&
      invalid.length === 0
    ) || `invalid manifest entries: ${invalid.map((entry: any) => entry.id).slice(0, 10).join(', ')}; mojibake: ${mojibake.map((entry: any) => entry.id).slice(0, 10).join(', ')}`
  })

  check('external library: chunk files exist and can hydrate full entries on demand', () => {
    const index = externalLibrary
    const sample = index.entryIndex.find((entry: any) => entry.sourceId === 'evolink' && entry.normalizedCategory === 'street')
      ?? index.entryIndex[0]
    if (!sample) return 'missing sample summary entry'

    const chunk = index.chunks.find((item: any) => item.id === sample.chunkId)
    if (!chunk) return `missing chunk meta for ${sample.chunkId}`

    const chunkPath = path.resolve(root, 'public', chunk.path.replace(/^\//, ''))
    if (!ts.sys.fileExists(chunkPath)) return `chunk file missing: ${chunk.path}`

    const loaded = JSON.parse(readFileSync(chunkPath, 'utf8')) as { meta: any; entries: Array<any> }
    const entry = loaded.entries.find(item => item.id === sample.id)
    return (
      loaded.meta.id === chunk.id &&
      Array.isArray(loaded.entries) &&
      loaded.entries.length > 0 &&
      !!entry?.prompt
    ) || `chunk did not contain full entry for ${sample.id}`
  })

  check('promptReducer: external library import preserves source metadata and round-trips into advanced state', () => {
    const index = externalLibrary
    const summary = index.entryIndex.find((entry: any) =>
      entry.sourceId === 'evolink' &&
      entry.recommendedForCurrentProduct &&
      Object.keys(entry.importHints ?? {}).length > 0,
    ) ?? index.entryIndex.find((entry: any) => Object.keys(entry.importHints ?? {}).length > 0)
    if (!summary) return 'missing importable external library summary'

    const chunk = index.chunks.find((item: any) => item.id === summary.chunkId)
    if (!chunk) return `missing chunk meta for ${summary.chunkId}`

    const chunkPath = path.resolve(root, 'public', chunk.path.replace(/^\//, ''))
    const loaded = JSON.parse(readFileSync(chunkPath, 'utf8')) as { entries: Array<any> }
    const entry = loaded.entries.find(item => item.id === summary.id)
    if (!entry) return `missing full entry for ${summary.id}`

    const next = promptState.promptReducer(promptState.defaultPromptState, { type: 'IMPORT_EXTERNAL_LIBRARY_ENTRY', entry })
    return (
      next.advanced.importMeta?.sourceKind === 'externalLibraryImport' &&
      next.advanced.importMeta?.entryId === entry.id &&
      next.advanced.importMeta?.sourceRepo === entry.sourceRepo &&
      next.advanced.importMeta?.qualityTier === entry.qualityTier &&
      next.advanced.importMeta?.sourceTier === entry.sourceTier &&
      (Object.keys(next.advanced.facetSelections).length > 1 || next.advanced.freeformPositive.length > 0)
    ) || 'external library import metadata or selections missing'
  })

  check('generatePoseVariants: returns exact counts for 3/5/9', () => {
    const selection = {
      directorTemplate: 'cafe-window',
      devicePreset: 'iphone-lifestyle',
      scenePack: 'cafe-window',
      lightPack: 'window-natural',
      statePacks: ['reading-book'],
      diffStrength: 'normal',
      parameterPreset: 'real-stable',
      customProps: ['咖啡杯'],
    }
    const counts = [3, 5, 9].map(count => variantComposer.generatePoseVariants(selection, { variantCount: count as 3 | 5 | 9, intensity: 'standard' }).length)
    return counts[0] === 3 && counts[1] === 5 && counts[2] === 9 || `bad counts: ${counts.join(', ')}`
  })

  check('generatePoseVariants: avoids obvious duplicate pose batches', () => {
    const selection = {
      directorTemplate: 'summer-tree-candid',
      devicePreset: 'digital-camera',
      scenePack: 'summer-tree-candid',
      lightPack: 'tree-dappled',
      statePacks: ['walking-naturally'],
      diffStrength: 'normal',
      parameterPreset: 'real-stable',
      customProps: [],
    }
    const variants = variantComposer.generatePoseVariants(selection, { variantCount: 5, intensity: 'dynamic' })
    const poses = new Set(variants.map((variant: any) => variant.facetFragment?.posePrimary))
    return poses.size >= 3 || `not enough pose diversity: ${poses.size}`
  })

  check('promptReducer: APPLY_POSE_VARIANT merges facet fragment into advanced selections', () => {
    const variants = variantComposer.generatePoseVariants({
      directorTemplate: 'cafe-window',
      devicePreset: 'iphone-lifestyle',
      scenePack: 'cafe-window',
      lightPack: 'window-natural',
      statePacks: ['reading-book'],
      diffStrength: 'normal',
      parameterPreset: 'real-stable',
      customProps: [],
    }, { variantCount: 3, intensity: 'standard' })

    const seeded = {
      ...promptState.defaultPromptState,
      variants: { list: variants, activeVariantId: variants[0].shot.id, appliedVariantId: null },
      advanced: { ...promptState.defaultPromptState.advanced, facetSelections: { outputLang: 'lang_zh' } },
    }
    const next = promptState.promptReducer(seeded, { type: 'APPLY_POSE_VARIANT', variantId: variants[0].shot.id })
    return Object.keys(next.advanced.facetSelections).length > 1 || 'variant fragment was not applied to advanced selections'
  })

  check('selectOutput: sections and natural prompt are populated', () => {
    const seeded = promptState.promptReducer(promptState.defaultPromptState, { type: 'APPLY_MASTER_TEMPLATE', templateId: 'cafe-window' })
    const output = promptState.selectOutput(seeded)
    return output.sections.length > 0 && output.flatPrompt.length > 0 && output.naturalPrompt.length > 0 || 'composed output missing segmented data'
  })
} finally {
  rmSync(runtimeDir, { recursive: true, force: true })
}

console.log('')
console.log('=== Self-Test Results ===')
console.log(`  PASS: ${PASS.length}`)
console.log(`  FAIL: ${FAIL.length}`)
console.log('')

if (FAIL.length > 0) {
  console.log('--- FAILURES ---')
  for (const failure of FAIL) console.log(`  - ${failure}`)
  console.log('')
}

process.exit(FAIL.length > 0 ? 1 : 0)

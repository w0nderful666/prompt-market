/**
 * Self-test for Prompt Director - validates core functionality
 * Run: node self-test.js (after build)
 */

import { readFileSync, existsSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, 'dist')

let passed = 0
let failed = 0
let skipped = 0
const failures = []

function assert(condition, name) {
  if (condition) { passed++; console.log(`  ✅ ${name}`) }
  else { failed++; failures.push(name); console.log(`  ❌ ${name}`) }
}

// ====== Build Output ======
console.log('\n📦 Build Output')
assert(existsSync(distDir), 'dist/ directory exists')
assert(existsSync(join(distDir, 'index.html')), 'dist/index.html exists')
const indexHtml = readFileSync(join(distDir, 'index.html'), 'utf-8')
assert(indexHtml.includes('Prompt Director') || indexHtml.includes('提示词'), 'index.html has title')
const assetsDir = join(distDir, 'assets')
const assetFiles = existsSync(assetsDir) ? readdirSync(assetsDir) : []
assert(assetFiles.some(f => f.endsWith('.js')), 'JS assets built')
assert(assetFiles.some(f => f.endsWith('.css')), 'CSS assets built')

// ====== Source Files ======
console.log('\n📁 Source Files')
const srcDir = join(__dirname, 'src')
const requiredFiles = [
  'App.vue', 'main.js', 'style.css',
  'components/DirectorEditor.vue', 'components/DirectorCard.vue', 'components/DirectorOutput.vue',
  'components/PromptScorePanel.vue', 'components/DeconstructorPanel.vue', 'components/VariantsPanel.vue',
  'components/DirectorHistory.vue', 'components/SelectedPanel.vue', 'components/TopBar.vue',
  'components/CategoryTabs.vue', 'components/KeywordGroup.vue',
  'components/ConflictPanel.vue', 'components/TokenCleanerPanel.vue',
  'components/ModelAdapterPanel.vue', 'components/RecipeCard.vue',
  'components/SharePanel.vue', 'components/PromptGallery.vue',
  'utils/directorBuilder.js', 'utils/promptScore.js', 'utils/deconstructor.js',
  'utils/variantGenerator.js', 'utils/storage.js', 'utils/promptBuilder.js',
  'utils/naturalPromptBuilder.js', 'utils/promptTextTools.js',
  'utils/conflictDetector.js', 'utils/tokenCleaner.js',
  'utils/modelAdapter.js', 'utils/shareLink.js',
  'data/prompts.json', 'data/presets.json', 'data/examples.json',
  'data/avoidTags.json', 'data/directorModules.json', 'data/variants.json'
]
for (const file of requiredFiles) {
  assert(existsSync(join(srcDir, file)), `${file} exists`)
}

// ====== Director Modules ======
console.log('\n🎬 Director Modules')
const directorModules = JSON.parse(readFileSync(join(srcDir, 'data/directorModules.json'), 'utf-8'))
assert(Array.isArray(directorModules), 'directorModules is array')
assert(directorModules.length >= 15, `directorModules has ${directorModules.length} modules (≥15)`)
const requiredModuleIds = ['subject', 'scene', 'composition', 'lighting', 'camera', 'mustKeep', 'avoid', 'ratio', 'model', 'expression', 'face', 'hair', 'body', 'clothing', 'background', 'atmosphere', 'caption']
for (const id of requiredModuleIds) {
  assert(directorModules.some(m => m.id === id), `Has ${id} module`)
}

// ====== Presets ======
console.log('\n🎨 Presets')
const presets = JSON.parse(readFileSync(join(srcDir, 'data/presets.json'), 'utf-8'))
assert(presets.scenes?.length >= 10, `Scenes: ${presets.scenes?.length || 0}`)
assert(presets.textures?.length >= 10, `Textures: ${presets.textures?.length || 0}`)
assert(presets.compositions?.length >= 10, `Compositions: ${presets.compositions?.length || 0}`)
assert(presets.lightings?.length >= 10, `Lightings: ${presets.lightings?.length || 0}`)
assert(presets.atmospheres?.length >= 10, `Atmospheres: ${presets.atmospheres?.length || 0}`)

// ====== Gallery Examples ======
console.log('\n🖼️ Gallery Examples')
const examples = JSON.parse(readFileSync(join(srcDir, 'data/examples.json'), 'utf-8'))
assert(Array.isArray(examples), 'examples is array')
assert(examples.length >= 6, `Has ${examples.length} gallery examples (≥6)`)
const requiredExamples = ['bathroom_mirror_selfie', 'subway_ccd_snapshot', 'night_convenience_store', 'rainy_car_window', 'premium_product', 'github_cover']
for (const id of requiredExamples) {
  const ex = examples.find(e => e.id === id)
  assert(!!ex, `Gallery "${id}" exists`)
  if (ex) {
    assert(!!ex.director?.subject, `  └─ has subject`)
    assert(!!ex.director?.scene, `  └─ has scene`)
    assert(!!ex.tags?.length, `  └─ has tags`)
    assert(ex.score > 0, `  └─ has score: ${ex.score}`)
  }
}

// ====== Avoid Tags ======
console.log('\n🚫 Avoid Tags')
const avoidTags = JSON.parse(readFileSync(join(srcDir, 'data/avoidTags.json'), 'utf-8'))
assert(avoidTags.length >= 15, `Has ${avoidTags.length} avoid tags (≥15)`)

// ====== Variants ======
console.log('\n🎲 Variants')
const variants = JSON.parse(readFileSync(join(srcDir, 'data/variants.json'), 'utf-8'))
assert(variants.variants?.length >= 11, `Has ${variants.variants?.length || 0} variants (≥11)`)

// ====== Utility Functions ======
console.log('\n🔧 Utility Functions')

// Director builder
try {
  const b = await import('./src/utils/directorBuilder.js')
  assert(typeof b.buildAllOutputs === 'function', 'buildAllOutputs exported')
  const sample = { model: 'GPT', subject: '女性', scene: '街头', composition: '半身', lighting: '柔光', camera: '胶片', mustKeep: '自然', avoid: '塑料', ratio: '3:4' }
  const all = b.buildAllOutputs(sample)
  assert(Object.keys(all).length === 5, 'buildAllOutputs returns 5 outputs')
  assert(all.chineseShort.length > 5, `Chinese short: ${all.chineseShort.length} chars`)
  assert(all.englishStandard.length > 10, `English: ${all.englishStandard.length} chars`)
} catch (e) { assert(false, `directorBuilder: ${e.message}`) }

// Prompt score
try {
  const s = await import('./src/utils/promptScore.js')
  const r = s.scorePrompt({ subject: '女性', scene: '街头', composition: '半身', lighting: '柔光', camera: '胶片', mustKeep: '自然', avoid: '塑料', ratio: '3:4' })
  assert(typeof r.score === 'number' && r.score > 0, `Score: ${r.score}`)
  assert(r.level && r.level.length > 0, `Level: ${r.level}`)
} catch (e) { assert(false, `promptScore: ${e.message}`) }

// Deconstructor
try {
  const d = await import('./src/utils/deconstructor.js')
  const parsed = d.deconstructPrompt('主体：一位年轻女性\n场景：夜晚街头\n构图：近景半身\n光线：霓虹灯光')
  assert(parsed.subject?.includes('年轻女性'), `Parsed subject`)
  assert(parsed.scene?.includes('夜晚'), `Parsed scene`)
} catch (e) { assert(false, `deconstructor: ${e.message}`) }

// Conflict detector
try {
  const c = await import('./src/utils/conflictDetector.js')
  assert(typeof c.detectConflicts === 'function', 'detectConflicts exported')
  const conflicts = c.detectConflicts({ subject: '低清手机质感', camera: '商业高清锐利风格' })
  assert(conflicts.length > 0, `Detected ${conflicts.length} conflict(s)`)
  assert(conflicts[0].suggestion?.length > 5, `Has suggestion text`)
} catch (e) { assert(false, `conflictDetector: ${e.message}`) }

// Token cleaner
try {
  const t = await import('./src/utils/tokenCleaner.js')
  assert(typeof t.cleanPrompt === 'function', 'cleanPrompt exported')
  const result = t.cleanPrompt({ subject: '女性，，女性', avoid: '塑料，塑料，模糊' })
  assert(result.cleaned.subject === '女性', `Cleaned duplicate: "${result.cleaned.subject}"`)
  assert(result.cleaned.avoid === '塑料，模糊', `Cleaned avoid duplicates: "${result.cleaned.avoid}"`)
} catch (e) { assert(false, `tokenCleaner: ${e.message}`) }

// Model adapter
try {
  const m = await import('./src/utils/modelAdapter.js')
  assert(typeof m.buildModelOutputs === 'function', 'buildModelOutputs exported')
  const sample = { subject: '女性', scene: '街头', lighting: '柔光', camera: '胶片', ratio: '3:4' }
  const out = m.buildModelOutputs(sample)
  assert(out.gptImage?.name === 'GPT Image', 'GPT Image adapter')
  assert(out.midjourney?.name === 'Midjourney', 'Midjourney adapter')
  assert(out.midjourney?.text.includes('--ar'), `MJ has --ar param`)
  assert(out.stableDiffusion?.name === 'Stable Diffusion', 'SD adapter')
  assert(out.stableDiffusion?.positive?.length > 0, `SD has positive prompt`)
  assert(out.stableDiffusion?.negative?.length > 0, `SD has negative prompt`)
  assert(out.flux?.name === 'Flux', 'Flux adapter')
  assert(out.chineseGeneric?.name === '通用中文', 'Chinese adapter')
  assert(out.englishGeneric?.name === '通用英文', 'English adapter')
} catch (e) { assert(false, `modelAdapter: ${e.message}`) }

// Share link
try {
  const s = await import('./src/utils/shareLink.js')
  assert(typeof s.createShareUrl === 'function', 'createShareUrl exported')
  assert(typeof s.importFromUrl === 'function', 'importFromUrl exported')
} catch (e) { assert(false, `shareLink: ${e.message}`) }

// Variant generator
try {
  const v = await import('./src/utils/variantGenerator.js')
  assert(typeof v.generateVariants === 'function', 'generateVariants exported')
} catch (e) { assert(false, `variantGenerator: ${e.message}`) }

// ====== Config ======
console.log('\n⚙️  Configuration')
const pkg = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf-8'))
assert(pkg.scripts.build === 'vite build', 'build script')
assert(pkg.scripts['self-test'] === 'node self-test.js', 'self-test script')
const viteConfig = readFileSync(join(__dirname, 'vite.config.js'), 'utf-8')
assert(viteConfig.includes('base:'), 'Vite base path')
const twConfig = readFileSync(join(__dirname, 'tailwind.config.js'), 'utf-8')
assert(twConfig.includes('darkMode'), 'Tailwind darkMode')

// ====== Mobile Layout ======
console.log('\n📱 Mobile Layout')
const appVue = readFileSync(join(srcDir, 'App.vue'), 'utf-8')
assert(appVue.includes('max-w-7xl'), 'max-width container')
assert(appVue.includes('flex-wrap'), 'flex-wrap')
const dirEditor = readFileSync(join(srcDir, 'components/DirectorEditor.vue'), 'utf-8')
assert(dirEditor.includes('sm:grid-cols-2'), 'responsive grid sm')
assert(dirEditor.includes('lg:grid-cols-3'), 'responsive grid lg')
assert(dirEditor.includes('lg:sticky'), 'sticky output panel')

// ====== Hero & Badges ======
console.log('\n🏠 Hero & Badges')
assert(dirEditor.includes('Prompt Director'), 'Hero title')
assert(dirEditor.includes('Local First'), 'Local First badge')
assert(dirEditor.includes('No Backend'), 'No Backend badge')
assert(dirEditor.includes('Privacy Friendly'), 'Privacy badge')
assert(dirEditor.includes('GitHub Pages Ready'), 'GitHub Pages badge')

// ====== GitHub Actions ======
console.log('\n🚀 GitHub Actions')
assert(existsSync(join(__dirname, '.github/workflows/deploy.yml')), 'deploy.yml exists')

// ====== Summary ======
console.log('\n' + '='.repeat(50))
console.log(`\n📊 Results: ${passed} passed, ${failed} failed, ${skipped} skipped`)
if (failures.length) { console.log('\n❌ Failures:'); failures.forEach(f => console.log(`   - ${f}`)) }
if (failed === 0) { console.log('\n🎉 All tests passed!\n'); process.exit(0) }
else { console.log('\n💥 Some tests failed.\n'); process.exit(1) }

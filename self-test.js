/**
 * Self-test for Prompt Director - validates core functionality
 * Run: node self-test.js (after build)
 */

import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, 'dist')

let passed = 0
let failed = 0
let skipped = 0
const failures = []

function assert(condition, name) {
  if (condition) {
    passed++
    console.log(`  ✅ ${name}`)
  } else {
    failed++
    failures.push(name)
    console.log(`  ❌ ${name}`)
  }
}

function skip(name) {
  skipped++
  console.log(`  ⏭️  ${name} (skipped)`)
}

// ====== Build Output Tests ======
console.log('\n📦 Build Output')

assert(existsSync(distDir), 'dist/ directory exists')
assert(existsSync(join(distDir, 'index.html')), 'dist/index.html exists')

const indexHtml = readFileSync(join(distDir, 'index.html'), 'utf-8')
assert(indexHtml.includes('Prompt Director') || indexHtml.includes('提示词'), 'index.html has title')
assert(indexHtml.includes('app') || indexHtml.includes('script'), 'index.html has app mount')

// Check for JS assets
const distFiles = existsSync(distDir) ? (await import('fs')).readdirSync(distDir) : []
const assetsDir = join(distDir, 'assets')
const assetFiles = existsSync(assetsDir) ? (await import('fs')).readdirSync(assetsDir) : []
assert(assetFiles.some(f => f.endsWith('.js')), 'JS assets built')
assert(assetFiles.some(f => f.endsWith('.css')), 'CSS assets built')

// ====== Source File Tests ======
console.log('\n📁 Source Files')

const srcDir = join(__dirname, 'src')
const requiredFiles = [
  'App.vue',
  'main.js',
  'style.css',
  'components/DirectorEditor.vue',
  'components/DirectorCard.vue',
  'components/DirectorOutput.vue',
  'components/PromptScorePanel.vue',
  'components/DeconstructorPanel.vue',
  'components/VariantsPanel.vue',
  'components/DirectorHistory.vue',
  'components/SelectedPanel.vue',
  'components/TopBar.vue',
  'components/CategoryTabs.vue',
  'components/KeywordGroup.vue',
  'utils/directorBuilder.js',
  'utils/promptScore.js',
  'utils/deconstructor.js',
  'utils/variantGenerator.js',
  'utils/storage.js',
  'utils/promptBuilder.js',
  'utils/naturalPromptBuilder.js',
  'utils/promptTextTools.js',
  'data/prompts.json',
  'data/presets.json',
  'data/examples.json',
  'data/avoidTags.json',
  'data/directorModules.json',
  'data/variants.json'
]

for (const file of requiredFiles) {
  assert(existsSync(join(srcDir, file)), `${file} exists`)
}

// ====== Director Module Tests ======
console.log('\n🎬 Director Modules')

const directorModules = JSON.parse(readFileSync(join(srcDir, 'data/directorModules.json'), 'utf-8'))
assert(Array.isArray(directorModules), 'directorModules is array')
assert(directorModules.length >= 15, `directorModules has ${directorModules.length} modules (≥15)`)
assert(directorModules.some(m => m.id === 'subject'), 'Has subject module')
assert(directorModules.some(m => m.id === 'scene'), 'Has scene module')
assert(directorModules.some(m => m.id === 'lighting'), 'Has lighting module')
assert(directorModules.some(m => m.id === 'mustKeep'), 'Has mustKeep module')
assert(directorModules.some(m => m.id === 'avoid'), 'Has avoid module')
assert(directorModules.some(m => m.id === 'ratio'), 'Has ratio module')

// ====== Preset Tests ======
console.log('\n🎨 Presets')

const presets = JSON.parse(readFileSync(join(srcDir, 'data/presets.json'), 'utf-8'))
assert(presets.scenes && presets.scenes.length >= 10, `Scenes presets: ${presets.scenes?.length || 0}`)
assert(presets.textures && presets.textures.length >= 10, `Texture presets: ${presets.textures?.length || 0}`)
assert(presets.compositions && presets.compositions.length >= 10, `Composition presets: ${presets.compositions?.length || 0}`)
assert(presets.lightings && presets.lightings.length >= 10, `Lighting presets: ${presets.lightings?.length || 0}`)
assert(presets.atmospheres && presets.atmospheres.length >= 10, `Atmosphere presets: ${presets.atmospheres?.length || 0}`)

// ====== Example Tests ======
console.log('\n📋 Examples')

const examples = JSON.parse(readFileSync(join(srcDir, 'data/examples.json'), 'utf-8'))
assert(Array.isArray(examples), 'examples is array')
assert(examples.length >= 3, `Has ${examples.length} examples (≥3)`)
assert(examples.some(e => e.id === 'bathroom_selfie_lowres'), 'Has bathroom selfie example')
assert(examples.some(e => e.id === 'night_street_film'), 'Has night street film example')
assert(examples.some(e => e.id === 'product_ecommerce'), 'Has product ecommerce example')

for (const ex of examples) {
  assert(ex.director && ex.director.subject, `Example "${ex.name}" has subject`)
  assert(ex.director && ex.director.scene, `Example "${ex.name}" has scene`)
}

// ====== Avoid Tags Tests ======
console.log('\n🚫 Avoid Tags')

const avoidTags = JSON.parse(readFileSync(join(srcDir, 'data/avoidTags.json'), 'utf-8'))
assert(Array.isArray(avoidTags), 'avoidTags is array')
assert(avoidTags.length >= 15, `Has ${avoidTags.length} avoid tags (≥15)`)
assert(avoidTags.some(t => t.zh === '过度精修'), 'Has 过度精修 tag')
assert(avoidTags.some(t => t.zh === '塑料皮肤'), 'Has 塑料皮肤 tag')

// ====== Variants Tests ======
console.log('\n🎲 Variants')

const variants = JSON.parse(readFileSync(join(srcDir, 'data/variants.json'), 'utf-8'))
assert(variants.variants && variants.variants.length >= 11, `Has ${variants.variants?.length || 0} variants (≥11)`)
assert(variants.variants.some(v => v.id === 'gpt_image'), 'Has GPT Image variant')
assert(variants.variants.some(v => v.id === 'midjourney'), 'Has Midjourney variant')
assert(variants.variants.some(v => v.id === 'stable_diffusion'), 'Has SD variant')

// ====== Utility Function Tests ======
console.log('\n🔧 Utility Functions')

// Test directorBuilder exports
try {
  const builder = await import('./src/utils/directorBuilder.js')
  assert(typeof builder.buildChineseShort === 'function', 'buildChineseShort exported')
  assert(typeof builder.buildChineseStandard === 'function', 'buildChineseStandard exported')
  assert(typeof builder.buildChineseDirector === 'function', 'buildChineseDirector exported')
  assert(typeof builder.buildEnglishStandard === 'function', 'buildEnglishStandard exported')
  assert(typeof builder.buildAvoidPrompt === 'function', 'buildAvoidPrompt exported')
  assert(typeof builder.buildAllOutputs === 'function', 'buildAllOutputs exported')

  // Test with sample data
  const sampleDirector = {
    model: 'GPT Image', subject: '一位年轻女性', scene: '夜晚街头',
    composition: '近景半身', expression: '看向镜头', face: '自然妆容',
    hair: '黑色长发', body: '自然站立', clothing: '黑色皮夹克',
    lighting: '夜晚霓虹', camera: '35mm胶片', background: '霓虹招牌',
    atmosphere: '深夜感', caption: '街拍', mustKeep: '自然肤色',
    avoid: '塑料皮肤', ratio: '3:4'
  }

  const short = builder.buildChineseShort(sampleDirector)
  assert(short.length > 10, `Chinese short output: ${short.length} chars`)

  const standard = builder.buildChineseStandard(sampleDirector)
  assert(standard.length > 20, `Chinese standard output: ${standard.length} chars`)

  const director = builder.buildChineseDirector(sampleDirector)
  assert(director.includes('主体'), 'Director output has section headers')

  const english = builder.buildEnglishStandard(sampleDirector)
  assert(english.length > 20, `English output: ${english.length} chars`)

  const avoid = builder.buildAvoidPrompt(sampleDirector)
  assert(avoid.length > 10, `Avoid output: ${avoid.length} chars`)

  const all = builder.buildAllOutputs(sampleDirector)
  assert(Object.keys(all).length === 5, 'buildAllOutputs returns 5 outputs')
} catch (e) {
  assert(false, `directorBuilder import: ${e.message}`)
}

// Test promptScore
try {
  const scorer = await import('./src/utils/promptScore.js')
  assert(typeof scorer.scorePrompt === 'function', 'scorePrompt exported')

  const result = scorer.scorePrompt({ subject: '女性', scene: '街头', composition: '半身', lighting: '柔光', camera: '胶片', mustKeep: '自然', avoid: '塑料', ratio: '3:4' })
  assert(typeof result.score === 'number', `Score is number: ${result.score}`)
  assert(result.score > 0, `Score > 0`)
  assert(Array.isArray(result.pros), 'Has pros array')
  assert(Array.isArray(result.suggestions), 'Has suggestions array')
} catch (e) {
  assert(false, `promptScore import: ${e.message}`)
}

// Test deconstructor
try {
  const decon = await import('./src/utils/deconstructor.js')
  assert(typeof decon.deconstructPrompt === 'function', 'deconstructPrompt exported')

  const parsed = decon.deconstructPrompt('主体：一位年轻女性\n场景：夜晚街头\n构图：近景半身\n光线：霓虹灯光')
  assert(parsed.subject && parsed.subject.includes('年轻女性'), `Parsed subject: ${parsed.subject}`)
  assert(parsed.scene && parsed.scene.includes('夜晚'), `Parsed scene: ${parsed.scene}`)
} catch (e) {
  assert(false, `deconstructor import: ${e.message}`)
}

// Test variantGenerator
try {
  const varGen = await import('./src/utils/variantGenerator.js')
  assert(typeof varGen.generateVariants === 'function', 'generateVariants exported')
} catch (e) {
  assert(false, `variantGenerator import: ${e.message}`)
}

// ====== Config Tests ======
console.log('\n⚙️  Configuration')

const packageJson = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf-8'))
assert(packageJson.scripts.build === 'vite build', 'build script exists')
assert(packageJson.scripts.dev === 'vite dev' || packageJson.scripts.dev === 'vite', 'dev script exists')
assert(packageJson.scripts['self-test'] === 'node self-test.js', 'self-test script exists')

const viteConfig = readFileSync(join(__dirname, 'vite.config.js'), 'utf-8')
assert(viteConfig.includes("base: './'") || viteConfig.includes('base:'), 'Vite config has base path')

const tailwindConfig = readFileSync(join(__dirname, 'tailwind.config.js'), 'utf-8')
assert(tailwindConfig.includes('darkMode'), 'Tailwind has darkMode config')

// ====== Mobile Layout Tests ======
console.log('\n📱 Mobile Layout')

const appVue = readFileSync(join(srcDir, 'App.vue'), 'utf-8')
assert(appVue.includes('max-w-7xl'), 'Has max-width container')
assert(appVue.includes('p-3'), 'Has mobile padding')
assert(appVue.includes('flex-wrap'), 'Has flex-wrap for mobile')

const directorEditor = readFileSync(join(srcDir, 'components/DirectorEditor.vue'), 'utf-8')
assert(directorEditor.includes('sm:grid-cols-2'), 'Director cards responsive grid')
assert(directorEditor.includes('lg:grid-cols-3'), 'Director cards 3-col layout')

// ====== Summary ======
console.log('\n' + '='.repeat(50))
console.log(`\n📊 Results: ${passed} passed, ${failed} failed, ${skipped} skipped`)

if (failures.length) {
  console.log('\n❌ Failures:')
  failures.forEach(f => console.log(`   - ${f}`))
}

if (failed === 0) {
  console.log('\n🎉 All tests passed!\n')
  process.exit(0)
} else {
  console.log('\n💥 Some tests failed.\n')
  process.exit(1)
}

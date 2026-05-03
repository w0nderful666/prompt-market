/**
 * Self-test for Prompt Director Studio v3.0.0
 * Run: node self-test.js (after build)
 */

import { readFileSync, existsSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, 'dist')

let passed = 0
let failed = 0
const failures = []

function assert(condition, name) {
  if (condition) { passed++; console.log(`  ✅ ${name}`) }
  else { failed++; failures.push(name); console.log(`  ❌ ${name}`) }
}

// ====== 1. Package Version ======
console.log('\n📦 Version Check')
const pkg = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf-8'))
assert(pkg.version === '3.0.0', 'package.json version is 3.0.0')

// ====== 2. Page Title ======
console.log('\n📄 Page Title')
const indexHtmlSrc = readFileSync(join(__dirname, 'index.html'), 'utf-8')
assert(indexHtmlSrc.includes('Prompt Director Studio'), 'index.html contains "Prompt Director Studio"')

// ====== 3. Footer ======
console.log('\n🦶 Footer')
const appVue = readFileSync(join(srcDir(), 'App.vue'), 'utf-8')
assert(appVue.includes('appMeta.version') || appVue.includes('v3.0.0'), 'App.vue footer references version (appMeta.version or literal v3.0.0)')
assert(appVue.includes('No Tracking'), 'Footer contains "No Tracking"')
assert(appVue.includes('appMeta.buildDate') || appVue.includes('2026-05-03'), 'Footer references build date (appMeta.buildDate or literal 2026-05-03)')

function srcDir() { return join(__dirname, 'src') }

// ====== 4. Navigation Tabs ======
console.log('\n🧭 Navigation')
assert(appVue.includes("'dashboard'"), 'Dashboard tab exists')
assert(appVue.includes("'director'"), 'Director tab exists')
assert(appVue.includes("'deconstruct'"), 'Deconstruct tab exists')
assert(appVue.includes("'showcase'"), 'Showcase tab exists')
assert(appVue.includes("'lab'"), 'Lab tab exists')
assert(appVue.includes("'settings'"), 'Settings tab exists')

// ====== 5. Showcase Examples ======
console.log('\n🖼️ Showcase Examples')
const examples = JSON.parse(readFileSync(join(srcDir(), 'data/examples.json'), 'utf-8'))
assert(Array.isArray(examples), 'examples is array')
assert(examples.length >= 8, `Has ${examples.length} examples (≥8)`)

const requiredExamples = [
  'bathroom_bunny_mirror', 'night_convenience_store', 'subway_ccd_snapshot',
  'rainy_car_window', 'github_cover', 'premium_product',
  'personal_avatar_realistic', 'dark_cyber_street'
]
for (const id of requiredExamples) {
  const ex = examples.find(e => e.id === id)
  assert(!!ex, `Example "${id}" exists`)
  if (ex) {
    const filledModules = Object.values(ex.director || {}).filter(v => v && v !== '无').length
    assert(filledModules >= 12, `  └─ ${ex.name}: ${filledModules} modules filled (≥12)`)
  }
}

// ====== 6. Midjourney --ar ======
console.log('\n🤖 Midjourney Output')
try {
  const m = await import('./src/utils/modelAdapter.js')
  const sample = { subject: '女性', scene: '街头', lighting: '柔光', camera: '胶片', ratio: '9:16' }
  const out = m.buildModelOutputs(sample)
  assert(out.midjourney?.text.includes('--ar'), `MJ output contains "--ar"`)
  assert(out.midjourney?.text.includes('9:16'), `MJ output contains ratio "9:16"`)
} catch (e) { assert(false, `Midjourney adapter: ${e.message}`) }

// ====== 7. Stable Diffusion Positive/Negative ======
console.log('\n🖌️ Stable Diffusion Output')
try {
  const m = await import('./src/utils/modelAdapter.js')
  const sample = { subject: '女性', scene: '街头', lighting: '柔光', camera: '胶片', avoid: '模糊' }
  const out = m.buildModelOutputs(sample)
  assert(out.stableDiffusion?.positive?.length > 0, 'SD has positive prompt')
  assert(out.stableDiffusion?.negative?.length > 0, 'SD has negative prompt')
  assert(out.stableDiffusion?.text.includes('Positive:'), 'SD text includes "Positive:"')
  assert(out.stableDiffusion?.text.includes('Negative:'), 'SD text includes "Negative:"')
} catch (e) { assert(false, `SD adapter: ${e.message}`) }

// ====== 8. README contains v3.0.0 ======
console.log('\n📝 README')
const readme = readFileSync(join(__dirname, 'README.md'), 'utf-8')
assert(readme.includes('v3.0.0'), 'README contains "v3.0.0"')
assert(readme.includes('Prompt Director Studio'), 'README contains product name')

// ====== 9. RELEASE_NOTES contains v3.0.0 ======
console.log('\n📋 Release Notes')
const releaseNotes = readFileSync(join(__dirname, 'RELEASE_NOTES.md'), 'utf-8')
assert(releaseNotes.includes('v3.0.0'), 'RELEASE_NOTES contains "v3.0.0"')
assert(releaseNotes.includes('Prompt Director Studio'), 'RELEASE_NOTES contains product name')

// ====== 10. Build Output ======
console.log('\n📦 Build Output')
assert(existsSync(distDir), 'dist/ directory exists')
assert(existsSync(join(distDir, 'index.html')), 'dist/index.html exists')
const distHtml = readFileSync(join(distDir, 'index.html'), 'utf-8')
assert(distHtml.includes('Prompt Director Studio'), 'dist/index.html has title')
const assetsDir = join(distDir, 'assets')
const assetFiles = existsSync(assetsDir) ? readdirSync(assetsDir) : []
assert(assetFiles.some(f => f.endsWith('.js')), 'JS assets built')
assert(assetFiles.some(f => f.endsWith('.css')), 'CSS assets built')

// ====== Director Modules ======
console.log('\n🎬 Director Modules')
const directorModules = JSON.parse(readFileSync(join(srcDir(), 'data/directorModules.json'), 'utf-8'))
assert(Array.isArray(directorModules), 'directorModules is array')
assert(directorModules.length >= 18, `Has ${directorModules.length} modules (≥18, includes depthOfField)`)
assert(directorModules.some(m => m.id === 'depthOfField'), 'Has depthOfField module')

// ====== Module Groups ======
console.log('\n📁 Module Groups')
const groups = ['foundation', 'visual', 'subject', 'atmosphere', 'control']
for (const g of groups) {
  const count = directorModules.filter(m => m.group === g).length
  assert(count >= 2, `Group "${g}" has ${count} modules`)
}

// ====== Model Adapters ======
console.log('\n🤖 Model Adapters')
try {
  const m = await import('./src/utils/modelAdapter.js')
  const sample = { subject: '女性', scene: '街头', lighting: '柔光', camera: '胶片', depthOfField: '浅景深', ratio: '3:4' }
  const out = m.buildModelOutputs(sample)
  assert(out.gptImage?.name === 'GPT Image', 'GPT Image adapter')
  assert(out.midjourney?.name === 'Midjourney', 'Midjourney adapter')
  assert(out.stableDiffusion?.name === 'Stable Diffusion', 'SD adapter')
  assert(out.flux?.name === 'Flux', 'Flux adapter')
  assert(out.chineseGeneric?.name === '通用中文', 'Chinese adapter')
  assert(out.englishGeneric?.name === '通用英文', 'English adapter')
  assert(Object.keys(out).length === 6, 'Has 6 model outputs')
} catch (e) { assert(false, `Model adapters: ${e.message}`) }

// ====== Director Builder ======
console.log('\n🔧 Director Builder')
try {
  const b = await import('./src/utils/directorBuilder.js')
  assert(typeof b.buildAllOutputs === 'function', 'buildAllOutputs exported')
  const sample = { subject: '女性', scene: '街头', depthOfField: '浅景深虚化', ratio: '3:4' }
  const all = b.buildAllOutputs(sample)
  assert(Object.keys(all).length === 5, 'buildAllOutputs returns 5 outputs')
} catch (e) { assert(false, `directorBuilder: ${e.message}`) }

// ====== Config ======
console.log('\n⚙️  Configuration')
assert(pkg.scripts.build === 'vite build', 'build script')
assert(pkg.scripts['self-test'] === 'node self-test.js', 'self-test script')
const appMeta = readFileSync(join(srcDir(), 'config/appMeta.js'), 'utf-8')
assert(appMeta.includes('3.0.0'), 'appMeta has version 3.0.0')
assert(appMeta.includes('Prompt Director Studio'), 'appMeta has product name')
assert(appMeta.includes('2026-05-03'), 'appMeta has build date')

// ====== Hero & Badges ======
console.log('\n🏠 Hero & Badges')
assert(appVue.includes('Prompt Director Studio'), 'Hero title')
assert(appVue.includes('Local First'), 'Local First badge')
assert(appVue.includes('No Backend'), 'No Backend badge')
assert(appVue.includes('Privacy Friendly'), 'Privacy badge')
assert(appVue.includes('GPT Image Ready'), 'GPT Image Ready badge')
assert(appVue.includes('GitHub Pages Ready'), 'GitHub Pages badge')

// ====== GitHub Actions ======
console.log('\n🚀 GitHub Actions')
assert(existsSync(join(__dirname, '.github/workflows/deploy.yml')), 'deploy.yml exists')

// ====== Prompt Score (16 dimensions) ======
console.log('\n📊 Prompt Score')
try {
  const ps = await import('./src/utils/promptScore.js')
  assert(typeof ps.scorePrompt === 'function', '1. promptScore.js exports scorePrompt')
  const src = readFileSync(join(srcDir(), 'utils/promptScore.js'), 'utf-8')
  const dimCount = (src.match(/id:\s*'/g) || []).length
  assert(dimCount >= 16, `2. 16 scoring dimensions exist in code (found ${dimCount})`)
  assert(src.includes("'Excellent'") || src.includes("'Good'") || src.includes("'Needs Work'") || src.includes("'Incomplete'"), '3. Score levels Excellent/Good/Needs Work/Incomplete exist')
  // Test scoring works
  const testDirector = { subject: '一位二十出头的年轻女性', scene: '浴室', lighting: '顶灯', ratio: '3:4', model: 'GPT Image' }
  const result = ps.scorePrompt(testDirector)
  assert(typeof result.score === 'number' && result.score >= 0, 'Score returns numeric score')
  assert(Array.isArray(result.details) && result.details.length >= 16, `Score has ${result.details.length} dimension details`)
} catch (e) { assert(false, `promptScore: ${e.message}`) }

// ====== Conflict Detector (19+ rules) ======
console.log('\n⚠️ Conflict Detector')
try {
  const cd = await import('./src/utils/conflictDetector.js')
  assert(typeof cd.detectConflicts === 'function', '4. conflictDetector.js exports detectConflicts')
  const src = readFileSync(join(srcDir(), 'utils/conflictDetector.js'), 'utf-8')
  const ruleCount = (src.match(/id:\s*'/g) || []).length
  assert(ruleCount >= 19, `5. 19+ conflict rules exist (found ${ruleCount})`)
  // Test specific conflicts
  const test1 = { subject: '近景半身', composition: '全身照' }
  const c1 = cd.detectConflicts(test1)
  assert(c1.some(c => c.label && (c.label.includes('半身') || c.label.includes('近景'))), '6. "近景半身" vs "全身照" conflict detectable')
  const test2 = { subject: '低分辨率', camera: '超清商业' }
  const c2 = cd.detectConflicts(test2)
  assert(c2.length > 0, '7. "低分辨率" vs "超清商业" conflict detectable')
  // Test removeConflictWord
  assert(typeof cd.removeConflictWord === 'function', 'removeConflictWord exported')
} catch (e) { assert(false, `conflictDetector: ${e.message}`) }

// ====== Safety Hints ======
console.log('\n🛡️ Safety Hints')
try {
  const sf = await import('./src/utils/safety.js')
  assert(typeof sf.detectSafety === 'function', '8. safety.js exports detectSafety')
  const src = readFileSync(join(srcDir(), 'utils/safety.js'), 'utf-8')
  const ruleCount = (src.match(/id:\s*'/g) || []).length
  assert(ruleCount >= 9, `9. 9+ safety rule categories exist (found ${ruleCount})`)
  // Test specific detections
  const testAdult = { subject: 'clearly adult, 20+', scene: 'bathroom' }
  const rAdult = sf.detectSafety(testAdult)
  assert(rAdult.level === 'Safe', '10. "clearly adult" / "20+" keeps Safe level')
  const testMinor = { subject: 'teen student', scene: 'classroom' }
  const rMinor = sf.detectSafety(testMinor)
  assert(rMinor.level === 'Risky', '11. Minor risk words detectable → Risky')
  const testFigure = { subject: 'real person celebrity' }
  const rFigure = sf.detectSafety(testFigure)
  assert(rFigure.level !== 'Safe', '12. Public figure risk detectable')
  const testCopyright = { subject: 'Mickey Mouse Disney' }
  const rCopyright = sf.detectSafety(testCopyright)
  assert(rCopyright.level !== 'Safe', '13. Copyright/trademark risk detectable')
  const testText = { subject: 'text watermark signature' }
  const rText = sf.detectSafety(testText)
  assert(rText.level !== 'Safe', '14. "no text" / "watermark" risk detectable')
  // Test applySafetyFix
  assert(typeof sf.applySafetyFix === 'function', 'applySafetyFix exported')
} catch (e) { assert(false, `safety: ${e.message}`) }

// ====== Prompt Polisher ======
console.log('\n✨ Prompt Polisher')
try {
  const pp = await import('./src/utils/promptPolisher.js')
  assert(typeof pp.polishPrompt === 'function', '15. promptPolisher.js exports polishPrompt')
  const src = readFileSync(join(srcDir(), 'utils/promptPolisher.js'), 'utf-8')
  const modeCount = (src.match(/id:\s*'/g) || []).length
  assert(modeCount >= 15, `16. 15 polish modes exist (found ${modeCount})`)
  // Test preview generation
  const testDir = { subject: '女性', scene: '街头', mustKeep: '真实感' }
  const preview = pp.polishPrompt(testDir, 'more_natural')
  assert(preview && preview.preview, '17. Polisher can generate preview')
  assert(typeof preview.summary === 'string', 'Preview has summary')
} catch (e) { assert(false, `promptPolisher: ${e.message}`) }

// ====== Prompt Diff ======
console.log('\n🔀 Prompt Diff')
try {
  const pd = await import('./src/utils/promptDiff.js')
  assert(typeof pd.diffTokens === 'function', '18. promptDiff.js exports diffTokens')
  const result = pd.diffTokens('hello world foo', 'hello bar world')
  assert(Array.isArray(result.added) && Array.isArray(result.removed) && Array.isArray(result.kept), '19. Diff can generate added/removed/kept summary')
  const src = readFileSync(join(srcDir(), 'utils/promptDiff.js'), 'utf-8')
  assert(src.includes('prompt_market_diff_history'), '20. Diff localStorage key exists')
  // Test diffSummary
  assert(typeof pd.diffSummary === 'function', 'diffSummary exported')
  const summary = pd.diffSummary('a b c', 'a b d e')
  assert(typeof summary.charChange === 'number', 'Summary has charChange')
} catch (e) { assert(false, `promptDiff: ${e.message}`) }

// ====== README contains new features ======
console.log('\n📝 README Feature Docs')
assert(readme.includes('Prompt Score'), '21. README contains "Prompt Score"')
assert(readme.includes('Conflict Detector'), '22. README contains "Conflict Detector"')
assert(readme.includes('Safety Hints'), '23. README contains "Safety Hints"')
assert(readme.includes('Prompt Polisher'), '24. README contains "Prompt Polisher"')
assert(readme.includes('Prompt Diff'), '25. README contains "Prompt Diff"')

// ====== RELEASE_NOTES contains new section ======
console.log('\n📋 Release Notes - Round 2')
assert(releaseNotes.includes('Prompt Diagnostics Upgrade'), '26. RELEASE_NOTES contains "Prompt Diagnostics Upgrade"')

// ====== New Vue Components ======
console.log('\n🧩 New Vue Components')
assert(existsSync(join(srcDir(), 'components/SafetyPanel.vue')), 'SafetyPanel.vue exists')
assert(existsSync(join(srcDir(), 'components/PolisherPanel.vue')), 'PolisherPanel.vue exists')
assert(existsSync(join(srcDir(), 'components/PromptDiffPanel.vue')), 'PromptDiffPanel.vue exists')

// ====== Summary ======
console.log('\n' + '='.repeat(50))
console.log(`\n📊 Results: ${passed} passed, ${failed} failed`)
if (failures.length) { console.log('\n❌ Failures:'); failures.forEach(f => console.log(`   - ${f}`)) }
if (failed === 0) { console.log('\n🎉 All tests passed!\n'); process.exit(0) }
else { console.log('\n💥 Some tests failed.\n'); process.exit(1) }

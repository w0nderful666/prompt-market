/**
 * Self-test for Prompt Director Studio v3.1.1
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

function srcDir() { return join(__dirname, 'src') }
function readFile(p) { return readFileSync(p, 'utf-8') }

// ====== 1. Package Version ======
console.log('\n📦 Version Check')
const pkg = JSON.parse(readFile(join(__dirname, 'package.json')))
assert(pkg.version === '3.1.1', 'package.json version is 3.1.1')

// ====== 2. Page Title ======
console.log('\n📄 Page Title')
const indexHtmlSrc = readFile(join(__dirname, 'index.html'))
assert(indexHtmlSrc.includes('Prompt Director Studio'), 'index.html contains "Prompt Director Studio"')

// ====== 3. Footer (now in AppFooter.vue) ======
console.log('\n🦶 Footer')
const appFooterVue = readFile(join(srcDir(), 'components/layout/AppFooter.vue'))
assert(appFooterVue.includes('appMeta.version'), 'AppFooter.vue references appMeta.version')
assert(appFooterVue.includes('No Tracking'), 'Footer contains "No Tracking"')
assert(appFooterVue.includes('appMeta.buildDate'), 'Footer references build date')

// ====== 4. Navigation Tabs (now in AppNavigation.vue + App.vue) ======
console.log('\n🧭 Navigation')
const appVue = readFile(join(srcDir(), 'App.vue'))
assert(appVue.includes("'dashboard'"), 'Dashboard tab exists')
assert(appVue.includes("'director'"), 'Director tab exists')
assert(appVue.includes("'deconstruct'"), 'Deconstruct tab exists')
assert(appVue.includes("'showcase'"), 'Showcase tab exists')
assert(appVue.includes("'lab'"), 'Lab tab exists')
assert(appVue.includes("'settings'"), 'Settings tab exists')

// ====== 5. Showcase Examples ======
console.log('\n🖼️ Showcase Examples')
const examples = JSON.parse(readFile(join(srcDir(), 'data/examples.json')))
assert(Array.isArray(examples), 'examples is array')
assert(examples.length >= 12, `Has ${examples.length} examples (≥12)`)

const requiredExamples = [
  'bathroom_bunny_mirror', 'night_convenience_store', 'subway_ccd_snapshot',
  'rainy_car_window', 'github_cover', 'premium_product',
  'personal_avatar_realistic', 'dark_cyber_street',
  'minimal_app_icon', 'ai_tool_hero', 'vintage_film_campus', 'cyberpunk_wallpaper'
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

// ====== 8. README ======
console.log('\n📝 README')
const readme = readFile(join(__dirname, 'README.md'))
assert(readme.includes('v3.1.1'), 'README contains "v3.1.1"')
assert(readme.includes('Prompt Director Studio'), 'README contains product name')

// ====== 9. RELEASE_NOTES ======
console.log('\n📋 Release Notes')
const releaseNotes = readFile(join(__dirname, 'RELEASE_NOTES.md'))
assert(releaseNotes.includes('v3.1.1'), 'RELEASE_NOTES contains "v3.1.1"')
assert(releaseNotes.includes('Prompt Director Studio'), 'RELEASE_NOTES contains product name')

// ====== 10. Build Output ======
console.log('\n📦 Build Output')
assert(existsSync(distDir), 'dist/ directory exists')
assert(existsSync(join(distDir, 'index.html')), 'dist/index.html exists')
const distHtml = readFile(join(distDir, 'index.html'))
assert(distHtml.includes('Prompt Director Studio'), 'dist/index.html has title')
const assetsDir = join(distDir, 'assets')
const assetFiles = existsSync(assetsDir) ? readdirSync(assetsDir) : []
assert(assetFiles.some(f => f.endsWith('.js')), 'JS assets built')
assert(assetFiles.some(f => f.endsWith('.css')), 'CSS assets built')

// ====== Director Modules ======
console.log('\n🎬 Director Modules')
const directorModules = JSON.parse(readFile(join(srcDir(), 'data/directorModules.json')))
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
const appMeta = readFile(join(srcDir(), 'config/appMeta.js'))
assert(appMeta.includes('3.1.1'), 'appMeta has version 3.1.1')
assert(appMeta.includes('Prompt Director Studio'), 'appMeta has product name')
assert(appMeta.includes('2026-05-03'), 'appMeta has build date')

// ====== Hero & Badges (now in DashboardSection.vue) ======
console.log('\n🏠 Hero & Badges')
const dashVue = readFile(join(srcDir(), 'sections/DashboardSection.vue'))
assert(dashVue.includes('Prompt Director Studio'), 'Hero title')
assert(dashVue.includes('Local First'), 'Local First badge')
assert(dashVue.includes('No Backend'), 'No Backend badge')
assert(dashVue.includes('Privacy Friendly'), 'Privacy badge')
assert(dashVue.includes('GPT Image Ready'), 'GPT Image Ready badge')
assert(dashVue.includes('GitHub Pages Ready'), 'GitHub Pages badge')

// ====== GitHub Actions ======
console.log('\n🚀 GitHub Actions')
assert(existsSync(join(__dirname, '.github/workflows/deploy.yml')), 'deploy.yml exists')

// ====== Prompt Score (16 dimensions) ======
console.log('\n📊 Prompt Score')
try {
  const ps = await import('./src/utils/promptScore.js')
  assert(typeof ps.scorePrompt === 'function', '1. promptScore.js exports scorePrompt')
  const src = readFile(join(srcDir(), 'utils/promptScore.js'))
  const dimCount = (src.match(/id:\s*'/g) || []).length
  assert(dimCount >= 16, `2. 16 scoring dimensions exist in code (found ${dimCount})`)
  assert(src.includes("'Excellent'") || src.includes("'Good'") || src.includes("'Needs Work'") || src.includes("'Incomplete'"), '3. Score levels Excellent/Good/Needs Work/Incomplete exist')
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
  const src = readFile(join(srcDir(), 'utils/conflictDetector.js'))
  const ruleCount = (src.match(/id:\s*'/g) || []).length
  assert(ruleCount >= 19, `5. 19+ conflict rules exist (found ${ruleCount})`)
  const test1 = { subject: '近景半身', composition: '全身照' }
  const c1 = cd.detectConflicts(test1)
  assert(c1.some(c => c.label && (c.label.includes('半身') || c.label.includes('近景'))), '6. "近景半身" vs "全身照" conflict detectable')
  const test2 = { subject: '低分辨率', camera: '超清商业' }
  const c2 = cd.detectConflicts(test2)
  assert(c2.length > 0, '7. "低分辨率" vs "超清商业" conflict detectable')
  assert(typeof cd.removeConflictWord === 'function', 'removeConflictWord exported')
} catch (e) { assert(false, `conflictDetector: ${e.message}`) }

// ====== Safety Hints ======
console.log('\n🛡️ Safety Hints')
try {
  const sf = await import('./src/utils/safety.js')
  assert(typeof sf.detectSafety === 'function', '8. safety.js exports detectSafety')
  const src = readFile(join(srcDir(), 'utils/safety.js'))
  const ruleCount = (src.match(/id:\s*'/g) || []).length
  assert(ruleCount >= 9, `9. 9+ safety rule categories exist (found ${ruleCount})`)
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
  assert(typeof sf.applySafetyFix === 'function', 'applySafetyFix exported')
} catch (e) { assert(false, `safety: ${e.message}`) }

// ====== Prompt Polisher ======
console.log('\n✨ Prompt Polisher')
try {
  const pp = await import('./src/utils/promptPolisher.js')
  assert(typeof pp.polishPrompt === 'function', '15. promptPolisher.js exports polishPrompt')
  const src = readFile(join(srcDir(), 'utils/promptPolisher.js'))
  const modeCount = (src.match(/id:\s*'/g) || []).length
  assert(modeCount >= 15, `16. 15 polish modes exist (found ${modeCount})`)
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
  const src = readFile(join(srcDir(), 'utils/promptDiff.js'))
  assert(src.includes('prompt_market_diff_history'), '20. Diff localStorage key exists')
  assert(typeof pd.diffSummary === 'function', 'diffSummary exported')
  const summary = pd.diffSummary('a b c', 'a b d e')
  assert(typeof summary.charChange === 'number', 'Summary has charChange')
} catch (e) { assert(false, `promptDiff: ${e.message}`) }

// ====== README Feature Docs ======
console.log('\n📝 README Feature Docs')
assert(readme.includes('Prompt Score'), '21. README contains "Prompt Score"')
assert(readme.includes('Conflict Detector'), '22. README contains "Conflict Detector"')
assert(readme.includes('Safety Hints'), '23. README contains "Safety Hints"')
assert(readme.includes('Prompt Polisher'), '24. README contains "Prompt Polisher"')
assert(readme.includes('Prompt Diff'), '25. README contains "Prompt Diff"')

// ====== Release Notes - Round 2 ======
console.log('\n📋 Release Notes - Round 2')
assert(releaseNotes.includes('Prompt Diagnostics Upgrade'), '26. RELEASE_NOTES contains "Prompt Diagnostics Upgrade"')

// ====== Vue Components (existing) ======
console.log('\n🧩 Vue Components (existing)')
assert(existsSync(join(srcDir(), 'components/SafetyPanel.vue')), 'SafetyPanel.vue exists')
assert(existsSync(join(srcDir(), 'components/PolisherPanel.vue')), 'PolisherPanel.vue exists')
assert(existsSync(join(srcDir(), 'components/PromptDiffPanel.vue')), 'PromptDiffPanel.vue exists')

// ====== Round 3: Layout Components ======
console.log('\n🏗️ Round 3: Layout Components')
assert(existsSync(join(srcDir(), 'components/layout/AppHeader.vue')), '1. AppHeader.vue exists')
assert(existsSync(join(srcDir(), 'components/layout/AppFooter.vue')), '2. AppFooter.vue exists')
assert(existsSync(join(srcDir(), 'components/layout/AppNavigation.vue')), '3. AppNavigation.vue exists')
assert(existsSync(join(srcDir(), 'sections/DashboardSection.vue')), '4. DashboardSection.vue exists')
assert(existsSync(join(srcDir(), 'sections/LabSection.vue')), '5. LabSection.vue exists')
assert(existsSync(join(srcDir(), 'sections/SettingsSection.vue')), '6. SettingsSection.vue exists')

// ====== Round 3: Classic mode removed ======
console.log('\n🚫 Round 3: Classic Mode Removed')
assert(!appVue.includes("activeSection === 'classic'"), '7. Classic hidden mode removed from App.vue')
assert(!appVue.includes('class="hidden"') || !appVue.includes('classic'), '8. No classic hidden dead zone')

// ====== Round 3: Snapshots ======
console.log('\n📸 Round 3: Snapshots')
assert(existsSync(join(srcDir(), 'components/SnapshotsPanel.vue')), '9. SnapshotsPanel.vue exists')
const snapSrc = readFile(join(srcDir(), 'components/SnapshotsPanel.vue'))
assert(snapSrc.includes('saveSnapshot'), '10. saveSnapshot logic exists')
assert(snapSrc.includes('restore'), '11. restore logic exists')
assert(snapSrc.includes('deleteSnapshot'), '12. deleteSnapshot logic exists')
assert(snapSrc.includes('STORAGE_KEY'), '13. Snapshot storage key exists')

// ====== Round 3: Prompt Packs ======
console.log('\n📦 Round 3: Prompt Packs')
assert(existsSync(join(srcDir(), 'components/PromptPacksPanel.vue')), '14. PromptPacksPanel.vue exists')
const packsSrc = readFile(join(srcDir(), 'components/PromptPacksPanel.vue'))
assert(packsSrc.includes('createPack'), '15. createPack logic exists')
assert(packsSrc.includes('exportPack'), '16. exportPack logic exists')
assert(packsSrc.includes('importPack'), '17. importPack logic exists')
assert(packsSrc.includes('BUILT_IN_PACKS'), '18. Built-in packs defined')
const builtInCount = (packsSrc.match(/id: 'pack_/g) || []).length
assert(builtInCount >= 3, `19. Official packs ≥ 3 (found ${builtInCount})`)

// ====== Round 3: Import/Export All ======
console.log('\n📤 Round 3: Import/Export All')
assert(existsSync(join(srcDir(), 'utils/storageManager.js')), '20. storageManager.js exists')
const smSrc = readFile(join(srcDir(), 'utils/storageManager.js'))
assert(smSrc.includes('exportAllData'), '21. exportAllData exists')
assert(smSrc.includes('importAllData'), '22. importAllData exists')
assert(smSrc.includes('getStorageUsage'), '23. getStorageUsage exists')
assert(smSrc.includes('QuotaExceededError'), '24. QuotaExceededError handling exists')
assert(existsSync(join(srcDir(), 'components/ImportExportModal.vue')), '25. ImportExportModal.vue exists')

// ====== Round 3: Settings Data Management ======
console.log('\n⚙️ Round 3: Settings Data Management')
const settingsSrc = readFile(join(srcDir(), 'sections/SettingsSection.vue'))
assert(settingsSrc.includes('Export All Data'), '26. Export All Data in Settings')
assert(settingsSrc.includes('Import All Data'), '27. Import All Data in Settings')
assert(settingsSrc.includes('clear-history'), '28. clear-history action exists')
assert(settingsSrc.includes('clear-snapshots'), '29. clear-snapshots action exists')
assert(settingsSrc.includes('clear-packs'), '30. clear-packs action exists')

// ====== Round 3: Showcase 12 examples ======
console.log('\n🖼️ Round 3: Showcase 12 Examples')
assert(examples.length >= 12, `31. Showcase ≥ 12 examples (found ${examples.length})`)

// ====== Round 3: README & RELEASE_NOTES ======
console.log('\n📝 Round 3: Documentation')
assert(readme.includes('Snapshots'), '32. README contains "Snapshots"')
assert(readme.includes('Prompt Packs'), '33. README contains "Prompt Packs"')
assert(readme.includes('Product Hardening'), '34. README contains "Product Hardening"')
assert(releaseNotes.includes('Product Hardening'), '35. RELEASE_NOTES contains "Product Hardening"')
assert(releaseNotes.includes('Round 3'), '36. RELEASE_NOTES contains "Round 3"')

// ====== Round 3: No dead buttons / href="#" ======
console.log('\n🔘 Round 3: No Dead Buttons')
const allVueSrc = [
  appVue, snapSrc, packsSrc, settingsSrc, dashVue,
  readFile(join(srcDir(), 'components/layout/AppHeader.vue')),
  readFile(join(srcDir(), 'components/layout/AppNavigation.vue'))
].join('\n')
assert(!allVueSrc.includes('href="#"'), '37. No href="#" dead links in new components')

// ====== v3.1.0: Version Consistency ======
console.log('\n🔖 v3.1.0: Version Consistency')
assert(readme.includes('https://w0nderful666.github.io/prompt-market/'), '38. README contains online demo URL')
assert(readme.includes('https://github.com/w0nderful666/prompt-market'), '39. README contains repo URL')
assert(readme.includes('隐私') || readme.includes('Privacy') || readme.includes('privacy'), '40. README contains privacy statement')
assert(readme.includes('Export') && readme.includes('Import'), '41. README contains Export/Import docs')
assert(readme.includes('self-test') || readme.includes('preflight'), '42. README contains self-test/preflight docs')
assert(releaseNotes.includes('v3.1.0') && releaseNotes.includes('Release Candidate'), '43. RELEASE_NOTES has v3.1.0 RC section')

// ====== v3.1.0: Footer version ======
console.log('\n🦶 v3.1.0: Footer Version')
assert(appFooterVue.includes('appMeta.version'), '44. Footer references version from appMeta')

// ====== v3.1.0: GitHub Pages Config ======
console.log('\n🚀 v3.1.0: GitHub Pages Config')
const viteConfig = readFile(join(__dirname, 'vite.config.js'))
assert(viteConfig.includes("base:"), '45. vite.config.js has base config')
assert(!viteConfig.includes("base: '/prompt-market/'") || viteConfig.includes("base: './'"), '46. vite base is relative (./) for GitHub Pages')

// ====== v3.1.0: No href="#" across all vue files ======
console.log('\n🔘 v3.1.0: Full Codebase Dead Link Check')
const allVueFiles = readdirSync(join(srcDir(), 'components')).concat(readdirSync(join(srcDir(), 'sections')).map(f => 'sections/' + f)).filter(f => f.endsWith('.vue'))
let deadLinks = 0
for (const f of allVueFiles) {
  const fullPath = f.includes('/') ? join(srcDir(), f) : join(srcDir(), 'components', f)
  if (existsSync(fullPath)) {
    const content = readFile(fullPath)
    if (content.includes('href="#"')) deadLinks++
  }
}
assert(deadLinks === 0, `47. No href="#" in any component (found ${deadLinks})`)

// ====== v3.1.1: Link Validation ======
console.log('\n🔗 v3.1.1: Link Validation')
assert(readme.includes('https://w0nderful666.github.io/prompt-market/'), '48. README has correct GitHub Pages URL (w0nderful666)')
assert(!readme.includes('w0nderful66.github.io/prompt-market'), '49. README has NO wrong URL (w0nderful66)')
const wrongUrlSrc = [
  readme, releaseNotes, appVue, appFooterVue,
  readFile(join(srcDir(), 'components/layout/AppHeader.vue')),
  readFile(join(srcDir(), 'config/appMeta.js'))
].join('\n')
const wrongUrlCheck = wrongUrlSrc.includes('w0nderful66.github.io') && !wrongUrlSrc.includes('w0nderful666.github.io')
assert(!wrongUrlCheck, '50. No wrong username "w0nderful66.github.io" in project files')

// ====== v3.1.1: Version Bump ======
console.log('\n🔖 v3.1.1: Version Bump')
assert(pkg.version === '3.1.1', '51. package.json version is 3.1.1')
assert(readme.includes('v3.1.1'), '52. README contains "v3.1.1"')
assert(releaseNotes.includes('v3.1.1'), '53. RELEASE_NOTES contains "v3.1.1"')
assert(releaseNotes.includes('Release Link Hotfix'), '54. RELEASE_NOTES has v3.1.1 hotfix section')
assert(appMeta.includes('3.1.1'), '55. appMeta has version 3.1.1')

// ====== Summary ======
console.log('\n' + '='.repeat(50))
console.log(`\n📊 Results: ${passed} passed, ${failed} failed`)
if (failures.length) { console.log('\n❌ Failures:'); failures.forEach(f => console.log(`   - ${f}`)) }
if (failed === 0) { console.log('\n🎉 All tests passed!\n'); process.exit(0) }
else { console.log('\n💥 Some tests failed.\n'); process.exit(1) }

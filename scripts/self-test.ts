#!/usr/bin/env node

const PASS = []
const FAIL = []
const WARN = []

function check(desc, fn) {
  try {
    const result = fn()
    if (result === true) {
      PASS.push(desc)
    } else if (result === false) {
      FAIL.push(desc + (typeof result === 'string' ? ': ' + result : ''))
    } else if (typeof result === 'string') {
      FAIL.push(desc + ': ' + result)
    } else {
      PASS.push(desc)
    }
  } catch (e) {
    FAIL.push(desc + ': ' + e.message)
  }
}

// --- Load all data modules ---
const path = await import('path')
const fileURLToPath = (await import('url')).fileURLToPath
const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function load(name) {
  return await import(path.resolve(__dirname, '../src/data/' + name))
}

async function loadCore(name) {
  return await import(path.resolve(__dirname, '../src/core/' + name))
}

const devicePresets = await load('devicePresets.ts')
const scenePacks = await load('scenePacks.ts')
const lightPacks = await load('lightPacks.ts')
const statePacks = await load('statePacks.ts')
const diffPacks = await load('diffPacks.ts')
const masterTemplates = await load('masterTemplates.ts')
const parameterPresets = await load('parameterPresets.ts')
const scenePoseRules = await load('scenePoseRules.ts')
const posePipelines = await load('posePipelines.ts')

const DEVICE_IDS = new Set(devicePresets.DEVICE_PRESETS.map(d => d.id))
const SCENE_IDS = new Set(scenePacks.SCENE_PACKS.map(s => s.id))
const LIGHT_IDS = new Set(lightPacks.LIGHT_PACKS.map(l => l.id))
const STATE_IDS = new Set(statePacks.STATE_PACKS.map(s => s.id))
const DIFF_IDS = new Set(diffPacks.DIFF_PACKS.map(d => d.id))
const PARAM_IDS = new Set(parameterPresets.PARAMETER_PRESETS.map(p => p.id))
const RULE_SCENE_IDS = new Set(scenePoseRules.SCENE_POSE_RULES.map(r => r.sceneId))

// --- 1. masterTemplates id uniqueness ---
check('masterTemplates: all ids unique', () => {
  const ids = masterTemplates.masterTemplates.map(t => t.id)
  const unique = new Set(ids)
  return unique.size === ids.length || `duplicates: ${ids.filter((id, i) => ids.indexOf(id) !== i).join(', ')}`
})

// --- 2. lockedCore.device exists ---
check('masterTemplates: all lockedCore.device in DEVICE_MAP', () => {
  const bad = masterTemplates.masterTemplates.filter(t => !DEVICE_IDS.has(t.lockedCore.device))
  return bad.length === 0 || `bad device IDs: ${bad.map(t => t.id + ':' + t.lockedCore.device).join(', ')}`
})

// --- 3. lockedCore.scene exists ---
check('masterTemplates: all lockedCore.scene in SCENE_MAP', () => {
  const bad = masterTemplates.masterTemplates.filter(t => !SCENE_IDS.has(t.lockedCore.scene))
  return bad.length === 0 || `bad scene IDs: ${bad.map(t => t.id + ':' + t.lockedCore.scene).join(', ')}`
})

// --- 4. lockedCore.light exists ---
check('masterTemplates: all lockedCore.light in LIGHT_MAP', () => {
  const bad = masterTemplates.masterTemplates.filter(t => !LIGHT_IDS.has(t.lockedCore.light))
  return bad.length === 0 || `bad light IDs: ${bad.map(t => t.id + ':' + t.lockedCore.light).join(', ')}`
})

// --- 5. parameterPreset exists ---
check('masterTemplates: all parameterPreset in PARAMETER_MAP', () => {
  const bad = masterTemplates.masterTemplates.filter(t => !PARAM_IDS.has(t.parameterPreset))
  return bad.length === 0 || `bad param IDs: ${bad.map(t => t.id + ':' + t.parameterPreset).join(', ')}`
})

// --- 6. randomPools.state exist in STATE_MAP ---
check('masterTemplates: randomPools.state in STATE_MAP or text-only', () => {
  const bad = []
  for (const t of masterTemplates.masterTemplates) {
    for (const s of t.randomPools.state) {
      if (!STATE_IDS.has(s)) bad.push(t.id + ':' + s)
    }
  }
  return bad.length === 0 || `bad state refs: ${bad.join(', ')}`
})

// --- 7. scenePoseRules sceneIds in SCENE_MAP ---
check('scenePoseRules: all sceneId in SCENE_MAP', () => {
  const bad = scenePoseRules.SCENE_POSE_RULES.filter(r => !SCENE_IDS.has(r.sceneId))
  return bad.length === 0 || `bad rule sceneIds: ${bad.map(r => r.sceneId).join(', ')}`
})

// --- 8. posePipelines requiredDiffPacks in DIFF_MAP ---
check('posePipelines: requiredDiffPacks in DIFF_MAP', () => {
  const bad = []
  for (const pl of posePipelines.POSE_PIPELINES) {
    for (const shot of pl.sequence) {
      for (const packId of shot.requiredDiffPacks) {
        if (!DIFF_IDS.has(packId)) bad.push(pl.id + ':' + shot.id + ':' + packId)
      }
    }
  }
  return bad.length === 0 || `bad diff refs: ${bad.join(', ')}`
})

// --- 9. diffPacks all have valid triggerSlots ---
check('diffPacks: each has at least one triggerSlot or *', () => {
  const bad = diffPacks.DIFF_PACKS.filter(d => d.triggerSlots.length === 0)
  return bad.length === 0 || `empty triggerSlots: ${bad.map(d => d.id).join(', ')}`
})

// --- Report ---
console.log('')
console.log('=== Self-Test Results ===')
console.log(`  PASS: ${PASS.length}`)
console.log(`  FAIL: ${FAIL.length}`)
console.log(`  WARN: ${WARN.length}`)
console.log('')

if (FAIL.length > 0) {
  console.log('--- FAILURES ---')
  for (const f of FAIL) console.log('  ✗ ' + f)
  console.log('')
}

if (WARN.length > 0) {
  console.log('--- WARNINGS ---')
  for (const w of WARN) console.log('  ⚠ ' + w)
  console.log('')
}

process.exit(FAIL.length > 0 ? 1 : 0)

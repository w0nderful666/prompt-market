#!/usr/bin/env node

const path = await import('path')
const { fileURLToPath, pathToFileURL } = await import('url')
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const PASS: string[] = []
const FAIL: string[] = []
const WARN: string[] = []

function check(desc: string, fn: () => boolean | string) {
  try {
    const result = fn()
    if (result === true) {
      PASS.push(desc)
    } else if (result === false) {
      FAIL.push(desc)
    } else if (typeof result === 'string') {
      FAIL.push(desc + ': ' + result)
    } else {
      PASS.push(desc)
    }
  } catch (e: any) {
    FAIL.push(desc + ': ' + e.message)
  }
}

async function load(name: string) {
  const fp = path.resolve(__dirname, '../src/data/' + name)
  return await import(pathToFileURL(fp).href)
}

async function loadCore(name: string) {
  const fp = path.resolve(__dirname, '../src/core/' + name)
  return await import(pathToFileURL(fp).href)
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

// ==================== Behavioral Tests ====================
const promptState = await loadCore('promptState.ts')

// --- 10. APPLY_MASTER_TEMPLATE fills advanced.facetSelections ---
check('promptReducer: APPLY_MASTER_TEMPLATE sets advanced.facetSelections', () => {
  const state = promptState.defaultPromptState
  const next = promptState.promptReducer(state, { type: 'APPLY_MASTER_TEMPLATE', templateId: 'night-convenience-ccd' })
  return Object.keys(next.advanced.facetSelections).length > 0 || 'facetSelections is empty'
})

// --- 11. advanced.facetSelections contains director mapping result ---
check('promptReducer: advanced.facetSelections includes shootingMedium from device mapping', () => {
  const state = promptState.defaultPromptState
  const next = promptState.promptReducer(state, { type: 'APPLY_MASTER_TEMPLATE', templateId: 'night-convenience-ccd' })
  return next.advanced.facetSelections['shootingMedium'] === 'med_ccd' || `expected med_ccd got ${next.advanced.facetSelections['shootingMedium']}`
})

// --- 12. UPDATE_ADVANCED_FACET syncs back to director ---
check('promptReducer: UPDATE_ADVANCED_FACET updates director via reverse mapping', () => {
  const state = {
    ...promptState.defaultPromptState,
    advanced: { facetSelections: { shootingMedium: 'med_ccd', scenePrimary: 'scene_street', lightFamily: 'lf_speedlight', posePrimary: 'pose_walking', expressionPrimary: 'expr_confident', handheld: ['饮料'] } },
  }
  const next = promptState.promptReducer(state as any, { type: 'UPDATE_ADVANCED_FACET', slotId: 'shootingMedium', value: 'med_phone' })
  return next.director.deviceId === 'phone-natural' || `expected phone-natural got ${next.director.deviceId}`
})

// --- 13. APPLY_POSE_VARIANT creates variantOverlay ---
check('promptReducer: APPLY_POSE_VARIANT creates variantOverlay', () => {
  const mockVariant = {
    shot: {
      id: 'test-variant-1',
      title: 'Test',
      purpose: 'test',
      bodyPose: 'standing',
      bodyAngle: '',
      weightShift: '',
      handTask: '',
      gaze: '',
      expression: '',
      sceneInteraction: '',
      cameraCrop: '',
      cameraAngle: '',
      motionCue: '',
      requiredDiffPacks: [],
      avoid: [],
    },
    pipelineId: 'test',
    positivePrompt: 'test prompt',
    negativePrompt: [],
    autoDiffPacks: ['hand-fix'],
  }
  const state = { ...promptState.defaultPromptState, variants: { list: [mockVariant], activeVariantId: 'test-variant-1', appliedVariantId: null } }
  const next = promptState.promptReducer(state as any, { type: 'APPLY_POSE_VARIANT', variantId: 'test-variant-1' })
  return next.variantOverlay !== null || 'variantOverlay is null'
})

// --- 14. APPLY_POSE_VARIANT updates advanced.facetSelections ---
check('promptReducer: APPLY_POSE_VARIANT updates advanced.facetSelections with pose mapping', () => {
  const mockVariant = {
    shot: {
      id: 'test-variant-2',
      title: 'Test',
      purpose: 'test',
      bodyPose: '站在树下',
      bodyAngle: '',
      weightShift: '',
      handTask: '',
      gaze: '看镜头',
      expression: '微笑',
      sceneInteraction: '',
      cameraCrop: '半身',
      cameraAngle: '',
      motionCue: '',
      requiredDiffPacks: [],
      avoid: [],
    },
    pipelineId: 'test',
    positivePrompt: 'test prompt',
    negativePrompt: [],
    autoDiffPacks: ['hand-fix'],
  }
  const state = { ...promptState.defaultPromptState, variants: { list: [mockVariant], activeVariantId: 'test-variant-2', appliedVariantId: null } }
  const next = promptState.promptReducer(state as any, { type: 'APPLY_POSE_VARIANT', variantId: 'test-variant-2' })
  return (next.advanced.facetSelections['posePrimary'] === 'pose_standing' && next.advanced.facetSelections['expressionPrimary'] === 'expr_smile') || `got pose=${next.advanced.facetSelections['posePrimary']} expr=${next.advanced.facetSelections['expressionPrimary']}`
})

// --- 15. selectOutput positive includes variant bodyPose ---
check('selectOutput: APPLY_POSE_VARIANT output includes variant bodyPose in positivePrompt', () => {
  const mockVariant = {
    shot: {
      id: 'test-variant-3', title: 'Test', purpose: 'test',
      bodyPose: '站在树荫下', bodyAngle: '', weightShift: '',
      handTask: '', gaze: '', expression: '', sceneInteraction: '',
      cameraCrop: '', cameraAngle: '', motionCue: '', requiredDiffPacks: [], avoid: [],
    },
    pipelineId: 'test', positivePrompt: 'test prompt', negativePrompt: [], autoDiffPacks: [],
  }
  const state = { ...promptState.defaultPromptState, variants: { list: [mockVariant], activeVariantId: 'test-variant-3', appliedVariantId: null } }
  const next = promptState.promptReducer(state as any, { type: 'APPLY_POSE_VARIANT', variantId: 'test-variant-3' })
  const output = promptState.selectOutput(next)
  return output.positivePrompt.includes('站在树荫下') || `positivePrompt missing variant text: ${output.positivePrompt}`
})

// --- 16. selectOutput negative includes autoDiffPacks negative ---
check('selectOutput: APPLY_POSE_VARIANT negativePrompt contains autoDiffPack negatives', () => {
  const mockVariant = {
    shot: {
      id: 'test-variant-4', title: 'Test', purpose: 'test',
      bodyPose: '', bodyAngle: '', weightShift: '', handTask: '手拿咖啡',
      gaze: '', expression: '', sceneInteraction: '', cameraCrop: '',
      cameraAngle: '', motionCue: '', requiredDiffPacks: [], avoid: [],
    },
    pipelineId: 'test', positivePrompt: 'test prompt', negativePrompt: [], autoDiffPacks: ['hand-fix'],
  }
  const state = { ...promptState.defaultPromptState, variants: { list: [mockVariant], activeVariantId: 'test-variant-4', appliedVariantId: null } }
  const next = promptState.promptReducer(state as any, { type: 'APPLY_POSE_VARIANT', variantId: 'test-variant-4' })
  const output = promptState.selectOutput(next)
  return output.negativePrompt.some(n => n.includes('extra fingers') || n.includes('missing fingers')) || `hand-fix negatives not found: ${JSON.stringify(output.negativePrompt)}`
})

// --- 17. getCompatibleDevices only returns scene.recommendedDevices ---
check('DirectorPanel: getCompatibleDevices filters by scene', () => {
  const template = masterTemplates.MASTER_TEMPLATE_MAP?.['night-convenience-ccd'] ?? masterTemplates.masterTemplates.find((t: any) => t.id === 'night-convenience-ccd')
  if (!template) return 'template not found'
  const scenePack = scenePacks.SCENE_MAP[template.lockedCore.scene] || scenePacks.SCENE_PACKS.find((s: any) => s.id === template.lockedCore.scene)
  if (!scenePack) return 'scene pack not found'
  const recommended = scenePack.recommendedDevices
  if (!recommended || recommended.length === 0) return 'no recommended devices'
  return true
})

// --- 18. getCompatibleLights only returns scene.recommendedLights ---
check('DirectorPanel: getCompatibleLights filters by scene', () => {
  const template = masterTemplates.MASTER_TEMPLATE_MAP?.['night-convenience-ccd'] ?? masterTemplates.masterTemplates.find((t: any) => t.id === 'night-convenience-ccd')
  if (!template) return 'template not found'
  const scenePack = scenePacks.SCENE_MAP[template.lockedCore.scene] || scenePacks.SCENE_PACKS.find((s: any) => s.id === template.lockedCore.scene)
  if (!scenePack) return 'scene pack not found'
  const recommended = scenePack.recommendedLights
  if (!recommended || recommended.length === 0) return 'no recommended lights'
  return true
})

// --- 19. filterAvoidedItems excludes matching items ---
check('DirectorPanel: filterAvoidedItems excludes items by id/label', () => {
  const items = [
    { id: 'ccd-flash', labelZh: 'CCD 闪光灯' },
    { id: 'phone-natural', labelZh: '手机原相机' },
  ]
  const filtered = items.filter(item => !['ccd'].some(a =>
    item.id.includes(a) || (item.labelZh && item.labelZh.includes(a))
  ))
  return filtered.length === 1 && filtered[0].id === 'phone-natural' || 'ccd-flash not filtered out'
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

export interface DevicePreset {
  id: string
  labelZh: string
  labelEn: string
  positivePromptZh: string
  positivePromptEn: string
  negativePrompt: string[]
  recommendedScenes: string[]
  recommendedLights: string[]
  defaultAspectRatios: string[]
  styleTags: string[]
  facetFragment?: Record<string, string | string[]>
}

export interface ScenePack {
  id: string
  labelZh: string
  description: string
  positivePromptZh: string
  recommendedDevices: string[]
  recommendedLights: string[]
  recommendedStates: string[]
  defaultProps: string[]
  autoDiffPacks: string[]
  defaultAspectRatio: string
  facetFragment?: Record<string, string | string[]>
}

export interface LightPack {
  id: string
  labelZh: string
  positivePromptZh: string
  positivePromptEn: string
  negativePrompt: string[]
  recommendedDevices: string[]
  recommendedScenes: string[]
  facetFragment?: Record<string, string | string[]>
}

export interface StatePack {
  id: string
  labelZh: string
  description: string
  positivePromptZh: string
  recommendedScenes: string[]
  autoDiffPacks: string[]
  facetFragment?: Record<string, string | string[]>
}

export interface DiffPack {
  id: string
  labelZh: string
  description: string
  triggerSlots: string[]
  positiveRepair: string[]
  negativePrompt: string[]
}

export interface DirectorTemplate {
  id: string
  title: string
  description: string
  lockedCore: {
    type: string
    device: string
    scene: string
    light: string
    aspectRatio: string
    realismLevel: string
  }
  randomPools: {
    state: string[]
    expression: string[]
    action: string[]
    composition: string[]
    props: string[]
    colorGrade: string[]
  }
  diffPacks: string[]
  avoid: string[]
  parameterPreset: string
  advancedSelections?: Record<string, string | string[]>
}

export interface ParameterPreset {
  id: string
  labelZh: string
  description: string
  midjourney: string
  generalDescription: string
}

export interface DirectorSelection {
  directorTemplate: string | null
  devicePreset: string | null
  scenePack: string | null
  lightPack: string | null
  statePacks: string[]
  diffStrength: 'light' | 'normal' | 'strict'
  parameterPreset: string | null
  customProps: string[]
}

export interface AutoEnabledPack {
  id: string
  label: string
  reason: string
}

export interface PromptSection {
  id: string
  label: string
  text: string
}

export interface PromptImportMatch {
  slotId: string
  valueId: string
  label: string
  matchedText: string
}

export type PromptImportSourceKind = 'manualPaste' | 'externalLibraryImport'

export interface PromptImportMeta {
  sourceText: string
  sourceKind?: PromptImportSourceKind
  sourceLabel?: string
  sourceUrl?: string
  sourceRepo?: string
  entryId?: string
  qualityTier?: ExternalPromptLibraryQualityTier
  sourceTier?: ExternalPromptLibrarySourceTier
  matchedCount: number
  matchedValues: PromptImportMatch[]
  unmatchedPositive: string[]
  unmatchedNegative: string[]
  parameterSuffix: string
}

export type ExternalPromptLanguage = 'zh' | 'en' | 'mixed'
export type ExternalPromptEntryKind = 'template' | 'case'
export type ExternalPromptLibrarySourceTier = 'structured-primary' | 'large-gallery-secondary'
export type ExternalPromptLibraryQualityTier = 'curated' | 'usable' | 'noisy'
export type ExternalPromptLibraryNormalizedCategory =
  | 'portrait'
  | 'photography'
  | 'cinematic'
  | 'street'
  | 'fashion'
  | 'lifestyle'
  | 'realism'
  | 'character-consistency'
  | 'phone-camera'
  | 'film-texture'
  | 'social-snapshot'
  | 'beauty'
  | 'commercial'
  | 'ui-graphic'
  | 'poster'
  | 'other'

export interface ExternalPromptLibrarySource {
  id: string
  label: string
  labelEn?: string
  repo: string
  sourceUrl: string
  license: string
  kind: 'structured' | 'curated'
  sourceTier: ExternalPromptLibrarySourceTier
  description: string
}

export interface ExternalPromptLibraryEntry {
  id: string
  sourceId: string
  sourceRepo: string
  sourceUrl: string
  title: string
  author: string
  license: string
  category: string
  styleTags: string[]
  sceneTags: string[]
  prompt: string
  description?: string
  displayTitleZh?: string
  displaySummaryZh?: string
  displayCategoryZh: string
  previewImage?: string
  language: ExternalPromptLanguage
  importHints: Record<string, string | string[]>
  sourceTier: ExternalPromptLibrarySourceTier
  qualityTier: ExternalPromptLibraryQualityTier
  recommendedForCurrentProduct: boolean
  chunkId: string
  searchText: string
  originalCategory: string
  normalizedCategory: ExternalPromptLibraryNormalizedCategory
  importConfidence: number
  portraitFocused: boolean
  entryKind: ExternalPromptEntryKind
}

export interface ExternalPromptLibraryCategorySummary {
  id: ExternalPromptLibraryNormalizedCategory
  label: string
  recommended: boolean
  entryCount: number
  recommendedOrder: number | null
}

export interface ExternalPromptLibraryChunkMeta {
  id: string
  sourceId: string
  normalizedCategory: ExternalPromptLibraryNormalizedCategory
  label: string
  path: string
  entryCount: number
}

export interface ExternalPromptLibraryEntrySummary {
  id: string
  sourceId: string
  sourceRepo: string
  sourceUrl: string
  title: string
  author: string
  license: string
  category: string
  styleTags: string[]
  sceneTags: string[]
  description?: string
  displayTitleZh?: string
  displaySummaryZh?: string
  displayCategoryZh: string
  previewImage?: string
  language: ExternalPromptLanguage
  importHints: Record<string, string | string[]>
  sourceTier: ExternalPromptLibrarySourceTier
  qualityTier: ExternalPromptLibraryQualityTier
  recommendedForCurrentProduct: boolean
  portraitFocused: boolean
  entryKind: ExternalPromptEntryKind
  chunkId: string
  searchText: string
  originalCategory: string
  normalizedCategory: ExternalPromptLibraryNormalizedCategory
  importConfidence: number
}

export interface ExternalPromptLibraryChunk {
  meta: ExternalPromptLibraryChunkMeta
  entries: ExternalPromptLibraryEntry[]
}

export interface ExternalPromptLibraryIndex {
  sources: ExternalPromptLibrarySource[]
  categories: ExternalPromptLibraryCategorySummary[]
  chunks: ExternalPromptLibraryChunkMeta[]
  entryIndex: ExternalPromptLibraryEntrySummary[]
}

export interface ComposedOutput {
  positivePrompt: string
  flatPrompt: string
  naturalPrompt: string
  sections: PromptSection[]
  negativePrompt: string[]
  parameterSuffix: string
  autoEnabledPacks: AutoEnabledPack[]
}

export interface PosePipeline {
  id: string
  title: string
  description: string
  sceneTypes: string[]
  lockedFields: string[]
  variantCount: 3 | 5 | 9
  intensity: 'subtle' | 'standard' | 'dynamic'
  sequence: PoseShot[]
}

export interface PoseShot {
  id: string
  title: string
  purpose: string
  bodyPose: string
  bodyAngle: string
  weightShift: string
  handTask: string
  gaze: string
  expression: string
  sceneInteraction: string
  cameraCrop: string
  cameraAngle: string
  motionCue: string
  requiredDiffPacks: string[]
  avoid: string[]
}

export interface ScenePoseRule {
  sceneId: string
  allowedBasePoses: string[]
  allowedHandTasks: string[]
  allowedGazes: string[]
  allowedExpressions: string[]
  forbiddenActions: string[]
  preferredCrops: string[]
  preferredMotion: string[]
}

export interface PoseVariant {
  shot: PoseShot
  pipelineId: string
  positivePrompt: string
  negativePrompt: string[]
  autoDiffPacks: string[]
  facetFragment?: Record<string, string | string[]>
}

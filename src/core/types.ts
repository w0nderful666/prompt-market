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
}

export interface LightPack {
  id: string
  labelZh: string
  positivePromptZh: string
  positivePromptEn: string
  negativePrompt: string[]
  recommendedDevices: string[]
  recommendedScenes: string[]
}

export interface StatePack {
  id: string
  labelZh: string
  description: string
  positivePromptZh: string
  recommendedScenes: string[]
  autoDiffPacks: string[]
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

export interface ComposedOutput {
  positivePrompt: string
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
}

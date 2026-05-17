import type { DirectorSelection } from './types'

type FacetSelections = Record<string, string | string[]>

const deviceMap: Record<string, string> = {
  'phone-natural': 'med_phone',
  'iphone-lifestyle': 'med_iphone',
  'android-lowres': 'med_android_lo',
  'digital-camera': 'med_compact',
  'ccd': 'med_ccd',
  'ccd-flash': 'med_ccd',
  'film-35mm': 'med_film',
  'dv-vhs': 'med_dv',
  'dslr': 'med_dslr',
  'mirrorless': 'med_mirrorless',
  'pro-camera': 'med_dslr',
  'cinematic-still': 'med_cinema',
  'phone': 'med_phone',
}

const sceneMap: Record<string, string> = {
  'cafe': 'scene_cafe',
  'cafe-window': 'scene_cafe',
  'living-room': 'scene_livingroom',
  'living-room-window': 'scene_livingroom',
  'bedroom-lo-fi': 'scene_bedroom',
  'convenience-store-night': 'scene_street',
  'night-convenience-ccd': 'scene_street',
  'subway-platform': 'scene_subway',
  'subway-cold-street': 'scene_subway',
  'park': 'scene_park',
  'forest': 'scene_forest',
  'forest-magic': 'scene_forest',
  'seaside-wind': 'scene_beach',
  'city-street': 'scene_street',
  'city-walk': 'scene_street',
  'night-market': 'scene_night_market',
  'rainy-neon-street': 'scene_street',
  'rainy-night-street': 'scene_street',
  'rainy-window-broken': 'scene_cafe',
  'studio': 'scene_studio_grey',
  'car-interior': 'scene_parking',
  'rooftop-blue-hour': 'scene_rooftop',
}

const lightMap: Record<string, string> = {
  'window-natural': 'lf_window',
  'golden-hour': 'lf_golden_hour',
  'daylight-clean': 'lf_natural',
  'softbox': 'lf_studio_strobe',
  'direct-flash': 'lf_speedlight',
  'neon-sign': 'lf_neon',
  'neon-glow': 'lf_neon',
  'warm-indoor': 'lf_continuous',
  'cold-white-top': 'lf_fluorescent',
  'cold-fluorescent': 'lf_fluorescent',
  'warm-fluorescent': 'lf_fluorescent',
  'city-lights': 'lf_street_lamp',
  'car-window-cold': 'lf_mixed',
  'overcast-soft': 'lf_overcast',
  'sunset-backlight': 'lf_sunset_backlight',
  'blue-hour-city': 'lf_natural',
  'tree-dappled': 'lf_natural',
  'sunny-day': 'lf_natural',
  'purple-ambient': 'lf_mixed',
  'screen-light': 'lf_mixed',
  'studio-strobe': 'lf_studio_strobe',
  'convenience-cold': 'lf_fluorescent',
  'rainy-neon-reflect': 'lf_neon',
}

const stateToPoseMap: Record<string, string> = {
  'walking-toward': 'pose_walking',
  'walking-naturally': 'pose_walking',
  'walking-passing': 'pose_walking',
  'walking-in-rain': 'pose_walking',
  'running': 'pose_running',
  'jumping': 'pose_jumping',
  'standing': 'pose_standing',
  'standing-confident': 'pose_standing',
  'standing-alone': 'pose_standing',
  'sitting': 'pose_sitting',
  'sitting-on-couch': 'pose_sitting',
  'sitting-in-car': 'pose_sitting',
  'leaning': 'pose_leaning',
  'leaning-on-wall': 'pose_leaning',
  'leaning-on-window': 'pose_leaning',
  'looking-out-window': 'pose_leaning',
  'looking-at-camera': 'pose_hands_on_hips',
  'looking-into-distance': 'pose_arms_crossed',
  'looking-away': 'pose_turning',
  'looking-back': 'pose_looking_back',
  'looking-down': 'pose_hands_in_pockets',
  'lying-down': 'pose_lying',
  'lying-down-relaxed': 'pose_lying',
  'turn-back-glance': 'pose_looking_back',
  'dancing': 'pose_dancing',
  'spinning': 'pose_dancing',
  'playing': 'pose_crouching',
  'reading': 'pose_sitting',
  'reading-book': 'pose_sitting',
  'writing': 'pose_sitting',
  'sipping-drink': 'pose_sitting',
  'holding-cup': 'pose_one_hand_hold',
  'holding-drink': 'pose_one_hand_hold',
  'holding-item': 'pose_one_hand_hold',
  'holding-food': 'pose_one_hand_hold',
  'holding-umbrella': 'pose_one_hand_hold',
  'holding-flowers': 'pose_one_hand_hold',
  'holding-product': 'pose_one_hand_hold',
  'phone-selfie': 'pose_hands_on_hips',
  'face-forward': 'pose_standing',
  'side-face-daydream': 'pose_leaning',
  'side-profile': 'pose_turning',
  'head-tilt-smile': 'pose_hands_on_hips',
  'group-posing': 'pose_standing',
  'posing': 'pose_standing',
  'cool-detached': 'pose_arms_crossed',
  'cool-confident': 'pose_hands_on_hips',
  'confident-smirk': 'pose_hands_on_hips',
  'shy-smile': 'pose_leaning_forward',
  'shy-head-down': 'pose_hands_in_pockets',
  'empty-eyes': 'pose_leaning',
  'sad-melancholy': 'pose_leaning',
  'tired-relaxed': 'pose_sitting',
  'bright-smile': 'pose_standing',
  'hair-in-wind': 'pose_turning',
  'not-looking-camera': 'pose_turning',
  'window-daydream': 'pose_leaning',
  'looking-down-phone': 'pose_sitting',
  'waiting': 'pose_standing',
  'wearing-headphones': 'pose_standing',
  'standing-under-eave': 'pose_standing',
  'looking-up': 'pose_turning',
  'close-eyes': 'pose_leaning',
  'chin-resting': 'pose_sitting',
  'slight-side': 'pose_turning',
  'standing-together': 'pose_standing',
}

const stateToExprMap: Record<string, string> = {
  'smile': 'expr_smile',
  'bright-smile': 'expr_bright_smile',
  'laughing': 'expr_laugh',
  'confident-smirk': 'expr_confident',
  'cool-confident': 'expr_confident',
  'cool-detached': 'expr_cool',
  'shy-smile': 'expr_shy',
  'shy-head-down': 'expr_shy',
  'sad-melancholy': 'expr_melancholy',
  'empty-eyes': 'expr_melancholy',
  'window-daydream': 'expr_contemplative',
  'side-face-daydream': 'expr_contemplative',
  'tired-relaxed': 'expr_tired',
  'head-tilt-smile': 'expr_sweet',
  'looking-into-distance': 'expr_contemplative',
  'not-looking-camera': 'expr_contemplative',
  'looking-down': 'expr_contemplative',
  'looking-away': 'expr_contemplative',
  'looking-back': 'expr_contemplative',
  'looking-out-window': 'expr_contemplative',
  'looking-at-camera': 'expr_neutral',
  'looking-up': 'expr_contemplative',
  'face-forward': 'expr_neutral',
  'close-eyes': 'expr_calm',
  'chin-resting': 'expr_contemplative',
  'relaxed': 'expr_calm',
  'enjoying': 'expr_smile',
  'playful': 'expr_playful',
  'pensive': 'expr_thoughtful',
  'detached': 'expr_cool',
  'neutral': 'expr_neutral',
  'focus': 'expr_focused',
  'sleepy': 'expr_tired',
  'energetic': 'expr_excited',
}

function fuzzyMatchStateAction(stateId: string, activities: string[]): string | null {
  const stateLower = stateId.toLowerCase().replace(/[-_]/g, ' ')
  for (const act of activities) {
    const actLower = act.toLowerCase().replace(/[-_]/g, ' ')
    if (stateLower.includes(actLower) || actLower.includes(stateLower)) return act
  }
  return null
}

export function directorToFacetSelections(sel: DirectorSelection): FacetSelections {
  const result: FacetSelections = {}

  // Map device → shootingMedium
  if (sel.devicePreset && deviceMap[sel.devicePreset]) {
    result['shootingMedium'] = deviceMap[sel.devicePreset]
  }

  // Map scene → scenePrimary
  if (sel.scenePack && sceneMap[sel.scenePack]) {
    result['scenePrimary'] = sceneMap[sel.scenePack]
  }

  // Map light → lightFamily
  if (sel.lightPack && lightMap[sel.lightPack]) {
    result['lightFamily'] = lightMap[sel.lightPack]
  }

  // Map statePacks → posePrimary, expressionPrimary, activities
  const poseMatches: string[] = []
  const exprMatches: string[] = []
  const activityMatches: string[] = []

  for (const stateId of sel.statePacks) {
    if (stateToPoseMap[stateId]) {
      poseMatches.push(stateToPoseMap[stateId])
    }
    if (stateToExprMap[stateId]) {
      exprMatches.push(stateToExprMap[stateId])
    }
  }

  if (poseMatches.length > 0) {
    result['posePrimary'] = poseMatches[0]
  }

  if (exprMatches.length > 0) {
    result['expressionPrimary'] = exprMatches[0]
  }

  // Map customProps → handheld
  if (sel.customProps.length > 0) {
    result['handheld'] = sel.customProps.slice(0, 3)
  }

  return result
}

// Reverse maps
const deviceRev: Record<string, string> = {}
for (const [k, v] of Object.entries(deviceMap)) {
  if (!deviceRev[v]) deviceRev[v] = k
}

const sceneRev: Record<string, string> = {}
for (const [k, v] of Object.entries(sceneMap)) {
  if (!sceneRev[v]) sceneRev[v] = k
}

const lightRev: Record<string, string> = {}
for (const [k, v] of Object.entries(lightMap)) {
  if (!lightRev[v]) lightRev[v] = k
}

const poseToState: Record<string, string[]> = {}
for (const [k, v] of Object.entries(stateToPoseMap)) {
  if (!poseToState[v]) poseToState[v] = []
  poseToState[v].push(k)
}

const exprToState: Record<string, string[]> = {}
for (const [k, v] of Object.entries(stateToExprMap)) {
  if (!exprToState[v]) exprToState[v] = []
  exprToState[v].push(k)
}

export interface BridgeSyncUpdate {
  devicePreset?: string | null
  scenePack?: string | null
  lightPack?: string | null
  statePacks?: string[]
  customProps?: string[]
}

export function facetToDirectorUpdate(facetSel: FacetSelections): BridgeSyncUpdate {
  const update: BridgeSyncUpdate = {}

  // Reverse device
  const medium = facetSel['shootingMedium']
  if (typeof medium === 'string' && deviceRev[medium]) {
    update.devicePreset = deviceRev[medium]
  }

  // Reverse scene
  const scene = facetSel['scenePrimary']
  if (typeof scene === 'string' && sceneRev[scene]) {
    update.scenePack = sceneRev[scene]
  }

  // Reverse light
  const light = facetSel['lightFamily']
  if (typeof light === 'string' && lightRev[light]) {
    update.lightPack = lightRev[light]
  }

  // Reverse pose + expression → statePacks
  const states: string[] = []
  const pose = facetSel['posePrimary']
  if (typeof pose === 'string' && poseToState[pose]) {
    states.push(poseToState[pose][0])
  }
  const expr = facetSel['expressionPrimary']
  if (typeof expr === 'string' && exprToState[expr]) {
    states.push(exprToState[expr][0])
  }
  if (states.length > 0) {
    update.statePacks = states
  }

  // Reverse handheld → customProps
  const handheld = facetSel['handheld']
  if (Array.isArray(handheld) && handheld.length > 0) {
    update.customProps = handheld.slice(0, 3)
  }

  return update
}

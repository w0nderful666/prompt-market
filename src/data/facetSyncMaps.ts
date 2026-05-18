import type { DirectorTemplate } from '../core/types'
import { TEMPLATES } from './facetedPresets'

export type FacetSelections = Record<string, string | string[]>

const legacyTemplateMap = Object.fromEntries(TEMPLATES.map(template => [template.id, template.selections])) as Record<string, FacetSelections>

function cloneSelections(input: FacetSelections | undefined): FacetSelections {
  if (!input) return {}
  const next: FacetSelections = {}
  for (const [key, value] of Object.entries(input)) {
    next[key] = Array.isArray(value) ? [...value] : value
  }
  return next
}

export function mergeFacetSelections(...parts: Array<FacetSelections | undefined | null>): FacetSelections {
  const next: FacetSelections = {}
  for (const part of parts) {
    if (!part) continue
    for (const [key, value] of Object.entries(part)) {
      if (Array.isArray(value)) {
        const current = Array.isArray(next[key]) ? (next[key] as string[]) : []
        next[key] = [...new Set([...current, ...value])]
      } else if (value) {
        next[key] = value
      }
    }
  }
  return next
}

export const DEVICE_FACET_FRAGMENTS: Record<string, FacetSelections> = {
  'phone-natural': { shootingMedium: 'med_phone', realismLevel: 'real_natural', imageTexture: ['tex_noise_light', 'tex_compression'] },
  'iphone-lifestyle': { shootingMedium: 'med_iphone', realismLevel: 'real_natural', imageTexture: ['tex_noise_light'] },
  'android-lowres': { shootingMedium: 'med_android_lo', realismLevel: 'real_lo_fi', imageTexture: ['tex_lo_fi', 'tex_compression'] },
  'digital-camera': { shootingMedium: 'med_compact', realismLevel: 'real_natural' },
  'ccd': { shootingMedium: 'med_ccd', realismLevel: 'real_lo_fi', imageTexture: ['tex_flash', 'tex_grain'] },
  'ccd-flash': { shootingMedium: 'med_ccd', realismLevel: 'real_lo_fi', imageTexture: ['tex_flash', 'tex_grain', 'tex_overexposed'] },
  'film-35mm': { shootingMedium: 'med_film', realismLevel: 'real_natural', imageTexture: ['tex_grain', 'tex_halation'] },
  'dv-vhs': { shootingMedium: 'med_doc', realismLevel: 'real_lo_fi', imageTexture: ['tex_lo_fi', 'tex_motion_blur'] },
  dslr: { shootingMedium: 'med_magazine', realismLevel: 'real_slight_retouch' },
  mirrorless: { shootingMedium: 'med_magazine', realismLevel: 'real_slight_retouch' },
  'pro-camera': { shootingMedium: 'med_magazine', realismLevel: 'real_commercial' },
  'cinematic-still': { shootingMedium: 'med_movie', realismLevel: 'real_cinematic', imageTexture: ['tex_lens_flare'] },
}

export const SCENE_FACET_FRAGMENTS: Record<string, FacetSelections> = {
  cafe: { scenePrimary: 'scene_cafe', sceneModifiers: ['scmod_daylight'] },
  'cafe-window': { scenePrimary: 'scene_cafe', sceneModifiers: ['scmod_window_side'] },
  'living-room': { scenePrimary: 'scene_livingroom', sceneModifiers: ['scmod_warm_cozy'] },
  'living-room-window': { scenePrimary: 'scene_livingroom', sceneModifiers: ['scmod_window_side'] },
  'bedroom-lo-fi': { scenePrimary: 'scene_bedroom', sceneModifiers: ['scmod_window_side'] },
  'convenience-store-night': { scenePrimary: 'scene_street', sceneModifiers: ['scmod_night', 'scmod_neon'] },
  'night-convenience-ccd': { scenePrimary: 'scene_street', sceneModifiers: ['scmod_night', 'scmod_neon'] },
  'subway-platform': { scenePrimary: 'scene_subway', sceneModifiers: ['scmod_indoor_cool'] },
  'subway-cold-street': { scenePrimary: 'scene_subway', sceneModifiers: ['scmod_indoor_cool'] },
  park: { scenePrimary: 'scene_park', sceneModifiers: ['scmod_daylight'] },
  forest: { scenePrimary: 'scene_forest' },
  'forest-magic': { scenePrimary: 'scene_forest', sceneModifiers: ['scmod_ethereal', 'scmod_golden_hour'] },
  'seaside-wind': { scenePrimary: 'scene_beach', sceneModifiers: ['scmod_summer', 'scmod_golden_hour'] },
  'city-street': { scenePrimary: 'scene_street', sceneModifiers: ['scmod_daylight'] },
  'city-walk': { scenePrimary: 'scene_street', sceneModifiers: ['scmod_daylight'] },
  'night-market': { scenePrimary: 'scene_night_market', sceneModifiers: ['scmod_night'] },
  'rainy-neon-street': { scenePrimary: 'scene_street', sceneModifiers: ['scmod_night', 'scmod_neon', 'scmod_rainy'] },
  'rainy-night-street': { scenePrimary: 'scene_street', sceneModifiers: ['scmod_night', 'scmod_rainy'] },
  'rainy-window-broken': { scenePrimary: 'scene_cafe', sceneModifiers: ['scmod_rainy', 'scmod_moody'] },
  studio: { scenePrimary: 'scene_studio_grey', sceneModifiers: ['scmod_clean_bg'] },
  'car-interior': { scenePrimary: 'scene_parking', sceneModifiers: ['scmod_night'] },
  'car-window-night': { scenePrimary: 'scene_parking', sceneModifiers: ['scmod_night', 'scmod_moody'] },
  'rooftop-blue-hour': { scenePrimary: 'scene_rooftop', sceneModifiers: ['scmod_blue_hour', 'scmod_cityscape'] },
  'bookstore-silent': { scenePrimary: 'scene_bookstore', sceneModifiers: ['scmod_indoor_warm'] },
  'office-siren': { scenePrimary: 'scene_office', sceneModifiers: ['scmod_indoor_warm'] },
  'hotel-lobby-old-money': { scenePrimary: 'scene_hotel_lobby', sceneModifiers: ['scmod_indoor_warm'] },
  'gallery-minimal': { scenePrimary: 'scene_art_gallery', sceneModifiers: ['scmod_minimal_bg'] },
  'spring-flowers-soft': { scenePrimary: 'scene_garden', sceneModifiers: ['scmod_spring', 'scmod_golden_hour'] },
  'ballet-studio': { scenePrimary: 'scene_stage', sceneModifiers: ['scmod_clean_bg'] },
  'cyberpunk-alley': { scenePrimary: 'scene_alley', sceneModifiers: ['scmod_neon', 'scmod_night'] },
  'clean-girl-headshot': { scenePrimary: 'scene_studio_white', sceneModifiers: ['scmod_clean_bg'] },
  'summer-tree-candid': { scenePrimary: 'scene_park', sceneModifiers: ['scmod_summer', 'scmod_golden_hour'] },
  'screen-light-night': { scenePrimary: 'scene_bedroom', sceneModifiers: ['scmod_night'] },
  'fast-food-window': { scenePrimary: 'scene_cafe', sceneModifiers: ['scmod_window_side'] },
  'bamboo-forest': { scenePrimary: 'scene_forest', sceneModifiers: ['scmod_ethereal'] },
  'campus-sports': { scenePrimary: 'scene_campus', sceneModifiers: ['scmod_daylight'] },
  'bar-flash': { scenePrimary: 'scene_club', sceneModifiers: ['scmod_neon', 'scmod_night'] },
}

export const LIGHT_FACET_FRAGMENTS: Record<string, FacetSelections> = {
  'window-natural': { lightFamily: 'lf_window', lightingPrimary: 'light_natural_window', lightingModifiers: ['lmod_soft'] },
  'golden-hour': { lightFamily: 'lf_golden_hour', lightingPrimary: 'light_golden_hour', lightingModifiers: ['lmod_soft', 'lmod_edge_light'] },
  'daylight-clean': { lightFamily: 'lf_natural', lightingPrimary: 'light_flat', lightingModifiers: ['lmod_soft'] },
  softbox: { lightFamily: 'lf_studio_strobe', lightingPrimary: 'light_butterfly', lightingModifiers: ['lmod_soft'] },
  'direct-flash': { lightFamily: 'lf_speedlight', lightingPrimary: 'light_flat', lightingModifiers: ['lmod_high_contrast'] },
  'neon-sign': { lightFamily: 'lf_neon', lightingPrimary: 'light_split', lightingModifiers: ['lmod_neon_glow', 'lmod_gel_light'] },
  'neon-glow': { lightFamily: 'lf_neon', lightingPrimary: 'light_split', lightingModifiers: ['lmod_neon_glow', 'lmod_gel_light'] },
  'warm-indoor': { lightFamily: 'lf_continuous', lightingPrimary: 'light_flat', lightingModifiers: ['lmod_soft'] },
  'cold-white-top': { lightFamily: 'lf_mixed', lightingPrimary: 'light_top', lightingModifiers: ['lmod_hard'] },
  'cold-fluorescent': { lightFamily: 'lf_mixed', lightingPrimary: 'light_top', lightingModifiers: ['lmod_hard'] },
  'warm-fluorescent': { lightFamily: 'lf_mixed', lightingPrimary: 'light_flat', lightingModifiers: ['lmod_soft'] },
  'city-lights': { lightFamily: 'lf_street_lamp', lightingPrimary: 'light_split', lightingModifiers: ['lmod_moody'] },
  'car-window-cold': { lightFamily: 'lf_mixed', lightingPrimary: 'light_split', lightingModifiers: ['lmod_moody'] },
  'overcast-soft': { lightFamily: 'lf_overcast', lightingPrimary: 'light_flat', lightingModifiers: ['lmod_diffuse'] },
  'sunset-backlight': { lightFamily: 'lf_sunset_backlight', lightingPrimary: 'light_backlight', lightingModifiers: ['lmod_edge_light'] },
  'blue-hour-city': { lightFamily: 'lf_mixed', lightingPrimary: 'light_backlight', lightingModifiers: ['lmod_silhouette'] },
  'tree-dappled': { lightFamily: 'lf_natural', lightingPrimary: 'light_flat', lightingModifiers: ['lmod_soft'] },
  'sunny-day': { lightFamily: 'lf_natural', lightingPrimary: 'light_flat', lightingModifiers: ['lmod_high_contrast'] },
  'purple-ambient': { lightFamily: 'lf_mixed', lightingPrimary: 'light_flat', lightingModifiers: ['lmod_gel_light', 'lmod_soft'] },
  'screen-light': { lightFamily: 'lf_mixed', lightingPrimary: 'light_flat', lightingModifiers: ['lmod_low_key'] },
  'studio-strobe': { lightFamily: 'lf_studio_strobe', lightingPrimary: 'light_45_degree', lightingModifiers: ['lmod_soft'] },
  'convenience-cold': { lightFamily: 'lf_mixed', lightingPrimary: 'light_flat', lightingModifiers: ['lmod_hard'] },
  'rainy-neon-reflect': { lightFamily: 'lf_neon', lightingPrimary: 'light_split', lightingModifiers: ['lmod_neon_glow', 'lmod_high_contrast'] },
}

export const STATE_FACET_FRAGMENTS: Record<string, FacetSelections> = {
  'walking-toward': { posePrimary: 'pose_walking', activities: ['act_walking'] },
  'walking-naturally': { posePrimary: 'pose_walking', activities: ['act_walking'] },
  'walking-passing': { posePrimary: 'pose_walking', activities: ['act_walking'] },
  walking: { posePrimary: 'pose_walking', activities: ['act_walking'] },
  'walking-in-rain': { posePrimary: 'pose_walking', activities: ['act_walking'] },
  running: { posePrimary: 'pose_running', activities: ['act_exercising'] },
  jumping: { posePrimary: 'pose_jumping', activities: ['act_jumping'] },
  standing: { posePrimary: 'pose_standing' },
  'standing-confident': { posePrimary: 'pose_standing', expressionPrimary: 'expr_confident' },
  'standing-alone': { posePrimary: 'pose_standing' },
  sitting: { posePrimary: 'pose_sitting' },
  'sitting-on-couch': { posePrimary: 'pose_sitting' },
  'sitting-in-car': { posePrimary: 'pose_sitting' },
  leaning: { posePrimary: 'pose_leaning' },
  'leaning-on-wall': { posePrimary: 'pose_leaning' },
  'leaning-on-window': { posePrimary: 'pose_leaning' },
  'looking-out-window': { expressionModifiers: ['emod_looking_away'] },
  'looking-at-camera': { expressionModifiers: ['emod_looking_at_camera'], expressionPrimary: 'expr_neutral' },
  'looking-into-distance': { expressionModifiers: ['emod_looking_away'], expressionPrimary: 'expr_contemplative' },
  'looking-away': { expressionModifiers: ['emod_looking_away'], expressionPrimary: 'expr_contemplative' },
  'looking-back': { posePrimary: 'pose_looking_back', expressionModifiers: ['emod_side_glance'] },
  'looking-down': { poseModifiers: ['pmod_head_down'], expressionPrimary: 'expr_contemplative' },
  'lying-down': { posePrimary: 'pose_lying' },
  'lying-down-relaxed': { posePrimary: 'pose_lying', expressionPrimary: 'expr_calm' },
  'turn-back-glance': { posePrimary: 'pose_looking_back', expressionModifiers: ['emod_side_glance'] },
  dancing: { posePrimary: 'pose_dancing', activities: ['act_dancing'] },
  spinning: { posePrimary: 'pose_dancing', activities: ['act_dancing'] },
  playing: { activities: ['act_exercising'] },
  reading: { posePrimary: 'pose_sitting', activities: ['act_reading'] },
  'reading-book': { posePrimary: 'pose_sitting', activities: ['act_reading'] },
  writing: { posePrimary: 'pose_sitting', activities: ['act_writing'] },
  'sipping-drink': { activities: ['act_drinking_coffee'] },
  'drinking-tea': { activities: ['act_drinking_coffee'], handheld: ['prop_tea_cup'] },
  'holding-cup': { handheld: ['prop_coffee_cup'] },
  'holding-drink': { handheld: ['prop_coffee_cup'] },
  'holding-item': { handheld: ['prop_bag_product'] },
  'holding-food': { handheld: ['prop_food'] },
  'holding-umbrella': { handheld: ['prop_umbrella'] },
  'holding-flowers': { handheld: ['prop_flowers'], activities: ['act_holding_flowers'] },
  'holding-product': { activities: ['act_holding_product'] },
  'phone-selfie': { poseModifiers: ['pmod_selfie_pose'], activities: ['act_selfie'], handheld: ['prop_phone'] },
  'face-forward': { expressionModifiers: ['emod_looking_at_camera'] },
  'side-face-daydream': { expressionPrimary: 'expr_contemplative', expressionModifiers: ['emod_looking_away'] },
  'side-profile': { orientation: 'ori_profile' },
  'head-tilt-smile': { poseModifiers: ['pmod_head_tilt'], expressionPrimary: 'expr_smile' },
  'group-posing': { posePrimary: 'pose_standing', subjectCount: 'count_group_small' },
  posing: { posePrimary: 'pose_standing' },
  'cool-detached': { expressionPrimary: 'expr_cool' },
  'cool-confident': { expressionPrimary: 'expr_confident' },
  'confident-smirk': { expressionPrimary: 'expr_confident' },
  'shy-smile': { expressionPrimary: 'expr_shy' },
  'shy-head-down': { expressionPrimary: 'expr_shy', poseModifiers: ['pmod_head_down'] },
  'empty-eyes': { expressionPrimary: 'expr_melancholy' },
  'sad-melancholy': { expressionPrimary: 'expr_melancholy' },
  'tired-relaxed': { expressionPrimary: 'expr_tired' },
  'bright-smile': { expressionPrimary: 'expr_bright_smile' },
  'hair-in-wind': { imageTexture: ['tex_motion_blur'] },
  'not-looking-camera': { expressionModifiers: ['emod_looking_away'] },
  'window-daydream': { expressionPrimary: 'expr_contemplative', expressionModifiers: ['emod_looking_away'] },
  'looking-down-phone': { handheld: ['prop_phone'], poseModifiers: ['pmod_head_down'] },
  waiting: { posePrimary: 'pose_standing' },
  'wearing-headphones': { style: ['sty_casual'] },
  'standing-under-eave': { posePrimary: 'pose_standing' },
  'looking-up': { poseModifiers: ['pmod_head_up'], expressionPrimary: 'expr_contemplative' },
  'close-eyes': { expressionModifiers: ['emod_eyes_closed'], expressionPrimary: 'expr_calm' },
  'chin-resting': { poseModifiers: ['pmod_chin_rest'] },
  'slight-side': { orientation: 'ori_three_quarter' },
  'standing-together': { posePrimary: 'pose_standing', subjectCount: 'count_group_small' },
  'playing-with-pet': { activities: ['act_talking'] },
}

export const PROP_FACET_FRAGMENTS: Record<string, FacetSelections> = {
  '咖啡杯': { handheld: ['prop_coffee_cup'] },
  '咖啡': { handheld: ['prop_coffee_cup'], activities: ['act_drinking_coffee'] },
  '茶杯': { handheld: ['prop_tea_cup'] },
  手机: { handheld: ['prop_phone'] },
  相机: { handheld: ['prop_camera'] },
  复古相机: { handheld: ['prop_camera_vintage'] },
  花束: { handheld: ['prop_flowers'] },
  雨伞: { handheld: ['prop_umbrella'] },
  书本: { handheld: ['prop_book'], activities: ['act_reading'] },
  杂志: { handheld: ['prop_magazine'] },
  文件: { environmental: ['prop_document'] },
  产品: { product: ['prop_bag_product'], activities: ['act_holding_product'] },
  饮料: { handheld: ['prop_coffee_cup'] },
  酒杯: { handheld: ['prop_wine_glass'] },
  香烟: { handheld: ['prop_cigarette'] },
}

const MASTER_TEMPLATE_PRESET_LINKS: Record<string, string> = {
  'night-convenience-ccd': 'template_convenience_ccd',
  'purple-livingroom': 'template_purple_livingroom',
  'summer-tree-candid': 'template_summer_tree_mblur',
  'cafe-window': 'template_cafe_window',
  'subway-cold-street': 'template_subway_cool',
  'rainy-neon-street': 'template_rain_neon',
  'rooftop-blue-hour': 'template_rooftop_blue',
  'bedroom-lo-fi': 'template_bedroom_lo_fi',
  'seaside-wind': 'template_seaside_wind',
  'gallery-minimal': 'template_gallery_minimal',
  'cyberpunk-alley': 'template_cyberpunk_alley',
  'forest-magic': 'template_forest_magic',
  'night-market': 'template_night_market_snack',
  'city-walk': 'template_quiet_street',
  'bookstore-silent': 'template_poetcore_bookstore',
  'office-siren': 'template_office_headshot',
  'hotel-lobby-old-money': 'template_editorial_old_money',
  'spring-flowers-soft': 'template_garden_spring',
  'clean-girl-headshot': 'template_headshot',
}

const keywordFragments: Array<{ pattern: RegExp; fragment: FacetSelections }> = [
  { pattern: /\bY2K\b/i, fragment: { trendAesthetic: ['trend_y2k'] } },
  { pattern: /\bCyberpunk\b/i, fragment: { trendAesthetic: ['trend_cyberpunk'], style: ['sty_techwear'] } },
  { pattern: /\bOld Money\b/i, fragment: { trendAesthetic: ['trend_old_money'] } },
  { pattern: /\bQuiet Luxury\b/i, fragment: { trendAesthetic: ['trend_quiet_luxury'] } },
  { pattern: /\bOffice Siren\b/i, fragment: { trendAesthetic: ['trend_office_siren'] } },
  { pattern: /\bPoetcore\b/i, fragment: { trendAesthetic: ['trend_poetcore'] } },
  { pattern: /\bBalletcore\b/i, fragment: { trendAesthetic: ['trend_balletcore'] } },
  { pattern: /\bFairycore\b/i, fragment: { trendAesthetic: ['trend_fairycore'] } },
  { pattern: /\bHong Kong\b/i, fragment: { trendAesthetic: ['trend_hk_movie'] } },
  { pattern: /\bKorean Drama\b/i, fragment: { trendAesthetic: ['trend_kdrama'] } },
  { pattern: /\bJapanese Magazine\b/i, fragment: { trendAesthetic: ['trend_jp_magazine'] } },
  { pattern: /\bCCD\b/i, fragment: { shootingMedium: 'med_ccd', imageTexture: ['tex_flash', 'tex_grain'] } },
  { pattern: /\bfilm\b/i, fragment: { shootingMedium: 'med_film', imageTexture: ['tex_grain'] } },
  { pattern: /霓虹|Neon/i, fragment: { sceneModifiers: ['scmod_neon'], lightingModifiers: ['lmod_neon_glow'] } },
  { pattern: /雨|Rain/i, fragment: { sceneModifiers: ['scmod_rainy'] } },
  { pattern: /窗|Window/i, fragment: { sceneModifiers: ['scmod_window_side'] } },
  { pattern: /蓝调|Blue Hour/i, fragment: { sceneModifiers: ['scmod_blue_hour'] } },
  { pattern: /金色|Golden/i, fragment: { sceneModifiers: ['scmod_golden_hour'] } },
  { pattern: /电影|Cinematic/i, fragment: { realismLevel: 'real_cinematic' } },
]

function inferKeywordSelections(template: DirectorTemplate): FacetSelections {
  const haystack = [
    template.title,
    template.description,
    ...template.randomPools.expression,
    ...template.randomPools.action,
    ...template.randomPools.composition,
    ...template.randomPools.colorGrade,
  ].join(' | ')

  let next: FacetSelections = {}
  for (const entry of keywordFragments) {
    if (entry.pattern.test(haystack)) {
      next = mergeFacetSelections(next, entry.fragment)
    }
  }
  return next
}

export function resolveTemplateAdvancedSelections(template: DirectorTemplate): FacetSelections {
  const linked = cloneSelections(legacyTemplateMap[MASTER_TEMPLATE_PRESET_LINKS[template.id]])
  const scene = cloneSelections(SCENE_FACET_FRAGMENTS[template.lockedCore.scene])
  const device = cloneSelections(DEVICE_FACET_FRAGMENTS[template.lockedCore.device])
  const light = cloneSelections(LIGHT_FACET_FRAGMENTS[template.lockedCore.light])
  const states = template.randomPools.state
    .map(stateId => STATE_FACET_FRAGMENTS[stateId])
    .filter(Boolean)
  const props = template.randomPools.props
    .map(prop => PROP_FACET_FRAGMENTS[prop])
    .filter(Boolean)
  const keywords = inferKeywordSelections(template)

  return mergeFacetSelections(
    {
      outputLang: 'lang_zh',
      subjectCount: 'count_single',
      shotType: 'shot_lifestyle',
    },
    scene,
    device,
    light,
    ...states,
    ...props,
    linked,
    keywords,
  )
}

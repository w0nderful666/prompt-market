import type { PosePipeline, PoseShot } from '../core/types'

// Define types
export type { PosePipeline, PoseShot }

export const POSE_PIPELINES: PosePipeline[] = [
  // ===== safe-to-dynamic-5 =====
  {
    id: 'safe-to-dynamic-5',
    title: '从安全照到动态抓拍',
    description: '最通用，适合大部分场景。从安全保底照逐步过渡到动态抓拍',
    sceneTypes: ['*'],
    lockedFields: ['person', 'outfit', 'scene', 'device', 'light', 'style'],
    variantCount: 5,
    intensity: 'standard',
    sequence: [
      {
        id: 'safe-clean',
        title: '安全干净照',
        purpose: '保底出片',
        bodyPose: '自然站立或坐姿',
        bodyAngle: '三分之二侧向镜头',
        weightShift: '重心落在一条腿上',
        handTask: '双手自然放松或轻触道具',
        gaze: '看镜头',
        expression: '自然浅笑',
        sceneInteraction: '保持场景存在但不抢主体',
        cameraCrop: '半身或七分身',
        cameraAngle: '平视',
        motionCue: '无明显运动',
        requiredDiffPacks: ['real-photo-base', 'face-fix', 'skin-realism'],
        avoid: ['大幅运动', '不看镜头', '低头']
      },
      {
        id: 'look-away',
        title: '不看镜头情绪照',
        purpose: '增加氛围感',
        bodyPose: '身体保持原位',
        bodyAngle: '轻微侧身',
        weightShift: '肩膀放松',
        handTask: '一只手自然放在身侧或道具旁',
        gaze: '看向画面外',
        expression: '若有所思',
        sceneInteraction: '与窗户、街景或桌面产生关系',
        cameraCrop: '近景半身',
        cameraAngle: '平视或略微侧拍',
        motionCue: '静态',
        requiredDiffPacks: ['real-photo-base', 'face-fix'],
        avoid: ['看镜头', '大笑', '大幅运动']
      },
      {
        id: 'hands',
        title: '手部动作变化',
        purpose: '增加生活感',
        bodyPose: '身体微微前倾',
        bodyAngle: '三分之二侧面',
        weightShift: '自然站稳或坐稳',
        handTask: '从拨发、拿杯子、拿手机、扶栏杆中选一个',
        gaze: '低头或看向手部',
        expression: '放松自然',
        sceneInteraction: '手部与场景道具互动',
        cameraCrop: '半身',
        cameraAngle: '平视',
        motionCue: '手部轻微动态',
        requiredDiffPacks: ['real-photo-base', 'hand-fix', 'object-product-fix'],
        avoid: ['双手完全不动', '不看手部道具']
      },
      {
        id: 'turn-back',
        title: '回眸变化',
        purpose: '抓拍感',
        bodyPose: '身体轻微转身',
        bodyAngle: '背身到三分之二回头',
        weightShift: '一脚向前半步',
        handTask: '一只手自然摆动或整理头发',
        gaze: '余光看镜头',
        expression: '浅笑或眼神躲闪',
        sceneInteraction: '像准备离开时被叫住',
        cameraCrop: '七分身或全身',
        cameraAngle: '平视',
        motionCue: '轻微转身动态',
        requiredDiffPacks: ['real-photo-base', 'hand-fix', 'motion-fix'],
        avoid: ['完全背对镜头', '大步走动']
      },
      {
        id: 'motion-candid',
        title: '动态抓拍',
        purpose: '自然运动感',
        bodyPose: '行走中',
        bodyAngle: '朝镜头或横向经过镜头',
        weightShift: '步态自然',
        handTask: '手部自然摆动或拿道具',
        gaze: '不看镜头或刚注意到镜头',
        expression: '像被朋友抓拍',
        sceneInteraction: '人物正在穿过当前场景',
        cameraCrop: '全身或七分身',
        cameraAngle: '平视或腰平',
        motionCue: '背景或手部轻微运动模糊，脸部保持清晰',
        requiredDiffPacks: ['real-photo-base', 'motion-fix', 'hand-fix'],
        avoid: ['完全静止', '正面看镜头']
      }
    ]
  },

  // ===== lifestyle-candid-5 =====
  {
    id: 'lifestyle-candid-5',
    title: '生活感抓拍',
    description: '适合客厅、咖啡店、书店、车内。安静自然的生活瞬间',
    sceneTypes: ['living-room-window', 'cafe-window', 'bookstore-silent', 'bedroom-lo-fi', 'car-window-night'],
    lockedFields: ['person', 'outfit', 'scene', 'device', 'light', 'style'],
    variantCount: 5,
    intensity: 'subtle',
    sequence: [
      {
        id: 'env-establish',
        title: '环境建立',
        purpose: '人物在场景中自然存在',
        bodyPose: '自然坐姿或站立',
        bodyAngle: '三分之二侧向',
        weightShift: '放松',
        handTask: '双手自然垂放或轻触身边物品',
        gaze: '看向场景内部',
        expression: '平静自然',
        sceneInteraction: '人物作为场景的一部分',
        cameraCrop: '中景或全景',
        cameraAngle: '平视',
        motionCue: '静态',
        requiredDiffPacks: ['real-photo-base'],
        avoid: ['摆拍姿势', '过度看镜头']
      },
      {
        id: 'prop-interact',
        title: '道具互动',
        purpose: '与场景物品自然互动',
        bodyPose: '坐姿保持',
        bodyAngle: '微微前倾',
        weightShift: '手部动作带动轻微变化',
        handTask: '手拿咖啡杯、翻书、看手机中选一个',
        gaze: '看向手中物品',
        expression: '专注自然',
        sceneInteraction: '手部与道具互动',
        cameraCrop: '半身',
        cameraAngle: '平视略微侧拍',
        motionCue: '手部轻微动态',
        requiredDiffPacks: ['real-photo-base', 'hand-fix', 'object-product-fix'],
        avoid: ['道具挡脸', '双手拿不同物品']
      },
      {
        id: 'profile-daydream',
        title: '侧脸发呆',
        purpose: '安静氛围感',
        bodyPose: '靠窗或靠墙',
        bodyAngle: '侧身',
        weightShift: '肩膀放松',
        handTask: '一只手轻触下巴或放在膝盖上',
        gaze: '看向窗外或远处',
        expression: '若有所思',
        sceneInteraction: '像在想自己的事情',
        cameraCrop: '近景半身',
        cameraAngle: '侧拍',
        motionCue: '静态',
        requiredDiffPacks: ['real-photo-base', 'face-fix'],
        avoid: ['看镜头', '大幅度动作']
      },
      {
        id: 'micro-hand',
        title: '手部微动作',
        purpose: '增加细节',
        bodyPose: '坐姿或站立',
        bodyAngle: '身体朝向不变',
        weightShift: '稳定',
        handTask: '拨发、撑下巴、扶窗帘中选一个',
        gaze: '保持侧脸或低头',
        expression: '放松柔和',
        sceneInteraction: '手部动作与环境互动',
        cameraCrop: '半身或近景',
        cameraAngle: '平视',
        motionCue: '手部轻微动态',
        requiredDiffPacks: ['real-photo-base', 'hand-fix'],
        avoid: ['手完全不动', '双手同时大动作']
      },
      {
        id: 'friend-candid',
        title: '朋友抓拍',
        purpose: '像被朋友随手拍到',
        bodyPose: '正在做日常事情',
        bodyAngle: '刚注意到镜头的瞬间',
        weightShift: '自然',
        handTask: '保持当前动作',
        gaze: '刚看向镜头',
        expression: '淡淡笑意',
        sceneInteraction: '像被朋友喊了一声',
        cameraCrop: '半身',
        cameraAngle: '平视',
        motionCue: '极轻微动态',
        requiredDiffPacks: ['real-photo-base', 'face-fix'],
        avoid: ['刻意摆拍感', '过分完美笑容']
      }
    ]
  },

  // ===== street-motion-5 =====
  {
    id: 'street-motion-5',
    title: '街拍动态',
    description: '适合便利店、地铁、街头、夜市。有街道感的动态抓拍',
    sceneTypes: ['night-convenience-ccd', 'subway-cold-street', 'rainy-neon-street', 'city-walk', 'night-market', 'bar-flash'],
    lockedFields: ['person', 'outfit', 'scene', 'device', 'light', 'style'],
    variantCount: 5,
    intensity: 'dynamic',
    sequence: [
      {
        id: 'lean-edge',
        title: '靠在场景边缘',
        purpose: '利用场景结构',
        bodyPose: '靠墙或靠栏杆',
        bodyAngle: '三分之二侧面',
        weightShift: '重心偏向一边',
        handTask: '手插口袋或自然垂放',
        gaze: '看向前方或远方',
        expression: '冷淡放松',
        sceneInteraction: '人物与街道结构形成关系',
        cameraCrop: '七分身',
        cameraAngle: '平视或低角度',
        motionCue: '静态但有张力',
        requiredDiffPacks: ['real-photo-base'],
        avoid: ['正面站立', '甜美表情']
      },
      {
        id: 'walk-toward',
        title: '朝镜头走来',
        purpose: '有冲击力的街拍',
        bodyPose: '行走中',
        bodyAngle: '正对或略侧朝向镜头',
        weightShift: '步态自然',
        handTask: '手部自然摆动或拿手机',
        gaze: '看镜头或略微偏左/右',
        expression: '自信或酷',
        sceneInteraction: '人物从场景深处走向镜头',
        cameraCrop: '全身',
        cameraAngle: '腰平或低角度',
        motionCue: '腿部或手部有运动轨迹',
        requiredDiffPacks: ['real-photo-base', 'motion-fix', 'hand-fix'],
        avoid: ['低头走路', '表情过于柔和']
      },
      {
        id: 'phone-check',
        title: '低头看手机',
        purpose: '日常感',
        bodyPose: '站立或行走中停下',
        bodyAngle: '略微低头',
        weightShift: '稳定',
        handTask: '手拿手机',
        gaze: '看手机屏幕',
        expression: '专注或轻微皱眉',
        sceneInteraction: '像在查路线或回消息',
        cameraCrop: '半身或近景',
        cameraAngle: '平视',
        motionCue: '静态',
        requiredDiffPacks: ['real-photo-base', 'hand-fix', 'object-product-fix'],
        avoid: ['手机完全遮脸', '笑容过大']
      },
      {
        id: 'glance-back',
        title: '回头看镜头',
        purpose: '抓拍回眸瞬间',
        bodyPose: '正行走中',
        bodyAngle: '回头',
        weightShift: '一脚在前',
        handTask: '手部自然摆动或整理头发',
        gaze: '余光看镜头',
        expression: '轻微惊讶或浅笑',
        sceneInteraction: '像被叫住',
        cameraCrop: '七分身或全身',
        cameraAngle: '跟拍角度',
        motionCue: '头发或衣摆有动态',
        requiredDiffPacks: ['real-photo-base', 'motion-fix', 'hand-fix'],
        avoid: ['完全停止不动', '正面回头']
      },
      {
        id: 'dynamic-prop',
        title: '手持道具动态',
        purpose: '街道道具互动',
        bodyPose: '站立或轻微走动',
        bodyAngle: '身体略侧',
        weightShift: '自然',
        handTask: '手拿饮料、购物袋、相机中选一个',
        gaze: '看向道具或镜头',
        expression: '正在做事情的自然表情',
        sceneInteraction: '手持物品与街道场景配合',
        cameraCrop: '半身或七分身',
        cameraAngle: '平视',
        motionCue: '手部轻微运动',
        requiredDiffPacks: ['real-photo-base', 'hand-fix', 'object-product-fix', 'motion-fix'],
        avoid: ['道具摆放不自然', '完全静止']
      }
    ]
  },

  // ===== fashion-editorial-5 =====
  {
    id: 'fashion-editorial-5',
    title: '时尚大片',
    description: '适合时尚、全身穿搭、棚拍。强调造型感和气场',
    sceneTypes: ['studio', 'hotel-lobby-old-money', 'gallery-minimal', 'rooftop-blue-hour', 'cyberpunk-alley'],
    lockedFields: ['person', 'outfit', 'scene', 'device', 'light', 'style'],
    variantCount: 5,
    intensity: 'dynamic',
    sequence: [
      {
        id: 'full-body',
        title: '全身站姿',
        purpose: '展示穿搭',
        bodyPose: '站立',
        bodyAngle: '正对或三分之二',
        weightShift: '重心落在一只脚',
        handTask: '手插口袋或双手自然',
        gaze: '看镜头',
        expression: '自信或冷静',
        sceneInteraction: '人物占据画面中心',
        cameraCrop: '全身',
        cameraAngle: '低角度或平视',
        motionCue: '静态但有气场',
        requiredDiffPacks: ['real-photo-base', 'skin-realism'],
        avoid: ['低头', '眼神躲闪']
      },
      {
        id: 'pocket-pose',
        title: '手插口袋',
        purpose: '酷感造型',
        bodyPose: '站立或轻微倚靠',
        bodyAngle: '三分之二侧面',
        weightShift: '单腿承重',
        handTask: '手插口袋',
        gaze: '看向镜头旁',
        expression: '冷淡或高傲',
        sceneInteraction: '利用场景线条',
        cameraCrop: '七分身',
        cameraAngle: '低角度',
        motionCue: '静态',
        requiredDiffPacks: ['real-photo-base', 'hand-fix'],
        avoid: ['双手同时插口袋', '驼背']
      },
      {
        id: 'walk-motion',
        title: '走动抓拍',
        purpose: '动态时尚感',
        bodyPose: '行走中',
        bodyAngle: '朝镜头',
        weightShift: '猫步动态',
        handTask: '手部自然摆动',
        gaze: '看镜头',
        expression: '自信专注',
        sceneInteraction: '人物从场景中走来',
        cameraCrop: '全身',
        cameraAngle: '低角度或腰平',
        motionCue: '衣摆/头发有动态',
        requiredDiffPacks: ['real-photo-base', 'motion-fix'],
        avoid: ['低头', '节奏停顿']
      },
      {
        id: 'turn-glance',
        title: '回头转身',
        purpose: '抓拍感',
        bodyPose: '转身中',
        bodyAngle: '回头看',
        weightShift: '一脚在前',
        handTask: '一只手摆动一只手插口袋',
        gaze: '看镜头',
        expression: '轻微挑眉或自信',
        sceneInteraction: '像被喊住',
        cameraCrop: '全身',
        cameraAngle: '平视或低角度',
        motionCue: '头发有动态',
        requiredDiffPacks: ['real-photo-base', 'motion-fix', 'hand-fix'],
        avoid: ['完全静止', '不看镜头']
      },
      {
        id: 'strong-pose',
        title: '坐姿或倚靠',
        purpose: '强造型感',
        bodyPose: '坐在椅子/台阶或靠墙',
        bodyAngle: '三分之二或侧对',
        weightShift: '单手撑体',
        handTask: '一撑一放',
        gaze: '看镜头或看向画面外',
        expression: '高傲或放松',
        sceneInteraction: '与场景家具或结构互动',
        cameraCrop: '半身或七分身',
        cameraAngle: '低角度',
        motionCue: '静态',
        requiredDiffPacks: ['real-photo-base', 'hand-fix', 'face-fix'],
        avoid: ['过于日常姿势', '表情太甜']
      }
    ]
  },

  // ===== beauty-closeup-5 =====
  {
    id: 'beauty-closeup-5',
    title: '美妆近景',
    description: '适合美妆、头像、商务Headshot、近景特写。强调面部细节和质感',
    sceneTypes: ['studio', 'clean-girl-headshot'],
    lockedFields: ['person', 'outfit', 'scene', 'device', 'light', 'style'],
    variantCount: 5,
    intensity: 'subtle',
    sequence: [
      {
        id: 'front-clean',
        title: '正面干净特写',
        purpose: '展示完整五官',
        bodyPose: '坐姿端正',
        bodyAngle: '正对镜头',
        weightShift: '稳定',
        handTask: '双手不入镜',
        gaze: '看镜头',
        expression: '自然微笑',
        sceneInteraction: '纯背景',
        cameraCrop: '特写',
        cameraAngle: '平视',
        motionCue: '完全静态',
        requiredDiffPacks: ['real-photo-base', 'face-fix', 'skin-realism'],
        avoid: ['手入镜', '夸张表情', '大动作']
      },
      {
        id: 'three-quarter',
        title: '三分之二侧脸',
        purpose: '展示脸部线条',
        bodyPose: '坐姿不变',
        bodyAngle: '三分之二侧面',
        weightShift: '稳定',
        handTask: '双手不入镜',
        gaze: '看镜头',
        expression: '柔和微笑',
        sceneInteraction: '纯背景',
        cameraCrop: '特写',
        cameraAngle: '平视',
        motionCue: '完全静态',
        requiredDiffPacks: ['real-photo-base', 'face-fix', 'skin-realism'],
        avoid: ['手入镜', '低头']
      },
      {
        id: 'look-down',
        title: '低头露出眼妆',
        purpose: '展示眼妆',
        bodyPose: '坐姿',
        bodyAngle: '正面',
        weightShift: '稳定',
        handTask: '双手不入镜',
        gaze: '微微低头看下方',
        expression: '平静',
        sceneInteraction: '纯背景',
        cameraCrop: '大特写额头到鼻尖',
        cameraAngle: '略微俯拍',
        motionCue: '完全静态',
        requiredDiffPacks: ['real-photo-base', 'face-fix'],
        avoid: ['闭眼', '抬头', '大幅度动作']
      },
      {
        id: 'hand-touch',
        title: '手轻触脸侧',
        purpose: '增加层次',
        bodyPose: '坐姿',
        bodyAngle: '三分之二',
        weightShift: '稳定',
        handTask: '手指轻触脸侧或下巴',
        gaze: '看镜头',
        expression: '自然优雅',
        sceneInteraction: '纯背景',
        cameraCrop: '近景特写',
        cameraAngle: '平视',
        motionCue: '完全静态',
        requiredDiffPacks: ['real-photo-base', 'face-fix', 'hand-fix', 'skin-realism'],
        avoid: ['手挡脸太多', '用力按压']
      },
      {
        id: 'gaze-away',
        title: '眼神看向画面外',
        purpose: '故事感',
        bodyPose: '坐姿',
        bodyAngle: '正面或三分之二',
        weightShift: '稳定',
        handTask: '双手不入镜',
        gaze: '看向镜头旁',
        expression: '若有所思',
        sceneInteraction: '纯背景',
        cameraCrop: '特写',
        cameraAngle: '平视',
        motionCue: '完全静态',
        requiredDiffPacks: ['real-photo-base', 'face-fix', 'skin-realism'],
        avoid: ['闭眼', '大幅转头']
      }
    ]
  },
]

export function selectPipeline(sceneType: string, variantCount: 3 | 5 | 9 = 5, intensity: 'subtle' | 'standard' | 'dynamic' = 'standard'): PosePipeline {
  const candidates = POSE_PIPELINES.filter(p =>
    p.variantCount === variantCount &&
    p.intensity === intensity &&
    (p.sceneTypes.includes('*') || p.sceneTypes.includes(sceneType))
  )
  if (candidates.length > 0) return candidates[0]

  const fallback = POSE_PIPELINES.filter(p =>
    p.variantCount === variantCount &&
    (p.sceneTypes.includes('*') || p.sceneTypes.includes(sceneType))
  )
  if (fallback.length > 0) return fallback[0]

  return POSE_PIPELINES[0]
}

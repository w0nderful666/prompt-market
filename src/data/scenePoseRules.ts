import type { ScenePoseRule } from '../core/types'

export type { ScenePoseRule }

export const SCENE_POSE_RULES: ScenePoseRule[] = [
  {
    sceneId: 'living-room-window',
    allowedBasePoses: ['站在窗帘旁', '坐在沙发边', '靠在窗边', '坐在地毯上', '靠在椅背上'],
    allowedHandTasks: ['手拿手机', '轻扶窗帘', '整理头发', '抱着抱枕', '双手自然垂放'],
    allowedGazes: ['看窗外', '低头看手机', '不看镜头', '眼神放空', '看镜头'],
    allowedExpressions: ['浅浅笑意', '有点疲惫', '像在想心事', '松弛自然', '眼神柔和'],
    forbiddenActions: ['大幅跳跃', '强跑动', '撑伞', '夜店动作'],
    preferredCrops: ['半身', '七分身', '中景'],
    preferredMotion: ['静态', '极轻微动态']
  },
  {
    sceneId: 'cafe-window-seat',
    allowedBasePoses: ['靠窗坐着', '身体微微前倾', '靠在椅背', '站在书架前'],
    allowedHandTasks: ['手拿咖啡', '翻书', '撑下巴', '拨头发', '手指轻触杯沿'],
    allowedGazes: ['看窗外', '看桌面', '看书', '不看镜头', '侧脸看远方'],
    allowedExpressions: ['安静', '松弛', '若有所思', '浅笑', '自然放松'],
    forbiddenActions: ['大幅运动', '跳跃', '夸张表情', '奔跑'],
    preferredCrops: ['半身', '近景', '中景'],
    preferredMotion: ['静态', '手部轻微动态']
  },
  {
    sceneId: 'night-convenience-store',
    allowedBasePoses: ['朝镜头走来', '刚从便利店出来', '靠在玻璃门旁', '回头看镜头', '低头看手机'],
    allowedHandTasks: ['手拿饮料', '手拿购物袋', '整理头发', '单手插袋', '手举到一半'],
    allowedGazes: ['看镜头', '低头看手机', '余光看镜头', '不看镜头'],
    allowedExpressions: ['自信歪嘴笑', '酷酷的表情', '轻微疲惫', '不经意浅笑', '眼神躲闪'],
    forbiddenActions: ['完全静止', '过于甜美的笑', '看镜头过久'],
    preferredCrops: ['全身', '七分身', '中景'],
    preferredMotion: ['轻微运动模糊', '边走边拍', '手部轻微虚焦']
  },
  {
    sceneId: 'summer-tree-shade',
    allowedBasePoses: ['站在树荫下', '边走边低头笑', '坐在草地上', '回头看镜头', '轻轻转身'],
    allowedHandTasks: ['手扶头发', '手拿一朵花', '手部前景虚焦', '手遮阳光', '双手自然摆动'],
    allowedGazes: ['眼睛朝下看', '看镜头', '看树叶间的光', '看画面外'],
    allowedExpressions: ['有点害羞', '浅浅笑', '眼神清澈', '像被突然喊住'],
    forbiddenActions: ['过于成熟表情', '浓妆感', '商业摆拍'],
    preferredCrops: ['全身', '七分身', '中景'],
    preferredMotion: ['轻微动态', '风吹头发', '自然走动']
  },
  {
    sceneId: 'subway-station',
    allowedBasePoses: ['低头看手机', '边走边拍', '站在站台边', '靠在金属墙面', '手扶扶梯'],
    allowedHandTasks: ['手拿手机', '手插口袋', '整理外套', '单肩背包', '手扶栏杆'],
    allowedGazes: ['不看镜头', '看手机', '看远处', '侧脸'],
    allowedExpressions: ['冷淡', '疲惫', '专注', '疏离感', '像下班后'],
    forbiddenActions: ['大笑', '过于热情', '大幅度动作'],
    preferredCrops: ['全身', '七分身', '中景'],
    preferredMotion: ['走动', '低头行走', '扶梯动态']
  },
  {
    sceneId: 'rainy-neon-street',
    allowedBasePoses: ['撑伞回头', '站在路灯下', '侧脸看向远方', '靠墙站着', '转身离开'],
    allowedHandTasks: ['手拿雨伞', '整理湿发', '手插口袋', '轻轻低头', '伞沿遮住一部分脸'],
    allowedGazes: ['看远方', '低头看地面反光', '余光看镜头', '不完全看镜头'],
    allowedExpressions: ['清冷', '破碎感', '若有所思', '眼神有故事', '安静'],
    forbiddenActions: ['甜甜笑容', '轻快感', '白天阳光表情'],
    preferredCrops: ['全身', '七分身', '中景'],
    preferredMotion: ['雨滴前景', '转身动态', '撑伞动作']
  },
  {
    sceneId: 'car-window-night',
    allowedBasePoses: ['靠窗发呆', '侧脸看窗外', '低头看手机', '头靠着车窗', '靠在座椅上'],
    allowedHandTasks: ['手拿手机', '手扶车窗', '双手放在腿上', '手拿耳机'],
    allowedGazes: ['眼神放空', '看窗外', '低头看手机', '微微闭眼'],
    allowedExpressions: ['疲惫', '安静', '孤独感', '微醺感', '像在想心事'],
    forbiddenActions: ['大幅运动', '站立动作', '活泼表情', '看镜头'],
    preferredCrops: ['特写', '近景半身', '侧脸'],
    preferredMotion: ['窗外光流动', '极轻微动态']
  },
  {
    sceneId: 'clean-girl-headshot',
    allowedBasePoses: ['三分之二侧向镜头', '轻微前倾', '头轻轻歪向一侧', '肩膀放松'],
    allowedHandTasks: ['双手不入镜', '手轻触脸侧', '整理头发'],
    allowedGazes: ['看镜头', '略微看向镜头旁', '眼神柔和'],
    allowedExpressions: ['自然微笑', '干净亲切', '平静', '浅浅笑意'],
    forbiddenActions: ['大幅运动模糊', '走动', '跳跃', '强情绪夸张表情'],
    preferredCrops: ['特写', '近景', '半身'],
    preferredMotion: ['完全静态']
  },
  {
    sceneId: 'seaside-beach',
    allowedBasePoses: ['光脚走在沙滩上', '站在海边', '坐在礁石上', '回头看镜头', '迎着风站立'],
    allowedHandTasks: ['手扶帽子', '手拎鞋子', '手遮阳光', '手扶头发', '双手自然张开'],
    allowedGazes: ['看海', '侧脸看远方', '闭眼迎风', '回看镜头'],
    allowedExpressions: ['开心', '放松', '自由', '安静享受', '被风吹到的自然表情'],
    forbiddenActions: ['室内动作', '商务表情', '过度摆拍'],
    preferredCrops: ['全身', '七分身', '中景'],
    preferredMotion: ['风吹动态', '自然走动', '裙摆飘动']
  },
]

export function getScenePoseRule(sceneId: string): ScenePoseRule | null {
  return SCENE_POSE_RULES.find(r => r.sceneId === sceneId) ?? null
}

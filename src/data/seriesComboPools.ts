export interface PoolItem {
  id: string
  name: string
  icon: string
  fields: Record<string, string>
}

export const SCENE_POOL: PoolItem[] = [
  { id: 'scene_bathroom', name: '普通浴室', icon: '🚿', fields: { scene: '普通家庭浴室，白色瓷砖墙面，洗手台边缘有护肤品和毛巾', composition: '第三人称近景抓拍，竖构图半身', lighting: '浴室暖白顶灯，偏黄白平衡，自然高光', background: '白色瓷砖墙面，洗手台，牙刷杯，毛巾', depthOfField: '深景深，普通手机效果' } },
  { id: 'scene_bedroom_morning', name: '清晨卧室', icon: '🛏️', fields: { scene: '普通家庭卧室，清晨，白色床品半开窗帘', composition: '第三人称近景抓拍，竖构图半身', lighting: '清晨自然柔光从窗帘透入，暖白', background: '浅色床品，枕头，半开窗帘', depthOfField: '中等景深，背景略微软化' } },
  { id: 'scene_bedroom_night', name: '夜间卧室', icon: '🌙', fields: { scene: '夜间卧室，主灯关闭，台灯暖黄光照亮', composition: '第三人称近景，竖构图，人物略偏一侧', lighting: '台灯暖黄光主力，色温偏暖2700K', background: '深色墙壁，床沿，台灯轮廓', depthOfField: '中等景深，背景融入阴影' } },
  { id: 'scene_livingroom', name: '客厅沙发', icon: '🛋️', fields: { scene: '普通客厅布艺沙发，茶几有遥控器水杯', composition: '斜侧方抓拍半身，不出现手机', lighting: '暖色顶灯混合电视屏幕光', background: '沙发靠背，茶几，电视', depthOfField: '深景深，沙发区域清晰' } },
  { id: 'scene_kitchen', name: '居家厨房', icon: '🍳', fields: { scene: '普通家庭厨房，浅色橱柜台面，自然光透入', composition: '第三人称近景抓拍斜侧方', lighting: '窗户自然白光明亮柔和', background: '橱柜台面水杯餐具', depthOfField: '深景深，厨房环境清晰' } },
  { id: 'scene_desk', name: '书桌电脑前', icon: '💻', fields: { scene: '家庭书桌笔记本屏幕亮着，桌面有水杯文具', composition: '斜侧方近景显示侧脸和屏幕光', lighting: '屏幕冷白光主光源，房间环境暗', background: '墙壁书架日常文具', depthOfField: '中等景深人物和屏幕清晰' } },
  { id: 'scene_convenience', name: '便利店门口', icon: '🏪', fields: { scene: '夜晚便利店门口冷白灯光透出自动门半开', composition: '近景半身主体居中', lighting: '便利店冷光混合室外暖黄路灯', background: '便利店招牌自动售货机模糊街道', depthOfField: '浅景深灯光柔和光斑' } },
  { id: 'scene_subway', name: '地铁站台', icon: '🚇', fields: { scene: '地铁站台荧光灯照明金属座椅屏蔽门', composition: '近景半身三分法构图', lighting: '地铁站冷白色荧光灯均匀', background: '扶梯扶手警示线屏蔽门', depthOfField: '全景深CCD效果' } },
  { id: 'scene_street_night', name: '夜晚街头', icon: '🌃', fields: { scene: '夜晚城市街道霓虹灯牌广告屏车流', composition: '街头夜景霓虹为背景主体居中', lighting: '霓虹灯广告屏车灯混合光', background: '霓虹街道广告牌人群车流', depthOfField: '浅景深霓虹虚化成光斑' } },
  { id: 'scene_rain_window', name: '雨天窗边', icon: '🌧️', fields: { scene: '雨天车内或窗边灰蓝天空雨水流淌', composition: '侧面近景紧凑构图窗景占一侧', lighting: '灰蓝天空散射光冷调柔和', background: '雨水流淌痕迹灰蓝天空', depthOfField: '浅到中等景深窗外模糊' } },
  { id: 'scene_cafe', name: '咖啡馆', icon: '☕', fields: { scene: '温暖咖啡馆木质桌椅柔和灯光', composition: '近景半身咖啡馆环境为背景', lighting: '咖啡馆暖光混合窗边自然光', background: '咖啡吧台书架顾客', depthOfField: '中等景深背景柔和' } },
  { id: 'scene_hotel', name: '酒店房间', icon: '🏨', fields: { scene: '简洁酒店房间白色床品暖色床头灯', composition: '第三人称半身近景竖构图', lighting: '床头暖灯柔和侧光', background: '床头板暖灯窗帘', depthOfField: '中等景深背景虚化' } },
  { id: 'scene_sakura', name: '樱花树下', icon: '🌸', fields: { scene: '樱花树枝头花瓣飘落粉色氛围', composition: '樱花树下半身人像', lighting: '柔和樱花光浅粉色', background: '樱花树花瓣雨粉色', depthOfField: '浅景深花瓣前景后景' } },
  { id: 'scene_sunflower', name: '向日葵田', icon: '🌻', fields: { scene: '夏日向日葵花田金黄色一片', composition: '花海构图人物在花中', lighting: '夏日阳光向日葵反光金色', background: '向日葵花田金黄色远景', depthOfField: '中景深前后花田虚化' } },
  { id: 'scene_bamboo', name: '竹林', icon: '🎋', fields: { scene: '茂密竹林竹叶间光斑幽静小径', composition: '全身中景竹林小径引导线', lighting: '竹林斑驳光影绿色调', background: '密集竹林小径蜿蜒', depthOfField: '浅景深竹叶虚化' } },
  { id: 'scene_snow', name: '雪地', icon: '❄️', fields: { scene: '冬季森林白雪覆盖松树环绕', composition: '全景人物在雪地中', lighting: '雪地反光暖色窗口光', background: '雪松林积雪', depthOfField: '全景深雪景清晰' } },
]

export const STYLE_POOL: PoolItem[] = [
  { id: 'style_phone_lowres', name: '低清手机', icon: '📱', fields: { camera: '手机随手拍低分辨率数字噪点JPEG压缩', atmosphere: '真实生活气息不像商业棚拍' } },
  { id: 'style_ccd', name: 'CCD老数码', icon: '📸', fields: { camera: 'CCD老式数码相机数字噪点颗粒日期戳轻微跑焦', atmosphere: '老照片质感2000年代复古感' } },
  { id: 'style_film', name: '胶片质感', icon: '🎞️', fields: { camera: '胶片质感胶卷颗粒色彩偏移轻微色罩', atmosphere: '复古怀旧感电影胶片色调' } },
  { id: 'style_cinematic', name: '电影感', icon: '🎬', fields: { camera: '电影镜头质感浅景深色彩分级', atmosphere: '电影剧照氛围叙事感强' } },
  { id: 'style_korean', name: '韩系精致', icon: '🇰🇷', fields: { camera: '韩系画报感精致清晰网红风', atmosphere: '精致韩系时尚首尔咖啡厅氛围' } },
  { id: 'style_japanese', name: '日系清新', icon: '🇯🇵', fields: { camera: '日系摄影柔和色调清新自然', atmosphere: '日系清爽春季樱花氛围' } },
  { id: 'style_retro', name: '复古怀旧', icon: '🕰️', fields: { camera: '复古色调暖色偏黄轻微颗粒', atmosphere: '怀旧氛围像老照片或旧电影' } },
  { id: 'style_candid', name: '生活随拍', icon: '👀', fields: { camera: '朋友随手拍自然不做作', atmosphere: '真实生活气息像日常记录' } },
  { id: 'style_premium', name: '高级质感', icon: '💎', fields: { camera: '商业级摄影质感到位', atmosphere: '高级感精致克制高端审美' } },
  { id: 'style_cyber', name: '赛博朋克', icon: '🌆', fields: { camera: '赛博朋克风格霓虹光感', atmosphere: '未来感科技感都市夜晚' } },
  { id: 'style_fashion', name: '时尚画报', icon: '👠', fields: { camera: '时尚杂志画报风专业', atmosphere: '高级时尚秀场外街拍感' } },
  { id: 'style_chinese', name: '中国古典', icon: '🏮', fields: { camera: '中国古典美学水墨感留白', atmosphere: '东方诗意古典意境' } },
  { id: 'style_wellness', name: '健康自然', icon: '🌿', fields: { camera: '自然光拍摄健康活力感', atmosphere: '健康生活方式清新自然' } },
]

export const CHARACTER_POOL: PoolItem[] = [
  { id: 'char_student_natural', name: '素颜学生', icon: '👩‍🎓', fields: { subject: '一位二十出头女大学生素颜自然', face: '素颜或极淡妆保留真实皮肤纹理', hair: '黑色长发自然披肩或马尾', clothing: '宽松T恤或卫衣牛仔裤', expression: '表情自然放松眼神清澈' } },
  { id: 'char_office_elegant', name: '通勤白领', icon: '👩‍💼', fields: { subject: '一位二十五岁左右职场女性精致干练', face: '职业妆淡雅得体口红提气色', hair: '深色长发扎低马尾或披肩', clothing: '通勤西装或风衣简约气质', expression: '自信从容知性优雅' } },
  { id: 'char_retro_vintage', name: '复古旗袍', icon: '👘', fields: { subject: '一位二十多岁女性演绎复古风情', face: '复古妆容红唇浓眉大波浪', hair: '波浪卷发或手推波纹盘发', clothing: '复古旗袍或丝绒连衣裙', expression: '典雅含蓄眉眼传情' } },
  { id: 'char_korean_trendy', name: '韩系网红', icon: '✨', fields: { subject: '一位韩系精致女生时尚穿搭', face: '韩系精致妆容水光肌渐变唇', hair: '韩系发型流行色或层次剪', clothing: '韩系时尚穿搭精致品牌', expression: '精致对镜自然甜美表情管理' } },
  { id: 'char_street_cool', name: '街头潮人', icon: '🧢', fields: { subject: '一位态度女生街头潮流风格', face: '潮流妆容有态度个性', hair: '染发或个性发型', clothing: '潮牌穿搭层次感街头风', expression: '酷帅自信不屑眼神' } },
  { id: 'char_japanese_gentle', name: '日系溫柔', icon: '🎀', fields: { subject: '一位日系女生柔和溫暖', face: '透明感妆容自然血色腮红', hair: '黑长直或柔和卷发', clothing: '日系简约柔软材质大地色', expression: '溫柔微笑眼神柔和' } },
  { id: 'char_outdoor_sporty', name: '户外运动', icon: '🏃‍♀️', fields: { subject: '一位活力女生户外运动风格', face: '素颜或淡妆防晒感健康光泽', hair: '运动束发或编发方便活动', clothing: '瑜伽服或运动装舒适功能性', expression: '活力满满元气笑容' } },
  { id: 'char_chinese_hanfu', name: '汉服古风', icon: '🎭', fields: { subject: '一位古典气质女生汉服装扮', face: '中国古典妆容柳眉朱唇', hair: '古典发髻发钗步摇古风', clothing: '精致汉服刺绣古典配色', expression: '婉约含蓄古典优雅' } },
  { id: 'char_bohemian', name: '波西米亚', icon: '🌸', fields: { subject: '一位自由洒脱女生波西米亚风', face: '自然小麦色妆容健康光泽', hair: '长卷发编发戴花环', clothing: '波西米亚长裙流苏蕾丝', expression: '自由不羁溫暖笑容' } },
  { id: 'char_goddess_elegant', name: '优雅女神', icon: '👑', fields: { subject: '一位氣質出眾的優雅女性', face: '精致高级妆质感缎面底妆', hair: '优雅盘发或大波浪', clothing: '真丝礼服或高级连衣裙', expression: '从容优雅淡淡微笑' } },
]

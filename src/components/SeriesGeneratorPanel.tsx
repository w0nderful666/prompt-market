import { useState } from 'react'
import { useDirector } from '../context/DirectorContext'

interface Props {
  onLoadPrompt?: (director: Record<string, string>) => void
}

const SCENE_TEMPLATES = [
  { id: 'studio_portrait', name: '经典棚拍人像', description: '灰背景 · 85mm · 蝴蝶光 · 半身', summary: '经典棚拍人像：灰背景，85mm 定焦，蝴蝶柔光，浅景深，专业表情', subject: '一位年轻女性', scene: '摄影棚灰色背景布前', lighting: '蝴蝶光柔光箱布光', camera: '85mm f/1.4 定焦', composition: '半身近景居中构图', atmosphere: '专业摄影棚人像' },
  { id: 'bathroom_mirror', name: '浴室镜前随手拍', description: '镜前 · 顶灯 · 生活感 · 手机拍', summary: '浴室镜前手机随手拍：镜面反射，暖白顶灯，生活化真实感', subject: '一位年轻女性', scene: '浴室洗手台镜面前，白色瓷砖', lighting: '顶部暖白灯', camera: '手机后置镜头', composition: '镜前近景半身', atmosphere: '生活化随手拍真实感' },
  { id: 'bedroom_sunlight', name: '卧室清晨窗光', description: '窗边 · 晨光 · 慵懒 · 自然态', summary: '卧室清晨自然光：窗光柔和洒入，刚起床的慵懒放松状态', subject: '一位年轻女性', scene: '卧室窗边床边', lighting: '清晨窗光柔和自然', camera: '自然光拍摄', composition: '半身侧拍', atmosphere: '慵懒放松清晨氛围' },
  { id: 'night_convenience', name: '夜晚便利店冷光', description: '深夜 · 冷光 · 街拍感 · 胶片', summary: '深夜便利店门口抓拍：冷白荧光灯混合路灯，胶片感街拍', subject: '一位年轻女性', scene: '便利店门口深夜街道', lighting: '便利店冷光混合路灯暖光', camera: '35mm 胶片机', composition: '近景半身抓拍', atmosphere: '深夜街拍冷调电影感' },
  { id: 'park_bicycle', name: '公园单车午后', description: '阳光 · 逆光 · 运动 · 自由', summary: '公园骑自行车：阳光透过树叶斑驳光影，自由快乐情绪', subject: '一位年轻女性', scene: '公园林荫小道', lighting: '午后阳光斑驳光影', camera: '抓拍动态', composition: '骑车全身动态', atmosphere: '户外自由快乐氛围' },
  { id: 'cafe_window', name: '咖啡馆窗边', description: '窗光 · 咖啡 · 书 · 文艺', summary: '韩系咖啡馆窗边：自然窗光，饮咖啡看书，文艺惬意', subject: '一位年轻女性', scene: '咖啡馆窗边座位', lighting: '窗光自然光', camera: '50mm 定焦', composition: '半身侧坐带景', atmosphere: '韩系文艺惬意' },
  { id: 'rooftop_sunset', name: '天台夕阳剪影', description: '逆光 · 剪影 · 浪漫 · 天空', summary: '城市天台夕阳逆光：天空渐变色，人物剪影，浪漫电影感', subject: '一位年轻女性', scene: '城市天台夕阳天空背景', lighting: '夕阳逆光剪影', camera: '逆光拍摄', composition: '全身剪影构图', atmosphere: '浪漫梦幻电影感' },
  { id: 'street_rain', name: '雨夜街头霓虹', description: '雨天 · 霓虹 · 倒影 · 情绪', summary: '雨夜街头霓虹灯下：地面倒影光影，冷调情绪', subject: '一位年轻女性', scene: '雨夜城市街头', lighting: '霓虹灯光混合雨水倒影', camera: '35mm 拍摄', composition: '全身街拍', atmosphere: '冷调情绪雨天氛围' },
  { id: 'cozy_livingroom', name: '客厅居家日常', description: '沙发 · 暖光 · 看书 · 放松', summary: '客厅沙发居家：暖光台灯，看书或看手机，放松日常', subject: '一位年轻女性', scene: '客厅沙发角落', lighting: '暖光台灯', camera: '自然记录感', composition: '近景半身', atmosphere: '居家温暖放松' },
  { id: 'autumn_maple', name: '秋日枫叶林', description: '枫叶 · 暖阳 · 自然 · 浪漫', summary: '秋日枫叶林漫步：金色暖阳，红橙色枫叶，浪漫自然', subject: '一位年轻女性', scene: '秋天枫叶林步道', lighting: '秋日暖阳金色光线', camera: '户外自然光', composition: '人在枫叶林中', atmosphere: '秋季温暖浪漫' },
  { id: 'street_fashion', name: '街头时尚抓拍', description: '街拍 · 时尚 · 自信 · 构图', summary: '街拍时尚：城市背景，自信大步走，时尚穿搭', subject: '一位年轻女性', scene: '城市街道现代建筑', lighting: '自然光混合环境光', camera: '街拍抓拍', composition: '全身走路动态', atmosphere: '时尚自信街头感' },
  { id: 'yoga_morning', name: '晨间瑜伽', description: '瑜伽 · 晨光 · 宁静 · 舒展', summary: '早晨瑜伽舒展：晨光洒入室内，宁静平和身心', subject: '一位年轻女性', scene: '客厅或阳台瑜伽垫', lighting: '窗光晨光', camera: '自然记录方式', composition: '全身侧拍瑜伽动作', atmosphere: '宁静平和' },
  { id: 'kpop_dance', name: 'K-Pop 舞蹈室', description: '舞蹈 · 动感 · 练习室 · 活力', summary: 'K-Pop 舞蹈练习室：全身动态，镜面墙，活力动感', subject: '一位年轻女性', scene: '舞蹈练习室镜面墙', lighting: '明亮的舞蹈室灯光', camera: '抓拍舞蹈动态', composition: '全身动态捕捉', atmosphere: '活力动感 K-Pop 风格' },
  { id: 'bedroom_cosplay', name: 'Cosplay 角色照', description: '角色扮演 · 夜场 · 戏剧化', summary: 'Cosplay 角色照：戏剧化灯光，霓虹氛围，角色投入', subject: '一位年轻女性', scene: '主题摄影棚或夜景', lighting: 'Gel 色片戏剧光', camera: '50mm 定焦', composition: '半身角色姿态', atmosphere: '戏剧化角色氛围' },
  { id: 'library_study', name: '图书馆学习', description: '安静 · 学习 · 窗边 · 书卷', summary: '图书馆窗边学习：安静书卷气，自然光透过窗户', subject: '一位年轻女性', scene: '图书馆窗边书架旁', lighting: '窗光柔和自然', camera: '安静记录', composition: '半身侧坐看书', atmosphere: '安静书卷文艺' },
  { id: 'hotel_elegant', name: '酒店精致大片', description: '酒店 · 精致 · 高端 · 画报感', summary: '高端酒店房间：精致穿搭，窗光，画报杂志风', subject: '一位年轻女性', scene: '高端酒店房间落地窗', lighting: '窗光混合室内背光', camera: '杂志画报风格', composition: '半身窗边', atmosphere: '精致高端画报感' },
  { id: 'beach_sunset', name: '海边夕阳漫步', description: '沙滩 · 夕阳 · 漫步 · 浪漫', summary: '海边沙滩夕阳漫步：金色海面，逆光浪漫', subject: '一位年轻女性', scene: '海边沙滩海面夕阳', lighting: '夕阳逆光金色', camera: '逆光拍摄', composition: '全身漫步海边', atmosphere: '海边浪漫夕阳氛围' },
  { id: 'subway_daily', name: '地铁通勤日常', description: '地铁 · 通勤 · 日常 · 纪实', summary: '地铁站通勤日常：拥挤车厢或空站台，纪实生活感', subject: '一位年轻女性', scene: '地铁站台或车厢', lighting: '地铁冷白荧光灯', camera: '手机纪实拍摄', composition: '近景站台等待', atmosphere: '通勤纪实日常感' },
  { id: 'market_vibrant', name: '夜市美食街头', description: '夜市 · 热闹 · 烟火气 · 暖调', summary: '夜市街头：五彩灯光，热闹烟火气，温暖氛围', subject: '一位年轻女性', scene: '夜市摊位彩灯', lighting: '暖色混合彩灯', camera: '35mm 街拍', composition: '半身摊位前', atmosphere: '热闹烟火气暖调' },
  { id: 'snow_winter', name: '雪景冬日暖阳', description: '雪 · 暖阳 · 冬装 · 清新', summary: '冬日雪景暖阳：白雪反射阳光，清新纯净', subject: '一位年轻女性', scene: '雪地公园或街道', lighting: '冬日暖阳雪地反射', camera: '户外拍摄', composition: '全身雪景中', atmosphere: '冬日清新纯净' },
]

export default function SeriesGeneratorPanel({ onLoadPrompt }: Props) {
  const [templateId, setTemplateId] = useState('')
  const [output, setOutput] = useState('')
  const { setDirectorData } = useDirector()

  const selectedTemplate = SCENE_TEMPLATES.find(t => t.id === templateId)

  function generateOutput() {
    const tpl = selectedTemplate
    if (tpl) {
      const director: Record<string, string> = {
        subject: tpl.subject,
        scene: tpl.scene,
        lighting: tpl.lighting,
        camera: tpl.camera,
        composition: tpl.composition,
        atmosphere: tpl.atmosphere,
      }
      setOutput(`【${tpl.name}】\n\n${tpl.summary}\n\n主体：${tpl.subject}\n场景：${tpl.scene}\n光线：${tpl.lighting}\n摄影：${tpl.camera}\n构图：${tpl.composition}\n氛围：${tpl.atmosphere}`)
      setDirectorData(director)
      if (onLoadPrompt) onLoadPrompt(director)
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-4">
        <h3 className="mb-3 text-sm font-bold text-foreground">🎨 场景模板</h3>
        <p className="mb-4 text-xs text-muted-foreground">选择场景模板，自动生成场景描述并填充到 Director</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SCENE_TEMPLATES.map(tpl => (
            <button key={tpl.id} onClick={() => { setTemplateId(tpl.id); setOutput('') }}
              className={`rounded-lg border p-3 text-left transition ${
                templateId === tpl.id
                  ? 'border-primary bg-primary/5 ring-1 ring-primary'
                  : 'border-border hover:border-primary/30 hover:bg-muted/30'
              }`}>
              <h4 className="text-sm font-bold text-foreground">{tpl.name}</h4>
              <p className="mt-1 text-xs text-muted-foreground">{tpl.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={generateOutput} disabled={!templateId}
          className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50">
          🚀 生成并填充到 Director
        </button>
        {templateId && (
          <span className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
            已选: {selectedTemplate?.name}
          </span>
        )}
      </div>

      {output && (
        <div className="rounded-lg border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">📝 生成结果</h3>
            <div className="flex gap-1">
              <button onClick={() => navigator.clipboard.writeText(output)} className="rounded bg-primary/10 px-2 py-1 text-xs font-bold text-primary hover:bg-primary/20">📋 复制</button>
            </div>
          </div>
          <pre className="whitespace-pre-wrap rounded-lg bg-muted p-3 text-xs text-foreground/80">{output}</pre>
        </div>
      )}
    </div>
  )
}

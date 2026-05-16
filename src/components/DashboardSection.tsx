import { useCallback } from 'react'
import { useDirector } from '../context/DirectorContext'

interface Props {
  onNavigate: (tabId: string, toolTabId?: string) => void
}

export default function DashboardSection({ onNavigate }: Props) {
  const { setDirectorData } = useDirector()

  const loadRandomExample = useCallback(() => {
    const examples = [
      { subject: '一位年轻女性在公园骑自行车', scene: '绿树成荫的公园小道阳光斑驳', composition: '骑车动态抓拍', lighting: '阳光透过树叶斑驳光', camera: '户外抓拍动态感', atmosphere: '户外运动自由快乐' },
      { subject: '一位年轻女性清晨在洗手台前洗漱', scene: '家庭卫生间洗手台镜面水汽', composition: '镜前近景半身', lighting: '卫生间顶灯冷白光', camera: '清晨随手拍质感', atmosphere: '清晨慵懒真实日常' },
      { subject: '一位年轻女性从便利店出来', scene: '夜晚便利店门口冷光透出', composition: '近景半身', lighting: '便利店冷光混合路灯', camera: '手机拍摄轻微噪点', atmosphere: '深夜感真实生活' },
    ]
    const ex = examples[Math.floor(Math.random() * examples.length)]
    setDirectorData(ex)
    onNavigate('tools', 'director')
  }, [setDirectorData, onNavigate])

  const stats = [
    { label: 'Active Projects', value: '0', icon: '📁' },
    { label: 'Total Prompts', value: '0', icon: '📝' },
    { label: 'Saved Configs', value: '0', icon: '💾' },
    { label: 'Theme Presets', value: '34', icon: '🎨' },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome to Prompt Director Studio</p>
        </div>
        <button onClick={loadRandomExample}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition">
          🎲 随机示例
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="rounded-xl border border-border/50 bg-card p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">{s.label}</h3>
                <p className="text-3xl font-bold text-foreground mt-1">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button onClick={() => onNavigate('presets')}
          className="rounded-xl border border-border/50 bg-card p-6 text-left hover:shadow-md transition group">
          <span className="text-3xl block mb-2">🏷️</span>
          <h3 className="font-bold text-foreground group-hover:text-primary transition">分面预设系统</h3>
          <p className="text-sm text-muted-foreground mt-1">36+ 槽位精细关键词预设</p>
        </button>
        <button onClick={() => onNavigate('tools', 'director')}
          className="rounded-xl border border-border/50 bg-card p-6 text-left hover:shadow-md transition group">
          <span className="text-3xl block mb-2">🎬</span>
          <h3 className="font-bold text-foreground group-hover:text-primary transition">Director 编辑器</h3>
          <p className="text-sm text-muted-foreground mt-1">23 模块结构化提示词编辑</p>
        </button>
        <button onClick={() => onNavigate('tools', 'series')}
          className="rounded-xl border border-border/50 bg-card p-6 text-left hover:shadow-md transition group">
          <span className="text-3xl block mb-2">🎨</span>
          <h3 className="font-bold text-foreground group-hover:text-primary transition">Series Studio</h3>
          <p className="text-sm text-muted-foreground mt-1">20 种场景模板一键生成</p>
        </button>
      </div>
    </div>
  )
}

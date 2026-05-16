import { useState, useRef, useCallback } from 'react'
import { useDataManager } from '../data/DataContext'

export default function DataManager() {
  const { userPacks, importPack, importFromFile, removePack, exportAll } = useDataManager()
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [showImport, setShowImport] = useState(false)
  const [jsonInput, setJsonInput] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const flash = useCallback((text: string, type: 'success' | 'error' = 'success') => {
    setMsg({ text, type })
    setTimeout(() => setMsg(null), 3000)
  }, [])

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const result = await importFromFile(file)
    if (result.success) flash(`导入成功: ${file.name}`)
    else flash(result.error || '导入失败', 'error')
    if (fileRef.current) fileRef.current.value = ''
  }, [importFromFile, flash])

  const handleJsonImport = useCallback(() => {
    if (!jsonInput.trim()) return
    const result = importPack(jsonInput)
    if (result.success) flash('JSON 导入成功')
    else flash(result.error || '导入失败', 'error')
    setJsonInput('')
    setShowImport(false)
  }, [jsonInput, importPack, flash])

  const handleExport = useCallback(() => {
    const json = exportAll()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prompt-market-data-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    flash('数据已导出')
  }, [exportAll, flash])

  const handleCopyTemplate = useCallback(() => {
    const template = JSON.stringify({
      meta: { name: '我的自定义词库', version: '1.0', author: 'your-name', description: '自定义提示词' },
      facets: [{ id: 'my_facet', label: '自定义分类', icon: '⭐', description: '自定义词条', slots: [
        { id: 'mySlot', label: '我的槽位', icon: '🏷️', mode: 'multi', maxSelect: 3, parentFacet: 'my_facet' }
      ], values: [
        { id: 'my_value_1', label: '词条1', slot: 'mySlot' },
        { id: 'my_value_2', label: '词条2', slot: 'mySlot' },
      ]}],
      templates: [{ id: 'my_template_1', name: '我的模板', description: '示例模板', selections: {} }],
      showcaseEntries: [],
      sceneTemplates: [],
    }, null, 2)
    navigator.clipboard.writeText(template).then(() => flash('模板已复制到剪贴板'))
  }, [flash])

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-black text-foreground flex items-center gap-2">
            <span className="text-xl">📦</span> 数据管理
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            导入/导出 JSON 提示词库 — 支持多包合并，方便社区分享
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowImport(!showImport)}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition">
            {showImport ? '取消' : '📥 导入 JSON'}
          </button>
          <button onClick={handleExport}
            className="rounded-lg border bg-muted px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted/80 transition">
            📤 导出全部
          </button>
          <button onClick={handleCopyTemplate}
            className="rounded-lg border bg-muted px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted/80 transition">
            📋 复制模板
          </button>
        </div>
      </div>

      {msg && (
        <div className={`mb-3 rounded-lg px-3 py-2 text-xs font-bold ${msg.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
          {msg.text}
        </div>
      )}

      {showImport && (
        <div className="mb-4 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4">
          <p className="text-xs font-bold text-foreground mb-2">选择 JSON 文件导入：</p>
          <input ref={fileRef} type="file" accept=".json" onChange={handleFileUpload}
            className="block w-full text-xs text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-primary-foreground hover:file:bg-primary/90 mb-3" />
          <p className="text-xs text-muted-foreground mb-2">或粘贴 JSON 内容：</p>
          <textarea value={jsonInput} onChange={e => setJsonInput(e.target.value)}
            placeholder='{"meta":{"name":"..."}, "facets":[], "templates":[]}'
            className="w-full h-32 rounded-lg border bg-background px-3 py-2 text-xs font-mono text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <button onClick={handleJsonImport}
            className="mt-2 rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition">
            确认导入
          </button>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs font-bold text-muted-foreground">已加载数据包：</p>
        <div className="flex flex-wrap gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border bg-blue-50 dark:bg-blue-900/20 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
            🏗️ 内置词库
            <span className="text-[10px] text-blue-500">v1.0</span>
          </div>
          {userPacks.map((pack, i) => (
            <div key={i} className="inline-flex items-center gap-1.5 rounded-full border bg-green-50 dark:bg-green-900/20 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-300">
              📦 {pack.meta.name}
              {pack.meta.version && <span className="text-[10px] text-green-500">v{pack.meta.version}</span>}
              <button onClick={() => removePack(i)} className="ml-1 text-green-500 hover:text-red-500 transition" title="移除">✕</button>
            </div>
          ))}
          {userPacks.length === 0 && (
            <span className="text-xs text-muted-foreground italic">暂无用户数据包</span>
          )}
        </div>
      </div>

      <div className="mt-3 rounded-lg bg-muted/50 p-3">
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          <strong>JSON 格式说明：</strong>每个 JSON 文件可包含以下字段（均为可选）：
          <code className="mx-1 rounded bg-muted px-1 py-0.5 text-[10px]">meta</code>
          <code className="mx-1 rounded bg-muted px-1 py-0.5 text-[10px]">facets</code>
          <code className="mx-1 rounded bg-muted px-1 py-0.5 text-[10px]">templates</code>
          <code className="mx-1 rounded bg-muted px-1 py-0.5 text-[10px]">showcaseEntries</code>
          <code className="mx-1 rounded bg-muted px-1 py-0.5 text-[10px]">sceneTemplates</code>
          <code className="mx-1 rounded bg-muted px-1 py-0.5 text-[10px]">slotMapping</code>
          。多个 JSON 文件可独立导入，相同 ID 的词条会被覆盖，不同的会合并。
        </p>
      </div>
    </div>
  )
}

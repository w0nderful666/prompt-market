interface Conflict { type: string; word1: string; word2: string; message: string }

interface Props {
  conflicts: Conflict[]
  onDismiss: () => void
  onRemoveWord: (word: string) => void
}

export default function ConflictPanel({ conflicts, onDismiss, onRemoveWord }: Props) {
  return (
    <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-900/20">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-bold text-amber-800 dark:text-amber-300">⚠️ 检测到 {conflicts.length} 个冲突</h3>
        <button onClick={onDismiss} className="text-xs text-amber-600 hover:text-amber-800 dark:text-amber-400">✕ 忽略</button>
      </div>
      <div className="space-y-2">
        {conflicts.map((c, i) => (
          <div key={i} className="flex items-center justify-between rounded bg-amber-100/50 px-3 py-2 dark:bg-amber-800/20">
            <div className="flex items-center gap-2">
              <span className="rounded bg-amber-200 px-1.5 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-700 dark:text-amber-200">{c.type}</span>
              <span className="text-xs text-amber-700 dark:text-amber-300">{c.message}</span>
            </div>
            <button onClick={() => onRemoveWord(c.word1)} className="text-xs text-amber-600 hover:text-amber-800 dark:text-amber-400">移除</button>
          </div>
        ))}
      </div>
    </div>
  )
}

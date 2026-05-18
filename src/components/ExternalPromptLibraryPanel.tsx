import { useEffect, useMemo, useState } from 'react'
import type {
  ExternalPromptLibraryChunk,
  ExternalPromptLibraryChunkMeta,
  ExternalPromptLibraryEntry,
  ExternalPromptLibraryEntrySummary,
  ExternalPromptLibraryIndex,
  ExternalPromptLibraryNormalizedCategory,
} from '../core/types'
import { usePromptDispatch } from '../context/PromptStateContext'
import { EXTERNAL_LIBRARY_MANIFEST_PATH, EXTERNAL_LIBRARY_PAGE_SIZES, type ExternalLibraryPageSize } from '../data/externalPromptLibrary'
import { copyToClipboard } from '../utils/clipboard'

interface Props {
  onImportToAdvanced?: () => void
}

const UI = {
  title: '\u5916\u6302\u8bcd\u5e93',
  loadingText: '\u6b63\u5728\u52a0\u8f7d\u5916\u6302\u8bcd\u5e93\u7d22\u5f15\u3002\u8fd9\u4e00\u9875\u73b0\u5728\u4f1a\u5148\u8bfb\u53d6\u8f7b\u91cf\u7d22\u5f15\uff0c\u518d\u6309\u9700\u52a0\u8f7d\u8be6\u60c5\uff0c\u4e0d\u4f1a\u4e00\u4e0a\u6765\u628a\u51e0\u5343\u6761\u5185\u5bb9\u5168\u90e8\u94fa\u5f00\u3002',
  loadFailed: '\u5916\u6302\u8bcd\u5e93\u52a0\u8f7d\u5931\u8d25',
  emptyIndex: '\u7d22\u5f15\u4e3a\u7a7a',
  intro: '\u8fd9\u91cc\u6539\u6210\u4e86\u201c\u5148\u9009\u5206\u7c7b\uff0c\u518d\u5206\u9875\u6d4f\u89c8\u201d\u3002\u9ed8\u8ba4\u5148\u7ed9\u4f60\u770b\u66f4\u9002\u5408\u4eba\u50cf\u6444\u5f71\u7684\u5206\u7c7b\uff0c\u907f\u514d\u4e00\u6b21\u628a\u51e0\u5343\u6761\u7ed3\u679c\u5168\u90e8\u6e32\u67d3\u51fa\u6765\u3002',
  totalCount: '\u603b\u6536\u5f55',
  currentCategory: '\u5f53\u524d\u5206\u7c7b',
  chunkCount: '\u5206\u7247',
  chooseCategory: '\u4f18\u5148\u9009\u62e9\u5206\u7c7b',
  recommended: '\u63a8\u8350',
  query: '\u5173\u952e\u8bcd\u641c\u7d22',
  queryPlaceholder: '\u5728\u5f53\u524d\u5206\u7c7b\u5185\u641c\u7d22\u6807\u9898\u3001\u6458\u8981\u3001\u98ce\u683c\u3001\u573a\u666f',
  source: '\u6765\u6e90',
  allSources: '\u5168\u90e8\u6765\u6e90',
  quality: '\u8d28\u91cf\u5c42',
  allQuality: '\u5168\u90e8\u8d28\u91cf',
  language: '\u8bed\u8a00',
  allLanguages: '\u5168\u90e8\u8bed\u8a00',
  pageSize: '\u6bcf\u9875\u6570\u91cf',
  portraitOnly: '\u53ea\u770b\u9002\u5408\u4eba\u50cf\u6444\u5f71',
  recommendedOnly: '\u53ea\u770b\u63a8\u8350\u6761\u76ee',
  recommendedPriority: '\u63a8\u8350\u4f18\u5148\u6392\u5e8f',
  highQualityFirst: '\u9ad8\u8d28\u91cf\u4f18\u5148\u6392\u5e8f',
  showing: '\u5f53\u524d\u663e\u793a',
  page: '\u7b2c',
  previous: '\u4e0a\u4e00\u9875',
  next: '\u4e0b\u4e00\u9875',
  structuredTemplate: '\u7ed3\u6784\u6a21\u677f',
  casePrompt: '\u6848\u4f8b\u63d0\u793a\u8bcd',
  viewSource: '\u67e5\u770b\u6765\u6e90',
  recommendedForProduct: '\u63a8\u8350\u7ed9\u5f53\u524d\u4ea7\u54c1',
  summary: '\u7d22\u5f15\u6458\u8981',
  category: '\u5206\u7c7b',
  confidence: '\u7f6e\u4fe1\u5ea6',
  chunkError: '\u8fd9\u4e2a\u5206\u7247\u52a0\u8f7d\u5931\u8d25\uff1a',
  rawPrompt: '\u539f\u59cb\u63d0\u793a\u8bcd',
  importNotes: '\u5bfc\u5165\u8bf4\u660e',
  importNotesBody: '\u8fd9\u6761\u5185\u5bb9\u4f1a\u5148\u5c1d\u8bd5\u6620\u5c04\u5230\u9ad8\u7ea7\u7f16\u8f91\u8bcd\u5e93\uff0c\u8bc6\u522b\u4e0d\u5230\u7684\u90e8\u5206\u4f1a\u4fdd\u7559\u5230\u81ea\u7531\u8865\u5145\u533a\uff0c\u65b9\u4fbf\u4f60\u7ee7\u7eed\u5fae\u8c03\u3002',
  importMeta: '\u5bfc\u5165\u4fe1\u606f',
  loadingDetails: '\u6b63\u5728\u52a0\u8f7d\u8be6\u60c5...',
  showDetails: '\u67e5\u770b\u8be6\u60c5',
  hideDetails: '\u6536\u8d77\u8be6\u60c5',
  copyPrompt: '\u590d\u5236\u63d0\u793a\u8bcd',
  copiedPrompt: '\u5df2\u590d\u5236\u63d0\u793a\u8bcd',
  importToAdvanced: '\u5bfc\u5165\u5230\u9ad8\u7ea7\u7f16\u8f91',
  importedToAdvanced: '\u5df2\u5bfc\u5165\u9ad8\u7ea7\u7f16\u8f91',
  emptyTitle: '\u5f53\u524d\u5206\u7c7b\u4e0b\u6ca1\u6709\u7ed3\u679c',
  emptyBody: '\u53ef\u4ee5\u6362\u4e00\u4e2a\u5206\u7c7b\uff0c\u6216\u8005\u653e\u5bbd\u5173\u952e\u8bcd\u3001\u6765\u6e90\u3001\u8bed\u8a00\u548c\u8d28\u91cf\u7b5b\u9009\u6761\u4ef6\u3002',
  noneSelected: '\u672a\u9009\u62e9',
} as const

const DEFAULT_CATEGORY: ExternalPromptLibraryNormalizedCategory = 'portrait'
const DEFAULT_PAGE_SIZE: ExternalLibraryPageSize = 12

const QUALITY_ORDER = {
  curated: 0,
  usable: 1,
  noisy: 2,
} as const

const QUALITY_LABELS = {
  curated: '\u9ad8\u8d28\u91cf',
  usable: '\u53ef\u76f4\u63a5\u7528',
  noisy: '\u6587\u672c\u8f83\u6742',
} as const

const SOURCE_TIER_LABELS = {
  'structured-primary': '\u4e3b\u7ed3\u6784\u5316\u6e90',
  'large-gallery-secondary': '\u8865\u5145\u56fe\u5e93\u6e90',
} as const

const LANGUAGE_LABELS = {
  zh: '\u4e2d\u6587',
  en: '\u82f1\u6587',
  mixed: '\u4e2d\u82f1\u6df7\u5408',
} as const

function buildAssetUrl(assetPath: string) {
  const base = import.meta.env.BASE_URL || '/'
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base
  return `${normalizedBase}${assetPath}`
}

function matchesQuery(entry: ExternalPromptLibraryEntrySummary, query: string) {
  if (!query.trim()) return true
  return entry.searchText.includes(query.trim().toLowerCase())
}

function getPageItems<T>(list: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize
  return list.slice(start, start + pageSize)
}

function entryDisplayTitle(entry: ExternalPromptLibraryEntrySummary) {
  return entry.displayTitleZh?.trim() || entry.title
}

export default function ExternalPromptLibraryPanel({ onImportToAdvanced }: Props) {
  const dispatch = usePromptDispatch()
  const [manifest, setManifest] = useState<ExternalPromptLibraryIndex | null>(null)
  const [manifestError, setManifestError] = useState<string | null>(null)
  const [manifestLoading, setManifestLoading] = useState(true)

  const [query, setQuery] = useState('')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [activeCategory, setActiveCategory] = useState<ExternalPromptLibraryNormalizedCategory>(DEFAULT_CATEGORY)
  const [qualityFilter, setQualityFilter] = useState('all')
  const [languageFilter, setLanguageFilter] = useState('all')
  const [portraitOnly, setPortraitOnly] = useState(true)
  const [recommendedOnly, setRecommendedOnly] = useState(false)
  const [recommendedPriority, setRecommendedPriority] = useState(true)
  const [highQualityFirst, setHighQualityFirst] = useState(true)
  const [pageSize, setPageSize] = useState<ExternalLibraryPageSize>(DEFAULT_PAGE_SIZE)
  const [page, setPage] = useState(1)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [importedId, setImportedId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [loadingEntryId, setLoadingEntryId] = useState<string | null>(null)
  const [chunkCache, setChunkCache] = useState<Record<string, ExternalPromptLibraryChunk>>({})
  const [chunkErrors, setChunkErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    let cancelled = false

    async function loadManifest() {
      setManifestLoading(true)
      setManifestError(null)
      try {
        const response = await fetch(buildAssetUrl(EXTERNAL_LIBRARY_MANIFEST_PATH))
        if (!response.ok) {
          throw new Error(`\u52a0\u8f7d\u5931\u8d25\uff1a${response.status}`)
        }
        const data = await response.json() as ExternalPromptLibraryIndex
        if (cancelled) return
        setManifest(data)
      } catch (error) {
        if (cancelled) return
        setManifestError(error instanceof Error ? error.message : '\u5916\u6302\u8bcd\u5e93\u7d22\u5f15\u52a0\u8f7d\u5931\u8d25')
      } finally {
        if (!cancelled) setManifestLoading(false)
      }
    }

    void loadManifest()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    setPage(1)
  }, [activeCategory, languageFilter, pageSize, portraitOnly, qualityFilter, query, recommendedOnly, sourceFilter])

  const sourceById = useMemo(() => {
    const map = new Map<string, ExternalPromptLibraryIndex['sources'][number]>()
    for (const source of manifest?.sources ?? []) map.set(source.id, source)
    return map
  }, [manifest])

  const chunkMetaById = useMemo(() => {
    const map = new Map<string, ExternalPromptLibraryChunkMeta>()
    for (const chunk of manifest?.chunks ?? []) map.set(chunk.id, chunk)
    return map
  }, [manifest])

  const categories = useMemo(() => manifest?.categories ?? [], [manifest])

  const filteredEntries = useMemo(() => {
    const allEntries = manifest?.entryIndex ?? []
    const list = allEntries.filter(entry => {
      if (entry.normalizedCategory !== activeCategory) return false
      if (portraitOnly && !entry.portraitFocused) return false
      if (recommendedOnly && !entry.recommendedForCurrentProduct) return false
      if (sourceFilter !== 'all' && entry.sourceId !== sourceFilter) return false
      if (qualityFilter !== 'all' && entry.qualityTier !== qualityFilter) return false
      if (languageFilter !== 'all' && entry.language !== languageFilter) return false
      return matchesQuery(entry, query)
    })

    return list.sort((a, b) => {
      if (recommendedPriority && a.recommendedForCurrentProduct !== b.recommendedForCurrentProduct) {
        return a.recommendedForCurrentProduct ? -1 : 1
      }
      if (highQualityFirst && a.qualityTier !== b.qualityTier) {
        return QUALITY_ORDER[a.qualityTier] - QUALITY_ORDER[b.qualityTier]
      }
      if (a.importConfidence !== b.importConfidence) {
        return b.importConfidence - a.importConfidence
      }
      return entryDisplayTitle(a).localeCompare(entryDisplayTitle(b))
    })
  }, [activeCategory, highQualityFirst, languageFilter, manifest, portraitOnly, qualityFilter, query, recommendedOnly, recommendedPriority, sourceFilter])

  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pagedEntries = useMemo(() => getPageItems(filteredEntries, currentPage, pageSize), [currentPage, filteredEntries, pageSize])
  const resultStart = filteredEntries.length === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const resultEnd = Math.min(currentPage * pageSize, filteredEntries.length)
  const pageNumbers = useMemo(() => {
    const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4))
    const end = Math.min(totalPages, start + 4)
    return Array.from({ length: end - start + 1 }, (_, index) => start + index)
  }, [currentPage, totalPages])

  async function ensureEntry(summary: ExternalPromptLibraryEntrySummary): Promise<ExternalPromptLibraryEntry | null> {
    const cached = chunkCache[summary.chunkId]
    if (cached) {
      return cached.entries.find(entry => entry.id === summary.id) ?? null
    }

    const meta = chunkMetaById.get(summary.chunkId)
    if (!meta) return null

    setLoadingEntryId(summary.id)
    try {
      const response = await fetch(buildAssetUrl(meta.path))
      if (!response.ok) {
        throw new Error(`\u5206\u7247\u52a0\u8f7d\u5931\u8d25\uff1a${response.status}`)
      }

      const chunk = await response.json() as ExternalPromptLibraryChunk
      setChunkCache(previous => ({ ...previous, [summary.chunkId]: chunk }))
      setChunkErrors(previous => {
        const next = { ...previous }
        delete next[summary.chunkId]
        return next
      })
      return chunk.entries.find(entry => entry.id === summary.id) ?? null
    } catch (error) {
      const message = error instanceof Error ? error.message : '\u5206\u7247\u52a0\u8f7d\u5931\u8d25'
      setChunkErrors(previous => ({ ...previous, [summary.chunkId]: message }))
      return null
    } finally {
      setLoadingEntryId(current => (current === summary.id ? null : current))
    }
  }

  async function handleCopy(summary: ExternalPromptLibraryEntrySummary) {
    const entry = await ensureEntry(summary)
    if (!entry) return
    const success = await copyToClipboard(entry.prompt)
    if (!success) return
    setCopiedId(entry.id)
    setTimeout(() => setCopiedId(current => (current === entry.id ? null : current)), 1800)
  }

  async function handleImport(summary: ExternalPromptLibraryEntrySummary) {
    const entry = await ensureEntry(summary)
    if (!entry) return
    dispatch({ type: 'IMPORT_EXTERNAL_LIBRARY_ENTRY', entry })
    setImportedId(entry.id)
    setTimeout(() => setImportedId(current => (current === entry.id ? null : current)), 1800)
    onImportToAdvanced?.()
  }

  async function handleToggleDetails(summary: ExternalPromptLibraryEntrySummary) {
    if (expandedId === summary.id) {
      setExpandedId(null)
      return
    }
    const entry = await ensureEntry(summary)
    if (!entry) return
    setExpandedId(entry.id)
  }

  function renderExpandedEntry(summary: ExternalPromptLibraryEntrySummary) {
    const chunk = chunkCache[summary.chunkId]
    const entry = chunk?.entries.find(item => item.id === summary.id)
    if (!entry || expandedId !== summary.id) return null

    return (
      <div className="mt-4 rounded-2xl border border-border bg-muted/30 p-4">
        <div className="mb-2 text-sm font-bold text-foreground">{UI.rawPrompt}</div>
        <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{entry.prompt}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl bg-background/80 p-3 text-sm leading-7 text-muted-foreground">
            <div className="mb-1 text-xs font-bold text-foreground">{UI.importNotes}</div>
            {UI.importNotesBody}
          </div>
          <div className="rounded-xl bg-background/80 p-3 text-sm leading-7 text-muted-foreground">
            <div className="mb-1 text-xs font-bold text-foreground">{UI.importMeta}</div>
            {Math.round(entry.importConfidence * 100)}% · {SOURCE_TIER_LABELS[entry.sourceTier]} · {QUALITY_LABELS[entry.qualityTier]}
          </div>
        </div>
      </div>
    )
  }

  if (manifestLoading) {
    return (
      <section className="rounded-2xl border border-border bg-card/80 p-8 shadow-sm">
        <h2 className="text-2xl font-black text-foreground">{UI.title}</h2>
        <p className="mt-3 text-base leading-7 text-muted-foreground">{UI.loadingText}</p>
      </section>
    )
  }

  if (manifestError || !manifest) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-8 shadow-sm">
        <h2 className="text-2xl font-black text-red-700">{UI.loadFailed}</h2>
        <p className="mt-3 text-base leading-7 text-red-600">{manifestError ?? UI.emptyIndex}</p>
      </section>
    )
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm backdrop-blur-sm lg:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-foreground">{UI.title}</h2>
            <p className="max-w-4xl text-base leading-7 text-muted-foreground">{UI.intro}</p>
          </div>
          <div className="rounded-2xl bg-primary/8 px-5 py-4 text-sm font-medium text-primary">
            {UI.totalCount} {manifest.entryIndex.length} \u6761 · {UI.currentCategory} {categories.find(category => category.id === activeCategory)?.label ?? UI.noneSelected} · {UI.chunkCount} {manifest.chunks.length} \u4e2a
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-3 text-sm font-bold text-foreground">{UI.chooseCategory}</div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`rounded-2xl border px-4 py-4 text-left transition ${
                  activeCategory === category.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-background/70 hover:border-primary/40'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-base font-black text-foreground">{category.label}</div>
                  {category.recommended && (
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600">
                      {UI.recommended}
                    </span>
                  )}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {category.entryCount} \u6761
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-3 xl:grid-cols-[minmax(0,1.8fr)_repeat(4,minmax(0,0.85fr))]">
          <label className="space-y-2">
            <span className="text-sm font-bold text-foreground">{UI.query}</span>
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary/50"
              placeholder={UI.queryPlaceholder}
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-bold text-foreground">{UI.source}</span>
            <select
              value={sourceFilter}
              onChange={event => setSourceFilter(event.target.value)}
              className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary/50"
            >
              <option value="all">{UI.allSources}</option>
              {manifest.sources.map(source => (
                <option key={source.id} value={source.id}>{source.label}</option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-bold text-foreground">{UI.quality}</span>
            <select
              value={qualityFilter}
              onChange={event => setQualityFilter(event.target.value)}
              className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary/50"
            >
              <option value="all">{UI.allQuality}</option>
              <option value="curated">{QUALITY_LABELS.curated}</option>
              <option value="usable">{QUALITY_LABELS.usable}</option>
              <option value="noisy">{QUALITY_LABELS.noisy}</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-bold text-foreground">{UI.language}</span>
            <select
              value={languageFilter}
              onChange={event => setLanguageFilter(event.target.value)}
              className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary/50"
            >
              <option value="all">{UI.allLanguages}</option>
              <option value="zh">{LANGUAGE_LABELS.zh}</option>
              <option value="en">{LANGUAGE_LABELS.en}</option>
              <option value="mixed">{LANGUAGE_LABELS.mixed}</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-bold text-foreground">{UI.pageSize}</span>
            <select
              value={pageSize}
              onChange={event => setPageSize(Number(event.target.value) as ExternalLibraryPageSize)}
              className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary/50"
            >
              {EXTERNAL_LIBRARY_PAGE_SIZES.map(size => (
                <option key={size} value={size}>{size} \u6761 / \u9875</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2 xl:grid-cols-4">
          <label className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground">
            <input
              type="checkbox"
              checked={portraitOnly}
              onChange={event => setPortraitOnly(event.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            {UI.portraitOnly}
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground">
            <input
              type="checkbox"
              checked={recommendedOnly}
              onChange={event => setRecommendedOnly(event.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            {UI.recommendedOnly}
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground">
            <input
              type="checkbox"
              checked={recommendedPriority}
              onChange={event => setRecommendedPriority(event.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            {UI.recommendedPriority}
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground">
            <input
              type="checkbox"
              checked={highQualityFirst}
              onChange={event => setHighQualityFirst(event.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            {UI.highQualityFirst}
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-sm leading-7 text-muted-foreground">
            {UI.showing} {resultStart}-{resultEnd} / {filteredEntries.length} \u6761 · {UI.page} {currentPage} / {totalPages} \u9875
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setPage(current => Math.max(1, current - 1))}
              disabled={currentPage === 1}
              className="rounded-xl border border-border px-4 py-2 text-sm font-bold text-foreground transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              {UI.previous}
            </button>
            {pageNumbers.map(candidate => (
              <button
                key={candidate}
                onClick={() => setPage(candidate)}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                  candidate === currentPage
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border text-foreground'
                }`}
              >
                {candidate}
              </button>
            ))}
            <button
              onClick={() => setPage(current => Math.min(totalPages, current + 1))}
              disabled={currentPage === totalPages}
              className="rounded-xl border border-border px-4 py-2 text-sm font-bold text-foreground transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              {UI.next}
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {pagedEntries.map(entry => {
          const source = sourceById.get(entry.sourceId)
          const isLoading = loadingEntryId === entry.id
          const error = chunkErrors[entry.chunkId]
          const displayTitle = entryDisplayTitle(entry)
          const displaySummary = entry.displaySummaryZh ?? entry.description ?? '\u8fd9\u6761\u5916\u90e8\u63d0\u793a\u8bcd\u5df2\u7ecf\u5165\u5e93\uff0c\u53ef\u4ee5\u76f4\u63a5\u5c55\u5f00\u67e5\u770b\u539f\u59cb\u5185\u5bb9\u3002'

          return (
            <article key={entry.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{entry.displayCategoryZh}</span>
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                      {entry.entryKind === 'template' ? UI.structuredTemplate : UI.casePrompt}
                    </span>
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                      {LANGUAGE_LABELS[entry.language]}
                    </span>
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                      {QUALITY_LABELS[entry.qualityTier]}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-foreground">{displayTitle}</h3>
                  {entry.displayTitleZh && entry.displayTitleZh !== entry.title && (
                    <p className="text-sm text-muted-foreground">{entry.title}</p>
                  )}
                  <p className="text-sm leading-6 text-muted-foreground">
                    {(source?.label ?? entry.sourceRepo)} · {entry.author} · {SOURCE_TIER_LABELS[entry.sourceTier]}
                  </p>
                </div>
                <a
                  href={entry.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-border px-4 py-2 text-sm font-bold text-foreground transition hover:border-primary/40 hover:text-primary"
                >
                  {UI.viewSource}
                </a>
              </div>

              <p className="mt-4 text-sm leading-7 text-muted-foreground">{displaySummary}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {entry.recommendedForCurrentProduct && (
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600">
                    {UI.recommendedForProduct}
                  </span>
                )}
                {entry.styleTags.slice(0, 5).map(tag => (
                  <span key={`${entry.id}-style-${tag}`} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                    {tag}
                  </span>
                ))}
                {entry.sceneTags.slice(0, 5).map(tag => (
                  <span key={`${entry.id}-scene-${tag}`} className="rounded-full bg-secondary/50 px-3 py-1 text-xs text-foreground/80">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-border bg-muted/30 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">{UI.summary}</span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {UI.category}\uff1a{entry.displayCategoryZh} · {UI.confidence} {Math.round(entry.importConfidence * 100)}%
                  </span>
                </div>
                <p className="line-clamp-4 text-sm leading-7 text-muted-foreground">
                  {entry.description ?? entry.searchText.slice(0, 240)}
                </p>
              </div>

              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {UI.chunkError}{error}
                </div>
              )}

              {renderExpandedEntry(entry)}

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => void handleToggleDetails(entry)}
                  className="rounded-xl border border-border px-4 py-2.5 text-sm font-bold text-foreground transition hover:border-primary/40 hover:text-primary"
                >
                  {isLoading ? UI.loadingDetails : expandedId === entry.id ? UI.hideDetails : UI.showDetails}
                </button>
                <button
                  onClick={() => void handleCopy(entry)}
                  className="rounded-xl border border-border px-4 py-2.5 text-sm font-bold text-foreground transition hover:border-primary/40 hover:text-primary"
                >
                  {copiedId === entry.id ? UI.copiedPrompt : UI.copyPrompt}
                </button>
                <button
                  onClick={() => void handleImport(entry)}
                  className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
                >
                  {importedId === entry.id ? UI.importedToAdvanced : UI.importToAdvanced}
                </button>
              </div>
            </article>
          )
        })}
      </section>

      {pagedEntries.length === 0 && (
        <section className="rounded-2xl border border-dashed border-border bg-card/60 p-10 text-center">
          <h3 className="text-lg font-black text-foreground">{UI.emptyTitle}</h3>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">{UI.emptyBody}</p>
        </section>
      )}
    </div>
  )
}

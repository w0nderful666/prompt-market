import { ThemeProvider, useTheme } from './context/ThemeContext'
import { useEffect, useState, useCallback } from 'react'
import { applyTheme } from './lib/applyTheme'
import { DirectorProvider } from './context/DirectorContext'
import { DataProvider } from './data/DataContext'
import ErrorBoundary from './components/ErrorBoundary'
import AppHeader from './components/AppHeader'
import AppNavigation from './components/AppNavigation'
import AppFooter from './components/AppFooter'
import DashboardSection from './components/DashboardSection'
import DirectorEditor from './components/DirectorEditor'
import SeriesSection from './components/SeriesSection'
import SettingsSection from './components/SettingsSection'
import PromptScorePanel from './components/PromptScorePanel'
import VariantsPanel from './components/VariantsPanel'
import FacetedPresetPanel from './components/FacetedPresetPanel'
import DeconstructorPanel from './components/DeconstructorPanel'
import ShowcaseSection from './components/ShowcaseSection'
import DataManager from './components/DataManager'
import { scorePrompt } from './utils/promptScore'
import { generateVariants } from './utils/variantGenerator'

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'presets', label: 'Presets', icon: '🏷️' },
  { id: 'tools', label: 'Tools', icon: '🔧' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

const TOOL_TABS = [
  { id: 'director', label: 'Director', icon: '🎬' },
  { id: 'showcase', label: 'Showcase', icon: '🖼️' },
  { id: 'series', label: 'Series Studio', icon: '🎨' },
  { id: 'deconstructor', label: 'Deconstructor', icon: '🔍' },
  { id: 'lab', label: 'Lab', icon: '🧪' },
  { id: 'data', label: '数据管理', icon: '📦' },
]

function simpleScore(director: Record<string, string>) {
  return scorePrompt(director as any)
}

function simpleVariants(director: Record<string, string>) {
  return generateVariants(director as any)
}

function AppContent() {
  const [activeTab, setActiveTab] = useState('presets')
  const [activeToolTab, setActiveToolTab] = useState('director')
  const [toasts, setToasts] = useState<Array<{ id: number; msg: string; type: 'success' | 'error' | 'info' }>>([])
  const { themeId, mode, bgClass } = useTheme()

  useEffect(() => {
    applyTheme(themeId, mode)
  }, [themeId, mode])

  const addToast = useCallback((msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, msg, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 2500)
  }, [])

  const handleNavigate = useCallback((id: string) => {
    setActiveTab(id)
    if (id === 'tools') setActiveToolTab('director')
  }, [])

  const dashboardNavigation = useCallback((tabId: string, toolTabId?: string) => {
    if (toolTabId) { setActiveToolTab(toolTabId); setActiveTab('tools') }
    else { setActiveTab(tabId) }
  }, [])

  const typeStyles = { success: 'bg-green-600 text-white', error: 'bg-red-600 text-white', info: 'bg-primary text-primary-foreground' }

  return (
    <div className={`min-h-screen flex flex-col ${bgClass}`}>
      <AppHeader />
      <AppNavigation tabs={TABS} activeTab={activeTab} onNavigate={handleNavigate} />

      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id} className={`rounded-lg px-4 py-2 text-sm font-bold shadow-lg animate-slide-up ${typeStyles[t.type]}`}>
            {t.msg}
          </div>
        ))}
      </div>

      <main className="flex-1 mx-auto w-full max-w-7xl p-3">
        <ErrorBoundary>
          {activeTab === 'dashboard' && <DashboardSection onNavigate={dashboardNavigation} />}
          {activeTab === 'presets' && <FacetedPresetPanel onNavigateToDirector={() => { setActiveToolTab('director'); setActiveTab('tools'); }} />}
          {activeTab === 'tools' && (
            <div>
              <div className="mb-4 flex gap-1 flex-wrap">
                {TOOL_TABS.map(t => (
                  <button key={t.id} onClick={() => setActiveToolTab(t.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                      activeToolTab === t.id ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'
                    }`}
                    role="tab" aria-selected={activeToolTab === t.id} aria-label={t.label}>
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
              {activeToolTab === 'director' && <DirectorEditor />}
              {activeToolTab === 'showcase' && <ShowcaseSection />}
              {activeToolTab === 'series' && <SeriesSection />}
              {activeToolTab === 'deconstructor' && <DeconstructorPanel />}
              {activeToolTab === 'lab' && (
                <div>
                  <h2 className="mb-1 text-lg font-black text-foreground">🧪 Lab</h2>
                  <p className="mb-4 text-sm text-muted-foreground">提示词诊断工具集 — 评分、变体生成</p>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-lg border bg-card p-4">
                      <h3 className="mb-3 text-sm font-bold text-foreground">📊 质量评分</h3>
                      <PromptScorePanel onScore={simpleScore} />
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                      <h3 className="mb-3 text-sm font-bold text-foreground">🔄 变体生成</h3>
                      <VariantsPanel onGenerate={simpleVariants} />
                    </div>
                  </div>
                </div>
              )}
              {activeToolTab === 'data' && <DataManager />}
            </div>
          )}
          {activeTab === 'settings' && <SettingsSection />}
        </ErrorBoundary>
      </main>

      <AppFooter />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <DirectorProvider>
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </DirectorProvider>
      </DataProvider>
    </ThemeProvider>
  )
}

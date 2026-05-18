import { useEffect, useState } from 'react'
import AppFooter from './components/AppFooter'
import AppHeader from './components/AppHeader'
import AppNavigation from './components/AppNavigation'
import DirectorPanel from './components/DirectorPanel'
import ErrorBoundary from './components/ErrorBoundary'
import ExternalPromptLibraryPanel from './components/ExternalPromptLibraryPanel'
import FacetedPresetPanel from './components/FacetedPresetPanel'
import SettingsSection from './components/SettingsSection'
import { DirectorProvider } from './context/DirectorContext'
import { PresetPackProvider } from './context/PresetPackContext'
import { PromptStateProvider } from './context/PromptStateContext'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { applyTheme } from './lib/applyTheme'

const TABS = [
  { id: 'quick-gen', label: '快速生成', icon: '🎯' },
  { id: 'advanced-edit', label: '高级编辑', icon: '🧰' },
  { id: 'external-library', label: '外挂词库', icon: '📚' },
  { id: 'settings', label: '设置', icon: '⚙️' },
]

function AppContent() {
  const [activeTab, setActiveTab] = useState('quick-gen')
  const { themeId, mode, bgClass } = useTheme()

  useEffect(() => {
    applyTheme(themeId, mode)
  }, [themeId, mode])

  return (
    <div className={`min-h-screen ${bgClass} flex flex-col`}>
      <AppHeader />
      <AppNavigation tabs={TABS} activeTab={activeTab} onNavigate={setActiveTab} />

      <main className="mx-auto flex-1 w-full max-w-[1680px] px-4 py-4 lg:px-6 lg:py-6">
        <ErrorBoundary>
          {activeTab === 'quick-gen' && (
            <DirectorPanel onNavigateToAdvanced={() => setActiveTab('advanced-edit')} />
          )}
          {activeTab === 'advanced-edit' && (
            <FacetedPresetPanel onNavigateToQuick={() => setActiveTab('quick-gen')} />
          )}
          {activeTab === 'external-library' && (
            <ExternalPromptLibraryPanel onImportToAdvanced={() => setActiveTab('advanced-edit')} />
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
      <PromptStateProvider>
        <PresetPackProvider>
          <DirectorProvider>
            <ErrorBoundary>
              <AppContent />
            </ErrorBoundary>
          </DirectorProvider>
        </PresetPackProvider>
      </PromptStateProvider>
    </ThemeProvider>
  )
}

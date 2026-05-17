import { ThemeProvider, useTheme } from './context/ThemeContext'
import { useEffect, useState } from 'react'
import { applyTheme } from './lib/applyTheme'
import { PresetPackProvider } from './context/PresetPackContext'
import { PromptStateProvider } from './context/PromptStateContext'
import { DirectorProvider } from './context/DirectorContext'
import ErrorBoundary from './components/ErrorBoundary'
import AppHeader from './components/AppHeader'
import AppNavigation from './components/AppNavigation'
import AppFooter from './components/AppFooter'
import SettingsSection from './components/SettingsSection'
import FacetedPresetPanel from './components/FacetedPresetPanel'
import DirectorPanel from './components/DirectorPanel'

const TABS = [
  { id: 'quick-gen', label: '快速生成', icon: '🎬' },
  { id: 'advanced-edit', label: '高级编辑', icon: '🏷️' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

function AppContent() {
  const [activeTab, setActiveTab] = useState('quick-gen')
  const { themeId, mode, bgClass } = useTheme()

  useEffect(() => {
    applyTheme(themeId, mode)
  }, [themeId, mode])

  return (
    <div className={`min-h-screen flex flex-col ${bgClass}`}>
      <AppHeader />
      <AppNavigation tabs={TABS} activeTab={activeTab} onNavigate={setActiveTab} />

      <main className="flex-1 mx-auto w-full max-w-7xl p-3">
        <ErrorBoundary>
          {activeTab === 'quick-gen' && <DirectorPanel onNavigateToAdvanced={() => setActiveTab('advanced-edit')} />}
          {activeTab === 'advanced-edit' && <FacetedPresetPanel onNavigateToQuick={() => setActiveTab('quick-gen')} />}
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

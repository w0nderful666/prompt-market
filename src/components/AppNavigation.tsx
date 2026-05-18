interface Tab {
  id: string
  label: string
  icon?: string
}

interface Props {
  tabs: Tab[]
  activeTab: string
  onNavigate: (id: string) => void
}

export default function AppNavigation({ tabs, activeTab, onNavigate }: Props) {
  return (
    <nav className="border-b border-border/60 bg-card/50 px-4 py-3 backdrop-blur-sm" role="tablist">
      <div className="mx-auto flex w-full max-w-[1680px] flex-wrap gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-label={tab.label}
            className={`rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-background/70 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {tab.icon && <span className="mr-2" aria-hidden="true">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  )
}

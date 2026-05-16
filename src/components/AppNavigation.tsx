interface Tab { id: string; label: string; icon?: string }
interface Props { tabs: Tab[]; activeTab: string; onNavigate: (id: string) => void }

export default function AppNavigation({ tabs, activeTab, onNavigate }: Props) {
  return (
    <nav className="flex items-center gap-1 px-4 py-2 border-b border-border/50 bg-card/30" role="tablist">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onNavigate(tab.id)}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-label={tab.label}
          className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
            activeTab === tab.id
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          {tab.icon && <span className="mr-1" aria-hidden="true">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </nav>
  )
}

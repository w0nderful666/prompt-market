import {
  type Shadow, type Density, type FontScale, type BorderStyle,
  type SurfaceMaterial, type DockStyle, type PanelChrome,
  type LayoutStyle, type ExperienceStyle
} from './builder'

export const SHADOW_CLASSES: Record<Shadow, string> = {
  flat: 'shadow-none',
  soft: 'shadow-[0_2px_8px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.06)]',
  ambient: 'shadow-[0_1px_3px_rgba(0,0,0,0.04)]',
  hard: 'shadow-[0_2px_0_rgba(0,0,0,0.1)]',
  floating: 'shadow-[0_8px_24px_rgba(0,0,0,0.12),0_16px_48px_rgba(0,0,0,0.08)]',
  layered: 'shadow-[0_4px_8px_rgba(0,0,0,0.05),0_8px_16px_rgba(0,0,0,0.03)]',
  elevated: 'shadow-[0_12px_32px_rgba(0,0,0,0.16),0_24px_64px_rgba(0,0,0,0.12)]',
  spotlight: 'shadow-[0_0_20px_hsl(var(--primary)_/_0.3)]',
  glow: 'shadow-[0_0_20px_hsl(var(--primary)_/_0.3),0_0_40px_hsl(var(--primary)_/_0.2),0_0_60px_hsl(var(--primary)_/_0.1)]',
}

export const DENSITY_STYLES: Record<Density, Record<string, string>> = {
  compact: {
    '--spacing-xs': '4px', '--spacing-sm': '6px', '--spacing-md': '8px', '--spacing-lg': '12px',
    '--padding-card': '8px', '--padding-button-y': '4px', '--padding-button-x': '8px',
    '--gap': '6px', '--height-button': '28px', '--height-input': '28px',
    '--height-sidebar': '40px', '--font-size-scale': '0.85',
  },
  normal: {
    '--spacing-xs': '6px', '--spacing-sm': '10px', '--spacing-md': '14px', '--spacing-lg': '20px',
    '--padding-card': '14px', '--padding-button-y': '8px', '--padding-button-x': '14px',
    '--gap': '10px', '--height-button': '36px', '--height-input': '36px',
    '--height-sidebar': '48px', '--font-size-scale': '1',
  },
  spacious: {
    '--spacing-xs': '10px', '--spacing-sm': '16px', '--spacing-md': '24px', '--spacing-lg': '32px',
    '--padding-card': '20px', '--padding-button-y': '12px', '--padding-button-x': '20px',
    '--gap': '16px', '--height-button': '44px', '--height-input': '44px',
    '--height-sidebar': '56px', '--font-size-scale': '1.1',
  },
  presentation: {
    '--spacing-xs': '16px', '--spacing-sm': '24px', '--spacing-md': '32px', '--spacing-lg': '48px',
    '--padding-card': '28px', '--padding-button-y': '16px', '--padding-button-x': '28px',
    '--gap': '24px', '--height-button': '52px', '--height-input': '52px',
    '--height-sidebar': '64px', '--font-size-scale': '1.25',
  },
}

export const FONT_SCALE_STYLES: Record<FontScale, Record<string, string>> = {
  compact: {
    '--font-size-xs': '10px', '--font-size-sm': '12px', '--font-size-base': '14px',
    '--font-size-lg': '16px', '--font-size-xl': '18px', '--font-size-2xl': '22px', '--font-size-3xl': '26px',
  },
  normal: {
    '--font-size-xs': '11px', '--font-size-sm': '13px', '--font-size-base': '15px',
    '--font-size-lg': '17px', '--font-size-xl': '20px', '--font-size-2xl': '24px', '--font-size-3xl': '30px',
  },
  large: {
    '--font-size-xs': '12px', '--font-size-sm': '14px', '--font-size-base': '16px',
    '--font-size-lg': '19px', '--font-size-xl': '22px', '--font-size-2xl': '28px', '--font-size-3xl': '36px',
  },
  display: {
    '--font-size-xs': '13px', '--font-size-sm': '15px', '--font-size-base': '18px',
    '--font-size-lg': '22px', '--font-size-xl': '26px', '--font-size-2xl': '34px', '--font-size-3xl': '44px',
  },
}

export const BORDER_CLASSES: Record<BorderStyle, string> = {
  none: 'border-0',
  subtle: 'border border-[hsl(var(--border)/_0.5)]',
  strong: 'border-2 border-[hsl(var(--border)_/_0.9)]',
  glow: 'border border-[hsl(var(--primary)_/_0.6)] shadow-[0_0_8px_hsl(var(--primary)_/_0.3)]',
  dashed: 'border border-dashed border-[hsl(var(--border)_/_0.7)]',
  double: 'border-4 border-double border-[hsl(var(--border)_/_0.8)]',
}

export const SURFACE_CLASSES: Record<SurfaceMaterial, string> = {
  solid: 'bg-card',
  glass: 'bg-card/70 backdrop-blur-md',
  matte: 'bg-[hsl(var(--muted)_/_0.6)]',
  acrylic: 'bg-card/50 backdrop-blur-xl border border-[hsl(var(--primary)_/_0.1)]',
  paper: 'bg-[#fafaf7] dark:bg-[#1a1814] text-zinc-900 dark:text-zinc-100',
  terminal: 'bg-[#0d1117] text-green-400 font-mono',
}

export const DOCK_CLASSES: Record<DockStyle, string> = {
  'minimal': 'bg-transparent border-t border-[hsl(var(--border)/_0.3)] py-2',
  'glass-dock': 'bg-card/60 backdrop-blur-lg border-t border-[hsl(var(--primary)/_0.1)] shadow-[0_-4px_20px_rgba(0,0,0,0.1)] py-3',
  'pill-dock': 'bg-[hsl(var(--background)/_0.9)] border-t-0 rounded-full shadow-[0_-4px_24px_rgba(0,0,0,0.15)] py-4 mx-4 rounded-xl',
  'floating-shelf': 'bg-card shadow-[0_8px_32px_rgba(0,0,0,0.2)] border-t border-[hsl(var(--border)/_0.5)] py-3',
  'neon-dock': 'bg-[hsl(var(--background)/_0.8)] border-t-2 border-[hsl(var(--primary)/_0.5)] shadow-[0_-4px_20px_hsl(var(--primary)/_0.3),0_-8px_40px_hsl(var(--primary)/_0.1)] py-3',
}

export const CHROME_STYLES: Record<PanelChrome, { header: string; controls: string }> = {
  macos: { header: 'bg-muted/50 flex items-center gap-2', controls: 'flex items-center gap-1.5' },
  linux: { header: 'bg-muted/30 flex items-center justify-between border-b border-[hsl(var(--border)/_0.4)]', controls: 'flex items-center gap-0' },
  terminal: { header: 'bg-[#0d1117] text-green-400 font-mono text-xs flex items-center px-3 py-1.5', controls: 'flex items-center gap-2 text-[10px]' },
  minimal: { header: 'bg-transparent border-b border-transparent', controls: 'hidden' },
  studio: { header: 'bg-gradient-to-r from-primary/10 to-accent/10 border-b border-[hsl(var(--border)/_0.3)] flex items-center justify-between', controls: 'flex items-center gap-2' },
}

export const LAYOUT_STRUCTURES: Record<LayoutStyle, { main: string; nav: string }> = {
  sidebar: { main: 'flex-1 overflow-y-auto', nav: 'w-52 border-r border-border bg-card/50 shrink-0' },
  topbar: { main: 'flex-1 overflow-y-auto', nav: 'h-12 border-b border-border bg-card/50 shrink-0' },
  split: { main: 'grid grid-cols-2 gap-4 flex-1 overflow-y-auto p-4', nav: 'hidden' },
  'floating-panels': { main: 'flex-1 overflow-y-auto p-8', nav: 'hidden' },
  'dashboard-grid': { main: 'flex-1 overflow-y-auto p-6', nav: 'hidden' },
}

export interface ExperienceConfig {
  typography: { fontFamily: string; titleSize: string; bodySize: string; letterSpacing: string; lineHeight: string; weight: string; dockLabel: string; statusText: string; commandText: string }
  motion: { transition: string; hover: string; active: string }
  dock: { layout: string; className: string; itemClassName: string; itemActiveClass: string }
  toast: { className: string; titleClass: string; bodyClass: string }
  modal: { className: string; headerClass: string }
  command: { className: string; itemClassName: string; inputClass: string }
  floatingWindow: { className: string; headerClass: string; controlsClass: string }
  focus: string
}

export const EXPERIENCE_CONFIG: Record<ExperienceStyle, ExperienceConfig> = {
  'classic-desktop': {
    typography: { fontFamily: 'system-ui', titleSize: 'var(--font-size-lg)', bodySize: 'var(--font-size-sm)', letterSpacing: '0', lineHeight: '1.35', weight: '600', dockLabel: 'text-xs font-medium', statusText: 'text-xs', commandText: 'text-sm' },
    motion: { transition: 'transition-all duration-150 ease-out', hover: 'hover:brightness-95', active: 'active:translate-y-[1px]' },
    dock: { layout: 'taskbar', className: 'h-10 rounded-none border-t-2 border-border bg-card', itemClassName: 'h-7 rounded-sm border border-border/50 bg-secondary/50 px-3', itemActiveClass: 'bg-primary/20 text-primary border-primary/30' },
    toast: { className: 'rounded-sm border-2 border-border bg-card shadow-[2px_2px_0_rgba(0,0,0,0.1)]', titleClass: 'font-semibold text-sm', bodyClass: 'text-xs' },
    modal: { className: 'rounded-sm border-2 border-border bg-card shadow-[4px_4px_0_rgba(0,0,0,0.15)]', headerClass: 'font-semibold text-base border-b border-border px-4 py-3' },
    command: { className: 'rounded-sm border-2 border-border bg-card shadow-lg', itemClassName: 'rounded-sm px-3 py-2 text-sm hover:bg-primary hover:text-primary-foreground', inputClass: 'rounded-sm border border-border bg-background px-3 py-2 text-sm' },
    floatingWindow: { className: 'rounded-sm border-2 border-border bg-card shadow-[4px_4px_0_rgba(0,0,0,0.15)]', headerClass: 'font-semibold text-sm border-b border-border px-3 py-2', controlsClass: 'flex items-center gap-1' },
    focus: 'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:border-primary',
  },
  'fluent-glass': {
    typography: { fontFamily: 'system-ui, -apple-system, sans-serif', titleSize: 'var(--font-size-lg)', bodySize: 'var(--font-size-sm)', letterSpacing: '0', lineHeight: '1.5', weight: '500', dockLabel: 'text-[11px] font-normal', statusText: 'text-[11px]', commandText: 'text-sm' },
    motion: { transition: 'transition-all duration-300 ease-out', hover: 'hover:bg-white/10', active: 'active:scale-[0.98]' },
    dock: { layout: 'centered', className: 'h-12 rounded-2xl border border-white/20 bg-white/30 backdrop-blur-xl', itemClassName: 'h-9 w-9 rounded-xl bg-transparent hover:bg-white/20 transition-all', itemActiveClass: 'bg-white/40 text-primary shadow-md' },
    toast: { className: 'rounded-xl border border-white/20 bg-white/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.2)]', titleClass: 'font-semibold text-sm', bodyClass: 'text-xs opacity-80' },
    modal: { className: 'rounded-xl border border-white/20 bg-white/40 backdrop-blur-2xl shadow-[0_24px_64px_rgba(0,0,0,0.25)]', headerClass: 'font-semibold text-base px-5 py-4 border-b border-white/10' },
    command: { className: 'rounded-2xl border border-white/20 bg-white/30 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.2)]', itemClassName: 'rounded-lg px-4 py-2.5 text-sm hover:bg-white/20', inputClass: 'rounded-xl border-0 bg-white/20 backdrop-blur px-4 py-2.5 text-sm' },
    floatingWindow: { className: 'rounded-2xl border border-white/20 bg-white/40 backdrop-blur-xl shadow-[0_24px_64px_rgba(0,0,0,0.2)]', headerClass: 'font-semibold text-sm px-4 py-3 border-b border-white/10', controlsClass: 'flex items-center gap-2' },
    focus: 'focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
  },
  'linux-workstation': {
    typography: { fontFamily: 'Ubuntu, system-ui, sans-serif', titleSize: 'var(--font-size-base)', bodySize: 'var(--font-size-sm)', letterSpacing: '0.01em', lineHeight: '1.4', weight: '500', dockLabel: 'text-[10px]', statusText: 'text-[10px]', commandText: 'text-[13px]' },
    motion: { transition: 'transition-all duration-200 ease-out', hover: 'hover:bg-primary/10', active: 'active:brightness-90' },
    dock: { layout: 'launcher-left', className: 'h-11 rounded-lg border-t border-border/50 bg-card/80', itemClassName: 'h-9 px-3 rounded-md hover:bg-primary/10 transition-colors', itemActiveClass: 'bg-primary/20 text-primary border-b-2 border-primary' },
    toast: { className: 'rounded-lg border border-border bg-card shadow-lg', titleClass: 'font-medium text-sm', bodyClass: 'text-xs' },
    modal: { className: 'rounded-lg border border-border bg-card shadow-xl', headerClass: 'font-medium text-base border-b border-border/50 px-4 py-3' },
    command: { className: 'rounded-lg border border-border bg-card shadow-xl', itemClassName: 'rounded px-3 py-2 text-sm hover:bg-primary/10', inputClass: 'rounded border border-border bg-background px-3 py-2 text-sm' },
    floatingWindow: { className: 'rounded-lg border border-border bg-card shadow-xl', headerClass: 'font-medium text-sm px-3 py-2 border-b border-border/50', controlsClass: 'flex items-center gap-0' },
    focus: 'focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0',
  },
  'gnome-clean': {
    typography: { fontFamily: 'system-ui, Cantarell, sans-serif', titleSize: 'var(--font-size-base)', bodySize: 'var(--font-size-sm)', letterSpacing: '0', lineHeight: '1.45', weight: '500', dockLabel: 'text-[10px] font-normal', statusText: 'text-[11px]', commandText: 'text-sm' },
    motion: { transition: 'transition-all duration-180 ease-out', hover: 'hover:bg-muted/50', active: 'active:scale-[0.98]' },
    dock: { layout: 'minimal-top', className: 'h-9 bg-transparent border-t border-transparent', itemClassName: 'h-7 px-2 rounded hover:bg-muted/30 transition-colors', itemActiveClass: 'bg-primary/10 text-primary' },
    toast: { className: 'rounded-lg border border-border/30 bg-muted/80 backdrop-blur shadow-md', titleClass: 'font-medium text-sm', bodyClass: 'text-xs opacity-70' },
    modal: { className: 'rounded-xl border border-border/30 bg-card shadow-lg', headerClass: 'font-medium text-base px-5 py-4 border-b border-border/30' },
    command: { className: 'rounded-xl border border-border/30 bg-card shadow-lg', itemClassName: 'rounded-lg px-4 py-2 text-sm hover:bg-muted/50', inputClass: 'rounded-lg border-0 bg-muted/30 px-4 py-2.5 text-sm' },
    floatingWindow: { className: 'rounded-xl border border-border/30 bg-card shadow-lg', headerClass: 'font-medium text-sm px-4 py-3 border-b border-border/30', controlsClass: 'flex items-center gap-1' },
    focus: 'focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1',
  },
  'security-console': {
    typography: { fontFamily: 'JetBrains Mono, Consolas, monospace', titleSize: 'var(--font-size-sm)', bodySize: 'var(--font-size-xs)', letterSpacing: '0.05em', lineHeight: '1.6', weight: '400', dockLabel: 'text-[9px] uppercase tracking-wider', statusText: 'text-[10px] font-mono', commandText: 'text-xs font-mono' },
    motion: { transition: 'transition-all duration-100 ease-out', hover: 'hover:bg-cyan-500/10', active: 'active:translate-y-0.5' },
    dock: { layout: 'terminal-bar', className: 'h-8 bg-[#0a0f14] border-t border-cyan-500/30 font-mono', itemClassName: 'h-6 px-3 text-[10px] text-cyan-400/70 hover:text-cyan-400 hover:bg-cyan-500/10', itemActiveClass: 'text-cyan-400 bg-cyan-500/20 border-b border-cyan-400' },
    toast: { className: 'rounded border border-cyan-500/40 bg-[#0a0f14]/90 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]', titleClass: 'font-mono text-xs font-bold uppercase tracking-wider', bodyClass: 'font-mono text-[10px] opacity-80' },
    modal: { className: 'rounded border border-cyan-500/40 bg-[#0a0f14] shadow-[0_0_30px_rgba(6,182,212,0.15)]', headerClass: 'font-mono text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-cyan-500/20 px-4 py-2' },
    command: { className: 'rounded border border-cyan-500/40 bg-[#0a0f14] shadow-[0_0_20px_rgba(6,182,212,0.15)]', itemClassName: 'rounded px-3 py-1.5 text-xs font-mono text-cyan-400/80 hover:text-cyan-400 hover:bg-cyan-500/10', inputClass: 'rounded border border-cyan-500/30 bg-[#0d1117] font-mono text-xs px-3 py-2 text-cyan-400' },
    floatingWindow: { className: 'rounded border border-cyan-500/40 bg-[#0a0f14] shadow-[0_0_20px_rgba(6,182,212,0.1)]', headerClass: 'font-mono text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-cyan-500/20 px-3 py-2', controlsClass: 'flex items-center gap-2 text-cyan-400/50' },
    focus: 'focus-visible:ring-2 focus-visible:ring-cyan-500/60 focus-visible:ring-offset-0 focus-visible:border-cyan-500',
  },
  'unix-terminal': {
    typography: { fontFamily: 'Fira Code, JetBrains Mono, monospace', titleSize: 'var(--font-size-sm)', bodySize: 'var(--font-size-xs)', letterSpacing: '0.03em', lineHeight: '1.5', weight: '400', dockLabel: 'text-[9px] font-mono', statusText: 'text-[10px] font-mono text-green-400', commandText: 'text-xs font-mono' },
    motion: { transition: 'transition-colors duration-100', hover: 'hover:bg-green-500/10', active: '' },
    dock: { layout: 'status-bar', className: 'h-6 bg-[#0d1117] border-t border-green-500/20 font-mono text-[10px]', itemClassName: 'h-5 px-2 text-green-400/60 hover:text-green-400', itemActiveClass: 'text-green-400 bg-green-500/10' },
    toast: { className: 'rounded border border-green-500/30 bg-[#0d1117] text-green-400 font-mono text-xs', titleClass: 'font-bold text-xs', bodyClass: 'text-[10px] opacity-70' },
    modal: { className: 'rounded border border-green-500/30 bg-[#0d1117] shadow-lg', headerClass: 'font-mono text-xs text-green-400 border-b border-green-500/20 px-3 py-2' },
    command: { className: 'rounded border border-green-500/30 bg-[#0d1117]', itemClassName: 'rounded px-3 py-1.5 text-xs font-mono text-green-400/70 hover:text-green-400 hover:bg-green-500/10', inputClass: 'rounded border border-green-500/20 bg-[#161b22] font-mono text-xs px-3 py-2 text-green-400' },
    floatingWindow: { className: 'rounded border border-green-500/30 bg-[#0d1117]', headerClass: 'font-mono text-xs text-green-400 border-b border-green-500/20 px-2 py-1', controlsClass: 'flex items-center gap-1 text-green-400/50 text-[10px]' },
    focus: 'focus-visible:ring-1 focus-visible:ring-green-500/60 focus-visible:border-green-500/40',
  },
  'aqua-desktop': {
    typography: { fontFamily: '-apple-system, BlinkMacSystemFont, system-ui', titleSize: 'var(--font-size-lg)', bodySize: 'var(--font-size-sm)', letterSpacing: '0', lineHeight: '1.4', weight: '500', dockLabel: 'text-[10px] font-medium', statusText: 'text-[11px]', commandText: 'text-sm' },
    motion: { transition: 'transition-all duration-250 ease-out', hover: 'hover:bg-blue-500/10', active: 'active:scale-[0.97]' },
    dock: { layout: 'glass-center', className: 'h-14 rounded-3xl border border-white/20 bg-white/20 backdrop-blur-2xl', itemClassName: 'h-10 w-10 rounded-2xl bg-transparent hover:bg-white/30 transition-all hover:scale-105', itemActiveClass: 'bg-white/40 text-primary shadow-md ring-2 ring-primary/20' },
    toast: { className: 'rounded-2xl border border-white/20 bg-white/30 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.15)]', titleClass: 'font-semibold text-sm', bodyClass: 'text-xs opacity-80' },
    modal: { className: 'rounded-2xl border border-white/20 bg-white/40 backdrop-blur-xl shadow-[0_24px_64px_rgba(0,0,0,0.2)]', headerClass: 'font-semibold text-base px-5 py-4 border-b border-white/10' },
    command: { className: 'rounded-2xl border border-white/20 bg-white/30 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.15)]', itemClassName: 'rounded-xl px-4 py-2.5 text-sm hover:bg-white/30', inputClass: 'rounded-xl border-0 bg-white/20 backdrop-blur px-4 py-2.5 text-sm' },
    floatingWindow: { className: 'rounded-2xl border border-white/20 bg-white/40 backdrop-blur-xl shadow-[0_24px_64px_rgba(0,0,0,0.15)]', headerClass: 'font-semibold text-sm px-4 py-3 border-b border-white/10', controlsClass: 'flex items-center gap-2' },
    focus: 'focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2',
  },
  'graphite-pro': {
    typography: { fontFamily: 'SF Pro, -apple-system, system-ui', titleSize: 'var(--font-size-base)', bodySize: 'var(--font-size-sm)', letterSpacing: '0', lineHeight: '1.4', weight: '500', dockLabel: 'text-[10px] font-medium', statusText: 'text-[11px]', commandText: 'text-sm' },
    motion: { transition: 'transition-all duration-200 ease-out', hover: 'hover:bg-zinc-500/10', active: 'active:scale-[0.98]' },
    dock: { layout: 'pro-dock', className: 'h-12 rounded-2xl border border-zinc-200/30 bg-zinc-100/40 backdrop-blur-xl', itemClassName: 'h-9 w-9 rounded-xl bg-transparent hover:bg-zinc-200/40 transition-colors', itemActiveClass: 'bg-zinc-300/50 text-zinc-900' },
    toast: { className: 'rounded-xl border border-zinc-200/40 bg-zinc-50/90 backdrop-blur shadow-lg', titleClass: 'font-medium text-sm text-zinc-800', bodyClass: 'text-xs text-zinc-600' },
    modal: { className: 'rounded-xl border border-zinc-200/40 bg-white shadow-xl', headerClass: 'font-medium text-base px-5 py-4 border-b border-zinc-100 text-zinc-800' },
    command: { className: 'rounded-xl border border-zinc-200/40 bg-white/90 backdrop-blur shadow-lg', itemClassName: 'rounded-lg px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100', inputClass: 'rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-800' },
    floatingWindow: { className: 'rounded-xl border border-zinc-200/40 bg-white shadow-xl', headerClass: 'font-medium text-sm px-4 py-3 border-b border-zinc-100 text-zinc-800', controlsClass: 'flex items-center gap-2' },
    focus: 'focus-visible:ring-2 focus-visible:ring-zinc-400/50 focus-visible:ring-offset-1',
  },
  'server-panel': {
    typography: { fontFamily: 'system-ui, Inter, sans-serif', titleSize: 'var(--font-size-base)', bodySize: 'var(--font-size-xs)', letterSpacing: '0.01em', lineHeight: '1.5', weight: '600', dockLabel: 'text-[10px] uppercase font-semibold', statusText: 'text-[10px] font-mono', commandText: 'text-xs font-mono' },
    motion: { transition: 'transition-colors duration-150', hover: 'hover:bg-slate-500/10', active: 'active:translate-y-0.5' },
    dock: { layout: 'status-bottom', className: 'h-8 bg-slate-800 border-t border-slate-700', itemClassName: 'h-6 px-3 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-700/50', itemActiveClass: 'text-blue-400 bg-slate-700/80 border-b border-blue-400' },
    toast: { className: 'rounded border border-slate-600 bg-slate-800 text-slate-200', titleClass: 'font-semibold text-xs uppercase tracking-wide', bodyClass: 'text-[10px] opacity-80' },
    modal: { className: 'rounded border border-slate-600 bg-slate-800 shadow-xl', headerClass: 'font-semibold text-sm uppercase tracking-wide text-slate-200 border-b border-slate-700 px-4 py-3' },
    command: { className: 'rounded border border-slate-600 bg-slate-800 shadow-xl', itemClassName: 'rounded px-3 py-2 text-xs text-slate-300 hover:bg-slate-700 hover:text-slate-100', inputClass: 'rounded border border-slate-600 bg-slate-900 text-xs px-3 py-2 text-slate-300' },
    floatingWindow: { className: 'rounded border border-slate-600 bg-slate-800 shadow-xl', headerClass: 'font-semibold text-xs uppercase tracking-wide text-slate-200 border-b border-slate-700 px-3 py-2', controlsClass: 'flex items-center gap-2 text-slate-400 text-xs' },
    focus: 'focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-0 focus-visible:border-blue-500',
  },
  'material-mobile': {
    typography: { fontFamily: 'Roboto, system-ui, sans-serif', titleSize: 'var(--font-size-base)', bodySize: 'var(--font-size-sm)', letterSpacing: '0.01em', lineHeight: '1.5', weight: '500', dockLabel: 'text-[9px] font-medium', statusText: 'text-[10px]', commandText: 'text-sm' },
    motion: { transition: 'transition-all duration-200 cubic-bezier(0.4, 0, 0.2, 1)', hover: 'hover:bg-primary/10', active: 'active:scale-[0.96]' },
    dock: { layout: 'bottom-nav', className: 'h-14 bg-surface-dark border-t border-outline/20', itemClassName: 'h-full px-4 rounded-t-lg hover:bg-on-surface/5 transition-colors', itemActiveClass: 'bg-primary-container text-on-primary-container' },
    toast: { className: 'rounded-lg bg-inverse-surface text-inverse-on-surface px-4 py-3 shadow-elevation-3', titleClass: 'font-medium text-sm', bodyClass: 'text-xs opacity-90' },
    modal: { className: 'rounded-xl bg-surface bg-surface-dim shadow-elevation-3', headerClass: 'font-medium text-lg px-6 py-4 border-b border-outline/10' },
    command: { className: 'rounded-xl bg-surface-dim shadow-elevation-2', itemClassName: 'rounded-lg px-4 py-3 text-sm hover:bg-on-surface/5', inputClass: 'rounded-lg border-0 bg-surface-dim px-4 py-3 text-sm' },
    floatingWindow: { className: 'rounded-2xl bg-surface shadow-elevation-3', headerClass: 'font-medium text-base px-5 py-4 border-b border-outline/10', controlsClass: 'flex items-center gap-2' },
    focus: 'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
  },
  'material-you': {
    typography: { fontFamily: 'Google Sans, Roboto, system-ui', titleSize: 'var(--font-size-lg)', bodySize: 'var(--font-size-sm)', letterSpacing: '0', lineHeight: '1.4', weight: '500', dockLabel: 'text-[10px] font-medium', statusText: 'text-[11px]', commandText: 'text-sm' },
    motion: { transition: 'transition-all duration-300 cubic-bezier(0.2, 0, 0, 1)', hover: 'hover:bg-primary/8', active: 'active:scale-[0.98]' },
    dock: { layout: 'organic-dock', className: 'h-16 rounded-[28px] bg-surface-variant/80 backdrop-blur-xl border border-outline/10', itemClassName: 'h-11 w-11 rounded-[20px] hover:bg-primary/10 transition-colors', itemActiveClass: 'bg-primary/20 text-primary rounded-[20px] shadow-sm' },
    toast: { className: 'rounded-[28px] bg-inverse-surface text-inverse-on-surface px-5 py-4 shadow-elevation-3', titleClass: 'font-medium text-base', bodyClass: 'text-sm opacity-90' },
    modal: { className: 'rounded-[28px] bg-surface-container-low shadow-elevation-3', headerClass: 'font-medium text-xl px-6 py-5 border-b border-outline/10' },
    command: { className: 'rounded-[24px] bg-surface-container-low shadow-elevation-2', itemClassName: 'rounded-[20px] px-5 py-3 text-base hover:bg-primary/8', inputClass: 'rounded-[20px] border-0 bg-surface-container-high px-5 py-3.5 text-base' },
    floatingWindow: { className: 'rounded-[28px] bg-surface-container-low shadow-elevation-3', headerClass: 'font-medium text-lg px-5 py-4 border-b border-outline/10', controlsClass: 'flex items-center gap-3' },
    focus: 'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
  },
  'minimal-dev': {
    typography: { fontFamily: 'JetBrains Mono, monospace', titleSize: 'var(--font-size-sm)', bodySize: 'var(--font-size-xs)', letterSpacing: '0', lineHeight: '1.6', weight: '400', dockLabel: 'text-[9px] font-mono', statusText: 'text-[10px] font-mono opacity-60', commandText: 'text-xs font-mono' },
    motion: { transition: 'transition-all duration-100', hover: 'hover:underline', active: '' },
    dock: { layout: 'minimal-bar', className: 'h-6 bg-transparent border-t border-dashed border-border/30', itemClassName: 'h-5 px-2 text-[10px] font-mono text-muted-foreground hover:text-foreground hover:underline', itemActiveClass: 'text-foreground underline decoration-primary decoration-2' },
    toast: { className: 'rounded border border-border/50 bg-background/80 px-3 py-2 text-xs font-mono', titleClass: 'font-bold', bodyClass: 'opacity-70' },
    modal: { className: 'rounded border border-border/50 bg-background shadow-sm', headerClass: 'font-mono text-sm border-b border-border/30 px-4 py-2' },
    command: { className: 'rounded border border-border/50 bg-background shadow-sm', itemClassName: 'rounded px-3 py-1.5 text-xs font-mono hover:bg-muted hover:underline', inputClass: 'rounded border border-border/50 bg-background font-mono text-xs px-3 py-2' },
    floatingWindow: { className: 'rounded border border-border/50 bg-background shadow-sm', headerClass: 'font-mono text-xs border-b border-dashed border-border/30 px-3 py-2', controlsClass: 'flex items-center gap-2 text-[10px] font-mono opacity-50' },
    focus: 'focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/30',
  },
}

export function getExperienceConfig(exp: ExperienceStyle): ExperienceConfig {
  return EXPERIENCE_CONFIG[exp] || EXPERIENCE_CONFIG['fluent-glass']
}

export const SHADOW_LIGHT_COMPENSATION: Record<Shadow, string> = {
  flat: '', soft: 'dark:shadow-[0_2px_8px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.06)]',
  ambient: 'dark:shadow-[0_1px_3px_rgba(0,0,0,0.04)]', hard: 'dark:shadow-[0_2px_0_rgba(0,0,0,0.1)]',
  floating: 'dark:shadow-[0_8px_24px_rgba(0,0,0,0.12),0_16px_48px_rgba(0,0,0,0.08)]',
  layered: 'dark:shadow-[0_4px_8px_rgba(0,0,0,0.05),0_8px_16px_rgba(0,0,0,0.03)]',
  elevated: 'dark:shadow-[0_12px_32px_rgba(0,0,0,0.16),0_24px_64px_rgba(0,0,0,0.12)]',
  spotlight: 'dark:shadow-[0_0_15px_hsl(var(--primary)_/_0.4)]',
  glow: 'shadow-[0_0_16px_hsl(var(--primary)_/_0.4)]',
}

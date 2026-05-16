import { type BuilderConfig, type CardStyle, type ExperienceStyle } from './builder'

export function getPreviewToolbarClass(config: BuilderConfig): string {
  if (isGlassMode(config)) return 'bg-card/40 backdrop-blur-xl border-b border-white/10'
  if (isDarkTerminalMode(config)) return 'bg-black/30 backdrop-blur-md border-b border-white/10'
  return 'bg-card/70 backdrop-blur-sm border-b border-border/60'
}

export function getPreviewPanelClass(config: BuilderConfig): string {
  if (isGlassMode(config)) return 'bg-card/55 backdrop-blur-xl border border-white/15 shadow-[0_18px_60px_hsl(var(--foreground)/0.08)]'
  if (isDarkTerminalMode(config)) return 'bg-black/35 backdrop-blur-md border border-white/10'
  if (isNeonCyberMode(config)) return 'bg-card/70 backdrop-blur-md border border-primary/20 shadow-[0_0_40px_hsl(var(--primary)/0.12)]'
  return 'bg-card/85 border border-border/70 shadow-sm'
}

export function getPreviewCardClass(config: BuilderConfig): string {
  if (isGlassMode(config)) return 'bg-card/45 backdrop-blur-md border border-white/10 shadow-[0_12px_40px_hsl(var(--foreground)/0.06)]'
  if (isDarkTerminalMode(config)) return 'bg-black/25 backdrop-blur-sm border border-white/10'
  if (isNeonCyberMode(config)) return 'bg-card/60 backdrop-blur-sm border border-primary/15 shadow-[0_0_25px_hsl(var(--primary)/0.08)]'
  return 'bg-card/78 border border-border/60 shadow-sm'
}

export function getPreviewSurfaceClass(config: BuilderConfig): string {
  if (isGlassMode(config)) return 'bg-card/65 backdrop-blur-2xl border border-white/15'
  if (isDarkTerminalMode(config)) return 'bg-black/45 backdrop-blur-lg border border-white/10'
  if (isNeonCyberMode(config)) return 'bg-card/75 backdrop-blur-lg border border-primary/20'
  return 'bg-card/90 border border-border/70'
}

export function getPreviewSectionClass(config: BuilderConfig): string {
  if (isGlassMode(config)) return 'bg-card/40 backdrop-blur-sm'
  if (isDarkTerminalMode(config)) return 'bg-black/20 backdrop-blur-sm'
  return 'bg-card/60'
}

export function getPreviewCodeClass(config: BuilderConfig): string {
  if (isDarkTerminalMode(config)) return 'bg-[#0a0a0a]/90 backdrop-blur-sm border border-white/10'
  return 'bg-zinc-900/80 backdrop-blur-sm border border-white/5'
}

export function getPreviewInputClass(config: BuilderConfig): string {
  if (isGlassMode(config)) return 'bg-card/40 backdrop-blur-sm border border-white/10 focus:border-primary/30'
  if (isDarkTerminalMode(config)) return 'bg-black/30 backdrop-blur-sm border border-white/10 focus:border-primary/30'
  return 'bg-background/60 border-border/60 focus:border-primary/50'
}

export function getPreviewGlowClass(config: BuilderConfig): string {
  if (isNeonCyberMode(config)) return 'shadow-[0_0_30px_hsl(var(--primary)/0.2)]'
  if (isGlassMode(config)) return 'shadow-[0_8px_30px_hsl(var(--foreground)/0.08)]'
  return ''
}

export function getPreviewContainerClass(config: BuilderConfig): string {
  if (isGlassMode(config) || isDarkTerminalMode(config)) return 'bg-transparent'
  return 'bg-background/20'
}

function isGlassMode(config: BuilderConfig): boolean {
  const glassCardStyles: CardStyle[] = ['glass', 'acrylic', 'fluent-card', 'aqua-glass', 'mist-card']
  const glassExperienceStyles: ExperienceStyle[] = ['fluent-glass', 'aqua-desktop']
  return glassCardStyles.includes(config.cardStyle as CardStyle) || glassExperienceStyles.includes(config.experienceStyle as ExperienceStyle)
}

function isDarkTerminalMode(config: BuilderConfig): boolean {
  const terminalCardStyles: CardStyle[] = ['terminal', 'terminal-panel', 'server-panel']
  const terminalExperienceStyles: ExperienceStyle[] = ['unix-terminal', 'security-console', 'linux-workstation']
  return terminalCardStyles.includes(config.cardStyle as CardStyle) || terminalExperienceStyles.includes(config.experienceStyle as ExperienceStyle)
}

function isNeonCyberMode(config: BuilderConfig): boolean {
  return config.themePreset === 'cyber-neon'
}

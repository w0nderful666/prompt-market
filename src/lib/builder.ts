import type { DirectorData } from '../utils/storage'
export type { DirectorData }

export type ThemePreset = string
export type Mode = 'light' | 'dark'
export type MotionLevel = 'instant' | 'subtle' | 'normal' | 'expressive' | 'cinematic' | 'elastic' | 'snappy'
export type BackgroundStyle = string
export type Shadow = 'flat' | 'soft' | 'ambient' | 'hard' | 'floating' | 'layered' | 'elevated' | 'spotlight' | 'glow'
export type Density = 'compact' | 'normal' | 'spacious' | 'presentation'
export type FontScale = 'compact' | 'normal' | 'large' | 'display'
export type BorderStyle = 'none' | 'subtle' | 'strong' | 'glow' | 'dashed' | 'double'
export type SurfaceMaterial = 'solid' | 'glass' | 'matte' | 'acrylic' | 'paper' | 'terminal'
export type Radius = 'square' | 'sharp' | 'soft' | 'smooth' | 'rounded' | 'pill' | 'xl' | 'organic'
export type CardStyle = string
export type DockStyle = string
export type PanelChrome = string
export type LayoutStyle = string
export type ExperienceStyle = string

export interface ThemeTokens {
  background: string; foreground: string; card: string; cardForeground: string;
  primary: string; primaryForeground: string; secondary: string; secondaryForeground: string;
  muted: string; mutedForeground: string; accent: string; accentForeground: string;
  border: string; input: string; ring: string;
  destructive: string; destructiveForeground: string;
  success: string; warning: string; info: string;
}

export interface BuilderConfig {
  themePreset: ThemePreset
  mode: Mode
  motionLevel: MotionLevel
  backgroundStyle: BackgroundStyle
  shadow: Shadow
  radius: Radius
  density: Density
  fontScale: FontScale
  borderStyle: BorderStyle
  surfaceMaterial: SurfaceMaterial
  cardStyle: CardStyle
  dockStyle: DockStyle
  panelChrome: PanelChrome
  layoutStyle: LayoutStyle
  experienceStyle: ExperienceStyle
}

export interface PromptScore {
  score: number; level: string; details: Array<{ id: string; label: string; score: number }>;
  pros: string[]; suggestions: string[];
}

export interface Variant {
  id: string; name_zh: string; name_en: string; text_zh: string; text_en: string;
}

export interface DiffResult {
  added: string[]; removed: string[]; kept: string[];
  charChange: number; estimatedTokenChange: number;
}

export interface DiffHistoryItem {
  id: string; timestamp: string; original: string; optimized: string;
}

export interface PolishPreview {
  [key: string]: string;
}

export interface CleanIssue {
  field: string; type: string; message: string;
}

export interface Snapshot {
  id: string; timestamp: string; name: string; director: DirectorData;
}

export interface PromptPack {
  id: string; name: string; description: string; tags: string[];
  prompts: Array<{ id: string; name: string; director: DirectorData }>;
}

export interface StorageUsage {
  used: number; limit: number; percentage: number;
}

export interface ExportData {
  version: string; exportedAt: string; director: DirectorData;
}

export interface ImportResult {
  success: boolean; data?: DirectorData; error?: string;
}

export type ImportMode = 'merge' | 'overwrite'

export function adaptGPTImage(director: DirectorData): string { return `GPT Image prompt: ${director.subject || ''} ${director.scene || ''}` }
export function adaptMidjourney(director: DirectorData): string { return `Midjourney: ${director.subject || ''} ${director.scene || ''} --ar ${director.ratio || '3:4'} --v 6` }
export function adaptChineseGeneric(director: DirectorData): string { return `中文提示词：${director.subject || ''}，${director.scene || ''}` }
export function adaptEnglishGeneric(director: DirectorData): string { return `English prompt: ${director.subject || ''}, ${director.scene || ''}` }

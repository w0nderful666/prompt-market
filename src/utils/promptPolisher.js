/**
 * Prompt Polisher - rule-based local polishing with 15 modes
 */

const POLISH_MODES = [
  {
    id: 'more_natural',
    label: '更自然',
    icon: '🌿',
    description: '减少AI感，增加自然描述',
    rules: {
      add: ['自然表情', '真实皮肤纹理', '不过度修饰'],
      remove: ['完美', '精致', '高清', 'commercial'],
      transform(text) {
        return text
          .replace(/完美无瑕/g, '自然真实')
          .replace(/精致妆容/g, '自然妆容')
          .replace(/高清锐利/g, '自然质感')
      }
    }
  },
  {
    id: 'more_professional',
    label: '更专业',
    icon: '💼',
    description: '提升商业摄影质感',
    rules: {
      add: ['专业灯光', '商业摄影', '高细节', '色彩准确'],
      remove: ['随手拍', '手机', '低清'],
      transform(text) {
        return text
          .replace(/随手拍/g, '专业摄影')
          .replace(/手机拍/g, '专业相机拍摄')
      }
    }
  },
  {
    id: 'gpt_image_optimized',
    label: '更适合 GPT Image',
    icon: '🤖',
    description: '优化为 GPT Image 生成风格',
    rules: {
      add: ['自然语言描述', '导演式叙事', 'Must Keep 关键约束'],
      remove: ['--ar', '--style', 'Steps:', 'CFG'],
      transform(text) {
        return text
          .replace(/--ar\s+\S+/g, '')
          .replace(/--style\s+\S+/g, '')
          .replace(/Steps:\s*\d+/g, '')
          .replace(/CFG\s*scale:\s*\d+/g, '')
      }
    }
  },
  {
    id: 'midjourney_optimized',
    label: '更适合 Midjourney',
    icon: '🎨',
    description: '优化为 Midjourney 短语风格',
    rules: {
      add: ['--style raw', '--no text, watermark'],
      remove: [],
      transform(text) {
        let result = text
        if (!result.includes('--ar ')) result += ' --ar 3:4'
        if (!result.includes('--style raw')) result += ' --style raw'
        if (!result.includes('--no ')) result += ' --no text, watermark, blurry'
        return result
      }
    }
  },
  {
    id: 'sd_optimized',
    label: '更适合 Stable Diffusion',
    icon: '🖌️',
    description: '优化为 SD 标签式正负提示词',
    rules: {
      add: ['masterpiece', 'best quality', 'highly detailed'],
      remove: [],
      transform(text) {
        let result = text
        if (!result.includes('masterpiece')) result = 'masterpiece, best quality, ' + result
        return result
      }
    }
  },
  {
    id: 'flux_optimized',
    label: '更适合 Flux',
    icon: '⚡',
    description: '简洁高密度英文，不过度打标签',
    rules: {
      add: [],
      remove: ['masterpiece', 'best quality', 'highly detailed', '8K', 'ultra HD'],
      transform(text) {
        return text
          .replace(/masterpiece,?\s*/gi, '')
          .replace(/best quality,?\s*/gi, '')
          .replace(/highly detailed,?\s*/gi, '')
      }
    }
  },
  {
    id: 'shorter',
    label: '更短',
    icon: '✂️',
    description: '精简描述，去除冗余',
    rules: {
      add: [],
      remove: ['非常', '极其', '特别', '格外', '十分'],
      transform(text) {
        return text
          .replace(/非常(的)?/g, '')
          .replace(/极其(的)?/g, '')
          .replace(/特别(的)?/g, '')
          .replace(/格外(的)?/g, '')
          .replace(/十分(的)?/g, '')
          .replace(/，{2,}/g, '，')
          .replace(/,{2,}/g, ',')
          .replace(/\s{2,}/g, ' ')
      }
    }
  },
  {
    id: 'more_detailed',
    label: '更详细',
    icon: '🔍',
    description: '补充更多细节描述',
    rules: {
      add: ['真实皮肤纹理', '毛孔可见', '发丝细节', '面料质感', '环境细节'],
      remove: [],
      transform(text) {
        return text
      }
    }
  },
  {
    id: 'more_realistic',
    label: '更写实',
    icon: '📷',
    description: '增强写实摄影感',
    rules: {
      add: ['真实皮肤纹理', '毛孔可见', '自然光线', '真实色彩还原'],
      remove: ['动漫', '卡通', '插画', 'anime', 'cartoon', 'illustration'],
      transform(text) {
        return text
          .replace(/动漫风格/g, '写实风格')
          .replace(/卡通风格/g, '写实风格')
      }
    }
  },
  {
    id: 'more_cinematic',
    label: '更电影感',
    icon: '🎬',
    description: '增加电影级画面感',
    rules: {
      add: ['电影级摄影', 'anamorphic lens', '电影色调', '宽银幕构图'],
      remove: [],
      transform(text) {
        let result = text
        if (!result.includes('电影')) result += '，电影级画面感'
        return result
      }
    }
  },
  {
    id: 'more_lowres_phone',
    label: '更低清手机质感',
    icon: '📱',
    description: '增强低清手机自拍感',
    rules: {
      add: ['手机自拍', '低分辨率', '数字噪点', 'JPEG压缩痕迹'],
      remove: ['8K', '高清', '商业', 'ultra HD', 'professional'],
      transform(text) {
        return text
          .replace(/8K/g, '')
          .replace(/高清锐利/g, '低分辨率')
          .replace(/商业摄影/g, '手机自拍')
      }
    }
  },
  {
    id: 'more_lifestyle',
    label: '更生活化',
    icon: '☕',
    description: '增强日常生活方式感',
    rules: {
      add: ['日常生活', '自然状态', '随意放松', '生活气息'],
      remove: ['商业', '棚拍', '影棚', 'studio'],
      transform(text) {
        return text
          .replace(/商业棚拍/g, '日常随手拍')
          .replace(/影棚灯光/g, '室内自然光')
      }
    }
  },
  {
    id: 'more_premium_product',
    label: '更高级产品图',
    icon: '✨',
    description: '提升产品图的高级感',
    rules: {
      add: ['高级质感', '品牌感', '精致细节', '专业产品摄影', '柔光箱照明'],
      remove: [],
      transform(text) {
        let result = text
        if (!result.includes('高级')) result += '，高级商业质感'
        return result
      }
    }
  },
  {
    id: 'more_avatar',
    label: '更适合头像',
    icon: '👤',
    description: '优化为社交头像风格',
    rules: {
      add: ['近景特写', '清晰面部', '自然表情', '简洁背景'],
      remove: ['全身', 'full body', '远景', 'long shot'],
      transform(text) {
        return text
          .replace(/全身照/g, '头像特写')
          .replace(/full body/gi, 'headshot')
      }
    }
  },
  {
    id: 'more_github_cover',
    label: '更适合 GitHub 封面',
    icon: '🐙',
    description: '优化为 GitHub README 封面图风格',
    rules: {
      add: ['深色主题', '科技感', '简洁现代', '16:9 宽屏', '高信息密度'],
      remove: ['人像', 'portrait', 'selfie', '自拍'],
      transform(text) {
        let result = text
        if (!result.includes('16:9')) result += '，16:9 宽屏比例'
        return result
      }
    }
  }
]

/**
 * Generate a polished preview of director content
 */
export function polishPrompt(director, modeId) {
  const mode = POLISH_MODES.find(m => m.id === modeId)
  if (!mode) return { preview: { ...director }, summary: '未知模式', additions: [], removals: [] }

  const preview = { ...director }
  const additions = []
  const removals = []

  // Apply transformations to text fields
  const textFields = ['subject', 'scene', 'composition', 'expression', 'face', 'hair',
    'body', 'clothing', 'lighting', 'camera', 'depthOfField', 'background',
    'atmosphere', 'caption', 'mustKeep', 'avoid']

  for (const field of textFields) {
    if (preview[field] && mode.rules.transform) {
      const original = preview[field]
      preview[field] = mode.rules.transform(preview[field])
      if (preview[field] !== original) {
        // Track what changed
      }
    }

    // Remove unwanted terms
    if (preview[field] && mode.rules.remove.length > 0) {
      for (const term of mode.rules.remove) {
        if (preview[field].toLowerCase().includes(term.toLowerCase())) {
          const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          preview[field] = preview[field].replace(new RegExp(escaped, 'gi'), '').trim()
          removals.push({ field, term })
        }
      }
    }
  }

  // Add new terms to appropriate fields
  if (mode.rules.add.length > 0) {
    for (const term of mode.rules.add) {
      // Add to mustKeep or caption based on type
      const targetField = preview.mustKeep ? 'mustKeep' : 'caption'
      if (preview[targetField] && !preview[targetField].toLowerCase().includes(term.toLowerCase())) {
        preview[targetField] = preview[targetField] + ', ' + term
        additions.push({ field: targetField, term })
      } else if (!preview[targetField]) {
        preview[targetField] = term
        additions.push({ field: targetField, term })
      }
    }
  }

  // Clean up empty fields
  for (const field of textFields) {
    if (preview[field]) {
      preview[field] = preview[field]
        .replace(/，{2,}/g, '，')
        .replace(/,{2,}/g, ',')
        .replace(/，\s*$/g, '')
        .replace(/,\s*$/g, '')
        .replace(/^\s*，/g, '')
        .replace(/^\s*,/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim()
    }
  }

  const summary = `应用"${mode.label}"：${additions.length} 项添加，${removals.length} 项移除`

  return { preview, summary, additions, removals }
}

/**
 * Apply a polished preview to the director
 */
export function applyPolish(director, preview) {
  if (!preview) return { ...director }
  return { ...director, ...preview }
}

export { POLISH_MODES }

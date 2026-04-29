export function getItemKey(item) {
  return [item.categoryId, item.tabId, item.id].filter(Boolean).join(':')
}

export function withMeta(item, categoryId, tabId, groupId = '') {
  return {
    ...item,
    categoryId: item.categoryId || categoryId,
    tabId: item.tabId || tabId,
    groupId: item.groupId || groupId
  }
}

export function buildPromptText(selectedItems, mode = 'zh') {
  if (!Array.isArray(selectedItems) || selectedItems.length === 0) return ''

  const values = selectedItems.map((item) => {
    if (mode === 'en') return item.en || item.zh
    if (mode === 'mixed') return item.en || item.zh
    return item.zh || item.en
  }).filter(Boolean)

  return values.join(mode === 'zh' ? '，' : ', ')
}

export function randomSelect(items, min = 1, max = 3) {
  if (!Array.isArray(items) || items.length === 0) return []
  const count = Math.floor(Math.random() * (max - min + 1)) + min
  return [...items].sort(() => Math.random() - 0.5).slice(0, Math.min(count, items.length))
}

export function randomSelectFromGroups(groups, min = 1, max = 3) {
  const items = (groups || []).flatMap((group) =>
    (group.items || []).map((item) => ({ ...item, groupId: group.id }))
  )
  return randomSelect(items, min, max)
}

export function searchPrompts(categories, keyword, scopeCategoryId = '') {
  const query = keyword.trim().toLowerCase()
  if (!query) return []

  const targetCategories = scopeCategoryId
    ? categories.filter((category) => category.id === scopeCategoryId)
    : categories

  return targetCategories.flatMap((category) =>
    (category.tabs || []).flatMap((tab) =>
      (tab.groups || []).map((group) => {
        const items = (group.items || []).filter((item) =>
          [item.zh, item.en].filter(Boolean).some((text) => text.toLowerCase().includes(query))
        )

        return items.length
          ? {
              categoryId: category.id,
              categoryName: category.name,
              tabId: tab.id,
              tabName: tab.name,
              groupId: group.id,
              groupName: group.name,
              items: items.map((item) => withMeta(item, category.id, tab.id, group.id))
            }
          : null
      }).filter(Boolean)
    )
  )
}

export function getSelectedCountByTab(selectedItems, categoryId, tabs) {
  const counts = Object.fromEntries((tabs || []).map((tab) => [tab.id, 0]))
  selectedItems.forEach((item) => {
    if (item.categoryId === categoryId && Object.hasOwn(counts, item.tabId)) {
      counts[item.tabId] += 1
    }
  })
  return counts
}

export function validatePromptLibrary(data) {
  if (!data || typeof data !== 'object') return '词库必须是 JSON 对象'
  if (!data.version || !data.updatedAt) return '词库缺少 version 或 updatedAt'
  if (!Array.isArray(data.categories)) return '词库缺少 categories 数组'

  for (const category of data.categories) {
    if (!category.id || !category.name || !Array.isArray(category.tabs)) {
      return '每个一级分类都需要 id、name、tabs'
    }
    for (const tab of category.tabs) {
      if (!tab.id || !tab.name || !Array.isArray(tab.groups)) {
        return '每个二级分类都需要 id、name、groups'
      }
      for (const group of tab.groups) {
        if (!group.id || !group.name || !Array.isArray(group.items)) {
          return '每个分组都需要 id、name、items'
        }
        for (const item of group.items) {
          if (!item.id || !item.zh) return '每个关键词至少需要 id 和 zh'
        }
      }
    }
  }

  return ''
}

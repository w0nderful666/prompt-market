import { VALUE_MAP } from '../data/facetedPresets'
import { SLOT_TO_DIRECTOR } from '../data/slotToDirectorMapping'

export function buildDirectorFromPresets(selections: Record<string, string | string[]>): Record<string, string> {
  const director: Record<string, string> = {}
  const grouped: Record<string, string[]> = {}

  for (const [slotId, val] of Object.entries(selections)) {
    if (!val) continue
    const dirField = SLOT_TO_DIRECTOR[slotId]
    if (!dirField) continue

    if (!grouped[dirField]) grouped[dirField] = []

    if (typeof val === 'string') {
      const valueObj = VALUE_MAP[val]
      if (valueObj) grouped[dirField].push(valueObj.label)
    } else if (Array.isArray(val)) {
      for (const v of val) {
        const valueObj = VALUE_MAP[v]
        if (valueObj) grouped[dirField].push(valueObj.label)
      }
    }
  }

  for (const [field, labels] of Object.entries(grouped)) {
    if (labels.length > 0) {
      director[field] = labels.join('，')
    }
  }

  return director
}

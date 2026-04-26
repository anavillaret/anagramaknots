/**
 * Deep merges DB content over defaults from translations.ts.
 * Only replaces string values that are non-empty strings in DB content.
 * Arrays are replaced element-by-element (merging each item if object).
 */
export function mergeContent<T extends Record<string, unknown>>(
  defaults: T,
  override: Record<string, unknown>,
): T {
  if (!override || typeof override !== 'object') return defaults

  const result = { ...defaults } as Record<string, unknown>

  for (const key of Object.keys(defaults)) {
    const def = defaults[key]
    const ov = override[key]

    if (ov === undefined || ov === null) {
      // No override — keep default
      continue
    }

    if (Array.isArray(def) && Array.isArray(ov)) {
      // Merge arrays element by element
      result[key] = def.map((defItem, i) => {
        const ovItem = ov[i]
        if (ovItem === undefined || ovItem === null) return defItem
        if (typeof defItem === 'object' && defItem !== null && typeof ovItem === 'object' && ovItem !== null) {
          return mergeContent(
            defItem as Record<string, unknown>,
            ovItem as Record<string, unknown>,
          )
        }
        return typeof ovItem === 'string' && ovItem.trim() !== '' ? ovItem : defItem
      })
    } else if (
      typeof def === 'object' &&
      def !== null &&
      typeof ov === 'object' &&
      ov !== null &&
      !Array.isArray(def)
    ) {
      // Recurse into nested objects
      result[key] = mergeContent(
        def as Record<string, unknown>,
        ov as Record<string, unknown>,
      )
    } else if (typeof ov === 'string' && ov.trim() !== '') {
      result[key] = ov
    }
  }

  return result as T
}

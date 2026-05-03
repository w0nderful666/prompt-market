/**
 * Share Link - compress/decompress director config to URL hash
 * Uses simple LZ-like compression for URL-safe encoding
 */

function encodeBase64Url(str) {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function decodeBase64Url(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  while (str.length % 4) str += '='
  return decodeURIComponent(escape(atob(str)))
}

/**
 * Simple LZ-string compression for URL
 */
function compressToUrl(text) {
  if (!text) return ''
  // Use base64url encoding for safety
  return encodeBase64Url(text)
}

function decompressFromUrl(compressed) {
  if (!compressed) return ''
  try {
    return decodeBase64Url(compressed)
  } catch {
    return ''
  }
}

/**
 * Export director config to a shareable URL
 */
export function createShareUrl(director) {
  const data = JSON.stringify(director)
  const compressed = compressToUrl(data)
  const url = `${window.location.origin}${window.location.pathname}#share=${compressed}`
  return url
}

/**
 * Import director config from URL hash
 */
export function importFromUrl() {
  const hash = window.location.hash
  if (!hash || !hash.includes('share=')) return null

  const compressed = hash.split('share=')[1]
  if (!compressed) return null

  try {
    const json = decompressFromUrl(compressed)
    const data = JSON.parse(json)
    // Clear hash after reading
    history.replaceState(null, '', window.location.pathname)
    return data
  } catch {
    return null
  }
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    try {
      document.execCommand('copy')
      return true
    } catch {
      return false
    } finally {
      ta.remove()
    }
  }
}

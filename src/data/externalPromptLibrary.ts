export const EXTERNAL_LIBRARY_MANIFEST_PATH = '/external-library-manifest-v2.json'

export const EXTERNAL_LIBRARY_PAGE_SIZES = [12, 24, 36] as const

export type ExternalLibraryPageSize = (typeof EXTERNAL_LIBRARY_PAGE_SIZES)[number]

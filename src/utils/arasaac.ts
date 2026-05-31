export function getArasaacImageUrl(arasaacId: number): string {
  return `https://static.arasaac.org/pictograms/${arasaacId}/${arasaacId}_300.png`
}

export interface ArasaacApiPictogram {
  _id: number
  keywords?: { keyword: string; type?: number }[]
  aac?: boolean
}

export async function searchArasaacPictograms(
  query: string,
): Promise<ArasaacApiPictogram[]> {
  const trimmed = query.trim()
  if (!trimmed) return []

  const encoded = encodeURIComponent(trimmed)
  const response = await fetch(
    `https://api.arasaac.org/v1/pictograms/es/search/${encoded}`,
  )

  if (!response.ok) {
    throw new Error('No se pudo buscar en ARASAAC')
  }

  return response.json() as Promise<ArasaacApiPictogram[]>
}

export function getKeywordFromResult(
  item: ArasaacApiPictogram,
  searchTerm: string,
): string {
  const normalized = searchTerm.trim().toLowerCase()
  const match = item.keywords?.find(
    (k) => k.keyword.toLowerCase() === normalized,
  )
  return match?.keyword ?? item.keywords?.[0]?.keyword ?? searchTerm
}

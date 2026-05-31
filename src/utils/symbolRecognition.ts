import type { CustomSymbol } from '../types/saac'

const COMPARE_SIZE = 64
const INK_THRESHOLD = 210
const MIN_SIMILARITY = 0.38
const MIN_MARGIN = 0.06
const HIGH_CONFIDENCE = 0.62

export interface RecognitionResult {
  symbol: CustomSymbol
  score: number
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('No se pudo cargar la imagen'))
    img.src = dataUrl
  })
}

/** Extrae bitmap binario normalizado (centrado y escalado). */
function extractNormalizedBitmap(img: HTMLImageElement, size: number): Uint8Array {
  const source = document.createElement('canvas')
  source.width = img.width
  source.height = img.height
  const sourceCtx = source.getContext('2d', { willReadFrequently: true })
  if (!sourceCtx) return new Uint8Array(size * size)

  sourceCtx.drawImage(img, 0, 0)
  const raw = sourceCtx.getImageData(0, 0, img.width, img.height)

  let minX = img.width
  let minY = img.height
  let maxX = 0
  let maxY = 0

  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      const i = (y * img.width + x) * 4
      const gray =
        0.299 * raw.data[i] +
        0.587 * raw.data[i + 1] +
        0.114 * raw.data[i + 2]
      if (gray < INK_THRESHOLD) {
        minX = Math.min(minX, x)
        minY = Math.min(minY, y)
        maxX = Math.max(maxX, x)
        maxY = Math.max(maxY, y)
      }
    }
  }

  const empty = new Uint8Array(size * size)
  if (minX > maxX || minY > maxY) return empty

  const cropW = maxX - minX + 1
  const cropH = maxY - minY + 1
  const padding = 6
  const scale = Math.min(
    (size - padding * 2) / cropW,
    (size - padding * 2) / cropH,
  )
  const drawW = cropW * scale
  const drawH = cropH * scale
  const offsetX = (size - drawW) / 2
  const offsetY = (size - drawH) / 2

  const normalized = document.createElement('canvas')
  normalized.width = size
  normalized.height = size
  const normCtx = normalized.getContext('2d', { willReadFrequently: true })
  if (!normCtx) return empty

  normCtx.fillStyle = '#ffffff'
  normCtx.fillRect(0, 0, size, size)
  normCtx.drawImage(
    source,
    minX,
    minY,
    cropW,
    cropH,
    offsetX,
    offsetY,
    drawW,
    drawH,
  )

  const normData = normCtx.getImageData(0, 0, size, size)
  const bitmap = new Uint8Array(size * size)

  for (let i = 0; i < size * size; i++) {
    const p = i * 4
    const gray =
      0.299 * normData.data[p] +
      0.587 * normData.data[p + 1] +
      0.114 * normData.data[p + 2]
    bitmap[i] = gray < INK_THRESHOLD ? 1 : 0
  }

  return bitmap
}

function jaccardSimilarity(a: Uint8Array, b: Uint8Array): number {
  let intersection = 0
  let union = 0
  for (let i = 0; i < a.length; i++) {
    if (a[i] || b[i]) {
      union++
      if (a[i] && b[i]) intersection++
    }
  }
  return union === 0 ? 0 : intersection / union
}

function diceSimilarity(a: Uint8Array, b: Uint8Array): number {
  let intersection = 0
  let countA = 0
  let countB = 0
  for (let i = 0; i < a.length; i++) {
    if (a[i]) countA++
    if (b[i]) countB++
    if (a[i] && b[i]) intersection++
  }
  const denom = countA + countB
  return denom === 0 ? 0 : (2 * intersection) / denom
}

/** Compara con pequeños desplazamientos para tolerar variaciones al redibujar. */
function compareBitmaps(a: Uint8Array, b: Uint8Array, size: number): number {
  let best = 0

  for (let oy = -2; oy <= 2; oy++) {
    for (let ox = -2; ox <= 2; ox++) {
      let intersection = 0
      let union = 0
      let countA = 0
      let countB = 0

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const bx = x + ox
          const by = y + oy
          const aInk = a[y * size + x] === 1
          const bInk =
            bx >= 0 && bx < size && by >= 0 && by < size && b[by * size + bx] === 1

          if (aInk) countA++
          if (bInk) countB++
          if (aInk || bInk) {
            union++
            if (aInk && bInk) intersection++
          }
        }
      }

      const jaccard = union === 0 ? 0 : intersection / union
      const dice =
        countA + countB === 0 ? 0 : (2 * intersection) / (countA + countB)
      best = Math.max(best, (jaccard + dice) / 2)
    }
  }

  // Refuerzo sin desplazamiento
  const direct =
    (jaccardSimilarity(a, b) + diceSimilarity(a, b)) / 2
  return Math.max(best, direct)
}

/**
 * Compara el dibujo actual con los símbolos guardados y devuelve el mejor match.
 */
export async function recognizeSymbol(
  currentDataUrl: string,
  symbols: CustomSymbol[],
): Promise<RecognitionResult | null> {
  if (!currentDataUrl.trim() || symbols.length === 0) return null

  const currentImg = await loadImage(currentDataUrl)
  const currentBitmap = extractNormalizedBitmap(currentImg, COMPARE_SIZE)

  if (!currentBitmap.some((v) => v === 1)) return null

  const scored: RecognitionResult[] = []

  for (const symbol of symbols) {
    try {
      const img = await loadImage(symbol.imageData)
      const bitmap = extractNormalizedBitmap(img, COMPARE_SIZE)
      const score = compareBitmaps(currentBitmap, bitmap, COMPARE_SIZE)
      scored.push({ symbol, score })
    } catch {
      // ignorar imágenes corruptas
    }
  }

  if (scored.length === 0) return null

  scored.sort((a, b) => b.score - a.score)
  const best = scored[0]
  const second = scored[1]

  if (best.score < MIN_SIMILARITY) return null

  const isAmbiguous =
    second &&
    best.score - second.score < MIN_MARGIN &&
    best.score < HIGH_CONFIDENCE

  if (isAmbiguous) return null

  return best
}

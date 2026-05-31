import { useCallback, useEffect, useRef, useState } from 'react'

interface UseCanvasOptions {
  lineWidth?: number
  strokeColor?: string
}

export function useCanvas(options: UseCanvasOptions = {}) {
  const { lineWidth = 4, strokeColor = '#0f172a' } = options
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDrawing = useRef(false)
  const hasStrokes = useRef(false)
  const [isEmpty, setIsEmpty] = useState(true)

  const getContext = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return null
    return canvas.getContext('2d', { willReadFrequently: true })
  }, [])

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const imageData = hasStrokes.current ? canvas.toDataURL() : null
    const dpr = window.devicePixelRatio || 1
    const { width, height } = container.getBoundingClientRect()

    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    ctx.scale(dpr, dpr)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = strokeColor

    if (imageData) {
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height)
      }
      img.src = imageData
    } else {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)
    }
  }, [lineWidth, strokeColor])

  useEffect(() => {
    resizeCanvas()
    const observer = new ResizeObserver(resizeCanvas)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [resizeCanvas])

  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const startDrawing = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const ctx = getContext()
      if (!ctx) return
      isDrawing.current = true
      canvasRef.current?.setPointerCapture(e.pointerId)
      const { x, y } = getPoint(e)
      ctx.beginPath()
      ctx.moveTo(x, y)
    },
    [getContext],
  )

  const draw = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing.current) return
      const ctx = getContext()
      if (!ctx) return
      const { x, y } = getPoint(e)
      ctx.lineTo(x, y)
      ctx.stroke()
      hasStrokes.current = true
      setIsEmpty(false)
    },
    [getContext],
  )

  const stopDrawing = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing.current) return
      isDrawing.current = false
      canvasRef.current?.releasePointerCapture(e.pointerId)
    },
    [],
  )

  const clear = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = getContext()
    if (!canvas || !ctx) return
    const { width, height } = canvas.getBoundingClientRect()
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)
    hasStrokes.current = false
    setIsEmpty(true)
  }, [getContext])

  const toDataURL = useCallback(() => {
    return canvasRef.current?.toDataURL('image/png') ?? ''
  }, [])

  const isCanvasEmpty = useCallback(() => {
    return !hasStrokes.current
  }, [])

  return {
    canvasRef,
    containerRef,
    startDrawing,
    draw,
    stopDrawing,
    clear,
    toDataURL,
    isEmpty,
    isCanvasEmpty,
  }
}

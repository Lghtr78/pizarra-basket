'use client'
import React, { useRef, useLayoutEffect, useState, useCallback } from 'react'
import { Annotation, AnnotationType } from '@/types/play'
import { COURT_WIDTH, COURT_HEIGHT } from './Court'

// Tipos que soportan curvado con handle
const CURVABLE: AnnotationType[] = ['desplazamiento', 'pase', 'dribling', 'cortina', 'tiro']

interface Props {
  annotations: Annotation[]
  preview?: { type: AnnotationType; fromX: number; fromY: number; toX: number; toY: number } | null
  onRemove?: (id: string) => void
  onMoveControl?: (annId: string, cx: number, cy: number) => void
  onMoveFrom?: (annId: string, fromX: number, fromY: number) => void
  onMoveTo?: (annId: string, toX: number, toY: number) => void
  svgRef?: React.RefObject<SVGSVGElement | null>
  // Narrative Engine
  narrativeMode?: boolean
  visibleAnnotationIds?: string[]
  drawingAnnotationId?: string | null
  drawingProgress?: number      // 0→1 stroke-dashoffset
  annotationOpacity?: number    // 1→0 fade_out
}

function toSVG(x: number, y: number) {
  return { x: (x / 100) * COURT_WIDTH, y: (y / 100) * COURT_HEIGHT }
}

// Punto en una bezier cuadrática
function bezierPt(t: number, p0: {x:number,y:number}, cp: {x:number,y:number}, p2: {x:number,y:number}) {
  const m = 1 - t
  return { x: m*m*p0.x + 2*m*t*cp.x + t*t*p2.x, y: m*m*p0.y + 2*m*t*cp.y + t*t*p2.y }
}

// Tangente al final de la bezier cuadrática (t=1): 2*(p2-cp)
function bezierEndTangent(cp: {x:number,y:number}, p2: {x:number,y:number}) {
  return { x: 2*(p2.x - cp.x), y: 2*(p2.y - cp.y) }
}

// Devuelve el punto de control SVG para la bezier (desde el handle almacenado o el midpoint)
function getControlPt(ann: Annotation) {
  const p0 = toSVG(ann.fromX, ann.fromY)
  const p2 = toSVG(ann.toX, ann.toY)
  if (ann.cx !== undefined && ann.cy !== undefined) return toSVG(ann.cx, ann.cy)
  return { x: (p0.x + p2.x) / 2, y: (p0.y + p2.y) / 2 }
}

// Zigzag a lo largo de una baseline (recta o bezier)
function buildZigzagPath(ann: Annotation): string {
  const p0 = toSVG(ann.fromX, ann.fromY)
  const p2 = toSVG(ann.toX, ann.toY)
  const isCurved = ann.cx !== undefined && ann.cy !== undefined
  const cp = getControlPt(ann)
  const N = 8
  const amp = 7

  // Samplear puntos a lo largo de la baseline
  const pts: {x:number,y:number}[] = []
  for (let i = 0; i <= N; i++) {
    const t = i / N
    pts.push(isCurved ? bezierPt(t, p0, cp, p2) : { x: p0.x + t*(p2.x-p0.x), y: p0.y + t*(p2.y-p0.y) })
  }

  // Construir zigzag entre los puntos sampleados
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 0; i < N; i++) {
    const a = pts[i], b = pts[i+1]
    const dx = b.x - a.x, dy = b.y - a.y
    const len = Math.sqrt(dx*dx + dy*dy)
    if (len < 0.5) continue
    const sign = i % 2 === 0 ? 1 : -1
    const mx = (a.x+b.x)/2 + sign * amp * (-dy/len)
    const my = (a.y+b.y)/2 + sign * amp * (dx/len)
    d += ` Q ${mx} ${my} ${b.x} ${b.y}`
  }
  return d
}

// Línea (recta o curva) + barra perpendicular para cortina
function buildScreenParts(ann: Annotation): { line: string; bar: string } {
  const p0 = toSVG(ann.fromX, ann.fromY)
  const p2 = toSVG(ann.toX, ann.toY)
  const isCurved = ann.cx !== undefined && ann.cy !== undefined
  const cp = getControlPt(ann)

  const line = isCurved
    ? `M ${p0.x} ${p0.y} Q ${cp.x} ${cp.y} ${p2.x} ${p2.y}`
    : `M ${p0.x} ${p0.y} L ${p2.x} ${p2.y}`

  // Tangente al final para orientar la barra
  const tang = isCurved
    ? bezierEndTangent(cp, p2)
    : { x: p2.x - p0.x, y: p2.y - p0.y }
  const tLen = Math.sqrt(tang.x*tang.x + tang.y*tang.y)
  const px = tLen > 0 ? (-tang.y/tLen) * 10 : 10
  const py = tLen > 0 ? (tang.x/tLen) * 10 : 0

  return { line, bar: `M ${p2.x+px} ${p2.y+py} L ${p2.x-px} ${p2.y-py}` }
}

// Línea única (recta o bezier) para el tipo tiro
function buildTiroPath(ann: Annotation): string {
  const p0 = toSVG(ann.fromX, ann.fromY)
  const p2 = toSVG(ann.toX, ann.toY)
  const cp = getControlPt(ann)
  const isCurved = ann.cx !== undefined && ann.cy !== undefined
  return isCurved
    ? `M ${p0.x} ${p0.y} Q ${cp.x} ${cp.y} ${p2.x} ${p2.y}`
    : `M ${p0.x} ${p0.y} L ${p2.x} ${p2.y}`
}

const COLORS: Record<AnnotationType, string> = {
  desplazamiento: 'rgba(20,20,20,0.9)',
  pase:           'rgba(160,90,0,0.9)',
  dribling:       'rgba(190,60,0,0.9)',
  cortina:        'rgba(20,70,190,0.9)',
  tiro:           'rgba(180,20,20,0.9)',
}

type DashProps = Pick<React.SVGProps<SVGPathElement>, 'strokeDasharray' | 'strokeDashoffset'>

function AnnotationShape({ ann, markerId, pathRef, dashProps }: {
  ann: Annotation
  markerId: string
  pathRef?: React.Ref<SVGPathElement>
  dashProps?: DashProps
}) {
  const { type, fromX, fromY, toX, toY } = ann
  const color = COLORS[type]
  const p0 = toSVG(fromX, fromY)
  const p2 = toSVG(toX, toY)
  const cp = getControlPt(ann)
  const isCurved = ann.cx !== undefined && ann.cy !== undefined

  if (type === 'desplazamiento') {
    const d = isCurved
      ? `M ${p0.x} ${p0.y} Q ${cp.x} ${cp.y} ${p2.x} ${p2.y}`
      : `M ${p0.x} ${p0.y} L ${p2.x} ${p2.y}`
    return (
      <path ref={pathRef} d={d} fill="none" stroke={color} strokeWidth={2.5}
        markerEnd={`url(#${markerId})`} {...dashProps} />
    )
  }

  if (type === 'pase') {
    const d = isCurved
      ? `M ${p0.x} ${p0.y} Q ${cp.x} ${cp.y} ${p2.x} ${p2.y}`
      : `M ${p0.x} ${p0.y} L ${p2.x} ${p2.y}`
    return (
      <path ref={pathRef} d={d} fill="none" stroke={color} strokeWidth={2.5}
        strokeDasharray="8 5" markerEnd={`url(#${markerId})`} {...dashProps} />
    )
  }

  if (type === 'dribling') {
    return (
      <path ref={pathRef} d={buildZigzagPath(ann)} fill="none"
        stroke={color} strokeWidth={2.5} markerEnd={`url(#${markerId})`} {...dashProps} />
    )
  }

  if (type === 'cortina') {
    const { line, bar } = buildScreenParts(ann)
    return (
      <g>
        <path ref={pathRef} d={line} fill="none" stroke={color} strokeWidth={2.5} {...dashProps} />
        <path d={bar} fill="none" stroke={color} strokeWidth={3.5} strokeLinecap="round" />
      </g>
    )
  }

  if (type === 'tiro') {
    return (
      <path ref={pathRef} d={buildTiroPath(ann)} fill="none" stroke={color} strokeWidth={2.5}
        strokeDasharray="6 4" markerEnd={`url(#${markerId})`} {...dashProps} />
    )
  }

  return null
}

// Wrapper que mide el path con getTotalLength() y aplica stroke-dashoffset
function DrawableShape({ ann, markerId, progress }: {
  ann: Annotation
  markerId: string
  progress?: number   // undefined = sin animación (ya dibujado)
}) {
  const pathRef = useRef<SVGPathElement>(null)
  const [totalLen, setTotalLen] = useState(0)

  useLayoutEffect(() => {
    if (pathRef.current) setTotalLen(pathRef.current.getTotalLength())
  }, [ann.fromX, ann.fromY, ann.toX, ann.toY, ann.cx, ann.cy])

  const isAnimating = progress !== undefined && progress < 1
  const dashProps: DashProps | undefined =
    isAnimating && totalLen > 0
      ? { strokeDasharray: totalLen, strokeDashoffset: totalLen * (1 - progress) }
      : undefined

  return <AnnotationShape ann={ann} markerId={markerId} pathRef={pathRef} dashProps={dashProps} />
}

export default function AnnotationLayer({
  annotations,
  preview,
  onRemove,
  onMoveControl,
  onMoveFrom,
  onMoveTo,
  svgRef,
  narrativeMode,
  visibleAnnotationIds,
  drawingAnnotationId,
  drawingProgress,
  annotationOpacity,
}: Props) {
  const markers = Object.entries(COLORS).map(([type, color]) => (
    <marker key={type} id={`ann-arrow-${type}`}
      markerWidth="7" markerHeight="7" refX="6" refY="3.5"
      orient="auto" markerUnits="strokeWidth">
      <path d="M 0 0 L 7 3.5 L 0 7 Z" fill={color} />
    </marker>
  ))

  // Drag del handle de curvatura
  const handleControlDrag = useCallback((e: React.MouseEvent, annId: string) => {
    if (!svgRef?.current || !onMoveControl) return
    e.stopPropagation()
    e.preventDefault()
    const svg = svgRef.current

    const onMove = (me: MouseEvent) => {
      const rect = svg.getBoundingClientRect()
      const cx = Math.max(0, Math.min(100, ((me.clientX - rect.left) / rect.width) * 100))
      const cy = Math.max(0, Math.min(100, ((me.clientY - rect.top) / rect.height) * 100))
      onMoveControl(annId, cx, cy)
    }
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [svgRef, onMoveControl])

  const handleEndpointDrag = useCallback((
    e: React.MouseEvent,
    annId: string,
    endpoint: 'from' | 'to'
  ) => {
    if (!svgRef?.current) return
    e.stopPropagation()
    e.preventDefault()
    const svg = svgRef.current
    const onMove = (me: MouseEvent) => {
      const rect = svg.getBoundingClientRect()
      const x = Math.max(0, Math.min(100, ((me.clientX - rect.left) / rect.width) * 100))
      const y = Math.max(0, Math.min(100, ((me.clientY - rect.top) / rect.height) * 100))
      if (endpoint === 'from') onMoveFrom?.(annId, x, y)
      else onMoveTo?.(annId, x, y)
    }
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [svgRef, onMoveFrom, onMoveTo])

  const showHandles = !!onMoveControl

  return (
    <g>
      <defs>{markers}</defs>

      {annotations.map((ann) => {
        // En modo narrativo: filtrar por visibilidad
        if (narrativeMode) {
          const isVisible = visibleAnnotationIds?.includes(ann.id)
          const isDrawing = drawingAnnotationId === ann.id
          if (!isVisible && !isDrawing) return null
        }

        const isDrawing = narrativeMode && drawingAnnotationId === ann.id
        const progress  = isDrawing ? (drawingProgress ?? 0) : undefined
        const opacity   = narrativeMode ? (annotationOpacity ?? 1) : 1

        const p0 = toSVG(ann.fromX, ann.fromY)
        const p2 = toSVG(ann.toX, ann.toY)
        const cp = getControlPt(ann)
        const isCurvable = CURVABLE.includes(ann.type)
        const isCurved = ann.cx !== undefined && ann.cy !== undefined
        const mid = isCurved ? bezierPt(0.5, p0, cp, p2) : { x: (p0.x+p2.x)/2, y: (p0.y+p2.y)/2 }

        return (
          <g key={ann.id} opacity={opacity}>
            <DrawableShape ann={ann} markerId={`ann-arrow-${ann.type}`} progress={progress} />

            {/* Handle de curvatura (solo para tipos curvables en modo edición) */}
            {showHandles && isCurvable && (
              <g>
                {/* Línea punteada del handle al midpoint de la línea */}
                {isCurved && (
                  <line
                    x1={mid.x} y1={mid.y} x2={cp.x} y2={cp.y}
                    stroke="rgba(0,0,0,0.25)" strokeWidth={1}
                    strokeDasharray="3 3" pointerEvents="none"
                  />
                )}
                {/* Handle arrastrable */}
                <circle
                  cx={cp.x} cy={cp.y} r={7}
                  fill={isCurved ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.05)'}
                  stroke="rgba(0,0,0,0.5)" strokeWidth={1.5}
                  strokeDasharray={isCurved ? 'none' : '3 2'}
                  style={{ cursor: 'grab' }}
                  onMouseDown={(e) => handleControlDrag(e, ann.id)}
                />
              </g>
            )}

            {/* Handles de extremos — solo en modo edición */}
            {showHandles && (onMoveFrom || onMoveTo) && (
              <>
                {/* Handle de ORIGEN (círculo verde) */}
                <circle
                  cx={p0.x} cy={p0.y} r={6}
                  fill="rgba(34,197,94,0.8)" stroke="white" strokeWidth={1.5}
                  style={{ cursor: 'grab' }}
                  onMouseDown={(e) => handleEndpointDrag(e, ann.id, 'from')}
                />
                {/* Handle de DESTINO (círculo rojo) */}
                <circle
                  cx={p2.x} cy={p2.y} r={6}
                  fill="rgba(239,68,68,0.8)" stroke="white" strokeWidth={1.5}
                  style={{ cursor: 'grab' }}
                  onMouseDown={(e) => handleEndpointDrag(e, ann.id, 'to')}
                />
              </>
            )}

            {/* Área de click para borrar (solo en modo select) */}
            {onRemove && (
              <circle cx={mid.x} cy={mid.y} r={isCurvable && showHandles ? 4 : 8}
                fill="transparent" style={{ cursor: 'pointer' }}
                onClick={() => onRemove(ann.id)}
              />
            )}
          </g>
        )
      })}

      {/* Preview mientras se dibuja */}
      {preview && (
        <g opacity={0.6}>
          <AnnotationShape
            ann={{ id: '__preview', ...preview }}
            markerId={`ann-arrow-${preview.type}`}
          />
        </g>
      )}
    </g>
  )
}

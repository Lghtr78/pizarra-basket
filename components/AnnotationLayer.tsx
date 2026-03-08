'use client'
import React, { useCallback } from 'react'
import { Annotation, AnnotationType } from '@/types/play'
import { COURT_WIDTH, COURT_HEIGHT } from './Court'

// Tipos que soportan curvado con handle
const CURVABLE: AnnotationType[] = ['desplazamiento', 'pase', 'dribling', 'cortina', 'tiro']

interface Props {
  annotations: Annotation[]
  preview?: { type: AnnotationType; fromX: number; fromY: number; toX: number; toY: number } | null
  onRemove?: (id: string) => void
  onMoveControl?: (annId: string, cx: number, cy: number) => void
  svgRef?: React.RefObject<SVGSVGElement | null>
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

// Dos líneas paralelas (rectas o bezier) para el tipo tiro
function buildTiroPaths(ann: Annotation): [string, string] {
  const p0 = toSVG(ann.fromX, ann.fromY)
  const p2 = toSVG(ann.toX, ann.toY)
  const cp = getControlPt(ann)
  const isCurved = ann.cx !== undefined && ann.cy !== undefined
  const dx = p2.x - p0.x, dy = p2.y - p0.y
  const len = Math.sqrt(dx*dx + dy*dy)
  if (len < 1) return [`M ${p0.x} ${p0.y}`, `M ${p0.x} ${p0.y}`]
  // Perpendicular basado en la dirección global p0→p2
  const px = (-dy/len)*4, py = (dx/len)*4
  if (isCurved) {
    return [
      `M ${p0.x+px} ${p0.y+py} Q ${cp.x+px} ${cp.y+py} ${p2.x+px} ${p2.y+py}`,
      `M ${p0.x-px} ${p0.y-py} Q ${cp.x-px} ${cp.y-py} ${p2.x-px} ${p2.y-py}`,
    ]
  }
  return [
    `M ${p0.x+px} ${p0.y+py} L ${p2.x+px} ${p2.y+py}`,
    `M ${p0.x-px} ${p0.y-py} L ${p2.x-px} ${p2.y-py}`,
  ]
}

const COLORS: Record<AnnotationType, string> = {
  desplazamiento: 'rgba(255,255,255,0.9)',
  pase:           'rgba(250,204,21,0.9)',
  dribling:       'rgba(249,115,22,0.9)',
  cortina:        'rgba(96,165,250,0.9)',
  tiro:           'rgba(248,113,113,0.9)',
}

function AnnotationShape({ ann, markerId }: { ann: Annotation; markerId: string }) {
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
    return <path d={d} fill="none" stroke={color} strokeWidth={2.5} markerEnd={`url(#${markerId})`} />
  }

  if (type === 'pase') {
    const d = isCurved
      ? `M ${p0.x} ${p0.y} Q ${cp.x} ${cp.y} ${p2.x} ${p2.y}`
      : `M ${p0.x} ${p0.y} L ${p2.x} ${p2.y}`
    return (
      <path d={d} fill="none" stroke={color} strokeWidth={2.5}
        strokeDasharray="8 5" markerEnd={`url(#${markerId})`} />
    )
  }

  if (type === 'dribling') {
    return (
      <path d={buildZigzagPath(ann)} fill="none"
        stroke={color} strokeWidth={2.5} markerEnd={`url(#${markerId})`} />
    )
  }

  if (type === 'cortina') {
    const { line, bar } = buildScreenParts(ann)
    return (
      <g>
        <path d={line} fill="none" stroke={color} strokeWidth={2.5} />
        <path d={bar} fill="none" stroke={color} strokeWidth={3.5} strokeLinecap="round" />
      </g>
    )
  }

  if (type === 'tiro') {
    const [l1, l2] = buildTiroPaths(ann)
    return (
      <g>
        <path d={l1} fill="none" stroke={color} strokeWidth={2} markerEnd={`url(#${markerId})`} />
        <path d={l2} fill="none" stroke={color} strokeWidth={2} markerEnd={`url(#${markerId})`} />
      </g>
    )
  }

  return null
}

export default function AnnotationLayer({ annotations, preview, onRemove, onMoveControl, svgRef }: Props) {
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

  const showHandles = !!onMoveControl

  return (
    <g>
      <defs>{markers}</defs>

      {annotations.map((ann) => {
        const p0 = toSVG(ann.fromX, ann.fromY)
        const p2 = toSVG(ann.toX, ann.toY)
        const cp = getControlPt(ann)
        const isCurvable = CURVABLE.includes(ann.type)
        const isCurved = ann.cx !== undefined && ann.cy !== undefined
        // Midpoint visual para el botón de borrado
        const mid = isCurved ? bezierPt(0.5, p0, cp, p2) : { x: (p0.x+p2.x)/2, y: (p0.y+p2.y)/2 }

        return (
          <g key={ann.id}>
            <AnnotationShape ann={ann} markerId={`ann-arrow-${ann.type}`} />

            {/* Handle de curvatura (solo para tipos curvables en modo edición) */}
            {showHandles && isCurvable && (
              <g>
                {/* Línea punteada del handle al midpoint de la línea */}
                {isCurved && (
                  <line
                    x1={mid.x} y1={mid.y} x2={cp.x} y2={cp.y}
                    stroke="rgba(255,255,255,0.25)" strokeWidth={1}
                    strokeDasharray="3 3" pointerEvents="none"
                  />
                )}
                {/* Handle arrastrabe */}
                <circle
                  cx={cp.x} cy={cp.y} r={7}
                  fill={isCurved ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)'}
                  stroke="rgba(255,255,255,0.6)" strokeWidth={1.5}
                  strokeDasharray={isCurved ? 'none' : '3 2'}
                  style={{ cursor: 'grab' }}
                  onMouseDown={(e) => handleControlDrag(e, ann.id)}
                />
              </g>
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

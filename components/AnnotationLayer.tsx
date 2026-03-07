'use client'
import React from 'react'
import { Annotation, AnnotationType } from '@/types/play'
import { COURT_WIDTH, COURT_HEIGHT } from './Court'

interface Props {
  annotations: Annotation[]
  preview?: { type: AnnotationType; fromX: number; fromY: number; toX: number; toY: number } | null
  onRemove?: (id: string) => void
}

function toSVG(x: number, y: number) {
  return { x: (x / 100) * COURT_WIDTH, y: (y / 100) * COURT_HEIGHT }
}

// Genera un path de zigzag entre dos puntos (dribling)
function zigzagPath(fx: number, fy: number, tx: number, ty: number): string {
  const p1 = toSVG(fx, fy)
  const p2 = toSVG(tx, ty)
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len < 4) return `M ${p1.x} ${p1.y}`
  const ux = dx / len
  const uy = dy / len
  const px = -uy
  const py = ux
  const segs = Math.max(4, Math.round(len / 18))
  const amp = 7
  let d = `M ${p1.x} ${p1.y}`
  // Deja los últimos 18px rectos para la punta de la flecha
  const arrowOffset = Math.min(18, len * 0.3)
  const endX = p2.x - ux * arrowOffset
  const endY = p2.y - uy * arrowOffset
  const ex = endX - p1.x
  const ey = endY - p1.y
  for (let i = 0; i < segs; i++) {
    const t0 = i / segs
    const t1 = (i + 1) / segs
    const tm = (t0 + t1) / 2
    const sign = i % 2 === 0 ? 1 : -1
    const mx = p1.x + tm * ex + sign * amp * px
    const my = p1.y + tm * ey + sign * amp * py
    const ex2 = p1.x + t1 * ex
    const ey2 = p1.y + t1 * ey
    d += ` Q ${mx} ${my} ${ex2} ${ey2}`
  }
  d += ` L ${p2.x} ${p2.y}`
  return d
}

// Genera las dos líneas paralelas de "tiro" (doble flecha)
function doubleLinePaths(fx: number, fy: number, tx: number, ty: number): [string, string] {
  const p1 = toSVG(fx, fy)
  const p2 = toSVG(tx, ty)
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len < 1) return [`M ${p1.x} ${p1.y}`, `M ${p1.x} ${p1.y}`]
  const px = (-dy / len) * 4
  const py = (dx / len) * 4
  return [
    `M ${p1.x + px} ${p1.y + py} L ${p2.x + px} ${p2.y + py}`,
    `M ${p1.x - px} ${p1.y - py} L ${p2.x - px} ${p2.y - py}`,
  ]
}

// Genera la línea + barra perpendicular de cortina
function screenParts(fx: number, fy: number, tx: number, ty: number) {
  const p1 = toSVG(fx, fy)
  const p2 = toSVG(tx, ty)
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len < 1) return { line: `M ${p1.x} ${p1.y}`, bar: '' }
  const px = (-dy / len) * 10
  const py = (dx / len) * 10
  return {
    line: `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`,
    bar: `M ${p2.x + px} ${p2.y + py} L ${p2.x - px} ${p2.y - py}`,
  }
}

const COLORS: Record<AnnotationType, string> = {
  desplazamiento: 'rgba(255,255,255,0.9)',
  pase: 'rgba(250,204,21,0.9)',   // amarillo
  dribling: 'rgba(249,115,22,0.9)', // naranja
  cortina: 'rgba(96,165,250,0.9)', // azul claro
  tiro: 'rgba(248,113,113,0.9)',   // rojo claro
}

function AnnotationShape({
  type, fromX, fromY, toX, toY, markerId,
}: {
  type: AnnotationType
  fromX: number; fromY: number
  toX: number; toY: number
  markerId: string
}) {
  const color = COLORS[type]
  const p1 = toSVG(fromX, fromY)
  const p2 = toSVG(toX, toY)

  if (type === 'desplazamiento') {
    return (
      <line
        x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
        stroke={color} strokeWidth={2.5}
        markerEnd={`url(#${markerId})`}
      />
    )
  }

  if (type === 'pase') {
    return (
      <line
        x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
        stroke={color} strokeWidth={2.5}
        strokeDasharray="8 5"
        markerEnd={`url(#${markerId})`}
      />
    )
  }

  if (type === 'dribling') {
    return (
      <path
        d={zigzagPath(fromX, fromY, toX, toY)}
        fill="none"
        stroke={color} strokeWidth={2.5}
        markerEnd={`url(#${markerId})`}
      />
    )
  }

  if (type === 'cortina') {
    const { line, bar } = screenParts(fromX, fromY, toX, toY)
    return (
      <g>
        <path d={line} fill="none" stroke={color} strokeWidth={2.5} />
        <path d={bar} fill="none" stroke={color} strokeWidth={3.5} strokeLinecap="round" />
      </g>
    )
  }

  if (type === 'tiro') {
    const [l1, l2] = doubleLinePaths(fromX, fromY, toX, toY)
    return (
      <g>
        <path d={l1} fill="none" stroke={color} strokeWidth={2} markerEnd={`url(#${markerId})`} />
        <path d={l2} fill="none" stroke={color} strokeWidth={2} markerEnd={`url(#${markerId})`} />
      </g>
    )
  }

  return null
}

export default function AnnotationLayer({ annotations, preview, onRemove }: Props) {
  // Genera un markerId único por color para evitar conflictos con otros markers
  const markers = Object.entries(COLORS).map(([type, color]) => (
    <marker
      key={type}
      id={`ann-arrow-${type}`}
      markerWidth="7" markerHeight="7"
      refX="6" refY="3.5"
      orient="auto"
      markerUnits="strokeWidth"
    >
      <path d="M 0 0 L 7 3.5 L 0 7 Z" fill={color} />
    </marker>
  ))

  return (
    <g>
      <defs>{markers}</defs>

      {annotations.map((ann) => (
        <g key={ann.id}>
          <AnnotationShape
            type={ann.type}
            fromX={ann.fromX} fromY={ann.fromY}
            toX={ann.toX} toY={ann.toY}
            markerId={`ann-arrow-${ann.type}`}
          />
          {/* Área invisible para click de borrado */}
          {onRemove && (() => {
            const p1 = toSVG(ann.fromX, ann.fromY)
            const p2 = toSVG(ann.toX, ann.toY)
            const mx = (p1.x + p2.x) / 2
            const my = (p1.y + p2.y) / 2
            return (
              <circle
                cx={mx} cy={my} r={8}
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onClick={() => onRemove(ann.id)}
              />
            )
          })()}
        </g>
      ))}

      {/* Preview de dibujo en curso */}
      {preview && (
        <g opacity={0.6}>
          <AnnotationShape
            type={preview.type}
            fromX={preview.fromX} fromY={preview.fromY}
            toX={preview.toX} toY={preview.toY}
            markerId={`ann-arrow-${preview.type}`}
          />
        </g>
      )}
    </g>
  )
}

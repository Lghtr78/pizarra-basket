'use client'
import React from 'react'
import { PlayerPosition } from '@/types/play'
import { COURT_WIDTH, COURT_HEIGHT } from './Court'

interface Props {
  from: PlayerPosition[]
  to: PlayerPosition[]
}

function toSVG(x: number, y: number) {
  return {
    x: (x / 100) * COURT_WIDTH,
    y: (y / 100) * COURT_HEIGHT,
  }
}

export default function MovementArrows({ from, to }: Props) {
  return (
    <g>
      <defs>
        <marker
          id="arrowhead"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M 0 0 L 6 3 L 0 6 Z" fill="rgba(20,20,20,0.8)" />
        </marker>
      </defs>
      {from.map((fp) => {
        const tp = to.find((p) => p.playerId === fp.playerId)
        if (!tp) return null
        const f = toSVG(fp.x, fp.y)
        const t = toSVG(tp.x, tp.y)
        const dx = t.x - f.x
        const dy = t.y - f.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 5) return null
        return (
          <line
            key={fp.playerId}
            x1={f.x}
            y1={f.y}
            x2={t.x}
            y2={t.y}
            stroke="rgba(20,20,20,0.6)"
            strokeWidth={2}
            strokeDasharray="6 4"
            markerEnd="url(#arrowhead)"
          />
        )
      })}
    </g>
  )
}

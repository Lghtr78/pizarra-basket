'use client'
import React from 'react'

// Cancha de basquet SVG — vista desde arriba, media cancha
// viewBox: 0 0 500 470
export const COURT_WIDTH = 500
export const COURT_HEIGHT = 470

const LINE = '#1f1f1f'
const LINE_W = 2.5

export default function Court() {
  return (
    <g>
      {/* Piso */}
      <rect x={0} y={0} width={COURT_WIDTH} height={COURT_HEIGHT} fill="#f4f1eb" />

      {/* Líneas exteriores */}
      <rect x={10} y={10} width={480} height={450} fill="none" stroke={LINE} strokeWidth={LINE_W} />

      {/* Línea de medio campo */}
      <line x1={10} y1={235} x2={490} y2={235} stroke={LINE} strokeWidth={LINE_W} />

      {/* Círculo central */}
      <circle cx={250} cy={235} r={40} fill="none" stroke={LINE} strokeWidth={LINE_W} />

      {/* Zona pintada (paint) */}
      <rect x={155} y={10} width={190} height={170} fill="#ebe6da" stroke={LINE} strokeWidth={LINE_W} />

      {/* Línea de tiro libre */}
      <line x1={155} y1={180} x2={345} y2={180} stroke={LINE} strokeWidth={LINE_W} />

      {/* Semicírculo tiro libre */}
      <path d="M 155 180 A 95 95 0 0 0 345 180" fill="none" stroke={LINE} strokeWidth={LINE_W} />

      {/* Zona restringida (restricted area) */}
      <path d="M 213 10 A 37 37 0 0 0 287 10" fill="none" stroke={LINE} strokeWidth={LINE_W} />

      {/* Tablero */}
      <rect x={210} y={10} width={80} height={5} fill="none" stroke={LINE} strokeWidth={LINE_W} />

      {/* Aro */}
      <circle cx={250} cy={22} r={12} fill="none" stroke="#c0392b" strokeWidth={2.5} />

      {/* Arco de 3 puntos */}
      <path d="M 30 10 A 225 225 0 0 1 470 10" fill="none" stroke={LINE} strokeWidth={LINE_W} />
      {/* Líneas laterales del 3 (rectas) */}
      <line x1={30} y1={10} x2={30} y2={105} stroke={LINE} strokeWidth={LINE_W} />
      <line x1={470} y1={10} x2={470} y2={105} stroke={LINE} strokeWidth={LINE_W} />
    </g>
  )
}

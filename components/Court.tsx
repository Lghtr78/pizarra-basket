'use client'
import React from 'react'

// Cancha de basquet SVG — vista desde arriba, media cancha
// viewBox: 0 0 500 470
export const COURT_WIDTH = 500
export const COURT_HEIGHT = 470

export default function Court() {
  return (
    <g>
      {/* Piso */}
      <rect x={0} y={0} width={COURT_WIDTH} height={COURT_HEIGHT} fill="#c8a96e" />

      {/* Líneas exteriores */}
      <rect x={10} y={10} width={480} height={450} fill="none" stroke="#fff" strokeWidth={3} />

      {/* Línea de fondo (arriba = aro) */}
      {/* Línea de medio campo */}
      <line x1={10} y1={235} x2={490} y2={235} stroke="#fff" strokeWidth={2} />

      {/* Círculo central */}
      <circle cx={250} cy={235} r={40} fill="none" stroke="#fff" strokeWidth={2} />

      {/* Zona pintada (paint) */}
      <rect x={155} y={10} width={190} height={170} fill="#b8955a" stroke="#fff" strokeWidth={2} />

      {/* Línea de tiro libre */}
      <line x1={155} y1={180} x2={345} y2={180} stroke="#fff" strokeWidth={2} />

      {/* Semicírculo tiro libre */}
      <path
        d="M 155 180 A 95 95 0 0 0 345 180"
        fill="none"
        stroke="#fff"
        strokeWidth={2}
      />

      {/* Zona restringida (restricted area) */}
      <path
        d="M 213 10 A 37 37 0 0 0 287 10"
        fill="none"
        stroke="#fff"
        strokeWidth={2}
      />

      {/* Aro */}
      <circle cx={250} cy={22} r={12} fill="none" stroke="#ff4500" strokeWidth={3} />
      {/* Tablero */}
      <rect x={210} y={10} width={80} height={6} fill="none" stroke="#fff" strokeWidth={2} />

      {/* Arco de 3 puntos */}
      <path
        d="M 30 10 A 225 225 0 0 1 470 10"
        fill="none"
        stroke="#fff"
        strokeWidth={2}
      />
      {/* Líneas laterales del 3 (rectas) */}
      <line x1={30} y1={10} x2={30} y2={105} stroke="#fff" strokeWidth={2} />
      <line x1={470} y1={10} x2={470} y2={105} stroke="#fff" strokeWidth={2} />
    </g>
  )
}

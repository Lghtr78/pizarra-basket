'use client'
import React from 'react'

// Media cancha FIBA — escala exacta 1 m = 100 unidades SVG
// viewBox: 0 0 1500 1400
// Origen: x=0 línea lateral izq, y=0 línea de fondo (aro), y=1400 medio campo

export const COURT_WIDTH  = 1500
export const COURT_HEIGHT = 1400

const S = '#1a1a1a'  // stroke color
const SW = 5         // stroke-width (= 5 cm reglamentario FIBA)

export default function Court() {
  return (
    <g>
      {/* ── Piso ── */}
      <rect width={1500} height={1400} fill="#ffffff" />

      {/* ── Borde de la cancha ── */}
      <rect x={0} y={0} width={1500} height={1400}
        stroke={S} strokeWidth={SW} fill="none" />

      {/* ── Zona pintada: 4.90 m × 5.80 m, centrada en x=750 ── */}
      <rect x={505} y={0} width={490} height={580}
        stroke={S} strokeWidth={SW} fill="none" />

      {/* ── Semicírculo de tiro libre exterior (hacia el campo) ── */}
      <path d="M 570 580 A 180 180 0 0 0 930 580"
        stroke={S} strokeWidth={SW} fill="none" />

      {/* ── Semicírculo de tiro libre interior (hacia la zona) — discontinuo ── */}
      <path d="M 570 580 A 180 180 0 0 1 930 580"
        stroke={S} strokeWidth={SW} fill="none"
        strokeDasharray="20 15" />

      {/* ── Semicírculo de no-carga (charge): r=1.25 m ── */}
      <path d="M 625 157.5 A 125 125 0 0 0 875 157.5"
        stroke={S} strokeWidth={SW} fill="none" />

      {/* ── Tablero: línea principal ── */}
      <line x1={660} y1={120} x2={840} y2={120}
        stroke={S} strokeWidth={SW} />

      {/* ── Tablero: rectángulo interior (0.59 m × 0.45 m) ── */}
      <rect x={720.5} y={75} width={59} height={45}
        stroke={S} strokeWidth={SW} fill="none" />

      {/* ── Aro: r = 0.225 m ── */}
      <circle cx={750} cy={157.5} r={22.5}
        stroke="#cc3300" strokeWidth={SW} fill="none" />

      {/* ── Línea de 3 puntos ── */}
      {/* Recta lateral izquierda: x=90, de fondo (y=0) a punto de tangencia (y=299) */}
      <line x1={90} y1={0} x2={90} y2={299}
        stroke={S} strokeWidth={SW} />
      {/* Recta lateral derecha */}
      <line x1={1410} y1={0} x2={1410} y2={299}
        stroke={S} strokeWidth={SW} />
      {/* Arco: de (90,299) a (1410,299), pasa por (750,832.5) — sweep=0 antihorario */}
      <path d="M 90 299 A 675 675 0 0 0 1410 299"
        stroke={S} strokeWidth={SW} fill="none" />
    </g>
  )
}

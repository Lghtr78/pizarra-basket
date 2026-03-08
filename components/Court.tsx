'use client'
import React from 'react'

// Media cancha FIBA — escala 32px/m, margen 10px
// Convención: baseline con aro en la parte SUPERIOR (se ataca hacia arriba)
// 15m ancho × 14m largo — viewBox 0 0 500 468

export const COURT_WIDTH  = 500
export const COURT_HEIGHT = 468

const LINE = '#1f1f1f'
const LW   = 2.5
const S    = 32       // px por metro
const MRG  = 10       // margen exterior

// ── Perímetro ────────────────────────────────────────────────────────────────
const CW = 15 * S     // 480px  (15 m)
const CH = 14 * S     // 448px  (14 m)

// ── Aro: 1.575 m desde la baseline (arriba) ──────────────────────────────────
const ARO_X = MRG + CW / 2                      // 250
const ARO_Y = MRG + Math.round(1.575 * S)        // 10 + 50 = 60
const ARO_R = 9

// ── Tablero ──────────────────────────────────────────────────────────────────
const BOARD_W = Math.round(1.83 * S)             // 59
const BOARD_X = ARO_X - BOARD_W / 2             // 221

// ── Zona pintada: 4.9 m ancho × 5.8 m largo desde la baseline ────────────────
const PAINT_HALF = Math.round(2.45 * S)          // 78
const PAINT_L    = ARO_X - PAINT_HALF            // 172
const PAINT_R    = ARO_X + PAINT_HALF            // 328
const PAINT_BOT  = MRG + Math.round(5.8 * S)     // 10 + 186 = 196

// ── Tiro libre ────────────────────────────────────────────────────────────────
const FT_Y = PAINT_BOT                           // 196
const FT_R = Math.round(1.80 * S)               // 58

// ── Zona restringida: r = 1.25 m ─────────────────────────────────────────────
const RA_R = Math.round(1.25 * S)               // 40

// ── Arco de 3 puntos: r = 6.75 m ─────────────────────────────────────────────
const THREE_R   = Math.round(6.75 * S)           // 216
const THREE_X_L = MRG + Math.round(0.9 * S)      // 39
const THREE_X_R = MRG + CW - Math.round(0.9 * S) // 461
// Y donde la recta lateral se une con el arco
const THREE_Y   = ARO_Y + Math.round(
  Math.sqrt(THREE_R ** 2 - (ARO_X - THREE_X_L) ** 2)
)  // 60 + 46 = 106

export default function Court() {
  return (
    <g>
      {/* ── Piso ── */}
      <rect x={0} y={0} width={COURT_WIDTH} height={COURT_HEIGHT} fill="#f4f1eb" />

      {/* ── Perímetro ── */}
      <rect x={MRG} y={MRG} width={CW} height={CH}
        fill="none" stroke={LINE} strokeWidth={LW} />

      {/* ── Zona pintada ── */}
      <rect x={PAINT_L} y={MRG} width={PAINT_R - PAINT_L} height={PAINT_BOT - MRG}
        fill="#ebe6da" stroke={LINE} strokeWidth={LW} />

      {/* ── Zona restringida: abre hacia la baseline (arriba, sweep=0) ── */}
      <path
        d={`M ${ARO_X - RA_R} ${ARO_Y} A ${RA_R} ${RA_R} 0 0 0 ${ARO_X + RA_R} ${ARO_Y}`}
        fill="none" stroke={LINE} strokeWidth={LW} />

      {/* ── Tablero ── */}
      <rect x={BOARD_X} y={MRG} width={BOARD_W} height={5}
        fill="none" stroke={LINE} strokeWidth={LW} />

      {/* ── Aro ── */}
      <circle cx={ARO_X} cy={ARO_Y} r={ARO_R}
        fill="none" stroke="#c0392b" strokeWidth={2.5} />

      {/* ── Línea de tiro libre ── */}
      <line x1={PAINT_L} y1={FT_Y} x2={PAINT_R} y2={FT_Y}
        stroke={LINE} strokeWidth={LW} />

      {/* ── Media luna: abre hacia el aro (arriba, sweep=0) ── */}
      <path
        d={`M ${ARO_X - FT_R} ${FT_Y} A ${FT_R} ${FT_R} 0 0 0 ${ARO_X + FT_R} ${FT_Y}`}
        fill="none" stroke={LINE} strokeWidth={LW} />

      {/* ── Arco de 3 puntos: abre hacia el centro (abajo, sweep=0) ── */}
      <line x1={THREE_X_L} y1={MRG} x2={THREE_X_L} y2={THREE_Y}
        stroke={LINE} strokeWidth={LW} />
      <line x1={THREE_X_R} y1={MRG} x2={THREE_X_R} y2={THREE_Y}
        stroke={LINE} strokeWidth={LW} />
      <path
        d={`M ${THREE_X_L} ${THREE_Y} A ${THREE_R} ${THREE_R} 0 0 0 ${THREE_X_R} ${THREE_Y}`}
        fill="none" stroke={LINE} strokeWidth={LW} />
    </g>
  )
}

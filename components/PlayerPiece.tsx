'use client'
import React, { useRef, useCallback } from 'react'
import { Player } from '@/types/play'
import { COURT_WIDTH, COURT_HEIGHT } from './Court'

interface Props {
  player: Player
  x: number // porcentaje 0-100
  y: number // porcentaje 0-100
  draggable: boolean
  onMove?: (playerId: string, x: number, y: number) => void
  svgRef: React.RefObject<SVGSVGElement | null>
  dimmed?: boolean
}

const RADIUS = 27

export default function PlayerPiece({ player, x, y, draggable, onMove, svgRef, dimmed }: Props) {
  const isDragging = useRef(false)

  const getCoords = useCallback(
    (clientX: number, clientY: number) => {
      const svg = svgRef.current
      if (!svg) return null
      const rect = svg.getBoundingClientRect()
      const scaleX = COURT_WIDTH / rect.width
      const scaleY = COURT_HEIGHT / rect.height
      const svgX = (clientX - rect.left) * scaleX
      const svgY = (clientY - rect.top) * scaleY
      const px = Math.max(2, Math.min(98, (svgX / COURT_WIDTH) * 100))
      const py = Math.max(2, Math.min(98, (svgY / COURT_HEIGHT) * 100))
      return { px, py }
    },
    [svgRef]
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!draggable || !onMove) return
      e.preventDefault()
      isDragging.current = true

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current) return
        const coords = getCoords(e.clientX, e.clientY)
        if (coords) onMove(player.id, coords.px, coords.py)
      }
      const handleMouseUp = () => {
        isDragging.current = false
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    },
    [draggable, onMove, player.id, getCoords]
  )

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!draggable || !onMove) return
      e.preventDefault()
      isDragging.current = true

      const handleTouchMove = (e: TouchEvent) => {
        if (!isDragging.current) return
        const touch = e.touches[0]
        const coords = getCoords(touch.clientX, touch.clientY)
        if (coords) onMove(player.id, coords.px, coords.py)
      }
      const handleTouchEnd = () => {
        isDragging.current = false
        window.removeEventListener('touchmove', handleTouchMove)
        window.removeEventListener('touchend', handleTouchEnd)
      }
      window.addEventListener('touchmove', handleTouchMove, { passive: false })
      window.addEventListener('touchend', handleTouchEnd)
    },
    [draggable, onMove, player.id, getCoords]
  )

  const cx = (x / 100) * COURT_WIDTH
  const cy = (y / 100) * COURT_HEIGHT

  return (
    <g
      transform={`translate(${cx}, ${cy})`}
      style={{ cursor: draggable ? 'grab' : 'default', opacity: dimmed ? 0.35 : 1 }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <circle r={RADIUS} fill={player.color} stroke="#fff" strokeWidth={2} />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={19}
        fontWeight="bold"
        fill="#fff"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {player.label}
      </text>
    </g>
  )
}

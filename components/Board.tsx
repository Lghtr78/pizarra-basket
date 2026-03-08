'use client'
import React, { useRef, useEffect, useState, useCallback } from 'react'
import { usePlayStore } from '@/store/playStore'
import Court, { COURT_WIDTH, COURT_HEIGHT } from './Court'
import PlayerPiece from './PlayerPiece'
import MovementArrows from './MovementArrows'
import AnnotationLayer from './AnnotationLayer'
import { AnnotationType } from '@/types/play'

const BALL_RADIUS = 10

export default function Board() {
  const svgRef = useRef<SVGSVGElement>(null)
  const {
    players,
    play,
    currentFrameIndex,
    mode,
    isDemoPlaying,
    demoSpeed,
    editTool,
    challengeUserPositions,
    movePlayer,
    moveChallengePlayer,
    advanceDemoFrame,
    addAnnotation,
    removeAnnotation,
    moveAnnotationControl,
    moveBall,
  } = usePlayStore()

  // useRef para evitar stale closure en los event handlers
  const drawStartRef = useRef<{ x: number; y: number } | null>(null)
  const [drawPreview, setDrawPreview] = useState<{ from: {x:number,y:number}; to: {x:number,y:number} } | null>(null)

  // Demo auto-avance
  useEffect(() => {
    if (mode !== 'demo' || !isDemoPlaying) return
    const timer = setTimeout(() => {
      advanceDemoFrame()
    }, demoSpeed)
    return () => clearTimeout(timer)
  }, [mode, isDemoPlaying, currentFrameIndex, demoSpeed, advanceDemoFrame])

  const getSVGCoords = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current
    if (!svg) return null
    const rect = svg.getBoundingClientRect()
    const scaleX = COURT_WIDTH / rect.width
    const scaleY = COURT_HEIGHT / rect.height
    const svgX = (clientX - rect.left) * scaleX
    const svgY = (clientY - rect.top) * scaleY
    return {
      x: Math.max(1, Math.min(99, (svgX / COURT_WIDTH) * 100)),
      y: Math.max(1, Math.min(99, (svgY / COURT_HEIGHT) * 100)),
    }
  }, [])

  const isDrawingTool = mode === 'edit' && editTool !== 'select' && editTool !== 'ball'
  const isBallTool = mode === 'edit' && editTool === 'ball'

  const handleSVGMouseDown = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!(isDrawingTool || isBallTool)) return
      const coords = getSVGCoords(e.clientX, e.clientY)
      if (!coords) return
      if (isBallTool) { moveBall(coords.x, coords.y); return }
      drawStartRef.current = coords
      setDrawPreview({ from: coords, to: coords })
    },
    [isDrawingTool, isBallTool, getSVGCoords, moveBall]
  )

  const handleSVGMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!isDrawingTool || !drawStartRef.current) return
      const coords = getSVGCoords(e.clientX, e.clientY)
      if (coords) setDrawPreview({ from: drawStartRef.current, to: coords })
    },
    [isDrawingTool, getSVGCoords]
  )

  const handleSVGMouseUp = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const start = drawStartRef.current
      if (!isDrawingTool || !start) return
      const coords = getSVGCoords(e.clientX, e.clientY)
      if (coords) {
        const dx = coords.x - start.x
        const dy = coords.y - start.y
        if (Math.sqrt(dx * dx + dy * dy) > 2) {
          addAnnotation({
            type: editTool as AnnotationType,
            fromX: start.x,
            fromY: start.y,
            toX: coords.x,
            toY: coords.y,
          })
        }
      }
      drawStartRef.current = null
      setDrawPreview(null)
    },
    [isDrawingTool, getSVGCoords, addAnnotation, editTool]
  )

  const currentFrame = play.keyframes[currentFrameIndex]
  const prevFrame = currentFrameIndex > 0 ? play.keyframes[currentFrameIndex - 1] : null

  const positions =
    mode === 'challenge' ? challengeUserPositions : currentFrame.positions

  const draggable = (mode === 'edit' || mode === 'challenge') && editTool === 'select'
  const handleMove = mode === 'edit' ? movePlayer : moveChallengePlayer

  const showMovementArrows = mode === 'demo' && prevFrame !== null
  const annotations = currentFrame.annotations ?? []
  const ballPos = currentFrame.ballPosition

  const preview =
    isDrawingTool && drawPreview
      ? {
          type: editTool as AnnotationType,
          fromX: drawPreview.from.x,
          fromY: drawPreview.from.y,
          toX: drawPreview.to.x,
          toY: drawPreview.to.y,
        }
      : null

  const svgCursor = isDrawingTool ? 'crosshair' : isBallTool ? 'cell' : 'default'

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[600px] relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${COURT_WIDTH} ${COURT_HEIGHT}`}
          className="w-full h-auto rounded-xl shadow-2xl border border-white/10"
          style={{ touchAction: 'none', cursor: svgCursor }}
          onMouseDown={handleSVGMouseDown}
          onMouseMove={handleSVGMouseMove}
          onMouseUp={handleSVGMouseUp}
          onMouseLeave={() => { drawStartRef.current = null; setDrawPreview(null) }}
        >
          <Court />

          {/* Anotaciones del frame actual */}
          <AnnotationLayer
            annotations={annotations}
            preview={preview}
            onRemove={mode === 'edit' && editTool === 'select' ? removeAnnotation : undefined}
            onMoveControl={mode === 'edit' ? moveAnnotationControl : undefined}
            svgRef={svgRef}
          />

          {/* Flechas de movimiento automático en demo */}
          {showMovementArrows && (
            <MovementArrows from={prevFrame!.positions} to={currentFrame.positions} />
          )}

          {/* Jugadores */}
          {players.map((player) => {
            const pos = positions.find((p) => p.playerId === player.id)
            if (!pos) return null
            return (
              <PlayerPiece
                key={player.id}
                player={player}
                x={pos.x}
                y={pos.y}
                draggable={draggable}
                onMove={handleMove}
                svgRef={svgRef}
              />
            )
          })}

          {/* Pelota */}
          {ballPos && (
            <g
              transform={`translate(${(ballPos.x / 100) * COURT_WIDTH}, ${(ballPos.y / 100) * COURT_HEIGHT})`}
              style={{ cursor: isBallTool ? 'cell' : 'default' }}
              onMouseDown={(e) => {
                if (isBallTool) { e.stopPropagation(); moveBall(ballPos.x, ballPos.y) }
              }}
            >
              <circle r={BALL_RADIUS} fill="none" stroke="white" strokeWidth={2.5} />
              <line x1={-BALL_RADIUS} y1={0} x2={BALL_RADIUS} y2={0} stroke="white" strokeWidth={1} opacity={0.5} />
              <line x1={0} y1={-BALL_RADIUS} x2={0} y2={BALL_RADIUS} stroke="white" strokeWidth={1} opacity={0.5} />
            </g>
          )}

          {/* Indicador de frame en demo */}
          {mode === 'demo' && (
            <g transform={`translate(${COURT_WIDTH / 2}, ${COURT_HEIGHT - 15})`}>
              {play.keyframes.map((_, i) => (
                <circle
                  key={i}
                  cx={(i - (play.keyframes.length - 1) / 2) * 16}
                  cy={0}
                  r={5}
                  fill={i === currentFrameIndex ? 'white' : 'rgba(255,255,255,0.3)'}
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth={1}
                />
              ))}
            </g>
          )}
        </svg>
      </div>
    </div>
  )
}

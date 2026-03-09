'use client'
import { useRef, useEffect, useState } from 'react'
import { Play } from '@/types/play'

// ─── Types ─────────────────────────────────────────────────────────────────────

export type NarrativePhase =
  | 'idle'
  | 'players_appear'
  | 'narrative'
  | 'fade_out'
  | 'movement'
  | 'complete'

export interface NarrativeSegment {
  text: string
  delay: number   // segundos hasta el siguiente segmento
}

export interface NarrativeState {
  phase: NarrativePhase
  animProgress: number           // 0→1  (movement)
  playerOpacity: number          // 0→1  (players_appear)
  annotationOpacity: number      // 1→0  (fade_out)
  visibleAnnotationIds: string[] // anotaciones completamente dibujadas
  drawingAnnotationId: string | null
  drawingProgress: number        // 0→1  (stroke-dashoffset)
  currentSegmentIndex: number    // -1 = ninguno activo
  segments: NarrativeSegment[]
}

// ─── parseDescription ──────────────────────────────────────────────────────────
// "El base baja[2]El alero sube[3]Pase interior" → [{text:'El base baja', delay:2}, …]

export function parseDescription(desc: string | undefined): NarrativeSegment[] {
  if (!desc?.trim()) return []
  const parts = desc.split(/\[(\d+(?:\.\d+)?)\]/)
  const result: NarrativeSegment[] = []
  for (let i = 0; i < parts.length; i += 2) {
    const text = parts[i].trim()
    const delay = parts[i + 1] ? parseFloat(parts[i + 1]) : 2
    if (text) result.push({ text, delay })
  }
  return result
}

// ─── Timings ───────────────────────────────────────────────────────────────────
const APPEAR_MS   = 500
const DRAW_MS     = 700
const FADE_OUT_MS = 350
const MIN_DELAY   = 400   // pausa mínima entre anotaciones sin segmento

// ─── Estado inicial ────────────────────────────────────────────────────────────
const IDLE: NarrativeState = {
  phase: 'idle',
  animProgress: 0,
  playerOpacity: 1,
  annotationOpacity: 1,
  visibleAnnotationIds: [],
  drawingAnnotationId: null,
  drawingProgress: 0,
  currentSegmentIndex: -1,
  segments: [],
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

interface Params {
  mode: string
  isDemoPlaying: boolean
  currentFrameIndex: number
  play: Play
  demoSpeed: number
  advanceDemoFrame: () => void
}

export function useNarrativeEngine({
  mode,
  isDemoPlaying,
  currentFrameIndex,
  play,
  demoSpeed,
  advanceDemoFrame,
}: Params): NarrativeState {
  const [state, setState] = useState<NarrativeState>(IDLE)
  const cancelRef = useRef(0)

  useEffect(() => {
    cancelRef.current += 1
    const myToken = cancelRef.current
    const alive = () => cancelRef.current === myToken

    if (mode !== 'demo' || !isDemoPlaying) {
      setState(IDLE)
      return
    }

    const frame = play.keyframes[currentFrameIndex]
    if (!frame) return

    const segments = parseDescription(frame.description)
    const annots   = frame.annotations ?? []
    const hasDesc  = segments.length > 0

    // rAF: siempre resuelve; el caller comprueba alive() después
    const rAF = (dur: number, onTick: (t: number) => void) =>
      new Promise<void>((res) => {
        const t0 = Date.now()
        const tick = () => {
          const t = Math.min(1, (Date.now() - t0) / dur)
          if (alive()) onTick(t)
          if (t < 1) requestAnimationFrame(tick)
          else res()
        }
        requestAnimationFrame(tick)
      })

    const wait = (ms: number) => new Promise<void>((res) => setTimeout(res, ms))

    const run = async () => {
      // ── players_appear ──────────────────────────────────────────────────────
      setState({ ...IDLE, phase: 'players_appear', playerOpacity: 0, segments })
      await rAF(APPEAR_MS, (t) => setState((s) => ({ ...s, playerOpacity: t })))
      if (!alive()) return

      if (hasDesc) {
        // ── narrative ─────────────────────────────────────────────────────────
        setState((s) => ({ ...s, phase: 'narrative', currentSegmentIndex: 0 }))
        const visible: string[] = []

        for (let i = 0; i < segments.length; i++) {
          if (!alive()) return
          setState((s) => ({ ...s, currentSegmentIndex: i }))

          // Dibujar la anotación i (si existe)
          const ann = annots[i]
          if (ann) {
            setState((s) => ({ ...s, drawingAnnotationId: ann.id, drawingProgress: 0 }))
            await rAF(DRAW_MS, (t) => setState((s) => ({ ...s, drawingProgress: t })))
            if (!alive()) return
            visible.push(ann.id)
            setState((s) => ({
              ...s,
              visibleAnnotationIds: [...visible],
              drawingAnnotationId: null,
              drawingProgress: 1,
            }))
          }

          await wait(segments[i].delay * 1000)
          if (!alive()) return
        }

        // Anotaciones sin segmento asociado
        for (let i = segments.length; i < annots.length; i++) {
          if (!alive()) return
          const ann = annots[i]
          setState((s) => ({ ...s, drawingAnnotationId: ann.id, drawingProgress: 0 }))
          await rAF(DRAW_MS, (t) => setState((s) => ({ ...s, drawingProgress: t })))
          if (!alive()) return
          visible.push(ann.id)
          setState((s) => ({
            ...s,
            visibleAnnotationIds: [...visible],
            drawingAnnotationId: null,
            drawingProgress: 1,
          }))
          await wait(MIN_DELAY)
          if (!alive()) return
        }

        // ── fade_out ───────────────────────────────────────────────────────────
        setState((s) => ({ ...s, phase: 'fade_out', currentSegmentIndex: -1 }))
        await rAF(FADE_OUT_MS, (t) => setState((s) => ({ ...s, annotationOpacity: 1 - t })))
        if (!alive()) return
      } else {
        // Sin narrativa: mostrar todas las anotaciones de una
        setState((s) => ({
          ...s,
          phase: 'narrative',
          visibleAnnotationIds: annots.map((a) => a.id),
          currentSegmentIndex: -1,
        }))
        await wait(200)
        if (!alive()) return
      }

      // ── movement ────────────────────────────────────────────────────────────
      setState((s) => ({
        ...s,
        phase: 'movement',
        animProgress: 0,
        annotationOpacity: 0,
        visibleAnnotationIds: [],
      }))
      await rAF(demoSpeed, (t) => setState((s) => ({ ...s, animProgress: t })))
      if (!alive()) return

      // ── complete ────────────────────────────────────────────────────────────
      setState((s) => ({ ...s, phase: 'complete' }))
      advanceDemoFrame()
    }

    run()

    return () => { cancelRef.current += 1 }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, isDemoPlaying, currentFrameIndex, demoSpeed])

  return state
}

'use client'
import React from 'react'
import { NarrativeSegment } from '@/hooks/useNarrativeEngine'

interface Props {
  segments: NarrativeSegment[]
  currentIndex: number   // -1 = oculto
  frameKey: number       // cambia al cambiar de frame → reinicia animación
}

export default function NarrativeOverlay({ segments, currentIndex, frameKey }: Props) {
  if (currentIndex < 0 || currentIndex >= segments.length) return null
  const text = segments[currentIndex].text

  return (
    <div
      key={`${frameKey}-${currentIndex}`}
      className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none"
      style={{ animation: 'desc-fade-in 0.35s ease-out' }}
    >
      <div className="bg-black/75 text-white text-sm px-4 py-2 rounded-xl text-center backdrop-blur-sm max-w-[90%]">
        {text}
      </div>
    </div>
  )
}

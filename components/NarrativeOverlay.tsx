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
      className="absolute bottom-0 left-0 right-0 mx-2 mb-2 flex justify-center pointer-events-none"
      style={{ animation: 'desc-fade-in 0.35s ease-out' }}
    >
      <div className="bg-black/75 text-white px-5 py-5 rounded-xl text-center backdrop-blur-sm max-w-[90%] min-h-[120px] flex flex-col items-center justify-center">
        <p className="text-xl leading-relaxed">{text}</p>
        {segments.length > 1 && (
          <div className="w-8 h-[2px] bg-orange-400 mx-auto mt-3" />
        )}
      </div>
    </div>
  )
}

'use client'
import { usePlayStore } from '@/store/playStore'
import { PLAY_LIBRARY } from '@/data/plays'
import { Play } from '@/types/play'

interface Props {
  onClose: () => void
}

export default function PlaySelector({ onClose }: Props) {
  const { loadPlay, play: currentPlay } = usePlayStore()

  function handleLoad(play: Play) {
    loadPlay(play)
    onClose()
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-white/40 text-xs mb-1">
        Seleccioná una jugada para cargarla en el editor
      </p>
      {PLAY_LIBRARY.map((p) => (
        <button
          key={p.id}
          onClick={() => handleLoad(p)}
          className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all ${
            currentPlay.name === p.name
              ? 'bg-orange-500/20 border-orange-500/50 text-white'
              : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          <span className="font-semibold text-sm">{p.name}</span>
          {p.description && (
            <span className="block text-xs text-white/40 mt-0.5 leading-snug">
              {p.description}
            </span>
          )}
          <span className="block text-xs text-white/30 mt-1">
            {p.keyframes.length} frames
          </span>
        </button>
      ))}
    </div>
  )
}

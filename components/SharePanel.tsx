'use client'
import React, { useState } from 'react'
import { usePlayStore } from '@/store/playStore'

export default function SharePanel() {
  const { exportCode, importCode } = usePlayStore()
  const [importText, setImportText] = useState('')
  const [copied, setCopied] = useState(false)
  const [importError, setImportError] = useState(false)
  const [importOk, setImportOk] = useState(false)

  const code = exportCode()

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleImport = () => {
    setImportError(false)
    setImportOk(false)
    const ok = importCode(importText.trim())
    if (ok) {
      setImportOk(true)
      setImportText('')
    } else {
      setImportError(true)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs text-white/60 uppercase tracking-wider">Exportar jugada</label>
        <p className="text-xs text-white/40 mt-0.5 mb-2">
          Compartí este código con tus jugadores para que puedan verla y practicarla.
        </p>
        <div className="flex gap-2">
          <input
            readOnly
            value={code}
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white/60 text-xs font-mono overflow-hidden"
          />
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              copied ? 'bg-green-500 text-white' : 'bg-orange-500 hover:bg-orange-400 text-white'
            }`}
          >
            {copied ? '✓ Copiado' : 'Copiar'}
          </button>
        </div>
      </div>

      <div>
        <label className="text-xs text-white/60 uppercase tracking-wider">Importar jugada</label>
        <p className="text-xs text-white/40 mt-0.5 mb-2">
          Pegá el código de una jugada que te compartieron.
        </p>
        <div className="flex gap-2">
          <input
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Pegá el código acá..."
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/30 text-xs font-mono focus:outline-none focus:border-orange-400"
          />
          <button
            onClick={handleImport}
            disabled={!importText}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-white/10 hover:bg-white/20 text-white disabled:opacity-40 transition-all"
          >
            Cargar
          </button>
        </div>
        {importError && <p className="text-red-400 text-xs mt-1">Código inválido</p>}
        {importOk && <p className="text-green-400 text-xs mt-1">¡Jugada cargada!</p>}
      </div>
    </div>
  )
}

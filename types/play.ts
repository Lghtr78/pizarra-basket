export type TeamRole = 'offense' | 'defense'

export interface Player {
  id: string
  label: string // '1', '2', '3', '4', '5' o 'D1'...'D5'
  role: TeamRole
  color: string
}

export interface PlayerPosition {
  playerId: string
  x: number // porcentaje del ancho de la cancha (0-100)
  y: number // porcentaje del alto de la cancha (0-100)
}

export interface Keyframe {
  id: string
  positions: PlayerPosition[]
}

export interface Play {
  id: string
  name: string
  keyframes: Keyframe[]
}

export type AppMode = 'edit' | 'demo' | 'challenge'

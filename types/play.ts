export type TeamRole = 'offense' | 'defense'

export interface Player {
  id: string
  label: string
  role: TeamRole
  color: string
}

export interface PlayerPosition {
  playerId: string
  x: number // porcentaje del ancho de la cancha (0-100)
  y: number // porcentaje del alto de la cancha (0-100)
}

export type AnnotationType = 'desplazamiento' | 'pase' | 'dribling' | 'cortina' | 'tiro'

export type EditorTool = 'select' | AnnotationType | 'ball'

export interface Annotation {
  id: string
  type: AnnotationType
  fromX: number
  fromY: number
  toX: number
  toY: number
  cx?: number  // punto de control bezier (porcentaje), undefined = línea recta
  cy?: number
}

export interface Keyframe {
  id: string
  positions: PlayerPosition[]
  annotations?: Annotation[]
  ballPosition?: { x: number; y: number }
  description?: string
}

export interface Play {
  id: string
  name: string
  description?: string
  keyframes: Keyframe[]
}

export type AppMode = 'edit' | 'demo' | 'challenge'

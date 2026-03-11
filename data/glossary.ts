import { AnnotationType } from '@/types/play'

export interface GlossaryTerm {
  id: string
  name: string
  aliases?: string[]
  english?: string[]
  category: GlossaryCategory
  definition: string
  tags: string[]                        // palabras clave para matching semántico en narrativa
  matchAnnotationTypes?: AnnotationType[] // tipos de anotación que activan este término
  matchKeywords?: string[]              // palabras en texto narrativo que lo detectan
}

export type GlossaryCategory =
  | 'posiciones'
  | 'campo'
  | 'espaciado'
  | 'movimientos'
  | 'cortinas'
  | 'pelota'
  | 'principios'
  | 'reglamento'

export const GLOSSARY_CATEGORIES: Record<GlossaryCategory, string> = {
  posiciones: 'Posiciones en la cancha',
  campo: 'Elementos del campo de juego',
  espaciado: 'Espaciado y posicionamiento',
  movimientos: 'Movimientos sin pelota',
  cortinas: 'Cortinas y bloqueos',
  pelota: 'Manejo de pelota',
  principios: 'Principios tácticos',
  reglamento: 'Términos reglamentarios',
}

export const GLOSSARY: GlossaryTerm[] = [
  // ── POSICIONES ──────────────────────────────────────────────────────────────
  {
    id: 'base',
    name: 'Base (1)',
    aliases: ['Armador', 'Conductor'],
    english: ['point guard', 'play maker'],
    category: 'posiciones',
    definition: 'Organizador del juego. Traslada la pelota a la zona de ataque, decide y comunica las jugadas. Es el mejor pasador y dribleador del equipo y el primero en regresar a la defensa.',
    tags: ['base', 'armador', 'conductor', '1'],
    matchKeywords: ['armador', 'conductor', 'base'],
  },
  {
    id: 'escolta',
    name: 'Escolta (2)',
    aliases: ['Ayuda base'],
    english: ['shooting guard'],
    category: 'posiciones',
    definition: 'Jugador de perímetro, veloz y con buena capacidad ofensiva. Puede llevar la pelota para apoyar al base.',
    tags: ['escolta', 'ayuda base', '2'],
    matchKeywords: ['escolta'],
  },
  {
    id: 'alero',
    name: 'Alero (3)',
    aliases: ['Ala'],
    english: ['small forward'],
    category: 'posiciones',
    definition: 'El más alto de los jugadores del perímetro. Puede moverse también cerca del canasto.',
    tags: ['alero', 'ala', '3'],
    matchKeywords: ['alero'],
  },
  {
    id: 'ala-pivote',
    name: 'Ala-pivote (4)',
    aliases: ['Ala-centro', 'Ala fuerte'],
    english: ['power forward'],
    category: 'posiciones',
    definition: 'Jugador interior con versatilidad para salir al perímetro. Puede jugar de frente o de espaldas al aro.',
    tags: ['ala-pivote', 'ala fuerte', '4'],
    matchKeywords: ['ala-pivote', 'ala fuerte'],
  },
  {
    id: 'pivote',
    name: 'Pivote (5)',
    aliases: ['Centro'],
    english: ['center'],
    category: 'posiciones',
    definition: 'El jugador más cercano al aro. Se mueve casi exclusivamente de espaldas al canasto y es el ancla del juego interior.',
    tags: ['pivote', 'centro', '5'],
    matchKeywords: ['pivote', 'centro'],
  },
  // ── CAMPO ───────────────────────────────────────────────────────────────────
  {
    id: 'zona-pintada',
    name: 'Zona pintada',
    aliases: ['Zona restringida (FIBA)'],
    category: 'campo',
    definition: 'Área rectangular formada por la línea final, la línea de tiros libres y las líneas que las unen. Ningún atacante puede permanecer más de 3 segundos en ella sacando ventaja de su posición.',
    tags: ['zona pintada', 'zona restringida', 'pintura', 'llave'],
    matchKeywords: ['zona pintada', 'pintura', 'llave'],
  },
  {
    id: 'perimetro',
    name: 'Perímetro',
    category: 'campo',
    definition: 'Sector del campo cercano a la línea de tres puntos, ubicada a 6,75 metros del aro (FIBA). Los jugadores que operan acá son llamados jugadores de perímetro.',
    tags: ['perímetro', 'tres puntos', 'exterior'],
    matchKeywords: ['perímetro', 'perimetro', 'tres puntos', 'exterior'],
  },
  {
    id: 'poste-alto',
    name: 'Poste alto / T',
    english: ['high post'],
    category: 'campo',
    definition: 'Zona del poste más cercana a la línea de tiros libres. En Argentina se llama T por la forma que genera esa línea con la zona pintada. Posición de referencia en sistemas de movimiento continuo.',
    tags: ['poste alto', 'T', 'high post'],
    matchKeywords: ['poste alto', 'T', 'high post'],
  },
  {
    id: 'poste-bajo',
    name: 'Poste bajo',
    english: ['low post'],
    category: 'campo',
    definition: 'Zona del poste más cercana al aro. Posición típica del pivote (5).',
    tags: ['poste bajo', 'low post'],
    matchKeywords: ['poste bajo'],
  },
  {
    id: 'ala-zona',
    name: 'Ala',
    english: ['wing'],
    category: 'campo',
    definition: 'Zonas laterales del perímetro a la altura de la línea de tiros libres extendida. Posición habitual del escolta (2) y el alero (3).',
    tags: ['ala', 'wing'],
    matchKeywords: ['ala', 'wing'],
  },
  {
    id: 'esquina',
    name: 'Esquina',
    english: ['corner'],
    category: 'campo',
    definition: 'Zonas del perímetro más cercanas a las líneas de fondo. En el 5 abierto, las esquinas las ocupan el ala-pivote (4) y el pivote (5).',
    tags: ['esquina', 'corner'],
    matchKeywords: ['esquina', 'corner'],
  },
  // ── ESPACIADO ────────────────────────────────────────────────────────────────
  {
    id: 'cinco-abierto',
    name: '5 Abierto',
    english: ['five out'],
    category: 'espaciado',
    definition: 'Formación ofensiva donde los cinco jugadores ocupan el perímetro simultáneamente, dejando la zona pintada completamente libre. Obliga a la defensa a estirarse y abre líneas de pase, corte y penetración.',
    tags: ['5 abierto', 'five out', 'formación', 'perímetro'],
    matchKeywords: ['5 abierto', 'five out'],
  },
  {
    id: 'lado-fuerte',
    name: 'Lado fuerte',
    english: ['strong side', 'ball side'],
    category: 'espaciado',
    definition: 'Mitad transversal de la cancha donde se encuentra la pelota. Los defensores tienden a concentrarse acá para proteger el aro.',
    tags: ['lado fuerte', 'strong side', 'ball side'],
    matchKeywords: ['lado fuerte', 'strong side'],
  },
  {
    id: 'lado-debil',
    name: 'Lado débil',
    english: ['weak side', 'help side'],
    category: 'espaciado',
    definition: 'Mitad transversal de la cancha donde no se encuentra la pelota. Los defensores deben elegir entre seguir a sus jugadores o ayudar al lado fuerte, lo que genera ventajas ofensivas.',
    tags: ['lado débil', 'weak side', 'help side'],
    matchKeywords: ['lado débil', 'weak side'],
  },
  {
    id: 'espaciado',
    name: 'Espaciado',
    english: ['spacing'],
    category: 'espaciado',
    definition: 'Distribución de los jugadores manteniendo distancias útiles entre sí (aproximadamente 4-5 metros). Impide que un solo defensor cubra a dos atacantes al mismo tiempo.',
    tags: ['espaciado', 'spacing', 'distribución'],
    matchKeywords: ['espaciado', 'spacing'],
  },
  {
    id: 'equilibrio',
    name: 'Equilibrio ofensivo',
    category: 'espaciado',
    definition: 'Principio que establece que el ataque debe mantener jugadores distribuidos en ambos lados de la cancha para evitar que la defensa concentre todas sus ayudas en un solo sector.',
    tags: ['equilibrio', 'equilibrio ofensivo'],
    matchKeywords: ['equilibrio'],
  },
  // ── MOVIMIENTOS ──────────────────────────────────────────────────────────────
  {
    id: 'corte',
    name: 'Corte / Cortada',
    english: ['cut'],
    category: 'movimientos',
    definition: 'Movimiento rápido de un jugador atacante sin pelota para buscar una posición de recepción o para arrastrar al defensor tras de sí.',
    tags: ['corte', 'cortada', 'cut'],
    matchAnnotationTypes: ['desplazamiento'],
    matchKeywords: ['corta', 'cortada', 'corte', 'cut'],
  },
  {
    id: 'corte-al-aro',
    name: 'Corte al aro',
    english: ['basket cut'],
    category: 'movimientos',
    definition: 'Corte directo hacia el aro luego de realizar un pase. Obliga al defensor a elegir entre seguir al cortador o quedarse. Si sigue, libera espacio; si no, el cortador queda libre.',
    tags: ['corte al aro', 'basket cut', 'cortada al canasto'],
    matchAnnotationTypes: ['desplazamiento'],
    matchKeywords: ['corta', 'corte al aro', 'basket cut', 'hacia el aro', 'al canasto'],
  },
  {
    id: 'backdoor',
    name: 'Backdoor / Puerta atrás',
    english: ['backdoor cut'],
    category: 'movimientos',
    definition: 'Cuando un defensor sobreprotege su posición, el atacante corta por detrás de ese defensor hacia el aro. Es la respuesta táctica a la sobredefensa.',
    tags: ['backdoor', 'puerta atrás'],
    matchAnnotationTypes: ['desplazamiento'],
    matchKeywords: ['backdoor', 'puerta atrás', 'por detrás'],
  },
  {
    id: 'reposicionamiento',
    name: 'Reposicionamiento',
    category: 'movimientos',
    definition: 'Movimiento de los jugadores sin pelota para mantener el espaciado y el equilibrio después de que un compañero se desplaza o corta.',
    tags: ['reposicionamiento', 'rotación', 'reubicar'],
    matchAnnotationTypes: ['desplazamiento'],
    matchKeywords: ['reposiciona', 'rota', 'reubica', 'se mueve', 'se desplaza'],
  },
  {
    id: 'despeje',
    name: 'Vacilar el lado / Despeje',
    english: ['clearing'],
    category: 'movimientos',
    definition: 'Desplazamiento de uno o más jugadores para dejar libre un sector de la cancha, para que un compañero pueda penetrar o recibir sin congestión.',
    tags: ['despeje', 'clearing', 'vaciar'],
    matchAnnotationTypes: ['desplazamiento'],
    matchKeywords: ['vacía', 'despeja', 'clearing', 'se abre'],
  },
  // ── CORTINAS ─────────────────────────────────────────────────────────────────
  {
    id: 'cortina',
    name: 'Cortina',
    aliases: ['Bloqueo', 'Pantalla'],
    english: ['screen', 'pick'],
    category: 'cortinas',
    definition: 'Acción por la cual un atacante se posiciona estáticamente cerca del defensor de un compañero para bloquear su salida y favorecer el desmarque. Debe ser estática — si quien la pone se mueve al hacer contacto, es falta.',
    tags: ['cortina', 'bloqueo', 'pantalla', 'screen', 'pick'],
    matchAnnotationTypes: ['cortina'],
    matchKeywords: ['cortina', 'bloqueo', 'pantalla', 'screen', 'pick'],
  },
  {
    id: 'pick-and-roll',
    name: 'Pick and Roll / Cortina y giro',
    english: ['pick and roll'],
    category: 'cortinas',
    definition: 'El bloqueador pone una cortina al defensor del que tiene la pelota y luego gira sobre un pie para ir directo al canasto o alejarse de la defensa.',
    tags: ['pick and roll', 'cortina y giro'],
    matchAnnotationTypes: ['cortina'],
    matchKeywords: ['pick and roll', 'cortina y giro'],
  },
  // ── PELOTA ────────────────────────────────────────────────────────────────────
  {
    id: 'dribbling',
    name: 'Driblear / Picar',
    english: ['dribble'],
    category: 'pelota',
    definition: 'Acción de botar la pelota contra el suelo para desplazarse. En la app, una flecha de dribling indica que el jugador se mueve con la pelota.',
    tags: ['driblear', 'picar', 'dribble', 'dribling'],
    matchAnnotationTypes: ['dribling'],
    matchKeywords: ['driblea', 'dribling', 'picando', 'con pelota', 'dribla'],
  },
  {
    id: 'pase',
    name: 'Pase',
    category: 'pelota',
    definition: 'Transferencia de la pelota entre jugadores. En la app, una flecha de pase indica el trayecto de la pelota de un jugador a otro.',
    tags: ['pase', 'pasa', 'pasar'],
    matchAnnotationTypes: ['pase'],
    matchKeywords: ['pasa', 'pase', 'le pasa', 'pasando'],
  },
  {
    id: 'pasar-y-cortar',
    name: 'Pasar y cortar',
    english: ['give and go'],
    category: 'pelota',
    definition: 'Pasar la pelota a un compañero y cortar de inmediato hacia el aro buscando la devolución. El defensor tiende a seguir a la pelota y deja solo al que cortó.',
    tags: ['pasar y cortar', 'give and go', 'pase y corte'],
    matchAnnotationTypes: ['pase', 'desplazamiento'],
    matchKeywords: ['pasa y corta', 'give and go', 'pasar y cortar'],
  },
  {
    id: 'penetracion',
    name: 'Penetración',
    english: ['drive'],
    category: 'pelota',
    definition: 'Movimiento vertical de un jugador con pelota hacia el aro, con la intención de convertir puntos o atraer defensores para asistir a un compañero libre.',
    tags: ['penetración', 'drive', 'penetra'],
    matchAnnotationTypes: ['dribling'],
    matchKeywords: ['penetra', 'penetración', 'drive', 'entra al aro'],
  },
  {
    id: 'tiro',
    name: 'Tiro',
    english: ['shot'],
    category: 'pelota',
    definition: 'Lanzamiento al aro con intención de anotar. En la app, la flecha de tiro indica la trayectoria del lanzamiento.',
    tags: ['tiro', 'lanzamiento', 'shot'],
    matchAnnotationTypes: ['tiro'],
    matchKeywords: ['tira', 'tiro', 'lanza', 'lanzamiento', 'shot'],
  },
  {
    id: 'circulacion',
    name: 'Circulación de pelota',
    english: ['ball movement'],
    category: 'pelota',
    definition: 'Movimiento continuo de la pelota entre todos los jugadores del ataque. La circulación activa cansa a los defensores y genera ventajas.',
    tags: ['circulación', 'ball movement', 'mover la pelota'],
    matchAnnotationTypes: ['pase'],
    matchKeywords: ['circulación', 'circula', 'mueve la pelota', 'ball movement'],
  },
  {
    id: 'reversion',
    name: 'Reversión de pelota',
    english: ['ball reversal'],
    category: 'pelota',
    definition: 'Mover la pelota rápidamente de un lado al otro de la cancha mediante pases. Obliga a los defensores a desplazarse lateralmente generando desequilibrios.',
    tags: ['reversión', 'ball reversal', 'invertir'],
    matchAnnotationTypes: ['pase'],
    matchKeywords: ['reversión', 'invierte', 'cambia de lado', 'ball reversal'],
  },
  // ── PRINCIPIOS ────────────────────────────────────────────────────────────────
  {
    id: 'leer-la-defensa',
    name: 'Leer la defensa',
    category: 'principios',
    definition: 'Capacidad del jugador con pelota de observar la posición y reacción del defensor para decidir la acción más conveniente.',
    tags: ['leer la defensa', 'leer', 'decisión'],
    matchKeywords: ['lee', 'decide', 'observa', 'según la defensa'],
  },
  {
    id: 'ventaja',
    name: 'Ventaja',
    english: ['advantage'],
    category: 'principios',
    definition: 'Situación en la que un atacante tiene una posición favorable respecto a su defensor, ya sea por velocidad, posición, o porque el defensor ayudó en otro sector.',
    tags: ['ventaja', 'advantage', 'libre'],
    matchKeywords: ['ventaja', 'libre', 'queda solo', 'advantage'],
  },
  {
    id: 'movimiento-continuo',
    name: 'Movimiento continuo',
    english: ['motion offense'],
    category: 'principios',
    definition: 'Sistema ofensivo que no depende de una sola acción sino de una secuencia que puede repetirse hasta que aparezca una ventaja clara.',
    tags: ['movimiento continuo', 'motion offense', 'sistema'],
    matchKeywords: ['movimiento continuo', 'motion', 'sistema', 'continuidad'],
  },
  {
    id: 'accion-reaccion',
    name: 'Acción-reacción',
    category: 'principios',
    definition: 'Principio del ataque en movimiento: cada desplazamiento de un jugador genera un movimiento en el resto. Nadie está estático.',
    tags: ['acción-reacción', 'reacción', 'movimiento colectivo'],
    matchKeywords: ['reacciona', 'responde', 'acción-reacción'],
  },
  {
    id: 'simetria',
    name: 'Simetría táctica',
    category: 'principios',
    definition: 'Cuando una jugada puede ejecutarse igualmente bien hacia ambos lados de la cancha, lo que hace difícil para la defensa anticiparse.',
    tags: ['simetría', 'simétrico', 'ambos lados'],
    matchKeywords: ['simétr', 'ambos lados', 'mismo lado', 'lado opuesto'],
  },
  // ── REGLAMENTO ────────────────────────────────────────────────────────────────
  {
    id: 'veinticuatro-segundos',
    name: '24 segundos',
    aliases: ['Reloj de tiro (FIBA)'],
    category: 'reglamento',
    definition: 'Tiempo máximo que tiene un equipo para intentar un lanzamiento al aro. Si no se intenta ningún lanzamiento en ese lapso, se pierde la posesión.',
    tags: ['24 segundos', 'reloj de tiro', 'posesión'],
    matchKeywords: ['24 segundos', 'reloj de tiro'],
  },
  {
    id: 'tres-segundos',
    name: '3 segundos',
    category: 'reglamento',
    definition: 'Un atacante no puede permanecer más de 3 segundos dentro de la zona pintada sacando ventaja de su posición.',
    tags: ['3 segundos', 'zona pintada', 'tiempo'],
    matchKeywords: ['3 segundos', 'tres segundos'],
  },
  {
    id: 'falta-personal',
    name: 'Falta personal',
    aliases: ['Falta de jugador (FIBA)'],
    category: 'reglamento',
    definition: 'Infracción que comete un jugador contra otro mediante contacto físico ilegal.',
    tags: ['falta', 'falta personal', 'contacto'],
    matchKeywords: ['falta', 'contacto ilegal'],
  },
]

// ── HELPERS ──────────────────────────────────────────────────────────────────

/** Retorna todos los términos de una categoría */
export function getTermsByCategory(category: GlossaryCategory): GlossaryTerm[] {
  return GLOSSARY.filter(t => t.category === category)
}

/** Detecta qué términos del glosario están presentes en un texto narrativo */
export function detectTermsInText(text: string): GlossaryTerm[] {
  const lower = text.toLowerCase()
  return GLOSSARY.filter(term =>
    term.matchKeywords?.some(kw => lower.includes(kw.toLowerCase()))
  )
}

/** Detecta qué términos del glosario corresponden a un conjunto de tipos de anotación */
export function detectTermsFromAnnotations(types: AnnotationType[]): GlossaryTerm[] {
  return GLOSSARY.filter(term =>
    term.matchAnnotationTypes?.some(t => types.includes(t))
  )
}

/** Busca un término por id */
export function getTermById(id: string): GlossaryTerm | undefined {
  return GLOSSARY.find(t => t.id === id)
}

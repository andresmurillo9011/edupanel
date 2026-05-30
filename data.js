// data.js — Generado automáticamente desde HORARIO_DE_CLASES_2026.xlsx
// Bloques: pares de horas consecutivas de la misma asignatura/grado

const GRADOS = ["sexto","septimo","octavo","noveno","decimo","once"];
const GRADOS_LABEL = {sexto:"6°",septimo:"7°",octavo:"8°",noveno:"9°",decimo:"10°",once:"11°"};

// HORARIO[dia] → array de filas con {hora, sexto, septimo, octavo, noveno, decimo, once}
const HORARIO = {
  "Lunes": [
    {
      "hora": "07:15 - 08:10",
      "num": 1,
      "sexto": "AGROPECUARIA",
      "septimo": "INGLÉS",
      "octavo": "ESPAÑOL",
      "noveno": "MATEMÁTICAS",
      "decimo": "TECNOLOGÍA",
      "once": "FILOSOFÍA"
    },
    {
      "hora": "08:10 - 09:05",
      "num": 2,
      "sexto": "AGROPECUARIA",
      "septimo": "INGLÉS",
      "octavo": "ESPAÑOL",
      "noveno": "MATEMÁTICAS",
      "decimo": "TECNOLOGÍA",
      "once": "FILOSOFÍA"
    },
    {
      "hora": "09:05 - 09:20",
      "tipo": "DESCANSO",
      "sexto": "DESCANSO",
      "septimo": "DESCANSO",
      "octavo": "DESCANSO",
      "noveno": "DESCANSO",
      "decimo": "DESCANSO",
      "once": "DESCANSO"
    },
    {
      "hora": "09:20 - 10:15",
      "num": 3,
      "sexto": "SOCIALES",
      "septimo": "AGROPECUARIA",
      "octavo": "MATEMÁTICAS",
      "noveno": "CIENCIAS NATURALES",
      "decimo": "MATEMÁTICAS",
      "once": ""
    },
    {
      "hora": "10:15 - 11:10",
      "num": 4,
      "sexto": "ESPAÑOL",
      "septimo": "AGROPECUARIA",
      "octavo": "SOCIALES",
      "noveno": "CIENCIAS NATURALES",
      "decimo": "MATEMÁTICAS",
      "once": ""
    },
    {
      "hora": "11:10 - 12:05",
      "num": 5,
      "sexto": "ESPAÑOL",
      "septimo": "CÁTEDRA AMBIENTAL",
      "octavo": "SOCIALES",
      "noveno": "ARTES",
      "decimo": "CÁTEDRA AMBIENTAL",
      "once": ""
    },
    {
      "hora": "12:05 - 12:25",
      "tipo": "ALMUERZO",
      "sexto": "ALMUERZO",
      "septimo": "ALMUERZO",
      "octavo": "ALMUERZO",
      "noveno": "ALMUERZO",
      "decimo": "ALMUERZO",
      "once": "ALMUERZO"
    }
  ],
  "Martes": [
    {
      "hora": "07:15 - 08:10",
      "num": 1,
      "sexto": "LECTURA CRÍTICA",
      "septimo": "",
      "octavo": "INGLÉS",
      "noveno": "ESPAÑOL",
      "decimo": "SOCIALES",
      "once": ""
    },
    {
      "hora": "08:10 - 09:05",
      "num": 2,
      "sexto": "LECTURA CRÍTICA",
      "septimo": "",
      "octavo": "INGLÉS",
      "noveno": "ESPAÑOL",
      "decimo": "SOCIALES",
      "once": ""
    },
    {
      "hora": "09:05 - 09:20",
      "tipo": "DESCANSO",
      "sexto": "DESCANSO",
      "septimo": "DESCANSO",
      "octavo": "DESCANSO",
      "noveno": "DESCANSO",
      "decimo": "DESCANSO",
      "once": "DESCANSO"
    },
    {
      "hora": "09:20 - 10:15",
      "num": 3,
      "sexto": "MATEMÁTICAS",
      "septimo": "INGLÉS",
      "octavo": "ESPAÑOL",
      "noveno": "SOCIALES",
      "decimo": "ESTADÍSITICA",
      "once": ""
    },
    {
      "hora": "10:15 - 11:10",
      "num": 4,
      "sexto": "MATEMÁTICAS",
      "septimo": "ARTES",
      "octavo": "ESPAÑOL",
      "noveno": "SOCIALES",
      "decimo": "QUÍMICA",
      "once": ""
    },
    {
      "hora": "11:10 - 12:05",
      "num": 5,
      "sexto": "ARTES",
      "septimo": "MATEMÁTICAS",
      "octavo": "ÉTICA",
      "noveno": "",
      "decimo": "QUÍMICA",
      "once": ""
    },
    {
      "hora": "12:05 - 12:25",
      "tipo": "ALMUERZO",
      "sexto": "ALMUERZO",
      "septimo": "ALMUERZO",
      "octavo": "ALMUERZO",
      "noveno": "ALMUERZO",
      "decimo": "ALMUERZO",
      "once": "ALMUERZO"
    }
  ],
  "Miércoles": [
    {
      "hora": "07:15 - 08:10",
      "num": 1,
      "sexto": "INGLÉS",
      "septimo": "CIENCIAS NATURALES",
      "octavo": "AGROPECUARIA",
      "noveno": "",
      "decimo": "FILOSOFÍA",
      "once": "TECNOLOGÍA"
    },
    {
      "hora": "08:10 - 09:05",
      "num": 2,
      "sexto": "EMPRENDIMIENTO",
      "septimo": "CIENCIAS NATURALES",
      "octavo": "AGROPECUARIA",
      "noveno": "",
      "decimo": "FILOSOFÍA",
      "once": "TECNOLOGÍA"
    },
    {
      "hora": "09:05 - 09:20",
      "tipo": "DESCANSO",
      "sexto": "DESCANSO",
      "septimo": "DESCANSO",
      "octavo": "DESCANSO",
      "noveno": "DESCANSO",
      "decimo": "DESCANSO",
      "once": "DESCANSO"
    },
    {
      "hora": "09:20 - 10:15",
      "num": 3,
      "sexto": "ÉTICA",
      "septimo": "",
      "octavo": "ESTADÍSTICA",
      "noveno": "ESPAÑOL",
      "decimo": "AGROPECUARIA",
      "once": ""
    },
    {
      "hora": "10:15 - 11:10",
      "num": 4,
      "sexto": "CIENCIAS NATURALES",
      "septimo": "MATEMÁTICAS",
      "octavo": "INGLÉS",
      "noveno": "ESPAÑOL",
      "decimo": "MATEMÁTICAS",
      "once": ""
    },
    {
      "hora": "11:10 - 12:05",
      "num": 5,
      "sexto": "CIENCIAS NATURALES",
      "septimo": "MATEMÁTICAS",
      "octavo": "EDUCACIÓN FÍSICA",
      "noveno": "",
      "decimo": "ARTES",
      "once": ""
    },
    {
      "hora": "12:05 - 12:25",
      "tipo": "ALMUERZO",
      "sexto": "ALMUERZO",
      "septimo": "ALMUERZO",
      "octavo": "ALMUERZO",
      "noveno": "ALMUERZO",
      "decimo": "ALMUERZO",
      "once": "ALMUERZO"
    }
  ],
  "Jueves": [
    {
      "hora": "07:15 - 08:10",
      "num": 1,
      "sexto": "SOCIALES",
      "septimo": "CIENCIAS NATURALES",
      "octavo": "TECNOLOGÍA",
      "noveno": "",
      "decimo": "ESPAÑOL",
      "once": ""
    },
    {
      "hora": "08:10 - 09:05",
      "num": 2,
      "sexto": "SOCIALES",
      "septimo": "CIENCIAS NATURALES",
      "octavo": "TECNOLOGÍA",
      "noveno": "",
      "decimo": "ESPAÑOL",
      "once": ""
    },
    {
      "hora": "09:05 - 09:20",
      "tipo": "DESCANSO",
      "sexto": "DESCANSO",
      "septimo": "DESCANSO",
      "octavo": "DESCANSO",
      "noveno": "DESCANSO",
      "decimo": "DESCANSO",
      "once": "DESCANSO"
    },
    {
      "hora": "09:20 - 10:15",
      "num": 3,
      "sexto": "PROYECTO CIENCIA",
      "septimo": "PROYECTO ARTES",
      "octavo": "CÁTEDRA AMBIENTAL",
      "noveno": "",
      "decimo": "ECOPOLÍTICA",
      "once": ""
    },
    {
      "hora": "10:15 - 11:10",
      "num": 4,
      "sexto": "ESPAÑOL",
      "septimo": "PROYECTO DEPORTE",
      "octavo": "CIENCIAS NATURALES",
      "noveno": "PROYECTO CIENCIA",
      "decimo": "FÍSICA",
      "once": ""
    },
    {
      "hora": "11:10 - 12:05",
      "num": 5,
      "sexto": "ESPAÑOL",
      "septimo": "EMPRENDIMIENTO",
      "octavo": "PROYECTO DEPORTE",
      "noveno": "",
      "decimo": "FÍSICA",
      "once": ""
    },
    {
      "hora": "12:05 - 12:25",
      "tipo": "ALMUERZO",
      "sexto": "ALMUERZO",
      "septimo": "ALMUERZO",
      "octavo": "ALMUERZO",
      "noveno": "ALMUERZO",
      "decimo": "ALMUERZO",
      "once": "ALMUERZO"
    }
  ],
  "Viernes": [
    {
      "hora": "07:15 - 08:10",
      "num": 1,
      "sexto": "TECNOLOGÍA",
      "septimo": "",
      "octavo": "MATEMÁTICAS",
      "noveno": "CIENCIAS NATURALES",
      "decimo": "INGLÉS",
      "once": ""
    },
    {
      "hora": "08:10 - 09:05",
      "num": 2,
      "sexto": "TECNOLOGÍA",
      "septimo": "",
      "octavo": "MATEMÁTICAS",
      "noveno": "CIENCIAS NATURALES",
      "decimo": "GEOMETRÍA",
      "once": ""
    },
    {
      "hora": "09:05 - 09:20",
      "tipo": "DESCANSO",
      "sexto": "DESCANSO",
      "septimo": "DESCANSO",
      "octavo": "DESCANSO",
      "noveno": "DESCANSO",
      "decimo": "DESCANSO",
      "once": "DESCANSO"
    },
    {
      "hora": "09:20 - 10:15",
      "num": 3,
      "sexto": "INGLÉS",
      "septimo": "SOCIALES",
      "octavo": "PROYECTO ARTES",
      "noveno": "RELIGIÓN",
      "decimo": "ESPAÑOL",
      "once": ""
    },
    {
      "hora": "10:15 - 11:10",
      "num": 4,
      "sexto": "INGLÉS",
      "septimo": "SOCIALES",
      "octavo": "GEOMETRÍA",
      "noveno": "GEOMETRÍA",
      "decimo": "ESPAÑOL",
      "once": ""
    },
    {
      "hora": "11:10 - 12:05",
      "num": 5,
      "sexto": "PROYECTO ARTES",
      "septimo": "ESPAÑOL",
      "octavo": "EMPRENDIMIENTO",
      "noveno": "",
      "decimo": "PROYECTO DEPORTE",
      "once": ""
    },
    {
      "hora": "12:05 - 12:25",
      "tipo": "ALMUERZO",
      "sexto": "ALMUERZO",
      "septimo": "ALMUERZO",
      "octavo": "ALMUERZO",
      "noveno": "ALMUERZO",
      "decimo": "ALMUERZO",
      "once": "ALMUERZO"
    }
  ]
};

// BLOQUES["Lunes_sexto_1"] → "Lunes_sexto_1" (id del bloque raíz)
// Si dos horas son bloque, ambas apuntan al mismo id raíz
const BLOQUES = {
  "Lunes_sexto_1": "Lunes_sexto_1",
  "Lunes_sexto_2": "Lunes_sexto_1",
  "Lunes_sexto_4": "Lunes_sexto_4",
  "Lunes_sexto_5": "Lunes_sexto_4",
  "Lunes_septimo_1": "Lunes_septimo_1",
  "Lunes_septimo_2": "Lunes_septimo_1",
  "Lunes_septimo_3": "Lunes_septimo_3",
  "Lunes_septimo_4": "Lunes_septimo_3",
  "Lunes_octavo_1": "Lunes_octavo_1",
  "Lunes_octavo_2": "Lunes_octavo_1",
  "Lunes_octavo_4": "Lunes_octavo_4",
  "Lunes_octavo_5": "Lunes_octavo_4",
  "Lunes_noveno_1": "Lunes_noveno_1",
  "Lunes_noveno_2": "Lunes_noveno_1",
  "Lunes_noveno_3": "Lunes_noveno_3",
  "Lunes_noveno_4": "Lunes_noveno_3",
  "Lunes_decimo_1": "Lunes_decimo_1",
  "Lunes_decimo_2": "Lunes_decimo_1",
  "Lunes_decimo_3": "Lunes_decimo_3",
  "Lunes_decimo_4": "Lunes_decimo_3",
  "Lunes_once_1": "Lunes_once_1",
  "Lunes_once_2": "Lunes_once_1",
  "Martes_sexto_1": "Martes_sexto_1",
  "Martes_sexto_2": "Martes_sexto_1",
  "Martes_sexto_3": "Martes_sexto_3",
  "Martes_sexto_4": "Martes_sexto_3",
  "Martes_octavo_1": "Martes_octavo_1",
  "Martes_octavo_2": "Martes_octavo_1",
  "Martes_octavo_3": "Martes_octavo_3",
  "Martes_octavo_4": "Martes_octavo_3",
  "Martes_noveno_1": "Martes_noveno_1",
  "Martes_noveno_2": "Martes_noveno_1",
  "Martes_noveno_3": "Martes_noveno_3",
  "Martes_noveno_4": "Martes_noveno_3",
  "Martes_decimo_1": "Martes_decimo_1",
  "Martes_decimo_2": "Martes_decimo_1",
  "Martes_decimo_4": "Martes_decimo_4",
  "Martes_decimo_5": "Martes_decimo_4",
  "Miércoles_sexto_4": "Miércoles_sexto_4",
  "Miércoles_sexto_5": "Miércoles_sexto_4",
  "Miércoles_septimo_1": "Miércoles_septimo_1",
  "Miércoles_septimo_2": "Miércoles_septimo_1",
  "Miércoles_septimo_4": "Miércoles_septimo_4",
  "Miércoles_septimo_5": "Miércoles_septimo_4",
  "Miércoles_octavo_1": "Miércoles_octavo_1",
  "Miércoles_octavo_2": "Miércoles_octavo_1",
  "Miércoles_noveno_3": "Miércoles_noveno_3",
  "Miércoles_noveno_4": "Miércoles_noveno_3",
  "Miércoles_decimo_1": "Miércoles_decimo_1",
  "Miércoles_decimo_2": "Miércoles_decimo_1",
  "Miércoles_once_1": "Miércoles_once_1",
  "Miércoles_once_2": "Miércoles_once_1",
  "Jueves_sexto_1": "Jueves_sexto_1",
  "Jueves_sexto_2": "Jueves_sexto_1",
  "Jueves_sexto_4": "Jueves_sexto_4",
  "Jueves_sexto_5": "Jueves_sexto_4",
  "Jueves_septimo_1": "Jueves_septimo_1",
  "Jueves_septimo_2": "Jueves_septimo_1",
  "Jueves_octavo_1": "Jueves_octavo_1",
  "Jueves_octavo_2": "Jueves_octavo_1",
  "Jueves_decimo_1": "Jueves_decimo_1",
  "Jueves_decimo_2": "Jueves_decimo_1",
  "Jueves_decimo_4": "Jueves_decimo_4",
  "Jueves_decimo_5": "Jueves_decimo_4",
  "Viernes_sexto_1": "Viernes_sexto_1",
  "Viernes_sexto_2": "Viernes_sexto_1",
  "Viernes_sexto_3": "Viernes_sexto_3",
  "Viernes_sexto_4": "Viernes_sexto_3",
  "Viernes_septimo_3": "Viernes_septimo_3",
  "Viernes_septimo_4": "Viernes_septimo_3",
  "Viernes_octavo_1": "Viernes_octavo_1",
  "Viernes_octavo_2": "Viernes_octavo_1",
  "Viernes_noveno_1": "Viernes_noveno_1",
  "Viernes_noveno_2": "Viernes_noveno_1",
  "Viernes_decimo_3": "Viernes_decimo_3",
  "Viernes_decimo_4": "Viernes_decimo_3"
};

// Devuelve el bloque_id raíz para una hora dada (o null si no hay bloque)
function getBloqueId(dia, grado, num) {
  return BLOQUES[`${dia}_${grado}_${num}`] || null;
}

// Devuelve todos los nums de hora que pertenecen al mismo bloque
function getHorasDelBloque(dia, grado, num) {
  const bid = getBloqueId(dia, grado, num);
  if (!bid) return [num];
  return Object.entries(BLOQUES)
    .filter(([k,v]) => v===bid && k.startsWith(`${dia}_${grado}_`))
    .map(([k]) => parseInt(k.split("_").pop()))
    .sort((a,b)=>a-b);
}

const MATERIAS_CONFIG = {
  "AGROPECUARIA":       { color:"#15803d", icon:"🌾" },
  "ARTES":              { color:"#db2777", icon:"🎨" },
  "CÁTEDRA AMBIENTAL":  { color:"#16a34a", icon:"🌿" },
  "CIENCIAS NATURALES": { color:"#0891b2", icon:"🔬" },
  "ECOPOLÍTICA":        { color:"#065f46", icon:"🌍" },
  "EDUCACIÓN FÍSICA":   { color:"#ea580c", icon:"⚽" },
  "EMPRENDIMIENTO":     { color:"#b45309", icon:"💡" },
  "ESPAÑOL":            { color:"#7c3aed", icon:"📖" },
  "ESTADÍSTICA":        { color:"#0369a1", icon:"📊" },
  "ESTADÍSITICA":       { color:"#0369a1", icon:"📊" },
  "ÉTICA Y VALORES":    { color:"#be185d", icon:"⚖️" },
  "ÉTICA":              { color:"#be185d", icon:"⚖️" },
  "FILOSOFÍA":          { color:"#6d28d9", icon:"🧠" },
  "FÍSICA":             { color:"#1d4ed8", icon:"⚡" },
  "GEOMETRÍA":          { color:"#0e7490", icon:"📐" },
  "INGLÉS":             { color:"#1e40af", icon:"🇬🇧" },
  "LECTURA CRÍTICA":    { color:"#9333ea", icon:"📚" },
  "MATEMÁTICAS":        { color:"#b91c1c", icon:"➗" },
  "PROYECTO ARTES":     { color:"#c026d3", icon:"🎭" },
  "PROYECTO CIENCIA":   { color:"#0284c7", icon:"🧪" },
  "PROYECTO DEPORTE":   { color:"#d97706", icon:"🏃" },
  "QUÍMICA":            { color:"#047857", icon:"⚗️" },
  "RELIGIÓN":           { color:"#92400e", icon:"✝️" },
  "SOCIALES":           { color:"#854d0e", icon:"🌎" },
  "TECNOLOGÍA":         { color:"#0f766e", icon:"💻" },
  "TECNOLOGÍA E INFORMÁTICA": { color:"#0f766e", icon:"💻" },
  "DESCANSO":           { color:"#374151", icon:"☕" },
  "ALMUERZO":           { color:"#374151", icon:"🍽️" },
};


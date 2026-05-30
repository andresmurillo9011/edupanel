// ============================================================
// data.js — Generado automáticamente desde HORARIO_DE_CLASES_2026.xlsx
// I.E.R. Santiago de la Selva
// ============================================================

// ── GRADOS ──────────────────────────────────────────────────
const GRADOS = ["sexto","septimo","octavo","noveno","decimo","once"];

const GRADOS_LABEL = {
  sexto:   "6°",
  septimo: "7°",
  octavo:  "8°",
  noveno:  "9°",
  decimo:  "10°",
  once:    "11°"
};

// ── MATERIAS CONFIG ─────────────────────────────────────────
const MATERIAS_CONFIG = {
  "AGROPECUARIA":       { color:"#16a34a", icon:"🌱" },
  "ARTES":              { color:"#db2777", icon:"🎨" },
  "CIENCIAS NATURALES": { color:"#059669", icon:"🔬" },
  "CÁTEDRA AMBIENTAL":  { color:"#65a30d", icon:"🌿" },
  "ECOPOLÍTICA":        { color:"#0d9488", icon:"🌍" },
  "EDUCACIÓN FÍSICA":   { color:"#ea580c", icon:"⚽" },
  "EMPRENDIMIENTO":     { color:"#7c3aed", icon:"💡" },
  "ESPAÑOL":            { color:"#d97706", icon:"📖" },
  "ESTADÍSITICA":       { color:"#0891b2", icon:"📊" },
  "ESTADÍSTICA":        { color:"#0891b2", icon:"📊" },
  "FILOSOFÍA":          { color:"#6366f1", icon:"🧠" },
  "FÍSICA":             { color:"#0284c7", icon:"⚡" },
  "GEOMETRÍA":          { color:"#9333ea", icon:"📐" },
  "INGLÉS":             { color:"#2563eb", icon:"🌐" },
  "LECTURA CRÍTICA":    { color:"#b45309", icon:"📚" },
  "MATEMÁTICAS":        { color:"#dc2626", icon:"📏" },
  "PROYECTO ARTES":     { color:"#be185d", icon:"🎭" },
  "PROYECTO CIENCIA":   { color:"#047857", icon:"🧪" },
  "PROYECTO DEPORTE":   { color:"#c2410c", icon:"🏃" },
  "QUÍMICA":            { color:"#7e22ce", icon:"⚗️" },
  "RELIGIÓN":           { color:"#92400e", icon:"✝️" },
  "SOCIALES":           { color:"#1d4ed8", icon:"🗺️" },
  "TECNOLOGÍA":         { color:"#0369a1", icon:"💻" },
  "ÉTICA":              { color:"#854d0e", icon:"⚖️" },
  "DESCANSO":           { color:"#6b7280", icon:"☕" },
  "ALMUERZO":           { color:"#78716c", icon:"🍽️" }
};

// ── ESTADOS DE CLASE ────────────────────────────────────────
const ESTADOS_CLASE = {
  asistio:   { label:"Asistió",    icon:"✓", color:"#16a34a" },
  falta:     { label:"Falta",      icon:"✗", color:"#dc2626" },
  tarde:     { label:"Tarde",      icon:"⏰", color:"#d97706" },
  excusa:    { label:"Excusa",     icon:"📄", color:"#2563eb" },
  notropajo: { label:"No trabajó", icon:"⚠", color:"#9333ea" },
  normal:    { label:"Normal",     icon:"·", color:"#6b7280" }
};

// ── DOCENTES — asignaciones extraídas del Excel por color ────
const DOCENTES_ASIGNACIONES = {
  "CAROLINA":   [
    {grado:"noveno",  area:"CIENCIAS NATURALES"},
    {grado:"sexto",   area:"CIENCIAS NATURALES"},
    {grado:"septimo", area:"CIENCIAS NATURALES"},
    {grado:"octavo",  area:"CIENCIAS NATURALES"},
    {grado:"decimo",  area:"CÁTEDRA AMBIENTAL"},
    {grado:"decimo",  area:"QUÍMICA"},
    {grado:"decimo",  area:"AGROPECUARIA"}
  ],
  "HORACIO":    [
    {grado:"sexto",   area:"MATEMÁTICAS"},
    {grado:"septimo", area:"MATEMÁTICAS"},
    {grado:"octavo",  area:"MATEMÁTICAS"},
    {grado:"sexto",   area:"ESTADÍSTICA"},
    {grado:"septimo", area:"ESTADÍSTICA"},
    {grado:"octavo",  area:"ESTADÍSTICA"},
    {grado:"sexto",   area:"GEOMETRÍA"},
    {grado:"septimo", area:"GEOMETRÍA"},
    {grado:"octavo",  area:"GEOMETRÍA"},
    {grado:"septimo", area:"CÁTEDRA AMBIENTAL"},
    {grado:"sexto",   area:"PROYECTO DEPORTE"},
    {grado:"octavo",  area:"PROYECTO DEPORTE"},
    {grado:"decimo",  area:"PROYECTO DEPORTE"}
  ],
  "SISTEMAS":   [
    {grado:"sexto",   area:"TECNOLOGÍA"},
    {grado:"decimo",  area:"TECNOLOGÍA"},
    {grado:"once",    area:"TECNOLOGÍA"},
    {grado:"sexto",   area:"LECTURA CRÍTICA"},
    {grado:"octavo",  area:"LECTURA CRÍTICA"},
    {grado:"sexto",   area:"PROYECTO CIENCIA"},
    {grado:"septimo", area:"PROYECTO CIENCIA"},
    {grado:"octavo",  area:"PROYECTO CIENCIA"},
    {grado:"noveno",  area:"PROYECTO CIENCIA"},
    {grado:"decimo",  area:"PROYECTO CIENCIA"},
    {grado:"octavo",  area:"RELIGIÓN"},
    {grado:"noveno",  area:"RELIGIÓN"},
    {grado:"sexto",   area:"EDUCACIÓN FÍSICA"},
    {grado:"decimo",  area:"EDUCACIÓN FÍSICA"}
  ],
  "MARTHA":     [
    {grado:"sexto",   area:"AGROPECUARIA"},
    {grado:"septimo", area:"AGROPECUARIA"},
    {grado:"octavo",  area:"AGROPECUARIA"},
    {grado:"decimo",  area:"AGROPECUARIA"},
    {grado:"sexto",   area:"ÉTICA"},
    {grado:"octavo",  area:"ÉTICA"},
    {grado:"decimo",  area:"ÉTICA"},
    {grado:"sexto",   area:"RELIGIÓN"}
  ],
  "AMELIA":     [
    {grado:"decimo",  area:"FILOSOFÍA"},
    {grado:"once",    area:"FILOSOFÍA"},
    {grado:"sexto",   area:"SOCIALES"},
    {grado:"septimo", area:"SOCIALES"},
    {grado:"octavo",  area:"SOCIALES"},
    {grado:"noveno",  area:"SOCIALES"},
    {grado:"decimo",  area:"SOCIALES"},
    {grado:"decimo",  area:"ECOPOLÍTICA"}
  ],
  "MONICA":     [
    {grado:"sexto",   area:"INGLÉS"},
    {grado:"septimo", area:"INGLÉS"},
    {grado:"octavo",  area:"INGLÉS"},
    {grado:"noveno",  area:"INGLÉS"},
    {grado:"decimo",  area:"INGLÉS"},
    {grado:"sexto",   area:"EMPRENDIMIENTO"},
    {grado:"septimo", area:"EMPRENDIMIENTO"},
    {grado:"octavo",  area:"EMPRENDIMIENTO"}
  ],
  "MAURICIO":   [
    {grado:"noveno",  area:"MATEMÁTICAS"},
    {grado:"decimo",  area:"MATEMÁTICAS"},
    {grado:"octavo",  area:"MATEMÁTICAS"},
    {grado:"sexto",   area:"ARTES"},
    {grado:"septimo", area:"ARTES"},
    {grado:"octavo",  area:"ARTES"},
    {grado:"noveno",  area:"ARTES"},
    {grado:"decimo",  area:"ARTES"},
    {grado:"noveno",  area:"ESTADÍSTICA"},
    {grado:"decimo",  area:"ESTADÍSITICA"},
    {grado:"decimo",  area:"FÍSICA"},
    {grado:"decimo",  area:"GEOMETRÍA"},
    {grado:"noveno",  area:"GEOMETRÍA"},
    {grado:"sexto",   area:"PROYECTO ARTES"},
    {grado:"septimo", area:"PROYECTO ARTES"},
    {grado:"octavo",  area:"PROYECTO ARTES"},
    {grado:"noveno",  area:"PROYECTO ARTES"},
    {grado:"decimo",  area:"PROYECTO ARTES"},
    {grado:"septimo", area:"PROYECTO DEPORTE"}
  ],
  "OLVERINA G": [
    {grado:"sexto",   area:"ESPAÑOL"},
    {grado:"septimo", area:"ESPAÑOL"},
    {grado:"octavo",  area:"ESPAÑOL"},
    {grado:"noveno",  area:"ESPAÑOL"},
    {grado:"decimo",  area:"ESPAÑOL"},
    {grado:"sexto",   area:"LECTURA CRÍTICA"},
    {grado:"decimo",  area:"LECTURA CRÍTICA"}
  ]
};

// ── HORARIO COMPLETO 2026 ────────────────────────────────────
const HORARIO = {
  "Lunes": [
    { hora:"07:15 - 08:10", sexto:"AGROPECUARIA",      septimo:"INGLÉS",            octavo:"ESPAÑOL",         noveno:"MATEMÁTICAS",       decimo:"TECNOLOGÍA",     once:"FILOSOFÍA" },
    { hora:"08:10 - 09:05", sexto:"AGROPECUARIA",      septimo:"INGLÉS",            octavo:"ESPAÑOL",         noveno:"MATEMÁTICAS",       decimo:"TECNOLOGÍA",     once:"FILOSOFÍA" },
    { hora:"09:05 - 09:20", sexto:"DESCANSO",          septimo:"DESCANSO",          octavo:"DESCANSO",        noveno:"DESCANSO",          decimo:"DESCANSO",       once:"DESCANSO" },
    { hora:"09:20 - 10:15", sexto:"SOCIALES",          septimo:"AGROPECUARIA",      octavo:"MATEMÁTICAS",     noveno:"CIENCIAS NATURALES", decimo:"MATEMÁTICAS",   once:"" },
    { hora:"10:15 - 11:10", sexto:"ESPAÑOL",           septimo:"AGROPECUARIA",      octavo:"SOCIALES",        noveno:"CIENCIAS NATURALES", decimo:"MATEMÁTICAS",   once:"" },
    { hora:"11:10 - 12:05", sexto:"ESPAÑOL",           septimo:"CÁTEDRA AMBIENTAL", octavo:"SOCIALES",        noveno:"ARTES",             decimo:"CÁTEDRA AMBIENTAL", once:"" },
    { hora:"12:05 - 12:25", sexto:"ALMUERZO",          septimo:"ALMUERZO",          octavo:"ALMUERZO",        noveno:"ALMUERZO",          decimo:"ALMUERZO",       once:"ALMUERZO" },
    { hora:"12:25 - 13:10", sexto:"CIENCIAS NATURALES",septimo:"GEOMETRÍA",         octavo:"LECTURA CRÍTICA", noveno:"",                  decimo:"INGLÉS",         once:"" },
    { hora:"13:10 - 14:15", sexto:"CIENCIAS NATURALES",septimo:"ESPAÑOL",           octavo:"LECTURA CRÍTICA", noveno:"",                  decimo:"INGLÉS",         once:"" }
  ],
  "Martes": [
    { hora:"07:15 - 08:10", sexto:"LECTURA CRÍTICA",   septimo:"",                  octavo:"INGLÉS",          noveno:"ESPAÑOL",           decimo:"SOCIALES",       once:"" },
    { hora:"08:10 - 09:05", sexto:"LECTURA CRÍTICA",   septimo:"",                  octavo:"INGLÉS",          noveno:"ESPAÑOL",           decimo:"SOCIALES",       once:"" },
    { hora:"09:05 - 09:20", sexto:"DESCANSO",          septimo:"DESCANSO",          octavo:"DESCANSO",        noveno:"DESCANSO",          decimo:"DESCANSO",       once:"DESCANSO" },
    { hora:"09:20 - 10:15", sexto:"MATEMÁTICAS",       septimo:"INGLÉS",            octavo:"ESPAÑOL",         noveno:"SOCIALES",          decimo:"ESTADÍSITICA",   once:"" },
    { hora:"10:15 - 11:10", sexto:"MATEMÁTICAS",       septimo:"ARTES",             octavo:"ESPAÑOL",         noveno:"SOCIALES",          decimo:"QUÍMICA",        once:"" },
    { hora:"11:10 - 12:05", sexto:"ARTES",             septimo:"MATEMÁTICAS",       octavo:"ÉTICA",           noveno:"",                  decimo:"QUÍMICA",        once:"" },
    { hora:"12:05 - 12:25", sexto:"ALMUERZO",          septimo:"ALMUERZO",          octavo:"ALMUERZO",        noveno:"ALMUERZO",          decimo:"ALMUERZO",       once:"ALMUERZO" },
    { hora:"12:25 - 13:10", sexto:"SOCIALES",          septimo:"ESTADÍSTICA",       octavo:"ARTES",           noveno:"INGLÉS",            decimo:"EDUCACIÓN FÍSICA",once:"" },
    { hora:"13:10 - 14:15", sexto:"ESTADÍSTICA",       septimo:"PROYECTO CIENCIA",  octavo:"CIENCIAS NATURALES",noveno:"INGLÉS",          decimo:"PROYECTO ARTES", once:"" }
  ],
  "Miércoles": [
    { hora:"07:15 - 08:10", sexto:"INGLÉS",            septimo:"CIENCIAS NATURALES",octavo:"AGROPECUARIA",    noveno:"",                  decimo:"FILOSOFÍA",      once:"TECNOLOGÍA" },
    { hora:"08:10 - 09:05", sexto:"EMPRENDIMIENTO",    septimo:"CIENCIAS NATURALES",octavo:"AGROPECUARIA",    noveno:"",                  decimo:"FILOSOFÍA",      once:"TECNOLOGÍA" },
    { hora:"09:05 - 09:20", sexto:"DESCANSO",          septimo:"DESCANSO",          octavo:"DESCANSO",        noveno:"DESCANSO",          decimo:"DESCANSO",       once:"DESCANSO" },
    { hora:"09:20 - 10:15", sexto:"ÉTICA",             septimo:"",                  octavo:"ESTADÍSTICA",     noveno:"ESPAÑOL",           decimo:"AGROPECUARIA",   once:"" },
    { hora:"10:15 - 11:10", sexto:"CIENCIAS NATURALES",septimo:"MATEMÁTICAS",       octavo:"INGLÉS",          noveno:"ESPAÑOL",           decimo:"MATEMÁTICAS",    once:"" },
    { hora:"11:10 - 12:05", sexto:"CIENCIAS NATURALES",septimo:"MATEMÁTICAS",       octavo:"EDUCACIÓN FÍSICA",noveno:"",                  decimo:"ARTES",          once:"" },
    { hora:"12:05 - 12:25", sexto:"ALMUERZO",          septimo:"ALMUERZO",          octavo:"ALMUERZO",        noveno:"ALMUERZO",          decimo:"ALMUERZO",       once:"ALMUERZO" },
    { hora:"12:25 - 13:10", sexto:"MATEMÁTICAS",       septimo:"SOCIALES",          octavo:"RELIGIÓN",        noveno:"MATEMÁTICAS",       decimo:"LECTURA CRÍTICA",once:"" },
    { hora:"13:10 - 14:15", sexto:"CÁTEDRA AMBIENTAL", septimo:"SOCIALES",          octavo:"PROYECTO CIENCIA",noveno:"PROYECTO ARTES",    decimo:"LECTURA CRÍTICA",once:"" }
  ],
  "Jueves": [
    { hora:"07:15 - 08:10", sexto:"SOCIALES",          septimo:"CIENCIAS NATURALES",octavo:"TECNOLOGÍA",      noveno:"",                  decimo:"ESPAÑOL",        once:"" },
    { hora:"08:10 - 09:05", sexto:"SOCIALES",          septimo:"CIENCIAS NATURALES",octavo:"TECNOLOGÍA",      noveno:"",                  decimo:"ESPAÑOL",        once:"" },
    { hora:"09:05 - 09:20", sexto:"DESCANSO",          septimo:"DESCANSO",          octavo:"DESCANSO",        noveno:"DESCANSO",          decimo:"DESCANSO",       once:"DESCANSO" },
    { hora:"09:20 - 10:15", sexto:"PROYECTO CIENCIA",  septimo:"PROYECTO ARTES",    octavo:"CÁTEDRA AMBIENTAL",noveno:"",                 decimo:"ECOPOLÍTICA",    once:"" },
    { hora:"10:15 - 11:10", sexto:"ESPAÑOL",           septimo:"PROYECTO DEPORTE",  octavo:"CIENCIAS NATURALES",noveno:"PROYECTO CIENCIA",decimo:"FÍSICA",         once:"" },
    { hora:"11:10 - 12:05", sexto:"ESPAÑOL",           septimo:"EMPRENDIMIENTO",    octavo:"PROYECTO DEPORTE",noveno:"",                  decimo:"FÍSICA",         once:"" },
    { hora:"12:05 - 12:25", sexto:"ALMUERZO",          septimo:"ALMUERZO",          octavo:"ALMUERZO",        noveno:"ALMUERZO",          decimo:"ALMUERZO",       once:"ALMUERZO" },
    { hora:"12:25 - 13:10", sexto:"PROYECTO DEPORTE",  septimo:"ESPAÑOL",           octavo:"SOCIALES",        noveno:"INGLÉS",            decimo:"QUÍMICA",        once:"" },
    { hora:"13:10 - 14:15", sexto:"EDUCACIÓN FÍSICA",  septimo:"",                  octavo:"SOCIALES",        noveno:"ESTADÍSTICA",       decimo:"QUÍMICA",        once:"" }
  ],
  "Viernes": [
    { hora:"07:15 - 08:10", sexto:"TECNOLOGÍA",        septimo:"",                  octavo:"MATEMÁTICAS",     noveno:"CIENCIAS NATURALES",decimo:"INGLÉS",         once:"" },
    { hora:"08:10 - 09:05", sexto:"TECNOLOGÍA",        septimo:"",                  octavo:"MATEMÁTICAS",     noveno:"CIENCIAS NATURALES",decimo:"GEOMETRÍA",      once:"" },
    { hora:"09:05 - 09:20", sexto:"DESCANSO",          septimo:"DESCANSO",          octavo:"DESCANSO",        noveno:"DESCANSO",          decimo:"DESCANSO",       once:"DESCANSO" },
    { hora:"09:20 - 10:15", sexto:"INGLÉS",            septimo:"SOCIALES",          octavo:"PROYECTO ARTES",  noveno:"RELIGIÓN",          decimo:"ESPAÑOL",        once:"" },
    { hora:"10:15 - 11:10", sexto:"INGLÉS",            septimo:"SOCIALES",          octavo:"GEOMETRÍA",       noveno:"GEOMETRÍA",         decimo:"ESPAÑOL",        once:"" },
    { hora:"11:10 - 12:05", sexto:"PROYECTO ARTES",    septimo:"ESPAÑOL",           octavo:"EMPRENDIMIENTO",  noveno:"",                  decimo:"PROYECTO DEPORTE",once:"" },
    { hora:"12:05 - 12:25", sexto:"ALMUERZO",          septimo:"ALMUERZO",          octavo:"ALMUERZO",        noveno:"ALMUERZO",          decimo:"ALMUERZO",       once:"ALMUERZO" },
    { hora:"12:25 - 13:10", sexto:"GEOMETRÍA",         septimo:"ESPAÑOL",           octavo:"CIENCIAS NATURALES",noveno:"SOCIALES",        decimo:"ÉTICA",          once:"" },
    { hora:"13:10 - 14:15", sexto:"RELIGIÓN",          septimo:"",                  octavo:"CIENCIAS NATURALES",noveno:"SOCIALES",        decimo:"PROYECTO CIENCIA",once:"" }
  ]
};

// ============================================================
// DATA.JS — I.E.R. Santiago de la Selva · 2026
// Horario completo Lunes-Viernes · Grados 6° a 11°
// Generado desde HORARIO_DE_CLASES_2026.xlsx
// NOTA: Décimo y Once comparten horario según el Excel original
// ============================================================

const HORARIO = {
  Lunes: [
    { hora: "7:15 - 8:10",   sexto: "AGROPECUARIA",       septimo: "INGLÉS",            octavo: "ESPAÑOL",            noveno: "MATEMÁTICAS",        decimo: "TECNOLOGÍA",         once: "FILOSOFÍA" },
    { hora: "8:10 - 9:05",   sexto: "AGROPECUARIA",       septimo: "INGLÉS",            octavo: "ESPAÑOL",            noveno: "MATEMÁTICAS",        decimo: "TECNOLOGÍA",         once: "FILOSOFÍA" },
    { hora: "9:05 - 9:20",   sexto: "DESCANSO",           septimo: "DESCANSO",          octavo: "DESCANSO",           noveno: "DESCANSO",           decimo: "DESCANSO",           once: "DESCANSO" },
    { hora: "9:20 - 10:15",  sexto: "SOCIALES",           septimo: "AGROPECUARIA",      octavo: "MATEMÁTICAS",        noveno: "CIENCIAS NATURALES", decimo: "MATEMÁTICAS",        once: "" },
    { hora: "10:15 - 11:10", sexto: "ESPAÑOL",            septimo: "AGROPECUARIA",      octavo: "SOCIALES",           noveno: "CIENCIAS NATURALES", decimo: "MATEMÁTICAS",        once: "" },
    { hora: "11:10 - 12:05", sexto: "ESPAÑOL",            septimo: "CÁTEDRA AMBIENTAL", octavo: "SOCIALES",           noveno: "ARTES",              decimo: "CÁTEDRA AMBIENTAL",  once: "" },
    { hora: "12:05 - 12:25", sexto: "ALMUERZO",           septimo: "ALMUERZO",          octavo: "ALMUERZO",           noveno: "ALMUERZO",           decimo: "ALMUERZO",           once: "ALMUERZO" },
    { hora: "12:25 - 13:10", sexto: "CIENCIAS NATURALES", septimo: "GEOMETRÍA",         octavo: "LECTURA CRÍTICA",    noveno: "",                   decimo: "INGLÉS",             once: "" },
    { hora: "13:10 - 14:15", sexto: "CIENCIAS NATURALES", septimo: "ESPAÑOL",           octavo: "LECTURA CRÍTICA",    noveno: "",                   decimo: "INGLÉS",             once: "" },
  ],
  Martes: [
    { hora: "7:15 - 8:10",   sexto: "LECTURA CRÍTICA",    septimo: "",                  octavo: "INGLÉS",             noveno: "ESPAÑOL",            decimo: "SOCIALES",           once: "" },
    { hora: "8:10 - 9:05",   sexto: "LECTURA CRÍTICA",    septimo: "",                  octavo: "INGLÉS",             noveno: "ESPAÑOL",            decimo: "SOCIALES",           once: "" },
    { hora: "9:05 - 9:20",   sexto: "DESCANSO",           septimo: "DESCANSO",          octavo: "DESCANSO",           noveno: "DESCANSO",           decimo: "DESCANSO",           once: "DESCANSO" },
    { hora: "9:20 - 10:15",  sexto: "MATEMÁTICAS",        septimo: "INGLÉS",            octavo: "ESPAÑOL",            noveno: "SOCIALES",           decimo: "ESTADÍSTICA",        once: "" },
    { hora: "10:15 - 11:10", sexto: "MATEMÁTICAS",        septimo: "ARTES",             octavo: "ESPAÑOL",            noveno: "SOCIALES",           decimo: "QUÍMICA",            once: "" },
    { hora: "11:10 - 12:05", sexto: "ARTES",              septimo: "MATEMÁTICAS",       octavo: "ÉTICA",              noveno: "",                   decimo: "QUÍMICA",            once: "" },
    { hora: "12:05 - 12:25", sexto: "ALMUERZO",           septimo: "ALMUERZO",          octavo: "ALMUERZO",           noveno: "ALMUERZO",           decimo: "ALMUERZO",           once: "ALMUERZO" },
    { hora: "12:25 - 13:10", sexto: "SOCIALES",           septimo: "ESTADÍSTICA",       octavo: "ARTES",              noveno: "INGLÉS",             decimo: "EDUCACIÓN FÍSICA",   once: "" },
    { hora: "13:10 - 14:15", sexto: "ESTADÍSTICA",        septimo: "PROYECTO CIENCIA",  octavo: "CIENCIAS NATURALES", noveno: "INGLÉS",             decimo: "PROYECTO ARTES",     once: "" },
  ],
  Miércoles: [
    { hora: "7:15 - 8:10",   sexto: "INGLÉS",             septimo: "CIENCIAS NATURALES",octavo: "AGROPECUARIA",       noveno: "",                   decimo: "FILOSOFÍA",          once: "TECNOLOGÍA" },
    { hora: "8:10 - 9:05",   sexto: "EMPRENDIMIENTO",     septimo: "CIENCIAS NATURALES",octavo: "AGROPECUARIA",       noveno: "",                   decimo: "FILOSOFÍA",          once: "TECNOLOGÍA" },
    { hora: "9:05 - 9:20",   sexto: "DESCANSO",           septimo: "DESCANSO",          octavo: "DESCANSO",           noveno: "DESCANSO",           decimo: "DESCANSO",           once: "DESCANSO" },
    { hora: "9:20 - 10:15",  sexto: "ÉTICA",              septimo: "",                  octavo: "ESTADÍSTICA",        noveno: "ESPAÑOL",            decimo: "AGROPECUARIA",       once: "" },
    { hora: "10:15 - 11:10", sexto: "CIENCIAS NATURALES", septimo: "MATEMÁTICAS",       octavo: "INGLÉS",             noveno: "ESPAÑOL",            decimo: "MATEMÁTICAS",        once: "" },
    { hora: "11:10 - 12:05", sexto: "CIENCIAS NATURALES", septimo: "MATEMÁTICAS",       octavo: "EDUCACIÓN FÍSICA",   noveno: "",                   decimo: "ARTES",              once: "" },
    { hora: "12:05 - 12:25", sexto: "ALMUERZO",           septimo: "ALMUERZO",          octavo: "ALMUERZO",           noveno: "ALMUERZO",           decimo: "ALMUERZO",           once: "ALMUERZO" },
    { hora: "12:25 - 13:10", sexto: "MATEMÁTICAS",        septimo: "SOCIALES",          octavo: "RELIGIÓN",           noveno: "MATEMÁTICAS",        decimo: "LECTURA CRÍTICA",    once: "" },
    { hora: "13:10 - 14:15", sexto: "CÁTEDRA AMBIENTAL",  septimo: "SOCIALES",          octavo: "PROYECTO CIENCIA",   noveno: "PROYECTO ARTES",     decimo: "LECTURA CRÍTICA",    once: "" },
  ],
  Jueves: [
    { hora: "7:15 - 8:10",   sexto: "SOCIALES",           septimo: "CIENCIAS NATURALES",octavo: "TECNOLOGÍA",         noveno: "",                   decimo: "ESPAÑOL",            once: "" },
    { hora: "8:10 - 9:05",   sexto: "SOCIALES",           septimo: "CIENCIAS NATURALES",octavo: "TECNOLOGÍA",         noveno: "",                   decimo: "ESPAÑOL",            once: "" },
    { hora: "9:05 - 9:20",   sexto: "DESCANSO",           septimo: "DESCANSO",          octavo: "DESCANSO",           noveno: "DESCANSO",           decimo: "DESCANSO",           once: "DESCANSO" },
    { hora: "9:20 - 10:15",  sexto: "PROYECTO CIENCIA",   septimo: "PROYECTO ARTES",    octavo: "CÁTEDRA AMBIENTAL",  noveno: "",                   decimo: "ECOPOLÍTICA",        once: "" },
    { hora: "10:15 - 11:10", sexto: "ESPAÑOL",            septimo: "PROYECTO DEPORTE",  octavo: "CIENCIAS NATURALES", noveno: "PROYECTO CIENCIA",   decimo: "FÍSICA",             once: "" },
    { hora: "11:10 - 12:05", sexto: "ESPAÑOL",            septimo: "EMPRENDIMIENTO",    octavo: "PROYECTO DEPORTE",   noveno: "",                   decimo: "FÍSICA",             once: "" },
    { hora: "12:05 - 12:25", sexto: "ALMUERZO",           septimo: "ALMUERZO",          octavo: "ALMUERZO",           noveno: "ALMUERZO",           decimo: "ALMUERZO",           once: "ALMUERZO" },
    { hora: "12:25 - 13:10", sexto: "PROYECTO DEPORTE",   septimo: "ESPAÑOL",           octavo: "SOCIALES",           noveno: "INGLÉS",             decimo: "QUÍMICA",            once: "" },
    { hora: "13:10 - 14:15", sexto: "EDUCACIÓN FÍSICA",   septimo: "",                  octavo: "SOCIALES",           noveno: "ESTADÍSTICA",        decimo: "QUÍMICA",            once: "" },
  ],
  Viernes: [
    { hora: "7:15 - 8:10",   sexto: "TECNOLOGÍA",         septimo: "",                  octavo: "MATEMÁTICAS",        noveno: "CIENCIAS NATURALES", decimo: "INGLÉS",             once: "" },
    { hora: "8:10 - 9:05",   sexto: "TECNOLOGÍA",         septimo: "",                  octavo: "MATEMÁTICAS",        noveno: "CIENCIAS NATURALES", decimo: "GEOMETRÍA",          once: "" },
    { hora: "9:05 - 9:20",   sexto: "DESCANSO",           septimo: "DESCANSO",          octavo: "DESCANSO",           noveno: "DESCANSO",           decimo: "DESCANSO",           once: "DESCANSO" },
    { hora: "9:20 - 10:15",  sexto: "INGLÉS",             septimo: "SOCIALES",          octavo: "PROYECTO ARTES",     noveno: "RELIGIÓN",           decimo: "ESPAÑOL",            once: "" },
    { hora: "10:15 - 11:10", sexto: "INGLÉS",             septimo: "SOCIALES",          octavo: "GEOMETRÍA",          noveno: "GEOMETRÍA",          decimo: "ESPAÑOL",            once: "" },
    { hora: "11:10 - 12:05", sexto: "PROYECTO ARTES",     septimo: "ESPAÑOL",           octavo: "EMPRENDIMIENTO",     noveno: "",                   decimo: "PROYECTO DEPORTE",   once: "" },
    { hora: "12:05 - 12:25", sexto: "ALMUERZO",           septimo: "ALMUERZO",          octavo: "ALMUERZO",           noveno: "ALMUERZO",           decimo: "ALMUERZO",           once: "ALMUERZO" },
    { hora: "12:25 - 13:10", sexto: "GEOMETRÍA",          septimo: "ESPAÑOL",           octavo: "CIENCIAS NATURALES", noveno: "SOCIALES",           decimo: "ÉTICA",              once: "" },
    { hora: "13:10 - 14:15", sexto: "RELIGIÓN",           septimo: "",                  octavo: "CIENCIAS NATURALES", noveno: "SOCIALES",           decimo: "PROYECTO CIENCIA",   once: "" },
  ]
};

const MATERIAS_CONFIG = {
  "AGROPECUARIA":       { color: "#22c55e", text: "#fff",    icon: "🌱" },
  "INGLÉS":             { color: "#f59e0b", text: "#fff",    icon: "🌎" },
  "ESPAÑOL":            { color: "#eab308", text: "#1a1a1a", icon: "📖" },
  "MATEMÁTICAS":        { color: "#ef4444", text: "#fff",    icon: "📐" },
  "TECNOLOGÍA":         { color: "#8b5cf6", text: "#fff",    icon: "💻" },
  "SOCIALES":           { color: "#0ea5e9", text: "#fff",    icon: "🌍" },
  "CIENCIAS NATURALES": { color: "#ec4899", text: "#fff",    icon: "🔬" },
  "FILOSOFÍA":          { color: "#6366f1", text: "#fff",    icon: "🧠" },
  "ARTES":              { color: "#f97316", text: "#fff",    icon: "🎨" },
  "GEOMETRÍA":          { color: "#14b8a6", text: "#fff",    icon: "📏" },
  "CÁTEDRA AMBIENTAL":  { color: "#84cc16", text: "#fff",    icon: "♻️" },
  "LECTURA CRÍTICA":    { color: "#e879f9", text: "#fff",    icon: "📚" },
  "ESTADÍSTICA":        { color: "#06b6d4", text: "#fff",    icon: "📊" },
  "QUÍMICA":            { color: "#a855f7", text: "#fff",    icon: "⚗️" },
  "FÍSICA":             { color: "#3b82f6", text: "#fff",    icon: "⚡" },
  "BIOLOGÍA":           { color: "#10b981", text: "#fff",    icon: "🧬" },
  "RELIGIÓN":           { color: "#f43f5e", text: "#fff",    icon: "✝️" },
  "ÉTICA":              { color: "#a78bfa", text: "#fff",    icon: "⚖️" },
  "EDUCACIÓN FÍSICA":   { color: "#34d399", text: "#fff",    icon: "🏃" },
  "EMPRENDIMIENTO":     { color: "#fbbf24", text: "#fff",    icon: "💡" },
  "ECOPOLÍTICA":        { color: "#4ade80", text: "#fff",    icon: "🌿" },
  "PROYECTO CIENCIA":   { color: "#38bdf8", text: "#fff",    icon: "🔭" },
  "PROYECTO ARTES":     { color: "#fb923c", text: "#fff",    icon: "🎭" },
  "PROYECTO DEPORTE":   { color: "#f87171", text: "#fff",    icon: "⚽" },
  "DESCANSO":           { color: "#374151", text: "#9ca3af", icon: "☕" },
  "ALMUERZO":           { color: "#1f2937", text: "#6b7280", icon: "🍽" },
};

const GRADOS = ["sexto","septimo","octavo","noveno","decimo","once"];
const GRADOS_LABEL = {
  sexto:"Grado 6°", septimo:"Grado 7°", octavo:"Grado 8°",
  noveno:"Grado 9°", decimo:"Grado 10°", once:"Grado 11°"
};
const DIAS = ["Lunes","Martes","Miércoles","Jueves","Viernes"];

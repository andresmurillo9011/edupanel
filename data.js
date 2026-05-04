// ============================================================
// DATA.JS — I.E.R. Santiago de la Selva · 2026
// Horario completo Lunes-Viernes · Grados 6° a 11°
// Estudiantes reales — SIMAT
// ============================================================

const HORARIO = {
  Lunes: [
    { hora: "7:15 - 8:10",   sexto: "AGROPECUARIA",      septimo: "INGLÉS",            octavo: "ESPAÑOL",           noveno: "MATEMÁTICAS",        decimo: "TECNOLOGÍA",         once: "FILOSOFÍA" },
    { hora: "8:10 - 9:05",   sexto: "AGROPECUARIA",      septimo: "INGLÉS",            octavo: "ESPAÑOL",           noveno: "MATEMÁTICAS",        decimo: "TECNOLOGÍA",         once: "FILOSOFÍA" },
    { hora: "9:05 - 9:20",   sexto: "DESCANSO",          septimo: "DESCANSO",          octavo: "DESCANSO",          noveno: "DESCANSO",           decimo: "DESCANSO",           once: "DESCANSO" },
    { hora: "9:20 - 10:15",  sexto: "SOCIALES",          septimo: "AGROPECUARIA",      octavo: "MATEMÁTICAS",       noveno: "CIENCIAS NATURALES", decimo: "MATEMÁTICAS",        once: "" },
    { hora: "10:15 - 11:10", sexto: "ESPAÑOL",           septimo: "AGROPECUARIA",      octavo: "SOCIALES",          noveno: "CIENCIAS NATURALES", decimo: "MATEMÁTICAS",        once: "MATEMÁTICAS" },
    { hora: "11:10 - 12:05", sexto: "ESPAÑOL",           septimo: "CÁTEDRA AMBIENTAL", octavo: "SOCIALES",          noveno: "ARTES",              decimo: "CÁTEDRA AMBIENTAL",  once: "CÁTEDRA AMBIENTAL" },
    { hora: "12:05 - 12:25", sexto: "ALMUERZO",          septimo: "ALMUERZO",          octavo: "ALMUERZO",          noveno: "ALMUERZO",           decimo: "ALMUERZO",           once: "ALMUERZO" },
    { hora: "12:25 - 13:10", sexto: "CIENCIAS NATURALES",septimo: "GEOMETRÍA",         octavo: "",                  noveno: "LECTURA CRÍTICA",    decimo: "",                   once: "INGLÉS" },
    { hora: "13:10 - 14:15", sexto: "CIENCIAS NATURALES",septimo: "ESPAÑOL",           octavo: "",                  noveno: "LECTURA CRÍTICA",    decimo: "",                   once: "INGLÉS" },
  ],
  Martes: [
    { hora: "7:15 - 8:10",   sexto: "LECTURA CRÍTICA",   septimo: "",                  octavo: "INGLÉS",            noveno: "ESPAÑOL",            decimo: "SOCIALES",           once: "" },
    { hora: "8:10 - 9:05",   sexto: "LECTURA CRÍTICA",   septimo: "",                  octavo: "INGLÉS",            noveno: "ESPAÑOL",            decimo: "SOCIALES",           once: "" },
    { hora: "9:05 - 9:20",   sexto: "DESCANSO",          septimo: "DESCANSO",          octavo: "DESCANSO",          noveno: "DESCANSO",           decimo: "DESCANSO",           once: "DESCANSO" },
    { hora: "9:20 - 10:15",  sexto: "MATEMÁTICAS",       septimo: "INGLÉS",            octavo: "ESPAÑOL",           noveno: "SOCIALES",           decimo: "ESTADÍSTICA",        once: "" },
    { hora: "10:15 - 11:10", sexto: "MATEMÁTICAS",       septimo: "ARTES",             octavo: "ESPAÑOL",           noveno: "SOCIALES",           decimo: "QUÍMICA",            once: "" },
    { hora: "11:10 - 12:05", sexto: "ARTES",             septimo: "MATEMÁTICAS",       octavo: "ÉTICA",             noveno: "",                   decimo: "QUÍMICA",            once: "" },
    { hora: "12:05 - 12:25", sexto: "ALMUERZO",          septimo: "ALMUERZO",          octavo: "ALMUERZO",          noveno: "ALMUERZO",           decimo: "ALMUERZO",           once: "ALMUERZO" },
    { hora: "12:25 - 13:10", sexto: "SOCIALES",          septimo: "ESTADÍSTICA",       octavo: "ARTES",             noveno: "INGLÉS",             decimo: "EDUCACIÓN FÍSICA",   once: "" },
    { hora: "13:10 - 14:15", sexto: "ESTADÍSTICA",       septimo: "PROYECTO CIENCIA",  octavo: "CIENCIAS NATURALES",noveno: "INGLÉS",             decimo: "PROYECTO ARTES",     once: "" },
  ],
  Miércoles: [
    { hora: "7:15 - 8:10",   sexto: "INGLÉS",            septimo: "CIENCIAS NATURALES",octavo: "AGROPECUARIA",      noveno: "",                   decimo: "FILOSOFÍA",          once: "TECNOLOGÍA" },
    { hora: "8:10 - 9:05",   sexto: "EMPRENDIMIENTO",    septimo: "CIENCIAS NATURALES",octavo: "AGROPECUARIA",      noveno: "",                   decimo: "FILOSOFÍA",          once: "TECNOLOGÍA" },
    { hora: "9:05 - 9:20",   sexto: "DESCANSO",          septimo: "DESCANSO",          octavo: "DESCANSO",          noveno: "DESCANSO",           decimo: "DESCANSO",           once: "DESCANSO" },
    { hora: "9:20 - 10:15",  sexto: "ÉTICA",             septimo: "",                  octavo: "ESTADÍSTICA",       noveno: "ESPAÑOL",            decimo: "AGROPECUARIA",       once: "" },
    { hora: "10:15 - 11:10", sexto: "CIENCIAS NATURALES",septimo: "MATEMÁTICAS",       octavo: "INGLÉS",            noveno: "ESPAÑOL",            decimo: "MATEMÁTICAS",        once: "" },
    { hora: "11:10 - 12:05", sexto: "CIENCIAS NATURALES",septimo: "MATEMÁTICAS",       octavo: "EDUCACIÓN FÍSICA",  noveno: "",                   decimo: "ARTES",              once: "" },
    { hora: "12:05 - 12:25", sexto: "ALMUERZO",          septimo: "ALMUERZO",          octavo: "ALMUERZO",          noveno: "ALMUERZO",           decimo: "ALMUERZO",           once: "ALMUERZO" },
    { hora: "12:25 - 13:10", sexto: "MATEMÁTICAS",       septimo: "SOCIALES",          octavo: "RELIGIÓN",          noveno: "MATEMÁTICAS",        decimo: "LECTURA CRÍTICA",    once: "" },
    { hora: "13:10 - 14:15", sexto: "CÁTEDRA AMBIENTAL", septimo: "SOCIALES",          octavo: "PROYECTO CIENCIA",  noveno: "PROYECTO ARTES",     decimo: "LECTURA CRÍTICA",    once: "" },
  ],
  Jueves: [
    { hora: "7:15 - 8:10",   sexto: "SOCIALES",          septimo: "CIENCIAS NATURALES",octavo: "TECNOLOGÍA",        noveno: "",                   decimo: "ESPAÑOL",            once: "" },
    { hora: "8:10 - 9:05",   sexto: "SOCIALES",          septimo: "CIENCIAS NATURALES",octavo: "TECNOLOGÍA",        noveno: "",                   decimo: "ESPAÑOL",            once: "" },
    { hora: "9:05 - 9:20",   sexto: "DESCANSO",          septimo: "DESCANSO",          octavo: "DESCANSO",          noveno: "DESCANSO",           decimo: "DESCANSO",           once: "DESCANSO" },
    { hora: "9:20 - 10:15",  sexto: "PROYECTO CIENCIA",  septimo: "PROYECTO ARTES",    octavo: "CÁTEDRA AMBIENTAL", noveno: "",                   decimo: "ECOPOLÍTICA",        once: "" },
    { hora: "10:15 - 11:10", sexto: "ESPAÑOL",           septimo: "PROYECTO DEPORTE",  octavo: "CIENCIAS NATURALES",noveno: "PROYECTO CIENCIA",   decimo: "FÍSICA",             once: "" },
    { hora: "11:10 - 12:05", sexto: "ESPAÑOL",           septimo: "EMPRENDIMIENTO",    octavo: "PROYECTO DEPORTE",  noveno: "",                   decimo: "FÍSICA",             once: "" },
    { hora: "12:05 - 12:25", sexto: "ALMUERZO",          septimo: "ALMUERZO",          octavo: "ALMUERZO",          noveno: "ALMUERZO",           decimo: "ALMUERZO",           once: "ALMUERZO" },
    { hora: "12:25 - 13:10", sexto: "PROYECTO DEPORTE",  septimo: "ESPAÑOL",           octavo: "SOCIALES",          noveno: "INGLÉS",             decimo: "QUÍMICA",            once: "" },
    { hora: "13:10 - 14:15", sexto: "EDUCACIÓN FÍSICA",  septimo: "",                  octavo: "SOCIALES",          noveno: "ESTADÍSTICA",        decimo: "QUÍMICA",            once: "" },
  ],
  Viernes: [
    { hora: "7:15 - 8:10",   sexto: "TECNOLOGÍA",        septimo: "",                  octavo: "MATEMÁTICAS",       noveno: "CIENCIAS NATURALES", decimo: "INGLÉS",             once: "" },
    { hora: "8:10 - 9:05",   sexto: "TECNOLOGÍA",        septimo: "",                  octavo: "MATEMÁTICAS",       noveno: "CIENCIAS NATURALES", decimo: "GEOMETRÍA",          once: "" },
    { hora: "9:05 - 9:20",   sexto: "DESCANSO",          septimo: "DESCANSO",          octavo: "DESCANSO",          noveno: "DESCANSO",           decimo: "DESCANSO",           once: "DESCANSO" },
    { hora: "9:20 - 10:15",  sexto: "INGLÉS",            septimo: "SOCIALES",          octavo: "PROYECTO ARTES",    noveno: "RELIGIÓN",           decimo: "ESPAÑOL",            once: "" },
    { hora: "10:15 - 11:10", sexto: "INGLÉS",            septimo: "SOCIALES",          octavo: "GEOMETRÍA",         noveno: "GEOMETRÍA",          decimo: "ESPAÑOL",            once: "" },
    { hora: "11:10 - 12:05", sexto: "PROYECTO ARTES",    septimo: "ESPAÑOL",           octavo: "EMPRENDIMIENTO",    noveno: "",                   decimo: "PROYECTO DEPORTE",   once: "" },
    { hora: "12:05 - 12:25", sexto: "ALMUERZO",          septimo: "ALMUERZO",          octavo: "ALMUERZO",          noveno: "ALMUERZO",           decimo: "ALMUERZO",           once: "ALMUERZO" },
    { hora: "12:25 - 13:10", sexto: "GEOMETRÍA",         septimo: "ESPAÑOL",           octavo: "CIENCIAS NATURALES",noveno: "SOCIALES",           decimo: "ÉTICA",              once: "" },
    { hora: "13:10 - 14:15", sexto: "RELIGIÓN",          septimo: "",                  octavo: "CIENCIAS NATURALES",noveno: "SOCIALES",           decimo: "PROYECTO CIENCIA",   once: "" },
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
  "ÉTICA":              { color: "#10b981", text: "#fff",    icon: "⚖️" },
  "RELIGIÓN":           { color: "#f472b6", text: "#fff",    icon: "✝️" },
  "EDUCACIÓN FÍSICA":   { color: "#fb923c", text: "#fff",    icon: "⚽" },
  "EMPRENDIMIENTO":     { color: "#facc15", text: "#1a1a1a", icon: "💡" },
  "ECOPOLÍTICA":        { color: "#4ade80", text: "#1a1a1a", icon: "🌿" },
  "PROYECTO CIENCIA":   { color: "#38bdf8", text: "#fff",    icon: "🧪" },
  "PROYECTO ARTES":     { color: "#fb7185", text: "#fff",    icon: "🖼️" },
  "PROYECTO DEPORTE":   { color: "#fdba74", text: "#1a1a1a", icon: "🏃" },
  "DESCANSO":           { color: "#475569", text: "#94a3b8", icon: "☕" },
  "ALMUERZO":           { color: "#374151", text: "#6b7280", icon: "🍽️" },
};

const GRADOS       = ["sexto","septimo","octavo","noveno","decimo","once"];
const GRADOS_LABEL = { sexto:"6°", septimo:"7°", octavo:"8°", noveno:"9°", decimo:"10°", once:"11°" };
const GRADOS_NUM   = { sexto:"06", septimo:"07", octavo:"08", noveno:"09", decimo:"10", once:"11" };

const ESTADOS_CLASE = {
  normal:     { label: "Normal",         color: "#22c55e", icon: "✓" },
  notropajo:  { label: "No trabajó",     color: "#ef4444", icon: "✗" },
  refuerzo:   { label: "Refuerzo",       color: "#f59e0b", icon: "⚠" },
  ausente:    { label: "Ausente",        color: "#6b7280", icon: "○" },
  destacado:  { label: "Destacado",      color: "#8b5cf6", icon: "★" },
  pendiente:  { label: "T. Pendiente",   color: "#0ea5e9", icon: "↩" },
};

// ============================================================
// ESTUDIANTES REALES — I.E.R. Santiago de la Selva 2026
// Fuente: SIMAT · Grados 6° a 11° · Estado MATRICULADO
// Total: 63 estudiantes
// ============================================================
const ESTUDIANTES_INICIALES = {
  sexto: [
    { numero:1,  id:"est_s601", nombre:"Andres Felipe Cabrera Zambrano" },
    { numero:2,  id:"est_s602", nombre:"Eydi Katherine Alape Mahecha" },
    { numero:3,  id:"est_s603", nombre:"Ivan Andres Cuenca Nieto" },
    { numero:4,  id:"est_s604", nombre:"Jemelin Yatshara Molano Leon" },
    { numero:5,  id:"est_s605", nombre:"Jerlinsson Smith Cadenas Mora" },
    { numero:6,  id:"est_s606", nombre:"Jhon Deiner Cruz Vega" },
    { numero:7,  id:"est_s607", nombre:"Juan Jose Romero Calderon" },
    { numero:8,  id:"est_s608", nombre:"Karol Jasbleidy Trujillo Osorio" },
    { numero:9,  id:"est_s609", nombre:"Leidy Michell Rojas Vargas" },
    { numero:10, id:"est_s610", nombre:"Nayra Sofia Triana Marroquin" },
    { numero:11, id:"est_s611", nombre:"Neymar Javier Agudelo Silva" },
    { numero:12, id:"est_s612", nombre:"Valeri Andrade Chachinoy" },
    { numero:13, id:"est_s613", nombre:"Yaddira Almario Loaiza" },
    { numero:14, id:"est_s614", nombre:"Yuberly Andrea Rosas Garcia" },
    { numero:15, id:"est_s615", nombre:"Yurledy Alejandra Rosas Garcia" },
  ],
  septimo: [
    { numero:1,  id:"est_s701", nombre:"Andry Melissa Perdomo Silva" },
    { numero:2,  id:"est_s702", nombre:"Angela Sofia Arboleda Perez" },
    { numero:3,  id:"est_s703", nombre:"Eisa Dalihana Pantoja Obando" },
    { numero:4,  id:"est_s704", nombre:"Geidy Yulieth Plaza Rodriguez" },
    { numero:5,  id:"est_s705", nombre:"Jhon Alejandro Arboleda Loaiza" },
    { numero:6,  id:"est_s706", nombre:"Johan Esneider Molano Ferrin" },
    { numero:7,  id:"est_s707", nombre:"Juan Sebastian Herrera Muñoz" },
    { numero:8,  id:"est_s708", nombre:"Karol Sofia Montealegre Chachinoy" },
    { numero:9,  id:"est_s709", nombre:"Kenny Alejandro Junca Villanueva" },
    { numero:10, id:"est_s710", nombre:"Laura Yiseth Bonilla Morales" },
    { numero:11, id:"est_s711", nombre:"Willian Geovany Molano Ferrin" },
    { numero:12, id:"est_s712", nombre:"Zuleiimy Marin Ortiz" },
  ],
  octavo: [
    { numero:1, id:"est_s801", nombre:"Daniela Andrea Yate Mora" },
    { numero:2, id:"est_s802", nombre:"Gustavo Abraham Lara Mojica" },
    { numero:3, id:"est_s803", nombre:"Isabella Rodriguez Cupitre" },
    { numero:4, id:"est_s804", nombre:"Leandro Nieto Cupitre" },
    { numero:5, id:"est_s805", nombre:"Lizeth Fernanda Bravo Loaiza" },
    { numero:6, id:"est_s806", nombre:"Victoria Bobadilla Cabrera" },
    { numero:7, id:"est_s807", nombre:"Yudi Marley Muñoz Valencia" },
    { numero:8, id:"est_s808", nombre:"Zharith Julieth Ospina Zambrano" },
  ],
  noveno: [
    { numero:1, id:"est_s901", nombre:"Dilan Adrian Fierro Cuellar" },
    { numero:2, id:"est_s902", nombre:"Isabella Gonzalez Laguna" },
    { numero:3, id:"est_s903", nombre:"Ivan Andres Gomez Manrique" },
    { numero:4, id:"est_s904", nombre:"Maidy Yuberly Ramirez Gonzalez" },
    { numero:5, id:"est_s905", nombre:"Santiago Gomez Manrique" },
    { numero:6, id:"est_s906", nombre:"Victor Alfonso Tejada Malambo" },
    { numero:7, id:"est_s907", nombre:"Yilmer Stiben Arboleda Loaiza" },
    { numero:8, id:"est_s908", nombre:"Yudi Mercedes Rosas Garcia" },
  ],
  decimo: [
    { numero:1, id:"est_s1001", nombre:"Cared Lised Suarez Vargas" },
    { numero:2, id:"est_s1002", nombre:"Julian Camilo Sanchez Andrade" },
    { numero:3, id:"est_s1003", nombre:"Paula Arboleda Perez" },
    { numero:4, id:"est_s1004", nombre:"Sebastian Teodoro Yate Mora" },
    { numero:5, id:"est_s1005", nombre:"Yeiny Yuliett Rosas Garcia" },
  ],
  once: [
    { numero:1,  id:"est_s1101", nombre:"Ana Yurley Aguilar Berona" },
    { numero:2,  id:"est_s1102", nombre:"Anderson Rosas Rodriguez" },
    { numero:3,  id:"est_s1103", nombre:"Andres Gomez Gonzalez" },
    { numero:4,  id:"est_s1104", nombre:"Angie Lorena Almario Loaiza" },
    { numero:5,  id:"est_s1105", nombre:"Audry Yadira Ramirez Gonzalez" },
    { numero:6,  id:"est_s1106", nombre:"Breinner Andrey Fierro Cuellar" },
    { numero:7,  id:"est_s1107", nombre:"Camilo Agudelo Vargas" },
    { numero:8,  id:"est_s1108", nombre:"Cesar Ivan Suarez Vargas" },
    { numero:9,  id:"est_s1109", nombre:"Danny Andres Rosas Agudelo" },
    { numero:10, id:"est_s1110", nombre:"Eider Adrian Molano Leon" },
    { numero:11, id:"est_s1111", nombre:"Ingrith Andrea Rodriguez Cupitre" },
    { numero:12, id:"est_s1112", nombre:"Jaiver Eduardo Lopez Zamora" },
    { numero:13, id:"est_s1113", nombre:"Juan David Bobadilla Cabrera" },
    { numero:14, id:"est_s1114", nombre:"Karen Mileth Loaiza Zambrano" },
    { numero:15, id:"est_s1115", nombre:"Levi Dromero Rosas" },
  ]
};

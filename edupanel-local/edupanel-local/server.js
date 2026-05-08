// ============================================================
// SERVER.JS — EduPanel + EduClass IA
// Base de datos: JSON local (lowdb) — sin compilación nativa
// Ejecutar: npm start  →  http://localhost:3000
// ============================================================

require("dotenv").config();
const express  = require("express");
const cors     = require("cors");
const path     = require("path");
const fs       = require("fs");
const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");
const low      = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const app        = express();
const JWT_SECRET = process.env.JWT_SECRET || "edupanel_iess_2026";
const PORT       = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

// ── Servir el frontend ────────────────────────────────────
app.use(express.static(path.join(__dirname, "frontend")));

// ============================================================
// BASE DE DATOS JSON — se guarda en edupanel-data.json
// ============================================================
const adapter = new FileSync(path.join(__dirname, "edupanel-data.json"));
const db      = low(adapter);

db.defaults({ users: [], classes: [] }).write();
console.log("✅ Base de datos JSON lista → edupanel-data.json");

// ── Helpers ───────────────────────────────────────────────
const uid = () => Math.random().toString(36).substr(2,9) + Date.now().toString(36);

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ mensaje: "Token requerido" });
  try {
    req.user = jwt.verify(header.split(" ")[1], JWT_SECRET);
    next();
  } catch { return res.status(401).json({ mensaje: "Token inválido o expirado" }); }
};

// ============================================================
// PROVEEDORES DE IA — rotación automática
// ============================================================
const AI_PROVIDERS = [
  { nombre: "Groq",       key: () => process.env.GROQ_KEY,       tipo: "groq",       errores: 0, activa: true },
  { nombre: "Gemini",     key: () => process.env.GEMINI_KEY,     tipo: "gemini",     errores: 0, activa: true },
  { nombre: "Together",   key: () => process.env.TOGETHER_KEY,   tipo: "together",   errores: 0, activa: true },
  { nombre: "OpenRouter", key: () => process.env.OPENROUTER_KEY, tipo: "openrouter", errores: 0, activa: true },
];
let aiIdx = 0;

const llamarIA = async (prompt, system = "", maxTokens = 4096, temp = 0.7) => {
  for (let i = 0; i < AI_PROVIDERS.length; i++) {
    const p = AI_PROVIDERS[(aiIdx + i) % AI_PROVIDERS.length];
    if (!p.activa || !p.key()) continue;
    try {
      let txt = "";
      if (p.tipo === "groq") {
        const Groq = require("groq-sdk");
        const g = new Groq({ apiKey: p.key() });
        const r = await g.chat.completions.create({
          model: "llama-3.3-70b-versatile", max_tokens: maxTokens, temperature: temp,
          messages: [{ role: "system", content: system }, { role: "user", content: prompt }]
        });
        txt = r.choices[0].message.content;
      } else if (p.tipo === "gemini") {
        const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${p.key()}`,{
          method:"POST",headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ contents:[{parts:[{text:system?`${system}\n\n${prompt}`:prompt}]}], generationConfig:{maxOutputTokens:maxTokens,temperature:temp} })
        });
        const d = await r.json(); if (!r.ok) throw new Error(d.error?.message);
        txt = d.candidates[0].content.parts[0].text;
      } else if (p.tipo === "together") {
        const r = await fetch("https://api.together.xyz/v1/chat/completions",{
          method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${p.key()}`},
          body: JSON.stringify({ model:"meta-llama/Llama-3.3-70B-Instruct-Turbo",max_tokens:maxTokens,temperature:temp,messages:[{role:"system",content:system},{role:"user",content:prompt}] })
        });
        const d = await r.json(); if (!r.ok) throw new Error(d.error?.message);
        txt = d.choices[0].message.content;
      } else if (p.tipo === "openrouter") {
        const r = await fetch("https://openrouter.ai/api/v1/chat/completions",{
          method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${p.key()}`},
          body: JSON.stringify({ model:"meta-llama/llama-3.3-70b-instruct:free",max_tokens:maxTokens,temperature:temp,messages:[{role:"system",content:system},{role:"user",content:prompt}] })
        });
        const d = await r.json(); if (!r.ok) throw new Error(d.error?.message);
        txt = d.choices[0].message.content;
      }
      p.errores = 0;
      aiIdx = (aiIdx + i) % AI_PROVIDERS.length;
      console.log(`✅ IA usada: ${p.nombre}`);
      return txt;
    } catch(e) {
      console.error(`❌ ${p.nombre}: ${e.message}`);
      p.errores++;
      if (p.errores >= 2) { p.activa = false; setTimeout(()=>{p.activa=true;p.errores=0;},10*60*1000); }
    }
  }
  throw new Error("Sin claves de IA configuradas. Agrega GROQ_KEY o GEMINI_KEY al archivo .env");
};

// ============================================================
// ENDPOINTS
// ============================================================
app.get("/estado-ia", (_req, res) => res.json({
  proveedores: AI_PROVIDERS.map(p => ({ nombre:p.nombre, configurada:!!p.key(), activa:p.activa&&!!p.key() }))
}));

// ── AUTH ──────────────────────────────────────────────────
app.post("/auth/registro", async (req, res) => {
  try {
    const { nombre, email, password, institucion, cargo, ciudad } = req.body;
    if (!nombre||!email||!password) return res.status(400).json({ mensaje:"Completa todos los campos" });
    if (db.get("users").find({ email }).value()) return res.status(400).json({ mensaje:"Ese correo ya está registrado" });
    const id   = uid();
    const hash = await bcrypt.hash(password, 10);
    const user = { id, name:nombre, email, password:hash, cargo:cargo||"Docente", city:ciudad||"Valparaíso", institution:institucion||"I.E.R. Santiago de la Selva", createdAt:new Date().toISOString() };
    db.get("users").push(user).write();
    const token = jwt.sign({ id, email }, JWT_SECRET, { expiresIn:"30d" });
    const { password:_, ...pub } = user;
    res.json({ mensaje:"Registro exitoso ✅", usuario:{ ...pub, institution:{ name:pub.institution, city:pub.city } }, token });
  } catch(e) { res.status(500).json({ mensaje:e.message }); }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.get("users").find({ email }).value();
    if (!user) return res.status(401).json({ mensaje:"Correo no registrado" });
    if (!await bcrypt.compare(password||"", user.password)) return res.status(401).json({ mensaje:"Contraseña incorrecta" });
    const token = jwt.sign({ id:user.id, email:user.email }, JWT_SECRET, { expiresIn:"30d" });
    const { password:_, ...pub } = user;
    res.json({ usuario:{ ...pub, institution:{ name:pub.institution, city:pub.city } }, token });
  } catch(e) { res.status(500).json({ mensaje:e.message }); }
});

// ── CLASES GUARDADAS ──────────────────────────────────────
app.get("/mis-clases", authMiddleware, (req, res) => {
  const clases = db.get("classes").filter({ userId:req.user.id }).sortBy("createdAt").reverse().value();
  res.json({ clases: clases.map(c => ({ id:c.id, datos:c.datos, creadaEn:c.createdAt })) });
});

app.post("/guardar-clase", authMiddleware, (req, res) => {
  const { contenido, datos } = req.body;
  const id = uid();
  db.get("classes").push({ id, userId:req.user.id, content:contenido, datos:datos||{}, createdAt:new Date().toISOString() }).write();
  res.json({ ok:true, id, mensaje:"Clase guardada ✅" });
});

app.get("/clase/:id", authMiddleware, (req, res) => {
  const row = db.get("classes").find({ id:req.params.id, userId:req.user.id }).value();
  if (!row) return res.status(404).json({ mensaje:"No encontrada" });
  res.json({ clase:{ id:row.id, contenido:row.content, datos:row.datos, creadaEn:row.createdAt } });
});

app.delete("/clase/:id", authMiddleware, (req, res) => {
  db.get("classes").remove({ id:req.params.id, userId:req.user.id }).write();
  res.json({ ok:true });
});

// ── GENERAR GUÍA CON IA ───────────────────────────────────
app.post("/generar-guia", authMiddleware, async (req, res) => {
  try {
    const { institucion,docente,area,grado,periodo,fecha,tema,tipoApertura,
            estratDesarrollo,retroalimentacion,tipoCierre,dejaTarea,estratTarea,
            duracion,cargo,ciudad,nivelEducativo } = req.body;
    const durMin   = parseInt(duracion)||55;
    const durTexto = durMin<=55?"1 hora (55 min)":`${Math.round(durMin/55)} horas (${durMin} min)`;

    const prompt = `Eres pedagogo colombiano experto. Crea guía pedagógica COMPLETA para ${nivelEducativo} nivel ${grado}.
DATOS: Institución:${institucion} | Docente:${docente} (${cargo||"Docente"}) | Ciudad:${ciudad||"Valparaíso"} | Área:${area} | Grado:${grado} | Periodo:${periodo} | Fecha:${fecha||"2026"} | Tema:${tema} | Duración:${durTexto}
ESTRATEGIAS: Apertura:${tipoApertura} | Desarrollo:${estratDesarrollo} | Retro:${retroalimentacion} | Cierre:${tipoCierre} | Tarea:${dejaTarea?estratTarea:"Sin tarea"}

OBLIGATORIO — usa EXACTAMENTE estas marcas de sección:

===APERTURA===
(Redacta apertura completa, mínimo 8 líneas, contextualizada en Colombia)

===SABERES_PREVIOS===
1. (pregunta diagnóstica)
2. (pregunta diagnóstica)
3. (pregunta diagnóstica)
4. (pregunta diagnóstica)

===DESARROLLO===
(Contenido completo sobre "${tema}", mínimo 5 subtemas con ##, ejemplos reales Colombia)

===RETROALIMENTACION===
(Actividad completa de retroalimentación)

===TALLER===
1. COMPRENSIÓN: (2 preguntas)
2. APLICACIÓN: (1 actividad)
3. PENSAMIENTO CRÍTICO: (1 pregunta)
4. CREATIVIDAD: (1 actividad)
5. INVESTIGACIÓN: (1 consulta con fuente)

===CIERRE===
(Síntesis, metacognición y conexión cotidiana)

===TAREA===
${dejaTarea?`(Tarea con instrucciones claras sobre "${tema}")`:"Sin tarea para esta sesión."}

===EXTRAS===
OBJETIVO: (objetivo con verbo infinitivo)
DBA: (DBA completo MEN Colombia ${area} grado ${grado})
ESTANDAR: (Estándar básico MEN completo)
INDICADOR1: (SABER — 🟢Básico 🟡Intermedio 🔵Avanzado)
INDICADOR2: (HACER — mismos niveles)
INDICADOR3: (SER — mismos niveles)
EVIDENCIA: (evidencia observable)
EVALUACION: (3 preguntas abiertas + 2 selección múltiple + 1 práctica)
RECURSOS: (5 recursos numerados)
WEBGRAFIA: (3 fuentes APA)`;

    const contenido = await llamarIA(prompt,"Eres el mejor pedagogo de Colombia. OBLIGATORIO: respeta ===SECCION=== exactamente.",4096,0.7);
    res.json({ contenido, ok:true });
  } catch(e) { res.status(500).json({ mensaje:e.message }); }
});

// ── EXPORTAR WORD ─────────────────────────────────────────
app.post("/exportar-word", authMiddleware, async (req, res) => {
  try {
    const { contenido, institucion, docente, area, grado, periodo,
            tema, cargo, ciudad, nivelEducativo } = req.body;

    const {
      Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
      AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign
    } = require("docx");

    // Parsear secciones
    const bloques = {};
    let sec = null;
    for (const linea of (contenido || "").split("\n")) {
      const m = linea.match(/^===(\w+)===/);
      if (m) { sec = m[1]; bloques[sec] = []; }
      else if (sec) bloques[sec].push(linea);
    }
    const getB = (k) => (bloques[k] || []).join("\n").replace(/\*\*/g, "").trim();
    const ex = getB("EXTRAS");
    const ef = (txt, re) => ((txt.match(re) || [])[1] || "").trim().substring(0, 450);

    // Colores
    const AZUL = "1B4F8A", AZUL_CL = "D6E4F7", NEGRO = "000000", GRIS = "F2F2F2", BLANCO = "FFFFFF";
    const bN = { style: BorderStyle.SINGLE, size: 6, color: NEGRO };
    const bA = { style: BorderStyle.SINGLE, size: 8, color: AZUL };
    const bAll  = { top: bN, bottom: bN, left: bN, right: bN };
    const bAllA = { top: bA, bottom: bA, left: bA, right: bA };
    const TW = 11106;

    // Helpers
    const txt = (v, o = {}) => new TextRun({
      text: String(v || ""), font: "Times New Roman",
      size: o.size || 24, bold: !!o.bold, color: o.color || NEGRO, ...o
    });
    const par = (c, o = {}) => new Paragraph({
      children: c,
      alignment: o.align || AlignmentType.BOTH,
      spacing: o.spacing || { before: 40, after: 40 }
    });
    const cel = (c, o = {}) => new TableCell({
      width: { size: o.w || 1000, type: WidthType.DXA },
      margins: { top: 80, bottom: 80, left: 100, right: 100 },
      shading: { fill: o.fill || BLANCO, type: ShadingType.CLEAR },
      verticalAlign: o.va || VerticalAlign.CENTER,
      borders: o.borders || bAll,
      children: c
    });
    const secH = (title) => new Table({
      width: { size: TW, type: WidthType.DXA },
      columnWidths: [TW],
      rows: [new TableRow({ children: [
        cel([par([txt(title, { bold: true, color: BLANCO })], { align: AlignmentType.CENTER })],
            { w: TW, fill: AZUL, borders: bAllA })
      ]})]
    });
    const row1 = (lb, vl, ew = Math.round(TW * 0.18)) => new Table({
      width: { size: TW, type: WidthType.DXA },
      columnWidths: [ew, TW - ew],
      rows: [new TableRow({ children: [
        cel([par([txt(lb, { bold: true })])], { w: ew, fill: GRIS, borders: bAll }),
        cel([par([txt(vl || "")])], { w: TW - ew, borders: bAll })
      ]})]
    });

    // Extraer campos
    const obj = ef(ex, /OBJETIVO[:\s\n]+([^\n]{10,}[\s\S]*?)(?=\nDBA:|\nESTANDAR:|$)/i) || "Desarrollar competencias.";
    const dba = ef(ex, /DBA[:\s\n]+([\s\S]*?)(?=ESTANDAR:|INDICADOR|$)/i);
    const std = ef(ex, /ESTANDAR[:\s\n]+([\s\S]*?)(?=DBA:|INDICADOR|$)/i);
    const i1  = ef(ex, /INDICADOR1[:\s]+([\s\S]*?)(?=INDICADOR2:|$)/i);
    const i2  = ef(ex, /INDICADOR2[:\s]+([\s\S]*?)(?=INDICADOR3:|$)/i);
    const i3  = ef(ex, /INDICADOR3[:\s]+([\s\S]*?)(?=EVIDENCIA:|$)/i);
    const evd = ef(ex, /EVIDENCIA[:\s]+([\s\S]*?)(?=RECURSOS:|$)/i);
    const evl = ef(ex, /EVALUACION[:\s]+([\s\S]*?)(?=RECURSOS:|WEBGRAFIA:|$)/i);
    const web = ef(ex, /WEBGRAFIA[:\s]+([\s\S]*?)$/i);
    const nivelLabel = nivelEducativo === "preescolar" ? "Preescolar"
                     : nivelEducativo === "primaria"   ? "Primaria"
                     : "Bachillerato";

    const children = [];

    // ENCABEZADO
    children.push(new Table({
      width: { size: TW, type: WidthType.DXA }, columnWidths: [TW],
      rows: [new TableRow({ children: [
        cel([
          par([txt((institucion || "I.E.R. SANTIAGO DE LA SELVA").toUpperCase(), { bold: true, size: 26, color: AZUL })],
              { align: AlignmentType.CENTER }),
          par([txt((ciudad || "Valparaíso") + " — Caquetá", { size: 18, bold: true })],
              { align: AlignmentType.CENTER })
        ], { w: TW, fill: AZUL_CL, borders: bAllA })
      ]})]
    }));
    children.push(par([txt("")]));

    // TÍTULO PLAN DE AULA
    children.push(new Table({
      width: { size: TW, type: WidthType.DXA }, columnWidths: [TW],
      rows: [new TableRow({ children: [
        cel([par([txt("PLAN DE AULA", { bold: true, size: 32, color: AZUL })],
                 { align: AlignmentType.CENTER, spacing: { before: 80, after: 80 } })],
            { w: TW, fill: AZUL_CL, borders: bAllA })
      ]})]
    }));

    // DATOS BÁSICOS
    const H = Math.round(TW / 2);
    children.push(new Table({
      width: { size: TW, type: WidthType.DXA }, columnWidths: [H, H],
      rows: [new TableRow({ children: [
        cel([par([txt("Docente: ", { bold: true }), txt(docente || "")])], { w: H, borders: bAll }),
        cel([par([txt("Institución: ", { bold: true }), txt(institucion || "")])], { w: H, borders: bAll })
      ]})]
    }));
    children.push(par([txt("")]));

    // SECCIÓN INFORMACIÓN GENERAL
    children.push(secH("INFORMACIÓN GENERAL"));
    children.push(row1("TEMA", tema));
    children.push(row1("ÁREA", area));
    children.push(row1("GRADO", grado));
    children.push(row1("PERÍODO", periodo));
    children.push(row1("NIVEL", nivelLabel));
    children.push(row1("DOCENTE", (docente || "") + " — " + (cargo || "Docente")));
    children.push(row1("OBJETIVO", obj));
    children.push(par([txt("")]));

    // REFERENTES
    children.push(secH("REFERENTES NACIONALES DE CALIDAD"));
    const LR = Math.round(TW * 0.28);
    children.push(new Table({
      width: { size: TW, type: WidthType.DXA }, columnWidths: [LR, TW - LR],
      rows: [
        new TableRow({ children: [
          cel([par([txt("ESTÁNDAR BÁSICO (MEN)", { bold: true })])], { w: LR, fill: GRIS, borders: bAll }),
          cel([par([txt(std || "")])], { w: TW - LR, borders: bAll })
        ]}),
        new TableRow({ children: [
          cel([par([txt("DBA — DERECHO BÁSICO DE APRENDIZAJE", { bold: true })])], { w: LR, fill: GRIS, borders: bAll }),
          cel([par([txt(dba || "")])], { w: TW - LR, borders: bAll })
        ]})
      ]
    }));

    // INDICADORES
    const S1 = Math.round(TW * 0.18);
    const S2 = Math.round((TW - S1) / 3);
    const S3 = TW - S1 - S2 - S2;
    children.push(new Table({
      width: { size: TW, type: WidthType.DXA }, columnWidths: [S1, S2, S2, S3],
      rows: [
        new TableRow({ children: [
          cel([par([txt("INDICADORES", { bold: true })])], { w: S1, fill: GRIS, borders: bAll }),
          cel([par([txt("SABER", { bold: true })], { align: AlignmentType.CENTER })], { w: S2, fill: GRIS, borders: bAll }),
          cel([par([txt("HACER", { bold: true })], { align: AlignmentType.CENTER })], { w: S2, fill: GRIS, borders: bAll }),
          cel([par([txt("SER", { bold: true })],   { align: AlignmentType.CENTER })], { w: S3, fill: GRIS, borders: bAll })
        ]}),
        new TableRow({ children: [
          cel([par([txt("Por dimensión")])], { w: S1, borders: bAll }),
          cel([par([txt(i1 || "")])], { w: S2, borders: bAll }),
          cel([par([txt(i2 || "")])], { w: S2, borders: bAll }),
          cel([par([txt(i3 || "")])], { w: S3, borders: bAll })
        ]})
      ]
    }));
    children.push(par([txt("")]));

    // SECUENCIA DIDÁCTICA
    children.push(secH("METODOLOGÍA — SECUENCIA DIDÁCTICA"));
    const secciones = [
      { titulo: "INICIO — APERTURA Y MOTIVACIÓN",   contenido: getB("APERTURA").substring(0, 900)  },
      { titulo: "EXPLORACIÓN — SABERES PREVIOS",    contenido: getB("SABERES_PREVIOS").substring(0, 700) },
      { titulo: "ESTRUCTURACIÓN — DESARROLLO",      contenido: (getB("DESARROLLO") + "\n" + getB("TALLER")).substring(0, 1400) },
      { titulo: "TRANSFERENCIA — RETROALIMENTACIÓN",contenido: getB("RETROALIMENTACION").substring(0, 1000) },
      { titulo: "REFUERZO — CIERRE Y TAREA",        contenido: (getB("CIERRE") + "\n" + getB("TAREA")).substring(0, 1000) },
    ];
    for (const s of secciones) {
      children.push(new Table({
        width: { size: TW, type: WidthType.DXA }, columnWidths: [TW],
        rows: [
          new TableRow({ children: [cel([par([txt(s.titulo, { bold: true })])], { w: TW, fill: GRIS, borders: bAll })] }),
          new TableRow({ children: [cel([par([txt(s.contenido || ".")])], { w: TW, borders: bAll })] })
        ]
      }));
    }
    children.push(par([txt("")]));

    // EVALUACIÓN
    children.push(secH("EVALUACIÓN"));
    const EV = Math.round(TW * 0.55);
    children.push(new Table({
      width: { size: TW, type: WidthType.DXA }, columnWidths: [EV, TW - EV],
      rows: [
        new TableRow({ children: [
          cel([par([txt("EVIDENCIA DE APRENDIZAJE", { bold: true })], { align: AlignmentType.CENTER })], { w: EV, fill: GRIS, borders: bAll }),
          cel([par([txt("CRITERIOS DE EVALUACIÓN", { bold: true })], { align: AlignmentType.CENTER })], { w: TW - EV, fill: GRIS, borders: bAll })
        ]}),
        new TableRow({ children: [
          cel([par([txt(evd || "")])], { w: EV, borders: bAll }),
          cel([par([txt(evl || "")])], { w: TW - EV, borders: bAll })
        ]})
      ]
    }));
    children.push(row1("RECURSOS", ef(ex, /RECURSOS[:\s]+([\s\S]*?)(?=WEBGRAFIA:|$)/i)));
    children.push(row1("WEBGRAFÍA", web));

    // FIRMAS
    children.push(par([txt("")]));
    children.push(par([txt("")]));
    const FW = Math.round(TW / 2);
    const nb = {
      top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }
    };
    children.push(new Table({
      width: { size: TW, type: WidthType.DXA }, columnWidths: [FW, TW - FW],
      rows: [new TableRow({ children: [
        cel([
          par([txt("_______________________________")], { align: AlignmentType.CENTER }),
          par([txt(docente || "Docente", { bold: true })], { align: AlignmentType.CENTER }),
          par([txt(cargo || "Docente", { size: 20 })],   { align: AlignmentType.CENTER })
        ], { w: FW, borders: nb }),
        cel([
          par([txt("_______________________________")], { align: AlignmentType.CENTER }),
          par([txt("Coordinador / Rector", { bold: true })], { align: AlignmentType.CENTER }),
          par([txt("Vo. Bo.", { size: 20 })], { align: AlignmentType.CENTER })
        ], { w: TW - FW, borders: nb })
      ]})]
    }));

    const doc = new Document({
      styles: { default: { document: { run: { font: "Times New Roman", size: 24 } } } },
      sections: [{
        properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 567, right: 567, bottom: 567, left: 567 } } },
        children
      }]
    });

    const buffer = await Packer.toBuffer(doc);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.setHeader("Content-Disposition", `attachment; filename="PlanAula_${(area || "Area").replace(/ /g, "_")}_Grado${grado}.docx"`);
    res.send(buffer);

  } catch(e) {
    console.error("❌ Word error:", e.message);
    res.status(500).json({ mensaje: e.message });
  }
});

// ── Fallback ──────────────────────────────────────────────
app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "frontend", "login.html")));

// ── INICIAR ───────────────────────────────────────────────
app.listen(PORT, () => {
  console.log("\n╔══════════════════════════════════════════╗");
  console.log(`║  🌿 EduPanel IESS  →  http://localhost:${PORT}  ║`);
  console.log("╚══════════════════════════════════════════╝\n");
  console.log("📁 Páginas disponibles:");
  console.log(`   http://localhost:${PORT}/login.html      ← Login EduPanel`);
  console.log(`   http://localhost:${PORT}/horario.html    ← Horario`);
  console.log(`   http://localhost:${PORT}/admin.html      ← Administración`);
  console.log(`   http://localhost:${PORT}/planeacion.html ← Planeación IA\n`);
  const ias = AI_PROVIDERS.filter(p => p.key());
  if (ias.length === 0) {
    console.log("⚠️  Sin claves de IA. Abre el archivo .env y agrega:");
    console.log("   GROQ_KEY=gsk_...   ←  gratis en console.groq.com");
    console.log("   GEMINI_KEY=...     ←  gratis en aistudio.google.com\n");
  } else {
    console.log(`🤖 IA lista: ${ias.map(p=>p.nombre).join(" → ")}\n`);
  }
});

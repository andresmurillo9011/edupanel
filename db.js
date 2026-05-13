// ============================================================
// DB.JS — Persistencia con backend EduClass (Render)
// Fallback a localStorage si no hay conexión
// I.E.R. Santiago de la Selva · 2026
// ============================================================

const DB = (() => {

  const API = "https://educlass-backend-4kk0.onrender.com";

  // ID de institución — obtenido del usuario actual
  function getInstId() {
    try {
      const u = JSON.parse(localStorage.getItem("educlass_usuario") || "{}");
      return u.institutionId || u.institution?.id || "iess-santiago-de-la-selva";
    } catch { return "iess-santiago-de-la-selva"; }
  }

  function getTok() { return localStorage.getItem("edutoken") || ""; }

  function authH() {
    return { "Content-Type": "application/json", "Authorization": `Bearer ${getTok()}` };
  }

  // ── localStorage helpers (fallback) ──────────────────
  function _get(key, def = null) {
    try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : def; }
    catch { return def; }
  }
  function _set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch(_) {} }

  // ============================================================
  // SEED
  // ============================================================
  function seedEstudiantes() {
    if (localStorage.getItem("edupanel_seeded")) return;
    if (!window.ESTUDIANTES_INICIALES) return;
    Object.entries(window.ESTUDIANTES_INICIALES).forEach(([grado, lista]) => {
      const key = `ep_est_${grado}`;
      if (!_get(key)) _set(key, lista.map(e => ({ ...e, grado, activo: true })));
    });
    localStorage.setItem("edupanel_seeded", "1");
  }

  // ============================================================
  // ESTUDIANTES
  // ============================================================
  async function getEstudiantes(grado) {
    const instId = getInstId();
    try {
      const r = await fetch(`${API}/edupanel/estudiantes/${instId}/${grado}`, { headers: authH() });
      if (r.ok) {
        const d = await r.json();
        if (d.ok && d.estudiantes?.length >= 0) {
          // Sincronizar localStorage como caché
          _set(`ep_est_${grado}`, d.estudiantes);
          return d.estudiantes.sort((a,b) => a.numero - b.numero);
        }
      }
    } catch(_) {}
    // Fallback: localStorage
    return _get(`ep_est_${grado}`, []).sort((a,b) => a.numero - b.numero);
  }

  async function addEstudiante(grado, nombre, numero) {
    const instId = getInstId();
    try {
      const r = await fetch(`${API}/edupanel/estudiantes/${instId}/${grado}`, {
        method: "POST", headers: authH(),
        body: JSON.stringify({ nombre, numero })
      });
      if (r.ok) {
        const d = await r.json();
        if (d.ok) {
          // Actualizar caché local
          const lista = _get(`ep_est_${grado}`, []);
          lista.push(d.estudiante);
          _set(`ep_est_${grado}`, lista);
          return d.estudiante;
        }
      }
    } catch(_) {}
    // Fallback: localStorage
    const lista = _get(`ep_est_${grado}`, []);
    const num = numero || (lista.length + 1);
    const est = { id: `est_${Date.now()}`, nombre: nombre.trim(), numero: num, grado, activo: true };
    lista.push(est);
    lista.sort((a,b) => a.numero - b.numero);
    _set(`ep_est_${grado}`, lista);
    return est;
  }

  async function updateEstudiante(estId, changes) {
    try {
      await fetch(`${API}/edupanel/estudiantes/${estId}`, {
        method: "PUT", headers: authH(),
        body: JSON.stringify(changes)
      });
    } catch(_) {}
    // Actualizar caché local también
    const GRADOS = ["sexto","septimo","octavo","noveno","decimo","once"];
    for (const g of GRADOS) {
      const lista = _get(`ep_est_${g}`, []);
      const idx = lista.findIndex(e => e.id === estId);
      if (idx !== -1) {
        if (changes.nombre) lista[idx].nombre = changes.nombre;
        _set(`ep_est_${g}`, lista); break;
      }
    }
    return Promise.resolve();
  }

  async function deleteEstudiante(estId) {
    try {
      await fetch(`${API}/edupanel/estudiantes/${estId}`, {
        method: "DELETE", headers: authH()
      });
    } catch(_) {}
    // Limpiar caché local
    const GRADOS = ["sexto","septimo","octavo","noveno","decimo","once"];
    for (const g of GRADOS) {
      const lista = _get(`ep_est_${g}`, []);
      const nueva = lista.filter(e => e.id !== estId);
      if (nueva.length !== lista.length) { _set(`ep_est_${g}`, nueva); break; }
    }
    return Promise.resolve();
  }

  // ============================================================
  // MALLA CURRICULAR
  // ============================================================
  async function getMalla(materia) {
    const instId = getInstId();
    try {
      const r = await fetch(`${API}/mallas/${instId}/${encodeURIComponent(materia)}`, { headers: authH() });
      if (r.ok) {
        const d = await r.json();
        if (d.ok && d.malla) {
          const m = { p1: d.malla.p1||"", p2: d.malla.p2||"", p3: d.malla.p3||"",
                      p4: d.malla.p4||"", archivos: [], updatedAt: d.malla.updatedAt };
          _set(`ep_malla_${materia}`, m);
          return m;
        }
      }
    } catch(_) {}
    return _get(`ep_malla_${materia}`, { p1:"", p2:"", p3:"", p4:"", archivos:[] });
  }

  async function saveMalla(materia, data) {
    const instId = getInstId();
    try {
      await fetch(`${API}/mallas/${instId}/${encodeURIComponent(materia)}`, {
        method: "PUT", headers: authH(),
        body: JSON.stringify(data)
      });
    } catch(_) {}
    // Caché local
    const existing = _get(`ep_malla_${materia}`, { archivos: [] });
    _set(`ep_malla_${materia}`, { ...existing, ...data, updatedAt: new Date().toISOString() });
    return Promise.resolve();
  }

  function getTemasList(malla) {
    if (!malla) return [];
    return [malla.p1||"", malla.p2||"", malla.p3||"", malla.p4||""]
      .join("\n").split("\n").map(t => t.trim()).filter(Boolean);
  }

  async function getTemasListByMateria(materia) {
    const m = await getMalla(materia);
    return getTemasList(m);
  }

  async function saveMallaArchivo(materia, fileInfo) {
    const malla = _get(`ep_malla_${materia}`, { archivos: [] });
    const archivos = malla.archivos || [];
    const idx = archivos.findIndex(a => a.nombre === fileInfo.nombre);
    if (idx >= 0) archivos[idx] = fileInfo; else archivos.push(fileInfo);
    _set(`ep_malla_${materia}`, { ...malla, archivos, updatedAt: new Date().toISOString() });
    return Promise.resolve();
  }

  async function deleteMallaArchivo(materia, nombre) {
    const malla = _get(`ep_malla_${materia}`, { archivos: [] });
    const archivos = (malla.archivos || []).filter(a => a.nombre !== nombre);
    _set(`ep_malla_${materia}`, { ...malla, archivos });
    return Promise.resolve();
  }

  // ============================================================
  // DIARIO DE CLASE
  // ============================================================
  function _did(dia, grado, hora, materia) {
    return `ep_diario_${[dia,grado,hora,materia].join("__").replace(/[ :\/]/g,"_")}`;
  }

  async function getDiario(dia, grado, hora, materia) {
    const instId = getInstId();
    const def = {
      temaVisto:"", descripcion:"", observacionGeneral:"",
      guiaTerminada:null, guiaPendiente:"", avancePorcentaje:50,
      temasPasados:"", temasPendientes:"", planPeriodo:"",
      logros:"", archivos:[], proximoTemaIdx:0, userId:null
    };
    try {
      const r = await fetch(
        `${API}/edupanel/diario/${instId}/${dia}/${grado}/${encodeURIComponent(hora)}/${encodeURIComponent(materia)}`,
        { headers: authH() }
      );
      if (r.ok) {
        const d = await r.json();
        if (d.ok && d.diario) {
          _set(_did(dia,grado,hora,materia), d.diario);
          return { ...def, ...d.diario };
        }
      }
    } catch(_) {}
    return { ...def, ..._get(_did(dia,grado,hora,materia), {}) };
  }

  async function saveDiario(dia, grado, hora, materia, data, userId) {
    const instId = getInstId();
    const payload = { ...data, dia, grado, hora, materia, userId, updatedAt: new Date().toISOString() };
    // Guardar local inmediatamente
    _set(_did(dia,grado,hora,materia), payload);
    // Guardar en backend
    try {
      await fetch(
        `${API}/edupanel/diario/${instId}/${dia}/${grado}/${encodeURIComponent(hora)}/${encodeURIComponent(materia)}`,
        { method: "PUT", headers: authH(), body: JSON.stringify(payload) }
      );
    } catch(_) {}
    return Promise.resolve();
  }

  async function allDiarios() {
    const instId = getInstId();
    try {
      const r = await fetch(`${API}/edupanel/diarios/${instId}`, { headers: authH() });
      if (r.ok) {
        const d = await r.json();
        if (d.ok) return d.diarios || [];
      }
    } catch(_) {}
    // Fallback: localStorage
    const result = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith("ep_diario_")) result.push(_get(k));
    }
    return result.filter(Boolean);
  }

  // ============================================================
  // NOTAS
  // ============================================================
  function _nid(dia, grado, hora, materia, estId) {
    return `ep_nota_${[dia,grado,hora,materia,estId].join("__").replace(/[ :\/]/g,"_")}`;
  }

  async function getNota(dia, grado, hora, materia, estId) {
    const instId = getInstId();
    const def = { nota:"", estado:"normal", observacion:"" };
    try {
      const r = await fetch(
        `${API}/edupanel/nota/${instId}/${dia}/${grado}/${encodeURIComponent(hora)}/${encodeURIComponent(materia)}/${estId}`,
        { headers: authH() }
      );
      if (r.ok) {
        const d = await r.json();
        if (d.ok && d.nota) return { ...def, ...d.nota };
      }
    } catch(_) {}
    return { ...def, ..._get(_nid(dia,grado,hora,materia,estId), {}) };
  }

  async function saveNota(dia, grado, hora, materia, estId, data) {
    const instId = getInstId();
    const payload = { ...data, dia, grado, hora, materia, estId, updatedAt: new Date().toISOString() };
    _set(_nid(dia,grado,hora,materia,estId), payload);
    try {
      await fetch(
        `${API}/edupanel/nota/${instId}/${dia}/${grado}/${encodeURIComponent(hora)}/${encodeURIComponent(materia)}/${estId}`,
        { method: "PUT", headers: authH(), body: JSON.stringify(payload) }
      );
    } catch(_) {}
    return Promise.resolve();
  }

  async function getNotasGrado(dia, grado, hora, materia) {
    const instId = getInstId();
    try {
      const r = await fetch(
        `${API}/edupanel/notas/${instId}/${dia}/${grado}/${encodeURIComponent(hora)}/${encodeURIComponent(materia)}`,
        { headers: authH() }
      );
      if (r.ok) {
        const d = await r.json();
        if (d.ok) return d.notas || {};
      }
    } catch(_) {}
    // Fallback: localStorage
    const prefix = `ep_nota_${[dia,grado,hora,materia].join("__").replace(/[ :\/]/g,"_")}__`;
    const map = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(prefix)) {
        const data = _get(k);
        if (data?.estId) map[data.estId] = data;
      }
    }
    return map;
  }

  return {
    seedEstudiantes,
    getEstudiantes, addEstudiante, updateEstudiante, deleteEstudiante,
    getMalla, saveMalla, getTemasList, getTemasListByMateria, saveMallaArchivo, deleteMallaArchivo,
    getDiario, saveDiario, allDiarios,
    getNota, saveNota, getNotasGrado
  };
})();

window.DB = DB;
DB.seedEstudiantes();
console.log("✓ DB lista (backend + localStorage fallback)");

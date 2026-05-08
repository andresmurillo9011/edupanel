// ============================================================
// DB.JS — Persistencia con localStorage
// Misma API async para fácil migración futura a Firebase
// I.E.R. Santiago de la Selva · 2026
// ============================================================

const DB = (() => {

  function _get(key, def = null) {
    try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : def; }
    catch { return def; }
  }
  function _set(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

  // ============================================================
  // SEED — carga estudiantes reales la primera vez
  // ============================================================
  function seedEstudiantes() {
    if (localStorage.getItem("edupanel_seeded")) return;
    if (!window.ESTUDIANTES_INICIALES) return;
    Object.entries(window.ESTUDIANTES_INICIALES).forEach(([grado, lista]) => {
      const key = `ep_est_${grado}`;
      if (!_get(key)) _set(key, lista.map(e => ({ ...e, grado, activo: true })));
    });
    localStorage.setItem("edupanel_seeded", "1");
    console.log("✓ Estudiantes SIMAT cargados");
  }

  // ============================================================
  // ESTUDIANTES
  // ============================================================
  function getEstudiantes(grado) {
    return Promise.resolve(_get(`ep_est_${grado}`, []).sort((a,b) => a.numero - b.numero));
  }

  function _saveEst(grado, lista) { _set(`ep_est_${grado}`, lista); }

  function addEstudiante(grado, nombre, numero) {
    const lista = _get(`ep_est_${grado}`, []);
    const num   = numero || (lista.length + 1);
    const est   = { id: `est_${Date.now()}`, nombre: nombre.trim(), numero: num, grado, activo: true };
    lista.push(est);
    lista.sort((a,b) => a.numero - b.numero);
    _saveEst(grado, lista);
    return Promise.resolve(est);
  }

  function updateEstudiante(estId, changes) {
    // buscar en todos los grados
    const GRADOS = ["sexto","septimo","octavo","noveno","decimo","once"];
    for (const g of GRADOS) {
      const lista = _get(`ep_est_${g}`, []);
      const idx   = lista.findIndex(e => e.id === estId);
      if (idx !== -1) { lista[idx] = { ...lista[idx], ...changes }; _saveEst(g, lista); break; }
    }
    return Promise.resolve();
  }

  function deleteEstudiante(estId) {
    const GRADOS = ["sexto","septimo","octavo","noveno","decimo","once"];
    for (const g of GRADOS) {
      const lista = _get(`ep_est_${g}`, []);
      const nueva = lista.filter(e => e.id !== estId);
      if (nueva.length !== lista.length) { _saveEst(g, nueva); break; }
    }
    return Promise.resolve();
  }

  // ============================================================
  // MALLA CURRICULAR
  // ============================================================
  function getMalla(materia) {
    return Promise.resolve(_get(`ep_malla_${materia}`, { p1:"", p2:"", p3:"", p4:"", archivos:[] }));
  }

  async function saveMalla(materia, data) {
    const existing = await getMalla(materia);
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
    const malla    = await getMalla(materia);
    const archivos = malla.archivos || [];
    const idx      = archivos.findIndex(a => a.nombre === fileInfo.nombre);
    if (idx >= 0) archivos[idx] = fileInfo; else archivos.push(fileInfo);
    _set(`ep_malla_${materia}`, { ...malla, archivos, updatedAt: new Date().toISOString() });
    return Promise.resolve();
  }

  async function deleteMallaArchivo(materia, nombre) {
    const malla    = await getMalla(materia);
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

  function getDiario(dia, grado, hora, materia) {
    return Promise.resolve(_get(_did(dia,grado,hora,materia), {
      temaVisto:"", descripcion:"", observacionGeneral:"",
      guiaTerminada:null, guiaPendiente:"", avancePorcentaje:50,
      temasPasados:"", temasPendientes:"", planPeriodo:"",
      logros:"", archivos:[], proximoTemaIdx:0, userId:null
    }));
  }

  function saveDiario(dia, grado, hora, materia, data, userId) {
    _set(_did(dia,grado,hora,materia), {
      ...data, dia, grado, hora, materia, userId,
      updatedAt: new Date().toISOString()
    });
    return Promise.resolve();
  }

  function allDiarios() {
    const result = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("ep_diario_")) result.push(_get(k));
    }
    return Promise.resolve(result.filter(Boolean));
  }

  // ============================================================
  // NOTAS
  // ============================================================
  function _nid(dia, grado, hora, materia, estId) {
    return `ep_nota_${[dia,grado,hora,materia,estId].join("__").replace(/[ :\/]/g,"_")}`;
  }

  function getNota(dia, grado, hora, materia, estId) {
    return Promise.resolve(_get(_nid(dia,grado,hora,materia,estId), { nota:"", estado:"normal", observacion:"" }));
  }

  function saveNota(dia, grado, hora, materia, estId, data) {
    _set(_nid(dia,grado,hora,materia,estId), { ...data, dia, grado, hora, materia, estId, updatedAt: new Date().toISOString() });
    return Promise.resolve();
  }

  function getNotasGrado(dia, grado, hora, materia) {
    const prefix = `ep_nota_${[dia,grado,hora,materia].join("__").replace(/[ :\/]/g,"_")}__`;
    const map = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) {
        const data = _get(k);
        if (data && data.estId) map[data.estId] = data;
      }
    }
    return Promise.resolve(map);
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
console.log("✓ DB lista (localStorage)");

// ============================================================
// STORAGE.JS — Capa de persistencia
// Corrección v3: Malla curricular es por materia (sin grado)
//   Una sola malla de TECNOLOGÍA aplica a todos los grados
// ============================================================

const Storage = (() => {

  const SEED_KEY = "edupanel_seeded_v2";

  function _get(key, fallback = null) {
    try {
      const r = localStorage.getItem(key);
      return r ? JSON.parse(r) : fallback;
    } catch { return fallback; }
  }

  function _set(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  // ============================================================
  // SEED — carga estudiantes reales la primera vez
  // ============================================================
  function seedEstudiantes() {
    if (localStorage.getItem(SEED_KEY)) return;
    GRADOS.forEach(grado => {
      const yaGuardados = _get(`est::${grado}`, []);
      if (yaGuardados.length === 0 && ESTUDIANTES_INICIALES[grado]) {
        const lista = ESTUDIANTES_INICIALES[grado].map(e => ({ ...e, grado, activo: true }));
        _set(`est::${grado}`, lista);
      }
    });
    localStorage.setItem(SEED_KEY, "1");
    console.log("✓ EduPanel: Estudiantes cargados desde SIMAT 2026");
  }

  function init() { seedEstudiantes(); }

  // ============================================================
  // ESTUDIANTES
  // ============================================================

  function getEstudiantes(grado) {
    return _get(`est::${grado}`, []);
  }

  function saveEstudiantes(grado, lista) {
    _set(`est::${grado}`, lista);
  }

  function addEstudiante(grado, nombre, numero = null) {
    const lista = getEstudiantes(grado);
    const num   = numero || (lista.length + 1);
    const est   = {
      id:     `est_${Date.now()}`,
      nombre: nombre.trim(),
      numero: num,
      grado,
      activo: true
    };
    lista.push(est);
    lista.sort((a, b) => a.numero - b.numero);
    saveEstudiantes(grado, lista);
    return est;
  }

  function removeEstudiante(grado, estId) {
    saveEstudiantes(grado, getEstudiantes(grado).filter(e => e.id !== estId));
  }

  function updateEstudiante(grado, estId, changes) {
    saveEstudiantes(grado,
      getEstudiantes(grado).map(e => e.id === estId ? { ...e, ...changes } : e)
    );
  }

  // ============================================================
  // MALLA CURRICULAR — por materia únicamente (sin grado)
  // Una malla de TECNOLOGÍA aplica igual para 6° a 11°
  // ============================================================

  // BUG CORREGIDO: clave solo por materia, sin grado
  function getMalla(materia) {
    return _get(`malla::${materia}`, { p1: "", p2: "", p3: "", p4: "", archivos: [] });
  }

  function saveMalla(materia, periodos) {
    const existing = getMalla(materia);
    _set(`malla::${materia}`, {
      ...existing,
      ...periodos,
      updatedAt: new Date().toISOString()
    });
  }

  // ---- ARCHIVOS DE MALLA (PDF / Word) ----
  // Guarda metadatos del archivo (nombre, tipo, tamaño, base64 si es pequeño)
  function saveMallaArchivo(materia, fileInfo) {
    const malla    = getMalla(materia);
    const archivos = malla.archivos || [];
    // Evitar duplicados por nombre
    const idx = archivos.findIndex(a => a.nombre === fileInfo.nombre);
    if (idx >= 0) archivos[idx] = fileInfo;
    else archivos.push(fileInfo);
    _set(`malla::${materia}`, { ...malla, archivos, updatedAt: new Date().toISOString() });
  }

  function deleteMallaArchivo(materia, nombre) {
    const malla    = getMalla(materia);
    const archivos = (malla.archivos || []).filter(a => a.nombre !== nombre);
    _set(`malla::${materia}`, { ...malla, archivos });
  }

  // Lista plana de todos los temas de la materia (todos los períodos)
  function getTemasList(materia) {
    const m = getMalla(materia);
    return [m.p1, m.p2, m.p3, m.p4]
      .join("\n")
      .split("\n")
      .map(t => t.trim())
      .filter(Boolean);
  }

  // Retorna todas las mallas guardadas (para resumen)
  function getAllMallas() {
    const result = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("malla::")) {
        const materia = k.replace("malla::", "");
        result.push({ materia, ..._get(k) });
      }
    }
    return result;
  }

  // ============================================================
  // DIARIO DE CLASE
  // ============================================================

  function getDiario(dia, grado, hora, materia) {
    return _get(`diario::${dia}::${grado}::${hora}::${materia}`, {
      temaVisto:          "",
      descripcion:        "",
      observacionGeneral: "",
      guiaTerminada:      null,
      guiaPendiente:      "",
      avancePorcentaje:   50,
      temasPasados:       "",
      temasPendientes:    "",
      planPeriodo:        "",
      logros:             "",
      fileName:           "",
      proximoTemaIdx:     0,
      userId:             null
    });
  }

  function saveDiario(dia, grado, hora, materia, data, userId) {
    _set(`diario::${dia}::${grado}::${hora}::${materia}`, {
      ...data,
      userId,
      updatedAt: new Date().toISOString()
    });
  }

  function allDiarios() {
    const result = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("diario::")) result.push(_get(k));
    }
    return result.filter(Boolean);
  }

  // ============================================================
  // NOTAS POR ESTUDIANTE
  // ============================================================

  function getNota(dia, grado, hora, materia, estId) {
    return _get(`nota::${dia}::${grado}::${hora}::${materia}::${estId}`, {
      nota:        "",
      estado:      "normal",
      observacion: ""
    });
  }

  function saveNota(dia, grado, hora, materia, estId, data) {
    _set(`nota::${dia}::${grado}::${hora}::${materia}::${estId}`, {
      ...data,
      estId,
      updatedAt: new Date().toISOString()
    });
  }

  // ============================================================
  // BACKUP COMPLETO
  // ============================================================
  function exportAll() {
    const b = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k) b[k] = _get(k);
    }
    return b;
  }

  return {
    init,
    getEstudiantes, saveEstudiantes, addEstudiante, removeEstudiante, updateEstudiante,
    getMalla, saveMalla, getTemasList, getAllMallas,
    saveMallaArchivo, deleteMallaArchivo,
    getDiario, saveDiario, allDiarios,
    getNota, saveNota,
    exportAll
  };
})();

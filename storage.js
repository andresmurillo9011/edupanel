// ============================================================
// STORAGE.JS — Capa de persistencia
// Los estudiantes reales se cargan automáticamente la primera vez
// Preparado para migrar a Supabase
// ============================================================

const Storage = (() => {

  const SEED_KEY = "edupanel_seeded_v2";

  function _get(key, fallback = null) {
    try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; }
    catch { return fallback; }
  }
  function _set(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

  // ============================================================
  // SEED AUTOMÁTICO — Carga estudiantes reales la primera vez
  // ============================================================
  function seedEstudiantes() {
    if (localStorage.getItem(SEED_KEY)) return; // Ya sembrado
    GRADOS.forEach(grado => {
      const yaGuardados = _get(`est::${grado}`, []);
      if (yaGuardados.length === 0 && ESTUDIANTES_INICIALES[grado]) {
        // Agregar grado al objeto de cada estudiante
        const lista = ESTUDIANTES_INICIALES[grado].map(e => ({ ...e, grado, activo: true }));
        _set(`est::${grado}`, lista);
      }
    });
    localStorage.setItem(SEED_KEY, "1");
    console.log("✓ EduPanel: Estudiantes cargados desde SIMAT 2026");
  }

  // ============================================================
  // ESTUDIANTES
  // ============================================================

  function getEstudiantes(grado) {
    // TODO Supabase: const { data } = await supabase.from('estudiantes').select('*').eq('grado', grado).order('numero');
    return _get(`est::${grado}`, []);
  }

  function saveEstudiantes(grado, lista) {
    // TODO Supabase: await supabase.from('estudiantes').upsert(lista.map(e => ({...e, grado})));
    _set(`est::${grado}`, lista);
  }

  function addEstudiante(grado, nombre, numero = null) {
    const lista = getEstudiantes(grado);
    const num   = numero || (lista.length + 1);
    const est   = { id: `est_${Date.now()}`, nombre: nombre.trim(), numero: num, grado, activo: true };
    lista.push(est);
    lista.sort((a, b) => a.numero - b.numero);
    saveEstudiantes(grado, lista);
    return est;
  }

  function removeEstudiante(grado, estId) {
    saveEstudiantes(grado, getEstudiantes(grado).filter(e => e.id !== estId));
  }

  function updateEstudiante(grado, estId, changes) {
    saveEstudiantes(grado, getEstudiantes(grado).map(e => e.id === estId ? { ...e, ...changes } : e));
  }

  // ============================================================
  // MALLA CURRICULAR
  // ============================================================

  function getMalla(materia, grado) {
    // TODO Supabase: const { data } = await supabase.from('malla').select('*').eq('materia', materia).eq('grado', grado).single();
    return _get(`malla::${materia}::${grado}`, { p1: "", p2: "", p3: "", p4: "" });
  }

  function saveMalla(materia, grado, periodos) {
    // TODO Supabase: await supabase.from('malla').upsert({ materia, grado, ...periodos });
    _set(`malla::${materia}::${grado}`, { ...periodos, updatedAt: new Date().toISOString() });
  }

  function getTemasList(materia, grado) {
    const m = getMalla(materia, grado);
    return [m.p1, m.p2, m.p3, m.p4].join("\n").split("\n").map(t => t.trim()).filter(Boolean);
  }

  // ============================================================
  // DIARIO DE CLASE
  // ============================================================

  function getDiario(dia, grado, hora, materia) {
    return _get(`diario::${dia}::${grado}::${hora}::${materia}`, {
      temaVisto: "", descripcion: "", observacionGeneral: "",
      guiaTerminada: null, guiaPendiente: "", avancePorcentaje: 50,
      temasPasados: "", temasPendientes: "", planPeriodo: "",
      logros: "", fileName: "", proximoTemaIdx: 0, userId: null
    });
  }

  function saveDiario(dia, grado, hora, materia, data, userId) {
    _set(`diario::${dia}::${grado}::${hora}::${materia}`, {
      ...data, userId, updatedAt: new Date().toISOString()
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
    return _get(`nota::${dia}::${grado}::${hora}::${materia}::${estId}`,
      { nota: "", estado: "normal", observacion: "" });
  }

  function saveNota(dia, grado, hora, materia, estId, data) {
    // TODO Supabase: await supabase.from('notas').upsert({...data, estId, dia, grado, hora, materia});
    _set(`nota::${dia}::${grado}::${hora}::${materia}::${estId}`, {
      ...data, estId, updatedAt: new Date().toISOString()
    });
  }

  // ============================================================
  // BACKUP
  // ============================================================
  function exportAll() {
    const b = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k) b[k] = _get(k);
    }
    return b;
  }

  // Auto-seed al cargar
  // (Se llama desde DOMContentLoaded en app.js o inline)
  function init() { seedEstudiantes(); }

  return {
    init,
    getEstudiantes, saveEstudiantes, addEstudiante, removeEstudiante, updateEstudiante,
    getMalla, saveMalla, getTemasList,
    getDiario, saveDiario, allDiarios,
    getNota, saveNota,
    exportAll
  };
})();

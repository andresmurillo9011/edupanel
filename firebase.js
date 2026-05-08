// ============================================================
// FIREBASE-LOCAL.JS — Usa localStorage (offline, 100% local)
// ============================================================

function getLocalData(key, defaultValue = {}) {
  const data = localStorage.getItem(`edupanel_${key}`);
  return data ? JSON.parse(data) : defaultValue;
}

function setLocalData(key, value) {
  localStorage.setItem(`edupanel_${key}`, JSON.stringify(value));
}

window.DB = {
  async getDiario(dia, grado, hora, materia) {
    const diarios = getLocalData("diarios", {});
    const id = `${dia}_${grado}_${hora}_${materia}`;
    return diarios[id] || {};
  },

  async saveDiario(dia, grado, hora, materia, data, userId) {
    const diarios = getLocalData("diarios", {});
    const id = `${dia}_${grado}_${hora}_${materia}`;
    diarios[id] = { ...data, userId, updatedAt: new Date().toISOString() };
    setLocalData("diarios", diarios);
  },

  async allDiarios() {
    const diarios = getLocalData("diarios", {});
    return Object.values(diarios);
  },

  async getEstudiantes(grado) {
    const estudiantes = getLocalData("estudiantes", {});
    return estudiantes[grado] || [];
  },

  async addEstudiante(grado, nombre, numero) {
    const estudiantes = getLocalData("estudiantes", {});
    const lista = estudiantes[grado] || [];
    const newId = `est_${grado}_${Date.now()}`;
    const maxNum = lista.length > 0 ? Math.max(...lista.map(e => e.numero)) : 0;
    lista.push({
      id: newId,
      numero: numero || maxNum + 1,
      nombre: nombre,
      grado: grado
    });
    estudiantes[grado] = lista;
    setLocalData("estudiantes", estudiantes);
  },

  async updateEstudiante(id, data) {
    const estudiantes = getLocalData("estudiantes", {});
    for (const grado in estudiantes) {
      const idx = estudiantes[grado].findIndex(e => e.id === id);
      if (idx !== -1) {
        estudiantes[grado][idx] = { ...estudiantes[grado][idx], ...data };
        setLocalData("estudiantes", estudiantes);
        return;
      }
    }
  },

  async deleteEstudiante(id) {
    const estudiantes = getLocalData("estudiantes", {});
    for (const grado in estudiantes) {
      estudiantes[grado] = estudiantes[grado].filter(e => e.id !== id);
    }
    setLocalData("estudiantes", estudiantes);
  },

  async getNota(dia, grado, hora, materia, estId) {
    const notas = getLocalData("notas", {});
    const id = `${dia}_${grado}_${hora}_${materia}_${estId}`;
    return notas[id] || {};
  },

  async saveNota(dia, grado, hora, materia, estId, data) {
    const notas = getLocalData("notas", {});
    const id = `${dia}_${grado}_${hora}_${materia}_${estId}`;
    notas[id] = { ...data, updatedAt: new Date().toISOString() };
    setLocalData("notas", notas);
  },

  async getNotasGrado(dia, grado, hora, materia) {
    const notas = getLocalData("notas", {});
    const prefix = `${dia}_${grado}_${hora}_${materia}_`;
    const result = {};
    for (const id in notas) {
      if (id.startsWith(prefix)) {
        const estId = id.replace(prefix, "");
        result[estId] = notas[id];
      }
    }
    return result;
  },

  async getMalla(materia) {
    const mallas = getLocalData("mallas", {});
    return mallas[materia] || {};
  },

  async saveMalla(materia, data) {
    const mallas = getLocalData("mallas", {});
    mallas[materia] = { ...data, updatedAt: new Date().toISOString() };
    setLocalData("mallas", mallas);
  },

  getTemasList(malla) {
    if (!malla) return [];
    const temas = [];
    if (malla.p1) temas.push(malla.p1);
    if (malla.p2) temas.push(malla.p2);
    if (malla.p3) temas.push(malla.p3);
    if (malla.p4) temas.push(malla.p4);
    return temas;
  },

  async getTemasListByMateria(materia) {
    const malla = await this.getMalla(materia);
    return this.getTemasList(malla);
  }
};

window.FireAuth = Auth || window.FireAuth;

console.log("✅ Firebase Local cargado - usando localStorage");
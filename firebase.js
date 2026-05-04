// ============================================================
// firebase.js — Inicialización de Firebase + API global
// Se carga como módulo ES. Expone window.DB y window.FireAuth
// I.E.R. Santiago de la Selva · 2026
// ============================================================

import { initializeApp }   from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getFirestore, doc, getDoc, setDoc, deleteDoc,
  collection, query, where, getDocs, serverTimestamp, orderBy
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// ---- CONFIG ----
const firebaseConfig = {
  apiKey:            "AIzaSyCPS4dCJ5V9_kXZjYJ4TQUDdAWeMQLibbw",
  authDomain:        "edupanel-iess.firebaseapp.com",
  projectId:         "edupanel-iess",
  storageBucket:     "edupanel-iess.firebasestorage.app",
  messagingSenderId: "560177038366",
  appId:             "1:560177038366:web:ac273f9fa59808d4ff1a0f"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ============================================================
// FIREAUTH — manejo de sesión (sin Firebase Auth, manual)
// Los usuarios se guardan en Firestore colección "usuarios"
// La sesión se guarda en sessionStorage (por pestaña)
// ============================================================
const SESSION_KEY = "edupanel_session";

const FireAuth = {

  async login(username, password) {
    const q    = query(collection(db, "usuarios"), where("username","==", username));
    const snap = await getDocs(q);
    if (snap.empty) return { ok: false, message: "Usuario no encontrado" };
    const userDoc  = snap.docs[0];
    const userData = userDoc.data();
    if (userData.password !== password)
      return { ok: false, message: "Contraseña incorrecta. Comunícate con el administrador." };
    const user = { id: userDoc.id, ...userData };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id }));
    return { ok: true, user };
  },

  logout() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = "login.html";
  },

  // Retorna el usuario de la sesión actual (desde Firestore)
  async currentUser() {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const { userId } = JSON.parse(raw);
    const snap = await getDoc(doc(db, "usuarios", userId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  },

  // Carga usuario y redirige si no hay sesión
  async require(redirect = "login.html") {
    const u = await this.currentUser();
    if (!u) { window.location.href = redirect; return null; }
    return u;
  },

  async requireAdmin(redirect = "index.html") {
    const u = await this.require();
    if (u && u.role !== "admin") { window.location.href = redirect; return null; }
    return u;
  },

  canAccess(user, gradoKey, materiaKey) {
    if (!user) return false;
    if (user.role === "admin") return true;
    const asigs = user.asignaciones || [];
    return asigs.some(a => a.grado === gradoKey && a.area === materiaKey);
  },

  // CRUD usuarios
  async getAllUsers() {
    const snap = await getDocs(collection(db, "usuarios"));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  async createUser(data) {
    // Verificar username único
    const q    = query(collection(db, "usuarios"), where("username","==", data.username));
    const snap = await getDocs(q);
    if (!snap.empty) return { ok: false, message: "El usuario ya existe" };
    const userId  = "u_" + Date.now();
    const newUser = {
      username:     data.username,
      password:     data.password,
      name:         data.name,
      role:         data.role || "docente",
      email:        data.email || "",
      asignaciones: data.asignaciones || [],
      grados:       data.grados   || [],
      materias:     data.materias || [],
      createdAt:    new Date().toISOString()
    };
    await setDoc(doc(db, "usuarios", userId), newUser);
    return { ok: true, user: { id: userId, ...newUser } };
  },

  async updateUser(id, changes) {
    const ref  = doc(db, "usuarios", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return { ok: false, message: "Usuario no encontrado" };
    const updated = {
      ...snap.data(),
      ...changes,
      asignaciones: changes.asignaciones !== undefined
        ? changes.asignaciones
        : snap.data().asignaciones || []
    };
    await setDoc(ref, updated, { merge: true });
    return { ok: true, user: { id, ...updated } };
  },

  async deleteUser(id) {
    await deleteDoc(doc(db, "usuarios", id));
  }
};

// ============================================================
// DB — Toda la persistencia de datos académicos
// ============================================================
const DB = {

  // ---- SEED: crear admin inicial si no existe ----
  async seedAdmin() {
    const q    = query(collection(db, "usuarios"), where("role","==","admin"));
    const snap = await getDocs(q);
    if (!snap.empty) return; // Ya existe admin
    await setDoc(doc(db, "usuarios", "u_admin"), {
      username:     "admin",
      password:     "admin123",
      name:         "Administrador",
      role:         "admin",
      email:        "admin@ier-santiagoselva.edu.co",
      asignaciones: [],
      grados:       [],
      materias:     [],
      createdAt:    new Date().toISOString()
    });
    console.log("✓ Admin inicial creado en Firestore");
  },

  // ---- SEED: cargar estudiantes reales si no existen ----
  async seedEstudiantes() {
    // Verificar si ya hay estudiantes en Firestore
    const snap = await getDocs(query(collection(db, "estudiantes"), where("grado","==","sexto")));
    if (!snap.empty) return; // Ya sembrado

    console.log("⏳ Cargando estudiantes desde SIMAT 2026...");
    const promises = [];
    for (const grado of Object.keys(ESTUDIANTES_INICIALES)) {
      for (const est of ESTUDIANTES_INICIALES[grado]) {
        promises.push(
          setDoc(doc(db, "estudiantes", est.id), {
            ...est, grado, activo: true,
            createdAt: new Date().toISOString()
          })
        );
      }
    }
    await Promise.all(promises);
    console.log("✓ Estudiantes cargados en Firestore");
  },

  // ---- ESTUDIANTES ----
  async getEstudiantes(grado) {
    const q    = query(collection(db, "estudiantes"), where("grado","==", grado));
    const snap = await getDocs(q);
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .sort((a,b) => a.numero - b.numero);
  },

  async addEstudiante(grado, nombre, numero) {
    const existing = await this.getEstudiantes(grado);
    const num  = numero || (existing.length + 1);
    const id   = `est_${Date.now()}`;
    const est  = { id, nombre: nombre.trim(), numero: num, grado, activo: true, createdAt: new Date().toISOString() };
    await setDoc(doc(db, "estudiantes", id), est);
    return est;
  },

  async updateEstudiante(estId, changes) {
    await setDoc(doc(db, "estudiantes", estId), changes, { merge: true });
  },

  async deleteEstudiante(estId) {
    await deleteDoc(doc(db, "estudiantes", estId));
  },

  // ---- MALLA CURRICULAR ----
  async getMalla(materia) {
    const snap = await getDoc(doc(db, "mallas", materia));
    return snap.exists() ? snap.data() : { p1:"", p2:"", p3:"", p4:"", archivos:[] };
  },

  async saveMalla(materia, data) {
    const existing = await this.getMalla(materia);
    await setDoc(doc(db, "mallas", materia), {
      ...existing, ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  },

  getTemasList(mallaData) {
    const m = mallaData || { p1:"", p2:"", p3:"", p4:"" };
    return [m.p1, m.p2, m.p3, m.p4]
      .join("\n").split("\n")
      .map(t => t.trim()).filter(Boolean);
  },

  async getTemasListByMateria(materia) {
    const m = await this.getMalla(materia);
    return this.getTemasList(m);
  },

  async saveMallaArchivo(materia, fileInfo) {
    const malla    = await this.getMalla(materia);
    const archivos = malla.archivos || [];
    const idx      = archivos.findIndex(a => a.nombre === fileInfo.nombre);
    if (idx >= 0) archivos[idx] = fileInfo; else archivos.push(fileInfo);
    await setDoc(doc(db, "mallas", materia), { ...malla, archivos, updatedAt: new Date().toISOString() }, { merge: true });
  },

  async deleteMallaArchivo(materia, nombre) {
    const malla    = await this.getMalla(materia);
    const archivos = (malla.archivos || []).filter(a => a.nombre !== nombre);
    await setDoc(doc(db, "mallas", materia), { ...malla, archivos }, { merge: true });
  },

  // ---- DIARIO DE CLASE ----
  _diarioId(dia, grado, hora, materia) {
    return `${dia}__${grado}__${hora.replace(/[ :]/g,"_")}__${materia.replace(/ /g,"_")}`;
  },

  async getDiario(dia, grado, hora, materia) {
    const id   = this._diarioId(dia, grado, hora, materia);
    const snap = await getDoc(doc(db, "diarios", id));
    return snap.exists() ? snap.data() : {
      temaVisto:"", descripcion:"", observacionGeneral:"",
      guiaTerminada:null, guiaPendiente:"", avancePorcentaje:50,
      temasPasados:"", temasPendientes:"", planPeriodo:"",
      logros:"", archivos:[], proximoTemaIdx:0, userId:null
    };
  },

  async saveDiario(dia, grado, hora, materia, data, userId) {
    const id = this._diarioId(dia, grado, hora, materia);
    await setDoc(doc(db, "diarios", id), {
      ...data, dia, grado, hora, materia, userId,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  },

  async allDiarios() {
    const snap = await getDocs(collection(db, "diarios"));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  // ---- NOTAS ----
  _notaId(dia, grado, hora, materia, estId) {
    return `${dia}__${grado}__${hora.replace(/[ :]/g,"_")}__${materia.replace(/ /g,"_")}__${estId}`;
  },

  async getNota(dia, grado, hora, materia, estId) {
    const id   = this._notaId(dia, grado, hora, materia, estId);
    const snap = await getDoc(doc(db, "notas", id));
    return snap.exists() ? snap.data() : { nota:"", estado:"normal", observacion:"" };
  },

  async saveNota(dia, grado, hora, materia, estId, data) {
    const id = this._notaId(dia, grado, hora, materia, estId);
    await setDoc(doc(db, "notas", id), {
      ...data, dia, grado, hora, materia, estId,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  },

  async getNotasGrado(dia, grado, hora, materia) {
    const q    = query(collection(db,"notas"),
      where("dia","==",dia), where("grado","==",grado),
      where("hora","==",hora), where("materia","==",materia));
    const snap = await getDocs(q);
    const map  = {};
    snap.docs.forEach(d => { map[d.data().estId] = d.data(); });
    return map;
  }
};

// Exponer globalmente para que los scripts clásicos los usen
window.DB       = DB;
window.FireAuth = FireAuth;

// Inicializar seed al cargar
(async () => {
  try {
    await DB.seedAdmin();
    await DB.seedEstudiantes();
    console.log("✓ Firebase listo");
  } catch(e) {
    console.error("Error iniciando Firebase:", e);
  }
})();

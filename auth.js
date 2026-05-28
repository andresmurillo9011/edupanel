// ============================================================
// AUTH.JS — I.E.R. Santiago de la Selva
// Login unificado via backend EduClass (Neon/Render)
// ============================================================

const Auth = (() => {

  const API = "https://educlass-backend-4kk0.onrender.com";
  const SESSION_KEY = "ep_session";

  // ── Guardar/leer sesión ──────────────────────────────────
  function _saveSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    // Compatibilidad con EduClass
    localStorage.setItem("educlass_usuario", JSON.stringify(user));
  }

  function _clearSession() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("edutoken");
    localStorage.removeItem("educlass_usuario");
    sessionStorage.removeItem("ep_user");
  }

  function _buildUser(u, token) {
    const rolRaw = (u.cargo || u.role || "").toLowerCase();
    const esAdmin = rolRaw === "admin" || rolRaw === "superadmin" || u.isSuperAdmin;
    return {
      id:           u.id,
      username:     u.email,
      name:         u.name || u.nombre || "Docente",
      role:         esAdmin ? "admin" : "docente",
      email:        u.email || "",
      cargo:        u.cargo || "",
      institutionId: u.institutionId || u.institution?.id || "",
      asignaciones: u.asignaciones || [],
      grados:       u.grados || [],
      materias:     u.materias || [],
      token:        token,
      _desdeBackend: true
    };
  }

  // ── LOGIN ────────────────────────────────────────────────
  async function login(email, password) {
    try {
      const r = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const d = await r.json();
      if (!r.ok || !d.token) {
        return { ok: false, message: d.mensaje || "Correo o contraseña incorrectos" };
      }
      localStorage.setItem("edutoken", d.token);
      const user = _buildUser(d.usuario || d.user || {}, d.token);
      _saveSession(user);
      return { ok: true, user };
    } catch(e) {
      return { ok: false, message: "Error de conexión con el servidor" };
    }
  }

  function logout() {
    _clearSession();
    window.location.href = "login.html";
  }

  function currentUser() {
    // 1. Sesión guardada localmente
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const u = JSON.parse(raw);
        if (u && u.id && u.token) return u;
      }
    } catch(_) {}

    // 2. Compatibilidad: sesión de EduClass
    try {
      const tok = localStorage.getItem("edutoken");
      const raw = localStorage.getItem("educlass_usuario");
      if (tok && raw) {
        const u = JSON.parse(raw);
        if (u && u.id) return _buildUser(u, tok);
      }
    } catch(_) {}

    // 3. Compatibilidad: sesión local antigua (sessionStorage)
    try {
      const raw = sessionStorage.getItem("ep_user");
      if (raw) {
        const u = JSON.parse(raw);
        if (u && u.id) return u;
      }
    } catch(_) {}

    return null;
  }

  function require(redirect = "login.html") {
    const u = currentUser();
    if (!u) { window.location.href = redirect; return null; }
    return u;
  }

  function requireAdmin() {
    const u = require();
    if (!u) return null;
    if (u.role === "admin") return u;
    window.location.href = "horario.html";
    return null;
  }

  function canAccess(user, grado, materia) {
    if (!user) return false;
    if (user.role === "admin") return true;
    return (user.asignaciones || []).some(a => a.grado === grado && a.area === materia);
  }

  // ── CRUD compatibilidad (localStorage fallback) ──────────
  function getAllUsers() {
    try {
      return JSON.parse(localStorage.getItem("edupanel_users") || "[]");
    } catch { return []; }
  }

  function createUser(data) {
    const users = getAllUsers();
    if (users.find(u => u.username === data.username)) return { ok: false, message: "El usuario ya existe" };
    const u = { id: "u_" + Date.now(), ...data, createdAt: new Date().toISOString() };
    users.push(u);
    localStorage.setItem("edupanel_users", JSON.stringify(users));
    return { ok: true, user: u };
  }

  function updateUser(id, changes) {
    const users = getAllUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return { ok: false };
    users[idx] = { ...users[idx], ...changes };
    localStorage.setItem("edupanel_users", JSON.stringify(users));
    return { ok: true, user: users[idx] };
  }

  function deleteUser(id) {
    const users = getAllUsers().filter(u => u.id !== id);
    localStorage.setItem("edupanel_users", JSON.stringify(users));
  }

  return { login, logout, currentUser, require, requireAdmin, canAccess,
           getAllUsers, createUser, updateUser, deleteUser };
})();

window.FireAuth = Auth;

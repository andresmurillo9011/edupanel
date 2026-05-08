// ============================================================
// AUTH.JS — I.E.R. Santiago de la Selva
// Autenticación con localStorage · sesión en sessionStorage
// ============================================================

const Auth = (() => {

  const USERS_KEY = "edupanel_users";

  const DEFAULT_USERS = [
    {
      id: "u_admin",
      username: "admin",
      password: "admin123",
      name: "Administrador",
      role: "admin",
      email: "admin@iess.edu.co",
      asignaciones: [],
      grados: [],
      materias: [],
      createdAt: new Date().toISOString()
    }
  ];

  function _init() {
    if (!localStorage.getItem(USERS_KEY)) {
      localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
    }
  }

  function _getUsers() {
    _init();
    return JSON.parse(localStorage.getItem(USERS_KEY));
  }

  function _saveUsers(u) {
    localStorage.setItem(USERS_KEY, JSON.stringify(u));
  }

  // ---- LOGIN / LOGOUT / SESIÓN ----
  function login(username, password) {
    const user = _getUsers().find(u => u.username === username && u.password === password);
    if (!user) return { ok: false, message: "Usuario o contraseña incorrectos. Contacta al administrador." };
    sessionStorage.setItem("ep_user", JSON.stringify(user));
    return { ok: true, user };
  }

  function logout() {
    sessionStorage.removeItem("ep_user");
    window.location.href = "login.html";
  }

  function currentUser() {
    const raw = sessionStorage.getItem("ep_user");
    if (!raw) return null;
    const u = JSON.parse(raw);
    // Refrescar desde localStorage para tener asignaciones actualizadas
    const fresh = _getUsers().find(x => x.id === u.id);
    if (fresh) {
      sessionStorage.setItem("ep_user", JSON.stringify(fresh));
      return fresh;
    }
    return u;
  }

  function require(redirect = "login.html") {
    const u = currentUser();
    if (!u) { window.location.href = redirect; return null; }
    return u;
  }

  function requireAdmin() {
    const u = require();
    if (u && u.role !== "admin") { window.location.href = "index.html"; return null; }
    return u;
  }

  function canAccess(user, grado, materia) {
    if (!user) return false;
    if (user.role === "admin") return true;
    return (user.asignaciones || []).some(a => a.grado === grado && a.area === materia);
  }

  // ---- CRUD USUARIOS ----
  function getAllUsers() { return _getUsers(); }

  function createUser(data) {
    const users = _getUsers();
    if (users.find(u => u.username === data.username)) return { ok: false, message: "El usuario ya existe" };
    const u = {
      id:           "u_" + Date.now(),
      username:     data.username,
      password:     data.password,
      name:         data.name,
      role:         data.role || "docente",
      email:        data.email || "",
      asignaciones: data.asignaciones || [],
      grados:       data.grados || [],
      materias:     data.materias || [],
      createdAt:    new Date().toISOString()
    };
    users.push(u);
    _saveUsers(users);
    return { ok: true, user: u };
  }

  function updateUser(id, changes) {
    const users = _getUsers();
    const idx   = users.findIndex(u => u.id === id);
    if (idx === -1) return { ok: false };
    users[idx] = {
      ...users[idx], ...changes,
      asignaciones: changes.asignaciones !== undefined
        ? changes.asignaciones
        : users[idx].asignaciones || []
    };
    _saveUsers(users);
    return { ok: true, user: users[idx] };
  }

  function deleteUser(id) {
    _saveUsers(_getUsers().filter(u => u.id !== id));
  }

  return { login, logout, currentUser, require, requireAdmin, canAccess,
           getAllUsers, createUser, updateUser, deleteUser };
})();

// Exponer como FireAuth también para compatibilidad
window.FireAuth = Auth;

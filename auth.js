// ============================================================
// AUTH.JS — I.E.R. Santiago de la Selva
// Sistema de autenticación con roles
// Recuperación de contraseña: contactar al administrador
// ============================================================

const Auth = (() => {

  const SESSION_KEY = "edupanel_session";
  const USERS_KEY   = "edupanel_users";

  // ---- USUARIOS INICIALES (se crean solo la primera vez) ----
  // ⚠ CONFIDENCIAL — Solo el administrador conoce estas credenciales
  // Para recuperar contraseña: contactar a admin / admin123
  const DEFAULT_USERS = [
    {
      id: "u_admin",
      username: "admin",
      password: "admin123",
      name: "Administrador",
      role: "admin",
      email: "admin@ier-santiagoselva.edu.co",
      grados: [],
      materias: [],
      createdAt: new Date().toISOString()
    }
    // Los demás docentes se crean desde el Panel Admin
    // Admin → Docentes → "+ Nuevo docente"
  ];

  function _init() {
    if (!localStorage.getItem(USERS_KEY)) {
      localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
    }
  }

  function _getUsers() { _init(); return JSON.parse(localStorage.getItem(USERS_KEY)); }
  function _saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }

  // ---- LOGIN ----
  function login(username, password) {
    _init();
    const users = _getUsers();
    const user  = users.find(u => u.username === username && u.password === password);
    if (!user) return { ok: false, message: "Usuario o contraseña incorrectos. Si olvidaste tu contraseña, comunícate con el administrador." };
    localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id, loginAt: new Date().toISOString() }));
    return { ok: true, user };
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = "login.html";
  }

  function currentUser() {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const { userId } = JSON.parse(raw);
    return _getUsers().find(u => u.id === userId) || null;
  }

  function require(redirect = "login.html") {
    const u = currentUser();
    if (!u) window.location.href = redirect;
    return u;
  }

  function requireAdmin() {
    const u = require();
    if (u && u.role !== "admin") window.location.href = "index.html";
    return u;
  }

  // Puede ver esta celda (grado + materia)?
  function canAccess(gradoKey, materiaKey) {
    const u = currentUser();
    if (!u) return false;
    if (u.role === "admin") return true;

    // Nueva estructura: asignaciones = [{grado, area}]
    if (u.asignaciones && u.asignaciones.length > 0) {
      return u.asignaciones.some(a => a.grado === gradoKey && a.area === materiaKey);
    }

    // Compatibilidad con estructura antigua (grados[] + materias[])
    const gradoOk   = (u.grados   || []).includes(gradoKey);
    const materiaOk = (u.materias || []).length === 0 || (u.materias || []).includes(materiaKey);
    return gradoOk && materiaOk;
  }

  // ---- CRUD USUARIOS (solo admin) ----
  function getAllUsers()    { return _getUsers(); }

  function createUser(data) {
    const users = _getUsers();
    if (users.find(u => u.username === data.username))
      return { ok: false, message: "El usuario ya existe" };
    const newUser = {
      id:       "u_" + Date.now(),
      username: data.username,
      password: data.password,
      name:     data.name,
      role:     data.role || "docente",
      email:    data.email || "",
      grados:   data.grados || [],
      materias: data.materias || [],
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    _saveUsers(users);
    return { ok: true, user: newUser };
  }

  function updateUser(id, changes) {
    const users = _getUsers();
    const idx   = users.findIndex(u => u.id === id);
    if (idx === -1) return { ok: false, message: "Usuario no encontrado" };
    users[idx] = { ...users[idx], ...changes };
    _saveUsers(users);
    return { ok: true, user: users[idx] };
  }

  function deleteUser(id) {
    _saveUsers(_getUsers().filter(u => u.id !== id));
  }

  return { login, logout, currentUser, require, requireAdmin, canAccess,
           getAllUsers, createUser, updateUser, deleteUser };
})();

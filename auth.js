// ============================================================
// AUTH.JS — I.E.R. Santiago de la Selva
// Correcciones v3:
//  - createUser guarda asignaciones correctamente
//  - updateUser preserva todos los campos anteriores
//  - canAccess lee asignaciones [{grado, area}]
// ============================================================

const Auth = (() => {

  const SESSION_KEY = "edupanel_session";
  const USERS_KEY   = "edupanel_users";

  const DEFAULT_USERS = [
    {
      id:          "u_admin",
      username:    "admin",
      password:    "admin123",
      name:        "Administrador",
      role:        "admin",
      email:       "admin@ier-santiagoselva.edu.co",
      asignaciones: [],
      grados:      [],
      materias:    [],
      createdAt:   new Date().toISOString()
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

  function _saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  // ---- LOGIN ----
  function login(username, password) {
    _init();
    const users = _getUsers();
    const user  = users.find(u => u.username === username && u.password === password);
    if (!user) return {
      ok: false,
      message: "Usuario o contraseña incorrectos. Si olvidaste tu contraseña, comunícate con el administrador."
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      userId:  user.id,
      loginAt: new Date().toISOString()
    }));
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

  // ---- ACCESO A CELDA ----
  // Verifica si el docente tiene asignada la combinación grado+área
  function canAccess(gradoKey, materiaKey) {
    const u = currentUser();
    if (!u) return false;
    if (u.role === "admin") return true;

    const asigs = u.asignaciones || [];

    // Si tiene asignaciones en nueva estructura [{grado, area}]
    if (asigs.length > 0) {
      return asigs.some(a => a.grado === gradoKey && a.area === materiaKey);
    }

    // Si no tiene asignaciones aún → sin acceso (docente sin configurar)
    return false;
  }

  // ---- CRUD USUARIOS ----
  function getAllUsers() { return _getUsers(); }

  // BUG CORREGIDO: createUser ahora guarda asignaciones
  function createUser(data) {
    const users = _getUsers();
    if (users.find(u => u.username === data.username)) {
      return { ok: false, message: "El usuario ya existe" };
    }
    const newUser = {
      id:           "u_" + Date.now(),
      username:     data.username,
      password:     data.password,
      name:         data.name,
      role:         data.role || "docente",
      email:        data.email || "",
      asignaciones: data.asignaciones || [],          // ← CLAVE
      grados:       data.grados   || [],
      materias:     data.materias || [],
      createdAt:    new Date().toISOString()
    };
    users.push(newUser);
    _saveUsers(users);
    return { ok: true, user: newUser };
  }

  // BUG CORREGIDO: updateUser preserva asignaciones y todos los campos
  function updateUser(id, changes) {
    const users = _getUsers();
    const idx   = users.findIndex(u => u.id === id);
    if (idx === -1) return { ok: false, message: "Usuario no encontrado" };

    // Spread correcto: primero el usuario existente, luego los cambios
    // Así si 'changes' no trae 'asignaciones', se conserva la existente
    const updated = {
      ...users[idx],          // preservar TODO lo que ya tenía
      ...changes,             // sobreescribir solo lo que viene en changes
      // Garantizar que asignaciones nunca se pierda:
      asignaciones: changes.asignaciones !== undefined
        ? changes.asignaciones
        : users[idx].asignaciones || []
    };

    users[idx] = updated;
    _saveUsers(users);
    return { ok: true, user: updated };
  }

  function deleteUser(id) {
    _saveUsers(_getUsers().filter(u => u.id !== id));
  }

  return {
    login, logout, currentUser, require, requireAdmin, canAccess,
    getAllUsers, createUser, updateUser, deleteUser
  };
})();

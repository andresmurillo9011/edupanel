// ============================================================
// ADMIN.JS — Panel de administración v3
// Correcciones:
//  1. CSV: grado se toma del modal, no del panel externo
//  2. Malla: botón "Cargar" explícito, muestra qué está cargado
//  3. Docentes: asignación por combinación grado+área individual
// ============================================================

// Estado global
let editingUserId   = null;
let asignacionesTemp = []; // [{grado, area}] mientras se edita un docente
let mallaActual      = { materia: null, grado: null }; // qué está cargado en el editor

// ============================================================
// INIT
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const admin = Auth.requireAdmin();
  Storage.init();
  document.getElementById("admin-name").textContent = admin.name;

  // Poblar select de áreas del modal de asignación
  poblarAreasSel();

  // Poblar select de materias de la malla
  const mallaMateria = document.getElementById("malla-materia");
  Object.keys(MATERIAS_CONFIG)
    .filter(m => !["DESCANSO","ALMUERZO"].includes(m))
    .sort()
    .forEach(m => {
      const opt = document.createElement("option");
      opt.value = m; opt.textContent = `${MATERIAS_CONFIG[m].icon} ${m}`;
      mallaMateria.appendChild(opt);
    });

  showSection("docentes");
});

// ============================================================
// NAVEGACIÓN
// ============================================================
function showSection(name, btn) {
  document.querySelectorAll(".admin-section").forEach(s => s.style.display = "none");
  document.querySelectorAll(".anav-btn").forEach(b => b.classList.remove("active"));
  document.getElementById(`sec-${name}`).style.display = "block";
  if (btn) btn.classList.add("active");
  else document.querySelector(`[data-sec="${name}"]`)?.classList.add("active");

  if (name === "docentes")    renderDocentesGrid();
  if (name === "estudiantes") { renderGradosResumen(); renderEstudiantesList(); }
  if (name === "resumen")     renderResumen();
}

// ============================================================
// DOCENTES — Asignación por grado+área
// ============================================================

function poblarAreasSel() {
  const sel = document.getElementById("asig-area-sel");
  if (!sel) return;
  sel.innerHTML = "";
  Object.keys(MATERIAS_CONFIG)
    .filter(m => !["DESCANSO","ALMUERZO"].includes(m))
    .sort()
    .forEach(m => {
      const opt = document.createElement("option");
      opt.value = m; opt.textContent = `${MATERIAS_CONFIG[m].icon} ${m}`;
      sel.appendChild(opt);
    });
}

function agregarAsignacion() {
  const grado = document.getElementById("asig-grado-sel").value;
  const area  = document.getElementById("asig-area-sel").value;
  if (!grado || !area) return;

  // Evitar duplicados
  const existe = asignacionesTemp.find(a => a.grado === grado && a.area === area);
  if (existe) { showToast("Esa combinación ya fue agregada"); return; }

  asignacionesTemp.push({ grado, area });
  renderAsignacionesLista();
}

function quitarAsignacion(grado, area) {
  asignacionesTemp = asignacionesTemp.filter(a => !(a.grado === grado && a.area === area));
  renderAsignacionesLista();
}

function renderAsignacionesLista() {
  const cont  = document.getElementById("asig-lista");
  const empty = document.getElementById("asig-empty");

  if (!asignacionesTemp.length) {
    empty.style.display = "block";
    cont.querySelectorAll(".asig-tag").forEach(t => t.remove());
    return;
  }
  empty.style.display = "none";

  // Limpiar tags anteriores
  cont.querySelectorAll(".asig-tag").forEach(t => t.remove());

  // Agrupar por grado para mostrar mejor
  const porGrado = {};
  asignacionesTemp.forEach(a => {
    if (!porGrado[a.grado]) porGrado[a.grado] = [];
    porGrado[a.grado].push(a.area);
  });

  Object.entries(porGrado).forEach(([grado, areas]) => {
    const row = document.createElement("div");
    row.className = "asig-tag";
    row.innerHTML = `
      <span class="asig-grado-label">${GRADOS_LABEL[grado]}</span>
      <div class="asig-areas">
        ${areas.map(area => `
          <span class="asig-area-chip" style="--ac:${MATERIAS_CONFIG[area]?.color||'#888'}">
            ${MATERIAS_CONFIG[area]?.icon||''} ${area}
            <button class="asig-remove" onclick="quitarAsignacion('${grado}','${area}')" title="Quitar">×</button>
          </span>
        `).join("")}
      </div>
    `;
    cont.appendChild(row);
  });
}

function renderDocentesGrid() {
  const users = Auth.getAllUsers();
  const grid  = document.getElementById("docentes-grid");

  grid.innerHTML = users.map(u => {
    const asignaciones = u.asignaciones || [];

    // Agrupar asignaciones por grado para mostrar en la tarjeta
    const porGrado = {};
    asignaciones.forEach(a => {
      if (!porGrado[a.grado]) porGrado[a.grado] = [];
      porGrado[a.grado].push(a.area);
    });

    return `
      <div class="doc-card ${u.role === 'admin' ? 'admin-card' : ''}">
        <div class="doc-card-top">
          <div class="doc-avatar">${u.name.split(" ").map(n=>n[0]).join("").substring(0,2).toUpperCase()}</div>
          <div class="doc-meta">
            <strong class="doc-name">${u.name}</strong>
            <span class="doc-user">@${u.username}</span>
            <span class="doc-role-badge ${u.role}">${u.role==='admin'?'👑 Admin':'👤 Docente'}</span>
          </div>
        </div>
        ${u.role !== 'admin' ? `
          <div class="doc-asignaciones">
            ${Object.keys(porGrado).length ? Object.entries(porGrado).map(([grado, areas]) => `
              <div class="doc-grado-row">
                <span class="doc-grado-pill">${GRADOS_LABEL[grado]}</span>
                <div class="doc-areas-wrap">
                  ${areas.map(a => `
                    <span class="tag mat" style="--mc:${MATERIAS_CONFIG[a]?.color||'#888'}">
                      ${MATERIAS_CONFIG[a]?.icon||''} ${a}
                    </span>
                  `).join("")}
                </div>
              </div>
            `).join("") : '<span class="tag empty">Sin asignaciones</span>'}
          </div>
          <div class="doc-actions">
            <button class="icon-btn edit" onclick="editDocente('${u.id}')">✏️ Editar</button>
            <button class="icon-btn del"  onclick="deleteDocente('${u.id}')">🗑 Eliminar</button>
          </div>
        ` : `<div class="doc-admin-note">Acceso completo a todo el sistema</div>`}
      </div>
    `;
  }).join("");
}

function openModal(id) { document.getElementById(id).style.display = "flex"; }

function closeModal(id) {
  document.getElementById(id).style.display = "none";
  if (id === "modal-docente") {
    editingUserId = null;
    asignacionesTemp = [];
    document.getElementById("modal-docente-title").textContent = "Nuevo docente";
    ["doc-name","doc-username","doc-pass","doc-email","edit-user-id"].forEach(i => {
      const el = document.getElementById(i); if (el) el.value = "";
    });
    document.getElementById("modal-doc-error").style.display = "none";
    renderAsignacionesLista();
  }
  if (id === "modal-import") {
    document.getElementById("csv-paste").value = "";
    document.getElementById("csv-preview").style.display = "none";
    const fileInput = document.getElementById("csv-upload");
    if (fileInput) fileInput.value = "";
  }
}

function editDocente(id) {
  const user = Auth.getAllUsers().find(u => u.id === id);
  if (!user) return;
  editingUserId = id;
  asignacionesTemp = [...(user.asignaciones || [])];

  document.getElementById("modal-docente-title").textContent = "Editar docente";
  document.getElementById("edit-user-id").value  = id;
  document.getElementById("doc-name").value      = user.name;
  document.getElementById("doc-username").value  = user.username;
  document.getElementById("doc-pass").value      = user.password;
  document.getElementById("doc-email").value     = user.email || "";
  renderAsignacionesLista();
  openModal("modal-docente");
}

function saveDocente() {
  const name     = document.getElementById("doc-name").value.trim();
  const username = document.getElementById("doc-username").value.trim();
  const pass     = document.getElementById("doc-pass").value.trim();
  const email    = document.getElementById("doc-email").value.trim();
  const errEl    = document.getElementById("modal-doc-error");

  if (!name || !username || !pass) {
    errEl.textContent = "Nombre, usuario y contraseña son obligatorios";
    errEl.style.display = "block"; return;
  }
  errEl.style.display = "none";

  // Derivar grados[] y materias[] de las asignaciones (para compatibilidad con canAccess)
  const grados   = [...new Set(asignacionesTemp.map(a => a.grado))];
  const materias = [...new Set(asignacionesTemp.map(a => a.area))];

  const payload = { name, username, password: pass, email,
                    asignaciones: asignacionesTemp, grados, materias };

  if (editingUserId) {
    Auth.updateUser(editingUserId, payload);
    showToast("✓ Docente actualizado");
  } else {
    const r = Auth.createUser({ ...payload, role: "docente" });
    if (!r.ok) { errEl.textContent = r.message; errEl.style.display = "block"; return; }
    showToast("✓ Docente creado");
  }
  closeModal("modal-docente");
  renderDocentesGrid();
}

function deleteDocente(id) {
  if (!confirm("¿Eliminar este docente?")) return;
  Auth.deleteUser(id);
  renderDocentesGrid();
  showToast("Docente eliminado");
}

// ============================================================
// ESTUDIANTES
// ============================================================

function renderGradosResumen() {
  const cont = document.getElementById("grados-resumen");
  cont.innerHTML = GRADOS.map(g => {
    const lista = Storage.getEstudiantes(g);
    return `
      <div class="grado-resumen-chip ${lista.length ? '' : 'empty-chip'}"
           onclick="seleccionarGrado('${g}')">
        <span class="gr-label">${GRADOS_LABEL[g]}</span>
        <span class="gr-count">${lista.length}</span>
      </div>
    `;
  }).join("");
}

function seleccionarGrado(grado) {
  document.getElementById("grado-select-est").value = grado;
  renderEstudiantesList();
  // Scroll al panel
  document.getElementById("estudiantes-list").scrollIntoView({ behavior: "smooth" });
}

function renderEstudiantesList() {
  const grado = document.getElementById("grado-select-est").value;
  const lista = Storage.getEstudiantes(grado);
  const cont  = document.getElementById("estudiantes-list");

  // Resaltar chip activo
  document.querySelectorAll(".grado-resumen-chip").forEach(c => c.classList.remove("active-chip"));
  const chips = document.querySelectorAll(".grado-resumen-chip");
  const idx   = GRADOS.indexOf(grado);
  if (chips[idx]) chips[idx].classList.add("active-chip");

  if (!lista.length) {
    cont.innerHTML = `<div class="empty-state">Sin estudiantes en ${GRADOS_LABEL[grado]}<br>
      <small>Agrega manualmente o usa "Importar CSV"</small></div>`;
    return;
  }

  cont.innerHTML = `
    <div class="est-list-header">
      <span class="est-list-title">${GRADOS_LABEL[grado]} — ${lista.length} estudiantes</span>
      <button class="icon-btn-act exp" onclick="exportarEstudiantes('${grado}')">⬇ Exportar CSV</button>
    </div>
    <table class="est-table">
      <thead><tr><th>#</th><th>Nombre completo</th><th></th></tr></thead>
      <tbody>
        ${lista.map(e => `
          <tr id="fila-${e.id}">
            <td class="est-num">${e.numero}</td>
            <td class="est-name-cell">
              <span id="est-display-${e.id}">${e.nombre}</span>
              <input class="est-edit-input" id="est-edit-${e.id}" value="${e.nombre}" style="display:none"
                onkeydown="if(event.key==='Enter')confirmEditEst('${grado}','${e.id}');if(event.key==='Escape')cancelEditEst('${e.id}')">
            </td>
            <td class="est-acts">
              <button class="icon-btn-sm edit" onclick="toggleEditEst('${grado}','${e.id}')">✏️</button>
              <button class="icon-btn-sm del"  onclick="delEst('${grado}','${e.id}')">🗑</button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function toggleEditEst(grado, estId) {
  const display = document.getElementById(`est-display-${estId}`);
  const input   = document.getElementById(`est-edit-${estId}`);
  if (input.style.display === "none") {
    display.style.display = "none";
    input.style.display = "inline-block";
    input.focus(); input.select();
  } else {
    confirmEditEst(grado, estId);
  }
}

function cancelEditEst(estId) {
  document.getElementById(`est-display-${estId}`).style.display = "";
  document.getElementById(`est-edit-${estId}`).style.display = "none";
}

function confirmEditEst(grado, estId) {
  const input   = document.getElementById(`est-edit-${estId}`);
  const newName = input.value.trim();
  if (newName) {
    Storage.updateEstudiante(grado, estId, { nombre: newName });
    showToast("✓ Nombre actualizado");
  }
  renderEstudiantesList();
}

function delEst(grado, estId) {
  if (!confirm("¿Eliminar este estudiante?")) return;
  Storage.removeEstudiante(grado, estId);
  renderEstudiantesList();
  renderGradosResumen();
}

function abrirModalEstudiante() {
  // Sincronizar grado seleccionado
  const gradoActual = document.getElementById("grado-select-est").value;
  document.getElementById("modal-est-grado").value = gradoActual;
  openModal("modal-estudiante");
}

function abrirModalImport() {
  // Sincronizar grado seleccionado
  const gradoActual = document.getElementById("grado-select-est").value;
  document.getElementById("import-grado-sel").value = gradoActual;
  openModal("modal-import");
}

function saveEstudiante() {
  const grado  = document.getElementById("modal-est-grado").value;
  const nombre = document.getElementById("est-name").value.trim();
  const num    = document.getElementById("est-num").value;
  if (!nombre) { showToast("⚠ Ingresa el nombre"); return; }
  Storage.addEstudiante(grado, nombre, num ? parseInt(num) : null);
  closeModal("modal-estudiante");
  document.getElementById("est-name").value = "";
  document.getElementById("est-num").value  = "";
  // Actualizar vista si coincide con el grado del panel
  document.getElementById("grado-select-est").value = grado;
  renderEstudiantesList();
  renderGradosResumen();
  showToast(`✓ Estudiante agregado a ${GRADOS_LABEL[grado]}`);
}

// ---- CSV IMPORT (BUG 1 CORREGIDO) ----
function previewCSV(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById("csv-paste").value = e.target.result;
    livePreviewCSV(e.target.result);
  };
  reader.readAsText(file, "UTF-8");
}

function livePreviewCSV(text) {
  const nombres = parseCSVNombres(text);
  const preview = document.getElementById("csv-preview");
  if (!nombres.length) { preview.style.display = "none"; return; }
  preview.style.display = "block";
  preview.innerHTML = `<strong>${nombres.length} nombres detectados:</strong><br>
    ${nombres.slice(0,6).map(n => `<span class="csv-name-pill">${n}</span>`).join("")}
    ${nombres.length > 6 ? `<span class="csv-more">+${nombres.length-6} más</span>` : ""}`;
}

function parseCSVNombres(text) {
  return text
    .split(/\r?\n/)
    .map(line => {
      if (!line.trim()) return null;
      // Soporta CSV con comas: tomar el campo más largo que no sea número
      const parts = line.split(/[,;|\t]/);
      const candidatos = parts
        .map(p => p.replace(/"/g, "").trim())
        .filter(p => p.length > 1 && isNaN(p));
      // Preferir el campo más largo (probablemente el nombre completo)
      return candidatos.sort((a,b) => b.length - a.length)[0] || null;
    })
    .filter(Boolean)
    .filter(n => n.length > 2); // descartar encabezados tipo "ID", "No"
}

function importarEstudiantes() {
  // BUG CORREGIDO: grado viene del select DENTRO del modal
  const grado   = document.getElementById("import-grado-sel").value;
  const text    = document.getElementById("csv-paste").value.trim();
  const nombres = parseCSVNombres(text);

  if (!grado)  { showToast("⚠ Selecciona el grado destino"); return; }
  if (!nombres.length) { showToast("⚠ No se encontraron nombres válidos"); return; }

  const existing = Storage.getEstudiantes(grado);
  let count = 0;
  nombres.forEach((nombre, i) => {
    const yaExiste = existing.find(e => e.nombre.toLowerCase() === nombre.toLowerCase());
    if (!yaExiste) {
      Storage.addEstudiante(grado, nombre, existing.length + count + 1);
      count++;
    }
  });

  closeModal("modal-import");

  // Actualizar la vista al grado importado
  document.getElementById("grado-select-est").value = grado;
  renderEstudiantesList();
  renderGradosResumen();

  if (count > 0) showToast(`✓ ${count} estudiantes importados en ${GRADOS_LABEL[grado]}`);
  else showToast("ℹ Todos los nombres ya existían en ese grado");
}

function exportarEstudiantes(grado) {
  const lista = Storage.getEstudiantes(grado);
  const csv   = "numero,nombre\n" + lista.map(e => `${e.numero},"${e.nombre}"`).join("\n");
  const a     = document.createElement("a");
  a.href      = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download  = `estudiantes_${grado}_2026.csv`;
  a.click();
  showToast("✓ CSV exportado");
}

// ============================================================
// MALLA CURRICULAR (BUG 2 CORREGIDO)
// ============================================================

function loadMallaData() {
  const materia = document.getElementById("malla-materia").value;
  const grado   = document.getElementById("malla-grado").value;

  if (!materia) {
    showToast("⚠ Selecciona primero un área");
    return;
  }

  // Guardar estado actual
  mallaActual = { materia, grado };

  // Cargar datos
  const malla = Storage.getMalla(materia, grado);
  document.getElementById("malla-p1").value = malla.p1 || "";
  document.getElementById("malla-p2").value = malla.p2 || "";
  document.getElementById("malla-p3").value = malla.p3 || "";
  document.getElementById("malla-p4").value = malla.p4 || "";

  // Mostrar badge de qué está cargado
  const cfg    = MATERIAS_CONFIG[materia];
  const badge  = document.getElementById("malla-current-badge");
  const editor = document.getElementById("malla-editor");
  badge.style.display  = "flex";
  editor.style.display = "block";
  badge.innerHTML = `
    <span class="badge-icon">${cfg?.icon || "📚"}</span>
    <span>Editando: <strong>${materia}</strong> — <strong>${GRADOS_LABEL[grado]}</strong></span>
    ${malla.updatedAt ? `<span class="badge-date">Última edición: ${new Date(malla.updatedAt).toLocaleDateString("es-CO")}</span>` : ""}
  `;

  // Actualizar label y preview
  document.getElementById("malla-materia-label").textContent = `${cfg?.icon||''} ${materia}`;
  renderMallaPreview();
  renderMallasGuardadas(materia);

  showToast(`✓ Malla cargada: ${materia} · ${GRADOS_LABEL[grado]}`);
}

function saveMalla() {
  if (!mallaActual.materia) { showToast("⚠ Primero carga una malla con el botón 'Cargar'"); return; }

  Storage.saveMalla(mallaActual.materia, mallaActual.grado, {
    p1: document.getElementById("malla-p1").value,
    p2: document.getElementById("malla-p2").value,
    p3: document.getElementById("malla-p3").value,
    p4: document.getElementById("malla-p4").value,
  });

  renderMallaPreview();
  renderMallasGuardadas(mallaActual.materia);
  showToast(`✓ Malla guardada: ${mallaActual.materia} · ${GRADOS_LABEL[mallaActual.grado]}`);
}

function renderMallaPreview() {
  if (!mallaActual.materia) return;
  const temas   = Storage.getTemasList(mallaActual.materia, mallaActual.grado);
  const preview = document.getElementById("malla-preview-list");
  preview.innerHTML = temas.length
    ? temas.map((t, i) => `<div class="preview-tema"><span class="tema-n">${i+1}</span>${t}</div>`).join("")
    : `<div class="empty-state">Sin temas aún</div>`;
}

// Muestra todas las mallas guardadas para esta materia (todos los grados)
function renderMallasGuardadas(materia) {
  const cont = document.getElementById("mallas-guardadas-list");
  const filas = GRADOS.map(grado => {
    const malla  = Storage.getMalla(materia, grado);
    const temas  = Storage.getTemasList(materia, grado);
    const hasDat = temas.length > 0;
    return `
      <div class="malla-guard-card ${hasDat ? 'has-data' : 'no-data'}">
        <div class="mgc-top">
          <span class="mgc-grado">${GRADOS_LABEL[grado]}</span>
          <span class="mgc-count">${temas.length} temas</span>
        </div>
        ${hasDat
          ? `<div class="mgc-temas">${temas.slice(0,3).map(t => `<span class="mgc-tema">• ${t}</span>`).join("")}
             ${temas.length > 3 ? `<span class="mgc-more">+${temas.length-3} más</span>` : ""}</div>`
          : `<div class="mgc-empty">Sin malla</div>`
        }
        <button class="mgc-edit-btn" onclick="editarMallaGrado('${materia}','${grado}')">
          ${hasDat ? '✏️ Editar' : '+ Crear'}
        </button>
      </div>
    `;
  }).join("");
  cont.innerHTML = filas;
}

function editarMallaGrado(materia, grado) {
  document.getElementById("malla-materia").value = materia;
  document.getElementById("malla-grado").value   = grado;
  loadMallaData();
  document.getElementById("sec-malla").scrollIntoView({ behavior: "smooth" });
}

function loadMallaFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById("malla-p1").value = e.target.result.trim();
    renderMallaPreview();
    closeModal("modal-malla-import");
    showToast("✓ Temas cargados en Período 1 — recuerda guardar");
  };
  reader.readAsText(file, "UTF-8");
}

// ============================================================
// RESUMEN GENERAL
// ============================================================
function renderResumen() {
  const diarios = Storage.allDiarios ? Storage.allDiarios() : [];
  const users   = Auth.getAllUsers().filter(u => u.role === "docente");
  const cont    = document.getElementById("resumen-content");

  const conTema = diarios.filter(d => d && d.temaVisto).length;
  const guiasOk = diarios.filter(d => d && d.guiaTerminada === true).length;

  // Total estudiantes
  const totalEst = GRADOS.reduce((s, g) => s + Storage.getEstudiantes(g).length, 0);

  cont.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card"><span class="stat-num">${diarios.length}</span><span class="stat-label">Clases registradas</span></div>
      <div class="stat-card"><span class="stat-num">${conTema}</span><span class="stat-label">Con tema documentado</span></div>
      <div class="stat-card"><span class="stat-num">${guiasOk}</span><span class="stat-label">Guías terminadas</span></div>
      <div class="stat-card"><span class="stat-num">${users.length}</span><span class="stat-label">Docentes activos</span></div>
      <div class="stat-card"><span class="stat-num">${totalEst}</span><span class="stat-label">Estudiantes (6°–11°)</span></div>
    </div>

    <h3 class="resumen-sub">Actividad reciente</h3>
    <div class="activity-list">
      ${diarios
        .filter(d => d && d.updatedAt)
        .sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0,12)
        .map(d => `
          <div class="activity-item">
            <span class="act-icon">${MATERIAS_CONFIG[d.materia]?.icon||"📋"}</span>
            <div class="act-info">
              <strong>${d.materia||"—"}</strong> · ${GRADOS_LABEL[d.grado]||d.grado} · ${d.dia||""} ${d.hora||""}
              ${d.temaVisto ? `<br><small>📌 ${d.temaVisto}</small>` : ""}
            </div>
            <span class="act-time">${new Date(d.updatedAt).toLocaleDateString("es-CO")}</span>
          </div>
        `).join("") || `<div class="empty-state">Sin actividad registrada aún</div>`}
    </div>
  `;
}

// ============================================================
// TOAST
// ============================================================
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3000);
}

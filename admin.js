// ============================================================
// ADMIN.JS v4 — Panel de administración IESS
// Nuevo: asignación de áreas por grado en bloque
// ============================================================

let editingUserId    = null;
let asignacionesTemp = []; // [{grado, area}]
let mallaActual      = null;

// ============================================================
// INIT
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const admin = Auth.requireAdmin();
  Storage.init();
  document.getElementById("admin-name").textContent = admin.name;

  poblarMallaMateriaSel();
  renderAreasGrado(); // poblar chips de áreas inicial
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
  if (name === "malla")       renderMallasResumen();
  if (name === "resumen")     renderResumen();
}

// ============================================================
// DOCENTES — asignación por grado en bloque
// ============================================================

// Renderiza los chips de áreas para el grado seleccionado
function renderAreasGrado() {
  const grado     = document.getElementById("asig-grado-sel")?.value;
  const container = document.getElementById("asig-areas-grid");
  if (!container) return;

  const materias = Object.keys(MATERIAS_CONFIG)
    .filter(m => !["DESCANSO","ALMUERZO"].includes(m))
    .sort();

  // Qué áreas ya tiene asignadas este docente para este grado
  const yaAsignadas = asignacionesTemp
    .filter(a => a.grado === grado)
    .map(a => a.area);

  container.innerHTML = materias.map(m => {
    const cfg      = MATERIAS_CONFIG[m];
    const selected = yaAsignadas.includes(m);
    return `
      <label class="asig-area-chk ${selected?'selected':''}" id="chk-${m.replace(/ /g,'_')}"
        onclick="toggleAreaChk('${m}',this)">
        <input type="checkbox" ${selected?'checked':''} style="display:none">
        <span>${cfg.icon}</span>
        <span>${m}</span>
      </label>`;
  }).join("");
}

function toggleAreaChk(materia, el) {
  el.classList.toggle("selected");
}

function seleccionarTodasAreas() {
  document.querySelectorAll(".asig-area-chk").forEach(el => el.classList.add("selected"));
}

function deseleccionarTodasAreas() {
  document.querySelectorAll(".asig-area-chk").forEach(el => el.classList.remove("selected"));
}

// Agrega todas las áreas marcadas para el grado seleccionado
function agregarGradoCompleto() {
  const grado  = document.getElementById("asig-grado-sel").value;
  const chips  = document.querySelectorAll(".asig-area-chk.selected");
  const areas  = [...chips].map(el => el.querySelector("span:last-child").textContent.trim());

  if (!areas.length) { showToast("⚠ Selecciona al menos un área"); return; }

  // Quitar asignaciones anteriores de este grado y reemplazar
  asignacionesTemp = asignacionesTemp.filter(a => a.grado !== grado);
  areas.forEach(area => asignacionesTemp.push({ grado, area }));

  renderAsignacionesLista();
  showToast(`✓ ${GRADOS_LABEL[grado]} asignado con ${areas.length} áreas`);
}

function quitarAsignacionGrado(grado) {
  asignacionesTemp = asignacionesTemp.filter(a => a.grado !== grado);
  renderAsignacionesLista();
  // Re-render chips si el grado activo es el que se quitó
  if (document.getElementById("asig-grado-sel")?.value === grado) renderAreasGrado();
}

function quitarAreaAsig(grado, area) {
  asignacionesTemp = asignacionesTemp.filter(a => !(a.grado === grado && a.area === area));
  renderAsignacionesLista();
  if (document.getElementById("asig-grado-sel")?.value === grado) renderAreasGrado();
}

function renderAsignacionesLista() {
  const cont  = document.getElementById("asig-lista");
  const empty = document.getElementById("asig-empty");
  cont.querySelectorAll(".asig-tag").forEach(t => t.remove());

  if (!asignacionesTemp.length) { empty.style.display = "block"; return; }
  empty.style.display = "none";

  // Agrupar por grado
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
            <button class="asig-remove" onclick="quitarAreaAsig('${grado}','${area}')">×</button>
          </span>`).join("")}
      </div>
      <button class="asig-remove-grado" onclick="quitarAsignacionGrado('${grado}')" title="Quitar todo el grado">🗑</button>
    `;
    cont.appendChild(row);
  });
}

function renderDocentesGrid() {
  const users = Auth.getAllUsers();
  const grid  = document.getElementById("docentes-grid");
  grid.innerHTML = users.map(u => {
    const asigs    = u.asignaciones || [];
    const porGrado = {};
    asigs.forEach(a => {
      if (!porGrado[a.grado]) porGrado[a.grado] = [];
      porGrado[a.grado].push(a.area);
    });
    return `
      <div class="doc-card ${u.role==='admin'?'admin-card':''}">
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
            ${Object.keys(porGrado).length
              ? Object.entries(porGrado).map(([grado, areas]) => `
                  <div class="doc-grado-row">
                    <span class="doc-grado-pill">${GRADOS_LABEL[grado]}</span>
                    <div class="doc-areas-wrap">
                      ${areas.map(a => `
                        <span class="tag mat" style="--mc:${MATERIAS_CONFIG[a]?.color||'#888'}">
                          ${MATERIAS_CONFIG[a]?.icon||''} ${a}
                        </span>`).join("")}
                    </div>
                  </div>`).join("")
              : '<span class="tag empty">Sin asignaciones</span>'}
          </div>
          <div class="doc-actions">
            <button class="icon-btn edit" onclick="editDocente('${u.id}')">✏️ Editar</button>
            <button class="icon-btn del"  onclick="deleteDocente('${u.id}')">🗑 Eliminar</button>
          </div>
        ` : `<div class="doc-admin-note">Acceso completo al sistema</div>`}
      </div>`;
  }).join("");
}

function openModal(id)  { document.getElementById(id).style.display = "flex"; }

function closeModal(id) {
  document.getElementById(id).style.display = "none";
  if (id === "modal-docente") {
    editingUserId    = null;
    asignacionesTemp = [];
    ["doc-name","doc-username","doc-pass","doc-email","edit-user-id"]
      .forEach(i => { const el=document.getElementById(i); if(el) el.value=""; });
    document.getElementById("modal-doc-error").style.display = "none";
    renderAsignacionesLista();
    renderAreasGrado();
  }
  if (id === "modal-import") {
    document.getElementById("csv-paste").value = "";
    document.getElementById("csv-preview").style.display = "none";
    const f = document.getElementById("csv-upload"); if(f) f.value="";
  }
}

function editDocente(id) {
  const user = Auth.getAllUsers().find(u => u.id === id);
  if (!user) return;
  editingUserId    = id;
  asignacionesTemp = JSON.parse(JSON.stringify(user.asignaciones || []));

  document.getElementById("modal-docente-title").textContent = "Editar docente";
  document.getElementById("edit-user-id").value  = id;
  document.getElementById("doc-name").value      = user.name;
  document.getElementById("doc-username").value  = user.username;
  document.getElementById("doc-pass").value      = user.password;
  document.getElementById("doc-email").value     = user.email || "";
  renderAsignacionesLista();
  renderAreasGrado();
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

  const grados   = [...new Set(asignacionesTemp.map(a => a.grado))];
  const materias = [...new Set(asignacionesTemp.map(a => a.area))];
  const payload  = {
    name, username, password: pass, email,
    asignaciones: [...asignacionesTemp],
    grados, materias
  };

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
  document.getElementById("grados-resumen").innerHTML = GRADOS.map(g => {
    const n = Storage.getEstudiantes(g).length;
    return `<div class="grado-resumen-chip ${n?'':'empty-chip'}" onclick="seleccionarGrado('${g}')">
      <span class="gr-label">${GRADOS_LABEL[g]}</span>
      <span class="gr-count">${n}</span>
    </div>`;
  }).join("");
}

function seleccionarGrado(grado) {
  document.getElementById("grado-select-est").value = grado;
  renderEstudiantesList();
}

function renderEstudiantesList() {
  const grado = document.getElementById("grado-select-est").value;
  const lista = Storage.getEstudiantes(grado);
  const cont  = document.getElementById("estudiantes-list");
  document.querySelectorAll(".grado-resumen-chip").forEach((c,i) => {
    c.classList.toggle("active-chip", GRADOS[i] === grado);
  });
  if (!lista.length) {
    cont.innerHTML = `<div class="empty-state">Sin estudiantes en ${GRADOS_LABEL[grado]}<br>
      <small>Agrega manualmente o usa "Importar CSV"</small></div>`;
    return;
  }
  cont.innerHTML = `
    <div class="est-list-header">
      <span class="est-list-title">${GRADOS_LABEL[grado]} — ${lista.length} estudiantes</span>
      <button class="icon-btn-act exp" onclick="exportarEstudiantes('${grado}')">⬇ CSV</button>
    </div>
    <table class="est-table">
      <thead><tr><th>#</th><th>Nombre completo</th><th></th></tr></thead>
      <tbody>${lista.map(e => `
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
        </tr>`).join("")}
      </tbody>
    </table>`;
}

function toggleEditEst(grado, estId) {
  const d = document.getElementById(`est-display-${estId}`);
  const i = document.getElementById(`est-edit-${estId}`);
  if (i.style.display === "none") { d.style.display="none"; i.style.display="inline-block"; i.focus(); i.select(); }
  else confirmEditEst(grado, estId);
}
function cancelEditEst(estId) {
  document.getElementById(`est-display-${estId}`).style.display="";
  document.getElementById(`est-edit-${estId}`).style.display="none";
}
function confirmEditEst(grado, estId) {
  const input = document.getElementById(`est-edit-${estId}`);
  const name  = input.value.trim();
  if (name) { Storage.updateEstudiante(grado, estId, { nombre: name }); showToast("✓ Nombre actualizado"); }
  renderEstudiantesList();
}
function delEst(grado, estId) {
  if (!confirm("¿Eliminar este estudiante?")) return;
  Storage.removeEstudiante(grado, estId);
  renderEstudiantesList(); renderGradosResumen();
}
function abrirModalEstudiante() {
  document.getElementById("modal-est-grado").value = document.getElementById("grado-select-est").value;
  openModal("modal-estudiante");
}
function abrirModalImport() {
  document.getElementById("import-grado-sel").value = document.getElementById("grado-select-est").value;
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
  document.getElementById("grado-select-est").value = grado;
  renderEstudiantesList(); renderGradosResumen();
  showToast(`✓ Estudiante agregado a ${GRADOS_LABEL[grado]}`);
}
function previewCSV(event) {
  const file = event.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => { document.getElementById("csv-paste").value = e.target.result; livePreviewCSV(e.target.result); };
  reader.readAsText(file, "UTF-8");
}
function livePreviewCSV(text) {
  const nombres = parseCSVNombres(text);
  const preview = document.getElementById("csv-preview");
  if (!nombres.length) { preview.style.display="none"; return; }
  preview.style.display = "block";
  preview.innerHTML = `<strong>${nombres.length} nombres detectados:</strong><br>
    ${nombres.slice(0,6).map(n=>`<span class="csv-name-pill">${n}</span>`).join("")}
    ${nombres.length>6?`<span class="csv-more">+${nombres.length-6} más</span>`:""}`;
}
function parseCSVNombres(text) {
  return text.split(/\r?\n/)
    .map(line => {
      if (!line.trim()) return null;
      const parts = line.split(/[,;|\t]/);
      const cands = parts.map(p=>p.replace(/"/g,"").trim()).filter(p=>p.length>1&&isNaN(p));
      return cands.sort((a,b)=>b.length-a.length)[0]||null;
    }).filter(n => n && n.length > 2);
}
function importarEstudiantes() {
  const grado   = document.getElementById("import-grado-sel").value;
  const text    = document.getElementById("csv-paste").value.trim();
  const nombres = parseCSVNombres(text);
  if (!grado)          { showToast("⚠ Selecciona el grado"); return; }
  if (!nombres.length) { showToast("⚠ No se encontraron nombres"); return; }
  const existing = Storage.getEstudiantes(grado);
  let count = 0;
  nombres.forEach((nombre, i) => {
    if (!existing.find(e => e.nombre.toLowerCase()===nombre.toLowerCase())) {
      Storage.addEstudiante(grado, nombre, existing.length + count + 1); count++;
    }
  });
  closeModal("modal-import");
  document.getElementById("grado-select-est").value = grado;
  renderEstudiantesList(); renderGradosResumen();
  showToast(count>0 ? `✓ ${count} importados en ${GRADOS_LABEL[grado]}` : "ℹ Todos ya existían");
}
function exportarEstudiantes(grado) {
  const lista = Storage.getEstudiantes(grado);
  const csv   = "numero,nombre\n" + lista.map(e=>`${e.numero},"${e.nombre}"`).join("\n");
  const a     = document.createElement("a");
  a.href      = URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
  a.download  = `estudiantes_${grado}_2026.csv`; a.click();
  showToast("✓ CSV exportado");
}

// ============================================================
// MALLA CURRICULAR
// ============================================================
function poblarMallaMateriaSel() {
  const sel = document.getElementById("malla-materia"); if (!sel) return;
  Object.keys(MATERIAS_CONFIG).filter(m=>!["DESCANSO","ALMUERZO"].includes(m)).sort()
    .forEach(m => {
      const opt = document.createElement("option");
      opt.value = m; opt.textContent = `${MATERIAS_CONFIG[m].icon} ${m}`;
      sel.appendChild(opt);
    });
}
function loadMallaData() {
  const materia = document.getElementById("malla-materia").value;
  if (!materia) { showToast("⚠ Selecciona primero un área"); return; }
  mallaActual = materia;
  const malla = Storage.getMalla(materia);
  document.getElementById("malla-p1").value = malla.p1 || "";
  document.getElementById("malla-p2").value = malla.p2 || "";
  document.getElementById("malla-p3").value = malla.p3 || "";
  document.getElementById("malla-p4").value = malla.p4 || "";
  const cfg   = MATERIAS_CONFIG[materia];
  const badge = document.getElementById("malla-current-badge");
  badge.style.display = "flex";
  badge.innerHTML = `
    <span class="badge-icon">${cfg?.icon||"📚"}</span>
    <span>Editando: <strong>${materia}</strong> — aplica para todos los grados</span>
    ${malla.updatedAt?`<span class="badge-date">${new Date(malla.updatedAt).toLocaleDateString("es-CO")}</span>`:""}`;
  document.getElementById("malla-editor").style.display = "block";
  renderMallaPreview();
  showToast(`✓ Malla de ${materia} cargada`);
}
function saveMalla() {
  if (!mallaActual) { showToast("⚠ Primero carga un área"); return; }
  Storage.saveMalla(mallaActual, {
    p1: document.getElementById("malla-p1").value,
    p2: document.getElementById("malla-p2").value,
    p3: document.getElementById("malla-p3").value,
    p4: document.getElementById("malla-p4").value,
  });
  renderMallaPreview(); renderMallasResumen();
  showToast(`✓ Malla de ${mallaActual} guardada`);
}
function renderMallaPreview() {
  if (!mallaActual) return;
  const temas = Storage.getTemasList(mallaActual);
  document.getElementById("malla-preview-list").innerHTML = temas.length
    ? temas.map((t,i)=>`<div class="preview-tema"><span class="tema-n">${i+1}</span>${t}</div>`).join("")
    : `<div class="empty-state">Sin temas aún</div>`;
}
function renderMallasResumen() {
  const cont = document.getElementById("mallas-guardadas-list");
  cont.innerHTML = Object.keys(MATERIAS_CONFIG).filter(m=>!["DESCANSO","ALMUERZO"].includes(m)).sort()
    .map(materia => {
      const temas = Storage.getTemasList(materia);
      const malla = Storage.getMalla(materia);
      const cfg   = MATERIAS_CONFIG[materia];
      const has   = temas.length > 0;
      return `
        <div class="malla-guard-card ${has?'has-data':'no-data'}">
          <div class="mgc-top">
            <span class="mgc-grado">${cfg?.icon||''} ${materia}</span>
            <span class="mgc-count">${has?temas.length+' temas':'—'}</span>
          </div>
          ${has
            ? `<div class="mgc-temas">
                ${temas.slice(0,3).map(t=>`<span class="mgc-tema">• ${t}</span>`).join("")}
                ${temas.length>3?`<span class="mgc-more">+${temas.length-3} más</span>`:""}
              </div>`
            : `<div class="mgc-empty">Sin malla</div>`}
          ${malla.updatedAt?`<div class="mgc-date">${new Date(malla.updatedAt).toLocaleDateString("es-CO")}</div>`:""}
          <button class="mgc-edit-btn" onclick="editarMalla('${materia}')">${has?'✏️ Editar':'+ Crear'}</button>
        </div>`;
    }).join("");
}
function editarMalla(materia) {
  document.getElementById("malla-materia").value = materia;
  loadMallaData();
  document.getElementById("sec-malla").scrollIntoView({ behavior: "smooth" });
}
function loadMallaFile(event) {
  const file = event.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById("malla-p1").value = e.target.result.trim();
    renderMallaPreview(); closeModal("modal-malla-import");
    showToast("✓ Temas en Período 1 — recuerda Guardar");
  };
  reader.readAsText(file, "UTF-8");
}

// ============================================================
// RESUMEN
// ============================================================
function renderResumen() {
  const diarios  = Storage.allDiarios ? Storage.allDiarios() : [];
  const users    = Auth.getAllUsers().filter(u => u.role === "docente");
  const totalEst = GRADOS.reduce((s,g) => s + Storage.getEstudiantes(g).length, 0);
  const conTema  = diarios.filter(d=>d&&d.temaVisto).length;
  const guiasOk  = diarios.filter(d=>d&&d.guiaTerminada===true).length;

  document.getElementById("resumen-content").innerHTML = `
    <div class="stats-grid">
      <div class="stat-card"><span class="stat-num">${diarios.length}</span><span class="stat-label">Clases registradas</span></div>
      <div class="stat-card"><span class="stat-num">${conTema}</span><span class="stat-label">Con tema documentado</span></div>
      <div class="stat-card"><span class="stat-num">${guiasOk}</span><span class="stat-label">Guías terminadas</span></div>
      <div class="stat-card"><span class="stat-num">${users.length}</span><span class="stat-label">Docentes activos</span></div>
      <div class="stat-card"><span class="stat-num">${totalEst}</span><span class="stat-label">Estudiantes 6°–11°</span></div>
    </div>
    <h3 class="resumen-sub">Actividad reciente</h3>
    <div class="activity-list">
      ${diarios.filter(d=>d&&d.updatedAt)
        .sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt))
        .slice(0,12)
        .map(d=>`
          <div class="activity-item">
            <span class="act-icon">${MATERIAS_CONFIG[d.materia]?.icon||"📋"}</span>
            <div class="act-info">
              <strong>${d.materia||"—"}</strong> · ${GRADOS_LABEL[d.grado]||d.grado} · ${d.dia||""} ${d.hora||""}
              ${d.temaVisto?`<br><small>📌 ${d.temaVisto}</small>`:""}
            </div>
            <span class="act-time">${new Date(d.updatedAt).toLocaleDateString("es-CO")}</span>
          </div>`).join("") || `<div class="empty-state">Sin actividad aún</div>`}
    </div>`;
}

// ============================================================
// TOAST
// ============================================================
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg; t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3000);
}

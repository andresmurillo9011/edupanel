// ============================================================
// APP.JS v5 — Horario interactivo con Firebase
// Todo async: DB.getDiario, DB.getEstudiantes, etc.
// ============================================================

let selectedDay      = "Lunes";
let activeCell       = null;
let panelTab         = "diario";
let currentUser      = null;
let vistaMode        = "mio";
let guiaTerminadaVal = null;

// Espera a que Firebase esté listo
async function waitDB(ms = 10000) {
  const t = Date.now();
  while (!window.DB || !window.FireAuth) {
    if (Date.now() - t > ms) return false;
    await new Promise(r => setTimeout(r, 150));
  }
  return true;
}

// ============================================================
// INIT
// ============================================================
document.addEventListener("DOMContentLoaded", async () => {
  const ready = await waitDB();
  if (!ready) { showToast("❌ Sin conexión a Firebase. Verifica tu internet."); return; }

  currentUser = await window.FireAuth.require("login.html");
  if (!currentUser) return;

  // Header
  const initials = currentUser.name.split(" ").map(n=>n[0]).join("").substring(0,2).toUpperCase();
  document.getElementById("user-avatar").textContent = initials;
  document.getElementById("user-name").textContent   = currentUser.name;
  document.getElementById("user-role").textContent   = currentUser.role === "admin" ? "👑 Administrador" : "👤 Docente";
  document.getElementById("logout-btn").onclick = () => window.FireAuth.logout();

  if (currentUser.role === "admin") {
    document.getElementById("admin-link").style.display = "inline-flex";
    document.getElementById("vista-toggle").style.display = "none";
    vistaMode = "completo";
  }

  const asigs = currentUser.asignaciones || [];
  if (asigs.length === 0 && currentUser.role !== "admin") {
    vistaMode = "completo";
    document.getElementById("btn-completo").classList.add("active");
    document.getElementById("btn-mi-horario").classList.remove("active");
  }

  initClock();
  initDayNav();
  await renderSchedule(selectedDay);
  renderLegend();
});

// ============================================================
// VISTA TOGGLE
// ============================================================
function setVista(mode, btn) {
  vistaMode = mode;
  document.querySelectorAll(".vista-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  document.getElementById("schedule-title").textContent =
    mode === "mio" ? "📋 Mi Horario" : `🏫 Horario Completo — ${selectedDay}`;
  renderSchedule(selectedDay);
  resetPanel();
}

// ============================================================
// RELOJ
// ============================================================
function initClock() {
  const dateEl = document.getElementById("current-date");
  const timeEl = document.getElementById("current-time");
  const days   = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
  const months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  function update() {
    const n = new Date();
    dateEl.textContent = `${days[n.getDay()]} ${n.getDate()} ${months[n.getMonth()]}`;
    timeEl.textContent = n.toLocaleTimeString("es-CO",{hour:"2-digit",minute:"2-digit"});
  }
  update(); setInterval(update, 1000);
}

// ============================================================
// DÍAS
// ============================================================
function initDayNav() {
  document.querySelectorAll(".day-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".day-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedDay = btn.dataset.day;
      if (vistaMode === "completo")
        document.getElementById("schedule-title").textContent = `🏫 Horario Completo — ${selectedDay}`;
      renderSchedule(selectedDay);
      resetPanel();
    });
  });
}

function resetPanel() {
  activeCell = null;
  document.getElementById("panel-empty").style.display  = "flex";
  document.getElementById("panel-content").style.display = "none";
  document.querySelectorAll(".class-cell.selected").forEach(td => td.classList.remove("selected"));
}

// ============================================================
// RENDERIZAR HORARIO
// ============================================================
async function renderSchedule(day) {
  const tbody = document.getElementById("schedule-body");
  tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:20px;color:#3A5580">
    <div style="display:flex;align-items:center;justify-content:center;gap:8px">
      <div class="spinner"></div> Cargando horario...
    </div></td></tr>`;

  const filas = HORARIO[day] || [];

  // Pre-cargar todos los diarios del día para mostrar dots
  const diariosCache = {};
  const diarioPromises = [];
  for (const fila of filas) {
    if (fila.sexto === "DESCANSO" || fila.sexto === "ALMUERZO") continue;
    for (const grado of GRADOS) {
      const materia = fila[grado];
      if (materia && MATERIAS_CONFIG[materia] && !["DESCANSO","ALMUERZO"].includes(materia)) {
        diarioPromises.push(
          window.DB.getDiario(day, grado, fila.hora, materia)
            .then(d => { diariosCache[`${grado}::${fila.hora}::${materia}`] = d; })
            .catch(() => {})
        );
      }
    }
  }
  await Promise.all(diarioPromises);

  tbody.innerHTML = "";

  filas.forEach((fila, rowIndex) => {
    const tr = document.createElement("tr");
    const isDescanso = fila.sexto === "DESCANSO";
    const isAlmuerzo = fila.sexto === "ALMUERZO";

    if (isDescanso || isAlmuerzo) {
      tr.classList.add("break-row");
      const td  = document.createElement("td");
      td.colSpan = 7; td.className = "break-cell";
      const cfg = MATERIAS_CONFIG[isDescanso?"DESCANSO":"ALMUERZO"];
      td.style.setProperty("--break-color", cfg.color);
      td.innerHTML = `<span>${cfg.icon}</span> ${isDescanso?"Descanso":"Almuerzo"} <span class="break-time">${fila.hora}</span>`;
      tr.appendChild(td); tbody.appendChild(tr); return;
    }

    const tdHora = document.createElement("td");
    tdHora.className = "td-hora";
    tdHora.innerHTML = `<span class="hora-num">${rowIndex+1}</span><span class="hora-text">${fila.hora}</span>`;
    tr.appendChild(tdHora);

    GRADOS.forEach(grado => {
      const materia = fila[grado] || "";
      const td      = document.createElement("td");
      const canSee  = window.FireAuth.canAccess(currentUser, grado, materia);
      const cfg     = MATERIAS_CONFIG[materia];

      if (materia && cfg && !["DESCANSO","ALMUERZO"].includes(materia)) {
        if (vistaMode === "mio" && !canSee && currentUser.role !== "admin") {
          td.className = "empty-cell"; td.style.background="transparent"; td.innerHTML="";
          tr.appendChild(td); return;
        }
        td.className = `class-cell ${!canSee && vistaMode==="completo" ? "cell-locked":""}`;
        td.style.setProperty("--cell-color", cfg.color);
        td.setAttribute("data-dia", day);
        td.setAttribute("data-hora", fila.hora);
        td.setAttribute("data-grado", grado);

        const cached = diariosCache[`${grado}::${fila.hora}::${materia}`];
        const hasDot = cached && cached.temaVisto;

        td.innerHTML = `
          <span class="cell-icon">${cfg.icon}</span>
          <span class="cell-materia">${materia}</span>
          ${hasDot?`<span class="saved-dot" title="Registrado">●</span>`:""}
          ${!canSee && vistaMode==="completo"?`<span class="lock-icon">🔒</span>`:""}
        `;
        if (canSee) td.addEventListener("click", () => onCellClick(td, day, fila.hora, grado, materia));
      } else {
        td.className = "empty-cell"; td.innerHTML = "—";
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

// ============================================================
// CLICK EN CELDA
// ============================================================
async function onCellClick(td, dia, hora, grado, materia) {
  document.querySelectorAll(".class-cell.selected").forEach(el => el.classList.remove("selected"));
  td.classList.add("selected");
  activeCell = { dia, hora, grado, materia };
  document.getElementById("panel-empty").style.display  = "none";
  document.getElementById("panel-content").style.display = "flex";
  panelTab = "diario";
  await renderPanel(dia, hora, grado, materia);
}

async function renderPanel(dia, hora, grado, materia) {
  const panel = document.getElementById("panel-content");
  const cfg   = MATERIAS_CONFIG[materia];
  panel.innerHTML = `
    <div class="panel-header" style="--ph-color:${cfg.color}">
      <div class="panel-badge">
        <span class="panel-icon">${cfg.icon}</span>
        <div class="panel-title-block">
          <h3 class="panel-materia">${materia}</h3>
          <span class="panel-meta">${GRADOS_LABEL[grado]} · ${dia} · ${hora}</span>
        </div>
      </div>
      <button class="close-btn" onclick="resetPanel()">✕</button>
    </div>
    <div class="panel-tabs">
      <button class="tab-btn active" onclick="switchTab('diario',this)">📋 Diario</button>
      <button class="tab-btn" onclick="switchTab('seguimiento',this)">📊 Seguimiento</button>
      <button class="tab-btn" onclick="switchTab('notas',this)">📝 Notas</button>
      <button class="tab-btn" onclick="switchTab('plan',this)">🗓 Plan</button>
    </div>
    <div class="tab-content" id="tab-content">
      <div style="padding:20px;text-align:center;color:#3A5580"><div class="spinner" style="margin:auto"></div></div>
    </div>`;
  await loadTab("diario", dia, hora, grado, materia);
}

async function switchTab(tab, btn) {
  panelTab = tab;
  if (!activeCell) return;
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  const { dia, hora, grado, materia } = activeCell;
  document.getElementById("tab-content").innerHTML =
    `<div style="padding:20px;text-align:center;color:#3A5580"><div class="spinner" style="margin:auto"></div></div>`;
  await loadTab(tab, dia, hora, grado, materia);
}

async function loadTab(tab, dia, hora, grado, materia) {
  const cont = document.getElementById("tab-content");
  try {
    let html = "";
    if (tab === "diario")      html = await renderDiario(dia, hora, grado, materia);
    if (tab === "seguimiento") html = await renderSeguimiento(dia, hora, grado, materia);
    if (tab === "notas")       html = await renderNotas(dia, hora, grado, materia);
    if (tab === "plan")        html = await renderPlan(dia, hora, grado, materia);
    cont.innerHTML = html;
  } catch(e) {
    cont.innerHTML = `<div class="tab-panel"><div class="empty-state">Error cargando datos. Verifica tu conexión.</div></div>`;
    console.error(e);
  }
}

// ============================================================
// TAB: DIARIO
// ============================================================
async function renderDiario(dia, hora, grado, materia) {
  const d = await window.DB.getDiario(dia, grado, hora, materia);
  guiaTerminadaVal = d.guiaTerminada;
  return `
    <div class="tab-panel">
      <div class="info-badges">
        <div class="info-badge"><span class="ib-label">Día</span><span class="ib-value">${dia}</span></div>
        <div class="info-badge"><span class="ib-label">Grado</span><span class="ib-value">${GRADOS_LABEL[grado]}</span></div>
        <div class="info-badge"><span class="ib-label">Hora</span><span class="ib-value">${hora.split(" ")[0]}</span></div>
        <div class="info-badge"><span class="ib-label">Docente</span><span class="ib-value" style="font-size:.68rem">${currentUser.name.split(" ")[0]}</span></div>
      </div>
      <div class="form-group">
        <label class="form-label">Tema visto hoy</label>
        <input class="form-input" id="tema-visto" type="text" placeholder="Ej: Ecuaciones de primer grado..." value="${d.temaVisto||''}">
      </div>
      <div class="form-group">
        <label class="form-label">Descripción / desarrollo de la clase</label>
        <textarea class="form-textarea" id="descripcion" placeholder="¿Qué se hizo? ¿Cómo respondió el grupo?">${d.descripcion||''}</textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Observación general del día</label>
        <textarea class="form-textarea" id="obs-general" placeholder="Comportamiento, novedades...">${d.observacionGeneral||''}</textarea>
      </div>
      <div class="form-check-group">
        <label class="form-check-label">¿Se terminó la guía / actividad?</label>
        <div class="toggle-options">
          <button class="toggle-opt ${d.guiaTerminada===true?'active':''}" id="guia-si" onclick="setGuia(true)">✓ Completo</button>
          <button class="toggle-opt ${d.guiaTerminada===false?'active':''}" id="guia-no" onclick="setGuia(false)">✗ Pendiente</button>
        </div>
      </div>
      <div id="pendiente-wrap" style="display:${d.guiaTerminada===false?'block':'none'}">
        <div class="form-group">
          <label class="form-label">¿Qué quedó pendiente?</label>
          <input class="form-input" id="guia-pendiente" type="text" placeholder="Ej: Ejercicios 3-6, página 45" value="${d.guiaPendiente||''}">
        </div>
      </div>
      <div class="avance-group">
        <label class="form-label">Avance del tema: <strong id="avance-val">${d.avancePorcentaje||50}%</strong></label>
        <input type="range" class="avance-slider" id="avance-range" min="0" max="100" step="5"
          value="${d.avancePorcentaje||50}" oninput="document.getElementById('avance-val').textContent=this.value+'%'">
      </div>
      <button class="save-btn" onclick="saveDiario()">💾 Guardar diario</button>
    </div>`;
}

function setGuia(v) {
  guiaTerminadaVal = v;
  document.getElementById("guia-si").classList.toggle("active", v===true);
  document.getElementById("guia-no").classList.toggle("active", v===false);
  document.getElementById("pendiente-wrap").style.display = v===false?"block":"none";
}

async function saveDiario() {
  if (!activeCell) return;
  const { dia, hora, grado, materia } = activeCell;
  const existing = await window.DB.getDiario(dia, grado, hora, materia);
  showToast("💾 Guardando...");
  await window.DB.saveDiario(dia, grado, hora, materia, {
    ...existing,
    temaVisto:          document.getElementById("tema-visto")?.value    || "",
    descripcion:        document.getElementById("descripcion")?.value   || "",
    observacionGeneral: document.getElementById("obs-general")?.value   || "",
    guiaTerminada:      guiaTerminadaVal,
    guiaPendiente:      document.getElementById("guia-pendiente")?.value || "",
    avancePorcentaje:   parseInt(document.getElementById("avance-range")?.value||50),
  }, currentUser.id);
  showToast("✓ Diario guardado");
  await renderSchedule(dia);
  setTimeout(() => {
    document.querySelectorAll(".class-cell").forEach(td => {
      if (td.dataset.dia===dia && td.dataset.hora===hora && td.dataset.grado===grado) td.classList.add("selected");
    });
  }, 100);
}

// ============================================================
// TAB: SEGUIMIENTO
// ============================================================
async function renderSeguimiento(dia, hora, grado, materia) {
  const d     = await window.DB.getDiario(dia, grado, hora, materia);
  const temas = await window.DB.getTemasListByMateria(materia);
  const idx   = d.proximoTemaIdx || 0;
  const prox  = temas[idx] || "⚠ Sin malla curricular. Ve a Admin → Malla Curricular.";
  return `
    <div class="tab-panel">
      <div class="seg-block">
        <div class="seg-header"><span>📅</span><h4>Temas vistos la semana pasada</h4></div>
        <textarea class="form-textarea" id="temas-pasados" placeholder="Qué se trabajó...">${d.temasPasados||''}</textarea>
      </div>
      <div class="seg-block">
        <div class="seg-header"><span>⏳</span><h4>Temas pendientes</h4></div>
        <textarea class="form-textarea" id="temas-pendientes" placeholder="Temas no terminados...">${d.temasPendientes||''}</textarea>
      </div>
      <div class="seg-block siguiente-block">
        <div class="seg-header"><span>🎯</span><h4>Próximo tema (malla curricular)</h4></div>
        <div class="siguiente-tema">${prox}</div>
        ${temas.length
          ? `<div class="tema-nav">${temas.map((t,i)=>`
              <button class="tema-chip ${i===idx?'active':''}" onclick="setProximoTema(${i})">
                ${i+1}. ${t.length>32?t.substring(0,32)+'…':t}
              </button>`).join("")}</div>`
          : `<p class="hint-text">Carga la malla desde Admin → Malla Curricular</p>`}
      </div>
      <button class="save-btn" onclick="saveSeguimiento()">💾 Guardar seguimiento</button>
    </div>`;
}

async function setProximoTema(idx) {
  if (!activeCell) return;
  const { dia, hora, grado, materia } = activeCell;
  const existing = await window.DB.getDiario(dia, grado, hora, materia);
  await window.DB.saveDiario(dia, grado, hora, materia, { ...existing, proximoTemaIdx: idx }, currentUser.id);
  const temas = await window.DB.getTemasListByMateria(materia);
  document.querySelector(".siguiente-tema").textContent = temas[idx] || "—";
  document.querySelectorAll(".tema-chip").forEach((c,i)=>c.classList.toggle("active",i===idx));
  showToast("✓ Próximo tema actualizado");
}

async function saveSeguimiento() {
  if (!activeCell) return;
  const { dia, hora, grado, materia } = activeCell;
  const existing = await window.DB.getDiario(dia, grado, hora, materia);
  showToast("💾 Guardando...");
  await window.DB.saveDiario(dia, grado, hora, materia, {
    ...existing,
    temasPasados:    document.getElementById("temas-pasados")?.value    || "",
    temasPendientes: document.getElementById("temas-pendientes")?.value || "",
  }, currentUser.id);
  showToast("✓ Seguimiento guardado");
}

// ============================================================
// TAB: NOTAS
// ============================================================
async function renderNotas(dia, hora, grado, materia) {
  const lista = await window.DB.getEstudiantes(grado);
  if (!lista.length) return `
    <div class="tab-panel"><div class="empty-state">Sin estudiantes en ${GRADOS_LABEL[grado]}.<br>
    <small>Ve a <strong>Admin → Estudiantes</strong></small></div></div>`;

  // Cargar todas las notas del grupo de una sola vez
  const notasMap = await window.DB.getNotasGrado(dia, grado, hora, materia);

  const rows = lista.map((est, i) => {
    const n           = notasMap[est.id] || { nota:"", estado:"normal", observacion:"" };
    const estadoActual = n.estado || "normal";
    const estadoBtns  = Object.entries(ESTADOS_CLASE).map(([key,cfg])=>`
      <button class="estado-btn ${estadoActual===key?'active':''}"
        style="${estadoActual===key?`background:${cfg.color};color:#fff;border-color:${cfg.color}`:''}"
        title="${cfg.label}"
        onclick="setEstadoEst('${est.id}','${key}','${dia}','${hora}','${grado}','${materia}',this)">
        ${cfg.icon}</button>`).join("");
    return `
      <tr class="student-row" id="row-${est.id}">
        <td class="student-num">${est.numero}</td>
        <td class="student-name">${est.nombre}</td>
        <td class="estado-cell">${estadoBtns}</td>
        <td><input class="nota-input" type="number" min="0" max="5" step="0.1"
          value="${n.nota||''}" placeholder="—"
          onchange="quickSaveNota('${est.id}','${dia}','${hora}','${grado}','${materia}',this.value,document.getElementById('obs-${i}').value)"></td>
        <td><input class="obs-input" id="obs-${i}" type="text" placeholder="Observación..."
          value="${n.observacion||''}"
          onblur="quickSaveNota('${est.id}','${dia}','${hora}','${grado}','${materia}',document.querySelectorAll('.nota-input')[${i}].value,this.value)"></td>
      </tr>`;
  }).join("");

  return `
    <div class="tab-panel notas-panel">
      <div class="notas-header">
        <span class="notas-count">${lista.length} estudiantes · ${GRADOS_LABEL[grado]}</span>
        <div class="notas-actions">
          <button class="icon-btn-act" onclick="marcarTodos('notropajo','${dia}','${hora}','${grado}','${materia}')">✗ No trabajaron</button>
          <button class="icon-btn-act exp" onclick="exportNotas('${dia}','${hora}','${grado}','${materia}')">⬇ CSV</button>
        </div>
      </div>
      <div class="estados-legend">
        ${Object.entries(ESTADOS_CLASE).map(([k,v])=>`<span class="el-item" style="color:${v.color}">${v.icon} ${v.label}</span>`).join("")}
      </div>
      <div class="table-scroll">
        <table class="notas-table">
          <thead><tr><th>#</th><th>Nombre</th><th>Estado</th><th>Nota</th><th>Observación</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div class="promedio-bar">
        <span>Promedio:</span><strong id="promedio-display">—</strong>
        <button class="calc-btn" onclick="calcPromedio()">Calcular</button>
      </div>
    </div>`;
}

async function setEstadoEst(estId, estado, dia, hora, grado, materia, btn) {
  const n           = await window.DB.getNota(dia, grado, hora, materia, estId);
  const nuevoEstado = n.estado === estado ? "normal" : estado;
  await window.DB.saveNota(dia, grado, hora, materia, estId, { ...n, estado: nuevoEstado });
  const row = document.getElementById(`row-${estId}`);
  row.querySelectorAll(".estado-btn").forEach((b,i) => {
    const key = Object.keys(ESTADOS_CLASE)[i];
    const cfg = ESTADOS_CLASE[key];
    b.classList.toggle("active", key===nuevoEstado);
    b.style.background  = key===nuevoEstado ? cfg.color : "";
    b.style.color       = key===nuevoEstado ? "#fff"    : "";
    b.style.borderColor = key===nuevoEstado ? cfg.color : "";
  });
}

async function quickSaveNota(estId, dia, hora, grado, materia, nota, obs) {
  const existing = await window.DB.getNota(dia, grado, hora, materia, estId);
  await window.DB.saveNota(dia, grado, hora, materia, estId, { ...existing, nota, observacion: obs });
}

async function marcarTodos(estado, dia, hora, grado, materia) {
  const lista = await window.DB.getEstudiantes(grado);
  showToast("⏳ Marcando...");
  await Promise.all(lista.map(async est => {
    const n = await window.DB.getNota(dia, grado, hora, materia, est.id);
    await window.DB.saveNota(dia, grado, hora, materia, est.id, { ...n, estado });
  }));
  await switchTab("notas", null);
  showToast("✓ Todos marcados");
}

function calcPromedio() {
  const vals = [...document.querySelectorAll(".nota-input")].map(i=>parseFloat(i.value)).filter(v=>!isNaN(v));
  if (!vals.length) return;
  document.getElementById("promedio-display").textContent = (vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(2);
}

async function exportNotas(dia, hora, grado, materia) {
  const lista    = await window.DB.getEstudiantes(grado);
  const notasMap = await window.DB.getNotasGrado(dia, grado, hora, materia);
  let csv = "No,Nombre,Estado,Nota,Observación\n";
  lista.forEach(est => {
    const n = notasMap[est.id] || {};
    csv += `${est.numero},"${est.nombre}","${ESTADOS_CLASE[n.estado||"normal"]?.label||"Normal"}","${n.nota||''}","${n.observacion||''}"\n`;
  });
  const a = document.createElement("a");
  a.href  = URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
  a.download = `notas_${grado}_${materia.replace(/ /g,"_")}_${dia}.csv`;
  a.click();
  showToast("✓ CSV exportado");
}

// ============================================================
// TAB: PLAN
// ============================================================
async function renderPlan(dia, hora, grado, materia) {
  const d        = await window.DB.getDiario(dia, grado, hora, materia);
  const archivos = d.archivos || [];
  return `
    <div class="tab-panel">
      <div class="form-group">
        <label class="form-label">Plan del periodo</label>
        <textarea class="form-textarea tall" id="plan-periodo"
          placeholder="Objetivos, competencias, logros del periodo...">${d.planPeriodo||''}</textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Logros esperados</label>
        <input class="form-input" id="logros" type="text"
          placeholder="Ej: El estudiante analiza y resuelve..." value="${d.logros||''}">
      </div>
      <div class="plan-docs-section">
        <label class="plan-docs-title">📎 Planeaciones y guías (PDF, Word, PPT...)</label>
        <div class="upload-zone" style="min-height:70px" onclick="document.getElementById('plan-file-upload').click()">
          <input type="file" id="plan-file-upload" accept=".pdf,.doc,.docx,.pptx,.ppt,.xlsx,.xls"
            style="display:none" onchange="handlePlanFileUpload(event)" multiple>
          <span class="upload-icon">📄</span>
          <span class="upload-text">Subir documentos</span>
          <span class="upload-sub">PDF, Word, PowerPoint, Excel</span>
        </div>
        <div id="plan-docs-list">
          ${archivos.length
            ? archivos.map(f=>renderPlanDocItem(f)).join("")
            : `<div style="font-size:.7rem;color:var(--text-muted)">Sin documentos subidos aún.</div>`}
        </div>
      </div>
      <button class="save-btn" onclick="savePlan()">💾 Guardar plan</button>
    </div>`;
}

function renderPlanDocItem(f) {
  const icons = {pdf:"📕",doc:"📘",docx:"📘",ppt:"📙",pptx:"📙",xls:"📗",xlsx:"📗"};
  const ext   = f.nombre.split(".").pop().toLowerCase();
  const icon  = icons[ext] || "📄";
  const enc   = encodeURIComponent(f.nombre);
  return `
    <div class="plan-doc-item" id="plandoc-${enc}">
      <span style="font-size:1rem">${icon}</span>
      <span class="plan-doc-name" title="${f.nombre}">${f.nombre}</span>
      <span style="font-size:.62rem;color:var(--text-muted);white-space:nowrap">${f.tamaño}</span>
      <button class="plan-doc-dl" onclick="descargarPlanDoc('${enc}')">⬇</button>
      <button class="plan-doc-del" onclick="eliminarPlanDoc('${enc}')">🗑</button>
    </div>`;
}

function handlePlanFileUpload(event) {
  if (!activeCell) return;
  const { dia, hora, grado, materia } = activeCell;
  const files = [...event.target.files];
  if (!files.length) return;
  const MAX_MB = 4;
  let uploaded = 0;

  const processFile = async (i) => {
    if (i >= files.length) {
      showToast(`✓ ${uploaded} documento(s) subido(s)`);
      event.target.value = "";
      return;
    }
    const file = files[i];
    if (file.size > MAX_MB*1024*1024) {
      showToast(`⚠ "${file.name}" supera ${MAX_MB}MB`);
      return processFile(i+1);
    }
    const reader = new FileReader();
    reader.onload = async e => {
      const info = { nombre:file.name, tipo:file.type, tamaño:(file.size/1024).toFixed(1)+" KB", data:e.target.result, fechaSubida:new Date().toLocaleDateString("es-CO") };
      const existing = await window.DB.getDiario(dia, grado, hora, materia);
      const archivos = existing.archivos || [];
      const idx = archivos.findIndex(a=>a.nombre===file.name);
      if (idx>=0) archivos[idx]=info; else archivos.push(info);
      showToast("⏳ Subiendo...");
      await window.DB.saveDiario(dia, grado, hora, materia, { ...existing, archivos }, currentUser.id);
      uploaded++;
      const cont = document.getElementById("plan-docs-list");
      if (cont) {
        const existEl = document.getElementById(`plandoc-${encodeURIComponent(file.name)}`);
        if (existEl) existEl.outerHTML = renderPlanDocItem(info);
        else cont.innerHTML = cont.innerHTML.replace(/<div style="font-size.*?<\/div>/,"") + renderPlanDocItem(info);
      }
      await processFile(i+1);
    };
    reader.readAsDataURL(file);
  };
  processFile(0);
}

async function descargarPlanDoc(nombreEnc) {
  if (!activeCell) return;
  const { dia, hora, grado, materia } = activeCell;
  const nombre   = decodeURIComponent(nombreEnc);
  const d        = await window.DB.getDiario(dia, grado, hora, materia);
  const file     = (d.archivos||[]).find(f=>f.nombre===nombre);
  if (!file) return;
  const a = document.createElement("a"); a.href=file.data; a.download=file.nombre; a.click();
}

async function eliminarPlanDoc(nombreEnc) {
  if (!activeCell) return;
  const nombre = decodeURIComponent(nombreEnc);
  if (!confirm(`¿Eliminar "${nombre}"?`)) return;
  const { dia, hora, grado, materia } = activeCell;
  const existing = await window.DB.getDiario(dia, grado, hora, materia);
  const archivos = (existing.archivos||[]).filter(f=>f.nombre!==nombre);
  await window.DB.saveDiario(dia, grado, hora, materia, { ...existing, archivos }, currentUser.id);
  const el = document.getElementById(`plandoc-${nombreEnc}`);
  if (el) el.remove();
  showToast("✓ Documento eliminado");
}

async function savePlan() {
  if (!activeCell) return;
  const { dia, hora, grado, materia } = activeCell;
  const existing = await window.DB.getDiario(dia, grado, hora, materia);
  showToast("💾 Guardando...");
  await window.DB.saveDiario(dia, grado, hora, materia, {
    ...existing,
    planPeriodo: document.getElementById("plan-periodo")?.value || "",
    logros:      document.getElementById("logros")?.value       || "",
  }, currentUser.id);
  showToast("✓ Plan guardado");
}

// ============================================================
// LEYENDA + TOAST
// ============================================================
function renderLegend() {
  document.getElementById("legend-items").innerHTML = Object.entries(MATERIAS_CONFIG)
    .filter(([k])=>!["DESCANSO","ALMUERZO"].includes(k))
    .map(([n,cfg])=>`<span class="legend-item" style="--lc:${cfg.color}">${cfg.icon} ${n}</span>`)
    .join("");
}

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg; t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"), 3000);
}

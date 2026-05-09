// ============================================================
// APP.JS — Horario interactivo I.E.R. Santiago de la Selva
// Usa: DB (db.js) · HORARIO/MATERIAS (data.js)
// ============================================================

let selectedDay      = "Lunes";
let activeCell       = null;
let panelTab         = "diario";
let currentUser      = null;
let vistaMode        = "completo";
let guiaTerminadaVal = null;

// ============================================================
// INIT
// ============================================================
document.addEventListener("DOMContentLoaded", async () => {

  // ── Verificar sesión con EduClass ──
  const tok = localStorage.getItem("edutoken");
  const raw = localStorage.getItem("educlass_usuario");

  if (!tok || !raw) {
    window.location.href = "login.html";
    return;
  }

  const eduUser = JSON.parse(raw);
  currentUser = {
    id:           eduUser.id,
    name:         eduUser.name,
    role:         eduUser.rol || "docente",
    email:        eduUser.email,
    asignaciones: [],
    grados:       [],
    materias:     [],
  };

  // Header
  const initials = currentUser.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  document.getElementById("user-avatar").textContent = initials;
  document.getElementById("user-name").textContent   = currentUser.name;
  document.getElementById("user-role").textContent   = currentUser.role === "admin" ? "👑 Administrador" : "👤 Docente";

  // Logout limpio
  const logoutBtn = document.querySelector(".logout-btn");
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      localStorage.removeItem("edutoken");
      localStorage.removeItem("educlass_usuario");
      window.location.href = "login.html";
    };
  }

  if (currentUser.role === "admin" || currentUser.role === "superadmin") {
    const adminLink = document.getElementById("admin-link");
    if (adminLink) adminLink.style.display = "inline-flex";
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
    mode === "mio" ? "📋 Mi Horario" : `🏫 Horario Completo · ${selectedDay}`;
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
// NAVEGACIÓN DÍAS
// ============================================================
function initDayNav() {
  document.querySelectorAll(".day-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".day-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedDay = btn.dataset.day;
      if (vistaMode === "completo")
        document.getElementById("schedule-title").textContent = `🏫 Horario Completo · ${selectedDay}`;
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
  tbody.innerHTML = "";

  const filas = HORARIO[day] || [];

  // Precargar diarios para mostrar dots (en paralelo)
  const cache = {};
  await Promise.all(
    filas.flatMap(fila => {
      if (["DESCANSO","ALMUERZO"].includes(fila.sexto)) return [];
      return GRADOS.map(grado => {
        const m = fila[grado];
        if (!m || !MATERIAS_CONFIG[m] || ["DESCANSO","ALMUERZO"].includes(m)) return null;
        return DB.getDiario(day, grado, fila.hora, m)
          .then(d => { cache[`${grado}::${fila.hora}::${m}`] = d; })
          .catch(() => {});
      }).filter(Boolean);
    })
  );

  filas.forEach((fila, rowIndex) => {
    const tr         = document.createElement("tr");
    const isDescanso = fila.sexto === "DESCANSO";
    const isAlmuerzo = fila.sexto === "ALMUERZO";

    if (isDescanso || isAlmuerzo) {
      const td  = document.createElement("td");
      td.colSpan = 7; td.className = "break-cell";
      const cfg = MATERIAS_CONFIG[isDescanso ? "DESCANSO" : "ALMUERZO"];
      td.style.setProperty("--break-color", cfg.color);
      td.innerHTML = `<span>${cfg.icon}</span> ${isDescanso?"Descanso":"Almuerzo"} <span class="break-time">${fila.hora}</span>`;
      tr.classList.add("break-row");
      tr.appendChild(td); tbody.appendChild(tr); return;
    }

    // Celda de hora
    const tdH = document.createElement("td");
    tdH.className = "td-hora";
    tdH.innerHTML = `<span class="hora-num">${rowIndex+1}</span><span class="hora-text">${fila.hora}</span>`;
    tr.appendChild(tdH);

    GRADOS.forEach(grado => {
      const materia = fila[grado] || "";
      const td      = document.createElement("td");
      const cfg     = MATERIAS_CONFIG[materia];

      if (materia && cfg && !["DESCANSO","ALMUERZO"].includes(materia)) {
        td.className = "class-cell";
        td.style.setProperty("--cell-color", cfg.color);
        td.setAttribute("data-dia", day);
        td.setAttribute("data-hora", fila.hora);
        td.setAttribute("data-grado", grado);

        const cached = cache[`${grado}::${fila.hora}::${materia}`];
        const hasDot = cached && cached.temaVisto;

        td.innerHTML = `
          <span class="cell-icon">${cfg.icon}</span>
          <span class="cell-materia">${materia}</span>
          ${hasDot ? `<span class="saved-dot" title="Clase registrada">●</span>` : ""}
        `;
        td.addEventListener("click", () => onCellClick(td, day, fila.hora, grado, materia));
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

// ============================================================
// PANEL LATERAL
// ============================================================
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
      <button class="tab-btn active"  onclick="switchTab('diario',this)">📋 Diario</button>
      <button class="tab-btn"         onclick="switchTab('seguimiento',this)">📊 Seguimiento</button>
      <button class="tab-btn"         onclick="switchTab('notas',this)">📝 Notas</button>
      <button class="tab-btn"         onclick="switchTab('plan',this)">🗓 Plan</button>
    </div>
    <div class="tab-content" id="tab-content">
      <div style="padding:24px;text-align:center;color:#3A5580">Cargando...</div>
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
    `<div style="padding:24px;text-align:center;color:#3A5580">Cargando...</div>`;
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
    cont.innerHTML = `<div class="tab-panel"><div class="empty-state">Error cargando datos.</div></div>`;
    console.error(e);
  }
}

// ============================================================
// TAB: DIARIO
// ============================================================
async function renderDiario(dia, hora, grado, materia) {
  const d = await DB.getDiario(dia, grado, hora, materia);
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
        <textarea class="form-textarea" id="descripcion" placeholder="¿Qué se hizo? ¿Cómo respondió el grupo? ¿Hasta dónde llegamos?">${d.descripcion||''}</textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Observación general del día</label>
        <textarea class="form-textarea" id="obs-general" placeholder="Comportamiento, novedades, ambiente de la clase...">${d.observacionGeneral||''}</textarea>
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
          <label class="form-label">¿Qué quedó pendiente? / ¿Hasta dónde llegamos?</label>
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
  document.getElementById("guia-si").classList.toggle("active", v === true);
  document.getElementById("guia-no").classList.toggle("active", v === false);
  document.getElementById("pendiente-wrap").style.display = v === false ? "block" : "none";
}

async function saveDiario() {
  if (!activeCell) return;
  const { dia, hora, grado, materia } = activeCell;
  const existing = await DB.getDiario(dia, grado, hora, materia);
  await DB.saveDiario(dia, grado, hora, materia, {
    ...existing,
    temaVisto:          document.getElementById("tema-visto")?.value    || "",
    descripcion:        document.getElementById("descripcion")?.value   || "",
    observacionGeneral: document.getElementById("obs-general")?.value   || "",
    guiaTerminada:      guiaTerminadaVal,
    guiaPendiente:      document.getElementById("guia-pendiente")?.value || "",
    avancePorcentaje:   parseInt(document.getElementById("avance-range")?.value || 50),
  }, currentUser.id);
  showToast("✓ Diario guardado");
  await renderSchedule(dia);
  setTimeout(() => {
    document.querySelectorAll(".class-cell").forEach(td => {
      if (td.dataset.dia===dia && td.dataset.hora===hora && td.dataset.grado===grado)
        td.classList.add("selected");
    });
  }, 60);
}

// ============================================================
// TAB: SEGUIMIENTO
// ============================================================
async function renderSeguimiento(dia, hora, grado, materia) {
  const d     = await DB.getDiario(dia, grado, hora, materia);
  const temas = await DB.getTemasListByMateria(materia);
  const idx   = d.proximoTemaIdx || 0;
  const prox  = temas[idx] || "⚠ Sin malla curricular. Ve a Admin → Malla Curricular.";
  return `
    <div class="tab-panel">
      <div class="seg-block">
        <div class="seg-header"><span>📅</span><h4>Temas vistos la semana pasada</h4></div>
        <textarea class="form-textarea" id="temas-pasados" placeholder="Qué se trabajó la semana anterior...">${d.temasPasados||''}</textarea>
      </div>
      <div class="seg-block">
        <div class="seg-header"><span>⏳</span><h4>Temas pendientes</h4></div>
        <textarea class="form-textarea" id="temas-pendientes" placeholder="Temas que no se pudieron terminar...">${d.temasPendientes||''}</textarea>
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
  const existing = await DB.getDiario(dia, grado, hora, materia);
  await DB.saveDiario(dia, grado, hora, materia, { ...existing, proximoTemaIdx: idx }, currentUser.id);
  const temas = await DB.getTemasListByMateria(materia);
  document.querySelector(".siguiente-tema").textContent = temas[idx] || "—";
  document.querySelectorAll(".tema-chip").forEach((c,i) => c.classList.toggle("active", i===idx));
  showToast("✓ Próximo tema actualizado");
}

async function saveSeguimiento() {
  if (!activeCell) return;
  const { dia, hora, grado, materia } = activeCell;
  const existing = await DB.getDiario(dia, grado, hora, materia);
  await DB.saveDiario(dia, grado, hora, materia, {
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
  const lista = await DB.getEstudiantes(grado);
  if (!lista.length) return `
    <div class="tab-panel"><div class="empty-state">
      Sin estudiantes en ${GRADOS_LABEL[grado]}.<br>
      <small>Ve a <strong>Admin → Estudiantes</strong> para agregarlos.</small>
    </div></div>`;

  const notasMap = await DB.getNotasGrado(dia, grado, hora, materia);

  const rows = lista.map((est, i) => {
    const n            = notasMap[est.id] || { nota:"", estado:"normal", observacion:"" };
    const estadoActual = n.estado || "normal";
    const estadoBtns   = Object.entries(ESTADOS_CLASE).map(([key, cfg]) => `
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
  const n           = await DB.getNota(dia, grado, hora, materia, estId);
  const nuevoEstado = n.estado === estado ? "normal" : estado;
  await DB.saveNota(dia, grado, hora, materia, estId, { ...n, estado: nuevoEstado });
  const row = document.getElementById(`row-${estId}`);
  row.querySelectorAll(".estado-btn").forEach((b, i) => {
    const key = Object.keys(ESTADOS_CLASE)[i];
    const cfg = ESTADOS_CLASE[key];
    b.classList.toggle("active", key === nuevoEstado);
    b.style.background  = key === nuevoEstado ? cfg.color : "";
    b.style.color       = key === nuevoEstado ? "#fff"    : "";
    b.style.borderColor = key === nuevoEstado ? cfg.color : "";
  });
}

async function quickSaveNota(estId, dia, hora, grado, materia, nota, obs) {
  const existing = await DB.getNota(dia, grado, hora, materia, estId);
  await DB.saveNota(dia, grado, hora, materia, estId, { ...existing, nota, observacion: obs });
}

async function marcarTodos(estado, dia, hora, grado, materia) {
  const lista = await DB.getEstudiantes(grado);
  await Promise.all(lista.map(async est => {
    const n = await DB.getNota(dia, grado, hora, materia, est.id);
    await DB.saveNota(dia, grado, hora, materia, est.id, { ...n, estado });
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
  const lista    = await DB.getEstudiantes(grado);
  const notasMap = await DB.getNotasGrado(dia, grado, hora, materia);
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
  const d        = await DB.getDiario(dia, grado, hora, materia);
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
        <div class="upload-zone" onclick="document.getElementById('plan-file-upload').click()">
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
  const enc   = encodeURIComponent(f.nombre);
  return `
    <div class="plan-doc-item" id="plandoc-${enc}">
      <span>${icons[ext]||"📄"}</span>
      <span class="plan-doc-name" title="${f.nombre}">${f.nombre}</span>
      <span style="font-size:.62rem;color:var(--text-muted);white-space:nowrap">${f.tamaño}</span>
      <button class="plan-doc-dl" onclick="descargarPlanDoc('${enc}')">⬇</button>
      <button class="plan-doc-del" onclick="eliminarPlanDoc('${enc}')">🗑</button>
    </div>`;
}

function handlePlanFileUpload(event) {
  if (!activeCell) return;
  const { dia, hora, grado, materia } = activeCell;
  const files   = [...event.target.files];
  let uploaded  = 0;

  const process = async (i) => {
    if (i >= files.length) {
      showToast(`✓ ${uploaded} documento(s) subido(s)`);
      event.target.value = "";
      return;
    }
    const file = files[i];
    if (file.size > 4*1024*1024) { showToast(`⚠ "${file.name}" supera 4MB`); return process(i+1); }
    const reader = new FileReader();
    reader.onload = async e => {
      const info = { nombre:file.name, tipo:file.type, tamaño:(file.size/1024).toFixed(1)+" KB", data:e.target.result, fechaSubida:new Date().toLocaleDateString("es-CO") };
      const existing = await DB.getDiario(dia, grado, hora, materia);
      const archivos = existing.archivos || [];
      const idx = archivos.findIndex(a=>a.nombre===file.name);
      if (idx>=0) archivos[idx]=info; else archivos.push(info);
      await DB.saveDiario(dia, grado, hora, materia, { ...existing, archivos }, currentUser.id);
      uploaded++;
      const cont = document.getElementById("plan-docs-list");
      if (cont) {
        const el = document.getElementById(`plandoc-${encodeURIComponent(file.name)}`);
        if (el) el.outerHTML = renderPlanDocItem(info);
        else {
          const placeholder = cont.querySelector("div[style]");
          if (placeholder) placeholder.remove();
          cont.insertAdjacentHTML("beforeend", renderPlanDocItem(info));
        }
      }
      process(i+1);
    };
    reader.readAsDataURL(file);
  };
  process(0);
}

async function descargarPlanDoc(enc) {
  if (!activeCell) return;
  const { dia, hora, grado, materia } = activeCell;
  const d    = await DB.getDiario(dia, grado, hora, materia);
  const file = (d.archivos||[]).find(f=>f.nombre===decodeURIComponent(enc));
  if (!file) return;
  const a = document.createElement("a"); a.href=file.data; a.download=file.nombre; a.click();
}

async function eliminarPlanDoc(enc) {
  if (!activeCell) return;
  const nombre = decodeURIComponent(enc);
  if (!confirm(`¿Eliminar "${nombre}"?`)) return;
  const { dia, hora, grado, materia } = activeCell;
  const existing = await DB.getDiario(dia, grado, hora, materia);
  const archivos = (existing.archivos||[]).filter(f=>f.nombre!==nombre);
  await DB.saveDiario(dia, grado, hora, materia, { ...existing, archivos }, currentUser.id);
  document.getElementById(`plandoc-${enc}`)?.remove();
  showToast("✓ Documento eliminado");
}

async function savePlan() {
  if (!activeCell) return;
  const { dia, hora, grado, materia } = activeCell;
  const existing = await DB.getDiario(dia, grado, hora, materia);
  await DB.saveDiario(dia, grado, hora, materia, {
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
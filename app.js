// ============================================================
// APP.JS — Horario interactivo principal (v2 multi-usuario)
// ============================================================

let selectedDay = "Lunes";
let activeCell  = null;
let panelTab    = "diario";
let currentUser = null;
let guiaTerminadaVal = null;

document.addEventListener("DOMContentLoaded", () => {
  currentUser = Auth.require("login.html");
  Storage.init(); // Carga estudiantes reales la primera vez
  document.getElementById("user-name").textContent = currentUser.name;
  document.getElementById("user-role").textContent = currentUser.role === "admin" ? "👑 Admin" : "👤 Docente";
  if (currentUser.role === "admin") {
    document.getElementById("admin-link").style.display = "inline-flex";
  }
  initClock();
  initDayNav();
  renderSchedule(selectedDay);
  renderLegend();
});

function initClock() {
  const dateEl = document.getElementById("current-date");
  const timeEl = document.getElementById("current-time");
  const days   = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
  const months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  function update() {
    const n = new Date();
    dateEl.textContent = `${days[n.getDay()]} ${n.getDate()} ${months[n.getMonth()]}`;
    timeEl.textContent = n.toLocaleTimeString("es-CO", { hour:"2-digit", minute:"2-digit" });
  }
  update(); setInterval(update, 1000);
}

function initDayNav() {
  document.querySelectorAll(".day-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".day-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedDay = btn.dataset.day;
      renderSchedule(selectedDay);
      resetPanel();
    });
  });
}

function resetPanel() {
  activeCell = null;
  document.getElementById("panel-empty").style.display = "flex";
  document.getElementById("panel-content").style.display = "none";
  document.querySelectorAll(".class-cell.selected").forEach(td => td.classList.remove("selected"));
}

function renderSchedule(day) {
  const tbody = document.getElementById("schedule-body");
  tbody.innerHTML = "";
  (HORARIO[day] || []).forEach((fila, rowIndex) => {
    const tr = document.createElement("tr");
    const isDescanso = fila.sexto === "DESCANSO";
    const isAlmuerzo = fila.sexto === "ALMUERZO";
    if (isDescanso || isAlmuerzo) {
      tr.classList.add("break-row");
      const td = document.createElement("td");
      td.colSpan = 7; td.className = "break-cell";
      const cfg = MATERIAS_CONFIG[isDescanso ? "DESCANSO" : "ALMUERZO"];
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
      const td = document.createElement("td");
      const canSee = Auth.canAccess(grado, materia);
      const cfg = MATERIAS_CONFIG[materia];
      if (materia && cfg && !["DESCANSO","ALMUERZO"].includes(materia)) {
        td.className = `class-cell ${!canSee?"cell-locked":""}`;
        td.style.setProperty("--cell-color", cfg.color);
        td.setAttribute("data-dia", day);
        td.setAttribute("data-hora", fila.hora);
        td.setAttribute("data-grado", grado);
        const saved = Storage.getDiario(day, grado, fila.hora, materia);
        const hasDot = saved && saved.temaVisto;
        td.innerHTML = `
          <span class="cell-icon">${cfg.icon}</span>
          <span class="cell-materia">${materia}</span>
          ${hasDot?`<span class="saved-dot">●</span>`:""}
          ${!canSee?`<span class="lock-icon">🔒</span>`:""}
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

function onCellClick(td, dia, hora, grado, materia) {
  document.querySelectorAll(".class-cell.selected").forEach(el => el.classList.remove("selected"));
  td.classList.add("selected");
  activeCell = { dia, hora, grado, materia };
  document.getElementById("panel-empty").style.display = "none";
  document.getElementById("panel-content").style.display = "flex";
  panelTab = "diario";
  renderPanel(dia, hora, grado, materia);
}

function renderPanel(dia, hora, grado, materia) {
  const panel = document.getElementById("panel-content");
  const cfg = MATERIAS_CONFIG[materia];
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
      ${renderTab("diario", dia, hora, grado, materia)}
    </div>
  `;
}

function switchTab(tab, btn) {
  panelTab = tab;
  if (!activeCell) return;
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  const { dia, hora, grado, materia } = activeCell;
  document.getElementById("tab-content").innerHTML = renderTab(tab, dia, hora, grado, materia);
}

function renderTab(tab, dia, hora, grado, materia) {
  if (tab === "diario")       return renderDiario(dia, hora, grado, materia);
  if (tab === "seguimiento")  return renderSeguimiento(dia, hora, grado, materia);
  if (tab === "notas")        return renderNotas(dia, hora, grado, materia);
  if (tab === "plan")         return renderPlan(dia, hora, grado, materia);
  return "";
}

// ---- DIARIO ----
function renderDiario(dia, hora, grado, materia) {
  const d = Storage.getDiario(dia, grado, hora, materia);
  guiaTerminadaVal = d.guiaTerminada;
  return `
    <div class="tab-panel">
      <div class="info-badges">
        <div class="info-badge"><span class="ib-label">Día</span><span class="ib-value">${dia}</span></div>
        <div class="info-badge"><span class="ib-label">Grado</span><span class="ib-value">${GRADOS_LABEL[grado]}</span></div>
        <div class="info-badge"><span class="ib-label">Hora</span><span class="ib-value">${hora.split(" ")[0]}</span></div>
        <div class="info-badge"><span class="ib-label">Docente</span><span class="ib-value" style="font-size:.7rem">${currentUser.name.split(" ")[0]}</span></div>
      </div>
      <div class="form-group">
        <label class="form-label">Tema visto hoy</label>
        <input class="form-input" id="tema-visto" type="text" placeholder="Ej: Ecuaciones de primer grado..." value="${d.temaVisto||''}">
      </div>
      <div class="form-group">
        <label class="form-label">Descripción / desarrollo de la clase</label>
        <textarea class="form-textarea" id="descripcion" placeholder="¿Qué se hizo? ¿Cómo respondió el grupo? ¿Hasta dónde se llegó?">${d.descripcion||''}</textarea>
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
        <input type="range" class="avance-slider" id="avance-range" min="0" max="100" step="5" value="${d.avancePorcentaje||50}"
          oninput="document.getElementById('avance-val').textContent=this.value+'%'">
      </div>
      <button class="save-btn" onclick="saveDiario()">💾 Guardar diario</button>
    </div>
  `;
}

function setGuia(v) {
  guiaTerminadaVal = v;
  document.getElementById("guia-si").classList.toggle("active", v === true);
  document.getElementById("guia-no").classList.toggle("active", v === false);
  document.getElementById("pendiente-wrap").style.display = v === false ? "block" : "none";
}

function saveDiario() {
  if (!activeCell) return;
  const { dia, hora, grado, materia } = activeCell;
  const existing = Storage.getDiario(dia, grado, hora, materia);
  Storage.saveDiario(dia, grado, hora, materia, {
    ...existing,
    temaVisto:          document.getElementById("tema-visto")?.value || "",
    descripcion:        document.getElementById("descripcion")?.value || "",
    observacionGeneral: document.getElementById("obs-general")?.value || "",
    guiaTerminada:      guiaTerminadaVal,
    guiaPendiente:      document.getElementById("guia-pendiente")?.value || "",
    avancePorcentaje:   parseInt(document.getElementById("avance-range")?.value || 50),
  }, currentUser.id);
  showToast("✓ Diario guardado");
  renderSchedule(dia);
  setTimeout(() => {
    document.querySelectorAll(".class-cell").forEach(td => {
      if (td.dataset.dia===dia && td.dataset.hora===hora && td.dataset.grado===grado) td.classList.add("selected");
    });
  }, 60);
}

// ---- SEGUIMIENTO ----
function renderSeguimiento(dia, hora, grado, materia) {
  const d = Storage.getDiario(dia, grado, hora, materia);
  const temas = Storage.getTemasList(materia);
  const idx = d.proximoTemaIdx !== undefined ? d.proximoTemaIdx : 0;
  const proximo = temas[idx] || "⚠ Sin malla curricular. Ve a Admin → Malla Curricular.";
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
        <div class="seg-header"><span>🎯</span><h4>Próximo tema (desde malla)</h4></div>
        <div class="siguiente-tema">${proximo}</div>
        ${temas.length ? `<div class="tema-nav">${temas.map((t,i) => `
          <button class="tema-chip ${i===idx?'active':''}" onclick="setProximoTema(${i})">${i+1}. ${t.length>28?t.substring(0,28)+'…':t}</button>
        `).join("")}</div>` : `<p class="hint-text">Carga la malla desde Admin → Malla Curricular</p>`}
      </div>
      <button class="save-btn" onclick="saveSeguimiento()">💾 Guardar seguimiento</button>
    </div>
  `;
}

function setProximoTema(idx) {
  if (!activeCell) return;
  const { dia, hora, grado, materia } = activeCell;
  const existing = Storage.getDiario(dia, grado, hora, materia);
  Storage.saveDiario(dia, grado, hora, materia, { ...existing, proximoTemaIdx: idx }, currentUser.id);
  const temas = Storage.getTemasList(materia);
  document.querySelector(".siguiente-tema").textContent = temas[idx] || "—";
  document.querySelectorAll(".tema-chip").forEach((c,i) => c.classList.toggle("active", i===idx));
  showToast("✓ Próximo tema actualizado");
}

function saveSeguimiento() {
  if (!activeCell) return;
  const { dia, hora, grado, materia } = activeCell;
  const existing = Storage.getDiario(dia, grado, hora, materia);
  Storage.saveDiario(dia, grado, hora, materia, {
    ...existing,
    temasPasados:    document.getElementById("temas-pasados")?.value || "",
    temasPendientes: document.getElementById("temas-pendientes")?.value || "",
  }, currentUser.id);
  showToast("✓ Seguimiento guardado");
}

// ---- NOTAS ----
function renderNotas(dia, hora, grado, materia) {
  const lista = Storage.getEstudiantes(grado);
  if (!lista.length) return `<div class="tab-panel"><div class="empty-state">Sin estudiantes en ${GRADOS_LABEL[grado]}.<br><small>Ve a <strong>Admin → Estudiantes</strong> para agregarlos.</small></div></div>`;
  const rows = lista.map((est, i) => {
    const n = Storage.getNota(dia, grado, hora, materia, est.id);
    const estadoActual = n.estado || "normal";
    const estadoBtns = Object.entries(ESTADOS_CLASE).map(([key, cfg]) => `
      <button class="estado-btn ${estadoActual===key?'active':''}"
        style="${estadoActual===key?`background:${cfg.color};color:#fff;border-color:${cfg.color}`:''}"
        title="${cfg.label}" onclick="setEstadoEst('${est.id}',this,'${key}','${dia}','${hora}','${grado}','${materia}')">${cfg.icon}</button>
    `).join("");
    return `<tr class="student-row" id="row-${est.id}">
      <td class="student-num">${est.numero}</td>
      <td class="student-name">${est.nombre}</td>
      <td class="estado-cell">${estadoBtns}</td>
      <td><input class="nota-input" type="number" min="0" max="5" step="0.1" value="${n.nota||''}" placeholder="—"
        onchange="quickSaveNota('${est.id}','${dia}','${hora}','${grado}','${materia}',this.value,document.getElementById('obs-${i}').value)"></td>
      <td><input class="obs-input" id="obs-${i}" type="text" placeholder="Observación..." value="${n.observacion||''}"
        onblur="quickSaveNota('${est.id}','${dia}','${hora}','${grado}','${materia}',document.querySelectorAll('.nota-input')[${i}].value,this.value)"></td>
    </tr>`;
  }).join("");
  return `<div class="tab-panel notas-panel">
    <div class="notas-header">
      <span class="notas-count">${lista.length} estudiantes · ${GRADOS_LABEL[grado]}</span>
      <div class="notas-actions">
        <button class="icon-btn-act" onclick="marcarTodos('notropajo','${dia}','${hora}','${grado}','${materia}')">✗ No trabajaron</button>
        <button class="icon-btn-act exp" onclick="exportNotas('${dia}','${hora}','${grado}','${materia}')">⬇ CSV</button>
      </div>
    </div>
    <div class="estados-legend">${Object.entries(ESTADOS_CLASE).map(([k,v]) => `<span class="el-item" style="color:${v.color}">${v.icon} ${v.label}</span>`).join("")}</div>
    <div class="table-scroll"><table class="notas-table">
      <thead><tr><th>#</th><th>Nombre</th><th>Estado</th><th>Nota</th><th>Observación</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    <div class="promedio-bar"><span>Promedio:</span><strong id="promedio-display">—</strong><button class="calc-btn" onclick="calcPromedio()">Calcular</button></div>
  </div>`;
}

function setEstadoEst(estId, btn, estado, dia, hora, grado, materia) {
  const n = Storage.getNota(dia, grado, hora, materia, estId);
  const nuevoEstado = n.estado === estado ? "normal" : estado;
  Storage.saveNota(dia, grado, hora, materia, estId, { ...n, estado: nuevoEstado });
  const row = document.getElementById(`row-${estId}`);
  row.querySelectorAll(".estado-btn").forEach((b, i) => {
    const key = Object.keys(ESTADOS_CLASE)[i];
    const cfg = ESTADOS_CLASE[key];
    b.classList.toggle("active", key === nuevoEstado);
    b.style.background   = key === nuevoEstado ? cfg.color : "";
    b.style.color        = key === nuevoEstado ? "#fff" : "";
    b.style.borderColor  = key === nuevoEstado ? cfg.color : "";
  });
}

function quickSaveNota(estId, dia, hora, grado, materia, nota, obs) {
  const existing = Storage.getNota(dia, grado, hora, materia, estId);
  Storage.saveNota(dia, grado, hora, materia, estId, { ...existing, nota, observacion: obs });
}

function marcarTodos(estado, dia, hora, grado, materia) {
  Storage.getEstudiantes(grado).forEach(est => {
    const n = Storage.getNota(dia, grado, hora, materia, est.id);
    Storage.saveNota(dia, grado, hora, materia, est.id, { ...n, estado });
  });
  switchTab("notas", null);
  showToast("✓ Todos marcados");
}

function calcPromedio() {
  const vals = [...document.querySelectorAll(".nota-input")].map(i => parseFloat(i.value)).filter(v => !isNaN(v));
  if (!vals.length) return;
  document.getElementById("promedio-display").textContent = (vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(2);
}

function exportNotas(dia, hora, grado, materia) {
  const lista = Storage.getEstudiantes(grado);
  let csv = "No,Nombre,Estado,Nota,Observación\n";
  lista.forEach(est => {
    const n = Storage.getNota(dia, grado, hora, materia, est.id);
    csv += `${est.numero},"${est.nombre}","${ESTADOS_CLASE[n.estado||"normal"]?.label||"Normal"}","${n.nota||''}","${n.observacion||''}"\n`;
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], {type:"text/csv"}));
  a.download = `notas_${grado}_${materia.replace(/ /g,"_")}_${dia}.csv`;
  a.click();
  showToast("✓ CSV exportado");
}

// ---- PLAN ----
function renderPlan(dia, hora, grado, materia) {
  const d = Storage.getDiario(dia, grado, hora, materia);
  return `<div class="tab-panel">
    <div class="form-group">
      <label class="form-label">Plan del periodo</label>
      <textarea class="form-textarea tall" id="plan-periodo" placeholder="Objetivos, competencias, logros del periodo...">${d.planPeriodo||''}</textarea>
    </div>
    <div class="form-group">
      <label class="form-label">Logros esperados</label>
      <input class="form-input" id="logros" type="text" placeholder="Ej: El estudiante analiza y resuelve..." value="${d.logros||''}">
    </div>
    <div class="upload-zone" onclick="document.getElementById('file-upload').click()">
      <input type="file" id="file-upload" accept=".pdf,.doc,.docx,.pptx" style="display:none" onchange="handleFileUpload(event)">
      <span class="upload-icon">📄</span>
      <span class="upload-text">Subir guía o material</span>
      <span class="upload-sub">PDF, Word, PPT</span>
      <div id="file-name" class="file-name">${d.fileName?`📎 ${d.fileName}`:""}</div>
    </div>
    <button class="save-btn" onclick="savePlan()">💾 Guardar plan</button>
  </div>`;
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file || !activeCell) return;
  const { dia, hora, grado, materia } = activeCell;
  const existing = Storage.getDiario(dia, grado, hora, materia);
  Storage.saveDiario(dia, grado, hora, materia, { ...existing, fileName: file.name }, currentUser.id);
  document.getElementById("file-name").textContent = `📎 ${file.name}`;
  showToast(`✓ Archivo registrado`);
}

function savePlan() {
  if (!activeCell) return;
  const { dia, hora, grado, materia } = activeCell;
  const existing = Storage.getDiario(dia, grado, hora, materia);
  Storage.saveDiario(dia, grado, hora, materia, {
    ...existing,
    planPeriodo: document.getElementById("plan-periodo")?.value || "",
    logros:      document.getElementById("logros")?.value || "",
  }, currentUser.id);
  showToast("✓ Plan guardado");
}

function renderLegend() {
  document.getElementById("legend-items").innerHTML = Object.entries(MATERIAS_CONFIG)
    .filter(([k]) => !["DESCANSO","ALMUERZO"].includes(k))
    .map(([n, cfg]) => `<span class="legend-item" style="--lc:${cfg.color};--lt:${cfg.text}">${cfg.icon} ${n}</span>`)
    .join("");
}

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2800);
}

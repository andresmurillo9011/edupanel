// ============================================================
// ADMIN.JS — Panel de administración I.E.R. Santiago de la Selva
// Usa: Auth (auth.js) · DB (db.js) · data.js
// ============================================================

let editingUserId    = null;
let asignacionesTemp = [];
let mallaActual      = null;

// ============================================================
// INIT
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const admin = Auth.requireAdmin();
  if (!admin) return;

  document.getElementById("admin-name").textContent = admin.name;
  poblarMallaMateriaSel();
  renderAreasGrado();
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
// DOCENTES
// ============================================================
function renderAreasGrado() {
  const grado     = document.getElementById("asig-grado-sel")?.value;
  const container = document.getElementById("asig-areas-grid");
  if (!container) return;
  const yaAsig = asignacionesTemp.filter(a => a.grado === grado).map(a => a.area);
  container.innerHTML = Object.keys(MATERIAS_CONFIG)
    .filter(m => !["DESCANSO","ALMUERZO"].includes(m)).sort()
    .map(m => {
      const cfg = MATERIAS_CONFIG[m];
      const sel = yaAsig.includes(m);
      return `<label class="asig-area-chk ${sel?'selected':''}" data-area="${m}">
        <input type="checkbox" ${sel?'checked':''} onchange="toggleAreaChk(this)">
        <span>${cfg.icon}</span><span>${m}</span></label>`;
    }).join("");
}

// FIX: toggleAreaChk ahora usa el checkbox correctamente
function toggleAreaChk(checkbox) {
  const label = checkbox.closest('.asig-area-chk');
  label.classList.toggle("selected", checkbox.checked);
}

function seleccionarTodasAreas() {
  document.querySelectorAll(".asig-area-chk").forEach(el => {
    el.classList.add("selected");
    el.querySelector("input").checked = true;
  });
}
function deseleccionarTodasAreas() {
  document.querySelectorAll(".asig-area-chk").forEach(el => {
    el.classList.remove("selected");
    el.querySelector("input").checked = false;
  });
}

function agregarGradoCompleto() {
  const grado = document.getElementById("asig-grado-sel").value;
  const areas = [...document.querySelectorAll(".asig-area-chk input:checked")]
    .map(el => el.closest('.asig-area-chk').dataset.area);
  if (!areas.length) { showToast("⚠ Selecciona al menos un área"); return; }
  asignacionesTemp = asignacionesTemp.filter(a => a.grado !== grado);
  areas.forEach(area => asignacionesTemp.push({ grado, area }));
  renderAsignacionesLista();
  showToast(`✓ ${GRADOS_LABEL[grado]}: ${areas.length} áreas asignadas`);
}

function quitarAreaAsig(grado, area) {
  asignacionesTemp = asignacionesTemp.filter(a => !(a.grado===grado && a.area===area));
  renderAsignacionesLista();
  if (document.getElementById("asig-grado-sel")?.value === grado) renderAreasGrado();
}

function quitarGradoAsig(grado) {
  asignacionesTemp = asignacionesTemp.filter(a => a.grado !== grado);
  renderAsignacionesLista();
  if (document.getElementById("asig-grado-sel")?.value === grado) renderAreasGrado();
}

function renderAsignacionesLista() {
  const cont  = document.getElementById("asig-lista");
  const empty = document.getElementById("asig-empty");
  cont.querySelectorAll(".asig-tag").forEach(t => t.remove());
  if (!asignacionesTemp.length) { empty.style.display="block"; return; }
  empty.style.display = "none";
  const porGrado = {};
  asignacionesTemp.forEach(a => {
    if (!porGrado[a.grado]) porGrado[a.grado] = [];
    porGrado[a.grado].push(a.area);
  });
  Object.entries(porGrado).forEach(([grado, areas]) => {
    const row = document.createElement("div"); row.className = "asig-tag";
    row.innerHTML = `
      <span class="asig-grado-label">${GRADOS_LABEL[grado]}</span>
      <div class="asig-areas">
        ${areas.map(area=>`
          <span class="asig-area-chip" style="--ac:${MATERIAS_CONFIG[area]?.color||'#888'}">
            ${MATERIAS_CONFIG[area]?.icon||''} ${area}
            <button class="asig-remove" onclick="quitarAreaAsig('${grado}','${area}')">×</button>
          </span>`).join("")}
      </div>
      <button class="asig-remove-grado" onclick="quitarGradoAsig('${grado}')" title="Quitar grado">🗑</button>`;
    cont.appendChild(row);
  });
}

function renderDocentesGrid() {
  const users = Auth.getAllUsers();
  const grid  = document.getElementById("docentes-grid");
  grid.innerHTML = users.map(u => {
    const asigs = u.asignaciones || [];
    const porGrado = {};
    asigs.forEach(a => { if(!porGrado[a.grado]) porGrado[a.grado]=[]; porGrado[a.grado].push(a.area); });
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
        ${u.role!=='admin' ? `
          <div class="doc-asignaciones">
            ${Object.keys(porGrado).length
              ? Object.entries(porGrado).map(([g,areas])=>`
                  <div class="doc-grado-row">
                    <span class="doc-grado-pill">${GRADOS_LABEL[g]}</span>
                    <div class="doc-areas-wrap">
                      ${areas.map(a=>`<span class="tag mat" style="--mc:${MATERIAS_CONFIG[a]?.color||'#888'}">${MATERIAS_CONFIG[a]?.icon||''} ${a}</span>`).join("")}
                    </div>
                  </div>`).join("")
              : '<span class="tag empty">Sin asignaciones</span>'}
          </div>
          <div class="doc-actions">
            <button class="icon-btn edit" onclick="editDocente('${u.id}')">✏️ Editar</button>
            <button class="icon-btn del"  onclick="deleteDocente('${u.id}')">🗑 Eliminar</button>
          </div>
          <div style="background:#0A1A0C;border:1px solid #1A3D1E;border-radius:7px;padding:7px 10px;margin-top:4px;font-size:.68rem">
            ${u.emailEduclass
              ? `<span style="color:#66BB6A">✨ EduClass:</span> <span style="color:#E8EEF8">${u.emailEduclass}</span>`
              : `<span style="color:#3A5580">✨ Sin credenciales EduClass</span>`}
          </div>`
        : `<div class="doc-admin-note">Acceso completo al sistema</div>`}
      </div>`;
  }).join("");
}

function openModal(id)  { document.getElementById(id).style.display = "flex"; }

function closeModal(id) {
  document.getElementById(id).style.display = "none";
  if (id === "modal-docente") {
    editingUserId = null; asignacionesTemp = [];
    ["doc-name","doc-username","doc-pass","doc-email","doc-email-educlass","doc-pass-educlass","edit-user-id"]
      .forEach(i => { const el=document.getElementById(i); if(el) el.value=""; });
    document.getElementById("modal-doc-error").style.display = "none";
    renderAsignacionesLista(); renderAreasGrado();
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
  const ecEmail = document.getElementById("doc-email-educlass");
  const ecPass  = document.getElementById("doc-pass-educlass");
  if(ecEmail) ecEmail.value = user.emailEduclass || "";
  if(ecPass)  ecPass.value  = user.passEduclass  || "";
  renderAsignacionesLista(); renderAreasGrado();
  openModal("modal-docente");
}

async function saveDocente() {
  const name          = document.getElementById("doc-name").value.trim();
  const username      = document.getElementById("doc-username").value.trim();
  const pass          = document.getElementById("doc-pass").value.trim();
  const email         = document.getElementById("doc-email").value.trim();
  const emailEduclass = document.getElementById("doc-email-educlass")?.value.trim() || "";
  const passEduclass  = document.getElementById("doc-pass-educlass")?.value.trim()  || "";
  const errEl         = document.getElementById("modal-doc-error");

  if (!name||!username||!pass) {
    errEl.textContent="Nombre, usuario y contraseña son obligatorios";
    errEl.style.display="block"; return;
  }
  errEl.style.display = "none";

  const grados   = [...new Set(asignacionesTemp.map(a=>a.grado))];
  const materias = [...new Set(asignacionesTemp.map(a=>a.area))];
  const payload  = { name, username, password:pass, email, emailEduclass, passEduclass, asignaciones:[...asignacionesTemp], grados, materias };

  // Registrar en EduClass si tiene credenciales
  if (emailEduclass && passEduclass && !editingUserId) {
    showToast("⏳ Registrando en EduClass...");
    try {
      const r = await fetch("https://educlass-backend-4kk0.onrender.com/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre:     name,
          email:      emailEduclass,
          password:   passEduclass,
          institucion:"I.E.R. Santiago de la Selva",
          cargo:      "Docente",
          ciudad:     "Valparaíso"
        })
      });
      const d = await r.json();
      if (r.ok) showToast("✅ Registrado en EduClass");
      else if ((d.mensaje||"").includes("ya")) showToast("ℹ️ Correo EduClass ya registrado");
      else showToast("⚠️ EduClass: " + (d.mensaje||"sin respuesta"));
    } catch(e) {
      showToast("⚠️ No se pudo conectar a EduClass");
    }
  }

  // Guardar en EduPanel (siempre con role:"docente")
  let savedUserId = editingUserId;
  if (editingUserId) {
    Auth.updateUser(editingUserId, { ...payload, role: "docente" });
    showToast("✓ Docente actualizado");
  } else {
    const r = Auth.createUser({ ...payload, role:"docente" });
    if (!r.ok) { errEl.textContent=r.message; errEl.style.display="block"; return; }
    savedUserId = r.user.id;
    showToast("✓ Docente creado");
  }

  // Guardar asignaciones en el backend de EduClass para que el docente las vea en su horario
  if (emailEduclass && asignacionesTemp.length > 0) {
    try {
      // Primero obtener el ID del usuario en EduClass
      const API = "https://educlass-backend-4kk0.onrender.com";
      const tok = localStorage.getItem("edutoken") || "";
      // Buscar el usuario por email en EduClass
      const rUsers = await fetch(`${API}/todos-docentes-asignaciones`, {
        headers: { "Authorization": `Bearer ${tok}` }
      });
      if (rUsers.ok) {
        const dUsers = await rUsers.json();
        const ecUser = (dUsers.docentes || []).find(u => u.email === emailEduclass);
        if (ecUser) {
          await fetch(`${API}/asignaciones/${ecUser.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${tok}` },
            body: JSON.stringify({ asignaciones: asignacionesTemp })
          });
          showToast("✅ Asignaciones sincronizadas en EduClass");
        }
      }
    } catch(e) {
      console.warn("No se pudieron sincronizar asignaciones:", e.message);
    }
  }

  closeModal("modal-docente");
  renderDocentesGrid();
}

function deleteDocente(id) {
  if (!confirm("¿Eliminar este docente?")) return;
  Auth.deleteUser(id); renderDocentesGrid(); showToast("✓ Docente eliminado");
}

// ============================================================
// ESTUDIANTES
// ============================================================
async function renderGradosResumen() {
  const cont = document.getElementById("grados-resumen");
  const counts = await Promise.all(GRADOS.map(async g => ({ g, n:(await DB.getEstudiantes(g)).length })));
  cont.innerHTML = counts.map(({g,n})=>`
    <div class="grado-resumen-chip ${n?'':'empty-chip'}" onclick="selGrado('${g}')">
      <span class="gr-label">${GRADOS_LABEL[g]}</span>
      <span class="gr-count">${n}</span>
    </div>`).join("");
}

function selGrado(grado) {
  document.getElementById("grado-select-est").value = grado;
  renderEstudiantesList();
}

async function renderEstudiantesList() {
  const grado = document.getElementById("grado-select-est").value;
  const lista = await DB.getEstudiantes(grado);
  const cont  = document.getElementById("estudiantes-list");
  document.querySelectorAll(".grado-resumen-chip").forEach((c,i)=>c.classList.toggle("active-chip",GRADOS[i]===grado));
  if (!lista.length) {
    cont.innerHTML=`<div class="empty-state">Sin estudiantes en ${GRADOS_LABEL[grado]}<br><small>Agrega manualmente o importa CSV</small></div>`; return;
  }
  cont.innerHTML = `
    <div class="est-list-header">
      <span class="est-list-title">${GRADOS_LABEL[grado]} — ${lista.length} estudiantes</span>
      <button class="icon-btn-act exp" onclick="exportarEst('${grado}')">⬇ CSV</button>
    </div>
    <table class="est-table">
      <thead><tr><th>#</th><th>Nombre completo</th><th></th></tr></thead>
      <tbody>${lista.map(e=>`
        <tr>
          <td class="est-num">${e.numero}</td>
          <td class="est-name-cell">
            <span id="dn-${e.id}">${e.nombre}</span>
            <input class="est-edit-input" id="di-${e.id}" value="${e.nombre}" style="display:none"
              onkeydown="if(event.key==='Enter')confirmEditEst('${e.id}');if(event.key==='Escape')cancelEditEst('${e.id}')">
          </td>
          <td class="est-acts">
            <button class="icon-btn-sm" style="color:#34D399;border-color:#059669" onclick="crearCredencialesEst(this)">🔑</button>
            <button class="icon-btn-sm edit" onclick="toggleEditEst('${e.id}')">✏️</button>
            <button class="icon-btn-sm del"  onclick="delEst('${e.id}')">🗑</button>
          </td>
        </tr>`).join("")}
      </tbody>
    </table>`;
}

function toggleEditEst(id) {
  const d=document.getElementById(`dn-${id}`), i=document.getElementById(`di-${id}`);
  if(i.style.display==="none"){d.style.display="none";i.style.display="inline-block";i.focus();i.select();}
  else confirmEditEst(id);
}
function cancelEditEst(id) {
  document.getElementById(`dn-${id}`).style.display="";
  document.getElementById(`di-${id}`).style.display="none";
}
async function confirmEditEst(id) {
  const input = document.getElementById(`di-${id}`);
  const name  = input.value.trim();
  if (name) { await DB.updateEstudiante(id, { nombre:name }); showToast("✓ Nombre actualizado"); }
  renderEstudiantesList();
}
async function delEst(id) {
  if (!confirm("¿Eliminar estudiante?")) return;
  await DB.deleteEstudiante(id); renderEstudiantesList(); renderGradosResumen();
}
function abrirModalEst() {
  document.getElementById("modal-est-grado").value = document.getElementById("grado-select-est").value;
  openModal("modal-est");
}
function abrirModalImport() {
  document.getElementById("import-grado-sel").value = document.getElementById("grado-select-est").value;
  openModal("modal-import");
}
async function saveEstudiante() {
  const grado  = document.getElementById("modal-est-grado").value;
  const nombre = document.getElementById("est-name").value.trim();
  const num    = document.getElementById("est-num").value;
  if (!nombre) { showToast("⚠ Ingresa el nombre"); return; }
  await DB.addEstudiante(grado, nombre, num?parseInt(num):null);
  closeModal("modal-est");
  document.getElementById("est-name").value = ""; document.getElementById("est-num").value = "";
  document.getElementById("grado-select-est").value = grado;
  renderEstudiantesList(); renderGradosResumen();
  showToast(`✓ Estudiante agregado a ${GRADOS_LABEL[grado]}`);
}
function previewCSV(e) {
  const f=e.target.files[0]; if(!f) return;
  const r=new FileReader(); r.onload=ev=>{document.getElementById("csv-paste").value=ev.target.result;livePreviewCSV(ev.target.result);}; r.readAsText(f,"UTF-8");
}
function livePreviewCSV(text) {
  const nombres=parseCSV(text);
  const p=document.getElementById("csv-preview");
  if(!nombres.length){p.style.display="none";return;}
  p.style.display="block";
  p.innerHTML=`<strong>${nombres.length} nombres:</strong><br>${nombres.slice(0,6).map(n=>`<span class="csv-name-pill">${n}</span>`).join("")}${nombres.length>6?`<span class="csv-more">+${nombres.length-6} más</span>`:""}`;
}
function parseCSV(text) {
  return text.split(/\r?\n/).map(line=>{
    if(!line.trim()) return null;
    const parts=line.split(/[,;|\t]/);
    const cands=parts.map(p=>p.replace(/"/g,"").trim()).filter(p=>p.length>1&&isNaN(p));
    return cands.sort((a,b)=>b.length-a.length)[0]||null;
  }).filter(n=>n&&n.length>2);
}
async function importarEstudiantes() {
  const grado  = document.getElementById("import-grado-sel").value;
  const text   = document.getElementById("csv-paste").value.trim();
  const nombres = parseCSV(text);
  if (!nombres.length) { showToast("⚠ No se encontraron nombres"); return; }
  const existing = await DB.getEstudiantes(grado);
  let count=0;
  for (const nombre of nombres) {
    if (!existing.find(e=>e.nombre.toLowerCase()===nombre.toLowerCase())) {
      await DB.addEstudiante(grado, nombre, existing.length+count+1); count++;
    }
  }
  closeModal("modal-import");
  document.getElementById("grado-select-est").value = grado;
  renderEstudiantesList(); renderGradosResumen();
  showToast(count>0?`✓ ${count} importados en ${GRADOS_LABEL[grado]}`:"ℹ Todos ya existían");
}
async function exportarEst(grado) {
  const lista = await DB.getEstudiantes(grado);
  const csv   = "numero,nombre\n"+lista.map(e=>`${e.numero},"${e.nombre}"`).join("\n");
  const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"})); a.download=`estudiantes_${grado}.csv`; a.click();
  showToast("✓ CSV exportado");
}

// ============================================================
// MALLA CURRICULAR
// ============================================================
function poblarMallaMateriaSel() {
  const sel = document.getElementById("malla-materia"); if(!sel) return;
  Object.keys(MATERIAS_CONFIG).filter(m=>!["DESCANSO","ALMUERZO"].includes(m)).sort().forEach(m=>{
    const opt=document.createElement("option"); opt.value=m; opt.textContent=`${MATERIAS_CONFIG[m].icon} ${m}`; sel.appendChild(opt);
  });
}

async function loadMallaData() {
  const materia = document.getElementById("malla-materia").value;
  if (!materia) { showToast("⚠ Selecciona primero un área"); return; }
  mallaActual = materia;
  const malla = await DB.getMalla(materia);
  document.getElementById("malla-p1").value = malla.p1||"";
  document.getElementById("malla-p2").value = malla.p2||"";
  document.getElementById("malla-p3").value = malla.p3||"";
  document.getElementById("malla-p4").value = malla.p4||"";
  const cfg=MATERIAS_CONFIG[materia];
  const badge=document.getElementById("malla-current-badge");
  badge.style.display="flex";
  badge.innerHTML=`<span class="badge-icon">${cfg?.icon||"📚"}</span>
    <span>Editando: <strong>${materia}</strong> — todos los grados</span>
    ${malla.updatedAt?`<span class="badge-date">${new Date(malla.updatedAt).toLocaleDateString("es-CO")}</span>`:""}`;
  document.getElementById("malla-editor").style.display="block";
  renderMallaPreviewLocal();
  renderMallaDocsList(malla);
  showToast(`✓ Malla de ${materia} cargada`);
}

async function saveMalla() {
  if (!mallaActual) { showToast("⚠ Primero carga un área"); return; }
  await DB.saveMalla(mallaActual, {
    p1:document.getElementById("malla-p1").value,
    p2:document.getElementById("malla-p2").value,
    p3:document.getElementById("malla-p3").value,
    p4:document.getElementById("malla-p4").value,
  });
  renderMallaPreviewLocal(); renderMallasResumen();
  showToast(`✓ Malla de ${mallaActual} guardada`);
}

function renderMallaPreviewLocal() {
  const temas=[
    document.getElementById("malla-p1").value,
    document.getElementById("malla-p2").value,
    document.getElementById("malla-p3").value,
    document.getElementById("malla-p4").value,
  ].join("\n").split("\n").map(t=>t.trim()).filter(Boolean);
  document.getElementById("malla-preview-list").innerHTML = temas.length
    ? temas.map((t,i)=>`<div class="preview-tema"><span class="tema-n">${i+1}</span>${t}</div>`).join("")
    : `<div class="empty-state">Sin temas aún</div>`;
}

function renderMallaDocsList(malla) {
  const archivos = malla?.archivos||[];
  const cont = document.getElementById("malla-docs-list"); if(!cont) return;
  const icons = {pdf:"📕",doc:"📘",docx:"📘",ppt:"📙",pptx:"📙",xls:"📗",xlsx:"📗"};
  if (!archivos.length) { cont.innerHTML=`<div style="font-size:.72rem;color:var(--text-muted);padding:8px">Sin documentos.</div>`; return; }
  cont.innerHTML = archivos.map(f=>`
    <div class="doc-item">
      <span class="doc-icon">${icons[f.nombre.split(".").pop().toLowerCase()]||"📄"}</span>
      <div class="doc-info"><div class="doc-name" title="${f.nombre}">${f.nombre}</div><div class="doc-meta">${f.tamaño} · ${f.fechaSubida}</div></div>
      <div class="doc-actions-row">
        <button class="doc-dl-btn" onclick="descargarDocMalla('${encodeURIComponent(f.nombre)}')">⬇</button>
        <button class="doc-del-btn" onclick="eliminarDocMalla('${encodeURIComponent(f.nombre)}')">🗑</button>
      </div>
    </div>`).join("");
}

async function subirDocMalla(event) {
  const file = event.target.files[0];
  if (!file||!mallaActual) { showToast("⚠ Primero carga un área"); return; }
  if (file.size>4*1024*1024) { showToast("⚠ El archivo supera 4MB"); return; }
  const reader = new FileReader();
  reader.onload = async e => {
    const info = { nombre:file.name, tipo:file.type, tamaño:(file.size/1024).toFixed(1)+" KB", data:e.target.result, fechaSubida:new Date().toLocaleDateString("es-CO") };
    await DB.saveMallaArchivo(mallaActual, info);
    const malla = await DB.getMalla(mallaActual);
    renderMallaDocsList(malla);
    showToast(`✓ "${file.name}" subido`);
    event.target.value="";
  };
  reader.readAsDataURL(file);
}

async function descargarDocMalla(enc) {
  const nombre = decodeURIComponent(enc);
  const malla  = await DB.getMalla(mallaActual);
  const file   = (malla.archivos||[]).find(f=>f.nombre===nombre);
  if (!file) return;
  const a=document.createElement("a"); a.href=file.data; a.download=file.nombre; a.click();
}

async function eliminarDocMalla(enc) {
  const nombre = decodeURIComponent(enc);
  if (!confirm(`¿Eliminar "${nombre}"?`)) return;
  await DB.deleteMallaArchivo(mallaActual, nombre);
  const malla = await DB.getMalla(mallaActual);
  renderMallaDocsList(malla);
  showToast("✓ Documento eliminado");
}

async function renderMallasResumen() {
  const cont = document.getElementById("mallas-guardadas-list");
  const materias = Object.keys(MATERIAS_CONFIG).filter(m=>!["DESCANSO","ALMUERZO"].includes(m)).sort();
  cont.innerHTML = "";
  for (const m of materias) {
    const malla = await DB.getMalla(m);
    const temas = DB.getTemasList(malla);
    const cfg   = MATERIAS_CONFIG[m];
    const has   = temas.length > 0;
    cont.innerHTML += `
      <div class="malla-guard-card ${has?'has-data':'no-data'}">
        <div class="mgc-top"><span class="mgc-grado">${cfg?.icon||''} ${m}</span><span class="mgc-count">${has?temas.length+' temas':'—'}</span></div>
        ${has?`<div class="mgc-temas">${temas.slice(0,3).map(t=>`<span class="mgc-tema">• ${t}</span>`).join("")}${temas.length>3?`<span class="mgc-more">+${temas.length-3} más</span>`:""}</div>`:`<div class="mgc-empty">Sin malla</div>`}
        ${malla.updatedAt?`<div class="mgc-date">${new Date(malla.updatedAt).toLocaleDateString("es-CO")}</div>`:""}
        <button class="mgc-edit-btn" onclick="editarMalla('${m}')">${has?'✏️ Editar':'+ Crear'}</button>
      </div>`;
  }
}

function editarMalla(m) {
  document.getElementById("malla-materia").value = m;
  loadMallaData();
  document.getElementById("sec-malla").scrollIntoView({behavior:"smooth"});
}

// ============================================================
// RESUMEN
// ============================================================
async function renderResumen() {
  const diarios  = await DB.allDiarios();
  const users    = Auth.getAllUsers().filter(u=>u.role==="docente");
  const estCounts = await Promise.all(GRADOS.map(g=>DB.getEstudiantes(g).then(l=>l.length)));
  const totalEst = estCounts.reduce((a,b)=>a+b,0);
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
      ${diarios.filter(d=>d&&d.updatedAt).sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt)).slice(0,12).map(d=>`
        <div class="activity-item">
          <span class="act-icon">${MATERIAS_CONFIG[d.materia]?.icon||"📋"}</span>
          <div class="act-info"><strong>${d.materia||"—"}</strong> · ${GRADOS_LABEL[d.grado]||d.grado} · ${d.dia||""} ${d.hora||""}${d.temaVisto?`<br><small>📌 ${d.temaVisto}</small>`:""}</div>
          <span class="act-time">${new Date(d.updatedAt).toLocaleDateString("es-CO")}</span>
        </div>`).join("")||`<div class="empty-state">Sin actividad aún</div>`}
    </div>`;
}


// ============================================================
// CREAR CREDENCIALES DE ESTUDIANTE
// ============================================================
async function crearCredencialesEst(btn) {
  // Obtener nombre e ID desde el DOM
  const fila = btn.closest("tr");
  const nombre = fila ? (fila.querySelector(".est-name-cell span")?.textContent?.trim() || "estudiante") : "estudiante";
  const estId = fila ? fila.querySelector(".est-name-cell span")?.id?.replace("dn-","") : Date.now().toString();
  const usuario = nombre.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, ".").replace(/[^a-z0-9.]/g, "")
    .substring(0, 20);
  const password = Math.random().toString(36).substring(2, 8);

  try {
    const r = await fetch("https://educlass-backend-4kk0.onrender.com/auth/registro-estudiante", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre, usuario, password,
        grado: document.getElementById("grado-select-est")?.value || "",
        institucion: "I.E.R. Santiago de la Selva"
      })
    });
    const d = await r.json();
    if (r.ok || (d.mensaje && d.mensaje.includes("ya existe"))) {
      showToast(`✅ Credenciales: usuario="${usuario}" pass="${password}"`);
      // Mostrar modal con credenciales
      const msg = `Credenciales para ${nombre}:

Usuario: ${usuario}
Contraseña: ${password}

¿Copiar al portapapeles?`;
      if (confirm(msg)) {
        navigator.clipboard.writeText(`Usuario: ${usuario}
Contraseña: ${password}`);
        showToast("✅ Copiado al portapapeles");
      }
    } else {
      showToast("⚠️ " + (d.mensaje || "Error creando credenciales"));
    }
  } catch(e) {
    showToast("⚠️ Sin conexión al servidor");
  }
}

// ============================================================
// TOAST
// ============================================================
function showToast(msg) {
  const t=document.getElementById("toast"); t.textContent=msg; t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),3000);
}

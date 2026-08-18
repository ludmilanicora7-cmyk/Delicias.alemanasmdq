// ═══════════════════════════════════════
// DELICIAS ALEMANAS — ADMIN.JS
// Login, productos, horarios, pedidos, negocio, backup
// ═══════════════════════════════════════

let productos = [];
let horariosEdit = [];
let filtroPedidos = "todos";
let intervaloPedidos = null;

document.addEventListener("DOMContentLoaded", async () => {
  await DA.init();

  if (await DA.isLoggedIn()) {
    mostrarPanel();
  } else {
    document.getElementById("loginBox").classList.remove("hidden");
  }

  document.getElementById("loginPass").addEventListener("keydown", e => {
    if (e.key === "Enter") intentarLogin();
  });
  document.getElementById("loginEmail").addEventListener("keydown", e => {
    if (e.key === "Enter") intentarLogin();
  });
});

// Instalable como app + funciona sin conexión una vez cargada
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}

// ===================== LOGIN =====================
async function intentarLogin() {
  const email = document.getElementById("loginEmail").value.trim();
  const pass = document.getElementById("loginPass").value;
  const btn = document.querySelector("#loginBox button");
  if (btn) { btn.disabled = true; btn.textContent = "Ingresando..."; }

  const ok = await DA.login(email, pass);

  if (btn) { btn.disabled = false; btn.textContent = "Ingresar"; }

  if (ok) {
    await DA.refrescarPedidos(); // ahora que está autenticado, puede leer los pedidos
    mostrarPanel();
  } else {
    document.getElementById("loginError").classList.remove("hidden");
  }
}

async function cerrarSesion() {
  if (intervaloPedidos) clearInterval(intervaloPedidos);
  await DA.logout();
  location.reload();
}

function mostrarPanel() {
  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("panel").classList.remove("hidden");
  initPanel();
}

function initPanel() {
  renderProductos();
  cargarHorarios();
  renderFiltros();
  renderPedidos();
  cargarNegocio();
  renderProductosManual();
  renderDiasManual();
  toggleDireccionManual();

  // Mantiene la lista de pedidos al día (por si llega un pedido nuevo
  // de un cliente mientras tenés el panel abierto).
  DA.onPedidosActualizados = renderPedidos;
  if (intervaloPedidos) clearInterval(intervaloPedidos);
  intervaloPedidos = setInterval(() => DA.refrescarPedidos(), 20000);
}

function showOk(id) {
  const el = document.getElementById(id);
  el.classList.remove("hidden");
  setTimeout(() => el.classList.add("hidden"), 2000);
}

// ===================== PRODUCTOS =====================
function renderProductos() {
  productos = DA.getProductos();
  const cont = document.getElementById("listaProductos");
  cont.innerHTML = "";

  productos.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "prod-item";

    div.innerHTML = `
      <div style="display:flex;gap:10px;align-items:center;width:100%">

        <img src="${p.imagen}" style="width:50px;height:50px;object-fit:cover;border-radius:8px" onerror="this.style.opacity=0.2"/>

        <div style="flex:1">
          <input value="${p.nombre}" onchange="editProd(${i}, 'nombre', this.value)"/>
          <input type="number" value="${p.precio}" onchange="editProd(${i}, 'precio', this.value)"/>
          <input value="${p.imagen}" onchange="editProd(${i}, 'imagen', this.value)"/>

          <label>
            <input type="checkbox" ${p.activo ? "checked" : ""} onchange="toggleProd(${i})"/>
            Activo
          </label>
        </div>

        <button onclick="delProd(${i})">❌</button>
      </div>
    `;

    cont.appendChild(div);
  });

  if (document.getElementById("manualProductos")) renderProductosManual();
}

function editProd(i, key, val) {
  productos[i][key] = key === "precio" ? Number(val) : val;
  DA.saveProductos(productos);
}

function toggleProd(i) {
  productos[i].activo = !productos[i].activo;
  DA.saveProductos(productos);
}

function delProd(i) {
  if (!confirm("¿Eliminar este producto?")) return;
  productos.splice(i, 1);
  DA.saveProductos(productos);
  renderProductos();
}

function agregarProducto() {
  const nombre = document.getElementById("nombre").value.trim();
  const precio = document.getElementById("precio").value;
  const imagen = document.getElementById("imagen").value.trim() || "img/producto.jpg";

  if (!nombre || !precio) {
    alert("Completá al menos el nombre y el precio.");
    return;
  }

  productos = DA.getProductos();
  productos.push({
    id: DA.nuevoIdProducto(),
    nombre,
    precio: Number(precio),
    imagen,
    activo: true
  });
  DA.saveProductos(productos);

  document.getElementById("nombre").value = "";
  document.getElementById("precio").value = "";
  document.getElementById("imagen").value = "";

  renderProductos();
}

// ===================== HORARIOS =====================
function cargarHorarios() {
  horariosEdit = DA.getHorarios().map(d => ({ ...d, franjas: d.franjas.map(f => ({ ...f })) }));
  renderHorarios();
}

function renderHorarios() {
  const cont = document.getElementById("horariosConfig");
  cont.innerHTML = "";

  horariosEdit.forEach((dia, di) => {
    const div = document.createElement("div");
    div.className = "dia-row";
    div.innerHTML = `
      <div class="dia-header">
        <label class="switch">
          <input type="checkbox" ${dia.activo ? "checked" : ""} onchange="toggleDiaActivo(${di}, this.checked)"/>
          <span class="slider"></span>
        </label>
        <strong>${dia.nombre}</strong>
      </div>
      <div class="franjas-list" id="franjas-${di}"></div>
      <button class="btn-mini" onclick="agregarFranja(${di})" type="button">+ Agregar franja horaria</button>
    `;
    cont.appendChild(div);
    renderFranjas(di);
  });
}

function renderFranjas(di) {
  const dia = horariosEdit[di];
  const cont = document.getElementById("franjas-" + di);
  cont.innerHTML = "";

  if (!dia.franjas.length) {
    cont.innerHTML = `<p class="ayuda-mini">Sin franjas cargadas todavía</p>`;
    return;
  }

  dia.franjas.forEach((f, fi) => {
    const row = document.createElement("div");
    row.className = "franja-row";
    row.innerHTML = `
      <input type="time" value="${f.inicio || ""}" onchange="editarFranja(${di}, ${fi}, 'inicio', this.value)"/>
      <span>a</span>
      <input type="time" value="${f.fin || ""}" onchange="editarFranja(${di}, ${fi}, 'fin', this.value)"/>
      <button class="btn-x" onclick="quitarFranja(${di}, ${fi})" type="button">❌</button>
    `;
    cont.appendChild(row);
  });
}

function toggleDiaActivo(di, val) {
  horariosEdit[di].activo = val;
}

function agregarFranja(di) {
  horariosEdit[di].franjas.push({ inicio: "09:00", fin: "13:00" });
  renderFranjas(di);
}

function quitarFranja(di, fi) {
  horariosEdit[di].franjas.splice(fi, 1);
  renderFranjas(di);
}

function editarFranja(di, fi, key, val) {
  horariosEdit[di].franjas[fi][key] = val;
}

function guardarHorarios() {
  // Validación simple: fin debe ser mayor a inicio
  for (const dia of horariosEdit) {
    for (const f of dia.franjas) {
      if (f.inicio && f.fin && f.inicio >= f.fin) {
        alert(`En ${dia.nombre} hay una franja donde el horario de fin no es posterior al de inicio.`);
        return;
      }
    }
  }
  DA.saveHorarios(horariosEdit);
  showOk("horariosOk");
}

// ===================== PEDIDOS =====================
function renderFiltros() {
  const cont = document.getElementById("filtrosPedidos");
  const opciones = [
    ["todos", "Todos"],
    ["pendiente", "Pendientes"],
    ["entregado", "Entregados"],
    ["cancelado", "Cancelados"]
  ];
  cont.innerHTML = opciones.map(([val, label]) =>
    `<button class="filtro-btn ${filtroPedidos === val ? "activo" : ""}" onclick="setFiltro('${val}')" type="button">${label}</button>`
  ).join("");
}

function setFiltro(val) {
  filtroPedidos = val;
  renderFiltros();
  renderPedidos();
}

function renderPedidos() {
  const cont = document.getElementById("listaPedidos");
  let pedidos = DA.getPedidos();
  if (filtroPedidos !== "todos") pedidos = pedidos.filter(p => p.estado === filtroPedidos);

  if (!pedidos.length) {
    cont.innerHTML = `<p class="ayuda">No hay pedidos para mostrar.</p>`;
    return;
  }

  cont.innerHTML = pedidos.map(renderPedidoCard).join("");
}

function renderPedidoCard(p) {
  const fechaFmt = new Date(p.fecha + "T12:00:00").toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" });
  const items = p.items.map(i => `${i.cantidad}× ${i.nombre}`).join(", ");
  const telCliente = (p.cliente.tel || "").replace(/\D/g, "");
  const msg = encodeURIComponent(`Hola ${p.cliente.nombre}! Te escribo por tu pedido de Delicias Alemanas para el ${fechaFmt} a las ${p.hora}hs.`);

  return `
    <div class="pedido-card estado-${p.estado}">
      <div class="pedido-top">
        <strong>${p.cliente.nombre}</strong>
        <span class="badge badge-${p.estado}">${p.estado}</span>
      </div>
      <div class="pedido-info">${items}</div>
      <div class="pedido-info">📅 ${fechaFmt} · 🕐 ${p.hora}hs · ${p.cliente.tipoEntrega === "entrega" ? "🚚 " + (p.cliente.direccion || "") : "🏠 Retiro en local"}</div>
      <div class="pedido-info">Total: $${Number(p.total).toLocaleString("es-AR")}</div>
      <div class="pedido-botones">
        <a class="btn-mini" href="https://wa.me/${telCliente}?text=${msg}" target="_blank">💬 WhatsApp</a>
        ${p.estado !== "entregado" ? `<button class="btn-mini" onclick="cambiarEstadoPedido('${p.id}','entregado')" type="button">✅ Entregado</button>` : ""}
        ${p.estado !== "cancelado" ? `<button class="btn-mini" onclick="cambiarEstadoPedido('${p.id}','cancelado')" type="button">🚫 Cancelar</button>` : ""}
        <button class="btn-mini btn-mini-danger" onclick="eliminarPedido('${p.id}')" type="button">🗑️</button>
      </div>
    </div>
  `;
}

function cambiarEstadoPedido(id, estado) {
  DA.actualizarEstadoPedido(id, estado);
  renderPedidos();
}

function eliminarPedido(id) {
  if (!confirm("¿Eliminar este pedido?")) return;
  DA.eliminarPedido(id);
  renderPedidos();
}

// ===================== NEGOCIO =====================
function cargarNegocio() {
  const n = DA.getNegocio();
  document.getElementById("negocioWhatsapp").value = n.whatsapp;
  document.getElementById("negocioInstagram").value = n.instagram;
}

function guardarNegocio() {
  DA.saveNegocio({
    nombre: "Delicias Alemanas",
    whatsapp: document.getElementById("negocioWhatsapp").value.trim(),
    instagram: document.getElementById("negocioInstagram").value.trim()
  });
  showOk("negocioOk");
}

// ===================== BACKUP =====================
function exportarBackup() {
  const data = DA.exportBackup();
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const fecha = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `delicias-backup-${fecha}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importarBackup(ev) {
  const file = ev.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const ok = document.getElementById("backupOk");
      ok.textContent = "Restaurando (puede tardar unos segundos)...";
      ok.classList.remove("hidden");
      await DA.importBackup(reader.result);
      ok.textContent = "Backup restaurado ✅ Recargando...";
      setTimeout(() => location.reload(), 1200);
    } catch (e) {
      alert("No se pudo restaurar el backup: " + e.message);
    }
  };
  reader.readAsText(file);
  ev.target.value = "";
}

// ===================== SEGURIDAD =====================
async function cambiarPass() {
  const val = document.getElementById("nuevaPass").value.trim();
  if (!val) return;
  if (val.length < 6) {
    alert("La contraseña tiene que tener al menos 6 caracteres.");
    return;
  }
  const { error } = await supabaseClient.auth.updateUser({ password: val });
  if (error) {
    alert("No se pudo cambiar la contraseña: " + error.message);
    return;
  }
  document.getElementById("nuevaPass").value = "";
  showOk("passOk");
}

// ===================== ACTUALIZAR PEDIDOS A MANO =====================
async function actualizarPedidosManual() {
  const btn = document.getElementById("btnActualizarPedidos");
  if (btn) { btn.disabled = true; btn.textContent = "🔄 Actualizando..."; }
  await DA.refrescarPedidos();
  if (btn) { btn.disabled = false; btn.textContent = "🔄 Actualizar pedidos"; }
}

// ===================== PEDIDO MANUAL (TELEFÓNICO) =====================
// Pensado para cargar rápido un pedido que te hicieron por teléfono,
// sin pasar por todo el flujo del cliente. Útil sobre todo con clientes
// de edad avanzada que prefieren llamar antes que usar la web.

function renderProductosManual() {
  const cont = document.getElementById("manualProductos");
  if (!cont) return;

  const activos = DA.getProductos().filter(p => p.activo);

  if (!activos.length) {
    cont.innerHTML = `<p class="ayuda-mini">No hay productos activos todavía.</p>`;
    document.getElementById("manualTotal").textContent = "";
    return;
  }

  cont.innerHTML = activos.map(p => `
    <div class="manual-prod-row">
      <span>${p.nombre} <span class="ayuda-mini">($${Number(p.precio).toLocaleString("es-AR")})</span></span>
      <input type="number" min="0" value="0" id="manualCant-${p.id}" onchange="actualizarTotalManual()" oninput="actualizarTotalManual()"/>
    </div>
  `).join("");

  actualizarTotalManual();
}

function actualizarTotalManual() {
  const activos = DA.getProductos().filter(p => p.activo);
  let total = 0;
  activos.forEach(p => {
    const el = document.getElementById("manualCant-" + p.id);
    const cant = el ? Number(el.value) || 0 : 0;
    total += cant * Number(p.precio);
  });
  const totalEl = document.getElementById("manualTotal");
  if (totalEl) totalEl.textContent = "Total: $" + total.toLocaleString("es-AR");
}

function renderDiasManual() {
  const sel = document.getElementById("manualDia");
  if (!sel) return;

  const dias = DA.proximosDias(21).filter(d => d.disponible);
  sel.innerHTML = dias.map(d => `<option value="${d.fecha}">${d.fechaLabel}</option>`).join("")
    || `<option value="">No hay días disponibles — activá horarios primero</option>`;

  renderHorariosManual();
}

function renderHorariosManual() {
  const fecha = document.getElementById("manualDia").value;
  const sel = document.getElementById("manualHora");
  const horas = fecha ? DA.horasDisponibles(fecha) : [];
  sel.innerHTML = horas.map(h => `<option value="${h}">${h} hs</option>`).join("")
    || `<option value="">-</option>`;
}

function toggleDireccionManual() {
  const esEntrega = document.getElementById("manualTipoEntrega").value === "entrega";
  document.getElementById("manualDireccionBox").classList.toggle("hidden", !esEntrega);
}

function mostrarErrorManual(msg) {
  const el = document.getElementById("manualError");
  el.textContent = msg;
  el.classList.remove("hidden");
}

function agregarPedidoManual() {
  const errBox = document.getElementById("manualError");
  errBox.classList.add("hidden");

  const nombre = document.getElementById("manualNombre").value.trim();
  const tel = document.getElementById("manualTel").value.trim();
  const tipoEntrega = document.getElementById("manualTipoEntrega").value;
  const direccion = document.getElementById("manualDireccion").value.trim();
  const fecha = document.getElementById("manualDia").value;
  const hora = document.getElementById("manualHora").value;

  if (!nombre) return mostrarErrorManual("Ingresá el nombre del cliente.");
  if (tipoEntrega === "entrega" && !direccion) return mostrarErrorManual("Ingresá la dirección de entrega.");
  if (!fecha || !hora) return mostrarErrorManual("Elegí un día y un horario disponibles (activalos primero en '🕐 Días y horarios' si no hay ninguno).");

  const activos = DA.getProductos().filter(p => p.activo);
  const items = [];
  activos.forEach(p => {
    const el = document.getElementById("manualCant-" + p.id);
    const cant = el ? Number(el.value) || 0 : 0;
    if (cant > 0) items.push({ productoId: p.id, nombre: p.nombre, cantidad: cant, precio: Number(p.precio) });
  });

  if (!items.length) return mostrarErrorManual("Agregá la cantidad de al menos un producto.");

  const total = items.reduce((acc, i) => acc + i.cantidad * i.precio, 0);

  DA.nuevoPedido({
    cliente: { nombre, tel, tipoEntrega, direccion },
    items,
    total,
    fecha,
    hora
  });

  document.getElementById("manualNombre").value = "";
  document.getElementById("manualTel").value = "";
  document.getElementById("manualDireccion").value = "";
  document.getElementById("manualTipoEntrega").value = "retiro";
  toggleDireccionManual();
  renderProductosManual();
  renderDiasManual();
  renderPedidos();
  showOk("manualOk");
}

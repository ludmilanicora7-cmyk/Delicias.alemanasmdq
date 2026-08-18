// ═══════════════════════════════════════
// DELICIAS ALEMANAS — CLIENTE.JS
// Flujo completo: productos → datos → día/horario → confirmación
// ═══════════════════════════════════════

let productos = [];
let carrito = {};        // { [productoId]: { producto, cantidad } }
let fechaElegida = null;
let horaElegida = null;
let ultimoPedido = null;

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("productosGrid").innerHTML = `<p class="paso-desc">Cargando productos…</p>`;
  await DA.init();
  renderProductos();
  renderDias();
  toggleDireccion();
});

// Instalable como app + funciona sin conexión una vez cargada
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}

// ===================== PASO 1: PRODUCTOS =====================
function renderProductos() {
  const grid = document.getElementById("productosGrid");
  grid.innerHTML = "";

  productos = DA.getProductos().filter(p => p.activo);

  if (productos.length === 0) {
    grid.innerHTML = `<p class="paso-desc">Por ahora no hay productos disponibles. Volvé a intentar más tarde.</p>`;
    return;
  }

  productos.forEach(p => {
    const cantidad = carrito[p.id]?.cantidad || 0;

    const div = document.createElement("div");
    div.className = "prod-card";

    // La foto va dentro de .prod-foto, que ya tiene dibujado el sello de
    // trigo como fondo. Si el producto no tiene foto cargada, o la foto
    // no carga, queda el sello a la vista — nunca un cuadro roto.
    const foto = p.imagen
      ? `<img src="${p.imagen}" class="prod-img" alt="${p.nombre}" loading="lazy" onerror="this.remove()"/>`
      : "";

    div.innerHTML = `
      <div class="prod-foto">${foto}</div>
      <div class="prod-info">
        <div class="prod-nombre">${p.nombre}</div>
        <div class="prod-precio">$${Number(p.precio).toLocaleString("es-AR")}</div>

        <div class="cantidad-box">
          <button class="cantidad-btn" type="button" aria-label="Quitar uno de ${p.nombre}" onclick="restar('${p.id}')">&minus;</button>
          <span aria-live="polite">${cantidad}</span>
          <button class="cantidad-btn" type="button" aria-label="Agregar uno de ${p.nombre}" onclick="sumar('${p.id}')">+</button>
        </div>
      </div>
    `;

    grid.appendChild(div);
  });
}

function sumar(id) {
  const p = productos.find(x => x.id === id);
  if (!p) return;
  if (!carrito[id]) carrito[id] = { producto: p, cantidad: 0 };
  carrito[id].cantidad++;
  renderProductos();
  actualizarResumenCarrito();
}

function restar(id) {
  if (!carrito[id]) return;
  carrito[id].cantidad--;
  if (carrito[id].cantidad <= 0) delete carrito[id];
  renderProductos();
  actualizarResumenCarrito();
}

function totalCarrito() {
  return Object.values(carrito).reduce((acc, it) => acc + it.cantidad * Number(it.producto.precio), 0);
}

function itemsCarrito() {
  return Object.values(carrito).map(it => ({
    productoId: it.producto.id,
    nombre: it.producto.nombre,
    cantidad: it.cantidad,
    precio: Number(it.producto.precio)
  }));
}

function actualizarResumenCarrito() {
  const cont = document.getElementById("resumenCarrito");
  const items = itemsCarrito();
  const btn = document.getElementById("btnIrPaso2");

  if (items.length === 0) {
    cont.innerHTML = "";
    btn.disabled = true;
    return;
  }

  const filas = items.map(i => `
    <div class="resumen-linea">
      <span>${i.cantidad} × ${i.nombre}</span>
      <span>$${(i.cantidad * i.precio).toLocaleString("es-AR")}</span>
    </div>
  `).join("");

  cont.innerHTML = `
    ${filas}
    <div class="resumen-linea resumen-total">
      <span>Total</span>
      <span>$${totalCarrito().toLocaleString("es-AR")}</span>
    </div>
  `;

  btn.disabled = false;
}

// ===================== NAVEGACIÓN ENTRE PASOS =====================
function irPaso(n) {
  [1, 2, 3, 4].forEach(i => {
    document.getElementById("paso" + i).classList.toggle("hidden", i !== n);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function irPaso2() {
  if (itemsCarrito().length === 0) return;
  irPaso(2);
}

function toggleDireccion() {
  const esEntrega = document.getElementById("tipoEntrega").value === "entrega";
  document.getElementById("direccionBox").classList.toggle("hidden", !esEntrega);
}

function irPaso3() {
  const nombre = document.getElementById("nombre").value.trim();
  const tel = document.getElementById("tel").value.trim();
  const tipoEntrega = document.getElementById("tipoEntrega").value;
  const direccion = document.getElementById("direccion").value.trim();
  const errBox = document.getElementById("errorPaso2");

  if (!nombre || !tel) {
    errBox.textContent = "Completá tu nombre y WhatsApp para continuar.";
    errBox.classList.remove("hidden");
    return;
  }
  if (tipoEntrega === "entrega" && !direccion) {
    errBox.textContent = "Ingresá la dirección de entrega.";
    errBox.classList.remove("hidden");
    return;
  }

  errBox.classList.add("hidden");
  renderDias();
  irPaso(3);
}

// ===================== PASO 3: DÍA Y HORARIO =====================
function renderDias() {
  const cont = document.getElementById("diasGrid");
  cont.innerHTML = "";

  const dias = DA.proximosDias(14);

  dias.forEach(d => {
    const div = document.createElement("div");
    div.className = "cal-dia" + (d.disponible ? " disponible" : " no-disponible") + (d.fecha === fechaElegida ? " sel" : "");
    div.innerHTML = d.fechaLabel.replace(",", "<br/>");
    if (d.disponible) {
      div.onclick = () => seleccionarDia(d.fecha);
      div.tabIndex = 0;
      div.setAttribute("role", "button");
      div.onkeydown = (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); seleccionarDia(d.fecha); }
      };
    } else {
      div.title = "Sin cupo este día";
      div.setAttribute("aria-disabled", "true");
    }
    cont.appendChild(div);
  });

  document.getElementById("horariosBox").classList.add("hidden");
}

function seleccionarDia(fecha) {
  fechaElegida = fecha;
  horaElegida = null;
  renderDias();
  renderHorarios();
}

function renderHorarios() {
  const box = document.getElementById("horariosBox");
  const cont = document.getElementById("horarios");
  cont.innerHTML = "";

  if (!fechaElegida) {
    box.classList.add("hidden");
    return;
  }

  const horas = DA.horasDisponibles(fechaElegida);

  if (horas.length === 0) {
    cont.innerHTML = `<p class="paso-desc">No quedan horarios disponibles ese día.</p>`;
    box.classList.remove("hidden");
    return;
  }

  horas.forEach(h => {
    const btn = document.createElement("div");
    btn.className = "horario-btn" + (h === horaElegida ? " sel" : "");
    btn.textContent = h + " hs";
    btn.tabIndex = 0;
    btn.setAttribute("role", "button");
    const elegir = () => { horaElegida = h; renderHorarios(); };
    btn.onclick = elegir;
    btn.onkeydown = (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); elegir(); }
    };
    cont.appendChild(btn);
  });

  box.classList.remove("hidden");
}

// ===================== CONFIRMAR PEDIDO =====================
async function confirmar() {
  const errBox = document.getElementById("errorPaso3");

  if (!fechaElegida || !horaElegida) {
    errBox.textContent = "Elegí un día y un horario disponible.";
    errBox.classList.remove("hidden");
    return;
  }

  if (!DA.horaValidaParaFecha(fechaElegida, horaElegida)) {
    errBox.textContent = "Ese horario ya no está disponible, elegí otro.";
    errBox.classList.remove("hidden");
    fechaElegida = null;
    horaElegida = null;
    renderDias();
    return;
  }

  errBox.classList.add("hidden");

  const btn = document.querySelector("#paso3 .btn-confirmar");
  if (btn) { btn.disabled = true; btn.textContent = "Enviando..."; }

  const pedido = await DA.nuevoPedido({
    cliente: {
      nombre: document.getElementById("nombre").value.trim(),
      tel: document.getElementById("tel").value.trim(),
      tipoEntrega: document.getElementById("tipoEntrega").value,
      direccion: document.getElementById("direccion").value.trim()
    },
    items: itemsCarrito(),
    total: totalCarrito(),
    fecha: fechaElegida,
    hora: horaElegida
  });

  if (btn) { btn.disabled = false; btn.textContent = "Confirmar pedido"; }

  ultimoPedido = pedido;
  mostrarResumenFinal(pedido);
  irPaso(4);
}

function mostrarResumenFinal(pedido) {
  const cont = document.getElementById("resumenFinal");
  const filas = pedido.items.map(i => `
    <div class="resumen-linea">
      <span>${i.cantidad} × ${i.nombre}</span>
      <span>$${(i.cantidad * i.precio).toLocaleString("es-AR")}</span>
    </div>
  `).join("");

  const fechaFmt = new Date(pedido.fecha + "T12:00:00").toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });

  cont.innerHTML = `
    ${filas}
    <div class="resumen-linea resumen-total">
      <span>Total</span>
      <span>$${pedido.total.toLocaleString("es-AR")}</span>
    </div>
    <hr/>
    <div class="resumen-linea"><span>Día</span><span>${fechaFmt}</span></div>
    <div class="resumen-linea"><span>Horario</span><span>${pedido.hora} hs</span></div>
    <div class="resumen-linea"><span>Entrega</span><span>${pedido.cliente.tipoEntrega === "entrega" ? "A domicilio" : "Retiro en local"}</span></div>
  `;
}

function mensajeWhatsapp(pedido) {
  const fechaFmt = new Date(pedido.fecha + "T12:00:00").toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
  let msg = `¡Hola! Quiero hacer este pedido:\n\n`;
  pedido.items.forEach(i => {
    msg += `• ${i.cantidad} × ${i.nombre} ($${(i.cantidad * i.precio).toLocaleString("es-AR")})\n`;
  });
  msg += `\nTotal: $${pedido.total.toLocaleString("es-AR")}\n`;
  msg += `\nNombre: ${pedido.cliente.nombre}`;
  msg += `\nEntrega: ${pedido.cliente.tipoEntrega === "entrega" ? "A domicilio - " + pedido.cliente.direccion : "Retiro en local"}`;
  msg += `\nDía: ${fechaFmt}`;
  msg += `\nHorario: ${pedido.hora} hs`;
  return msg;
}

function abrirWhatsapp() {
  if (!ultimoPedido) return;
  const negocio = DA.getNegocio();
  const msg = mensajeWhatsapp(ultimoPedido);
  const url = `https://wa.me/${negocio.whatsapp}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
}

function nuevoPedido() {
  carrito = {};
  fechaElegida = null;
  horaElegida = null;
  ultimoPedido = null;
  document.getElementById("nombre").value = "";
  document.getElementById("tel").value = "";
  document.getElementById("direccion").value = "";
  document.getElementById("tipoEntrega").value = "retiro";
  toggleDireccion();
  renderProductos();
  actualizarResumenCarrito();
  renderDias();
  irPaso(1);
}

// ═══════════════════════════════════════════
// INSTALAR COMO APP
// ═══════════════════════════════════════════
// El sitio ya era instalable, pero había que saber ir al menú
// del navegador y buscar "Instalar app". Nadie lo hace. Esto
// lo convierte en un botón visible.
//
// Android/Chrome avisa con "beforeinstallprompt" cuando se puede
// instalar; ahí mostramos la barra. iPhone no tiene ese aviso
// (Apple no lo permite), así que a esos les mostramos el paso
// a paso del "Agregar a inicio".

let promptInstalacion = null;

function yaEstaInstalada() {
  return window.matchMedia("(display-mode: standalone)").matches
      || window.navigator.standalone === true;
}

function esIphone() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
      && !/crios|fxios/i.test(navigator.userAgent); // solo Safari
}

function barraDescartada() {
  try { return localStorage.getItem("da_instalar_no") === "1"; }
  catch (e) { return false; }
}

function cerrarBarraInstalar() {
  document.getElementById("instalarBarra").classList.add("hidden");
  document.getElementById("instalarIos").classList.add("hidden");
  try { localStorage.setItem("da_instalar_no", "1"); } catch (e) {}
}

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();              // no mostrar el cartel propio del navegador
  promptInstalacion = e;           // lo guardamos para dispararlo con nuestro botón
  if (!barraDescartada() && !yaEstaInstalada()) {
    document.getElementById("instalarBarra").classList.remove("hidden");
  }
});

async function instalarApp() {
  if (!promptInstalacion) return;
  promptInstalacion.prompt();
  await promptInstalacion.userChoice;
  promptInstalacion = null;
  document.getElementById("instalarBarra").classList.add("hidden");
}

window.addEventListener("appinstalled", () => {
  document.getElementById("instalarBarra").classList.add("hidden");
  try { localStorage.setItem("da_instalar_no", "1"); } catch (e) {}
});

// iPhone: mostramos las instrucciones a los pocos segundos, para
// no tapar la pantalla apenas entra.
document.addEventListener("DOMContentLoaded", () => {
  if (esIphone() && !yaEstaInstalada() && !barraDescartada()) {
    setTimeout(() => {
      document.getElementById("instalarIos").classList.remove("hidden");
    }, 4000);
  }
});

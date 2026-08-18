// ═══════════════════════════════════════
// DELICIAS ALEMANAS — DATOS v4 (con Supabase)
// Capa de datos compartida entre index.html (antes llamado cliente.html) y el panel admin
// Productos, horarios, negocio y pedidos viven en Supabase (compartidos entre
// todos los dispositivos). Cada página guarda una copia en memoria (this._cache)
// para que la pantalla se sienta instantánea, y sincroniza en segundo plano.
// ═══════════════════════════════════════

const DA = {

  // =========================
  // CACHE EN MEMORIA
  // =========================
  _productos: [],
  _horarios: [],
  _negocio: null,
  _pedidos: [],
  _pagos: [],
  _listo: false,
  onPedidosActualizados: null, // admin.js puede engancharse acá para re-renderizar

  // Carga inicial desde Supabase. Hay que esperarla (await) antes de
  // usar getProductos/getHorarios/getPedidos por primera vez.
  async init() {
    await Promise.all([
      this._cargarProductos(),
      this._cargarHorarios(),
      this._cargarNegocio(),
      this._cargarPedidos(), // si no está logueado, Supabase simplemente no devuelve nada (RLS)
      this._cargarPagos()    // idem: los pagos son solo para el admin
    ]);
    this._listo = true;
  },

  async _cargarProductos() {
    try {
      const { data, error } = await supabaseClient.from("productos").select("*").order("nombre");
      if (error) throw error;
      this._productos = (data || []).map(r => ({
        id: r.id, nombre: r.nombre, precio: Number(r.precio), imagen: r.imagen, activo: !!r.activo
      }));
    } catch (e) {
      console.error("No se pudieron cargar los productos desde el servidor:", e);
      if (!this._productos.length) this._productos = this.defaultProductos();
    }
  },

  async _cargarHorarios() {
    try {
      const { data, error } = await supabaseClient.from("horarios").select("*").order("dia");
      if (error) throw error;
      this._horarios = this._migrarHorarios((data || []).map(r => ({
        dia: r.dia, nombre: r.nombre, activo: !!r.activo, franjas: r.franjas || []
      })));
    } catch (e) {
      console.error("No se pudieron cargar los horarios desde el servidor:", e);
      if (!this._horarios.length) this._horarios = this.defaultHorarios();
    }
  },

  async _cargarNegocio() {
    try {
      const { data, error } = await supabaseClient.from("negocio").select("*").eq("id", 1).maybeSingle();
      if (error) throw error;
      this._negocio = data || this.defaultNegocio();
    } catch (e) {
      console.error("No se pudo cargar el negocio desde el servidor:", e);
      if (!this._negocio) this._negocio = this.defaultNegocio();
    }
  },

  async _cargarPedidos() {
    try {
      const { data, error } = await supabaseClient.from("pedidos").select("*").order("creado_en", { ascending: false });
      if (error) throw error; // esperable si todavía no inició sesión (RLS lo bloquea) — no es un error real
      this._pedidos = (data || []).map(this._filaAPedido);
    } catch (e) {
      // No hacemos ruido acá: en la página de clientes es normal no tener acceso a pedidos ajenos.
      this._pedidos = this._pedidos || [];
    }
  },

  // Vuelve a pedir los pedidos al servidor (para "ver lo nuevo" sin recargar la página)
  async refrescarPedidos() {
    await this._cargarPedidos();
    if (typeof this.onPedidosActualizados === "function") this.onPedidosActualizados();
  },

  _filaAPedido(r) {
    return {
      id: r.id,
      cliente: { nombre: r.cliente_nombre, tel: r.cliente_tel, tipoEntrega: r.tipo_entrega, direccion: r.direccion },
      items: r.items,
      total: Number(r.total),
      fecha: r.fecha,
      hora: r.hora,
      estado: r.estado,
      creadoEn: r.creado_en
    };
  },

  // =========================
  // PRODUCTOS
  // =========================
  // Devuelve una COPIA (nunca la referencia interna): admin.js agrega/borra
  // productos mutando el array que recibe acá, y saveProductos() necesita
  // poder comparar contra el estado anterior real para saber qué se borró.
  getProductos() {
    return this._productos.map(p => ({ ...p }));
  },

  // Guarda la lista completa (igual que antes): agrega/edita todo lo que
  // venga en la lista, y borra en el servidor lo que ya no está.
  async saveProductos(p) {
    const anteriores = this._productos;
    this._productos = p; // optimista: la pantalla se actualiza al toque

    try {
      if (p.length) {
        const { error } = await supabaseClient.from("productos").upsert(
          p.map(x => ({ id: x.id, nombre: x.nombre, precio: Number(x.precio), imagen: x.imagen, activo: !!x.activo }))
        );
        if (error) throw error;
      }
      const idsActuales = p.map(x => x.id);
      const idsBorrados = anteriores.filter(a => !idsActuales.includes(a.id)).map(a => a.id);
      if (idsBorrados.length) {
        const { error } = await supabaseClient.from("productos").delete().in("id", idsBorrados);
        if (error) throw error;
      }
    } catch (e) {
      console.error("No se pudo guardar productos en el servidor:", e);
      alert("No se pudo guardar en el servidor (¿estás sin conexión, o se cerró tu sesión?). El cambio quedó solo en esta pantalla por ahora.");
    }
  },

  defaultProductos() {
    return [
      { id: "pretzel", nombre: "Pretzel artesanal", precio: 1200, imagen: "img/pretzel.jpg", activo: true },
      { id: "torta", nombre: "Torta alemana", precio: 6500, imagen: "img/torta.jpg", activo: true }
    ];
  },

  nuevoIdProducto() {
    return "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  },

  // =========================
  // HORARIOS
  // Formato franja: { inicio: "14:00", fin: "20:00" }
  // =========================
  getHorarios() {
    return this._horarios;
  },

  // Convierte el formato viejo (franjas como texto "14:00 - 20:00") al nuevo,
  // por si quedan datos de una versión anterior.
  _migrarHorarios(h) {
    h.forEach(dia => {
      dia.franjas = (dia.franjas || []).map(f => {
        if (typeof f === "string") {
          const [inicio, fin] = f.split("-").map(s => s.trim());
          return { inicio, fin };
        }
        return f;
      });
    });
    return h;
  },

  async saveHorarios(h) {
    this._horarios = h; // optimista
    try {
      const { error } = await supabaseClient.from("horarios").upsert(
        h.map(d => ({ dia: d.dia, nombre: d.nombre, activo: !!d.activo, franjas: d.franjas }))
      );
      if (error) throw error;
    } catch (e) {
      console.error("No se pudieron guardar los horarios en el servidor:", e);
      alert("No se pudo guardar en el servidor (¿estás sin conexión, o se cerró tu sesión?). El cambio quedó solo en esta pantalla por ahora.");
    }
  },

  defaultHorarios() {
    return [
      { dia: 0, nombre: "Lunes", activo: false, franjas: [] },
      { dia: 1, nombre: "Martes", activo: false, franjas: [] },
      { dia: 2, nombre: "Miércoles", activo: false, franjas: [] },
      { dia: 3, nombre: "Jueves", activo: true, franjas: [{ inicio: "14:00", fin: "20:00" }] },
      { dia: 4, nombre: "Viernes", activo: false, franjas: [] },
      { dia: 5, nombre: "Sábado", activo: true, franjas: [{ inicio: "09:00", fin: "14:00" }] },
      { dia: 6, nombre: "Domingo", activo: false, franjas: [] }
    ];
  },

  // =========================
  // FECHAS
  // =========================
  fechaToDia(fecha) {
    // fecha: "YYYY-MM-DD"  ->  0=Lunes ... 6=Domingo
    const d = new Date(fecha + "T12:00:00");
    return d.getDay() === 0 ? 6 : d.getDay() - 1;
  },

  configDia(fecha) {
    const dia = this.fechaToDia(fecha);
    return this.getHorarios().find(h => h.dia === dia);
  },

  // Horarios seleccionables (cada 15 min) dentro de las franjas abiertas de un día.
  // Si la fecha es hoy, descarta horarios que ya pasaron (con 1h de margen).
  horasDisponibles(fecha) {
    const conf = this.configDia(fecha);
    if (!conf || !conf.activo) return [];

    const hoyStr = new Date().toISOString().slice(0, 10);
    let minMin = -1;
    if (fecha === hoyStr) {
      const ahora = new Date();
      minMin = ahora.getHours() * 60 + ahora.getMinutes() + 60;
    }

    const out = [];
    conf.franjas.forEach(f => {
      if (!f.inicio || !f.fin) return;
      const [hI, mI] = f.inicio.split(":").map(Number);
      const [hF, mF] = f.fin.split(":").map(Number);
      let cursor = hI * 60 + mI;
      const fin = hF * 60 + mF;
      while (cursor <= fin) {
        if (cursor >= minMin) {
          const h = String(Math.floor(cursor / 60)).padStart(2, "0");
          const m = String(cursor % 60).padStart(2, "0");
          out.push(`${h}:${m}`);
        }
        cursor += 15;
      }
    });
    return out;
  },

  fechaDisponible(fecha) {
    return this.horasDisponibles(fecha).length > 0;
  },

  horaValidaParaFecha(fecha, hora) {
    return this.horasDisponibles(fecha).includes(hora);
  },

  // Próximos N días con su disponibilidad, para la grilla de selección del cliente.
  proximosDias(n = 14) {
    const out = [];
    const hoy = new Date();
    for (let i = 0; i < n; i++) {
      const d = new Date(hoy);
      d.setDate(hoy.getDate() + i);
      const fecha = d.toISOString().slice(0, 10);
      out.push({
        fecha,
        fechaLabel: d.toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" }),
        disponible: this.fechaDisponible(fecha)
      });
    }
    return out;
  },

  // =========================
  // PEDIDOS
  // =========================
  getPedidos() {
    return this._pedidos;
  },

  // Crea el pedido (lo usan tanto el cliente pidiendo online como vos
  // cargando un pedido manual/telefónico). Queda guardado en Supabase,
  // así que te aparece en el panel admin apenas lo recargués o refresqués.
  async nuevoPedido(pedido) {
    const nuevo = Object.assign({
      id: "ped" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      creadoEn: new Date().toISOString(),
      estado: "pendiente"
    }, pedido);

    this._pedidos.unshift(nuevo); // optimista (solo importa en esta misma pantalla)

    try {
      const { error } = await supabaseClient.from("pedidos").insert({
        id: nuevo.id,
        cliente_nombre: nuevo.cliente.nombre,
        cliente_tel: nuevo.cliente.tel,
        tipo_entrega: nuevo.cliente.tipoEntrega,
        direccion: nuevo.cliente.direccion,
        items: nuevo.items,
        total: nuevo.total,
        fecha: nuevo.fecha,
        hora: nuevo.hora,
        estado: nuevo.estado,
        creado_en: nuevo.creadoEn
      });
      if (error) throw error;
    } catch (e) {
      console.error("No se pudo registrar el pedido en el servidor:", e);
      // No frenamos el flujo del cliente por esto: igual le abrimos WhatsApp con el detalle.
    }

    return nuevo;
  },

  async actualizarEstadoPedido(id, estado) {
    const p = this._pedidos.find(x => x.id === id);
    if (p) p.estado = estado; // optimista

    try {
      const { error } = await supabaseClient.from("pedidos").update({ estado }).eq("id", id);
      if (error) throw error;
    } catch (e) {
      console.error("No se pudo actualizar el pedido en el servidor:", e);
      alert("No se pudo actualizar en el servidor (¿sin conexión, o se cerró tu sesión?).");
    }
  },

  async eliminarPedido(id) {
    this._pedidos = this._pedidos.filter(p => p.id !== id); // optimista

    try {
      const { error } = await supabaseClient.from("pedidos").delete().eq("id", id);
      if (error) throw error;
    } catch (e) {
      console.error("No se pudo eliminar el pedido en el servidor:", e);
      alert("No se pudo eliminar en el servidor (¿sin conexión, o se cerró tu sesión?).");
    }
  },

  // =========================
  // NEGOCIO (datos de contacto)
  // =========================
  getNegocio() {
    return this._negocio || this.defaultNegocio();
  },

  async saveNegocio(n) {
    this._negocio = n; // optimista
    try {
      const { error } = await supabaseClient.from("negocio").upsert({ id: 1, whatsapp: n.whatsapp, instagram: n.instagram });
      if (error) throw error;
    } catch (e) {
      console.error("No se pudo guardar el negocio en el servidor:", e);
      alert("No se pudo guardar en el servidor (¿sin conexión, o se cerró tu sesión?).");
    }
  },

  defaultNegocio() {
    return {
      nombre: "Delicias Alemanas",
      whatsapp: "5492234252233", // formato internacional sin "+", para wa.me
      instagram: "@delicias_alemanas.mdq"
    };
  },

  // =========================
  // ADMIN / LOGIN (Supabase Auth — validado en el servidor, no en el navegador)
  // =========================
  async login(email, pass) {
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password: pass });
    return !error;
  },

  async isLoggedIn() {
    const { data } = await supabaseClient.auth.getSession();
    return !!data.session;
  },

  async logout() {
    await supabaseClient.auth.signOut();
  },

  // =========================
  // BACKUP (copia de seguridad manual, además de tener todo en Supabase)
  // =========================
  exportBackup() {
    const data = {
      tipo: "delicias-alemanas-backup",
      version: 4,
      fecha: new Date().toISOString(),
      da_productos: this._productos,
      da_horarios: this._horarios,
      da_negocio: this._negocio
      // los pedidos no se incluyen en el backup: viven en Supabase y tienen historial propio
    };
    return JSON.stringify(data, null, 2);
  },

  // Restaura productos/horarios/negocio DESDE UN ARCHIVO hacia Supabase
  // (útil por ejemplo para migrar lo que ya tenías cargado a la nueva versión).
  async importBackup(json) {
    const data = JSON.parse(json);
    if (!data || data.tipo !== "delicias-alemanas-backup") {
      throw new Error("El archivo no es un backup válido de Delicias Alemanas");
    }
    if (data.da_productos) await this.saveProductos(data.da_productos);
    if (data.da_horarios) await this.saveHorarios(this._migrarHorarios(data.da_horarios));
    if (data.da_negocio) await this.saveNegocio(data.da_negocio);
    return true;
  },

  // =========================
  // PAGOS (Caja)
  // =========================
  // Un pedido puede tener varios pagos: una seña hoy, el saldo
  // el día que retira. Cada pago guarda SU fecha, que es la que
  // manda para el total del mes.

  async _cargarPagos() {
    try {
      const { data, error } = await supabaseClient
        .from("pagos").select("*").order("fecha", { ascending: false });
      if (error) throw error;
      this._pagos = (data || []).map(r => ({
        id: r.id,
        pedidoId: r.pedido_id,
        monto: Number(r.monto),
        metodo: r.metodo,
        nota: r.nota || "",
        fecha: r.fecha,
        creadoEn: r.creado_en
      }));
    } catch (e) {
      console.error("No se pudieron cargar los pagos:", e);
    }
  },

  getPagos() {
    return this._pagos.slice();
  },

  // Pagos de un pedido puntual, del más viejo al más nuevo
  pagosDePedido(pedidoId) {
    return this._pagos
      .filter(p => p.pedidoId === pedidoId)
      .sort((a, b) => a.fecha.localeCompare(b.fecha));
  },

  // Las tres cifras que importan de un pedido
  saldoPedido(pedido) {
    const total  = Number(pedido.total) || 0;
    const pagado = this.pagosDePedido(pedido.id)
      .reduce((acc, p) => acc + Number(p.monto), 0);
    const saldo  = Math.round((total - pagado) * 100) / 100;
    return {
      total,
      pagado,
      saldo: saldo > 0 ? saldo : 0,
      aFavor: saldo < 0 ? Math.abs(saldo) : 0,  // le cobraste de más
      saldado: saldo <= 0 && pagado > 0
    };
  },

  async agregarPago({ pedidoId, monto, metodo, nota, fecha }) {
    const nuevo = {
      id: "pag" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      pedidoId,
      monto: Number(monto),
      metodo: metodo || "efectivo",
      nota: nota || "",
      fecha: fecha || this.hoyISO(),
      creadoEn: new Date().toISOString()
    };

    this._pagos.unshift(nuevo);

    try {
      const { error } = await supabaseClient.from("pagos").insert({
        id: nuevo.id,
        pedido_id: nuevo.pedidoId,
        monto: nuevo.monto,
        metodo: nuevo.metodo,
        nota: nuevo.nota,
        fecha: nuevo.fecha,
        creado_en: nuevo.creadoEn
      });
      if (error) throw error;
    } catch (e) {
      console.error("No se pudo guardar el pago en el servidor:", e);
      this._pagos = this._pagos.filter(p => p.id !== nuevo.id); // deshacer
      return null;
    }

    return nuevo;
  },

  async eliminarPago(id) {
    this._pagos = this._pagos.filter(p => p.id !== id);
    try {
      const { error } = await supabaseClient.from("pagos").delete().eq("id", id);
      if (error) throw error;
    } catch (e) {
      console.error("No se pudo eliminar el pago:", e);
    }
  },

  hoyISO() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  },

  // =========================
  // CAJA: totales por mes
  // =========================
  // Devuelve un arreglo de meses, del más reciente al más viejo:
  // { mes: "2026-08", etiqueta: "agosto 2026", total, efectivo,
  //   transferencia, cantidad }
  resumenPorMes() {
    const mapa = {};

    this._pagos.forEach(p => {
      const mes = p.fecha.slice(0, 7);
      if (!mapa[mes]) {
        mapa[mes] = { mes, total: 0, efectivo: 0, transferencia: 0, cantidad: 0 };
      }
      mapa[mes].total += p.monto;
      mapa[mes].cantidad++;
      if (p.metodo === "transferencia") mapa[mes].transferencia += p.monto;
      else mapa[mes].efectivo += p.monto;
    });

    return Object.values(mapa)
      .sort((a, b) => b.mes.localeCompare(a.mes))
      .map(m => {
        const [anio, num] = m.mes.split("-");
        const etiqueta = new Date(Number(anio), Number(num) - 1, 1)
          .toLocaleDateString("es-AR", { month: "long", year: "numeric" });
        return Object.assign({}, m, { etiqueta });
      });
  },

  // Pedidos que todavía deben plata (no cancelados)
  pedidosConSaldo() {
    return this._pedidos
      .filter(p => p.estado !== "cancelado")
      .map(p => Object.assign({ _saldo: this.saldoPedido(p) }, p))
      .filter(p => p._saldo.saldo > 0);
  },


  // =========================
  // FOTOS DE PRODUCTOS (Supabase Storage)
  // =========================
  // La foto se achica y se comprime EN EL CELULAR antes de subir.
  // Una foto de cámara pesa 3-5 MB; si suben ocho así, una clienta
  // con datos móviles espera una eternidad y gasta su plan. Acá
  // sale a 900px de lado y ~150-250 KB, que es más que suficiente
  // para verse nítida en cualquier pantalla.

  async _comprimirFoto(file, maxLado = 900, calidad = 0.82) {
    const bitmap = await createImageBitmap(file);

    let { width, height } = bitmap;
    if (width > maxLado || height > maxLado) {
      const escala = maxLado / Math.max(width, height);
      width  = Math.round(width  * escala);
      height = Math.round(height * escala);
    }

    const lienzo = document.createElement("canvas");
    lienzo.width = width;
    lienzo.height = height;
    lienzo.getContext("2d").drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    return new Promise((resolve, reject) => {
      lienzo.toBlob(
        b => b ? resolve(b) : reject(new Error("No se pudo procesar la imagen")),
        "image/jpeg",
        calidad
      );
    });
  },

  // Sube la foto y devuelve la dirección pública para guardar
  // en el producto. Devuelve null si algo falla.
  async subirFoto(file) {
    if (!file || !file.type.startsWith("image/")) {
      throw new Error("El archivo elegido no es una imagen.");
    }

    const blob = await this._comprimirFoto(file);
    const nombre = `prod-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}.jpg`;

    const { error } = await supabaseClient
      .storage.from("productos")
      .upload(nombre, blob, { contentType: "image/jpeg", upsert: false });

    if (error) throw error;

    const { data } = supabaseClient.storage.from("productos").getPublicUrl(nombre);
    return data.publicUrl;
  },

};

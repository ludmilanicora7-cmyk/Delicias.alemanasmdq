<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Admin · Delicias Alemanas</title>

  <link rel="stylesheet" href="admin.css"/>

  <link rel="manifest" href="manifest-admin.json"/>
  <meta name="theme-color" content="#1c1a17"/>
  <link rel="apple-touch-icon" href="icons/icon-192.png"/>
  <link rel="icon" href="icons/icon-192.png"/>
</head>

<body>

<!-- ===================== LOGIN ===================== -->
<div id="loginBox" class="login-box">
  <div class="login-card">
    <img src="logo.jpg" alt="logo" style="width:64px;height:64px;border-radius:50%;object-fit:cover;border:3px solid #c8a24a;margin-bottom:10px;"/>
    <h1>Delicias Alemanas</h1>
    <p>🍰 Panel Admin</p>
    <input id="loginEmail" type="email" placeholder="Email" autocomplete="username"/>
    <input id="loginPass" type="password" placeholder="Contraseña" autocomplete="current-password"/>
    <p class="error-msg hidden" id="loginError">Email o contraseña incorrectos</p>
    <button onclick="intentarLogin()">Ingresar</button>
  </div>
</div>

<!-- ===================== PANEL ===================== -->
<div id="panel" class="hidden">

<header class="admin-hero">
  <div class="bandera-lateral bandera-arg-lateral" aria-hidden="true"></div>
  <div class="bandera-lateral bandera-ale-lateral" aria-hidden="true"></div>

  <svg class="sol-arg" viewBox="0 0 40 40" aria-hidden="true">
    <circle cx="20" cy="20" r="10" fill="#F6B40E" stroke="#8B5E0A" stroke-width="1.2"/>
    <circle cx="20" cy="20" r="4.5" fill="#F8CB63"/>
  </svg>

  <div class="admin-logo-wrap"><img src="logo.jpg" alt="logo"/></div>

  <h1>🍰 Delicias Alemanas</h1>
  <p>Panel Admin</p>
  <div class="admin-hero-botones">
    <a href="index.html" target="_blank" class="link-btn">👀 Ver vista cliente</a>
    <button class="link-btn" onclick="cerrarSesion()">Cerrar sesión</button>
  </div>
</header>
<div class="cinta-alemana"></div>

<main class="admin-main">

  <!-- ===================== PEDIDO MANUAL (TELEFÓNICO) ===================== -->
  <section class="card card-destacada">
    <h2>📞 Cargar pedido manual</h2>
    <p class="ayuda">Para cuando un cliente te pide por teléfono — muy útil con clientes que no manejan bien la web, como algunos de mayor edad. Se agrega directo a "Pedidos", como si lo hubiese cargado el cliente.</p>

    <label>Nombre del cliente</label>
    <input id="manualNombre" placeholder="Nombre"/>

    <label>WhatsApp o teléfono</label>
    <input id="manualTel" placeholder="Ej: 2231234567"/>

    <label>Tipo de entrega</label>
    <select id="manualTipoEntrega" onchange="toggleDireccionManual()">
      <option value="retiro">Retiro en local</option>
      <option value="entrega">Entrega a domicilio</option>
    </select>

    <div id="manualDireccionBox">
      <label>Dirección</label>
      <input id="manualDireccion" placeholder="Calle, número, barrio"/>
    </div>

    <label>Día</label>
    <select id="manualDia" onchange="renderHorariosManual()"></select>

    <label>Horario</label>
    <select id="manualHora"></select>

    <h3>Productos</h3>
    <div id="manualProductos"></div>
    <p id="manualTotal" class="ayuda-mini manual-total"></p>

    <p class="error-msg hidden" id="manualError"></p>

    <button onclick="agregarPedidoManual()">➕ Agregar pedido</button>
    <p class="ok-msg hidden" id="manualOk">Pedido agregado ✅</p>
  </section>

  <!-- ===================== PEDIDOS ===================== -->
  <section class="card">
    <h2>📋 Pedidos</h2>
    <p class="ayuda">Se actualiza solo cada 20 segundos si tenés esta pantalla abierta. También podés forzarlo con el botón.</p>
    <button class="btn-mini" id="btnActualizarPedidos" onclick="actualizarPedidosManual()" type="button">🔄 Actualizar pedidos</button>
    <div class="filtros" id="filtrosPedidos"></div>
    <div id="listaPedidos"></div>
  </section>

  <!-- ===================== DÍAS Y HORARIOS ===================== -->
  <section class="card">
    <h2>🕐 Días y horarios</h2>
    <p class="ayuda">Activá los días que puede haber pedidos y cargá las franjas horarias. Los demás días aparecen "sin cupo" para el cliente.</p>

    <div id="horariosConfig"></div>

    <button onclick="guardarHorarios()">Guardar horarios</button>
    <p class="ok-msg hidden" id="horariosOk">Horarios guardados ✅</p>
  </section>

  <!-- ===================== PRODUCTOS ===================== -->
  <section class="card">
    <h2>🧁 Productos</h2>

    <div id="listaProductos"></div>

    <hr/>

    <h3>➕ Nuevo producto</h3>

    <input id="nombre" placeholder="Nombre"/>
    <input id="precio" type="number" placeholder="Precio"/>
    <input id="imagen" placeholder="URL imagen (ej: img/torta.jpg)"/>

    <button onclick="agregarProducto()">Agregar</button>
  </section>

  <!-- ===================== DATOS DEL NEGOCIO ===================== -->
  <section class="card">
    <h2>📱 Datos de contacto</h2>
    <p class="ayuda">Número de WhatsApp al que llegan los pedidos (con código de país, sin +. Ej: 5492234252233)</p>
    <input id="negocioWhatsapp"/>
    <label>Instagram</label>
    <input id="negocioInstagram"/>
    <button onclick="guardarNegocio()">Guardar datos</button>
    <p class="ok-msg hidden" id="negocioOk">Guardado ✅</p>
  </section>

  <!-- ===================== BACKUP ===================== -->
  <section class="card">
    <h2>💾 Backup</h2>
    <p class="ayuda">Tus productos, horarios y pedidos ya viven en el servidor (Supabase), no dependen de este navegador. Esto es una copia extra de productos/horarios/datos de contacto por las dudas — los pedidos no se incluyen porque ya tienen su historial en el servidor.</p>
    <button onclick="exportarBackup()">Descargar backup</button>
    <input type="file" id="inputBackup" accept="application/json" style="display:none" onchange="importarBackup(event)"/>
    <button onclick="document.getElementById('inputBackup').click()">Restaurar backup</button>
    <p class="ok-msg hidden" id="backupOk"></p>
  </section>

  <!-- ===================== SEGURIDAD ===================== -->
  <section class="card">
    <h2>🔒 Contraseña</h2>
    <p class="ayuda">Se cambia tu contraseña real de acceso (validada en el servidor, no en este navegador).</p>
    <input id="nuevaPass" type="password" placeholder="Nueva contraseña (mínimo 6 caracteres)"/>
    <button onclick="cambiarPass()">Cambiar contraseña</button>
    <p class="ok-msg hidden" id="passOk">Contraseña actualizada ✅</p>
  </section>

</main>

</div>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase-config.js"></script>
<script src="datos.js"></script>
<script src="admin.js"></script>

</body>
</html>

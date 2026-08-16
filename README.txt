══════════════════════════════════════════════════
   DELICIAS ALEMANAS WOLGADEUTSCHE
   Sistema de Pedidos — Versión 3.0
══════════════════════════════════════════════════

ESTA CARPETA TIENE DOS SISTEMAS INDEPENDIENTES:

  1) SISTEMA DE PEDIDOS (para compartir con clientes)
     Archivos sueltos en esta carpeta: index.html, panel-vzvehlcn.html, etc.

  2) RECETAS E INSUMOS (solo para vos, sin internet)
     Carpeta: recetas-insumos/

Los dos son apps web que también se pueden "instalar" en el
celular como si fueran apps de verdad (ver más abajo). Ninguna
usa una base de datos en internet: cada una guarda sus datos
en el dispositivo donde se abre.

══════════════════════════════════════════════════
1) SISTEMA DE PEDIDOS
══════════════════════════════════════════════════

ARCHIVOS:
──────────────────────
  index.html          → Lo que ven los clientes (subir a Instagram)
  cliente.css/js        → Estilos y lógica del cliente
  panel-vzvehlcn.html   → Tu panel de gestión (el nombre es así de raro a propósito, ver "SEGURIDAD" más abajo)
  admin.css/js          → Estilos y lógica del panel admin
  datos.js              → Datos compartidos entre cliente y admin
  manifest-cliente.json,
  manifest-admin.json,
  service-worker.js,
  icons/                → Necesarios para instalar como app (PWA)
  logo.jpg               → Logo del emprendimiento

CÓMO PROBARLO EN LA COMPUTADORA:
──────────────────────
  Los navegadores no dejan abrir estos archivos con doble clic
  (necesitan un "servidor" aunque sea local). La forma más simple:

  1. Instalá la extensión "Live Server" en VS Code
  2. Click derecho sobre index.html → "Open with Live Server"
  3. Lo mismo con panel-vzvehlcn.html

CÓMO PUBLICARLO PARA QUE LOS CLIENTES LO USEN:
──────────────────────
  El cliente solo necesita abrir: index.html

  ① Netlify (gratis, más fácil):
     - Ir a netlify.com/drop
     - Arrastrar TODA la carpeta (menos recetas-insumos/, que es aparte)
     - Obtenés un link al instante
     - Ese link va en la bio de Instagram

  ② GitHub Pages (gratis):
     - Crear cuenta en github.com, subir la carpeta, activar Pages

  Importante: el panel admin va a quedar accesible con el mismo link
  (ej: tulink.netlify.app/panel-vzvehlcn.html). Solo entra quien sepa
  la contraseña Y el nombre exacto del archivo — ver "SEGURIDAD" abajo.

TU PANEL (ADMIN):
──────────────────────
  Abrís: panel-vzvehlcn.html
  Contraseña inicial: te la paso por chat aparte, no queda escrita acá.
  CAMBIALA apenas entres por primera vez, desde el panel,
  sección "🔒 Contraseña".

  Desde ahí podés:
  ✅ Activar/desactivar los días en que tomás pedidos
  ✅ Cargar las franjas horarias de cada día (podés poner varias por día)
  ✅ Gestionar productos (nombre, precio, imagen, activo/inactivo)
  ✅ Ver los pedidos cargados desde ESTE MISMO dispositivo/navegador
  ✅ Marcar pedidos como entregados o cancelados
  ✅ Abrir WhatsApp directo a cada cliente
  ✅ Cambiar el número de WhatsApp e Instagram del negocio
  ✅ Exportar/restaurar un backup completo
  ✅ Ver la vista del cliente desde el panel ("👀 Ver vista cliente")

CÓMO FUNCIONA LA RESERVA DE DÍA Y HORARIO:
──────────────────────
  1. Vas a "🕐 Días y horarios" en el panel admin
  2. Activás el día con el interruptor
  3. Agregás una o más franjas horarias (ej: 14:00 a 20:00)
  4. Guardás
  → El cliente ve ese día como disponible y puede elegir
    cualquier horario dentro de esa franja (cada 15 minutos)
  → Los días que no activaste aparecen "sin cupo" y no se
    pueden seleccionar

⚠️ MUY IMPORTANTE — CÓMO TE LLEGAN LOS PEDIDOS:
──────────────────────
  Como no hay una base de datos compartida en internet, un pedido
  que un cliente hace DESDE SU PROPIO CELULAR no aparece
  automáticamente en tu panel admin (que está en tu compu o tu
  celular). Por eso, al confirmar el pedido, al cliente se le abre
  WhatsApp con TODO el detalle ya escrito (productos, día, horario,
  datos) listo para enviarte. Esa es la forma en que te enterás de
  los pedidos online.

  El listado de "Pedidos" del panel admin sirve para los pedidos
  que VOS cargás manualmente abriendo index.html en tu propio
  dispositivo (por ejemplo, cuando alguien te pide por teléfono y
  vos lo cargás ahí), y para tener un registro si después querés
  anotar ahí también los que te llegan por WhatsApp.

  Si en el futuro esto se vuelve un problema (muchos pedidos y
  se hace difícil llevarlos a mano desde WhatsApp), se puede sumar
  una base de datos compartida gratuita para que los pedidos de
  cualquier cliente aparezcan automáticamente en tu panel. Avisame
  si llegás a ese punto.

🔒 SEGURIDAD DEL PANEL — LEER:
──────────────────────
  Esta página no tiene un servidor propio (por eso es gratis), así
  que la verificación de contraseña se hace en el propio navegador.
  Eso quiere decir que alguien con conocimientos técnicos avanzados,
  usando TU MISMO dispositivo, en teoría podría saltear la pantalla
  de contraseña. No es algo que pueda pasar "a distancia": nadie
  puede ver tus pedidos ni tus datos reales desde otra computadora,
  porque no existe una base de datos compartida en internet — cada
  pedido y cada dato vive únicamente en el navegador donde lo cargaste.

  Lo que sí hicimos para que sea difícil de encontrar y de adivinar:
  ✔ El panel no tiene ningún link visible ni desde la página de
    clientes ni desde ningún otro lado — solo vos tenés la URL.
  ✔ El nombre del archivo (panel-vzvehlcn.html) es aleatorio, no
    "admin.html" como antes, así nadie lo adivina por las dudas.
  ✔ La contraseña inicial no queda escrita en ningún archivo de
    esta carpeta — te la paso aparte, y la cambiás vos.

  Si en algún momento querés un nivel de seguridad "a prueba de
  hackers" de verdad (con un login validado en un servidor, no en
  el navegador), se puede armar con un backend gratuito (por ejemplo
  Supabase), pero es un cambio más grande. Avisame si lo querés y lo
  charlamos.

INSTALAR COMO APP EN EL CELULAR:
──────────────────────
  Una vez publicado el link (Netlify/GitHub Pages):
  - Android/Chrome: abrir el link → menú (⋮) → "Instalar app" o
    "Agregar a pantalla de inicio"
  - iPhone/Safari: abrir el link → compartir → "Agregar a inicio"
  Queda como un ícono más, y funciona aunque no haya señal (una
  vez que se cargó por lo menos una vez).

BACKUP:
──────────────────────
  Desde el panel admin, sección "💾 Backup": "Descargar backup"
  guarda un archivo con productos, horarios y pedidos. Guardalo
  regularmente. Si necesitás restaurarlo (por ejemplo si cambiás
  de compu o se borran los datos del navegador), usá "Restaurar
  backup" y elegí ese archivo.

══════════════════════════════════════════════════
2) RECETAS E INSUMOS (carpeta recetas-insumos/)
══════════════════════════════════════════════════

  App aparte, pensada para uso exclusivo tuyo (de tu mujer), sin
  conexión a internet ni base de datos en la nube. Todo se guarda
  únicamente en el celular donde se instale.

  Abrí recetas-insumos/index.html (con Live Server para probar,
  o publicado en Netlify/GitHub Pages para instalarlo en el
  celular igual que el sistema de pedidos).

  Pestañas:
  🔔 Alertas      → insumos con stock por debajo del mínimo, y
                     los últimos movimientos de stock
  🧂 Insumos      → alta de insumos (nombre, unidad, stock actual,
                     stock mínimo para avisar), y carga de compras
  📖 Recetas      → cada receta define cuánto rinde y qué insumos
                     usa (con cantidad exacta por cada tanda)
  🍰 Producción   → elegís una receta y cuántas tandas hiciste;
                     se descuenta automáticamente el stock de cada
                     insumo usado
  💾 Backup       → exportar/restaurar todos los datos

  CAMBIAR DE CELULAR (backup manual, sin nube):
  ──────────────────────
  1. En el celular viejo: pestaña Backup → "Descargar backup"
     (queda un archivo .json, por ejemplo en la carpeta Descargas)
  2. Pasá ese archivo al celular nuevo (por WhatsApp a vos misma,
     por cable, por Google Drive, como prefieras — es solo para
     mover el archivo, no para que quede guardado en la nube)
  3. Instalá la app en el celular nuevo y abrí Backup → "Restaurar
     backup", elegí el archivo
  4. Listo, tenés todos tus insumos, recetas y movimientos

══════════════════════════════════════════════════
NOTAS GENERALES
══════════════════════════════════════════════════
  - Los datos de cada app se guardan en el navegador/dispositivo
    donde se usa (localStorage). No se pierden al cerrar la
    página, pero SÍ se pierden si se borran los datos del
    navegador o se desinstala la app. Por eso conviene hacer
    backup de vez en cuando en las dos apps.
  - Todo el diseño usa la paleta original (crema, negro, dorado).

Instagram: @delicias_alemanas.mdq
WhatsApp: 2234-252233
══════════════════════════════════════════════════

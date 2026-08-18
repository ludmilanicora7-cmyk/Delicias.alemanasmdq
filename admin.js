══════════════════════════════════════════════════
  RECETAS E INSUMOS — CÓMO INSTALARLA EN EL CELULAR
══════════════════════════════════════════════════

ACLARACIÓN IMPORTANTE (leer primero):
──────────────────────
  Esta app NO se instala con Android Studio y no genera un
  archivo .apk. Android Studio sirve para compilar apps
  escritas en Kotlin/Java y convertirlas en un .apk — pero
  esta app está hecha en HTML/JavaScript, así que ese paso
  no existe acá: el propio navegador Chrome del celular
  "instala" la carpeta como si fuera una app, sin pasar por
  Play Store ni por ningún programa de desarrollo.

  (Si en algún momento realmente quieren una app Android nativa
  de verdad, compilada con Android Studio, es un proyecto aparte
  y bastante más grande — avisame si llegan a necesitarlo.)

Esta carpeta es exclusiva para vos: NO se sube a internet, no
tiene que ver con la web de pedidos, y no se comparte con nadie.
Todo lo que cargués (insumos, recetas, stock) queda solo en tu
celular.

══════════════════════════════════════════════════
PASO 1 — PASAR LA CARPETA AL CELULAR (sin usar internet)
══════════════════════════════════════════════════
  1. Conectá el celular a la computadora con el cable USB
  2. En el celular, deslizá la notificación de USB y elegí
     "Transferencia de archivos" (o "MTP")
  3. En la computadora se va a abrir el celular como si fuera
     un pendrive
  4. Copiá TODA esta carpeta "recetas-insumos" (con las
     subcarpetas "icons" adentro, y todos los archivos:
     index.html, app.js, datos.js, style.css, manifest.json,
     service-worker.js) a una ubicación fija en el celular,
     por ejemplo:
        Almacenamiento interno / RecetasApp /

  ⚠️ Importante: dejala siempre en esa misma ubicación. Los
  datos que cargues (insumos, recetas, stock) quedan atados a
  esa carpeta exacta — si la movés o la renombrás después de
  haber cargado datos, la app no los va a encontrar.

══════════════════════════════════════════════════
PASO 2 — ABRIRLA POR PRIMERA VEZ
══════════════════════════════════════════════════
  1. En el celular, abrí la app "Archivos" (o "Mis archivos",
     según el celular)
  2. Andá hasta Almacenamiento interno / RecetasApp
  3. Tocá "index.html"
  4. Te va a preguntar con qué abrirlo → elegí "Chrome"

  Se abre la app funcionando. Pasá por las pestañas (Alertas,
  Insumos, Recetas, Producción, Backup) para conocerla.

══════════════════════════════════════════════════
PASO 3 — DEJARLE UN ÍCONO EN LA PANTALLA DE INICIO
══════════════════════════════════════════════════
  1. Con la app abierta en Chrome, tocá los tres puntitos (⋮)
  2. "Agregar a pantalla de inicio"
  3. Le podés poner el nombre que quieras, ej: "Recetas DA"

  Como es un archivo local (no una web con https), ese ícono
  va a abrir la app dentro de Chrome con la barra de
  direcciones visible arriba, no a pantalla completa como una
  app "de verdad" — pero funciona exactamente igual, guarda
  todo y anda sin conexión (nunca la necesitó).

══════════════════════════════════════════════════
BACKUP — MUY RECOMENDADO USARLO SEGUIDO
══════════════════════════════════════════════════
  Pestaña "💾 Backup" → "Descargar backup": genera un archivo
  .json con todos los insumos, recetas y movimientos.

  Guardalo en algún lado seguro (una carpeta del celular, un
  pendrive, donde prefieras). Si el día de mañana cambia de
  celular:
    1. Instalá la app en el celular nuevo (Pasos 1 a 3 de este
       mismo instructivo)
    2. Pasá el archivo de backup al celular nuevo
    3. Pestaña Backup → "Restaurar backup" → elegí el archivo
    4. Listo, están todos los datos de vuelta

══════════════════════════════════════════════════
SI QUIEREN, MÁS ADELANTE, QUE ABRA A PANTALLA COMPLETA
══════════════════════════════════════════════════
  Es posible lograr que se vea como una app instalada de
  verdad (sin la barra de Chrome arriba), usando un pequeño
  servidor local dentro del propio celular — sigue sin usar
  internet, pero es un paso extra. Si les interesa, avisen y
  lo armamos.
══════════════════════════════════════════════════

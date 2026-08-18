@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,600&family=Lato:wght@300;400;700&family=Playfair+Display:wght@400;700&family=UnifrakturMaguntia&display=swap');

:root {
  --vino: #6B1727;
  --vino-oscuro: #4A0F1C;
  --marfil: #FBF3E7;
  --oro-rosa: #C9976B;
  --rosa-empolvado: #E8C4B8;
  --carbon: #2B1D18;
  --negro: #1c1a17;
  --dorado: #c8a24a;
  --rojo: #a31621;
}

body {
  font-family: 'Lato', Arial, sans-serif;
  background: #f6f1e7;
  margin: 0;
}

/* ===================== HERO (admin) ===================== */
.admin-hero {
  position: relative;
  overflow: hidden;
  text-align: center;
  padding: 30px 20px 26px;
  background:
    radial-gradient(circle at 20% 15%, rgba(200,162,74,0.18), transparent 45%),
    radial-gradient(circle at 85% 10%, rgba(200,162,74,0.14), transparent 40%),
    linear-gradient(160deg, var(--vino) 0%, var(--vino-oscuro) 100%);
  color: var(--marfil);
}

/* Banderas laterales angostas — mismo lenguaje visual que la página de clientes */
.bandera-lateral {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 30px;
  z-index: 0;
  box-shadow: inset 0 0 14px rgba(0,0,0,.4);
}

.bandera-lateral::after {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    90deg,
    rgba(255,255,255,.14) 0, rgba(255,255,255,.14) 1px,
    transparent 1px, transparent 33.33%
  );
  mix-blend-mode: overlay;
}

.bandera-arg-lateral {
  left: 0;
  background: linear-gradient(
    90deg,
    #74ACDF 0%, #74ACDF 33.33%,
    #F6F1E7 33.33%, #F6F1E7 66.66%,
    #74ACDF 66.66%, #74ACDF 100%
  );
  box-shadow: inset -6px 0 14px rgba(0,0,0,.35), 4px 0 10px rgba(0,0,0,.3);
}

.bandera-ale-lateral {
  right: 0;
  background: linear-gradient(
    90deg,
    var(--negro) 0%, var(--negro) 33.33%,
    var(--rojo) 33.33%, var(--rojo) 66.66%,
    var(--dorado) 66.66%, var(--dorado) 100%
  );
  box-shadow: inset 6px 0 14px rgba(0,0,0,.35), -4px 0 10px rgba(0,0,0,.3);
}

.sol-arg {
  position: absolute;
  top: 50%;
  left: 15px;
  width: 20px;
  height: 20px;
  transform: translate(-50%, -50%);
  z-index: 1;
  filter: drop-shadow(0 1px 3px rgba(0,0,0,.4));
}

.admin-logo-wrap {
  position: relative;
  z-index: 3;
  width: 84px;
  height: 84px;
  margin: 0 auto 12px;
  border-radius: 50%;
  padding: 5px;
  background: linear-gradient(135deg, var(--dorado) 0%, var(--oro-rosa) 55%, var(--dorado) 100%);
  box-shadow: 0 6px 18px rgba(0,0,0,.5), 0 0 0 5px rgba(251,243,231,.08);
}

.admin-logo-wrap img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid var(--marfil);
  object-fit: cover;
  display: block;
}

.admin-hero h1 {
  position: relative;
  z-index: 2;
  font-family: 'UnifrakturMaguntia', cursive;
  font-weight: 400;
  font-size: 2.1rem;
  line-height: 1.15;
  color: var(--marfil);
  text-shadow: 0 2px 10px rgba(0,0,0,.4);
  margin-bottom: 2px;
}

.admin-hero p {
  position: relative;
  z-index: 2;
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 600;
  font-size: 1.05rem;
  color: var(--rosa-empolvado);
}

.admin-main {
  max-width: 900px;
  margin: auto;
  padding: 20px;
}

.card {
  background: white;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,.1);
}

.card h2 {
  font-family: 'Playfair Display', serif;
  color: var(--vino);
}

input {
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border-radius: 8px;
  border: 1px solid #ccc;
}

button {
  background: var(--vino);
  color: var(--marfil);
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 5px;
  font-family: 'Lato', sans-serif;
  font-weight: 700;
}

.prod-item {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  border-bottom: 1px solid #ddd;
}

.prod-item img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
}

.hidden {
  display: none !important;
}

/* ===================== LOGIN ===================== */
.login-box {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 20% 15%, rgba(200,162,74,0.18), transparent 45%),
    radial-gradient(circle at 85% 10%, rgba(200,162,74,0.14), transparent 40%),
    linear-gradient(160deg, var(--vino) 0%, var(--vino-oscuro) 100%);
}

.login-card {
  background: var(--marfil);
  padding: 30px;
  border-radius: 14px;
  text-align: center;
  width: 90%;
  max-width: 320px;
  box-shadow: 0 12px 32px rgba(0,0,0,.35);
  border-top: 3px solid var(--dorado);
}

.login-card h1 {
  font-family: 'UnifrakturMaguntia', cursive;
  font-weight: 400;
  font-size: 1.9rem;
  color: var(--vino-oscuro);
  margin-bottom: 4px;
}
.login-card p { color: #6E665A; margin-bottom: 16px; font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 1.05rem; }

/* ===================== HERO ===================== */
.admin-hero-botones {
  position: relative;
  z-index: 2;
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 12px;
  flex-wrap: wrap;
}

.link-btn {
  background: transparent;
  border: 1px solid var(--oro-rosa);
  color: var(--marfil);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: .85rem;
  text-decoration: none;
  cursor: pointer;
}

/* ===================== TEXTOS AYUDA / OK / ERROR ===================== */
.ayuda {
  font-size: .85rem;
  color: #6E665A;
  margin-bottom: 10px;
}

.ayuda-mini {
  font-size: .8rem;
  color: #6E665A;
}

.ok-msg {
  color: #1b7a3d;
  font-size: .85rem;
  margin-top: 6px;
}

.error-msg {
  color: #b5231b;
  font-size: .85rem;
  margin-top: 6px;
}

/* ===================== HORARIOS ADMIN ===================== */
.dia-row {
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}

.dia-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 42px;
  height: 24px;
}

.switch input { opacity: 0; width: 0; height: 0; }

.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #ccc;
  border-radius: 24px;
  transition: .2s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px; width: 18px;
  left: 3px; bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: .2s;
}

.switch input:checked + .slider {
  background-color: var(--vino);
}

.switch input:checked + .slider:before {
  transform: translateX(18px);
}

.franjas-list {
  margin: 6px 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.franja-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.franja-row input[type="time"] {
  width: auto;
  flex: 1;
}

.btn-mini {
  background: #f6f1e7;
  color: #1c1a17;
  border: 1px solid #d6c7aa;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: .82rem;
  cursor: pointer;
  display: inline-block;
  text-decoration: none;
  margin: 2px 4px 2px 0;
}

.btn-mini-danger {
  border-color: #e0a8a0;
  color: #b5231b;
}

.btn-x {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 4px;
}

/* ===================== PEDIDOS ===================== */
.filtros {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.filtro-btn {
  background: #f6f1e7;
  color: #1c1a17;
  border: 1px solid #d6c7aa;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: .82rem;
  cursor: pointer;
}

.filtro-btn.activo {
  background: var(--vino);
  color: var(--marfil);
}

.pedido-card {
  border: 1px solid #eee;
  border-left: 4px solid #c8a24a;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 10px;
}

.pedido-card.estado-entregado { border-left-color: #1b7a3d; opacity: .75; }
.pedido-card.estado-cancelado { border-left-color: #b5231b; opacity: .6; }

.pedido-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.badge {
  font-size: .7rem;
  padding: 3px 8px;
  border-radius: 20px;
  background: #eee;
  text-transform: capitalize;
}

.badge-pendiente { background: #fbe6b0; }
.badge-entregado { background: #c7e8d1; }
.badge-cancelado { background: #f3c6c0; }

.pedido-info {
  font-size: .85rem;
  color: #333;
  margin: 2px 0;
}

.pedido-botones {
  margin-top: 8px;
}

/* ===================== CINTA DE COLORES ALEMANES ===================== */
.cinta-alemana {
  height: 6px;
  background: linear-gradient(
    to right,
    #1c1a17 0%, #1c1a17 33.33%,
    #a31621 33.33%, #a31621 66.66%,
    #c8a24a 66.66%, #c8a24a 100%
  );
}

/* ===================== PEDIDO MANUAL ===================== */
.card-destacada {
  border: 2px solid #c8a24a;
}

.manual-prod-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #eee;
  gap: 10px;
}

.manual-prod-row input[type="number"] {
  width: 70px;
  margin: 0;
}

.manual-total {
  font-weight: bold;
  text-align: right;
  margin-top: 6px;
}
-- ═══════════════════════════════════════════════════════════
-- DELICIAS ALEMANAS — REGISTRO DE PAGOS (Caja)
-- ═══════════════════════════════════════════════════════════
-- Correr UNA vez en: supabase.com → tu proyecto → SQL Editor →
-- New query → pegar todo → Run.
-- Tiene que decir "Success. No rows returned".
--
-- Se puede volver a correr sin romper nada ni borrar datos.
--
-- QUÉ HACE Y POR QUÉ ASÍ:
-- Cada pedido puede tener VARIOS pagos (una seña ahora, el saldo
-- después). Por eso los pagos van en su propia tabla y no como
-- una columna "pagado sí/no" dentro de pedidos: con una sola
-- columna no habría forma de registrar una seña sin mentir.
--
-- Cada pago lleva SU PROPIA fecha. Si te dan la seña en agosto
-- por una torta de septiembre, esa plata entró en agosto. Así
-- el total de cada mes refleja lo que realmente cobraste.
-- ═══════════════════════════════════════════════════════════

create table if not exists pagos (
  id         text primary key,
  pedido_id  text not null references pedidos(id) on delete cascade,
  monto      numeric not null check (monto > 0),
  metodo     text not null default 'efectivo',   -- 'efectivo' | 'transferencia'
  nota       text,                                -- ej: "seña", "saldo"
  fecha      date not null,                       -- el día que entró la plata
  creado_en  timestamptz not null default now()
);

-- on delete cascade: si borrás un pedido, sus pagos se van con él.
-- Así no quedan pagos huérfanos inflando el total del mes.

-- ===================== ÍNDICES =====================
create index if not exists idx_pagos_pedido on pagos (pedido_id);
create index if not exists idx_pagos_fecha  on pagos (fecha desc);

-- ===================== SEGURIDAD =====================
-- Los pagos son información tuya, privada. A diferencia de los
-- pedidos (que cualquiera puede crear), acá NADIE sin login
-- puede ver ni tocar nada.

alter table pagos enable row level security;

drop policy if exists "pagos_admin_all" on pagos;

create policy "pagos_admin_all" on pagos
  for all to authenticated using (true) with check (true);

-- ===================== VERIFICACIÓN =====================
-- (opcional) Para confirmar que quedó bien, corré esto aparte:
-- select tablename, rowsecurity from pg_tables where tablename = 'pagos';
-- select policyname, cmd, roles from pg_policies where tablename = 'pagos';

-- ═══════════════════════════════════════════════════════════
-- DELICIAS ALEMANAS — ESQUEMA DE BASE DE DATOS (Supabase)
-- ═══════════════════════════════════════════════════════════
-- Cómo usar este archivo:
--   1. Entrá a tu proyecto en supabase.com
--   2. En el menú de la izquierda, "SQL Editor"
--   3. "New query", pegá TODO este archivo, y tocá "Run"
--   Con eso quedan creadas las tablas, los permisos de seguridad,
--   y los productos/horarios de ejemplo que ya tenías.
-- ═══════════════════════════════════════════════════════════

-- ===================== TABLAS =====================

create table productos (
  id text primary key,
  nombre text not null,
  precio numeric not null,
  imagen text,
  activo boolean not null default true
);

create table horarios (
  dia int primary key,          -- 0=Lunes ... 6=Domingo
  nombre text not null,
  activo boolean not null default false,
  franjas jsonb not null default '[]'::jsonb
);

create table pedidos (
  id text primary key,
  cliente_nombre text not null,
  cliente_tel text,
  tipo_entrega text,
  direccion text,
  items jsonb not null,
  total numeric not null,
  fecha date not null,
  hora text not null,
  estado text not null default 'pendiente',
  creado_en timestamptz not null default now()
);

create table negocio (
  id int primary key default 1,
  whatsapp text,
  instagram text
);

-- ===================== SEGURIDAD (RLS) =====================
-- Regla general: cualquier visitante puede VER los productos/horarios
-- (para armar su pedido) y CREAR un pedido nuevo. Pero solo vos,
-- con tu usuario y contraseña reales de Supabase, podés editar
-- productos/horarios, y ver/editar/borrar los pedidos.

alter table productos enable row level security;
alter table horarios  enable row level security;
alter table pedidos   enable row level security;
alter table negocio   enable row level security;

-- Lectura pública (clientes armando su pedido)
create policy "productos_select_publico" on productos for select using (true);
create policy "horarios_select_publico"  on horarios  for select using (true);
create policy "negocio_select_publico"   on negocio   for select using (true);

-- Cualquiera puede crear un pedido (es el cliente pidiendo), pero
-- no puede ver, editar ni borrar pedidos (ni los propios ni ajenos)
create policy "pedidos_insert_publico" on pedidos for insert with check (true);

-- Todo lo demás (editar productos/horarios/negocio, ver/editar/
-- borrar pedidos) requiere estar autenticado como admin
create policy "productos_admin_all" on productos for all using (auth.role() = 'authenticated');
create policy "horarios_admin_all"  on horarios  for all using (auth.role() = 'authenticated');
create policy "negocio_admin_all"   on negocio   for all using (auth.role() = 'authenticated');
create policy "pedidos_admin_select" on pedidos for select using (auth.role() = 'authenticated');
create policy "pedidos_admin_update" on pedidos for update using (auth.role() = 'authenticated');
create policy "pedidos_admin_delete" on pedidos for delete using (auth.role() = 'authenticated');

-- ===================== DATOS INICIALES =====================

insert into productos (id, nombre, precio, imagen, activo) values
  ('pretzel', 'Pretzel artesanal', 1200, 'img/pretzel.jpg', true),
  ('torta', 'Torta alemana', 6500, 'img/torta.jpg', true);

insert into horarios (dia, nombre, activo, franjas) values
  (0, 'Lunes', false, '[]'),
  (1, 'Martes', false, '[]'),
  (2, 'Miércoles', false, '[]'),
  (3, 'Jueves', true, '[{"inicio":"14:00","fin":"20:00"}]'),
  (4, 'Viernes', false, '[]'),
  (5, 'Sábado', true, '[{"inicio":"09:00","fin":"14:00"}]'),
  (6, 'Domingo', false, '[]');

insert into negocio (id, whatsapp, instagram) values
  (1, '5492234252233', '@delicias_alemanas.mdq');

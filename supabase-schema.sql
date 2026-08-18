-- ═══════════════════════════════════════════════════════════
-- DELICIAS ALEMANAS — ESQUEMA DE BASE DE DATOS (Supabase)
-- Versión 2 — corregida y re-ejecutable
-- ═══════════════════════════════════════════════════════════
-- Cómo usar:
--   1. supabase.com → tu proyecto → menú izquierdo "SQL Editor"
--   2. "New query", pegá TODO este archivo, tocá "Run"
--   3. Tiene que decir "Success. No rows returned"
--
-- Este archivo se puede correr las veces que quieras: no borra
-- datos ni tira error si las tablas ya existen.
-- ═══════════════════════════════════════════════════════════

-- ===================== TABLAS =====================

create table if not exists productos (
  id text primary key,
  nombre text not null,
  precio numeric not null,
  imagen text,
  activo boolean not null default true
);

create table if not exists horarios (
  dia int primary key,          -- 0=Lunes ... 6=Domingo
  nombre text not null,
  activo boolean not null default false,
  franjas jsonb not null default '[]'::jsonb
);

create table if not exists pedidos (
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

create table if not exists negocio (
  id int primary key default 1,
  whatsapp text,
  instagram text
);

-- ===================== SEGURIDAD (RLS) =====================
-- Regla general: cualquier visitante puede VER productos/horarios
-- (para armar su pedido) y CREAR un pedido. Solo vos, logueada con
-- tu email y contraseña de Supabase, podés editar productos/horarios
-- y ver/editar/borrar pedidos.

alter table productos enable row level security;
alter table horarios  enable row level security;
alter table pedidos   enable row level security;
alter table negocio   enable row level security;

-- Borra políticas viejas si existían (permite re-correr este archivo)
drop policy if exists "productos_select_publico" on productos;
drop policy if exists "horarios_select_publico"  on horarios;
drop policy if exists "negocio_select_publico"   on negocio;
drop policy if exists "pedidos_insert_publico"   on pedidos;
drop policy if exists "productos_admin_all"      on productos;
drop policy if exists "horarios_admin_all"       on horarios;
drop policy if exists "negocio_admin_all"        on negocio;
drop policy if exists "pedidos_admin_select"     on pedidos;
drop policy if exists "pedidos_admin_update"     on pedidos;
drop policy if exists "pedidos_admin_delete"     on pedidos;
drop policy if exists "pedidos_admin_all"        on pedidos;

-- Lectura pública (clientes armando su pedido)
create policy "productos_select_publico" on productos
  for select to anon, authenticated using (true);

create policy "horarios_select_publico" on horarios
  for select to anon, authenticated using (true);

create policy "negocio_select_publico" on negocio
  for select to anon, authenticated using (true);

-- Cualquiera puede CREAR un pedido, pero no verlo/editarlo/borrarlo
create policy "pedidos_insert_publico" on pedidos
  for insert to anon, authenticated with check (true);

-- Admin logueado: control total
create policy "productos_admin_all" on productos
  for all to authenticated using (true) with check (true);

create policy "horarios_admin_all" on horarios
  for all to authenticated using (true) with check (true);

create policy "negocio_admin_all" on negocio
  for all to authenticated using (true) with check (true);

create policy "pedidos_admin_all" on pedidos
  for all to authenticated using (true) with check (true);

-- ===================== DATOS INICIALES =====================
-- "on conflict do nothing": si ya cargaste tus productos reales,
-- esto NO los pisa.

insert into productos (id, nombre, precio, imagen, activo) values
  ('pretzel', 'Pretzel artesanal', 1200, '', true),
  ('torta', 'Torta alemana', 6500, '', true)
on conflict (id) do nothing;

insert into horarios (dia, nombre, activo, franjas) values
  (0, 'Lunes', false, '[]'),
  (1, 'Martes', false, '[]'),
  (2, 'Miércoles', false, '[]'),
  (3, 'Jueves', true, '[{"inicio":"14:00","fin":"20:00"}]'),
  (4, 'Viernes', false, '[]'),
  (5, 'Sábado', true, '[{"inicio":"09:00","fin":"14:00"}]'),
  (6, 'Domingo', false, '[]')
on conflict (dia) do nothing;

insert into negocio (id, whatsapp, instagram) values
  (1, '5492234252233', '@delicias_alemanas.mdq')
on conflict (id) do nothing;

-- ===================== VERIFICACIÓN =====================
-- (opcional) Corré esto después para ver que quedó todo:
-- select tablename, rowsecurity from pg_tables where schemaname='public';
-- select tablename, policyname, cmd, roles from pg_policies where schemaname='public';

-- ═══════════════════════════════════════════════════════════
-- EXTRAS PENSADOS PARA LA APP FUTURA (PC / celular)
-- ═══════════════════════════════════════════════════════════

-- Índices: hacen que listar pedidos por fecha o por "más nuevo
-- primero" siga siendo rápido cuando haya cientos de pedidos.
create index if not exists idx_pedidos_creado_en on pedidos (creado_en desc);
create index if not exists idx_pedidos_fecha     on pedidos (fecha);
create index if not exists idx_pedidos_estado    on pedidos (estado);

-- Realtime: habilita que Supabase AVISE al instante cuando entra
-- un pedido nuevo, en vez de que la app tenga que preguntar cada
-- 20 segundos. La app futura (y el panel, si lo actualizamos)
-- se puede "suscribir" a esta tabla y refrescar sola.
do $$
begin
  begin
    alter publication supabase_realtime add table pedidos;
  exception
    when duplicate_object then null;  -- ya estaba habilitada
    when undefined_object then null;  -- publicación no existe en este proyecto
  end;
end $$;

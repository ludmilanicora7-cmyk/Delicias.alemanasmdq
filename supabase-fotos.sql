-- ═══════════════════════════════════════════════════════════
-- DELICIAS ALEMANAS — DEPÓSITO DE FOTOS (Supabase Storage)
-- ═══════════════════════════════════════════════════════════
-- Correr en: supabase.com → SQL Editor → New query → Run.
-- Se puede correr de nuevo sin romper nada.
--
-- QUÉ HACE: crea un "bucket" (una carpeta en el servidor de
-- Supabase) llamado "productos", donde van a vivir las fotos
-- que suban desde el celular. Es público de lectura: las
-- clientas tienen que poder verlas sin estar logueadas.
-- Subir, cambiar y borrar, en cambio, solo con tu login.
-- ═══════════════════════════════════════════════════════════

insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do nothing;

-- Al ser público, la LECTURA ya está permitida por el propio
-- bucket y no hace falta política para eso. Definimos solo
-- quién puede escribir.

drop policy if exists "fotos_subir_admin"    on storage.objects;
drop policy if exists "fotos_editar_admin"   on storage.objects;
drop policy if exists "fotos_eliminar_admin" on storage.objects;

create policy "fotos_subir_admin" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'productos');

create policy "fotos_editar_admin" on storage.objects
  for update to authenticated
  using (bucket_id = 'productos');

create policy "fotos_eliminar_admin" on storage.objects
  for delete to authenticated
  using (bucket_id = 'productos');

-- ═══════════════════════════════════════════════════════════
-- SI ESTE ARCHIVO TE DA ERROR "must be owner of table objects":
-- algunos proyectos no dejan crear políticas de Storage por SQL.
-- En ese caso se hace a mano, es igual de rápido:
--   1. Menú izquierdo → Storage → New bucket
--   2. Nombre: productos · marcá "Public bucket" · Create
--   3. Listo: con el bucket público alcanza para que funcione
-- ═══════════════════════════════════════════════════════════

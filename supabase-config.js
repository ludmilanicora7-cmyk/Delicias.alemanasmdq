// ═══════════════════════════════════════════════════════════
// CONEXIÓN A SUPABASE — Delicias Alemanas Wolgadeutsche
// ═══════════════════════════════════════════════════════════
// Proyecto: Delicias_alemanas.mdq
//
// La "publishable key" NO es secreta: está diseñada para vivir acá,
// en el navegador, a la vista de todos. Lo que protege los datos son
// las políticas RLS que corrimos en la base (supabase-schema.sql).
//
// ⚠️ NUNCA pegues acá una "Secret key" (sb_secret_...) ni la vieja
// "service_role". Esas saltean el RLS por completo.
// ═══════════════════════════════════════════════════════════

const SUPABASE_URL = "https://rkendshhbxlvqemnavmk.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_YanY8FcSo2ztRrBSc4Al_Q_Pw6-CW6J";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

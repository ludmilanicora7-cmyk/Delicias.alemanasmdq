// ═══════════════════════════════════════════════════════════
// CONEXIÓN A SUPABASE — completá estos 2 valores
// ═══════════════════════════════════════════════════════════
// Los sacás de tu proyecto en supabase.com → ⚙️ Project Settings → API
//   - "Project URL"      → pegala en SUPABASE_URL
//   - "anon public" key  → pegala en SUPABASE_ANON_KEY
//
// Esta "anon public key" NO es secreta, está hecha para usarse acá
// (en el navegador). La que SÍ es secreta es la "service_role key" —
// esa nunca la copies a ningún archivo de esta carpeta.
// ═══════════════════════════════════════════════════════════

const SUPABASE_URL = "PEGA_ACA_TU_PROJECT_URL";
const SUPABASE_ANON_KEY = "PEGA_ACA_TU_ANON_PUBLIC_KEY";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

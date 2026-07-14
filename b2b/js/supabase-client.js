/* =======================================================
 * MOUNTAIN VIP TRANSFER - SUPABASE CLIENT CONFIGURATION
 * ======================================================= */

// ⚠️ Geliştirici Notu: Supabase Panelinizden aldığınız değerleri buraya yapıştırın.
// Supabase Dashboard -> Settings -> API -> Project API Keys
const SUPABASE_URL = "https://arefratllhbrwykxcmzj.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_1ie4Ha044fp3BjuD-rv31Q_TTjhhdYu";

let supabase;

try {
    if (SUPABASE_URL === "https://your-project-url.supabase.co" || !SUPABASE_ANON_KEY) {
        console.warn("⚠️ Supabase bağlantı bilgileri girilmemiş. Lütfen b2b/js/supabase-client.js dosyasını kendi anahtarlarınızla güncelleyin.");
    }
    // Supabase client initialization from CDN script
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (error) {
    console.error("Supabase client başlatılırken hata oluştu:", error);
}

// Global olarak erişilebilir kılalım
window.supabaseClient = supabase;
window.SUPABASE_CONFIGURED = (SUPABASE_URL !== "https://your-project-url.supabase.co");

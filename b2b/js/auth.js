/* =======================================================
 * MOUNTAIN VIP TRANSFER - B2B AUTHENTICATION & SESSIONS
 * ======================================================= */

// Auth Guard - Oturum durumunu doğrular ve yetkisiz erişimleri engeller
async function requireAuth(requiredRole = 'agency') {
    if (!window.supabaseClient) {
        console.error("Supabase client bulunamadı.");
        return;
    }

    const { data: { session }, error } = await window.supabaseClient.auth.getSession();
    
    if (error || !session) {
        // Oturum yoksa giriş sayfasına yönlendir
        window.location.href = '/b2b/index.html?error=unauthorized';
        return null;
    }

    // Kullanıcı rolünü kontrol et
    try {
        const { data: profile, error: profileError } = await window.supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (profileError || !profile) {
            console.error("Profil alınamadı:", profileError);
            window.location.href = '/b2b/index.html?error=noprofile';
            return null;
        }

        // Admin rolündekiler her yere erişebilir, agency rolündekiler admin sayfalarına giremez
        if (requiredRole === 'admin' && profile.role !== 'admin') {
            window.location.href = '/b2b/dashboard.html?error=forbidden';
            return null;
        }

        // Başarılı oturum verilerini döndür
        return { session, profile };
    } catch (e) {
        console.error("Auth denetim hatası:", e);
        window.location.href = '/b2b/index.html?error=authfail';
        return null;
    }
}

// Giriş işlemi
async function loginUser(email, password) {
    if (!window.supabaseClient) {
        return { error: { message: "Supabase istemcisi başlatılamadı. Lütfen API anahtarlarınızı b2b/js/supabase-client.js dosyasına yerleştirin." } };
    }

    const { data, error } = await window.supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) return { error };

    // Rolü kontrol edip doğru panele yönlendirelim
    try {
        const { data: profile } = await window.supabaseClient
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

        if (profile && profile.role === 'admin') {
            window.location.href = '/b2b/admin/index.html';
        } else {
            window.location.href = '/b2b/dashboard.html';
        }
    } catch (e) {
        window.location.href = '/b2b/dashboard.html';
    }

    return { data };
}

// Çıkış işlemi
async function logoutUser() {
    if (window.supabaseClient) {
        await window.supabaseClient.auth.signOut();
    }
    window.location.href = '/b2b/index.html?loggedout=true';
}

// Sayfa yüklendiğinde oturum bilgisini sağ üst bar için çekme fonksiyonu
async function loadUserNavbar(profile, agency = null) {
    const userMenu = document.getElementById('user-profile-menu');
    if (!userMenu) return;

    let agencyBadgeHTML = '';
    let nameText = profile.email;

    if (profile.role === 'admin') {
        agencyBadgeHTML = `<span class="agency-badge" style="background: rgba(231, 29, 54, 0.1); border-color: rgba(231, 29, 54, 0.2); color: #e71d36;">YÖNETİCİ</span>`;
        nameText = 'Mountain VIP Admin';
    } else if (agency) {
        agencyBadgeHTML = `<span class="agency-badge">${escapeHTML(agency.company_name)}</span>`;
        nameText = escapeHTML(agency.contact_person || profile.email);
    }

    userMenu.innerHTML = `
        ${agencyBadgeHTML}
        <div style="text-align: right; margin-right: 0.5rem;">
            <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary);">${nameText}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${profile.email}</div>
        </div>
        <button onclick="logoutUser()" class="btn-outline" style="padding: 0.35rem 0.8rem; font-size: 0.8rem; border-radius: 6px;">
            <i class="fas fa-sign-out-alt"></i> Çıkış
        </button>
    `;
}

// HTML XSS Koruması
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// Global scope'a ekleyelim
window.requireAuth = requireAuth;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.loadUserNavbar = loadUserNavbar;

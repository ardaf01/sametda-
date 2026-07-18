/* =======================================================
 * MOUNTAIN VIP TRANSFER - B2B ADMIN CONTROL PANEL LOGIC
 * ======================================================= */

let cachedBookings = [];
let cachedAgencies = [];

// Admin Dashboard Başlatıcı (admin/index.html)
async function initAdminDashboard(profile) {
    if (!window.supabaseClient) return;

    loadUserNavbar(profile);

    try {
        // 1. Tüm Acente Bilgilerini Çek (İsim çözmek için cache'leyeceğiz)
        const { data: agencies, error: agencyError } = await window.supabaseClient
            .from('agencies')
            .select('*');

        if (agencyError) throw agencyError;
        cachedAgencies = agencies;

        // Cari Toplam Alacak Hesabı
        const totalReceivables = agencies.reduce((sum, item) => sum + parseFloat(item.balance || 0), 0);
        document.getElementById('admin-stat-receivables').textContent = `€${totalReceivables.toFixed(2)}`;
        document.getElementById('admin-stat-agencies').textContent = agencies.length;

        // 2. Tüm Rezervasyonları Çek
        const { data: bookings, error: bookingsError } = await window.supabaseClient
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false });

        if (bookingsError) throw bookingsError;
        cachedBookings = bookings;

        // Rezervasyon İstatistikleri
        const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
        const pendingCount = bookings.filter(b => b.status === 'pending').length;

        document.getElementById('admin-stat-confirmed').textContent = confirmedCount;
        document.getElementById('admin-stat-pending').textContent = pendingCount;

        // Filtre dinleyicileri
        const searchInput = document.getElementById('admin-search-bookings');
        const filterSelect = document.getElementById('admin-filter-status');

        function filterAndRender() {
            let filtered = [...cachedBookings];
            const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';
            const statusVal = filterSelect ? filterSelect.value : 'all';

            if (statusVal !== 'all') {
                filtered = filtered.filter(b => b.status === statusVal);
            }

            if (searchVal) {
                filtered = filtered.filter(b => {
                    const agencyName = getAgencyName(b.agency_id).toLowerCase();
                    return b.passenger_name.toLowerCase().includes(searchVal) ||
                           b.booking_code.toLowerCase().includes(searchVal) ||
                           b.pickup_location.toLowerCase().includes(searchVal) ||
                           b.dropoff_location.toLowerCase().includes(searchVal) ||
                           agencyName.includes(searchVal);
                });
            }

            renderAdminBookingsTable(filtered);
        }

        if (searchInput) searchInput.addEventListener('input', filterAndRender);
        if (filterSelect) filterSelect.addEventListener('change', filterAndRender);

        // İlk Render
        filterAndRender();

    } catch (e) {
        console.error("Admin dashboard verileri çekilemedi:", e);
    }
}

// Rezervasyonları Yönetici Tablosuna Basma
function renderAdminBookingsTable(bookingsList) {
    const tbody = document.getElementById('admin-bookings-tbody');
    if (!tbody) return;

    if (bookingsList.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: var(--text-secondary); padding: 3rem;">
                    Rezervasyon talebi bulunamadı.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = bookingsList.map(b => {
        const agencyName = getAgencyName(b.agency_id);
        const formattedDate = formatDate(b.pickup_date);
        const formattedTime = b.pickup_time.substring(0, 5);
        const vehicleLabel = b.vehicle_type === 'vito' ? 'VIP Vito' : (b.vehicle_type === 'sprinter' ? 'VIP Sprinter' : 'Premium Vito');

        // Status options dropdown
        const statusOptions = `
            <select class="form-control" style="width:130px; height:34px; padding:0 0.5rem; font-size:0.8rem;" onchange="updateBookingStatus('${b.id}', this.value, '${b.agency_id}', ${b.agency_price}, '${b.status}')">
                <option value="pending" ${b.status === 'pending' ? 'selected' : ''}>Bekliyor</option>
                <option value="confirmed" ${b.status === 'confirmed' ? 'selected' : ''}>Onayla</option>
                <option value="completed" ${b.status === 'completed' ? 'selected' : ''}>Tamamlandı</option>
                <option value="cancelled" ${b.status === 'cancelled' ? 'selected' : ''}>İptal Et</option>
            </select>
        `;

        return `
            <tr>
                <td><strong>${escapeHTML(agencyName)}</strong></td>
                <td><strong>${escapeHTML(b.booking_code)}</strong></td>
                <td>
                    ${escapeHTML(b.passenger_name)}
                    <span style="font-size:0.75rem; color:var(--text-muted); display:block;">Uçuş: ${escapeHTML(b.flight_number || 'Belirtilmedi')} | Pax: ${b.pax}</span>
                </td>
                <td>${formattedDate} <span style="font-size:0.75rem; color:var(--text-muted); display:block;"><i class="far fa-clock"></i> ${formattedTime}</span></td>
                <td>
                    <div style="font-size:0.8rem; max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                        📍 ${escapeHTML(b.pickup_location)} → ${escapeHTML(b.dropoff_location)}
                    </div>
                    <span style="font-size:0.75rem; color:var(--text-muted);">${vehicleLabel}</span>
                </td>
                <td>
                    <strong class="text-gold">€${parseFloat(b.agency_price).toFixed(2)}</strong>
                    <span style="font-size:0.75rem; color:var(--text-muted); display:block; text-decoration:line-through;">€${parseFloat(b.base_price).toFixed(2)}</span>
                </td>
                <td>
                    <div style="display:flex; flex-direction:column; gap:0.4rem;">
                        ${statusOptions}
                        ${b.notes ? `<button class="btn-outline" style="padding:0.2rem 0.4rem; font-size:0.7rem; justify-content:center;" onclick="alert('Rezervasyon Notu:\\n${escapeHTML(b.notes)}')"><i class="far fa-comment-dots"></i> Notu Oku</button>` : ''}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Rezervasyon Durumunu Güncelleme ve Cari Borç Hesabı
async function updateBookingStatus(bookingId, newStatus, agencyId, agencyPrice, oldStatus) {
    if (!window.supabaseClient) return;

    try {
        // 1. Rezervasyon Durumunu Güncelle
        const { error: updateError } = await window.supabaseClient
            .from('bookings')
            .update({ status: newStatus })
            .eq('id', bookingId);

        if (updateError) throw updateError;

        // 2. İptal durumunda acenteye para iadesi (Borcu düşme)
        if (newStatus === 'cancelled' && oldStatus !== 'cancelled') {
            // Acentenin borcunu düşür
            const agency = cachedAgencies.find(a => a.id === agencyId);
            if (agency) {
                const newBalance = Math.max(0, parseFloat(agency.balance) - parseFloat(agencyPrice));
                await window.supabaseClient
                    .from('agencies')
                    .update({ balance: newBalance })
                    .eq('id', agencyId);
            }
        } 
        // İptal edilen bir rezervasyon tekrar aktif edilirse borcu geri ekle
        else if (oldStatus === 'cancelled' && newStatus !== 'cancelled') {
            const agency = cachedAgencies.find(a => a.id === agencyId);
            if (agency) {
                const newBalance = parseFloat(agency.balance) + parseFloat(agencyPrice);
                await window.supabaseClient
                    .from('agencies')
                    .update({ balance: newBalance })
                    .eq('id', agencyId);
            }
        }

        // Sayfayı sessizce yenileyelim
        const activeProfile = { email: document.getElementById('user-profile-menu').innerText.split('\n')[1] || 'Admin' };
        await initAdminDashboard(activeProfile);

    } catch (e) {
        console.error("Durum güncellenirken hata:", e);
        alert("Güncelleme yapılamadı: " + e.message);
    }
}

// =======================================================
// ACENTE YÖNETİM SAYFASI FONKSİYONLARI (admin/agencies.html)
// =======================================================

async function initAdminAgenciesPage(profile) {
    if (!window.supabaseClient) return;

    loadUserNavbar(profile);

    try {
        // Tüm acenteleri çek
        const { data: agencies, error: agencyError } = await window.supabaseClient
            .from('agencies')
            .select('*')
            .order('created_at', { ascending: false });

        if (agencyError) throw agencyError;
        cachedAgencies = agencies;

        // Acente Tablosunu Yaz
        renderAdminAgenciesTable(agencies);

        // Edit form submit listener
        document.getElementById('agency-edit-form').addEventListener('submit', handleAgencyEditSubmit);

        // Add form submit listener
        const addForm = document.getElementById('agency-add-form');
        if (addForm) {
            addForm.addEventListener('submit', handleAgencyAddSubmit);
        }

    } catch (e) {
        console.error("Acenteler yüklenirken hata:", e);
    }
}

function renderAdminAgenciesTable(agenciesList) {
    const tbody = document.getElementById('admin-agencies-tbody');
    if (!tbody) return;

    if (agenciesList.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: var(--text-secondary); padding: 3rem;">
                    Kayıtlı acente bulunmuyor.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = agenciesList.map(a => {
        return `
            <tr>
                <td>
                    <strong style="display:block; margin-bottom: 0.2rem;">${escapeHTML(a.company_name)}</strong>
                    <div style="display: flex; gap: 0.5rem; font-size: 0.72rem;">
                        <a href="#" style="color: var(--accent-gold); text-decoration: none; display: inline-flex; align-items: center; gap: 0.2rem;" onclick="openEditAgencyCard('${a.id}', '${escapeHTML(a.company_name)}', ${a.discount_rate}, ${a.credit_limit}, ${a.balance}, '${escapeHTML(a.contact_person)}', '${escapeHTML(a.phone)}'); return false;">
                            <i class="fas fa-pencil-alt"></i> Düzenle
                        </a>
                        <span style="color: var(--border-color);">|</span>
                        <a href="#" style="color: var(--danger-color); text-decoration: none; display: inline-flex; align-items: center; gap: 0.2rem;" onclick="deleteAgency('${a.id}', '${escapeHTML(a.company_name)}'); return false;">
                            <i class="fas fa-trash-alt"></i> Sil
                        </a>
                    </div>
                </td>
                <td data-label="Yetkili">${escapeHTML(a.contact_person || '-')}</td>
                <td data-label="İletişim">
                    <span style="font-size:0.85rem; display:block;">📞 ${escapeHTML(a.phone || '-')}</span>
                    <span style="font-size:0.75rem; color:var(--text-muted); display:block;">ID: ${a.id.substring(0,8)}...</span>
                </td>
                <td data-label="İndirim"><strong>%${parseFloat(a.discount_rate).toFixed(0)}</strong></td>
                <td data-label="Limit">€${parseFloat(a.credit_limit).toFixed(2)}</td>
                <td data-label="Borç (Bakiye)"><strong class="text-gold">€${parseFloat(a.balance).toFixed(2)}</strong></td>
            </tr>
        `;
    }).join('');
}

// Acente cari bilgilerini düzenleme kartını açma
function openEditAgencyCard(id, name, discount, limit, balance, contactPerson = '', phone = '') {
    document.getElementById('edit-agency-id').value = id;
    document.getElementById('edit-agency-name').value = name;
    document.getElementById('edit-contact-person').value = contactPerson;
    document.getElementById('edit-phone').value = phone;
    document.getElementById('edit-discount').value = discount;
    document.getElementById('edit-limit').value = limit;
    document.getElementById('edit-balance').value = balance;

    document.getElementById('agency-edit-card').style.display = 'block';
    
    // Düzenleme kartına kaydır
    document.getElementById('agency-edit-card').scrollIntoView({ behavior: 'smooth' });
}

function closeEditCard() {
    document.getElementById('agency-edit-card').style.display = 'none';
}

// Cari düzenleme formu gönderim kontrolü
async function handleAgencyEditSubmit(e) {
    e.preventDefault();

    if (!window.supabaseClient) return;

    const id = document.getElementById('edit-agency-id').value;
    const name = document.getElementById('edit-agency-name').value.trim();
    const contactPerson = document.getElementById('edit-contact-person').value.trim();
    const phone = document.getElementById('edit-phone').value.trim();
    const discount = parseFloat(document.getElementById('edit-discount').value);
    const limit = parseFloat(document.getElementById('edit-limit').value);
    const balance = parseFloat(document.getElementById('edit-balance').value);

    try {
        const { error } = await window.supabaseClient
            .from('agencies')
            .update({
                company_name: name,
                contact_person: contactPerson,
                phone: phone,
                discount_rate: discount,
                credit_limit: limit,
                balance: balance
            })
            .eq('id', id);

        if (error) throw error;

        // Kartı kapat ve listeyi yenile
        closeEditCard();
        
        const activeProfile = { email: document.getElementById('user-profile-menu').innerText.split('\n')[1] || 'Admin' };
        await initAdminAgenciesPage(activeProfile);

        alert("Acente cari kayıtları başarıyla güncellendi.");

    } catch (err) {
        console.error("Acente güncellenirken hata:", err);
        alert("Güncelleme başarısız oldu: " + err.message);
    }
}

// Acente ekleme formu gönderim kontrolü
async function handleAgencyAddSubmit(e) {
    e.preventDefault();

    if (!window.supabaseClient || !window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
        alert("Supabase bağlantı bilgileri alınamadı.");
        return;
    }

    const companyName = document.getElementById('add-company-name').value.trim();
    const contactPerson = document.getElementById('add-contact-person').value.trim();
    const phone = document.getElementById('add-phone').value.trim();
    const email = document.getElementById('add-email').value.trim();
    const password = document.getElementById('add-password').value;
    const discountRate = parseFloat(document.getElementById('add-discount').value);
    const creditLimit = parseFloat(document.getElementById('add-limit').value);

    const alertBox = document.getElementById('add-agency-alert');
    const submitBtn = document.getElementById('add-agency-btn');

    alertBox.innerHTML = '';
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Kaydediliyor...';

    try {
        // Geçici Supabase istemcisi (mevcut admin oturumunu bozmamak için)
        const tempClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY, {
            auth: {
                persistSession: false,
                autoRefreshToken: false
            }
        });

        // 1. Supabase Auth signup (Bu otomatik tetikleyicilerle public tabloları besleyecek)
        const { data, error } = await tempClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    role: 'agency',
                    company_name: companyName,
                    contact_person: contactPerson,
                    phone: phone,
                    discount_rate: discountRate,
                    credit_limit: creditLimit
                }
            }
        });

        if (error) throw error;

        // Başarılı uyarısı
        alertBox.innerHTML = `
            <div class="alert alert-success">
                <i class="fas fa-check-circle"></i>
                <div>
                    <strong>Acente Başarıyla Eklendi!</strong><br>
                    Acente hesabı oluşturuldu ve cari tanımlandı. Artık giriş yapabilirler.
                </div>
            </div>
        `;

        // Formu temizle
        document.getElementById('agency-add-form').reset();

        // Acente listesini yenile
        const activeProfile = { email: document.getElementById('user-profile-menu').innerText.split('\n')[1] || 'Admin' };
        await initAdminAgenciesPage(activeProfile);

    } catch (err) {
        console.error("Acente eklenirken hata:", err);
        alertBox.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-circle"></i>
                <span>Hata: ${err.message}</span>
            </div>
        `;
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-plus"></i> Acenteyi Kaydet &amp; Yetkilendir';
    }
}

// Acente silme fonksiyonu
async function deleteAgency(id, name) {
    if (!window.supabaseClient) return;

    if (!confirm(`"${name}" acentesini silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve acente sisteme giriş yapamayacaktır.`)) return;

    try {
        const { error } = await window.supabaseClient
            .from('profiles')
            .delete()
            .eq('id', id);

        if (error) throw error;

        alert("Acente başarıyla silindi.");
        
        const activeProfile = { email: document.getElementById('user-profile-menu').innerText.split('\n')[1] || 'Admin' };
        await initAdminAgenciesPage(activeProfile);
    } catch (err) {
        console.error("Acente silinirken hata:", err);
        alert("Silme işlemi başarısız: " + err.message);
    }
}
window.deleteAgency = deleteAgency;


// =======================================================
// UTILITIES
// =======================================================

function getAgencyName(agencyId) {
    const agency = cachedAgencies.find(a => a.id === agencyId);
    return agency ? agency.company_name : 'Bilinmeyen Acente';
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

window.initAdminDashboard = initAdminDashboard;
window.initAdminAgenciesPage = initAdminAgenciesPage;
window.updateBookingStatus = updateBookingStatus;
window.openEditAgencyCard = openEditAgencyCard;
window.closeEditCard = closeEditCard;

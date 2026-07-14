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
                <td><strong>${escapeHTML(a.company_name)}</strong></td>
                <td>${escapeHTML(a.contact_person || '-')}</td>
                <td>
                    <span style="font-size:0.85rem; display:block;">📞 ${escapeHTML(a.phone || '-')}</span>
                    <!-- Email will be loaded dynamically or resolved if stored -->
                    <span style="font-size:0.75rem; color:var(--text-muted); display:block;">ID: ${a.id.substring(0,8)}...</span>
                </td>
                <td><strong>%${parseFloat(a.discount_rate).toFixed(0)}</strong></td>
                <td>€${parseFloat(a.credit_limit).toFixed(2)}</td>
                <td><strong class="text-gold">€${parseFloat(a.balance).toFixed(2)}</strong></td>
                <td>
                    <button class="btn-outline" style="padding:0.3rem 0.6rem; font-size:0.8rem;" onclick="openEditAgencyCard('${a.id}', '${escapeHTML(a.company_name)}', ${a.discount_rate}, ${a.credit_limit}, ${a.balance})">
                        <i class="fas fa-edit"></i> Düzenle
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Acente cari bilgilerini düzenleme kartını açma
function openEditAgencyCard(id, name, discount, limit, balance) {
    document.getElementById('edit-agency-id').value = id;
    document.getElementById('edit-agency-name').value = name;
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
    const discount = parseFloat(document.getElementById('edit-discount').value);
    const limit = parseFloat(document.getElementById('edit-limit').value);
    const balance = parseFloat(document.getElementById('edit-balance').value);

    try {
        const { error } = await window.supabaseClient
            .from('agencies')
            .update({
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

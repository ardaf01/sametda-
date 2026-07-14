/* =======================================================
 * MOUNTAIN VIP TRANSFER - B2B DASHBOARD LOGIC
 * ======================================================= */

// Acente Dashboard Başlatıcı
async function initAgencyDashboard(profile, userId) {
    if (!window.supabaseClient) return;

    try {
        // 1. Acente Cari Detaylarını Getir
        const { data: agency, error: agencyError } = await window.supabaseClient
            .from('agencies')
            .select('*')
            .eq('id', userId)
            .single();

        if (agencyError || !agency) {
            console.error("Acente detayları alınamadı:", agencyError);
            return;
        }

        // Hoş geldiniz mesajını ve navbar'ı güncelle
        const welcomeMsg = document.getElementById('welcome-message');
        if (welcomeMsg) {
            welcomeMsg.textContent = `${agency.company_name} Kontrol Paneli`;
        }
        loadUserNavbar(profile, agency);

        // Cari İstatistiklerini Yaz
        const balance = parseFloat(agency.balance || 0);
        const creditLimit = parseFloat(agency.credit_limit || 0);
        const remainingLimit = Math.max(0, creditLimit - balance);

        document.getElementById('stat-balance').textContent = `€${balance.toFixed(2)}`;
        document.getElementById('stat-credit-limit').textContent = `€${remainingLimit.toFixed(2)}`;

        // 2. Rezervasyon Sayaçlarını & Rezervasyon Listesini Çek
        const { data: bookings, error: bookingsError } = await window.supabaseClient
            .from('bookings')
            .select('*')
            .eq('agency_id', userId)
            .order('created_at', { ascending: false });

        if (bookingsError) {
            console.error("Rezervasyonlar listelenirken hata oluştu:", bookingsError);
            return;
        }

        // Sayaçları güncelle
        const activeCount = bookings.filter(b => b.status === 'confirmed').length;
        const pendingCount = bookings.filter(b => b.status === 'pending').length;

        document.getElementById('stat-active-count').textContent = activeCount;
        document.getElementById('stat-pending-count').textContent = pendingCount;

        // Son 5 Rezervasyonu Tabloda Göster
        renderBookingsTable(bookings.slice(0, 5), 'bookings-tbody');

    } catch (e) {
        console.error("Dashboard yüklenirken hata oluştu:", e);
    }
}

// Tüm Rezervasyonlar Sayfası Başlatıcı (bookings.html)
async function initBookingsPage(profile, userId) {
    if (!window.supabaseClient) return;

    try {
        // Acente verilerini getir
        const { data: agency } = await window.supabaseClient
            .from('agencies')
            .select('*')
            .eq('id', userId)
            .single();

        loadUserNavbar(profile, agency);

        // Rezervasyonları getir
        const { data: bookings, error: bookingsError } = await window.supabaseClient
            .from('bookings')
            .select('*')
            .eq('agency_id', userId)
            .order('created_at', { ascending: false });

        if (bookingsError) {
            console.error("Rezervasyonlar listelenirken hata oluştu:", bookingsError);
            return;
        }

        // Filtreleme mantığı
        const filterStatus = document.getElementById('filter-status');
        const searchInput = document.getElementById('search-bookings');

        function filterAndRender() {
            let filtered = [...bookings];
            const statusVal = filterStatus ? filterStatus.value : 'all';
            const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';

            if (statusVal !== 'all') {
                filtered = filtered.filter(b => b.status === statusVal);
            }

            if (searchVal) {
                filtered = filtered.filter(b => 
                    b.passenger_name.toLowerCase().includes(searchVal) ||
                    b.booking_code.toLowerCase().includes(searchVal) ||
                    b.pickup_location.toLowerCase().includes(searchVal) ||
                    b.dropoff_location.toLowerCase().includes(searchVal)
                );
            }

            renderBookingsTable(filtered, 'bookings-all-tbody');
        }

        if (filterStatus) filterStatus.addEventListener('change', filterAndRender);
        if (searchInput) searchInput.addEventListener('input', filterAndRender);

        // İlk render
        filterAndRender();

    } catch (e) {
        console.error("Rezervasyonlar sayfası yüklenirken hata oluştu:", e);
    }
}

// Rezervasyonları Tabloya Basma Yardımcı Fonksiyonu
function renderBookingsTable(bookingsList, tbodyId) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;

    if (bookingsList.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: var(--text-secondary); padding: 3rem;">
                    <i class="fas fa-calendar-times" style="font-size: 2.5rem; margin-bottom: 1rem; display: block; opacity: 0.5;"></i>
                    Rezervasyon bulunmamaktadır.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = bookingsList.map(b => {
        const formattedDate = formatDate(b.pickup_date);
        const formattedTime = b.pickup_time.substring(0, 5);
        const vehicleLabel = b.vehicle_type === 'vito' ? 'VIP Vito' : (b.vehicle_type === 'sprinter' ? 'VIP Sprinter' : 'Premium Vito/S-Class');
        
        // Status badge styling
        let badgeClass = 'badge-pending';
        let statusText = 'Bekliyor';
        if (b.status === 'confirmed') { badgeClass = 'badge-confirmed'; statusText = 'Onaylandı'; }
        if (b.status === 'completed') { badgeClass = 'badge-completed'; statusText = 'Tamamlandı'; }
        if (b.status === 'cancelled') { badgeClass = 'badge-cancelled'; statusText = 'İptal Edildi'; }

        return `
            <tr>
                <td><strong>${escapeHTML(b.booking_code)}</strong></td>
                <td>${escapeHTML(b.passenger_name)} <span style="font-size:0.75rem; color:var(--text-muted); display:block;">${b.pax} Pax / ${b.luggage} Çanta</span></td>
                <td>${formattedDate} <span style="font-size:0.75rem; color:var(--text-muted); display:block;"><i class="far fa-clock"></i> ${formattedTime}</span></td>
                <td>
                    <div style="font-size:0.85rem; max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                        <i class="fas fa-map-marker-alt" style="color:var(--accent-gold); font-size:0.75rem;"></i> ${escapeHTML(b.pickup_location)}
                    </div>
                    <div style="font-size:0.85rem; max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-top:2px;">
                        <i class="fas fa-flag-checkered" style="color:var(--text-muted); font-size:0.75rem;"></i> ${escapeHTML(b.dropoff_location)}
                    </div>
                </td>
                <td><span style="font-size:0.85rem;">${vehicleLabel}</span></td>
                <td><strong class="text-gold">€${parseFloat(b.agency_price).toFixed(2)}</strong></td>
                <td><span class="badge ${badgeClass}">${statusText}</span></td>
            </tr>
        `;
    }).join('');
}

// Tarih Formatlama Yardımcısı (YYYY-MM-DD -> DD.MM.YYYY)
function formatDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

window.initAgencyDashboard = initAgencyDashboard;
window.initBookingsPage = initBookingsPage;

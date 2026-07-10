// --- Mountain VIP Transfer Application State ---
const state = {
    currentLang: (() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && ['tr', 'en', 'de', 'ru'].includes(urlLang.toLowerCase())) {
            return urlLang.toLowerCase();
        }
        const browserLang = (navigator.language || navigator.userLanguage || 'tr').toLowerCase();
        if (browserLang.startsWith('de')) return 'de';
        if (browserLang.startsWith('ru')) return 'ru';
        if (browserLang.startsWith('en')) return 'en';
        return 'tr';
    })(),
    currentCurrency: 'EUR',
    bookingType: 'transfer', // 'transfer' or 'tour'
    pickup: 'ayt',
    dropoff: 'belek',
    date: '',
    time: '',
    passengers: '1',
    vehicleType: 'vito',
    selectedSights: [], // array of sight IDs for custom tour
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    flightNo: '',
    notes: '',
    isRoundTrip: false,
    returnDate: '',
    returnTime: '',
    hourlyDuration: '4',
    mobileMenuOpen: false
};

// --- Constant Data Matrix ---

// Sights to visit in Antalya
const sights = {
    kaleici: {
        id: 'kaleici',
        names: { tr: 'Kaleiçi & Tarihi Liman', en: 'Kaleiçi & Old Harbor' },
        descriptions: {
            tr: 'Antalya’nın kalbi olan Kaleiçi, dar sokakları, Osmanlı mimarisi taş evleri, Hadrian Kapısı (Üçkapılar) ve tarihi yat limanıyla büyüleyici bir atmosfere sahiptir.',
            en: 'The heart of Antalya, Kaleiçi features narrow cobblestone streets, Ottoman-era stone mansions, Hadrian’s Gate, and a historic yacht harbor with a mesmerizing atmosphere.'
        },
        duration: 3, // hours
        img: 'assets/kaleici.png', // Fallback or customized
        priceMultiplier: 1.0
    },
    aspendos: {
        id: 'aspendos',
        names: { tr: 'Aspendos Antik Tiyatrosu', en: 'Aspendos Ancient Theatre' },
        descriptions: {
            tr: 'Roma döneminden günümüze kadar en iyi korunmuş antik tiyatrolardan biridir. Akustik harikası bu devasa yapı, günümüzde hala konser ve festivallere ev sahipliği yapmaktadır.',
            en: 'One of the best-preserved Roman theatres in the world. Famous for its perfect acoustics, this colossal structure still hosts concerts and opera festivals today.'
        },
        duration: 4,
        img: 'assets/aspendos.png',
        priceMultiplier: 1.2
    },
    duden: {
        id: 'duden',
        names: { tr: 'Düden Şelaleleri (Yukarı & Aşağı)', en: 'Düden Waterfalls (Upper & Lower)' },
        descriptions: {
            tr: 'Yukarı Düden, yemyeşil bir doğa içindeki şelale ve mağarasıyla huzur verirken; Aşağı Düden (Karpuzkaldıran), 40 metre yükseklikten doğrudan Akdeniz’e dökülen muhteşem bir manzara sunar.',
            en: 'Upper Düden offers tranquility in lush green nature with its cave and falls, while Lower Düden (Karpuzkaldıran) presents a spectacular sight as it cascades 40 meters directly into the sea.'
        },
        duration: 3,
        img: 'assets/duden.png',
        priceMultiplier: 1.0
    },
    phaselis: {
        id: 'phaselis',
        names: { tr: 'Phaselis Antik Kenti & Koyu', en: 'Phaselis Ancient City & Bay' },
        descriptions: {
            tr: 'Kemer yakınlarında, çam ağaçları arasına gizlenmiş antik liman kenti. Üç muhteşem doğal koyu ve sığ, sakin deniziyle hem tarih hem de yüzme keyfini bir arada sunar.',
            en: 'An ancient harbor city hidden among pine forests near Kemer. Boasting three beautiful natural bays and calm shallow waters, it combines history with swimming pleasure.'
        },
        duration: 5,
        img: 'assets/phaselis.png',
        priceMultiplier: 1.3
    },
    saklikent: {
        id: 'saklikent',
        names: { tr: 'Saklıkent Kanyonu', en: 'Saklıkent Gorge & Canyon' },
        descriptions: {
            tr: 'Türkiye’nin en derin kanyonlarından biri. Buz gibi akan suların içinde yürüyüş yapabileceğiniz, rafting ve çamur banyosu aktiviteleri sunan macera dolu bir doğa harikası.',
            en: 'One of the deepest canyons in Turkey. An adventurous natural wonder where you can walk through freezing rushing waters, try rafting, and enjoy mud baths.'
        },
        duration: 7,
        img: 'assets/saklikent.png',
        priceMultiplier: 1.8
    },
    perge: {
        id: 'perge',
        names: { tr: 'Perge Antik Kenti', en: 'Perge Ancient City' },
        descriptions: {
            tr: 'Pamfilya bölgesinin eski başkenti olan Perge; sütunlu caddeleri, antik hamamları, anıtsal çeşmeleri (nymphaeum) ve dev stadyumu ile arkeoloji meraklıları için eşsiz bir duraktır.',
            en: 'The former capital of the Pamphylia region, Perge features grand colonnaded streets, Roman baths, monumental fountains, and a massive ancient stadium.'
        },
        duration: 3,
        img: 'assets/perge.png',
        priceMultiplier: 1.0
    },
    kemer_canyon: {
        id: 'kemer_canyon',
        names: { tr: 'Göynük Kanyonu', en: 'Göynük Canyon' },
        descriptions: {
            tr: 'Kemer bölgesinde yer alan, macera parkurları, zipline aktiviteleri ve harika yeşil doğasıyla bilinen popüler bir kanyon ve yürüyüş rotasıdır.',
            en: 'Located in the Kemer region, it is a famous canyon and trekking route known for its adventure tracks, zipline activities, and luxury green scenery.'
        },
        duration: 4,
        img: 'assets/goynuk.png',
        priceMultiplier: 1.1
    },
    alanya_castle: {
        id: 'alanya_castle',
        names: { tr: 'Alanya Kalesi & Damlataş', en: 'Alanya Castle & Damlataş Cave' },
        descriptions: {
            tr: 'Yarımada üzerinde yükselen Selçuklu kalesi, muhteşem Kleopatra Plajı manzarası ve astım hastalarına şifa veren Damlataş Mağarası ile Alanya’nın simgesidir.',
            en: 'The Seljuk fortress rising high on the peninsula, overlooking the famous Cleopatra Beach, combined with Damlataş Cave known for its healing microclimate.'
        },
        duration: 6,
        img: 'assets/alanya.png',
        priceMultiplier: 1.6
    }
};

// Hierarchical Antalya Location List (50+ Locations)
// distFromAyt: approximate road distance from Antalya Airport (AYT) in km
// distFromGzp: approximate road distance from Gazipaşa Airport (GZP) in km
const locations = {
    // Airports
    ayt: { tr: 'Antalya Havalimanı (AYT)', en: 'Antalya Airport (AYT)', distFromAyt: 0, distFromGzp: 170, type: 'airport' },
    gzp: { tr: 'Gazipaşa Havalimanı (GZP)', en: 'Gazipaşa Airport (GZP)', distFromAyt: 170, distFromGzp: 0, type: 'airport' },

    // Antalya Merkez
    kaleici: { tr: 'Kaleiçi (Antalya Merkez)', en: 'Kaleiçi (Old Town)', distFromAyt: 15, distFromGzp: 175, region: 'center' },
    kepez: { tr: 'Kepez', en: 'Kepez', distFromAyt: 15, distFromGzp: 180, region: 'center' },
    muratpasa: { tr: 'Muratpaşa', en: 'Muratpaşa', distFromAyt: 12, distFromGzp: 172, region: 'center' },
    aksu: { tr: 'Aksu', en: 'Aksu', distFromAyt: 10, distFromGzp: 165, region: 'center' },
    lara: { tr: 'Lara', en: 'Lara', distFromAyt: 15, distFromGzp: 168, region: 'center' },
    kundu: { tr: 'Kundu', en: 'Kundu', distFromAyt: 20, distFromGzp: 165, region: 'center' },
    konyaalti: { tr: 'Konyaaltı', en: 'Konyaaltı', distFromAyt: 25, distFromGzp: 185, region: 'center' },

    // Belek
    belek: { tr: 'Belek (Merkez)', en: 'Belek (Center)', distFromAyt: 35, distFromGzp: 145, region: 'belek' },
    kadriye: { tr: 'Kadriye (Belek)', en: 'Kadriye (Belek)', distFromAyt: 30, distFromGzp: 150, region: 'belek' },
    serik: { tr: 'Serik', en: 'Serik', distFromAyt: 35, distFromGzp: 145, region: 'belek' },
    bogazkent: { tr: 'Boğazkent (Belek)', en: 'Boğazkent (Belek)', distFromAyt: 40, distFromGzp: 140, region: 'belek' },

    // Side
    ilica: { tr: 'Ilıca (Side)', en: 'Ilıca (Side)', distFromAyt: 60, distFromGzp: 115, region: 'side' },
    kumkoy: { tr: 'Kumköy (Side)', en: 'Kumköy (Side)', distFromAyt: 62, distFromGzp: 113, region: 'side' },
    evrenseki: { tr: 'Evrenseki (Side)', en: 'Evrenseki (Side)', distFromAyt: 60, distFromGzp: 115, region: 'side' },
    gundogdu: { tr: 'Gündoğdu (Side)', en: 'Gündoğdu (Side)', distFromAyt: 55, distFromGzp: 120, region: 'side' },
    colakli: { tr: 'Çolaklı (Side)', en: 'Çolaklı (Side)', distFromAyt: 53, distFromGzp: 122, region: 'side' },
    denizyaka: { tr: 'Denizyaka (Side)', en: 'Denizyaka (Side)', distFromAyt: 48, distFromGzp: 127, region: 'side' },
    sorgun: { tr: 'Sorgun (Side)', en: 'Sorgun (Side)', distFromAyt: 68, distFromGzp: 107, region: 'side' },
    titreyengol: { tr: 'Titreyengöl (Side)', en: 'Titreyengöl (Side)', distFromAyt: 70, distFromGzp: 105, region: 'side' },

    // Manavgat
    cenger: { tr: 'Çenger (Manavgat)', en: 'Çenger (Manavgat)', distFromAyt: 85, distFromGzp: 90, region: 'manavgat' },
    kizilagac: { tr: 'Kızılağaç (Manavgat)', en: 'Kızılağaç (Manavgat)', distFromAyt: 80, distFromGzp: 95, region: 'manavgat' },
    kizilot: { tr: 'Kızılot (Manavgat)', en: 'Kızılot (Manavgat)', distFromAyt: 83, distFromGzp: 92, region: 'manavgat' },

    // Alanya
    cikcilli: { tr: 'Cikcilli (Alanya)', en: 'Cikcilli (Alanya)', distFromAyt: 125, distFromGzp: 40, region: 'alanya' },
    incekum: { tr: 'İncekum (Alanya)', en: 'İncekum (Alanya)', distFromAyt: 98, distFromGzp: 67, region: 'alanya' },
    karaburun: { tr: 'Karaburun (Alanya)', en: 'Karaburun (Alanya)', distFromAyt: 93, distFromGzp: 72, region: 'alanya' },
    kestel: { tr: 'Kestel (Alanya)', en: 'Kestel (Alanya)', distFromAyt: 130, distFromGzp: 35, region: 'alanya' },
    oba: { tr: 'Oba (Alanya)', en: 'Oba (Alanya)', distFromAyt: 125, distFromGzp: 40, region: 'alanya' },
    payallar: { tr: 'Payallar (Alanya)', en: 'Payallar (Alanya)', distFromAyt: 110, distFromGzp: 55, region: 'alanya' },
    tosmur: { tr: 'Tosmur (Alanya)', en: 'Tosmur (Alanya)', distFromAyt: 127, distFromGzp: 38, region: 'alanya' },
    okurcalar: { tr: 'Okurcalar (Alanya)', en: 'Okurcalar (Alanya)', distFromAyt: 90, distFromGzp: 75, region: 'alanya' },
    avsallar: { tr: 'Avsallar (Alanya)', en: 'Avsallar (Alanya)', distFromAyt: 100, distFromGzp: 65, region: 'alanya' },
    turkler: { tr: 'Türkler (Alanya)', en: 'Türkler (Alanya)', distFromAyt: 105, distFromGzp: 60, region: 'alanya' },
    konakli: { tr: 'Konaklı (Alanya)', en: 'Konaklı (Alanya)', distFromAyt: 115, distFromGzp: 50, region: 'alanya' },
    mahmutlar: { tr: 'Mahmutlar (Alanya)', en: 'Mahmutlar (Alanya)', distFromAyt: 135, distFromGzp: 30, region: 'alanya' },
    kargicak: { tr: 'Kargıcak (Alanya)', en: 'Kargıcak (Alanya)', distFromAyt: 140, distFromGzp: 25, region: 'alanya' },

    // Kemer
    beldibi: { tr: 'Beldibi (Kemer)', en: 'Beldibi (Kemer)', distFromAyt: 45, distFromGzp: 205, region: 'kemer' },
    goynuk: { tr: 'Göynük (Kemer)', en: 'Göynük (Kemer)', distFromAyt: 50, distFromGzp: 210, region: 'kemer' },
    kiris: { tr: 'Kiriş (Kemer)', en: 'Kiriş (Kemer)', distFromAyt: 60, distFromGzp: 220, region: 'kemer' },
    camyuva: { tr: 'Çamyuva (Kemer)', en: 'Çamyuva (Kemer)', distFromAyt: 62, distFromGzp: 222, region: 'kemer' },
    tekirova: { tr: 'Tekirova (Kemer)', en: 'Tekirova (Kemer)', distFromAyt: 70, distFromGzp: 230, region: 'kemer' },

    // Adrasan & West Antalya
    ulupinar: { tr: 'Ulupınar (Kemer/Adrasan)', en: 'Ulupınar (Kemer/Adrasan)', distFromAyt: 75, distFromGzp: 235, region: 'adrasan' },
    olimpos: { tr: 'Olimpos', en: 'Olympos', distFromAyt: 90, distFromGzp: 250, region: 'adrasan' },
    mavikent: { tr: 'Mavikent', en: 'Mavikent', distFromAyt: 105, distFromGzp: 265, region: 'adrasan' },
    cirali: { tr: 'Çıralı', en: 'Çıralı', distFromAyt: 90, distFromGzp: 250, region: 'adrasan' },
    kumluca: { tr: 'Kumluca', en: 'Kumluca', distFromAyt: 100, distFromGzp: 260, region: 'adrasan' },
    finike: { tr: 'Finike', en: 'Finike', distFromAyt: 120, distFromGzp: 280, region: 'adrasan' },
    demre: { tr: 'Demre', en: 'Demre', distFromAyt: 145, distFromGzp: 305, region: 'adrasan' },
    kekova: { tr: 'Kekova', en: 'Kekova', distFromAyt: 165, distFromGzp: 325, region: 'adrasan' },
    kalkan: { tr: 'Kalkan', en: 'Kalkan', distFromAyt: 220, distFromGzp: 380, region: 'adrasan' },
    patara: { tr: 'Patara', en: 'Patara', distFromAyt: 225, distFromGzp: 385, region: 'adrasan' },
    kas: { tr: 'Kaş', en: 'Kaş', distFromAyt: 200, distFromGzp: 360, region: 'adrasan' }
};

// Vehicles metadata
const vehicles = {
    vito: {
        name: 'VIP Mercedes Vito',
        image: 'assets/vip_vito_real.png',
        interiorImage: 'assets/vip_vito_interior.png',
        capacity: '7',
        bags: '6',
        multiplier: 1.0,
        amenities: {
            tr: ['Yatarlı Deri Konfor Koltuklar', 'Ücretsiz Wi-Fi & Şarj Üniteleri', 'VIP İsimle Karşılama Hizmeti', 'Mini Bar & Buzdolabı', 'Klima & İklimlendirme'],
            en: ['Reclining Leather Comfort Seats', 'Free Wi-Fi & Charging Ports', 'VIP Name Sign Welcome Service', 'Mini Bar & Fridge', 'Air Conditioning & Climate Control'],
            de: ['Verstellbare Leder-Komfortsitze', 'Kostenloses WLAN & Ladeanschlüsse', 'VIP Namensschild Empfang', 'Mini-Bar & Kühlschrank', 'Klimaanlage & Belüftung'],
            ru: ['Откидные кожаные комфортные сиенья', 'Бесплатный Wi-Fi и зарядные порты', 'VIP встреча с именной табличкой', 'Мини-бар и холодильник', 'Кондиционер и климат-контроль']
        }
    },
    vito_premium: {
        name: 'Premium VIP Vito',
        image: 'assets/vip_vito_premium.png',
        interiorImage: 'assets/vip_vito_premium_interior.png',
        capacity: '7',
        bags: '6',
        multiplier: 1.25,
        badge: 'PREMIUM',
        amenities: {
            tr: ['Özel Antalya Tur Hizmeti (Pamukkale, Kapadokya vb.)', 'Araç İçi Bölme (Partition) & Multimedya TV', 'Yıldızlı Tavan Ambiyans Aydınlatması', 'VIP İsimle Karşılama Hizmeti', 'Mini Bar & Buzdolabı'],
            en: ['Private Antalya Tour Service (Pamukkale, Cappadocia etc.)', 'Private Cabin Partition & Multimedia TV', 'Star Ceiling Ambient Lighting', 'VIP Name Board Welcome Service', 'Mini Bar & Fridge'],
            de: ['Privater Antalya Tour-Service (Pamukkale, Kappadokien usw.)', 'Kabinentrennwand & Multimedia-TV', 'Sternenhimmel-Ambiente', 'VIP Namensschild Empfang', 'Mini-Bar & Kühlschrank'],
            ru: ['Частный тур по Анталье (Памуккале, Каппадокия и др.)', 'Перегородка кабины и мультимедийный ТВ', 'Звёздный потолок', 'VIP встреча с именной табличкой', 'Мини-бар и холодильник']
        }
    },
    sprinter: {
        name: 'VIP Mercedes Sprinter',
        image: 'assets/vip_sprinter_real.png',
        interiorImage: 'assets/vip_sprinter_interior.png',
        capacity: '16',
        bags: '15',
        multiplier: 1.4,
        amenities: {
            tr: ['Yatarlı Konfor Koltuklar', 'Mini Bar & Buzdolabı', 'Geniş Bagaj Hacmi', 'Premium Multimedya Ses Sistemi', 'Yüksek Tavan Ferahlığı'],
            en: ['Reclining Comfort Seats', 'Mini Bar & Fridge', 'Extra Large Luggage Capacity', 'Premium Multimedia Sound System', 'Spacious High-Roof Cabin'],
            de: ['Verstellbare Komfortsitze', 'Mini-Bar & Kühlschrank', 'Sehr großer Gepäckraum', 'Premium-Multimedia-Soundsystem', 'Geräumige Kabine mit hohem Dach'],
            ru: ['Откидные комфортные сиденья', 'Мини-бар и холодильник', 'Большое багажное отделение', 'Мультимедийная аудиосистема премиум-класса', 'Просторный салон с высокой крышей']
        }
    },
    shuttle: {
        name: 'Shuttle Sprinter',
        image: 'assets/shuttle_sprinter.png',
        interiorImage: 'assets/shuttle_sprinter.png',
        capacity: '16',
        bags: '14',
        multiplier: 0.75,
        amenities: {
            tr: ['Standart Konfor Koltuklar', 'Klima Sistemi', 'Geniş Bagaj Bölümü', 'USB Şarj Portları', 'Sigortalı Yolculuk'],
            en: ['Standard Comfort Seats', 'Air Conditioning System', 'Extra Large Luggage Space', 'USB Charging Ports', 'Fully Insured Travel'],
            de: ['Bequeme Standardsitze', 'Klimaanlage', 'Großes Gepäckraumfach', 'USB-Ladeanschlüsse', 'Vollversicherter Transport'],
            ru: ['Стандартные комфортные сиденья', 'Кондиционер', 'Большое багажное отделение', 'USB зарядные порты', 'Застрахованный трансфер']
        }
    }
};

// Helper to normalize Turkish strings for search matching
function normalizeStr(str) {
    if (!str) return '';
    return str
        .toLowerCase()
        .replace(/ı/g, 'i')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c');
}

// --- Language Translations Dictionary ---
const translations = {
    tr: {
        brand: 'Mountain<span>VIP</span>',
        nav_home: 'Ana Sayfa',
        nav_fleet: 'VIP Filomuz',
        nav_tours: 'Gezilecek Yerler',
        nav_why: 'Neden Mountain VIP',
        nav_faq: 'S.S.S.',
        nav_contact: 'İletişim',
        cta_call: '7/24 Rezervasyon & Destek',
        hero_badge: '7/24 Kesintisiz VIP Ulaşım & Transfer',
        hero_title: 'Antalya 7/24 VIP Transfer | Yurt Dışından Lüks Ulaşım Deneyimi',
        hero_text: 'Havalimanından otelinize veya Antalya’nın dilediğiniz noktasına; son model, ultra lüks donanımlı araçlarımız ve profesyonel sürücülerimiz ile 7/24 konforlu seyahat edin.',
        hero_feat_1: 'Ücretsiz Havalimanı Karşılama',
        hero_feat_2: 'Canlı Uçuş Takibi',
        hero_feat_3: 'Sabit Fiyat & Kolay İptal',
        widget_title: 'VIP Rezervasyon Formu',
        widget_pickup: 'Alış Noktası (Nereden?)',
        widget_dropoff: 'Varış Noktası (Nereye?)',
        widget_date: 'Transfer Tarihi',
        widget_time: 'Transfer Saati',
        widget_pax: 'Yolcu Sayısı',
        widget_vehicle: 'Araç Tercihi',
        widget_btn: 'Fiyatı Hesapla & İncele',
        fleet_title: 'Seçkin VIP Araç Filomuz',
        fleet_subtitle: 'Antalya seyahatiniz için özenle tasarlanmış lüks donanımlı araçlarımızı inceleyin',
        fleet_capacity: 'Kişi',
        fleet_bags: 'Bagaj',
        fleet_from: 'Transfer Fiyatı',
        fleet_book_btn: 'Rezervasyon Yap',
        why_title: 'Neden Mountain VIP?',
        why_subtitle: 'Antalya genelinde en prestijli, güvenli ve konforlu VIP transfer seyahatini sunuyoruz',
        why_feat_1_title: '7/24 Kesintisiz Hizmet',
        why_feat_1_desc: 'Günün veya gecenin her saatinde, uçuşunuz ne zaman inerse insin güler yüzlü ekibimiz sizi bekliyor olacak.',
        why_feat_2_title: 'Uçuş Takip Sistemi',
        why_feat_2_desc: 'Uçağınız rötar yapsa dahi ek ücret yansıtmadan, uçuş numaranızı takip ederek geliş saatinize göre orada oluyoruz.',
        why_feat_3_title: 'İsimle Karşılama',
        why_feat_3_desc: 'Havalimanı çıkış kapısında adınızın yazılı olduğu şık bir karşılama panosu ile sizi karşılar ve bagajlarınızı taşırız.',
        why_feat_4_title: 'Şeffaf Sabit Fiyatlar',
        why_feat_4_desc: 'Otoban, tünel, havalimanı otopark ücretleri ve yakıt fiyata dahildir. Sürpriz ek maliyetler çıkmaz.',
        tours_title: 'Antalya’da Gezilecek Popüler Yerler',
        tours_subtitle: 'Antalya ve çevresindeki en popüler turistik destinasyonları keşfedin, VIP transfer hizmetimizle konforlu seyahat edin.',
        tour_btn_discover: 'Bölge Detayı',
        tour_btn_book: 'Ulaşım Rezervasyonu',
        sidebar_title: 'Size Özel Tur Planı',
        sidebar_empty: 'Rotanıza henüz bir destinasyon eklemediniz. Yukarıdaki kartlardan yer ekleyerek kendi turunuzu oluşturun.',
        sidebar_duration: 'Tahmini Tur Süresi',
        sidebar_vehicle: 'Tercih Edilen Araç',
        sidebar_price: 'Toplam Tur Ücreti',
        sidebar_book: 'Özel Tur Rezervasyonu Yap',
        faq_title: 'Sıkça Sorulan Sorular',
        faq_subtitle: 'Rezervasyon süreci, iptal koşulları ve araç içi hizmetlerimiz hakkında merak edilenler',
        faq_q1: 'Rezervasyonumu nasıl yapabilirim?',
        faq_a1: 'Web sitemizdeki hızlı formu doldurup "Hesapla" butonuna tıkladıktan sonra dilediğiniz VIP aracı seçerek WhatsApp üzerinden anında talep oluşturabilirsiniz. Müşteri temsilcimiz hemen onay verecektir.',
        faq_q2: 'Uçağım gecikirse ekstra bir ödeme yapar mıyım?',
        faq_a2: 'Kesinlikle hayır. Rezervasyon esnasında belirttiğiniz uçuş numarası ile uçağınızın durumunu canlı takip ediyor, iniş saatinize göre kapıda oluyoruz. Gecikmeler için ek ücret talep etmiyoruz.',
        faq_q3: 'Ödemeyi nasıl yapabilirim?',
        faq_a3: 'Ödemenizi transfer başladığında araçtaki profesyonel sürücümüze nakit (Euro, Dolar, TL) veya rezervasyon aşamasında online kredi kartı/havale ile yapabilirsiniz.',
        faq_q4: 'Rezervasyonumu iptal edebilir miyim?',
        faq_a4: 'Evet, transfer saatinize en geç 24 saat kalaya kadar yapılan tüm iptal işlemleri tamamen ücretsizdir.',
        faq_q5: 'Bebek koltuğu seçeneği var mı?',
        faq_a5: 'Talebiniz doğrultusunda araçlarımıza bebek koltuğu veya çocuk yükseltici (booster) ücretsiz olarak yerleştirilmektedir. Hızlı rezervasyon formunda notlar kısmında belirtmeniz yeterlidir.',
        contact_title: 'Bizimle İletişime Geçin',
        contact_subtitle: 'Özel seyahat planları, kongre transferleri veya sorularınız için 7/24 hizmetinizdeyiz',
        contact_phone: 'Telefon Numarası / WhatsApp',
        contact_address: 'Merkez Ofis Adresi',
        contact_address_val: 'Güzelyurt Mah. 26220. Sk. No:20 Aksu / Antalya, Türkiye',
        hotel_rates_title: 'Popüler Lüks Otel VIP Transfer Ücretleri',
        hotel_rates_subtitle: 'Antalya Havalimanı (AYT) çıkışlı en popüler lüks otellere özel sabit VIP transfer fiyatlarımız',
        hotel_legends_desc: 'Rixos Kingdom Hotel ve eğlence parkı ulaşımı',
        hotel_maxx_desc: 'Elite Golf Resort &amp; Spa oteli lüks VIP ulaşımı',
        hotel_regnum_desc: 'Golf &amp; Luxury Resort konaklamaları ulaşımı',
        hotel_delphin_desc: 'Kundu oteller bölgesi hızlı VIP ulaşım',
        route_guide_title: 'Popüler VIP Transfer Güzergahları &amp; Yolculuk Rehberi',
        route_guide_subtitle: 'En çok tercih edilen Antalya VIP ulaşım rotalarımız hakkında mesafe, süre ve seyahat bilgileri',
        route_belek_desc: 'Antalya Havalimanı ile Belek lüks oteller bölgesi (Land of Legends, Maxx Royal, Regnum) arası transferler yaklaşık 30 dakika sürmektedir. Hızlı ve konforlu bir seyahat için VIP araçlarımız otoyol ve Belek turizm yolunu kullanır.',
        route_side_desc: 'Tarihi antik kenti ve Sorgun, Titreyengöl, Kumköy, Evrenseki plajları ile meşhur Side, havalimanına 65 km mesafededir. D400 karayolu üzerinden ortalama 50 dakikada kesintisiz ve güvenli VIP transfer hizmeti sunuyoruz.',
        route_alanya_desc: 'Okurcalar, Avsallar, Konaklı, Mahmutlar ve Kargıcak gibi geniş bir alanı kapsayan Alanya transferi 125 km sürmektedir. Uzun yolda VIP araç içi ikramlarımız ve TV ekranlarımızla yorgunluğunuzu hissettirmeden ulaştırıyoruz.',
        route_kemer_desc: 'Beldibi, Göynük, Kiriş, Çamyuva ve Tekirova oteller bölgesini içeren Kemer rotası, sahil ve dağ manzaraları eşliğinde 60 km sürmektedir. Ortalama 55 dakikada konforlu ve güvenli VIP şoförlü ulaşım sağlıyoruz.',
        advisor_title: 'Antalya Seyahat Rehberi &amp; SSS',
        advisor_subtitle: 'Antalya VIP transfer, ulaşım yasaları ve seyahat planlaması hakkında faydalı bilgiler',
        advisor_art1_title: "Antalya'da Uber veya Mobil Taksi Var mı?",
        advisor_art1_body: "Antalya'da global Uber/Lyft tarzı bağımsız sürücü hizmetleri yasal olarak bulunmamaktadır. Sarı taksiler mevcuttur ancak sabit fiyat sunmadıkları için turistler için lüks Mercedes Vito VIP transfer hizmetleri sabit fiyatlı, güvenli ve konforlu en popüler alternatiftir.",
        advisor_art2_title: 'Bebek Koltuğu Kullanımı Zorunlu mu?',
        advisor_art2_body: 'Türkiye Karayolları Trafik Yönetmeliği uyarınca çocukların seyahat güvenliği için araçlarda çocuk/bebek koltuğu bulundurulması zorunludur. Mountain VIP Transfer olarak ailelerin güvenliğine önem veriyor, bebek koltuğu ve booster yükselticiyi ücretsiz sağlıyoruz.',
        advisor_art3_title: 'Uçağım Rötar Yaparsa Ne Olur?',
        advisor_art3_body: 'Antalya havalimanı uçuşlarını canlı radar entegrasyonu ile takip ediyoruz. Uçağınız rötarlı olsa dahi, şoförünüz yeni iniş saatinize göre havalimanı çıkış kapısında isminizle hazır olacaktır. Gecikmeler için ek ücret yansıtılmaz.',
        map_title: 'Aktif Transfer Güzergah Haritası',
        map_subtitle: 'Seçtiğiniz güzergaha özel anlık rota analizi',
        map_distance: 'Mesafe',
        map_duration: 'Tahmini Süre',
        map_pickup_lbl: 'Nereden (Alış)',
        map_dropoff_lbl: 'Nereye (Varış)',
        map_info_notice: 'Otobanda ücretsiz karşılama, bagaj yardımı ve uçuş rötar takibi fiyata dahildir.',
        modal_book_title: 'Rezervasyon Detayları',
        modal_name: 'Adınız Soyadınız',
        modal_phone: 'Telefon Numaranız (WhatsApp Uyumlu)',
        modal_email: 'E-posta Adresiniz',
        modal_flight: 'Uçuş Kodunuz (Örn: TK2410)',
        modal_notes: 'Özel İstekler / Notlar (Bebek koltuğu vb.)',
        modal_submit: 'Rezervasyonu WhatsApp ile Onayla',
        success_title: 'Tebrikler!',
        success_msg: 'Rezervasyon taslağınız başarıyla hazırlandı. WhatsApp üzerinden onay mesajını göndermeniz için yönlendiriliyorsunuz...',
        success_btn_close: 'Kapat',
        success_summary_title: 'Rezervasyon Özeti',
        success_type: 'Hizmet Tipi',
        success_type_transfer: 'VIP Havalimanı Transferi',
        success_type_tour: 'VIP Özel Kültür Turu',
        success_route: 'Güzergah / Duraklar',
        success_date: 'Tarih & Saat',
        success_pax: 'Yolcu Sayısı',
        success_vehicle: 'Araç Seçimi',
        success_total: 'Hesaplanan Toplam Fiyat',
        kvkk_checkbox_label: '<a href="#" class="kvkk-link" style="color: var(--accent-gold); text-decoration: underline; font-weight: 600;">KVKK Aydınlatma Metni\'ni</a> okudum ve verilerimin işlenmesini kabul ediyorum.',
        kvkk_modal_title: 'KVKK Aydınlatma Metni',
        cookie_text: 'Deneyiminizi geliştirmek için çerezleri kullanıyoruz. Sitemizde gezinmeye devam ederek çerez kullanımını kabul etmiş olursunuz.',
        cookie_accept: 'Kabul Et',
        how_title: 'Nasıl Çalışır?',
        how_subtitle: '4 Kolay Adımda Güvenli ve Konforlu VIP Ulaşım Rezervasyonu',
        step1_title: 'Online Rezervasyon',
        step1_desc: 'Sitemizden güzergah ve tarih seçerek fiyat hesaplayın, form veya WhatsApp ile anında yerinizi ayırtın.',
        step2_title: 'Uçuş Takibi',
        step2_desc: 'Operasyon ekibimiz uçuş kodunuz üzerinden rötar durumunu izler, olası gecikmelerde saati ücretsiz günceller.',
        step3_title: 'İsimle Karşılama',
        step3_desc: 'Havalimanı çıkış kapısında şoförünüz sizi isminiz yazılı tabela veya Mountain VIP logosuyla karşılar.',
        step4_title: 'Araçta Kolay Ödeme',
        step4_desc: 'Ön ödemesiz rezervasyon yapın. Ödemenizi yolculuk tamamlandığında araçta nakit (EUR, USD, GBP, TL) yapın.',
        corp_title: 'VIP Kurumsal &amp; Özel Hizmetlerimiz',
        corp_subtitle: 'Şirketler, Kongreler, Düğünler ve Protokol Taşımacılığı İçin Lüks Çözümler',
        corp_s1_title: 'Kurumsal &amp; Delegasyon Taşımacılığı',
        corp_s1_desc: 'Kongre, seminer, toplantı ve bayi buluşmaları gibi kurumsal etkinlikleriniz için büyük gruplara özel Vito &amp; Sprinter koordinasyonu sunuyoruz.',
        corp_s1_f1: 'Toplu Grup Koordinasyon Yönetimi',
        corp_s1_f2: 'Şirketlere Özel Aylık Cari Fatura',
        corp_s1_f3: '7/24 Kesintisiz Çağrı Desteği',
        corp_s2_title: 'Protokol &amp; Şoförlü Kiralama',
        corp_s2_desc: 'İş insanları, bürokratlar, sanatçılar ve özel konuklar için takım elbiseli, yabancı dil bilen profesyonel protokol şoförleriyle günlük tahsis hizmeti.',
        corp_s2_f1: 'Çok Dilli, Takım Elbiseli VIP Şoförler',
        corp_s2_f2: 'Gizlilik ve Güvenlik Protokolü',
        corp_s2_f3: 'İsteğe Bağlı Koruma &amp; Araç Bölmesi',
        corp_s3_title: 'Düğün &amp; Özel Gün Organizasyonları',
        corp_s3_desc: 'Düğün, nişan, özel davetler ve balolar için gelin/damat ve davetli misafirlerin transfer organizasyonları, araç süsleme ve ikram konsepti.',
        corp_s3_f1: 'Özel Gün Araç Süsleme &amp; Çiçek',
        corp_s3_f2: 'Misafirlere Özel Karşılama Ekibi',
        corp_s3_f3: 'Grup Seyahat Rotaları Koordinasyonu',
        corp_btn_contact: 'Şimdi Başvur',
        preloader_text: 'VIP Deneyim Yükleniyor...',
        
        slide2_badge: 'Mercedes Vito &amp; Sprinter',
        slide2_title: 'Antalya\'nın Her Noktasına<br><span>Premium Konfor</span> ile Transfer',
        slide2_desc: 'Belek, Side, Alanya, Kemer ve tüm bölgelere en son model Mercedes Vito ve Sprinter araçlarımızla güvenli, lüks transfer hizmeti sunuyoruz.',
        slide2_feat_1: 'Yatarlı Konfor Koltuklar',
        slide2_feat_2: 'Ücretsiz Wi-Fi',
        slide2_feat_3: 'Klima &amp; İklimlendirme',
        
        slide3_badge: 'VIP Kurumsal &amp; Protokol',
        slide3_title: 'Kurumsal Transferde<br><span>Benzersiz</span> Bir Deneyim',
        slide3_desc: 'Toplantı, kongre ve protokol transferlerinde güvenilir çözüm ortağınız. Profesyonel şoförlerimiz ve lüks araç filomuzla her zaman yanınızdayız.',
        slide3_feat_1: 'Profesyonel Şoförler',
        slide3_feat_2: 'Kurumsal Fatura',
        slide3_feat_3: '7/24 Destek',

        slide4_badge: 'Düğün &amp; Özel Günler',
        slide4_title: 'Özel Günlerinizde<br><span>Unutulmaz</span> Bir Yolculuk',
        slide4_desc: 'Düğün, nişan ve organizasyonlarınız için çiçek süslemeli araçlarımız ve VIP karşılama hizmetimizle o anı sonsuza taşıyoruz.',
        slide4_feat_1: 'Çiçek Süslemeli Araç',
        slide4_feat_2: 'VIP Karşılama',
        slide4_feat_3: 'Şampanya İkramı',

        vehicle_label_0: 'Mercedes Vito VIP',
        vehicle_label_1: 'Mercedes Vito Premium',
        vehicle_label_2: 'Mercedes Sprinter VIP',
        vehicle_label_3: 'Düğün VIP &amp; Özel Organizasyon',
        brochures_header: 'Hizmet Standartlarımız &amp; Broşürlerimiz',
        brochures_sub: 'Bizimle güvendesiniz! Standartların ötesinde bir VIP transfer deneyimi için detaylı el broşürlerimizi inceleyebilirsiniz.',
        brochure_1_title: 'Bizimle Güvendesiniz',
        brochure_1_text: 'Wifi imkanı, su ikramı, şeffaf fiyatlar ve uçuş takibi ile güvendesiniz.',
        brochure_2_title: 'Standartların Ötesinde',
        brochure_2_text: 'Havalimanı karşılama, otel, villa ve özel adreslere konforlu hijyenik VIP ulaşım.',
        pricing_title: 'Bölgesel Transfer Ücretleri',
        pricing_subtitle: 'Antalya Havalimanı (AYT) çıkışlı · Araç başına · Her şey dahil sabit fiyat',
        pricing_note: 'Gidiş-dönüş rezervasyonlarında %10 indirim · Fiyatlar araç başınadır, kişi başı değil',
        pricing_destination: 'Destinasyon',
        step3_guide_btn: 'Karşılama Rehberini Gör',
        video_title: 'Mountain VIP Yolculuk Deneyimi',
        video_subtitle: 'Premium araç filomuz, özel karşılama hizmetimiz ve lüks konfor standartlarımızı canlı izleyin'
    },
    en: {
        brand: 'Mountain<span>VIP</span>',
        nav_home: 'Home',
        nav_fleet: 'VIP Fleet',
        nav_tours: 'Attractions',
        nav_why: 'Why Mountain VIP',
        nav_faq: 'FAQs',
        nav_contact: 'Contact',
        cta_call: '24/7 Booking & Support',
        hero_badge: '24/7 Continuous VIP Transfer & Transportation',
        hero_title: 'Antalya 24/7 VIP Transfer | Premium Chauffeur & Private Airport Pickups',
        hero_text: 'Travel in 24/7 comfort and style from the airport to your hotel or any destination in Antalya with our brand-new, ultra-luxury VIP vehicles and certified professional drivers.',
        hero_feat_1: 'Free Airport Meet & Greet',
        hero_feat_2: 'Live Flight Tracking',
        hero_feat_3: 'Fixed Prices & Free Cancel',
        widget_title: 'VIP Booking Form',
        widget_pickup: 'Pickup Location (From?)',
        widget_dropoff: 'Drop-off Location (To?)',
        widget_date: 'Transfer Date',
        widget_time: 'Transfer Time',
        widget_pax: 'Passengers',
        widget_vehicle: 'Vehicle Type',
        widget_btn: 'Calculate Price & View',
        fleet_title: 'Our Exquisite VIP Fleet',
        fleet_subtitle: 'Explore our range of premium, luxury-equipped vehicles designed for your absolute comfort',
        fleet_capacity: 'Pax',
        fleet_bags: 'Bags',
        fleet_from: 'Transfer Rate',
        fleet_book_btn: 'Book Now',
        why_title: 'Why Choose Mountain VIP?',
        why_subtitle: 'We offer the most prestigious, safe, and comfortable private VIP transfer experience in Antalya',
        why_feat_1_title: '24/7 Reliable Service',
        why_feat_1_desc: 'At any hour of the day or night, no matter when your flight lands, our friendly chauffeur will be waiting for you.',
        why_feat_2_title: 'Live Flight Tracking',
        why_feat_2_desc: 'Even if your flight is delayed, we track the schedule using your flight code and adjust pick-up time with zero extra charge.',
        why_feat_3_title: 'Nameplate Welcome',
        why_feat_3_desc: 'Our driver meets you right at the airport exit with a sign displaying your name and assists with all your bags.',
        why_feat_4_title: 'Transparent Fixed Prices',
        why_feat_4_desc: 'All highways, tunnels, airport parking fees, and fuel are included in the price. No hidden fees or surprise surcharges.',
        tours_title: 'Popular Sights &amp; Attractions in Antalya',
        tours_subtitle: 'Explore the most popular tourist attractions in Antalya and travel in ultimate comfort with our VIP transfer services.',
        tour_btn_discover: 'Region Details',
        tour_btn_book: 'Book Transfer',
        sidebar_title: 'Custom Tour Planner',
        sidebar_empty: 'You haven\'t added any sights yet. Choose destinations from the cards above to build your private tour.',
        sidebar_duration: 'Est. Tour Duration',
        sidebar_vehicle: 'Preferred Vehicle',
        sidebar_price: 'Total Tour Fare',
        sidebar_book: 'Book Custom Private Tour',
        faq_title: 'Frequently Asked Questions',
        faq_subtitle: 'Learn about our booking process, cancellation policy, and complimentary onboard features',
        faq_q1: 'How can I make a reservation?',
        faq_a1: 'Fill in the quick form, click "Calculate", choose your desired VIP vehicle, and you will be redirected to WhatsApp to confirm instantly with our booking desk.',
        faq_q2: 'What if my flight is delayed? Will I pay extra?',
        faq_a2: 'No, absolutely not. We monitor your flight live using your flight code and dispatch the driver according to the actual landing time. There are no delay fees.',
        faq_q3: 'How do I pay for the transfer?',
        faq_a3: 'You can pay cash directly to the driver in the vehicle (Euros, Dollars, TL) or securely pay online via credit card or bank transfer during booking.',
        faq_q4: 'Can I cancel my booking?',
        faq_a4: 'Yes, cancellations made up to 24 hours before your scheduled transfer time are completely free of charge.',
        faq_q5: 'Are child booster seats available?',
        faq_a5: 'Yes, we provide baby seats and booster seats free of charge upon request. Simply specify this in the notes section of the booking form.',
        contact_title: 'Contact Us',
        contact_subtitle: 'Reach out to us 24/7 for tailored travel itineraries, events, or inquiries',
        contact_phone: 'Phone Number / WhatsApp',
        contact_address: 'Headquarters Address',
        contact_address_val: 'Guzelyurt Dist. 26220. St. No:20 Aksu / Antalya, Turkey',
        hotel_rates_title: 'Popular Luxury Hotel VIP Transfer Rates',
        hotel_rates_subtitle: 'Special fixed VIP transfer rates from Antalya Airport (AYT) to the most popular luxury hotels',
        hotel_legends_desc: 'Transport to Rixos Kingdom Hotel &amp; Theme Park',
        hotel_maxx_desc: 'Luxury VIP transfer to Elite Golf Resort &amp; Spa hotel',
        hotel_regnum_desc: 'VIP transit to Golf &amp; Luxury Resort accommodation',
        hotel_delphin_desc: 'Fast private transfer to Kundu hotels zone',
        route_guide_title: 'Popular VIP Transfer Routes &amp; Travel Guide',
        route_guide_subtitle: 'Distance, duration, and local travel details for our most requested Antalya VIP routes',
        route_belek_desc: 'Transfers between Antalya Airport and the Belek luxury resort zone (Land of Legends, Maxx Royal, Regnum Carya) take approximately 30 minutes. Our VIP vehicles utilize the main highway and Belek tourism expressway for a smooth transit.',
        route_side_desc: 'Famous for its ancient city ruins and beaches in Sorgun, Kumköy, and Evrenseki, Side is located 65 km from the airport. We offer direct and safe VIP transit via the D400 state route in approximately 50 minutes.',
        route_alanya_desc: 'Covering a broad region including Okurcalar, Avsallar, Konaklı, Mahmutlar, and Kargıcak, Alanya is a 125 km journey. On this longer highway trip, our premium interior amenities, TV screens, and soft leather seats ensure a relaxing ride.',
        route_kemer_desc: 'Spanning Beldibi, Göynük, Kiriş, Çamyuva, and Tekirova, the Kemer highway runs for 60 km between scenic pine mountains and the Mediterranean coast. Transfers take around 55 minutes in our fully equipped luxury VIP vans.',
        advisor_title: 'Antalya Travel Advisor &amp; Guides',
        advisor_subtitle: 'Helpful resources on Antalya VIP transit, traffic laws, and airport travel planning',
        advisor_art1_title: 'Is Uber or ride-hailing active in Antalya?',
        advisor_art1_body: 'Global ride-hailing services like Uber/Lyft do not operate independently in Antalya due to Turkish transport licensing laws. Regular yellow taxis exist, but private Mercedes Vito VIP transfers offer fixed rates and higher comfort, making them the top choice for travelers.',
        advisor_art2_title: 'Are baby seats mandatory in Turkish transfers?',
        advisor_art2_body: 'Yes, Turkish highway safety laws require children to ride in proper baby seats or booster cushions. To ensure full compliance and peace of mind for your family, Mountain VIP Transfer provides sanitized baby seats and boosters completely free of charge.',
        advisor_art3_title: 'What if my flight to Antalya is delayed?',
        advisor_art3_body: 'We utilize live radar tracking for all incoming flights at Antalya Airport (AYT). Even if your flight is delayed, your private chauffeur will monitor the update and wait at the exit gate with your name board. No extra wait charges apply.',
        map_title: 'Live Transfer Route Map',
        map_subtitle: 'Real-time route visualization for your selected transfer',
        map_distance: 'Distance',
        map_duration: 'Est. Duration',
        map_pickup_lbl: 'Pickup (From)',
        map_dropoff_lbl: 'Dropoff (To)',
        map_info_notice: 'Free meet &amp; greet, luggage assistance, and delayed flight tracking are included.',
        modal_book_title: 'Booking Details',
        modal_name: 'Your Full Name',
        modal_phone: 'Your Phone Number (WhatsApp Enabled)',
        modal_email: 'Your Email Address',
        modal_flight: 'Flight Code (e.g., BA2680)',
        modal_notes: 'Special Requests / Notes (e.g., baby seat)',
        modal_submit: 'Confirm Booking via WhatsApp',
        success_title: 'Congratulations!',
        success_msg: 'Your booking details have been prepared. You are now being redirected to WhatsApp to send your booking request...',
        success_btn_close: 'Close',
        success_summary_title: 'Booking Summary',
        success_type: 'Service Type',
        success_type_transfer: 'VIP Airport Transfer',
        success_type_tour: 'VIP Special Cultural Tour',
        success_route: 'Route / Stops',
        success_date: 'Date & Time',
        success_pax: 'Passenger Count',
        success_vehicle: 'Selected Vehicle',
        success_total: 'Total Estimated Price',
        kvkk_checkbox_label: 'I have read and agree to the <a href="#" class="kvkk-link" style="color: var(--accent-gold); text-decoration: underline; font-weight: 600;">GDPR Disclosure</a> and consent to data processing.',
        kvkk_modal_title: 'GDPR Privacy Policy',
        cookie_text: 'We use cookies to improve your experience. By continuing to navigate on our site, you agree to our cookie policy.',
        cookie_accept: 'Accept',
        how_title: 'How It Works?',
        how_subtitle: 'Safe and Comfortable VIP Transfer Booking in 4 Easy Steps',
        step1_title: 'Online Booking',
        step1_desc: 'Select route and date to calculate price on our site, book instantly via form or WhatsApp.',
        step2_title: 'Flight Tracking',
        step2_desc: 'Our operations team tracks your flight code and updates the pickup time for free in case of delays.',
        step3_title: 'Name Welcome',
        step3_desc: 'Our chauffeur welcomes you at the exit gate with a board displaying your name or Mountain VIP logo.',
        step4_title: 'Easy Pay in Car',
        step4_desc: 'Book without pre-payment. Complete your payment directly to the driver at the end of the trip.',
        corp_title: 'VIP Corporate &amp; Special Services',
        corp_subtitle: 'Luxury Transport Solutions for Companies, Events, Weddings and Protocol',
        corp_s1_title: 'Corporate &amp; Delegation Transfers',
        corp_s1_desc: 'Tailored fleet coordination for congresses, bay meetings, and corporate events with Vito &amp; Sprinter.',
        corp_s1_f1: 'Bulk Group Transfer Management',
        corp_s1_f2: 'Monthly B2B Invoice Accounts',
        corp_s1_f3: '24/7 Dedicated Support Hotline',
        corp_s2_title: 'Protocol &amp; Hourly Chauffeur Hire',
        corp_s2_desc: 'Daily chauffeur hire with multilingual, suited drivers for corporate leaders, celebrities, and delegates.',
        corp_s2_f1: 'Multilingual Chauffeur Crew',
        corp_s2_f2: 'Full Discretion &amp; Privacy Protocols',
        corp_s2_f3: 'Optional Security &amp; VIP Dividers',
        corp_s3_title: 'Wedding &amp; Ceremonies VIP fleet',
        corp_s3_desc: 'Elegant bride/groom transfers, VIP flower decorations, and hospitality packages for luxury wedding days.',
        corp_s3_f1: 'Wedding Vehicle Decoration &amp; Flowers',
        corp_s3_f2: 'Dedicated Meet &amp; Greet Hosts',
        corp_s3_f3: 'Multi-stop Route Plan Coordination',
        corp_btn_contact: 'Apply Now',
        preloader_text: 'Loading VIP Experience...',

        slide2_badge: 'Mercedes Vito &amp; Sprinter',
        slide2_title: 'Transfer with <span>Premium Comfort</span><br>to Every Point of Antalya',
        slide2_desc: 'We offer safe, luxury transfer services to Belek, Side, Alanya, Kemer and all regions with our latest model Mercedes Vito and Sprinter vehicles.',
        slide2_feat_1: 'Reclining Comfort Seats',
        slide2_feat_2: 'Free Wi-Fi',
        slide2_feat_3: 'A/C &amp; Climate Control',
        
        slide3_badge: 'VIP Corporate &amp; Protocol',
        slide3_title: 'A <span>Unique</span> Experience<br>in Corporate Transfer',
        slide3_desc: 'Your reliable solution partner in meetings, congresses and protocol transfers. We are always by your side with our professional drivers and luxury vehicle fleet.',
        slide3_feat_1: 'Professional Chauffeurs',
        slide3_feat_2: 'Corporate Invoicing',
        slide3_feat_3: '24/7 Support',

        slide4_badge: 'Weddings &amp; Special Events',
        slide4_title: 'An <span>Unforgettable</span> Journey<br>on Your Special Days',
        slide4_desc: 'For weddings, engagements and organizations, we bring that moment to eternity with our flower-decorated vehicles and VIP welcome service.',
        slide4_feat_1: 'Flower-Decorated Vehicle',
        slide4_feat_2: 'VIP Welcome',
        slide4_feat_3: 'Champagne Service',

        vehicle_label_0: 'Mercedes Vito VIP',
        vehicle_label_1: 'Mercedes Vito Premium',
        vehicle_label_2: 'Mercedes Sprinter VIP',
        vehicle_label_3: 'Wedding VIP &amp; Special Events',
        brochures_header: 'Our Service Standards &amp; Brochures',
        brochures_sub: 'You are safe with us! You can examine our detailed brochures for a premium VIP transfer experience beyond standards.',
        brochure_1_title: 'Safe With Us',
        brochure_1_text: 'You are safe with free Wi-Fi, water refreshments, transparent fixed rates, and real-time flight tracking.',
        brochure_2_title: 'Beyond Standards',
        brochure_2_text: 'Hygienic and comfortable VIP transportation to airports, hotels, private villas, and specific addresses.',
        pricing_title: 'Regional Transfer Fares',
        pricing_subtitle: 'From Antalya Airport (AYT) · Per vehicle · All-inclusive fixed rates',
        pricing_note: '10% discount on round-trip bookings · All prices are per vehicle, not per person',
        pricing_destination: 'Destination',
        step3_guide_btn: 'View Welcome Guide',
        video_title: 'Mountain VIP Travel Experience',
        video_subtitle: 'Watch our premium fleet, personalized airport welcome, and first-class onboard standards'
    },
    de: {
        brand: 'Mountain<span>VIP</span>',
        nav_home: 'Startseite',
        nav_fleet: 'VIP-Flotte',
        nav_tours: 'Sehenswürdigkeiten',
        nav_why: 'Warum wir',
        nav_faq: 'FAQ',
        nav_contact: 'Kontakt',
        cta_call: '24/7 Support',
        hero_badge: '24/7 VIP-Transferservice in ganz Antalya',
        hero_title: 'Grenzenloser <span>VIP-Komfort</span> an jedem Punkt von Antalya',
        hero_subtitle: 'Reisen Sie sicher, komfortabel und günstig vom Flughafen zu Ihrem Hotel oder einer beliebigen Adresse mit unseren luxuriösen Mercedes Vito und Sprinter Fahrzeugen.',
        widget_title: 'Schneller Preis & Buchung',
        widget_from: 'Abfahrtsort (Flughafen, Hotel, Bezirk)',
        widget_to: 'Zielort (Alanya, Kemer, Belek...)',
        widget_date: 'Transferdatum',
        widget_time: 'Transferzeit',
        widget_pax: 'Anzahl der Personen',
        widget_calc: 'Günstigsten Preis Berechnen',
        fleet_title: 'Ultra-Luxus VIP-Flotte',
        fleet_subtitle: 'Steigern Sie Ihre Reisestandards mit unseren luxuriösen Fahrzeugen der neuesten Generation, die speziell auf Ihre Bedürfnisse zugeschnitten sind',
        amenity_wifi: 'Kostenloses Highspeed-WLAN',
        amenity_bar: 'Kalte Getränke & Snacks',
        amenity_charge: 'USB-Schnellladegeräte',
        amenity_ac: 'Zweizonen-Klimaanlage vorn/hinten',
        amenity_tv: 'Android Smart TV / Trennwand',
        fleet_pax_limit: 'Kapazität',
        fleet_luggage_limit: 'Gepäck',
        fleet_book_now: 'Per WhatsApp Reservieren',
        fleet_book_btn: 'Jetzt buchen',
        fleet_from: 'Ab Preisen von',
        tours_title: 'Beliebte Sehenswürdigkeiten in Antalya',
        tours_subtitle: 'Entdecken Sie die beliebtesten Sehenswürdigkeiten in Antalya und reisen Sie mit unseren VIP-Transferdiensten in maximalem Komfort.',
        tour_btn_discover: 'Details anzeigen',
        tour_btn_book: 'Transfer buchen',
        why_title: 'Warum Mountain VIP Transfer?',
        why_subtitle: 'Wir sind die führende Marke in Antalya für qualitativ hochwertigen, sicheren und freundlichen VIP-Transport',
        why_1_title: '24/7 Ununterbrochener Service',
        why_1_desc: 'Rund um die Uhr, an jedem Tag der Woche erstklassiger VIP-Transferservice.',
        why_2_title: 'Festpreisgarantie',
        why_2_desc: 'Keine versteckten Gebühren für Parken, Tunnel oder Mautbrücken.',
        why_3_title: 'Kostenlose Flugverfolgung',
        why_3_desc: 'Auch bei Flugverspätungen wartet Ihr Fahrer ohne Aufpreis auf Sie.',
        why_4_title: 'Professionelle Chauffeure',
        why_4_desc: 'Fremdsprachige, erfahrene und zertifizierte Tourismusfahrer.',
        faq_title: 'Häufig gestellte Fragen',
        faq_subtitle: 'Antworten auf alle Ihre Fragen zu unseren VIP-Transferdiensten',
        faq_q1: 'Wie kann ich eine Buchung vornehmen?',
        faq_a1: 'Wählen Sie Ihre Route über das Formular auf unserer Website aus, um sofort den Preis zu berechnen, und klicken Sie auf den WhatsApp-Button, um Ihre Buchungsanfrage direkt an uns zu senden.',
        faq_q2: 'Wie finde ich meinen Chauffeur am Flughafen?',
        faq_a2: 'Ihr Chauffeur erwartet Sie am Flughafenausgang mit einem Schild, auf dem Ihr Name steht. Details zum Treffpunkt werden vor dem Transfer geteilt.',
        faq_q3: 'Was passiert, wenn mein Flug Verspätung hat?',
        faq_a3: 'Wir verfolgen Ihren Flug anhand der Flugnummer. Unabhängig davon, wann Ihr Flug landet, wartet unser driver auf Sie, ohne dass zusätzliche Gebühren anfallen.',
        faq_q4: 'Ist die Stornierung einer Buchung kostenpflichtig?',
        faq_a4: 'Nein, alle Stornierungen, die bis spätestens 24 Stunden vor der Transferzeit vorgenommen werden, sind absolut kostenlos.',
        faq_q5: 'Gibt es Kindersitze?',
        faq_a5: 'Auf Wunsch stellen wir kostenlos Babysitze oder Kindersitzerhöhungen (Booster) in unseren Fahrzeugen zur Verfügung. Bitte geben Sie dies im Reservierungsformular im Notizfeld an.',
        contact_title: 'Kontaktieren Sie Uns',
        contact_subtitle: 'Für spezielle Reisepläne, Kongresstransfers oder Fragen sind wir 24/7 für Sie da',
        contact_phone: 'Telefonnummer / WhatsApp',
        contact_address: 'Hauptbüro Adresse',
        contact_address_val: 'Güzelyurt Mah. 26220. Sk. No:20 Aksu / Antalya, Türkei',
        hotel_rates_title: 'VIP-Transfertarife für Beliebte Luxushotels',
        hotel_rates_subtitle: 'Spezielle feste VIP-Transferpreise vom Flughafen Antalya (AYT) zu den beliebtesten Luxushotels',
        hotel_legends_desc: 'Transport zum Rixos Kingdom Hotel &amp; Freizeitpark',
        hotel_maxx_desc: 'Luxuriöser VIP-Transfer zum Elite Golf Resort &amp; Spa Hotel',
        hotel_regnum_desc: 'VIP-Transit zu Golf &amp; Luxus-Resort Unterkünften',
        hotel_delphin_desc: 'Schneller privater Transfer zur Kundu-Hotelzone',
        route_guide_title: 'Beliebte VIP-Transferrouten &amp; Reiseführer',
        route_guide_subtitle: 'Entfernung, Dauer und Reiseinformationen für unsere am häufigsten gebuchten Antalya VIP-Strecken',
        route_belek_desc: 'Transfers zwischen dem Flughafen Antalya und den Luxushotels in Belek (Land of Legends, Maxx Royal, Regnum) dauern etwa 30 Minuten. Unsere VIP-Fahrzeuge nutzen die Autobahn und die Belek-Tourismusstraße für eine reibungslose Fahrt.',
        route_side_desc: 'Berühmt für seine antike Altstadt und die Strände in Sorgun, Kumköy und Evrenseki, liegt Side 65 km vom Flughafen entfernt. Wir bieten sichere VIP-Transfers über die Schnellstraße D400 in etwa 50 Minuten an.',
        route_alanya_desc: 'Die Fahrt nach Alanya erstreckt sich über 125 km und deckt Gebiete wie Okurcalar, Avsallar, Konaklı, Mahmutlar und Kargıcak ab. Auf dieser längeren Fahrt sorgen unsere VIP-Getränke und Smart-TVs für entspanntes Reisen.',
        route_kemer_desc: 'Die Kemer-Route führt über 60 km entlang malerischer Pinienberge und Küsten und umfasst Beldibi, Göynük, Kiriş, Çamyuva und Tekirova. Transfers in unseren erstklassigen VIP-Vans dauern etwa 55 Minuten.',
        advisor_title: 'Antalya Reiseberater &amp; Hilfecenter',
        advisor_subtitle: 'Nützliche Informationen zu VIP-Transfers, Verkehrsregeln und Reiseplanung in Antalya',
        advisor_art1_title: 'Gibt es Uber oder Ride-Hailing in Antalya?',
        advisor_art1_body: 'Unabhängige Fahrdienste wie Uber oder Lyft sind in Antalya aus lizenzrechtlichen Gründen nicht erlaubt. Gelbe Taxis sind verfügbar, aber private Mercedes Vito VIP-Transfers bieten Festpreise und höchsten Komfort, was sie zur besten Wahl für Touristen macht.',
        advisor_art2_title: 'Sind Kindersitze in der Türkei gesetzlich vorgeschrieben?',
        advisor_art2_body: 'Ja, das türkische Verkehrsgesetz schreibt vor, dass Kinder in geeigneten Kindersitzen oder Sitzerhöhungen befördert werden müssen. Um maximale Sicherheit für Ihre Familie zu garantieren, stellt Mountain VIP Transfer Kindersitze kostenlos bereit.',
        advisor_art3_title: 'Was passiert bei einer Flugverspätung nach Antalya?',
        advisor_art3_body: 'Wir verfolgen Ihren Flug live über unser Radar-Flugverfolgungssystem. Auch wenn Ihr Flug Verspätung hat, wartet Ihr Chauffeur pünktlich mit Ihrem Namensschild am Ausgang. Es fallen keine zusätzlichen Wartegebühren an.',
        map_title: 'Live-Transfer-Routenkarte',
        map_subtitle: 'Echtzeit-Routenvisualisierung für Ihren ausgewählten Transfer',
        map_distance: 'Entfernung',
        map_duration: 'Est. Dauer',
        map_pickup_lbl: 'Abholung (Von)',
        map_dropoff_lbl: 'Varisch (Nach)',
        map_info_notice: 'Kostenlose Begrüßung, Gepäckhilfe und radarbasierte Flugverfolgung sind inbegriffen.',
        modal_book_title: 'Buchungsdetails',
        modal_name: 'Vorname & Nachname',
        modal_phone: 'Telefonnummer (WhatsApp)',
        modal_email: 'E-Mail-Adresse',
        modal_flight: 'Flugnummer (Optional)',
        modal_notes: 'Besondere Wünsche / Notizen',
        modal_submit: 'Buchung über WhatsApp abschließen',
        success_title: 'Glückwunsch!',
        success_msg: 'Ihre Buchungsanfrage wurde erfolgreich erstellt. Sie werden weitergeleitet, um Ihren Buchungscode über WhatsApp zu senden.',
        success_summary_title: 'Buchungszusammenfassung',
        success_btn_close: 'Schließen',
        success_type: 'Dienstleistungstyp',
        success_type_transfer: 'VIP Flughafentransfer',
        success_type_tour: 'VIP Kulturreise',
        success_route: 'Route / Haltestellen',
        success_date: 'Datum & Uhrzeit',
        success_pax: 'Anzahl der Passagiere',
        success_vehicle: 'Fahrzeugauswahl',
        success_total: 'Berechneter Gesamtpreis',
        kvkk_checkbox_label: 'Ich habe die <a href="#" class="kvkk-link" style="color: var(--accent-gold); text-decoration: underline; font-weight: 600;">Datenschutzerklärung</a> gelesen und stimme der Verarbeitung meiner Daten zu.',
        kvkk_modal_title: 'Datenschutzerklärung',
        cookie_text: 'Wir verwenden Cookies, um Ihre Erfahrung zu verbessern. Durch das weitere Surfen auf unserer Website stimmen Sie der Verwendung von Cookies zu.',
        cookie_accept: 'Akzeptieren',
        how_title: 'Wie es funktioniert?',
        how_subtitle: 'Sichere und komfortable VIP-Buchung in 4 einfachen Schritten',
        step1_title: 'Online-Buchung',
        step1_desc: 'Wählen Sie Route und Datum, um Preise zu berechnen, buchen Sie sofort per Formular oder WhatsApp.',
        step2_title: 'Flugverfolgung',
        step2_desc: 'Unser Team verfolgt Ihren Flugcode und aktualisiert die Abholzeit bei Verspätungen kostenlos.',
        step3_title: 'Namensschild-Empfang',
        step3_desc: 'Unser Chauffeur empfängt Sie am Ausgang mit einem Schild mit Ihrem Namen oder dem Mountain VIP-Logo.',
        step4_title: 'Barzahlung im Auto',
        step4_desc: 'Buchen Sie ohne Vorauszahlung. Bezahlen Sie bar direkt beim Fahrer am Ende der Reise.',
        corp_title: 'VIP-Firmen- &amp; Sonderservices',
        corp_subtitle: 'Luxus-Transportlösungen für Unternehmen, Kongresse, Hochzeiten und Protokoll',
        corp_s1_title: 'Firmen- &amp; Delegationsreisen',
        corp_s1_desc: 'Flottenkoordination für Kongresse, Seminare und Firmenveranstaltungen mit Vito &amp; Sprinter.',
        corp_s1_f1: 'Massen-Gruppen-Reisemanagement',
        corp_s1_f2: 'Monatliche B2B-Rechnungskonten',
        corp_s1_f3: 'Rund um die Uhr Support-Hotline',
        corp_s2_title: 'Protokoll &amp; VIP-Chauffeurservice',
        corp_s2_desc: 'Tägliche Miete mit mehrsprachigen Fahrern im Anzug für Staatsgäste, Führungskräfte und VIPs.',
        corp_s2_f1: 'Mehrsprachige Chauffeure im Anzug',
        corp_s2_f2: 'Höchste Diskretion &amp; Sicherheitsstandards',
        corp_s2_f3: 'Optionale VIP-Trennwand im Auto',
        corp_s3_title: 'Hochzeiten &amp; Event-Fahrten',
        corp_s3_desc: 'Brautpaartransfers, florale Dekorationen und maßgeschneiderte Konzepte für unvergessliche Tage.',
        corp_s3_f1: 'Fahrzeugdekoration &amp; Blumenarrangements',
        corp_s3_f2: 'VIP-Empfangsteams vor Ort',
        corp_s3_f3: 'Koordination für Gruppenfahrten',
        corp_btn_contact: 'Jetzt bewerben',
        preloader_text: 'VIP-Erlebnis wird geladen...',

        slide2_badge: 'Mercedes Vito &amp; Sprinter',
        slide2_title: 'Transfer mit <span>Premium-Komfort</span><br>zu jedem Ort in Antalya',
        slide2_desc: 'Wir bieten sichere und luxuriöse Transferdienste nach Belek, Side, Alanya, Kemer und in alle Regionen mit unseren neuesten Mercedes Vito und Sprinter Modellen.',
        slide2_feat_1: 'Verstellbare Komfortsitze',
        slide2_feat_2: 'Kostenloses Wi-Fi',
        slide2_feat_3: 'Klimaanlage &amp; Belüftung',
        
        slide3_badge: 'VIP Corporate &amp; Protokoll',
        slide3_title: 'Ein <span>einzigartiges</span> Erlebnis<br>im geschäftlichen Transfer',
        slide3_desc: 'Ihr zuverlässiger Partner für Meetings, Kongresse und Protokolltransfers. Mit unseren professionellen Fahrern und unserer Luxusflotte sind wir immer an Ihrer Seite.',
        slide3_feat_1: 'Professionelle Chauffeure',
        slide3_feat_2: 'Firmenrechnung',
        slide3_feat_3: '24/7 Support',

        slide4_badge: 'Hochzeiten &amp; besondere Anlässe',
        slide4_title: 'Eine <span>unvergessliche</span> Reise<br>an Ihren besonderen Tagen',
        slide4_desc: 'Für Hochzeiten, Verlobungen und Feierlichkeiten begleiten wir Sie mit blumengeschmückten Fahrzeugen und einem exklusiven VIP-Empfangsservice.',
        slide4_feat_1: 'Blumengeschmücktes Fahrzeug',
        slide4_feat_2: 'VIP-Empfang',
        slide4_feat_3: 'Sekt-Service',

        vehicle_label_0: 'Mercedes Vito VIP',
        vehicle_label_1: 'Mercedes Vito Premium',
        vehicle_label_2: 'Mercedes Sprinter VIP',
        vehicle_label_3: 'Hochzeits-VIP &amp; Events',
        brochures_header: 'Unsere Servicestandards &amp; Broschüren',
        brochures_sub: 'Sicher bei uns! Sie können unsere detaillierten Broschüren für ein erstklassiges VIP-Transfererlebnis über den Standards prüfen.',
        brochure_1_title: 'Sicher Bei Uns',
        brochure_1_text: 'Sicher mit kostenlosem WLAN, Wasser, transparenten Festpreisen und Flugverfolgung.',
        brochure_2_title: 'Über Den Standards',
        brochure_2_text: 'Hygienischer und komfortabler VIP-Transport zu Flughäfen, Hotels, Villen und Adressen.',
        pricing_title: 'Regionale Transferpreise',
        pricing_subtitle: 'Ab Flughafen Antalya (AYT) · Pro Fahrzeug · Pauschal-Festpreise inklusive allem',
        pricing_note: '10% Rabatt bei Hin- und Rückfahrten · Preise gelten pro Fahrzeug, nicht pro Person',
        pricing_destination: 'Zielort',
        step3_guide_btn: 'Empfangsführer anzeigen',
        video_title: 'Mountain VIP Reiseerlebnis',
        video_subtitle: 'Sehen Sie sich unsere Premium-Flotte, den persönlichen Flughafenempfang und den erstklassigen Komfort an'
    },
    ru: {
        brand: 'Mountain<span>VIP</span>',
        nav_home: 'Главная',
        nav_fleet: 'Наш VIP автопарк',
        nav_tours: 'Экскурсии',
        nav_why: 'Почему мы',
        nav_faq: 'Вопросы и ответы',
        nav_contact: 'Контакты',
        cta_call: 'Поддержка 24/7',
        hero_badge: 'VIP трансфер 24/7 по всей Анталье',
        hero_title: 'Безграничный <span>VIP комфорт</span> в любой точке Антальи',
        hero_subtitle: 'Путешествуйте безопасно, комфортно и экономично из аэропорта в отель или по любому адресу на наших роскошных автомобилях Mercedes Vito и Sprinter.',
        widget_title: 'Быстрый расчет цены и бронирование',
        widget_from: 'Откуда? (Аэропорт, отель, район)',
        widget_to: 'Куда? (Аланья, Кемер, Белек...)',
        widget_date: 'Дата трансфера',
        widget_time: 'Время трансфера',
        widget_pax: 'Количество пассажиров',
        widget_calc: 'Рассчитать лучшую стоимость',
        fleet_title: 'Наш ультра-люкс VIP флот',
        fleet_subtitle: 'Повысьте стандарты своих поездок с нашими роскошными автомобилями последнего поколения, оборудованными под любые ваши требования',
        amenity_wifi: 'Бесплатный высокоскоростной Wi-Fi',
        amenity_bar: 'Прохладительные напитки и угощения',
        amenity_charge: 'Быстрые зарядные устройства USB',
        amenity_ac: 'Двухзонный климат-контроль спереди/сзади',
        amenity_tv: 'Android Smart TV / Перегородка в салоне',
        fleet_pax_limit: 'Вместимость',
        fleet_luggage_limit: 'Багаж',
        fleet_book_now: 'Забронировать через WhatsApp',
        fleet_book_btn: 'Забронировать',
        fleet_from: 'Цены от',
        tours_title: 'Популярные места для посещения в Анталье',
        tours_subtitle: 'Откройте для себя самые популярные достопримечательности Антальи и путешествуйте с максимальным комфортом с нашими услугами VIP-трансфера.',
        tour_btn_discover: 'Подробнее',
        tour_btn_book: 'Заказать трансфер',
        why_title: 'Почему Mountain VIP Transfer?',
        why_subtitle: 'Мы являемся лидирующим брендом в Анталье по предоставлению качественных, безопасных и комфортных VIP поездок',
        why_1_title: 'Круглосуточное обслуживание 24/7',
        why_1_desc: 'Превосходный VIP трансфер в любое время дня и ночи, в любой день недели.',
        why_2_title: 'Гарантия фиксированной цены',
        why_2_desc: 'Никаких неожиданных доплат за парковки, платные дороги или мосты.',
        why_3_title: 'Бесплатное отслеживание задержек рейса',
        why_3_desc: 'Даже если ваш рейс задержится, водитель встретит вас вовремя без каких-либо доплат.',
        why_4_title: 'Профессиональные водители',
        why_4_desc: 'Опытные и сертифицированные гиды-водители со знанием иностранных языков.',
        faq_title: 'Часто задаваемые вопросы',
        faq_subtitle: 'Ответы на все интересующие вас вопросы о наших VIP услугах',
        faq_q1: 'Как я могу оформить бронирование?',
        faq_a1: 'Заполните маршрут в форме на сайте, чтобы мгновенно узнать цену, и нажмите кнопку WhatsApp, чтобы отправить заявку напрямую.',
        faq_q2: 'Как я найду своего водителя в аэропорту?',
        faq_a2: 'Водитель будет ждать вас на выходе из аэропорта с табличкой, на которой написано ваше имя. Детали встречи высылаются перед поездкой.',
        faq_q3: 'Что произойдет в случае задержки моего рейса?',
        faq_a3: 'Мы отслеживаем рейсы по номерам. Водитель встретит вас вовремя в любом случае, без взимания дополнительной платы.',
        faq_q4: 'Платная ли отмена бронирования?',
        faq_a4: 'Нет, все запросы на отмену, отправленные не позднее чем за 24 часа до трансфера, выполняются абсолютно бесплатно.',
        faq_q5: 'Предоставляется ли детское автокресло?',
        faq_a5: 'По вашему запросу мы бесплатно установим детские автокресла или бустеры. Укажите это в поле заметок в форме бронирования.',
        contact_title: 'Свяжитесь с нами',
        contact_subtitle: 'Мы на связи 24/7 для планирования ваших поездок, конгресс-трансферов и ответов на вопросы',
        contact_phone: 'Номер телефона / WhatsApp',
        contact_address: 'Адрес головного офиса',
        contact_address_val: 'Гюзельюрт Мах. 26220. Ул. №20 Аксу / Анталья, Турция',
        hotel_rates_title: 'Стоимость VIP-трансфера в популярные роскошные отели',
        hotel_rates_subtitle: 'Специальные тарифы на VIP-трансфер из аэропорта Антальи (AYT) в самые популярные пятизвездочные отели',
        hotel_legends_desc: 'Трансфер в отель Rixos Kingdom и парк развлечений',
        hotel_maxx_desc: 'Роскошный VIP-трансфер в спа-отель Elite Golf Resort',
        hotel_regnum_desc: 'VIP-транзит в апартаменты и виллы Golf &amp; Luxury Resort',
        hotel_delphin_desc: 'Быстрый индивидуальный трансфер в отельную зону Кунду',
        route_guide_title: 'Популярные VIP-маршруты и путеводитель',
        route_guide_subtitle: 'Расстояние, время в пути и информация о самых востребованных направлениях трансфера в Анталье',
        route_belek_desc: 'Трансфер между аэропортом Антальи и курортной зоной Белек (Land of Legends, Maxx Royal, Regnum) занимает около 30 минут. Наши VIP-автомобили используют скоростное шоссе для максимально быстрой доставки.',
        route_side_desc: 'Сиде, известный своими античными руинами и пляжами в районах Соргун, Кумкой и Эвренсеки, находится в 65 км от аэропорта. Мы предлагаем безопасный VIP-трансфер по трассе D400 примерно за 50 минут.',
        route_alanya_desc: 'Маршрут до Аланьи, включая Окурджалар, Авсаллар, Конаклы, Махмутлар и Каргыджак, составляет 125 км. В этой длительной поездке мультимедийная система TV и кожаные сиденья Vito гарантируют полный отдых.',
        route_kemer_desc: 'Маршрут в Кемер охватывает Бельдиби, Гёйнюк, Кириш, Чамьюва и Текирова, проходя 60 км вдоль живописных гор и моря. Поездка на наших люкс-минивэнах занимает около 55 минут.',
        advisor_title: 'Путеводитель по Анталье и полезные советы',
        advisor_subtitle: 'Полезная информация о VIP-трансферах, правилах дорожного движения и планировании поездок',
        advisor_art1_title: 'Работает ли Uber или мобильное такси в Анталье?',
        advisor_art1_body: 'Службы Uber и Lyft не имеют лицензии на независимую деятельность в Анталье. Обычные желтые такси работают по счетчику без фиксированной цены. Индивидуальные VIP-трансферы на Mercedes Vito с фиксированной стоимостью — это самый популярный выбор туристов.',
        advisor_art2_title: 'Обязательно ли детское кресло при поездках в Турции?',
        advisor_art2_body: 'Да, согласно закону о безопасности дорожного движения в Турции, дети должны путешествовать в специальных детских креслах. Для вашего спокойствия Mountain VIP Transfer предоставляет детские кресла и бустеры бесплатно.',
        advisor_art3_title: 'Что делать, если мой авиарейс в Анталью задерживается?',
        advisor_art3_body: 'Мы отслеживаем статус рейсов в аэропорту Антальи в реальном времени. Даже если рейс задержится, водитель встретит вас на выходе с именной табличкой. Никакой платы за ожидание из-за задержки рейса нет.',
        map_title: 'Интерактивная карта маршрута',
        map_subtitle: 'Визуализация пути в режиме реального времени для выбранного трансфера',
        map_distance: 'Расстояние',
        map_duration: 'Время в пути',
        map_pickup_lbl: 'Откуда (Прибытие)',
        map_dropoff_lbl: 'Куда (Отправление)',
        map_info_notice: 'Бесплатная встреча с табличкой, помощь с багажом и отслеживание рейсов включены.',
        modal_book_title: 'Информация о бронировании',
        modal_name: 'Ваше имя и фамилия',
        modal_phone: 'Номер телефона (WhatsApp)',
        modal_email: 'Адрес эл. почты',
        modal_flight: 'Номер рейса (Необязательно)',
        modal_notes: 'Особые пожелания / Заметки',
        modal_submit: 'Завершить бронирование в WhatsApp',
        success_title: 'Поздравляем!',
        success_msg: 'Запрос на бронирование успешно создан. Сейчас вы будете перенаправлены в WhatsApp для отправки подтверждения.',
        success_summary_title: 'Детали бронирования',
        success_btn_close: 'Закрыть',
        success_type: 'Тип услуги',
        success_type_transfer: 'VIP трансфер из аэропорта',
        success_type_tour: 'Индивидуальная экскурсия',
        success_route: 'Маршрут / Остановки',
        success_date: 'Дата и время',
        success_pax: 'Пассажиры',
        success_vehicle: 'Выбранный автомобиль',
        success_total: 'Итоговая стоимость',
        kvkk_checkbox_label: 'Я прочитал <a href="#" class="kvkk-link" style="color: var(--accent-gold); text-decoration: underline; font-weight: 600;">Политику конфиденциальности</a> и даю согласие на обработку персональных данных.',
        kvkk_modal_title: 'Политика конфиденциальности',
        cookie_text: 'Мы используем файлы cookie для улучшения работы сайта. Продолжая просмотр страниц, вы соглашаетесь с нашей политикой.',
        cookie_accept: 'Принять',
        how_title: 'Как это работает?',
        how_subtitle: 'Безопасное и комфортное VIP-бронирование в 4 простых шага',
        step1_title: 'Онлайн Бронирование',
        step1_desc: 'Выберите маршрут и дату, чтобы рассчитать цену на сайте, забронируйте мгновенно через форму или WhatsApp.',
        step2_title: 'Отслеживание Рейса',
        step2_desc: 'Наша операционная служба отслеживает ваш рейс и бесплатно обновляет время подачи при задержках.',
        step3_title: 'Встреча с Табличкой',
        step3_desc: 'Наш шофер встретит вас на выходе из терминала с табличкой с вашим именем или логотипом Mountain VIP.',
        step4_title: 'Оплата в Машине',
        step4_desc: 'Бронь без предоплаты. Оплачивайте наличными (EUR, USD, GBP, TL) водителю по завершении поездки.',
        corp_title: 'VIP Корпоративные и Специальные Услуги',
        corp_subtitle: 'Роскошные Транспортные Решения для Компаний, Событий, Свадеб и Протоколов',
        corp_s1_title: 'Корпоративные и Делегационные Перевозки',
        corp_s1_desc: 'Координация автопарка для конгрессов, семинаров и корпоративных встреч на Vito и Sprinter.',
        corp_s1_f1: 'Управление групповой логистикой',
        corp_s1_f2: 'Ежемесячный B2B безналичный расчет',
        corp_s1_f3: '24/7 Линия поддержки компаний',
        corp_s2_title: 'Протокол и Почасовая Аренда с Шофером',
        corp_s2_desc: 'Аренда на день с двуязычными водителями в костюмах для бизнес-лидеров, политиков и знаменитостей.',
        corp_s2_f1: 'Профессиональные водители в костюмах',
        corp_s2_f2: 'Абсолютная конфиденциальность и безопасность',
        corp_s2_f3: 'Возможность перегородки в салоне',
        corp_s3_title: 'Свадьбы и Особые VIP Торжества',
        corp_s3_desc: 'Трансфер для жениха и невесты, украшение автомобилей цветами и премиальный сервис для гостей.',
        corp_s3_f1: 'Свадебный декор автомобиля и флористика',
        corp_s3_f2: 'Собственные хостес для встречи гостей',
        corp_s3_f3: 'Сложные маршруты для приглашенных',
        corp_btn_contact: 'Подать Заявку',
        preloader_text: 'Загрузка VIP-услуг...',

        slide2_badge: 'Mercedes Vito и Sprinter',
        slide2_title: 'Трансфер с <span>премиум-комфортом</span><br>в любую точку Антальи',
        slide2_desc: 'Мы предлагаем безопасные и роскошные трансферы в Белек, Сиде, Аланью, Кемер и все регионы на новейших автомобилях Mercedes Vito и Sprinter.',
        slide2_feat_1: 'Откидные комфортные сиденья',
        slide2_feat_2: 'Бесплатный Wi-Fi',
        slide2_feat_3: 'Климат-контроль',
        
        slide3_badge: 'VIP Корпоративный и Протокол',
        slide3_title: '<span>Уникальный</span> опыт<br>в корпоративном трансфере',
        slide3_desc: 'Ваш надежный партнер для встреч, конгрессов и протокольных трансферов. Мы всегда рядом с нашими профессиональными водителями и парком роскошных автомобилей.',
        slide3_feat_1: 'Профессиональные водители',
        slide3_feat_2: 'Корпоративный счет',
        slide3_feat_3: 'Поддержка 24/7',

        slide4_badge: 'Свадьбы и особые мероприятия',
        slide4_title: '<span>Незабываемое</span> путешествие<br>в ваши особые дни',
        slide4_desc: 'Для свадеб, помолвок и торжеств мы сделаем этот момент вечным с нашими украшенными цветами автомобилями и VIP-сервисом встречи.',
        slide4_feat_1: 'Автомобиль с цветами',
        slide4_feat_2: 'VIP-Встреча',
        slide4_feat_3: 'Шампанское в салоне',

        vehicle_label_0: 'Mercedes Vito VIP',
        vehicle_label_1: 'Mercedes Vito Premium',
        vehicle_label_2: 'Mercedes Sprinter VIP',
        vehicle_label_3: 'Свадебный VIP и спецпроекты',
        vehicle_label_4: 'Mercedes Vito VIP',
        vehicle_label_5: 'Mercedes Vito Premium',
        vehicle_label_6: 'Mercedes Sprinter VIP',
        vehicle_label_7: 'Wedding VIP & Special Events',
        vehicle_label_8: 'Mercedes Vito VIP',
        vehicle_label_9: 'Mercedes Vito Premium',
        vehicle_label_10: 'Mercedes Sprinter VIP',
        vehicle_label_11: 'Свадебный VIP и спецпроекты',
        brochures_header: 'Наши стандарты обслуживания и брошюры',
        brochures_sub: 'С нами вы в безопасности! Вы можете ознакомиться с нашими подробными брошюрами для премиального VIP-трансфера.',
        brochure_1_title: 'С Нами Вы в Безопасности',
        brochure_1_text: 'Бесплатный Wi-Fi, питьевая вода, фиксированные тарифы и онлайн-отслеживание рейсов.',
        brochure_2_title: 'Выше Стандартов',
        brochure_2_text: 'Гигиеничный и комфортный VIP-трансфер в аэропорт, отели, частные виллы и по адресам.',
        pricing_title: 'Региональные тарифы трансфера',
        pricing_subtitle: 'Из аэропорта Анталья (AYT) · За автомобиль · Фиксированные цены включая всё',
        pricing_note: 'Скидка 10% при бронировании туда и обратно · Цены указаны за автомобиль',
        pricing_destination: 'Направление',
        step3_guide_btn: 'Смотреть гид по встрече',
        video_title: 'Mountain VIP Опыт Путешествий',
        video_subtitle: 'Посмотрите видео о нашем премиальном автопарке, персональной встрече и первоклассном комфорте в пути'
    },
};

// --- Internationalization Currency & Helpers ---

const seoMetaData = {
    tr: {
        title: "Mountain VIP Transfer | Antalya Havalimanı Lüks VIP Ulaşım Hizmeti",
        desc: "Mountain VIP Transfer - Antalya genelinde (Belek, Side, Alanya, Kemer) 7/24 lüks Mercedes Vito ve Sprinter VIP transfer. Sabit fiyat ve ücretsiz havalimanı karşılama."
    },
    en: {
        title: "Mountain VIP Transfer | Antalya Airport Luxury VIP Transfer Service",
        desc: "Mountain VIP Transfer - 24/7 private luxury Mercedes Vito and Sprinter airport transfers in Antalya (Belek, Side, Alanya, Kemer). Fixed rates, flight tracking."
    },
    de: {
        title: "Mountain VIP Transfer | Antalya Flughafen VIP Transfer & Privatshuttle",
        desc: "Mountain VIP Transfer - 24/7 luxuriöser privater Flughafentransfer in Antalya (Belek, Side, Alanya, Kemer) mit Mercedes Vito & Sprinter. Festpreise & Abholung."
    },
    ru: {
        title: "Mountain VIP Transfer | VIP трансфер Анталья Аэропорт | Люкс такси",
        desc: "Mountain VIP Transfer - Круглосуточный VIP трансфер на Mercedes Vito и Sprinter в Анталье (Белек, Сиде, Аланья, Кемер). Фиксированные цены, встреча в аэропорту."
    }
};

const testimonialsData = {
    tr: [
        { name: "Kemal A. 🇹🇷", country: "İstanbul, Türkiye", text: "Antalya Havalimanından Kundu otelimize yaptığımız transferde güler yüzlü karşılama ve vaktinde ulaşım çok iyiydi. Vito araç içi tasarımı harikaydı." },
        { name: "Hans M. 🇩🇪", country: "Hamburg, Deutschland", text: "Ausgezeichneter Service! Der Fahrer wartete pünktlich am Flughafen Antalya mit unserem Namensschild. Die Mercedes Vito war sauber und luxuriös." },
        { name: "Sarah B. 🇬🇧", country: "London, United Kingdom", text: "Incredible VIP service! The Mercedes Vito was immaculate, driver was waiting at AYT Airport with a name sign. 5 stars." },
        { name: "Dmitry S. 🇷🇺", country: "Москва, Россия", text: "Прекрасный VIP-трансфер! Чистый мерседес вито, детское кресло предоставили бесплатно. Водитель вежливый, помог с багажом." },
        { name: "Selin K. 🇹🇷", country: "Ankara, Türkiye", text: "Belek seyahatimizde 2 çocukla tercih ettik. Bebek koltuğu önceden ayarlanmıştı. Şoförümüz çok kibardı." }
    ],
    en: [
        { name: "Sarah B. 🇬🇧", country: "London, UK", text: "Incredible VIP service! The Mercedes Vito was immaculate, driver was waiting at AYT Airport with a name sign. 5 stars." },
        { name: "Hans M. 🇩🇪", country: "Hamburg, Germany", text: "Ausgezeichneter Service! Der Fahrer wartete pünktlich am Flughafen Antalya mit unserem Namensschild. Die Mercedes Vito war sauber und luxuriös." },
        { name: "Kemal A. 🇹🇷", country: "Istanbul, Turkey", text: "Antalya Havalimanından Kundu otelimize yaptığımız transferde güler yüzlü karşılama ve vaktinde ulaşım çok iyiydi. Vito araç içi tasarımı harikaydı." },
        { name: "Dmitry S. 🇷🇺", country: "Moscow, Russia", text: "Прекрасный VIP-трансфер! Чистый мерседес вито, детское кресло предоставили бесплатно. Водитель вежливый, помог с багажом." },
        { name: "Karin S. 🇩🇪", country: "Frankfurt, Germany", text: "Sehr bequeme Buchung per WhatsApp. Die Bezahlung erfolgte in bar direkt beim Fahrer. Kostenlose Kindersitze waren bereits im Auto montiert." }
    ],
    de: [
        { name: "Hans M. 🇩🇪", country: "Hamburg, DE", text: "Ausgezeichneter Service! Der Fahrer wartete pünktlich am Flughafen Antalya mit unserem Namensschild. Die Mercedes Vito war sauber und luxuriös." },
        { name: "Karin S. 🇩🇪", country: "Frankfurt, DE", text: "Sehr bequeme Buchung per WhatsApp. Die Bezahlung erfolgte in bar direkt beim Fahrer. Kostenlose Kindersitze waren bereits im Auto montiert." },
        { name: "Kemal A. 🇹🇷", country: "Istanbul, Türkei", text: "Antalya Havalimanından Kundu otelimize yaptığımız transferde güler yüzlü karşılama ve vaktinde ulaşım çok iyiydi. Vito araç içi tasarımı harikaydı." },
        { name: "Sarah B. 🇬🇧", country: "London, UK", text: "Incredible VIP service! The Mercedes Vito was immaculate, driver was waiting at AYT Airport with a name sign. 5 stars." },
        { name: "Thomas W. 🇩🇪", country: "Berlin, DE", text: "Zuverlässig, professionell und sehr faire Festpreise. Wir haben unseren Transfer nach Alanya mit der Familie sehr genossen." }
    ],
    ru: [
        { name: "Dmitry S. 🇷🇺", country: "Москва, РФ", text: "Прекрасный VIP-трансфер! Чистый мерседес вито, детское кресло предоставили бесплатно. Водитель вежливый, помог с багажом." },
        { name: "Ольга П. 🇷🇺", country: "Москва, РФ", text: "Заказывали трансфер до Белека через WhatsApp. Ответили сразу. Очень удобно, что оплата наличными водителю на месте." },
        { name: "Kemal A. 🇹🇷", country: "Стамбул, Турция", text: "Antalya Havalimanından Kundu otelimize yaptığımız transferde güler yüzlü karşılama ve vaktinde ulaşım çok iyiydi. Vito araç içi tasarımı harikaydı." },
        { name: "Hans M. 🇩🇪", country: "Гамбург, Германия", text: "Ausgezeichneter Service! Der Fahrer wartete pünktlich am Flughafen Antalya mit unserem Namensschild. Die Mercedes Vito war sauber und luxuriös." },
        { name: "Анна К. 🇷🇺", country: "Казань, РФ", text: "Ездили большой группой на Спринтере до Кемера. Салон шикарный, кондиционер работал отлично, доехали с комфортом." }
    ]
};

const currencyRates = {
    EUR: { rate: 1.0, symbol: '€', position: 'before' },
    USD: { rate: 1.08, symbol: '$', position: 'before' },
    RUB: { rate: 100.0, symbol: ' ₽', position: 'after' },
    GBP: { rate: 0.86, symbol: '£', position: 'before' },
    TRY: { rate: 39.0, symbol: ' ₺', position: 'after' }
};

function formatPrice(priceInEur) {
    const curr = state.currentCurrency || 'EUR';
    const cfg = currencyRates[curr] || currencyRates.EUR;
    const converted = Math.round(priceInEur * cfg.rate);
    
    let rounded = converted;
    if (curr === 'TRY') {
        rounded = Math.round(converted / 50) * 50;
    } else if (curr === 'RUB') {
        rounded = Math.round(converted / 100) * 100;
    } else {
        rounded = Math.round(converted / 5) * 5;
        if (rounded === 0) rounded = Math.round(converted);
    }
    
    if (cfg.position === 'before') {
        return `${cfg.symbol}${rounded}`;
    } else {
        return `${rounded}${cfg.symbol}`;
    }
}

async function fetchLiveRates() {
    try {
        const res = await fetch('https://open.er-api.com/v6/latest/EUR');
        if (!res.ok) throw new Error('API failed');
        const data = await res.json();
        if (data && data.rates) {
            const usd = data.rates.USD;
            const rub = data.rates.RUB;
            const gbp = data.rates.GBP;
            const try_ = data.rates.TRY;
            
            if (usd) currencyRates.USD.rate = usd;
            if (rub) currencyRates.RUB.rate = rub;
            if (gbp) currencyRates.GBP.rate = gbp;
            if (try_) currencyRates.TRY.rate = try_;
            
            console.log('Live rates loaded:', currencyRates);
        }
    } catch(err) {
        console.warn('Could not fetch live rates, using fallback values.', err);
    } finally {
        updateLiveRatesDisplay();
        renderFleetCards();
        // Update all price tags on the page
        document.querySelectorAll('.hotel-price-tag').forEach(el => {
            const basePrice = parseInt(el.getAttribute('data-base-price'));
            if (!isNaN(basePrice)) {
                el.innerText = formatPrice(basePrice);
            }
        });
    }
}

function updateLiveRatesDisplay() {
    const display = document.getElementById('live-rates-display');
    if (!display) return;
    
    // We want to show rates of major currencies in TRY (TL)
    const tryRate = currencyRates.TRY.rate;
    const usdRate = currencyRates.USD.rate;
    const gbpRate = currencyRates.GBP.rate;
    const rubRate = currencyRates.RUB.rate;
    
    const eurInTry = tryRate.toFixed(2);
    const usdInTry = (tryRate / usdRate).toFixed(2);
    const gbpInTry = (tryRate / gbpRate).toFixed(2);
    const rub100InTry = ((tryRate / rubRate) * 100).toFixed(2);
    
    display.innerHTML = '';
    const rates = [
        { label: '1 €', val: eurInTry },
        { label: '1 $', val: usdInTry },
        { label: '1 £', val: gbpInTry },
        { label: '100 ₽', val: rub100InTry }
    ];
    
    rates.forEach(item => {
        const rateSpan = document.createElement('span');
        rateSpan.style.cssText = 'font-size: 0.76rem; font-weight: 700; color: var(--text-primary); background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 0.2rem 0.5rem; border-radius: 4px; display: inline-flex; align-items: center; gap: 0.2rem;';
        rateSpan.innerHTML = `<span>${item.label} =</span> <span style="color: var(--accent-gold-hover);">${item.val}</span> <span>₺</span>`;
        display.appendChild(rateSpan);
    });
}

function getSimulatedWeather() {
    const now = new Date();
    const month = now.getMonth();
    const hour = now.getHours();
    
    let aytBase = 22;
    let alnBase = 21;
    
    if (month >= 5 && month <= 8) {
        aytBase = 32;
        alnBase = 31;
    } else if (month >= 9 && month <= 10) {
        aytBase = 24;
        alnBase = 23;
    } else if (month >= 11 || month <= 1) {
        aytBase = 15;
        alnBase = 15;
    } else {
        aytBase = 20;
        alnBase = 19;
    }
    
    let diurnalShift = -2;
    if (hour >= 10 && hour <= 17) {
        diurnalShift = 1.5;
    } else if (hour >= 18 && hour <= 22) {
        diurnalShift = -0.5;
    } else {
        diurnalShift = -3.5;
    }
    
    const day = now.getDate();
    const randomShift = (day % 3) - 1;
    
    const aytTemp = Math.round(aytBase + diurnalShift + randomShift);
    const alnTemp = Math.round(alnBase + diurnalShift + randomShift - 0.5);
    
    let condAyt = '☀️';
    let condAln = '☀️';
    
    if (month >= 10 || month <= 2) {
        if (day % 4 === 0) {
            condAyt = '🌧️'; condAln = '🌧️';
        } else if (day % 4 === 1) {
            condAyt = '⛅'; condAln = '⛅';
        }
    } else {
        if (day % 7 === 0) {
            condAyt = '⛅'; condAln = '⛅';
        }
    }
    
    return {
        ayt: { temp: aytTemp, icon: condAyt },
        aln: { temp: alnTemp, icon: condAln }
    };
}

function updatePromoBanner() {
    const lang = state.currentLang;
    const banner = document.getElementById('alert-promo-banner');
    if (!banner) return;
    
    const w = getSimulatedWeather();
    
    const messages = {
        tr: `⭐ ÜCRETSİZ İPTAL &amp; ARAÇTA NAKİT ÖDEME | ${w.ayt.icon} Antalya: ${w.ayt.temp}°C | ${w.aln.icon} Alanya: ${w.aln.temp}°C ⭐`,
        en: `⭐ FREE CANCELLATION &amp; PAY CASH | ${w.ayt.icon} Antalya: ${w.ayt.temp}°C | ${w.aln.icon} Alanya: ${w.aln.temp}°C ⭐`,
        de: `⭐ KOSTENLOSE STORNIERUNG &amp; BARZAHLUNG | ${w.ayt.icon} Antalya: ${w.ayt.temp}°C | ${w.aln.icon} Alanya: ${w.aln.temp}°C ⭐`,
        ru: `⭐ БЕСПЛАТНАЯ ОТМЕНА И ОПЛАТА В МАШИНЕ | ${w.ayt.icon} Анталья: ${w.ayt.temp}°C | ${w.aln.icon} Аланья: ${w.aln.temp}°C ⭐`
    };
    
    banner.innerHTML = messages[lang] || messages.en;
    
    // Live Weather Badge update
    const weatherIconLive = document.getElementById('weather-icon-live');
    const weatherTextLive = document.getElementById('weather-text-live');
    
    if (weatherTextLive) {
        const weatherGreetingMessages = {
            tr: `Antalya: ${w.ayt.temp}°C ${w.ayt.icon === '☀️' ? 'Güneşli' : 'Açık'} — VIP seyahatiniz için harika bir gün!`,
            en: `Antalya: ${w.ayt.temp}°C ${w.ayt.icon === '☀️' ? 'Sunny' : 'Clear'} — A beautiful day for your VIP transfer!`,
            de: `Antalya: ${w.ayt.temp}°C ${w.ayt.icon === '☀️' ? 'Sonnig' : 'Klar'} — Ein schöner Tag für Ihren VIP-Transfer!`,
            ru: `Анталья: ${w.ayt.temp}°C ${w.ayt.icon === '☀️' ? 'Ясно' : 'Солнечно'} — Отличный день для вашего VIP-трансфера!`
        };
        weatherTextLive.innerText = weatherGreetingMessages[lang] || weatherGreetingMessages.en;
    }
    if (weatherIconLive) {
        weatherIconLive.innerText = w.ayt.icon;
    }
}

function renderTestimonials() {
    const lang = state.currentLang;
    const container = document.getElementById('testimonials-container');
    if (!container) return;
    
    const list = testimonialsData[lang] || testimonialsData.en;
    container.innerHTML = '';
    
    list.forEach((item, index) => {
        // Strip emojis and non-alphanumeric (except spaces) for initials calculation
        const cleanName = item.name.replace(/[^a-zA-Zа-яА-Я0-9\s]/g, '').trim();
        const initials = cleanName.split(' ').filter(Boolean).map(n => n[0].toUpperCase()).join('').substring(0, 2);
        
        const isGoogle = index % 2 === 0;
        const sourceLogo = isGoogle 
            ? `<span class="review-source google-source" style="display:flex; align-items:center; gap:0.25rem; font-size:0.65rem; color:#aaa; font-weight:700; text-transform:uppercase;"><i class="fab fa-google" style="color:#4285F4;"></i> Google</span>`
            : `<span class="review-source trustpilot-source" style="display:flex; align-items:center; gap:0.25rem; font-size:0.65rem; color:#aaa; font-weight:700; text-transform:uppercase;"><i class="fas fa-star" style="color:#00b67a;"></i> Trustpilot</span>`;
            
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        card.innerHTML = `
            <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                    <div class="testimonial-stars" style="${!isGoogle ? 'color:#00b67a;' : 'color:var(--accent-gold);'}">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    ${sourceLogo}
                </div>
                <p class="testimonial-text">"${item.text}"</p>
            </div>
            <div class="testimonial-user">
                <div class="testimonial-avatar" style="${!isGoogle ? 'background:linear-gradient(135deg, #00b67a 0%, #008f5f 100%);' : 'background:var(--accent-gold); color:#111;'}">${initials}</div>
                <div>
                    <h5 class="testimonial-name" style="display:flex; align-items:center; gap:0.35rem; font-weight:700;">
                        ${item.name} 
                        <i class="fas fa-check-circle" style="color:#25d366; font-size:0.75rem;" title="Doğrulanmış Müşteri"></i>
                    </h5>
                    <span class="testimonial-country">${item.country}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function updateWhatsAppWidgetLink() {
    const btn = document.getElementById('whatsapp-floating-btn');
    if (!btn) return;
    
    const lang = state.currentLang;
    const pickupLocName = state.pickup.startsWith('custom_') ? state.pickup.replace('custom_', '') : (locations[state.pickup] ? locations[state.pickup][lang] : '');
    const dropoffLocName = state.dropoff.startsWith('custom_') ? state.dropoff.replace('custom_', '') : (locations[state.dropoff] ? locations[state.dropoff][lang] : '');
    const pax = state.passengers || '1';
    
    let text = '';
    if (lang === 'tr') {
        text = `Merhaba Mountain VIP, ${pickupLocName} noktasından ${dropoffLocName} noktasına ${pax} kişi için VIP transfer rezervasyon detayları ve fiyat bilgisi almak istiyorum.`;
    } else if (lang === 'de') {
        text = `Hallo Mountain VIP, ich möchte VIP-Transfer-Details und Preisinformationen für ${pax} Personen von ${pickupLocName} nach ${dropoffLocName} erhalten.`;
    } else if (lang === 'ru') {
        text = `Здравствуйте, Mountain VIP! Я хочу узнать информацию о ценах на VIP-трансфер для ${pax} человек из ${pickupLocName} в ${dropoffLocName}.`;
    } else {
        text = `Hello Mountain VIP, I would like to get VIP transfer details and pricing for ${pax} people from ${pickupLocName} to ${dropoffLocName}.`;
    }
    
    btn.href = `https://api.whatsapp.com/send?phone=+905442595196&text=${encodeURIComponent(text)}`;
}

function updateFaqSchema() {
    const lang = state.currentLang;
    const dict = translations[lang];
    if (!dict) return;
    
    const questions = [
        { q: dict.faq_q1, a: dict.faq_a1 },
        { q: dict.faq_q2, a: dict.faq_a2 },
        { q: dict.faq_q3, a: dict.faq_a3 },
        { q: dict.faq_q4, a: dict.faq_a4 },
        { q: dict.faq_q5, a: dict.faq_a5 }
    ];
    
    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": questions.map(item => ({
            "@type": "Question",
            "name": item.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.a
            }
        }))
    };
    
    const scriptEl = document.getElementById('faq-schema-markup');
    if (scriptEl) {
        scriptEl.textContent = JSON.stringify(schema, null, 2);
    }
}

function setLanguage(lang) {
    state.currentLang = lang;
    
    const flagEl = document.getElementById('active-flag');
    const langEl = document.getElementById('active-lang');
    if (flagEl && langEl) {
        const flagMap = { tr: '🇹🇷', en: '🇬🇧', de: '🇩🇪', ru: '🇷🇺' };
        flagEl.innerText = flagMap[lang] || '🇬🇧';
        langEl.innerText = lang.toUpperCase();
    }
    
    applyTranslations();
    if (window.syncFlatpickrLocale) {
        window.syncFlatpickrLocale(lang);
    }
}

function setCurrency(curr) {
    state.currentCurrency = curr;
    
    const symbolEl = document.getElementById('active-curr-symbol');
    const codeEl = document.getElementById('active-curr-code');
    if (symbolEl && codeEl) {
        const cfg = currencyRates[curr] || currencyRates.EUR;
        symbolEl.innerText = cfg.symbol.trim();
        codeEl.innerText = curr;
    }
    
    applyTranslations();
}

// --- Booking Type & Tab Controls ---

function setBookingType(type) {
    state.bookingType = type;
    
    const tabTransfer = document.getElementById('tab-transfer');
    const tabHourly = document.getElementById('tab-hourly');
    const dropoffGroup = document.getElementById('dropoff-group');
    const bbRouteDivider = document.getElementById('bb-route-divider');
    const hourlyDurationGroup = document.getElementById('hourly-duration-group');
    const roundTripToggleWrapper = document.getElementById('round-trip-toggle-wrapper');
    
    const labelPickup = document.getElementById('label-pickup');
    const labelDate = document.getElementById('label-date');
    const labelTime = document.getElementById('label-time');
    const btnCalcText = document.getElementById('btn-calc-text');
    const labelText = document.getElementById('booking-label-text');
    
    if (type === 'transfer') {
        if (tabTransfer) {
            tabTransfer.classList.add('active');
            tabTransfer.style.color = 'var(--accent-gold)';
            tabTransfer.style.borderBottom = '2px solid var(--accent-gold)';
        }
        if (tabHourly) {
            tabHourly.classList.remove('active');
            tabHourly.style.color = 'var(--text-muted)';
            tabHourly.style.borderBottom = '2px solid transparent';
        }
        if (dropoffGroup) dropoffGroup.style.display = 'block';
        if (bbRouteDivider) bbRouteDivider.style.display = 'flex';
        if (hourlyDurationGroup) hourlyDurationGroup.style.display = 'none';
        if (roundTripToggleWrapper) roundTripToggleWrapper.style.display = 'flex';
        
        if (labelPickup) labelPickup.innerText = state.currentLang === 'tr' ? 'Nereden?' : 'Pickup?';
        if (labelDate) labelDate.innerText = state.currentLang === 'tr' ? 'Gidiş Tarihi' : 'Pickup Date';
        if (labelTime) labelTime.innerText = state.currentLang === 'tr' ? 'Gidiş Saati' : 'Pickup Time';
        if (btnCalcText) btnCalcText.innerText = state.currentLang === 'tr' ? 'Fiyat Hesapla' : 'Calculate Price';
        if (labelText) labelText.innerText = state.currentLang === 'tr' ? 'Hızlı VIP Transfer Rezervasyonu' : 'Quick VIP Transfer Booking';
        
        // Restore round trip if checkbox checked
        const cb = document.getElementById('booking-round-trip');
        toggleRoundTrip(cb);
    } else {
        if (tabTransfer) {
            tabTransfer.classList.remove('active');
            tabTransfer.style.color = 'var(--text-muted)';
            tabTransfer.style.borderBottom = '2px solid transparent';
        }
        if (tabHourly) {
            tabHourly.classList.add('active');
            tabHourly.style.color = 'var(--accent-gold)';
            tabHourly.style.borderBottom = '2px solid var(--accent-gold)';
        }
        if (dropoffGroup) dropoffGroup.style.display = 'none';
        if (bbRouteDivider) bbRouteDivider.style.display = 'none';
        if (hourlyDurationGroup) hourlyDurationGroup.style.display = 'block';
        if (roundTripToggleWrapper) roundTripToggleWrapper.style.display = 'none';
        
        if (labelPickup) labelPickup.innerText = state.currentLang === 'tr' ? 'Alış Noktası?' : 'Pickup Location?';
        if (labelDate) labelDate.innerText = state.currentLang === 'tr' ? 'Başlangıç Tarihi' : 'Start Date';
        if (labelTime) labelTime.innerText = state.currentLang === 'tr' ? 'Başlangıç Saati' : 'Start Time';
        if (btnCalcText) btnCalcText.innerText = state.currentLang === 'tr' ? 'Kiralama Hesapla' : 'Calculate Chauffeur';
        if (labelText) labelText.innerText = state.currentLang === 'tr' ? 'Saatlik Şoförlü VIP Araç Kiralama' : 'VIP Chauffeur Chauffeur Booking';
        
        // Hide return date groups for hourly
        document.querySelectorAll('.return-date-group').forEach(el => {
            el.style.display = 'none';
        });
    }
    
    renderFleetCards();
}

function toggleRoundTrip(checkbox) {
    const returnGroups = document.querySelectorAll('.return-date-group');
    if (checkbox && checkbox.checked && state.bookingType === 'transfer') {
        state.isRoundTrip = true;
        returnGroups.forEach(el => el.style.display = 'block');
    } else {
        state.isRoundTrip = false;
        returnGroups.forEach(el => el.style.display = 'none');
    }
    renderFleetCards();
}

function openWelcomeGuide() {
    const modal = document.getElementById('welcome-guide-modal');
    if (modal) modal.classList.add('active');
}

// Ensure globally accessible
window.openWelcomeGuide = openWelcomeGuide;
window.setBookingType = setBookingType;
window.toggleRoundTrip = toggleRoundTrip;
window.closeWelcomeGuide = closeWelcomeGuide;

function closeWelcomeGuide() {
    const modal = document.getElementById('welcome-guide-modal');
    if (modal) modal.classList.remove('active');
}

function updateWelcomeSignPreview(val) {
    const previewEl = document.getElementById('welcome-sign-guest-name');
    if (!previewEl) return;
    
    const cleanVal = val.trim();
    if (cleanVal === '') {
        previewEl.innerText = state.currentLang === 'tr' ? 'HOŞ GELDİNİZ' : 'WELCOME';
    } else {
        previewEl.innerText = cleanVal;
    }
}

function openVehicleGallery(vehicleId) {
    const vehicle = vehicles[vehicleId];
    if (!vehicle) return;
    
    const modal = document.getElementById('vehicle-gallery-modal');
    const titleEl = document.getElementById('gallery-vehicle-title');
    const imgEl = document.getElementById('gallery-vehicle-img');
    const descEl = document.getElementById('gallery-vehicle-desc');
    const bookBtn = document.getElementById('gallery-book-btn');
    
    if (modal && imgEl) {
        imgEl.src = vehicle.interiorImage || vehicle.image;
        if (titleEl) {
            titleEl.innerHTML = `<i class="fas fa-camera"></i> ${vehicle.name} - ${state.currentLang === 'tr' ? 'Kabin İç Görünümü' : 'Interior View'}`;
        }
        if (descEl) {
            const descMap = {
                vito: {
                    tr: 'Mercedes Vito VIP: Yatarlı deri konfor koltuklar, TV & multimedya, klima, buzdolabı ve geniş kabin.',
                    en: 'Mercedes Vito VIP: Reclining leather comfort seats, TV & multimedia, AC, fridge and spacious cabin.'
                },
                vito_premium: {
                    tr: 'Premium VIP Vito: Yıldızlı tavan ambiyansı, ultra lüks masaj koltuklar, özel gizlilik bölmesi ve tur hizmeti.',
                    en: 'Premium VIP Vito: Star ceiling ambience, ultra luxury massage seats, full privacy partition and tour service.'
                },
                sprinter: {
                    tr: 'VIP Mercedes Sprinter: Yüksek tavan ferahlığı, mini bar, lüks business jet koltukları ve devasa bagaj alanı.',
                    en: 'VIP Mercedes Sprinter: High ceiling, mini bar, luxury business jet seats and massive luggage area.'
                }
            };
            descEl.innerText = descMap[vehicleId] ? (descMap[vehicleId][state.currentLang] || descMap[vehicleId].en) : 'Lüks VIP Donanımlı İç Tasarım';
        }
        
        if (bookBtn) {
            bookBtn.onclick = () => {
                closeVehicleGallery();
                openBookingModal('transfer', vehicleId);
            };
        }
        
        modal.classList.add('active');
    }
}

function closeVehicleGallery() {
    const modal = document.getElementById('vehicle-gallery-modal');
    if (modal) modal.classList.remove('active');
}

// Bind to window for global access
window.updateWelcomeSignPreview = updateWelcomeSignPreview;
window.openVehicleGallery = openVehicleGallery;
window.closeVehicleGallery = closeVehicleGallery;

// --- Distance & Pricing Logic ---

/**
 * Calculates the transfer fare between pickup and dropoff locations
 * @param {string} pickupId 
 * @param {string} dropoffId 
 * @param {string} vehicleId 
 * @returns {number} calculated fare in Euros
 */
function calculateTransferFare(pickupId, dropoffId, vehicleId) {
    const pickupLoc = locations[pickupId];
    const dropoffLoc = locations[dropoffId];
    const vehicle = vehicles[vehicleId];
    
    if (!vehicle) return 0;
    
    // --- Hourly Chauffeur Pricing ---
    if (state.bookingType === 'hourly') {
        const hoursSelect = document.getElementById('booking-hours');
        const hours = parseInt(hoursSelect ? hoursSelect.value : '4', 10);
        
        let hourlyRate = 35; // default Vito
        if (vehicleId === 'vito_premium') {
            hourlyRate = 42;
        } else if (vehicleId === 'sprinter') {
            hourlyRate = 50;
        } else if (vehicleId === 'shuttle') {
            hourlyRate = 28;
        }
        
        let totalHourlyPrice = hours * hourlyRate;
        return Math.round(totalHourlyPrice / 5) * 5;
    }
    
    // --- Standard Transfer Pricing ---
    const locationBasePrices = {
        // Center / Antalya Merkez (30 €)
        kaleici: 30, kepez: 30, muratpasa: 30, aksu: 30, lara: 30, kundu: 30, konyaalti: 30,
        // Belek (40 €)
        belek: 40, kadriye: 40, serik: 40, bogazkent: 40,
        // Side (45 €)
        ilica: 45, kumkoy: 45, evrenseki: 45, gundogdu: 45, colakli: 45, denizyaka: 45, sorgun: 45, titreyengol: 45,
        // Manavgat (50 €)
        cenger: 50, kizilagac: 50, kizilot: 50,
        // Kemer (50 €)
        beldibi: 50, goynuk: 50, kiris: 50, camyuva: 50,
        // Tekirova (65 €)
        tekirova: 65,
        // Alanya 70 €
        cikcilli: 70, oba: 70, tosmur: 70, mahmutlar: 70, kargicak: 70,
        // Alanya West 75 €
        incekum: 75, avsallar: 75, turkler: 75, konakli: 75, payallar: 75, okurcalar: 75, karaburun: 75, kestel: 75,
        // Adrasan 70 €
        ulupinar: 70, olimpos: 70, cirali: 70, kumluca: 70,
        // Mavikent 80 €
        mavikent: 80,
        // Finike / Demre 90 €
        finike: 90, demre: 90,
        // Kalkan / Patara 120 €
        kalkan: 120, patara: 120,
        // Kekova 130 €
        kekova: 130,
        // Kaş 125 €
        kas: 125
    };

    let basePrice = 30;
    const otherId = (pickupId === 'ayt') ? dropoffId : ((dropoffId === 'ayt') ? pickupId : null);

    if (otherId && locationBasePrices[otherId] !== undefined) {
        basePrice = locationBasePrices[otherId];
    } else {
        // Fallback distance calculation for GZP or custom typed routes
        let distance = 50;
        if (!pickupLoc || !dropoffLoc) {
            distance = 50;
        } else {
            if (pickupId === 'gzp') {
                distance = dropoffLoc.distFromGzp;
            } else if (dropoffId === 'gzp') {
                distance = pickupLoc.distFromGzp;
            } else {
                distance = Math.abs(pickupLoc.distFromAyt - (dropoffLoc ? dropoffLoc.distFromAyt : 0));
            }
        }
        distance = Math.max(distance, 15);
        basePrice = 30 + (distance * 1.3);
    }
    
    // Apply vehicle type rates
    let finalPrice = basePrice;
    if (vehicleId === 'vito_premium') {
        finalPrice = basePrice + 15;
    } else if (vehicleId === 'sprinter') {
        finalPrice = basePrice + 35;
    } else if (vehicleId === 'shuttle') {
        // Shuttle pricing is 30% cheaper than VIP Standard Vito (min 20 €)
        finalPrice = Math.max(20, Math.round((basePrice * 0.7) / 5) * 5);
    }
    
    // Apply Round-Trip 10% discount if active
    if (state.isRoundTrip) {
        finalPrice = (finalPrice * 2) * 0.9;
    }
    
    // Round to nearest 5 Euros for clean pricing
    return Math.round(finalPrice / 5) * 5;
}

/**
 * Calculates custom tour pricing based on selected sights and vehicle type
 * @param {Array<string>} sightIds 
 * @param {string} vehicleId 
 * @returns {Object} total hours and total cost
 */
function calculateTourPricing(sightIds, vehicleId) {
    const vehicle = vehicles[vehicleId];
    if (!vehicle || sightIds.length === 0) {
        return { hours: 0, price: 0 };
    }
    
    let totalSightsDuration = 0;
    let totalMultiplier = 1.0;
    
    sightIds.forEach(id => {
        const sight = sights[id];
        if (sight) {
            totalSightsDuration += sight.duration;
            if (sight.priceMultiplier > totalMultiplier) {
                totalMultiplier = sight.priceMultiplier;
            }
        }
    });
    
    // Add transit buffers
    let travelBuffer = Math.min(sightIds.length * 1, 3);
    let totalHours = totalSightsDuration + travelBuffer;
    
    // Private chauffeur price: €35/hour * hours * vehicle multiplier * route multiplier
    let baseTourCost = (totalHours * 35) * vehicle.multiplier * totalMultiplier;
    
    // Minimum tour cost of €150 for private vehicle allocation
    let finalTourCost = Math.max(baseTourCost, 150);
    
    return {
        hours: Math.round(totalHours),
        price: Math.round(finalTourCost / 5) * 5
    };
}

// --- Autocomplete Engine Logic ---

function initAutocomplete() {
    const autocompleteConfigs = [
        {
            searchId: 'booking-pickup-search',
            hiddenId: 'booking-pickup',
            suggestionsId: 'pickup-suggestions',
            defaultValue: 'ayt'
        },
        {
            searchId: 'booking-dropoff-search',
            hiddenId: 'booking-dropoff',
            suggestionsId: 'dropoff-suggestions',
            defaultValue: 'belek'
        }
    ];

    autocompleteConfigs.forEach(({ searchId, hiddenId, suggestionsId, defaultValue }) => {
        const searchInput = document.getElementById(searchId);
        const hiddenInput = document.getElementById(hiddenId);
        const suggestionsBox = document.getElementById(suggestionsId);

        if (!searchInput || !hiddenInput || !suggestionsBox) return;

        // Set Default inputs
        const defaultLoc = locations[defaultValue];
        if (defaultLoc) {
            searchInput.value = defaultLoc[state.currentLang];
            hiddenInput.value = defaultValue;
        }

        // Show all grouped items on focus
        searchInput.addEventListener('focus', () => {
            showGroupedSuggestions('', suggestionsBox, hiddenInput, searchInput);
            searchInput.select();
        });

        // Filter items on type
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            showGroupedSuggestions(query, suggestionsBox, hiddenInput, searchInput);
            
            let foundMatch = null;
            Object.entries(locations).forEach(([id, loc]) => {
                if (loc.tr.toLowerCase() === query.toLowerCase() || loc.en.toLowerCase() === query.toLowerCase()) {
                    foundMatch = id;
                }
            });

            if (foundMatch) {
                hiddenInput.value = foundMatch;
            } else {
                hiddenInput.value = query ? 'custom_' + query : '';
            }

            // Sync state value
            if (hiddenInput.id === 'booking-pickup') {
                state.pickup = hiddenInput.value;
            } else {
                state.dropoff = hiddenInput.value;
            }

            // Render dynamic pricing updates
            renderFleetCards();
            updateWhatsAppWidgetLink();
        });

        // Close on outer click
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
                suggestionsBox.classList.remove('active');
            }
        });
    });
}

function showGroupedSuggestions(query, box, hiddenInput, searchInput) {
    box.innerHTML = '';
    const lang = state.currentLang;
    const normalizedQuery = normalizeStr(query.trim());

    // Defined groups
    const groups = {
        airport: { tr: 'Havalimanları', en: 'Airports', items: [] },
        center: { tr: 'Antalya Merkez', en: 'Antalya City Center', items: [] },
        belek: { tr: 'Belek', en: 'Belek', items: [] },
        side: { tr: 'Side', en: 'Side', items: [] },
        manavgat: { tr: 'Manavgat', en: 'Manavgat', items: [] },
        alanya: { tr: 'Alanya', en: 'Alanya', items: [] },
        kemer: { tr: 'Kemer', en: 'Kemer', items: [] },
        adrasan: { tr: 'Adrasan & Batı Bölgesi', en: 'Adrasan & West Region', items: [] }
    };

    // Filter and map locations into groups
    Object.entries(locations).forEach(([id, loc]) => {
        const trName = loc.tr;
        const enName = loc.en;
        const groupNameTr = groups[loc.region || 'center']?.tr || '';
        const groupNameEn = groups[loc.region || 'center']?.en || '';

        const matches = !query || 
            normalizeStr(trName).includes(normalizedQuery) || 
            normalizeStr(enName).includes(normalizedQuery) ||
            normalizeStr(groupNameTr).includes(normalizedQuery) ||
            normalizeStr(groupNameEn).includes(normalizedQuery);

        if (matches) {
            const key = loc.type === 'airport' ? 'airport' : loc.region;
            if (groups[key]) {
                groups[key].items.push({ id, ...loc });
            }
        }
    });

    // Render HTML Nodes
    let totalFound = 0;
    Object.entries(groups).forEach(([key, group]) => {
        if (group.items.length === 0) return;

        const header = document.createElement('div');
        header.className = 'suggestion-group-header';
        header.innerText = group[lang];
        box.appendChild(header);

        group.items.forEach(item => {
            totalFound++;
            const itemDiv = document.createElement('div');
            itemDiv.className = 'suggestion-item';
            itemDiv.innerHTML = `
                <i class="fas ${item.type === 'airport' ? 'fa-plane' : 'fa-map-marker-alt'}"></i>
                <div class="suggestion-item-text">
                    <span class="suggestion-name">${item[lang]}</span>
                </div>
            `;

            itemDiv.addEventListener('click', () => {
                searchInput.value = item[lang];
                hiddenInput.value = item.id;
                box.classList.remove('active');

                // Sync state value
                if (hiddenInput.id === 'booking-pickup') {
                    state.pickup = item.id;
                } else {
                    state.dropoff = item.id;
                }

                // Render dynamic pricing updates
                renderFleetCards();
                updateTourCartUI();
                updateWhatsAppWidgetLink();
            });

            box.appendChild(itemDiv);
        });
    });

    if (query.trim().length > 0) {
        // Add a "Custom Location" button at the bottom of the list
        const customDiv = document.createElement('div');
        customDiv.className = 'suggestion-item custom-suggestion-item';
        customDiv.style.cssText = 'background: rgba(197, 168, 128, 0.08); border-top: 1px dashed rgba(197, 168, 128, 0.35); cursor: pointer; padding: 0.6rem 0.8rem; display: flex; align-items: center; gap: 0.5rem; transition: background 0.2s;';
        customDiv.innerHTML = `
            <i class="fas fa-plus-circle" style="color: var(--accent-gold); font-size: 1rem;"></i>
            <div class="suggestion-item-text">
                <span class="suggestion-name" style="font-weight: 700; color: var(--accent-gold); font-size: 0.82rem;">
                    ${lang === 'tr' ? 'Yazdığımı Özel Konum Olarak Kullan' : 'Use My Typed Custom Location'}: "${query.trim()}"
                </span>
            </div>
        `;
        customDiv.onmouseenter = function() { customDiv.style.background = 'rgba(197, 168, 128, 0.18)'; };
        customDiv.onmouseleave = function() { customDiv.style.background = 'rgba(197, 168, 128, 0.08)'; };
        customDiv.addEventListener('click', () => {
            searchInput.value = query.trim();
            hiddenInput.value = 'custom_' + query.trim();
            box.classList.remove('active');

            if (hiddenInput.id === 'booking-pickup') {
                state.pickup = hiddenInput.value;
            } else {
                state.dropoff = hiddenInput.value;
            }

            renderFleetCards();
            updateTourCartUI();
            updateWhatsAppWidgetLink();
        });
        box.appendChild(customDiv);
    }

    if (totalFound > 0 || query.trim().length > 0) {
        box.classList.add('active');
    } else {
        const noResults = document.createElement('div');
        noResults.className = 'suggestion-empty';
        noResults.innerText = lang === 'tr' ? 'Lokasyon bulunamadı.' : 'No locations found.';
        box.appendChild(noResults);
        box.classList.add('active');
    }
}


// --- DOM Rendering and State Sync ---

// Translate the page content dynamically
function applyTranslations() {
    const lang = state.currentLang;
    const dict = translations[lang];
    
    // 1. Core text nodes with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (dict[key]) {
            el.innerHTML = dict[key];
        }
    });
    
    // 2. Form placeholder attributes
    document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
        const key = el.getAttribute('data-translate-placeholder');
        if (dict[key]) {
            el.setAttribute('placeholder', dict[key]);
        }
    });
    
    // Re-sync Autocomplete Input Texts to current language
    const pickupSearch = document.getElementById('booking-pickup-search');
    const dropoffSearch = document.getElementById('booking-dropoff-search');
    
    if (pickupSearch && state.pickup) {
        if (state.pickup.startsWith('custom_')) {
            pickupSearch.value = state.pickup.replace('custom_', '');
        } else if (locations[state.pickup]) {
            pickupSearch.value = locations[state.pickup][lang];
        }
    }
    if (dropoffSearch && state.dropoff) {
        if (state.dropoff.startsWith('custom_')) {
            dropoffSearch.value = state.dropoff.replace('custom_', '');
        } else if (locations[state.dropoff]) {
            dropoffSearch.value = locations[state.dropoff][lang];
        }
    }
    
    // Re-render components that are dynamic
    renderFleetCards();
    renderSightCards();
    updateTourCartUI();
    renderRegionsList();

    // 3. Dynamic SEO Meta Updates
    const seo = seoMetaData[lang] || seoMetaData.en;
    document.title = seo.title;
    const metaDesc = document.getElementById('seo-meta-desc');
    if (metaDesc) {
        metaDesc.setAttribute('content', seo.desc);
    }

    // 4. Update hotel price tags dynamically to selected currency
    document.querySelectorAll('.hotel-price-tag').forEach(el => {
        const basePrice = parseInt(el.getAttribute('data-base-price'));
        if (!isNaN(basePrice)) {
            el.innerText = formatPrice(basePrice);
        }
    });

    // 5. Update FAQPage Schema dynamic structured data
    updateFaqSchema();

    // 6. Update dynamic conversion policy promo alert
    updatePromoBanner();

    // 7. Render dynamic testimonials based on language selection
    renderTestimonials();

    // 8. Update floating WhatsApp link synced with widget values
    updateWhatsAppWidgetLink();

    // 9. Update live currency rates display
    updateLiveRatesDisplay();

    // 10. Update active vehicle badge in hero slider if exists
    const heroBadge = document.querySelector('.hero-vehicle-badge');
    if (heroBadge) {
        const activeIdx = heroBadge.getAttribute('data-active-index');
        if (activeIdx !== null && dict) {
            const labelKey = 'vehicle_label_' + activeIdx;
            heroBadge.textContent = dict[labelKey] || '';
        }
    }
}

// Render VIP Fleet Cards
function renderFleetCards() {
    const fleetGrid = document.getElementById('fleet-grid');
    if (!fleetGrid) return;
    
    fleetGrid.innerHTML = '';
    const lang = state.currentLang;
    const dict = translations[lang];
    
    Object.entries(vehicles).forEach(([id, vehicle]) => {
        // Calculate fare based on widget state
        const calculatedPrice = calculateTransferFare(state.pickup, state.dropoff, id);
        
        const card = document.createElement('div');
        card.className = 'fleet-card';
        
        const amenitiesHTML = vehicle.amenities[lang].map(item => `
            <div class="fleet-feature-item">
                <i class="fas fa-check-circle"></i>
                <span>${item}</span>
            </div>
        `).join('');
        
        const isPremium = id === 'vito_premium';
        let badgeHTML = '';
        if (id === 'vito_premium') {
            badgeHTML = `<span class="badge badge-premium"><i class="fas fa-crown"></i> PREMIUM</span>`;
        } else if (id === 'vito') {
            badgeHTML = `<span class="badge">VIP Vito</span>`;
        } else if (id === 'shuttle') {
            badgeHTML = `<span class="badge badge-shuttle"><i class="fas fa-bus"></i> SHUTTLE</span>`;
        } else {
            badgeHTML = `<span class="badge">VIP Sprinter</span>`;
        }

        card.innerHTML = `
            <div class="fleet-img-wrap" style="${isPremium ? 'background:#0a0a0a;' : ''}">
                <img src="${vehicle.image}" alt="${vehicle.name}" loading="lazy">
                ${isPremium ? '<div class="fleet-premium-glow"></div>' : ''}
            </div>
            <div class="fleet-info">
                <div class="fleet-header">
                    <h3 class="fleet-title">${vehicle.name}</h3>
                    ${badgeHTML}
                </div>
                <div class="fleet-specs">
                    <div class="fleet-spec-item">
                        <i class="fas fa-user-friends"></i>
                        <span>${vehicle.capacity} ${dict.fleet_capacity}</span>
                    </div>
                </div>
                <div class="fleet-features-list">
                    ${amenitiesHTML}
                </div>
                <div class="fleet-footer" style="display:flex; flex-direction:column; gap:0.8rem; align-items:stretch;">
                    <button type="button" class="btn ${isPremium ? 'btn-premium' : 'btn-primary'}" onclick="openBookingModal('transfer', '${id}')" style="width:100%; padding:0.75rem 1.2rem; font-weight:700; font-size:0.9rem; text-transform:uppercase;">${dict.fleet_book_btn}</button>
                    <button type="button" class="btn btn-outline-gallery" onclick="openVehicleGallery('${id}')" style="width:100%; border:1px solid rgba(255,255,255,0.15); color:#ffffff; background:rgba(255,255,255,0.04); padding:0.55rem; font-size:0.78rem; border-radius:8px; cursor:pointer; font-weight:600; display:flex; align-items:center; justify-content:center; gap:0.35rem; transition:all 0.2s;">
                        <i class="fas fa-images"></i> ${lang === 'tr' ? 'Araç Kabinini İncele (Galeri)' : 'Explore Cabin (Gallery)'}
                    </button>
                </div>
            </div>
        `;
        
        fleetGrid.appendChild(card);
    });
}

// Global route auto-selector from cards/links
window.selectRouteInWidget = function(pickupId, dropoffId) {
    const pickupInput = document.getElementById('booking-pickup');
    const dropoffInput = document.getElementById('booking-dropoff');
    const pickupSearch = document.getElementById('booking-pickup-search');
    const dropoffSearch = document.getElementById('booking-dropoff-search');
    
    if (pickupInput && dropoffInput) {
        const pLoc = locations[pickupId];
        const dLoc = locations[dropoffId];
        
        if (pLoc && dLoc) {
            state.pickup = pickupId;
            state.dropoff = dropoffId;
            
            pickupInput.value = pickupId;
            dropoffInput.value = dropoffId;
            
            const lang = state.currentLang;
            if (pickupSearch) pickupSearch.value = pLoc[lang];
            if (dropoffSearch) dropoffSearch.value = dLoc[lang];
            
            // Re-calculate and render fleet grid prices
            renderFleetCards();
            
            // Smooth scroll to fleet grid
            document.getElementById('fleet').scrollIntoView({ behavior: 'smooth' });
        }
    }
};

window.quickSelectHotel = function(hotelName, regionId) {
    const pickupInput = document.getElementById('booking-pickup');
    const dropoffInput = document.getElementById('booking-dropoff');
    const pickupSearch = document.getElementById('booking-pickup-search');
    const dropoffSearch = document.getElementById('booking-dropoff-search');
    
    if (pickupInput && dropoffInput) {
        state.pickup = 'ayt'; // default to airport
        state.dropoff = regionId;
        
        pickupInput.value = 'ayt';
        dropoffInput.value = regionId;
        
        const lang = state.currentLang;
        if (pickupSearch) pickupSearch.value = locations['ayt'] ? locations['ayt'][lang] : 'Antalya Airport (AYT)';
        if (dropoffSearch) dropoffSearch.value = hotelName;
        
        // Auto select tab to transfer just in case
        setBookingType('transfer');
        
        // Re-calculate and render fleet grid prices
        renderFleetCards();
        updateWhatsAppWidgetLink();
        
        // Smooth scroll to fleet grid
        document.getElementById('fleet').scrollIntoView({ behavior: 'smooth' });
    }
};

// Render Sights / Attractions
function renderSightCards() {
    const sightsGrid = document.getElementById('sights-grid');
    if (!sightsGrid) return;
    
    sightsGrid.innerHTML = '';
    const lang = state.currentLang;
    const dict = translations[lang];
    
    // Mapping of sightseeing spots to closest booking dropoff key
    const locationMapping = {
        kaleici: 'kaleici',
        aspendos: 'serik',
        duden: 'lara',
        phaselis: 'tekirova',
        saklikent: 'kumluca',
        perge: 'aksu',
        goynuk: 'goynuk',
        alanya_castle: 'avsallar'
    };
    
    Object.entries(sights).forEach(([id, sight]) => {
        const card = document.createElement('div');
        card.className = 'sight-card';
        const targetDropoff = locationMapping[id] || 'belek';
        
        card.innerHTML = `
            <div class="sight-img-wrap">
                <img src="${sight.img}" alt="${sight.names[lang]}" loading="lazy">
            </div>
            <div class="sight-info" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
                <div>
                    <h3 class="sight-title">${sight.names[lang]}</h3>
                    <p class="sight-desc" style="margin-bottom: 1.2rem;">${sight.descriptions[lang]}</p>
                </div>
                <div class="sight-actions" style="display: flex; gap: 0.8rem; margin-top: auto;">
                    <button class="btn btn-secondary" onclick="openSightDetails('${id}')" style="flex: 1; padding: 0.5rem 0.6rem; font-size: 0.8rem;">${dict.tour_btn_discover}</button>
                    <button class="btn btn-primary" onclick="selectRouteInWidget('ayt', '${targetDropoff}')" style="flex: 1.2; padding: 0.5rem 0.6rem; font-size: 0.8rem; border-radius: 6px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem;">
                        <i class="fas fa-taxi"></i>
                        <span>${dict.tour_btn_book}</span>
                    </button>
                </div>
            </div>
        `;
        
        sightsGrid.appendChild(card);
    });
}

// Render the Interactive Regions List in Coverage Section
function renderRegionsList() {
    const regionsGrid = document.getElementById('regions-grid');
    if (!regionsGrid) return;

    regionsGrid.innerHTML = '';
    const lang = state.currentLang;

    // Define regions and group titles
    const regionsMap = {
        center: { tr: 'Antalya Merkez', en: 'Antalya Center' },
        belek: { tr: 'Belek', en: 'Belek' },
        side: { tr: 'Side', en: 'Side' },
        manavgat: { tr: 'Manavgat', en: 'Manavgat' },
        alanya: { tr: 'Alanya', en: 'Alanya' },
        kemer: { tr: 'Kemer', en: 'Kemer' },
        adrasan: { tr: 'Adrasan & Batı Akdeniz', en: 'Adrasan & West Med' }
    };

    Object.entries(regionsMap).forEach(([regId, titles]) => {
        // Collect sub items with distance and duration metadata
        const subItemsHTML = Object.entries(locations)
            .filter(([locId, loc]) => loc.region === regId)
            .map(([locId, loc]) => {
                const dist = loc.distFromAyt;
                const duration = Math.round(dist * 1.1) + 15;
                const label = lang === 'tr' ? `${dist} Km | ~${duration} Dk` : `${dist} Km | ~${duration} Min`;
                return `
                    <span class="region-sub-badge" 
                          style="display: inline-flex; flex-direction: column; align-items: flex-start; gap: 0.15rem; padding: 0.5rem 0.8rem; cursor: pointer; transition: var(--transition-smooth);" 
                          onclick="selectRouteInWidget('ayt', '${locId}')">
                        <span style="font-weight: 600;">${loc[lang]}</span>
                        <span style="font-size: 0.72rem; color: var(--accent-gold-hover); font-weight: 700;">
                            <i class="fas fa-route" style="font-size: 0.68rem; margin-right: 0.1rem;"></i> ${label}
                        </span>
                    </span>
                `;
            }).join('');

        if (subItemsHTML === '') return;

        const regCard = document.createElement('div');
        regCard.className = 'region-card';

        regCard.innerHTML = `
            <h3 class="region-card-title"><i class="fas fa-map-marked-alt"></i> ${titles[lang]}</h3>
            <div class="region-sub-list">
                ${subItemsHTML}
            </div>
        `;
        regionsGrid.appendChild(regCard);
    });
}

// Add/Remove sights from custom tour
function toggleSightInTour(sightId) {
    const index = state.selectedSights.indexOf(sightId);
    if (index === -1) {
        state.selectedSights.push(sightId);
    } else {
        state.selectedSights.splice(index, 1);
    }
    
    renderSightCards();
    updateTourCartUI();
}

// Update the Custom Tour Builder Sidebar UI
function updateTourCartUI() {
    const cartEmpty = document.getElementById('tour-cart-empty');
    const cartList = document.getElementById('tour-cart-list');
    const cartSummary = document.getElementById('tour-summary-details');
    const bookBtn = document.getElementById('tour-book-btn');
    
    if (!cartList || !cartEmpty || !cartSummary || !bookBtn) return;
    
    const lang = state.currentLang;
    const dict = translations[lang];
    
    if (state.selectedSights.length === 0) {
        cartEmpty.style.display = 'block';
        cartList.style.display = 'none';
        cartSummary.style.display = 'none';
        bookBtn.style.display = 'none';
        return;
    }
    
    cartEmpty.style.display = 'none';
    cartList.style.display = 'block';
    cartSummary.style.display = 'block';
    bookBtn.style.display = 'inline-flex';
    
    // Render list
    cartList.innerHTML = '';
    state.selectedSights.forEach(id => {
        const sight = sights[id];
        const item = document.createElement('li');
        item.className = 'tour-cart-item';
        item.innerHTML = `
            <span class="tour-cart-item-name">${sight.names[lang]}</span>
            <button class="tour-cart-item-remove" onclick="toggleSightInTour('${id}')"><i class="fas fa-trash"></i></button>
        `;
        cartList.appendChild(item);
    });
    
    // Calculate pricing
    const tourCost = calculateTourPricing(state.selectedSights, state.vehicleType);
    const selectedVehicleName = vehicles[state.vehicleType].name;
    
    cartSummary.innerHTML = `
        <div class="summary-row">
            <span class="summary-label">${dict.sidebar_duration}:</span>
            <span class="summary-val">${tourCost.hours} ${lang === 'tr' ? 'Saat' : 'Hours'}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">${dict.sidebar_vehicle}:</span>
            <span class="summary-val">${selectedVehicleName}</span>
        </div>
        <div class="summary-row summary-total">
            <span class="summary-label">${dict.sidebar_price}:</span>
            <span class="summary-val">${formatPrice(tourCost.price)}</span>
        </div>
    `;
}

// --- Modals Management ---

// Open detailed info for sightseeing spot
function openSightDetails(sightId) {
    const sight = sights[sightId];
    if (!sight) return;
    
    const lang = state.currentLang;
    
    const modal = document.getElementById('details-modal');
    const modalTitle = document.getElementById('details-modal-title');
    const modalBody = document.getElementById('details-modal-body');
    
    if (!modal || !modalTitle || !modalBody) return;
    
    modalTitle.innerHTML = sight.names[lang];
    modalBody.innerHTML = `
        <div class="detail-modal-img">
            <img src="${sight.img}" alt="${sight.names[lang]}">
        </div>
        <p class="detail-modal-desc">${sight.descriptions[lang]}</p>
        <div class="detail-modal-meta">
            <div class="meta-item">
                <div class="meta-item-label">${lang === 'tr' ? 'Önerilen Süre' : 'Recommended Stay'}</div>
                <div class="meta-item-val">${sight.duration} ${lang === 'tr' ? 'Saat' : 'Hours'}</div>
            </div>
            <div class="meta-item">
                <div class="meta-item-label">${lang === 'tr' ? 'Bölge Zorluk Katsayısı' : 'Distance Factor'}</div>
                <div class="meta-item-val">x${sight.priceMultiplier.toFixed(1)}</div>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

// Update Selected Trip Details Summary in Booking Modal
function updateModalTripSummary() {
    const summaryEl = document.getElementById('modal-trip-summary');
    if (!summaryEl) return;
    
    const lang = state.currentLang;
    const isTr = lang === 'tr';
    
    const modalPickup = document.getElementById('modal-pickup');
    const modalDropoff = document.getElementById('modal-dropoff');
    
    const pickupName = modalPickup && modalPickup.value.trim() ? modalPickup.value.trim() : (state.pickup.startsWith('custom_') ? state.pickup.replace('custom_', '') : (locations[state.pickup] ? locations[state.pickup][lang] : state.pickup));
    const dropoffName = modalDropoff && modalDropoff.value.trim() ? modalDropoff.value.trim() : (state.dropoff.startsWith('custom_') ? state.dropoff.replace('custom_', '') : (locations[state.dropoff] ? locations[state.dropoff][lang] : state.dropoff));
    
    const vehicle = vehicles[state.vehicleType];
    const vehicleName = vehicle ? vehicle.name : state.vehicleType;
    
    let dateText = `${state.date} ${state.time}`;
    if (state.bookingType === 'transfer' && state.isRoundTrip) {
        dateText += isTr ? ` (Dönüş: ${state.returnDate} ${state.returnTime})` : ` (Return: ${state.returnDate} ${state.returnTime})`;
    } else if (state.bookingType === 'hourly') {
        dateText += ` (${state.hourlyDuration} ${isTr ? 'Saat' : 'Hours'})`;
    }
    
    const routeLabel = state.bookingType === 'hourly' 
        ? (isTr ? `Şoförlü VIP Tahsis` : `Hourly VIP Chauffeur`)
        : `${pickupName} ➔ ${dropoffName}`;
        
    summaryEl.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem; font-family: var(--font-body); color: #1a1a1a;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-map-marker-alt" style="color: var(--accent-gold-hover); width: 14px;"></i>
                <span style="font-weight: 700; color: #1a1a1a;">${routeLabel}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-calendar-alt" style="color: var(--accent-gold-hover); width: 14px;"></i>
                <span style="color: #4a4a4a; font-weight: 500;">${dateText}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.4rem; padding-top: 0.4rem; border-top: 1px dashed rgba(197, 168, 128, 0.35);">
                <span style="color: #555; font-weight: 600;"><i class="fas fa-car" style="margin-right: 0.3rem; color: var(--accent-gold-hover);"></i> ${vehicleName}</span>
                <span style="color: #555; font-weight: 600;"><i class="fas fa-users" style="margin-right: 0.3rem; color: var(--accent-gold-hover);"></i> ${state.passengers} ${isTr ? 'Yolcu' : 'Pax'}</span>
            </div>
        </div>
    `;
}

// Open booking details modal
function openBookingModal(type, vehicleId) {
    state.bookingType = type;
    if (vehicleId) {
        state.vehicleType = vehicleId;
    }
    
    const modal = document.getElementById('booking-modal');
    if (modal) {
        // Pre-populate Pickup & Dropoff fields
        const modalPickup = document.getElementById('modal-pickup');
        const modalDropoff = document.getElementById('modal-dropoff');
        if (modalPickup && modalDropoff) {
            const lang = state.currentLang;
            const pLoc = locations[state.pickup];
            const dLoc = locations[state.dropoff];
            modalPickup.value = pLoc ? pLoc[lang] : (state.pickup || '');
            modalDropoff.value = dLoc ? dLoc[lang] : (state.dropoff || '');
        }

        // Reset modal fields
        const babySeatsEl = document.getElementById('modal-baby-seats');
        if (babySeatsEl) babySeatsEl.value = '0';
        
        const childCountEl = document.getElementById('modal-child-count');
        if (childCountEl) childCountEl.value = '0';
        
        const welcomeTypeEl = document.getElementById('modal-welcome-type');
        if (welcomeTypeEl) welcomeTypeEl.value = 'standard';
        
        const sportLuggageEl = document.getElementById('modal-sport-luggage');
        if (sportLuggageEl) sportLuggageEl.value = 'none';
        
        const extraChampagne = document.getElementById('extra-champagne');
        if (extraChampagne) extraChampagne.checked = false;
        
        const extraBeer = document.getElementById('extra-beer');
        if (extraBeer) extraBeer.checked = false;
        
        const drinkCheckboxes = ['drink-coke', 'drink-fanta', 'drink-sprite', 'drink-icetea'];
        drinkCheckboxes.forEach(id => {
            const cb = document.getElementById(id);
            if (cb) {
                cb.checked = false;
                const qtySelect = document.getElementById(id + '-qty');
                if (qtySelect) {
                    qtySelect.style.display = 'none';
                    qtySelect.value = '1';
                }
            }
        });
        
        updateModalTotalPrice();
        updateModalTripSummary();
        
        modal.classList.add('active');
        document.getElementById('modal-name').focus();
    }
}

// Calculate and update modal total price dynamically
function updateModalTotalPrice() {
    let basePrice = 0;
    
    if (state.bookingType === 'transfer') {
        basePrice = calculateTransferFare(state.pickup, state.dropoff, state.vehicleType);
    } else {
        const tourCost = calculateTourPricing(state.selectedSights, state.vehicleType);
        basePrice = tourCost.price;
    }
    
    // Calculate welcome services cost
    let welcomeCost = 0;
    const welcomeType = document.getElementById('modal-welcome-type')?.value;
    if (welcomeType === 'vip') {
        welcomeCost += 10;
    }
    
    // Calculate sport luggage cost
    let luggageCost = 0;
    const sportLuggage = document.getElementById('modal-sport-luggage')?.value;
    if (sportLuggage === 'golf' || sportLuggage === 'bike') {
        luggageCost += 5;
    }
    
    // Calculate drinks cost
    let drinksCost = 0;
    const drinkItems = [
        { cb: 'drink-coke', qty: 'drink-coke-qty' },
        { cb: 'drink-fanta', qty: 'drink-fanta-qty' },
        { cb: 'drink-sprite', qty: 'drink-sprite-qty' },
        { cb: 'drink-icetea', qty: 'drink-icetea-qty' }
    ];
    
    drinkItems.forEach(item => {
        const checkbox = document.getElementById(item.cb);
        const qtySelect = document.getElementById(item.qty);
        if (checkbox && checkbox.checked && qtySelect) {
            drinksCost += parseInt(qtySelect.value, 10) * 4;
        }
    });
    
    // Calculate luxury extras cost (Beer)
    let extrasCost = 0;
    const beerCb = document.getElementById('extra-beer');
    if (beerCb && beerCb.checked) {
        extrasCost += 6;
    }
    
    const totalPriceEur = basePrice + welcomeCost + luggageCost + drinksCost + extrasCost;
    const priceValEl = document.getElementById('modal-total-price-val');
    if (priceValEl) {
        priceValEl.innerText = formatPrice(totalPriceEur);
    }
    return totalPriceEur;
}

// Close all active modals
function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// --- Booking Submission & WhatsApp Deep-link Generator ---

function handleBookingSubmit(e) {
    e.preventDefault();
    
    const lang = state.currentLang;
    const dict = translations[lang];
    
    // Form elements
    const name = document.getElementById('modal-name').value.trim();
    const phone = document.getElementById('modal-phone').value.trim();
    const email = document.getElementById('modal-email').value.trim();
    const flight = document.getElementById('modal-flight').value.trim();
    const notes = document.getElementById('modal-notes').value.trim();
    
    if (!name || !phone || !email) {
        alert(lang === 'tr' ? 'Lütfen tüm zorunlu alanları doldurun.' : 'Please fill in all required fields.');
        return;
    }
    
    // Save contact to state
    state.contactName = name;
    state.contactPhone = phone;
    state.contactEmail = email;
    state.flightNo = flight;
    state.notes = notes;
    
    // Retrieve additional options
    const babySeatsVal = parseInt(document.getElementById('modal-baby-seats')?.value || '0', 10);
    const childCountVal = parseInt(document.getElementById('modal-child-count')?.value || '0', 10);
    
    // Retrieve trip preferences
    const prefTalk = document.getElementById('modal-pref-talk')?.value || 'Standard';
    const prefMusic = document.getElementById('modal-pref-music')?.value || 'Standard';
    const prefTemp = document.getElementById('modal-pref-temp')?.value || 'Standard';
    const prefDrive = document.getElementById('modal-pref-drive')?.value || 'Standard';
    
    let selectedDrinks = [];
    let drinksTotalCost = 0;
    const drinkItemsList = [
        { cb: 'drink-coke', label: 'Coca Cola', qty: 'drink-coke-qty' },
        { cb: 'drink-fanta', label: 'Fanta', qty: 'drink-fanta-qty' },
        { cb: 'drink-sprite', label: 'Sprite', qty: 'drink-sprite-qty' },
        { cb: 'drink-icetea', label: 'Ice Tea', qty: 'drink-icetea-qty' }
    ];
    
    drinkItemsList.forEach(item => {
        const cb = document.getElementById(item.cb);
        const qtyEl = document.getElementById(item.qty);
        if (cb && cb.checked && qtyEl) {
            const count = parseInt(qtyEl.value, 10);
            selectedDrinks.push(`${count}x ${item.label}`);
            drinksTotalCost += count * 4;
        }
    });
    
    // Gather details
    let serviceType = '';
    let route = '';
    let totalFare = 0;
    
    const finalPickupVal = document.getElementById('modal-pickup')?.value.trim() || '';
    const finalDropoffVal = document.getElementById('modal-dropoff')?.value.trim() || '';
    
    const vehicle = vehicles[state.vehicleType];
    
    if (state.bookingType === 'transfer') {
        serviceType = state.isRoundTrip ? (lang === 'tr' ? 'Gidiş-Dönüş VIP Transfer' : 'Round-Trip VIP Transfer') : dict.success_type_transfer;
        const pickupName = finalPickupVal || (state.pickup.startsWith('custom_') ? state.pickup.replace('custom_', '') : (locations[state.pickup] ? locations[state.pickup][lang] : state.pickup));
        const dropoffName = finalDropoffVal || (state.dropoff.startsWith('custom_') ? state.dropoff.replace('custom_', '') : (locations[state.dropoff] ? locations[state.dropoff][lang] : state.dropoff));
        route = `${pickupName} ➔ ${dropoffName}`;
        totalFare = calculateTransferFare(state.pickup, state.dropoff, state.vehicleType);
    } else if (state.bookingType === 'hourly') {
        serviceType = lang === 'tr' ? 'Saatlik VIP Şoför Kiralama' : 'VIP Chauffeur Hourly Booking';
        const pickupName = finalPickupVal || (state.pickup.startsWith('custom_') ? state.pickup.replace('custom_', '') : (locations[state.pickup] ? locations[state.pickup][lang] : state.pickup));
        route = `${pickupName} (${state.hourlyDuration} Saat / Hours)`;
        totalFare = calculateTransferFare(state.pickup, state.dropoff, state.vehicleType);
    } else {
        serviceType = dict.success_type_tour;
        const sightNames = state.selectedSights.map(id => sights[id].names[lang]);
        route = sightNames.join(', ');
        const tourCost = calculateTourPricing(state.selectedSights, state.vehicleType);
        totalFare = tourCost.price;
    }
    
    // Retrieve additional options
    const welcomeTypeVal = document.getElementById('modal-welcome-type')?.value || 'standard';
    const welcomeCost = welcomeTypeVal === 'vip' ? 10 : 0;
    
    const sportLuggageVal = document.getElementById('modal-sport-luggage')?.value || 'none';
    const luggageCost = (sportLuggageVal === 'golf' || sportLuggageVal === 'bike') ? 5 : 0;
    
    const beerVal = document.getElementById('extra-beer')?.checked || false;
    const extrasCost = beerVal ? 6 : 0;
    
    const finalFare = totalFare + welcomeCost + luggageCost + drinksTotalCost + extrasCost;
    
    // Retrieve Landing Terminal value
    const terminalEl = document.getElementById('modal-terminal');
    const terminalVal = terminalEl ? terminalEl.value : 'none';
    
    // Date displays based on mode
    let dateTimeText = `${state.date} ${state.time}`;
    if (state.bookingType === 'transfer' && state.isRoundTrip) {
        dateTimeText = `${state.date} ${state.time} / (Dönüş: ${state.returnDate} ${state.returnTime})`;
    } else if (state.bookingType === 'hourly') {
        dateTimeText = `${state.date} ${state.time} (${state.hourlyDuration} Saat / Hours)`;
    }

    // Populate Success Screen
    document.getElementById('success-service').innerText = serviceType;
    document.getElementById('success-route').innerText = route;
    document.getElementById('success-datetime').innerText = dateTimeText;
    document.getElementById('success-pax').innerText = `${state.passengers} ${lang === 'tr' ? 'Kişi' : 'Pax'}`;
    document.getElementById('success-vehicle').innerText = vehicle.name;
    document.getElementById('success-price').innerText = formatPrice(finalFare);
    
    // Switch modals
    closeModals();
    document.getElementById('success-modal').classList.add('active');
    
    // Generate WhatsApp deep-link message
    const whatsappNo = '+905442595196'; // Target reservation number

    // ── BOOKING CODE ─────────────────────────────────────────────────────────
    // Format: MVT-YYMMDD-XXXX  (e.g.  MVT-260709-A3F7)
    const now = new Date();
    const yy  = String(now.getFullYear()).slice(2);
    const mm  = String(now.getMonth() + 1).padStart(2, '0');
    const dd  = String(now.getDate()).padStart(2, '0');
    const rnd = Math.random().toString(36).toUpperCase().substring(2, 6);
    const bookingCode = `MVT-${yy}${mm}${dd}-${rnd}`;

    // Show code in success modal
    const codeEl = document.getElementById('success-booking-code');
    if (codeEl) codeEl.textContent = bookingCode;
    // ─────────────────────────────────────────────────────────────────────────

    let waMessage = '';
    
    let priceText = `€${finalFare}`;
    if (state.currentCurrency && state.currentCurrency !== 'EUR') {
        priceText += ` (${formatPrice(finalFare)})`;
    }

    let terminalText = '';
    if (terminalVal !== 'none') {
        const termLabels = {
            T1: 'AYT Terminal 1 (Dış Hatlar / International)',
            T2: 'AYT Terminal 2 (Dış Hatlar / International)',
            Domestic: 'AYT İç Hatlar / Domestic Terminal',
            GZP: 'Gazipaşa Terminal (GZP)'
        };
        terminalText = termLabels[terminalVal] || terminalVal;
    }

    let dateDetailStr = `Tarih ve Saat: ${state.date} @ ${state.time}`;
    if (state.bookingType === 'transfer' && state.isRoundTrip) {
        dateDetailStr = `Gidiş Tarihi: ${state.date} @ ${state.time}\nDönüş Tarihi: ${state.returnDate} @ ${state.returnTime} (Gidiş-Dönüşte %10 İndirim Uygulandı!)`;
    } else if (state.bookingType === 'hourly') {
        dateDetailStr = `Başlangıç Tarihi: ${state.date} @ ${state.time} (${state.hourlyDuration} Saat / Hours)`;
    }

    if (lang === 'tr') {
        waMessage = `🏔 MOUNTAIN VIP TRANSFER — YENİ REZERVASYON\n`;
        waMessage += `========================================\n`;
        waMessage += `📋 REZERVASYON KODU: *${bookingCode}*\n`;
        waMessage += `========================================\n`;
        waMessage += `Hizmet: ${serviceType}\n`;
        waMessage += `Güzergah: ${route}\n`;
        waMessage += `${dateDetailStr}\n`;
        waMessage += `Kişi Sayısı: ${state.passengers}\n`;
        if (childCountVal > 0) waMessage += `Çocuk Sayısı: ${childCountVal}\n`;
        if (babySeatsVal > 0) waMessage += `Bebek Koltuğu: ${babySeatsVal} Adet\n`;
        waMessage += `Karşılama: ${welcomeTypeVal === 'vip' ? 'Premium İsimli Karşılama (+€10)' : 'Standart Karşılama (Ücretsiz)'}\n`;
        if (sportLuggageVal !== 'none') {
            const luggageText = sportLuggageVal === 'golf' ? 'Golf Çantası (+€5)' : 'Bisiklet / Puset (+€5)';
            waMessage += `Ekstra Bagaj: ${luggageText}\n`;
        }
        waMessage += `Araç: ${vehicle.name}\n`;
        
        let extrasList = [];
        if (selectedDrinks.length > 0) extrasList.push(...selectedDrinks);
        if (beerVal) extrasList.push('Efes Pilsen Bira (+€6)');
        if (extrasList.length > 0) waMessage += `Araç İçi İkramlar: ${extrasList.join(', ')}\n`;
        
        // Chauffeur Preferences
        waMessage += `Sürücü İletişimi: ${prefTalk}\n`;
        waMessage += `Müzik Tercihi: ${prefMusic}\n`;
        waMessage += `Kabin Sıcaklığı: ${prefTemp}\n`;
        waMessage += `Sürüş Modu: ${prefDrive}\n`;
        
        waMessage += `Fiyat: ${priceText}\n`;
        if (terminalText) waMessage += `İniş Terminali: ${terminalText}\n`;
        waMessage += `----------------------------------------\n`;
        waMessage += `Ad Soyad: ${name}\n`;
        waMessage += `Telefon: ${phone}\n`;
        waMessage += `E-posta: ${email}\n`;
        if (flight) waMessage += `Uçuş No: ${flight}\n`;
        if (notes) waMessage += `Notlar: ${notes}\n`;
        waMessage += `----------------------------------------\n`;
        waMessage += `Rezervasyonumu onaylar mısınız? Teşekkürler.`;
    } else {
        let dateDetailStrEn = `Date & Time: ${state.date} @ ${state.time}`;
        if (state.bookingType === 'transfer' && state.isRoundTrip) {
            dateDetailStrEn = `Departure: ${state.date} @ ${state.time}\nReturn: ${state.returnDate} @ ${state.returnTime} (10% Round-Trip Discount Applied!)`;
        } else if (state.bookingType === 'hourly') {
            dateDetailStrEn = `Start Date: ${state.date} @ ${state.time} (${state.hourlyDuration} Hours Chauffeur)`;
        }

        waMessage = `🏔 MOUNTAIN VIP TRANSFER — NEW BOOKING\n`;
        waMessage += `========================================\n`;
        waMessage += `📋 BOOKING CODE: *${bookingCode}*\n`;
        waMessage += `========================================\n`;
        waMessage += `Service: ${serviceType}\n`;
        waMessage += `Route/Stops: ${route}\n`;
        waMessage += `${dateDetailStrEn}\n`;
        waMessage += `Passengers: ${state.passengers}\n`;
        if (childCountVal > 0) waMessage += `Child Passengers: ${childCountVal}\n`;
        if (babySeatsVal > 0) waMessage += `Baby Seats: ${babySeatsVal}\n`;
        waMessage += `Meet & Greet: ${welcomeTypeVal === 'vip' ? 'Premium Name Sign Welcome (+€10)' : 'Standard Meet & Greet (Free)'}\n`;
        if (sportLuggageVal !== 'none') {
            const luggageText = sportLuggageVal === 'golf' ? 'Golf Bag (+€5)' : 'Bicycle / Stroller (+€5)';
            waMessage += `Extra Luggage: ${luggageText}\n`;
        }
        waMessage += `Vehicle: ${vehicle.name}\n`;
        
        let extrasList = [];
        if (selectedDrinks.length > 0) extrasList.push(...selectedDrinks);
        if (beerVal) extrasList.push('Efes Pilsen Beer (+€6)');
        if (extrasList.length > 0) waMessage += `In-Car Extras: ${extrasList.join(', ')}\n`;
        
        // Chauffeur Preferences
        waMessage += `Chauffeur Talk: ${prefTalk}\n`;
        waMessage += `In-Car Music: ${prefMusic}\n`;
        waMessage += `Cabin Temp: ${prefTemp}\n`;
        waMessage += `Driving Mode: ${prefDrive}\n`;
        
        waMessage += `Price: ${priceText}\n`;
        if (terminalText) waMessage += `Arrival Terminal: ${terminalText}\n`;
        waMessage += `----------------------------------------\n`;
        waMessage += `Name: ${name}\n`;
        waMessage += `Phone: ${phone}\n`;
        waMessage += `Email: ${email}\n`;
        if (flight) waMessage += `Flight No: ${flight}\n`;
        if (notes) waMessage += `Notes: ${notes}\n`;
        waMessage += `----------------------------------------\n`;
        waMessage += `Could you please confirm my booking? Thank you.`;
    }
    
    // Send background notification to owner's WhatsApp via CallMeBot API
    if (typeof sendCallMeBotNotification === 'function') {
        sendCallMeBotNotification(waMessage);
    }
    
    // Redirect to WhatsApp after 2.5 seconds
    setTimeout(() => {
        const encodedMsg = encodeURIComponent(waMessage);
        const waLink = `https://api.whatsapp.com/send?phone=${whatsappNo}&text=${encodedMsg}`;
        window.open(waLink, '_blank');
    }, 2500);
}

// --- Initialize Event Listeners ---

document.addEventListener('DOMContentLoaded', () => {
    // Bind navigation active class scrolling
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        // Sticky Header scroll styling
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Active Nav Indicator
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Dropdown toggle logic setup
    const setupDropdown = (dropdownId, triggerBtnId, onSelectCallback) => {
        const dropdown = document.getElementById(dropdownId);
        const trigger = document.getElementById(triggerBtnId);
        if (!dropdown || !trigger) return;

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (menu.parentNode !== dropdown) {
                    menu.classList.remove('active');
                }
            });
            dropdown.querySelector('.dropdown-menu').classList.toggle('active');
        });

        dropdown.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropdown.querySelector('.dropdown-menu').classList.remove('active');
                onSelectCallback(item);
            });
        });
    };

    // Close menus on outside click
    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.remove('active');
        });
    });

    // Initialize Dropdowns
    setupDropdown('lang-dropdown', 'lang-trigger-btn', (item) => {
        const selectedLang = item.getAttribute('data-lang');
        setLanguage(selectedLang);
    });

    setupDropdown('currency-dropdown', 'currency-trigger-btn', (item) => {
        const selectedCurr = item.getAttribute('data-curr');
        setCurrency(selectedCurr);
    });
    
    // Mobile Nav Toggle Bind
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            state.mobileMenuOpen = !state.mobileMenuOpen;
            if (state.mobileMenuOpen) {
                navMenu.classList.add('active');
                menuToggle.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
        
        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                state.mobileMenuOpen = false;
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
    
    // Booking Form Sync to State
    const bookingForm = document.getElementById('booking-form-widget');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Sync form values to state
            state.pickup = document.getElementById('booking-pickup').value;
            state.dropoff = document.getElementById('booking-dropoff').value;
            state.date = document.getElementById('booking-date').value;
            state.time = document.getElementById('booking-time').value;
            state.passengers = document.getElementById('booking-pax').value;
            state.vehicleType = document.getElementById('booking-vehicle').value;
            
            state.isRoundTrip = document.getElementById('booking-round-trip')?.checked || false;
            state.returnDate = document.getElementById('booking-return-date')?.value || '';
            state.returnTime = document.getElementById('booking-return-time')?.value || '';
            state.hourlyDuration = document.getElementById('booking-hours')?.value || '4';
            
            // Validate dates
            if (!state.date || !state.time) {
                alert(state.currentLang === 'tr' ? 'Lütfen gidiş tarih ve saatini seçin.' : 'Please select pickup date and time.');
                return;
            }
            
            // Validate return dates if round trip is active
            if (state.bookingType === 'transfer' && state.isRoundTrip) {
                if (!state.returnDate || !state.returnTime) {
                    alert(state.currentLang === 'tr' ? 'Lütfen dönüş tarih ve saatini seçin.' : 'Please select return date and time.');
                    return;
                }
                
                // Return date must be after pickup date
                const pDate = new Date(`${state.date}T${state.time}`);
                const rDate = new Date(`${state.returnDate}T${state.returnTime}`);
                if (rDate <= pDate) {
                    alert(state.currentLang === 'tr' ? 'Dönüş tarihi, gidiş tarihinden sonra olmalıdır.' : 'Return date must be after pickup date.');
                    return;
                }
            }
            
            // Scroll to fleet grid to display vehicles with custom calculated pricing
            document.getElementById('fleet').scrollIntoView({ behavior: 'smooth' });
            
            // Refresh fleet cards with specific calculations
            renderFleetCards();
        });
        
        // Live update fleet prices when dropdown changes in widget
        const widgetFields = ['booking-vehicle', 'booking-pax', 'booking-hours', 'booking-round-trip'];
        widgetFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('change', () => {
                    state.vehicleType = document.getElementById('booking-vehicle').value;
                    state.passengers = document.getElementById('booking-pax').value;
                    state.isRoundTrip = document.getElementById('booking-round-trip')?.checked || false;
                    state.hourlyDuration = document.getElementById('booking-hours')?.value || '4';
                    renderFleetCards();
                    updateTourCartUI(); // Sidebar price updates if vehicle changed
                    updateWhatsAppWidgetLink();
                });
            }
        });
    }
    
    // Tour builder submission btn
    const tourBookBtn = document.getElementById('tour-book-btn');
    if (tourBookBtn) {
        tourBookBtn.addEventListener('click', () => {
            // Check dates from widget
            state.date = document.getElementById('booking-date').value;
            state.time = document.getElementById('booking-time').value;
            state.passengers = document.getElementById('booking-pax').value;
            
            if (!state.date || !state.time) {
                alert(state.currentLang === 'tr' ? 'Lütfen rezervasyon panelinden (yukarıda) tarih ve saat bilgilerinizi doldurun.' : 'Please fill in your date and time in the booking form above.');
                document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
                return;
            }
            
            openBookingModal('tour');
        });
    }
    
    // Modal background close clicks
    document.querySelectorAll('.modal-overlay, .modal-close, .btn-close-success').forEach(el => {
        el.addEventListener('click', closeModals);
    });
    
    // Contact Form Submit Modal Trigger
    const submitBookingForm = document.getElementById('booking-detail-form');
    if (submitBookingForm) {
        submitBookingForm.addEventListener('submit', handleBookingSubmit);
    }
    
    // Flatpickr Luxury Date & Time Picker Initialization
    const dateInput = document.getElementById('booking-date');
    const timeInput = document.getElementById('booking-time');
    const returnDateInput = document.getElementById('booking-return-date');
    const returnTimeInput = document.getElementById('booking-return-time');

    // Default calculations
    const todayObj = new Date();
    const todayStr = todayObj.toISOString().split('T')[0];
    
    const futureTimeObj = new Date(todayObj.getTime() + 2 * 60 * 60 * 1000);
    let h = futureTimeObj.getHours();
    let m = futureTimeObj.getMinutes();
    m = Math.round(m / 15) * 15;
    if (m >= 60) {
        m = 0;
        h = (h + 1) % 24;
    }
    const defaultTimeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    
    const threeDaysAfterObj = new Date(todayObj.getTime() + 3 * 24 * 60 * 60 * 1000);
    const returnDateStr = threeDaysAfterObj.toISOString().split('T')[0];

    // Set initial state
    state.date = todayStr;
    state.time = defaultTimeStr;
    state.returnDate = returnDateStr;
    state.returnTime = defaultTimeStr;

    // Flatpickr instances
    let fpDate, fpTime, fpReturnDate, fpReturnTime;
    const fpLocale = state.currentLang === 'tr' ? 'tr' : (state.currentLang === 'de' ? 'de' : (state.currentLang === 'ru' ? 'ru' : 'en'));

    if (dateInput) {
        fpDate = flatpickr(dateInput, {
            locale: fpLocale,
            minDate: "today",
            dateFormat: "Y-m-d",
            defaultDate: todayStr,
            onChange: function(selectedDates, dateStr) {
                state.date = dateStr;
                updateWhatsAppWidgetLink();
            }
        });
    }

    if (timeInput) {
        fpTime = flatpickr(timeInput, {
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
            time_24hr: true,
            defaultDate: defaultTimeStr,
            onChange: function(selectedDates, timeStr) {
                state.time = timeStr;
                updateWhatsAppWidgetLink();
            }
        });
    }

    if (returnDateInput) {
        fpReturnDate = flatpickr(returnDateInput, {
            locale: fpLocale,
            minDate: "today",
            dateFormat: "Y-m-d",
            defaultDate: returnDateStr,
            onChange: function(selectedDates, dateStr) {
                state.returnDate = dateStr;
                updateWhatsAppWidgetLink();
            }
        });
    }

    if (returnTimeInput) {
        fpReturnTime = flatpickr(returnTimeInput, {
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
            time_24hr: true,
            defaultDate: defaultTimeStr,
            onChange: function(selectedDates, timeStr) {
                state.returnTime = timeStr;
                updateWhatsAppWidgetLink();
            }
        });
    }

    // Expose update functions for language switch sync
    window.syncFlatpickrLocale = function(newLang) {
        const langCode = newLang === 'tr' ? 'tr' : (newLang === 'de' ? 'de' : (newLang === 'ru' ? 'ru' : 'en'));
        if (fpDate) fpDate.set('locale', langCode);
        if (fpReturnDate) fpReturnDate.set('locale', langCode);
    };
    
    // FAQ Accordion click triggers
    document.querySelectorAll('.faq-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.closest('.faq-item');
            const isActive = item.classList.contains('active');
            
            // Close other items
            document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
            
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
    
    // Drink checkboxes visibility & price update bindings
    const drinkItems = [
        { cb: 'drink-coke', qty: 'drink-coke-qty' },
        { cb: 'drink-fanta', qty: 'drink-fanta-qty' },
        { cb: 'drink-sprite', qty: 'drink-sprite-qty' },
        { cb: 'drink-icetea', qty: 'drink-icetea-qty' }
    ];
    
    drinkItems.forEach(item => {
        const checkbox = document.getElementById(item.cb);
        const qtySelect = document.getElementById(item.qty);
        
        if (checkbox && qtySelect) {
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    qtySelect.style.display = 'inline-block';
                } else {
                    qtySelect.style.display = 'none';
                    qtySelect.value = '1';
                }
                updateModalTotalPrice();
            });
            
            qtySelect.addEventListener('change', () => {
                updateModalTotalPrice();
            });
        }
    });

    // Baby seat & child count update bindings
    const babySeatsEl = document.getElementById('modal-baby-seats');
    if (babySeatsEl) {
        babySeatsEl.addEventListener('change', updateModalTotalPrice);
    }
    const childCountEl = document.getElementById('modal-child-count');
    if (childCountEl) {
        childCountEl.addEventListener('change', updateModalTotalPrice);
    }
    
    // Meet & greet, sports luggage and extras bindings
    const welcomeTypeEl = document.getElementById('modal-welcome-type');
    if (welcomeTypeEl) {
        welcomeTypeEl.addEventListener('change', updateModalTotalPrice);
    }
    const sportLuggageEl = document.getElementById('modal-sport-luggage');
    if (sportLuggageEl) {
        sportLuggageEl.addEventListener('change', updateModalTotalPrice);
    }

    const beerCb = document.getElementById('extra-beer');
    if (beerCb) {
        beerCb.addEventListener('change', updateModalTotalPrice);
    }
    
    // Dynamic modal pickup/dropoff change listeners
    const modalPickupInput = document.getElementById('modal-pickup');
    if (modalPickupInput) {
        modalPickupInput.addEventListener('input', () => {
            updateModalTripSummary();
            updateModalTotalPrice();
        });
    }
    const modalDropoffInput = document.getElementById('modal-dropoff');
    if (modalDropoffInput) {
        modalDropoffInput.addEventListener('input', () => {
            updateModalTripSummary();
            updateModalTotalPrice();
        });
    }
    
    // Initialize components defensively to prevent errors from blocking execution
    const safeInit = (fnName, fn) => {
        try {
            fn();
        } catch (e) {
            console.error(`Initialization failed for ${fnName}:`, e);
        }
    };

    safeInit('initAutocomplete', initAutocomplete);
    safeInit('setLanguage', () => setLanguage(state.currentLang));
    safeInit('setCurrency', () => setCurrency(state.currentCurrency));
    safeInit('initCookieConsent', initCookieConsent);
    safeInit('initKvkkModal', initKvkkModal);
    safeInit('fetchLiveRates', fetchLiveRates);
    
    try {
        setInterval(fetchLiveRates, 300000);
    } catch (e) {
        console.error("setInterval live rates failed:", e);
    }
    
    safeInit('initScrollReveal', initScrollReveal);
    safeInit('initHeroCarParallax', initHeroCarParallax);
    safeInit('initHeroSlider', initHeroSlider);
    safeInit('initFlightTracker', initFlightTracker);
});

// --- KVKK Consent & Cookie Banner Functionality ---

function openKvkkModal() {
    const modal = document.getElementById('kvkk-modal');
    if (modal) {
        modal.classList.add('active');
    }
}

function initKvkkModal() {
    // Event delegation for dynamic KVKK links in checkboxes
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('kvkk-link')) {
            e.preventDefault();
            openKvkkModal();
        }
    });

    // Close buttons handler
    document.querySelectorAll('.btn-close-kvkk, .modal-close.btn-close-kvkk').forEach(el => {
        el.addEventListener('click', () => {
            const modal = document.getElementById('kvkk-modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });
}

function initCookieConsent() {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const kvkkBtn = document.querySelector('.btn-kvkk-policy');

    if (!banner || !acceptBtn) return;

    // Check if cookies already accepted safely
    let isAccepted = false;
    try {
        isAccepted = localStorage.getItem('cookieAccepted') === 'true';
    } catch (e) {
        console.warn('localStorage is blocked or unavailable.', e);
    }

    if (!isAccepted) {
        setTimeout(() => {
            banner.classList.add('active');
        }, 1200);
    }

    acceptBtn.addEventListener('click', () => {
        try {
            localStorage.setItem('cookieAccepted', 'true');
        } catch (e) {
            console.warn('localStorage writing is blocked.', e);
        }
        banner.classList.remove('active');
    });

    if (kvkkBtn) {
        kvkkBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openKvkkModal();
        });
    }
}



// Cinematic Scroll Reveal Engine using IntersectionObserver

function initScrollReveal() {
    // Add custom gold scrollbar styling properties dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        /* Custom gold luxury scrollbar */
        ::-webkit-scrollbar {
            width: 10px;
        }
        ::-webkit-scrollbar-track {
            background: #faf8f5;
        }
        ::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, var(--accent-gold) 0%, var(--accent-gold-hover) 100%);
            border-radius: 5px;
            border: 2px solid #faf8f5;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: var(--accent-gold-hover);
        }
        
        /* Reveal animation styles */
        .reveal-element {
            opacity: 0;
            transform: translateY(28px);
            transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
            will-change: opacity, transform;
        }
        .reveal-element.active {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.03,
        rootMargin: '0px 0px -20px 0px'
    });
    
    // Select sections, titles, and grid cards for reveal
    document.querySelectorAll('.step-card, .fleet-card, .corp-card, .feature-card, .sight-card, .region-card, .section-title-wrap, .faq-item, .testimonial-card').forEach(el => {
        el.classList.add('reveal-element');
        observer.observe(el);
    });
}


// Interactive 3D Hover Tilt Parallax Effect for Vito Overlay (slide 0)
function initHeroCarParallax() {
    const hero    = document.getElementById('home');
    const vitoWrap = document.getElementById('hero-vito-wrap');
    if (!hero || !vitoWrap) return;

    setTimeout(() => {
        hero.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 991) return;
            const w = window.innerWidth, h = window.innerHeight;
            const ox = e.clientX - w / 2, oy = e.clientY - h / 2;
            const moveX = ox / 40, moveY = oy / 50;
            const rotY  = (ox / w) * 8, rotX = -(oy / h) * 5;
            vitoWrap.style.transform  = `translate3d(${moveX}px,${moveY}px,0) rotateY(${rotY}deg) rotateX(${rotX}deg)`;
            vitoWrap.style.transition = 'transform 0.12s ease-out';
        });
        hero.addEventListener('mouseleave', () => {
            vitoWrap.style.transform  = 'translate3d(0,0,0) rotateY(0deg) rotateX(0deg)';
            vitoWrap.style.transition = 'transform 0.7s cubic-bezier(0.16,1,0.3,1)';
        });
    }, 2000);
}



/* =============================================================
   CINEMATIC HERO SLIDER — clean reliable version
   ============================================================= */
function initHeroSlider() {
    const section      = document.getElementById('home');
    if (!section || !section.classList.contains('hero-slider-section')) return;

    const slides       = section.querySelectorAll('.hero-slide-content');
    const bgs          = section.querySelectorAll('.hero-slide-bg');
    const dots         = section.querySelectorAll('.hero-dot');
    const progressFill = document.getElementById('hero-progress-fill');
    const counterEl    = document.getElementById('hero-current-slide');
    const prevBtn      = document.getElementById('hero-arrow-prev');
    const nextBtn      = document.getElementById('hero-arrow-next');
    const vitoWrap     = document.getElementById('hero-vito-wrap');

    const vehicleLabels = [
        'Mercedes Vito VIP',
        'Mercedes Vito Premium',
        'Mercedes Sprinter VIP',
        'Düğün VIP & Özel Organizasyon',
        'Mercedes Vito VIP',
        'Mercedes Vito Premium',
        'Mercedes Sprinter VIP',
        'Wedding VIP & Special Events',
        'Mercedes Vito VIP',
        'Mercedes Vito Premium',
        'Mercedes Sprinter VIP',
        'Свадебный VIP и спецпроекты'
    ];

    const TOTAL         = slides.length;
    const INTERVAL      = 6500;
    const PROGRESS_STEP = 50;

    let currentIndex    = 0;
    let timer           = null;
    let progressTimer   = null;
    let progressElapsed = 0;
    let isAnimating     = false;

    // ── GOTO SLIDE ──────────────────────────────────────────────────────────
    function goToSlide(index, direction) {
        const target = ((index % TOTAL) + TOTAL) % TOTAL;
        if (isAnimating || target === currentIndex) return;
        isAnimating = true;

        const prev = currentIndex;
        currentIndex = target;

        // 1. Crossfade backgrounds (vehicle photos)
        bgs.forEach((bg, i) => bg.classList.toggle('active', i === currentIndex));

        // 2. Show / hide Vito overlay (only on slide 0 and 4)
        if (vitoWrap) {
            vitoWrap.style.transition = 'opacity 0.9s ease';
            vitoWrap.style.opacity    = (currentIndex === 0 || currentIndex === 4) ? '0.94' : '0';
        }

        // 3. Slide out old text
        const prevSlide = slides[prev];
        const nextSlide = slides[currentIndex];

        prevSlide.classList.remove('active');
        prevSlide.style.position      = 'absolute';
        prevSlide.style.opacity       = '0';
        prevSlide.style.visibility    = 'hidden';
        prevSlide.style.pointerEvents = 'none';
        prevSlide.style.transform     = direction === 'next' ? 'translateY(-24px)' : 'translateY(24px)';
        prevSlide.style.transition    = 'opacity 0.5s ease, transform 0.5s ease';

        // 4. Slide in new text
        nextSlide.style.position      = 'absolute';
        nextSlide.style.opacity       = '0';
        nextSlide.style.visibility    = 'visible';
        nextSlide.style.pointerEvents = 'none';
        nextSlide.style.transform     = direction === 'next' ? 'translateY(28px)' : 'translateY(-28px)';
        nextSlide.style.transition    = 'none';

        requestAnimationFrame(() => requestAnimationFrame(() => {
            nextSlide.style.transition    = 'opacity 0.65s ease, transform 0.65s cubic-bezier(0.16,1,0.3,1)';
            nextSlide.style.opacity       = '1';
            nextSlide.style.transform     = 'translateY(0)';
            nextSlide.style.pointerEvents = 'auto';
            nextSlide.classList.add('active');

            setTimeout(() => {
                prevSlide.style.cssText = 'position:absolute; opacity:0; visibility:hidden; pointer-events:none;';
                nextSlide.style.cssText = '';
                isAnimating = false;
            }, 700);
        }));

        // 5. Dots + counter
        dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
        if (counterEl) counterEl.textContent = String(currentIndex + 1).padStart(2, '0');

        // 6. Vehicle badge
        updateVehicleBadge();

        // 7. Progress bar
        resetProgress();
    }

    // ── VEHICLE BADGE ────────────────────────────────────────────────────────
    function updateVehicleBadge() {
        let badge = section.querySelector('.hero-vehicle-badge');
        if (!badge) {
            badge = document.createElement('div');
            badge.className = 'hero-vehicle-badge';
            section.appendChild(badge);
        }
        badge.classList.remove('visible');
        
        // Dynamically get translated vehicle label
        const lang = (window.state && window.state.currentLang) ? window.state.currentLang : 'tr';
        const dict = translations[lang] || translations['tr'];
        const labelKey = 'vehicle_label_' + currentIndex;
        badge.textContent = dict[labelKey] || vehicleLabels[currentIndex] || '';
        
        // Save current index on the DOM element for language switcher updates
        badge.setAttribute('data-active-index', currentIndex);
        
        setTimeout(() => badge.classList.add('visible'), 120);
    }

    // ── PROGRESS BAR ─────────────────────────────────────────────────────────
    function resetProgress() {
        progressElapsed = 0;
        if (progressFill) progressFill.style.width = '0%';
        clearInterval(progressTimer);
        progressTimer = setInterval(() => {
            progressElapsed += PROGRESS_STEP;
            const pct = Math.min((progressElapsed / INTERVAL) * 100, 100);
            if (progressFill) progressFill.style.width = pct + '%';
        }, PROGRESS_STEP);
    }

    // ── AUTO-PLAY ─────────────────────────────────────────────────────────────
    function startAutoPlay() {
        clearInterval(timer);
        timer = setInterval(() => goToSlide(currentIndex + 1, 'next'), INTERVAL);
    }

    function stopAutoPlay() {
        clearInterval(timer);
        clearInterval(progressTimer);
    }

    // ── EVENTS ────────────────────────────────────────────────────────────────
    dots.forEach((dot, i) => dot.addEventListener('click', () => {
        goToSlide(i, i > currentIndex ? 'next' : 'prev');
        stopAutoPlay(); startAutoPlay();
    }));

    if (prevBtn) prevBtn.addEventListener('click', () => { goToSlide(currentIndex - 1, 'prev'); stopAutoPlay(); startAutoPlay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goToSlide(currentIndex + 1, 'next'); stopAutoPlay(); startAutoPlay(); });

    let touchX = 0;
    section.addEventListener('touchstart', e => { touchX = e.changedTouches[0].screenX; }, { passive: true });
    section.addEventListener('touchend',   e => {
        const d = touchX - e.changedTouches[0].screenX;
        if (Math.abs(d) > 50) { goToSlide(currentIndex + (d > 0 ? 1 : -1), d > 0 ? 'next' : 'prev'); stopAutoPlay(); startAutoPlay(); }
    }, { passive: true });

    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') { goToSlide(currentIndex + 1, 'next'); stopAutoPlay(); startAutoPlay(); }
        if (e.key === 'ArrowLeft')  { goToSlide(currentIndex - 1, 'prev'); stopAutoPlay(); startAutoPlay(); }
    });

    section.addEventListener('mouseenter', stopAutoPlay);
    section.addEventListener('mouseleave', startAutoPlay);

    // ── INIT ──────────────────────────────────────────────────────────────────
    setTimeout(updateVehicleBadge, 1200);
    resetProgress();
    startAutoPlay();

    console.log('[HeroSlider] ✓ Ready —', TOTAL, 'slides, interval:', INTERVAL / 1000 + 's');
}

// --- Live Flight Code Smart Detection ---
function initFlightTracker() {
    const flightInput = document.getElementById('modal-flight');
    const statusInfo = document.getElementById('flight-status-info');
    const terminalSelect = document.getElementById('modal-terminal');

    if (!flightInput || !statusInfo || !terminalSelect) return;

    // Flight code regex patterns
    const patterns = [
        { regex: /^(TK|THY)\d+/i, name: 'Türk Hava Yolları', terminal: 'T1' },
        { regex: /^(XQ|SXS)\d+/i, name: 'SunExpress', terminal: 'T1' },
        { regex: /^(PC|PGT)\d+/i, name: 'Pegasus Airlines', terminal: 'Domestic' },
        { regex: /^(SU|AFL)\d+/i, name: 'Aeroflot', terminal: 'T2' },
        { regex: /^(LH|DLH)\d+/i, name: 'Lufthansa', terminal: 'T2' },
        { regex: /^(DE|CFG)\d+/i, name: 'Condor', terminal: 'T2' },
        { regex: /^(N4|NWS)\d+/i, name: 'Nordwind Airlines', terminal: 'T2' },
        { regex: /^(WZ|RWZ)\d+/i, name: 'Red Wings', terminal: 'T2' },
        { regex: /^(ZF|AZW)\d+/i, name: 'Azur Air', terminal: 'T2' },
        { regex: /^(KK|KKK)\d+/i, name: 'AtlasGlobal', terminal: 'T1' }
    ];

    flightInput.addEventListener('input', (e) => {
        const val = e.target.value.trim().toUpperCase();
        if (val.length < 3) {
            statusInfo.style.display = 'none';
            return;
        }

        let found = false;
        for (let i = 0; i < patterns.length; i++) {
            const p = patterns[i];
            if (p.regex.test(val)) {
                found = true;
                
                // Show flight detection details
                const termNames = {
                    T1: state.currentLang === 'tr' ? 'Terminal 1 (Dış Hatlar)' : 'Terminal 1 (International)',
                    T2: state.currentLang === 'tr' ? 'Terminal 2 (Dış Hatlar)' : 'Terminal 2 (International)',
                    Domestic: state.currentLang === 'tr' ? 'İç Hatlar Terminali' : 'Domestic Terminal'
                };

                const msg = state.currentLang === 'tr' 
                    ? `✈️ Uçuş Algılandı: ${p.name} (${termNames[p.terminal]} Otomatik Seçildi)` 
                    : `✈️ Flight Detected: ${p.name} (${termNames[p.terminal]} Selected)`;

                statusInfo.innerText = msg;
                statusInfo.style.display = 'block';
                statusInfo.style.color = '#22c55e';
                
                // Auto set terminal selection dropdown
                terminalSelect.value = p.terminal;
                break;
            }
        }

        if (!found) {
            statusInfo.innerText = state.currentLang === 'tr' 
                ? '🔍 Canlı uçuş takibi aktif, şoförünüz inişte sizi bekliyor olacak.' 
                : '🔍 Live flight tracking active, driver will await you upon landing.';
            statusInfo.style.display = 'block';
            statusInfo.style.color = 'var(--text-muted)';
        }
    });
}

// --- Live Social Proof / FOMO Notifications Engine ---
function initFomoNotifications() {
    const fomoBox = document.getElementById('fomo-notification');
    if (!fomoBox) return;

    // Simulated real-time transfer bookings
    const fomoData = {
        tr: [
            { text: "Son 1 saatte Belek bölgesine 3 VIP Vito transferi rezerve edildi.", icon: "fa-calendar-check" },
            { text: "Az önce İngiltere'den gelen bir misafirimiz havalimanı transferini tamamladı.", icon: "fa-check-circle" },
            { text: "Münih'ten gelen 4 kişilik ailemiz VIP Vito ile oteline ulaştı.", icon: "fa-users" },
            { text: "Londra'dan gelen misafirimiz için Havalimanı Karşılaması tamamlandı.", icon: "fa-handshake" },
            { text: "Özel VIP Vito ile Alanya'dan Kaş'a gidiş-dönüş transfer rezerve edildi.", icon: "fa-route" },
            { text: "Bir kurumsal misafirimiz için 8 saatlik VIP Şoför kiralama hizmeti başladı.", icon: "fa-clock" },
            { text: "Moskova'dan gelen misafirlerimiz Premium VIP Vito ile otellerine hareket etti.", icon: "fa-crown" }
        ],
        en: [
            { text: "3 VIP Vito transfers to Belek booked in the last hour.", icon: "fa-calendar-check" },
            { text: "A guest from the UK just completed their airport transfer.", icon: "fa-check-circle" },
            { text: "A family of 4 from Munich arrived safely at their hotel in VIP Vito.", icon: "fa-users" },
            { text: "Airport Meet & Greet completed successfully for a passenger from London.", icon: "fa-handshake" },
            { text: "A round-trip transfer from Alanya to Kaş booked with VIP Vito.", icon: "fa-route" },
            { text: "8-hour VIP Chauffeur hourly service started for a corporate client.", icon: "fa-clock" },
            { text: "Guests from Moscow departed to their resort in Premium VIP Vito.", icon: "fa-crown" }
        ],
        de: [
            { text: "3 VIP Vito Transfers nach Belek in der letzten Stunde gebucht.", icon: "fa-calendar-check" },
            { text: "Ein Gast aus Großbritannien hat seinen Flughafen-Transfer abgeschlossen.", icon: "fa-check-circle" },
            { text: "Eine 4-köpfige Familie aus München ist wohlbehalten im Hotel angekommen.", icon: "fa-users" },
            { text: "Flughafen-Abholung erfolgreich für einen Gast aus London abgeschlossen.", icon: "fa-handshake" },
            { text: "VIP Vito Hin- und Rückfahrt von Alanya nach Kaş erfolgreich gebucht.", icon: "fa-route" },
            { text: "Ein 8-Stunden-VIP-Chauffeurservice für einen Firmenkunden hat begonnen.", icon: "fa-clock" }
        ],
        ru: [
            { text: "3 VIP трансфера на Vito в Белек забронировано за последний час.", icon: "fa-calendar-check" },
            { text: "Пассажир из Великобритании только что завершил трансфер из аэропорта.", icon: "fa-check-circle" },
            { text: "Семья из 4 человек из Мюнхена успешно прибыла в отель на VIP Vito.", icon: "fa-users" },
            { text: "Встреча в аэропорту успешно завершена для гостя из Лондона.", icon: "fa-handshake" }
        ]
    };

    let index = 0;
    
    function showNotification() {
        const lang = state.currentLang;
        const list = fomoData[lang] || fomoData.en;
        const item = list[index];
        
        fomoBox.innerHTML = `
            <div class="fomo-icon" style="background:var(--accent-gold); color:#111; width:35px; height:35px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0;"><i class="fas ${item.icon}"></i></div>
            <div class="fomo-content" style="text-align:left; flex-grow:1;">
                <span class="fomo-title" style="font-size:0.75rem; font-weight:800; color:var(--accent-gold); text-transform:uppercase; letter-spacing:0.5px; display:block; margin-bottom:0.15rem;">${lang === 'tr' ? 'Canlı Rezervasyon' : 'Live Booking'}</span>
                <p class="fomo-text" style="font-size:0.8rem; color:#fff; margin:0; line-height:1.4;">${item.text}</p>
            </div>
            <button class="fomo-close" onclick="this.parentElement.style.display='none'" style="background:none; border:none; color:#777; cursor:pointer; font-size:0.8rem; padding:0.2rem;"><i class="fas fa-times"></i></button>
        `;
        
        fomoBox.style.display = 'flex';
        setTimeout(() => {
            fomoBox.classList.add('active');
        }, 50);
        
        // Hide after 6 seconds
        setTimeout(() => {
            fomoBox.classList.remove('active');
            setTimeout(() => {
                fomoBox.style.display = 'none';
            }, 400);
        }, 6000);
        
        index = (index + 1) % list.length;
    }
    
    // Start interval loop: first trigger at 10s, then repeat every 25s
    setTimeout(() => {
        showNotification();
        setInterval(showNotification, 25000);
    }, 10000);
}

// --- CallMeBot WhatsApp Notification API Integration ---
function sendCallMeBotNotification(messageText) {
    const phone = '905442595196';
    const apikey = '4478819';
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&apikey=${apikey}&text=${encodeURIComponent(messageText)}`;
    
    // Using no-cors mode to send silent background request to bypass browser CORS checks
    fetch(url, { mode: 'no-cors' })
        .then(() => console.log('[CallMeBot] Notification successfully sent to +905442595196'))
        .catch(err => console.error('[CallMeBot] Notification delivery failed:', err));
}
window.sendCallMeBotNotification = sendCallMeBotNotification;



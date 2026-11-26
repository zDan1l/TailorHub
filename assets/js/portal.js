/**
 * TailorHub — Data & Helper Bersama Portal Pelanggan Publik (FR-16 s/d FR-19, FR-22)
 * Dataset diselaraskan dengan modul produksi internal (Jahit Lestari · TH-2030 s/d TH-2045).
 */
(function (global) {
  'use strict';

  var SESSION_KEY = 'tailorhub_portal_customer_v1';

  var TENANT = {
    name: 'Jahit Lestari',
    owner: 'Pak Mardi',
    tagline: 'Tailor & Konveksi · Busana Kustom & Seragam',
    address: 'Jl. Dharmawangsa No. 48, Surabaya',
    hours: 'Senin–Sabtu · 08.00–17.00 WIB',
    closedNote: 'Minggu & Hari Besar Libur',
    waNumber: '6281234567890',
    waDisplay: '0812-3456-7890'
  };

  var STAGES = [
    {
      step: 1,
      key: 'antrean',
      label: 'Antrean',
      chipClass: 'chip--queue',
      customerDesc: 'Pesanan Anda telah diterima dan sedang menunggu jadwal pemotongan kain.'
    },
    {
      step: 2,
      key: 'potong',
      label: 'Pemotongan',
      chipClass: 'chip--cut',
      customerDesc: 'Kain sedang diukur dan dipotong sesuai pola ukuran pesanan Anda.'
    },
    {
      step: 3,
      key: 'jahit',
      label: 'Penjahitan',
      chipClass: 'chip--sew',
      customerDesc: 'Busana sedang dalam proses penjahitan oleh penjahit spesialis kami.'
    },
    {
      step: 4,
      key: 'finishing',
      label: 'Finishing',
      chipClass: 'chip--finish',
      customerDesc: 'Tahap pemasangan kancing, obras rapi, setrika uap, dan perapian detail.'
    },
    {
      step: 5,
      key: 'qc',
      label: 'QC',
      chipClass: 'chip--qc',
      customerDesc: 'Pemeriksaan akhir kualitas jahitan dan kesesuaian ukuran sebelum dikemas.'
    },
    {
      step: 6,
      key: 'selesai',
      label: 'Selesai',
      chipClass: 'chip--done',
      customerDesc: 'Pesanan sudah selesai, dikemas rapi, dan siap diambil di workshop.'
    },
    {
      step: 7,
      key: 'diambil',
      label: 'Diambil',
      chipClass: 'chip--taken',
      customerDesc: 'Pesanan telah diserahkan dan diterima langsung oleh pelanggan.'
    }
  ];

  var ORDERS = {
    'TH-2045': {
      code: 'TH-2045',
      title: 'Seragam Kantor ×20',
      qty: '20 Stel (S–XXL)',
      customer: 'PT Maju Jaya',
      step: 1,
      stageLabel: 'Antrean (1/7)',
      stageClass: 'chip--queue',
      estimateLabel: 'Estimasi: 02 Des 2026',
      deadlineClass: 'chip--soft',
      payLabel: 'Belum Bayar',
      payClass: 'chip--unpaid',
      orderDate: '22 Nov 2026',
      lastUpdate: '22 Nov 2026 · 15:10 WIB',
      customerNote: 'Pesanan seragam sudah masuk antrean produksi dan segera dijadwalkan potong pola.',
      stepTimes: { 1: '22 Nov 2026 · 15:10' }
    },
    'TH-2044': {
      code: 'TH-2044',
      title: 'Celana Bahan ×2',
      qty: '2 Pcs · Twist Wool Hitam',
      customer: 'Rudi Darmawan',
      step: 1,
      stageLabel: 'Antrean (1/7)',
      stageClass: 'chip--queue',
      estimateLabel: 'Estimasi: 28 Nov 2026',
      deadlineClass: 'chip--soft',
      payLabel: 'DP',
      payClass: 'chip--dp',
      orderDate: '21 Nov 2026',
      lastUpdate: '21 Nov 2026 · 14:20 WIB',
      customerNote: 'Ukuran lingkar pinggang dan panjang celana sudah tercatat di lembar kerja.',
      stepTimes: { 1: '21 Nov 2026 · 14:20' }
    },
    'TH-2037': {
      code: 'TH-2037',
      title: 'Kemeja Batik ×6',
      qty: '6 Pcs · Katun Primisima',
      customer: 'Sari Wulandari',
      step: 2,
      stageLabel: 'Pemotongan (2/7)',
      stageClass: 'chip--cut',
      estimateLabel: 'Estimasi: 29 Nov 2026',
      deadlineClass: 'chip--soft',
      payLabel: 'DP',
      payClass: 'chip--dp',
      orderDate: '19 Nov 2026',
      lastUpdate: '23 Nov 2026 · 09:40 WIB',
      customerNote: 'Kain batik sedang dipotong hati-hati agar motif bagian depan menyambung simetris.',
      stepTimes: { 1: '19 Nov 2026 · 10:15', 2: '23 Nov 2026 · 09:40' }
    },
    'TH-2043': {
      code: 'TH-2043',
      title: 'Kaos Komunitas ×30',
      qty: '30 Pcs (S–XXL)',
      customer: 'Komunitas Lari Sby',
      step: 2,
      stageLabel: 'Pemotongan (2/7)',
      stageClass: 'chip--cut',
      estimateLabel: 'Estimasi: 01 Des 2026',
      deadlineClass: 'chip--soft',
      payLabel: 'DP',
      payClass: 'chip--dp',
      orderDate: '20 Nov 2026',
      lastUpdate: '23 Nov 2026 · 10:05 WIB',
      customerNote: 'Pola raglan ukuran S hingga XXL sedang dalam proses pemotongan massal.',
      stepTimes: { 1: '20 Nov 2026 · 11:00', 2: '23 Nov 2026 · 10:05' }
    },
    'TH-2041': {
      code: 'TH-2041',
      title: 'Kemeja Formal ×3',
      qty: '3 Pcs (M, L, L) · Poplin Jepang',
      customer: 'Budi Santoso',
      step: 3,
      stageLabel: 'Penjahitan (3/7)',
      stageClass: 'chip--sew',
      estimateLabel: 'Estimasi: Besok · 24 Nov 2026',
      deadlineClass: 'chip--clay',
      payLabel: 'DP',
      payClass: 'chip--dp',
      orderDate: '20 Nov 2026',
      lastUpdate: '22 Nov 2026 · 08:30 WIB',
      customerNote: 'Bagian badan utama sudah dijahit, saat ini masuk pemasangan lengan dan kerah.',
      stepTimes: {
        1: '20 Nov 2026 · 09:15',
        2: '21 Nov 2026 · 13:40',
        3: '22 Nov 2026 · 08:30'
      }
    },
    'TH-2038': {
      code: 'TH-2038',
      title: 'Gamis Pesta ×1',
      qty: '1 Pcs · Ceruti Babydoll + Furing',
      customer: 'Nurul Laila',
      step: 3,
      stageLabel: 'Penjahitan (3/7)',
      stageClass: 'chip--sew',
      estimateLabel: 'Estimasi: 30 Nov 2026',
      deadlineClass: 'chip--soft',
      payLabel: 'DP',
      payClass: 'chip--dp',
      orderDate: '19 Nov 2026',
      lastUpdate: '23 Nov 2026 · 11:30 WIB',
      customerNote: 'Lapisan furing sudah terpasang rapi, berlanjut ke jahitan bagian rok A-Line.',
      stepTimes: {
        1: '19 Nov 2026 · 13:00',
        2: '21 Nov 2026 · 10:20',
        3: '23 Nov 2026 · 11:30'
      }
    },
    'TH-2035': {
      code: 'TH-2035',
      title: 'Jas Almamater ×1',
      qty: '1 Pcs · Nagata Drill Navy',
      customer: 'Citra Dewi',
      step: 4,
      stageLabel: 'Finishing (4/7)',
      stageClass: 'chip--finish',
      estimateLabel: 'Estimasi: 26 Nov 2026',
      deadlineClass: 'chip--soft',
      payLabel: 'Lunas',
      payClass: 'chip--paid',
      orderDate: '17 Nov 2026',
      lastUpdate: '23 Nov 2026 · 12:40 WIB',
      customerNote: 'Jahitan utama selesai, sekarang masuk tahap pemasangan kancing dan setrika uap.',
      stepTimes: {
        1: '17 Nov 2026 · 10:00',
        2: '19 Nov 2026 · 14:10',
        3: '21 Nov 2026 · 16:00',
        4: '23 Nov 2026 · 12:40'
      }
    },
    'TH-2033': {
      code: 'TH-2033',
      title: 'Jas Formal ×1',
      qty: '1 Stel · Semi Wool Charcoal',
      customer: 'Hendra W.',
      step: 4,
      stageLabel: 'Finishing (4/7)',
      stageClass: 'chip--finish',
      estimateLabel: 'Prioritas Selesai Hari Ini',
      deadlineClass: 'chip--danger',
      payLabel: 'DP',
      payClass: 'chip--dp',
      orderDate: '14 Nov 2026',
      lastUpdate: '23 Nov 2026 · 14:00 WIB',
      customerNote: 'Sedang diprioritaskan di meja finishing untuk perapian saku dan setrika akhir.',
      stepTimes: {
        1: '14 Nov 2026 · 09:00',
        2: '16 Nov 2026 · 11:30',
        3: '20 Nov 2026 · 15:45',
        4: '23 Nov 2026 · 14:00'
      }
    },
    'TH-2040': {
      code: 'TH-2040',
      title: 'Jas Formal ×1',
      qty: '1 Stel · Wool Blend Hitam',
      customer: 'Citra Dewi',
      step: 5,
      stageLabel: 'QC (5/7)',
      stageClass: 'chip--qc',
      estimateLabel: 'Estimasi: 24 Nov 2026 (H-2)',
      deadlineClass: 'chip--clay',
      payLabel: 'Lunas',
      payClass: 'chip--paid',
      orderDate: '15 Nov 2026',
      lastUpdate: '23 Nov 2026 · 13:50 WIB',
      customerNote: 'Dalam pengecekan akhir kerapian kerah, kancing, dan kesesuaian ukuran LD 92 cm.',
      stepTimes: {
        1: '15 Nov 2026 · 10:10',
        2: '17 Nov 2026 · 09:45',
        3: '19 Nov 2026 · 16:20',
        4: '22 Nov 2026 · 11:30',
        5: '23 Nov 2026 · 13:50'
      }
    },
    'TH-2042': {
      code: 'TH-2042',
      title: 'Blazer Kerja ×2',
      qty: '2 Pcs · Polyester Gabardine',
      customer: 'Ibu Maya',
      step: 5,
      stageLabel: 'QC (5/7)',
      stageClass: 'chip--qc',
      estimateLabel: 'Estimasi: 27 Nov 2026',
      deadlineClass: 'chip--soft',
      payLabel: 'DP',
      payClass: 'chip--dp',
      orderDate: '16 Nov 2026',
      lastUpdate: '23 Nov 2026 · 11:10 WIB',
      customerNote: 'Kedua blazer sedang menjalani inspeksi akhir sebelum pengemasan gantung.',
      stepTimes: {
        1: '16 Nov 2026 · 11:00',
        2: '18 Nov 2026 · 13:20',
        3: '20 Nov 2026 · 17:00',
        4: '22 Nov 2026 · 14:40',
        5: '23 Nov 2026 · 11:10'
      }
    },
    'TH-2030': {
      code: 'TH-2030',
      title: 'Kemeja Kerja ×2',
      qty: '2 Pcs · Oxford Biru Muda',
      customer: 'Hendra W.',
      step: 6,
      stageLabel: 'Selesai (6/7)',
      stageClass: 'chip--done',
      estimateLabel: 'Siap Diambil',
      deadlineClass: 'chip--done',
      payLabel: 'Lunas',
      payClass: 'chip--paid',
      orderDate: '12 Nov 2026',
      lastUpdate: '22 Nov 2026 · 16:30 WIB',
      customerNote: 'Busana sudah lolos QC, disetrika rapi, dan siap diambil sesuai jam buka workshop.',
      stepTimes: {
        1: '12 Nov 2026 · 09:20',
        2: '14 Nov 2026 · 10:00',
        3: '17 Nov 2026 · 14:15',
        4: '20 Nov 2026 · 11:50',
        5: '21 Nov 2026 · 15:40',
        6: '22 Nov 2026 · 16:30'
      }
    },
    'TH-2026': {
      code: 'TH-2026',
      title: 'Kebaya Wisuda ×1',
      qty: '1 Stel · Brokat Prancis + Satin',
      customer: 'Ibu Ratna',
      step: 7,
      stageLabel: 'Diambil (7/7)',
      stageClass: 'chip--taken',
      estimateLabel: 'Diambil 20 Nov 2026',
      deadlineClass: 'chip--taken',
      payLabel: 'Lunas',
      payClass: 'chip--paid',
      orderDate: '05 Nov 2026',
      lastUpdate: '20 Nov 2026 · 14:15 WIB',
      customerNote: 'Terima kasih telah mempercayakan busana Anda di Jahit Lestari.',
      stepTimes: {
        1: '05 Nov 2026 · 10:00',
        2: '08 Nov 2026 · 11:20',
        3: '12 Nov 2026 · 16:00',
        4: '16 Nov 2026 · 14:30',
        5: '18 Nov 2026 · 10:45',
        6: '19 Nov 2026 · 15:00',
        7: '20 Nov 2026 · 14:15'
      }
    },
    'TH-2021': {
      code: 'TH-2021',
      title: 'Blus Kerja Sutra ×2',
      qty: '2 Pcs · Silk Crepe Ivory',
      customer: 'Citra Dewi',
      step: 7,
      stageLabel: 'Diambil (7/7)',
      stageClass: 'chip--taken',
      estimateLabel: 'Diambil 10 Nov 2026',
      deadlineClass: 'chip--taken',
      payLabel: 'Lunas',
      payClass: 'chip--paid',
      orderDate: '01 Nov 2026',
      lastUpdate: '10 Nov 2026 · 16:05 WIB',
      customerNote: 'Pesanan selesai dan telah diambil oleh pelanggan.',
      stepTimes: {
        1: '01 Nov 2026 · 09:15',
        2: '03 Nov 2026 · 10:40',
        3: '05 Nov 2026 · 15:00',
        4: '07 Nov 2026 · 13:20',
        5: '08 Nov 2026 · 16:10',
        6: '09 Nov 2026 · 11:30',
        7: '10 Nov 2026 · 16:05'
      }
    }
  };

  var DEMO_CUSTOMERS = {
    citra: {
      key: 'citra',
      name: 'Citra Dewi',
      initials: 'CD',
      phone: '0812-3456-7891',
      email: 'citra.dewi@email.com'
    },
    hendra: {
      key: 'hendra',
      name: 'Hendra W.',
      initials: 'HW',
      phone: '0813-9876-5432',
      email: 'hendra.w@email.com'
    },
    budi: {
      key: 'budi',
      name: 'Budi Santoso',
      initials: 'BS',
      phone: '0856-4321-8899',
      email: 'budi.santoso@email.com'
    }
  };

  function normalizeCode(raw) {
    return String(raw || '').trim().toUpperCase();
  }

  function findOrder(code) {
    var key = normalizeCode(code);
    if (!key) return null;
    return Object.prototype.hasOwnProperty.call(ORDERS, key) ? ORDERS[key] : null;
  }

  function getAllOrders() {
    return Object.keys(ORDERS).map(function (k) {
      return ORDERS[k];
    });
  }

  function getOrdersByCustomer(customerName) {
    var target = String(customerName || '').trim().toLowerCase();
    if (!target) return [];
    return getAllOrders().filter(function (item) {
      return item.customer.toLowerCase() === target;
    });
  }

  function getStageMeta(stepNum) {
    for (var i = 0; i < STAGES.length; i++) {
      if (STAGES[i].step === stepNum) return STAGES[i];
    }
    return STAGES[0];
  }

  function buildWaUrl(code) {
    var cleanCode = normalizeCode(code);
    var msg = cleanCode
      ? 'Halo CS ' + TENANT.name + ', saya ingin menanyakan progres pesanan berkode ' + cleanCode + '.'
      : 'Halo CS ' + TENANT.name + ', saya ingin bertanya seputar pesanan jahitan saya.';
    return 'https://wa.me/' + TENANT.waNumber + '?text=' + encodeURIComponent(msg);
  }

  function computeInitials(name) {
    var parts = String(name || '').trim().split(/\s+/);
    if (!parts.length || !parts[0]) return 'PL';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  function getDemoCustomers() {
    return [DEMO_CUSTOMERS.citra, DEMO_CUSTOMERS.hendra, DEMO_CUSTOMERS.budi];
  }

  function getSessionCustomer() {
    try {
      var raw = global.localStorage.getItem(SESSION_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.name) return parsed;
      }
    } catch (err) {
      // Fallback ke akun demo jika storage tidak tersedia
    }
    return DEMO_CUSTOMERS.citra;
  }

  function setSessionCustomer(customerObj) {
    var payload = {
      key: customerObj.key || 'custom',
      name: customerObj.name || 'Pelanggan Jahit Lestari',
      initials: customerObj.initials || computeInitials(customerObj.name),
      phone: customerObj.phone || '-',
      email: customerObj.email || ''
    };
    try {
      global.localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
    } catch (err) {
      // Abaikan jika storage diblokir
    }
    return payload;
  }

  function clearSessionCustomer() {
    try {
      global.localStorage.removeItem(SESSION_KEY);
    } catch (err) {
      // Abaikan jika storage diblokir
    }
  }

  function loginDemoCustomer(identifier) {
    var val = String(identifier || '').trim().toLowerCase();
    if (DEMO_CUSTOMERS[val]) {
      return setSessionCustomer(DEMO_CUSTOMERS[val]);
    }
    var list = getDemoCustomers();
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      if (
        val.indexOf(c.key) !== -1 ||
        c.name.toLowerCase() === val ||
        c.email.toLowerCase() === val ||
        c.phone.replace(/\D/g, '') === val.replace(/\D/g, '')
      ) {
        return setSessionCustomer(c);
      }
    }
    return setSessionCustomer(DEMO_CUSTOMERS.citra);
  }

  function createChip(className, text) {
    var span = document.createElement('span');
    span.className = 'chip ' + className;
    var dot = document.createElement('span');
    dot.className = 'd';
    span.appendChild(dot);
    span.appendChild(document.createTextNode(text));
    return span;
  }

  var STATUS_TO_STEP = {
    'Antrean': 1,
    'Pemotongan': 2,
    'Penjahitan': 3,
    'Finishing': 4,
    'QC': 5,
    'Selesai': 6,
    'Diambil': 7
  };

  var PAY_TO_CLASS = {
    'Belum Bayar': 'chip--unpaid',
    'DP': 'chip--dp',
    'Lunas': 'chip--paid'
  };

  async function fetchOrderFromApi(rawCode, slug) {
    var clean = normalizeCode(rawCode);
    if (!clean) return null;
    var tenantSlug = slug || new URLSearchParams(global.location.search).get('slug') || 'jahit-lestari';
    if (global.TH) {
      try {
        var d = await global.TH.get('/api/public/track?slug=' + encodeURIComponent(tenantSlug) + '&code=' + encodeURIComponent(clean));
        if (d && d.pesanan) {
          var p = d.pesanan;
          var stepNum = STATUS_TO_STEP[p.statusProduksi] || 1;
          var stageMeta = getStageMeta(stepNum);
          var existing = ORDERS[p.kode] || {};
          var stepTimes = Object.assign({}, existing.stepTimes || {});
          var lastUpd = existing.lastUpdate || 'Baru saja';
          if (Array.isArray(d.riwayat) && d.riwayat.length) {
            d.riwayat.forEach(function (h) {
              var sIdx = STATUS_TO_STEP[h.status];
              if (sIdx && h.created_at) stepTimes[sIdx] = h.created_at;
            });
            lastUpd = d.riwayat[d.riwayat.length - 1].created_at || lastUpd;
          }
          if (d.usaha) TENANT.name = d.usaha;
          var merged = {
            code: p.kode,
            title: existing.title || ((p.jenis || 'Pesanan') + ' ×' + (p.jumlah || 1)),
            qty: existing.qty || ((p.jumlah || 1) + ' Pcs'),
            customer: p.customer || existing.customer || 'Pelanggan',
            step: stepNum,
            stageLabel: stageMeta.label + ' (' + stepNum + '/7)',
            stageClass: stageMeta.chipClass,
            estimateLabel: p.deadline ? ('Estimasi: ' + p.deadline) : (existing.estimateLabel || 'Sesuai Jadwal'),
            deadlineClass: existing.deadlineClass || 'chip--soft',
            payLabel: p.statusBayar || existing.payLabel || 'DP',
            payClass: PAY_TO_CLASS[p.statusBayar] || existing.payClass || 'chip--dp',
            orderDate: existing.orderDate || '-',
            lastUpdate: lastUpd,
            customerNote: existing.customerNote || stageMeta.customerDesc,
            stepTimes: stepTimes
          };
          ORDERS[p.kode] = merged;
          return merged;
        }
      } catch (e) {
        // Fallback ke dataset lokal bila kode contoh tidak ada di seed D1
      }
    }
    return findOrder(clean);
  }

  var TENANT_ASSETS = {
    'jahit-lestari': {
      icon: '/assets/img/logo/tenant-jahit-lestari.png',
      favicon32: '/assets/img/logo/tenant-jahit-lestari-32.png',
      favicon192: '/assets/img/logo/tenant-jahit-lestari-192.png',
      apple: '/assets/img/logo/tenant-jahit-lestari-apple.png'
    }
  };

  function applyTenantBrandAssets() {
    var rawSlug = new URLSearchParams(global.location.search).get('slug') || '';
    var activeSlug = /^[a-z0-9-]{1,64}$/.test(rawSlug) ? rawSlug : 'jahit-lestari';
    var assets = TENANT_ASSETS[activeSlug];
    if (!assets || typeof document === 'undefined') return;

    document.querySelectorAll('.portal-brand-mark img.brand-icon').forEach(function (img) {
      img.setAttribute('src', assets.icon);
    });
    var icon32 = document.querySelector('link[rel="icon"][sizes="32x32"]');
    if (icon32) icon32.setAttribute('href', assets.favicon32);
    var icon192 = document.querySelector('link[rel="icon"][sizes="192x192"]');
    if (icon192) icon192.setAttribute('href', assets.favicon192);
    var apple = document.querySelector('link[rel="apple-touch-icon"]');
    if (apple) apple.setAttribute('href', assets.apple);
  }

  applyTenantBrandAssets();
  if (typeof document !== 'undefined' && document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyTenantBrandAssets);
  }

  global.TailorPortal = {
    TENANT: TENANT,
    STAGES: STAGES,
    normalizeCode: normalizeCode,
    findOrder: findOrder,
    fetchOrderFromApi: fetchOrderFromApi,
    getAllOrders: getAllOrders,
    getOrdersByCustomer: getOrdersByCustomer,
    getStageMeta: getStageMeta,
    buildWaUrl: buildWaUrl,
    getDemoCustomers: getDemoCustomers,
    getSessionCustomer: getSessionCustomer,
    setSessionCustomer: setSessionCustomer,
    clearSessionCustomer: clearSessionCustomer,
    loginDemoCustomer: loginDemoCustomer,
    createChip: createChip,
    applyTenantBrandAssets: applyTenantBrandAssets
  };
})(window);

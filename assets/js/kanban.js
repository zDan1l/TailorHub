/**
 * TailorHub — Skrip Interaktif Papan Kanban Produksi (FR-11, FR-14)
 * Menangani HTML5 drag-and-drop antar 7 tahap, tombol pindah tahap cepat,
 * filter real-time (cari, staf, deadline), sinkronisasi counter kolom, dan toast.
 */
(function () {
  'use strict';

  var STAGES = [
    { key: 'antrean',   label: 'Antrean',    step: 1, color: 'var(--s-queue)' },
    { key: 'potong',    label: 'Pemotongan', step: 2, color: 'var(--s-cut)' },
    { key: 'jahit',     label: 'Penjahitan', step: 3, color: 'var(--s-sew)' },
    { key: 'finishing', label: 'Finishing',  step: 4, color: 'var(--s-finish)' },
    { key: 'qc',        label: 'QC',         step: 5, color: 'var(--s-qc)' },
    { key: 'selesai',   label: 'Selesai',    step: 6, color: 'var(--s-done)' },
    { key: 'diambil',   label: 'Diambil',    step: 7, color: 'var(--s-taken)' }
  ];

  var STAGE_MAP = {};
  STAGES.forEach(function (stage, index) {
    STAGE_MAP[stage.key] = {
      key: stage.key,
      label: stage.label,
      step: stage.step,
      color: stage.color,
      index: index
    };
  });

  var draggedCard = null;
  var toastTimer = null;

  /**
   * Menampilkan toast solid di sudut kanan bawah saat status diperbarui.
   * @param {string} title
   * @param {string} message
   */
  function showToast(title, message) {
    var existing = document.getElementById('prodToast');
    if (existing) {
      existing.remove();
    }
    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    var toast = document.createElement('div');
    toast.id = 'prodToast';
    toast.className = 'prod-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    var iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    iconSvg.setAttribute('width', '20');
    iconSvg.setAttribute('height', '20');
    iconSvg.setAttribute('viewBox', '0 0 24 24');
    iconSvg.setAttribute('fill', 'none');
    iconSvg.setAttribute('stroke', 'currentColor');
    iconSvg.setAttribute('stroke-width', '2.4');
    iconSvg.setAttribute('stroke-linecap', 'round');
    iconSvg.setAttribute('stroke-linejoin', 'round');
    var checkPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    checkPath.setAttribute('d', 'm5 12.6 4.4 4.4L19 6.8');
    iconSvg.appendChild(checkPath);

    var textWrap = document.createElement('div');
    var titleEl = document.createElement('b');
    titleEl.textContent = title;
    var msgEl = document.createElement('small');
    msgEl.textContent = message;
    textWrap.appendChild(titleEl);
    textWrap.appendChild(msgEl);

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'toast-x';
    closeBtn.setAttribute('aria-label', 'Tutup notifikasi');
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', function () {
      toast.remove();
    });

    toast.appendChild(iconSvg);
    toast.appendChild(textWrap);
    toast.appendChild(closeBtn);
    document.body.appendChild(toast);

    toastTimer = setTimeout(function () {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 4500);
  }

  /**
   * Memperbarui atribut tahap, progress bar 7 segmen, label tahap,
   * dan status tombol pindah tahap pada kartu Kanban.
   * @param {HTMLElement} card
   * @param {string} stageKey
   */
  function syncCardVisual(card, stageKey) {
    var stage = STAGE_MAP[stageKey];
    if (!stage) return;

    card.setAttribute('data-stage', stage.key);
    syncCardDeadline(card, stage.label);

    var steps = card.querySelectorAll('.kc-steps i');
    steps.forEach(function (seg, idx) {
      if (idx < stage.step) {
        seg.classList.add('on');
      } else {
        seg.classList.remove('on');
      }
    });

    var labelWrap = card.querySelector('.kc-stepslabel');
    if (labelWrap) {
      var spans = labelWrap.querySelectorAll('span');
      if (spans[0]) spans[0].textContent = stage.label;
      if (spans[1]) spans[1].textContent = stage.step + '/7';
    }

    var prevBtn = card.querySelector('.kc-btn--prev');
    if (prevBtn) {
      var isFirst = stage.step <= 1;
      prevBtn.disabled = isFirst;
      prevBtn.title = isFirst
        ? 'Pesanan sudah berada di tahap awal'
        : 'Kembali ke tahap sebelumnya';
    }

    var nextBtn = card.querySelector('.kc-btn--next');
    if (nextBtn) {
      var isLast = stage.step >= STAGES.length;
      nextBtn.disabled = isLast;
      nextBtn.title = isLast
        ? 'Pesanan sudah berada di tahap akhir'
        : 'Pindah ke tahap berikutnya';
    }
  }

  /**
   * Menghitung ulang jumlah kartu terlihat di tiap kolom dan menampilkan
   * placeholder kosong apabila kolom tidak memiliki kartu aktif.
   */
  function updateColumnCounts() {
    var cols = document.querySelectorAll('.kcol[data-stage]');
    var totalVisible = 0;

    cols.forEach(function (col) {
      var cards = col.querySelectorAll('.kcard');
      var visible = 0;

      cards.forEach(function (card) {
        if (!card.hidden) {
          visible += 1;
        }
      });

      totalVisible += visible;

      var countEl = col.querySelector('.kcount');
      if (countEl) {
        countEl.textContent = String(visible);
      }

      var emptyEl = col.querySelector('.kcol-empty');
      if (emptyEl) {
        emptyEl.hidden = visible > 0;
      }
    });

    var visibleCounter = document.getElementById('visibleCount');
    if (visibleCounter) {
      visibleCounter.textContent = 'Menampilkan ' + totalVisible + ' pesanan';
    }
  }

  /**
   * Menghitung jumlah pesanan mendesak/lewat deadline dari kartu Kanban
   * lalu memperbarui label tombol "Pantau Deadline (N)".
   */
  function updateDeadlineButtonCount() {
    var labelEl = document.getElementById('deadlineAlertLabel');
    if (!labelEl) return;
    var urgentCount = 0;
    document.querySelectorAll('.kcard').forEach(function (card) {
      var dlCat = card.getAttribute('data-deadline');
      var stage = card.getAttribute('data-stage');
      if (stage === 'selesai' || stage === 'diambil') return;
      if (dlCat === 'late' || dlCat === 'soon') {
        urgentCount += 1;
      }
    });
    labelEl.textContent = 'Pantau Deadline (' + urgentCount + ')';
  }

  /**
   * Memperbarui tampilan deadline pada kartu apabila data-raw-deadline tersedia.
   */
  function syncCardDeadline(card, stageLabel) {
    if (!card || !window.TH) return;
    var rawDeadline = card.getAttribute('data-raw-deadline');
    if (rawDeadline === null) return;
    var dl = window.TH.deadlineMeta(rawDeadline, stageLabel);
    card.setAttribute('data-deadline', dl.cat);
    var deadEl = card.querySelector('.kc-dead');
    if (deadEl) {
      deadEl.className = 'kc-dead' + (dl.kanbanCls ? ' ' + dl.kanbanCls : '');
      deadEl.textContent = '';
      deadEl.appendChild(window.TH.svgUse(dl.icon, 14));
      deadEl.appendChild(document.createTextNode(' ' + dl.text));
    }
  }

  /**
   * Memindahkan kartu ke kolom tahap target dan memicu toast konfirmasi + simpan ke D1.
   * @param {HTMLElement} card
   * @param {string} targetStageKey
   * @param {boolean} [silent]
   */
  function moveCardToStage(card, targetStageKey, silent) {
    if (!card || !STAGE_MAP[targetStageKey]) return;

    var currentStageKey = card.getAttribute('data-stage');
    var targetCol = document.querySelector('.kcol[data-stage="' + targetStageKey + '"]');
    if (!targetCol) return;

    if (currentStageKey === targetStageKey && card.parentElement === targetCol) {
      return;
    }

    var emptyPlaceholder = targetCol.querySelector('.kcol-empty');
    if (emptyPlaceholder) {
      targetCol.insertBefore(card, emptyPlaceholder);
    } else {
      targetCol.appendChild(card);
    }

    syncCardVisual(card, targetStageKey);
    updateColumnCounts();
    updateDeadlineButtonCount();

    if (silent) return;

    var codeEl = card.querySelector('.kc-code');
    var orderCode = card.getAttribute('data-code') || (codeEl ? codeEl.textContent.trim() : 'Pesanan');
    var stageLabel = STAGE_MAP[targetStageKey].label;

    if (window.TH && orderCode) {
      window.TH.put('/api/orders/' + encodeURIComponent(orderCode), {
        production_status: stageLabel,
        note: 'Status diperbarui ke ' + stageLabel + ' melalui Papan Kanban'
      }).catch(function (err) {
        console.error('Gagal menyimpan status Kanban ke D1:', err);
      });
    }

    showToast('Status diperbarui', orderCode + ' dipindah ke tahap ' + stageLabel + '.');
  }

  /**
   * Menggeser tahap kartu sebanyak delta langkah (+1 maju, -1 mundur).
   * @param {HTMLElement} card
   * @param {number} delta
   */
  function stepCardStage(card, delta) {
    if (!card) return;
    var currentKey = card.getAttribute('data-stage');
    var current = STAGE_MAP[currentKey];
    if (!current) return;

    var targetIndex = current.index + delta;
    if (targetIndex < 0 || targetIndex >= STAGES.length) return;

    moveCardToStage(card, STAGES[targetIndex].key);
  }

  /**
   * Memajukan kartu satu tahap ke kolom berikutnya (ramah mobile/non-drag).
   * @param {HTMLElement} card
   */
  function advanceCardStage(card) {
    stepCardStage(card, 1);
  }

  /**
   * Memundurkan kartu satu tahap ke kolom sebelumnya.
   * @param {HTMLElement} card
   */
  function prevCardStage(card) {
    stepCardStage(card, -1);
  }

  /**
   * Menerapkan filter pencarian teks, staf penanggung jawab, dan urgensi deadline.
   */
  function applyFilters() {
    var searchInput = document.getElementById('kanbanSearch');
    var staffSelect = document.getElementById('filterStaff');
    var deadlineSelect = document.getElementById('filterDeadline');

    var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var staffVal = staffSelect ? staffSelect.value : '';
    var deadlineVal = deadlineSelect ? deadlineSelect.value : '';

    var cards = document.querySelectorAll('.kcard');
    cards.forEach(function (card) {
      var text = card.textContent.toLowerCase();
      var cardStaff = card.getAttribute('data-staff') || '';
      var cardDeadline = card.getAttribute('data-deadline') || 'normal';

      var matchQuery = !query || text.indexOf(query) !== -1;

      var matchStaff = true;
      if (staffVal === 'unassigned') {
        matchStaff = cardStaff === '';
      } else if (staffVal) {
        matchStaff = cardStaff === staffVal;
      }

      var matchDeadline = true;
      if (deadlineVal === 'urgent') {
        matchDeadline = cardDeadline === 'late' || cardDeadline === 'soon';
      } else if (deadlineVal) {
        matchDeadline = cardDeadline === deadlineVal;
      }

      card.hidden = !(matchQuery && matchStaff && matchDeadline);
    });

    updateColumnCounts();
  }

  function bindCardEvents() {
    var cards = document.querySelectorAll('.kcard');
    cards.forEach(function (card) {
      var stageKey = card.getAttribute('data-stage');
      if (stageKey) {
        syncCardVisual(card, stageKey);
      }

      card.addEventListener('dragstart', function (e) {
        draggedCard = card;
        card.classList.add('is-dragging');
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', card.getAttribute('data-code') || '');
        }
      });

      card.addEventListener('dragend', function () {
        card.classList.remove('is-dragging');
        draggedCard = null;
        document.querySelectorAll('.kcol.is-over').forEach(function (col) {
          col.classList.remove('is-over');
        });
      });
    });

    var board = document.querySelector('.kanban');
    if (board) {
      board.addEventListener('click', function (e) {
        var prevBtn = e.target.closest('.kc-btn--prev');
        if (prevBtn) {
          var prevCard = prevBtn.closest('.kcard');
          if (prevCard) prevCardStage(prevCard);
          return;
        }
        var nextBtn = e.target.closest('.kc-btn--next');
        if (nextBtn) {
          var nextCard = nextBtn.closest('.kcard');
          if (nextCard) advanceCardStage(nextCard);
        }
      });
    }
  }

  function bindColumnEvents() {
    var cols = document.querySelectorAll('.kcol[data-stage]');
    cols.forEach(function (col) {
      col.addEventListener('dragover', function (e) {
        if (!draggedCard) return;
        e.preventDefault();
        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = 'move';
        }
        col.classList.add('is-over');
      });

      col.addEventListener('dragleave', function (e) {
        if (!col.contains(e.relatedTarget)) {
          col.classList.remove('is-over');
        }
      });

      col.addEventListener('drop', function (e) {
        e.preventDefault();
        col.classList.remove('is-over');
        if (!draggedCard) return;

        var targetStage = col.getAttribute('data-stage');
        moveCardToStage(draggedCard, targetStage);
      });
    });
  }

  function bindFilterEvents() {
    var searchInput = document.getElementById('kanbanSearch');
    var staffSelect = document.getElementById('filterStaff');
    var deadlineSelect = document.getElementById('filterDeadline');
    var resetBtn = document.getElementById('filterReset');

    if (searchInput) {
      searchInput.addEventListener('input', applyFilters);
    }
    if (staffSelect) {
      staffSelect.addEventListener('change', applyFilters);
    }
    if (deadlineSelect) {
      deadlineSelect.addEventListener('change', applyFilters);
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        if (searchInput) searchInput.value = '';
        if (staffSelect) staffSelect.value = '';
        if (deadlineSelect) deadlineSelect.value = '';
        applyFilters();
      });
    }
  }

  var LABEL_TO_KEY = {
    'Antrean': 'antrean',
    'Pemotongan': 'potong',
    'Penjahitan': 'jahit',
    'Finishing': 'finishing',
    'QC': 'qc',
    'Selesai': 'selesai',
    'Diambil': 'diambil'
  };

  function deadlineInfo(deadline, stageKey) {
    var stage = STAGE_MAP[stageKey];
    var dl = window.TH.deadlineMeta(deadline, stage ? stage.label : '');
    return { cat: dl.cat, cls: dl.kanbanCls, icon: dl.icon, text: dl.text };
  }

  function buildCardEl(o) {
    var T = window.TH;
    var stageKey = LABEL_TO_KEY[o.production_status] || 'antrean';
    var cust = o.customer || 'Tanpa nama';
    var title = (o.detail || o.type || 'Pesanan') + (o.qty > 1 ? ' ×' + o.qty : '');
    var dl = deadlineInfo(o.deadline, stageKey);
    var staffInit = o.assignee ? T.initials(o.assignee) : '';
    var right = o.assignee
      ? T.el('span', { className: 'kc-assignee', title: o.assignee, text: staffInit })
      : T.el('span', { className: 'chip ' + T.statusChip(o.payment_status), text: o.payment_status || 'Belum Bayar' });

    var stepsEl = T.el('div', { className: 'kc-steps' });
    for (var i = 0; i < 7; i++) stepsEl.appendChild(T.el('i'));

    var href = 'detail.html?code=' + encodeURIComponent(o.code);
    var card = T.el('article', {
      className: 'kcard',
      'data-code': o.code,
      'data-stage': stageKey,
      'data-staff': staffInit,
      'data-deadline': dl.cat,
      'data-raw-deadline': o.deadline || '',
      draggable: 'true'
    }, [
      T.el('div', { className: 'kc-top' }, [
        T.el('a', { href: href, className: 'kc-code', text: o.code }),
        T.el('span', { className: 'kc-type', text: o.type || '-' })
      ]),
      T.el('div', { className: 'kc-title', text: title }),
      T.el('div', { className: 'kc-cust' }, [
        T.el('span', { className: 'mini', text: T.initials(cust) }),
        ' ' + cust
      ]),
      stepsEl,
      T.el('div', { className: 'kc-stepslabel' }, [
        T.el('span'),
        T.el('span', { className: 'pct' })
      ]),
      T.el('div', { className: 'kc-foot' }, [
        T.el('span', { className: 'kc-dead' + (dl.cls ? ' ' + dl.cls : '') }, [
          T.svgUse(dl.icon, 14),
          ' ' + dl.text
        ]),
        right
      ]),
      T.el('div', { className: 'kc-actions' }, [
        T.el('button', { type: 'button', className: 'kc-btn kc-btn--prev', 'aria-label': 'Tahap sebelumnya', text: '←' }),
        T.el('div', { className: 'kc-actions-mid' }, [
          T.el('a', { href: href, className: 'kc-btn', text: 'Detail' }),
          T.el('a', { href: 'update-status.html?code=' + encodeURIComponent(o.code), className: 'kc-btn', text: 'Update' })
        ]),
        T.el('button', { type: 'button', className: 'kc-btn kc-btn--next', 'aria-label': 'Tahap berikutnya', text: '→' })
      ])
    ]);

    // drag per-kartu (delegasi klik prev/next sudah terpasang di bindCardEvents)
    card.addEventListener('dragstart', function (e) {
      draggedCard = card; card.classList.add('is-dragging');
      if (e.dataTransfer) { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', o.code || ''); }
    });
    card.addEventListener('dragend', function () {
      card.classList.remove('is-dragging'); draggedCard = null;
      document.querySelectorAll('.kcol.is-over').forEach(function (c) { c.classList.remove('is-over'); });
    });
    return card;
  }

  function populateStaffFilter(orders) {
    window.TH.populateStaffSelect(document.getElementById('filterStaff'), orders);
  }

  // Render papan dari data D1 (mengganti kartu statis dengan data asli).
  async function syncBoardWithD1() {
    if (!window.TH) return;
    try {
      var res = await window.TH.get('/api/orders?limit=200');
      var orders = (res && res.data) || [];
      // bersihkan semua kartu statis
      document.querySelectorAll('.kcard').forEach(function (c) { c.remove(); });
      // render kartu dari D1 ke kolom tahapnya
      orders.forEach(function (o) {
        var stageKey = LABEL_TO_KEY[o.production_status] || 'antrean';
        var col = document.querySelector('.kcol[data-stage="' + stageKey + '"]');
        if (!col) return;
        var card = buildCardEl(o);
        var emptyEl = col.querySelector('.kcol-empty');
        if (emptyEl) col.insertBefore(card, emptyEl); else col.appendChild(card);
        syncCardVisual(card, stageKey);
      });
      populateStaffFilter(orders);
      updateColumnCounts();
      updateDeadlineButtonCount();
    } catch (e) {
      console.error('Gagal memuat papan Kanban dari D1:', e);
    }
  }

  function init() {
    if (!document.querySelector('.kanban')) return;
    bindCardEvents();
    bindColumnEvents();
    bindFilterEvents();
    updateColumnCounts();
    updateDeadlineButtonCount();
    syncBoardWithD1();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.TailorKanban = {
    STAGES: STAGES,
    moveCardToStage: moveCardToStage,
    advanceCardStage: advanceCardStage,
    prevCardStage: prevCardStage,
    applyFilters: applyFilters,
    showToast: showToast
  };
})();

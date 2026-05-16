const PAGES = ['home', 'model', 'features', 'about', 'timeline'];

function showPage(id) {
    console.log("Switching to page:", id);

    PAGES.forEach(p => {
        const pageEl = document.getElementById('page-' + p);
        const navEl = document.getElementById('n-' + p);

        if (pageEl) pageEl.classList.remove('active');
        if (navEl) navEl.classList.remove('active');
    });

    const activePage = document.getElementById('page-' + id);
    const activeNav = document.getElementById('n-' + id);

    if (activePage) activePage.classList.add('active');
    if (activeNav) activeNav.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (id === 'home') runCounters();
    if (id === 'timeline') buildGantt();
}

/* ── MODAL ── */
function showBuyModal() {
    const modal = document.getElementById('buy-modal');
    if (modal) modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('buy-modal');
    if (modal) modal.style.display = 'none';
}

function submitOrder() {
    const nameEl = document.getElementById('modal-name');
    const name = nameEl ? nameEl.value : '';

    if (name) {
        alert("Order received for " + name);
        closeModal();
    } else {
        alert("Please enter your name.");
    }
}

/* ── COUNTER ── */
function runCounters() {
    document.querySelectorAll('.stat-num[data-target]').forEach(el => {
        const target = +el.dataset.target;
        if (!Number.isFinite(target) || target <= 0) return;

        let cur = 0;
        const step = Math.ceil(target / 50);
        const t = setInterval(() => {
            cur += step;
            if (cur >= target) {
                el.textContent = String(target);
                clearInterval(t);
            } else {
                el.textContent = String(cur);
            }
        }, 30);
    });
}

/* ── GANTT ── */
// Gantt mapping: months shown Jan(1) -> Dec(12)
// Updated to reflect April-only progress (incl. whole week of the 2nd week of April).
const tasks = [
    // April only: mark progress in the April column(s)
    { name:'Engine R&D', s:4, len:1, pct:100, done:true },
    // 2nd week of April completed; keep remaining as in-progress
    { name:'Prototype', s:4, len:1, pct:60, done:false }
];

let ganttBuilt = false;
function buildGantt() {
    const tbody = document.getElementById('gantt-body');
    if (!tbody || ganttBuilt) return;
    ganttBuilt = true;

    tasks.forEach(t => {
        const tr = document.createElement('tr');
        const tdN = document.createElement('td');
        tdN.textContent = t.name;
        tr.appendChild(tdN);

        for (let m = 1; m <= 12; m++) {
            const td = document.createElement('td');

            if (m === t.s) {
                td.style.position = 'relative';
                const bar = document.createElement('div');
                bar.className = 'g-bar ' + (t.done ? 'g-done' : 'g-active');
                bar.style.width = `calc(${t.len} * 100% - 10px)`;
                bar.style.position = 'absolute';
                bar.textContent = t.pct + '%';
                td.appendChild(bar);
            }

            tr.appendChild(td);
        }

        tbody.appendChild(tr);
    });
}

/* ── MODEL PAGE BINDINGS ── */
function bindModelCars() {
    const model = document.getElementById('page-model');
    if (!model) return;

    const mainImg = model.querySelector('.model-main-img');
    const variantEl = model.querySelector('.model-variant');
    const priceEl = model.querySelector('.model-price');
    const pills = model.querySelectorAll('.spec-pill-num');
    const specPillHp = pills[0];
    const specPill0to60 = pills[1];

    const cars = model.querySelectorAll('.model-car');
    if (!cars.length || !mainImg || !variantEl || !priceEl || !specPillHp || !specPill0to60) return;

    const map = {
        "911 GT3 RS": { hp: 520, t: 3.0 },
        "Taycan Turbo S": { hp: 750, t: 2.8 },
        "Cayman GT4": { hp: 420, t: 3.8 },
        "CARRERA 4S": { hp: 443, t: 3.2 }
    };

    cars.forEach(btn => {
        btn.addEventListener('click', () => {
            const title = btn.dataset.carTitle;
            const price = btn.dataset.carPrice;
            const img = btn.dataset.carImg;

            if (title) variantEl.textContent = title.toUpperCase();
            if (price) priceEl.textContent = price;
            if (img) mainImg.style.backgroundImage = `url('${img}')`;

            // Sync the hero image and spec name for the selected car.
            if (title === "Cayman GT4") {
                const current = mainImg.style.backgroundImage || "";
                if (!current || !current.includes('images.unsplash.com')) {
                    mainImg.style.backgroundImage = `url('${img}')`;
                }
            }

            const picked = map[title || ''] || map['CARRERA 4S'];
            specPillHp.textContent = String(picked.hp);
            specPill0to60.textContent = String(picked.t);
        });
    });
}

// Start homepage counters on load
window.onload = () => {
    runCounters();
    bindModelCars();
};


/* ============================================================
   DikaDev Store — logika toko
   ------------------------------------------------------------
   YANG BISA DIGANTI:
   - WA_NUMBER  -> nomor WhatsApp toko (sudah diisi)
   - EMAIL      -> email toko (sudah diisi)
   - PRODUK     -> nama, harga, deskripsi, badge
     * logo  : path gambar logo (mis. "img/telegram.svg")
     * icon  : emoji kalau tidak pakai logo
     * prefix: teks sebelum harga, mis. "Mulai "
   ============================================================ */

const WA_NUMBER = "6281337612241";
const EMAIL = "andhikaadi777@gmail.com";

const PRODUK = [
  { nama: "Panel Pterodactyl", harga: 20000, satuan: "/bln", logo: "img/pterodactyl-icon.png", badge: "Terlaris",
    deskripsi: "Panel Pterodactyl pribadi untuk manage server gamemu. Full akses, install cepat, garansi 7 hari." },
  { nama: "Bot Telegram Request", harga: 50000, satuan: "", logo: "img/telegram.svg", badge: "",
    deskripsi: "Bot Telegram custom sesuai request kamu. Sekali bayar, termasuk source code." },
  { nama: "Bot WhatsApp Request", harga: 50000, satuan: "", logo: "img/whatsapp.svg", badge: "",
    deskripsi: "Bot WhatsApp custom: auto-reply, notifikasi, dan lainnya. Sekali bayar." },
  { nama: "Bot PPOB", harga: 100000, satuan: "", icon: "💳", badge: "",
    deskripsi: "Bot PPOB siap pakai untuk jualan pulsa, token PLN, paket data, dan lainnya. Terima beres." },
  { nama: "Nomor Virtual 190+ Negara", harga: 3000, satuan: "/nomor", prefix: "Mulai ", icon: "📱", badge: "Baru",
    deskripsi: "Nomor virtual dari 190+ negara untuk verifikasi OTP WhatsApp, Telegram, dan aplikasi lainnya." },
  { nama: "Request Bot (per fitur)", harga: 10000, satuan: "/fitur", icon: "🧩", badge: "",
    deskripsi: "Tambah fitur custom ke bot yang sudah ada. Harga dihitung per fitur." },
];

/* ---------- Helper ---------- */
const rupiah = n => "Rp" + n.toLocaleString("id-ID");
const $ = id => document.getElementById(id);

/* ---------- Render produk ---------- */
function renderProduk() {
  $("productGrid").innerHTML = PRODUK.map((p, i) => {
    const ikon = p.logo
      ? `<img class="logo-img" src="${p.logo}" alt="Logo ${p.nama}" loading="lazy">`
      : `<div class="icon">${p.icon}</div>`;
    return `
    <div class="card">
      ${p.badge ? `<span class="tag">${p.badge}</span>` : ""}
      ${ikon}
      <h3>${p.nama}</h3>
      <p class="desc">${p.deskripsi}</p>
      <div class="price">${p.prefix || ""}${rupiah(p.harga)}<small>${p.satuan}</small></div>
      <button class="add-btn" onclick="tambahKeKeranjang(${i})">+ Keranjang</button>
    </div>`;
  }).join("");
}

/* ---------- Keranjang ---------- */
let keranjang = JSON.parse(localStorage.getItem("dikadev_cart") || "[]");

function simpan() {
  localStorage.setItem("dikadev_cart", JSON.stringify(keranjang));
  renderKeranjang();
}

function tambahKeKeranjang(i) {
  const ada = keranjang.find(k => k.i === i);
  if (ada) ada.qty++;
  else keranjang.push({ i, qty: 1 });
  simpan();
  toast("Ditambahkan ke keranjang ✓");
}

function ubahQty(i, d) {
  const item = keranjang.find(k => k.i === i);
  if (!item) return;
  item.qty += d;
  if (item.qty <= 0) keranjang = keranjang.filter(k => k.i !== i);
  simpan();
}

function hapusItem(i) {
  keranjang = keranjang.filter(k => k.i !== i);
  simpan();
}

function renderKeranjang() {
  const box = $("cartItems");
  const count = keranjang.reduce((s, k) => s + k.qty, 0);
  const total = keranjang.reduce((s, k) => s + k.qty * PRODUK[k.i].harga, 0);
  $("cartCount").textContent = count;
  $("cartTotal").textContent = rupiah(total);

  if (!keranjang.length) {
    box.innerHTML = `<p class="empty">Keranjang masih kosong.<br>Yuk pilih produk dulu!</p>`;
    return;
  }
  box.innerHTML = keranjang.map(k => {
    const p = PRODUK[k.i];
    const label = p.prefix ? p.prefix + p.nama : p.nama;
    return `
      <div class="cart-item">
        <div class="row1">
          <span class="name">${label}</span>
          <button class="rm" onclick="hapusItem(${k.i})" aria-label="Hapus">🗑️</button>
        </div>
        <div class="row2">
          <div class="qty">
            <button onclick="ubahQty(${k.i}, -1)">−</button>
            <span>${k.qty}</span>
            <button onclick="ubahQty(${k.i}, 1)">+</button>
          </div>
          <span class="sub">${rupiah(p.harga * k.qty)}</span>
        </div>
      </div>`;
  }).join("");
}

/* ---------- Checkout via WhatsApp ---------- */
function checkout() {
  if (!keranjang.length) { toast("Keranjang masih kosong"); return; }
  const baris = keranjang.map((k, n) => {
    const p = PRODUK[k.i];
    return `${n + 1}. ${p.nama} x${k.qty} — ${rupiah(p.harga * k.qty)}`;
  });
  const total = keranjang.reduce((s, k) => s + k.qty * PRODUK[k.i].harga, 0);
  const pesan = `Halo DikaDev! Saya mau order:%0A%0A${baris.join("%0A")}%0A%0ATotal: ${rupiah(total)}%0A%0ATerima kasih!`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${pesan}`, "_blank");
}

/* ---------- Drawer & toast ---------- */
function bukaDrawer(o) {
  $("drawer").classList.toggle("show", o);
  $("overlay").classList.toggle("show", o);
}
let toastTimer;
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
}

/* ---------- FAQ ---------- */
const FAQ = [
  { q: "Bagaimana cara memesan?",
    a: `Pilih produk lalu klik "+ Keranjang". Buka keranjang, klik "Checkout via WhatsApp" — pesan order otomatis terkirim ke kami. Selanjutnya tinggal ikuti instruksi pembayaran di chat.` },
  { q: "Metode pembayaran apa saja yang diterima?",
    a: `Transfer bank dan e-wallet (DANA, OVO, GoPay, dll). Metode final disepakati saat chat WhatsApp setelah kamu checkout.` },
  { q: "Berapa lama layanan diproses?",
    a: `Maksimal 1x24 jam setelah pembayaran terkonfirmasi. Kebanyakan order selesai jauh lebih cepat dari itu.` },
  { q: "Apakah ada garansi?",
    a: `Ya. Jasa install dan produk panel bergaransi 7 hari untuk kendala teknis dari sisi instalasi kami. Klaim garansi cukup chat WhatsApp.` },
  { q: "Bagaimana jika layanan tidak terkirim?",
    a: `Kamu berhak atas refund penuh jika layanan gagal diserahkan karena kesalahan dari pihak kami. Detail lengkapnya ada di halaman <a href="refund.html">Kebijakan Refund</a>.` },
  { q: "Apakah data pribadi saya aman?",
    a: `Aman. Data (nama, nomor WA, email) hanya dipakai untuk memproses pesanan dan tidak dijual ke pihak ketiga. Selengkapnya di <a href="tos.html">Kebijakan Privasi</a>.` },
  { q: "Nomor virtual cara pakainya bagaimana?",
    a: `Setelah pembayaran, kamu menerima nomor virtualnya. Pakai nomor itu untuk menerima kode OTP/verifikasi di WhatsApp, Telegram, atau aplikasi lain yang didukung.` },
];

function renderFaq() {
  const list = $("faqList");
  if (!list) return;
  list.innerHTML = FAQ.map((f, i) => `
    <div class="faq-item">
      <button class="faq-q" onclick="toggleFaq(${i})" aria-expanded="false">${f.q}<span class="arrow">▼</span></button>
      <div class="faq-a" id="faqA${i}"><p>${f.a}</p></div>
    </div>`).join("");
}

function toggleFaq(i) {
  document.querySelectorAll(".faq-item").forEach((el, j) => {
    const ans = $("faqA" + j);
    const btn = el.querySelector(".faq-q");
    if (j === i) {
      const open = el.classList.toggle("open");
      ans.style.maxHeight = open ? ans.scrollHeight + "px" : "0";
      btn.setAttribute("aria-expanded", open);
    } else {
      el.classList.remove("open");
      ans.style.maxHeight = "0";
      btn.setAttribute("aria-expanded", "false");
    }
  });
}

/* ---------- Init ---------- */
$("cartOpen").onclick = () => bukaDrawer(true);
$("cartClose").onclick = () => bukaDrawer(false);
$("overlay").onclick = () => bukaDrawer(false);
$("checkoutBtn").onclick = checkout;
$("clearBtn").onclick = () => { keranjang = []; simpan(); };
$("waButton").href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Halo DikaDev! Saya mau tanya-tanya dulu.")}`;
const mailBtn = $("emailButton");
if (mailBtn) mailBtn.href = `mailto:${EMAIL}?subject=${encodeURIComponent("Tanya-tanya DikaDev Store")}`;

renderProduk();
renderFaq();
renderKeranjang();

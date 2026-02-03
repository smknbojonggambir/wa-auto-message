import fetch from "node-fetch";
import dayjs from "dayjs";
import "dayjs/locale/id.js";

dayjs.locale("id");

// ===== AMBIL DATA GOOGLE SHEET =====
const sheetURL = process.env.SHEET_URL;
const response = await fetch(sheetURL);
const csv = await response.text();

// parsing CSV sederhana
const rows = csv.split("\n").map(r => r.split(","));
const data = Object.fromEntries(
  rows.map(r => [r[0]?.trim(), r[1]?.trim()])
);

// ===== WAKTU DINAMIS =====
const hari = dayjs().format("dddd");
const tanggal = dayjs().format("DD MMMM YYYY");
const jam = dayjs().format("HH:mm");

// ===== PESAN =====
const message = `
📢 *${data.Kegiatan}*

🗓 Hari/Tanggal: ${hari}, ${tanggal}
⏰ Pukul: ${jam} WIB

${data.Pesan}

_${data.Penutup}_
`.trim();

// ===== KIRIM WA =====
const waURL = `https://api.callmebot.com/whatsapp.php?phone=${process.env.WA_GROUP_ID}&text=${encodeURIComponent(message)}&apikey=${process.env.WA_API_KEY}`;

await fetch(waURL);

console.log("Pesan WhatsApp terkirim ✔");

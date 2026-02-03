import fetch from "node-fetch";
import dayjs from "dayjs";
import "dayjs/locale/id.js";

dayjs.locale("id");

// ==================
// AMBIL DATA SHEET
// ==================
const res = await fetch(process.env.SHEET_URL);
const csv = await res.text();

const rows = csv
  .split("\n")
  .map(r => r.split(",").map(c => c.trim()));

const headers = rows.shift();

// ==================
// FILTER ABSEN
// ==================
const hadir = rows.filter(r =>
  r[1]?.toLowerCase() === "hadir" ||
  r[1]?.toLowerCase() === "absen"
);

if (hadir.length === 0) {
  console.log("Tidak ada data absen hari ini");
  process.exit(0);
}

// ==================
// WAKTU DINAMIS
// ==================
const hari = dayjs().format("dddd");
const tanggal = dayjs().format("DD MMMM YYYY");
const jam = dayjs().format("HH:mm");

// ==================
// FORMAT PESAN
// ==================
let daftar = hadir.map((r, i) =>
  `${i + 1}. ${r[0]} (${r[1]}) ${r[2] ? "- " + r[2] : ""}`
).join("\n");

const message = `
📋 *LAPORAN ABSENSI SISWA*

🗓 ${hari}, ${tanggal}
⏰ ${jam} WIB

${daftar}

_Terima kasih_
`.trim();

// ==================
// KIRIM KE WA
// ==================
const waURL = `https://api.callmebot.com/whatsapp.php?phone=${process.env.WA_GROUP_ID}&text=${encodeURIComponent(message)}&apikey=${process.env.WA_API_KEY}`;

await fetch(waURL);

console.log("Pesan absensi terkirim ✔");

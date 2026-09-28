// Database Standar Benang Bordir Rayon Star Elephant (Cap Gajah / PT Antelas Bandung)
export const THREAD_METADATA = {
  1179: { name: 'Putih Solid (Bleach White)', defaultHex: '#FFFFFF' },
  1180: { name: 'Hitam Solid (Black)', defaultHex: '#121212' },
  1164: { name: 'Broken White / Putih Tulang', defaultHex: '#F5EFE6' },
  1174: { name: 'Abu Terang / Silver Grey', defaultHex: '#9E9E9E' },
  1175: { name: 'Abu Sedang / Slate Grey', defaultHex: '#52525B' },
  1319: { name: 'Dongker Tua / Deep Navy', defaultHex: '#0B192C' },
  1070: { name: 'Biru Navy / Classic Navy', defaultHex: '#1E3A8A' },
  1320: { name: 'Biru Benhur / Royal Blue', defaultHex: '#1D4ED8' },
  1323: { name: 'Biru Hitam / Dark Ink', defaultHex: '#0A0E1A' },
  2216: { name: 'Coklat Susu / Beige Khaki', defaultHex: '#D4B996' },
  2212: { name: 'Camel / Khaki Sedang', defaultHex: '#A77B52' },
  1144: { name: 'Coklat Kopi / Coklat Tua', defaultHex: '#3A2318' },
  1184: { name: 'Coklat Mocca / Mocca Brown', defaultHex: '#664735' },
  1135: { name: 'Kuning Kunyit / Mustard', defaultHex: '#D97706' },
  1304: { name: 'Merah Maroon / Maroon Tua', defaultHex: '#5B142B' },

  // Database Tambahan Katalog Rayon Garmen Lokal
  1001: { name: 'Putih Bersih (Pure White)', defaultHex: '#FFFFFF' },
  1002: { name: 'Krem Putih / Off White', defaultHex: '#FBF8F1' },
  1128: { name: 'Krem Muda / Cream', defaultHex: '#F3E5C8' },
  1130: { name: 'Kuning Lemon', defaultHex: '#FACC15' },
  1131: { name: 'Kuning Terang', defaultHex: '#EAB308' },
  1138: { name: 'Kuning Emas / Gold', defaultHex: '#CA8A04' },
  1150: { name: 'Orange / Jingga', defaultHex: '#EA580C' },
  1188: { name: 'Merah Cabe / Bright Red', defaultHex: '#DC2626' },
  1190: { name: 'Merah Hati / Crimson', defaultHex: '#991B1B' },
  1205: { name: 'Pink Muda / Baby Pink', defaultHex: '#F472B6' },
  1210: { name: 'Fanta / Magenta', defaultHex: '#DB2777' },
  1240: { name: 'Hijau Daun / Kelly Green', defaultHex: '#16A34A' },
  1245: { name: 'Hijau Botol / Dark Green', defaultHex: '#14532D' },
  1250: { name: 'Hijau Army / Olive', defaultHex: '#4D5D3A' },
  1280: { name: 'Ungu Terong / Deep Violet', defaultHex: '#581C87' },
  1300: { name: 'Biru Langit / Sky Blue', defaultHex: '#38BDF8' },
  1310: { name: 'Biru Turkis / Cyan', defaultHex: '#0284C7' },
};

export const DEFAULT_COLOR_MAP = Object.fromEntries(
  Object.entries(THREAD_METADATA).map(([k, v]) => [k, v.defaultHex])
);

export const PREFERRED_FIXED_ORDER = [
  '1179', '1320', '1319', '2216', '1135', '1144', '1184', '1070', '1175', '1304'
];

/**
 * Mengambil kode warna HEX benang berdasarkan kode benang.
 * Mendukung override dari customColorMap (jika user mengubah warna manual).
 */
export function getThreadColor(code, customColorMap = {}) {
  if (!code || code === '-') return '#3f3f46';
  if (customColorMap[code]) return customColorMap[code];
  if (DEFAULT_COLOR_MAP[code]) return DEFAULT_COLOR_MAP[code];

  // Deterministic hash fallback jika kode belum ada di katalog
  let hash = 0;
  const str = String(code);
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
}

/**
 * Menentukan warna teks (gelap #09090b atau terang #ffffff)
 * agar teks kontras dan terbaca di atas warna latar belakang hexColor.
 */
export function getTextColor(hexColor) {
  if (!hexColor || hexColor.length < 7) return '#ffffff';
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 140 ? '#09090b' : '#ffffff';
}

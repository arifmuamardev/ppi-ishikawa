// Browser-only certificate studio helpers. No participant data is sent to a server.
export const MAX_RECIPIENTS = 200;

export function normalizeNames(values) {
  const seen = new Set();
  const names = [];
  for (const value of values) {
    const name = String(value || '').normalize('NFC').replace(/\s+/g, ' ').trim();
    if (!name || /^(nama( lengkap)?|full ?name|name|peserta|participant)$/i.test(name)) continue;
    if (name.length > 120) throw new Error('Nama penerima terlalu panjang (maksimum 120 karakter).');
    const key = name.toLocaleLowerCase('id-ID');
    if (seen.has(key)) continue;
    seen.add(key);
    names.push(name);
    if (names.length > MAX_RECIPIENTS) throw new Error(`Maksimum ${MAX_RECIPIENTS} nama dalam satu berkas PDF. Pisahkan daftar peserta menjadi beberapa kelompok.`);
  }
  return names;
}

export function namesFromText(text) {
  // People can paste an Excel Name column: one name or a tab-separated row per line.
  return normalizeNames(String(text || '').replace(/^\uFEFF/, '').split(/\r?\n/).map((line) => line.split('\t')[0]));
}

export function parseDelimitedRows(content) {
  // RFC4180-style CSV/TSV with quoted fields and escaped double quotes.
  const text = String(content || '').replace(/^\uFEFF/, '');
  const delimiter = text.split(/\r?\n/)[0]?.includes('\t') ? '\t' : ',';
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (quoted && text[i + 1] === '"') { field += '"'; i++; }
      else if (!field || quoted) quoted = !quoted;
      else field += ch;
    } else if (!quoted && ch === delimiter) {
      row.push(field); field = '';
    } else if (!quoted && (ch === '\n' || ch === '\r')) {
      row.push(field);
      if (row.some((value) => value.trim())) rows.push(row);
      row = []; field = '';
      if (ch === '\r' && text[i + 1] === '\n') i++;
    } else {
      field += ch;
    }
  }
  if (quoted) throw new Error('File CSV tidak valid: tanda kutip belum ditutup.');
  row.push(field);
  if (row.some((value) => value.trim())) rows.push(row);
  return rows;
}

export function namesFromCsv(content) {
  const rows = parseDelimitedRows(content);
  if (!rows.length) return [];
  const headings = rows[0].map((value) => value.replace(/\s+/g, ' ').trim().toLowerCase());
  const index = headings.findIndex((value) => /^(nama|nama lengkap|full name|name|participant|peserta|nama peserta)$/i.test(value));
  const nameIndex = index >= 0 ? index : 0;
  return normalizeNames(rows.slice(index >= 0 ? 1 : 0).map((row) => row[nameIndex] || ''));
}

export function safeCertificateFileName(eventName) {
  const slug = String(eventName || 'kegiatan').normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '').slice(0, 65) || 'kegiatan';
  return `sertifikat-ppi-ishikawa-${slug}.pdf`;
}

export function indonesianDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return 'Tanggal kegiatan';
  const parsed = new Date(`${date}T12:00:00+09:00`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date)
    return 'Tanggal kegiatan';
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeZone: 'Asia/Tokyo' }).format(parsed);
}

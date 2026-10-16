/**
 * A QR in the offline Certificate Studio links to event information only.
 * It is NOT a verification token and must never claim certificate validity.
 */
export function normalizeCertificateInfoUrl(raw) {
  const value = String(raw ?? '').trim();
  if (!value) throw new Error('Isi tautan informasi kegiatan untuk QR.');
  if (value.length > 500) throw new Error('Tautan QR terlalu panjang (maksimal 500 karakter).');
  let url;
  try { url = new URL(value); } catch { throw new Error('Tautan QR tidak valid. Gunakan alamat lengkap https://…'); }
  if (url.protocol !== 'https:' || !url.hostname || url.username || url.password)
    throw new Error('Tautan QR harus HTTPS tanpa nama pengguna atau kata sandi.');
  return url.toString();
}

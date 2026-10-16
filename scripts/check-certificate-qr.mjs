import assert from 'node:assert/strict';
import { normalizeCertificateInfoUrl } from '../src/lib/certificate-qr.mjs';

assert.equal(normalizeCertificateInfoUrl(' https://ppi-ishikawa.org/events/ '), 'https://ppi-ishikawa.org/events/');
assert.equal(normalizeCertificateInfoUrl('https://example.org/?event=1'), 'https://example.org/?event=1');
for (const value of ['', 'ppi-ishikawa.org', 'http://ppi-ishikawa.org/', 'javascript:alert(1)',
  'https://user:pass@example.com/', 'https://' ]) {
  assert.throws(() => normalizeCertificateInfoUrl(value), Error, 'Expected invalid URL: ' + value);
}
assert.throws(() => normalizeCertificateInfoUrl('https://example.org/?' + 'a'.repeat(520)), /panjang/);
console.log('Certificate information QR URL validation passed.');

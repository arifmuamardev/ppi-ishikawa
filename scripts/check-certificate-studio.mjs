import assert from 'node:assert/strict';
import { namesFromText, namesFromCsv, normalizeNames, parseDelimitedRows, safeCertificateFileName, indonesianDate, MAX_RECIPIENTS } from '../src/lib/certificate-studio.mjs';

assert.deepEqual(namesFromText('Nama Lengkap\n  Siti Aminah  \nSiti  Aminah\nBudi Santoso\tstudent@example.com'), ['Siti Aminah', 'Budi Santoso']);
assert.deepEqual(namesFromCsv('email,nama lengkap,catatan\na@example.com,"Rina, S.T.",Peserta\nb@example.com,"Dewi ""D""",Pembicara'), ['Rina, S.T.', 'Dewi "D"']);
assert.deepEqual(namesFromCsv('Name\tEmail\r\nTari Kusuma\ta@example.com\r\n'), ['Tari Kusuma']);
assert.deepEqual(parseDelimitedRows('Nama,Catatan\n"Rina\nPutri",Peserta'), [['Nama','Catatan'], ['Rina\nPutri','Peserta']]);
assert.deepEqual(normalizeNames(['A', 'a', ' B  C ', 'b c']), ['A','B C']);
assert.throws(() => namesFromCsv('Nama\n"Unclosed'), /tidak valid/);
assert.throws(() => normalizeNames(Array.from({length:MAX_RECIPIENTS+1},(_,i)=>'Name '+i)), /Maksimum/);
assert.equal(safeCertificateFileName('Festival Seni & Budaya 2026'), 'sertifikat-ppi-ishikawa-festival-seni-budaya-2026.pdf');
assert.match(indonesianDate('2026-10-16'), /16 Oktober 2026/);
assert.equal(indonesianDate('2026-13-20'), 'Tanggal kegiatan');
console.log('Certificate Studio: CSV, paste, validation, deduplication and file naming passed.');

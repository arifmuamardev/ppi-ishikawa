import { brandTheme } from '../data/brand';
// Branded A4-landscape renderer shared by preview and PDF export.
// Canvas-based output supports browser-loaded fonts and Unicode participant names.
export const CERTIFICATE_WIDTH = 1800;
export const CERTIFICATE_HEIGHT = 1273;

function centered(ctx, text, y, maxWidth, requested, min = 28, color = '#103d40', weight = 600) {
  let size = requested;
  const value = String(text || '').trim();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  while (size > min) {
    ctx.font = `${weight} ${size}px "Fira Sans", Arial, sans-serif`;
    if (ctx.measureText(value).width <= maxWidth) break;
    size -= 2;
  }
  ctx.font = `${weight} ${size}px "Fira Sans", Arial, sans-serif`;
  let display = value;
  while (ctx.measureText(display).width > maxWidth && display.length > 1)
    display = display.slice(0, -2) + '…';
  ctx.fillText(display, CERTIFICATE_WIDTH / 2, y);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

export function renderCertificate(canvas, data) {
  const { event, date, category, organizer, recipient, signer, signerRole, logo, signature } = data;
  canvas.width = CERTIFICATE_WIDTH;
  canvas.height = CERTIFICATE_HEIGHT;
  const c = canvas.getContext('2d');
  if (!c) throw new Error('Browser tidak mendukung Canvas 2D.');

  const W = CERTIFICATE_WIDTH, H = CERTIFICATE_HEIGHT;
  c.fillStyle = '#fffefa';
  c.fillRect(0, 0, W, H);
  c.fillStyle = '#103d40';
  c.fillRect(0, 0, W, 34);
  c.fillRect(0, H - 34, W, 34);
  c.fillStyle = '#d9ad78';
  c.fillRect(0, 34, W, 8);
  c.fillRect(0, H - 42, W, 8);
  c.strokeStyle = 'rgba(16,61,64,.22)';
  c.lineWidth = 3;
  c.strokeRect(72, 87, W - 144, H - 174);

  // Light organic contour accents, echoing the Ishikawa website's visual language.
  c.save();
  c.strokeStyle = 'rgba(23,107,106,.10)';
  c.lineWidth = 5;
  for (let i = 0; i < 5; i++) {
    c.beginPath();
    c.ellipse(1760, 190, 420 + i * 30, 245 + i * 30, -0.25, 0, Math.PI * 2);
    c.stroke();
    c.beginPath();
    c.ellipse(70, 1120, 380 + i * 35, 180 + i * 30, 0.18, 0, Math.PI * 2);
    c.stroke();
  }
  c.restore();

  // Official logo asset; no fake seals or unregistered QR codes.
  if (logo?.complete && logo.naturalWidth > 0) {
    const ratio = logo.naturalWidth / logo.naturalHeight;
    const h = 105, w = h * ratio;
    c.drawImage(logo, W / 2 - w / 2, 124, w, h);
  }

  centered(c, 'PPI JEPANG · KOMISARIAT ISHIKAWA', 262, 1350, 29, 20, brandTheme.colors.secondary, 700);
  c.strokeStyle = '#d9ad78';
  c.lineWidth = 4;
  c.beginPath();
  c.moveTo(650, 312);
  c.lineTo(1150, 312);
  c.stroke();

  centered(c, 'SERTIFIKAT', 390, 1460, 96, 54, '#103d40', 800);
  centered(c, 'Diberikan kepada', 474, 1200, 28, 20, '#64748b', 400);
  centered(c, recipient || 'Nama Penerima', 558, 1530, 83, 34, '#103d40', 700);

  c.strokeStyle = '#d9ad78';
  c.lineWidth = 2;
  c.beginPath(); c.moveTo(450, 628); c.lineTo(1350, 628); c.stroke();

  centered(c, `Atas kontribusi sebagai ${category || 'Peserta'} dalam kegiatan`, 692, 1480, 33, 23, '#465d5d', 400);
  centered(c, event || 'Nama Kegiatan', 759, 1510, 58, 28, '#103d40', 700);
  centered(c, `Diselenggarakan oleh ${organizer || 'PPI Jepang Komisariat Ishikawa'}`, 820, 1450, 28, 19, '#526666', 400);
  centered(c, `pada ${date || 'Tanggal kegiatan'}`, 872, 1300, 29, 19, '#526666', 400);

  // Optional transparent PNG signature, uploaded locally with owner permission.
  if (signature?.complete && signature.naturalWidth > 0) {
    const maxW = 265, maxH = 100;
    const ratio = Math.min(maxW / signature.naturalWidth, maxH / signature.naturalHeight);
    const w = signature.naturalWidth * ratio, h = signature.naturalHeight * ratio;
    c.drawImage(signature, W / 2 - w / 2, 944, w, h);
  }

  c.strokeStyle = '#a3a9a6'; c.lineWidth = 2;
  c.beginPath(); c.moveTo(655, 1054); c.lineTo(1145, 1054); c.stroke();
  centered(c, signer || 'Nama penanda tangan', 1092, 1000, 31, 23, '#103d40', 700);
  centered(c, signerRole || 'PPI Jepang Komisariat Ishikawa', 1140, 1050, 24, 18, '#64748b', 400);
  return canvas;
}

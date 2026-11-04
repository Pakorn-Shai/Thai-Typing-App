import { TypingStats } from '../types/typing';
import { formatTime } from './metrics';

/**
 * Renders a stylized 1200x630 result card on an off-screen canvas.
 */
export async function generateResultCardBlob(
  stats: TypingStats,
  title: string
): Promise<Blob | null> {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 1200, 630);
  bgGrad.addColorStop(0, '#020617'); // slate-950
  bgGrad.addColorStop(0.5, '#0f172a'); // slate-900
  bgGrad.addColorStop(1, '#082f49'); // sky-950
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1200, 630);

  // Decorative glow
  const glow = ctx.createRadialGradient(950, 150, 10, 950, 150, 400);
  glow.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
  glow.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 1200, 630);

  // Border frame
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 30, 1140, 570);

  // Header: Logo and Title
  ctx.fillStyle = '#38bdf8'; // sky-400
  ctx.font = 'bold 36px "Inter", "Prompt", sans-serif';
  ctx.fillText('⌨️ Thai Typing Lab', 70, 90);

  ctx.fillStyle = '#94a3b8'; // slate-400
  ctx.font = '22px "Sarabun", "Prompt", sans-serif';
  ctx.fillText(title, 70, 130);

  // Rating badge
  let ratingText = 'คล่องแคล่วดี (Intermediate)';
  let ratingColor = '#34d399'; // emerald
  if (stats.cpm >= 250) {
    ratingText = 'ระดับเซียน (Expert)';
    ratingColor = '#fbbf24'; // amber
  } else if (stats.cpm >= 180) {
    ratingText = 'รวดเร็วมาก (Advanced)';
    ratingColor = '#38bdf8'; // sky
  } else if (stats.cpm < 120) {
    ratingText = 'กำลังพัฒนา (Beginner)';
    ratingColor = '#818cf8'; // indigo
  }

  // Draw Rating Box
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.strokeStyle = ratingColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(850, 65, 280, 55, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = ratingColor;
  ctx.font = 'bold 20px "Sarabun", "Prompt", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(ratingText, 990, 100);
  ctx.textAlign = 'left';

  // Divider
  ctx.strokeStyle = 'rgba(51, 65, 85, 0.8)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(70, 165);
  ctx.lineTo(1130, 165);
  ctx.stroke();

  // 4 Metric Cards
  const cards = [
    { label: 'CPM (อักขระ/นาที)', val: `${stats.cpm}`, sub: 'Characters / Min', color: '#38bdf8' },
    { label: 'WPM (คำ/นาที)', val: `${stats.wpm}`, sub: 'Normalized (CPM/5)', color: '#818cf8' },
    { label: 'ความแม่นยำ', val: `${stats.accuracy}%`, sub: `${stats.correctChars}/${stats.totalTyped} คีย์`, color: '#34d399' },
    { label: 'เวลาที่ใช้', val: formatTime(stats.elapsedSeconds), sub: `${stats.incorrectChars} ข้อผิดพลาด`, color: '#fbbf24' },
  ];

  const cardW = 245;
  const cardH = 220;
  const startX = 70;
  const gap = 26;
  const cardY = 200;

  cards.forEach((c, i) => {
    const x = startX + i * (cardW + gap);

    // Card background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, cardY, cardW, cardH, 20);
    ctx.fill();
    ctx.stroke();

    // Metric Label
    ctx.fillStyle = c.color;
    ctx.font = 'bold 18px "Prompt", "Sarabun", sans-serif';
    ctx.fillText(c.label, x + 24, cardY + 45);

    // Metric Big Value
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 54px "JetBrains Mono", monospace';
    ctx.fillText(c.val, x + 24, cardY + 125);

    // Metric Subtitle
    ctx.fillStyle = '#64748b';
    ctx.font = '16px "Sarabun", "Prompt", sans-serif';
    ctx.fillText(c.sub, x + 24, cardY + 175);
  });

  // Footer: App signature & Date
  const dateStr = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  ctx.fillStyle = '#475569';
  ctx.font = '18px "Sarabun", "Prompt", sans-serif';
  ctx.fillText(`บันทึกผลเมื่อ: ${dateStr} • Local-first Privacy Certified`, 70, 540);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 18px "Inter", sans-serif';
  ctx.fillText('Thai Typing Lab • ฝึกพิมพ์สัมผัสไทย-อังกฤษ', 750, 540);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}

/**
 * Triggers browser download of result card PNG.
 */
export async function downloadResultCardImage(
  stats: TypingStats,
  title: string
): Promise<void> {
  const blob = await generateResultCardBlob(stats, title);
  if (!blob) return;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `thai-typing-result-${Date.now()}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Copies the result card image to clipboard (supported on modern browsers).
 */
export async function copyResultCardImage(
  stats: TypingStats,
  title: string
): Promise<boolean> {
  try {
    const blob = await generateResultCardBlob(stats, title);
    if (!blob) return false;

    if (navigator.clipboard && 'write' in navigator.clipboard) {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}


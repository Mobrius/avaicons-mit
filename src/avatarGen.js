// src/avatarGen.js
// MIT License — freely usable also for commercial projects

// ============================================================
// RNG deterministico
// ============================================================
function xmur3(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function prngFromString(seed) {
  const seedFn = xmur3(String(seed));
  return mulberry32(seedFn());
}
function randInt(r, min, max) {
  return Math.floor(r() * (max - min + 1)) + min;
}
function pick(r, arr) {
  return arr[Math.floor(r() * arr.length)];
}

// ============================================================
// Colori & utils
// ============================================================
const PALETTES = [
  ['#F2F4F6', '#1F7A8C', '#022B3A', '#BFDBF7', '#E1E5F2'],
  ['#FFF7ED', '#FF7A59', '#2F4858', '#86BBD8', '#F6AE2D'],
  ['#F8FAFC', '#7C3AED', '#0EA5E9', '#34D399', '#F59E0B'],
  ['#FDF2F8', '#DB2777', '#2563EB', '#10B981', '#FBBF24'],
  ['#F1F5F9', '#0F172A', '#2563EB', '#22C55E', '#E11D48'],
  ['#FFF1F2', '#9D174D', '#4338CA', '#0891B2', '#84CC16'],
  ['#FFFDE7', '#F59E0B', '#2563EB', '#059669', '#111827']
];
function hexToRgb(hex){const h=hex.replace('#','');const i=parseInt(h,16);return{r:(i>>16)&255,g:(i>>8)&255,b:i&255}}
function relLuma({r,g,b}){const t=c=>{c/=255;return c<=.03928?c/12.92:Math.pow((c+.055)/1.055,2.4)};const R=t(r),G=t(g),B=t(b);return .2126*R+.7152*G+.0722*B}
function contrastRatio(a,b){const L1=relLuma(hexToRgb(a));const L2=relLuma(hexToRgb(b));const [light,dark]=L1>L2?[L1,L2]:[L2,L1];return (light+.05)/(dark+.05)}
function bestTextColor(bg){return contrastRatio(bg,'#000')>=contrastRatio(bg,'#fff') ? '#000' : '#fff'}
function getPalette(r){return pick(r,PALETTES)}
function svgWrap(size, content, bg, ariaLabel='avatar'){
  const bgRect = bg ? `<rect width="${size}" height="${size}" fill="${bg}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" shape-rendering="geometricPrecision" role="img" aria-label="${ariaLabel}">${bgRect}${content}</svg>`;
}
function svgToDataUrl(svg){
  const base64 = (typeof Buffer !== 'undefined')
    ? Buffer.from(svg, 'utf-8').toString('base64')
    : btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${base64}`;
}

// ============================================================
// Variant: IDENTICON
// ============================================================
function variantIdenticon(r, size, palette) {
  const [bg, c1, c2, c3] = palette;
  const cols=5, rows=5;
  const cell=Math.floor(size/cols);
  const pad=Math.floor(cell*0.12);
  const radius=Math.floor(cell*0.25);
  let g='';
  for(let y=0;y<rows;y++){
    const half=Array.from({length:Math.ceil(cols/2)},()=>r()>0.5);
    const row=[...half,...half.slice(0,Math.floor(cols/2)).reverse()];
    for(let x=0;x<cols;x++){
      if(!row[x]) continue;
      const xx=x*cell+pad, yy=y*cell+pad;
      const w=cell-pad*2, h=cell-pad*2;
      const col=pick(r,[c1,c2,c3]);
      g+=`<rect x="${xx}" y="${yy}" width="${w}" height="${h}" rx="${radius}" ry="${radius}" fill="${col}" opacity="0.95"/>`;
    }
  }
  g+=`<rect x="1" y="1" width="${size-2}" height="${size-2}" rx="${Math.floor(size*0.18)}" ry="${Math.floor(size*0.18)}" fill="none" stroke="rgba(0,0,0,0.06)"/>`;
  return svgWrap(size,g,bg,'identicon avatar');
}

// ============================================================
// Variant: INITIALS  (MIT-friendly, no deps)
// ============================================================
function getInitials(name){
  if(!name) return '?';
  const parts=String(name).trim().split(/\s+|[_\-\.]+/).filter(Boolean);
  if(!parts.length) return String(name).slice(0,2).toUpperCase();
  const a=parts[0][0]||'', b=parts[1]?.[0]||'';
  return (a+b).toUpperCase();
}

function variantInitials(r, size, palette, name){
  const [bg, c1, c2, c3, c4] = palette;
  const ring = pick(r, [c1, c2, c3, c4]);
  const initials = escapeXML(getInitials(name));

  const cx = size / 2, cy = size / 2;

  // metriche unificate (match con sito, ma senza raster)
  const rad      = Math.round(size * 0.48);
  const ringW    = Math.max(2, Math.round(size * 0.06));
  const fontSize = Math.round(size * 0.46);
  const dy       = Math.round(size * 0.02);

  const textColor = bestTextColor(bg);

  const g =
    `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="${bg}"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${rad - ringW/2}" fill="none" stroke="${ring}" stroke-width="${ringW}" opacity="0.85"/>` +
    `<text x="50%" y="50%" text-anchor="middle"
       font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
       font-size="${fontSize}" font-weight="700"
       fill="${textColor}" dominant-baseline="central" dy="${dy}">${initials}</text>`;

  return svgWrap(size, g, null, 'initials avatar');
}

// ============================================================
// Variant: PIXEL ART
// ============================================================
function variantPixel(r, size, palette, overrides = {}) {
  const [bg, c1, c2, c3, c4] = palette;
  const cols = overrides.cols || 10;
  const rows = overrides.rows || 10;
  const symmetry = overrides.symmetry ?? true;
  const density = overrides.density ?? 0.55;

  const cell = Math.max(1, Math.floor(size / Math.max(cols, rows)));
  const gridW = cell * cols;
  const gridH = cell * rows;
  const offX = Math.floor((size - gridW) / 2);
  const offY = Math.floor((size - gridH) / 2);

  const inks = [c1, c2, c3, c4];

  let g = '';
  const round = Math.floor(size * 0.18);
  const maskId = `px${Math.floor(r() * 1e9)}`;
  const defs = `<defs><clipPath id="${maskId}"><rect width="${size}" height="${size}" rx="${round}" ry="${round}"/></clipPath></defs>`;

  g += `<rect width="${size}" height="${size}" fill="${bg}" />`;
  g += `<g clip-path="url(#${maskId})" shape-rendering="crispEdges">`;

  const baseCol = pick(r, [bg, '#FFFFFF', '#F8FAFC', '#00000010']);
  g += `<rect x="${offX}" y="${offY}" width="${gridW}" height="${gridH}" fill="${baseCol}" />`;

  const half = symmetry ? Math.ceil(cols / 2) : cols;
  for (let y = 0; y < rows; y++) {
    const rowDensity = Math.min(0.95, Math.max(0.05, density + (r() - 0.5) * 0.08));
    const pattern = Array.from({ length: half }, () => r() < rowDensity);
    for (let x = 0; x < half; x++) {
      if (!pattern[x]) continue;
      const color = pick(r, inks);
      const xx = offX + x * cell;
      const yy = offY + y * cell;
      g += `<rect x="${xx}" y="${yy}" width="${cell}" height="${cell}" fill="${color}" />`;

      if (symmetry) {
        const mx = cols - 1 - x;
        const xx2 = offX + mx * cell;
        if (mx !== x) {
          g += `<rect x="${xx2}" y="${yy}" width="${cell}" height="${cell}" fill="${color}" />`;
        }
      }
    }
  }

  g += `<rect x="${offX+0.5}" y="${offY+0.5}" width="${gridW-1}" height="${gridH-1}" fill="none" stroke="rgba(0,0,0,0.08)" />`;
  g += `</g>`;

  return svgWrap(size, defs + g, null, 'pixel avatar');
}

// ============================================================
// API
// ============================================================
/**
 * generateAvatarSVG(seed, {
 *   size: 128,
 *   variant: 'identicon' | 'initials' | 'pixel',
 *   paletteIndex: number | null,
 *   nameForInitials: string | null,
 *   pixelOverrides?: {...}
 * })
 */
export function generateAvatarSVG(seed, {
  size = 128,
  variant = 'identicon',
  paletteIndex = null,
  nameForInitials = null,
  pixelOverrides = null,
} = {}) {
  const r = prngFromString(String(seed));
  const pal = paletteIndex != null ? PALETTES[paletteIndex % PALETTES.length] : getPalette(r);
  if (variant === 'identicon') return variantIdenticon(r, size, pal);
  if (variant === 'initials')  return variantInitials(r, size, pal, nameForInitials ?? String(seed));
  if (variant === 'pixel')     return variantPixel(r, size, pal, pixelOverrides || {});
  throw new Error("Unknown variant: " + variant);
}

export function avatarDataUrl(seed, opts={}) {
  const svg = generateAvatarSVG(seed, opts);
  return svgToDataUrl(svg);
}

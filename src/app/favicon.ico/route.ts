import { NextResponse } from 'next/server';

const SIZE = 32;
const HEADER_SIZE = 6;
const ENTRY_SIZE = 16;
const BMP_INFO_HEADER_SIZE = 40;
const MASK_ROW_BYTES = Math.ceil(SIZE / 32) * 4;
const MASK_SIZE = MASK_ROW_BYTES * SIZE;
const PIXEL_SIZE = SIZE * SIZE * 4;
const IMAGE_SIZE = BMP_INFO_HEADER_SIZE + PIXEL_SIZE + MASK_SIZE;
const FILE_SIZE = HEADER_SIZE + ENTRY_SIZE + IMAGE_SIZE;
const ICON_OFFSET = HEADER_SIZE + ENTRY_SIZE;

let cachedIcon: Buffer | null = null;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function mix(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function sdRoundRect(
  px: number,
  py: number,
  cx: number,
  cy: number,
  halfW: number,
  halfH: number,
  radius: number
) {
  const dx = Math.abs(px - cx) - (halfW - radius);
  const dy = Math.abs(py - cy) - (halfH - radius);
  const ox = Math.max(dx, 0);
  const oy = Math.max(dy, 0);
  const outside = Math.hypot(ox, oy);
  const inside = Math.min(Math.max(dx, dy), 0);
  return outside + inside - radius;
}

function sdBox(px: number, py: number, cx: number, cy: number, halfW: number, halfH: number) {
  const dx = Math.abs(px - cx) - halfW;
  const dy = Math.abs(py - cy) - halfH;
  const ox = Math.max(dx, 0);
  const oy = Math.max(dy, 0);
  const outside = Math.hypot(ox, oy);
  const inside = Math.min(Math.max(dx, dy), 0);
  return outside + inside;
}

function blendPixel(
  pixels: Uint8ClampedArray,
  x: number,
  y: number,
  r: number,
  g: number,
  b: number,
  a: number
) {
  if (x < 0 || y < 0 || x >= SIZE || y >= SIZE || a <= 0) return;

  const idx = (y * SIZE + x) * 4;
  const srcA = clamp(a);
  const dstA = pixels[idx + 3] / 255;
  const outA = srcA + dstA * (1 - srcA);
  if (outA <= 0) return;

  const outR = (r * srcA + pixels[idx] * dstA * (1 - srcA)) / outA;
  const outG = (g * srcA + pixels[idx + 1] * dstA * (1 - srcA)) / outA;
  const outB = (b * srcA + pixels[idx + 2] * dstA * (1 - srcA)) / outA;

  pixels[idx] = Math.round(outR);
  pixels[idx + 1] = Math.round(outG);
  pixels[idx + 2] = Math.round(outB);
  pixels[idx + 3] = Math.round(outA * 255);
}

function drawBackground(pixels: Uint8ClampedArray) {
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const px = x + 0.5;
      const py = y + 0.5;

      const d = sdRoundRect(px, py, 16, 16, 15, 15, 6.2);
      const fillAlpha = 1 - smoothstep(-0.8, 0.8, d);
      if (fillAlpha <= 0) continue;

      const t = (x + y) / (2 * (SIZE - 1));
      let r = mix(12, 28, t);
      let g = mix(18, 33, t);
      let b = mix(30, 46, t);

      const glow = Math.exp(-((px - 8) ** 2 + (py - 7) ** 2) / 58);
      r += glow * 20;
      g += glow * 10;
      b += glow * 3;
      blendPixel(pixels, x, y, r, g, b, fillAlpha);

      const borderOuter = 1 - smoothstep(-1.6, 0.9, d);
      const borderInner = 1 - smoothstep(-3.6, -1.0, d);
      const border = clamp(borderOuter - borderInner);
      if (border > 0) {
        blendPixel(pixels, x, y, 234, 97, 26, border * 0.95);
      }
    }
  }
}

function drawLogo(pixels: Uint8ClampedArray) {
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const px = x + 0.5;
      const py = y + 0.5;

      // O ring (left)
      const oDist = Math.hypot(px - 10.2, py - 16);
      const oOuter = 1 - smoothstep(4.7, 6.0, oDist);
      const oInner = smoothstep(2.8, 3.9, oDist);
      const oRing = oOuter * oInner;
      if (oRing > 0) {
        blendPixel(pixels, x, y, 255, 133, 52, oRing * 0.98);
        const angle = Math.atan2(py - 16, px - 10.2);
        if (angle > -0.9 && angle < 0.25) {
          blendPixel(pixels, x, y, 255, 244, 236, oRing * 0.3);
        }
      }

      // B stem (right)
      const stemD = sdBox(px, py, 17.1, 16, 1.25, 7.2);
      const stem = 1 - smoothstep(-0.7, 0.7, stemD);
      if (stem > 0) {
        blendPixel(pixels, x, y, 246, 248, 251, stem * 0.96);
      }

      // B upper bowl
      const tDist = Math.hypot(px - 19.5, py - 12.4);
      const tOuter = 1 - smoothstep(3.0, 4.0, tDist);
      const tInner = smoothstep(1.2, 2.2, tDist);
      const tHalf = smoothstep(16.9, 17.9, px);
      const tBowl = tOuter * tInner * tHalf;
      if (tBowl > 0) {
        blendPixel(pixels, x, y, 247, 249, 252, tBowl * 0.95);
        if (py < 12.7) {
          blendPixel(pixels, x, y, 255, 138, 60, tBowl * 0.35);
        }
      }

      // B lower bowl
      const bDist = Math.hypot(px - 19.5, py - 19.4);
      const bOuter = 1 - smoothstep(3.0, 4.0, bDist);
      const bInner = smoothstep(1.2, 2.2, bDist);
      const bHalf = smoothstep(16.9, 17.9, px);
      const bBowl = bOuter * bInner * bHalf;
      if (bBowl > 0) {
        blendPixel(pixels, x, y, 247, 249, 252, bBowl * 0.95);
      }

      // Accent dot
      const dot = 1 - smoothstep(0.25, 1.35, Math.hypot(px - 23.8, py - 8.8));
      if (dot > 0) {
        blendPixel(pixels, x, y, 255, 132, 49, dot * 0.95);
      }
    }
  }
}

function createRgbaPixels() {
  const pixels = new Uint8ClampedArray(SIZE * SIZE * 4);
  drawBackground(pixels);
  drawLogo(pixels);
  return pixels;
}

function encodeIco(rgba: Uint8ClampedArray) {
  const out = Buffer.alloc(FILE_SIZE);

  // ICONDIR
  out.writeUInt16LE(0, 0); // reserved
  out.writeUInt16LE(1, 2); // icon type
  out.writeUInt16LE(1, 4); // image count

  // ICONDIRENTRY
  out[6] = SIZE; // width
  out[7] = SIZE; // height
  out[8] = 0; // palette colors
  out[9] = 0; // reserved
  out.writeUInt16LE(1, 10); // planes
  out.writeUInt16LE(32, 12); // bit count
  out.writeUInt32LE(IMAGE_SIZE, 14); // resource size
  out.writeUInt32LE(ICON_OFFSET, 18); // resource offset

  // BITMAPINFOHEADER
  out.writeUInt32LE(BMP_INFO_HEADER_SIZE, ICON_OFFSET + 0);
  out.writeInt32LE(SIZE, ICON_OFFSET + 4);
  out.writeInt32LE(SIZE * 2, ICON_OFFSET + 8); // color + mask height
  out.writeUInt16LE(1, ICON_OFFSET + 12); // planes
  out.writeUInt16LE(32, ICON_OFFSET + 14); // bpp
  out.writeUInt32LE(0, ICON_OFFSET + 16); // BI_RGB
  out.writeUInt32LE(PIXEL_SIZE, ICON_OFFSET + 20);
  out.writeInt32LE(0, ICON_OFFSET + 24);
  out.writeInt32LE(0, ICON_OFFSET + 28);
  out.writeUInt32LE(0, ICON_OFFSET + 32);
  out.writeUInt32LE(0, ICON_OFFSET + 36);

  // BGRA pixels, bottom-up
  const pixelOffset = ICON_OFFSET + BMP_INFO_HEADER_SIZE;
  for (let y = 0; y < SIZE; y++) {
    const srcY = SIZE - 1 - y;
    for (let x = 0; x < SIZE; x++) {
      const src = (srcY * SIZE + x) * 4;
      const dst = pixelOffset + (y * SIZE + x) * 4;
      out[dst] = rgba[src + 2];
      out[dst + 1] = rgba[src + 1];
      out[dst + 2] = rgba[src];
      out[dst + 3] = rgba[src + 3];
    }
  }

  // AND mask stays zeroed in Buffer.alloc (fully opaque where alpha > 0)
  return out;
}

function getIconBuffer() {
  if (cachedIcon) return cachedIcon;
  cachedIcon = encodeIco(createRgbaPixels());
  return cachedIcon;
}

export function GET() {
  return new NextResponse(new Uint8Array(getIconBuffer()), {
    headers: {
      'Content-Type': 'image/x-icon',
      'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}

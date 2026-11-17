import { LOGO_URL } from "./images";

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });
}

/** Resize to max 1600px and stamp the G10 logo in the bottom-right corner. */
export async function watermarkFile(file: File): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const [img, logo] = await Promise.all([loadImg(url), loadImg(LOGO_URL)]);
    const scale = Math.min(1, 1600 / Math.max(img.width, img.height));
    const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(img, 0, 0, w, h);
    const size = Math.round(Math.min(w, h) * 0.14);
    const pad = Math.round(size * 0.18);
    const x = w - size - pad, y = h - size - pad;
    ctx.globalAlpha = 0.78;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(x - 4, y - 4, size + 8, size + 8, 10);
    ctx.fill();
    ctx.drawImage(logo, x, y, size, size);
    ctx.globalAlpha = 1;
    return await new Promise<Blob>((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error("encode failed"))), "image/jpeg", 0.86));
  } finally {
    URL.revokeObjectURL(url);
  }
}

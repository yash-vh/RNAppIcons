import { MASTER_SIZE } from "./types";
import type { IconVariant } from "./types";
import { getShapeDefinition } from "./registry";

/** Renders a single variant against a source image into a high-res master PNG canvas. */
export async function renderVariantMaster(
  sourceImage: HTMLImageElement,
  variant: IconVariant,
  size = MASTER_SIZE
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);

  const def = getShapeDefinition(variant.shape);
  const pathStr = def.getPath(variant);
  const path2d = new Path2D(pathStr);
  const scale = size / 100;

  // shadow (drawn under the clipped shape)
  if (variant.shadow?.enabled) {
    ctx.save();
    ctx.shadowColor = variant.shadow.color;
    ctx.shadowBlur = (variant.shadow.blur / 100) * size;
    ctx.shadowOffsetY = (variant.shadow.offsetY / 100) * size;
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.scale(scale, scale);
    ctx.fill(path2d);
    ctx.restore();
  }

  ctx.save();
  ctx.scale(scale, scale);
  ctx.clip(path2d);
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // background
  if (variant.background.type === "solid" && variant.background.color) {
    ctx.fillStyle = variant.background.color;
    ctx.fillRect(0, 0, size, size);
  } else if (variant.background.type === "gradient") {
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, variant.background.gradientFrom ?? "#ffffff");
    grad.addColorStop(1, variant.background.gradientTo ?? "#000000");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }

  // draw source image, contained, respecting scale/x/y offsets
  const iw = sourceImage.width;
  const ih = sourceImage.height;
  const imgAspect = iw / ih;
  let drawW: number, drawH: number;
  if (imgAspect >= 1) {
    drawW = size * variant.scale;
    drawH = drawW / imgAspect;
  } else {
    drawH = size * variant.scale;
    drawW = drawH * imgAspect;
  }
  const dx = (size - drawW) / 2 + variant.x * size * 0.5;
  const dy = (size - drawH) / 2 + variant.y * size * 0.5;
  ctx.drawImage(sourceImage, dx, dy, drawW, drawH);

  ctx.restore();

  // border
  if (variant.border?.enabled) {
    ctx.save();
    ctx.strokeStyle = variant.border.color;
    ctx.lineWidth = variant.border.width; // in 0..100 units, scaled below
    ctx.scale(scale, scale);
    ctx.stroke(path2d);
    ctx.restore();
  }

  return canvas;
}

/**
 * Renders the Android status-bar notification icon: a pure white silhouette on a
 * transparent background (RGB forced to white, alpha kept from the source shape).
 * Android tints/masks this icon itself and ignores any color, per platform spec —
 * see the reference `ic_stat_*.png` set, which is solid #FFFFFF with only alpha varying.
 */
export async function renderNotificationMaster(
  sourceImage: HTMLImageElement,
  variant: IconVariant,
  size = MASTER_SIZE
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);

  const iw = sourceImage.width;
  const ih = sourceImage.height;
  const imgAspect = iw / ih;
  let drawW: number, drawH: number;
  if (imgAspect >= 1) {
    drawW = size * variant.scale;
    drawH = drawW / imgAspect;
  } else {
    drawH = size * variant.scale;
    drawW = drawH * imgAspect;
  }
  const dx = (size - drawW) / 2 + variant.x * size * 0.5;
  const dy = (size - drawH) / 2 + variant.y * size * 0.5;
  ctx.drawImage(sourceImage, dx, dy, drawW, drawH);

  ctx.globalCompositeOperation = "source-in";
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size);
  ctx.globalCompositeOperation = "source-over";

  return canvas;
}

/** Never resize a previously resized image: always resample from the master. */
export function resizeCanvas(master: HTMLCanvasElement, targetSize: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = targetSize;
  canvas.height = targetSize;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(master, 0, 0, targetSize, targetSize);
  return canvas;
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("toBlob failed"));
    }, "image/png");
  });
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

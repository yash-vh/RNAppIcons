import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { IconProject, IconVariant } from "./types";
import { ADAPTIVE_LAYER_SCALE, ANDROID_DENSITIES, MASTER_SIZE, NOTIFICATION_LAYER_SCALE } from "./types";
import { canvasToBlob, renderNotificationMaster, renderVariantMaster, resizeCanvas } from "./render";
import { adaptiveIconXml, manifestSnippet } from "./android";
import { IOS_ICON_SLOTS, iosContentsJson, iosPixelSize } from "./ios";
import { manifestIconsSnippet, pngToIco, webReadme } from "./web";
import { exportFilename } from "./registry";

export interface ExportSummary {
  androidFiles: number;
  variantFiles: number;
  iosFiles: number;
  webFiles: number;
  totalFiles: number;
}

async function addMaster(zip: JSZip, path: string, master: HTMLCanvasElement, size: number) {
  const resized = size === MASTER_SIZE ? master : resizeCanvas(master, size);
  const blob = await canvasToBlob(resized);
  zip.file(path, blob);
}

async function canvasToBytes(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  const blob = await canvasToBlob(canvas);
  return new Uint8Array(await blob.arrayBuffer());
}

export async function buildProjectZip(
  project: IconProject,
  sourceImage: HTMLImageElement
): Promise<{ blob: Blob; summary: ExportSummary }> {
  const zip = new JSZip();
  let androidFiles = 0;
  let variantFiles = 0;
  let iosFiles = 0;
  let webFiles = 0;

  const enabled = project.variants.filter((v) => v.enabled);
  const masters = new Map<string, HTMLCanvasElement>();
  for (const v of enabled) {
    masters.set(v.id, await renderVariantMaster(sourceImage, v, MASTER_SIZE));
  }

  const regular = enabled.find((v) => v.shape === "original");
  const round = enabled.find((v) => v.shape === "round");

  if (project.android.legacy && (regular || round)) {
    const androidRoot = "android/res";
    for (const density of ANDROID_DENSITIES) {
      const dir = `${androidRoot}/mipmap-${density.name}`;
      if (regular) {
        await addMaster(zip, `${dir}/ic_launcher.png`, masters.get(regular.id)!, density.size);
        androidFiles++;
      }
      if (round) {
        await addMaster(zip, `${dir}/ic_launcher_round.png`, masters.get(round.id)!, density.size);
        androidFiles++;
      }
    }

    if (project.android.adaptive && regular) {
      const anydpi = `${androidRoot}/mipmap-anydpi-v26`;
      zip.file(`${anydpi}/ic_launcher.xml`, adaptiveIconXml({ monochrome: project.android.themed }));
      androidFiles++;
      if (round) {
        zip.file(`${anydpi}/ic_launcher_round.xml`, adaptiveIconXml({ monochrome: project.android.themed }));
        androidFiles++;
      }

      // Foreground/background/monochrome adaptive layers render at 2.25x the legacy
      // density size (108dp safe-zone vs. 48dp legacy icon), one full-bleed background
      // layer plus a separately maskable foreground layer, per density bucket.
      const bgVariant: IconVariant = {
        ...regular,
        shape: "square",
        padding: 0,
        border: undefined,
        shadow: undefined,
        background: regular.background.type === "transparent" ? { type: "solid", color: "#ffffff" } : regular.background,
      };
      const bgOnlyVariant: IconVariant = { ...bgVariant, scale: 0 };
      const fgVariant: IconVariant = { ...regular, shape: "square", background: { type: "transparent" } };
      const bgMaster = await renderVariantMaster(sourceImage, bgOnlyVariant, MASTER_SIZE);
      const fgMaster = await renderVariantMaster(sourceImage, fgVariant, MASTER_SIZE);

      for (const density of ANDROID_DENSITIES) {
        const dir = `${androidRoot}/mipmap-${density.name}`;
        const layerSize = Math.round(density.size * ADAPTIVE_LAYER_SCALE);
        await addMaster(zip, `${dir}/ic_launcher_background.png`, bgMaster, layerSize);
        await addMaster(zip, `${dir}/ic_launcher_foreground.png`, fgMaster, layerSize);
        androidFiles += 2;
        if (project.android.themed) {
          await addMaster(zip, `${dir}/ic_launcher_monochrome.png`, fgMaster, layerSize);
          androidFiles++;
        }
      }
    }

    if (project.android.notification && regular) {
      const notifMaster = await renderNotificationMaster(sourceImage, regular, MASTER_SIZE);
      for (const density of ANDROID_DENSITIES) {
        const size = Math.round(density.size * NOTIFICATION_LAYER_SCALE);
        await addMaster(zip, `${androidRoot}/drawable-${density.name}/ic_stat_notification.png`, notifMaster, size);
        androidFiles++;
      }
    }

    if (project.android.playStore && regular) {
      await addMaster(zip, `android/play_store_512.png`, masters.get(regular.id)!, 512);
      androidFiles++;
    }
  }

  // Extra shape variants (not the android-slot regular/round) exported flat.
  for (const v of enabled) {
    if (v === regular || v === round) continue;
    const name = exportFilename(v.shape);
    await addMaster(zip, `variants/${name}.png`, masters.get(v.id)!, MASTER_SIZE);
    variantFiles++;
  }
  if (regular) {
    await addMaster(zip, `variants/ic_launcher.png`, masters.get(regular.id)!, MASTER_SIZE);
    variantFiles++;
  }
  if (round) {
    await addMaster(zip, `variants/ic_launcher_round.png`, masters.get(round.id)!, MASTER_SIZE);
    variantFiles++;
  }

  if (project.ios.enabled && regular) {
    const master = masters.get(regular.id)!;
    for (const slot of IOS_ICON_SLOTS) {
      await addMaster(zip, `ios/${slot.filename}`, master, iosPixelSize(slot));
      iosFiles++;
    }
    zip.file("ios/Contents.json", iosContentsJson());
    iosFiles++;
    if (project.ios.dark) {
      await addMaster(zip, `ios/AppIcon-1024-dark.png`, master, 1024);
      iosFiles++;
    }
    if (project.ios.tinted) {
      await addMaster(zip, `ios/AppIcon-1024-tinted.png`, master, 1024);
      iosFiles++;
    }
  }

  if (project.web.enabled && regular) {
    const master = masters.get(regular.id)!;
    await addMaster(zip, `web/icon-192.png`, master, 192);
    await addMaster(zip, `web/icon-512.png`, master, 512);
    await addMaster(zip, `web/apple-touch-icon.png`, master, 180);
    webFiles += 3;

    // Maskable icons need a full-bleed background with the logo kept inside an ~80% safe zone.
    const maskableVariant: IconVariant = {
      ...regular,
      shape: "square",
      padding: Math.max(regular.padding, 0.2),
      background: regular.background.type === "transparent" ? { type: "solid", color: "#ffffff" } : regular.background,
    };
    const maskableMaster = await renderVariantMaster(sourceImage, maskableVariant, MASTER_SIZE);
    await addMaster(zip, `web/icon-192-maskable.png`, maskableMaster, 192);
    await addMaster(zip, `web/icon-512-maskable.png`, maskableMaster, 512);
    webFiles += 2;

    const favicon32 = resizeCanvas(master, 32);
    const icoBytes = pngToIco(await canvasToBytes(favicon32), 32);
    zip.file("web/favicon.ico", icoBytes);
    zip.file("web/README.txt", webReadme());
    webFiles += 2;
  }

  zip.file("android-manifest-snippet.xml", manifestSnippet());
  if (project.web.enabled) zip.file("web-manifest-icons-snippet.json", manifestIconsSnippet());

  const blob = await zip.generateAsync({ type: "blob" });
  return {
    blob,
    summary: {
      androidFiles,
      variantFiles,
      iosFiles,
      webFiles,
      totalFiles: androidFiles + variantFiles + iosFiles + webFiles,
    },
  };
}

export function downloadZip(blob: Blob, filename = "app-icons.zip") {
  saveAs(blob, filename);
}

export function findVariant(project: IconProject, id: string): IconVariant | undefined {
  return project.variants.find((v) => v.id === id);
}

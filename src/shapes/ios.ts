export interface IosIconSlot {
  filename: string;
  idiom: "iphone" | "ipad" | "ios-marketing" | "car";
  scale: "1x" | "2x" | "3x";
  size: string; // e.g. "60x60" or "83.5x83.5"
}

// Mirrors a standard Xcode AppIcon.appiconset Contents.json layout.
export const IOS_ICON_SLOTS: IosIconSlot[] = [
  { filename: "AppIcon@2x.png", idiom: "iphone", scale: "2x", size: "60x60" },
  { filename: "AppIcon@3x.png", idiom: "iphone", scale: "3x", size: "60x60" },
  { filename: "AppIcon~ipad.png", idiom: "ipad", scale: "1x", size: "76x76" },
  { filename: "AppIcon@2x~ipad.png", idiom: "ipad", scale: "2x", size: "76x76" },
  { filename: "AppIcon-83.5@2x~ipad.png", idiom: "ipad", scale: "2x", size: "83.5x83.5" },
  { filename: "AppIcon-40@2x.png", idiom: "iphone", scale: "2x", size: "40x40" },
  { filename: "AppIcon-40@3x.png", idiom: "iphone", scale: "3x", size: "40x40" },
  { filename: "AppIcon-40~ipad.png", idiom: "ipad", scale: "1x", size: "40x40" },
  { filename: "AppIcon-40@2x~ipad.png", idiom: "ipad", scale: "2x", size: "40x40" },
  { filename: "AppIcon-20@2x.png", idiom: "iphone", scale: "2x", size: "20x20" },
  { filename: "AppIcon-20@3x.png", idiom: "iphone", scale: "3x", size: "20x20" },
  { filename: "AppIcon-20~ipad.png", idiom: "ipad", scale: "1x", size: "20x20" },
  { filename: "AppIcon-20@2x~ipad.png", idiom: "ipad", scale: "2x", size: "20x20" },
  { filename: "AppIcon-29.png", idiom: "iphone", scale: "1x", size: "29x29" },
  { filename: "AppIcon-29@2x.png", idiom: "iphone", scale: "2x", size: "29x29" },
  { filename: "AppIcon-29@3x.png", idiom: "iphone", scale: "3x", size: "29x29" },
  { filename: "AppIcon-29~ipad.png", idiom: "ipad", scale: "1x", size: "29x29" },
  { filename: "AppIcon-29@2x~ipad.png", idiom: "ipad", scale: "2x", size: "29x29" },
  { filename: "AppIcon-60@2x~car.png", idiom: "car", scale: "2x", size: "60x60" },
  { filename: "AppIcon-60@3x~car.png", idiom: "car", scale: "3x", size: "60x60" },
  { filename: "AppIcon~ios-marketing.png", idiom: "ios-marketing", scale: "1x", size: "1024x1024" },
];

export function iosPixelSize(slot: IosIconSlot): number {
  const pt = parseFloat(slot.size.split("x")[0]);
  const scale = parseFloat(slot.scale);
  return Math.round(pt * scale);
}

export function iosContentsJson(): string {
  return JSON.stringify(
    {
      images: IOS_ICON_SLOTS.map((s) => ({ filename: s.filename, idiom: s.idiom, scale: s.scale, size: s.size })),
      info: { author: "app-icon-generator", version: 1 },
    },
    null,
    2
  );
}

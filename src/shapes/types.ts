export type IconShape =
  | "original"
  | "round"
  | "circle"
  | "square"
  | "rounded-square"
  | "squircle"
  | "triangle"
  | "pentagon"
  | "hexagon"
  | "heptagon"
  | "octagon"
  | "teardrop"
  | "custom";

export type ShapeCategory = "standard" | "polygon" | "android" | "custom";

export interface BackgroundConfig {
  type: "transparent" | "solid" | "gradient";
  color?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export interface BorderConfig {
  enabled: boolean;
  width: number; // px at 1024 master
  color: string;
}

export interface ShadowConfig {
  enabled: boolean;
  blur: number;
  color: string;
  offsetY: number;
}

export interface IconVariant {
  id: string;
  name: string;
  shape: IconShape;
  enabled: boolean;
  scale: number; // 0..1, fraction of canvas
  x: number; // offset -1..1
  y: number;
  padding: number; // 0..1
  rotation: number; // degrees, polygon shapes
  cornerRadius?: number; // 0..1, rounded-square
  polygonSides?: number; // 3..10
  background: BackgroundConfig;
  border?: BorderConfig;
  shadow?: ShadowConfig;
}

export interface ShapeDefinition {
  id: IconShape;
  label: string;
  category: ShapeCategory;
  defaultVariant: Partial<IconVariant>;
  /** Returns an SVG path (in a 0..100 viewBox) describing the mask for given variant config. */
  getPath: (v: IconVariant) => string;
  controls: ShapeControlKey[];
}

export type ShapeControlKey =
  | "scale"
  | "padding"
  | "border"
  | "background"
  | "shadow"
  | "cornerRadius"
  | "polygonSides"
  | "rotation";

export interface AndroidConfig {
  legacy: boolean;
  adaptive: boolean;
  themed: boolean;
  notification: boolean;
  playStore: boolean;
}

export interface IOSConfig {
  enabled: boolean;
  dark: boolean;
  tinted: boolean;
}

export interface WebConfig {
  enabled: boolean;
}

export interface IconProject {
  variants: IconVariant[];
  android: AndroidConfig;
  ios: IOSConfig;
  web: WebConfig;
  sourceImage: string | null; // data URL
}

export const ANDROID_DENSITIES: { name: string; size: number }[] = [
  { name: "mdpi", size: 48 },
  { name: "hdpi", size: 72 },
  { name: "xhdpi", size: 96 },
  { name: "xxhdpi", size: 144 },
  { name: "xxxhdpi", size: 192 },
];

/** Notification (status-bar) icons render at 24/48 = 0.5x the legacy launcher size per
 * density (24dp base vs. 48dp legacy icon), matching Android's ic_stat_* convention. */
export const NOTIFICATION_LAYER_SCALE = 0.5;

/** Adaptive foreground/background/monochrome layers render at 108/48 = 2.25x the legacy
 * launcher size per density, matching the real Android adaptive-icon safe-zone convention
 * (108dp layer vs. 48dp legacy icon). */
export const ADAPTIVE_LAYER_SCALE = 2.25;

export const MASTER_SIZE = 1024;

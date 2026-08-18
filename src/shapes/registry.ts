import type { IconVariant, ShapeDefinition, ShapeControlKey } from "./types";

// All paths are computed in a 0..100 viewBox, centered at 50,50.

function regularPolygonPath(sides: number, radius: number, rotationDeg: number, cx = 50, cy = 50): string {
  const pts: string[] = [];
  const rot = ((rotationDeg - 90) * Math.PI) / 180; // start pointing up by default
  for (let i = 0; i < sides; i++) {
    const angle = rot + (i * 2 * Math.PI) / sides;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    pts.push(`${x.toFixed(3)},${y.toFixed(3)}`);
  }
  return `M${pts.join("L")}Z`;
}

function squirclePath(radius: number, cx = 50, cy = 50, exponent = 4): string {
  // superellipse approximation
  const steps = 64;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * 2 * Math.PI;
    const ct = Math.cos(t);
    const st = Math.sin(t);
    const x = cx + radius * Math.sign(ct) * Math.pow(Math.abs(ct), 2 / exponent);
    const y = cy + radius * Math.sign(st) * Math.pow(Math.abs(st), 2 / exponent);
    pts.push(`${x.toFixed(3)},${y.toFixed(3)}`);
  }
  return `M${pts.map((p, i) => (i === 0 ? p : `L${p}`)).join("")}Z`;
}

function teardropPath(radius: number, cx = 50, cy = 50): string {
  // circle with one corner pulled into a point (top-right), classic Android teardrop
  const r = radius;
  return `M${cx - r},${cy} A${r},${r} 0 1 1 ${cx},${cy - r} L${cx + r * 0.95},${cy - r * 0.95} Q${cx + r},${cy - r} ${cx + r},${cy} A${r},${r} 0 1 1 ${cx - r},${cy} Z`;
}

function roundedSquarePath(halfSize: number, cornerFrac: number, cx = 50, cy = 50): string {
  const r = Math.max(0, Math.min(halfSize, halfSize * cornerFrac));
  const x0 = cx - halfSize;
  const y0 = cy - halfSize;
  const x1 = cx + halfSize;
  const y1 = cy + halfSize;
  return `M${x0 + r},${y0} L${x1 - r},${y0} Q${x1},${y0} ${x1},${y0 + r} L${x1},${y1 - r} Q${x1},${y1} ${x1 - r},${y1} L${x0 + r},${y1} Q${x0},${y1} ${x0},${y1 - r} L${x0},${y0 + r} Q${x0},${y0} ${x0 + r},${y0} Z`;
}

const STANDARD_CONTROLS: ShapeControlKey[] = ["scale", "padding", "background", "border", "shadow"];

function safeRadius(v: IconVariant): number {
  // 50 is half of the 0..100 viewbox; padding shrinks it.
  return 50 * (1 - v.padding) * v.scale;
}

export const SHAPE_REGISTRY: Record<string, ShapeDefinition> = {
  original: {
    id: "original",
    label: "Regular / Original",
    category: "standard",
    controls: STANDARD_CONTROLS,
    defaultVariant: { padding: 0.1, scale: 0.9, cornerRadius: 0.18 },
    getPath: (v) => roundedSquarePath(safeRadius(v), 0.2),
  },
  round: {
    id: "round",
    label: "Round",
    category: "standard",
    controls: STANDARD_CONTROLS,
    defaultVariant: { padding: 0.12, scale: 0.85 },
    getPath: (v) => `M50,${50 - safeRadius(v)} A${safeRadius(v)},${safeRadius(v)} 0 1 1 49.99,${50 - safeRadius(v)} Z`,
  },
  circle: {
    id: "circle",
    label: "Circle",
    category: "android",
    controls: STANDARD_CONTROLS,
    defaultVariant: { padding: 0.1, scale: 0.9 },
    getPath: (v) => `M50,${50 - safeRadius(v)} A${safeRadius(v)},${safeRadius(v)} 0 1 1 49.99,${50 - safeRadius(v)} Z`,
  },
  square: {
    id: "square",
    label: "Square",
    category: "standard",
    controls: STANDARD_CONTROLS,
    defaultVariant: { padding: 0.1, scale: 0.9 },
    getPath: (v) => roundedSquarePath(safeRadius(v), 0),
  },
  "rounded-square": {
    id: "rounded-square",
    label: "Rounded Square",
    category: "standard",
    controls: [...STANDARD_CONTROLS, "cornerRadius"],
    defaultVariant: { padding: 0.1, scale: 0.9, cornerRadius: 0.35 },
    getPath: (v) => roundedSquarePath(safeRadius(v), v.cornerRadius ?? 0.35),
  },
  squircle: {
    id: "squircle",
    label: "Squircle",
    category: "standard",
    controls: STANDARD_CONTROLS,
    defaultVariant: { padding: 0.1, scale: 0.88 },
    getPath: (v) => squirclePath(safeRadius(v)),
  },
  triangle: {
    id: "triangle",
    label: "Triangle",
    category: "polygon",
    controls: [...STANDARD_CONTROLS, "rotation"],
    defaultVariant: { padding: 0.12, scale: 0.85, polygonSides: 3, rotation: 0 },
    getPath: (v) => regularPolygonPath(3, safeRadius(v), v.rotation),
  },
  pentagon: {
    id: "pentagon",
    label: "Pentagon",
    category: "polygon",
    controls: [...STANDARD_CONTROLS, "rotation"],
    defaultVariant: { padding: 0.1, scale: 0.88, polygonSides: 5, rotation: 0 },
    getPath: (v) => regularPolygonPath(5, safeRadius(v), v.rotation),
  },
  hexagon: {
    id: "hexagon",
    label: "Hexagon",
    category: "polygon",
    controls: [...STANDARD_CONTROLS, "rotation"],
    defaultVariant: { padding: 0.1, scale: 0.88, polygonSides: 6, rotation: 0 },
    getPath: (v) => regularPolygonPath(6, safeRadius(v), v.rotation),
  },
  heptagon: {
    id: "heptagon",
    label: "Heptagon",
    category: "polygon",
    controls: [...STANDARD_CONTROLS, "rotation"],
    defaultVariant: { padding: 0.1, scale: 0.88, polygonSides: 7, rotation: 0 },
    getPath: (v) => regularPolygonPath(7, safeRadius(v), v.rotation),
  },
  octagon: {
    id: "octagon",
    label: "Octagon",
    category: "polygon",
    controls: [...STANDARD_CONTROLS, "rotation"],
    defaultVariant: { padding: 0.1, scale: 0.88, polygonSides: 8, rotation: 0 },
    getPath: (v) => regularPolygonPath(8, safeRadius(v), v.rotation),
  },
  teardrop: {
    id: "teardrop",
    label: "Teardrop",
    category: "android",
    controls: STANDARD_CONTROLS,
    defaultVariant: { padding: 0.12, scale: 0.85 },
    getPath: (v) => teardropPath(safeRadius(v)),
  },
  custom: {
    id: "custom",
    label: "Custom",
    category: "custom",
    controls: [...STANDARD_CONTROLS, "cornerRadius", "polygonSides", "rotation"],
    defaultVariant: { padding: 0.1, scale: 0.9, cornerRadius: 0.2, polygonSides: 6, rotation: 0 },
    getPath: (v) => {
      const sides = v.polygonSides ?? 0;
      if (sides >= 3) return regularPolygonPath(sides, safeRadius(v), v.rotation);
      return roundedSquarePath(safeRadius(v), v.cornerRadius ?? 0.2);
    },
  },
};

export function getShapeDefinition(shape: string): ShapeDefinition {
  return SHAPE_REGISTRY[shape] ?? SHAPE_REGISTRY.original;
}

export function exportFilename(shape: string): string {
  if (shape === "original") return "ic_launcher";
  if (shape === "round") return "ic_launcher_round";
  return `ic_launcher_${shape.replace(/-/g, "_")}`;
}

export function createVariant(shape: keyof typeof SHAPE_REGISTRY, overrides: Partial<import("./types").IconVariant> = {}): import("./types").IconVariant {
  const def = SHAPE_REGISTRY[shape];
  return {
    id: `${shape}-${Math.random().toString(36).slice(2, 9)}`,
    name: def.label,
    shape: def.id,
    enabled: true,
    scale: 0.9,
    x: 0,
    y: 0,
    padding: 0.1,
    rotation: 0,
    background: { type: "transparent" },
    border: { enabled: false, width: 2, color: "#000000" },
    shadow: { enabled: false, blur: 4, color: "#000000", offsetY: 2 },
    ...def.defaultVariant,
    ...overrides,
  };
}

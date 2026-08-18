import { useMemo, useState } from "react";
import { SHAPE_REGISTRY } from "../shapes/registry";
import type { IconShape, ShapeCategory } from "../shapes/types";
import ShapePreview from "./ShapePreview";
import { createVariant } from "../shapes/registry";
import type { IconVariant } from "../shapes/types";

interface Props {
  imageSrc: string | null;
  selectedShapes: Set<IconShape>;
  onToggle: (shape: IconShape) => void;
  onSelectAll: () => void;
}

const CATEGORIES: { key: ShapeCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "standard", label: "Standard" },
  { key: "android", label: "Android" },
  { key: "polygon", label: "Polygon" },
  { key: "custom", label: "Custom" },
];

export default function ShapeSelector({ imageSrc, selectedShapes, onToggle, onSelectAll }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ShapeCategory | "all">("all");
  const shapes = Object.values(SHAPE_REGISTRY);

  const filtered = useMemo(() => {
    return shapes.filter((s) => {
      if (category !== "all" && s.category !== category) return false;
      if (query && !s.label.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [shapes, category, query]);

  const previewVariant = (shape: IconShape): IconVariant => createVariant(shape as keyof typeof SHAPE_REGISTRY);

  return (
    <div className="shape-selector">
      <div className="shape-selector-header">
        <h2>Icon Shape</h2>
        <button className="btn-secondary" onClick={onSelectAll}>
          Select All
        </button>
      </div>

      {shapes.length > 8 && (
        <div className="shape-search-row">
          <input
            className="shape-search"
            placeholder="Search shapes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="shape-categories">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                className={`chip ${category === c.key ? "chip-active" : ""}`}
                onClick={() => setCategory(c.key)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="shape-grid">
        {filtered.map((def) => {
          const selected = selectedShapes.has(def.id);
          return (
            <button
              key={def.id}
              className={`shape-card ${selected ? "shape-card-selected" : ""}`}
              onClick={() => onToggle(def.id)}
              aria-pressed={selected}
            >
              <div className="shape-card-check">{selected ? "✓" : "○"}</div>
              <ShapePreview variant={previewVariant(def.id)} imageSrc={imageSrc} size={72} />
              <div className="shape-card-label">{def.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import { SHAPE_REGISTRY } from "../shapes/registry";
import type { IconShape, ShapeCategory } from "../shapes/types";
import ShapePreview from "./ShapePreview";
import { createVariant } from "../shapes/registry";
import type { IconVariant } from "../shapes/types";
import Chip from "@mui/material/Chip";

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
    <section className="shape-selector" aria-labelledby="shape-selector-heading">
      <div className="shape-selector-header">
        <h2 id="shape-selector-heading" className="section-title">
          Icon Shapes
        </h2>
        <button className="btn-secondary" onClick={onSelectAll} type="button" aria-label="Select all icon shapes">
          Select All
        </button>
      </div>

      <div className="shape-search-row">
        <label htmlFor="shape-search-input" className="sr-only">
          Search shapes
        </label>
        <input
          id="shape-search-input"
          className="shape-search"
          placeholder="Search shapes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search icon shapes by name"
        />
        <div className="shape-categories" role="group" aria-label="Shape categories" style={{ gap: 6, display: "flex", flexWrap: "wrap" }}>
          {CATEGORIES.map((c) => {
            const isActive = category === c.key;
            return (
              <Chip
                key={c.key}
                label={c.label}
                size="small"
                clickable
                onClick={() => setCategory(c.key)}
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                  backgroundColor: isActive ? "var(--accent)" : "var(--panel-2)",
                  color: isActive ? "#ffffff" : "var(--muted)",
                  borderColor: isActive ? "var(--accent)" : "var(--border)",
                  "&:hover": {
                    backgroundColor: isActive ? "var(--accent-hover)" : "var(--accent-light)",
                    color: isActive ? "#ffffff" : "var(--accent)",
                  },
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="shape-grid" role="group" aria-label="Available icon shapes">
        {filtered.map((def) => {
          const selected = selectedShapes.has(def.id);
          return (
            <button
              key={def.id}
              type="button"
              className={`shape-card ${selected ? "shape-card-selected" : ""}`}
              onClick={() => onToggle(def.id)}
              aria-pressed={selected}
              aria-label={`${def.label} shape ${selected ? "selected" : "not selected"}`}
              title={`Toggle ${def.label} shape`}
            >
              {selected && (
                <div className="shape-card-check" aria-hidden="true">
                  ✓
                </div>
              )}
              <ShapePreview variant={previewVariant(def.id)} imageSrc={imageSrc} size={64} />
              <span className="shape-card-label">{def.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

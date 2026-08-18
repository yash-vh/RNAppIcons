import type { IconVariant } from "../shapes/types";
import ShapePreview from "./ShapePreview";

interface Props {
  variants: IconVariant[];
  imageSrc: string | null;
  onToggleEnabled: (id: string) => void;
  onEdit: (id: string) => void;
}

export default function GeneratedGrid({ variants, imageSrc, onToggleEnabled, onEdit }: Props) {
  if (variants.length === 0) return null;
  return (
    <div className="generated-grid-section">
      <h2>Generated Variants</h2>
      <div className="generated-grid">
        {variants.map((v) => (
          <div key={v.id} className={`generated-card ${v.enabled ? "" : "generated-card-disabled"}`}>
            <ShapePreview variant={v} imageSrc={imageSrc} size={96} />
            <div className="generated-card-name">{v.name}</div>
            <div className="generated-card-dims">1024 × 1024</div>
            <div className="generated-card-actions">
              <label className="switch">
                <input type="checkbox" checked={v.enabled} onChange={() => onToggleEnabled(v.id)} />
                {v.enabled ? "Enabled" : "Disabled"}
              </label>
              <button className="btn-link" onClick={() => onEdit(v.id)}>
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

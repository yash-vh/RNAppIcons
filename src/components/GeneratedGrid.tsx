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
  const enabledCount = variants.filter((v) => v.enabled).length;
  return (
    <div className="generated-grid-section">
      <h2>Generated Variants</h2>
      <div className="generated-grid">
        {variants.map((v) => {
          const isLastEnabled = v.enabled && enabledCount === 1;
          return (
            <div key={v.id} className={`generated-card ${v.enabled ? "" : "generated-card-disabled"}`}>
              <ShapePreview variant={v} imageSrc={imageSrc} size={72} />
              <div className="generated-card-name">{v.name}</div>
              <div className="generated-card-actions">
                <label className="switch" title={isLastEnabled ? "At least one variant is required" : undefined}>
                  <input
                    type="checkbox"
                    checked={v.enabled}
                    disabled={isLastEnabled}
                    onChange={() => onToggleEnabled(v.id)}
                  />
                  {v.enabled ? "On" : "Off"}
                </label>
                <button className="btn-link" onClick={() => onEdit(v.id)}>
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

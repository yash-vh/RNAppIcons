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
    <section className="generated-grid-section" aria-labelledby="generated-grid-heading">
      <h2 id="generated-grid-heading" className="section-title">
        Generated Shape Variants ({enabledCount} active)
      </h2>
      <div className="generated-grid" role="group" aria-label="Generated icon variants">
        {variants.map((v) => {
          const isLastEnabled = v.enabled && enabledCount === 1;
          return (
            <div key={v.id} className={`generated-card ${v.enabled ? "" : "generated-card-disabled"}`}>
              <ShapePreview variant={v} imageSrc={imageSrc} size={72} />
              <span className="generated-card-name">{v.name}</span>
              <div className="generated-card-actions">
                <label
                  className="toggle-switch-label"
                  title={isLastEnabled ? "At least one variant is required" : undefined}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={v.enabled}
                    disabled={isLastEnabled}
                    onChange={() => onToggleEnabled(v.id)}
                    aria-label={`Toggle ${v.name} variant`}
                  />
                  <span
                    className={`toggle-switch ${v.enabled ? "toggle-switch-active" : ""}`}
                    role="switch"
                    aria-checked={v.enabled}
                  >
                    <span className="toggle-switch-thumb" />
                  </span>
                  <span>{v.enabled ? "On" : "Off"}</span>
                </label>
                <button
                  type="button"
                  className="btn-link"
                  onClick={() => onEdit(v.id)}
                  aria-label={`Edit ${v.name} variant settings`}
                >
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

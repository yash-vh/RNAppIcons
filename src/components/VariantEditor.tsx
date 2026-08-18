import type { IconVariant } from "../shapes/types";
import { getShapeDefinition } from "../shapes/registry";
import ShapePreview from "./ShapePreview";

interface Props {
  variants: IconVariant[];
  activeId: string;
  onSelectTab: (id: string) => void;
  onChange: (id: string, patch: Partial<IconVariant>) => void;
  onCopyFromRegular: (id: string) => void;
  imageSrc: string | null;
}

export default function VariantEditor({ variants, activeId, onSelectTab, onChange, onCopyFromRegular, imageSrc }: Props) {
  const active = variants.find((v) => v.id === activeId);
  if (!active) return null;
  const def = getShapeDefinition(active.shape);
  const controls = new Set(def.controls);

  const update = (patch: Partial<IconVariant>) => onChange(active.id, patch);

  return (
    <section className="variant-editor" aria-labelledby="variant-editor-heading">
      <h2 id="variant-editor-heading" className="section-title">
        Customize Variant
      </h2>

      <div className="variant-tablist" role="tablist" aria-label="Icon variant customization tabs">
        {variants.map((v) => {
          const isActive = v.id === activeId;
          return (
            <button
              key={v.id}
              id={`tab-${v.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${v.id}`}
              className={`variant-tab ${isActive ? "variant-tab-active" : ""}`}
              onClick={() => onSelectTab(v.id)}
            >
              {v.name}
            </button>
          );
        })}
      </div>

      <div id={`panel-${active.id}`} role="tabpanel" aria-labelledby={`tab-${active.id}`} className="variant-editor-body">
        <div className="variant-editor-preview">
          <ShapePreview variant={active} imageSrc={imageSrc} size={180} />
          <div className="variant-meta">
            <strong>{active.name}</strong>
            <span>1024 × 1024 px</span>
            <span>Safe Area: {Math.round((1 - active.padding) * 100)}%</span>
          </div>
        </div>

        <div className="variant-editor-controls">
          {controls.has("scale") && (
            <div className="control-group">
              <label htmlFor="scale-slider" className="control-label">
                <span>Icon Scale</span>
                <span className="control-value">{Math.round(active.scale * 100)}%</span>
              </label>
              <input
                id="scale-slider"
                type="range"
                className="range-input"
                min={0.3}
                max={1}
                step={0.01}
                value={active.scale}
                onChange={(e) => update({ scale: Number(e.target.value) })}
                aria-valuenow={Math.round(active.scale * 100)}
                aria-valuemin={30}
                aria-valuemax={100}
              />
            </div>
          )}

          {controls.has("padding") && (
            <div className="control-group">
              <label htmlFor="padding-slider" className="control-label">
                <span>Padding</span>
                <span className="control-value">{Math.round(active.padding * 100)}%</span>
              </label>
              <input
                id="padding-slider"
                type="range"
                className="range-input"
                min={0}
                max={0.4}
                step={0.01}
                value={active.padding}
                onChange={(e) => update({ padding: Number(e.target.value) })}
                aria-valuenow={Math.round(active.padding * 100)}
                aria-valuemin={0}
                aria-valuemax={40}
              />
            </div>
          )}

          {controls.has("cornerRadius") && (
            <div className="control-group">
              <label htmlFor="corner-radius-slider" className="control-label">
                <span>Corner Radius</span>
                <span className="control-value">{Math.round((active.cornerRadius ?? 0.2) * 100)}%</span>
              </label>
              <input
                id="corner-radius-slider"
                type="range"
                className="range-input"
                min={0}
                max={0.5}
                step={0.01}
                value={active.cornerRadius ?? 0.2}
                onChange={(e) => update({ cornerRadius: Number(e.target.value) })}
                aria-valuenow={Math.round((active.cornerRadius ?? 0.2) * 100)}
                aria-valuemin={0}
                aria-valuemax={50}
              />
            </div>
          )}

          {controls.has("polygonSides") && (
            <div className="control-group">
              <label htmlFor="polygon-sides-select" className="control-label">
                <span>Polygon Sides</span>
              </label>
              <select
                id="polygon-sides-select"
                className="preset-select"
                value={active.polygonSides ?? 6}
                onChange={(e) => update({ polygonSides: Number(e.target.value) })}
              >
                {[3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>
                    {n} sides
                  </option>
                ))}
              </select>
            </div>
          )}

          {controls.has("rotation") && (
            <div className="control-group">
              <label htmlFor="rotation-slider" className="control-label">
                <span>Rotation</span>
                <span className="control-value">{active.rotation}°</span>
              </label>
              <input
                id="rotation-slider"
                type="range"
                className="range-input"
                min={0}
                max={360}
                step={1}
                value={active.rotation}
                onChange={(e) => update({ rotation: Number(e.target.value) })}
                aria-valuenow={active.rotation}
                aria-valuemin={0}
                aria-valuemax={360}
              />
            </div>
          )}

          {controls.has("border") && (
            <div className="control-group">
              <label className="toggle-switch-label">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={active.border?.enabled ?? false}
                  onChange={(e) =>
                    update({ border: { ...(active.border ?? { width: 2, color: "#000000", enabled: false }), enabled: e.target.checked } })
                  }
                />
                <span className={`toggle-switch ${active.border?.enabled ? "toggle-switch-active" : ""}`}>
                  <span className="toggle-switch-thumb" />
                </span>
                <span>Enable Border</span>
              </label>
              {active.border?.enabled && (
                <div className="control-row" style={{ marginTop: "6px" }}>
                  <input
                    type="range"
                    className="range-input"
                    min={0.5}
                    max={8}
                    step={0.5}
                    value={active.border.width}
                    onChange={(e) => update({ border: { ...active.border!, width: Number(e.target.value) } })}
                    aria-label="Border width"
                  />
                  <input
                    type="color"
                    aria-label="Border color"
                    value={active.border.color}
                    onChange={(e) => update({ border: { ...active.border!, color: e.target.value } })}
                  />
                </div>
              )}
            </div>
          )}

          {controls.has("shadow") && (
            <div className="control-group">
              <label className="toggle-switch-label">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={active.shadow?.enabled ?? false}
                  onChange={(e) =>
                    update({
                      shadow: {
                        ...(active.shadow ?? { blur: 4, color: "#000000", offsetY: 2, enabled: false }),
                        enabled: e.target.checked,
                      },
                    })
                  }
                />
                <span className={`toggle-switch ${active.shadow?.enabled ? "toggle-switch-active" : ""}`}>
                  <span className="toggle-switch-thumb" />
                </span>
                <span>Enable Drop Shadow</span>
              </label>
            </div>
          )}

          <button
            type="button"
            className="btn-secondary"
            onClick={() => onCopyFromRegular(active.id)}
            style={{ marginTop: "8px" }}
          >
            Copy settings from Regular variant
          </button>
        </div>
      </div>
    </section>
  );
}

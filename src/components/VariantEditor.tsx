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
    <div className="variant-editor">
      <div className="variant-tabs">
        {variants.map((v) => (
          <button
            key={v.id}
            className={`variant-tab ${v.id === activeId ? "variant-tab-active" : ""}`}
            onClick={() => onSelectTab(v.id)}
          >
            {v.name}
          </button>
        ))}
      </div>

      <div className="variant-editor-body">
        <div className="variant-editor-preview">
          <ShapePreview variant={active} imageSrc={imageSrc} size={220} />
          <div className="variant-meta">
            <strong>{active.name}</strong>
            <span>1024 × 1024</span>
            <span>Safe Area: {Math.round((1 - active.padding) * 100)}%</span>
          </div>
        </div>

        <div className="variant-editor-controls">
          {controls.has("scale") && (
            <label className="control-row">
              Scale
              <input
                type="range"
                min={0.3}
                max={1}
                step={0.01}
                value={active.scale}
                onChange={(e) => update({ scale: Number(e.target.value) })}
              />
              <span>{Math.round(active.scale * 100)}%</span>
            </label>
          )}

          {controls.has("padding") && (
            <label className="control-row">
              Padding
              <input
                type="range"
                min={0}
                max={0.4}
                step={0.01}
                value={active.padding}
                onChange={(e) => update({ padding: Number(e.target.value) })}
              />
              <span>{Math.round(active.padding * 100)}%</span>
            </label>
          )}

          {controls.has("cornerRadius") && (
            <label className="control-row">
              Corner Radius
              <input
                type="range"
                min={0}
                max={0.5}
                step={0.01}
                value={active.cornerRadius ?? 0.2}
                onChange={(e) => update({ cornerRadius: Number(e.target.value) })}
              />
              <span>{Math.round((active.cornerRadius ?? 0.2) * 100)}%</span>
            </label>
          )}

          {controls.has("polygonSides") && (
            <label className="control-row">
              Sides
              <select
                value={active.polygonSides ?? 6}
                onChange={(e) => update({ polygonSides: Number(e.target.value) })}
              >
                {[3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          )}

          {controls.has("rotation") && (
            <label className="control-row">
              Rotation
              <input
                type="range"
                min={0}
                max={360}
                step={1}
                value={active.rotation}
                onChange={(e) => update({ rotation: Number(e.target.value) })}
              />
              <span>{active.rotation}°</span>
            </label>
          )}

          {controls.has("background") && (
            <div className="control-row">
              Background
              <select
                value={active.background.type}
                onChange={(e) => update({ background: { ...active.background, type: e.target.value as any } })}
              >
                <option value="transparent">Transparent</option>
                <option value="solid">Solid</option>
                <option value="gradient">Gradient</option>
              </select>
              {active.background.type === "solid" && (
                <input
                  type="color"
                  value={active.background.color ?? "#ffffff"}
                  onChange={(e) => update({ background: { ...active.background, color: e.target.value } })}
                />
              )}
              {active.background.type === "gradient" && (
                <>
                  <input
                    type="color"
                    value={active.background.gradientFrom ?? "#ffffff"}
                    onChange={(e) => update({ background: { ...active.background, gradientFrom: e.target.value } })}
                  />
                  <input
                    type="color"
                    value={active.background.gradientTo ?? "#000000"}
                    onChange={(e) => update({ background: { ...active.background, gradientTo: e.target.value } })}
                  />
                </>
              )}
            </div>
          )}

          {controls.has("border") && (
            <div className="control-row">
              <label>
                <input
                  type="checkbox"
                  checked={active.border?.enabled ?? false}
                  onChange={(e) =>
                    update({ border: { ...(active.border ?? { width: 2, color: "#000000", enabled: false }), enabled: e.target.checked } })
                  }
                />
                Border
              </label>
              {active.border?.enabled && (
                <>
                  <input
                    type="range"
                    min={0.5}
                    max={8}
                    step={0.5}
                    value={active.border.width}
                    onChange={(e) => update({ border: { ...active.border!, width: Number(e.target.value) } })}
                  />
                  <input
                    type="color"
                    value={active.border.color}
                    onChange={(e) => update({ border: { ...active.border!, color: e.target.value } })}
                  />
                </>
              )}
            </div>
          )}

          {controls.has("shadow") && (
            <div className="control-row">
              <label>
                <input
                  type="checkbox"
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
                Shadow
              </label>
            </div>
          )}

          <button className="btn-secondary" onClick={() => onCopyFromRegular(active.id)}>
            Copy settings from Regular
          </button>
        </div>
      </div>
    </div>
  );
}

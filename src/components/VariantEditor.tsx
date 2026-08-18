import type { IconVariant } from "../shapes/types";
import { getShapeDefinition } from "../shapes/registry";
import ShapePreview from "./ShapePreview";
import Slider from "@mui/material/Slider";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

interface Props {
  variants: IconVariant[];
  activeId: string;
  onSelectTab: (id: string) => void;
  onChange: (id: string, patch: Partial<IconVariant>) => void;
  onCopyFromRegular: (id: string) => void;
  imageSrc: string | null;
}

export default function VariantEditor({
  variants,
  activeId,
  onSelectTab,
  onChange,
  onCopyFromRegular,
  imageSrc,
}: Props) {
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
          <ShapePreview variant={active} imageSrc={imageSrc} size={130} />
          <div className="variant-meta">
            <strong>{active.name}</strong>
            <span>1024 × 1024 px · Safe Area: {Math.round((1 - active.padding) * 100)}%</span>
          </div>
        </div>

        <div className="variant-editor-controls">
          {controls.has("scale") && (
            <div className="mui-control-group">
              <div className="mui-control-header">
                <span className="mui-control-title">Icon Scale</span>
                <span className="mui-control-value">{Math.round(active.scale * 100)}%</span>
              </div>
              <Slider
                size="small"
                min={30}
                max={100}
                value={Math.round(active.scale * 100)}
                onChange={(_, val) => update({ scale: (val as number) / 100 })}
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => `${v}%`}
                sx={{
                  color: "var(--accent)",
                  padding: "8px 0",
                  "& .MuiSlider-thumb": {
                    width: 16,
                    height: 16,
                    backgroundColor: "#fff",
                    border: "2px solid var(--accent)",
                  },
                }}
              />
            </div>
          )}

          {controls.has("padding") && (
            <div className="mui-control-group">
              <div className="mui-control-header">
                <span className="mui-control-title">Padding</span>
                <span className="mui-control-value">{Math.round(active.padding * 100)}%</span>
              </div>
              <Slider
                size="small"
                min={0}
                max={40}
                value={Math.round(active.padding * 100)}
                onChange={(_, val) => update({ padding: (val as number) / 100 })}
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => `${v}%`}
                sx={{
                  color: "var(--accent)",
                  padding: "8px 0",
                  "& .MuiSlider-thumb": {
                    width: 16,
                    height: 16,
                    backgroundColor: "#fff",
                    border: "2px solid var(--accent)",
                  },
                }}
              />
            </div>
          )}

          {controls.has("cornerRadius") && (
            <div className="mui-control-group">
              <div className="mui-control-header">
                <span className="mui-control-title">Corner Radius</span>
                <span className="mui-control-value">{Math.round((active.cornerRadius ?? 0.2) * 100)}%</span>
              </div>
              <Slider
                size="small"
                min={0}
                max={50}
                value={Math.round((active.cornerRadius ?? 0.2) * 100)}
                onChange={(_, val) => update({ cornerRadius: (val as number) / 100 })}
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => `${v}%`}
                sx={{
                  color: "var(--accent)",
                  padding: "8px 0",
                  "& .MuiSlider-thumb": {
                    width: 16,
                    height: 16,
                    backgroundColor: "#fff",
                    border: "2px solid var(--accent)",
                  },
                }}
              />
            </div>
          )}

          {controls.has("polygonSides") && (
            <div className="mui-control-group">
              <FormControl size="small" fullWidth>
                <InputLabel id="sides-select-label" sx={{ color: "var(--muted)", fontSize: 13 }}>
                  Polygon Sides
                </InputLabel>
                <Select
                  labelId="sides-select-label"
                  value={active.polygonSides ?? 6}
                  label="Polygon Sides"
                  onChange={(e) => update({ polygonSides: Number(e.target.value) })}
                  sx={{
                    color: "var(--text)",
                    fontSize: 13,
                    background: "var(--panel-2)",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "var(--border)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "var(--accent)",
                    },
                  }}
                >
                  {[3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <MenuItem key={n} value={n} sx={{ fontSize: 13 }}>
                      {n} sides
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          )}

          {controls.has("rotation") && (
            <div className="mui-control-group">
              <div className="mui-control-header">
                <span className="mui-control-title">Rotation</span>
                <span className="mui-control-value">{active.rotation}°</span>
              </div>
              <Slider
                size="small"
                min={0}
                max={360}
                value={active.rotation}
                onChange={(_, val) => update({ rotation: val as number })}
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => `${v}°`}
                sx={{
                  color: "var(--accent)",
                  padding: "8px 0",
                  "& .MuiSlider-thumb": {
                    width: 16,
                    height: 16,
                    backgroundColor: "#fff",
                    border: "2px solid var(--accent)",
                  },
                }}
              />
            </div>
          )}

          {controls.has("border") && (
            <div className="mui-control-group">
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={active.border?.enabled ?? false}
                    onChange={(e) =>
                      update({
                        border: {
                          ...(active.border ?? { width: 2, color: "#000000", enabled: false }),
                          enabled: e.target.checked,
                        },
                      })
                    }
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "var(--accent)",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                        backgroundColor: "var(--accent)",
                      },
                    }}
                  />
                }
                label={<span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Enable Border</span>}
                sx={{ margin: 0 }}
              />
              {active.border?.enabled && (
                <div className="control-row" style={{ marginTop: 6, gap: 10 }}>
                  <Slider
                    size="small"
                    min={0.5}
                    max={8}
                    step={0.5}
                    value={active.border.width}
                    onChange={(_, val) =>
                      update({ border: { ...active.border!, width: val as number } })
                    }
                    sx={{ color: "var(--accent)", flex: 1 }}
                  />
                  <input
                    type="color"
                    aria-label="Border color"
                    value={active.border.color}
                    onChange={(e) =>
                      update({ border: { ...active.border!, color: e.target.value } })
                    }
                    style={{
                      width: 32,
                      height: 32,
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                      padding: 0,
                      background: "transparent",
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {controls.has("shadow") && (
            <div className="mui-control-group">
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={active.shadow?.enabled ?? false}
                    onChange={(e) =>
                      update({
                        shadow: {
                          ...(active.shadow ?? { blur: 4, color: "#000000", offsetY: 2, enabled: false }),
                          enabled: e.target.checked,
                        },
                      })
                    }
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "var(--accent)",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                        backgroundColor: "var(--accent)",
                      },
                    }}
                  />
                }
                label={<span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Enable Drop Shadow</span>}
                sx={{ margin: 0 }}
              />
            </div>
          )}

          <Button
            variant="outlined"
            size="small"
            onClick={() => onCopyFromRegular(active.id)}
            sx={{
              textTransform: "none",
              color: "var(--text)",
              borderColor: "var(--border)",
              fontSize: 12,
              fontWeight: 600,
              padding: "6px 12px",
              marginTop: 1,
              "&:hover": {
                borderColor: "var(--accent)",
                backgroundColor: "var(--accent-light)",
              },
            }}
          >
            Copy settings from Regular variant
          </Button>
        </div>
      </div>
    </section>
  );
}

import { useState } from "react";
import type { SavedPreset } from "../shapes/presets";

interface Props {
  presets: SavedPreset[];
  onSave: (name: string) => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function PresetBar({ presets, onSave, onLoad, onDelete }: Props) {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState("");

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave(trimmed);
    setName("");
  };

  return (
    <section className="preset-bar">
      <h2>Presets</h2>
      <p className="hint">Save your shape/settings once, then reuse it on a new logo.</p>

      <div className="preset-save-row">
        <input
          className="preset-input"
          placeholder="Preset name…"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
        <button className="btn-secondary" onClick={handleSave} disabled={!name.trim()}>
          Save
        </button>
      </div>

      {presets.length > 0 && (
        <div className="preset-load-row">
          <select
            className="preset-select"
            value={selected}
            onChange={(e) => {
              setSelected(e.target.value);
              if (e.target.value) onLoad(e.target.value);
            }}
          >
            <option value="">Load a saved preset…</option>
            {presets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          {selected && (
            <button
              className="btn-link preset-delete"
              onClick={() => {
                onDelete(selected);
                setSelected("");
              }}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </section>
  );
}

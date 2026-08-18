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
    <section className="preset-bar" aria-labelledby="preset-heading">
      <h2 id="preset-heading" className="section-title">Presets</h2>
      <p className="hint">Save shape & size configurations to reuse across multiple icon projects.</p>

      <div className="preset-save-row">
        <label htmlFor="preset-name-input" className="sr-only">
          Preset Name
        </label>
        <input
          id="preset-name-input"
          className="preset-input"
          placeholder="New preset name…"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          aria-label="Preset name"
        />
        <button
          className="btn-secondary"
          onClick={handleSave}
          disabled={!name.trim()}
          type="button"
          aria-label="Save current configuration as preset"
        >
          Save
        </button>
      </div>

      {presets.length > 0 && (
        <div className="preset-load-row">
          <label htmlFor="preset-select-dropdown" className="sr-only">
            Load Saved Preset
          </label>
          <select
            id="preset-select-dropdown"
            className="preset-select"
            value={selected}
            onChange={(e) => {
              setSelected(e.target.value);
              if (e.target.value) onLoad(e.target.value);
            }}
            aria-label="Select a preset to load"
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
              className="btn-danger"
              type="button"
              onClick={() => {
                onDelete(selected);
                setSelected("");
              }}
              aria-label="Delete selected preset"
              title="Delete this preset"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </section>
  );
}

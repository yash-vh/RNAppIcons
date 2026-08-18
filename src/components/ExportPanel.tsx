import { useState } from "react";
import type { IconProject, IconVariant } from "../shapes/types";
import { manifestSnippet } from "../shapes/android";
import AndroidExtraPreviews from "./AndroidExtraPreviews";

interface Props {
  project: IconProject;
  imageSrc: string | null;
  regularVariant?: IconVariant;
  onChangeAndroid: (patch: Partial<IconProject["android"]>) => void;
  onChangeIos: (patch: Partial<IconProject["ios"]>) => void;
  onChangeWeb: (patch: Partial<IconProject["web"]>) => void;
  onGenerate: () => void;
  generating: boolean;
  summary: { totalFiles: number; sizeLabel: string } | null;
}

export default function ExportPanel({
  project,
  imageSrc,
  regularVariant,
  onChangeAndroid,
  onChangeIos,
  onChangeWeb,
  onGenerate,
  generating,
  summary,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const enabledVariants = project.variants.filter((v) => v.enabled);

  const copyManifest = async () => {
    await navigator.clipboard.writeText(manifestSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="export-panel-container">
      <div className="export-panel" aria-label="Export icon assets panel">
        <div className="export-panel-bar">
          <button
            type="button"
            className="export-panel-toggle"
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
            aria-controls="export-drawer-content"
          >
            <span>⚙️ Target Platforms & Export Settings</span>
            <span className={`chevron ${expanded ? "chevron-open" : ""}`} aria-hidden="true">
              ▼
            </span>
          </button>

          <div className="export-panel-bar-right">
            {summary ? (
              <span className="export-summary-line">
                {summary.totalFiles} assets generated · {summary.sizeLabel}
              </span>
            ) : (
              <span className="export-summary-line">
                {enabledVariants.length} shape variant{enabledVariants.length !== 1 ? "s" : ""} selected
              </span>
            )}
            <button
              type="button"
              className="btn-primary btn-large"
              onClick={onGenerate}
              disabled={generating || enabledVariants.length === 0 || !imageSrc}
              aria-label={generating ? "Generating icons..." : "Download icon zip asset bundle"}
              style={{ width: "auto", minWidth: "150px" }}
            >
              {generating ? "Generating ZIP…" : "📦 Download ZIP"}
            </button>
          </div>
        </div>

        {expanded && (
          <div id="export-drawer-content" className="export-panel-body">
            <div className="export-columns">
              <div className="export-column">
                <h3>Android Options</h3>
                {(
                  [
                    ["legacy", "Legacy Launcher Icons"],
                    ["adaptive", "Adaptive Icons"],
                    ["themed", "Themed (Monochrome)"],
                    ["notification", "Notification Icons"],
                    ["playStore", "Google Play Store 512px"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="export-toggle">
                    <input
                      type="checkbox"
                      checked={project.android[key]}
                      onChange={(e) => onChangeAndroid({ [key]: e.target.checked })}
                    />
                    <span>{label}</span>
                  </label>
                ))}
                <AndroidExtraPreviews
                  imageSrc={imageSrc}
                  regular={regularVariant}
                  showMonochrome={project.android.themed}
                  showNotification={project.android.notification}
                />
              </div>

              <div className="export-column">
                <h3>iOS Options</h3>
                {(
                  [
                    ["enabled", "Standard AppIcon.appiconset"],
                    ["dark", "Dark Mode Variant"],
                    ["tinted", "Tinted iOS Variant"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="export-toggle">
                    <input
                      type="checkbox"
                      checked={project.ios[key]}
                      onChange={(e) => onChangeIos({ [key]: e.target.checked })}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>

              <div className="export-column">
                <h3>Web & PWA</h3>
                <label className="export-toggle">
                  <input
                    type="checkbox"
                    checked={project.web.enabled}
                    onChange={(e) => onChangeWeb({ enabled: e.target.checked })}
                  />
                  <span>Favicon & PWA Icons</span>
                </label>
              </div>

              <div className="export-column">
                <h3>Active Shapes</h3>
                {enabledVariants.map((v) => (
                  <div key={v.id} className="export-toggle" style={{ color: "var(--accent)", fontWeight: 600 }}>
                    ✓ {v.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="manifest-preview">
              <div className="manifest-preview-header">
                <span>AndroidManifest.xml Snippet</span>
                <button type="button" className="btn-secondary" onClick={copyManifest}>
                  {copied ? "✓ Copied to Clipboard!" : "Copy Snippet"}
                </button>
              </div>
              <pre>{manifestSnippet()}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

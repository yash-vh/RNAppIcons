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
    <div className="export-panel">
      <div className="export-panel-bar">
        <button className="export-panel-toggle" onClick={() => setExpanded((e) => !e)}>
          <span>Export Settings</span>
          <span className={`chevron ${expanded ? "chevron-open" : ""}`}>⌄</span>
        </button>

        <div className="export-panel-bar-right">
          {summary && (
            <span className="export-summary-line">
              {summary.totalFiles} files · {summary.sizeLabel}
            </span>
          )}
          <button className="btn-primary" onClick={onGenerate} disabled={generating || enabledVariants.length === 0}>
            {generating ? "Generating…" : "Download ZIP"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="export-panel-body">
          <div className="export-columns">
            <div className="export-column">
              <h3>Android</h3>
              {(
                [
                  ["legacy", "Legacy launcher"],
                  ["adaptive", "Adaptive"],
                  ["themed", "Themed (monochrome)"],
                  ["notification", "Notification"],
                  ["playStore", "Google Play"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="export-toggle">
                  <input
                    type="checkbox"
                    checked={project.android[key]}
                    onChange={(e) => onChangeAndroid({ [key]: e.target.checked })}
                  />
                  {label}
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
              <h3>iOS</h3>
              {(
                [
                  ["enabled", "Default"],
                  ["dark", "Dark"],
                  ["tinted", "Tinted"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="export-toggle">
                  <input
                    type="checkbox"
                    checked={project.ios[key]}
                    onChange={(e) => onChangeIos({ [key]: e.target.checked })}
                  />
                  {label}
                </label>
              ))}
            </div>

            <div className="export-column">
              <h3>Web</h3>
              <label className="export-toggle">
                <input
                  type="checkbox"
                  checked={project.web.enabled}
                  onChange={(e) => onChangeWeb({ enabled: e.target.checked })}
                />
                PWA + favicon
              </label>
            </div>

            <div className="export-column">
              <h3>Variants</h3>
              {enabledVariants.map((v) => (
                <div key={v.id} className="export-toggle">
                  ✓ {v.name}
                </div>
              ))}
            </div>
          </div>

          <div className="manifest-preview">
            <div className="manifest-preview-header">
              <span>AndroidManifest.xml</span>
              <button className="btn-secondary" onClick={copyManifest}>
                {copied ? "Copied!" : "Copy this configuration"}
              </button>
            </div>
            <pre>{manifestSnippet()}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

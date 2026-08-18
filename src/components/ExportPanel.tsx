import { useState } from "react";
import type { IconProject } from "../shapes/types";
import { manifestSnippet } from "../shapes/android";

interface Props {
  project: IconProject;
  onChangeAndroid: (patch: Partial<IconProject["android"]>) => void;
  onChangeIos: (patch: Partial<IconProject["ios"]>) => void;
  onChangeWeb: (patch: Partial<IconProject["web"]>) => void;
  onGenerate: () => void;
  generating: boolean;
  summary: { totalFiles: number; sizeLabel: string } | null;
}

export default function ExportPanel({ project, onChangeAndroid, onChangeIos, onChangeWeb, onGenerate, generating, summary }: Props) {
  const [copied, setCopied] = useState(false);
  const enabledVariants = project.variants.filter((v) => v.enabled);

  const copyManifest = async () => {
    await navigator.clipboard.writeText(manifestSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="export-panel">
      <h2>Your Package</h2>

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

      {summary && (
        <div className="export-summary-line">
          Total assets: <strong>{summary.totalFiles} files</strong> &nbsp;·&nbsp; ZIP size: <strong>{summary.sizeLabel}</strong>
        </div>
      )}

      <button className="btn-primary btn-large" onClick={onGenerate} disabled={generating || enabledVariants.length === 0}>
        {generating ? "Generating..." : "Download Complete Package"}
      </button>
    </div>
  );
}

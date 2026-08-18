import { useState } from "react";
import type { IconProject } from "../shapes/types";

interface Props {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onDownload: () => void;
  generating: boolean;
  hasSource: boolean;
  project: IconProject;
  onChangeAndroid: (patch: Partial<IconProject["android"]>) => void;
  onChangeIos: (patch: Partial<IconProject["ios"]>) => void;
  onChangeWeb: (patch: Partial<IconProject["web"]>) => void;
}

const CREATOR_NAME = "yashnandha";
const CREATOR_INSTAGRAM_URL = "https://instagram.com/yashnandha06";

const SunIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const DownloadIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

/** Settings gear SVG icon */
const SettingsIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

/** Android SVG icon */
const AndroidSmIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.27-.86a.633.633 0 0 0-.86.27l-1.87 3.24C15.1 8.35 13.59 8.01 12 8.01s-3.1.34-4.44.94L5.69 5.71a.633.633 0 0 0-.86-.27c-.31.17-.43.55-.27.86L6.4 9.48C3.3 11.25 1.28 14.44 1 18h22c-.28-3.56-2.3-6.75-5.4-8.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z" />
  </svg>
);

/** Apple SVG icon */
const AppleSmIcon = () => (
  <svg width="12" height="12" viewBox="0 0 384 512" fill="currentColor">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
);

/** Globe SVG icon */
const GlobeSmIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export default function Header({
  theme,
  onToggleTheme,
  onDownload,
  generating,
  hasSource,
  project,
  onChangeAndroid,
  onChangeIos,
  onChangeWeb,
}: Props) {
  const [showTargets, setShowTargets] = useState(false);

  const activeTargets: string[] = [];
  if (project.android.legacy || project.android.adaptive)
    activeTargets.push("Android");
  if (project.ios.enabled) activeTargets.push("iOS");
  if (project.web.enabled) activeTargets.push("Web");

  return (
    <header className="site-header" role="banner">
      <div className="site-header-brand">
        <span className="brand-mark" aria-hidden="true">
          IC
        </span>
        <div className="brand-text">
          <h1 className="brand-name" style={{ margin: 0 }}>
            IconStudio
          </h1>
          <span className="brand-tagline">
            Multi-shape React Native app icon studio
          </span>
        </div>
      </div>

      <div className="site-header-actions">
        <a
          className="creator-credit"
          href={CREATOR_INSTAGRAM_URL}
          target="_blank"
          rel="noreferrer noopener"
          title={`Follow ${CREATOR_NAME} on Instagram`}
          aria-label={`Made by ${CREATOR_NAME} on Instagram`}>
          <span className="creator-avatar" aria-hidden="true">
            {CREATOR_NAME.charAt(0)}
          </span>
          <span>
            Made by <strong>{CREATOR_NAME}</strong>
          </span>
        </a>

        {/* Target Platform Settings Dropdown */}
        <div className="target-platform-wrapper">
          <button
            type="button"
            className="target-platform-btn"
            onClick={() => setShowTargets((v) => !v)}
            aria-expanded={showTargets}
            aria-haspopup="true"
            title="Configure target platforms">
            <SettingsIcon />
            <span className="target-platform-summary">
              {activeTargets.join(" · ") || "No targets"}
            </span>
            <span
              className={`target-chevron ${showTargets ? "target-chevron-open" : ""}`}
              aria-hidden="true">
              ▾
            </span>
          </button>

          {showTargets && (
            <div
              className="target-platform-dropdown"
              role="menu"
              aria-label="Target platform settings">
              <div className="target-section">
                <div className="target-section-label">
                  <AndroidSmIcon /> Android
                </div>
                {(
                  [
                    ["legacy", "Legacy Launcher"],
                    ["adaptive", "Adaptive Icons"],
                    ["themed", "Themed (Mono)"],
                    ["notification", "Notification"],
                    ["playStore", "Play Store 512px"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="target-option">
                    <input
                      type="checkbox"
                      checked={project.android[key]}
                      onChange={(e) =>
                        onChangeAndroid({ [key]: e.target.checked })
                      }
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>

              <div className="target-section">
                <div className="target-section-label">
                  <AppleSmIcon /> iOS
                </div>
                {(
                  [
                    ["enabled", "Default AppIcon"],
                    ["dark", "Dark Mode"],
                    ["tinted", "Tinted"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="target-option">
                    <input
                      type="checkbox"
                      checked={project.ios[key]}
                      onChange={(e) => onChangeIos({ [key]: e.target.checked })}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>

              <div className="target-section">
                <div className="target-section-label">
                  <GlobeSmIcon /> Web
                </div>
                <label className="target-option">
                  <input
                    type="checkbox"
                    checked={project.web.enabled}
                    onChange={(e) => onChangeWeb({ enabled: e.target.checked })}
                  />
                  <span>Favicon & PWA</span>
                </label>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          className="btn-primary header-download-btn"
          onClick={onDownload}
          disabled={generating || !hasSource}
          aria-label={
            generating ? "Generating icons..." : "Download icon ZIP bundle"
          }
          title={
            !hasSource
              ? "Upload a logo first"
              : generating
                ? "Generating..."
                : "Download ZIP"
          }>
          <DownloadIcon />
          <span>{generating ? "Generating…" : "Download ZIP"}</span>
        </button>

        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          type="button">
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </header>
  );
}

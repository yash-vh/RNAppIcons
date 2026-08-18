import { useState } from "react";
import type { IconVariant } from "../shapes/types";
import ShapePreview from "./ShapePreview";

interface Props {
  imageSrc: string | null;
  regular?: IconVariant;
  round?: IconVariant;
  appName?: string;
}

type Platform = "android" | "ios" | "web";
type Wallpaper = "dark" | "neon" | "sunset" | "light";

const DOCK_APPS = ["Phone", "Messages", "Camera"];

/** Android Robot SVG Icon */
const AndroidIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.27-.86a.633.633 0 0 0-.86.27l-1.87 3.24C15.1 8.35 13.59 8.01 12 8.01s-3.1.34-4.44.94L5.69 5.71a.633.633 0 0 0-.86-.27c-.31.17-.43.55-.27.86L6.4 9.48C3.3 11.25 1.28 14.44 1 18h22c-.28-3.56-2.3-6.75-5.4-8.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z" />
  </svg>
);

/** Apple SVG Icon */
const AppleIcon = () => (
  <svg width="15" height="15" viewBox="0 0 384 512" fill="currentColor">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
);

/** Globe/Web SVG Icon */
const GlobeIcon = () => (
  <svg
    width="16"
    height="16"
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

export default function PlatformPreview({
  imageSrc,
  regular,
  round,
  appName = "RniconHub",
}: Props) {
  const [platform, setPlatform] = useState<Platform>("android");
  const [wallpaper, setWallpaper] = useState<Wallpaper>("dark");

  const androidVariant = round ?? regular;
  const iosVariant = regular ?? round;
  const webVariant = regular ?? round;

  return (
    <div className="platform-preview" aria-labelledby="studio-heading">
      <div className="platform-preview-header">
        <h2 id="studio-heading" className="section-title" style={{ margin: 0 }}>
          Device Preview
        </h2>

        <div
          className="platform-tabs"
          role="tablist"
          aria-label="Device platform selection">
          <button
            type="button"
            role="tab"
            aria-selected={platform === "android"}
            className={`platform-tab ${platform === "android" ? "platform-tab-active" : ""}`}
            onClick={() => setPlatform("android")}>
            <AndroidIcon /> Android
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={platform === "ios"}
            className={`platform-tab ${platform === "ios" ? "platform-tab-active" : ""}`}
            onClick={() => setPlatform("ios")}>
            <AppleIcon /> iOS
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={platform === "web"}
            className={`platform-tab ${platform === "web" ? "platform-tab-active" : ""}`}
            onClick={() => setPlatform("web")}>
            <GlobeIcon /> Web
          </button>
        </div>
      </div>

      <div className="platform-stage">
        {platform === "android" && (
          <div className="device-shell">
            <div className="device-btn device-btn-power" />
            <div className="device-btn device-btn-volume" />
            <div className={`phone-mock wallpaper-${wallpaper}`}>
              <div className="phone-mock-statusbar">
                <span>10:08</span>
                <span aria-hidden="true">📶 100%</span>
              </div>
              <div className="phone-mock-grid">
                <div className="phone-mock-app">
                  <div className="phone-mock-icon-shell round-shell">
                    <span className="glyph" aria-hidden="true">
                      📞
                    </span>
                  </div>
                  <span>Phone</span>
                </div>
                <div className="phone-mock-app">
                  <div className="phone-mock-icon-shell round-shell">
                    <span className="glyph" aria-hidden="true">
                      ✉️
                    </span>
                  </div>
                  <span>Gmail</span>
                </div>
                <div className="phone-mock-app">
                  <div className="phone-mock-icon-shell round-shell hero-shell">
                    {androidVariant && imageSrc ? (
                      <ShapePreview
                        variant={androidVariant}
                        imageSrc={imageSrc}
                        size={48}
                      />
                    ) : (
                      <span className="glyph">🚀</span>
                    )}
                  </div>
                  <span>{appName}</span>
                </div>
                <div className="phone-mock-app">
                  <div className="phone-mock-icon-shell round-shell">
                    <span className="glyph" aria-hidden="true">
                      🧮
                    </span>
                  </div>
                  <span>Calculator</span>
                </div>
                <div className="phone-mock-app">
                  <div className="phone-mock-icon-shell round-shell">
                    <span className="glyph" aria-hidden="true">
                      ▶️
                    </span>
                  </div>
                  <span>YouTube</span>
                </div>
              </div>
              <div className="phone-mock-dock">
                <div className="phone-mock-icon-shell round-shell dock-shell">
                  <span className="glyph" aria-hidden="true">
                    💬
                  </span>
                </div>
                <div className="phone-mock-icon-shell round-shell dock-shell">
                  <span className="glyph" aria-hidden="true">
                    🌐
                  </span>
                </div>
                <div className="phone-mock-icon-shell round-shell dock-shell">
                  <span className="glyph" aria-hidden="true">
                    📷
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {platform === "ios" && (
          <div className="device-shell">
            <div className="device-btn device-btn-power" />
            <div className="device-btn device-btn-volume" />
            <div className={`phone-mock wallpaper-${wallpaper}`}>
              <div className="phone-mock-statusbar">
                <span>9:41</span>
                <span aria-hidden="true">📶 🔋</span>
              </div>
              <div className="phone-mock-grid">
                <div className="phone-mock-app">
                  <div className="phone-mock-icon-shell squircle-shell hero-shell">
                    {iosVariant && imageSrc ? (
                      <ShapePreview
                        variant={iosVariant}
                        imageSrc={imageSrc}
                        size={48}
                      />
                    ) : (
                      <span className="glyph">🚀</span>
                    )}
                  </div>
                  <span>{appName}</span>
                </div>
                <div className="phone-mock-app">
                  <div className="phone-mock-icon-shell squircle-shell">
                    <span className="glyph" aria-hidden="true">
                      ✉️
                    </span>
                  </div>
                  <span>Mail</span>
                </div>
                <div className="phone-mock-app">
                  <div className="phone-mock-icon-shell squircle-shell">
                    <span className="glyph" aria-hidden="true">
                      📷
                    </span>
                  </div>
                  <span>Camera</span>
                </div>
              </div>
              <div className="phone-mock-dock">
                {DOCK_APPS.map((name) => (
                  <div
                    className="phone-mock-icon-shell squircle-shell dock-shell"
                    key={name}>
                    <span className="glyph" aria-hidden="true">
                      •
                    </span>
                  </div>
                ))}
                {iosVariant && imageSrc && (
                  <div className="phone-mock-icon-shell squircle-shell dock-shell">
                    <ShapePreview
                      variant={iosVariant}
                      imageSrc={imageSrc}
                      size={38}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {platform === "web" && (
          <div className="browser-mock">
            <div className="browser-mock-bar">
              <div className="browser-mock-dots" aria-hidden="true">
                <span /> <span /> <span />
              </div>
              <div className="browser-mock-tab">
                {webVariant && imageSrc && (
                  <ShapePreview
                    variant={webVariant}
                    imageSrc={imageSrc}
                    size={14}
                  />
                )}
                <span>{appName}</span>
              </div>
            </div>
            <div className="browser-mock-address">
              🔒 {appName.toLowerCase().replace(/\s+/g, "")}.app
            </div>
            <div className="browser-mock-body">
              <div className="browser-mock-favicon-row">
                {webVariant && imageSrc && (
                  <div className="phone-mock-icon-shell squircle-shell hero-shell">
                    <ShapePreview
                      variant={webVariant}
                      imageSrc={imageSrc}
                      size={48}
                    />
                  </div>
                )}
                <div>
                  <strong>{appName} App</strong>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "12px",
                      color: "var(--muted)",
                    }}>
                    Favicon · Apple Touch Icon · Web Manifest Maskable Icon
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

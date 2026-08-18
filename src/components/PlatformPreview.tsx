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

const DOCK_APPS = ["Phone", "Messages", "Camera"];

export default function PlatformPreview({ imageSrc, regular, round, appName = "RniconHub" }: Props) {
  const [platform, setPlatform] = useState<Platform>("android");
  const androidVariant = round ?? regular;
  const iosVariant = regular ?? round;
  const webVariant = regular ?? round;

  return (
    <div className="platform-preview">
      <div className="platform-tabs">
        <button className={`platform-tab ${platform === "android" ? "platform-tab-active" : ""}`} onClick={() => setPlatform("android")}>
          <span className="platform-tab-dot" aria-hidden />
          Android
        </button>
        <button className={`platform-tab ${platform === "ios" ? "platform-tab-active" : ""}`} onClick={() => setPlatform("ios")}>
          <span className="platform-tab-dot" aria-hidden />
          iOS
        </button>
        <button className={`platform-tab ${platform === "web" ? "platform-tab-active" : ""}`} onClick={() => setPlatform("web")}>
          <span className="platform-tab-dot" aria-hidden />
          Web
        </button>
      </div>

      <div className="platform-stage">
        {platform === "android" && (
          <div className="device-shell">
            <div className="device-btn device-btn-power" />
            <div className="device-btn device-btn-volume" />
            <div className="phone-mock">
            <div className="phone-mock-notchdot" />
            <div className="phone-mock-statusbar">
              <span>10:08</span>
              <span>📶 100%</span>
            </div>
            <div className="phone-mock-lockwidget">
              <strong>Lunch with Jane</strong>
              <span>4:00 PM – 4:30 PM</span>
            </div>
            <div className="phone-mock-grid">
              <div className="phone-mock-app">
                <div className="phone-mock-icon-shell round-shell">
                  <span className="glyph">📞</span>
                </div>
                <span>Phone</span>
              </div>
              <div className="phone-mock-app">
                <div className="phone-mock-icon-shell round-shell">
                  <span className="glyph">✉️</span>
                </div>
                <span>Gmail</span>
              </div>
              <div className="phone-mock-app phone-mock-app-hero">
                <div className="phone-mock-icon-shell round-shell hero-shell">
                  {androidVariant && imageSrc && <ShapePreview variant={androidVariant} imageSrc={imageSrc} size={52} />}
                </div>
                <span>{appName}</span>
              </div>
              <div className="phone-mock-app">
                <div className="phone-mock-icon-shell round-shell">
                  <span className="glyph">🧮</span>
                </div>
                <span>Calc</span>
              </div>
              <div className="phone-mock-app">
                <div className="phone-mock-icon-shell round-shell">
                  <span className="glyph">▶️</span>
                </div>
                <span>Play</span>
              </div>
            </div>
            <div className="phone-mock-searchbar">
              <span className="search-g">G</span>
              <span>Search</span>
            </div>
            </div>
          </div>
        )}

        {platform === "ios" && (
          <div className="device-shell">
            <div className="device-btn device-btn-power" />
            <div className="device-btn device-btn-volume" />
            <div className="phone-mock phone-mock-ios">
            <div className="dynamic-island" />
            <div className="phone-mock-statusbar">
              <span>9:41</span>
              <span>📶 🔋</span>
            </div>
            <div className="phone-mock-grid">
              <div className="phone-mock-app phone-mock-app-hero">
                <div className="phone-mock-icon-shell squircle-shell hero-shell">
                  {iosVariant && imageSrc && <ShapePreview variant={iosVariant} imageSrc={imageSrc} size={52} />}
                </div>
                <span>{appName}</span>
              </div>
              <div className="phone-mock-app">
                <div className="phone-mock-icon-shell squircle-shell">
                  <span className="glyph">✉️</span>
                </div>
                <span>Mail</span>
              </div>
              <div className="phone-mock-app">
                <div className="phone-mock-icon-shell squircle-shell">
                  <span className="glyph">📷</span>
                </div>
                <span>Camera</span>
              </div>
            </div>
            <div className="phone-mock-dock">
              {DOCK_APPS.map((name) => (
                <div className="phone-mock-icon-shell squircle-shell dock-shell" key={name}>
                  <span className="glyph">•</span>
                </div>
              ))}
              {iosVariant && imageSrc && (
                <div className="phone-mock-icon-shell squircle-shell dock-shell">
                  <ShapePreview variant={iosVariant} imageSrc={imageSrc} size={38} />
                </div>
              )}
            </div>
            </div>
          </div>
        )}

        {platform === "web" && (
          <div className="browser-mock">
            <div className="browser-mock-bar">
              <div className="browser-mock-dots">
                <span /> <span /> <span />
              </div>
              <div className="browser-mock-tab">
                {webVariant && imageSrc && <ShapePreview variant={webVariant} imageSrc={imageSrc} size={14} />}
                <span>{appName}</span>
              </div>
            </div>
            <div className="browser-mock-address">🔒 {appName.toLowerCase().replace(/\s+/g, "")}.app</div>
            <div className="browser-mock-body">
              <div className="browser-mock-favicon-row">
                {webVariant && imageSrc && (
                  <div className="phone-mock-icon-shell squircle-shell hero-shell browser-hero">
                    <ShapePreview variant={webVariant} imageSrc={imageSrc} size={64} />
                  </div>
                )}
                <div>
                  <strong>{appName}</strong>
                  <p>favicon · apple-touch-icon · maskable icon</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

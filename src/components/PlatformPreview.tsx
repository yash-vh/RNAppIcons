import { useState } from "react";
import type { IconVariant } from "../shapes/types";
import ShapePreview from "./ShapePreview";
import androidFrame from "../assets/android.png";
import iosFrame from "../assets/ios.png";

interface Props {
  imageSrc: string | null;
  regular?: IconVariant;
  round?: IconVariant;
  appName?: string;
}

type Platform = "android" | "ios" | "web";

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

/** Globe SVG Icon */
const GlobeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

/** Google Phone App Icon */
const GooglePhoneIcon = () => (
  <div className="android-home-icon-base bg-white">
    <svg width="60%" height="60%" viewBox="0 0 24 24" fill="#2563eb">
      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-2.2 2.2a15.053 15.053 0 0 1-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1.01A11.36 11.36 0 0 1 8.57 3.9c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.52c0-.55-.45-1-.99-1z" />
    </svg>
  </div>
);

/** Google Gmail App Icon */
const GoogleGmailIcon = () => (
  <div className="android-home-icon-base bg-white">
    <svg width="62%" height="62%" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v.4l10 6.6 10-6.6V6z"
      />
      <path
        fill="#EA4335"
        d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5.3 8-5.3v10z"
      />
      <path
        fill="#34A853"
        d="M22 18c0 1.1-.9 2-2 2h-4v-8l6-4v10z"
      />
      <path
        fill="#FBBC05"
        d="M2 18c0 1.1.9 2 2 2h4v-8l-6-4v10z"
      />
      <path
        fill="#EA4335"
        d="M4 6l8 5.3L20 6H4z"
      />
    </svg>
  </div>
);

/** Android Calculator Icon */
const GoogleCalculatorIcon = () => (
  <div className="android-home-icon-base bg-calc">
    <div className="calc-quadrants">
      <span className="calc-sym">−</span>
      <span className="calc-sym">×</span>
      <span className="calc-sym">+</span>
      <span className="calc-sym calc-sym-blue">=</span>
    </div>
  </div>
);

/** Google Play Store App Icon */
const GooglePlayStoreIcon = () => (
  <div className="android-home-icon-base bg-white">
    <svg width="58%" height="58%" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M3.61 2.21c-.37.4-.59.97-.59 1.69v16.2c0 .72.22 1.29.59 1.69l.09.08 9.08-9.08v-.22L4.01 3.25l-.4-.04z"
      />
      <path
        fill="#FBBC05"
        d="M15.75 14.54l-3-3v-.22l3-3 .07.04 3.56 2.02c1.02.58 1.02 1.52 0 2.1l-3.56 2.02-.07.04z"
      />
      <path
        fill="#EA4335"
        d="M15.82 14.5l-3.04-3.04-9.08 9.08c.34.36.9.4 1.55.03l10.57-6.07"
      />
      <path
        fill="#34A853"
        d="M15.82 9.5L5.25 3.43c-.65-.37-1.21-.33-1.55.03l9.08 9.08 3.04-3.04z"
      />
    </svg>
  </div>
);

/** iOS Mail Icon */
const IosMailIcon = () => (
  <div className="ios-home-icon-base bg-ios-blue">
    <svg width="60%" height="60%" viewBox="0 0 24 24" fill="white">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  </div>
);

/** iOS Camera Icon */
const IosCameraIcon = () => (
  <div className="ios-home-icon-base bg-ios-gray">
    <svg width="60%" height="60%" viewBox="0 0 24 24" fill="white">
      <circle cx="12" cy="12" r="3.2" />
      <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
    </svg>
  </div>
);

/** iOS Photos Icon */
const IosPhotosIcon = () => (
  <div className="ios-home-icon-base bg-white">
    <svg width="68%" height="68%" viewBox="0 0 24 24">
      <circle cx="12" cy="7" r="3" fill="#ea4335" opacity="0.9" />
      <circle cx="17" cy="12" r="3" fill="#fbbc05" opacity="0.9" />
      <circle cx="12" cy="17" r="3" fill="#34a853" opacity="0.9" />
      <circle cx="7" cy="12" r="3" fill="#4285f4" opacity="0.9" />
      <circle cx="8.5" cy="8.5" r="2.8" fill="#ff6d00" opacity="0.85" />
      <circle cx="15.5" cy="8.5" r="2.8" fill="#fabc05" opacity="0.85" />
      <circle cx="15.5" cy="15.5" r="2.8" fill="#46bdc6" opacity="0.85" />
      <circle cx="8.5" cy="15.5" r="2.8" fill="#7baaf7" opacity="0.85" />
    </svg>
  </div>
);

export default function PlatformPreview({
  imageSrc,
  regular,
  round,
  appName = "RniconHub",
}: Props) {
  const [platform, setPlatform] = useState<Platform>("android");

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
          aria-label="Device platform selection"
        >
          <button
            type="button"
            role="tab"
            aria-selected={platform === "android"}
            className={`platform-tab ${platform === "android" ? "platform-tab-active" : ""}`}
            onClick={() => setPlatform("android")}
          >
            <AndroidIcon /> Android
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={platform === "ios"}
            className={`platform-tab ${platform === "ios" ? "platform-tab-active" : ""}`}
            onClick={() => setPlatform("ios")}
          >
            <AppleIcon /> iOS
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={platform === "web"}
            className={`platform-tab ${platform === "web" ? "platform-tab-active" : ""}`}
            onClick={() => setPlatform("web")}
          >
            <GlobeIcon /> Web
          </button>
        </div>
      </div>

      <div className="platform-stage">
        {platform === "android" && (
          <div className="asset-device-container android-device-container">
            <img
              src={androidFrame}
              alt="Android phone frame preview"
              className="asset-device-img"
            />
            {/* Slot 1: Phone */}
            <div className="android-slot slot-phone">
              <GooglePhoneIcon />
            </div>

            {/* Slot 2: Gmail */}
            <div className="android-slot slot-gmail">
              <GoogleGmailIcon />
            </div>

            {/* Slot 3: App Name (Center User Icon) */}
            <div className="android-slot slot-app-name">
              {androidVariant && imageSrc ? (
                <ShapePreview
                  variant={androidVariant}
                  imageSrc={imageSrc}
                  size={52}
                />
              ) : (
                <div className="android-home-icon-base bg-accent-gradient">
                  ⚡
                </div>
              )}
            </div>

            {/* Slot 4: Calculator */}
            <div className="android-slot slot-calc">
              <GoogleCalculatorIcon />
            </div>

            {/* Slot 5: Play Store */}
            <div className="android-slot slot-play">
              <GooglePlayStoreIcon />
            </div>
          </div>
        )}

        {platform === "ios" && (
          <div className="asset-device-container ios-device-container">
            <img
              src={iosFrame}
              alt="iPhone device frame preview"
              className="asset-device-img"
            />
            {/* Column 1: App Name */}
            <div className="ios-slot slot-ios-app">
              {iosVariant && imageSrc ? (
                <ShapePreview
                  variant={iosVariant}
                  imageSrc={imageSrc}
                  size={54}
                />
              ) : (
                <div className="ios-home-icon-base bg-accent-gradient">
                  ⚡
                </div>
              )}
            </div>

            {/* Column 2: Mail */}
            <div className="ios-slot slot-ios-mail">
              <IosMailIcon />
            </div>

            {/* Column 3: Camera */}
            <div className="ios-slot slot-ios-camera">
              <IosCameraIcon />
            </div>

            {/* Column 4: Photos */}
            <div className="ios-slot slot-ios-photos">
              <IosPhotosIcon />
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
                    size={16}
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
                  <div className="browser-hero-icon">
                    <ShapePreview
                      variant={webVariant}
                      imageSrc={imageSrc}
                      size={64}
                    />
                  </div>
                )}
                <div>
                  <strong>{appName} App</strong>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: "12px",
                      color: "var(--muted)",
                    }}
                  >
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

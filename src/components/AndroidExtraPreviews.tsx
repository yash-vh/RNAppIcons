import type { IconVariant } from "../shapes/types";

interface Props {
  imageSrc: string | null;
  regular?: IconVariant;
  showMonochrome: boolean;
  showNotification: boolean;
}

/** Live silhouette preview for icons Android renders as white-on-alpha (monochrome
 * adaptive layer, status-bar notification icon) — a plain colored thumbnail is
 * misleading for these, so approximate the real render with a CSS silhouette filter. */
export default function AndroidExtraPreviews({ imageSrc, regular, showMonochrome, showNotification }: Props) {
  if (!imageSrc || !regular || (!showMonochrome && !showNotification)) return null;

  return (
    <div className="android-extra-previews">
      {showMonochrome && (
        <div className="extra-preview-card">
          <div className="mono-preview-swatch">
            <img src={imageSrc} alt="Monochrome preview" className="silhouette-img" />
          </div>
          <span>Monochrome (themed)</span>
        </div>
      )}
      {showNotification && (
        <div className="extra-preview-card">
          <div className="notif-preview-strip">
            <img src={imageSrc} alt="Notification icon preview" className="silhouette-img notif-icon" />
            <span className="notif-preview-text">RniconHub · now</span>
          </div>
          <span>Notification (status bar)</span>
        </div>
      )}
    </div>
  );
}

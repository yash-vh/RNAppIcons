interface Props {
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

const CREATOR_NAME = "yashnandha";
const CREATOR_INSTAGRAM_URL = "https://instagram.com/yashnandha06";

export default function Header({ theme, onToggleTheme }: Props) {
  return (
    <header className="site-header">
      <div className="site-header-brand">
        <span className="brand-mark" aria-hidden>
          R
        </span>
        <span className="brand-text">
          <span className="brand-name">RniconHub</span>
          <span className="brand-tagline">Multi-shape app icon generator</span>
        </span>
      </div>

      <div className="site-header-actions">
        <a
          className="creator-credit"
          href={CREATOR_INSTAGRAM_URL}
          target="_blank"
          rel="noreferrer noopener"
          title="Open Instagram"
        >
          <span className="creator-avatar" aria-hidden>
            {CREATOR_NAME.charAt(0)}
          </span>
          <span>
            Made by <strong>{CREATOR_NAME}</strong>
          </span>
        </a>

        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label="Toggle dark mode"
          title="Toggle dark mode"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
}

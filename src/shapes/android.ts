export function adaptiveIconXml(opts: { monochrome?: boolean } = {}): string {
  const mono = opts.monochrome
    ? `\n  <monochrome android:drawable="@mipmap/ic_launcher_monochrome"/>`
    : "";
  return `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
  <background android:drawable="@mipmap/ic_launcher_background"/>
  <foreground android:drawable="@mipmap/ic_launcher_foreground"/>${mono}
</adaptive-icon>
`;
}

export function manifestSnippet(): string {
  return `<application
    android:icon="@mipmap/ic_launcher"
    android:roundIcon="@mipmap/ic_launcher_round"
    ... />`;
}

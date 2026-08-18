/** Wraps a single PNG (any size) in a minimal ICO container. Valid since Windows Vista,
 * which allows ICO directory entries to hold PNG-compressed image data directly. */
export function pngToIco(pngBytes: Uint8Array, size: number): Uint8Array {
  const headerSize = 6;
  const dirEntrySize = 16;
  const dataOffset = headerSize + dirEntrySize;
  const buf = new Uint8Array(dataOffset + pngBytes.length);
  const view = new DataView(buf.buffer);

  view.setUint16(0, 0, true); // reserved
  view.setUint16(2, 1, true); // type: icon
  view.setUint16(4, 1, true); // image count

  const dim = size >= 256 ? 0 : size; // 0 means 256
  buf[6] = dim; // width
  buf[7] = dim; // height
  buf[8] = 0; // color palette
  buf[9] = 0; // reserved
  view.setUint16(10, 1, true); // color planes
  view.setUint16(12, 32, true); // bits per pixel
  view.setUint32(14, pngBytes.length, true); // image data size
  view.setUint32(18, dataOffset, true); // offset

  buf.set(pngBytes, dataOffset);
  return buf;
}

export function manifestIconsSnippet(): string {
  return `{
  "icons": [
    { "src": "/favicon.ico", "type": "image/x-icon", "sizes": "16x16 32x32" },
    { "src": "/icon-192.png", "type": "image/png", "sizes": "192x192" },
    { "src": "/icon-512.png", "type": "image/png", "sizes": "512x512" },
    { "src": "/icon-192-maskable.png", "type": "image/png", "sizes": "192x192", "purpose": "maskable" },
    { "src": "/icon-512-maskable.png", "type": "image/png", "sizes": "512x512", "purpose": "maskable" }
  ]
}`;
}

export function webReadme(): string {
  return `Add this to your HTML <head>:

    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

Add this to your app's manifest.json:

    ...
    ${manifestIconsSnippet()}
    ...
`;
}

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/** Reverses `readAsDataURL` output for `FormData` / `File` uploads. */
export function dataUrlToFile(dataUrl: string): File {
  const comma = dataUrl.indexOf(',');
  if (comma === -1) {
    throw new Error('Invalid image data');
  }
  const header = dataUrl.slice(0, comma);
  const base64 = dataUrl.slice(comma + 1);
  const mimeMatch = header.match(/data:(.*?);base64/);
  const mime = mimeMatch?.[1] ?? 'image/jpeg';
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const ext =
    mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : mime === 'image/gif' ? 'gif' : 'jpg';
  return new File([bytes], `poster.${ext}`, { type: mime });
}

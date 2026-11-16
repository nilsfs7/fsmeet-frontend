'use client';

import { QRCodeSVG } from 'qrcode.react';

/** Static SVG QR code (qrcode.react, already a dependency). */
export function AppQrCode({ value, title }: { value: string; title: string }) {
  return (
    <span data-qr-value={value} className="contents">
      <QRCodeSVG value={value} size={112} level="M" marginSize={0} title={title} bgColor="#ffffff" fgColor="#0b1220" />
    </span>
  );
}

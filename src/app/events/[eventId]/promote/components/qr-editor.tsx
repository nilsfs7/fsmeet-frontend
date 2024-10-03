'use client';

import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import TextButton from '@/components/common/TextButton';
import TextInput from '@/components/common/TextInput';
import { useQRCode } from 'next-qrcode';

interface IQrEditor {
  eventId: string;
  alias?: string;
}

export const QrEditor = ({ alias, eventId }: IQrEditor) => {
  const { Canvas } = useQRCode();

  const [qrContent, setQrContent] = useState(alias || eventId);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const generateQrCode = async (content: string) => {
    try {
      const url = await QRCode.toDataURL(content);
      setQrCodeUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChangeQrContent = (event: any) => {
    let content: string = event.currentTarget.value;
    content = content.toLowerCase();

    setQrContent(content);
  };

  const handleDownloadQrCode = async () => {
    const canvas = document.getElementById('qr-code');
    if (canvas) {
      const image = await html2canvas(canvas);
      const link = document.createElement('a');
      link.href = image.toDataURL('image/png');
      link.download = 'qr-code.png';
      link.click();
    }
  };

  useEffect(() => {
    generateQrCode(eventId);
  }, [qrContent]);

  return (
    <div className="flex flex-col">
      <TextInput
        id={'qr'}
        label={'QR code content'}
        // labelOnTop={false}
        placeholder="my alias"
        value={qrContent}
        onChange={(e) => {
          handleInputChangeQrContent(e);
        }}
      />

      {qrCodeUrl && (
        <div className="flex flex-col items-center border-red-700 border">
          <div id="qr-code" className="p-2">
            {/* <img src={qrCodeUrl} alt="QR Code" /> */}
            <Canvas
              text={qrContent}
              options={{
                errorCorrectionLevel: 'M',
                margin: 3,
                scale: 4,
                width: 200,
                color: {
                  dark: '#010599FF',
                  light: '#FFBF60FF',
                },
              }}
            />
          </div>

          <TextButton text="Download" onClick={handleDownloadQrCode} />
        </div>
      )}
    </div>
  );
};

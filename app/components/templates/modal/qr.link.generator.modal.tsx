import { useRef } from "react";
import QRCode from "react-qr-code";

interface QRModalProps {
  showQRModal: boolean;
  selectedLink: {
    url: string;
    name: string;
  };
  onClose: () => void;
}

const QRCodeLinkGeneratorModal = ({
  showQRModal,
  selectedLink,
  onClose,
}: QRModalProps) => {
  const qrContainerRef = useRef<HTMLDivElement>(null);

  if (!showQRModal) return null;

  const downloadQR = () => {
    if (!qrContainerRef.current) return;

    const svg = qrContainerRef.current.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.src = "data:image/svg+xml;base64," + btoa(svgData);

    img.onload = () => {
      const padding = 20; // white padding in pixels
      const canvas = document.createElement("canvas");
      canvas.width = img.width + padding * 2;
      canvas.height = img.height + padding * 2;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      // Fill white background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw QR code with padding
      ctx.drawImage(img, padding, padding);

      const pngFile = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngFile;
      link.download = `${selectedLink.name}-QRCode.png`;
      link.click();
    };
  };

  const copyLink = () => {
    navigator.clipboard.writeText(selectedLink.url).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            QR Code for {selectedLink.name}
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* QR Code Container */}
        <div ref={qrContainerRef} className="flex justify-center mb-4">
          <QRCode value={selectedLink.url} size={200} />
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Event Name</label>
            <input
              type="text"
              value={selectedLink.name}
              readOnly
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">URL</label>
            <div className="flex">
              <input
                type="text"
                value={selectedLink.url}
                readOnly
                className="w-full border rounded-l px-3 py-2 bg-gray-100"
              />
              <button
                type="button"
                onClick={copyLink}
                className="bg-blue-600 text-white px-3 rounded-r hover:bg-blue-700"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="flex justify-between space-x-2">
            <button
              type="button"
              onClick={downloadQR}
              className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Download QR
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QRCodeLinkGeneratorModal;

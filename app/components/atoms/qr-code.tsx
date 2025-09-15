import QRCode from "react-qr-code";

interface QRCodeBoxProps {
  value: string; // the text or URL to encode
  size?: number; // optional size of QR
  bgColor?: string; // optional background color
  fgColor?: string; // optional foreground color
  className?: string; // for Tailwind styling
}

const QRCodeBox = ({
  value,
  size = 160,
  bgColor = "white",
  fgColor = "black",
  className = "",
}: QRCodeBoxProps) => {
  if (!value || typeof value !== "string") {
    return (
      <div
        className={`flex items-center justify-center rounded-lg shadow ${className}`}
        style={{ width: size, height: size, backgroundColor: bgColor }}
      >
        <span className="text-xs text-gray-500">No QR Data</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-lg shadow ${className}`}
      style={{ width: size, height: size, backgroundColor: bgColor }}
    >
      <QRCode
        value={value}
        size={size - 20}
        fgColor={fgColor}
        bgColor={bgColor}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
      />
    </div>
  );
};

export default QRCodeBox;

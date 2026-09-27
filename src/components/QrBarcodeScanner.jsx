import { useZxing } from "react-zxing";
import { useState } from "react";

export default function QrBarcodeScanner() {
  const [scannedValue, setScannedValue] = useState("");

  const { ref } = useZxing({
    onResult(result) {
      const text = result.getText();
      console.log("Scanned value:", text);

      // ✅ Extract only numbers (IMEI, SIM, etc.)
      const numbersOnly = text.replace(/\D/g, ""); 
      setScannedValue(numbersOnly || text);
    },
  });

  return (
    <div className="flex flex-col items-center p-4">
      {/* Video Preview */}
      <video
        ref={ref}
        className="w-full max-w-md rounded-lg shadow-md"
        autoPlay
        muted
      />

      {/* Result */}
      <p className="mt-4 text-lg font-semibold text-gray-700">
        {scannedValue
          ? `Scanned Number: ${scannedValue}`
          : "Point camera at a QR or Barcode"}
      </p>
    </div>
  );
}

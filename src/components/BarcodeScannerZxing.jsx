import { useState } from "react";
import { useZxing } from "react-zxing";

function SimScanner() {
  const [result, setResult] = useState("");

  const { ref } = useZxing({
    onDecodeResult(result) {
      setResult(result.getText());
    },
  });

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-xl font-bold mb-4">SIM Barcode Scanner</h1>

      {/* Camera Preview */}
      <video ref={ref} className="border rounded-lg w-full max-w-md" />

      {/* Show result */}
      {result && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg w-full max-w-md text-center">
          <p className="font-mono text-lg">Scanned: {result}</p>
        </div>
      )}
    </div>
  );
}

export default SimScanner;

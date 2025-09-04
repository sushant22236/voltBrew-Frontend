// import { useEffect, useRef } from "react";
// import { BrowserMultiFormatReader } from "@zxing/browser";

// function BarcodeScanner({ onDetected, onClose }) {
//   const videoRef = useRef(null);

//   useEffect(() => {
//     const codeReader = new BrowserMultiFormatReader();

//     codeReader.decodeFromVideoDevice(
//       null,
//       videoRef.current,
//       (result, err) => {
//         if (result) {
//           onDetected(result.getText());
//           onClose();
//         }
//       }
//     );

//     return () => {
//       codeReader.reset();
//     };
//   }, [onDetected, onClose]);

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
//       <div className="bg-white p-4 rounded-xl shadow-lg w-[90%] max-w-md">
//         <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
//           Scan Barcode
//         </h2>
//         <video
//           ref={videoRef}
//           style={{ width: "100%", borderRadius: "8px" }}
//         />
//         <button
//           onClick={onClose}
//           className="w-full bg-red-500 text-white mt-4 py-2 rounded-md hover:bg-red-600 transition"
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// }

// export default BarcodeScanner;


// 


import { useEffect, useRef } from "react";
import Quagga from "quagga";

export default function BarcodeScanner() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          target: videoRef.current, // where video will be rendered
          constraints: {
            facingMode: "environment",
          },
        },
        decoder: {
          readers: ["code_128_reader", "ean_reader"], // add your formats
        },
        locate: true,
      },
      (err) => {
        if (err) {
          console.error("Quagga init error:", err);
          return;
        }
        Quagga.start();
      }
    );

    // Process each frame
    Quagga.onProcessed(() => {
      const ctx = canvasRef.current?.getContext("2d");
      const video = videoRef.current?.querySelector("video");

      if (video && ctx) {
        ctx.drawImage(video, 0, 0, canvasRef.current.width, canvasRef.current.height);
        enhanceContrast(ctx, canvasRef.current.width, canvasRef.current.height);
      }
    });

    // On barcode detected
    Quagga.onDetected((result) => {
      console.log("Barcode detected:", result.codeResult.code);
    });

    return () => {
      Quagga.stop();
      Quagga.offProcessed();
      Quagga.offDetected();
    };
  }, []);

  // 🔹 Enhance contrast by converting to high-contrast B/W
  const enhanceContrast = (ctx, width, height) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;

      // Simple thresholding → make it pure black or white
      avg = avg > 128 ? 255 : 0;

      data[i] = data[i + 1] = data[i + 2] = avg;
    }

    ctx.putImageData(imageData, 0, 0);
  };

  return (
    <div>
      {/* Quagga video stream */}
      <div ref={videoRef} style={{ width: "100%", height: "auto" }} />

      {/* Canvas used for processing (not visible to user) */}
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{ display: "none" }}
      />
    </div>
  );
}

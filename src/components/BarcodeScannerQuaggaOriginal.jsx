import React, { useEffect } from "react";
import Quagga, { halfSample } from "quagga";

/*

code_128_reader (default)
ean_reader
ean_8_reader
code_39_reader
code_39_vin_reader
codabar_reader
upc_reader
upc_e_reader
i2of5_reader
2of5_reader
code_93_reader

 */

const reader = "code_128_reader";

const BarcodeScannerQuaggaImageOriginal = () => {
  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          constraints: {
            facingMode: "environment", // back camera
          },
        },
        decoder: {
          readers: [reader],
        },
        // locate:true,
        locator: {
          patchSize: "large",
          halfSample: false,
        }
      },
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
        Quagga.start();
      }
    );

    Quagga.onDetected((result) => {
      const scannedText = result.codeResult.code;
      console.log("Barcode detected:", scannedText);
      window.alert(`Barcode detected: ${scannedText}`);
    });

    return () => {
      Quagga.stop();
    };
  }, []);

  return <div>
    <h1>Barcode Scanner</h1>
    <h2>{reader}</h2>
    <div id="interactive" className="viewport" />;
  </div> 
};

export default BarcodeScannerQuaggaImageOriginal;




// import React, { useEffect, useRef } from "react";
// import Quagga from "quagga";

// const reader = "code_128_reader";

// const BarcodeScannerQuaggaImageOriginal = () => {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     Quagga.init(
//       {
//         inputStream: {
//           type: "LiveStream",
//           target: document.querySelector("#interactive"), // attach video here
//           constraints: {
//             facingMode: "environment", // back camera
//           },
//         },
//         decoder: {
//           readers: [reader],
//         },
//         locator: {
//           patchSize: "large",
//           halfSample: false,
//         },
//       },
//       (err) => {
//         if (err) {
//           console.error(err);
//           return;
//         }
//         Quagga.start();
//       }
//     );

//     // 🔹 Enhance frames with canvas
//     Quagga.onProcessed(() => {
//       const video = document.querySelector("#interactive video");
//       const canvas = canvasRef.current;
//       if (!video || !canvas) return;

//       const ctx = canvas.getContext("2d");
//       ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//       enhanceContrast(ctx, canvas.width, canvas.height);
//     });

//     // When barcode detected
//     Quagga.onDetected((result) => {
//       const scannedText = result.codeResult.code;
//       console.log("Barcode detected:", scannedText);
//       window.alert(`Barcode detected: ${scannedText}`);
//     });

//     return () => {
//       Quagga.stop();
//       Quagga.offProcessed();
//       Quagga.offDetected();
//     };
//   }, []);

//   // 🔹 Function to increase contrast (black & white thresholding)
//   const enhanceContrast = (ctx, width, height) => {
//     const imageData = ctx.getImageData(0, 0, width, height);
//     const data = imageData.data;

//     for (let i = 0; i < data.length; i += 4) {
//       let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;

//       // Threshold → high contrast
//       avg = avg > 128 ? 255 : 0;

//       data[i] = data[i + 1] = data[i + 2] = avg;
//     }

//     ctx.putImageData(imageData, 0, 0);
//   };

//   return (
//     <div>
//       <h1>Barcode Scanner</h1>
//       <h2>{reader}</h2>

//       {/* Quagga video stream */}
//       <div id="interactive" className="viewport" />

//       {/* Hidden canvas for preprocessing */}
//       <canvas
//         ref={canvasRef}
//         width={640}
//         height={480}
//         style={{ display: "none" }}
//       />
//     </div>
//   );
// };

// export default BarcodeScannerQuaggaImageOriginal;





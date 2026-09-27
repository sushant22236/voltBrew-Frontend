// import React, { useEffect } from "react";
// import Quagga, { halfSample } from "quagga";

// /*

// code_128_reader (default)
// ean_reader
// ean_8_reader
// code_39_reader
// code_39_vin_reader
// codabar_reader
// upc_reader
// upc_e_reader
// i2of5_reader
// 2of5_reader
// code_93_reader

//  */

// const reader = "code_128_reader";

// const BarcodeScannerQuagga = () => {
//   useEffect(() => {
//     Quagga.init(
//       {
//         inputStream: {
//           type: "LiveStream",
//           constraints: {
//             facingMode: "environment", // back camera
//           },
//         },
//         decoder: {
//           readers: [reader],
//         },
//         // locate:true,
//         locator: {
//           patchSize: "large",
//           halfSample: false,
//         }
//       },
//       (err) => {
//         if (err) {
//           console.error(err);
//           return;
//         }
//         Quagga.start();
//       }
//     );

//     Quagga.onDetected((result) => {
//       const scannedText = result.codeResult.code;
//       console.log("Barcode detected:", scannedText);
//       window.alert(`Barcode detected: ${scannedText}`);
//     });

//     return () => {
//       Quagga.stop();
//     };
//   }, []);

//   return <div>
//     <h1>Barcode Scanner</h1>
//     <h2>{reader}</h2>
//     <div id="interactive" className="viewport" />;
//   </div> 
// };

// export default BarcodeScannerQuagga;




// import React, { useEffect, useRef } from "react";
// import Quagga from "quagga";

// const reader = "code_128_reader";

// const BarcodeScannerQuagga = () => {
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

// export default BarcodeScannerQuagga;


// 


import  { useEffect, useRef } from "react";
import Quagga from "quagga";

const readers = [
  "code_128_reader",
  "ean_reader",
  "ean_8_reader",
  "upc_reader",
  "code_39_reader",
];

const BarcodeScannerQuagga = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const lastDetectedRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        video.srcObject = stream;
        video.setAttribute("playsinline", true);
        video.play();
      })
      .catch((err) => console.error("Camera error:", err));

    const interval = setInterval(() => {
      processFrame();
    }, 200);

    return () => {
      clearInterval(interval);
      if (video.srcObject) {
        video.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const processFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    enhanceContrast(ctx, canvas.width, canvas.height);

    Quagga.decodeSingle(
      {
        src: canvas.toDataURL(),
        numOfWorkers: 0,
        decoder: { readers },
        locate: true,
      },
      (result) => {
        if (result?.codeResult) {
          const code = result.codeResult.code;

          // Prevent duplicate detections
          if (lastDetectedRef.current !== code) {
            lastDetectedRef.current = code;
            console.log("✅ Barcode detected:", code);
            alert(`Barcode detected: ${code}`);
          }
        }
      }
    );
  };

  const enhanceContrast = (ctx, width, height) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const contrast = 2; // increase for higher contrast
    const intercept = 128 * (1 - contrast);

    for (let i = 0; i < data.length; i += 4) {
      let gray = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
      gray = gray * contrast + intercept;
      gray = Math.max(0, Math.min(255, gray));
      data[i] = data[i + 1] = data[i + 2] = gray;
    }

    ctx.putImageData(imageData, 0, 0);
  };
  console.log("Rendering BarcodeScannerQuagga");
return (
  <div>
    <h1>Barcode Scanner (Canvas + Quagga)</h1>
    
    {/* Keep video hidden, we only use it as a source */}
    <video
      ref={videoRef}
      style={{ display: "none" }}
    />

    {/* Show processed output */}
    <canvas
      ref={canvasRef}
      width={640}
      height={1080}
      style={{ width: "100%", maxWidth: "640px", border: "1px solid black" }}
    />
  </div>
);
};

export default BarcodeScannerQuagga;

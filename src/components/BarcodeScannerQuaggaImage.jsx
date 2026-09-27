


// import  { useEffect, useRef } from "react";
// import Quagga from "quagga";

// const readers = [
//   "code_128_reader",
//   "ean_reader",
//   "ean_8_reader",
//   "upc_reader",
//   "code_39_reader",
// ];

// const BarcodeScannerQuagga = () => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const lastDetectedRef = useRef(null);

//   useEffect(() => {
//     const video = videoRef.current;

//     navigator.mediaDevices
//       .getUserMedia({ video: { facingMode: "environment" } })
//       .then((stream) => {
//         video.srcObject = stream;
//         video.setAttribute("playsinline", true);
//         video.play();
//       })
//       .catch((err) => console.error("Camera error:", err));

//     const interval = setInterval(() => {
//       processFrame();
//     }, 200);

//     return () => {
//       clearInterval(interval);
//       if (video.srcObject) {
//         video.srcObject.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, []);

//   const processFrame = () => {
//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     if (!video || !canvas) return;

//     const ctx = canvas.getContext("2d");
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//     enhanceContrast(ctx, canvas.width, canvas.height);

//     Quagga.decodeSingle(
//       {
//         src: canvas.toDataURL(),
//         numOfWorkers: 0,
//         decoder: { readers },
//         locate: true,
//       },
//       (result) => {
//         if (result?.codeResult) {
//           const code = result.codeResult.code;

//           // Prevent duplicate detections
//           if (lastDetectedRef.current !== code) {
//             lastDetectedRef.current = code;
//             console.log("✅ Barcode detected:", code);
//             alert(`Barcode detected: ${code}`);
//           }
//         }
//       }
//     );
//   };

//   const enhanceContrast = (ctx, width, height) => {
//     const imageData = ctx.getImageData(0, 0, width, height);
//     const data = imageData.data;

//     const contrast = 2; // increase for higher contrast
//     const intercept = 128 * (1 - contrast);

//     for (let i = 0; i < data.length; i += 4) {
//       let gray = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
//       gray = gray * contrast + intercept;
//       gray = Math.max(0, Math.min(255, gray));
//       data[i] = data[i + 1] = data[i + 2] = gray;
//     }

//     ctx.putImageData(imageData, 0, 0);
//   };
//   console.log("Rendering BarcodeScannerQuagga");
// return (
//   <div>
//     <h1>Barcode Scanner (Canvas + Quagga)</h1>
    
//     {/* Keep video hidden, we only use it as a source */}
//     <video
//       ref={videoRef}
//       style={{ display: "none" }}
//     />

//     {/* Show processed output */}
//     <canvas
//       ref={canvasRef}
//       width={640}
//       height={1080}
//       style={{ width: "100%", maxWidth: "640px", border: "1px solid black" }}
//     />
//   </div>
// );
// };

// export default BarcodeScannerQuagga;



import { useRef, useState, useEffect } from "react";
import Quagga from "quagga";

const readers = [
  "code_128_reader",
  "ean_reader",
  "ean_8_reader",
  "upc_reader",
  "code_39_reader",
];

const BarcodeScannerQuaggaImage = () => {
  const canvasRef = useRef(null);
  const [result, setResult] = useState("");
  const [contrast, setContrast] = useState(1.6);
  const [brightness, setBrightness] = useState(0);
  const [uploadedImg, setUploadedImg] = useState(null); // store original image

  // Redraw image whenever contrast/brightness changes
  useEffect(() => {
    if (uploadedImg) {
      drawAndProcess(uploadedImg);
    }
  }, [contrast, brightness]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        setUploadedImg(img); // store image for later adjustments
        drawAndProcess(img);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const drawAndProcess = (img) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;

    // Draw original image
    ctx.drawImage(img, 0, 0, img.width, img.height);

    // Apply brightness + contrast
    enhanceContrastAndBrightness(ctx, img.width, img.height, contrast, brightness);

    // Run Quagga
    Quagga.decodeSingle(
      {
        src: canvas.toDataURL(),
        numOfWorkers: 0,
        decoder: { readers },
        locate: true,
      },
      (res) => {
        if (res?.codeResult) {
          setResult(res.codeResult.code);
          console.log("✅ Barcode detected:", res.codeResult.code);
        } else {
          setResult("❌ No barcode found");
        }
      }
    );
  };

  const enhanceContrastAndBrightness = (ctx, width, height, contrast = 1.6, brightness = 0) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const intercept = 128 * (1 - contrast);

    for (let i = 0; i < data.length; i += 4) {
      // Apply contrast + brightness to each RGB channel
     data[i]     = Math.min(255, Math.max(0, data[i] * contrast + intercept + brightness)); // R
     data[i + 1] = Math.min(255, Math.max(0, data[i + 1] * contrast + intercept + brightness)); // G
     data[i + 2] = Math.min(255, Math.max(0, data[i + 2] * contrast + intercept + brightness)); // B
     // Alpha channel (i+3) left unchanged
    }
   ctx.putImageData(imageData, 0, 0);
  };


  return (
    <div>
      <h1>Upload → Adjust Brightness/Contrast → Decode</h1>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      <div style={{ marginTop: "10px" }}>
        <label>Contrast: {contrast}</label>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={contrast}
          onChange={(e) => setContrast(parseFloat(e.target.value))}
        />
      </div>

      <div style={{ marginTop: "10px" }}>
        <label>Brightness: {brightness}</label>
        <input
          type="range"
          min="-100"
          max="100"
          step="5"
          value={brightness}
          onChange={(e) => setBrightness(parseInt(e.target.value))}
        />
      </div>

      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          maxWidth: "640px",
          border: "1px solid black",
          marginTop: "10px",
        }}
      />

      {result && <p>Result: {result}</p>}
    </div>
  );
};

export default BarcodeScannerQuaggaImage;

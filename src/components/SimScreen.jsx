import { useState } from "react";
import axios from "axios";
import { BrowserMultiFormatReader } from "@zxing/browser";

function SimScreen() {
  const [simNumber, setSimNumber] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);

  // Scanner instance
  const [scanner] = useState(new BrowserMultiFormatReader());

  const handleSave = async () => {
    const cleanSim = simNumber.trim(); // normalize for both manual + scanned

    if (!cleanSim) {
      setMessage("Please enter SIM number");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      await axios.post("http://localhost:3000/api/sim", { simNumber: cleanSim });
      setMessage("SIM saved successfully");
      setSimNumber("");
    } catch (error) {
      console.error(error);
      setMessage("Error saving SIM");
    } finally {
      setLoading(false);
    }
  };

  // Start barcode scanning
  const startScan = async () => {
    setCameraOpen(true);

    try {
      const devices = await BrowserMultiFormatReader.listVideoInputDevices();
      if (devices.length === 0) {
        setMessage("No camera found");
        return;
      }

      // Use first available camera
      scanner.decodeFromVideoDevice(
        devices[0].deviceId,
        "video-preview",
        (result, err) => {
          if (result) {
            const cleanValue = result.getText().trim(); // sanitize scanned value
            console.log("Scanned value:", JSON.stringify(cleanValue));
            setSimNumber(cleanValue);
            stopScan();
          }
          if (err) {
            // ignore decode errors while scanning
          }
        }
      );
    } catch (error) {
      console.error(error);
      setMessage("Error starting camera");
    }
  };

  // Stop scanning
  const stopScan = () => {
    scanner.reset();
    setCameraOpen(false);
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center bg-white px-6 py-6">
      <div className="w-full max-w-sm">
        {/* Logo + Company */}
        <div className="flex items-center space-x-2 mb-6">
          <img src="/logo.jpg" alt="Logo" className="w-50 h-15" />
        </div>

        {/* Heading Banner */}
        <div
          className="rounded-xl flex flex-col mb-8 bg-cover bg-center"
          style={{
            backgroundImage: `url('/SimCard.jpg')`,
            height: "180px",
            width: "100%",
          }}
        >
          <h2 className="text-3xl sm:text-3xl font-bold text-white ml-6 mt-10 mb-12 leading-snug">
            Plug Into <br />{" "}
            <span className="text-blue-400 italic">Smart Living</span>
          </h2>
        </div>

        {/* Enter SIM Card */}
        <div className="bg-gray-100 rounded-xl p-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter SIM
          </label>
          <input
            type="text"
            placeholder="Enter SIM Number"
            value={simNumber}
            onChange={(e) => setSimNumber(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          {/* Camera Button */}
          <div className="flex justify-center mb-4">
            {!cameraOpen ? (
              <button
                type="button"
                className="flex flex-col items-center bg-white shadow-md border rounded-xl px-6 py-4 hover:bg-gray-50 transition"
                onClick={startScan}
              >
                <div className="w-10 h-10 bg-blue-100 flex items-center justify-center rounded-lg mb-2">
                  📷
                </div>
                <span className="text-gray-600 text-sm">Open Camera</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopScan}
                className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
              >
                Close Camera
              </button>
            )}
          </div>

          {/* Camera Preview + Overlay */}
          {cameraOpen && (
            <div className="relative w-full flex justify-center">
              <video
                id="video-preview"
                className="w-full rounded-lg shadow-md"
                autoPlay
                muted
              ></video>
              {/* Overlay for guidance */}
              {/* <div className="absolute border-4 border-green-400 rounded-md top-1/4 left-1/4 w-1/2 h-1/4 pointer-events-none"></div> */}
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full mt-4 bg-blue-900 text-white py-3 rounded-md font-medium hover:bg-blue-800 transition disabled:bg-gray-400"
          >
            {loading ? "Saving..." : "SAVE"}
          </button>

          {/* Success/Error Message */}
          {message && (
            <p className="text-center mt-3 text-sm font-medium text-gray-700">
              {message}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-around w-full max-w-sm mt-8">
        <button className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1">
          SIM
        </button>
        <button className="text-gray-500 hover:text-blue-600 transition">
          MAPPING
        </button>
        <button className="text-gray-500 hover:text-blue-600 transition">
          IMEI
        </button>
      </div>
    </div>
  );
}

export default SimScreen;

import { useState } from "react";
import axios from "axios";
import { BrowserMultiFormatReader } from "@zxing/browser";
import BottomNav from "./BottomNav";

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
      setCameraOpen(false);
      return;
    }

    // Use first available camera
    scanner.decodeFromVideoDevice(
      devices[0].deviceId,
      "video-preview",
      (result, err) => {
        if (result) {
          const cleanValue = result.getText().trim();
          console.log("Scanned value:", JSON.stringify(cleanValue));
          setSimNumber(cleanValue);
          setCameraOpen(false);
          scanner.reset();
        }
        if (err) {
          // ignore decode errors
        }
      }
    );
  } catch (error) {
    console.error(error);
    setMessage("Error starting camera");
    setCameraOpen(false);
  }
};


  // Stop scanning
  const stopScan = () => {
    scanner.reset();
    setCameraOpen(false); // hide preview + close button
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center bg-white px-6 py-6">
      <div className="w-full max-w-sm">
        {/* Logo + Company */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          <img src="/logo.jpg" alt="Logo" className="w-50 h-15" />
        </div>

        {/* Heading Banner */}
        <div
          className="rounded-xl flex flex-col mb-8 bg-cover bg-center"
          style={{
            backgroundImage: `url('/SimCard.jpg')`,
            height: "130px",
            width: "100%",
          }}
        >
          <h2 className="text-3xl sm:text-3xl font-bold text-white ml-6 mt-10 mb-12 leading-snug">
            Plug Into <br />
            <span className="text-blue-400 italic">Smart Living</span>
          </h2>
        </div>

        {/* Enter SIM Card */}
        <div className="bg-gray-100 rounded-xl p-6 shadow-sm">
          <label className="block text-xl text-center font-medium text-black mb-2">
            Enter SIM
          </label>
          <input
            type="text"
            placeholder=" "
            value={simNumber}
            onChange={(e) => setSimNumber(e.target.value)}
            className="w-full px-4 py-2 bg-white text-black border rounded-lg mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
          />


          {/* Camera Section */}
          {!cameraOpen ? (
            // Camera card (before scanning)
            <div className="flex items-center mb-3 w-full h-20 bg-white rounded-2xl border shadow-sm p-4">
              <div
                onClick={startScan}
                className="w-14 h-14 bg-cyan-400 rounded-lg flex items-center justify-center cursor-pointer hover:bg-cyan-500 active:scale-95 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="white"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 7h2l2-3h10l2 3h2a2 2 0 012 2v9a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 012-2zm9 3a4 4 0 100 8 4 4 0 000-8z"
                  />
                </svg>
              </div>
              <span className="ml-7 text-gray-600 text-base sm:text-lg font-medium">
                Open Camera
              </span>
            </div>
          ) : (
            // Show only video preview while scanning
            <div className="relative w-full flex justify-center">
              <video
                id="video-preview"
                className="w-full rounded-lg shadow-md"
                autoPlay
                muted
              ></video>
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
      <BottomNav />
    </div>
  );
}

export default SimScreen;

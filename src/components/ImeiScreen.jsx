import { useState } from "react";
import axios from "axios";

function IMEIScreen() {
  const [imeiNumber, setImeiNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    if (!imeiNumber) {
      setMessage("Please enter an IMEI number.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post("http://localhost:3000/api/imei", {
        imeiNumber,
      });

      if (res.data.success) {
        setMessage("IMEI saved successfully!");
        setImeiNumber("");
      } else {
        setMessage("Failed to save IMEI.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error. Try later.");
    } finally {
      setLoading(false);
    }
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
            backgroundImage: `url('/map.jpg')`,
            height: "180px",
            width: "100%",
          }}
        >
          <h2 className="text-3xl sm:text-3xl font-bold text-white-900 ml-6 mt-10 mb-12 leading-snug">
          Plug Into <br /> <span className="text-blue-400 italic">Smart Living</span>
        </h2>
        </div>

        {/* Enter IMEI */}
        <div className="bg-gray-100 rounded-xl p-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter IMEI
          </label>
          <input
            type="text"
            placeholder="Enter IMEI Number"
            value={imeiNumber}
            onChange={(e) => setImeiNumber(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          {/* Camera Upload Button */}
          <div className="flex justify-center mb-4">
            <button className="flex flex-col items-center bg-white shadow-md border rounded-xl px-6 py-4 hover:bg-gray-50 transition">
              <div className="w-10 h-10 bg-blue-100 flex items-center justify-center rounded-lg mb-2">
                📷
              </div>
              <span className="text-gray-600 text-sm">Open Camera</span>
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-blue-900 text-white py-3 rounded-md font-medium hover:bg-blue-800 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "SAVE"}
          </button>

          {/* Message */}
          {message && (
            <p className="text-center mt-3 text-sm font-medium text-gray-700">
              {message}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-around w-full max-w-sm mt-8">
        <button className="text-gray-500 hover:text-blue-600 transition">
          SIM
        </button>
        <button className="text-gray-500 hover:text-blue-600 transition">
          MAPPING
        </button>
        <button className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1">
          IMEI
        </button>
      </div>
    </div>
  );
}

export default IMEIScreen;

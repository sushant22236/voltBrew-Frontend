import { useState } from "react";
import axios from "axios";
import BottomNav from "./BottomNav";

function MappingScreen() {
  const [imeiNumber, setImeiNumber] = useState("");
  const [simNumber, setSimNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null); // store fetched data

  const handleSave = async () => {
    if (!imeiNumber || !simNumber) {
      setMessage("Please enter both IMEI and SIM number");
      setResult(null);
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setResult(null);

      const res = await axios.post("http://localhost:3000/api/mapping", {
        imeiNumber,
        simNumber,
      });

      setResult(res.data.data);
      setMessage(res.data.message);
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Server error. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-screen h-screen flex flex-col items-center bg-white px-6 py-6">
      <div className="w-full max-w-sm">
        {/* Logo + Company */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          <img src="/logo.jpg" alt="Logo" className="w-50 h-15" />
        </div>

        {/* Heading Banner */}
        <div
          className="rounded-xl flex flex-col mb-6 bg-cover bg-center"
          style={{
            backgroundImage: `url('/map.jpg')`,
            height: "130px",
            width: "100%",
          }}
        >
          <h2 className="text-3xl sm:text-3xl font-bold text-white-900 ml-6 mt-10 mb-12 leading-snug">
            Plug Into <br />{" "}
            <span className="text-blue-400 italic">Smart Living</span>
          </h2>
        </div>

        {/* Enter IMEI */}
        <div className="bg-gray-100 rounded-xl p-6 shadow-sm">
          <label className="block text-xl text-center font-medium text-black">
            Enter IMEI
          </label>
          <input
            type="text"
            value={imeiNumber}
            onChange={(e) => setImeiNumber(e.target.value)}
            className="w-full px-4 py-2 bg-white text-black border rounded-lg mb-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <label className="block text-xl text-center font-medium text-black">Enter SIM</label>
          <input
            type="text"
            value={simNumber}
            onChange={(e) => setSimNumber(e.target.value)}
            className="w-full px-4 py-2 bg-white text-black border rounded-lg mb-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          {/* Camera Upload Button */}
          <div className="flex items-center mb-3 w-full h-20 bg-white rounded-2xl border shadow-sm p-4">
            <div className="w-14 h-14 bg-cyan-400 rounded-lg flex items-center justify-center">
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
            <span className="ml-7 text-gray-500 text-sm font-medium">
              Open Camera
            </span>
          </div>

          {/* Fetch Button */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-blue-900 text-white py-3 rounded-md font-medium hover:bg-blue-800 transition disabled:opacity-50"
          >
            {loading ? "Fetching..." : "SAVE"}
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
      <BottomNav />
    </div>
  );
}

export default MappingScreen;

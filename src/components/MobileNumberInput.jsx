import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MobileNumberInput() {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation (adjust for your country if needed)
    if (!/^\d{10}$/.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Replace with your backend API endpoint
      const res = await axios.post("http://localhost:3000/api/send-otp", {
        mobile,
      });

      if (res.data.success) {
        //OTP sent successfully → go to OTP screen
        navigate("/otp", { state: { mobile } });
      } else {
        setError(res.data.message || "Failed to send OTP. Try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center space-x-2 mb-10">
          <img src="/logo.jpg" alt="Logo" className="w-40 h-12" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 leading-snug">
          Enter Your Mobile Number
        </h2>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-100 rounded-xl p-6 shadow-sm"
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mobile Number
          </label>
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter mobile number"
            className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 text-white py-3 rounded-md font-medium hover:bg-blue-800 transition disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default MobileNumberInput;

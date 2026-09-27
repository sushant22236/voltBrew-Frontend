import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MobileNumberInput() {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // ✅ Auto-focus when screen loads
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
      const res = await axios.post("http://localhost:3000/api/send-otp", {
        mobile,
      });

      if (res.status === 200) {
        navigate("/otp", { state: { mobile } }); // ✅ Navigate with mobile
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
    <div className="w-screen h-screen flex justify-center bg-white px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center mt-32 space-x-2 mb-16">
          <img src="/VoltBrewLogo.jpg" alt="Logo" className="w-53 h-12" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-3xl font-bold text-blue-900 mb-16 leading-snug">
          Plug Into <br />
          <span className="text-blue-400 italic">Smart</span> Living
        </h2>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-100 rounded-xl p-6 shadow-sm"
        >
          <label className="block text-xl font-medium text-center text-black mb-4">
            Mobile Number
          </label>
          <input
            ref={inputRef}
            type="tel"
            maxLength="10"
            value={mobile}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ""); // ✅ Only digits
              setMobile(value);
              if (error) setError(""); // ✅ Clear error when typing
            }}
            placeholder="Enter 10-digit number"
            className="w-full px-4 py-2 bg-white text-black border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 text-white py-3 rounded-lg font-medium hover:bg-blue-800 transition disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default MobileNumberInput;

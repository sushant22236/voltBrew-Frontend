import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function OtpScreen({ onVerify }) {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const inputRefs = useRef([]); // store refs for inputs

  // Auto-focus first box on load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const mobile = location.state?.mobile || "";

  // Handle OTP input change
  const handleChange = (e, index) => {
    const value = e.target.value;

    if (!/^[0-9]?$/.test(value)) return;

    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto move to next input
    if (value && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle Backspace key
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        let newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  // Handle Paste (fill all boxes)
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, otp.length);
    if (/^\d+$/.test(pasted)) {
      const newOtp = pasted.split("");
      setOtp(newOtp);

      if (inputRefs.current[pasted.length - 1]) {
        inputRefs.current[pasted.length - 1].focus();
      }
    }
  };

  // Submit OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/api/verify-otp", {
        mobile,
        otp: enteredOtp,
      });

      console.log("OTP API response:", res.data);

      if (
        res.status === 200 &&
        res.data.message?.toLowerCase().includes("verified")
      ) {
        setSuccess(res.data.message);

        if (onVerify) onVerify();
        navigate("/imei");
      } else {
        setError(res.data.message || "Invalid OTP. Try again.");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
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

        {/* OTP Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-100 rounded-xl p-6 shadow-sm"
        >
          <h3 className="text-center text-xl font-semibold text-black mb-4">
            ENTER OTP
          </h3>
          <p className="text-center text-xs text-gray-500 mb-6">
            OTP has been sent to your registered mobile <br />
            <span className="font-medium">{mobile || "91******00"}</span>
          </p>

          {/* OTP Input */}
          <div className="flex justify-between mb-4">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={handlePaste}
                className="w-10 h-12 text-center bg-white text-black border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-lg"
              />
            ))}
          </div>

          {/* Error & Success Messages */}
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 text-white py-3 rounded-lg font-medium hover:bg-blue-800 transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default OtpScreen;

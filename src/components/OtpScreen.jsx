import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function OtpScreen() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); //success message state
  const location = useLocation();

  // Mobile only for UI display
  const mobile = location.state?.mobile || "";

  // Handle OTP input change
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    let newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Auto focus next input
    if (element.value !== "" && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  // Submit OTP for verification
  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setError("");
    setSuccess(""); // reset success message
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/api/verify-otp", {
        otp: enteredOtp, //only send OTP
      });

      if (res.data.success || res.status === 200) {
        setSuccess("OTP verified successfully!");
      } else {
        setError(res.data.message || "Invalid OTP. Try again.");
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
          <img src="/VoltBrewLogo.jpg" alt="Logo" className="w-50 h-10" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10 leading-snug">
          Plug Into <br />{" "}
          <span className="text-blue-400 italic">Smart Living</span>
        </h2>

        {/* OTP Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-100 rounded-xl p-6 shadow-sm"
        >
          <h3 className="text-center text-sm font-semibold text-gray-700 mb-2">
            ENTER OTP
          </h3>
          <p className="text-center text-xs text-gray-500 mb-4">
            OTP has been sent to your registered mobile <br />
            <span className="font-medium">{mobile || "**********"}</span>
          </p>

          {/* OTP Input */}
          <div className="flex justify-between mb-4">
            {otp.map((data, i) => (
              <input
                key={i}
                type="text"
                maxLength="1"
                value={otp[i]}
                onChange={(e) => handleChange(e.target, i)}
                className="w-10 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            className="w-full bg-blue-900 text-white py-3 rounded-md font-medium hover:bg-blue-800 transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default OtpScreen;

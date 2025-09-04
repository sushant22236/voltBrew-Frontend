import { Routes, Route } from "react-router-dom";
import SplashWrapper from "../components/SplashWrapper";
import MobileNumberInput from "../components/MobileNumberInput";
import OtpScreen from "../components/OtpScreen";
import SimScreen from "../components/SimScreen";
import MappingScreen from "../components/MappingScreen";
import ImeiScreen from "../components/ImeiScreen";
import BarcodeScannerQuagga from "../components/BarcodeScannerQuagga";
import BarcodeScannerZxing from "../components/BarcodeScannerZxing";
import BarcodeScanner from "../components/BarcodeScanner";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Splash Screen */}
      <Route path="/" element={<SplashWrapper />} />

      {/* Login Screen */}
      <Route path="/login" element={<MobileNumberInput />} />

      {/* OTP Screen */}
      <Route path="/otp" element={<OtpScreen />} />

      {/* SIM Screen */}
      <Route path="/sim" element={<SimScreen />} />

      {/* Mapping Screen */}
      <Route path="/mapping" element={<MappingScreen />} />

      <Route path="/imei" element={<ImeiScreen />} />

      <Route path="/scanner" element={<BarcodeScannerQuagga />} />

      <Route path="/scanner-2" element={<BarcodeScannerZxing />} />

      <Route path="/scanner-3" element={<BarcodeScanner/>} />
    </Routes>
  );
}

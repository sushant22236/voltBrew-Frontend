import { Routes, Route } from "react-router-dom";
import SplashWrapper from "../components/SplashWrapper";
import MobileNumberInput from "../components/MobileNumberInput";
import OtpScreen from "../components/OtpScreen";
import SimScreen from "../components/SimScreen";
import MappingScreen from "../components/MappingScreen";
import ImeiScreen from "../components/ImeiScreen";
import ProtectedRoute from "./ProtectedRoute";
import { useState, useEffect } from "react";
import BarcodeScannerQuagga from "../components/BarcodeScannerQuagga";
import BarcodeScannerQuaggaImage from "../components/BarcodeScannerQuaggaImage";
import LogoutPage from "../components/LogoutPage";
import BarcodeScannerQuaggaImageOriginal from "../components/BarcodeScannerQuaggaOriginal";
import QrBarcodeScanner from "../components/QrBarcodeScanner";

export default function AppRoutes() {
  const [isVerified, setIsVerified] = useState(
    () => localStorage.getItem("isVerified") === "true"
  );

  useEffect(() => {
    localStorage.setItem("isVerified", isVerified);
  }, [isVerified]);



  return (
    <Routes>
      {/* Splash Screen */}
      <Route path="/" element={<SplashWrapper />} />

      {/* Login Screen */}
      <Route path="/login" element={<MobileNumberInput />} />

      {/* OTP Screen (marks user verified) */}
      <Route
        path="/otp"
        element={<OtpScreen onVerify={() => setIsVerified(true)} />}
      />

      <Route path="/scanner" element={<QrBarcodeScanner />} />
      <Route path="/scanner-image" element={<BarcodeScannerQuaggaImage />} />
      <Route path="/scanner-og" element={<BarcodeScannerQuaggaImageOriginal />} />

      {/* Protected Screens */}
      <Route path="/logout" element={
          <ProtectedRoute isVerified={isVerified}>
            <LogoutPage />
          </ProtectedRoute>
      } />
      <Route
        path="/imei"
        element={
          <ProtectedRoute isVerified={isVerified}>
            <ImeiScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sim"
        element={
          <ProtectedRoute isVerified={isVerified}>
            <SimScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mapping"
        element={
          <ProtectedRoute isVerified={isVerified}>
            <MappingScreen />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

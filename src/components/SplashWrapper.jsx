import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SplashScreen from "./SplashScreen";

export default function SplashWrapper() {
  const [showSplash, setShowSplash] = useState(true);
  //const navigate = useNavigate();

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShowSplash(false);
  //     navigate("/login", { replace: true }); // move to login
  //   }, 3000); // splash duration (3 sec)

  //   return () => clearTimeout(timer);
  // }, [navigate]);

  return (
    <div
      className={`w-screen h-screen transition-opacity duration-1000 ${
        showSplash ? "opacity-100" : "opacity-0"
      }`}
    >
      <SplashScreen />
    </div>
  );
}

import { Link, useLocation } from "react-router-dom";

function BottomNav() {
  const location = useLocation();

  return (
    <div className="flex justify-around mt-20 items-center w-[350px] bg-blue-900 rounded-full py-3 px-6">
      <Link
        to="/imei"
        className={`font-semibold cursor-pointer ${
          location.pathname === "/imei" ? "text-green-400" : "text-white"
        }`}
      >
        IMEI
      </Link>
      <Link
        to="/sim"
        className={`font-semibold cursor-pointer ${
          location.pathname === "/sim" ? "text-green-400" : "text-white"
        }`}
      >
        SIM
      </Link>
      <Link
        to="/mapping"
        className={`font-semibold cursor-pointer ${
          location.pathname === "/mapping" ? "text-green-400" : "text-white"
        }`}
      >
        MAPPING
      </Link>
    </div>
  );
}

export default BottomNav;

import { Link, useLocation } from "react-router-dom";

function BottomNav() {
    
  const onLogout=()=>{
    localStorage.removeItem("isVerified");
    window.location.href="/login"
  }

  return (
    <div className="">
        <button onClick={()=>onLogout()}>Logout</button>
    </div>
  );
}

export default BottomNav;

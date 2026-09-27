import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ isVerified, children }) {
  if (!isVerified) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

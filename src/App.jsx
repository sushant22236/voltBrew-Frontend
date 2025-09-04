import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./route/Approutes.jsx";

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

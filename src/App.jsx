import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./route/AppRoutes";

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

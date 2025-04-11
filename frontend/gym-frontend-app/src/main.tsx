import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppContent from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { WorkoutProvider } from "./context/WorkoutContext.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <WorkoutProvider>
      <AppContent />
    </WorkoutProvider>
  </Provider>
);

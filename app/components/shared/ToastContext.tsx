"use client";

import { createContext, useCallback, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ToastSeverity = "success" | "error" | "info" | "warning";

type ToastContextValue = {
  showToast: (message: string, severity?: ToastSeverity) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const showToast = useCallback((message: string, severity: ToastSeverity = "success") => {
    toast[severity](message);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer position="top-right" autoClose={4000} newestOnTop pauseOnHover />
    </ToastContext.Provider>
  );
}

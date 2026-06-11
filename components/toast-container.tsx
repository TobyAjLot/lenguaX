"use client";

import { useToast } from "@/lib/toast-context";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-0 right-0 p-4 space-y-2 pointer-events-none z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg pointer-events-auto animate-in fade-in-0 slide-in-from-right-full duration-200 ${
            toast.type === "success"
              ? "bg-emerald-500 text-white"
              : toast.type === "error"
                ? "bg-red-500 text-white"
                : toast.type === "warning"
                  ? "bg-amber-500 text-white"
                  : "bg-blue-500 text-white"
          }`}
        >
          {toast.type === "success" && <CheckCircle className="w-5 h-5" />}
          {toast.type === "error" && <AlertCircle className="w-5 h-5" />}
          {toast.type === "warning" && <AlertCircle className="w-5 h-5" />}
          {toast.type === "info" && <Info className="w-5 h-5" />}
          <span className="flex-1 text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="hover:opacity-80 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

// _components/funnel-editor-modal.tsx
"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface FunnelEditorModalProps {
  children: React.ReactNode;
}

const FunnelEditorModal = ({ children }: FunnelEditorModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Prevent body scroll when editor is open
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    // Handle escape key
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // You can add navigation logic here if needed
        console.log("Escape pressed - you might want to navigate away");
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = originalStyle;
      document.removeEventListener("keydown", handleEscape);
      setMounted(false);
    };
  }, []);

  if (!mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-40 bg-background overflow-hidden">
      {children}
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default FunnelEditorModal;

// Alternative with backdrop click handling
export const FunnelEditorModalWithBackdrop = ({
  children,
}: FunnelEditorModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
      setMounted(false);
    };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      // Handle backdrop click - you might want to navigate away
      console.log("Backdrop clicked");
    }
  };

  if (!mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 bg-background overflow-hidden"
      onClick={handleBackdropClick}
    >
      <div className="w-full h-full" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

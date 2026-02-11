import { useEffect, useRef, type ReactNode } from "react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function BottomSheet({ open, onClose, children }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open, onClose]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartY.current = e.touches[0].clientY;
  }

  function handleTouchMove(e: React.TouchEvent) {
    const diff = e.touches[0].clientY - touchStartY.current;
    if (diff > 60) onClose();
  }

  return (
    <>
      <div
        className={`sheet-backdrop${open ? " open" : ""}`}
        onClick={onClose}
      />
      <div
        ref={sheetRef}
        className={`bottom-sheet${open ? " open" : ""}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <div className="sheet-handle">
          <div className="sheet-handle-bar" />
        </div>
        <div className="sheet-content">
          {children}
        </div>
      </div>
    </>
  );
}

import { useEffect, useRef } from 'react';

// Keep keyboard focus in the open dialog and restore it to the opener on close.
export const useDialogBehavior = (isOpen, onClose, returnFocusRef) => {
  const onCloseRef = useRef(onClose);
  const dialogRef = useRef(null);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return undefined;

    const opener = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const focusable = () => Array.from(dialog.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'))
      .filter(node => node.getClientRects().length > 0 && node.getAttribute('aria-hidden') !== 'true');
    const frame = window.requestAnimationFrame(() => (focusable()[0] || dialog).focus({ preventScroll: true }));
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current?.();
      }
      if (event.key !== 'Tab') return;
      const items = focusable();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first) { event.preventDefault(); dialog.focus(); return; }
      if (!dialog.contains(document.activeElement) || (event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      const focusTarget = returnFocusRef?.current || opener;
      if (focusTarget?.isConnected) focusTarget.focus({ preventScroll: true });
    };
  }, [isOpen, returnFocusRef]);
  return dialogRef;
};

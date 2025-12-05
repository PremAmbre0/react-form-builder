import { useEffect } from 'react';

export default function useScrollLock(isLocked) {
    useEffect(() => {
        if (!isLocked) return;

        // Save original overflow style
        const originalStyle = window.getComputedStyle(document.body).overflow;

        // Lock scroll
        document.body.style.overflow = 'hidden';

        return () => {
            // Restore original overflow style
            document.body.style.overflow = originalStyle;
        };
    }, [isLocked]);
}

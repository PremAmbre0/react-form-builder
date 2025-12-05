import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

const AppMenu = ({ isOpen, onClose, triggerRef, children, className = '', ...props }) => {
    const [position, setPosition] = useState({ top: -9999, left: -9999 });
    const [isPositioned, setIsPositioned] = useState(false);
    const menuRef = useRef(null);

    useLayoutEffect(() => {
        if (!isOpen || !triggerRef.current || !menuRef.current) return;

        const updatePosition = () => {
            const triggerRect = triggerRef.current.getBoundingClientRect();
            const menuRect = menuRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let top = triggerRect.bottom + window.scrollY + 4; // Default: below trigger
            let left = triggerRect.left + window.scrollX; // Default: align left

            // Vertical Collision Detection
            if (triggerRect.bottom + menuRect.height + 10 > viewportHeight) {
                // Not enough space below
                if (triggerRect.top - menuRect.height - 10 > 0) {
                    // Flip to top if space available
                    top = triggerRect.top + window.scrollY - menuRect.height - 4;
                } else {
                    // If fits neither, stick to whichever has more space or keep in view (clamped)
                    // For now, let's just clamp it to the bottom of the viewport if it overflows
                    const overflowY = (triggerRect.bottom + menuRect.height + 10) - viewportHeight;
                    if (overflowY > 0) {
                        // If it overflows bottom, try to move it up, but don't cover the trigger if possible
                    }
                }
            }

            // Horizontal Collision Detection
            if (left + menuRect.width + 16 > viewportWidth) {
                // Overflows right
                // Try aligning right edge with trigger right edge
                const rightAlignedLeft = triggerRect.right + window.scrollX - menuRect.width;

                if (rightAlignedLeft < 16) {
                    // If right-aligned also overflows left (component wider than screen?), center it or clamp
                    // Clamp to right edge - padding
                    left = viewportWidth - menuRect.width - 16;
                } else {
                    left = rightAlignedLeft;
                }
            }

            // Ensure it doesn't overflow left edge
            if (left < 16) {
                left = 16;
            }

            setPosition({ top, left });
            setIsPositioned(true);
        };

        updatePosition();

        // Update on scroll and resize
        window.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resize', updatePosition);

        return () => {
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isOpen, triggerRef]);

    // Handle outside click
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target)
            ) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose, triggerRef]);

    if (!isOpen) return null;

    return createPortal(
        <div
            ref={menuRef}
            data-portal="true"
            style={{
                position: 'absolute',
                top: `${position.top}px`,
                left: `${position.left}px`,
                zIndex: 9999,
                visibility: isPositioned ? 'visible' : 'hidden',
            }}
        >
            <div className={className} {...props}>
                {children}
            </div>
        </div>,
        document.body
    );
};

export default AppMenu;

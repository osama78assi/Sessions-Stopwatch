import { useEffect, useRef } from "react";

function LoadingOverlay({ isVisible, message = "Loading..." }) {
    const overlayRef = useRef(null);

    useEffect(() => {
        let ref = overlayRef.current;
        if (isVisible && ref) {
            requestAnimationFrame(() => {
                ref.classList.add("opacity-100");
            });
        }
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div
            ref={overlayRef}
            className="
                absolute inset-0 z-50
                flex items-center justify-center
                bg-(--shallow-color)
                opacity-0 transition-opacity duration-150
                h-full!
            "
        >
            <div className="flex flex-col items-center gap-4">
                {/* Spinner */}
                <div
                    className="
                        w-12 h-12
                        border-4 border-(--main-divider-color)
                        border-t-(--primary-color)
                        rounded-full
                        animate-spin
                    "
                />

                {/* Message */}
                <span className="text-(--main-text-color) text-sm">
                    {message}
                </span>
            </div>
        </div>
    );
}

export default LoadingOverlay;
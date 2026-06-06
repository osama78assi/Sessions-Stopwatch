import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

function Modal({ isOpen, title, handleClose, className, children, disable }) {
    const modalRef = useRef(null);
    const overlayRef = useRef(null);

    function handleClick() {
        if (disable) return;

        // First hide it gently
        if (modalRef.current) {
            modalRef.current.classList.remove("opacity-100");

            // Remove it from the DOM after transition
            setTimeout(() => {
                handleClose?.();
            }, 150);
        }

        // First hide it gently
        if (overlayRef.current) {
            overlayRef.current.classList.remove("opacity-100");

            // Remove it from the DOM after transition
            setTimeout(() => {
                handleClose?.();
            }, 150);
        }
    }

    useEffect(() => {
        // Show it gently
        if (isOpen && modalRef.current) {
            setTimeout(() => {
                modalRef.current.classList.add("opacity-100");
            }, 0);
        }

        if (isOpen && overlayRef.current) {
            setTimeout(() => {
                overlayRef.current.classList.add("opacity-100");
            }, 0);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 transition-all opacity-0 bg-(--shallow-color) z-[998]!"
                onClick={handleClick}
                ref={overlayRef}
            />

            {/* Modal panel wrapper */}
            <div
                ref={modalRef}
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex max-h-[90dvh] overflow-auto transition-opacity opacity-0 p-3 z-[999]!"
            >
                {/* Modal panel */}
                {/**/}
                <div
                    className={`bg-(--thirdary-color) text-(--main-text-color) w-[calc(100vw-24px)] shadow-(--modal-shadow) sm:w-full sm:max-w-130 md:max-w-180 lg:max-w-225 flex flex-col gap-4 rounded-lg ${className}`}
                >
                    {/* Close button */}
                    <div
                        className={`border-b border-b-(--main-divider-color) w-full flex ${title ? "justify-between" : "justify-end"} p-3`}
                    >
                        {title ? title : null}

                        <div
                            role="button"
                            className={`w-fit rounded-xl ${disable ? "cursor-not-allowed" : "cursor-pointer"}`}
                            onClick={handleClick}
                        >
                            <FiX
                                size="1.2rem"
                                className="text-(--main-text-color)"
                            />
                        </div>
                    </div>

                    {/* Children */}
                    <div className="p-3 w-full z-[11]">{children}</div>
                </div>
            </div>
        </>,
        document.getElementById("root"),
    );
}

export default Modal;

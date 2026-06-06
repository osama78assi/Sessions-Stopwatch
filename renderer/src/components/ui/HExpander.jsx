import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

function HExpander({ head, children, headerOptions, sync }) {
    const isVisible = useRef(false);
    const eleRef = useRef();
    const initialRender = useRef(true);

    useEffect(() => {
        // Skip initial render
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }

        // Listen to the changes and sync the layout
        syncLayout();
    }, [sync]);

    function syncLayout() {
        if (eleRef.current) {
            let totalHeight = 0;
            const items = [...eleRef.current.children];
            items.forEach((item) => {
                totalHeight += item.scrollHeight;

                // Parse the border + margin
                const style = getComputedStyle(item);

                totalHeight += parseFloat(style.borderTopWidth);
                totalHeight += parseFloat(style.borderBottomWidth);
                totalHeight += parseFloat(style.marginTop);
                totalHeight += parseFloat(style.marginBottom);
            });

            eleRef.current.style.height = `${totalHeight}px`;
            isVisible.current = true;
        }
    }

    function handleClick() {
        if (isVisible.current) {
            eleRef.current.style.height = "0px";

            isVisible.current = false;
            return;
        }

        syncLayout();
    }

    return (
        <div>
            <div
                {...headerOptions}
                className={`flex gap-2 items-center cursor-pointer ${headerOptions?.className ? headerOptions?.className : ""}`}
                onClick={handleClick}
            >
                {head}

                <MdKeyboardArrowDown className="text-xl" />
            </div>

            <div
                ref={eleRef}
                className="transition-[height] box-border h-0 overflow-hidden"
            >
                {children}
            </div>
        </div>
    );
}

export default HExpander;

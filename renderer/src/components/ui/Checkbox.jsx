import { useEffect, useState } from "react";
import { IoCheckmarkOutline } from "react-icons/io5";

function Checkbox({ value, onChange, className }) {
    const [checked, setChecked] = useState(value);

    useEffect(() => {
        setChecked(value);
    }, [value]);

    return (
        <div
            onClick={() => {
                onChange?.(!value);
                setChecked((v) => !v);
            }}
            role="checkbox"
            className={`w-6 h-6 border cursor-pointer rounded-md flex items-center justify-center font-bold text-lg text-white ${checked ? "border-(--main-interactive-color-v2) bg-(--main-interactive-color-v2)" : "border-gray-600"} ${className}`}
        >
            {checked ? <IoCheckmarkOutline /> : null}
        </div>
    );
}

export default Checkbox;

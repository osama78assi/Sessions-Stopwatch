import { useRef, useState } from "react";
import Input from "../ui/Input";
import toast from "react-hot-toast";

export default function CategoryInput({
    className,
    handleChange,
    parentClasssName,
    defaultValue,
    ...props
}) {
    const [val, setVal] = useState(defaultValue);
    const [err, setErr] = useState("");

    return (
        <div className={parentClasssName}>
            <Input
                className={`bg-(--main-color)! ${className}`}
                onChange={(e) => {
                    if (e.target.value.length >= 50) {
                        setErr(
                            "The categroy can be 50 character length maximum",
                        );
                        return;
                    }

                    setErr("");
                    setVal(e.target.value);
                    handleChange?.(e.target.value);
                }}
                value={val}
                {...props}
            />

            {err ? (
                <span className="block mt-1 ms-2 text-sm italic text-red-500">
                    {err}
                </span>
            ) : null}
        </div>
    );
}

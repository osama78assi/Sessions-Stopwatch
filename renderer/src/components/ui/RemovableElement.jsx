import Button from "../ui/Button";
import { FiX } from "react-icons/fi";

function RemovableElement({ label, onRemove, className = "" }) {
    return (
        <span
            className={`flex items-center flex-row-reverse gap-3 p-2 rounded-lg
                ${className}`}
        >
            <Button
                onClick={onRemove}
                className={`text-lg`}
                size="sm"
            >
                <FiX />
            </Button>
            <span className="flex-1 whitespace-nowrap">{label}</span>
        </span>
    );
}

export default RemovableElement;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useBackForwardShortcuts() {
    const navigate = useNavigate();

    useEffect(() => {
        function handleKeyDown(e) {
            // Back
            if (e.altKey && e.key === "ArrowLeft") {
                navigate(-1);
            }

            // Forward
            if (e.altKey && e.key === "ArrowRight") {
                navigate(1);
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [navigate]);
}

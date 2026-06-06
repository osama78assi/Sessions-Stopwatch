import { useState } from "react";
import { getLocalStorageItem, getSetLocalStorageItem, setLocalStorageItem } from "../util/util.js";

export default function useLocalStorageState(key, defaultValue) {
    const [state, setState] = useState(() => {
        const value = getSetLocalStorageItem(key, defaultValue);

        return value;
    });

    function setLocalStorageState(value) {
        setState((previousState) => {
            // In case the user used a function
            const newValue =
                typeof value === "function" ? value(previousState) : value;

            // Sync the local storage
            setLocalStorageItem(key, newValue);

            return newValue;
        });
    }

    return [state, setLocalStorageState];
}

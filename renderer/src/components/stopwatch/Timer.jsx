import { memo, useEffect, useRef, useState } from "react";
import { getLocalStorageItem, removeLocalStorageItem, setLocalStorageItem } from "../../util/util";
import TimeRenderer from "./TimeRenderer";

const Timer = memo(function Timer({ isRunning, reset }) {
    const stopwatchInterval = useRef(null);
    const autoSaveInterval = useRef(null);

    const [tick, setTick] = useState(0);

    // Using ref for faster access
    const time = useRef(null);
    // Store the previous accumulated and current accumlated time
    const duration = useRef(0);

    // For the reset
    useEffect(() => {
        time.current = null;
        duration.current = 0;
        setTick((t) => t + 1);
    }, [reset]);

    // Recover asccumalted ms
    useEffect(() => {
        let startedAt = getLocalStorageItem("stopwatchStartedAt");
        let storedDuration = getLocalStorageItem("duration") ?? 0;

        // Add the stored duration + sleep time
        if (startedAt) {
            duration.current = storedDuration + (Date.now() - startedAt);
        } else {
            duration.current = storedDuration;
        }

        // Force re-render
        setTick((t) => t + 1);
    }, []);

    useEffect(() => {
        // While the isRunning true increase the timer
        // If the isRunning false then just stop

        if (isRunning) {
            // Store the timer
            stopwatchInterval.current = setInterval(() => {
                // Increase the duration. In case it was the equal then go for 8
                duration.current +=
                    Date.now() - (time.current ?? Date.now()) === 0
                        ? 8
                        : Date.now() - (time.current ?? Date.now());

                // Update the time
                time.current = Date.now();

                // Re-render
                setTick((t) => t + 1);
            }, 8);
        } else {
            // Stop the timer
            clearInterval(stopwatchInterval.current);
            
            // Clear the time
            time.current = null;
        }

        return () => clearInterval(stopwatchInterval.current);
    }, [isRunning]);

    // Auto save every 3s
    useEffect(() => {
        if (isRunning) {
            ////// When the timer starts
            // Save in the local storage when did you started
            setLocalStorageItem("stopwatchStartedAt", Date.now());

            // Store the timer
            autoSaveInterval.current = setInterval(() => {
                // Save the moment you stop increasing at it
                setLocalStorageItem("stopwatchStartedAt", Date.now());
                setLocalStorageItem("duration", duration.current);
            }, 3000);
        } else {
            //// When the timer stops
            // Clear the state of when the last start happened
            removeLocalStorageItem("stopwatchStartedAt");

            // Stop the timer
            clearInterval(autoSaveInterval.current);

            // Save the duration
            setLocalStorageItem("duration", duration.current);
        }

        return () => clearInterval(autoSaveInterval.current);
    }, [isRunning]);

    return (
        <>
            <TimeRenderer time={duration.current} size="lg" />
        </>
    );
});

Timer.displayName = "Timer";

export default Timer;

import { useEffect, useRef, useState } from "react";
import useLocalStorageState from "../../hooks/useLocalStorageState";
import Button from "../ui/Button";
import {
    getLocalStorageItem,
    removeLocalStorageItem,
    setLocalStorageItem,
} from "../../util/util";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Dropdown from "../ui/Dropdown";
import toast from "react-hot-toast";
import { createStopwatch } from "../../serivces/stopwatch";
import { v4 } from "uuid";
import Timer from "./Timer";
import { CATEGORY_OPTIONS } from "../../util/constants";
import CategoryInput from "./CategoryInput";

export default function Stopwatch({ sessions, setSessions }) {
    // This will be used to reset the real timer
    const [key, setKey] = useState(0);

    const [isRunning, setIsRunning] = useLocalStorageState(
        "stopwatchRunning",
        false,
    );

    const [isResetOpen, setIsResetOpen] = useState(false);
    const [isSaveOpen, setIsSaveOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    // Data for storage
    const stopwatch = useRef({
        category: "",
        sessions,
    });

    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        setIsPaused((getLocalStorageItem("duration") ?? 0) > 0);
    }, [isRunning]);

    // Those are a mirror values
    // Using ref for faster access
    const time = useRef(null);
    // Store the previous accumulated and current accumlated time
    const duration = useRef(0);

    // Get the longest set in the session
    function calcLongestSet() {
        const longestSet = Math.max(
            getLocalStorageItem("longestSet") ?? 0,
            Date.now() - (getLocalStorageItem("startSetTime") ?? 0),
        );
        setLocalStorageItem("longestSet", longestSet);

        return longestSet;
    }

    // Register session info
    function registerSessionMetadata() {
        if (isRunning) {
            // Keep truck of how many stops happened
            setLocalStorageItem(
                "stopCounts",
                (getLocalStorageItem("stopCounts") ?? 0) + 1,
            );

            // Save the longgest lap (without any stop in the same session)
            calcLongestSet();
        } else {
            let duration = getLocalStorageItem("duration") ?? 0;
            // If this is the first start where there is no data, keep track of the first date when the user started
            if (duration === 0) {
                setLocalStorageItem("firstStartDate", new Date());
            }
            // Set the start of the lap (to know in the session X what is the longest time without any stop)
            setLocalStorageItem("startSetTime", Date.now());
        }
    }

    // Reset
    function resetSessionMetadata() {
        setLocalStorageItem("stopCounts", 0); // No stops happened yet
        setLocalStorageItem("firstStartDate", new Date()); // New session started, this will start new
        setLocalStorageItem("longestSet", 0); // No set yet
        setLocalStorageItem("startSetTime", Date.now()); // Start time of the set
    }

    function handleStartStop() {
        // registerSessionData();
        registerSessionMetadata();
        setIsRunning((running) => !running);
    }

    function createSession() {
        const storedDuration = getLocalStorageItem("duration") ?? 0;
        // Take the stop counts, start date of the session, longest set in the session
        const stopCounts =
            typeof getLocalStorageItem("stopCounts") === "number"
                ? getLocalStorageItem("stopCounts") - 1
                : getLocalStorageItem("stopCounts");

        // if the new duration is equal to zero don't create a session
        let newDuration =
            storedDuration -
            (sessions.reduce((acc, session) => session?.duration + acc, 0) ??
                0);

        if (newDuration === 0) {
            return;
        }

        const session = {
            _id: v4(),
            duration: newDuration,
            stopCounts: stopCounts ?? 0,
            createdAt: getLocalStorageItem("firstStartDate"),
            // Sometimes the longest set is longer than the duration by ~800ms so let's stick with one only
            longestSet: Math.min(calcLongestSet(), newDuration),
            finishedAt: new Date(),
        };

        // Reset the state
        resetSessionMetadata();
        // Save the session
        setSessions((sessions) => [...sessions, session]);

        return session;
    }

    function handleReset() {
        // Reset everything
        // Update the key to re-render the inner timer
        setKey((k) => k + 1);
        setSessions([]);
        removeLocalStorageItem("stopwatchStartedAt");
        removeLocalStorageItem("duration");
        stopwatch.current = {
            category: "",
            sessions,
        };

        setIsPaused(false);

        resetSessionMetadata();
    }

    async function saveData() {
        if (!stopwatch.current.category) {
            toast.error("Category can't be null");
            return;
        }

        setIsSaving(true);
        let sessions = getLocalStorageItem("sessions") ?? [];
        // If there is no sessions create one
        if (sessions.length === 0) {
            sessions.push(createSession());
        }
        stopwatch.current.sessions = sessions;

        try {
            const res = await createStopwatch(stopwatch.current);

            // If success show message or in error
            if (res.success) {
                toast.success("Created successfully !");
                handleReset();
            } else {
                toast.error(res.message);
            }
        } catch (err) {
            console.log(err);
            toast.error("Soemthing went wrong. Please try again");
        } finally {
            setIsSaving(false);
            setIsSaveOpen(false);
        }
    }

    return (
        <div className="basis-[60%] lg:basis-[70%] p-6 relative transition-colors">
            <h1 className="font-bold text-3xl">Stopwatch</h1>
            <Timer isRunning={isRunning} reset={key} />
            {/* Controls */}
            <div className="flex flex-col gap-10 w-fit mx-auto mt-14">
                <Button className={"w-70 lg:w-100"} onClick={handleStartStop}>
                    {isRunning ? "Stop" : "Start"}
                </Button>

                <div className="w-70 lg:w-100 flex gap-[3%]">
                    <Button
                        className={"w-[48.5%]"}
                        onClick={createSession}
                        disabled={isRunning}
                    >
                        Create Sessison
                    </Button>
                    <Button
                        className={"w-[48.5%]"}
                        onClick={() => setIsResetOpen(true)}
                        theme={isRunning ? "main" : "danger"}
                        disabled={!isPaused || isRunning}
                    >
                        Reset
                    </Button>
                </div>
            </div>

            {/* Save button */}
            <div className="w-70 lg:w-100 flex mt-12 mx-auto justify-center">
                <Button
                    className={"w-full"}
                    disabled={!isPaused || isRunning}
                    onClick={() => setIsSaveOpen(true)}
                >
                    Save & Reset
                </Button>
            </div>

            {/* Confirm for reset */}
            <Modal
                isOpen={isResetOpen}
                handleClose={() => setIsResetOpen(false)}
            >
                <div>
                    <p className="mb-2">
                        Are you sure you want to reset ? this will not save the
                        sessions
                    </p>
                    <storng className="block ms-2 font-bold italic text-red-500 text-[0.8rem]">
                        This action can't be undo
                    </storng>
                    <div className="flex justify-center gap-10 mt-8">
                        <Button
                            onClick={() => {
                                handleReset();

                                setIsResetOpen(false);
                            }}
                            className={"px-6!"}
                            theme="danger"
                        >
                            Reset
                        </Button>
                        <Button
                            onClick={() => {
                                setIsResetOpen(false);
                            }}
                            className={"px-6!"}
                        >
                            Cancle
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal
                disable={isSaving}
                isOpen={isSaveOpen}
                handleClose={() => setIsSaveOpen(false)}
            >
                <div className="w-[400px]">
                    <div className="flex flex-col gap-3">
                        <Dropdown
                            className="bg-(--main-color)!"
                            label="Select Category"
                            optionOptions={{ className: "p-2!" }}
                            onSelect={({ option, forceClose }) => {
                                forceClose();
                                stopwatch.current.category = option.value;
                            }}
                            options={CATEGORY_OPTIONS}
                        />

                        <div className="flex flex-col mt-2">
                            <label htmlFor="new-category" className="text-lg">
                                In case not exist in the dropdown
                            </label>

                            <CategoryInput
                                id="new-category"
                                className="bg-(--main-color)!"
                                handleChange={(value) =>
                                    (stopwatch.current.category = value)
                                }
                            />
                            <span className="mt-2 text-[0.9rem] italic">
                                (Typing here will de-select the categroy if
                                selected)
                            </span>
                        </div>

                        <Button onClick={saveData} disabled={isSaving}>
                            Save
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

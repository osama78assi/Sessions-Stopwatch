import { Outlet } from "react-router-dom";
import {
    closeWindow,
    isMaximized,
    minimizeWindow,
    toggleWindow,
} from "./serivces/window";
import { FiX, FiMinus } from "react-icons/fi";
import { FaRegWindowMaximize, FaRegWindowRestore } from "react-icons/fa";
import { useLayoutEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Sidebar from "./components/main/Sidebar";
import Main from "./components/main/Main";
import useLocalStorageState from "./hooks/useLocalStorageState";

function AppLayout() {
    const [windowMaximized, setWindowMaximized] = useState(false);
    const [settings, setSttings] = useLocalStorageState("settings", {
        theme: "dark",
        color: "blue",
    });

    async function handleCloseWindow() {
        await closeWindow();
    }
    async function handleToggleWindow() {
        await toggleWindow();
        setWindowMaximized((val) => !val);
    }
    async function handleMinimizeWindow() {
        await minimizeWindow();
    }

    async function checkMaximized() {
        const status = await isMaximized();

        setWindowMaximized(status);
    }

    // Check the window status
    useLayoutEffect(() => {
        checkMaximized();
    }, []);

    // Check the theme
    useLayoutEffect(() => {
        function clearThemeClasses() {}
        async function setTheme() {
            try {
                // Add the correct class to the dom
                switch (settings.theme) {
                    case "light":
                        document.documentElement.classList.add("light-theme");
                        break;
                    case "dark":
                        document.documentElement.classList.add("dark-theme");
                        break;
                }

                switch (settings.color) {
                    case "blue":
                        document.documentElement.classList.add("blue-theme");
                        return;
                    case "orange":
                        document.documentElement.classList.add("orange-theme");
                        return;
                    case "pink":
                        document.documentElement.classList.add("pink-theme");
                        return;
                }

                throw new Error("The theme isn't recognized");
            } catch (err) {
                console.log(err);
            }
        }

        setTheme();
    }, []);

    return (
        <div className="applayout" id="applayout">
            <div className="frame">
                {/* To drag the window */}
                <div className="dragable flex-1" />

                <div className="flex gap-2">
                    <button
                        className="p-2 flex justify-center items-center cursor-pointer"
                        onClick={handleMinimizeWindow}
                    >
                        <FiMinus size="1.2rem" />
                    </button>
                    <button
                        className="p-2 flex justify-center items-center cursor-pointer"
                        onClick={handleToggleWindow}
                    >
                        {windowMaximized ? (
                            <FaRegWindowRestore size="1rem" />
                        ) : (
                            <FaRegWindowMaximize size="1rem" />
                        )}
                    </button>
                    <button
                        className="p-2 flex justify-center items-center cursor-pointer hover:bg-red-500! transition-colors"
                        onClick={handleCloseWindow}
                    >
                        <FiX size="1.2rem" />
                    </button>
                </div>
            </div>

            <div className="main-window" id="main-window">
                <Toaster
                    position="top-center"
                    containerStyle={{
                        zIndex: 9998,
                        marginTop: "25px",
                    }}
                    toastOptions={{
                        style: {
                            backgroundColor: "var(--secondary-color)",
                            color: "var(--main-text-color)",
                            border: "var(--main-color)",
                        },
                    }}
                />
                <Sidebar />
                <Main />
            </div>
        </div>
    );
}

export default AppLayout;

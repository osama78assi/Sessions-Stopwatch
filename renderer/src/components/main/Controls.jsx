import SidebarItem from "./SidebarItem";
import { TbStack2Filled, TbDropletHalf2Filled, TbSettings } from "react-icons/tb";
import { LiaHourglassHalfSolid } from "react-icons/lia";
import { IoStatsChart } from "react-icons/io5";
import { IoIosSunny } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";

import Button from "../ui/Button";
import { FaMoon, FaSun } from "react-icons/fa";
import useLocalStorageState from "../../hooks/useLocalStorageState";
import { BsMoonStars, BsSun } from "react-icons/bs";

export default function Controls() {
    const nav = useNavigate();
    const [settings, setSettings] = useLocalStorageState("settings");

    function toggleTheme() {
        setSettings((prev) => {
            const current = prev?.theme ?? "dark";

            let newTheme;

            if (current === "light") {
                newTheme = "dark";
                document.documentElement.classList.remove("light-theme");
                document.documentElement.classList.add("dark-theme");
            }

            if (current === "dark") {
                newTheme = "light";
                document.documentElement.classList.remove("dark-theme");
                document.documentElement.classList.add("light-theme");
            }

            return {
                ...prev,
                theme: newTheme,
            };
        });
    }

    function toggleColor() {
        setSettings((prev) => {
            const current = prev?.color ?? "blue";

            let newColor;

            if (current === "blue") {
                newColor = "orange";
                document.documentElement.classList.remove("blue-theme");
                document.documentElement.classList.add("orange-theme");
            }

            if (current === "orange") {
                newColor = "pink";
                document.documentElement.classList.remove("orange-theme");
                document.documentElement.classList.add("pink-theme");
            }
            
            if (current === "pink") {
                newColor = "blue";
                document.documentElement.classList.remove("pink-theme");
                document.documentElement.classList.add("blue-theme");
            }
            

            return {
                ...prev,
                color: newColor,
            };
        });
    }

    return (
        <ul className="flex flex-col gap-4">
            <Button.IconButton
                theme="normal"
                icon={
                    settings.theme === "light" ? (
                        <BsSun className="text-2xl" />
                    ) : (
                        <BsMoonStars className="text-2xl" />
                    )
                }
                className={
                    "flex justify-center items-center w-[55px] h-[55px] mx-auto p-4 bg-(--thirdary-color) hover:bg-(--forthary-color) rounded-2xl"
                }
                onClick={toggleTheme}
            />
            <Button.IconButton
                theme="normal"
                icon={
                    <TbDropletHalf2Filled className="text-2xl text-(--main-interactive-color-v1)" />
                }
                className={
                    "flex justify-center items-center w-[55px] h-[55px] mx-auto p-4 bg-(--thirdary-color) hover:bg-(--forthary-color)  rounded-2xl"
                }
                onClick={toggleColor}
            />
            <Button.IconButton
                theme="normal"
                icon={
                    <TbSettings className="text-2xl" />
                }
                className={
                    "flex justify-center items-center w-[55px] h-[55px] mx-auto p-4 bg-(--thirdary-color) hover:bg-(--forthary-color)  rounded-2xl"
                }
                onClick={() => {nav("/settings")}}
            />
        </ul>
    );
}

import SidebarItem from "./SidebarItem";
import { TbStack2Filled, TbDropletHalf2Filled } from "react-icons/tb";
import { LiaHourglassHalfSolid } from "react-icons/lia";
import { IoStatsChart } from "react-icons/io5";
import { IoIosSunny } from "react-icons/io";
import { useLocation } from "react-router-dom";

import Button from "../ui/Button";
import { FaMoon, FaSun } from "react-icons/fa";
import useLocalStorageState from "../../hooks/useLocalStorageState";
import { BsMoonStars, BsSun } from "react-icons/bs";
import Controls from "./Controls";

export default function Sidebar() {
    const location = useLocation();
    return (
        <div className="sidebar">
            <ul
                className={`divide-y divide-(--main-divider-color) pt-2 transition-opacity duration-300`}
            >
                <SidebarItem
                    icon={<LiaHourglassHalfSolid className="text-3xl!" />}
                    active={location.pathname === "/"}
                    to={"/"}
                >
                    Stopwatch
                </SidebarItem>
                <SidebarItem
                    icon={<TbStack2Filled className="text-3xl!" />}
                    active={location.pathname === "/dashboard"}
                    to={"/dashboard"}
                >
                    Dashboard
                </SidebarItem>
                <SidebarItem
                    icon={<IoStatsChart className="text-3xl!" />}
                    active={location.pathname === "/statistics"}
                    to={"/statistics"}
                >
                    Statistics
                </SidebarItem>
            </ul>

            <Controls />
        </div>
    );
}

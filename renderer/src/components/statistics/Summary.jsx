import { BsStopCircle } from "react-icons/bs";
import { BsGraphUpArrow } from "react-icons/bs";
import { RxLapTimer } from "react-icons/rx";
import { LuTimerReset } from "react-icons/lu";
import { SlFire } from "react-icons/sl";
import { GiSpellBook } from "react-icons/gi";

import SummaryItem from "./SummaryItem";
import TimeDuration from "../dashboard/TimeDuration";

export default function Summary({ data }) {
    const groupClasses =
        "basis-full flex flex-col min-[1100px]:flex-row gap-2 min-[1100px]:basis-[calc(100%-0.5rem)] ";
    return (
        <div className="flex flex-wrap gap-[0.5rem] min-[1100px]:gap-[1rem] transition-colors">
            <div className={groupClasses}>
                <SummaryItem
                    title={"Total Time Spent"}
                    icon={<RxLapTimer />}
                    data={<TimeDuration duration={data?.totalTimeSpent} />}
                />
                <SummaryItem
                    title={"Maximum Time Spent"}
                    icon={<BsGraphUpArrow />}
                    data={<TimeDuration duration={data?.maximumTimeSpent} />}
                />
            </div>
            <div  className={groupClasses}>
                <SummaryItem
                    title={"Average Time Spent"}
                    icon={<LuTimerReset />}
                    data={<TimeDuration duration={Math.round(data?.avgTimeSpent)} />}
                />
                <SummaryItem
                    title={"Average Stop Counts"}
                    icon={<BsStopCircle />}
                    data={`${Math.round(data?.avgStopCounts)} time${data?.avgStopCounts > 1 ? "s" : ""}`}
                />
            </div>

            <div className={groupClasses}>
                <SummaryItem
                    title={"Session Counts"}
                    icon={<GiSpellBook />}
                    data={`${data?.totalSessionCounts} Session${data?.totalSessionCounts > 1 ? "s" : ""}`}
                />
                <SummaryItem
                    title={"Longest Set"}
                    icon={<SlFire />}
                    data={<TimeDuration duration={data?.longestSet} />}
                />
            </div>
        </div>
    );
}

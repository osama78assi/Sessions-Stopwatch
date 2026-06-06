import { useEffect, useState } from "react";
import SessionFilters from "../components/dashboard/SessionFilters";
import Summary from "../components/statistics/Summary";
import MainChart from "../components/statistics/MainChart";
import toast, { LoaderIcon } from "react-hot-toast";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { plotSessions } from "../serivces/session";
import TopCategoriesChart from "../components/statistics/TopCategoriesChart";
import { data } from "react-router-dom";
import { throttle } from "../util/util";
import { v4 } from "uuid";

const throttledPlotSessions = throttle(plotSessions);

export default function Statistics() {
    const [filters, setFilters] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [plotData, setPlotData] = useState({});

    function handleFiltersChange({ filters: newFilters }) {
        setFilters(newFilters);
    }

    useEffect(() => {
        async function fetchData() {
            try {
                // Generate an id
                let reqId = v4();

                setIsLoading(true);
                const res = await throttledPlotSessions(reqId, filters);
                // If the res is null then this is outdated request just skip there will be another one will run for sure
                if (res === null) {
                    return;
                }

                if (res.success) {
                    setPlotData(res.data);
                } else {
                    toast.error(res?.message || "Something went wrong");
                }
            } catch (err) {
                toast.error("Something went wrong");
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [filters]);

    return (
        <div className="flex flex-col gap-4 p-4 h-full overflow-auto transition-colors">
            <LoadingOverlay isVisible={isLoading} />
            <div className={plotData?.dailyTimeSpent?.length ? "h-full" : ""}>
                <SessionFilters
                    className={"max-h-fit!"}
                    onFiltersChange={handleFiltersChange}
                    localStorageId={"statistics-Table"}
                    renderCheckboxes={false}
                    exportCSV={false}
                />
            </div>
            <div className="flex flex-col gap-4">
                {plotData?.dailyTimeSpent?.length ? (
                    <>
                        <div className="flex flex-col gap-2 min-[900px]:flex-row ">
                            <Summary data={plotData?.summary || {}} />
                            <TopCategoriesChart
                                data={plotData?.topFiveCategories || []}
                            />
                        </div>

                        <MainChart data={plotData?.dailyTimeSpent || []} />
                    </>
                ) : (
                    <p className="bg-(--secondary-color) p-3 rounded-lg italic">
                        No data yet. Start tracking your sessions to see charts
                        here
                    </p>
                )}
            </div>
        </div>
    );
}

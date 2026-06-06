import { useState } from "react";
import SessionTable from "../components/dashboard/SessionTable";
import SessionFilters from "../components/dashboard/SessionFilters";

export default function Dashboard() {
    const [filters, setFilters] = useState({});
    const [fixCategory, setFixCategory] = useState(false);
    const [categoryDesc, setCategoryDesc] = useState(false);
    const [fixStopwatch, setFixStopwatch] = useState(false);
    const [stopwatchDesc, setStopwatchDesc] = useState(false);

    function handleFiltersChange({
        filters: newFilters,
        fixCategory: newFix,
        categoryDesc: newCategoryDesc,
        fixStopwatch: newFixStopwatch,
        stopwatchDesc: newStopwatchDesc,
    }) {
        setFilters(newFilters);
        if (typeof newFix === "boolean") setFixCategory(newFix);
        if (typeof newCategoryDesc === "boolean") setCategoryDesc(newCategoryDesc);
        if (typeof newFixStopwatch === "boolean") setFixStopwatch(newFixStopwatch);
        if (typeof newStopwatchDesc === "boolean") setStopwatchDesc(newStopwatchDesc);
    }

    return (
        <div className="flex flex-col gap-4 p-4 h-full">
            <SessionFilters
                onFiltersChange={handleFiltersChange}
                localStorageId={"Sessions-Table"}
                filters={filters}
            />

            <SessionTable
                filters={filters}
                fixCategory={fixCategory}
                categoryDesc={categoryDesc}
                fixStopwatch={fixStopwatch}
                stopwatchDesc={stopwatchDesc}
            />
        </div>
    );
}

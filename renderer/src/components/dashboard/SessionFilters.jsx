import Input from "../ui/Input";
import Dropdown from "../ui/Dropdown";
import RemovableElement from "../ui/RemovableElement";
import useLocalStorageState from "../../hooks/useLocalStorageState";
import { useEffect, useState } from "react";
import PersistCheckbox from "./PersistCheckbox";
import { CATEGORY_OPTIONS } from "../../util/constants";
import CategoryInput from "../stopwatch/CategoryInput";
import Button from "../ui/Button";
import {
    addDays,
    safeDateFormat,
    lastDayOfMonth,
    lastMonth,
    lastWeek,
    subDays,
    truncateMonth,
    truncateWeek,
    firstOfTheDayUTC,
    endOfTheDayUTC,
} from "../../util/util";
import Modal from "../ui/Modal";
import ExportCSV from "./ExportCSV";

function SessionFilters({
    className,
    onFiltersChange,
    localStorageId,
    renderCheckboxes = true,
    exportCSV = true,
    filters,
}) {
    const [fromDate, setFromDate] = useLocalStorageState(
        `${localStorageId}-session-filter-fromDate`,
        "",
    );
    const [toDate, setToDate] = useLocalStorageState(
        `${localStorageId}-session-filter-toDate`,
        "",
    );
    const [selectedCategories, setSelectedCategories] = useLocalStorageState(
        `${localStorageId}-session-filter-categories`,
        [],
    );
    const [newCategory, setNewCategory] = useState("");

    const btnClasses =
        "bg-(--thirdary-color) hover:bg-(--forthary-color) p-1 rounded-lg";

    function buildFilters({ from, to, categories }) {
        const where = {};

        if (from || to) {
            where.createdAt = {};
            if (from)
                where.createdAt.gte$ = firstOfTheDayUTC(safeDateFormat(from));
            if (to) where.createdAt.lte$ = endOfTheDayUTC(safeDateFormat(to));
        }

        if (categories.length > 0) {
            where["$stopwatch.category$"] = { in$: categories };
        }

        return where;
    }

    // When get rendered notify the parent
    useEffect(() => {
        notify();
    }, []);

    function notify(overrides = {}) {
        const state = {
            from: fromDate,
            to: toDate,
            categories: selectedCategories,
            ...overrides,
        };
        onFiltersChange?.({
            filters: buildFilters(state),
            ...overrides,
        });
    }

    function handleFromDate(e) {
        setFromDate(e.target.value);
        notify({ from: e.target.value });
    }

    function handleToDate(e) {
        setToDate(e.target.value);
        notify({ to: e.target.value });
    }

    function addCategory(value) {
        const trimmed = value.trim();
        if (!trimmed || selectedCategories.includes(trimmed)) return;
        const next = [...selectedCategories, trimmed];
        setSelectedCategories(next);
        notify({ categories: next });
    }

    function removeCategory(value) {
        const next = selectedCategories.filter((c) => c !== value);
        setSelectedCategories(next);
        notify({ categories: next });
    }

    function handleCategorySearchKeyDown(e) {
        if (e.key === "Enter") {
            addCategory(newCategory);
            setNewCategory("");
        }
    }

    function handleSortLockChange({
        fixCategory,
        categoryDesc,
        fixStopwatch,
        stopwatchDesc,
    }) {
        onFiltersChange?.({
            filters: buildFilters({
                from: fromDate,
                to: toDate,
                categories: selectedCategories,
            }),
            fixCategory,
            categoryDesc,
            fixStopwatch,
            stopwatchDesc,
        });
    }

    function handleDateChange(fromDate, toDate) {
        setFromDate(fromDate);
        setToDate(toDate);
        notify({ from: fromDate, to: toDate });
    }

    function resetFilters() {
        setFromDate("");
        setToDate("");
        setNewCategory([]);
        setSelectedCategories([]);
        notify({ from: "", to: "", categories: [] });
    }

    return (
        <div
            className={`flex flex-col gap-4 p-4 bg-(--secondary-color) rounded-lg max-h-[40%] overflow-auto transition-colors ${className}`}
        >
            {/* Date Range */}
            <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                    <h2 className="text-lg text-(--main-interactive-color-v1) font-medium">
                        Filter By Creation Range
                    </h2>
                    <Button
                        size="sm"
                        theme="theme"
                        className={`${btnClasses}`}
                        onClick={resetFilters}
                    >
                        Clear Filters
                    </Button>
                </div>
                <div className="flex flex-col gap-3">
                    <div>
                        <label htmlFor="dateFrom">
                            Session creation date starts at
                        </label>
                        <Input
                            id="dateFrom"
                            type="date"
                            placeholder="From"
                            value={fromDate}
                            onChange={handleFromDate}
                            className="bg-(--thirdary-color)!"
                            onClick={(e) => e.target.showPicker?.()}
                        />
                    </div>

                    <div>
                        <label htmlFor="dateTo">
                            Session creation date ends at
                        </label>
                        <Input
                            type="date"
                            id="dateTo"
                            placeholder="To"
                            value={toDate}
                            onChange={handleToDate}
                            className="bg-(--thirdary-color)!"
                            onClick={(e) => e.target.showPicker?.()}
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button
                        className={btnClasses}
                        sizse="sm"
                        theme="normal"
                        onClick={() => {
                            let dateThisWeek = truncateWeek(new Date(), true);
                            handleDateChange(
                                safeDateFormat(dateThisWeek),
                                safeDateFormat(new Date()),
                            );
                        }}
                    >
                        This Week
                    </Button>
                    <Button
                        className={btnClasses}
                        sizse="sm"
                        theme="normal"
                        onClick={() => {
                            let dateThisMonth = truncateMonth(new Date(), true);
                            handleDateChange(
                                safeDateFormat(dateThisMonth),
                                safeDateFormat(new Date()),
                            );
                        }}
                    >
                        This Month
                    </Button>
                    <Button
                        className={btnClasses}
                        sizse="sm"
                        theme="normal"
                        onClick={() => {
                            let dateAtLastWeek = lastWeek(new Date(), true);
                            handleDateChange(
                                safeDateFormat(dateAtLastWeek),
                                safeDateFormat(addDays(dateAtLastWeek, 6)),
                            );
                        }}
                    >
                        Last Week
                    </Button>
                    <Button
                        className={btnClasses}
                        size="sm"
                        theme="normal"
                        onClick={() => {
                            let dateAtLastMonth = lastMonth(new Date(), true);

                            handleDateChange(
                                safeDateFormat(dateAtLastMonth),
                                safeDateFormat(lastDayOfMonth(dateAtLastMonth)),
                            );
                        }}
                    >
                        Last Month
                    </Button>
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-col gap-2 mt-2">
                <h2 className="text-lg text-(--main-interactive-color-v1) font-medium">
                    Filter By Category
                </h2>
                <div className="flex gap-3 items-start">
                    <Dropdown
                        className="bg-(--thirdary-color)! flex-1"
                        label="Select Category"
                        optionOptions={{ className: "p-2!" }}
                        onSelect={({ option, forceClose }) => {
                            forceClose();
                            addCategory(option.value);
                        }}
                        options={CATEGORY_OPTIONS}
                    />
                    <CategoryInput
                        placeholder="Search or add category..."
                        onKeyDown={handleCategorySearchKeyDown}
                        handleChange={(val) => setNewCategory(val)}
                        className="bg-(--thirdary-color)!"
                        parentClasssName="flex-1!"
                    />
                </div>

                <div className="flex w-full overflow-auto gap-2 mt-1 py-2">
                    {selectedCategories.length > 0 &&
                        selectedCategories.map((cat) => (
                            <RemovableElement
                                key={cat}
                                label={cat}
                                onRemove={() => removeCategory(cat)}
                                className="bg-(--thirdary-color)!"
                            />
                        ))}
                </div>
            </div>

            {/* Sort Lock */}
            {renderCheckboxes ? (
                <div className="flex flex-col gap-2">
                    <h2 className="text-lg text-(--main-interactive-color-v1) font-medium">
                        Sort Lock
                    </h2>
                    <PersistCheckbox
                        onChange={handleSortLockChange}
                        localStorageId={localStorageId}
                    />
                </div>
            ) : null}

            {exportCSV ? <ExportCSV filters={filters} /> : null}
        </div>
    );
}

export default SessionFilters;

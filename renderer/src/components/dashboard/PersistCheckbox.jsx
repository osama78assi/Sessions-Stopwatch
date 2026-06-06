import { useEffect } from "react";
import useLocalStorageState from "../../hooks/useLocalStorageState";
import Checkbox from "../ui/Checkbox";

/**
 * Renders two mutually exclusive sort-lock checkboxes:
 *   [ ] Fix the category while sorting  →  [ ] Order category DESC
 *   [ ] Fix the stopwatch while sorting →  [ ] Order stopwatch DESC
 *
 * Only one of the two main checkboxes can be active at a time.
 *
 * onChange({ fixCategory, categoryDesc, fixStopwatch, stopwatchDesc })
 */
function PersistCheckbox({ onChange, localStorageId }) {
    const [fixCategory, setFixCategory] = useLocalStorageState(
        `${localStorageId}-sort-lock-fix-category`,
        false,
    );
    const [categoryDesc, setCategoryDesc] = useLocalStorageState(
        `${localStorageId}-sort-lock-category-desc`,
        false,
    );
    const [fixStopwatch, setFixStopwatch] = useLocalStorageState(
        `${localStorageId}-sort-lock-fix-stopwatch`,
        false,
    );
    const [stopwatchDesc, setStopwatchDesc] = useLocalStorageState(
        `${localStorageId}-sort-lock-stopwatch-desc`,
        false,
    );

    // Sync the parent
    useEffect(() => {
        emit({});
    }, []);

    function emit(overrides) {
        const state = {
            fixCategory,
            categoryDesc,
            fixStopwatch,
            stopwatchDesc,
            ...overrides,
        };
        onChange?.(state);
    }

    function handleFixCategory(checked) {
        setFixCategory(checked);
        // Uncheck the other one
        if (checked) {
            setFixStopwatch(false);
            setStopwatchDesc(false);
            emit({
                fixCategory: checked,
                fixStopwatch: false,
                stopwatchDesc: false,
            });
        } else {
            setCategoryDesc(false);
            emit({ fixCategory: checked, categoryDesc: false });
        }
    }

    function handleCategoryDesc(checked) {
        setCategoryDesc(checked);
        emit({ categoryDesc: checked });
    }

    function handleFixStopwatch(checked) {
        setFixStopwatch(checked);
        // Uncheck the other one
        if (checked) {
            setFixCategory(false);
            setCategoryDesc(false);
            emit({
                fixStopwatch: checked,
                fixCategory: false,
                categoryDesc: false,
            });
        } else {
            setStopwatchDesc(false);
            emit({ fixStopwatch: checked, stopwatchDesc: false });
        }
    }

    function handleStopwatchDesc(checked) {
        setStopwatchDesc(checked);
        emit({ stopwatchDesc: checked });
    }

    const checkboxClass =
        "accent-(--main-interactive-color-v3) w-4 h-4 cursor-pointer";
    const labelClass =
        "flex items-center gap-2 cursor-pointer select-none w-fit";
    const textClass = "text-sm text-(--secondary-text-color)";

    return (
        <div className="flex flex-col gap-2">
            {/* Row 1: Fix category */}
            <div className="flex gap-4 items-center flex-wrap">
                <label className={labelClass}>
                    <Checkbox
                        className={checkboxClass}
                        value={fixCategory}
                        onChange={handleFixCategory}
                    />
                    <span className={textClass}>
                        Fix the category while sorting
                    </span>
                </label>

                {fixCategory && (
                    <label className={labelClass}>
                        <Checkbox
                            className={checkboxClass}
                            value={categoryDesc}
                            onChange={handleCategoryDesc}
                        />
                        <span className={textClass}>Order category DESC</span>
                    </label>
                )}
            </div>

            {/* Row 2: Fix stopwatch */}
            <div className="flex gap-4 items-center flex-wrap">
                <label className={labelClass}>
                    <Checkbox
                        className={checkboxClass}
                        value={fixStopwatch}
                        onChange={handleFixStopwatch}
                    />
                    <span className={textClass}>
                        Fix the stopwatch while sorting
                    </span>
                </label>

                {fixStopwatch && (
                    <label className={labelClass}>
                        <Checkbox
                            className={checkboxClass}
                            value={stopwatchDesc}
                            onChange={handleStopwatchDesc}
                        />
                        <span className={textClass}>Order stopwatch DESC</span>
                    </label>
                )}
            </div>
        </div>
    );
}

export default PersistCheckbox;

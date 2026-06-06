export function getLocalStorageItem(key) {
    const value = localStorage.getItem(key);

    if (value === null) {
        return null;
    }

    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
}

export function getSetLocalStorageItem(key, defaultValue) {
    const value = localStorage.getItem(key);

    if (value === null) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
    }

    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
}

export function setLocalStorageItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function removeLocalStorageItem(key) {
    localStorage.removeItem(key);
}

export function createScrollDirectionDetector() {
    let lastX = 0;
    let lastY = 0;

    return function (currentX, currentY) {
        const deltaX = currentX - lastX;
        const deltaY = currentY - lastY;

        let result = null;

        if (deltaX !== 0 && deltaY !== 0) {
            result = "both";
        } else if (deltaX !== 0) {
            result = "x";
        } else if (deltaY !== 0) {
            result = "y";
        }

        lastX = currentX;
        lastY = currentY;

        return result;
    };
}

export function formatDate(inputDate) {
    const d = new Date(inputDate);

    const day = d.getDate();
    const month = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear();

    let time = d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    time = time.replace("am", "AM").replace("pm", "PM");

    return `${day} ${month} ${year}, ${time}`;
}

export function subDays(date, days = 0) {
    return new Date(date.getTime() - days * 1000 * 60 * 60 * 24);
}

export function addDays(date, days = 0) {
    return new Date(date.getTime() + days * 1000 * 60 * 60 * 24);
}

export function truncateTime(date) {
    let newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
}

export function truncateWeek(date, truncTime = false) {
    let newDate = truncTime ? truncateTime(date) : new Date(date);
    return subDays(newDate, newDate.getDay());
}

export function truncateMonth(date, truncTime = false) {
    let newDate = truncTime ? truncateTime(date) : new Date(date);
    return subDays(newDate, newDate.getDate() - 1);
}

export function lastWeek(date, truncTime = false) {
    return subDays(truncateWeek(date, truncTime), 7);
}

export function lastMonth(date, truncTime = false) {
    let newDate = truncTime ? truncateTime(date) : new Date(date);
    // Reset days in the month
    newDate = truncateMonth(newDate);
    newDate.setMonth((newDate.getMonth() - 1) % 11);
    return newDate;
}

export function nextMonth(date) {
    let newDate = new Date(date);
    // Reset days in the month
    newDate = truncateMonth(newDate);

    newDate.setMonth((newDate.getMonth() + 1) % 11);
    return newDate;
}

/*
    Return the last day of the month
*/
export function lastDayOfMonth(date) {
    let newDate = new Date(date);
    newDate = truncateMonth(newDate);
    // Increase the month count by 1
    newDate.setMonth(newDate.getMonth() + 1);
    // Subtract one day
    return subDays(newDate, 1);
}

export function safeDateFormat(date) {
    let parsedDate = new Date(date);
    return `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, "0")}-${String(parsedDate.getDate()).padStart(2, "0")}`;
}

// Receieve a safeDateFormat
export function firstOfTheDayUTC(date) {
    return new Date(date + "T00:00:00.000Z");
}

// Receieve a safeDateFormat
export function endOfTheDayUTC(date) {
    return new Date(date + "T23:59:59.999Z");
}

// This will be used when parsing the filters To prevent race condition
export function throttle(fn) {
    // Save the last id
    let lastId = "";

    return async function (id, ...args) {
        // Update the current id
        lastId = id;

        // Execute the search function
        const res = await fn(...args);

        // Skip result if id is outdated
        if (lastId !== id) return null;

        return res;
    };
}
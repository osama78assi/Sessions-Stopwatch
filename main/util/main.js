import ApplicationError from "./applicationError.js";
import {
    INVALID_PAGINATION_LIMIT,
    INVALID_PAGINATION_PAGE,
} from "../errors/global.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { Op } from "sequelize";

// This function will take the filters from the client as expected shape and parse it to match sequelize operators
// This allows you to do multiple queries by using the same service function
/*
Expected shapes:
filters: {
    field: {
        or$/and$: [
            {
                op: value
            },
            {
                op: value
            }
        ]
    }
}

filters: {
    field: {
        op: val,
        op: val
    }
}

filters: {
    or$/and$: [
        []
    ]
}

*/

export const opMapper = {
    eq$: Op.eq,
    ne$: Op.ne,
    like$: Op.like,
    iLike$: Op.iLike,
    gt$: Op.gt,
    gte$: Op.gte,
    lt$: Op.lt,
    lte$: Op.lte,
    between$: Op.between,
    or$: Op.or,
    and$: Op.and,
    endsWith$: Op.endsWith,
    startsWith$: Op.startsWith,
    in$: Op.in,
};

// Either concat fields so we need to return an array, or normal field to return an object
function keyContainer(key) {
    if (!["and$", "or$"].includes(field)) {
        return [];
    }

    return {};
}

// Helper function to map the key
function mapKey(key) {
    if (opMapper[key]) return opMapper[key];

    return key;
}

function innerMap(obj) {
    let results;
    const objType = Object.prototype.toString.call(obj);
    // Case1: The obj is primitve
    if (objType !== "[object Object]" && objType !== "[object Array]") {
        return obj; // Return it as it is
    }

    // Case 2: obj is an array
    if (Array.isArray(obj)) {
        results = [];

        for (let value of obj) {
            const type = Object.prototype.toString.call(value);

            // 1. When the value is not a primitive then we need to call parse
            if (type === "[object Object]") {
                results.push(innerMap(value));

                // Terminate the iteration
                continue;
            }

            // 2. It's primitive then just push it
            results.push(value);
        }
    } else {
        // Case 3: obj is an object object
        results = {};

        const keys = Object.keys(obj);

        for (let key of keys) {
            // Map the key
            const mappedKey = mapKey(key);

            const type = Object.prototype.toString.call(obj[key]);
            // 1. The value is an object then assign to object
            if (type === "[object Object]") {
                results[mappedKey] = innerMap(obj[key]);

                // Terminate the iteration
                continue;
            }

            // 2. The value is an array
            if (type === "[object Array]") {
                results[mappedKey] = innerMap(obj[key]);

                // Terminate the iteration
                continue;
            }

            // 3. The value is primitive. Add
            results[mappedKey] = obj[key];
        }
    }

    return results;
}

export function mapFilters(filters = {}) {
    // Final sequelzie where statement
    const whereStatement = {};

    // Loop over provided fields
    Object.keys(filters).forEach((key) => {
        // This will return an object so take it
        whereStatement[mapKey(key)] = innerMap(filters[key]);
    });

    return whereStatement;
}

export function getSafeLimit(limit) {
    if (limit < 100) return limit;
    return 100;
}

export function checkPagination(page, limit) {
    if (typeof page !== "number") throw INVALID_PAGINATION_PAGE;

    if (typeof limit !== "number") throw INVALID_PAGINATION_LIMIT;
}

export function __dir(url) {
    return dirname(fileURLToPath(url));
}

export function escapeCSV(value) {
    if (value === null || value === undefined) {
        return "";
    }

    const stringValue = String(value);

    // If value contains comma, quote, or newline, wrap in quotes and escape quotes
    if (
        stringValue.includes(",") ||
        stringValue.includes('"') ||
        stringValue.includes("\n") ||
        stringValue.includes("\r")
    ) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
}

export function parseDuration(duration) {
    // Evaluate, hours, minutes, seconds, milleseconds
    let ms = Math.trunc(duration % 1000);
    let s = Math.trunc(duration / 1000) % 60;
    let m = Math.trunc(duration / 1000 / 60) % 60;
    let h = Math.trunc(duration / 1000 / 60 / 60) % 24;
    let d = Math.trunc(duration / 1000 / 60 / 60 / 24);

    const portions = [];

    if (d) {
        portions.push(`${d} Day${d > 2 ? "s" : ""}`);
    }
    if (h) {
        portions.push(`${h} Hour${h > 2 ? "s" : ""}`);
    }
    if (m) {
        portions.push(`${m} Minute${m > 2 ? "s" : ""}`);
    }
    if (s) {
        portions.push(`${s} Second${s > 2 ? "s" : ""}`);
    }
    if (d === 0 && h === 0 && m === 0 && s === 0) {
        portions.push(`${ms} Millisecond${ms > 2 ? "s" : ""}`);
    }

    return portions.join(", ");
}

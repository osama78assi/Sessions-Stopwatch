import ApplicationError from "../util/applicationError.js";

export const INVALID_PAGINATION_PAGE = new ApplicationError({
    message: "The page must be a number",
    code: "INVALID_PAGINATION_PAGE",
});

export const INVALID_PAGINATION_LIMIT = new ApplicationError({
    message: "The limit must be a number",
    code: "INVALID_PAGINATION_LIMIT",
});

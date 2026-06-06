import ApplicationError from "../util/applicationError.js";

export const STOPWATCH_NOT_EXIST = new ApplicationError({
    message: "The stopwatch isn't existed",
    code: "STOPWATCH_NOT_EXIST",
});
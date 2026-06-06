import ApplicationError from "../util/applicationError.js";

export const SESSION_NOT_EXIST = new ApplicationError({
    message: "The session isn't existed",
    code: "SESSION_NOT_EXIST",
});

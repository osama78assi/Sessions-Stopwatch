import { errorHandler } from "../util/applicationError.js";
import stopwatchServices from "../services/stopwatch.js";
import { checkPagination } from "../util/main.js";
import sessionServices from "../services/session.js";
import { Op } from "sequelize";

class StopwatchHandlers {
    async create(payload) {
        try {
            // Payload
            /*
            {
                category: "Study",
                sessions: [
                    {
                        duration: 234234, // ms
                        stopsCount: 23,
                        longestSet: 4323,
                        createdAt: momentOfTheFirstStart,
                        description: "something"
                    },
                    {
                        duration: 234234, // ms
                    }
                ]
            }
            */
            const result = await stopwatchServices.create(payload);

            // Create the sessions
            const sessions = payload.sessions.map((obj) => {
                return { stopwatchId: result.id, ...obj };
            });

            await sessionServices.bulkCreate(sessions);

            return {
                success: true,
                data: result.toJSON(),
            };
        } catch (err) {
            return errorHandler(err);
        }
    }

    async update(id, payload) {
        try {
            const result = await stopwatchServices.update(id, payload);
            return {
                success: true,
                data: result.toJSON(),
            };
        } catch (err) {
            return errorHandler(err);
        }
    }

    async destroy(id) {
        try {
            await stopwatchServices.destroy(id);
            return {
                success: true,
                message: "Stopwatch deleted successfully",
            };
        } catch (err) {
            return errorHandler(err);
        }
    }
}

export default new StopwatchHandlers();

import getSequelize from "../config/sequelize.js";
import { STOPWATCH_NOT_EXIST } from "../errors/stopwatch.js";
import Stopwatch from "../models/stopwatch.js";
import ApplicationError from "../util/applicationError.js";
import { getSafeLimit } from "../util/main.js";

class StopwatchServices {
    async create(details) {
        try {
            const stopwatch = await Stopwatch.create(details);

            return stopwatch;
        } catch (err) {
            console.log(err);
        }
    }

    async update(id, payload) {
        try {
            await Stopwatch.update(payload, {
                where: { id },
            });

            // In sqlite you need to query
            return await Stopwatch.findByPk(id);
        } catch (err) {
            if (!(err instanceof ApplicationError)) {
                console.log(err);
            }

            throw err;
        }
    }

    async destroy(id, t) {
        let transaction = null;
        if (t) {
            transaction = t;
        } else {
            transaction = await getSequelize().transaction();
        }

        try {
            const count = await Stopwatch.destroy({
                where: { id },
                transaction,
            });
            if (count === 0) {
                throw STOPWATCH_NOT_EXIST;
            }

            if (!t) {
                await transactiona.commit();
            }

            return true;
        } catch (err) {
            if (!t) {
                await transactiona.rollback();
            }

            if (!(err instanceof ApplicationError)) {
                console.log(err);
            }
            throw err;
        }
    }
}

export default new StopwatchServices();

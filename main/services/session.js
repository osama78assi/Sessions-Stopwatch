import { basename, dirname, join } from "path";
import { SESSION_NOT_EXIST } from "../errors/session.js";
import Session from "../models/sessions.js";
import ApplicationError from "../util/applicationError.js";
import { getSafeLimit, parseDuration } from "../util/main.js";
import { app } from "electron";
import { writeFile, appendFile, rename } from "fs/promises";
import { v4 } from "uuid";
import Stopwatch from "../models/stopwatch.js";
import { escapeCSV } from "../util/main.js";
import getSequelize from "../config/sequelize.js";
import { renameSync } from "fs";

class SessionServices {
    async bulkCreate(sessionsData) {
        try {
            const sessions = await Session.bulkCreate(sessionsData);

            return (
                await this.get({
                    filters: { stopwatchId: sessions[0].stopwatchId },
                    loadAll: true,
                })
            ).data;
        } catch (err) {
            if (!(err instanceof ApplicationError)) {
                console.log(err);
            }

            throw err;
        }
    }

    async update(id, payload) {
        try {
            await Session.update(payload, {
                where: { id },
            });

            // In sqlite you need to query
            return await Session.findByPk(id);
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
            const count = await Session.destroy({ where: { id }, transaction });
            if (count === 0) {
                throw SESSION_NOT_EXIST;
            }

            if (!t) {
                await transaction.commit();
            }

            return true;
        } catch (err) {
            if (!t) {
                await transaction.rollback();
            }

            if (!(err instanceof ApplicationError)) {
                console.log(err);
            }
            throw err;
        }
    }

    async get({
        page = 1,
        limit = 10,
        filters = null,
        order,
        fixCategory,
        categoryDesc,
        loadAll = false,
        t,
    }) {
        let transaction = null;
        if (t) {
            transaction = t;
        } else {
            transaction = await getSequelize().transaction();
        }

        try {
            // Get the count
            const count = await Session.count({
                include: [
                    {
                        model: Stopwatch,
                        as: "stopwatch",
                    },
                ],
                ...(filters ? { where: filters } : {}),
                transaction,
            });

            // Get the safe limit (undefined if loadAll, which Sequelize will ignore)
            const safeLimit = loadAll ? undefined : getSafeLimit(limit);

            // Calculate the offset
            const offset = safeLimit ? (page - 1) * safeLimit : 0;

            let passedOrder = [["id", "DESC"]];

            // In case the user want to fix the category while sorting
            if (fixCategory && order) {
                passedOrder = [
                    [
                        { model: Stopwatch, as: "stopwatch" },
                        "category",
                        categoryDesc ? "DESC" : "ASC",
                    ],
                    order,
                ];
            } else if (order) {
                passedOrder = order;
            }

            // Get sessions
            const data = await Session.findAll({
                limit: safeLimit,
                offset,
                include: [
                    {
                        model: Stopwatch,
                        as: "stopwatch",
                    },
                ],
                ...(filters ? { where: filters } : {}),
                order: passedOrder,
                transaction,
            });

            // Calculate the remaining pages (1 if loadAll, otherwise calculated)
            const pages = Math.ceil(count / (loadAll ? count : safeLimit));

            if (!t) {
                await transaction.commit();
            }

            return {
                data,
                pagination: { pages, count },
            };
        } catch (err) {
            if (!t) {
                await transaction.rollback();
            }
            if (!(err instanceof ApplicationError)) {
                console.log(err);
            }

            throw err;
        }
    }

    // Get the data for plotting
    async plot(filters) {
        let transaction = await getSequelize().transaction();

        try {
            // Get first the summary of the data
            const summary = await Session.findOne({
                attributes: [
                    [
                        getSequelize().fn(
                            "SUM",
                            getSequelize().col("duration"),
                        ),
                        "totalTimeSpent",
                    ],
                    [
                        getSequelize().fn(
                            "AVG",
                            getSequelize().col("duration"),
                        ),
                        "avgTimeSpent",
                    ],
                    [
                        getSequelize().fn(
                            "MAX",
                            getSequelize().col("duration"),
                        ),
                        "maximumTimeSpent",
                    ],
                    [
                        getSequelize().fn(
                            "AVG",
                            getSequelize().col("stopCounts"),
                        ),
                        "avgStopCounts",
                    ],
                    [
                        getSequelize().fn(
                            "COUNT",
                            getSequelize().col("duration"),
                        ),
                        "totalSessionCounts",
                    ],
                    [
                        getSequelize().fn(
                            "MAX",
                            getSequelize().col("longestSet"),
                        ),
                        "longestSet",
                    ],
                ],
                ...(filters ? { where: filters } : {}),
                include: [
                    {
                        model: Stopwatch,
                        as: "stopwatch",
                        attributes: [],
                    },
                ],
                raw: true,
                transaction: transaction,
            });

            // Total time spent every day
            const dailyTimeSpent = await Session.findAll({
                attributes: [
                    [
                        getSequelize().fn(
                            "strftime",
                            "%Y-%m-%d",
                            getSequelize().col("session.createdAt"),
                        ),
                        "day",
                    ],
                    [
                        getSequelize().fn(
                            "SUM",
                            getSequelize().col("duration"),
                        ),
                        "totalTimeSpent",
                    ],
                ],
                ...(filters ? { where: filters } : {}),
                include: [
                    {
                        model: Stopwatch,
                        as: "stopwatch",
                        attributes: [],
                    },
                ],
                group: [
                    getSequelize().fn(
                        "strftime",
                        "%Y-%m-%d",
                        getSequelize().col("session.createdAt"),
                    ),
                ],
                order: [["day", "ASC"]],
                raw: true,
                transaction,
            });

            // Top 5 categories based on total time spent
            const topFiveCategories = await Session.findAll({
                attributes: [
                    [getSequelize().col("stopwatch.category"), "category"],
                    [
                        getSequelize().fn(
                            "SUM",
                            getSequelize().col("duration"),
                        ),
                        "totalTimeSpent",
                    ],
                ],
                include: [
                    {
                        model: Stopwatch,
                        as: "stopwatch",
                        attributes: [],
                    },
                ],
                ...(filters ? { where: filters } : {}),
                group: [getSequelize().col("stopwatch.category")],
                order: [["totalTimeSpent", "DESC"]],
                limit: 5,
                raw: true,
                transaction,
            });

            // Group the data in the same object
            let data = {
                summary,
                dailyTimeSpent,
                topFiveCategories,
            };

            await transaction.commit();

            return {
                data,
            };
        } catch (err) {
            await transaction.rollback();
            if (!(err instanceof ApplicationError)) {
                console.log(err);
            }

            throw err;
        }
    }

    async exportCSV(destination, filters, options) {
        /*
            formatTime: boolean
        */
        try {
            // 1. Check how many data you have
            const count = await Session.count({
                ...(filters ? { where: filters } : {}),
            });
            const fileName = basename(destination);
            const dest = dirname(destination);

            const filePath = join(dest, `.${fileName}`);

            // Parse options
            const { formatTime = false } = options;

            // Write the headers
            const file = await writeFile(
                filePath,
                `Stopwatch Id,Stopwatch Category,Session Id,${formatTime ? "Session Duration" : "Session Duration (ms)"},Session Description,Session Start Time,Session End Time\n`,
                "UTF-8",
            );

            // 2. Get the 3000 porition of data based on the filters
            let remaining = count;
            let offset = 0;
            let limit = 3000;
            while (remaining > 0) {
                // Fetch the data
                let data = await Session.findAll({
                    offset,
                    limit,
                    include: [
                        {
                            model: Stopwatch,
                            as: "stopwatch",
                        },
                    ],
                    ...(filters ? { where: filters } : {}),
                });

                let writtenData = data
                    .map((session) => {
                        let stopwatchId = session.stopwatchId;
                        let stopwatchCategory = escapeCSV(
                            session.stopwatch.category,
                        );
                        let sessionId = session.id;
                        let duration = formatTime
                            ? escapeCSV(
                                  parseDuration(Math.trunc(session.duration)),
                              )
                            : session.duration;

                        let description = escapeCSV(session.description);
                        let stopwatchStartTime = escapeCSV(new Intl.DateTimeFormat(
                            "en-GB",
                            {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour12: true,
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                            },
                        ).format(session.createdAt));
                        let stopwatchFinishTime = escapeCSV(new Intl.DateTimeFormat(
                            "en-GB",
                            {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour12: true,
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                            },
                        ).format(session.finishedAt));

                        return `${stopwatchId},${stopwatchCategory},${sessionId},${duration},${stopwatchStartTime},${stopwatchFinishTime}`;
                    })
                    .join("\n");

                await appendFile(filePath, writtenData);

                // Update the remaining and offset

                offset += limit;
                remaining -= limit;
            }

            // 3. Show the file
            renameSync(filePath, join(dest, `${fileName}`));

            return join(dest, `${fileName}`);
        } catch (err) {
            if (!(err instanceof ApplicationError)) {
                console.log(err);
            }

            throw err;
        }
    }
}

export default new SessionServices();

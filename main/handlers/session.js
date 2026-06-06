import ApplicationError, { errorHandler } from "../util/applicationError.js";
import sessionServices from "../services/session.js";
import { checkPagination, mapFilters } from "../util/main.js";
import { Op } from "sequelize";
import Session from "../models/sessions.js";
import getSequelize from "../config/sequelize.js";
import stopwatchServices from "../services/stopwatch.js";
import { BrowserWindow, dialog } from "electron";

class SessionHandlers {
    async get({
        page = 1,
        limit = 10,
        fixCategory,
        categoryDesc,
        filters = null,
        order,
        loadAll = false,
    }) {
        try {
            if (!loadAll) {
                checkPagination(page, limit);
            }

            // Filters
            /*
                {
                    fromDate: date,
                    toDate: date,
                    stopwatchId: id
                }
            */
            // Order
            // [["field", "desc"]]

            const where = mapFilters(filters || {});

            const results = await sessionServices.get({
                page,
                limit,
                filters: where,
                fixCategory,
                categoryDesc,
                ...(order ? { order } : {}),
                loadAll,
            });

            return {
                success: true,
                ...results,
                data: results.data.map((session) => session.toJSON()),
            };
        } catch (err) {
            return errorHandler(err);
        }
    }

    async update(id, payload) {
        try {
            const result = await sessionServices.update(id, payload);
            return {
                success: true,
                data: result.toJSON(),
            };
        } catch (err) {
            return errorHandler(err);
        }
    }

    async destroy(id) {
        let transaction = await getSequelize().transaction();
        try {
            // Check the stopwatch if it has more sessions or delete it
            let { data: session } = await sessionServices.get({
                page: 1,
                limit: 1,
                filters: {
                    id,
                },
                t: transaction,
            });

            await sessionServices.destroy(id, transaction);

            // Get the sessions with similar stopwatch
            const sessions = await sessionServices.get({
                page: 1,
                limit: 1,
                filters: {
                    stopwatchId: session[0].stopwatchId,
                },
                t: transaction,
            });

            if (sessions.pagination.count === 0) {
                // Delete the stopwatch
                await stopwatchServices.destroy(
                    session[0].stopwatchId,
                    transaction,
                );
            }

            await transaction.commit();

            return {
                success: true,
                message: "Session deleted successfully",
            };
        } catch (err) {
            await transaction.rollback();
            return errorHandler(err);
        }
    }

    async plot(filters = null) {
        try {
            // Filters
            /*
                {
                    fromDate: date,
                    toDate: date,
                    stopwatchId: id
                }
            */

            const where = mapFilters(filters || {});

            const results = await sessionServices.plot(
                Object.keys(where).length ? where : null,
            );

            return {
                success: true,
                data: results.data,
            };
        } catch (err) {
            return errorHandler(err);
        }
    }

    async pickSaveCsvFile(sender) {
        try {
            const win = BrowserWindow.fromWebContents(sender);
            const result = await dialog.showSaveDialog(win, {
                title: "Save Report",
                defaultPath: "Sessions-Report.csv",
                buttonLabel: "Save",
                filters: [{ name: "CSV File", extensions: ["csv"] }],
            });

            if (!result.canceled) {
                return {
                    success: true,
                    data: result.filePath,
                };
            }

            return {
                success: true,
                data: null,
            };
        } catch (err) {
            return errorHandler(err);
        }
    }

    async exportCSV(destination, filters, options) {
        try {
            const where = mapFilters(filters || {});

            const filepath = await sessionServices.exportCSV(
                destination,
                where,
                options,
            );

            return {
                message: "Report exported successfully",
                success: true,
                data: filepath,
            };
        } catch (err) {
            return errorHandler(err);
        }
    }
}

export default new SessionHandlers();

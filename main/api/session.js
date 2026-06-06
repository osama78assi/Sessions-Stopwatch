import { ipcMain } from "electron";
import channels from "../config/channels.js";
import sessionHandlers from "../handlers/session.js";

export default function initSessionApi() {
    ipcMain.handle(
        channels.session.get,
        async (
            _,
            { page, limit, filters, order, fixCategory, categoryDesc, loadAll },
        ) => {
            return await sessionHandlers.get({
                page,
                limit,
                order,
                fixCategory,
                categoryDesc,
                filters,
                loadAll,
            });
        },
    );

    ipcMain.handle(channels.session.destroy, async (_, id) => {
        return await sessionHandlers.destroy(id);
    });

    ipcMain.handle(channels.session.plot, async (_, filters) => {
        return await sessionHandlers.plot(filters);
    });

    ipcMain.handle(channels.session.update, async (_, id, payload) => {
        return await sessionHandlers.update(id, payload);
    });

    ipcMain.handle(
        channels.session.exportCSV,
        async (_, destination, filters, options) => {
            return await sessionHandlers.exportCSV(
                destination,
                filters,
                options,
            );
        },
    );

    ipcMain.handle(channels.session.pickSaveCsvFile, async (event) => {
        return await sessionHandlers.pickSaveCsvFile(event.sender);
    });
}

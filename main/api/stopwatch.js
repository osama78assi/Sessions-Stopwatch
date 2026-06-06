import { ipcMain } from "electron";
import channels from "../config/channels.js";
import stopwatchHandlers from "../handlers/stopwatch.js";

export default function initStopwatchApi() {
    ipcMain.handle(channels.stopwatch.create, async (_, payload) => {
        return await stopwatchHandlers.create(payload);
    });

    ipcMain.handle(channels.stopwatch.update, async (_, id, payload) => {
        return await stopwatchHandlers.update(id, payload);
    });

    ipcMain.handle(channels.stopwatch.destroy, async (_, id) => {
        return await stopwatchHandlers.destroy(id);
    });
}

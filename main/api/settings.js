import { ipcMain } from "electron";
import channels from "../config/channels.js";
import settingsHandlers from "../handlers/settings.js";

export default function initSettingsApi() {
    ipcMain.handle(channels.settings.pickSaveDbFile, async (event) => {
        return await settingsHandlers.pickSaveDbFile(event.sender);
    });

    ipcMain.handle(channels.settings.pickFile, async (event) => {
        return await settingsHandlers.pickFile(event.sender);
    });

    ipcMain.handle(channels.settings.exportBackup, async (_, destination) => {
        return await settingsHandlers.exportBackup(destination);
    });

    ipcMain.handle(channels.settings.restoreBackup, async (_, filePath) => {
        return await settingsHandlers.restoreBackup(filePath);
    });
}

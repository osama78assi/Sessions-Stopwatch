import { errorHandler } from "../util/applicationError.js";
import settingsServices from "../services/settings.js";
import { BrowserWindow, dialog } from "electron";

class SettingsHandlers {
    async pickSaveDbFile(sender) {
        try {
            const win = BrowserWindow.fromWebContents(sender);
            const result = await dialog.showSaveDialog(win, {
                title: "Save Backup",
                defaultPath: "Stopwatch-backup.db",
                buttonLabel: "Save",
                filters: [{ name: "Database", extensions: ["db"] }],
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

    async pickFile(sender) {
        const win = BrowserWindow.fromWebContents(sender);
        const result = await dialog.showOpenDialog(win, {
            properties: ["openFile"],
            filters: [
                {
                    name: "SQLite Database",
                    extensions: ["db", "sqlite", "sqlite3"],
                },
            ],
        });

        if (!result.canceled) {
            return {
                success: true,
                data: result.filePaths[0],
            };
        }

        return {
            success: true,
            data: null,
        };
    }

    async exportBackup(destination) {
        try {
            await settingsServices.backup(destination);

            return {
                success: true,
                message: "Backup exported successfully",
            };
        } catch (err) {
            return errorHandler(err);
        }
    }

    async restoreBackup(backupPath) {
        try {
            const success = await settingsServices.restoreBackup(backupPath);

            return {
                success,
                message: "Database restored successfully",
            };
        } catch (err) {
            return errorHandler(err);
        }
    }
}

export default new SettingsHandlers();

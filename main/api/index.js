import { BrowserWindow, ipcMain } from "electron";
import initStopwatchApi from "./stopwatch.js";
import initSessionApi from "./session.js";
import initSettingsApi from "./settings.js";
import channels from "../config/channels.js";

// Using custom frame so this provide the basics functions
function initWindowApi() {
    ipcMain.handle(channels.window.minimize, (event) => {
        // Even is auto sent. webcontent reprsenet the renderer process (window)
        // So we are getting the window from this process that send to us
        const win = BrowserWindow.fromWebContents(event.sender);
        win.minimize();
    });

    ipcMain.handle(channels.window.toggleMaximize, (event) => {
        const window = BrowserWindow.fromWebContents(event.sender);
        if (window.isMaximized()) {
            window.unmaximize();
        } else {
            window.maximize();
        }
    });

    ipcMain.handle(channels.window.close, (event) => {
        const window = BrowserWindow.fromWebContents(event.sender);
        window.close();
    });

    ipcMain.handle(channels.window.maximized, (event) => {
        const window = BrowserWindow.fromWebContents(event.sender);

        return window.isMaximized();
    });
}

export default function registerIpcHandlers() {
    initStopwatchApi();
    initSessionApi();
    initSettingsApi();
    initWindowApi();
}

import { app, BrowserWindow, dialog, nativeTheme } from "electron";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import getSequelize, { connectDB } from "./config/sequelize.js";
import { ipcMain } from "electron/main";
import channels from "./config/channels.js";
import { __dir } from "./util/main.js";
import registerIpcHandlers from "./api/index.js";
import { testScript } from "./util/testScript.js";
import {
    disableShortcuts,
    initFirstRun,
    isFirstRun,
    runMigrations,
} from "./config/main.js";

// Global variables
const __dirname = dirname(fileURLToPath(import.meta.url));

function createWindow() {
    const window = new BrowserWindow({
        width: 800,
        height: 800,
        minHeight: 600,
        minWidth: 600,
        icon: join(__dir(import.meta.url), "/assets/logo.ico"),
        webPreferences: {
            preload: join(__dirname, "./preload.js"),
        },
        frame: false,
    });
    const isDev = !app.isPackaged;

    if (isDev) {
        window.loadURL("http://localhost:5173");
    } else {
        window.loadFile(path.join(__dirname, "../dist/index.html"));
    }

    return window;
}

async function main(params) {
    const isDev = !app.isPackaged;
    // Wait the app to be ready
    await app.whenReady();

    // Expose all events object to be able to listen in the renderer
    ipcMain.handle("get-channels", async () => {
        return channels;
    });

    // Connect to database
    await connectDB();

    // Only in the first run
    if (!isDev && isFirstRun()) {
        initFirstRun();
    }

    await runMigrations(getSequelize());

    // In developement add test data
    // if (!app.isPackaged) await testScript();

    // Register all handlers
    registerIpcHandlers();

    // Create the window
    const window = createWindow();

    disableShortcuts(window);

    // Close the window on windows and linux
    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") app.quit();
    });

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
}

main();

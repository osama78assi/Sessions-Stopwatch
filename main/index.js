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
    log,
} from "./config/main.js";

// Global variables
const __dirname = dirname(fileURLToPath(import.meta.url));

function createWindow() {
    const window = new BrowserWindow({
        width: 700,
        height: 700,
        minHeight: 700,
        minWidth: 700,
        icon: join(__dir(import.meta.url), "/assets/logo.ico"),
        webPreferences: {
            preload: join(__dirname, "./preload.js"),
        },
        frame: false,
    });
    const isDev = !app.isPackaged;

    log("[CW2] isDev =", isDev);
    log("[CW3] __dirname =", __dirname);

    if (isDev) {
        log("[CW4] Loading dev URL");
        window.loadURL("http://localhost:5173");
    } else {
        let htmlPath = join(__dirname, "dist/index.html");
        log("[CW4] Loading file:", htmlPath);
        window.loadFile(htmlPath);
    }

    window.on("ready-to-show", () => {
        log("[CW5] Window ready to show");
    });

    window.on("closed", () => {
        log("[CW6] Window closed");
    });

    return window;
}

async function main(params) {
    const isDev = !app.isPackaged;

    // Wait the app to be ready
    await app.whenReady();
    log("[2] App is ready");

    // Expose all events object to be able to listen in the renderer
    log("[3] Registering channels...");
    ipcMain.handle("get-channels", async () => {
        return channels;
    });
    log("[3] Channels registered");

    // Connect to database
    log("[4] Connecting to database...");
    await connectDB();
    log("[4] Database connected");

    // Only in the first run
    if (!isDev && isFirstRun()) {
        log("[5] First run detected");
        initFirstRun();
        log("[5] First run initialization completed");
    }

    log("[6] Running migrations...");
    await runMigrations(getSequelize());
    log("[6] Migrations completed");

    // In developement add test data
    // if (!app.isPackaged) await testScript();

    // Register all handlers
    log("[7] Registering IPC handlers...");
    registerIpcHandlers();
    log("[7] IPC handlers registered");

    // Create the window
    log("[8] Creating window...");
    const window = createWindow();
    log("[8] Window created");

    log("[9] Disabling shortcuts...");
    disableShortcuts(window);
    log("[9] Shortcuts disabled");

    // Close the window on windows and linux
    app.on("window-all-closed", () => {
        log("[10] All windows closed");

        if (process.platform !== "darwin") {
            log("[10] Quitting application");
            app.quit();
        }
    });

    app.on("activate", () => {
        log("[11] Activate event");

        if (BrowserWindow.getAllWindows().length === 0) {
            log("[11] Recreating window");
            createWindow();
        }
    });

    log("[12] Startup completed");
}

main().catch((err) => {
    log("FATAL ERROR:");
    log(err);
    log(err?.stack);
});

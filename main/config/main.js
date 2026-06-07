import { app } from "electron";
import {
    appendFileSync,
    existsSync,
    mkdir,
    mkdirSync,
    readFileSync,
    readdirSync,
    writeFile,
    writeFileSync,
} from "fs";
import { readFile } from "fs/promises";
import { dirname, join } from "path";
import { cwd } from "process";
import { fileURLToPath, pathToFileURL } from "url";

// Check database file if exists or not and create it
export function getDatabasePath() {
    const isDev = !app.isPackaged;
    if (isDev) {
        return join(cwd(), "stopwatch.db");
    }

    return join(app.getPath("userData"), "stopwatch/stopwatch.db");
}

// Responsible of creating the documents and metadata
export function initFirstRun() {
    const baseDir = join(app.getPath("userData"), "stopwatch");
    const metadataPath = join(baseDir, "metadata.json");

    if (!existsSync(baseDir)) {
        mkdirSync(baseDir);
    }

    if (!existsSync(metadataPath)) {
        writeFileSync(
            metadataPath,
            JSON.stringify({
                initialized: true,
                firstRunAt: Date.now(),
            }),
        );
    }
}

// Migrate database
export async function runMigrations(sequelize) {
    const queryInterface = sequelize.getQueryInterface();

    // 1. Ensure migrations table exists
    await sequelize.query(`
        CREATE TABLE IF NOT EXISTS migrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE,
            applied_at INTEGER NOT NULL
        );
    `);

    // 2. Get applied migrations
    const [rows] = await sequelize.query("SELECT name FROM migrations");

    const applied = new Set(rows.map((r) => r.name));

    // 3. Load migration files
    const dir = join(dirname(fileURLToPath(import.meta.url)), "../migrations");

    const files = readdirSync(dir)
        .filter((f) => f.endsWith(".js"))
        .sort();

    // 4. Run pending migrations
    for (const file of files) {
        if (applied.has(file)) continue;

        const migration = await import(pathToFileURL(join(dir, file)));

        await migration.up(sequelize, queryInterface);

        await sequelize.query(
            "INSERT INTO migrations (name, applied_at) VALUES (?, ?)",
            {
                replacements: [file, Date.now()],
            },
        );
    }
}

// Fast scan to check if this is the first run or not
export function isFirstRun() {
    const metadataPath = join(
        app.getPath("userData"),
        "stopwatch/metadata.json",
    );

    if (!existsSync(metadataPath)) return true;

    const metadata = JSON.parse(readFileSync(metadataPath, "utf-8"));
    return !metadata.initialized;
}

export function disableShortcuts(mainWindow) {
    const isDev = !app.isPackaged;

    // Don't prevent them in the development
    if (isDev) {
        return;
    }

    // Remove the default Electron menu containing default shortcuts
    mainWindow.removeMenu();

    // Capture and block keyboard commands natively
    mainWindow.webContents.on("before-input-event", (event, input) => {
        const isMac = process.platform === "darwin";
        const controlOrCommand = isMac ? input.meta : input.control;

        // 1. Block DevTools, Reload, and Zoom shortcuts
        if (
            controlOrCommand &&
            ["r", "i", "j", "c", "+", "-", "0"].includes(
                input.key.toLowerCase(),
            )
        ) {
            event.preventDefault();
        }

        // 2. Block F5 and F12 keys (Windows/Linux)
        if (input.key === "F5" || input.key === "F12") {
            event.preventDefault();
        }

        // 3. Block Alt-arrow history navigation
        if (
            input.alt &&
            (input.key === "ArrowLeft" || input.key === "ArrowRight")
        ) {
            event.preventDefault();
        }
    });
}

export function log(...messages) {
    // In development log to the console
    if (!app.isPackaged) {
        console.log("\n#############\n", ...message, "\n#############\n");
        return;
    }

    if (!existsSync(join(app.getPath("userData"), "stopwatch"))) {
        mkdirSync(join(app.getPath("userData"), "stopwatch"));
    }

    let all = messages
        .map((message) => `${new Date().toISOString()} ${message}\n`)
        .join("");

    appendFileSync(
        join(app.getPath("userData"), "stopwatch/sessions-stopwatch-logs.txt"),
        all,
    );
}

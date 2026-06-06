// This is the global events in Stopwatch
const channels = {
    stopwatch: {
        create: "stopwatch:create",
        update: "stopwatch:update",
        destroy: "stopwatch:destroy",
    },

    settings: {
        pickSaveDbFile: "settings:pickSaveDbFile",
        pickFile: "settings:pickFile",
        exportBackup: "settings:exportBackup",
        restoreBackup: "settings:restoreBackup",
    },

    session: {
        get: "session:get",
        plot: "session:plot",
        update: "session:update",
        pickSaveCsvFile: "session:pickSaveCsvFile",
        exportCSV: "session:exportCSV",
        destroy: "session:destroy",
    },

    window: {
        toggleMaximize: "window:toggle-maximize",
        minimize: "window:minimize",
        close: "window:close",
        maximized: "window:maximized",
    },
};

export default channels;

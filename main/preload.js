const { contextBridge, ipcRenderer } = require("electron");

(async function () {
    const channels = await ipcRenderer.invoke("get-channels");

    contextBridge.exposeInMainWorld("windowApi", {
        minimize: function () {
            return ipcRenderer.invoke(channels.window.minimize);
        },

        toggleMaximize: function () {
            return ipcRenderer.invoke(channels.window.toggleMaximize);
        },

        close: function () {
            return ipcRenderer.invoke(channels.window.close);
        },

        isMaximized: function () {
            return ipcRenderer.invoke(channels.window.maximized);
        },
    });

    contextBridge.exposeInMainWorld("stopwatchApi", {
        create: function (payload) {
            return ipcRenderer.invoke(channels.stopwatch.create, payload);
        },

        update: function (id, payload) {
            return ipcRenderer.invoke(channels.stopwatch.update, id, payload);
        },

        destroy: function (id) {
            return ipcRenderer.invoke(channels.stopwatch.destroy, id);
        },
    });

    contextBridge.exposeInMainWorld("sessionApi", {
        get: function ({
            page,
            limit,
            filters,
            order,
            fixCategory,
            categoryDesc,
            loadAll,
        }) {
            return ipcRenderer.invoke(channels.session.get, {
                page,
                limit,
                fixCategory,
                categoryDesc,
                filters,
                loadAll,
                order,
            });
        },

        exportCSV: function (destination, filters, options) {
            return ipcRenderer.invoke(
                channels.session.exportCSV,
                destination,
                filters,
                options,
            );
        },

        destroy: function (sessionId) {
            return ipcRenderer.invoke(channels.session.destroy, sessionId);
        },

        pickSaveCsvFile: () =>
            ipcRenderer.invoke(channels.session.pickSaveCsvFile),

        plot: function (filters) {
            return ipcRenderer.invoke(channels.session.plot, filters);
        },
    });

    contextBridge.exposeInMainWorld("settings", {
        pickSaveDbFile: () =>
            ipcRenderer.invoke(channels.settings.pickSaveDbFile),
        pickFile: () => ipcRenderer.invoke(channels.settings.pickFile),
        exportBackup: (destination) =>
            ipcRenderer.invoke(channels.settings.exportBackup, destination),
        restoreBackup: (backupPath) =>
            ipcRenderer.invoke(channels.settings.restoreBackup, backupPath),
    });
})();

export async function pickSaveDbFile() {
    const res = await window.settings.pickSaveDbFile();
    if (!res.success) {
        throw new Error(res.message);
    }

    return res.data;
}

export async function pickFile() {
    const res = await window.settings.pickFile();
    if (!res.success) {
        throw new Error(res.message);
    }

    return res.data;
}

export async function exportBackup(destination) {
    const res = await window.settings.exportBackup(destination);

    if (!res.success) {
        throw new Error(res.message);
    }

    return res.message;
}

export async function restoreBackup(destination) {
    const res = await window.settings.restoreBackup(destination);

    if (!res.success) {
        throw new Error(res.message);
    }

    return res.message;
}

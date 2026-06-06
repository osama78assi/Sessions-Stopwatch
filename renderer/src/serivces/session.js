export async function getSessions({
    page,
    limit,
    order,
    filters,
    fixCategory,
    categoryDesc,
    loadAll,
}) {
    try {
        return await window.sessionApi.get({
            page,
            limit,
            order,
            fixCategory,
            categoryDesc,
            filters,
            loadAll,
        });
    } catch (err) {
        console.log(err);
    }
}

export async function destroySession(sessionId) {
    try {
        return await window.sessionApi.destroy(sessionId);
    } catch (err) {
        console.log(err);
    }
}

export async function updateSession(id, payload) {
    try {
        return await window.sessionApi.update(id, payload);
    } catch (err) {
        console.log(err);
    }
}

export async function plotSessions(filters) {
    try {
        return await window.sessionApi.plot(filters);
    } catch (err) {
        console.log(err);
    }
}

export async function pickSaveCsvFile() {
    const res = await window.sessionApi.pickSaveCsvFile();
    if (!res.success) {
        throw new Error(res.message);
    }

    return res.data;
}

export async function exportSessionsCSV(destination, filters, options) {
    try {
        return await window.sessionApi.exportCSV(destination, filters, options);
    } catch (err) {
        console.log(err);
    }
}

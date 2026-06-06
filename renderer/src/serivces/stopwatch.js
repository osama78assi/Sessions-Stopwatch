export async function createStopwatch(payload) {
    try {
        return await window.stopwatchApi.create(payload);
    } catch (err) {
        console.log(err);
    }
}

export async function updateStopwatch(id, payload) {
    try {
        return await window.stopwatchApi.update(id, payload);
    } catch (err) {
        console.log(err);
    }
}

export async function destroyStopwatch(id) {
    try {
        return await window.stopwatchApi.destroy(id);
    } catch (err) {
        console.log(err);
    }
}

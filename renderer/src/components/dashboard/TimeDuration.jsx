export default function TimeDuration({ duration }) {
    function evaluate() {
        // Evaluate, hours, minutes, seconds, milleseconds
        let ms = Math.trunc(duration % 1000);
        let s = Math.trunc(duration / 1000) % 60;
        let m = Math.trunc(duration / 1000 / 60) % 60;
        let h = Math.trunc(duration / 1000 / 60 / 60) % 24;
        let d = Math.trunc(duration / 1000 / 60 / 60 / 24);

        const portions = [];

        if (d) {
            portions.push(`${d} Day${d > 2 ? "s" : ""}`);
        }
        if (h) {
            portions.push(`${h} Hour${h > 2 ? "s" : ""}`);
        }
        if (m) {
            portions.push(`${m} Minute${m > 2 ? "s" : ""}`);
        }
        if (s) {
            portions.push(`${s} Second${s > 2 ? "s" : ""}`);
        }
        if (d === 0 && h === 0 && m === 0 && s === 0) {
            portions.push(`${ms} Millisecond${ms > 2 ? "s" : ""}`);
        }

        return portions.join(", ");
    }

    return <span>{evaluate()}</span>;
}

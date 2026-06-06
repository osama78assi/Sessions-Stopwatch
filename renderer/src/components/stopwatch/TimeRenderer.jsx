export default function TimeRenderer({ time, size = "md" }) {
    // Evaluate, hours, minutes, seconds, milleseconds
    let ms = Math.trunc((time % 1000) / 10);
    let s = Math.trunc(time / 1000) % 60;
    let m = Math.trunc(time / 1000 / 60) % 60;
    let h = Math.trunc(time / 1000 / 60 / 60) % 24;
    let d = Math.trunc(time / 1000 / 60 / 60 / 24);

    return (
        <p
            className={`w-fit mx-auto mt-14 ${size === "lg" ? "text-4xl lg:text-6xl" : "text-2xl"} font-DSEG7`}
        >
            {d > 0 ? (
                <span className="me-3">
                    <span>1</span>
                    <sub
                        className={` ${size === "lg" ? "text-2xl lg:text-3xl" : "text-md"}`}
                    >
                        day
                    </sub>{" "}
                </span>
            ) : null}
            {h <= 9 ? <span>0{h}</span> : <span>{h}</span>}:
            {m <= 9 ? <span>0{m}</span> : <span>{m}</span>}:
            {s <= 9 ? <span>0{s}</span> : <span>{s}</span>}{" "}
            <sub className={` ${size === "lg" ? "text-2xl lg:text-3xl" : "text-md"}`}>
                {ms <= 9 ? 0 : null}
                {ms}
            </sub>
        </p>
    );
}

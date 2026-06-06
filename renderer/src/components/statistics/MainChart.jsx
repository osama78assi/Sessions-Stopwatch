import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import TimeDuration from "../dashboard/TimeDuration";

function fmtDay(day) {
    const d = new Date(day + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="chart-tooltip">
            <p className="chart-tooltip-title">{label}</p>
            <p className="chart-tooltip-value">
                <TimeDuration duration={payload[0].payload.totalTimeSpent} />
            </p>
        </div>
    );
}

function yTickFormatter(ms) {
    const m = Math.floor(ms / 60000);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);
    if (d > 0) return `${d}d`;
    if (h > 0) return `${h}h`;
    return `${m}m`;
}

export default function MainCharts({ data = [] }) {
    const chartData = data.map((d) => ({
        ...d,
        label: fmtDay(d.day),
    }));

    return (
        <div className="chart-card">
            <p className="chart-card-title">Daily time spent</p>
            <div className="line-wrapper">
                <ResponsiveContainer width="100%" height={260}>
                    <LineChart
                        data={chartData}
                        margin={{ top: 10, right: 16, left: -10, bottom: 0 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="var(--main-divider-color)"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="label"
                            tick={{ fontSize: 12, fill: "var(--thirdary-text-color)" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 12, fill: "var(--thirdary-text-color)" }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={yTickFormatter}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="totalTimeSpent"
                            stroke="var(--main-interactive-color-v1)"
                            strokeWidth={2}
                            dot={{
                                r: 4,
                                fill: "var(--main-interactive-color-v1)",
                                stroke: "var(--secondary-color)",
                                strokeWidth: 2,
                            }}
                            activeDot={{
                                r: 6,
                                fill: "var(--main-interactive-color-v1)",
                                stroke: "var(--secondary-color)",
                                strokeWidth: 2,
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
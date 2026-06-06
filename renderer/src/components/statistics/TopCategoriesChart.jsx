import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import TimeDuration from "../dashboard/TimeDuration";

const CHART_COLORS = [
    "var(--chart-color-1)",
    "var(--chart-color-2)",
    "var(--chart-color-3)",
    "var(--chart-color-4)",
    "var(--chart-color-5)",
];

function CustomTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    const total = payload[0].payload._total;
    const pct = Math.round((d.totalTimeSpent / total) * 100);
    return (
        <div className="chart-tooltip">
            <p className="chart-tooltip-title">{d.category}</p>
            <p className="chart-tooltip-value">
                <TimeDuration duration={d.totalTimeSpent} /> · {pct}%
            </p>
        </div>
    );
}

export default function TopCategoriesChart({ data = [] }) {
    const total = data?.reduce((a, d) => a + d.totalTimeSpent, 0);
    const enriched = data?.map((d) => ({ ...d, _total: total }));

    return (
        <div className="chart-card">
            <p className="chart-card-title">
                Top 5 categories based on time spending
            </p>
            <div className="top-categories-inner">
                <div className="pie-wrapper">
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={enriched}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={90}
                                paddingAngle={enriched.length > 1 ? 3 : 0}
                                dataKey="totalTimeSpent"
                                stroke="none"
                            >
                                {enriched.map((_, i) => (
                                    <Cell
                                        key={i}
                                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="pie-legend">
                    {enriched.map((d, i) => {
                        const pct = Math.round((d.totalTimeSpent / total) * 100);
                        return (
                            <div key={i} className="pie-legend-item">
                                <span
                                    className="pie-legend-swatch"
                                    style={{
                                        background: CHART_COLORS[i % CHART_COLORS.length],
                                    }}
                                />
                                <span className="pie-legend-label">{d.category}</span>
                                <span className="pie-legend-pct">{pct}%</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
import { Table } from "antd";
import { useEffect, useState, useMemo } from "react";
import { destroySession, getSessions } from "../../serivces/session";
import ActionButton from "./ActionButton";
import TimeDuration from "./TimeDuration";
import { formatDate, throttle } from "../../util/util";
import { v4 } from "uuid";

const throttledGetSessions = throttle(getSessions);

const PAGE_SIZE = 100;

function SessionTable({
    filters,
    fixCategory,
    categoryDesc,
    fixStopwatch,
    stopwatchDesc,
}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [order, setOrder] = useState(null);

    async function fetchData() {
        setLoading(true);
        const id = v4();

        let orderStatement = [];

        if (fixStopwatch) {
            orderStatement.push([
                "stopwatchId",
                stopwatchDesc ? "DESC" : "ASC",
            ]);
        }

        if (order) {
            orderStatement.push(order);
        }

        const res = await throttledGetSessions(id, {
            page,
            limit: PAGE_SIZE,
            ...(filters && Object.keys(filters).length > 0 ? { filters } : {}),
            ...(orderStatement?.length > 0 ? { order: orderStatement } : {}),
            fixCategory,
            categoryDesc,
            loadAll: false,
        });

        if (res === null) {
            return;
        }

        setData(res?.data || []);
        setTotal(res?.pagination?.count || 0);
        setLoading(false);
    }

    useEffect(() => {
        setPage(1);
    }, [filters]);

    useEffect(() => {
        fetchData();
    }, [page, filters, order, fixCategory, categoryDesc]);

    const columns = useMemo(
        () => [
            {
                title: "ID",
                dataIndex: "id",
                sorter: true,
                width: 120,
            },
            {
                title: "Duration",
                dataIndex: "duration",
                render: (duration) => <TimeDuration duration={duration} />,
                sorter: true,
                width: 150,
            },
            {
                title: "Longest Set",
                dataIndex: "longestSet",
                render: (longestSet) => <TimeDuration duration={longestSet} />,
                sorter: true,
                width: 200,
            },
            {
                title: "Stops",
                dataIndex: "stopCounts",
                sorter: true,
                width: 120,
            },
            {
                title: "Stopwatch Id",
                dataIndex: ["stopwatchId"],
                width: 120,
            },
            {
                title: "Stopwatch Category",
                dataIndex: ["stopwatch", "category"],
                width: 220,
            },
            {
                title: "Description",
                dataIndex: "description",
                key: "description",
                width: 220,
                render: (text) =>
                    text ? (
                        <div
                            title={text}
                            className="max-w-[200px] overflow-hidden whitespace-normal break-words leading-[1.4em] line-clamp-3"
                        >
                            {text}
                        </div>
                    ) : (
                        <span className="text-(--thirdary-text-color)">—</span>
                    ),
            },
            {
                title: "First Start Time",
                dataIndex: "createdAt",
                width: 190,
                sorter: true,
                render: (v) => formatDate(v),
            },
            {
                title: "Finish Time",
                dataIndex: "finishedAt",
                width: 190,
                sorter: true,
                render: (v) => formatDate(v),
            },
            {
                title: "Actions",
                key: "actions",
                width: 100,
                render: (_, record) => (
                    <ActionButton
                        record={record}
                        onDelete={fetchData}
                        onUpdated={fetchData}
                    />
                ),
            },
        ],
        [fixCategory, categoryDesc],
    );

    return (
        <div className="h-[63%]!">
            <div className="session-table-container w-full overflow-auto">
                <Table
                    className="session-table"
                    rowKey="id"
                    // sticky={true}
                    scroll={{ x: 1300, y: "calc(60vh - 120px)" }} // ← add y here
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    pagination={{
                        current: page,
                        pageSize: PAGE_SIZE,
                        total,
                        showSizeChanger: false,
                        onChange: (p) => setPage(p),
                    }}
                    onChange={(_, __, sorter) => {
                        // When the order is set to default
                        if (!sorter || !sorter.field || !sorter.order) {
                            setOrder(null);
                            return;
                        }

                        // Otherwise save the field
                        setOrder([
                            sorter.field,
                            sorter.order === "ascend" ? "ASC" : "DESC",
                        ]);
                    }}
                />
            </div>
        </div>
    );
}

export default SessionTable;
